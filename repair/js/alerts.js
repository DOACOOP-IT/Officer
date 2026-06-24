/* ============================================================
   ALERTS
   ============================================================ */
function fetchAlerts(){
  if (!hasBackend()) return;
  google.script.run
    .withSuccessHandler(function(res){ if (res && res.ok) setState({ alerts: res.alerts || [] }); })
    .withFailureHandler(function(){})
    .getAlerts(S.role, S.department, S.lineUserId);
}

function viewAlertBanner(){
  if (S.alertDismissed || !S.alerts || !S.alerts.length) return '';
  var icons = { pending:'🔔', outsourced:'🏢', update:'📋', info:'ℹ️' };
  var items = S.alerts.map(function(a){
    return '<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--radius-md);background:rgba(255,255,255,0.6);border:1px solid var(--line)">'
      + '<span style="font-size:1.1rem">'+(icons[a.type]||'🔔')+'</span>'
      + '<span style="font-size:.92rem;font-weight:var(--fw-semibold);flex:1">'+esc(a.msg)+'</span>'
      + (a.type==='pending'    ? '<button onclick="go(\'tickets\')"   style="border:0;background:var(--accent);color:#fff;border-radius:999px;padding:6px 14px;font-size:.8rem;font-weight:var(--fw-bold);cursor:pointer">ดูงาน</button>' : '')
      + (a.type==='outsourced' ? '<button onclick="go(\'tickets\')"   style="border:0;background:var(--warning);color:#fff;border-radius:999px;padding:6px 14px;font-size:.8rem;font-weight:var(--fw-bold);cursor:pointer">ดูงาน</button>' : '')
      + (a.type==='update'     ? '<button onclick="go(\'mytickets\')" style="border:0;background:var(--accent);color:#fff;border-radius:999px;padding:6px 14px;font-size:.8rem;font-weight:var(--fw-bold);cursor:pointer">ดูสถานะ</button>' : '')
      + '</div>';
  }).join('');
  return '<div style="margin-bottom:18px;padding:16px 18px;border-radius:var(--radius-lg);background:var(--grad-tint-pine);border:1px solid rgba(37,102,91,0.22);display:flex;flex-direction:column;gap:10px;animation:riseIn .4s var(--ease) both">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px">'
    + '<span style="font-size:.78rem;font-weight:var(--fw-bold);letter-spacing:var(--tracking-eyebrow);text-transform:uppercase;color:var(--accent-strong)">การแจ้งเตือน</span>'
    + '<button onclick="dismissAlert()" style="border:0;background:transparent;color:var(--ink-500);cursor:pointer;font-size:1.2rem;line-height:1;padding:2px 6px">×</button>'
    + '</div>'
    + items + '</div>';
}

function dismissAlert(){ setState({ alertDismissed: true }); }

