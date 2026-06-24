/* ============================================================
   PM CALENDAR (มิถุนายน 2569 / June 2026)
   ============================================================ */
function viewPm(){
  var evTone = { accent:{ c:'var(--accent)', bg:'var(--accent-soft)', fg:'var(--accent-strong)' }, warning:{ c:'var(--warning)', bg:'var(--warning-soft)', fg:'var(--warning)' }, danger:{ c:'var(--danger)', bg:'var(--danger-soft)', fg:'var(--danger)' } };
  var ev = function(label, k){ var t = evTone[k]; return { label:label, c:t.c, bg:t.bg, fg:t.fg }; };
  var pmEvents = { 3:[ev('Switch Cisco 2960','accent')], 6:[ev('UPS APC 3kVA','warning')], 10:[ev('Notebook ชุดที่ 1','accent')], 13:[ev('เครื่องพิมพ์ HP','accent')], 17:[ev('แอร์ห้อง Server','danger')], 20:[ev('จอภาพ ชุด B','accent')], 24:[ev('Firewall FortiGate','warning')], 27:[ev('Notebook ชุดที่ 2','accent')] };
  var dows = ['อา','จ','อ','พ','พฤ','ศ','ส'];
  var lead = 1; // June 1 2026 = Monday (Sun=0)
  var cells = [];
  var i;
  for (i = 0; i < lead; i++) cells.push(null);
  for (var d = 1; d <= 30; d++) cells.push({ day:d, today:d===21, events:pmEvents[d]||[] });
  while (cells.length % 7 !== 0) cells.push(null);

  var cellsHtml = cells.map(function(c){
    if (!c) return '<div style="min-height:100px;border-radius:12px;padding:9px;background:transparent;border:1px solid var(--line)"></div>';
    var bg = c.today ? 'var(--accent-soft)' : 'var(--surface-strong)';
    var dayColor = c.today ? 'var(--accent-strong)' : 'var(--text-body)';
    var evs = c.events.map(function(e){
      return '<div style="display:flex;align-items:center;gap:6px;background:'+e.bg+';color:'+e.fg+';border-radius:8px;padding:4px 7px;font-size:.72rem;font-weight:var(--fw-semibold);line-height:1.25"><span style="width:6px;height:6px;border-radius:999px;background:'+e.c+';flex:0 0 auto"></span><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(e.label)+'</span></div>';
    }).join('');
    return '<div style="min-height:100px;border-radius:12px;padding:9px;background:'+bg+';border:1px solid var(--line)"><div style="font-weight:var(--fw-bold);font-size:.92rem;color:'+dayColor+';margin-bottom:6px">'+c.day+'</div><div style="display:flex;flex-direction:column;gap:5px">'+evs+'</div></div>';
  }).join('');

  var dowsHtml = dows.map(function(x){ return '<div style="text-align:center;font-size:.8rem;font-weight:var(--fw-semibold);color:var(--text-muted);padding:4px 0">'+esc(x)+'</div>'; }).join('');

  return '<section style="animation:riseIn .6s var(--ease) both"><div class="glass" style="padding:26px 28px">'
  + '<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:20px">'
  +   '<div style="display:flex;align-items:center;gap:14px"><span style="width:34px;height:34px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;color:var(--ink-500);cursor:pointer">‹</span><h2 style="margin:0;font-size:var(--text-h3);font-weight:var(--fw-black)">มิถุนายน 2569</h2><span style="width:34px;height:34px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;color:var(--ink-500);cursor:pointer">›</span></div>'
  +   '<div style="display:flex;gap:16px;font-size:.82rem;color:var(--text-muted);flex-wrap:wrap"><span style="display:flex;align-items:center;gap:7px"><span style="width:9px;height:9px;border-radius:999px;background:var(--accent)"></span>ตามรอบปกติ</span><span style="display:flex;align-items:center;gap:7px"><span style="width:9px;height:9px;border-radius:999px;background:var(--warning)"></span>เฝ้าระวัง</span><span style="display:flex;align-items:center;gap:7px"><span style="width:9px;height:9px;border-radius:999px;background:var(--danger)"></span>สำคัญ</span></div>'
  + '</div>'
  + '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:8px">'+dowsHtml+'</div>'
  + '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px">'+cellsHtml+'</div>'
  + '</div></section>';
}

