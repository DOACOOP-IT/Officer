/* ============================================================
   BOOT
   ============================================================ */
function loadBootData(cb){
  if (!hasBackend()){ S.loading = false; if (cb) cb(); return; }
  google.script.run
    .withSuccessHandler(function(data){
      S.ticketsRaw = (data && data.tickets) || null;
      S.loanRaw    = (data && data.loans) || null;
      S.assets     = (data && data.assets) || S.assets || [];
      if (data && data.devices && data.devices.length)
        S.deviceRegistry = data.devices.map(function(d){ return { id:String(d.id), name:String(d.name) }; });
      S.loading = false; if (cb) cb(); fetchTechs(); startPolling(); render();
    })
    .withFailureHandler(function(){ S.loading = false; if (cb) cb(); render(); })
    .getBootData();
}

function fetchTechs(){
  if (!hasBackend()) return;
  google.script.run
    .withSuccessHandler(function(r){ if (r && r.ok) S.techs = r.techs || []; })
    .withFailureHandler(function(){})
    .getTechs();
}

/* ===== Manual refresh + auto-refresh (polling) ===== */
function doRefresh(){
  if (!hasBackend()){ toastMsg('โหมดสาธิต'); return; }
  toastMsg('กำลังอัปเดตข้อมูล…');
  loadBootData(function(){ fetchAlerts(); });
}

var _pollTimer = null, _lastTicketSig = '';
function ticketSig(){
  var t = S.ticketsRaw || [];
  return t.length + '|' + t.map(function(x){ return x.id + x.statusKey; }).join(',');
}
function startPolling(){
  stopPolling();
  _lastTicketSig = ticketSig();
  _pollTimer = setInterval(pollRefresh, 25000);
}
function stopPolling(){ if (_pollTimer){ clearInterval(_pollTimer); _pollTimer = null; } }
function maybeRender(){
  var ae = document.activeElement;
  if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) return; // กำลังพิมพ์อยู่ → ไม่ render ทับ
  render();
}
function pollRefresh(){
  if (!hasBackend() || !S.loggedIn) return;
  google.script.run
    .withSuccessHandler(function(data){
      if (!data) return;
      var oldIds = (S.ticketsRaw || []).map(function(x){ return x.id; });
      S.ticketsRaw = data.tickets || S.ticketsRaw;
      S.loanRaw    = data.loans   || S.loanRaw;
      S.assets     = data.assets  || S.assets;
      if (data.devices && data.devices.length)
        S.deviceRegistry = data.devices.map(function(d){ return { id:String(d.id), name:String(d.name) }; });
      var newIds = (data.tickets || []).map(function(x){ return x.id; }).filter(function(id){ return oldIds.indexOf(id) < 0; });
      var sig = ticketSig();
      if (sig !== _lastTicketSig){
        _lastTicketSig = sig;
        if (newIds.length && (S.role === 'tech' || S.role === 'admin'))
          toastMsg('🔔 มีงานแจ้งซ่อมใหม่ ' + newIds.length + ' รายการ');
        fetchAlerts();
        maybeRender();
      }
    })
    .withFailureHandler(function(){})
    .getBootData();
}

function boot(){
  S.scanAsset = ASSET_PARAM || '';

  if (liffEnabled()){
    S.booting = true; render();
    liff.init({ liffId: LIFF_ID }).then(function(){
      /* LIFF คืนค่า ?asset= จาก liff.state หลัง init เสร็จ — อ่านใหม่ตรงนี้ */
      S.scanAsset = parseAssetParam() || S.scanAsset;
      /* ยังไม่ได้ login LINE:
         - อยู่ในแอป LINE (in-client) → login อัตโนมัติ
         - เปิดจากคอม/เบราว์เซอร์ทั่วไป → แสดงหน้า login (user/pass + ปุ่ม LINE) */
      if (!liff.isLoggedIn()){
        if (liff.isInClient()) { liff.login(); return; }
        S.booting = false; render(); return;
      }
      return liff.getProfile().then(function(p){
        LINE.userId = p.userId; LINE.profile = p;
        google.script.run
          .withSuccessHandler(function(res){
            S.booting = false;
            if (res && res.ok){
              S.loggedIn = true; S.displayName = res.name || p.displayName;
              S.role = res.role || 'staff'; S.department = res.department || '';
              S.lineUserId = res.userID || p.userId;
              loadBootData(function(){
                if (S.scanAsset) routeScan(S.scanAsset);
                else { S.screen = 'dashboard'; render(); }
                fetchAlerts();
              });
            } else if (res && res.noAccess){ S.noAccess = true; render(); }
            else { S.needRegister = true; render(); }
          })
          .withFailureHandler(function(){ S.booting = false; toastMsg('เชื่อมต่อระบบไม่สำเร็จ'); render(); })
          .loginByLine(p.userId);
      });
    }).catch(function(){ S.booting = false; toastMsg('เริ่ม LINE LIFF ไม่สำเร็จ'); render(); });
  } else {
    /* โหมดสาธิต — แสดงหน้าเลือกบทบาท */
    S.booting = false;
    loadBootData();
    render();
  }
  render();
}
boot();
