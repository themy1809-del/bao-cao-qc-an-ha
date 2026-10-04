/**
 * HE 4 "DONG BO BAN DO COT" — Apps Script GAN VAO file BanDoCheckList.
 * (Doc lap voi he 1 DATA HO SO / he 2 KIEM TRA BC-REV — khong dung chung code.)
 *
 * Luong:  PC (KEO_BANDO.vbs, 17:30 hang ngay)
 *   1. GET  /exec?lenh=viec&k=KHOA      -> server doc 3 tab ban do, tra danh sach viec (TSV)
 *   2. PC mo tung file Excel tren o Z: (chi doc), lay dung cac cot theo ban do
 *   3. POST /exec  (lenh=ghi)           -> ghi de tai cho vao tab du an (khong xoa tab)
 *   4. POST /exec  (lenh=nhatky/ketthuc)-> NHAT KY + TONG HOP
 *
 * Diem sua DUOC PHEP: PHIEN_BAN_BD, BANDO_ID, SO_DONG_GIU_NHAT_KY. Sua cho khac phai hoi truoc.
 * Khoa bi mat KHONG ghi trong code: chay ham taoKhoa() 1 lan, khoa luu o Script Properties.
 */
var PHIEN_BAN_BD = '04/10 ban-1';
var BANDO_ID = '';                 // '' = chinh file dang gan script (BanDoCheckList)
var SO_DONG_GIU_NHAT_KY = 5000;

var TAB_QC = 'DATA QC DOC', TAB_NDT = 'NDT', TAB_CD = 'CONGDOAN NT';
var TAB_NHATKY = 'NHAT KY DONG BO', TAB_TONGHOP = 'TONG HOP DONG BO';
// Tab KHONG BAO GIO duoc ghi/xoa (so sanh theo ten khong dau)
var TAB_CAM = ['DATA QC DOC', 'NDT', 'CONGDOAN NT', 'NHAP'];

var NDT_TEN = ['Có/Ko NDT', 'Date NDT', 'RQ NDT', 'Date Report', 'MT Report',
               'UT Report', 'RT Report', 'PT Report', 'PAUT Report', 'UTM Report'];
var NDT_HDR = ['VI TRI COT CO/KO NDT', 'VI TRI COT DATE NDT', 'VI TRI COT RQ NDT',
               'VI TRI COT DATE REPORT', 'VI TRI COT MT REPORT', 'VI TRI COT UT REPORT',
               'VI TRI COT RT REPORT', 'VI TRI COT PT REPORT', 'VI TRI COT PAUT REPORT',
               'VI TRI COT UTM REPORT'];

// ---------------------------------------------------------------- tien ich
function nd_(s) {
  return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase().replace(/\s+/g, ' ').trim();
}
function rongNA_(v) {
  var x = nd_(v);
  return x === '' || x === 'NOT APPLICABLE' || x === '-' || x === 'N/A' || x === 'NA' || x === '0';
}
function txt_(s) { return ContentService.createTextOutput(s); }
function moBanDo_() { return BANDO_ID ? SpreadsheetApp.openById(BANDO_ID) : SpreadsheetApp.getActiveSpreadsheet(); }
function timTab_(ss, ten) {
  var sh = ss.getSheets();
  for (var i = 0; i < sh.length; i++) if (nd_(sh[i].getName()) === ten) return sh[i];
  return null;
}
function tenTab_(loai, duAn) {
  var t = String(duAn).replace(/[\[\]\*\?\/\\:]/g, '-').replace(/^'+|'+$/g, '').trim();
  if (loai === 'NDT') t = 'NDT - ' + t;
  return t.substring(0, 99);
}
function laTabCam_(ten) {
  var x = nd_(ten);
  return TAB_CAM.indexOf(x) >= 0 || x === nd_(TAB_NHATKY) || x === nd_(TAB_TONGHOP);
}
function gio_() { return Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm:ss'); }

/** Tim cot theo TEN (khong dau). bat=true: thieu thi bao loi, khong doan. */
function cotTheoTen_(hdr, ten, bat, tenTab) {
  for (var j = 0; j < hdr.length; j++) if (nd_(hdr[j]) === ten) return j;
  if (bat) throw new Error('Tab ' + tenTab + ' thieu cot tieu de "' + ten + '"');
  return -1;
}

/** Doc 1 o "vi tri cot": tra chu cai cot (A..ZZZ) hoac '' neu khong khai. */
function chuCot_(v, ctx, loi) {
  if (rongNA_(v)) return '';
  var s = String(v).trim().toUpperCase();
  if (/^[A-Z]{1,3}$/.test(s)) return s;
  loi.push([ctx.duAn, ctx.file || '', ctx.sheet || '', 'CANH BAO BAN DO', '',
            ctx.tab + ' dong ' + ctx.dong + ' cot "' + ctx.ten + '" = "' + v + '" khong phai chu cai cot -> bo qua']);
  return '';
}

// ---------------------------------------------------------------- doc ban do
/** Tra {viec:[], loi:[], soCD:n, tenCD:{duAnNd:[ten...]}} */
function docBanDo_() {
  var ss = moBanDo_(), loi = [];
  var shQ = timTab_(ss, TAB_QC), shN = timTab_(ss, TAB_NDT), shC = timTab_(ss, TAB_CD);
  if (!shQ) throw new Error('Khong thay tab "Data Qc Doc"');

  // --- Data Qc Doc
  var q = shQ.getDataRange().getDisplayValues(), h = q[0];
  var c = {
    duAn: cotTheoTen_(h, 'DU AN (SPM)', true, 'Data Qc Doc'),
    path: cotTheoTen_(h, 'DUONG DAN', true, 'Data Qc Doc'),
    file: cotTheoTen_(h, 'TEN FILE', true, 'Data Qc Doc'),
    sheet: cotTheoTen_(h, 'TEN SHEET', true, 'Data Qc Doc'),
    dong: cotTheoTen_(h, 'DONG DU LIEU DAU TIEN', true, 'Data Qc Doc'),
    mp: cotTheoTen_(h, 'VI TRI COT MEMBER PUNCH NO', true, 'Data Qc Doc'),
    idx: cotTheoTen_(h, 'VI TRI COT INDEX', true, 'Data Qc Doc'),
    guid: cotTheoTen_(h, 'VI TRI COT GUID', true, 'Data Qc Doc'),
    w: cotTheoTen_(h, 'VI TRI COT WEIGHT', true, 'Data Qc Doc'),
    pk: cotTheoTen_(h, 'VI TRI COT PHAN KHU QUAN LY', true, 'Data Qc Doc')
  };
  // Cong doan: bat dau o "RFI cong doan 1", moi nhom 4 cot lien tiep (RFI, Date, Report, QC Check).
  // Dem theo VI TRI (tieu de "cong doan 15" bi ghi trung 2 lan -> nhom thu 16).
  var cd0 = cotTheoTen_(h, 'VI TRI COT RFI CONG DOAN 1', true, 'Data Qc Doc'), soCD = 0;
  while (cd0 + soCD * 4 < h.length && nd_(h[cd0 + soCD * 4]).indexOf('VI TRI COT RFI CONG DOAN') === 0) soCD++;

  var viec = [], qcTheoDuAn = {}, thuMucDuAn = {};
  for (var i = 1; i < q.length; i++) {
    var r = q[i], duAn = String(r[c.duAn]).trim();
    if (!duAn) continue;
    var thuMuc = String(r[c.path]).trim().replace(/[\\\/]+$/, '');
    if (thuMuc && !thuMucDuAn[nd_(duAn)]) thuMucDuAn[nd_(duAn)] = thuMuc;   // NDT dung chung thu muc
    var ctx = { duAn: duAn, file: r[c.file], sheet: r[c.sheet], tab: 'Data Qc Doc', dong: i + 1 };
    var thieu = [];
    if (!String(r[c.path]).trim()) thieu.push('ĐƯỜNG DẪN');
    if (!String(r[c.file]).trim()) thieu.push('TÊN FILE');
    if (!String(r[c.sheet]).trim()) thieu.push('TÊN SHEET');
    var dong = parseInt(r[c.dong], 10);
    if (!(dong >= 1)) thieu.push('DÒNG DỮ LIỆU ĐẦU TIÊN');
    ctx.ten = 'MEMBER PUNCH NO'; var mp = chuCot_(r[c.mp], ctx, loi);
    if (!mp) thieu.push('cột MEMBER PUNCH NO');
    if (thieu.length) {
      loi.push([duAn, r[c.file], r[c.sheet], 'LOI BAN DO', '', 'Data Qc Doc dong ' + (i + 1) + ' thieu: ' + thieu.join(', ') + ' -> KHONG keo']);
      continue;
    }
    ctx.ten = 'Index'; var idx = chuCot_(r[c.idx], ctx, loi);
    ctx.ten = 'GUID'; var guid = chuCot_(r[c.guid], ctx, loi);
    ctx.ten = 'Weight'; var w = chuCot_(r[c.w], ctx, loi);
    ctx.ten = 'Phan khu'; var pk = chuCot_(r[c.pk], ctx, loi);
    var ra = [pk, idx, mp, guid, w];
    for (var k = 0; k < soCD * 4; k++) { ctx.ten = h[cd0 + k]; ra.push(chuCot_(r[cd0 + k], ctx, loi)); }
    var v = { loai: 'QC', duAn: duAn, tab: tenTab_('QC', duAn), path: thuMuc + '\\' + String(r[c.file]).trim(),
              sheet: String(r[c.sheet]).trim(), dong: dong, khoa: [mp, guid].filter(String), ra: ra, ndt: null };
    viec.push(v);
    var kd = nd_(duAn);
    (qcTheoDuAn[kd] = qcTheoDuAn[kd] || []).push(v);
  }

  // --- NDT
  if (shN) {
    var n = shN.getDataRange().getDisplayValues(), hn = n[0];
    var cn = {
      duAn: cotTheoTen_(hn, 'DU AN (SPM)', true, 'NDT'),
      file: cotTheoTen_(hn, 'TEN FILE', true, 'NDT'),
      sheet: cotTheoTen_(hn, 'TEN SHEET', true, 'NDT'),
      dong: cotTheoTen_(hn, 'DONG DU LIEU DAU TIEN', true, 'NDT'),
      mp: cotTheoTen_(hn, 'VI TRI COT MEMBER PUNCH NO', true, 'NDT'),
      path: cotTheoTen_(hn, 'DUONG DAN', false, 'NDT')   // cot tuy chon
    };
    var cnd = NDT_HDR.map(function (t) { return cotTheoTen_(hn, t, true, 'NDT'); });
    for (var i2 = 1; i2 < n.length; i2++) {
      var rn = n[i2], da = String(rn[cn.duAn]).trim();
      if (!da) continue;
      var fileN = String(rn[cn.file]).trim(), sheetN = String(rn[cn.sheet]).trim();
      var ghi = 'NDT dong ' + (i2 + 1);
      if (/^[A-Z]:\\/i.test(da) || /^\\\\/.test(da)) {
        loi.push([da, fileN, sheetN, 'LOI BAN DO', '', ghi + ': cot DU AN dang la duong dan, thieu ten du an -> KHONG keo']);
        continue;
      }
      var ctxN = { duAn: da, file: fileN, sheet: sheetN, tab: 'NDT', dong: i2 + 1 };
      var chu = cnd.map(function (j, t) { ctxN.ten = NDT_TEN[t]; return chuCot_(rn[j], ctxN, loi); });
      if (!chu.some(String)) continue;                 // toan "Not applicable" -> khong co NDT
      var kdn = nd_(da), dsQC = qcTheoDuAn[kdn] || [];

      if (!fileN) {                                    // NDT nam ngay trong sheet checklist
        if (dsQC.length === 1 && !dsQC[0].ndt) { dsQC[0].ndt = chu; }
        else if (dsQC.length === 0) loi.push([da, '', '', 'LOI BAN DO', '', ghi + ': du an khong co trong Data Qc Doc -> KHONG keo NDT']);
        else if (dsQC.length > 1) loi.push([da, '', '', 'LOI BAN DO', '', ghi + ': du an co ' + dsQC.length + ' sheet checklist, khong ro NDT nam sheet nao -> can khai TEN FILE/TEN SHEET']);
        else loi.push([da, '', '', 'CANH BAO BAN DO', '', ghi + ': khai NDT trung lan 2 -> bo qua dong nay']);
        continue;
      }
      ctxN.ten = 'MEMBER PUNCH NO'; var mpN = chuCot_(rn[cn.mp], ctxN, loi);
      var dongN = parseInt(rn[cn.dong], 10), th = [];
      if (!sheetN) th.push('TÊN SHEET');
      if (!(dongN >= 1)) th.push('DÒNG DỮ LIỆU ĐẦU TIÊN');
      if (!mpN) th.push('cột MEMBER PUNCH NO');
      var thuMucN = cn.path >= 0 ? String(rn[cn.path]).trim().replace(/[\\\/]+$/, '') : '';
      if (!thuMucN) thuMucN = thuMucDuAn[kdn] || '';
      if (!thuMucN) th.push('ĐƯỜNG DẪN (khong khai, du an cung khong co trong Data Qc Doc)');
      if (th.length) {
        loi.push([da, fileN, sheetN, 'LOI BAN DO', '', ghi + ' thieu: ' + th.join(', ') + ' -> KHONG keo']);
        continue;
      }
      viec.push({ loai: 'NDT', duAn: da, tab: tenTab_('NDT', da), path: thuMucN + '\\' + fileN,
                  sheet: sheetN, dong: dongN, khoa: [mpN], ra: [mpN].concat(chu) });
    }
  }

  // --- gan NDT vao viec QC, kiem tra trung ten tab
  var bang = [];
  viec.forEach(function (v) {
    if (v.loai === 'QC') v.ra = v.ra.concat(v.ndt || NDT_TEN.map(function () { return ''; }));
    if (laTabCam_(v.tab)) { loi.push([v.duAn, '', '', 'LOI BAN DO', '', 'Ten tab "' + v.tab + '" trung tab he thong -> KHONG keo']); return; }
    bang.push(v);
  });
  bang.sort(function (a, b) { return a.path < b.path ? -1 : a.path > b.path ? 1 : (a.tab < b.tab ? -1 : 1); });

  // --- ten cong doan
  var tenCD = {};
  if (shC) {
    shC.getDataRange().getDisplayValues().slice(1).forEach(function (r) {
      if (String(r[0]).trim()) tenCD[nd_(r[0])] = r.slice(1);
    });
  }
  return { viec: bang, loi: loi, soCD: soCD, tenCD: tenCD };
}

function tieuDe_(loai, duAn, bd) {
  var g = ['Nguồn file', 'Nguồn sheet', 'Dòng Excel'];
  if (loai === 'NDT') return g.concat(['Member Punch No'], NDT_TEN);
  g = g.concat(['Phân khu quản lý', 'Index', 'Member Punch No', 'GUID', 'Weight']);
  var ten = bd.tenCD[nd_(duAn)] || [];
  for (var k = 0; k < bd.soCD; k++) {
    var t = 'CĐ' + (k + 1) + (String(ten[k] || '').trim() ? ' ' + String(ten[k]).trim() : '');
    g.push(t + ' | RFI', t + ' | Date', t + ' | Report', t + ' | QC Check');
  }
  return g.concat(NDT_TEN.map(function (x) { return 'NDT | ' + x; }));
}

// ---------------------------------------------------------------- web app
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.lenh !== 'viec') return txt_('READY - DONG BO BAN DO - phien ban dang chay: ' + PHIEN_BAN_BD);
  var lock = LockService.getScriptLock();
  try {
    if (!kiemKhoa_(p.k)) return txt_('LOI\tSAI KHOA');
    if (!lock.tryLock(30000)) return txt_('LOI\tDANG BAN, thu lai sau');
    var bd = docBanDo_();
    ghiNhatKy_(p.phien || '', bd.loi);
    var out = ['OK\t' + PHIEN_BAN_BD + '\t' + bd.viec.length + '\t' + bd.loi.length];
    bd.viec.forEach(function (v, i) {
      out.push([i + 1, v.loai, v.duAn, v.tab, v.path, v.sheet, v.dong, v.khoa.join(','), v.ra.join(',')]
        .map(function (x) { return String(x).replace(/[\t\r\n]/g, ' '); }).join('\t'));
    });
    return txt_(out.join('\n'));
  } catch (err) {
    return txt_('LOI\t' + err.message);
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/**
 * Body POST (UTF-8, TSV). Dong 1 = META:
 *   META \t khoa \t lenh \t phien \t loai \t duAn \t moi(0/1) \t file \t sheet
 * lenh=ghi     : cac dong sau = du lieu (gia tri dau = so dong Excel)
 * lenh=nhatky  : cac dong sau = duAn \t file \t sheet \t trangThai \t soDong \t ghiChu
 * lenh=ketthuc : cac dong sau = tab \t duAn \t loai \t soDong \t soNguon \t soLoi \t ghiChu
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var body = (e && e.postData && e.postData.contents) || '';
    var dong = body.replace(/\r/g, '').split('\n');
    var m = dong[0].split('\t');
    if (m[0] !== 'META') return txt_('LOI\tTHIEU META');
    if (!kiemKhoa_(m[1])) return txt_('LOI\tSAI KHOA');
    if (!lock.tryLock(60000)) return txt_('LOI\tDANG BAN, thu lai sau');
    var lenh = m[2], phien = m[3], du = dong.slice(1).filter(function (x) { return x !== ''; });
    if (lenh === 'ghi') return txt_(ghiDuLieu_(m[4], m[5], m[6] === '1', m[7], m[8], du));
    if (lenh === 'nhatky') {
      ghiNhatKy_(phien, du.map(function (x) { return x.split('\t'); }));
      return txt_('OK');
    }
    if (lenh === 'ketthuc') return txt_(ghiTongHop_(phien, du.map(function (x) { return x.split('\t'); })));
    return txt_('LOI\tLENH LA: ' + lenh);
  } catch (err) {
    return txt_('LOI\t' + err.message);
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function ghiDuLieu_(loai, duAn, moi, file, sheet, du) {
  var tab = tenTab_(loai, duAn);
  if (laTabCam_(tab)) return 'LOI\tTAB CAM: ' + tab;
  var ss = moBanDo_(), sh = ss.getSheetByName(tab);
  if (!sh) sh = ss.insertSheet(tab, ss.getSheets().length);
  // Tieu de chi dung lai khi moi=1; cac goi sau doc lai tu dong 1 cua tab
  var hdr = moi ? tieuDe_(loai, duAn, docBanDo_())
                : sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0];
  var nc = hdr.length;
  if (!moi && hdr[0] !== 'Nguồn file') return 'LOI\tTAB CHUA CO TIEU DE: ' + tab;
  if (sh.getMaxColumns() < nc) sh.insertColumnsAfter(sh.getMaxColumns(), nc - sh.getMaxColumns());
  if (moi) {                                   // ghi de tai cho: xoa noi dung cu, KHONG xoa tab
    var lr = sh.getLastRow(), lc = sh.getLastColumn();
    if (lr > 0 && lc > 0) sh.getRange(1, 1, lr, Math.max(lc, nc)).clearContent();
    sh.getRange(1, 1, 1, nc).setValues([hdr]).setFontWeight('bold')
      .setBackground('#1c4587').setFontColor('#ffffff').setWrap(true);
    sh.setFrozenRows(1);
  }
  if (!du.length) return 'OK\t0';
  var cotW = loai === 'NDT' ? -1 : hdr.indexOf('Weight');
  var hang = du.map(function (l) {
    var r = [file, sheet].concat(l.split('\t'));
    if (r.length > nc) r = r.slice(0, nc);
    while (r.length < nc) r.push('');
    for (var j = 0; j < nc; j++) {
      if (j === 2 || j === cotW) { var so = Number(r[j]); if (r[j] !== '' && isFinite(so)) { r[j] = so; continue; } }
      if (/^[=+]/.test(r[j])) r[j] = "'" + r[j];   // chan cong thuc chen vao
    }
    return r;
  });
  var bd = sh.getLastRow() + 1;
  if (sh.getMaxRows() < bd + hang.length - 1) sh.insertRowsAfter(sh.getMaxRows(), bd + hang.length - 1 - sh.getMaxRows());
  var rg = sh.getRange(bd, 1, hang.length, nc);
  rg.setNumberFormat('@');
  sh.getRange(bd, 3, hang.length, 1).setNumberFormat('0');
  if (cotW >= 0) sh.getRange(bd, cotW + 1, hang.length, 1).setNumberFormat('0.00');
  rg.setValues(hang);
  return 'OK\t' + hang.length;
}

function ghiNhatKy_(phien, ds) {
  if (!ds || !ds.length) return;
  var ss = moBanDo_(), sh = ss.getSheetByName(TAB_NHATKY);
  if (!sh) {
    sh = ss.insertSheet(TAB_NHATKY, ss.getSheets().length);
    sh.getRange(1, 1, 1, 8).setValues([['Thời gian', 'Phiên chạy', 'Dự án', 'File', 'Sheet', 'Trạng thái', 'Số dòng', 'Ghi chú']])
      .setFontWeight('bold').setBackground('#1c4587').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  var t = gio_();
  var hang = ds.map(function (r) {
    var x = [t, phien].concat(r.slice(0, 6));
    while (x.length < 8) x.push('');
    return x.map(function (v) { return /^[=+]/.test(String(v)) ? "'" + v : v; });
  });
  sh.getRange(sh.getLastRow() + 1, 1, hang.length, 8).setValues(hang);
  var lr = sh.getLastRow();
  if (lr - 1 > SO_DONG_GIU_NHAT_KY + 1000) sh.deleteRows(2, lr - 1 - SO_DONG_GIU_NHAT_KY);
}

function ghiTongHop_(phien, ds) {
  var ss = moBanDo_(), sh = ss.getSheetByName(TAB_TONGHOP);
  if (!sh) sh = ss.insertSheet(TAB_TONGHOP, ss.getSheets().length);
  var lr = sh.getLastRow(), lc = sh.getLastColumn();
  if (lr > 0 && lc > 0) sh.getRange(1, 1, lr, lc).clearContent().setBackground(null);
  sh.getRange(1, 1, 1, 2).setValues([['Lần chạy cuối: ' + gio_() + ' · phiên ' + phien, 'Phiên bản: ' + PHIEN_BAN_BD]]).setFontWeight('bold');
  var hdr = ['Tab', 'Dự án', 'Loại', 'Số dòng', 'Số sheet nguồn', 'Số lỗi', 'Ghi chú'];
  sh.getRange(2, 1, 1, hdr.length).setValues([hdr]).setFontWeight('bold').setBackground('#1c4587').setFontColor('#ffffff');
  if (ds.length) {
    var hang = ds.map(function (r) {
      var x = r.slice(0, 7); while (x.length < 7) x.push('');
      x[3] = Number(x[3]) || 0; x[4] = Number(x[4]) || 0; x[5] = Number(x[5]) || 0;
      return x;
    });
    sh.getRange(3, 1, hang.length, 7).setValues(hang);
    hang.forEach(function (x, i) { if (x[5] > 0) sh.getRange(3 + i, 1, 1, 7).setBackground('#f4cccc'); });
  }
  sh.setFrozenRows(2);
  return 'OK';
}

// ---------------------------------------------------------------- khoa bi mat
function kiemKhoa_(k) {
  var that = PropertiesService.getScriptProperties().getProperty('KHOA_BANDO');
  return !!that && String(k || '') === that;
}
/** Chay TAY 1 lan trong trinh soan thao: tao khoa, xem o Nhat ky thuc thi, dan vao KEO_BANDO.vbs. */
function taoKhoa() {
  var k = Utilities.getUuid().replace(/-/g, '');
  PropertiesService.getScriptProperties().setProperty('KHOA_BANDO', k);
  Logger.log('KHOA_BANDO = ' + k);
}
/** Chay TAY de xem truoc: bao nhieu viec, bao nhieu loi ban do (khong ghi gi). */
function xemTruoc() {
  var bd = docBanDo_();
  Logger.log('So viec: ' + bd.viec.length + ' · so cong doan: ' + bd.soCD + ' · loi ban do: ' + bd.loi.length);
  bd.loi.forEach(function (r) { Logger.log(r.join(' | ')); });
}
