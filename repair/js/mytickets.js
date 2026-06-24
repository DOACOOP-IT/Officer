/* ============================================================
   MY TICKETS — งานซ่อมของฉัน (staff)
   ============================================================ */
function viewMyTickets(){
  var mine = allTickets().filter(function(t){ return t.requester_id === S.lineUserId || t.by === S.displayName; });
  if (!mine.length){
    return '<section style="animation:riseIn .6s var(--ease) both">'
      + '<div class="glass" style="padding:48px;text-align:center;color:var(--text-muted)">'
      + '<div style="font-size:2.5rem;margin-bottom:12px">📋</div>'
      + '<div style="font-weight:var(--fw-semibold)">ยังไม่มีงานซ่อมที่คุณแจ้ง</div>'
      + '<div style="font-size:.88rem;margin-top:6px">กด "แจ้งซ่อม" เพื่อเปิดงานซ่อมใหม่</div>'
      + '<button class="btn-primary" style="margin-top:18px;padding:13px 28px" onclick="go(\'report\')">แจ้งซ่อมอุปกรณ์</button>'
      + '</div></section>';
  }
  var cards = mine.map(function(t){
    return '<div class="glass" onclick="openTicket(\''+t.id+'\')" style="padding:16px 18px;border-radius:var(--radius-lg);box-shadow:var(--shadow-soft);cursor:pointer;display:flex;flex-direction:column;gap:10px">'
      + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">'
      +   '<span style="font-weight:var(--fw-bold);color:var(--accent-strong);font-size:.92rem">'+esc(t.id)+'</span>'
      +   '<span style="flex:0 0 auto;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;font-size:.78rem;font-weight:var(--fw-bold);background:'+t.bg+';color:'+t.fg+';border:1px solid '+t.bd+';white-space:nowrap"><span style="width:7px;height:7px;border-radius:999px;background:currentColor;opacity:.7"></span>'+esc(t.status)+'</span>'
      + '</div>'
      + '<div style="font-weight:var(--fw-semibold);line-height:1.35">'+esc(t.dev)+'</div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:.82rem">'
      +   '<span style="color:var(--text-muted)">'+esc(t.at)+'</span>'
      +   '<span style="color:'+t.slaColor+';font-weight:var(--fw-semibold)">'+esc(t.sla)+'</span>'
      + '</div></div>';
  }).join('');
  return '<section style="animation:riseIn .6s var(--ease) both"><div style="display:flex;flex-direction:column;gap:12px;max-width:680px;margin:0 auto">'
    + cards + '</div></section>';
}

