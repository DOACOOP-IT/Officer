/* ============================================================
   TICKET LIST
   ============================================================ */
function filteredTickets(){
  var all = allTickets();
  return S.ticketFilter === 'all' ? all : all.filter(function(t){ return t.statusKey === S.ticketFilter; });
}

function viewTickets(){
  var all = allTickets();
  var cnt = function(k){ return all.filter(function(t){ return t.statusKey === k; }).length; };
  var tabs = [['all','ทั้งหมด',all.length],['pending','รอรับงาน',cnt('pending')],['inprogress','กำลังซ่อม',cnt('inprogress')],['outsourced','ส่งบริษัทแล้ว',cnt('outsourced')],['resolved','ปิดงานแล้ว',cnt('resolved')]];
  var tabsHtml = tabs.map(function(t){
    var on = S.ticketFilter === t[0];
    var bg = on ? 'var(--grad-tint-pine)' : 'rgba(255,255,255,0.7)';
    var fg = on ? 'var(--accent-strong)' : 'var(--text-muted)';
    var bd = on ? 'rgba(37,102,91,0.22)' : 'var(--border)';
    var sh = on ? 'var(--shadow-soft)' : 'none';
    return '<button onclick="setFilter(\''+t[0]+'\')" style="border:1px solid '+bd+';background:'+bg+';color:'+fg+';box-shadow:'+sh+';border-radius:999px;padding:10px 18px;cursor:pointer;font-weight:var(--fw-semibold);font-size:.9rem;display:inline-flex;align-items:center;gap:9px;transition:var(--transition-base)">'
      + esc(t[1]) + '<span style="background:rgba(27,40,38,0.08);border-radius:999px;padding:1px 9px;font-size:.78rem;font-weight:var(--fw-bold)">'+t[2]+'</span></button>';
  }).join('');

  var rows = filteredTickets().map(function(t){
    return '<div onclick="openTicket(\''+t.id+'\')" style="display:grid;grid-template-columns:1.2fr 1.7fr 1fr 1.15fr 1.1fr 0.95fr;gap:12px;align-items:center;padding:15px 14px;border-bottom:1px solid var(--line);font-size:.9rem;cursor:pointer;border-radius:12px;transition:var(--transition-base)" onmouseover="this.style.background=\'var(--accent-soft)\'" onmouseout="this.style.background=\'transparent\'">'
      + '<span style="font-weight:var(--fw-bold);color:var(--accent-strong)">'+esc(t.id)+'</span>'
      + '<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(t.dev)+'</span>'
      + '<span style="color:var(--text-muted)">'+esc(t.by)+'</span>'
      + '<span style="color:var(--text-muted)">'+esc(t.tech)+'</span>'
      + '<span style="color:'+t.slaColor+';font-weight:var(--fw-semibold);font-size:.85rem">'+esc(t.sla)+'</span>'
      + '<span style="justify-self:end;display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:999px;font-size:.8rem;font-weight:var(--fw-bold);background:'+t.bg+';color:'+t.fg+';border:1px solid '+t.bd+';white-space:nowrap"><span style="width:7px;height:7px;border-radius:999px;background:currentColor;opacity:.7"></span>'+esc(t.status)+'</span></div>';
  }).join('');

  return '<section style="animation:riseIn .6s var(--ease) both">'
  + '<div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;align-items:center">'+tabsHtml
  +   '<div style="margin-left:auto;display:flex;gap:8px">'
  +     '<button class="btn-primary" style="padding:10px 20px;font-size:.9rem" onclick="exportPdf()">พิมพ์ PDF</button>'
  +     '<button class="btn-ghost" style="padding:10px 20px;font-size:.9rem" onclick="exportCsv()">ส่งออก CSV</button>'
  +   '</div></div>'
  + '<div class="glass" style="padding:24px 26px"><div style="overflow-x:auto"><div style="min-width:840px">'
  +   '<div style="display:grid;grid-template-columns:1.2fr 1.7fr 1fr 1.15fr 1.1fr 0.95fr;gap:12px;padding:0 14px 12px;font-size:.78rem;color:var(--text-muted);font-weight:var(--fw-semibold);border-bottom:1px solid var(--line)"><span>หมายเลขงาน</span><span>อุปกรณ์</span><span>ผู้แจ้ง</span><span>ช่างผู้รับผิดชอบ</span><span>SLA</span><span style="text-align:right">สถานะ</span></div>'
  +   rows
  + '</div></div></div></section>';
}

function setFilter(k){ setState({ ticketFilter:k }); }
function openTicket(id){ setState({ screen:'detail', activeTicketId:id }); window.scrollTo(0,0); }

function exportCsv(){
  var rows = filteredTickets();
  var head = ['หมายเลขงาน','อุปกรณ์','ผู้แจ้ง','ช่างผู้รับผิดชอบ','SLA','สถานะ'];
  var escc = function(v){ return '"' + String(v).replace(/"/g,'""') + '"'; };
  var csv = [head].concat(rows.map(function(t){ return [t.id,t.dev,t.by,t.tech,t.sla,t.status]; }))
    .map(function(r){ return r.map(escc).join(','); }).join('\r\n');
  var blob = new Blob(['﻿'+csv], { type:'text/csv;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href = url; a.download = 'รายการงานซ่อม.csv';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1500);
  toastMsg('ส่งออกไฟล์ CSV ('+rows.length+' รายการ) เรียบร้อยแล้ว');
}

function exportPdf(){
  var rows = filteredTickets();
  var escp = function(v){ return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
  var trs = rows.map(function(t,i){
    return '<tr><td>'+(i+1)+'</td><td>'+escp(t.id)+'</td><td class="l">'+escp(t.dev)+'</td><td>'+escp(t.by)+'</td><td>'+escp(t.tech)+'</td><td>'+escp(t.sla)+'</td><td>'+escp(t.status)+'</td></tr>';
  }).join('');
  var html = '<!doctype html><html lang="th"><head><meta charset="utf-8"><title>รายการงานซ่อม IT</title>'
    + '<style>@import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700;800&display=swap");'
    + '*{font-family:\'Sarabun\',sans-serif;box-sizing:border-box}body{margin:38px;color:#1e2b28}'
    + 'h1{font-size:20px;margin:0;font-weight:800}.sub{color:#687571;font-size:13px}'
    + '.head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #25665b;padding-bottom:12px;margin-bottom:18px}'
    + '.brand{display:flex;gap:12px;align-items:center}.logo{width:44px;height:44px;border-radius:11px;background:#25665b;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px}'
    + 'table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #d6ddd9;padding:8px 10px;text-align:center}'
    + 'th{background:#e5f0ed;color:#194940;font-weight:700}td.l,th.l{text-align:left}.foot{margin-top:18px;font-size:11px;color:#687571}'
    + '@media print{body{margin:14mm}}</style></head><body>'
    + '<div class="head"><div class="brand"><div class="logo">IT</div><div><h1>รายการงานซ่อม IT</h1>'
    + '<div class="sub">สอ.กรมวิชาการเกษตร จำกัด · '+rows.length+' รายการ</div></div></div>'
    + '<div class="sub">พิมพ์เมื่อ 22 มิ.ย. 2569</div></div>'
    + '<table><thead><tr><th>#</th><th>หมายเลขงาน</th><th class="l">อุปกรณ์</th><th>ผู้แจ้ง</th><th>ช่าง</th><th>SLA</th><th>สถานะ</th></tr></thead><tbody>'
    + trs + '</tbody></table><div class="foot">เอกสารนี้สร้างจากระบบแจ้งซ่อม IT โดยอัตโนมัติ</div></body></html>';
  var w = window.open('', '_blank');
  if (!w){ toastMsg('กรุณาอนุญาต pop-up เพื่อพิมพ์ PDF'); return; }
  w.document.open(); w.document.write(html); w.document.close();
  setTimeout(function(){ try { w.focus(); w.print(); } catch(e){} }, 500);
  toastMsg('เปิดหน้าพิมพ์ PDF ('+rows.length+' รายการ) แล้ว — เลือก "บันทึกเป็น PDF"');
}

/* ============================================================
   TICKET DETAIL
   ============================================================ */
function viewDetail(){
  var all = allTickets();
  var t = all.filter(function(x){ return x.id === S.activeTicketId; })[0] || all[0];

  var commentsHtml = S.comments.map(function(c){
    var av = c.tone === 'me' ? 'ก' : (c.tone === 'sys' ? 'S' : 'ช');
    var avBg = c.tone === 'me' ? 'var(--accent)' : 'rgba(37,102,91,0.12)';
    var avFg = c.tone === 'me' ? '#fff' : 'var(--accent-strong)';
    return '<div style="display:flex;gap:12px;align-items:flex-start">'
      + '<span style="width:36px;height:36px;flex:0 0 auto;border-radius:999px;background:'+avBg+';color:'+avFg+';display:flex;align-items:center;justify-content:center;font-weight:var(--fw-bold);font-size:.86rem">'+av+'</span>'
      + '<div style="flex:1;background:var(--surface-strong);border:1px solid var(--line);border-radius:var(--radius-md);padding:12px 15px">'
      + '<div style="display:flex;justify-content:space-between;gap:10px;margin-bottom:3px"><span style="font-weight:var(--fw-semibold);font-size:.88rem">'+esc(c.who)+'</span><span style="font-size:.78rem;color:var(--text-muted)">'+esc(c.when)+'</span></div>'
      + '<div style="font-size:.9rem;line-height:var(--leading-normal)">'+esc(c.text)+'</div></div></div>';
  }).join('');

  var timelineHtml = TIMELINE.map(function(ev){
    return '<div style="display:flex;gap:14px"><div style="position:relative;width:14px;flex:0 0 auto;display:flex;justify-content:center"><div style="width:2px;background:var(--line);flex:1"></div><span style="position:absolute;top:2px;width:14px;height:14px;border-radius:999px;background:'+ev.color+';border:3px solid var(--surface-strong)"></span></div>'
      + '<div style="padding-bottom:18px"><div style="font-size:.76rem;color:var(--text-muted)">'+esc(ev.when)+'</div><div style="font-weight:var(--fw-semibold);font-size:.92rem;margin-top:1px">'+esc(ev.title)+'</div><div style="font-size:.82rem;color:var(--text-muted);line-height:var(--leading-normal)">'+esc(ev.desc)+'</div></div></div>';
  }).join('');

  return '<section style="animation:riseIn .6s var(--ease) both">'
  + '<button class="btn-ghost" style="padding:9px 18px;font-size:.88rem;margin-bottom:18px" onclick="go(\'tickets\')">← กลับไปรายการงาน</button>'
  + '<div class="detailgrid" style="display:grid;grid-template-columns:1.35fr 1fr;gap:22px;align-items:start">'
  +   '<div style="display:flex;flex-direction:column;gap:22px">'
  +     '<div class="glass" style="padding:26px 28px">'
  +       '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:18px">'
  +         '<div><div class="eyebrow">หมายเลขงาน</div><h2 style="margin:4px 0 0;font-size:var(--text-h3);font-weight:var(--fw-black)">'+esc(t.id)+'</h2></div>'
  +         '<span style="display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:999px;font-size:.86rem;font-weight:var(--fw-bold);background:'+t.bg+';color:'+t.fg+';border:1px solid '+t.bd+'"><span style="width:8px;height:8px;border-radius:999px;background:currentColor;opacity:.7"></span>'+esc(t.status)+'</span>'
  +       '</div>'
  +       '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px 24px">'
  +         '<div><div style="font-size:.8rem;color:var(--text-muted);margin-bottom:3px">อุปกรณ์</div><div style="font-weight:var(--fw-semibold)">'+esc(t.dev)+'</div></div>'
  +         '<div><div style="font-size:.8rem;color:var(--text-muted);margin-bottom:3px">ผู้แจ้ง</div><div style="font-weight:var(--fw-semibold)">'+esc(t.by)+'</div></div>'
  +         '<div><div style="font-size:.8rem;color:var(--text-muted);margin-bottom:3px">สถานที่</div><div style="font-weight:var(--fw-semibold)">'+esc(t.place)+'</div></div>'
  +         '<div><div style="font-size:.8rem;color:var(--text-muted);margin-bottom:3px">วันที่แจ้ง</div><div style="font-weight:var(--fw-semibold)">'+esc(t.at)+'</div></div>'
  +         '<div><div style="font-size:.8rem;color:var(--text-muted);margin-bottom:3px">ช่างผู้รับผิดชอบ</div><div style="font-weight:var(--fw-semibold)">'+esc(t.tech)+'</div></div>'
  +       '</div>'
  +       '<div style="margin-top:18px;border-top:1px solid var(--line);padding-top:16px"><div style="font-size:.8rem;color:var(--text-muted);margin-bottom:5px">อาการที่แจ้ง</div><p style="margin:0;line-height:var(--leading-normal)">เครื่องเปิดไม่ติด กดปุ่ม power แล้วไฟสถานะกะพริบแต่จอไม่แสดงภาพ มีเสียงบี๊บเป็นจังหวะ สันนิษฐานว่าเป็นที่หน่วยความจำหรือเมนบอร์ด</p></div>'
  +     '</div>'
  +     '<div class="glass" style="padding:24px 26px"><h3 style="margin:0 0 14px;font-size:1.05rem;font-weight:var(--fw-bold)">รูปก่อน / หลังซ่อม</h3>'
  +       '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">'
  +         '<div><div style="aspect-ratio:4/3;border-radius:var(--radius-md);background:linear-gradient(135deg,var(--paper-200),var(--paper-50));border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--ink-500);font-size:.84rem;position:relative;overflow:hidden"><span style="position:absolute;inset:0;background:radial-gradient(circle at 35% 28%,rgba(255,255,255,.5),transparent 60%)"></span>ภาพถ่ายอาการเสีย</div><div style="text-align:center;font-size:.82rem;color:var(--text-muted);margin-top:8px;font-weight:var(--fw-semibold)">ก่อนซ่อม</div></div>'
  +         '<div><div style="aspect-ratio:4/3;border-radius:var(--radius-md);background:var(--accent-soft);border:1px dashed rgba(37,102,91,0.3);display:flex;align-items:center;justify-content:center;color:var(--accent-strong);font-size:.84rem">รอช่างอัปโหลด</div><div style="text-align:center;font-size:.82rem;color:var(--text-muted);margin-top:8px;font-weight:var(--fw-semibold)">หลังซ่อม</div></div>'
  +       '</div></div>'
  +     '<div class="glass" style="padding:24px 26px"><h3 style="margin:0 0 16px;font-size:1.05rem;font-weight:var(--fw-bold)">ความคิดเห็น</h3>'
  +       '<div style="display:flex;flex-direction:column;gap:16px">'+commentsHtml+'</div>'
  +       '<div style="display:flex;gap:10px;margin-top:16px">'
  +         '<input id="comment-input" value="'+esc(S.commentDraft)+'" oninput="S.commentDraft=this.value" onkeydown="if(event.key===\'Enter\')addComment()" placeholder="เพิ่มความคิดเห็น…" style="flex:1;border:1px solid var(--border);border-radius:999px;padding:12px 18px;font-size:.92rem;background:rgba(255,255,255,0.82);outline:none;color:var(--text-body)">'
  +         '<button class="btn-primary" style="padding:12px 24px" onclick="addComment()">ส่ง</button>'
  +       '</div></div>'
  +   '</div>'
  +   '<div style="display:flex;flex-direction:column;gap:22px;position:sticky;top:24px">'
  +     '<div class="glass" style="padding:26px 28px;text-align:center"><div class="eyebrow">SLA COUNTDOWN</div>'
  +       '<div style="font-size:3rem;font-weight:var(--fw-black);letter-spacing:var(--tracking-hero);margin:10px 0 4px;color:'+t.slaColor+'">02:14:30</div>'
  +       '<div style="color:var(--text-muted);font-size:.88rem">เวลาคงเหลือก่อนครบกำหนด SLA</div>'
  +       '<div style="height:10px;border-radius:999px;background:rgba(27,40,38,0.07);overflow:hidden;margin:18px 0 10px"><div style="height:100%;width:64%;background:var(--grad-accent);border-radius:999px"></div></div>'
  +       '<div style="display:flex;justify-content:space-between;font-size:.8rem;color:var(--text-muted)"><span>รับงาน 10:40</span><span>ครบกำหนด 16:40</span></div></div>'
  +     viewDetailActions(t)
  +     '<div class="glass" style="padding:24px 26px"><h3 style="margin:0 0 16px;font-size:1.05rem;font-weight:var(--fw-bold)">ไทม์ไลน์กิจกรรม</h3><div style="display:flex;flex-direction:column">'+timelineHtml+'</div></div>'
  +   '</div>'
  + '</div></section>';
}

function addComment(){
  var t = S.commentDraft.trim(); if (!t) return;
  setState(function(s){ return { comments: s.comments.concat([{ who:'เจ้าหน้าที่ IT', when:'ตอนนี้', text:t, tone:'me' }]), commentDraft:'' }; });
}

