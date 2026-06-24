/* ============================================================
   APP SHELL
   ============================================================ */
var ROLE_LABEL = { admin:'ผู้ดูแลระบบ', tech:'เจ้าหน้าที่ช่าง', staff:'เจ้าหน้าที่ IT' };
var PAGE_TITLE = { dashboard:'ภาพรวมระบบแจ้งซ่อม', report:'แจ้งซ่อมอุปกรณ์', tickets:'รายการงานซ่อม', detail:'รายละเอียดงานซ่อม', loans:'ยืม–คืนอุปกรณ์', qr:'QR Code อุปกรณ์', pm:'แผนบำรุงรักษา (PM)', mobile:'สแกนด่วน (มือถือ)', mytickets:'งานซ่อมของฉัน' };
var PAGE_SUB = { dashboard:'สรุปงานซ่อม สถานะ SLA และกิจกรรมล่าสุด', report:'กรอกรายละเอียดเพื่อเปิดงานซ่อมใหม่ ระบบจะออกหมายเลขงานให้อัตโนมัติ', tickets:'ติดตามและกรองงานซ่อมทั้งหมดตามสถานะ', detail:'ข้อมูลอุปกรณ์ สถานะ SLA และกิจกรรมของงาน', loans:'ขอยืมอุปกรณ์ที่ว่าง และดูประวัติการยืม', qr:'พิมพ์ QR ติดอุปกรณ์ เพื่อสแกนแจ้งซ่อมหน้างาน', pm:'ตารางรอบบำรุงรักษาอุปกรณ์ประจำเดือน', mobile:'ตัวอย่างหน้าจอมือถือ สแกน QR แล้วแจ้งซ่อมด่วน', mytickets:'ติดตามสถานะงานซ่อมที่คุณแจ้ง', scan:'แจ้งซ่อมจากการสแกน QR' };
PAGE_TITLE.scan = 'แจ้งซ่อมอุปกรณ์';

function navBtn(key, label){
  var on = S.screen === key || (key === 'tickets' && S.screen === 'detail');
  var st = on
    ? 'background:var(--grad-tint-pine);color:var(--accent-strong);border:1px solid rgba(37,102,91,0.20)'
    : 'background:transparent;color:var(--ink-700);border:1px solid transparent';
  var dot = on ? 'var(--accent)' : 'rgba(104,117,113,0.4)';
  return '<button class="nav-btn" style="'+st+'" onclick="go(\''+key+'\')">'
    + '<span style="width:9px;height:9px;border-radius:999px;background:'+dot+';flex:0 0 auto"></span>'+esc(label)+'</button>';
}
function go(key){ setState({ screen:key, navOpen:false }); window.scrollTo(0,0); }
function toggleNav(){ setState({ navOpen: !S.navOpen }); }
function goHome(){ location.href = 'https://doacoop-it.github.io/Officer'; }

/* ===== Bottom tab bar (มือถือ) ===== */
var BN_ICONS = {
  home:    '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/>',
  report:  '<path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L5 16l3 3 4.3-4.3a4 4 0 0 1 5.4-5.4l-2.6 2.6-1.8-1.8z"/>',
  tickets: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1.1"/><circle cx="4" cy="12" r="1.1"/><circle cx="4" cy="18" r="1.1"/>',
  mine:    '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4.2V3.5h6v.7M9 10h6M9 14h4"/>',
  more:    '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>'
};
function bottomTab(key, label, icon, onClick, active){
  var on = active != null ? active
    : (S.screen === key || (key === 'tickets' && S.screen === 'detail') || (key === 'report' && S.screen === 'scan'));
  var click = onClick || ("go('" + key + "')");
  return '<button class="'+(on?'on':'')+'" onclick="'+click+'">'
    + '<span class="bn-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+icon+'</svg></span>'
    + esc(label) + '</button>';
}
function bottomNav(){
  var tabs;
  if (S.role === 'staff'){
    tabs = bottomTab('dashboard','หน้าแรก',BN_ICONS.home)
         + bottomTab('report','แจ้งซ่อม',BN_ICONS.report)
         + bottomTab('mytickets','งานของฉัน',BN_ICONS.mine);
  } else {
    tabs = bottomTab('dashboard','แดชบอร์ด',BN_ICONS.home)
         + bottomTab('tickets','งานซ่อม',BN_ICONS.tickets)
         + bottomTab('report','แจ้งซ่อม',BN_ICONS.report);
  }
  tabs += bottomTab(null,'เพิ่มเติม',BN_ICONS.more,'toggleNav()',!!S.navOpen);
  return '<nav class="bottom-nav">'+tabs+'</nav>';
}

/* ===== Greeting header (มือถือ) ===== */
function mobileGreeting(){
  var pic = LINE.profile && LINE.profile.pictureUrl;
  var av  = pic ? '<img src="'+esc(pic)+'" alt="">' : esc((S.displayName||'ผู้').charAt(0));
  return '<div class="mobile-greeting"><div class="mg-av">'+av+'</div>'
    + '<div style="line-height:1.3;min-width:0"><div style="font-size:.82rem;color:var(--text-muted)">สวัสดี 👋</div>'
    + '<div style="font-weight:var(--fw-bold);font-size:1.1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(S.displayName||'ผู้ใช้งาน')+'</div></div></div>';
}

function viewApp(){
  var body;
  switch (S.screen){
    case 'dashboard': body = viewDashboard(); break;
    case 'report':    body = viewReport(); break;
    case 'tickets':   body = viewTickets(); break;
    case 'detail':    body = viewDetail(); break;
    case 'loans':     body = viewLoans(); break;
    case 'qr':        body = viewQr(); break;
    case 'pm':        body = viewPm(); break;
    case 'mobile':    body = viewMobile(); break;
    case 'mytickets': body = viewMyTickets(); break;
    case 'scan':      body = viewScanLanding(); break;
    default:          body = viewDashboard();
  }
  return ''
  + '<div class="mobile-topbar">'
  +   '<div style="width:34px;height:34px;flex:0 0 auto;border-radius:10px;background:var(--grad-accent);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:var(--fw-black);font-size:.78rem">IT</div>'
  +   '<div style="flex:1;min-width:0;font-weight:var(--fw-bold);font-size:1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(PAGE_TITLE[S.screen])+'</div>'
  +   '<button onclick="goHome()" aria-label="หน้าหลัก" style="border:1px solid var(--line);background:rgba(255,255,255,0.8);border-radius:12px;width:40px;height:40px;flex:0 0 auto;cursor:pointer;font-size:1.05rem;line-height:1;color:var(--ink-900)">⌂</button>'
  + '</div>'
  + '<div class="nav-backdrop'+(S.navOpen?' show':'')+'" onclick="toggleNav()"></div>'
  + '<div class="shell">'
  +   '<aside class="sidebar'+(S.navOpen?' open':'')+'">'
  +     '<div style="display:flex;align-items:center;gap:13px;padding:0 8px">'
  +       '<div style="width:46px;height:46px;flex:0 0 auto;border-radius:15px;background:var(--grad-accent);box-shadow:var(--shadow-accent);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:var(--fw-black);font-size:.92rem;position:relative;overflow:hidden"><span style="position:absolute;inset:0;background:radial-gradient(circle at 30% 22%,rgba(255,255,255,.4),transparent 60%)"></span><span style="position:relative">IT</span></div>'
  +       '<div style="line-height:1.2"><div style="font-weight:var(--fw-bold);font-size:1rem;letter-spacing:var(--tracking-snug)">ระบบแจ้งซ่อม IT</div><div style="font-size:.74rem;color:var(--text-muted)">สอ.กรมวิชาการเกษตร</div></div>'
  +     '</div>'
  +     '<nav style="display:flex;flex-direction:column;gap:4px">'
  +       '<div class="nav-head">เมนูหลัก</div>'
  +       navBtn('dashboard','แดชบอร์ด') + navBtn('report','แจ้งซ่อม')
  + (S.role === 'staff' ? navBtn('mytickets','งานซ่อมของฉัน') : navBtn('tickets','รายการงานซ่อม'))
  + navBtn('loans','ยืม–คืนอุปกรณ์')
  +       '<div class="nav-head" style="padding-top:16px">เครื่องมือ</div>'
  +       navBtn('qr','QR Code อุปกรณ์') + navBtn('pm','แผนบำรุงรักษา (PM)') + navBtn('mobile','สแกนด่วน (มือถือ)')
  +     '</nav>'
  +     '<div style="margin-top:auto;display:flex;align-items:center;gap:12px;padding:13px 14px;border-radius:var(--radius-md);background:var(--surface-veil);border:1px solid var(--line)">'
  +       '<div style="width:38px;height:38px;flex:0 0 auto;border-radius:999px;background:var(--grad-tint-pine);border:1px solid rgba(37,102,91,0.18);display:flex;align-items:center;justify-content:center;font-weight:var(--fw-bold);color:var(--accent-strong)">ก</div>'
  +       '<div style="line-height:1.25;min-width:0"><div style="font-weight:var(--fw-semibold);font-size:.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(S.displayName||'เจ้าหน้าที่ IT')+'</div><div style="font-size:.74rem;color:var(--text-muted)">'+esc(ROLE_LABEL[S.role]||'ผู้ใช้งาน')+' • ออนไลน์</div></div>'
  +       '<button onclick="goHome()" style="margin-left:auto;flex:0 0 auto;border:1px solid var(--line);background:rgba(255,255,255,0.7);border-radius:999px;padding:7px 12px;font-size:.78rem;font-weight:var(--fw-semibold);cursor:pointer;color:var(--text-body);white-space:nowrap">กลับหน้าหลัก</button>'
  +     '</div>'
  +   '</aside>'
  +   '<main class="content">'
  +     (S.screen === 'dashboard' ? mobileGreeting() : '')
  +     viewAlertBanner()
  +     '<header class="page-header" style="display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:26px">'
  +       '<div><div class="eyebrow" style="margin-bottom:7px">IT HELPDESK · 21 มิ.ย. 2569</div>'
  +       '<h1 style="margin:0;font-size:var(--text-title);font-weight:var(--fw-black);letter-spacing:var(--tracking-hero);line-height:var(--leading-tight)">'+esc(PAGE_TITLE[S.screen])+'</h1>'
  +       '<p style="margin:8px 0 0;color:var(--text-muted);font-size:1.02rem">'+esc(PAGE_SUB[S.screen])+'</p></div>'
  +     '</header>'
  +     body
  +   '</main>'
  + '</div>'
  + bottomNav();
}

