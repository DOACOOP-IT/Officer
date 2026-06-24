/* ============================================================
   GAS JSON API (หน้านี้โฮสต์บน GitHub Pages → เรียก GAS ผ่าน fetch)
   ============================================================ */
var API_URL = 'https://script.google.com/macros/s/AKfycbw1muK2LLk21bL14PCbJF1q3lMaDUw2BwpqMRswPaBaBBxqclxXtHEe1Hkmo9CPuVZh/exec';

function _apiPayload(action, args){
  switch (action){
    case 'loginByLine':      return { lineUserId: args[0] };
    case 'loginByPassword':  return { username: args[0], password: args[1] };
    case 'getAssetEntry':    return { assetId: args[0] };
    case 'deleteDevice':     return { id: args[0] };
    case 'getMyTickets':     return { lineUserId: args[0] };
    case 'getTicketHistory': return { ticketId: args[0] };
    case 'getAlerts':        return { role: args[0], department: args[1], lineUserId: args[2] };
    default:                 return args[0] || {};
  }
}
function _apiCall(action, args, onOk, onErr){
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: action, payload: _apiPayload(action, args) })
  })
  .then(function(r){ return r.json(); })
  .then(function(j){ if (onOk) onOk(j); })
  .catch(function(err){ if (onErr) onErr(err); });
}
/* Shim: ให้โค้ดเดิม google.script.run.<action>() วิ่งผ่าน fetch */
var _API_ACTIONS = ['getBootData','loginByLine','loginByPassword','getAssetEntry','createTicket','assignTicket',
  'outsourceTicket','resolveTicket','getMyTickets','getAlerts','saveDevice','deleteDevice',
  'submitLoan','approveLoan','rejectLoan','returnLoan','getTicketHistory','ping'];
function _makeRunner(){
  var ok = null, err = null;
  var runner = {
    withSuccessHandler: function(f){ ok = f; return runner; },
    withFailureHandler: function(f){ err = f; return runner; },
  };
  _API_ACTIONS.forEach(function(name){
    runner[name] = function(){ _apiCall(name, Array.prototype.slice.call(arguments), ok, err); };
  });
  return runner;
}
var google = { script: { get run(){ return _makeRunner(); } } };

/* asset ที่สแกนมาจาก QR — อ่านจาก ?asset=, liff.state, hash; เก็บลง sessionStorage
   กันหายตอน LINE login redirect แล้วคืนค่าเมื่อ URL ว่าง */
function parseAssetParam(){
  function fromStr(s){
    if (!s) return '';
    try {
      var q = new URLSearchParams(s.charAt(0) === '?' ? s.slice(1) : s);
      if (q.get('asset')) return q.get('asset');
      var st = q.get('liff.state');
      if (st) return fromStr(decodeURIComponent(st));
    } catch (e){}
    return '';
  }
  var a = fromStr(location.search) || fromStr(location.hash);
  try {
    if (a) sessionStorage.setItem('scanAsset', a);
    else   a = sessionStorage.getItem('scanAsset') || '';
  } catch (e){}
  return a;
}
var ASSET_PARAM = parseAssetParam();

/* ============================================================
   LINE LIFF CONFIG
   - ใส่ LIFF_ID เมื่อสร้าง LIFF เสร็จ → ใช้งานโหมด LINE จริง
   - เว้นว่าง = โหมดสาธิต (เทสใน /dev / เบราว์เซอร์ปกติ)
   ============================================================ */
var LIFF_ID = '2009229714-ePEQuc3d';
var LINE = { ready: false, userId: '', profile: null };
function liffEnabled(){ return !!LIFF_ID && typeof liff !== 'undefined'; }

