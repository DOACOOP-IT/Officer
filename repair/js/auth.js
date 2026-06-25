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

/* หน้า login (เปิดจากคอม/นอกแอป LINE): user/pass + ปุ่ม LINE */
function viewLogin(){
  if (S.booting)      return viewBooting();
  if (S.needRegister) return viewNeedRegister();
  if (S.noAccess)     return viewNoAccess();

  var err = S.loginError
    ? '<div style="background:var(--danger-soft);border:1px solid rgba(176,93,70,0.2);color:var(--danger);border-radius:var(--radius-md);padding:11px 14px;font-size:.86rem;font-weight:var(--fw-semibold)">'+esc(S.loginError)+'</div>'
    : '';
  var loading = S.loginLoading;

  return authShell('<div class="glass" style="padding:32px">'
    + '<div class="eyebrow">SECURE ACCESS</div>'
    + '<h2 style="margin:6px 0 20px;font-size:1.35rem;font-weight:var(--fw-bold)">เข้าสู่ระบบ</h2>'
    + '<div style="display:flex;flex-direction:column;gap:14px">'
    +   '<div style="display:grid;gap:7px"><label class="label">ชื่อผู้ใช้</label>'
    +     '<input class="field" id="login-user" value="'+esc(S.loginUser||'')+'" oninput="S.loginUser=this.value" placeholder="ชื่อผู้ใช้"></div>'
    +   '<div style="display:grid;gap:7px"><label class="label">รหัสผ่าน</label>'
    +     '<input class="field" id="login-pass" type="password" value="'+esc(S.loginPass||'')+'" oninput="S.loginPass=this.value" onkeydown="if(event.key===\'Enter\')doPasswordLogin()" placeholder="รหัสผ่าน"></div>'
    +   err
    +   '<button class="btn-primary" style="margin-top:4px;width:100%;font-size:1.02rem;padding:15px"'+(loading?' disabled':'')+' onclick="doPasswordLogin()">'+(loading?'กำลังเข้าสู่ระบบ…':'เข้าสู่ระบบ')+'</button>'
    + '</div>'
    + '<div style="display:flex;align-items:center;gap:12px;margin:18px 0"><div style="flex:1;height:1px;background:var(--line)"></div><span style="font-size:.8rem;color:var(--text-muted)">หรือ</span><div style="flex:1;height:1px;background:var(--line)"></div></div>'
    + '<button onclick="doLineLogin()" style="width:100%;border:0;border-radius:12px;background:#06C755;color:#fff;font-weight:var(--fw-bold);font-size:1rem;padding:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px">'
    +   '<span style="width:24px;height:24px;border-radius:6px;background:#fff;color:#06C755;display:flex;align-items:center;justify-content:center;font-weight:var(--fw-black);font-size:.7rem">LINE</span>เข้าสู่ระบบด้วย LINE</button>'
    + '</div>');
}

function applyProfile(res){
  S.loggedIn = true; S.displayName = res.name || ''; S.role = res.role || 'staff';
  S.department = res.department || ''; S.lineUserId = res.userID || '';
  if (res.pictureUrl) LINE.profile = { pictureUrl: res.pictureUrl, displayName: res.name };
  S.loginLoading = false; S.loginError = ''; S.loginPass = '';
  loadBootData(function(){
    if (S.scanAsset) routeScan(S.scanAsset);
    else { S.screen = homeScreen(); render(); }
    fetchAlerts();
  });
}

function doPasswordLogin(){
  var u = (S.loginUser || '').trim(), p = (S.loginPass || '');
  if (!u || !p){ setState({ loginError:'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' }); return; }
  if (S.loginLoading) return;
  setState({ loginError:'', loginLoading:true });
  google.script.run
    .withSuccessHandler(function(res){
      if (res && res.ok) applyProfile(res);
      else setState({ loginLoading:false, noAccess:!!(res && res.noAccess), loginError:(res && res.error) || 'เข้าสู่ระบบไม่สำเร็จ' });
    })
    .withFailureHandler(function(){ setState({ loginLoading:false, loginError:'เชื่อมต่อระบบไม่สำเร็จ กรุณาลองใหม่' }); })
    .loginByPassword(u, p);
}

function doLineLogin(){
  if (liffEnabled()){ try { liff.login(); return; } catch(e){} }
  toastMsg('เข้าสู่ระบบด้วย LINE ไม่พร้อมใช้งานขณะนี้');
}

function logout(){
  if (typeof stopPolling === 'function') stopPolling();
  if (liffEnabled() && liff.isLoggedIn()) { try { liff.logout(); } catch(e){} }
  setState({ loggedIn:false, displayName:'', role:'', department:'', lineUserId:'', loginUser:'', loginPass:'', loginError:'', alerts:[], alertDismissed:false, needRegister:false, noAccess:false });
}

