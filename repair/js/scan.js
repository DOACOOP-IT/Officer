/* ============================================================
   QR + SCAN LANDING
   ============================================================ */
function scanUrlFor(assetId){
  if (LIFF_ID) return 'https://liff.line.me/' + LIFF_ID + '?asset=' + encodeURIComponent(assetId);
  return (location.origin + location.pathname) + '?asset=' + encodeURIComponent(assetId);
}
function qrBox(assetId){
  var src = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&data=' + encodeURIComponent(scanUrlFor(assetId));
  return '<div style="width:140px;height:140px;padding:11px;background:#fff;border:1px solid var(--line);border-radius:16px;display:flex;align-items:center;justify-content:center"><img src="'+src+'" alt="QR '+esc(assetId)+'" style="width:100%;height:100%;object-fit:contain"></div>';
}

function routeScan(assetId){
  /* ตั้งหน้าเป็น "แจ้งซ่อม" ทันที (ไม่แวบ dashboard) แล้วค่อยโหลดข้อมูลอุปกรณ์ */
  S.scanAsset = assetId;
  S.scanAssetInfo = null;
  S.scanPhotos = [];
  S.desc = '';
  setState({ screen:'scan', scanLoading:true });
  if (hasBackend()){
    google.script.run
      .withSuccessHandler(handleScanResult)
      .withFailureHandler(function(){ setState({ scanLoading:false, screen:'dashboard' }); toastMsg('โหลดข้อมูลอุปกรณ์ไม่สำเร็จ'); })
      .getAssetEntry(assetId);
  } else {
    var mock   = MOCK_TICKETS.filter(function(t){ return (t.dev||'').indexOf(assetId) === 0; });
    var active = mock.filter(function(t){ return t.statusKey !== 'resolved'; })[0];
    handleScanResult({ ok:true, asset:{ id:assetId, name:(mock[0] ? mock[0].dev.split(' · ')[1] : assetId), location:(mock[0]?mock[0].place:'') }, activeTicket: active || null });
  }
}
function handleScanResult(res){
  S.scanLoading = false;
  try { sessionStorage.removeItem('scanAsset'); } catch (e){}
  if (!res || !res.ok){ toastMsg((res && res.error) || 'ไม่พบอุปกรณ์'); setState({ screen:'dashboard' }); return; }
  if (res.activeTicket){
    // มีงานที่ยังไม่ปิด → ไปหน้าสถานะของงานนั้น
    S.scanAssetInfo = res.asset;
    openTicket(res.activeTicket.id);
    return;
  }
  setState({ scanAssetInfo:res.asset, category:'', desc:'', scanPhotos:[], screen:'scan' });
}

function viewScanLanding(){
  if (S.scanLoading || !S.scanAssetInfo){
    return '<section style="animation:riseIn .4s var(--ease) both"><div style="max-width:560px;margin:40px auto 0"><div class="glass" style="padding:40px;text-align:center;color:var(--text-muted)">'
      + '<div style="font-size:1.8rem;margin-bottom:10px">📷</div>กำลังโหลดข้อมูลอุปกรณ์…</div></div></section>';
  }
  var a = S.scanAssetInfo || { id:S.scanAsset, name:'', brand:'', model:'', location:'' };
  var canSubmit = S.desc.trim().length > 0;
  var detail = function(label, val){
    if (!val) return '';
    return '<div style="display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid var(--line)"><span style="color:var(--text-muted);font-size:.84rem">'+esc(label)+'</span><span style="font-weight:var(--fw-semibold);font-size:.88rem;text-align:right">'+esc(val)+'</span></div>';
  };

  return '<section style="animation:riseIn .6s var(--ease) both"><div style="max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:14px">'
    + '<div class="glass" style="padding:18px 20px">'
    +   '<div style="display:flex;align-items:center;gap:13px;margin-bottom:12px">'
    +     '<div style="width:44px;height:44px;flex:0 0 auto;border-radius:12px;background:var(--grad-tint-pine);border:1px solid rgba(37,102,91,0.2);display:flex;align-items:center;justify-content:center;font-size:1.3rem">📷</div>'
    +     '<div style="flex:1;min-width:0"><div class="eyebrow" style="color:var(--accent-strong)">สแกน QR สำเร็จ</div>'
    +       '<div style="font-weight:var(--fw-bold);font-size:1.05rem;line-height:1.3">'+esc(a.name||a.id)+'</div></div>'
    +   '</div>'
    +   '<div style="display:flex;flex-direction:column">'
    +     detail('รหัสอุปกรณ์', a.id)
    +     detail('ยี่ห้อ', a.brand)
    +     detail('รุ่น', a.model)
    +     detail('สถานที่ติดตั้ง', a.location)
    +   '</div>'
    + '</div>'
    + '<div class="glass" style="padding:20px;display:flex;flex-direction:column;gap:14px">'
    +   '<div style="display:grid;gap:8px"><label class="label">รายละเอียดอาการที่พบ</label>'
    +     '<textarea class="field" rows="4" oninput="S.desc=this.value;refreshScanSubmit()" placeholder="อธิบายอาการที่พบ เช่น เปิดไม่ติด มีเสียงดัง จอไม่แสดงภาพ…">'+esc(S.desc)+'</textarea></div>'
    +   scanPhotoSection()
    +   '<button id="scan-submit" class="btn-primary" style="width:100%;font-size:1rem;padding:15px" '+(canSubmit?'':'disabled')+' onclick="submitScanReport()">ส่งคำขอแจ้งซ่อม</button>'
    +   '<div id="scan-hint" style="font-size:.82rem;color:var(--text-muted);text-align:center">'+(canSubmit?'พร้อมส่งข้อมูลแล้ว':'กรอกรายละเอียดอาการก่อนส่ง')+'</div>'
    + '</div></section>';
}

/* ส่วนแนบรูป + พรีวิว (สูงสุด 5) */
function scanPhotoSection(){
  var photos = S.scanPhotos || [];
  var thumbs = photos.map(function(p, i){
    return '<div style="position:relative;width:72px;height:72px;flex:0 0 auto;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--line)">'
      + '<img src="'+p.dataUrl+'" alt="รูป '+(i+1)+'" style="width:100%;height:100%;object-fit:cover">'
      + '<button onclick="removeScanPhoto('+i+')" style="position:absolute;top:2px;right:2px;width:20px;height:20px;border:0;border-radius:999px;background:rgba(30,43,40,0.7);color:#fff;cursor:pointer;font-size:.8rem;line-height:1;display:flex;align-items:center;justify-content:center">×</button>'
      + '</div>';
  }).join('');
  var addBtn = photos.length < 5
    ? '<label style="width:72px;height:72px;flex:0 0 auto;border:1px dashed rgba(37,102,91,0.4);background:var(--accent-soft);border-radius:var(--radius-md);cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:var(--accent-strong)">'
      + '<span style="font-size:1.4rem;line-height:1;font-weight:var(--fw-light)">+</span><span style="font-size:.68rem;font-weight:var(--fw-semibold)">เพิ่มรูป</span>'
      + '<input type="file" accept="image/*" multiple style="display:none" onchange="addScanPhotos(this.files)"></label>'
    : '';
  return '<div style="display:grid;gap:8px"><label class="label">แนบรูปภาพ ('+photos.length+'/5)</label>'
    + '<div style="display:flex;gap:10px;flex-wrap:wrap">'+thumbs+addBtn+'</div></div>';
}

function addScanPhotos(files){
  if (!files || !files.length) return;
  S.scanPhotos = S.scanPhotos || [];
  var room = 5 - S.scanPhotos.length;
  if (room <= 0){ toastMsg('แนบรูปได้สูงสุด 5 รูป'); return; }
  var arr = Array.prototype.slice.call(files).slice(0, room);
  var pending = arr.length;
  var done = function(){ pending--; if (pending <= 0) render(); };
  arr.forEach(function(f){
    if (!/^image\//.test(f.type)){ toastMsg('แนบได้เฉพาะรูปภาพ'); done(); return; }
    if (f.size > 8 * 1024 * 1024){ toastMsg('รูป "'+f.name+'" ใหญ่เกิน 8MB'); done(); return; }
    var rd = new FileReader();
    rd.onload  = function(e){ S.scanPhotos.push({ name:f.name, dataUrl:e.target.result }); done(); };
    rd.onerror = function(){ done(); };
    rd.readAsDataURL(f);
  });
}
function removeScanPhoto(i){ S.scanPhotos.splice(i, 1); render(); }

function refreshScanSubmit(){
  var can = S.desc.trim().length > 0;
  var btn = document.getElementById('scan-submit'), hint = document.getElementById('scan-hint');
  if (btn) btn.disabled = !can;
  if (hint) hint.textContent = can ? 'พร้อมส่งข้อมูลแล้ว' : 'กรอกรายละเอียดอาการก่อนส่ง';
}

/* แจ้งซ่อมจากการสแกน — ไม่ต้องเลือกประเภท (รู้จากอุปกรณ์ที่สแกนแล้ว) */
function submitScanReport(){
  if (!S.desc.trim()) return;
  var a = S.scanAssetInfo || {};
  var btn = document.getElementById('scan-submit');
  if (btn){ btn.disabled = true; btn.textContent = 'กำลังส่ง…'; }
  var payload = { category:'', desc:S.desc.trim(), asset_id:a.id, place:a.location||'',
                  requester_id:S.lineUserId, requester_name:S.displayName,
                  photos:(S.scanPhotos || []).map(function(p){ return { name:p.name, dataUrl:p.dataUrl }; }) };
  if (hasBackend()){
    google.script.run
      .withSuccessHandler(function(res){
        toastMsg('เปิดงานซ่อมแล้ว • หมายเลขงาน ' + (res && res.id ? res.id : ''));
        setState({ desc:'', scanPhotos:[], screen:(S.role==='staff'?'mytickets':'tickets') });
        refreshTickets();
      })
      .withFailureHandler(function(){ toastMsg('บันทึกงานซ่อมไม่สำเร็จ กรุณาลองใหม่'); render(); })
      .createTicket(payload);
  } else {
    toastMsg('เปิดงานซ่อมแล้ว (โหมดสาธิต)');
    setState({ desc:'', scanPhotos:[], screen:'mytickets' });
  }
}
