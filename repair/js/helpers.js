/* ============================================================
   HELPERS
   ============================================================ */
function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function setState(patch){
  if (typeof patch === 'function') patch = patch(S);
  for (var k in patch) S[k] = patch[k];
  render();
}

function toastMsg(text){
  clearTimeout(_toastTimer);
  S.toast = text; renderToast();
  _toastTimer = setTimeout(function(){ S.toast = null; renderToast(); }, 4200);
}

/* ============================================================
   QR matrix (deterministic from device id) — drawn with divs
   ============================================================ */
function buildMatrix(seed){
  var h = 0, i;
  for (i = 0; i < seed.length; i++) h = (h * 131 + seed.charCodeAt(i)) >>> 0;
  var rnd = function(){ h = (h * 1103515245 + 12345) & 0x7fffffff; return h / 0x7fffffff; };
  var N = 13, dark = '#163f37';
  var g = [], r, c;
  for (r = 0; r < N; r++){ g.push([]); for (c = 0; c < N; c++) g[r].push(0); }
  var finder = function(r0, c0){
    for (var rr = 0; rr < 5; rr++) for (var cc = 0; cc < 5; cc++){
      var edge = rr === 0 || rr === 4 || cc === 0 || cc === 4;
      g[r0+rr][c0+cc] = (edge || (rr === 2 && cc === 2)) ? 1 : 0;
    }
  };
  finder(0,0); finder(0,N-5); finder(N-5,0);
  var inF = function(r,c){ return (r<5&&c<5)||(r<5&&c>=N-5)||(r>=N-5&&c<5); };
  for (r = 0; r < N; r++) for (c = 0; c < N; c++) if (!inF(r,c)) g[r][c] = rnd() > 0.52 ? 1 : 0;
  var html = '';
  for (r = 0; r < N; r++) for (c = 0; c < N; c++)
    html += '<div style="background:' + (g[r][c] ? dark : 'transparent') + '"></div>';
  return html;
}

/* ============================================================
   LINE CHART (inline SVG, no library)
   ============================================================ */
function lineChart(height){
  var w = 760, h = height || 260, padL = 36, padR = 18, padT = 18, padB = 30;
  var vals = TREND.map(function(t){ return t.v; });
  var max = Math.max.apply(null, vals) * 1.15, min = 0;
  var iw = w - padL - padR, ih = h - padT - padB;
  var xAt = function(i){ return padL + (iw * i / (TREND.length - 1)); };
  var yAt = function(v){ return padT + ih - ((v - min) / (max - min)) * ih; };
  var pts = TREND.map(function(t, i){ return xAt(i) + ',' + yAt(t.v); });
  var line = 'M' + pts.join(' L');
  var area = line + ' L' + xAt(TREND.length-1) + ',' + (padT+ih) + ' L' + xAt(0) + ',' + (padT+ih) + ' Z';
  var grid = '', g, gy, gv;
  for (g = 0; g <= 4; g++){
    gv = max * g / 4; gy = yAt(gv);
    grid += '<line x1="'+padL+'" y1="'+gy+'" x2="'+(w-padR)+'" y2="'+gy+'" stroke="rgba(27,40,38,0.07)" stroke-width="1"/>';
    grid += '<text x="'+(padL-8)+'" y="'+(gy+4)+'" text-anchor="end" font-size="11" fill="var(--ink-500)">'+Math.round(gv)+'</text>';
  }
  var dots = '', labels = '';
  TREND.forEach(function(t, i){
    dots += '<circle cx="'+xAt(i)+'" cy="'+yAt(t.v)+'" r="4.5" fill="#fff" stroke="var(--accent)" stroke-width="2.5"/>';
    labels += '<text x="'+xAt(i)+'" y="'+(h-9)+'" text-anchor="middle" font-size="12" fill="var(--ink-500)">'+t.m+'</text>';
  });
  return '<svg viewBox="0 0 '+w+' '+h+'" width="100%" height="'+h+'" preserveAspectRatio="xMidYMid meet" style="display:block">'
    + '<defs><linearGradient id="lcArea" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0%" stop-color="rgba(37,102,91,0.22)"/><stop offset="100%" stop-color="rgba(37,102,91,0)"/></linearGradient></defs>'
    + grid
    + '<path d="'+area+'" fill="url(#lcArea)"/>'
    + '<path d="'+line+'" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    + dots + labels + '</svg>';
}

/* ============================================================
   RENDER ENTRY
   ============================================================ */
function render(){
  var app = document.getElementById('app');
  if (!S.loggedIn){ app.innerHTML = viewLogin(); return; }
  app.innerHTML = viewApp();
}

function renderToast(){
  var el = document.getElementById('toast-el');
  if (!S.toast){ el.innerHTML = ''; return; }
  el.innerHTML =
    '<div style="position:fixed;top:24px;right:24px;z-index:80;display:flex;align-items:center;gap:14px;max-width:380px;padding:16px 20px;animation:slideToast .3s var(--ease) both" class="glass">'
    + '<div style="width:38px;height:38px;flex:0 0 auto;border-radius:999px;background:var(--accent);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:var(--fw-black);font-size:1.1rem">✓</div>'
    + '<div style="flex:1"><div style="font-weight:var(--fw-bold);font-size:.94rem">สำเร็จ</div>'
    + '<div style="font-size:.84rem;color:var(--text-muted)">'+esc(S.toast)+'</div></div>'
    + '<button onclick="dismissToast()" style="border:0;background:transparent;color:var(--ink-500);cursor:pointer;font-size:1.1rem;line-height:1">×</button></div>';
}
function dismissToast(){ clearTimeout(_toastTimer); S.toast = null; renderToast(); }

