/* ah6_xlsx_sang_pb.gs — TU CHUYEN file Excel "KE HOACH GIA CONG XUONG AH6-KCC (....).xlsx" (xuong AH6 up len Drive, anh chi co quyen XEM)
   sang tab WEB AH6 PHAN BO (gid 2003) cua file LINK CHUNG theo MAU PB (mau/PB_TO_MAU.csv) de ban_do_qc.html tab San luong PB doc truc tiep.
   Ly do: file .xlsx tren Drive KHONG doc duoc bang gviz / IMPORTRANGE — phai chuyen sang Google Sheet truoc.
   PHIEN_BAN '14/11 ah6-linkchung'.

   CAI DAT (1 lan, tai khoan mydt@daidung.vn):
     1. script.google.com -> Du an moi -> dan toan bo file nay.
     2. Bang ben trai: Dich vu (+) -> "Drive API" -> Them (giu ten "Drive").
     3. Cai dat du an (banh rang) -> Mui gio (GMT+07:00) Ho Chi Minh.
     4. Chon ham caiDat -> Chay -> cho phep quyen. (tao trigger 30 phut; chay thu 1 lan luon)
   Chi DOC file xuong; chi GHI vao tab gid 2003 cua LINK CHUNG (khong dung tab khac). Ghi de tai cho, khong xoa / tao lai tab. */
var PHIEN_BAN = '14/11 ah6-linkchung';
var NGUON_ID = '1RfEk6C4suWi4PoBhNW1WIg3ctFjvm8eh';            // file Excel ke hoach gia cong AH6 (cua xuong, chi xem)
var DICH_ID = '1mD6Y3kalSDp7uXLHmRQ8ybkOGIEN_ruE7atPm1920BQ';   // LINK CHUNG cua anh (14/11 gom ve 1 link)
var DICH_GID = 2003;   // tab WEB AH6 PHAN BO
var TZ = 'Asia/Ho_Chi_Minh';

function caiDat() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'chayAH6') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('chayAH6').timeBased().everyMinutes(30).create();
  chayAH6(true);
}

/* epBuoc = true: chay ca khi file xuong chua doi */
function chayAH6(epBuoc) {
  var khoa = LockService.getScriptLock();
  try {
    if (!khoa.tryLock(5000)) return;
    var P = PropertiesService.getScriptProperties();
    var f = DriveApp.getFileById(NGUON_ID);
    var mod = String(f.getLastUpdated().getTime());
    if (epBuoc !== true && mod === P.getProperty('MOD')) return;
    var tam = Drive.Files.create({ name: '_tam_AH6_' + Date.now(), mimeType: MimeType.GOOGLE_SHEETS }, f.getBlob());
    try {
      var kq = docKeHoach(SpreadsheetApp.openById(tam.id));
      if (!kq) throw new Error('Khong tim thay tab nao co "THANG mm.yyyy" + dong tieu de "Stt"');
      ghiDich(kq);
      P.setProperty('MOD', mod);
      Logger.log('OK ' + kq.ym + ': ' + kq.ds.length + ' du an');
    } finally {
      try { Drive.Files.remove(tam.id); } catch (e) { DriveApp.getFileById(tam.id).setTrashed(true); }
    }
  } finally {
    khoa.releaseLock();
  }
}

/* Chon tab cua THANG HIEN TAI; chua co thi lay thang lon nhat. Chi lay to RAP HOAN THIEN (TO RAP HTn) — khau Kich thuoc. */
function docKeHoach(ss) {
  var nay = Utilities.formatDate(new Date(), TZ, 'yyyy-MM'), cac = [];
  ss.getSheets().forEach(function (sh) {
    var n = Math.min(sh.getLastRow(), 400), c = Math.min(sh.getLastColumn(), 12);
    if (n < 3 || c < 6) return;
    var v = sh.getRange(1, 1, n, c).getDisplayValues(), ym = '';
    for (var i = 0; i < Math.min(6, v.length) && !ym; i++) {
      var m = /TH[AÁ]NG\s*(\d{1,2})\s*[.\/]\s*(\d{4})/i.exec(v[i].join(' '));
      if (m) ym = m[2] + '-' + ('0' + m[1]).slice(-2);
    }
    if (ym) cac.push({ ym: ym, v: v });
  });
  if (!cac.length) return null;
  cac.sort(function (a, b) { return a.ym < b.ym ? 1 : -1; });
  var chon = cac.filter(function (x) { return x.ym === nay; })[0] || cac[0];
  var v = chon.v, dau = -1;
  for (var i = 0; i < v.length; i++) if (/^stt$/i.test(String(v[i][0]).trim())) { dau = i; break; }
  if (dau < 0) return null;
  var to = '', G = {}, thu = [];
  for (var r = dau + 1; r < v.length; r++) {
    var a = String(v[r][0]).trim(), b = String(v[r][1]).trim(), c = String(v[r][2]).replace(/\s+/g, ' ').trim(), d = String(v[r][3]).trim();
    if (/TOTAL|T[ỔO]NG C[ỘO]NG/i.test(a + ' ' + b + ' ' + d)) continue;          // dong cong
    if (/NG[UƯ][OỜ]I L[AẬ]P|^An H[aạ]/i.test(a + ' ' + b)) break;              // het bang
    var m = /R[AÁ]P\s*HT\s*(\d+)/i.exec(b);
    if (m) to = 'RHT' + m[1]; else if (/T[ỔO]\s|H[AÀ]N|VISUAL|NCLS/i.test(b)) to = '';  // to han / visual: bo (khong phai khau rap)
    if (!to || !c) continue;
    var kg = soKg(v[r][5]);
    if (!(kg > 0)) continue;
    if (!G[c]) { G[c] = { ten: c, kl: 0, to: {}, thu: [] }; thu.push(c); }
    G[c].kl += kg; G[c].to[to] = (G[c].to[to] || 0) + kg; if (G[c].thu.indexOf(to) < 0) G[c].thu.push(to);
  }
  var ds = thu.map(function (k) { return G[k]; }).sort(function (x, y) { return y.kl - x.kl; });
  return { ym: chon.ym, ds: ds };
}

function soKg(x) {
  var s = String(x == null ? '' : x).replace(/[^\d.,]/g, '');
  if (!s) return null;
  if (/^\d{1,3}([.,]\d{3})+$/.test(s)) s = s.replace(/[.,]/g, '');
  else s = s.replace(',', '.');
  var n = parseFloat(s);
  return isFinite(n) ? n : null;
}

function tan(kg) { return (kg / 1000).toFixed(2).replace('.', ','); }   // chu so kieu VN: trang doc bang pbSo()

function ghiDich(kq) {
  var mm = kq.ym.slice(5) + '/' + kq.ym.slice(0, 4);
  var out = [
    ['', 'Tự sinh từ file Excel "KẾ HOẠCH GIA CÔNG XƯỞNG AH6-KCC" lúc ' + Utilities.formatDate(new Date(), TZ, 'dd/MM/yyyy HH:mm') + ' (Apps Script ' + PHIEN_BAN + ') — KHÔNG sửa tay', '', '', '', '', '', '', '', ''],
    ['', 'KHỐI LƯỢNG PHÂN BỔ DỰ ÁN THÁNG ' + mm + ' XƯỞNG AH6', '', '', '', '', '', '', '', ''],
    ['', 'STT', 'Dự Án', 'Khối lượng (tấn)', 'Còn Lại', 'Ráp Thô', 'Ráp Hoàn Thiện', 'Khối lượng (tấn) RHT', '', '']
  ];
  kq.ds.forEach(function (g, i) {
    g.thu.forEach(function (t, j) {
      out.push(['', j ? '' : String(i + 1), j ? '' : g.ten, j ? '' : tan(g.kl), '', '', t, tan(g.to[t]), '', '']);
    });
  });
  var sh = SpreadsheetApp.openById(DICH_ID).getSheets().filter(function (x) { return x.getSheetId() === DICH_GID; })[0];
  if (!sh) throw new Error('Khong thay tab gid ' + DICH_GID + ' (WEB AH6 PHAN BO) trong LINK CHUNG — dung xoa / tao lai tab nay');
  sh.getRange(1, 1, Math.max(sh.getMaxRows(), out.length), 10).clearContent();
  if (sh.getMaxRows() < out.length) sh.insertRowsAfter(sh.getMaxRows(), out.length - sh.getMaxRows());
  var rg = sh.getRange(1, 1, out.length, 10);
  rg.setNumberFormat('@');
  rg.setValues(out);
}
