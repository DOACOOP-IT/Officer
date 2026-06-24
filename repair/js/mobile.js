/* ============================================================
   MOBILE QUICK REPORT
   ============================================================ */
function viewMobile(){
  var canSubmit = S.desc.trim().length > 0;
  return '<section style="animation:riseIn .6s var(--ease) both;display:flex;justify-content:center;padding-top:6px">'
  + '<div style="width:384px;flex:0 0 auto;background:#1e2b28;border-radius:48px;padding:13px;box-shadow:0 40px 80px rgba(29,44,39,0.34)">'
  +   '<div style="background:var(--app-background);border-radius:37px;overflow:hidden;height:768px;display:flex;flex-direction:column;position:relative">'
  +     '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 26px 6px;font-size:.78rem;font-weight:var(--fw-bold);color:var(--ink-900)"><span>9:41</span><span style="display:flex;gap:5px;align-items:center"><span style="width:16px;height:8px;border:1.5px solid var(--ink-900);border-radius:2px;display:inline-block"></span></span></div>'
  +     '<div style="flex:1;overflow-y:auto;padding:14px 18px 22px;display:flex;flex-direction:column;gap:16px">'
  +       '<div><div class="eyebrow" style="font-size:.7rem">SCAN · แจ้งซ่อมด่วน</div><h2 style="margin:5px 0 0;font-size:1.5rem;font-weight:var(--fw-black);letter-spacing:var(--tracking-tight)">แจ้งซ่อมหน้างาน</h2></div>'
  +       '<div style="display:flex;align-items:center;gap:12px;padding:13px 15px;border-radius:var(--radius-md);background:var(--grad-tint-pine);border:1px dashed rgba(37,102,91,0.34)">'
  +         '<div style="width:38px;height:38px;flex:0 0 auto;border-radius:10px;background:#fff;border:1px solid rgba(37,102,91,0.2);display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:2px;padding:6px"><span style="background:var(--accent);border-radius:1px"></span><span></span><span style="background:var(--accent);border-radius:1px"></span><span></span><span style="background:var(--accent);border-radius:1px"></span><span></span><span style="background:var(--accent);border-radius:1px"></span><span></span><span style="background:var(--accent);border-radius:1px"></span></div>'
  +         '<div style="flex:1;min-width:0"><div class="eyebrow" style="font-size:.66rem;color:var(--accent-strong)">สแกนสำเร็จ</div><div style="font-weight:var(--fw-bold);font-size:.9rem">NB-00742 · Dell Latitude</div></div></div>'
  +       '<div><div style="font-size:.86rem;color:var(--text-muted);font-weight:var(--fw-semibold);margin-bottom:9px">อาการที่พบ</div>'
  +         '<textarea class="field" rows="3" style="padding:14px 15px;resize:none" oninput="S.desc=this.value;refreshMobileSubmit()" placeholder="พิมพ์อาการสั้นๆ…">'+esc(S.desc)+'</textarea>'
  +         '<button onclick="addPhoto()" style="margin-top:10px;width:100%;border:1px dashed rgba(37,102,91,0.34);background:var(--accent-soft);border-radius:var(--radius-md);padding:14px;cursor:pointer;color:var(--accent-strong);font-weight:var(--fw-semibold);font-size:.92rem;min-height:50px">+ ถ่ายรูปแนบ ('+S.attach+')</button></div>'
  +       '<button id="mobile-submit" class="btn-primary" style="margin-top:auto;width:100%;font-size:1.05rem;padding:17px;min-height:56px" '+(canSubmit?'':'disabled')+' onclick="submitMobile()">ส่งแจ้งซ่อม</button>'
  +     '</div>'
  +   '</div>'
  + '</div></section>';
}
function refreshMobileSubmit(){
  var btn = document.getElementById('mobile-submit');
  if (btn) btn.disabled = S.desc.trim().length === 0;
}
function submitMobile(){
  if (S.desc.trim().length === 0) return;
  toastMsg('ส่งแจ้งซ่อมด่วนแล้ว • หมายเลขงาน JOB-2569-0143');
}

