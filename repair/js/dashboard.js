/* ============================================================
   DASHBOARD (ภาพรวม)
   ============================================================ */
function statCard(grad, label, value, foot, footColor){
  return '<div style="position:relative;overflow:hidden;background:'+grad+';border:1px solid var(--line);border-radius:var(--radius-lg);box-shadow:var(--shadow-soft);padding:22px">'
    + '<span style="color:var(--text-muted);font-size:.92rem">'+esc(label)+'</span>'
    + '<strong style="display:block;margin-top:8px;font-size:var(--text-stat);font-weight:var(--fw-black);letter-spacing:var(--tracking-hero)">'+esc(value)+'</strong>'
    + '<span style="display:block;margin-top:8px;font-size:.84rem;color:'+footColor+';font-weight:var(--fw-semibold)">'+esc(foot)+'</span></div>';
}

function viewDashboard(){
  var allT = allTickets();
  var c = function(k){ return allT.filter(function(t){ return t.statusKey === k; }).length; };
  var openCnt = c('pending') + c('inprogress') + c('outsourced');
  var loans = (typeof loanHistory === 'function') ? loanHistory() : [];
  var loanActive = loans.filter(function(l){ return l.statusRaw !== 'คืนแล้ว' && l.statusRaw !== 'ปฏิเสธ'; }).length;
  var loanOverdue = loans.filter(function(l){ return l.statusRaw === 'เกินกำหนดคืน'; }).length;
  var tk = allT.slice(0,5);
  var rows = tk.map(function(t){
    return '<div style="display:grid;grid-template-columns:1.15fr 1.9fr 1fr 1.15fr 1fr;gap:12px;align-items:center;padding:15px 14px;border-bottom:1px solid var(--line);font-size:.9rem">'
      + '<span style="font-weight:var(--fw-bold);color:var(--accent-strong)">'+esc(t.id)+'</span>'
      + '<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(t.dev)+'</span>'
      + '<span style="color:var(--text-muted)">'+esc(t.by)+'</span>'
      + '<span style="color:var(--text-muted)">'+esc(t.tech)+'</span>'
      + '<span style="justify-self:end;display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:999px;font-size:.8rem;font-weight:var(--fw-bold);background:'+t.bg+';color:'+t.fg+';border:1px solid '+t.bd+';white-space:nowrap"><span style="width:7px;height:7px;border-radius:999px;background:currentColor;opacity:.7"></span>'+esc(t.status)+'</span></div>';
  }).join('');

  return '<section style="animation:riseIn .6s var(--ease) both">'
  + mLauncher()
  + '<div class="desktop-dash" style="display:flex;flex-direction:column;gap:22px">'
  + '<div class="statgrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px">'
  +   statCard('linear-gradient(135deg,rgba(229,240,237,0.92),rgba(255,255,255,0.84))','งานที่เปิดอยู่',String(openCnt),'รอรับงาน '+c('pending')+' · กำลังซ่อม '+(c('inprogress')+c('outsourced')),'var(--accent-strong)')
  +   statCard('linear-gradient(135deg,rgba(218,236,229,0.92),rgba(255,255,255,0.84))','รอรับงาน',String(c('pending')),'งานที่ยังไม่มีช่างรับ','var(--warning)')
  +   statCard('linear-gradient(135deg,rgba(250,244,231,0.92),rgba(255,255,255,0.84))','ปิดงานแล้ว',String(c('resolved')),'งานซ่อมที่เสร็จสิ้น','var(--accent-strong)')
  +   statCard('linear-gradient(135deg,rgba(247,236,231,0.92),rgba(255,255,255,0.84))','ยืม–คืนค้างอยู่',String(loanActive),(loanOverdue?('เกินกำหนดคืน '+loanOverdue+' รายการ'):'ไม่มีเกินกำหนด'),(loanOverdue?'var(--danger)':'var(--text-muted)'))
  + '</div>'
  + '<div class="glass" style="padding:26px 28px">'
  +   '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:6px;flex-wrap:wrap">'
  +     '<div><div class="eyebrow">TREND · 6 เดือน</div><h2 style="margin:6px 0 0;font-size:var(--text-h3);font-weight:var(--fw-bold)">แนวโน้มงานซ่อม</h2></div>'
  +     '<div style="display:flex;gap:18px;font-size:.84rem;color:var(--text-muted)"><span><strong style="color:var(--text-body);font-size:1.4rem;font-weight:var(--fw-black)">'+allT.length+'</strong> งานทั้งหมด</span><span><strong style="color:var(--text-body);font-size:1.4rem;font-weight:var(--fw-black)">'+c('resolved')+'</strong> ปิดงานแล้ว</span></div>'
  +   '</div>'
  +   '<div style="margin-top:8px">'+lineChart(260)+'</div>'
  + '</div>'
  + '<div class="glass" style="padding:26px 28px">'
  +   '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px"><h2 style="margin:0;font-size:var(--text-h3);font-weight:var(--fw-bold)">งานซ่อมล่าสุด</h2><span style="font-size:.86rem;color:var(--accent);font-weight:var(--fw-semibold);cursor:pointer" onclick="go(\'tickets\')">ดูทั้งหมด →</span></div>'
  +   '<div style="overflow-x:auto"><div style="min-width:760px">'
  +     '<div style="display:grid;grid-template-columns:1.15fr 1.9fr 1fr 1.15fr 1fr;gap:12px;padding:0 14px 12px;font-size:.78rem;color:var(--text-muted);font-weight:var(--fw-semibold);border-bottom:1px solid var(--line)"><span>หมายเลขงาน</span><span>อุปกรณ์</span><span>ผู้แจ้ง</span><span>ช่างผู้รับผิดชอบ</span><span style="text-align:right">สถานะ</span></div>'
  +     rows
  +   '</div></div>'
  + '</div>'
  + '</div></section>';
}

