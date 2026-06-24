/* ============================================================
   QR + SCAN LANDING
   ============================================================ */
function scanUrlFor(assetId){
  if (LIFF_ID) return 'https://liff.line.me/' + LIFF_ID + '?asset=' + encodeURIComponent(assetId);
  return (location.origin + location.pathname) + '?asset=' + encodeURIComponent(assetId);
}
function qrBox(assetId){
  var src = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&data=' + encodeURIComponent(scanUrlFor(assetId));
  return '<div style="width:140px;height:140px;padding:11px;background:#fff;border:1px solid var(--line);border-radius:16px;display:flex;align-items:center;justify-content:center"><img src="'+src+'" alt="QR '+esc(assetId)+'" style="width:100%;height:100%;object-fit:contain"></div>';
}

function routeScan(assetId){
  S.scanAsset = assetId;
  if (hasBackend()){
    setState({ scanLoading:true });
    google.script.run
      .withSuccessHandler(handleScanResult)
      .withFailureHandler(function(){ setState({ scanLoading:false, screen:'dashboard' }); toastMsg('โหลดข้อมูลอุปกรณ์ไม่สำเร็จ'); })
      .getAssetEntry(assetId);
  } else {
    var mock   = MOCK_TICKETS.filter(function(t){ return (t.dev||'').indexOf(assetId) === 0; });
    var active = mock.filter(function(t){ return t.statusKey !== 'resolved'; })[0];
    handleScanResult({ ok:true, asset:{ id:assetId, name:(mock[0] ? mock[0].dev.split(' · ')[1] : assetId), location:(mock[0]?mock[0].place:'') }, activeTicket: active || null });
  }
}
function handleScanResult(res){
  S.scanLoading = false;
  try { sessionStorage.removeItem('scanAsset'); } catch (e){}
  if (!res || !res.ok){ toastMsg((res && res.error) || 'ไม่พบอุปกรณ์'); setState({ screen:'dashboard' }); return; }
  if (res.activeTicket){
    // มีงานที่ยังไม่ปิด → ไปหน้าสถานะของงานนั้น
    S.scanAssetInfo = res.asset;
    setState({ screen:'detail', activeTicketId:res.activeTicket.id });
    return;
  }
  setState({ scanAssetInfo:res.asset, category:'', desc:'', attach:0, screen:'scan' });
}

function viewScanLanding(){
  var a = S.scanAssetInfo || { id:S.scanAsset, name:'', brand:'', model:'', location:'' };
  var canSubmit = S.desc.trim().length > 0;
  var detail = function(label, val){
    if (!val) return '';
    return '<div style="display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid var(--line)"><span style="color:var(--text-muted);font-size:.84rem">'+esc(label)+'</span><span style="font-weight:var(--fw-semibold);font-size:.88rem;text-align:right">'+esc(val)+'</span></div>';
  };

  return '<section style="animation:riseIn .6s var(--ease) both"><div style="max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:14px">'
    + '<div class="glass" style="padding:18px 20px">'
    +   '<div style="display:flex;align-items:center;gap:13px;margin-bottom:12px">'
    +     '<div style="width:44px;height:44px;flex:0 0 auto;border-radius:12px;background:var(--grad-tint-pine);border:1px solid rgba(37,102,91,0.2);display:flex;align-items:center;justify-content:center;font-size:1.3rem">📷</div>'
    +     '<div style="flex:1;min-width:0"><div class="eyebrow" style="color:var(--accent-strong)">สแกน QR สำเร็จ</div>'
    +       '<div style="font-weight:var(--fw-bold);font-size:1.05rem;line-height:1.3">'+esc(a.name||a.id)+'</div></div>'
    +   '</div>'
    +   '<div style="display:flex;flex-direction:column">'
    +     detail('รหัสอุปกรณ์', a.id)
    +     detail('ยี่ห้อ', a.brand)
    +     detail('รุ่น', a.model)
    +     detail('สถานที่ติดตั้ง', a.location)
    +   '</div>'
    + '</div>'
    + '<div class="glass" style="padding:20px;display:flex;flex-direction:column;gap:14px">'
    +   '<div style="display:grid;gap:8px"><label class="label">รายละเอียดอาการที่พบ</label>'
    +     '<textarea class="field" rows="4" oninput="S.desc=this.value;refreshScanSubmit()" placeholder="อธิบายอาการที่พบ เช่น เปิดไม่ติด มีเสียงดัง จอไม่แสดงภาพ…">'+esc(S.desc)+'</textarea></div>'
    +   '<button id="scan-submit" class="btn-primary" style="width:100%;font-size:1rem;padding:15px" '+(canSubmit?'':'disabled')+' onclick="submitScanReport()">ส่งคำขอแจ้งซ่อม</button>'
    +   '<div id="scan-hint" style="font-size:.82rem;color:var(--text-muted);text-align:center">'+(canSubmit?'พร้อมส่งข้อมูลแล้ว':'กรอกรายละเอียดอาการก่อนส่ง')+'</div>'
    + '</div></section>';
}
function refreshScanSubmit(){
  var can = S.desc.trim().length > 0;
  var btn = document.getElementById('scan-submit'), hint = document.getElementById('scan-hint');
  if (btn) btn.disabled = !can;
  if (hint) hint.textContent = can ? 'พร้อมส่งข้อมูลแล้ว' : 'กรอกรายละเอียดอาการก่อนส่ง';
}

/* แจ้งซ่อมจากการสแกน — ไม่ต้องเลือกประเภท (รู้จากอุปกรณ์ที่สแกนแล้ว) */
function submitScanReport(){
  if (!S.desc.trim()) return;
  var a = S.scanAssetInfo || {};
  var payload = { category:'', desc:S.desc.trim(), asset_id:a.id, place:a.location||'',
                  requester_id:S.lineUserId, requester_name:S.displayName };
  if (hasBackend()){
    google.script.run
      .withSuccessHandler(function(res){
        toastMsg('เปิดงานซ่อมแล้ว • หมายเลขงาน ' + (res && res.id ? res.id : ''));
        setState({ desc:'', screen:(S.role==='staff'?'mytickets':'tickets') });
        refreshTickets();
      })
      .withFailureHandler(function(){ toastMsg('บันทึกงานซ่อมไม่สำเร็จ กรุณาลองใหม่'); })
      .createTicket(payload);
  } else {
    toastMsg('เปิดงานซ่อมแล้ว (โหมดสาธิต)');
    setState({ desc:'', screen:'mytickets' });
  }
}

