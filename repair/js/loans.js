/* ============================================================
   LOANS
   ============================================================ */
function viewLoans(){
  var seg = function(on){ return on
    ? 'background:var(--grad-accent);color:var(--text-on-accent);box-shadow:var(--shadow-accent)'
    : 'background:transparent;color:var(--text-muted);box-shadow:none'; };
  var canSubmit = !!(S.loanDevice && S.loanFrom && S.loanTo);

  var tabs = '<div style="display:flex;width:max-content;gap:4px;padding:4px;background:var(--surface-veil);border:1px solid var(--line);border-radius:999px;box-shadow:var(--shadow-soft);margin:0 auto 22px">'
    + '<button onclick="setLoanTab(\'new\')" style="border:0;border-radius:999px;padding:10px 20px;cursor:pointer;font-weight:var(--fw-semibold);font-size:.9rem;transition:var(--transition-base);'+seg(S.loanTab==='new')+'">ขอยืมใหม่</button>'
    + '<button onclick="setLoanTab(\'history\')" style="border:0;border-radius:999px;padding:10px 20px;cursor:pointer;font-weight:var(--fw-semibold);font-size:.9rem;transition:var(--transition-base);'+seg(S.loanTab==='history')+'">ประวัติการยืม</button></div>';

  var body;
  if (S.loanTab === 'new'){
    var opts = '<option value="">— เลือกอุปกรณ์ที่ว่าง —</option>' + FREE_DEVICES.map(function(d){
      return '<option value="'+esc(d.id)+'"'+(S.loanDevice===d.id?' selected':'')+'>'+esc(d.label)+'</option>'; }).join('');
    body = '<div class="glass" style="max-width:640px;margin:0 auto;padding:30px 32px;display:flex;flex-direction:column;gap:22px">'
      + '<div style="display:grid;gap:8px"><label class="label">อุปกรณ์ที่ว่าง</label><select class="field" onchange="S.loanDevice=this.value;refreshLoanSubmit()">'+opts+'</select></div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">'
      +   '<div style="display:grid;gap:8px"><label class="label">วันที่ยืม</label><input class="field" type="date" value="'+esc(S.loanFrom)+'" onchange="S.loanFrom=this.value;refreshLoanSubmit()"></div>'
      +   '<div style="display:grid;gap:8px"><label class="label">กำหนดคืน</label><input class="field" type="date" value="'+esc(S.loanTo)+'" onchange="S.loanTo=this.value;refreshLoanSubmit()"></div>'
      + '</div>'
      + '<div style="border-top:1px solid var(--line);padding-top:18px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">'
      +   '<span id="loan-hint" style="font-size:.84rem;color:var(--text-muted)">'+(canSubmit?'พร้อมส่งคำขอยืม':'เลือกอุปกรณ์และระบุวันที่ก่อนส่ง')+'</span>'
      +   '<button id="loan-submit" class="btn-primary" style="font-size:1rem;padding:15px 30px" '+(canSubmit?'':'disabled')+' onclick="submitLoan()">ส่งคำขอยืม</button>'
      + '</div></div>';
  } else {
    var cards = loanHistory().map(function(l){
      return '<div class="glass" style="border-radius:var(--radius-lg);box-shadow:var(--shadow-soft);padding:20px 22px">'
        + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px"><strong style="font-size:1rem;line-height:1.35">'+esc(l.dev)+'</strong>'
        + '<span style="flex:0 0 auto;display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border-radius:999px;font-size:.78rem;font-weight:var(--fw-bold);background:'+l.bg+';color:'+l.fg+';border:1px solid '+l.bd+';white-space:nowrap"><span style="width:7px;height:7px;border-radius:999px;background:currentColor;opacity:.7"></span>'+esc(l.status)+'</span></div>'
        + '<div style="font-size:.86rem;color:var(--text-muted);display:flex;flex-direction:column;gap:4px"><div>ผู้ยืม: <span style="color:var(--text-body);font-weight:var(--fw-semibold)">'+esc(l.by)+'</span></div><div>ช่วงยืม: '+esc(l.from)+' – '+esc(l.to)+'</div></div></div>';
    }).join('');
    body = '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;max-width:840px;margin:0 auto">'+cards+'</div>';
  }

  return '<section style="animation:riseIn .6s var(--ease) both">'+tabs+body+'</section>';
}

function setLoanTab(k){ setState({ loanTab:k }); }
function refreshLoanSubmit(){
  var can = !!(S.loanDevice && S.loanFrom && S.loanTo);
  var btn = document.getElementById('loan-submit'), hint = document.getElementById('loan-hint');
  if (btn) btn.disabled = !can;
  if (hint) hint.textContent = can ? 'พร้อมส่งคำขอยืม' : 'เลือกอุปกรณ์และระบุวันที่ก่อนส่ง';
}
function submitLoan(){
  if (!(S.loanDevice && S.loanFrom && S.loanTo)) return;
  var sel = FREE_DEVICES.filter(function(d){ return d.id === S.loanDevice; })[0];
  var payload = { dev: sel ? sel.label.split(' · ')[1] : S.loanDevice, from:S.loanFrom, to:S.loanTo };
  if (hasBackend()){
    google.script.run
      .withSuccessHandler(function(){
        toastMsg('ส่งคำขอยืมอุปกรณ์แล้ว • บันทึกลง Google Sheet · รออนุมัติ');
        setState({ loanDevice:'', loanFrom:'', loanTo:'', loanTab:'history' });
        refreshTickets();
      })
      .withFailureHandler(function(){ toastMsg('ส่งคำขอยืมไม่สำเร็จ กรุณาลองใหม่'); })
      .submitLoan(payload);
  } else {
    toastMsg('ส่งคำขอยืมอุปกรณ์แล้ว • รออนุมัติจากผู้ดูแลระบบ (โหมดสาธิต)');
  }
}

