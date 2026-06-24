/* ============================================================
   DETAIL ACTIONS — ปุ่มดำเนินงาน (IT tech/admin เท่านั้น)
   ============================================================ */
function viewDetailActions(t){
  var isIT = (S.role === 'tech' || S.role === 'admin');
  if (!isIT) return '';
  var sk = t.statusKey;

  if (sk === 'resolved'){
    return '<div class="glass" style="padding:20px 22px">'
      + '<div class="eyebrow" style="margin-bottom:10px">สรุปการซ่อม</div>'
      + '<div style="display:flex;flex-direction:column;gap:8px;font-size:.88rem">'
      + '<div><span style="color:var(--text-muted)">วิธีแก้ไข: </span><span style="font-weight:var(--fw-semibold)">'+esc(t.solution||'—')+'</span></div>'
      + '<div><span style="color:var(--text-muted)">อะไหล่: </span><span style="font-weight:var(--fw-semibold)">'+esc(t.parts||'—')+'</span></div>'
      + '<div><span style="color:var(--text-muted)">เวลาทำงาน: </span><span style="font-weight:var(--fw-semibold)">'+esc(t.work_hours||'—')+' ชม.</span></div>'
      + '<div style="margin-top:6px;display:flex;align-items:center;gap:8px;color:var(--accent-strong);font-weight:var(--fw-bold)"><span style="width:8px;height:8px;border-radius:999px;background:var(--accent)"></span>ปิดงานแล้ว · '+esc(t.resolved_at)+'</div>'
      + '</div></div>';
  }

  var html = '<div class="glass" style="padding:22px 24px;display:flex;flex-direction:column;gap:12px"><div class="eyebrow">การดำเนินงาน</div>';

  if (sk === 'pending'){
    var techList = (S.techs && S.techs.length) ? S.techs : [S.displayName];
    if (techList.indexOf(S.displayName) < 0) techList = [S.displayName].concat(techList);
    var cur = S.assignTech || S.displayName;
    var opts = techList.map(function(n){ return '<option value="'+esc(n)+'"'+(cur===n?' selected':'')+'>'+esc(n)+(n===S.displayName?' (ฉัน)':'')+'</option>'; }).join('');
    html += '<label class="label">มอบหมายให้ช่าง</label>'
      + '<select class="field" style="padding:12px 14px;font-size:.9rem" onchange="S.assignTech=this.value">'+opts+'</select>'
      + '<button class="btn-primary" style="padding:14px;font-size:.96rem;width:100%" onclick="doAssignTicket(\''+esc(t.id)+'\')">✔ รับงาน / มอบหมาย</button>';
  }

  if (sk === 'inprogress'){
    html += '<div style="background:var(--warning-soft);border:1px solid rgba(179,132,44,0.22);border-radius:var(--radius-md);padding:10px 13px;font-size:.84rem;font-weight:var(--fw-semibold);color:var(--warning)">ซ่อมเองไม่ได้? ส่งต่อบริษัทภายนอก</div>'
      + '<input class="field" style="padding:12px 14px;font-size:.88rem" placeholder="ระบุชื่อบริษัท / รายละเอียด…" value="'+esc(S.resolveForm.vendorNote)+'" oninput="S.resolveForm.vendorNote=this.value">'
      + '<button style="border:1px solid var(--warning);background:var(--warning-soft);border-radius:999px;padding:12px;font-size:.9rem;font-weight:var(--fw-semibold);cursor:pointer;color:var(--warning);width:100%" onclick="doOutsourceTicket(\''+esc(t.id)+'\')">ส่งต่อบริษัท →</button>'
      + '<div style="border-top:1px solid var(--line);padding-top:12px;font-size:.82rem;color:var(--text-muted);font-weight:var(--fw-semibold)">หรือซ่อมเสร็จแล้ว — กรอกสรุปแล้วปิดงาน</div>';
  }

  if (sk === 'outsourced'){
    html += '<div style="background:var(--warning-soft);border:1px solid rgba(179,132,44,0.22);border-radius:var(--radius-md);padding:10px 13px;font-size:.84rem;font-weight:var(--fw-semibold);color:var(--warning)">บริษัทแก้ไขเสร็จแล้ว — กรอกสรุปแล้วปิดงาน</div>';
  }

  if (sk === 'inprogress' || sk === 'outsourced'){
    html += '<textarea class="field" rows="2" style="padding:12px 14px;font-size:.88rem;resize:none" placeholder="วิธีแก้ไข / สรุปผลการซ่อม…" oninput="S.resolveForm.solution=this.value">'+esc(S.resolveForm.solution)+'</textarea>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
      + '<input class="field" style="padding:12px 14px;font-size:.88rem" placeholder="อะไหล่ที่ใช้" value="'+esc(S.resolveForm.parts)+'" oninput="S.resolveForm.parts=this.value">'
      + '<input class="field" style="padding:12px 14px;font-size:.88rem" placeholder="เวลา (ชม.)" type="number" min="0" value="'+esc(S.resolveForm.hours)+'" oninput="S.resolveForm.hours=this.value">'
      + '</div>'
      + resolvePhotoSection()
      + '<button class="btn-primary" style="padding:14px;font-size:.96rem;width:100%" onclick="doResolveTicket(\''+esc(t.id)+'\',\''+sk+'\')">'
      + (sk === 'outsourced' ? '✔ ปิดงาน (บริษัทแก้ไขแล้ว)' : '✔ ปิดงาน (ซ่อมเสร็จ)')
      + '</button>';
  }

  html += '</div>';
  return html;
}

/* ===== รูปหลังซ่อม (แนบตอนปิดงาน) ===== */
function resolvePhotoSection(){
  var photos = S.resolvePhotos || [];
  var thumbs = photos.map(function(p, i){
    return '<div style="position:relative;width:64px;height:64px;flex:0 0 auto;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--line)">'
      + '<img src="'+p.dataUrl+'" style="width:100%;height:100%;object-fit:cover">'
      + '<button onclick="removeResolvePhoto('+i+')" style="position:absolute;top:1px;right:1px;width:18px;height:18px;border:0;border-radius:999px;background:rgba(30,43,40,0.7);color:#fff;cursor:pointer;font-size:.72rem;line-height:1">×</button></div>';
  }).join('');
  var addBtn = photos.length < 5
    ? '<label style="width:64px;height:64px;flex:0 0 auto;border:1px dashed rgba(37,102,91,0.4);background:var(--accent-soft);border-radius:var(--radius-md);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--accent-strong);font-size:1.3rem">+<input type="file" accept="image/*" multiple style="display:none" onchange="addResolvePhotos(this.files)"></label>'
    : '';
  return '<div style="display:grid;gap:6px"><label class="label" style="font-size:.82rem">รูปหลังซ่อม ('+photos.length+'/5)</label><div style="display:flex;gap:8px;flex-wrap:wrap">'+thumbs+addBtn+'</div></div>';
}
function addResolvePhotos(files){
  if (!files || !files.length) return;
  S.resolvePhotos = S.resolvePhotos || [];
  var room = 5 - S.resolvePhotos.length;
  if (room <= 0){ toastMsg('แนบรูปได้สูงสุด 5 รูป'); return; }
  var arr = Array.prototype.slice.call(files).slice(0, room);
  var pending = arr.length, done = function(){ pending--; if (pending<=0) render(); };
  arr.forEach(function(f){
    if (!/^image\//.test(f.type)){ toastMsg('แนบได้เฉพาะรูปภาพ'); done(); return; }
    if (f.size > 8*1024*1024){ toastMsg('รูปใหญ่เกิน 8MB'); done(); return; }
    var rd = new FileReader();
    rd.onload = function(e){ S.resolvePhotos.push({ name:f.name, dataUrl:e.target.result }); done(); };
    rd.onerror = function(){ done(); };
    rd.readAsDataURL(f);
  });
}
function removeResolvePhoto(i){ S.resolvePhotos.splice(i,1); render(); }

function doAssignTicket(ticketId){
  var tech = S.assignTech || S.displayName;
  var payload = { ticketId: ticketId, techName: tech, changedBy: S.displayName };
  if (hasBackend()){
    google.script.run
      .withSuccessHandler(function(){ toastMsg('มอบหมายงาน '+ticketId+' ให้ '+tech+' แล้ว'); setState({ assignTech:'' }); refreshTickets(); })
      .withFailureHandler(function(){ toastMsg('เกิดข้อผิดพลาด กรุณาลองใหม่'); })
      .assignTicket(payload);
  } else {
    var all = S.ticketsRaw || MOCK_TICKETS;
    var t = all.filter(function(x){ return (x.id||x.ticket_id) === ticketId; })[0];
    if (t){ t.statusKey = 'inprogress'; t.status = 'กำลังซ่อม'; t.tech = tech; }
    toastMsg('มอบหมายงานแล้ว (โหมดสาธิต)');
    setState({ assignTech:'', screen: 'tickets' });
  }
}

function doOutsourceTicket(ticketId){
  var note = (S.resolveForm.vendorNote || '').trim();
  if (!note){ toastMsg('กรุณาระบุชื่อบริษัท / รายละเอียด'); return; }
  var payload = { ticketId: ticketId, vendorNote: note, changedBy: S.displayName };
  if (hasBackend()){
    google.script.run
      .withSuccessHandler(function(){ toastMsg('ส่งต่อบริษัทแล้ว — '+ticketId); setState({ resolveForm:{ solution:'', parts:'', hours:'', vendorNote:'' } }); refreshTickets(); })
      .withFailureHandler(function(){ toastMsg('เกิดข้อผิดพลาด กรุณาลองใหม่'); })
      .outsourceTicket(payload);
  } else {
    var all = S.ticketsRaw || MOCK_TICKETS;
    var t = all.filter(function(x){ return (x.id||x.ticket_id) === ticketId; })[0];
    if (t){ t.statusKey = 'outsourced'; t.status = 'ส่งบริษัทแล้ว'; t.solution = note; }
    toastMsg('ส่งต่อบริษัทแล้ว (โหมดสาธิต)');
    setState({ resolveForm:{ solution:'', parts:'', hours:'', vendorNote:'' }, screen:'tickets' });
  }
}

function doResolveTicket(ticketId, prevStatusKey){
  var sol = (S.resolveForm.solution || '').trim();
  if (!sol){ toastMsg('กรุณากรอกวิธีแก้ไข / สรุปผลการซ่อม'); return; }
  var payload = { ticketId: ticketId, solution: sol, parts: S.resolveForm.parts, work_hours: S.resolveForm.hours, changedBy: S.displayName, prevStatusKey: prevStatusKey,
                  photos:(S.resolvePhotos || []).map(function(p){ return { name:p.name, dataUrl:p.dataUrl }; }) };
  if (hasBackend()){
    google.script.run
      .withSuccessHandler(function(){ toastMsg('ปิดงาน '+ticketId+' เรียบร้อยแล้ว'); setState({ resolveForm:{ solution:'', parts:'', hours:'', vendorNote:'' }, resolvePhotos:[] }); refreshTickets(); })
      .withFailureHandler(function(){ toastMsg('เกิดข้อผิดพลาด กรุณาลองใหม่'); })
      .resolveTicket(payload);
  } else {
    var all = S.ticketsRaw || MOCK_TICKETS;
    var t = all.filter(function(x){ return (x.id||x.ticket_id) === ticketId; })[0];
    if (t){ t.statusKey = 'resolved'; t.status = 'ปิดงานแล้ว'; t.solution = sol; t.parts = S.resolveForm.parts; t.work_hours = S.resolveForm.hours; t.resolved_at = 'ตอนนี้'; }
    toastMsg('ปิดงาน '+ticketId+' เรียบร้อยแล้ว (โหมดสาธิต)');
    setState({ resolveForm:{ solution:'', parts:'', hours:'', vendorNote:'' }, screen:'tickets' });
  }
}

