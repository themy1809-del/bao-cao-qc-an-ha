/* =====================================================================
   BINH CHON QC AN HA — web app Apps Script (gan voi Google Sheet "QC An Ha — BINH CHON")
   PHIEN_BAN_BC2 = '14/11 ban-1'

   NGUYEN TAC
   - Nguoi bau dang nhap bang email cong ty (@daidung.vn) → he thong TU NHAN email, khong nhap ten, khong ma PIN.
   - Ung vien = tab UNG_VIEN (34 nhan su tham nien >= 1 nam). Nguoi bo phieu = tap the phong QC (tab NGUOI_BO_PHIEU).
   - Moi email dung 1 phieu, moi phieu chon dung SO_NGUOI_CHON (mac dinh 2) nguoi khac nhau, khong chon chinh minh.
   - Ket qua tinh lai sau MOI phieu va ghi vao tab KET_QUA; trang web tu lam moi moi 10 giay.
   - Anh nhan su doc tu thu muc Drive THU_MUC_ANH (ten file = "MSNV<tab>HO TEN"), khop theo MSNV, khong co thi theo ten.

   CACH TRIEN KHAI (lam 1 lan, ~10 phut, bang TAI KHOAN CONG TY mydt@daidung.vn):
   1. Mo Google Sheet "QC An Ha — BINH CHON (phieu + ket qua)" → Tien ich mo rong → Apps Script.
   2. Xoa code mau. Tao 2 tep: Code.gs (dan TOAN BO tep nay) va binh_chon.html (dan TOAN BO tep binh_chon.html). Luu.
   3. Banh rang (Cai dat du an) → tich "Hien thi tep manifest appsscript.json" → mo appsscript.json, dat:
        "timeZone": "Asia/Ho_Chi_Minh"
   4. Chon ham khoiTao → Chay → cap quyen (Sheet + Drive). Ket qua phai la "OK ..." o Nhat ky thuc thi.
   5. Trien khai → Trien khai moi → Loai: Ung dung web
        Mo ta: BINH CHON QC
        Thuc thi voi tu cach: TOI (mydt@daidung.vn)
        Nguoi co quyen truy cap: BAT KY AI TRONG daidung.vn   ← BAT BUOC (de he thong doc duoc email nguoi bau)
      → Trien khai → copy URL ket thuc bang /exec → gui Zalo cho phong QC.
   CAP NHAT CODE VE SAU: Trien khai → Quan ly trien khai → ✏ → Phien ban moi (GIU NGUYEN URL). KHONG tao trien khai moi.

   CAU HINH: sua truc tiep tab CAU_HINH (tieu de, so nguoi chon, mo/dong, han chot, cho sua phieu, ai duoc xem ket qua...).
   QUAN TRI: email trong CAU_HINH.QUAN_TRI_EMAIL thay them danh sach "chua nop" va xem ket qua ke ca khi dang an.
   ===================================================================== */
var PHIEN_BAN_BC2 = '14/11 ban-1';
var TAB = { CH: 'CAU_HINH', UV: 'UNG_VIEN', NBP: 'NGUOI_BO_PHIEU', PH: 'PHIEU', KQ: 'KET_QUA', LOG: 'NHAT_KY' };
var COT_PHIEU = ['THOI_DIEM', 'EMAIL', 'MSNV_NGUOI_BAU', 'TEN_NGUOI_BAU', 'CHON_MSNV', 'CHON_TEN', 'SO_LAN_GUI', 'GHI_CHU', 'PHIEN_BAN', 'ID_PHIEU'];

/* ---------- Khoi tao / kiem tra 1 lan ---------- */
function khoiTao() {
  var ss = SpreadsheetApp.getActive();
  Object.keys(TAB).forEach(function (k) { if (!ss.getSheetByName(TAB[k])) throw new Error('Thieu tab ' + TAB[k]); });
  var ph = ss.getSheetByName(TAB.PH);
  if (ph.getLastRow() === 0) { ph.appendRow(COT_PHIEU); ph.setFrozenRows(1); }
  var ch = docCauHinh_();
  if (!ch.THU_MUC_ANH) Logger.log('Chua co THU_MUC_ANH → trang se khong co anh (van chay duoc).');
  else { try { DriveApp.getFolderById(ch.THU_MUC_ANH).getName(); } catch (e) { throw new Error('Khong mo duoc thu muc anh: ' + e.message); } }
  ghiCauHinh_('PHIEN_BAN', PHIEN_BAN_BC2);
  capNhatKetQua_();
  return 'OK ' + PHIEN_BAN_BC2 + ' — ' + docUngVien_().length + ' ung vien, ' + docNguoiBoPhieu_().length + ' nguoi bo phieu';
}

/* ---------- Web app ---------- */
function doGet() {
  var ch = docCauHinh_();
  return HtmlService.createHtmlOutputFromFile('binh_chon')
    .setTitle(ch.TIEU_DE || 'Binh chon QC An Ha')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

/* Goi dau tien khi mo trang: email + cau hinh + ung vien + trang thai phieu cua toi (+ ket qua neu duoc xem). */
function khoiDong() {
  var email = emailHienTai_();
  var ch = docCauHinh_();
  var out = { ok: true, pb: PHIEN_BAN_BC2, email: email, ch: cauHinhCongKhai_(ch), uv: docUngVien_().filter(function (u) { return u.duocBau; }).map(uvGon_) };
  if (!email) { out.ok = false; out.loi = 'KHONG_EMAIL'; return out; }
  out.quanTri = laQuanTri_(email, ch);
  var toi = timNguoiBoPhieu_(email);
  if (toi) out.toi = { msnv: toi.msnv, ten: toi.ten, ghiChu: toi.ghiChu };
  else {
    out.toi = null;
    out.chuaGan = docNguoiBoPhieu_().filter(function (n) { return !n.email; }).map(function (n) { return { msnv: n.msnv, ten: n.ten, cd: n.cd }; });
  }
  var ph = timPhieu_(email);
  if (ph) out.phieu = { luc: ph.luc, chon: ph.chon, ten: ph.ten, lan: ph.lan };
  if (duocXemKetQua_(email, ch)) out.kq = layKetQua();
  out.trangThai = trangThaiBinhChon_(ch);
  return out;
}

/* Gan email dang nhap vao 1 dong NGUOI_BO_PHIEU chua co email (nguoi chon ten minh lan dau). */
function ganTen(msnv) {
  var email = emailHienTai_(); if (!email) throw new Error('Khong doc duoc email. Hay dang nhap bang email cong ty.');
  if (timNguoiBoPhieu_(email)) throw new Error('Email nay da duoc gan ten.');
  msnv = String(msnv || '').trim();
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = SpreadsheetApp.getActive().getSheetByName(TAB.NBP), v = sh.getDataRange().getValues(), h = chiSoCot_(v[0]);
    for (var i = 1; i < v.length; i++) {
      if (String(v[i][h.MSNV]).trim() === msnv) {
        if (String(v[i][h.EMAIL] || '').trim()) throw new Error('Ten nay da co nguoi khac nhan (' + anEmail_(v[i][h.EMAIL]) + '). Lien he quan tri.');
        sh.getRange(i + 1, h.EMAIL + 1).setValue(email);
        ghiLog_(email, 'GAN_TEN', msnv + ' ' + v[i][h.HO_TEN]);
        return { ok: true, toi: { msnv: msnv, ten: String(v[i][h.HO_TEN]) } };
      }
    }
    throw new Error('Khong thay MSNV ' + msnv + ' trong danh sach.');
  } finally { lock.releaseLock(); }
}

/* Nguoi khong co trong danh sach: tu khai ho ten (chi khi CHO_PHEP_NGOAI_DS = TRUE). */
function ganNgoaiDanhSach(hoTen) {
  var email = emailHienTai_(); if (!email) throw new Error('Khong doc duoc email.');
  var ch = docCauHinh_(); if (!laDung_(ch.CHO_PHEP_NGOAI_DS)) throw new Error('Danh sach bo phieu dang khoa. Lien he quan tri de duoc them ten.');
  if (timNguoiBoPhieu_(email)) throw new Error('Email nay da co ten.');
  hoTen = String(hoTen || '').replace(/\s+/g, ' ').trim(); if (hoTen.length < 4) throw new Error('Ho ten qua ngan.');
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = SpreadsheetApp.getActive().getSheetByName(TAB.NBP), h = chiSoCot_(sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0]);
    var row = []; row[h.MSNV] = ''; row[h.HO_TEN] = hoTen; row[h.EMAIL] = email; if (h.CHUC_DANH != null) row[h.CHUC_DANH] = ''; if (h.GHI_CHU != null) row[h.GHI_CHU] = 'Ngoai DS (tu khai ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM HH:mm') + ')';
    for (var i = 0; i < row.length; i++) if (row[i] === undefined) row[i] = '';
    sh.appendRow(row);
    ghiLog_(email, 'TU_KHAI', hoTen);
    return { ok: true, toi: { msnv: '', ten: hoTen, ghiChu: 'Ngoai DS' } };
  } finally { lock.releaseLock(); }
}

/* Gui phieu: chon = mang MSNV ung vien. Tra ve ket qua moi nhat. */
function guiPhieu(chon) {
  var email = emailHienTai_(); if (!email) throw new Error('Khong doc duoc email. Hay dang nhap bang email cong ty @daidung.vn.');
  var ch = docCauHinh_();
  var tt = trangThaiBinhChon_(ch); if (!tt.mo) throw new Error(tt.lyDo);
  var toi = timNguoiBoPhieu_(email); if (!toi) throw new Error('Ban chua chon ten minh trong danh sach.');
  var n = +ch.SO_NGUOI_CHON || 2;
  chon = (chon || []).map(function (x) { return String(x).trim(); }).filter(Boolean);
  var uniq = {}; chon.forEach(function (m) { uniq[m] = 1; });
  if (Object.keys(uniq).length !== n || chon.length !== n) throw new Error('Phai chon dung ' + n + ' nguoi khac nhau.');
  var uvMap = {}; docUngVien_().forEach(function (u) { if (u.duocBau) uvMap[u.msnv] = u; });
  var ten = chon.map(function (m) { var u = uvMap[m]; if (!u) throw new Error('Ung vien ' + m + ' khong hop le.'); return u.ten; });
  if (!laDung_(ch.TU_CHON_MINH)) {
    var kToi = khoaTen_(toi.ten);
    chon.forEach(function (m) { if (m === toi.msnv || khoaTen_(uvMap[m].ten) === kToi) throw new Error('Khong duoc chon chinh minh.'); });
  }
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = SpreadsheetApp.getActive().getSheetByName(TAB.PH), v = sh.getDataRange().getValues(), h = chiSoCot_(v[0]);
    var dong = -1, lan = 0;
    for (var i = 1; i < v.length; i++) if (String(v[i][h.EMAIL]).toLowerCase() === email.toLowerCase()) { dong = i + 1; lan = +v[i][h.SO_LAN_GUI] || 1; }
    if (dong > 0 && !laDung_(ch.CHO_SUA_PHIEU)) throw new Error('Ban da gui phieu roi. Dot nay khong cho sua phieu.');
    var now = new Date();
    var row = [now, email, toi.msnv, toi.ten, chon.join(';'), ten.join('; '), lan + 1, toi.ghiChu && /ngoai/i.test(toi.ghiChu) ? 'Ngoai DS' : '', PHIEN_BAN_BC2, Utilities.getUuid().slice(0, 8)];
    if (dong > 0) sh.getRange(dong, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
    ghiLog_(email, dong > 0 ? 'SUA_PHIEU' : 'GUI_PHIEU', ten.join('; '));
    capNhatKetQua_();
  } finally { lock.releaseLock(); }
  var out = { ok: true, phieu: { luc: now.toISOString(), chon: chon, ten: ten, lan: lan + 1 } };
  if (duocXemKetQua_(email, ch)) out.kq = layKetQua();
  return out;
}

/* Ket qua hien tai (trang goi lai moi 10 giay). */
function layKetQua() {
  var email = emailHienTai_(), ch = docCauHinh_();
  if (!duocXemKetQua_(email, ch)) return { an: true, lyDo: 'Ket qua dang an' + (String(ch.HIEN_KET_QUA).toUpperCase() === 'SAU_HAN_CHOT' ? ' den het han chot' : '') + '.' };
  var uv = docUngVien_().filter(function (u) { return u.duocBau; }), dem = {}; uv.forEach(function (u) { dem[u.msnv] = 0; });
  var ph = docPhieu_(), tongPhieu = 0;
  ph.forEach(function (p) { p.chon.forEach(function (m) { if (dem.hasOwnProperty(m)) { dem[m]++; tongPhieu++; } }); });
  var ds = uv.map(function (u) { return { m: u.msnv, ten: u.ten, nhom: u.nhom, cd: u.cd, sp: dem[u.msnv], pct: tongPhieu ? Math.round(dem[u.msnv] * 1000 / tongPhieu) / 10 : 0 }; })
    .sort(function (a, b) { return b.sp - a.sp || khoaTen_(a.ten).localeCompare(khoaTen_(b.ten)); });
  var hang = 0, truoc = null; ds.forEach(function (d, i) { if (d.sp !== truoc) { hang = i + 1; truoc = d.sp; } d.hang = hang; });
  var nbp = docNguoiBoPhieu_(), daNop = {}; ph.forEach(function (p) { daNop[p.email.toLowerCase()] = 1; });
  var out = { an: false, luc: new Date().toISOString(), tongPhieu: tongPhieu, daNop: ph.length, tongNguoi: Math.max(nbp.length, ph.length), soChon: +ch.SO_NGUOI_CHON || 2, ds: ds, trangThai: trangThaiBinhChon_(ch) };
  if (laQuanTri_(email, ch)) out.chuaNop = nbp.filter(function (n) { return !n.email || !daNop[n.email.toLowerCase()]; }).map(function (n) { return n.ten + (n.email ? '' : ' (chua vao trang)'); });
  return out;
}

/* Anh nhan su: tra {msnv: dataURL}. Goi theo tung nhom 6 nguoi de trang hien nhanh. */
function layAnh(msnvs) {
  var ch = docCauHinh_(); if (!ch.THU_MUC_ANH) return {};
  var cache = CacheService.getScriptCache(), out = {}, thieu = [];
  (msnvs || []).forEach(function (m) { m = String(m); var c = cache.get('anh_' + m); if (c) out[m] = c === '-' ? '' : c; else thieu.push(m); });
  if (!thieu.length) return out;
  var idx = chiMucAnh_(ch.THU_MUC_ANH), uv = {}; docUngVien_().forEach(function (u) { uv[u.msnv] = u; });
  thieu.forEach(function (m) {
    var id = idx.msnv[m] || (uv[m] ? idx.ten[khoaTen_(uv[m].ten)] : null), url = '';
    if (id) { try { var b = DriveApp.getFileById(id).getBlob(); if (/^image\//.test(b.getContentType())) { url = 'data:' + b.getContentType() + ';base64,' + Utilities.base64Encode(b.getBytes()); } } catch (e) { url = ''; } }
    if (url.length > 95000) url = '';   // qua lon → bo (CacheService toi da 100 KB / khoa); doi anh nho hon
    out[m] = url; try { cache.put('anh_' + m, url || '-', 21600); } catch (e) { }
  });
  return out;
}
function lamMoiAnh() {   // quan tri goi khi doi anh trong thu muc
  var ch = docCauHinh_(); if (!laQuanTri_(emailHienTai_(), ch)) throw new Error('Chi quan tri.');
  var cache = CacheService.getScriptCache(); cache.remove('anhIdx');
  cache.removeAll(docUngVien_().map(function (u) { return 'anh_' + u.msnv; }));
  return 'OK';
}
function chiMucAnh_(folderId) {
  var cache = CacheService.getScriptCache(), c = cache.get('anhIdx'); if (c) return JSON.parse(c);
  var idx = { msnv: {}, ten: {} }, it = DriveApp.getFolderById(folderId).getFiles();
  while (it.hasNext()) {
    var f = it.next(), name = f.getName().replace(/\.[a-z0-9]{2,4}$/i, ''), m = name.match(/^\s*(\d{5,8})\s*[\t\-_ ]+\s*(.+)$/);
    if (!m) continue;
    if (!idx.msnv[m[1]]) idx.msnv[m[1]] = f.getId();
    var k = khoaTen_(m[2]); if (!idx.ten[k]) idx.ten[k] = f.getId();
  }
  try { cache.put('anhIdx', JSON.stringify(idx), 21600); } catch (e) { }
  return idx;
}

/* ---------- Ket qua ra tab KET_QUA (de xem/in tu Sheet) ---------- */
function capNhatKetQua_() {
  var uv = docUngVien_().filter(function (u) { return u.duocBau; }), dem = {}; uv.forEach(function (u) { dem[u.msnv] = 0; });
  var ph = docPhieu_(), tong = 0; ph.forEach(function (p) { p.chon.forEach(function (m) { if (dem.hasOwnProperty(m)) { dem[m]++; tong++; } }); });
  var ds = uv.map(function (u) { return [u.msnv, u.ten, u.nhom, dem[u.msnv], tong ? Math.round(dem[u.msnv] * 1000 / tong) / 10 : 0]; }).sort(function (a, b) { return b[3] - a[3]; });
  var rows = [['HANG', 'MSNV', 'HO_TEN', 'NHOM', 'SO_PHIEU', 'TI_LE_%']], hang = 0, truoc = null;
  ds.forEach(function (d, i) { if (d[3] !== truoc) { hang = i + 1; truoc = d[3]; } rows.push([hang].concat(d)); });
  rows.push(['', '', 'Da nop: ' + ph.length + ' / ' + docNguoiBoPhieu_().length + ' nguoi', 'Tong luot chon', tong, 'Cap nhat ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss')]);
  var sh = SpreadsheetApp.getActive().getSheetByName(TAB.KQ);
  sh.clearContents(); sh.getRange(1, 1, rows.length, 6).setValues(rows);
  sh.getRange(1, 1, 1, 6).setBackground('#1c4587').setFontColor('#ffffff').setFontWeight('bold');
}

/* ---------- Doc bang ---------- */
function docCauHinh_() {
  var v = SpreadsheetApp.getActive().getSheetByName(TAB.CH).getDataRange().getValues(), ch = {};
  for (var i = 1; i < v.length; i++) { var k = String(v[i][0] || '').trim(); if (k) ch[k] = v[i][1]; }
  return ch;
}
function ghiCauHinh_(khoa, giaTri) {
  var sh = SpreadsheetApp.getActive().getSheetByName(TAB.CH), v = sh.getDataRange().getValues();
  for (var i = 1; i < v.length; i++) if (String(v[i][0]).trim() === khoa) { sh.getRange(i + 1, 2).setValue(giaTri); return; }
  sh.appendRow([khoa, giaTri, '']);
}
function cauHinhCongKhai_(ch) {
  return { tieuDe: String(ch.TIEU_DE || 'Binh chon QC An Ha'), moTa: String(ch.MO_TA || ''), donVi: String(ch.TEN_DON_VI || ''), soChon: +ch.SO_NGUOI_CHON || 2,
    choSua: laDung_(ch.CHO_SUA_PHIEU), ngoaiDS: laDung_(ch.CHO_PHEP_NGOAI_DS), hienKQ: String(ch.HIEN_KET_QUA || 'MOI_NGUOI').toUpperCase(), hanChot: hanChot_(ch) ? hanChot_(ch).toISOString() : '' };
}
function docUngVien_() {
  var v = SpreadsheetApp.getActive().getSheetByName(TAB.UV).getDataRange().getValues(), h = chiSoCot_(v[0]), out = [];
  for (var i = 1; i < v.length; i++) { var m = String(v[i][h.MSNV] || '').trim(); if (!m) continue;
    out.push({ msnv: m, ten: String(v[i][h.HO_TEN] || '').trim(), cd: String(v[i][h.CHUC_DANH] || ''), nhom: String(v[i][h.NHOM] || ''), duocBau: h.DUOC_BAU == null ? true : laDung_(v[i][h.DUOC_BAU]) }); }
  return out;
}
function uvGon_(u) { return { m: u.msnv, ten: u.ten, cd: u.cd, nhom: u.nhom }; }
function docNguoiBoPhieu_() {
  var v = SpreadsheetApp.getActive().getSheetByName(TAB.NBP).getDataRange().getValues(), h = chiSoCot_(v[0]), out = [];
  for (var i = 1; i < v.length; i++) { var ten = String(v[i][h.HO_TEN] || '').trim(); if (!ten) continue;
    out.push({ msnv: String(v[i][h.MSNV] || '').trim(), ten: ten, email: String(v[i][h.EMAIL] || '').trim().toLowerCase(), cd: h.CHUC_DANH == null ? '' : String(v[i][h.CHUC_DANH] || ''), ghiChu: h.GHI_CHU == null ? '' : String(v[i][h.GHI_CHU] || '') }); }
  return out;
}
function timNguoiBoPhieu_(email) { email = String(email || '').toLowerCase(); var ds = docNguoiBoPhieu_(); for (var i = 0; i < ds.length; i++) if (ds[i].email && ds[i].email === email) return ds[i]; return null; }
function docPhieu_() {
  var sh = SpreadsheetApp.getActive().getSheetByName(TAB.PH); if (sh.getLastRow() < 2) return [];
  var v = sh.getDataRange().getValues(), h = chiSoCot_(v[0]), out = [];
  for (var i = 1; i < v.length; i++) { var e = String(v[i][h.EMAIL] || '').trim(); if (!e) continue;
    out.push({ email: e, luc: v[i][h.THOI_DIEM] instanceof Date ? v[i][h.THOI_DIEM].toISOString() : String(v[i][h.THOI_DIEM]), chon: String(v[i][h.CHON_MSNV] || '').split(';').map(function (x) { return x.trim(); }).filter(Boolean), ten: String(v[i][h.CHON_TEN] || '').split(';').map(function (x) { return x.trim(); }).filter(Boolean), lan: +v[i][h.SO_LAN_GUI] || 1 }); }
  return out;
}
function timPhieu_(email) { email = String(email || '').toLowerCase(); var ds = docPhieu_(); for (var i = ds.length - 1; i >= 0; i--) if (ds[i].email.toLowerCase() === email) return ds[i]; return null; }

/* ---------- Trang thai / quyen ---------- */
function hanChot_(ch) {
  var h = ch.HAN_CHOT; if (!h) return null; if (h instanceof Date) return h;
  var m = String(h).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/); if (!m) return null;
  return new Date(+m[3], +m[2] - 1, +m[1], m[4] ? +m[4] : 23, m[5] ? +m[5] : 59, 0);
}
function trangThaiBinhChon_(ch) {
  if (!laDung_(ch.MO_BINH_CHON)) return { mo: false, lyDo: 'Dot binh chon da dong.' };
  var hc = hanChot_(ch); if (hc && new Date() > hc) return { mo: false, lyDo: 'Da het han binh chon (' + Utilities.formatDate(hc, Session.getScriptTimeZone(), 'HH:mm dd/MM/yyyy') + ').' };
  return { mo: true, lyDo: '' };
}
function laQuanTri_(email, ch) { if (!email) return false; return String(ch.QUAN_TRI_EMAIL || '').toLowerCase().split(/[,;\s]+/).indexOf(String(email).toLowerCase()) >= 0; }
function duocXemKetQua_(email, ch) {
  var mode = String(ch.HIEN_KET_QUA || 'MOI_NGUOI').toUpperCase();
  if (laQuanTri_(email, ch)) return true;
  if (mode === 'QUAN_TRI') return false;
  if (mode === 'SAU_HAN_CHOT') { var hc = hanChot_(ch); return (hc && new Date() > hc) || !laDung_(ch.MO_BINH_CHON); }
  return true;
}
function emailHienTai_() { try { return String(Session.getActiveUser().getEmail() || '').trim().toLowerCase(); } catch (e) { return ''; } }

/* ---------- Tien ich ---------- */
function chiSoCot_(hang) { var h = {}; (hang || []).forEach(function (c, i) { var k = String(c || '').trim().toUpperCase(); if (k && h[k] == null) h[k] = i; }); return h; }
function laDung_(v) { if (v === true) return true; var s = String(v == null ? '' : v).trim().toUpperCase(); return s === 'TRUE' || s === 'X' || s === '1' || s === 'CO' || s === 'CÓ' || s === 'YES'; }
function khoaTen_(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim(); }
function anEmail_(e) { e = String(e || ''); var i = e.indexOf('@'); return i > 2 ? e.slice(0, 2) + '***' + e.slice(i) : e; }
function ghiLog_(email, hanhDong, chiTiet) { try { SpreadsheetApp.getActive().getSheetByName(TAB.LOG).appendRow([new Date(), email, hanhDong, String(chiTiet || '').slice(0, 500)]); } catch (e) { } }
