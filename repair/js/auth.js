/* ============================================================
   AUTH GATE — แสดงระหว่าง LIFF init / ต้องลงทะเบียน / โหมดสาธิต
   ============================================================ */
var DEMO_USERS = {
  admin: { name:'สมชาย (หัวหน้าสารสนเทศ)', role:'admin', department:'สารสนเทศ', userId:'demo-admin' },
  tech:  { name:'วิทยา (จนท.สารสนเทศ)',    role:'tech',  department:'สารสนเทศ', userId:'demo-tech'  },
  staff: { name:'สมหญิง การเงิน',          role:'staff', department:'การเงิน',  userId:'demo-staff' },
};

function authShell(inner){
  return ''
  + '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px">'
  +   '<div style="width:100%;max-width:430px;animation:riseIn .6s var(--ease) both">'
  +     '<div style="text-align:center;margin-bottom:26px">'
  +       '<div style="width:72px;height:72px;margin:0 auto 16px;border-radius:20px;background:var(--grad-accent);box-shadow:var(--shadow-accent);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:var(--fw-black);font-size:1.4rem;position:relative;overflow:hidden"><span style="position:absolute;inset:0;background:radial-gradient(circle at 30% 22%,rgba(255,255,255,.4),transparent 60%)"></span><span style="position:relative">IT</span></div>'
  +       '<h1 style="margin:0;font-size:1.6rem;font-weight:var(--fw-black);letter-spacing:var(--tracking-tight)">ระบบแจ้งซ่อม IT</h1>'
  +       '<p style="margin:5px 0 0;color:var(--text-muted);font-size:.95rem">สอ.กรมวิชาการเกษตร จำกัด</p>'
  +     '</div>' + inner
  +   '</div>'
  + '</div>';
}

/* หน้ารอ LIFF init */
function viewBooting(){
  return authShell('<div class="glass" style="padding:40px;text-align:center;color:var(--text-muted)">'
    + '<div style="font-size:1.6rem;margin-bottom:10px">⏳</div>กำลังเชื่อมต่อ LINE…</div>');
}

/* หน้าต้องลงทะเบียนก่อน (LINE ID ไม่พบในระบบลงทะเบียน) */
function viewNeedRegister(){
  return authShell('<div class="glass" style="padding:32px;text-align:center;display:flex;flex-direction:column;gap:16px">'
    + '<div style="font-size:2rem">📝</div>'
    + '<h2 style="margin:0;font-size:1.3rem;font-weight:var(--fw-bold)">ยังไม่ได้ลงทะเบียน</h2>'
    + '<p style="margin:0;color:var(--text-muted);font-size:.92rem;line-height:1.6">บัญชี LINE ของคุณยังไม่อยู่ในระบบลงทะเบียน กรุณาลงทะเบียนก่อนใช้งานระบบแจ้งซ่อม</p>'
    + '<button class="btn-primary" style="padding:15px;font-size:1rem" onclick="goRegister()">ไปหน้าลงทะเบียน</button>'
    + '</div>');
}
function goRegister(){
  /* TODO: เปลี่ยนเป็น LIFF URL ของหน้าลงทะเบียนเดิม */
  toastMsg('กรุณาลงทะเบียนผ่านระบบ LINE ที่องค์กรกำหนด');
}

/* หน้าไม่มีสิทธิ์เข้าใช้ */
function viewNoAccess(){
  return authShell('<div class="glass" style="padding:32px;text-align:center;display:flex;flex-direction:column;gap:14px">'
    + '<div style="font-size:2rem">🚫</div>'
    + '<h2 style="margin:0;font-size:1.3rem;font-weight:var(--fw-bold)">ไม่มีสิทธิ์เข้าใช้</h2>'
    + '<p style="margin:0;color:var(--text-muted);font-size:.92rem">บัญชีของคุณไม่มีสิทธิ์เข้าใช้ระบบแจ้งซ่อม</p></div>');
}

/* โหมดสาธิต: เลือก role เพื่อทดสอบ (เมื่อไม่มี LIFF_ID) */
function viewLogin(){
  if (S.booting && liffEnabled()) return viewBooting();
  if (S.needRegister) return viewNeedRegister();
  if (S.noAccess)     return viewNoAccess();

  var pick = function(k, label, sub){
    var on = S.demoRole === k;
    return '<button onclick="S.demoRole=\''+k+'\';render()" style="text-align:left;border:1.5px solid '+(on?'var(--accent)':'var(--border)')+';background:'+(on?'var(--grad-tint-pine)':'rgba(255,255,255,0.7)')+';border-radius:var(--radius-md);padding:13px 16px;cursor:pointer;display:flex;align-items:center;gap:12px">'
      + '<span style="width:18px;height:18px;border-radius:999px;border:2px solid '+(on?'var(--accent)':'var(--line-strong)')+';background:'+(on?'var(--accent)':'transparent')+';flex:0 0 auto"></span>'
      + '<span><span style="display:block;font-weight:var(--fw-bold);font-size:.96rem;color:'+(on?'var(--accent-strong)':'var(--ink-900)')+'">'+esc(label)+'</span><span style="display:block;font-size:.8rem;color:var(--text-muted)">'+esc(sub)+'</span></span></button>';
  };

  return authShell('<div class="glass" style="padding:32px">'
    + '<div class="eyebrow">DEMO MODE · เลือกบทบาทเพื่อทดสอบ</div>'
    + '<h2 style="margin:6px 0 18px;font-size:1.35rem;font-weight:var(--fw-bold)">เข้าสู่ระบบ (สาธิต)</h2>'
    + '<div style="display:flex;flex-direction:column;gap:10px">'
    + pick('admin','หัวหน้าฝ่ายสารสนเทศ','admin · เห็นทุกงาน + ตรวจสอบย้อนหลัง')
    + pick('tech','เจ้าหน้าที่สารสนเทศ','tech · รับงาน/ซ่อม/ส่งบริษัท/ปิดงาน')
    + pick('staff','พนักงานทั่วไป (ผู้แจ้ง)','staff · แจ้งซ่อม + ติดตามงานของตัวเอง')
    + '</div>'
    + '<button class="btn-primary" style="margin-top:18px;width:100%;font-size:1.02rem;padding:15px" onclick="doDemoLogin()">เข้าสู่ระบบ</button>'
    + '<p style="margin:14px 0 0;font-size:.78rem;color:var(--text-muted);text-align:center">โหมดจริงจะระบุตัวตนผ่าน LINE อัตโนมัติ (ตั้งค่า LIFF_ID)</p>'
    + '</div>');
}

function doDemoLogin(){
  var u = DEMO_USERS[S.demoRole] || DEMO_USERS.admin;
  setState({ loggedIn:true, displayName:u.name, role:u.role, department:u.department,
             lineUserId:u.userId, screen:'dashboard', alertDismissed:false });
  if (ASSET_PARAM) routeScan(ASSET_PARAM);
  loadDemoAlerts();
}

function loadDemoAlerts(){
  if (S.role === 'staff')
    S.alerts = [{ type:'update', count:1, msg:'งานซ่อมของคุณ 1 รายการ มีการอัปเดตสถานะ' }];
  else
    S.alerts = [
      { type:'pending',    count:3, msg:'มีงานแจ้งซ่อมรอรับงาน 3 รายการ' },
      { type:'outsourced', count:1, msg:'งานที่ส่งบริษัท 1 รายการ รอปิดงาน' },
    ];
  renderToast();
}

function logout(){
  if (liffEnabled() && liff.isLoggedIn()) { try { liff.logout(); } catch(e){} }
  setState({ loggedIn:false, displayName:'', role:'', department:'', lineUserId:'', alerts:[], alertDismissed:false, needRegister:false, noAccess:false });
}

