/* ============================================================
   STATIC MOCK DATA
   ============================================================ */
var M = 'var(--ink-500)', W = 'var(--warning)', D = 'var(--danger)';

function tone(k){
  return ({
    success:{ bg:'var(--accent-soft)', fg:'var(--accent-strong)', bd:'rgba(37,102,91,0.16)' },
    warning:{ bg:'var(--warning-soft)', fg:'var(--warning)', bd:'rgba(179,132,44,0.18)' },
    danger: { bg:'var(--danger-soft)', fg:'var(--danger)', bd:'rgba(176,93,70,0.18)' },
    muted:  { bg:'rgba(104,117,113,0.10)', fg:'var(--ink-500)', bd:'rgba(104,117,113,0.22)' },
  })[k];
}

/* Raw ticket rows (slaTone: 'muted'|'warning'|'danger'). Local fallback used
   until Sheet data arrives via getBootData(). */
var MOCK_TICKETS = [
  { id:'JOB-2569-0142', dev:'NB-00742 · Notebook Dell Latitude 5440',   by:'สมหญิง การเงิน',  tech:'วิทยา ช่างเทคนิค', sla:'เกินกำหนด 1:30 ชม.', slaTone:'danger',  status:'กำลังซ่อม',     statusKey:'inprogress', place:'อาคาร 1 ชั้น 3 — ฝ่ายสินเชื่อ',  at:'24 มิ.ย. 2569 · 09:12', desc:'เครื่องเปิดไม่ติด กดปุ่ม power แล้วไฟกะพริบแต่จอไม่แสดงภาพ', solution:'', parts:'', work_hours:'', resolved_at:'' },
  { id:'JOB-2569-0141', dev:'PR-00118 · เครื่องพิมพ์ HP LaserJet M404', by:'ธนา บัญชี',       tech:'—',                 sla:'เหลือ 5:30 ชม.',    slaTone:'muted',   status:'รอรับงาน',      statusKey:'pending',    place:'อาคาร 1 ชั้น 2 — ฝ่ายบัญชี',    at:'24 มิ.ย. 2569 · 09:12', desc:'กระดาษติดในเครื่องพิมพ์ ดึงออกไม่ได้',                        solution:'', parts:'', work_hours:'', resolved_at:'' },
  { id:'JOB-2569-0140', dev:'SW-00031 · Switch Cisco Catalyst 2960',    by:'นิตยา บัญชี',     tech:'วิทยา ช่างเทคนิค', sla:'เหลือ 3:00 ชม.',    slaTone:'muted',   status:'ส่งบริษัทแล้ว', statusKey:'outsourced', place:'ห้อง Server ชั้น 4',              at:'24 มิ.ย. 2569 · 09:12', desc:'เน็ตหลุดทั้งชั้น สงสัย Switch มีปัญหา',                       solution:'ส่ง Cisco TAC', parts:'', work_hours:'', resolved_at:'' },
  { id:'JOB-2569-0139', dev:'PC-00256 · คอมพิวเตอร์ Lenovo ThinkCentre',by:'อภิชาติ อำนวยการ',tech:'วิทยา ช่างเทคนิค', sla:'ภายในเวลา',         slaTone:'muted',   status:'ปิดงานแล้ว',    statusKey:'resolved',   place:'อาคาร 2 ชั้น 1 — งานทะเบียน',  at:'24 มิ.ย. 2569 · 09:12', desc:'เปิดไม่ติด มีเสียงบี๊บ',                                      solution:'เปลี่ยน RAM 1 แถว', parts:'RAM DDR4 8GB', work_hours:'2', resolved_at:'24 มิ.ย. 2569 · 14:00' },
  { id:'JOB-2569-0138', dev:'MN-00390 · จอภาพ Samsung 24 นิ้ว',          by:'กมล สินเชื่อ',   tech:'วิทยา ช่างเทคนิค', sla:'ภายในเวลา',         slaTone:'muted',   status:'ปิดงานแล้ว',    statusKey:'resolved',   place:'อาคาร 1 ชั้น 1 — ประชาสัมพันธ์', at:'24 มิ.ย. 2569 · 09:12', desc:'หน้าจอดำ ไม่รับสัญญาณ',                                       solution:'เปลี่ยนสาย HDMI', parts:'สาย HDMI', work_hours:'1', resolved_at:'24 มิ.ย. 2569 · 11:30' },
  { id:'JOB-2569-0137', dev:'UP-00055 · UPS APC Smart-UPS 3kVA',        by:'ปรียา อำนวยการ',  tech:'—',                 sla:'เหลือ 8:00 ชม.',    slaTone:'muted',   status:'รอรับงาน',      statusKey:'pending',    place:'ห้อง Server ชั้น 4',              at:'24 มิ.ย. 2569 · 09:12', desc:'UPS ส่งเสียงดังผิดปกติ สลับไฟบ่อย',                           solution:'', parts:'', work_hours:'', resolved_at:'' },
  { id:'JOB-2569-0136', dev:'FW-00009 · Firewall FortiGate 60F',        by:'ระบบอัตโนมัติ',   tech:'วิทยา ช่างเทคนิค', sla:'เหลือ 1:05 ชม.',    slaTone:'warning', status:'กำลังซ่อม',     statusKey:'inprogress', place:'ห้อง Server ชั้น 4',              at:'24 มิ.ย. 2569 · 09:12', desc:'Firewall ไม่ตอบสนอง อินเทอร์เน็ตใช้ไม่ได้ทั้งองค์กร',         solution:'', parts:'', work_hours:'', resolved_at:'' },
  { id:'JOB-2569-0135', dev:'NB-00735 · Notebook HP ProBook 450',       by:'สุดา บุคคล',      tech:'วิทยา ช่างเทคนิค', sla:'ภายในเวลา',         slaTone:'muted',   status:'ปิดงานแล้ว',    statusKey:'resolved',   place:'อาคาร 2 ชั้น 3 — ฝ่ายบุคคล',    at:'24 มิ.ย. 2569 · 09:12', desc:'พัดลมดังมาก เครื่องร้อน',                                     solution:'เปลี่ยนพัดลม CPU', parts:'Fan CPU', work_hours:'2', resolved_at:'24 มิ.ย. 2569 · 13:00' },
  { id:'JOB-2569-0134', dev:'AP-00021 · Access Point Ubiquiti U6',      by:'วิชัย สมาชิก',    tech:'—',                 sla:'เหลือ 12:00 ชม.',   slaTone:'muted',   status:'รอรับงาน',      statusKey:'pending',    place:'อาคาร 1 ชั้น 5',                  at:'24 มิ.ย. 2569 · 09:12', desc:'Wi-Fi ช้ามาก ใช้งานไม่ได้ในบริเวณชั้น 5',                     solution:'', parts:'', work_hours:'', resolved_at:'' },
];

/* Decorate a raw ticket row with presentation values (badge tones by status). */
var STATUS_TONE = { pending:'warning', inprogress:'success', outsourced:'warning', resolved:'success' };
function decorateTicket(t){
  var tn = tone(STATUS_TONE[t.statusKey] || 'success');
  return { id:t.id, dev:t.dev, by:t.by, tech:t.tech, status:t.status,
           statusKey:t.statusKey, place:t.place, at:t.at || '21 มิ.ย. 2569 · 09:12',
           requester_id:t.requester_id || '', phone:t.phone || '',
           desc:t.desc || '', solution:t.solution || '', parts:t.parts || '', work_hours:t.work_hours || '', resolved_at:t.resolved_at || '', photos:t.photos || [],
           bg:tn.bg, fg:tn.fg, bd:tn.bd };
}

function allTickets(){
  var raw = (S.ticketsRaw && S.ticketsRaw.length) ? S.ticketsRaw : MOCK_TICKETS;
  return raw.map(decorateTicket);
}

var KB = [
  { t:'วิธีแก้ Notebook เปิดไม่ติด / ไฟไม่เข้า', meta:'ฮาร์ดแวร์ • อ่าน 1,240 ครั้ง' },
  { t:'เครื่องพิมพ์ HP ขึ้น Error E0 หรือกระดาษติด', meta:'อุปกรณ์ต่อพ่วง • อ่าน 980 ครั้ง' },
  { t:'รีเซ็ตการตั้งค่าเครือข่ายบน Windows 11', meta:'เครือข่าย • อ่าน 2,310 ครั้ง' },
];

var TIMELINE = [
  { when:'21 มิ.ย. 2569 · 09:12', title:'เปิดงานซ่อมอัตโนมัติ', desc:'สร้างจากการสแกน QR หน้างาน', color:'var(--accent)' },
  { when:'21 มิ.ย. 2569 · 10:40', title:'มอบหมายและรับงาน', desc:'วิทยา (ช่าง) รับผิดชอบงานนี้', color:'var(--accent)' },
  { when:'21 มิ.ย. 2569 · 11:15', title:'วินิจฉัยอาการเบื้องต้น', desc:'ตรวจพบหน่วยความจำ (RAM) เสีย 1 แถว', color:'var(--warning)' },
  { when:'กำลังดำเนินการ', title:'รออะไหล่ทดแทน', desc:'เบิกอะไหล่จากคลัง คาดได้รับ 22 มิ.ย.', color:'var(--warning)' },
  { when:'คาดเสร็จ 22 มิ.ย. 2569', title:'ติดตั้งและทดสอบ', desc:'ยังไม่เริ่มดำเนินการ', color:'rgba(104,117,113,0.45)' },
];

var FREE_DEVICES = [
  { id:'NB-00755', label:'NB-00755 · Notebook Lenovo ThinkPad (สำรอง)' },
  { id:'PJ-00012', label:'PJ-00012 · โปรเจกเตอร์ Epson EB-X51' },
  { id:'CM-00008', label:'CM-00008 · กล้อง Logitech BRIO' },
  { id:'NB-00760', label:'NB-00760 · Notebook Dell (สำรอง)' },
];

var MOCK_LOANS = [
  { dev:'โปรเจกเตอร์ Epson EB-X51', by:'ฝ่ายสินเชื่อ', from:'18 มิ.ย.', to:'20 มิ.ย.', status:'อนุมัติแล้ว', tone:'success' },
  { dev:'Notebook Lenovo (สำรอง)', by:'ฝ่ายบัญชี', from:'12 มิ.ย.', to:'19 มิ.ย.', status:'เกินกำหนดคืน', tone:'danger' },
  { dev:'กล้อง Logitech BRIO', by:'ฝ่ายประชาสัมพันธ์', from:'21 มิ.ย.', to:'25 มิ.ย.', status:'รออนุมัติ', tone:'warning' },
  { dev:'UPS สำรอง 1kVA', by:'ห้อง Server', from:'05 มิ.ย.', to:'05 ก.ค.', status:'อนุมัติแล้ว', tone:'success' },
];

function loanHistory(){
  var raw = (S.loanRaw && S.loanRaw.length) ? S.loanRaw : MOCK_LOANS;
  return raw.map(function(l){
    var tn = tone(l.tone || 'warning') || tone('warning');
    return { loan_id:l.loan_id||'', dev:l.dev, by:l.by, from:l.from, to:l.to, status:l.status, statusRaw:l.status, bg:tn.bg, fg:tn.fg, bd:tn.bd };
  });
}

var CATEGORIES = [
  { key:'system',  th:'ระบบ',      en:'System',    desc:'ซอฟต์แวร์ / ระบบงาน / บัญชีผู้ใช้',
    icon:'<circle cx="12" cy="12" r="3.1"/><path d="M12 2.6v2.5M12 18.9v2.5M21.4 12h-2.5M5.1 12H2.6M18.66 5.34l-1.77 1.77M7.11 16.89l-1.77 1.77M18.66 18.66l-1.77-1.77M7.11 7.11 5.34 5.34"/>' },
  { key:'device',  th:'อุปกรณ์',   en:'Equipment', desc:'คอมพิวเตอร์ / เครื่องพิมพ์ / ฮาร์ดแวร์',
    icon:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8.5 20h7M12 16v4"/>' },
  { key:'network', th:'เครือข่าย', en:'Network',   desc:'อินเทอร์เน็ต / Wi-Fi / Switch',
    icon:'<path d="M2.6 8.7a14 14 0 0 1 18.8 0"/><path d="M5.7 12.1a9.6 9.6 0 0 1 12.6 0"/><path d="M8.8 15.5a5.1 5.1 0 0 1 6.4 0"/><circle cx="12" cy="18.8" r="0.9" fill="currentColor" stroke="none"/>' },
  { key:'other',   th:'อื่นๆ',     en:'Other',     desc:'อาคารสถานที่ / นอกเหนือหมวดข้างต้น',
    icon:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/>' },
];

/* 6-month repair trend (matches dashboard summary: 182 total) */
var TREND = [
  { m:'ม.ค.', v:24 }, { m:'ก.พ.', v:31 }, { m:'มี.ค.', v:28 },
  { m:'เม.ย.', v:35 }, { m:'พ.ค.', v:33 }, { m:'มิ.ย.', v:31 },
];

