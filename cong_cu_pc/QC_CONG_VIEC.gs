/* =====================================================================
   QC CONG VIEC — kho du lieu dung chung cho "Cong viec QC" (ban_do_qc.html)
   PHIEN_BAN_CV = '31/10 khoi-tao'

   CACH TRIEN KHAI (lam 1 lan, khoang 10 phut):
   1. Tao 1 Google Sheet moi, dat ten "QC CONG VIEC". Chia se: CHI noi bo (khong "Bat ky ai co link").
   2. Trong Sheet: Tien ich mo rong -> Apps Script. Xoa code mau, dan TOAN BO file nay vao, bam Luu.
   3. Chay ham khoiTao() 1 lan (chon ham -> Chay -> cap quyen). Ham tao 2 tab VIEC + NHAT KY.
   4. Cai dat du an (banh rang) -> Thuoc tinh tap lenh (Script properties) -> Them:
        PMS_KEY = <ma nhom tu dat, vd 8 ky tu>   (QC/quan ly nhap ma nay 1 lan trong ⚙ cua app de duoc GHI)
   5. Trien khai -> Trien khai moi -> Loai: Ung dung web
        Thuc thi voi tu cach: TOI   ·   Nguoi co quyen truy cap: BAT KY AI
      -> Trien khai -> copy URL ket thuc bang /exec
   6. Dan URL vao file pms_api.js (window.QC_PMS_API = "https://script.google.com/macros/s/.../exec";) roi day len GitHub.
   CAP NHAT CODE VE SAU: Trien khai -> Quan ly trien khai -> ✏ -> Phien ban moi (GIU NGUYEN URL). KHONG tao trien khai moi.

   GHI CHU AN TOAN: DOC (doGet) khong can ma — ai co URL /exec doc duoc danh sach viec (ten QC, du an, ket qua).
   Neu can kin hon: them tham so ma vao doGet va cho trang gui kem (phai sua dong thoi ban_do_qc.html).
   ===================================================================== */
var PHIEN_BAN_CV = '31/10 khoi-tao';
var TAB_VIEC = 'VIEC', TAB_LOG = 'NHAT KY';
var COT = ['id', 'u', 'spm', 'st', 'han', 'pj', 'x', 'tieude', 'json'];   // json = toan bo viec; cac cot truoc de loc/xem nhanh tren Sheet

function khoiTao() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(TAB_VIEC) || ss.insertSheet(TAB_VIEC);
  if (sh.getLastRow() === 0) { sh.appendRow(COT); sh.setFrozenRows(1); sh.getRange(1, 1, 1, COT.length).setBackground('#1c4587').setFontColor('#ffffff').setFontWeight('bold'); }
  var lg = ss.getSheetByName(TAB_LOG) || ss.insertSheet(TAB_LOG);
  if (lg.getLastRow() === 0) { lg.appendRow(['Thoi diem', 'Nguoi gui', 'So viec', 'Ket qua']); lg.setFrozenRows(1); }
  return 'OK ' + PHIEN_BAN_CV;
}

/* DOC: ?cb=<ten ham>&since=<ms> -> cb({ok, now, tasks:[...]}) — chi tra viec sua sau 'since' */
function doGet(e) {
  var p = (e && e.parameter) || {};
  var cb = String(p.cb || '');
  var out;
  try {
    var since = Number(p.since || 0) || 0;
    var sh = SpreadsheetApp.getActive().getSheetByName(TAB_VIEC);
    var tasks = [];
    if (sh && sh.getLastRow() > 1) {
      var v = sh.getRange(2, 1, sh.getLastRow() - 1, COT.length).getValues();
      for (var i = 0; i < v.length; i++) {
        if (!v[i][0]) continue;
        if (Number(v[i][1]) > since) { try { tasks.push(JSON.parse(v[i][8])); } catch (er) {} }
      }
    }
    out = { ok: true, now: Date.now(), ver: PHIEN_BAN_CV, tasks: tasks };
  } catch (err) {
    out = { ok: false, loi: String(err && err.message || err) };
  }
  var body = JSON.stringify(out);
  if (/^[A-Za-z_$][\w$]{0,60}$/.test(cb)) {
    return ContentService.createTextOutput(cb + '(' + body + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}

/* GHI: POST text/plain {key, ai, tasks:[...]} — upsert theo id, chi ghi neu ban gui moi hon (u) ban dang co */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);   // tryLock/waitLock nam TRONG try (quy tac du an)
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var key = PropertiesService.getScriptProperties().getProperty('PMS_KEY') || '';
    if (!key || String(d.key || '') !== key) { ghiLog_(d.ai, 0, 'SAI MA NHOM'); return traVe_({ ok: false, loi: 'sai mã nhóm' }); }
    var ds = Array.isArray(d.tasks) ? d.tasks.slice(0, 500) : [];
    var sh = SpreadsheetApp.getActive().getSheetByName(TAB_VIEC);
    if (!sh) { khoiTao(); sh = SpreadsheetApp.getActive().getSheetByName(TAB_VIEC); }
    var n = sh.getLastRow() - 1, map = {};
    var cu = n > 0 ? sh.getRange(2, 1, n, 2).getValues() : [];
    for (var i = 0; i < cu.length; i++) map[cu[i][0]] = { row: i + 2, u: Number(cu[i][1]) || 0 };
    var ghi = 0, them = [];
    ds.forEach(function (t) {
      if (!t || !t.id || String(t.id).length > 300) return;
      var u = Number(t.u) || Date.now();
      var dong = [String(t.id), u, String(t.spm || ''), String(t.st || ''), String(t.han || ''), String(t.pj || ''), String(t.x || ''), String(t.tieude || '').slice(0, 200), JSON.stringify(t).slice(0, 45000)];
      var m = map[t.id];
      if (m) { if (u >= m.u) { sh.getRange(m.row, 1, 1, COT.length).setValues([dong]); ghi++; } }
      else { them.push(dong); map[t.id] = { row: -1, u: u }; }
    });
    if (them.length) { sh.getRange(sh.getLastRow() + 1, 1, them.length, COT.length).setValues(them); ghi += them.length; }
    ghiLog_(d.ai, ds.length, 'ghi ' + ghi);
    return traVe_({ ok: true, ghi: ghi, now: Date.now() });
  } catch (err) {
    return traVe_({ ok: false, loi: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function ghiLog_(ai, n, kq) {
  try { var lg = SpreadsheetApp.getActive().getSheetByName(TAB_LOG); if (lg) lg.appendRow([new Date(), String(ai || '').slice(0, 60), n, kq]); } catch (e) {}
}
function traVe_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
