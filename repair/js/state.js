/* ============================================================
   STATE
   ============================================================ */
var S = {
  screen: 'dashboard',
  loggedIn: false, loginUser: '', loginPass: '', loginError: '', loginLoading: false, displayName: '', role: '', department: '',
  demoRole: 'admin',
  lineUserId: '', booting: true, needRegister: false, noAccess: false,
  scanAsset: '', scanAssetInfo: null, scanLoading: false, scanPhotos: [],
  assets: [], reportDevice: '', detailHistory: null, filterTech: 'all', filterCategory: 'all',
  alerts: [], alertDismissed: false, navOpen: false,
  resolveForm: { solution: '', parts: '', hours: '', vendorNote: '' },
  category: '',
  desc: '', attach: 0,
  qrShow: true,
  ticketFilter: 'all',
  activeTicketId: 'JOB-2569-0142',
  loanTab: 'new',
  loanDevice: '', loanFrom: '', loanTo: '',
  commentDraft: '',
  comments: [
    { who: 'ระบบ', when: '09:12', text: 'เปิดงานซ่อมอัตโนมัติจากการสแกน QR หน้างาน', tone: 'sys' },
    { who: 'วิทยา (ช่าง)', when: '10:40', text: 'รับงานแล้ว กำลังตรวจสอบอาการเบื้องต้น', tone: 'tech' },
  ],
  deviceRegistry: [
    { id: 'NB-00742', name: 'Notebook Dell Latitude 5440' },
    { id: 'PR-00118', name: 'เครื่องพิมพ์ HP LaserJet M404' },
    { id: 'SW-00031', name: 'Switch Cisco Catalyst 2960' },
    { id: 'PC-00256', name: 'คอมพิวเตอร์ Lenovo ThinkCentre' },
    { id: 'MN-00390', name: 'จอภาพ Samsung 24 นิ้ว' },
  ],
  devForm: { open: false, mode: 'add', editId: null, id: '', name: '', error: '' },
  toast: null,
  loading: true,          // true until backend boot data arrives
  ticketsRaw: null,       // raw rows from the Sheet (null = use built-in mock)
  loanRaw: null,
};
var _toastTimer = null;

/* หน้านี้เรียก GAS ผ่าน fetch เสมอ (มี backend เสมอ) */
function hasBackend(){ return true; }

