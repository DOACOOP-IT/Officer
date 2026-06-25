/* ============================================================
   REPORT FORM (มาตรฐาน — เปิดจากลิงก์ ไม่ใช่สแกน)
   ============================================================ */
var DEV_TYPE = { NB:'โน้ตบุ๊ก', PC:'คอมพิวเตอร์', PR:'เครื่องพิมพ์', MN:'จอภาพ',
  SW:'อุปกรณ์เครือข่าย', FW:'อุปกรณ์เครือข่าย', AP:'อุปกรณ์เครือข่าย', UP:'UPS / สำรองไฟ' };
function deviceTypeOf(id){ return DEV_TYPE[String(id).split('-')[0]] || 'อื่นๆ'; }

function viewReport(){
  var deviceMode = S.category === 'device';
  var devSel = (S.assets || []).filter(function(a){ return String(a.asset_id) === S.reportDevice; })[0];
  var canSubmit = !!S.category && S.desc.trim().length > 0 && (!deviceMode || !!S.reportDevice);

  var cards = CATEGORIES.map(function(m){
    var on = S.category === m.key;
    var bg = on ? 'var(--grad-tint-pine)' : 'rgba(255,255,255,0.7)';
    var bd = on ? 'rgba(37,102,91,0.34)' : 'var(--border)';
    var sh = on ? '0 14px 28px rgba(29,44,39,0.10)' : 'var(--shadow-soft)';
    var tileBg = on ? 'var(--accent)' : 'var(--accent-soft)';
    var tileBd = on ? 'var(--accent)' : 'rgba(37,102,91,0.16)';
    var iconColor = on ? '#fff' : 'var(--accent-strong)';
    var titleColor = on ? 'var(--accent-strong)' : 'var(--ink-900)';
    var ringBorder = on ? 'var(--accent)' : 'var(--line-strong)';
    var ringBg = on ? 'var(--accent)' : 'transparent';
    return '<button onclick="pickCategory(\''+m.key+'\')" style="text-align:center;border:1.5px solid '+bd+';background:'+bg+';box-shadow:'+sh+';border-radius:var(--radius-lg);padding:20px 16px 18px;cursor:pointer;transition:var(--transition-base);display:flex;flex-direction:column;align-items:center;gap:12px;position:relative">'
      + '<span style="position:absolute;top:13px;right:13px;width:20px;height:20px;border-radius:999px;border:2px solid '+ringBorder+';background:'+ringBg+';display:flex;align-items:center;justify-content:center"><span style="width:7px;height:7px;border-radius:999px;background:#fff;opacity:'+(on?1:0)+'"></span></span>'
      + '<span style="width:56px;height:56px;flex:0 0 auto;border-radius:18px;background:'+tileBg+';border:1px solid '+tileBd+';display:flex;align-items:center;justify-content:center;color:'+iconColor+';transition:var(--transition-base)"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+m.icon+'</svg></span>'
      + '<span style="min-width:0"><span style="display:block;font-weight:var(--fw-bold);font-size:1rem;color:'+titleColor+'">'+esc(m.th)+'</span>'
      + '<span style="display:block;font-size:.68rem;letter-spacing:var(--tracking-eyebrow);text-transform:uppercase;color:var(--text-muted);font-weight:var(--fw-semibold);margin-top:2px">'+esc(m.en)+'</span>'
      + '<span style="display:block;font-size:.8rem;color:var(--text-muted);margin-top:7px;line-height:1.4">'+esc(m.desc)+'</span></span></button>';
  }).join('');

  /* ส่วนเลือกอุปกรณ์ — แสดงเมื่อเลือกประเภท "อุปกรณ์" */
  var deviceBlock = '';
  if (deviceMode){
    var inner = devSel
      ? '<div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:var(--radius-md);background:var(--accent-soft);border:1px solid rgba(37,102,91,0.2)">'
        + '<span style="font-size:1.3rem">🖥️</span>'
        + '<div style="flex:1;min-width:0"><div style="font-weight:var(--fw-bold);color:var(--accent-strong)">'+esc(devSel.asset_id)+'</div><div style="font-size:.84rem;color:var(--text-muted)">'+esc(devSel.name)+'</div></div>'
        + '<button class="btn-ghost" style="padding:8px 14px;font-size:.82rem" onclick="openDevModal()">เปลี่ยน</button></div>'
      : '<button class="btn-primary" style="width:100%;padding:14px;font-size:.96rem" onclick="openDevModal()">+ เลือกอุปกรณ์</button>';
    deviceBlock = '<div style="display:grid;gap:8px"><label class="label">อุปกรณ์ที่แจ้งซ่อม</label>'+inner+'</div>';
  }

  return '<section style="animation:riseIn .6s var(--ease) both"><div style="max-width:720px;margin:0 auto">'
  + '<div class="glass" style="padding:30px 32px;display:flex;flex-direction:column;gap:22px">'
  +   '<div style="display:grid;gap:10px"><label class="label">ประเภทงานที่ต้องการแจ้ง</label>'
  +     '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px">'+cards+'</div></div>'
  +   deviceBlock
  +   '<div style="display:grid;gap:8px"><label class="label">รายละเอียดปัญหา</label>'
  +     '<textarea class="field" rows="4" oninput="S.desc=this.value;refreshReportSubmit()" placeholder="อธิบายอาการที่พบ เช่น เปิดไม่ติด มีเสียงดัง จอไม่แสดงภาพ…">'+esc(S.desc)+'</textarea></div>'
  +   scanPhotoSection()
  +   '<div style="border-top:1px solid var(--line);padding-top:18px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">'
  +     '<span id="report-hint" style="font-size:.84rem;color:var(--text-muted)">'+(canSubmit?'พร้อมส่งข้อมูลแล้ว':'เลือกประเภทงานและกรอกรายละเอียดก่อนส่ง')+'</span>'
  +     '<button id="report-submit" class="btn-primary" style="font-size:1rem;padding:15px 30px" '+(canSubmit?'':'disabled')+' onclick="submitReport()">ส่งคำขอแจ้งซ่อม</button>'
  +   '</div>'
  + '</div></div>'
  + viewReportDevModal()
  + '</section>';
}

/* ===== Modal เลือกอุปกรณ์ + สแกน QR ===== */
function viewReportDevModal(){
  if (!S.reportDevModal) return '';
  var assets = S.assets || [];
  var types = [];
  assets.forEach(function(a){ var ty = deviceTypeOf(a.asset_id); if (types.indexOf(ty) < 0) types.push(ty); });
  var typeOpts = '<option value="all">ทุกประเภท</option>' + types.map(function(ty){ return '<option value="'+esc(ty)+'"'+(S.reportDevType===ty?' selected':'')+'>'+esc(ty)+'</option>'; }).join('');
  var list = assets.filter(function(a){ return S.reportDevType === 'all' || deviceTypeOf(a.asset_id) === S.reportDevType; });
  var rows = list.length ? list.map(function(a){
    return '<div onclick="pickReportDevice(\''+esc(a.asset_id)+'\')" style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-bottom:1px solid var(--line);cursor:pointer">'
      + '<span style="width:34px;height:34px;flex:0 0 auto;border-radius:9px;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;font-size:1rem">🖥️</span>'
      + '<div style="min-width:0"><div style="font-weight:var(--fw-bold);color:var(--accent-strong);font-size:.88rem">'+esc(a.asset_id)+'</div><div style="font-size:.8rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(a.name)+'</div></div></div>';
  }).join('') : '<div style="padding:24px;text-align:center;color:var(--text-muted)">ไม่มีอุปกรณ์ในประเภทนี้</div>';

  return '<div onclick="if(event.target===this)closeDevModal()" style="position:fixed;inset:0;z-index:60;background:rgba(30,43,40,0.34);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:18px;animation:riseIn .24s var(--ease) both">'
    + '<div class="glass" style="width:100%;max-width:460px;max-height:84vh;display:flex;flex-direction:column;overflow:hidden">'
    + '<div style="padding:20px 22px;border-bottom:1px solid var(--line)"><div class="eyebrow">เลือกอุปกรณ์ที่แจ้งซ่อม</div>'
    +   '<button onclick="scanDeviceQR()" style="margin-top:12px;width:100%;border:0;border-radius:var(--radius-md);background:var(--grad-accent);color:#fff;font-weight:var(--fw-bold);font-size:1rem;padding:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:var(--shadow-accent)"><span style="font-size:1.2rem">📷</span>สแกน QR Code ที่อุปกรณ์</button></div>'
    + '<div style="padding:14px 22px 6px;display:flex;align-items:center;gap:10px"><span style="font-size:.82rem;color:var(--text-muted);white-space:nowrap">หรือเลือกจากรายการ</span><div style="flex:1;height:1px;background:var(--line)"></div>'
    +   '<select class="field" style="width:auto;padding:8px 12px;font-size:.84rem" onchange="setState({reportDevType:this.value})">'+typeOpts+'</select></div>'
    + '<div style="overflow-y:auto">'+rows+'</div>'
    + '<div style="padding:12px 22px;border-top:1px solid var(--line);text-align:right"><button class="btn-ghost" style="padding:9px 20px;font-size:.88rem" onclick="closeDevModal()">ปิด</button></div>'
    + '</div></div>';
}

function pickCategory(k){
  setState({ category:k });
  if (k === 'device' && !S.reportDevice) openDevModal();
}
function openDevModal(){ setState({ reportDevModal:true, reportDevType:'all' }); }
function closeDevModal(){ setState({ reportDevModal:false }); }
function pickReportDevice(id){ S.reportDevice = id; setState({ reportDevModal:false }); }

/* สแกน QR เปิดกล้อง (ผ่าน LIFF) */
function scanDeviceQR(){
  if (liffEnabled() && liff.scanCodeV2){
    liff.scanCodeV2()
      .then(function(res){ applyScannedDevice(extractAsset(res && res.value)); })
      .catch(function(){ toastMsg('สแกนไม่สำเร็จ หรือยกเลิกการสแกน'); });
  } else if (liffEnabled() && liff.scanCode){
    liff.scanCode()
      .then(function(res){ applyScannedDevice(extractAsset(res && res.value)); })
      .catch(function(){ toastMsg('สแกนไม่สำเร็จ หรือยกเลิกการสแกน'); });
  } else {
    toastMsg('การสแกน QR ใช้ได้เมื่อเปิดผ่านแอป LINE');
  }
}
function extractAsset(text){
  text = String(text || '').trim();
  if (!text) return '';
  try {
    if (text.indexOf('?') >= 0){
      var q = new URLSearchParams(text.split('?').slice(1).join('?'));
      if (q.get('asset')) return q.get('asset');
      var st = q.get('liff.state');
      if (st){ var i = new URLSearchParams(decodeURIComponent(st).replace(/^\?/,'')); if (i.get('asset')) return i.get('asset'); }
    }
  } catch (e){}
  var m = text.match(/[A-Za-z]{2,3}-\d{3,}/);
  return m ? m[0].toUpperCase() : '';
}
function applyScannedDevice(id){
  if (!id){ toastMsg('อ่านรหัสอุปกรณ์จาก QR ไม่สำเร็จ'); return; }
  var a = (S.assets || []).filter(function(x){ return String(x.asset_id) === id; })[0];
  if (!a){ toastMsg('ไม่พบอุปกรณ์ ' + id + ' ในระบบ'); return; }
  S.reportDevice = id;
  setState({ reportDevModal:false });
  toastMsg('เลือกอุปกรณ์ ' + id + ' แล้ว');
}

function refreshReportSubmit(){
  var deviceMode = S.category === 'device';
  var can = !!S.category && S.desc.trim().length > 0 && (!deviceMode || !!S.reportDevice);
  var btn = document.getElementById('report-submit'), hint = document.getElementById('report-hint');
  if (btn) btn.disabled = !can;
  if (hint) hint.textContent = can ? 'พร้อมส่งข้อมูลแล้ว' : (deviceMode && !S.reportDevice ? 'กรุณาเลือกอุปกรณ์' : 'เลือกประเภทงานและกรอกรายละเอียดก่อนส่ง');
}

function submitReport(){
  if (!(S.desc.trim() && S.category)) return;
  if (S.category === 'device' && !S.reportDevice){ toastMsg('กรุณาเลือกอุปกรณ์'); return; }
  var assetId = S.reportDevice || '';
  var a = (S.assets || []).filter(function(x){ return String(x.asset_id) === assetId; })[0];
  var place = a ? (a.location || '') : '';
  var payload = { category:S.category, desc:S.desc.trim(), asset_id:assetId, place:place,
                  requester_id:S.lineUserId, requester_name:S.displayName,
                  photos:(S.scanPhotos || []).map(function(p){ return { name:p.name, dataUrl:p.dataUrl }; }) };
  if (hasBackend()){
    google.script.run
      .withSuccessHandler(function(res){
        toastMsg('เปิดงานซ่อมแล้ว • หมายเลขงาน ' + (res && res.id ? res.id : ''));
        setState({ category:'', desc:'', scanPhotos:[], reportDevice:'', screen:(S.role==='staff'?'mytickets':'tickets') });
        refreshTickets();
      })
      .withFailureHandler(function(){ toastMsg('บันทึกงานซ่อมไม่สำเร็จ กรุณาลองใหม่'); })
      .createTicket(payload);
  } else {
    toastMsg('เปิดงานซ่อมแล้ว (โหมดสาธิต)');
    setState({ category:'', desc:'', scanPhotos:[], reportDevice:'' });
  }
}

/* Re-pull tickets after a write so lists stay in sync with the Sheet. */
function refreshTickets(){
  if (!hasBackend()) return;
  google.script.run.withSuccessHandler(function(data){
    S.ticketsRaw = (data && data.tickets) || S.ticketsRaw;
    S.loanRaw = (data && data.loans) || S.loanRaw;
    S.assets = (data && data.assets) || S.assets;
    render();
  }).getBootData();
}
