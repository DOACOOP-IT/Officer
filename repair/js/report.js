/* ============================================================
   REPORT FORM (มาตรฐาน)
   ============================================================ */
function viewReport(){
  var canSubmit = !!S.category && S.desc.trim().length > 0;
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

  var devOpts = '<option value="">— เลือกอุปกรณ์ —</option>' + (S.deviceRegistry||[]).map(function(d){
    return '<option value="'+esc(d.id)+'"'+(S.reportDevice===d.id?' selected':'')+'>'+esc(d.id)+' · '+esc(d.name)+'</option>'; }).join('');

  return '<section style="animation:riseIn .6s var(--ease) both"><div style="max-width:720px;margin:0 auto">'
  + '<div class="glass" style="padding:30px 32px;display:flex;flex-direction:column;gap:22px">'
  +   '<div style="display:grid;gap:8px"><label class="label">อุปกรณ์ที่แจ้งซ่อม</label>'
  +     '<select class="field" onchange="S.reportDevice=this.value">'+devOpts+'</select></div>'
  +   '<div style="display:grid;gap:10px"><label class="label">ประเภทงานที่ต้องการแจ้ง</label>'
  +     '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px">'+cards+'</div></div>'
  +   '<div style="display:grid;gap:8px"><label class="label">รายละเอียดปัญหา</label>'
  +     '<textarea class="field" rows="4" oninput="S.desc=this.value;refreshReportSubmit()" placeholder="อธิบายอาการที่พบ เช่น เปิดไม่ติด มีเสียงดัง จอไม่แสดงภาพ…">'+esc(S.desc)+'</textarea></div>'
  +   scanPhotoSection()
  +   '<div style="border-top:1px solid var(--line);padding-top:18px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">'
  +     '<span id="report-hint" style="font-size:.84rem;color:var(--text-muted)">'+(canSubmit?'พร้อมส่งข้อมูลแล้ว':'เลือกประเภทงานและกรอกรายละเอียดก่อนส่ง')+'</span>'
  +     '<button id="report-submit" class="btn-primary" style="font-size:1rem;padding:15px 30px" '+(canSubmit?'':'disabled')+' onclick="submitReport()">ส่งคำขอแจ้งซ่อม</button>'
  +   '</div>'
  + '</div></div></section>';
}

function pickCategory(k){ setState({ category:k }); }
function refreshReportSubmit(){
  var can = !!S.category && S.desc.trim().length > 0;
  var btn = document.getElementById('report-submit'), hint = document.getElementById('report-hint');
  if (btn) btn.disabled = !can;
  if (hint) hint.textContent = can ? 'พร้อมส่งข้อมูลแล้ว' : 'เลือกประเภทงานและกรอกรายละเอียดก่อนส่ง';
}
function addPhoto(){ setState({ attach: Math.min(S.attach + 1, 4) }); }
function clearQr(){ setState({ qrShow:false }); }
function submitReport(){
  if (!(S.desc.trim() && S.category)) return;
  var assetId = S.reportDevice || '';
  var a = (S.assets || []).filter(function(x){ return String(x.asset_id) === assetId; })[0];
  var place = a ? (a.location || '') : '';
  var payload = { category:S.category, desc:S.desc.trim(), asset_id:assetId, place:place,
                  requester_id:S.lineUserId, requester_name:S.displayName,
                  photos:(S.scanPhotos || []).map(function(p){ return { name:p.name, dataUrl:p.dataUrl }; }) };
  if (hasBackend()){
    google.script.run
      .withSuccessHandler(function(res){
        toastMsg('เปิดงานซ่อมแล้ว • หมายเลขงาน ' + (res && res.id ? res.id : '') + ' บันทึกลง Google Sheet แล้ว');
        setState({ category:'', desc:'', scanPhotos:[], reportDevice:'' });
        refreshTickets();
      })
      .withFailureHandler(function(){ toastMsg('บันทึกงานซ่อมไม่สำเร็จ กรุณาลองใหม่'); })
      .createTicket(payload);
  } else {
    toastMsg('เปิดงานซ่อมแล้ว • หมายเลขงาน JOB-2569-0143 (โหมดสาธิต)');
  }
}

/* Re-pull tickets after a write so lists stay in sync with the Sheet. */
function refreshTickets(){
  if (!hasBackend()) return;
  google.script.run.withSuccessHandler(function(data){
    S.ticketsRaw = (data && data.tickets) || S.ticketsRaw;
    S.loanRaw = (data && data.loans) || S.loanRaw;
    render();
  }).getBootData();
}

