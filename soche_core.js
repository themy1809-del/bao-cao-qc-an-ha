/* soche_core.js — SINH TỰ ĐỘNG từ nt_core.js (build_github.py). KHÔNG SỬA TAY. Phiên bản 20/11 ban-8 */
/* nt_core.js — LÕI DÙNG CHUNG app "Nghiệm thu Vật tư & Sơ chế" (giao diện điện thoại + web)
   PHIEN_BAN '17/11 mau-giao-dien' — BẢN MẪU: dữ liệu mẫu, lưu tạm trên trình duyệt.
   NT.API giả lập ĐÚNG TÊN HÀM sẽ viết ở Apps Script. Khi nối thật: thay phần "KHO" bằng google.script.run,
   giữ nguyên chữ ký hàm → giao diện không phải sửa.
   Quy ước kế thừa hệ 1/2: dò cột theo TÊN không dấu; "N/A" "-" "0" = trống; khối lượng = TẤN 2 số lẻ; mọi dữ liệu vào HTML qua esc(). */
(function () {
  'use strict';
  var GOC = typeof window !== 'undefined' ? window : this;
  /* 'that' có 2 đường truyền: trong Apps Script (google.script.run) hoặc trang tĩnh trên GitHub gọi Web App qua fetch (window.NT_API_URL) */
  var QUA_GAS = typeof window !== 'undefined' && typeof google !== 'undefined' && google.script && google.script.run;
  var NT_URL = typeof window !== 'undefined' && !QUA_GAS && window.NT_API_URL ? String(window.NT_API_URL) : '';
  var CHE_DO = typeof window === 'undefined' ? 'may_chu' : (QUA_GAS || NT_URL ? 'that' : 'mau');
  var PHIEN_BAN = '20/11 ban-8';
  var BAN_SO = 2026112001; /* số bản giao diện, TĂNG mỗi lần phát hành: trang GitHub so số này với máy chủ để tự lấy giao diện mới */

  /* ---------- tiện ích ---------- */
  function pad(n, k) { return String(n).padStart(k || 2, '0'); }
  function isoNgay(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function ngayCach(k) { var d = new Date(); d.setDate(d.getDate() + k); return isoNgay(d); }
  function homNay() { return isoNgay(new Date()); }
  function hienNgay(s) { return s ? s.slice(8, 10) + '/' + s.slice(5, 7) + '/' + s.slice(0, 4) : '—'; }
  function soNgay(a, b) { return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5); }
  function gioPhut() { var d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function khongDau(s) { return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D'); }
  function chuanTen(s) { return khongDau(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
  function laTrong(v) { var t = String(v == null ? '' : v).trim().toUpperCase(); return t === '' || t === 'N/A' || t === 'NA' || t === '-' || t === 'NOT APPLICABLE' || t === '0'; }
  function chuanHeat(s) { return String(s == null ? '' : s).toUpperCase().replace(/\s+/g, ''); }
  function so(v) { if (v === '' || v == null) return NaN; return Number(String(v).trim().replace(/\s/g, '').replace(',', '.')); }
  function fmt(n, k) { return isFinite(n) ? Number(n).toLocaleString('vi-VN', { minimumFractionDigits: k || 0, maximumFractionDigits: k || 0 }) : '—'; }
  function fmtSo(n) { return isFinite(n) ? Number(n).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) : '—'; }

  /* ---------- icon SVG nét (1 bộ, không emoji) ---------- */
  var ICP = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    flag: '<path d="M4 22V4M4 4h12l-2 4 2 4H4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 20h16"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4Z"/><circle cx="12" cy="13" r="3.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
    ruler: '<path d="M3 17 17 3l4 4L7 21Z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
    link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    cloud: '<path d="M7 18a5 5 0 0 1-.6-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9Z"/>'
  };
  function ic(n, cls) { return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (ICP[n] || '') + '</svg>'; }

  /* ---------- danh mục (MẪU — dung sai chờ anh xác nhận) ---------- */
  /* Danh mục dự án: MẪU lấy theo khoá BD_EP của hệ 1; tên đầy đủ / khách hàng cần anh xác nhận */
  var TT_DA = { DANG_CHAY: ['Đang chạy', 'ok'], TAM_DUNG: ['Tạm dừng', 'w'], DA_XONG: ['Đã xong', 'n'] };
  function duAnMau() {
    return [
      ['VIOLA_KCT', 'EVAPCO VIOLA – Kết cấu thép', '10725-009', 'EVAPCO', 'DANG_CHAY', ''],
      ['VIOLA_TED', 'EVAPCO VIOLA – TED', '10725-011', 'EVAPCO', 'DANG_CHAY', ''],
      ['BISON_U2', 'EVAPCO BISON U2', '', 'EVAPCO', 'DANG_CHAY', ''],
      ['GREGORY_DUCT', 'EVAPCO GREGORY – Ducting', '', 'EVAPCO', 'DANG_CHAY', ''],
      ['10726-043', 'Dự án 10726-043', '10726-043', '', 'DANG_CHAY', 'Chưa có tên đầy đủ, cần bổ sung'],
      ['10726-054', 'Dự án 10726-054', '10726-054', '', 'TAM_DUNG', 'Chưa có tên đầy đủ, cần bổ sung'],
      ['10725-008', 'Dự án 10725-008', '10725-008', '', 'DA_XONG', 'Chưa có tên đầy đủ, cần bổ sung']
    ].map(function (r) { return { ma: r[0], ten: r[1], ma_hd: r[2], khach_hang: r[3], trang_thai: r[4], ghi_chu: r[5] }; });
  }
  var DU_AN = [];
  var XUONG = ['AH1', 'AH3', 'AH4', 'AH6'];
  var TO = ['Tổ cắt 1', 'Tổ cắt 2', 'Tổ khoan', 'Tổ vát mép', 'Tổ làm sạch'];
  var QUY_TAC = { chanHeatNgoaiSDC: false };
  var CONG_DOAN = [
    { ma: 'CAT', ten: 'Cắt', hm: [
      { ma: 'CAT1', ten: 'Chiều dài', dv: 'mm', kieu: 'so', am: 2, duong: 2 },
      { ma: 'CAT2', ten: 'Chiều rộng', dv: 'mm', kieu: 'so', am: 2, duong: 2 },
      { ma: 'CAT3', ten: 'Độ vuông góc mép cắt', dv: 'mm', kieu: 'max', max: 1 },
      { ma: 'CAT4', ten: 'Mép cắt không khuyết, không ba via', kieu: 'mat' }] },
    { ma: 'KHOAN', ten: 'Khoan lỗ', hm: [
      { ma: 'KH1', ten: 'Đường kính lỗ', dv: 'mm', kieu: 'so', am: 0, duong: 0.5 },
      { ma: 'KH2', ten: 'Khoảng cách tâm lỗ', dv: 'mm', kieu: 'so', am: 1, duong: 1 },
      { ma: 'KH3', ten: 'Khoảng cách lỗ tới mép', dv: 'mm', kieu: 'so', am: 1.5, duong: 1.5 },
      { ma: 'KH4', ten: 'Số lượng lỗ', dv: 'lỗ', kieu: 'so', am: 0, duong: 0 }] },
    { ma: 'VAT', ten: 'Vát mép', hm: [
      { ma: 'VM1', ten: 'Góc vát', dv: 'độ', kieu: 'so', am: 2.5, duong: 2.5 },
      { ma: 'VM2', ten: 'Mặt cùn', dv: 'mm', kieu: 'so', am: 1, duong: 1 },
      { ma: 'VM3', ten: 'Bề mặt vát sạch, không rỗ', kieu: 'mat' }] },
    { ma: 'UON', ten: 'Uốn / cán', hm: [
      { ma: 'UO1', ten: 'Bán kính uốn', dv: 'mm', kieu: 'so', am: 3, duong: 3 },
      { ma: 'UO2', ten: 'Góc uốn', dv: 'độ', kieu: 'so', am: 1, duong: 1 },
      { ma: 'UO3', ten: 'Không nứt mặt ngoài vùng uốn', kieu: 'mat' }] },
    { ma: 'LS', ten: 'Làm sạch bề mặt', hm: [
      { ma: 'LS1', ten: 'Độ nhám bề mặt', dv: 'µm', kieu: 'khoang', min: 50, max: 85 },
      { ma: 'LS2', ten: 'Đạt cấp làm sạch Sa 2½', kieu: 'mat' }] }
  ];
  /* thay danh mục bằng dữ liệu tab HANG_MUC_KT / DANH_MUC (giữ nguyên tham chiếu mảng) */
  function datCauHinh(c) {
    if (!c) return;
    if (c.congDoan && c.congDoan.length) CONG_DOAN.splice.apply(CONG_DOAN, [0, CONG_DOAN.length].concat(c.congDoan));
    if (c.xuong && c.xuong.length) XUONG.splice.apply(XUONG, [0, XUONG.length].concat(c.xuong));
    if (c.to && c.to.length) TO.splice.apply(TO, [0, TO.length].concat(c.to));
    if (c.quyTac) Object.keys(c.quyTac).forEach(function (k) { QUY_TAC[k] = c.quyTac[k]; });
  }
  function cauHinhHienTai() { return JSON.parse(JSON.stringify({ congDoan: CONG_DOAN, xuong: XUONG, to: TO, quyTac: QUY_TAC })); }
  function congDoan(ma) { for (var i = 0; i < CONG_DOAN.length; i++) if (CONG_DOAN[i].ma === ma) return CONG_DOAN[i]; return null; }
  function hangMuc(ma) { for (var i = 0; i < CONG_DOAN.length; i++) for (var j = 0; j < CONG_DOAN[i].hm.length; j++) if (CONG_DOAN[i].hm[j].ma === ma) return CONG_DOAN[i].hm[j]; return null; }
  function tenDuAn(ma) { for (var i = 0; i < DU_AN.length; i++) if (DU_AN[i].ma === ma) return DU_AN[i].ten; return ma || '—'; }
  function duAnTheoTenAH1(ten) { var t = chuanTen(ten); if (!t) return ''; for (var i = 0; i < DU_AN.length; i++) { var ds = String(DU_AN[i].ten_ah1 || '').split(';').map(chuanTen).filter(Boolean); if (ds.indexOf(t) >= 0) return DU_AN[i].ma; } return ''; }
  function layDuAn(ma) { for (var i = 0; i < DU_AN.length; i++) if (DU_AN[i].ma === ma) return DU_AN[i]; return null; }

  function moTaYeuCau(h) {
    var d = h.dv ? ' ' + h.dv : '';
    if (h.kieu === 'so') return h.am === h.duong ? (h.am === 0 ? 'Đúng bản vẽ' : '±' + fmtSo(h.am) + d) : '+' + fmtSo(h.duong) + ' / −' + fmtSo(h.am) + d;
    if (h.kieu === 'max') return '≤ ' + fmtSo(h.max) + d;
    if (h.kieu === 'khoang') return fmtSo(h.min) + '–' + fmtSo(h.max) + d;
    return 'Kiểm bằng mắt';
  }
  /* trả 'DAT' | 'KHONG_DAT' | '' (chưa đủ số) */
  function danhGia(h, yc, td) {
    if (h.kieu === 'mat') return td === 'DAT' || td === 'KHONG_DAT' ? td : '';
    var t = so(td); if (!isFinite(t)) return '';
    if (h.kieu === 'max') return t <= h.max + 1e-9 ? 'DAT' : 'KHONG_DAT';
    if (h.kieu === 'khoang') return t >= h.min - 1e-9 && t <= h.max + 1e-9 ? 'DAT' : 'KHONG_DAT';
    var y = so(yc); if (!isFinite(y)) return '';
    var dl = t - y; return dl >= -h.am - 1e-9 && dl <= h.duong + 1e-9 ? 'DAT' : 'KHONG_DAT';
  }
  function moTaLoi(h, yc, td) {
    if (h.kieu === 'mat') return h.ten + ': không đạt khi kiểm bằng mắt';
    if (h.kieu === 'so') { var dl = so(td) - so(yc); return h.ten + ': bản vẽ ' + fmtSo(so(yc)) + ', thực đo ' + fmtSo(so(td)) + ' ' + (h.dv || '') + ' (lệch ' + (dl > 0 ? '+' : '') + fmtSo(dl) + '; cho phép ' + moTaYeuCau(h) + ')'; }
    return h.ten + ': thực đo ' + fmtSo(so(td)) + ' ' + (h.dv || '') + ' (yêu cầu ' + moTaYeuCau(h) + ')';
  }

  /* ---------- trạng thái + nhãn (luôn có CHỮ, không chỉ màu) ---------- */
  var TT = {
    VT: { DAT: ['Đã NT · Đạt', 'ok'], CHUA_NT: ['Chưa NT', 'n'], CHO_BO_SUNG: ['Chờ bổ sung chứng chỉ', 'w'], KHONG_DAT: ['Không đạt', 'b'] },
    PHIEU: { DAT: ['Đạt', 'ok'], CHO_DONG_PUNCH: ['Chờ đóng punch', 'w'], HUY: ['Đã huỷ', 'n'] },
    PUNCH: { MO: ['Mở', 'b'], DA_SUA: ['Đã sửa · chờ QC', 'w'], DA_DONG: ['Đã đóng', 'ok'] },
    DA: TT_DA,
    KH: { CHO: ['Chờ nghiệm thu', 'n'], HOM_NAY: ['Hôm nay', 'w'], TRE: ['Trễ kế hoạch', 'b'], XONG: ['Đã nghiệm thu', 'ok'], HUY: ['Đã huỷ', 'n'] },
    KQ: { DAT: ['Đạt', 'ok'], KHONG_DAT: ['Không đạt', 'b'], '': ['Chưa nhập', 'n'] }
  };
  var MUC = { A: 'A · Dừng việc', B: 'B · Sửa trước bước sau', C: 'C · Ghi nhận' };
  var VAI = { QC: 'QC sơ chế', QC_VT: 'QC vật tư', TO_TRUONG: 'Tổ trưởng', QUAN_LY: 'Quản lý QC', XEM: 'Chỉ xem' };
  function pill(loai, tt) { var x = (TT[loai] || {})[tt] || [tt || '—', 'n']; var g = x[1] === 'ok' ? 'check' : x[1] === 'b' ? 'x' : x[1] === 'w' ? 'clock' : ''; return '<span class="pill p-' + x[1] + '">' + (g ? ic(g) : '') + esc(x[0]) + '</span>'; }

  /* ---------- KHO (giả lập Sheet DATA NT VAT TU) ---------- */
  var KHOA = 'nt_mau_v9', KHOA_VAI = 'nt_vai_v1', KHOA_DA = 'nt_da_v1';
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }

  function duLieuMau() {
    var vt = [
      ['VT-0001', 'H23A1187', 'PL12x1500x6000', 'SS400', 8, 6.78, 'MTC-55120', 'MIR-VIO-031', 'VIOLA_KCT', 'Nhà cung cấp A', -9, 'DAT', ''],
      ['VT-0002', 'H23A1190', 'PL16x1500x6000', 'SS400', 6, 6.78, 'MTC-55121', 'MIR-VIO-031', 'VIOLA_KCT', 'Nhà cung cấp A', -9, 'DAT', ''],
      ['VT-0003', 'K7781203', 'H300x150x6.5x9', 'A572 Gr50', 12, 5.28, 'MTC-88910', 'MIR-BIS-014', 'BISON_U2', 'Nhà cung cấp B', -7, 'DAT', ''],
      ['VT-0004', 'K7781244', 'H400x200x8x13', 'A572 Gr50', 10, 7.92, '', 'MIR-BIS-014', 'BISON_U2', 'Nhà cung cấp B', -7, 'CHO_BO_SUNG', 'Thiếu MTC bản gốc'],
      ['VT-0005', 'G5520019', 'PL8x1250x2500', 'SS400', 20, 3.93, 'MTC-61002', 'MIR-GRE-007', 'GREGORY_DUCT', 'Nhà cung cấp C', -6, 'DAT', ''],
      ['VT-0006', 'G5520031', 'PL6x1250x2500', 'SS400', 15, 2.21, 'MTC-61003', 'MIR-GRE-008', 'GREGORY_DUCT', 'Nhà cung cấp C', -1, 'CHUA_NT', ''],
      ['VT-0007', 'H23B0456', 'PL20x2000x6000', 'Q345B', 4, 7.54, 'MTC-55380', 'MIR-VIO-033', 'VIOLA_KCT', 'Nhà cung cấp A', -4, 'KHONG_DAT', 'Rỗ bề mặt, chiều dày đo 19,1 mm'],
      ['VT-0008', 'K7790012', 'C200x75x8.5', 'SS400', 30, 4.43, 'MTC-88955', 'MIR-BIS-015', 'BISON_U2', 'Nhà cung cấp B', -5, 'DAT', ''],
      ['VT-0009', 'H23A1187', 'L75x75x6', 'SS400', 40, 1.64, 'MTC-55122', 'MIR-VIO-031', 'VIOLA_KCT', 'Nhà cung cấp A', -9, 'DAT', ''],
      ['VT-0010', 'G5520040', 'PL10x1500x6000', 'SS400', 10, 7.07, 'MTC-61010', 'MIR-GRE-009', 'GREGORY_DUCT', 'Nhà cung cấp C', -3, 'DAT', '']
    ].map(function (r) {
      return { ma_vt: r[0], so_heat: r[1], quy_cach: r[2], mac_thep: r[3], so_luong: r[4], khoi_luong_tan: r[5], so_mtc: r[6], so_mir: r[7], du_an: r[8], ncc: r[9],
        ngay_ve: ngayCach(r[10]), trang_thai: r[11], ghi_chu: r[12], ngay_nt: r[11] === 'CHUA_NT' ? '' : ngayCach(r[10] + 1), nguoi_nt: r[11] === 'CHUA_NT' ? '' : 'QC vật tư (mẫu)', ma_lan: 'LN-0001' };
    });
    function kq(list) { return list.map(function (x) { var h = hangMuc(x[0]); return { ma_hm: x[0], yc: x[1], td: x[2], kq: danhGia(h, x[1], x[2]) }; }); }
    var phieu = [
      { ma_phieu: 'SC-AH4-0040', ngay: ngayCach(-6), du_an: 'GREGORY_DUCT', xuong: 'AH4', cong_doan: 'LS', ma_vt: 'VT-0005', so_heat: 'G5520019', ma_chi_tiet: 'GRE-DU-0310', ban_ve: 'GRE-SD-031', rev: 'A', so_ct: 6,
        ket_qua: kq([['LS1', '', '58'], ['LS2', '', 'KHONG_DAT']]), anh: [], ghi_chu: 'Góc trong còn gỉ', trang_thai: 'DAT', nguoi_qc: 'QC sơ chế (mẫu)' },
      { ma_phieu: 'SC-AH1-0088', ngay: ngayCach(-1), du_an: 'BISON_U2', xuong: 'AH1', cong_doan: 'CAT', ma_vt: 'VT-0003', so_heat: 'K7781203', ma_chi_tiet: 'BIS-B-2210', ban_ve: 'BIS-SD-118', rev: 'C', so_ct: 4,
        ket_qua: kq([['CAT1', '5980', '5984'], ['CAT2', '150', '150.5'], ['CAT3', '', '0.6'], ['CAT4', '', 'DAT']]), anh: [], ghi_chu: '', trang_thai: 'CHO_DONG_PUNCH', nguoi_qc: 'QC sơ chế (mẫu)' },
      { ma_phieu: 'SC-AH1-0089', ngay: ngayCach(-3), du_an: 'BISON_U2', xuong: 'AH1', cong_doan: 'KHOAN', ma_vt: 'VT-0008', so_heat: 'K7790012', ma_chi_tiet: 'BIS-C-0412', ban_ve: 'BIS-SD-122', rev: 'A', so_ct: 10,
        ket_qua: kq([['KH1', '22', '21.6'], ['KH2', '80', '80.4'], ['KH3', '40', '40'], ['KH4', '4', '4']]), anh: [], ghi_chu: '', trang_thai: 'CHO_DONG_PUNCH', nguoi_qc: 'QC sơ chế (mẫu)' },
      { ma_phieu: 'SC-AH3-0121', ngay: ngayCach(-2), du_an: 'VIOLA_KCT', xuong: 'AH3', cong_doan: 'CAT', ma_vt: 'VT-0001', so_heat: 'H23A1187', ma_chi_tiet: 'VIO-PL-1021', ban_ve: 'VIO-SD-210', rev: 'B', so_ct: 8,
        ket_qua: kq([['CAT1', '1200', '1201'], ['CAT2', '350', '349'], ['CAT3', '', '0.4'], ['CAT4', '', 'DAT']]), anh: [], ghi_chu: '', trang_thai: 'DAT', nguoi_qc: 'QC sơ chế (mẫu)' },
      { ma_phieu: 'SC-AH3-0122', ngay: ngayCach(-1), du_an: 'VIOLA_KCT', xuong: 'AH3', cong_doan: 'KHOAN', ma_vt: 'VT-0001', so_heat: 'H23A1187', ma_chi_tiet: 'VIO-PL-1022', ban_ve: 'VIO-SD-211', rev: 'B', so_ct: 8,
        ket_qua: kq([['KH1', '22', '22.3'], ['KH2', '120', '121.6'], ['KH3', '45', '45.5'], ['KH4', '6', '6']]), anh: [], ghi_chu: '', trang_thai: 'CHO_DONG_PUNCH', nguoi_qc: 'QC sơ chế (mẫu)' },
      { ma_phieu: 'SC-AH4-0045', ngay: homNay(), du_an: 'GREGORY_DUCT', xuong: 'AH4', cong_doan: 'VAT', ma_vt: 'VT-0005', so_heat: 'G5520019', ma_chi_tiet: 'GRE-DU-0322', ban_ve: 'GRE-SD-033', rev: 'A', so_ct: 12,
        ket_qua: kq([['VM1', '35', '36'], ['VM2', '2', '2.5'], ['VM3', '', 'DAT']]), anh: [], ghi_chu: '', trang_thai: 'DAT', nguoi_qc: 'QC sơ chế (mẫu)' }
    ];
    function ls_(t, ai, viec) { return { t: t, ai: ai, viec: viec }; }
    var punch = [
      { ma_punch: 'P-0001', ma_phieu: 'SC-AH4-0040', mo_ta: 'Đạt cấp làm sạch Sa 2½: góc trong còn gỉ', muc_do: 'B', to: 'Tổ làm sạch', han: ngayCach(-4), trang_thai: 'DA_DONG',
        ngay_mo: ngayCach(-6), ngay_dong: ngayCach(-5), nguoi_dong: 'QC sơ chế (mẫu)', anh_truoc: [], anh_sau: [],
        lich_su: [ls_(ngayCach(-6), 'QC sơ chế (mẫu)', 'Mở punch'), ls_(ngayCach(-5), 'Tổ trưởng (mẫu)', 'Báo đã sửa'), ls_(ngayCach(-5), 'QC sơ chế (mẫu)', 'Đóng punch')] },
      { ma_punch: 'P-0002', ma_phieu: 'SC-AH1-0088', mo_ta: 'Chiều dài: bản vẽ 5.980, thực đo 5.984 mm (lệch +4; cho phép ±2 mm)', muc_do: 'B', to: 'Tổ cắt 1', han: ngayCach(1), trang_thai: 'DA_SUA',
        ngay_mo: ngayCach(-1), ngay_dong: '', nguoi_dong: '', anh_truoc: [], anh_sau: [],
        lich_su: [ls_(ngayCach(-1), 'QC sơ chế (mẫu)', 'Mở punch'), ls_(homNay(), 'Tổ trưởng (mẫu)', 'Báo đã sửa: cắt lại đầu thanh')] },
      { ma_punch: 'P-0003', ma_phieu: 'SC-AH1-0089', mo_ta: 'Đường kính lỗ: bản vẽ 22, thực đo 21,6 mm (lệch −0,4; cho phép +0,5 / −0 mm)', muc_do: 'A', to: 'Tổ khoan', han: ngayCach(-1), trang_thai: 'MO',
        ngay_mo: ngayCach(-3), ngay_dong: '', nguoi_dong: '', anh_truoc: [], anh_sau: [], lich_su: [ls_(ngayCach(-3), 'QC sơ chế (mẫu)', 'Mở punch')] },
      { ma_punch: 'P-0004', ma_phieu: 'SC-AH3-0122', mo_ta: 'Khoảng cách tâm lỗ: bản vẽ 120, thực đo 121,6 mm (lệch +1,6; cho phép ±1 mm)', muc_do: 'B', to: 'Tổ khoan', han: ngayCach(2), trang_thai: 'MO',
        ngay_mo: ngayCach(-1), ngay_dong: '', nguoi_dong: '', anh_truoc: [], anh_sau: [], lich_su: [ls_(ngayCach(-1), 'QC sơ chế (mẫu)', 'Mở punch')] }
    ];
    var ke_hoach = [
      ['KH-0001', 'VIOLA_KCT', -2, 'AH3', 'CAT', 'VIO-PL-1021', 'VIO-SD-210', 8, 'XONG', 'SC-AH3-0121'],
      ['KH-0002', 'VIOLA_KCT', -1, 'AH3', 'KHOAN', 'VIO-PL-1022', 'VIO-SD-211', 8, 'XONG', 'SC-AH3-0122'],
      ['KH-0003', 'BISON_U2', -1, 'AH1', 'CAT', 'BIS-B-2210', 'BIS-SD-118', 4, 'XONG', 'SC-AH1-0088'],
      ['KH-0004', 'BISON_U2', -1, 'AH1', 'KHOAN', 'BIS-B-2211', 'BIS-SD-118', 4, 'CHO', ''],
      ['KH-0005', 'GREGORY_DUCT', 0, 'AH4', 'VAT', 'GRE-DU-0322', 'GRE-SD-033', 12, 'XONG', 'SC-AH4-0045'],
      ['KH-0006', 'GREGORY_DUCT', 0, 'AH4', 'CAT', 'GRE-PL-0901', 'GRE-SD-034', 10, 'CHO', ''],
      ['KH-0007', 'VIOLA_KCT', 0, 'AH3', 'VAT', 'VIO-PL-1030', 'VIO-SD-212', 6, 'CHO', ''],
      ['KH-0008', 'BISON_U2', 1, 'AH1', 'LS', 'BIS-B-2210', 'BIS-SD-118', 4, 'CHO', ''],
      ['KH-0009', 'VIOLA_KCT', 2, 'AH3', 'UON', 'VIO-PL-1041', 'VIO-SD-215', 2, 'CHO', '']
    ].map(function (r) { return { ma_kh: r[0], du_an: r[1], ngay: ngayCach(r[2]), xuong: r[3], cong_doan: r[4], ma_chi_tiet: r[5], ban_ve: r[6], so_luong: r[7], trang_thai: r[8], ma_phieu: r[9], ngay_lam: r[9] ? ngayCach(r[2]) : '', ghi_chu: '', nguoi_lap: 'Quản lý QC (mẫu)' }; });
    /* SƠ ĐỒ CẮT (SDC, nesting): 1 sơ đồ dùng NHIỀU tấm / heat. Mỗi dòng cắt = part mark · heat · số lượng (user xác nhận 18/11) */
    var sdc = [
      ['SDC-AH1-0101', 'VIOLA_KCT', 'AH1', 'CNC Plasma 1', -3, [['VIO-PL-1021', 'VT-0001', 8], ['VIO-PL-1022', 'VT-0001', 4], ['VIO-PL-1022', 'VT-0002', 4], ['VIO-PL-1030', 'VT-0001', 6], ['VIO-PL-1041', 'VT-0002', 2]]],
      ['SDC-AH1-0103', 'BISON_U2', 'AH1', 'Cưa vòng 2', -2, [['BIS-B-2210', 'VT-0003', 4], ['BIS-B-2211', 'VT-0003', 4]]],
      ['SDC-AH1-0104', 'BISON_U2', 'AH1', 'Cưa vòng 2', -4, [['BIS-C-0412', 'VT-0008', 10]]],
      ['SDC-AH1-0105', 'GREGORY_DUCT', 'AH1', 'CNC Oxy 3', -7, [['GRE-DU-0310', 'VT-0005', 6], ['GRE-DU-0322', 'VT-0005', 8], ['GRE-DU-0322', 'VT-0010', 4]]],
      ['SDC-AH1-0106', 'GREGORY_DUCT', 'AH1', 'CNC Oxy 3', -1, [['GRE-PL-0901', 'VT-0010', 10]]]
    ].map(function (r) { return { ma_sdc: r[0], du_an: r[1], xuong: r[2], may: r[3], ngay_cat: ngayCach(r[4]), nguon: 'Mẫu',
      dong: r[5].map(function (x) { var v = vt.filter(function (y) { return y.ma_vt === x[1]; })[0]; return { part: x[0], ma_vt: x[1], so_heat: v.so_heat, quy_cach: v.quy_cach, sl: x[2] }; }) }; });
    /* MẪU dữ liệu chép từ 2 file AH1 (bản thật: tab AH1_CAT / AH1_CHI_TIET / AH1_LSX do dongBoAH1() chép về) */
    function k(o) { o.k_lsx = String(o.lsx || '').toUpperCase().replace(/\s+/g, '').replace(/-/g, '_'); if ('ten_chi_tiet' in o) o.k_ten = String(o.ten_chi_tiet).toUpperCase().replace(/\s+/g, ''); if ('code' in o) o.k_code = String(o.code).toUpperCase().replace(/\s+/g, ''); return o; }
    var dmy = function (n) { var d = new Date(); d.setDate(d.getDate() + n); return d.getDate() + '/' + (d.getMonth() + 1) + '/' + String(d.getFullYear()).slice(2); };
    var ah1_cat = [
      ['526_196', 'VIO-PL-1022', 'VIOLA-STRUCTURAL STEEL-200', 'MÁY CNC FIN 2 MỎ', '12', '150', '480', 8, 'AH3', ngayCach(-3), '1', 'B97301', '6-H', 'GS HẢI', dmy(-2)],
      ['526_196', 'VIO-PL-1030', 'VIOLA-STRUCTURAL STEEL-200', 'MÁY CNC FIN 2 MỎ', '12', '200', '600', 6, 'AH3', ngayCach(-2), '2', 'B97302', '6-H', 'GS HẢI', dmy(0)],
      ['526_197', 'VIO-PL-1060', 'VIOLA-STRUCTURAL STEEL-200', 'Máy cắt Plasma 3000', '12', '180', '520', 3, 'AH3', ngayCach(-1), '1', 'B97310', '6-K', 'GS TÂN', dmy(0)],
      ['500_88', 'BIS-B-2211', 'EVAPCO BISON STRUCTURE', 'Máy Cưa', '', '', '6000', 4, 'AH1', ngayCach(-2), '1', 'B96001', '5-A', 'GS HẢI', dmy(-1)],
      ['483_69', 'GRE-PL-0901', 'EVAPCO-GREGORY-STRUCTURAL STEEL', 'Máy cắt CNC lazer Yamei-20KW', '10', '300', '1500', 10, 'AH4', ngayCach(-1), '2', 'B95010', '4-C', 'GS TÂN', dmy(0)]
    ].map(function (r, i) { return k({ lsx: r[0], ten_chi_tiet: r[1], cong_trinh: r[2], may: r[3], day: r[4], rong1: r[5], dai: r[6], sl_tong: String(r[7]), giao_dvgc: r[8], ngay_ra_bai: r[9], ca: r[10], ten_vat_tu_g: r[11], phieu_ban_giao: r[12], nguoi_thuc_hien: r[13], moi_nghiem_thu: r[14], dong_nguon: String(4 + i) }); });
    var ah1_ct = [
      ['526_196', 'A200111', 'VIOLA-STRUCTURAL STEEL-200', 'AH3', 'PLENUM-E', 'VIO-PL-1022', '12', '150', '480', '8', 'SS400', '5000', '12*150'],
      ['526_196', 'A200112', 'VIOLA-STRUCTURAL STEEL-200', 'AH3', 'PLENUM-E', 'VIO-PL-1030', '12', '200', '600', '6', 'SS400', '5000', '12*200'],
      ['500_88', 'A150020', 'EVAPCO BISON STRUCTURE', 'AH1', 'BEAM', 'BIS-B-2211', '', '', '6000', '4', 'A572 Gr50', 'Máy Cưa', 'H300x150']
    ].map(function (r, i) { return k({ lsx: r[0], code: r[1], du_an: r[2], dvgc: r[3], cau_kien: r[4], ten_chi_tiet: r[5], day: r[6], rong1: r[7], dai: r[8], sl: r[9], mac_thep: r[10], may_cat: r[11], qui_cach: r[12], dong_nguon: String(2 + i) }); });
    var ah1_lsx = [['526_196', 'MODULE E', 'MAIN STRUCTURE - PLENUM – MODULE E', 'AH3', '10725-009', 'VIOLA-STRUCTURAL STEEL-200', '6,2', '4,1', '2,1', '🟡 Theo dõi'], ['500_88', '', 'BIỆN PHÁP GIA CÔNG LẮP THỬ', 'AH4', '10725-003', 'EVAPCO BISON STRUCTURE', '0,1', '0,1', '0,0', '🟢 Đúng tiến độ']]
      .map(function (r, i) { return k({ lsx: r[0], zone: r[1], hang_muc: r[2], dvgc: r[3], ma_da: r[4], du_an: r[5], tong_kl: r[6], da_cat: r[7], con_lai: r[8], canh_bao_tre: r[9], bat_dau: ngayCach(-10), ket_thuc: ngayCach(10), dong_nguon: String(4 + i) }); });
    var chung_chi = vt.filter(function (v) { return v.so_mtc; }).map(function (v, i) { return { ma_cc: 'CC-' + pad(i + 1, 4), ma_vt: v.ma_vt, so_heat: v.so_heat, loai: 'MTC', so: v.so_mtc, ngay: v.ngay_ve, ten_tep: '', link: '', ghi_chu: 'Mẫu', nguoi: 'QC vật tư (mẫu)', luc: v.ngay_ve }; });
    /* mẫu hồ sơ truy xuất: 3 tấm (MRIR) + 6 dòng part (MTR), có 1 mã tấm thiếu MRIR và 1 heat lệch để thấy cảnh báo */
    var kx = function (o, ks) { ks.forEach(function (p) { o[p[0]] = chuanHeat(o[p[1]]); }); return o; };
    var tx_vt = [['MAU-001', '12x3000x12000', 'EN 10025-2', 'POSCO (Korea)', 'S355J2+N', 'MTC-A1', 'SB53006', '5', '16955', 'Acc', 'MRIR001'], ['MAU-002', '16x2001x12000', 'EN 10025-2', 'POSCO (Korea)', 'S355J2+N', 'MTC-A2', 'SU55043', '6', '18096', 'Acc', 'MRIR001'], ['MAU-003', '18x2000x12000', 'ASTM A572', 'NIPPON STEEL (Japan)', 'Grade 50', 'P-74643', 'G4075', '1', '3391', 'Rej', 'MRIR002']]
      .map(function (r) { return kx({ du_an: 'DỰ ÁN MẪU', ma_tam: r[0], su_dung: '', quy_cach: r[1], tieu_chuan: r[2], nha_sx: r[3], mac: r[4], so_mtc: r[5], so_heat: r[6], sl: r[7], kl_kg: r[8], ket_qua: r[9], ghi_chu: '', so_mrir: r[10], nguon: 'Mẫu' }, [['k_tam', 'ma_tam'], ['k_heat', 'so_heat'], ['k_mtc', 'so_mtc'], ['k_mrir', 'so_mrir']]); });
    var tx_ct = [['BV-001', '0', 'CK-001', 'PH1', '12', 'PL12X88', 'S355J2', 'MTC-A1', 'SB53006', 'MAU-001', 'MRIR001'], ['BV-001', '0', 'CK-001', 'PH152', '1', 'PL16X250', 'S355J2', 'MTC-A2', 'SU55043', 'MAU-002', 'MRIR001'], ['BV-001', '0', 'CK-002', 'PH1', '4', 'PL12X88', 'S355J2', 'MTC-A1', 'SB53006', 'MAU-001', 'MRIR001'],
      ['BV-002', '1', 'CK-003', 'PH155', '1', 'PL18X250', 'A572-GR.50', 'P-74643', 'G4075', 'MAU-003', 'MRIR002'], ['BV-002', '1', 'CK-003', 'PL124', '2', 'PL12X85', 'S355J2', 'MTC-A1', 'SB99999', 'MAU-001', 'MRIR001'], ['BV-002', '1', 'CK-003', 'PL200', '2', 'PL20X100', 'S355J2', 'MTC-Z9', 'SZ00001', 'MAU-009', 'MRIR003']]
      .map(function (r) { return kx({ du_an: 'DỰ ÁN MẪU', ban_ve: r[0], rev: r[1], cau_kien: r[2], part: r[3], sl: r[4], quy_cach: r[5], mac: r[6], so_mtc: r[7], so_heat: r[8], ma_tam: r[9], so_mrir: r[10], kl: '', nguon: 'Mẫu' }, [['k_part', 'part'], ['k_ck', 'cau_kien'], ['k_bv', 'ban_ve'], ['k_heat', 'so_heat'], ['k_tam', 'ma_tam'], ['k_mtc', 'so_mtc']]); });
    var yc = [['VIOLA-STRUCTURAL STEEL-200', 'Khoan lỗ', 'Lỗ ≤ Ø22: cắt laser. Lỗ > Ø22: khoan CNC. Không đột.'], ['VIOLA-STRUCTURAL STEEL-200', 'Mã màu', 'Đánh dấu sơn VÀNG ở đầu chi tiết sau khi QC đạt.'], ['VIOLA-STRUCTURAL STEEL-200', 'Đóng số / heat', 'Đóng số heat + part mark bằng búa số, cách mép 30 mm.'], ['EVAPCO BISON STRUCTURE', 'Mã màu', 'Đánh dấu sơn XANH DƯƠNG.']]
      .map(function (r, i) { return { ma_yc: 'YC-' + pad(i + 1, 4), cong_trinh: r[0], loai: r[1], noi_dung: r[2], hoat_dong: 'CO', nguoi: 'Quản lý (mẫu)', luc: homNay() + ' 08:00' }; });
    var xn = [{ ma_xn: 'XN-0001', lsx: '526_196', cong_trinh: 'VIOLA-STRUCTURAL STEEL-200', ngay: ngayCach(-1), kl_tan: 1.5, sl_chi_tiet: 8, ghi_chu: 'Đợt 1', vuot_xuong: '', trang_thai: 'HIEU_LUC', ly_do_huy: '', nguoi: 'QC xưởng (mẫu)', luc: ngayCach(-1) + ' 15:30' }];
    return { yc: yc, xn: xn, tx_vt: tx_vt, tx_ct: tx_ct, tx_tt: { trang_thai: 'MAU', luc: homNay(), ket_qua: ['Dữ liệu MẪU'] }, chung_chi: chung_chi, ah1_cat: ah1_cat, ah1_ct: ah1_ct, ah1_lsx: ah1_lsx, ah1_tt: { trang_thai: 'MAU', luc: homNay(), ket_qua: ['Dữ liệu MẪU'] }, du_an: duAnMau(), ke_hoach: ke_hoach, sdc: sdc, vt: vt, phieu: phieu, punch: punch, lan_nap: [{ ma_lan: 'LN-0001', ten_file: 'VAT TU DA NT (mau).xlsx', so_dong: 10, so_them: 10, so_trung: 0, so_loi: 0, nguoi: 'QC vật tư (mẫu)', thoi_diem: ngayCach(-9) + ' 08:15' }],
      nhat_ky: [], dem: { phieu: { AH1: 89, AH3: 122, AH4: 45, AH6: 0 }, punch: 4, vt: 10, lan: 1, kh: 9, lan_sdc: 0, cc: 9 } };
  }
  var S;
  function napKho() { try { var t = ls(KHOA); S = t ? JSON.parse(t) : null; } catch (e) { S = null; } if (!S || !S.vt || !S.du_an || !S.ke_hoach || !S.sdc || !S.ah1_cat || !S.chung_chi || !S.tx_ct || !S.yc || !S.xn || (S.sdc[0] && !S.sdc[0].dong)) S = duLieuMau(); DU_AN = S.du_an; }
  function luuKho() { if (CHE_DO !== 'mau') return; try { ls(KHOA, JSON.stringify(S)); } catch (e) { /* đầy bộ nhớ: bỏ qua, bản mẫu */ } }
  function khoRong() { return { yc: [], xn: [], kn: [], chung_chi: [], ah1_cat: [], ah1_ct: [], ah1_lsx: [], du_an: [], ke_hoach: [], sdc: [], vt: [], phieu: [], punch: [], lan_nap: [], nhat_ky: [], dem: { phieu: {}, punch: 0, vt: 0, lan: 0, kh: 0, lan_sdc: 0, kn: 0 } }; }
  if (CHE_DO === 'mau') napKho(); else { S = khoRong(); DU_AN = S.du_an; }

  var vai = ls(KHOA_VAI) || 'QC';
  var daChon = ls(KHOA_DA) || '';
  if (daChon && !layDuAn(daChon)) daChon = '';
  function theoDA(ma) { return !daChon || ma === daChon; }
  var tenND = '';
  function tenNguoi() { return tenND || (VAI[vai] + ' (mẫu)'); }
  function ghiNK(hanhDong, bang, ma, cu, moi) { S.nhat_ky.push({ t: homNay() + ' ' + gioPhut(), ai: tenNguoi(), hanh_dong: hanhDong, bang: bang, ma: ma, cu: cu || '', moi: moi || '' }); if (CHE_DO === 'mau' && S.nhat_ky.length > 500) S.nhat_ky.shift(); }
  function loi(msg) { var e = new Error(msg); e.nguoiDung = true; throw e; }
  var LOAI_YC = ['Mã màu', 'Khoan lỗ', 'Cắt', 'Vát mép', 'Đóng số / heat', 'Bề mặt', 'Dung sai', 'Khác'];
  var LOAI_LOI = ['Kích thước', 'Lỗ khoan', 'Vát mép', 'Đóng số / heat', 'Bề mặt', 'Cong vênh', 'Vật tư', 'Khác'];
  function knCua(lsx, part) { var kl = chuanHeat(lsx).replace(/-/g, '_'), kp = chuanHeat(part); return (S.kn || []).filter(function (x) { return x.kq !== 'HUY' && chuanHeat(x.ma_chi_tiet) === kp && (!kl || chuanHeat(x.lsx).replace(/-/g, '_') === kl); }); }
  function dsYeuCauCua(congTrinh) { var k = chuanTen(congTrinh); if (!k) return []; return (S.yc || []).filter(function (y) { return y.hoat_dong !== 'KHONG' && chuanTen(y.cong_trinh) === k; }); }
  function klXacNhan(lsx) { var k = chuanHeat(lsx).replace(/-/g, '_'); return (S.xn || []).reduce(function (s, x) { var v = so(x.kl_tan); return s + (x.trang_thai !== 'HUY' && chuanHeat(x.lsx).replace(/-/g, '_') === k && isFinite(v) ? v : 0); }, 0); }
  function canVai(ds, viec) { if (ds.indexOf(vai) < 0) loi('Vai trò "' + VAI[vai] + '" không được ' + viec + '. Cần: ' + ds.map(function (v) { return VAI[v]; }).join(' / ') + '.'); }
  function goi(f) { if (CHE_DO === 'may_chu') return f(); return new Promise(function (ok, ko) { setTimeout(function () { try { var r = f(); luuKho(); ok(r); } catch (e) { ko(e); } }, 120); }); }
  function sao(x) { return JSON.parse(JSON.stringify(x)); }
  function timVT(ma) { for (var i = 0; i < S.vt.length; i++) if (S.vt[i].ma_vt === ma) return S.vt[i]; return null; }
  function timPhieu(ma) { for (var i = 0; i < S.phieu.length; i++) if (S.phieu[i].ma_phieu === ma) return S.phieu[i]; return null; }
  function timPunch(ma) { for (var i = 0; i < S.punch.length; i++) if (S.punch[i].ma_punch === ma) return S.punch[i]; return null; }
  function capNhatTTPhieu(ma) {
    var p = timPhieu(ma); if (!p || p.trang_thai === 'HUY') return;
    var con = S.punch.filter(function (x) { return x.ma_phieu === ma && x.trang_thai !== 'DA_DONG'; }).length;
    var moi = con ? 'CHO_DONG_PUNCH' : 'DAT';
    if (moi !== p.trang_thai) { ghiNK('Tự chuyển trạng thái phiếu', 'PHIEU_SO_CHE', ma, p.trang_thai, moi); p.trang_thai = moi; }
  }
  function timKH(ma) { for (var i = 0; i < S.ke_hoach.length; i++) if (S.ke_hoach[i].ma_kh === ma) return S.ke_hoach[i]; return null; }
  function ttKH(k) { if (k.trang_thai !== 'CHO') return k.trang_thai; var t = homNay(); return k.ngay < t ? 'TRE' : k.ngay === t ? 'HOM_NAY' : 'CHO'; }
  function phieuDatLanDau(p) { return p.ket_qua.every(function (x) { return x.kq === 'DAT'; }); }
  function sdcCuaPart(part) { var k = chuanHeat(part); return S.sdc.filter(function (d) { return d.dong.some(function (x) { return chuanHeat(x.part) === k; }); }); }
  /* các dòng cắt của 1 part (mỗi dòng: SDC · heat · SL) */
  function dongCuaPart(part) { var k = chuanHeat(part), o = []; S.sdc.forEach(function (d) { d.dong.forEach(function (x) { if (chuanHeat(x.part) === k) o.push({ ma_sdc: d.ma_sdc, du_an: d.du_an, ngay_cat: d.ngay_cat, may: d.may, xuong: d.xuong, ma_vt: x.ma_vt, so_heat: x.so_heat, quy_cach: x.quy_cach, sl: x.sl }); }); }); return o; }
  function heatCuaPart(part) { var m = {}; dongCuaPart(part).forEach(function (x) { m[x.ma_vt] = x.so_heat; }); return m; }
  function tamSDC(d) { var m = {}; d.dong.forEach(function (x) { m[x.ma_vt] = x; }); return Object.keys(m).map(function (k) { return { ma_vt: k, so_heat: m[k].so_heat, quy_cach: m[k].quy_cach }; }); }
  function partSDC(d) { var m = {}; d.dong.forEach(function (x) { m[x.part] = (m[x.part] || 0) + (Number(x.sl) || 0); }); return Object.keys(m); }
  function ganDA(pu) { var ph = timPhieu(pu.ma_phieu); pu.du_an = ph ? ph.du_an : (pu.cong_trinh ? duAnTheoTenAH1(pu.cong_trinh) : ''); return pu; }
  function quaHan(p) { return p.trang_thai !== 'DA_DONG' && p.han && p.han < homNay(); }

  /* ---------- NẠP EXCEL: dò cột theo TÊN không dấu ---------- */
  var COT = [
    { k: 'so_heat', ten: 'Heat no', bat: true, ten_cot: ['heat', 'heat no', 'so heat', 'heat number', 'so me', 'heat no lot no'] },
    { k: 'quy_cach', ten: 'Quy cách', bat: true, ten_cot: ['quy cach', 'kich thuoc', 'size', 'profile', 'quy cach vat tu', 'dimension', 'material description', 'description', 'mo ta vat tu', 'mo ta'] },
    { k: 'mac_thep', ten: 'Mác thép', ten_cot: ['mac thep', 'mac', 'grade', 'vat lieu', 'material', 'material grade'] },
    { k: 'so_luong', ten: 'Số lượng', ten_cot: ['so luong', 'sl', 'qty', 'quantity', 'quantity pcs', 'q ty pcs', 'q ty'] },
    { k: 'khoi_luong', ten: 'Khối lượng', ten_cot: ['khoi luong', 'kl', 'weight', 'khoi luong tan', 'kl tan', 'khoi luong kg', 'kl kg', 'weight kg', 'weight ton', 'weight total', 'total weight'] },
    { k: 'so_mtc', ten: 'Số MTC', ten_cot: ['mtc', 'so mtc', 'mill cert', 'mill certificate', 'mill certificate no', 'chung chi', 'so chung chi', 'cert no'] },
    { k: 'so_mir', ten: 'Số MIR / phiếu nhập', ten_cot: ['mir', 'so mir', 'mir no', 'mrir', 'mrir no', 'so bao cao report no', 'phieu nhap', 'so phieu nhap', 'so phieu'] },
    { k: 'du_an', ten: 'Dự án', ten_cot: ['du an', 'project', 'ma du an'] },
    { k: 'ncc', ten: 'Nhà cung cấp', ten_cot: ['ncc', 'nha cung cap', 'supplier', 'vendor', 'manufacturers', 'manufactures origin', 'manufacturer'] },
    { k: 'ngay_ve', ten: 'Ngày về', ten_cot: ['ngay ve', 'ngay nhap', 'ngay nhan', 'date', 'receive date'] },
    { k: 'trang_thai', ten: 'Kết quả NT', ten_cot: ['ket qua nt', 'ket qua nghiem thu', 'result acc rej', 'result', 'ket qua', 'trang thai', 'status'] },
    { k: 'ghi_chu', ten: 'Ghi chú', ten_cot: ['ghi chu', 'note', 'remark', 'remarks'] }
  ];
  function khopCot(tieuDe) {
    var map = {}, dung = {};
    COT.forEach(function (c) {
      map[c.k] = -1;
      for (var i = 0; i < tieuDe.length; i++) { if (dung[i]) continue; var t = chuanTen(tieuDe[i]); if (c.ten_cot.indexOf(t) >= 0) { map[c.k] = i; dung[i] = 1; return; } }
      for (var j = 0; j < tieuDe.length; j++) { if (dung[j]) continue; var u = chuanTen(tieuDe[j]); if (u && c.ten_cot.some(function (a) { return u.indexOf(a + ' ') === 0 || u === a; })) { map[c.k] = j; dung[j] = 1; return; } }
    });
    return map;
  }
  function timDongTieuDe(bang) {
    var best = -1, diem = 1;
    for (var r = 0; r < Math.min(bang.length, 12); r++) { var m = khopCot(bang[r] || []), d = 0; for (var k in m) if (m[k] >= 0) d++; if (d > diem) { diem = d; best = r; } }
    return best;
  }
  var COT_SDC = [
    { k: 'ma_sdc', ten: 'Số SDC / LSX', bat: true, ten_cot: ['lsx', 'so lsx', 'lenh san xuat', 'sdc', 'so sdc', 'ma sdc', 'so do cat', 'so so do cat', 'nesting', 'nesting no', 'so nesting', 'ma so do'] },
    { k: 'part', ten: 'Part mark', bat: true, ten_cot: ['part mark', 'part', 'part no', 'ma chi tiet', 'chi tiet', 'mark', 'member', 'part mark no'] },
    { k: 'heat', ten: 'Heat no / mã VT', bat: true, ten_cot: ['heat', 'heat no', 'so heat', 'ma vt', 'ma vat tu', 'heat number'] },
    { k: 'sl', ten: 'Số lượng', ten_cot: ['sl', 'so luong', 'qty', 'quantity'] },
    { k: 'quy_cach', ten: 'Quy cách tấm', ten_cot: ['quy cach', 'quy cach tam', 'size', 'kich thuoc', 'profile'] },
    { k: 'du_an', ten: 'Dự án', ten_cot: ['du an', 'project', 'ma du an'] },
    { k: 'xuong', ten: 'Xưởng', ten_cot: ['xuong', 'workshop'] },
    { k: 'may', ten: 'Máy cắt', ten_cot: ['may', 'may cat', 'machine'] },
    { k: 'ngay_cat', ten: 'Ngày cắt', ten_cot: ['ngay cat', 'ngay', 'date', 'cut date'] }
  ];
  function khopCotTheo(dsCot, tieuDe) {
    var map = {}, dung = {};
    dsCot.forEach(function (c) {
      map[c.k] = -1;
      for (var i = 0; i < tieuDe.length; i++) { if (dung[i]) continue; if (c.ten_cot.indexOf(chuanTen(tieuDe[i])) >= 0) { map[c.k] = i; dung[i] = 1; return; } }
      for (var j = 0; j < tieuDe.length; j++) { if (dung[j]) continue; var u = chuanTen(tieuDe[j]); if (u && c.ten_cot.some(function (a) { return u.indexOf(a + ' ') === 0; })) { map[c.k] = j; dung[j] = 1; return; } }
    });
    return map;
  }
  function phanTichSDC(bang, daMacDinh) {
    var r0 = -1, diem = 1;
    for (var r = 0; r < Math.min(bang.length, 12); r++) { var m = khopCotTheo(COT_SDC, bang[r] || []), d = 0; for (var kk in m) if (m[kk] >= 0) d++; if (d > diem) { diem = d; r0 = r; } }
    if (r0 < 0) return { loiChung: 'Không tìm thấy dòng tiêu đề. Cần ít nhất cột "Số SDC", "Part mark", "Heat no" ở 12 dòng đầu.' };
    var tieuDe = bang[r0].map(function (x) { return String(x == null ? '' : x); }), map = khopCotTheo(COT_SDC, tieuDe);
    var thieu = COT_SDC.filter(function (c) { return c.bat && !(map[c.k] >= 0); }).map(function (c) { return c.ten; });
    var daCo = {}; S.sdc.forEach(function (d) { d.dong.forEach(function (x) { daCo[chuanHeat(d.ma_sdc) + '|' + chuanHeat(x.part) + '|' + x.ma_vt] = 1; }); });
    var dong = [], trongFile = {};
    for (var i = r0 + 1; i < bang.length; i++) {
      var row = bang[i] || []; if (!row.some(function (x) { return String(x == null ? '' : x).trim() !== ''; })) continue;
      var g = function (k) { return map[k] >= 0 ? String(row[map[k]] == null ? '' : row[map[k]]).trim() : ''; };
      var gt = { ma_sdc: chuanHeat(g('ma_sdc')), part: chuanHeat(g('part')), heat: chuanHeat(g('heat')), sl: laTrong(g('sl')) ? 1 : so(g('sl')), quy_cach: g('quy_cach').replace(/\s+/g, ''), xuong: g('xuong').toUpperCase(), may: g('may'), ngay_cat: chuanNgay(g('ngay_cat')), du_an: '' };
      var ly = [], dA = chuanTen(g('du_an'));
      if (dA) DU_AN.forEach(function (d) { if (!gt.du_an && (chuanTen(d.ma) === dA || chuanTen(d.ten) === dA || (d.ma_hd && chuanTen(d.ma_hd) === dA))) gt.du_an = d.ma; });
      if (dA && !gt.du_an) ly.push('Dự án "' + g('du_an') + '" chưa có trong danh mục');
      if (!gt.ma_sdc) ly.push('Thiếu số SDC');
      if (!gt.part) ly.push('Thiếu part mark');
      if (!isFinite(gt.sl) || gt.sl <= 0) ly.push('Số lượng không hợp lệ');
      var ds = gt.heat ? S.vt.filter(function (v) { return chuanHeat(v.so_heat) === gt.heat || v.ma_vt.toUpperCase() === gt.heat; }) : [];
      if (gt.quy_cach && ds.length > 1) { var q = ds.filter(function (v) { return chuanHeat(v.quy_cach) === chuanHeat(gt.quy_cach); }); if (q.length) ds = q; }
      var daX = gt.du_an || daMacDinh || ''; if (daX && ds.length > 1) { var q2 = ds.filter(function (v) { return v.du_an === daX; }); if (q2.length) ds = q2; }
      var v = ds.length === 1 ? ds[0] : null;
      if (!gt.heat) ly.push('Thiếu heat no');
      else if (!ds.length) ly.push('Heat ' + gt.heat + ' không có trong danh sách vật tư đã nạp');
      else if (!v) ly.push('Heat ' + gt.heat + ' có ' + ds.length + ' quy cách, cần cột Quy cách tấm');
      if (v) { gt.ma_vt = v.ma_vt; gt.so_heat = v.so_heat; gt.quy_cach = v.quy_cach; if (!gt.du_an) gt.du_an = v.du_an;
        if (v.trang_thai !== 'DAT') ly.push('Vật tư ' + v.so_heat + ' đang "' + TT.VT[v.trang_thai][0] + '", không được cắt');
        if (daX && v.du_an && v.du_an !== daX) ly.push('Heat thuộc dự án ' + tenDuAn(v.du_an)); }
      if (!gt.du_an) gt.du_an = daMacDinh || '';
      var key = gt.ma_sdc + '|' + gt.part + '|' + (gt.ma_vt || ''), tt = ly.length ? 'LOI' : 'OK';
      if (tt === 'OK' && daCo[key]) { tt = 'TRUNG'; ly.push('Đã có, bỏ qua'); }
      else if (tt === 'OK' && trongFile[key]) { tt = 'TRUNG'; ly.push('Trùng dòng ' + trongFile[key] + ', bỏ qua'); }
      else if (tt === 'OK') trongFile[key] = i + 1;
      dong.push({ so: i + 1, gt: gt, tt: tt, ly_do: ly.join('; ') });
    }
    return { tieuDe: tieuDe, dongTieuDe: r0 + 1, map: map, thieu: thieu, dong: dong, cot: COT_SDC };
  }
  var TSV_SDC_MAU = ['SƠ ĐỒ CẮT (dữ liệu MẪU)', '', ['Số SDC', 'Dự án', 'Xưởng', 'Máy cắt', 'Ngày cắt', 'Heat No', 'Quy cách tấm', 'Part mark', 'SL'].join('\t'),
    ['SDC-AH1-0110', 'VIOLA_KCT', 'AH1', 'CNC Plasma 1', '17/11/2026', 'H23A1190', 'PL16x1500x6000', 'VIO-PL-1050', '4'].join('\t'),
    ['SDC-AH1-0110', 'VIOLA_KCT', 'AH1', 'CNC Plasma 1', '17/11/2026', 'H23A1190', 'PL16x1500x6000', 'VIO-PL-1051', '6'].join('\t'),
    ['SDC-AH1-0110', 'VIOLA_KCT', 'AH1', 'CNC Plasma 1', '17/11/2026', 'H23A1187', 'PL12x1500x6000', 'VIO-PL-1051', '2'].join('\t'),
    ['SDC-AH1-0111', 'BISON_U2', 'AH1', 'Cưa vòng 2', '17/11/2026', 'K7781244', 'H400x200x8x13', 'BIS-B-2250', '2'].join('\t'),
    ['SDC-AH1-0112', 'VIOLA_KCT', 'AH1', 'CNC Plasma 1', '17/11/2026', 'H23A1187', '', 'VIO-PL-1060', '3'].join('\t'),
    ['SDC-AH1-0101', 'VIOLA_KCT', 'AH1', 'CNC Plasma 1', '14/11/2026', 'H23A1187', 'PL12x1500x6000', 'VIO-PL-1021', '8'].join('\t')
  ].join('\n');
  function chuanNgay(v) {
    if (v instanceof Date && !isNaN(v)) return isoNgay(v);
    var s = String(v == null ? '' : v).trim(); if (!s) return '';
    var m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/); if (m) return (m[3].length === 2 ? '20' + m[3] : m[3]) + '-' + pad(m[2]) + '-' + pad(m[1]);
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    if (/^\d{5}$/.test(s)) { var d = new Date(Date.UTC(1899, 11, 30) + Number(s) * 864e5); return d.toISOString().slice(0, 10); }
    return s;
  }
  /* User chốt 19/11: danh sách NẠP VÀO là vật tư ĐÃ NGHIỆM THU → mặc định ĐẠT.
     Chỉ khi file ghi rõ Rej / Không đạt → Không đạt; ghi Chờ / bổ sung → Chờ bổ sung. Thiếu số MTC vẫn nạp là Đạt, màn Kiểm soát hồ sơ sẽ nhắc bổ sung MTC. */
  function chuanTT(v, mtc) {
    var t = chuanTen(v);
    if (/^(khong dat|ng|fail|failed|rej|reject|rejected)$/.test(t)) return 'KHONG_DAT';
    if (/bo sung|^cho\b|cho bo sung|hold|pending/.test(t)) return 'CHO_BO_SUNG';
    return 'DAT';
  }
  /* bang = mảng 2 chiều (dòng × cột). Trả về {tieuDe, dongTieuDe, map, thieu[], dong[] {so, gt, tt:'OK'|'TRUNG'|'LOI', ly_do}} — CHƯA ghi */
  function phanTichBang(bang, daMacDinh) {
    var r0 = timDongTieuDe(bang);
    if (r0 < 0) return { loiChung: 'Không tìm thấy dòng tiêu đề. Cần ít nhất cột "Heat no" và "Quy cách" (hoặc "Description") ở 12 dòng đầu.' };
    var tieuDe = bang[r0].map(function (x) { return String(x == null ? '' : x); }), map = khopCot(tieuDe);
    var thieu = COT.filter(function (c) { return c.bat && !(map[c.k] >= 0); }).map(function (c) { return c.ten; });
    var laKg = map.khoi_luong >= 0 && /kg/.test(chuanTen(tieuDe[map.khoi_luong]));
    var daCo = {}; S.vt.forEach(function (v) { daCo[chuanHeat(v.so_heat) + '|' + chuanHeat(v.quy_cach) + '|' + v.du_an] = v.ma_vt; });
    var trongFile = {}, dong = [], boQua = 0;
    for (var r = r0 + 1; r < bang.length; r++) {
      var row = bang[r] || []; if (!row.some(function (x) { return String(x == null ? '' : x).trim() !== ''; })) continue;
      function g(k) { return map[k] >= 0 ? row[map[k]] : ''; }
      var gt = { so_heat: chuanHeat(g('so_heat')), quy_cach: String(g('quy_cach') || '').trim().replace(/\s+/g, ''), mac_thep: String(g('mac_thep') || '').trim(),
        so_luong: laTrong(g('so_luong')) ? '' : so(g('so_luong')), khoi_luong_tan: '', so_mtc: laTrong(g('so_mtc')) ? '' : String(g('so_mtc')).trim(),
        so_mir: String(g('so_mir') || '').trim(), du_an: String(g('du_an') || '').trim(), ncc: String(g('ncc') || '').trim(), ngay_ve: chuanNgay(g('ngay_ve')), ghi_chu: String(g('ghi_chu') || '').trim() };
      /* dòng không có cả heat lẫn quy cách = dòng tổng cộng / chữ ký / ghi chú cuối biểu mẫu → không phải vật tư, bỏ qua (có đếm) */
      if (laTrong(gt.so_heat) && !gt.quy_cach) { boQua++; continue; }
      var kl = laTrong(g('khoi_luong')) ? NaN : so(g('khoi_luong'));
      gt.khoi_luong_tan = isFinite(kl) ? Math.round((laKg ? kl / 1000 : kl) * 100) / 100 : '';
      gt.trang_thai = chuanTT(g('trang_thai'), gt.so_mtc);
      var dA = chuanTen(gt.du_an), khop = '';
      if (dA) DU_AN.forEach(function (d) { if (!khop && (chuanTen(d.ma) === dA || chuanTen(d.ten) === dA || (d.ma_hd && chuanTen(d.ma_hd) === dA))) khop = d.ma; });
      if (!khop && dA) DU_AN.forEach(function (d) { if (!khop && chuanTen(d.ma).indexOf(dA) === 0) khop = d.ma; });
      var ly = [];
      if (dA && !khop) ly.push('Dự án "' + gt.du_an + '" chưa có trong danh mục');
      else if (!dA && !daMacDinh) ly.push('Thiếu dự án (chọn "Nạp vào dự án")');
      gt.du_an = khop || (dA ? gt.du_an : daMacDinh || '');
      if (laTrong(gt.so_heat)) ly.push('Thiếu heat no');
      if (!gt.quy_cach) ly.push('Thiếu quy cách');
      if (gt.so_luong !== '' && !isFinite(gt.so_luong)) ly.push('Số lượng không phải số');
      if (!laTrong(g('khoi_luong')) && !isFinite(kl)) ly.push('Khối lượng không phải số');
      var key = gt.so_heat + '|' + chuanHeat(gt.quy_cach) + '|' + gt.du_an, tt = 'OK';
      if (ly.length) tt = 'LOI';
      else if (daCo[key]) { tt = 'TRUNG'; ly.push('Đã có (' + daCo[key] + '), bỏ qua'); }
      else if (trongFile[key]) { tt = 'TRUNG'; ly.push('Trùng dòng ' + trongFile[key] + ' trong file, bỏ qua'); }
      else trongFile[key] = r + 1;
      dong.push({ so: r + 1, gt: gt, tt: tt, ly_do: ly.join('; ') });
    }
    return { tieuDe: tieuDe, dongTieuDe: r0 + 1, map: map, laKg: laKg, thieu: thieu, dong: dong, bo_qua: boQua };
  }
  function docTSV(txt) {
    return String(txt || '').replace(/\r/g, '').split('\n').map(function (l) { return l.indexOf('\t') >= 0 ? l.split('\t') : l.split(/;|,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(function (x) { return x.replace(/^"|"$/g, ''); }); });
  }
  var TSV_MAU = ['DANH SÁCH VẬT TƯ ĐÃ NGHIỆM THU (dữ liệu MẪU)', '',
    ['STT', 'Số MIR', 'Dự án', 'Nhà cung cấp', 'Mác thép', 'Quy cách', 'Heat No', 'SL', 'KL (kg)', 'Số MTC', 'Kết quả NT', 'Ngày về', 'Ghi chú'].join('\t'),
    ['1', 'MIR-GRE-010', 'GREGORY_DUCT', 'Nhà cung cấp C', 'SS400', 'PL 12x1500x6000', 'G5520077', '6', '5086', 'MTC-61044', 'Đạt', '15/11/2026', ''].join('\t'),
    ['2', 'MIR-GRE-010', 'GREGORY_DUCT', 'Nhà cung cấp C', 'SS400', 'PL 14x1500x6000', 'G5520078', '4', '3956', 'N/A', '', '15/11/2026', 'Chờ MTC'].join('\t'),
    ['3', 'MIR-VIO-035', '10725-009', 'Nhà cung cấp A', 'Q345B', 'H350x175x7x11', 'H23C0021', '8', '4762', 'MTC-55410', 'OK', '16/11/2026', ''].join('\t'),
    ['4', 'MIR-VIO-035', 'VIOLA_KCT', 'Nhà cung cấp A', 'Q345B', '', 'H23C0022', '5', '2976', 'MTC-55411', 'Đạt', '16/11/2026', 'thiếu quy cách → lỗi'].join('\t'),
    ['5', 'MIR-VIO-031', 'VIOLA_KCT', 'Nhà cung cấp A', 'SS400', 'PL12x1500x6000', 'H23A1187', '8', '6782', 'MTC-55120', 'Đạt', '08/11/2026', 'đã có → trùng'].join('\t'),
    ['6', 'MIR-BIS-016', 'BISON_U2', 'Nhà cung cấp B', 'A572 Gr50', 'W12x26', 'K7795501', '10', 'abc', 'MTC-89001', 'NG', '16/11/2026', 'KL sai → lỗi'].join('\t'),
    ['7', 'MIR-XYZ-001', 'DU AN LA', 'Nhà cung cấp D', 'SS400', 'PL10x1500x6000', 'Z1100001', '3', '2120', 'MTC-90001', 'Đạt', '16/11/2026', 'dự án chưa khai → lỗi'].join('\t')
  ].join('\n');

  /* ---------- ẢNH: nén trước khi gửi (bản mẫu chỉ giữ ảnh thu nhỏ) ---------- */
  function nenAnh(file, canh) {
    canh = canh || (CHE_DO === 'that' ? 1600 : 480);
    return new Promise(function (ok, ko) {
      var fr = new FileReader();
      fr.onerror = function () { ko(new Error('Không đọc được ảnh ' + file.name)); };
      fr.onload = function () {
        var img = new Image();
        img.onerror = function () { ko(new Error('File không phải ảnh: ' + file.name)); };
        img.onload = function () {
          var k = Math.min(1, canh / Math.max(img.width, img.height)), c = document.createElement('canvas');
          c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          ok({ ten: file.name, thumb: c.toDataURL('image/jpeg', CHE_DO === 'that' ? 0.82 : 0.72), luc: homNay() + ' ' + gioPhut() });
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  /* ---------- API (cùng tên hàm sẽ có ở Apps Script) ---------- */
  /* ===== HỒ SƠ TRUY XUẤT: nhận bảng theo TÊN cột + chuyển dòng. Dùng chung cho bản mẫu và máy chủ (nạp trên app).
     Bảng khai cột phải GIỐNG HỆT COT_TX trong Code_TX.gs (bài kiểm so 2 bảng). ===== */
  var TX_COT = {
    TX_CHI_TIET: [['ban_ve', ['drawing no', 'drawing']], ['rev', ['rev']], ['cau_kien', ['member no', 'member']], ['part', ['part no', 'part mark'], 1], ['sl', ['quantity pcs', 'q ty pcs', 'quantity', 'q ty']],
      ['quy_cach', ['description']], ['mac', ['grade']], ['so_mtc', ['mill certificate no', 'mill certificate']], ['so_heat', ['heat no'], 1], ['ma_tam', ['id no', 'id']], ['so_mrir', ['mrir no', 'mrir']], ['kl', ['weight']]],
    TX_VAT_TU: [['ma_tam', ['code'], 1], ['su_dung', ['used']], ['quy_cach', ['material description'], 1], ['tieu_chuan', ['material specification']], ['nha_sx', ['manufacturers', 'manufactures origin', 'manufactures', 'manufacturer']],
      ['mac', ['grade']], ['so_mtc', ['mill certificate no', 'mill certificate']], ['so_heat', ['heat no'], 1], ['sl', ['quantity pcs', 'quantity']], ['kl_kg', ['weight kg']], ['ket_qua', ['result acc rej', 'result']],
      ['ghi_chu', ['remark']], ['so_mrir', ['so bao cao report no', 'report no', 'mrir no', 'mrir']]]
  };
  var TX_KHOA = { TX_CHI_TIET: ['k_part', 'k_ck', 'k_bv', 'k_heat', 'k_tam', 'k_mtc'], TX_VAT_TU: ['k_tam', 'k_heat', 'k_mtc', 'k_mrir'] };
  var TX_NGUON_KHOA = { k_part: 'part', k_ck: 'cau_kien', k_bv: 'ban_ve', k_heat: 'so_heat', k_tam: 'ma_tam', k_mtc: 'so_mtc', k_mrir: 'so_mrir' };
  var TX_TEN_LOAI = { TX_VAT_TU: 'Nghiệm thu vật tư đầu vào (MRIR)', TX_CHI_TIET: 'Báo cáo truy xuất (bản vẽ → part → heat)' };
  var TX_LO_TOI_DA = 4000; /* số dòng tối đa mỗi lượt gửi */
  function txGt(v) { if (v instanceof Date) return isoNgay(v); return v === null || v === undefined ? '' : String(v).trim(); }
  /* dau = các dòng đầu của bảng. Trả null nếu không phải MRIR / báo cáo truy xuất. tuDong = chỉ số (từ 0) của dòng dữ liệu đầu tiên. */
  function txNhan(dau) {
    var hi = -1, ten = null, i;
    function la(x, c) { return x === c || x.indexOf(c + ' ') === 0; }
    function co(k, c) { return k.some(function (x) { return la(x, c); }); }
    for (i = 0; i < Math.min(15, (dau || []).length) && hi < 0; i++) { var k = (dau[i] || []).map(chuanTen); if (co(k, 'heat no')) { hi = i; ten = k; } }
    if (hi < 0) return null;
    var loai = (co(ten, 'part no') || co(ten, 'part mark')) ? 'TX_CHI_TIET' : (co(ten, 'code') && co(ten, 'material description') ? 'TX_VAT_TU' : null);
    if (!loai) return null;
    var map = {}, dung = {};
    [function (a, b) { return a === b; }, function (a, b) { return a.indexOf(b + ' ') === 0; }].forEach(function (khop) {
      TX_COT[loai].forEach(function (c) { if (map[c[0]] >= 0) return; map[c[0]] = -1;
        c[1].some(function (cand) { for (var j = 0; j < ten.length; j++) if (!dung[j] && ten[j] && khop(ten[j], cand)) { map[c[0]] = j; dung[j] = 1; return true; } return false; }); });
    });
    return { loai: loai, tuDong: hi + 1, map: map, thieu: TX_COT[loai].filter(function (c) { return c[2] && !(map[c[0]] >= 0); }).map(function (c) { return c[0]; }) };
  }
  function txChuyen(rows, nb, tenDuAn, nguon) {
    var cs = TX_COT[nb.loai], ds = [], bo = 0;
    (rows || []).forEach(function (row) {
      if (!row || !row.some(function (x) { return x !== '' && x !== null && x !== undefined; })) return;
      var o = { du_an: tenDuAn, nguon: nguon };
      cs.forEach(function (c) { var ix = nb.map[c[0]]; o[c[0]] = ix >= 0 ? txGt(row[ix]) : ''; });
      if (nb.loai === 'TX_CHI_TIET' ? !o.part : !(o.ma_tam && (o.so_heat || o.quy_cach))) { bo++; return; }
      TX_KHOA[nb.loai].forEach(function (k) { o[k] = chuanHeat(o[TX_NGUON_KHOA[k]]); });
      ds.push(o);
    });
    return { ds: ds, bo_qua: bo };
  }
  /* Kiểm đầu vào 1 lượt nạp. Lượt đầu (chưa có ma_lan): bảng gồm cả dòng tiêu đề → nhận loại + vị trí cột. Lượt sau: gửi lại nb. */
  function txNapMo(o) {
    canVai(['QC_VT', 'QUAN_LY'], 'nạp hồ sơ truy xuất');
    o = o || {}; var bang = o.bang;
    if (!bang || !bang.length) loi('Không có dòng nào để nạp.');
    if (bang.length > TX_LO_TOI_DA + 20) loi('Mỗi lượt gửi tối đa ' + TX_LO_TOI_DA + ' dòng.');
    if (o.ma_lan) {
      var nb0 = o.nb || {}; if (!TX_COT[nb0.loai] || !nb0.map) loi('Thiếu thông tin cột của lần nạp ' + o.ma_lan + '.');
      var map = {}; TX_COT[nb0.loai].forEach(function (c) { var v = Number(nb0.map[c[0]]); map[c[0]] = v >= 0 && v < 500 ? Math.floor(v) : -1; });
      return { moi: false, nb: { loai: nb0.loai, map: map }, rows: bang };
    }
    var da = layDuAn(o.du_an); if (!da) loi('Chọn dự án trước khi nạp hồ sơ.');
    var tf = String(o.ten_file || '').trim(); if (!tf) loi('Thiếu tên file.');
    var nb = txNhan(bang);
    if (!nb) loi('Tab "' + (o.tab || '') + '" không phải bảng nghiệm thu vật tư (MRIR) hay báo cáo truy xuất: cần cột "Heat no" cùng với "Part no" (báo cáo truy xuất) hoặc "Code" + "Material description" (MRIR).');
    if (nb.thieu.length) loi('Tab "' + (o.tab || '') + '" thiếu cột bắt buộc: ' + nb.thieu.join(', ') + '.');
    return { moi: true, da: da, nb: nb, rows: bang.slice(nb.tuDong), ten_file: tf.slice(0, 120), tab: String(o.tab || '').trim().slice(0, 80) };
  }
  function txNhanLan(lan) { return 'Nạp trên app › ' + lan.ten_file + (lan.tab ? ' › ' + lan.tab : '') + ' [' + lan.ma_lan + ']'; }
  function txMaLanMoi(L) { var m = 0; L.forEach(function (x) { var n = Number(String(x.ma_lan).replace(/\D/g, '')); if (n > m) m = n; }); return 'TXN-' + pad(m + 1, 4); }
  function txCungLan(x, m) { return x.trang_thai !== 'XOA' && x.ma_du_an === m.da.ma && x.ten_file === m.ten_file && x.tab === m.tab && x.loai === m.nb.loai; }
  function txTomLan(L) {
    var ds = L.filter(function (x) { return x.trang_thai !== 'XOA'; }).slice().sort(function (a, b) { return a.luc < b.luc ? 1 : a.luc > b.luc ? -1 : (a.ma_lan < b.ma_lan ? 1 : -1); }), m = {}, tong = [];
    ds.forEach(function (x) { var g = m[x.du_an]; if (!g) { g = m[x.du_an] = { du_an: x.du_an, ma_du_an: x.ma_du_an, vt: 0, ct: 0, lan: 0 }; tong.push(g); } g.lan++; var n = so(x.so_dong); if (isFinite(n)) g[x.loai === 'TX_VAT_TU' ? 'vt' : 'ct'] += n; });
    return { ds: ds, tong: tong };
  }
  /* KIỂM SOÁT HỒ SƠ 1 DỰ ÁN: so báo cáo truy xuất với danh sách nghiệm thu vật tư. vt / ct = toàn bộ dòng của dự án. */
  function txKiem(tenDuAn, vt, ct) {
    var T = {}, dem = function (a, f) { var m = {}, n = 0; a.forEach(function (x) { if (x[f] && !m[x[f]]) { m[x[f]] = 1; n++; } }); return n; }, kg = 0;
    vt.forEach(function (v) { if (!v.k_tam) return; (T[v.k_tam] = T[v.k_tam] || []).push(v); var k = so(v.kl_kg); if (isFinite(k)) kg += k; });
    var dung = {}, koMR = {}, lech = {}, koDat = {}, koTam = 0;
    ct.forEach(function (x) {
      if (!x.k_tam) { koTam++; return; }
      dung[x.k_tam] = 1; var vs = T[x.k_tam];
      if (!vs) { var g = koMR[x.k_tam] = koMR[x.k_tam] || { ma_tam: x.ma_tam, so_heat: x.so_heat, so_dong: 0, part: [] }; g.so_dong++; if (g.part.length < 5 && g.part.indexOf(x.part) < 0) g.part.push(x.part); return; }
      if (x.k_heat && !vs.some(function (v) { return v.k_heat === x.k_heat; })) { var kL = x.k_tam + '|' + x.k_heat, h = lech[kL] = lech[kL] || { ma_tam: x.ma_tam, heat_truy_xuat: x.so_heat, heat_mrir: vs.map(function (v) { return v.so_heat; }).filter(function (z, i, a) { return a.indexOf(z) === i; }).join(', '), so_dong: 0, part: [] }; h.so_dong++; if (h.part.length < 5 && h.part.indexOf(x.part) < 0) h.part.push(x.part); }
      vs.forEach(function (v) { var kq = chuanTen(v.ket_qua); if (kq && kq.indexOf('acc') !== 0 && kq !== 'dat') { var d = koDat[x.k_tam] = koDat[x.k_tam] || { ma_tam: v.ma_tam, so_heat: v.so_heat, ket_qua: v.ket_qua, so_dong: 0 }; d.so_dong++; } });
    });
    function ds(m) { var a = Object.keys(m).map(function (k) { return m[k]; }).sort(function (x, y) { return y.so_dong - x.so_dong; }); return { tong: a.length, ds: a.slice(0, 60) }; }
    var chuaDung = Object.keys(T).filter(function (k) { return !dung[k]; }).length, a1 = ds(koMR), a2 = ds(lech), a3 = ds(koDat);
    return { du_an: tenDuAn, so_tam: Object.keys(T).length, so_heat_mrir: dem(vt, 'k_heat'), kl_mrir_tan: Math.round(kg) / 1000, so_dong_ct: ct.length, so_part: dem(ct, 'k_part'), so_cau_kien: dem(ct, 'k_ck'), so_ban_ve: dem(ct, 'k_bv'),
      tam_da_dung: Object.keys(dung).length, tam_chua_dung: chuaDung, dong_khong_ma_tam: koTam, tam_khong_mrir: a1, lech_heat: a2, tam_khong_dat: a3,
      dat: !a1.tong && !a2.tong && !a3.tong && !koTam && ct.length > 0 && vt.length > 0, thieu: !vt.length ? 'Chưa có danh sách nghiệm thu vật tư (MRIR) của dự án này.' : !ct.length ? 'Chưa có báo cáo truy xuất của dự án này.' : '' };
  }
  function txDuAn(vt, ct) { var m = {}, o = []; function c(a, f) { a.forEach(function (x) { var g = m[x.du_an]; if (!g) { g = m[x.du_an] = { ten: x.du_an, vt: 0, ct: 0 }; o.push(g); } g[f]++; }); } c(vt, 'vt'); c(ct, 'ct'); return o.sort(function (a, b) { return a.ten < b.ten ? -1 : 1; }); }

  var API_GOC = {
    phienBan: function () { return goi(function () { return PHIEN_BAN; }); },
    traVatTu: function (q) {
      return goi(function () {
        var k = chuanHeat(q); if (!k) return [];
        return sao(S.vt.filter(function (v) { return chuanHeat(v.so_heat).indexOf(k) >= 0 || v.ma_vt.toUpperCase() === k || (v.so_mtc && chuanHeat(v.so_mtc) === k); }).slice(0, 20));
      });
    },
    dsVatTu: function () { return goi(function () { return sao(S.vt.filter(function (v) { return theoDA(v.du_an); })); }); },
    dsDuAn: function () {
      return goi(function () {
        return sao(DU_AN.map(function (d) {
          var vt = S.vt.filter(function (v) { return v.du_an === d.ma; }), ph = S.phieu.filter(function (p) { return p.du_an === d.ma; }), mp = {};
          ph.forEach(function (p) { mp[p.ma_phieu] = 1; });
          var pu = S.punch.filter(function (u) { return mp[u.ma_phieu]; });
          return Object.assign({}, d, { so_vt: vt.length, vt_dat: vt.filter(function (v) { return v.trang_thai === 'DAT'; }).length, tan_dat: vt.reduce(function (s2, v) { return s2 + (v.trang_thai === 'DAT' ? Number(v.khoi_luong_tan) || 0 : 0); }, 0),
            vt_cho: vt.filter(function (v) { return v.trang_thai === 'CHO_BO_SUNG' || v.trang_thai === 'CHUA_NT'; }).length, so_phieu: ph.length, phieu_cho: ph.filter(function (p) { return p.trang_thai === 'CHO_DONG_PUNCH'; }).length,
            punch_mo: pu.filter(function (u) { return u.trang_thai !== 'DA_DONG'; }).length, punch_qh: pu.filter(quaHan).length });
        }));
      });
    },
    luuDuAn: function (d, laMoi) {
      return goi(function () {
        canVai(['QUAN_LY'], laMoi ? 'thêm dự án' : 'sửa dự án');
        var ma = String(d.ma || '').trim().toUpperCase().replace(/\s+/g, '_'), ten = String(d.ten || '').trim();
        if (!ma) loi('Nhập mã dự án.');
        if (!/^[A-Z0-9_\-.]+$/.test(khongDau(ma))) loi('Mã dự án chỉ gồm chữ, số, gạch nối, gạch dưới.');
        if (!ten) loi('Nhập tên dự án đầy đủ (người ngoài đọc phải hiểu).');
        if (!TT_DA[d.trang_thai]) loi('Chọn trạng thái dự án.');
        var cu = layDuAn(ma);
        if (laMoi && cu) loi('Mã dự án "' + ma + '" đã có.');
        if (!laMoi && !cu) loi('Không thấy dự án ' + ma);
        var moi = { ma: ma, ten: ten, ma_hd: String(d.ma_hd || '').trim(), khach_hang: String(d.khach_hang || '').trim(), trang_thai: d.trang_thai, ghi_chu: String(d.ghi_chu || '').trim(), ten_ah1: String(d.ten_ah1 || '').trim() };
        if (laMoi) { DU_AN.push(moi); ghiNK('Thêm dự án', 'DU_AN', ma, '', ten); }
        else { ghiNK('Sửa dự án', 'DU_AN', ma, cu.ten + ' · ' + cu.trang_thai, ten + ' · ' + moi.trang_thai); Object.assign(cu, moi); }
        return sao(moi);
      });
    },
    capNhatVatTu: function (ma, tt, ghiChu) {
      return goi(function () {
        canVai(['QC_VT', 'QUAN_LY'], 'đổi trạng thái vật tư');
        var v = timVT(ma); if (!v) loi('Không thấy vật tư ' + ma);
        if (!TT.VT[tt]) loi('Trạng thái không hợp lệ');
        if ((tt === 'KHONG_DAT' || tt === 'CHO_BO_SUNG') && !String(ghiChu || '').trim()) loi('Cần ghi lý do khi chuyển sang "' + TT.VT[tt][0] + '".');
        if (tt === 'DAT' && laTrong(v.so_mtc)) loi('Vật tư chưa có số MTC, không chuyển sang Đạt được.');
        ghiNK('Đổi trạng thái vật tư', 'VAT_TU', ma, v.trang_thai, tt);
        v.trang_thai = tt; v.ghi_chu = String(ghiChu || '').trim(); v.ngay_nt = homNay(); v.nguoi_nt = tenNguoi();
        return sao(v);
      });
    },
    napVatTu: function (ketQuaPhanTich, tenFile) {
      return goi(function () {
        canVai(['QC_VT', 'QUAN_LY'], 'nạp danh sách vật tư');
        if (!ketQuaPhanTich || ketQuaPhanTich.thieu.length) loi('Thiếu cột bắt buộc, không ghi.');
        S.dem.lan++; var ma_lan = 'LN-' + pad(S.dem.lan, 4), them = 0;
        var daCo = {}; S.vt.forEach(function (v) { daCo[chuanHeat(v.so_heat) + '|' + chuanHeat(v.quy_cach) + '|' + v.du_an] = 1; });
        ketQuaPhanTich.dong.forEach(function (d) {
          if (d.tt !== 'OK') return; var key = d.gt.so_heat + '|' + chuanHeat(d.gt.quy_cach) + '|' + d.gt.du_an; if (daCo[key]) return; daCo[key] = 1;
          S.dem.vt++; var v = Object.assign({}, d.gt, { ma_vt: 'VT-' + pad(S.dem.vt, 4), ma_lan: ma_lan, ngay_nt: d.gt.trang_thai === 'DAT' ? homNay() : '', nguoi_nt: d.gt.trang_thai === 'DAT' ? tenNguoi() : '' });
          S.vt.push(v); them++;
        });
        var cnt = function (t) { return ketQuaPhanTich.dong.filter(function (d) { return d.tt === t; }).length; };
        var lan = { ma_lan: ma_lan, ten_file: tenFile || 'Dán từ Excel', so_dong: ketQuaPhanTich.dong.length, so_them: them, so_trung: cnt('TRUNG'), so_loi: cnt('LOI'), nguoi: tenNguoi(), thoi_diem: homNay() + ' ' + gioPhut() };
        S.lan_nap.unshift(lan); ghiNK('Nạp vật tư', 'LAN_NAP', ma_lan, '', them + ' dòng');
        return lan;
      });
    },
    dsLanNap: function () { return goi(function () { return sao(S.lan_nap); }); },
    dsPhieu: function () { return goi(function () { return sao(S.phieu.filter(function (p) { return theoDA(p.du_an); }).sort(function (a, b) { return a.ngay < b.ngay ? 1 : a.ngay > b.ngay ? -1 : a.ma_phieu < b.ma_phieu ? 1 : -1; })); }); },
    layPhieu: function (ma) { return goi(function () { var p = timPhieu(ma); if (!p) loi('Không thấy phiếu ' + ma); return { phieu: sao(p), punch: sao(S.punch.filter(function (x) { return x.ma_phieu === ma; })) }; }); },
    luuPhieu: function (p) {
      return goi(function () {
        canVai(['QC'], 'lập phiếu nghiệm thu sơ chế');
        var v = timVT(p.ma_vt); if (!v) loi('Chưa chọn vật tư.');
        if (v.trang_thai !== 'DAT') loi('Vật tư ' + v.so_heat + ' · ' + v.quy_cach + ' đang "' + TT.VT[v.trang_thai][0] + '". Chỉ vật tư đã NT đạt mới được lập phiếu sơ chế.');
        var da = layDuAn(p.du_an); if (!da) loi('Chọn dự án.');
        if (da.trang_thai !== 'DANG_CHAY') loi('Dự án ' + da.ten + ' đang "' + TT_DA[da.trang_thai][0] + '", không lập phiếu mới được.');
        if (v.du_an && v.du_an !== p.du_an) loi('Vật tư ' + v.so_heat + ' thuộc dự án ' + tenDuAn(v.du_an) + ', không dùng cho dự án ' + da.ten + '.');
        if (QUY_TAC.chanHeatNgoaiSDC) { var hpq = heatCuaPart(p.ma_chi_tiet), kq0 = Object.keys(hpq); if (kq0.length && !hpq[v.ma_vt]) loi('Heat ' + v.so_heat + ' không có trong sơ đồ cắt của part ' + p.ma_chi_tiet + ' (chỉ có: ' + kq0.map(function (m) { return hpq[m]; }).join(', ') + '). Quy tắc đang CHẶN.'); }
        var kh = null;
        if (p.ma_kh) { kh = timKH(p.ma_kh); if (!kh) loi('Không thấy kế hoạch ' + p.ma_kh); if (kh.trang_thai !== 'CHO') loi('Kế hoạch ' + p.ma_kh + ' đã "' + TT.KH[kh.trang_thai][0] + '".'); if (kh.du_an !== p.du_an) loi('Kế hoạch ' + p.ma_kh + ' thuộc dự án khác.'); }
        ['du_an', 'xuong', 'cong_doan', 'ma_chi_tiet'].forEach(function (k) { if (!String(p[k] || '').trim()) loi('Thiếu ' + k); });
        var cd = congDoan(p.cong_doan); if (!cd) loi('Công đoạn không hợp lệ');
        var kq = cd.hm.map(function (h) {
          var x = (p.ket_qua || {})[h.ma] || {}; var r = danhGia(h, x.yc, x.td);
          if (!r) loi('Hạng mục "' + h.ten + '" chưa nhập đủ kết quả.');
          if (r === 'KHONG_DAT') { var pu = x.punch || {}; if (!String(pu.mo_ta || '').trim() || !pu.muc || !pu.to || !pu.han) loi('Hạng mục "' + h.ten + '" không đạt: cần đủ mô tả, mức độ, tổ, hạn cho punch.'); }
          return { ma_hm: h.ma, yc: x.yc == null ? '' : String(x.yc), td: String(x.td), kq: r, punch: x.punch };
        });
        S.dem.phieu[p.xuong] = (S.dem.phieu[p.xuong] || 0) + 1;
        var ma = 'SC-' + p.xuong + '-' + pad(S.dem.phieu[p.xuong], 4), ngMo = [];
        kq.forEach(function (x) {
          if (x.kq !== 'KHONG_DAT') return; S.dem.punch++;
          var pm = { ma_punch: 'P-' + pad(S.dem.punch, 4), ma_phieu: ma, mo_ta: x.punch.mo_ta.trim(), muc_do: x.punch.muc, to: x.punch.to, han: x.punch.han, trang_thai: 'MO',
            ngay_mo: homNay(), ngay_dong: '', nguoi_dong: '', anh_truoc: x.punch.anh || [], anh_sau: [], lich_su: [{ t: homNay() + ' ' + gioPhut(), ai: tenNguoi(), viec: 'Mở punch' }] };
          S.punch.push(pm); ngMo.push(pm.ma_punch);
        });
        var ph = { ma_phieu: ma, ngay: homNay(), du_an: p.du_an, xuong: p.xuong, cong_doan: p.cong_doan, ma_vt: v.ma_vt, so_heat: v.so_heat, ma_chi_tiet: String(p.ma_chi_tiet).trim(),
          ban_ve: String(p.ban_ve || '').trim(), rev: String(p.rev || '').trim(), so_ct: p.so_ct, ket_qua: kq.map(function (x) { return { ma_hm: x.ma_hm, yc: x.yc, td: x.td, kq: x.kq }; }),
          anh: p.anh || [], ghi_chu: String(p.ghi_chu || '').trim(), trang_thai: ngMo.length ? 'CHO_DONG_PUNCH' : 'DAT', nguoi_qc: tenNguoi(), lsx: String(p.lsx || '').trim() };
        if (kh) { ph.ma_kh = kh.ma_kh; kh.trang_thai = 'XONG'; kh.ma_phieu = ma; kh.ngay_lam = homNay(); ghiNK('Hoàn thành kế hoạch', 'KE_HOACH_NT', kh.ma_kh, 'CHO', 'XONG'); }
        S.phieu.push(ph); ghiNK('Lập phiếu', 'PHIEU_SO_CHE', ma, '', ph.trang_thai);
        return { ma_phieu: ma, trang_thai: ph.trang_thai, punch: ngMo };
      });
    },
    dsPunch: function () { return goi(function () { return sao(S.punch.map(ganDA).filter(function (u) { return theoDA(u.du_an); }).sort(function (a, b) { var o = { MO: 0, DA_SUA: 1, DA_DONG: 2 }; return o[a.trang_thai] - o[b.trang_thai] || (a.han < b.han ? -1 : 1); })); }); },
    /* viec: 'BAO_SUA' | 'DONG' | 'MO_LAI' */
    huyPhieu: function (ma, lyDo) {
      return goi(function () {
        canVai(['QC', 'QUAN_LY'], 'huỷ phiếu');
        var p = timPhieu(ma); if (!p) loi('Không thấy phiếu ' + ma); if (p.trang_thai === 'HUY') loi('Phiếu đã huỷ.');
        if (!String(lyDo || '').trim()) loi('Cần ghi lý do huỷ phiếu.');
        var cu = p.trang_thai; p.trang_thai = 'HUY'; p.ly_do_huy = String(lyDo).trim();
        S.punch.forEach(function (u) { if (u.ma_phieu === ma && u.trang_thai !== 'DA_DONG') { u.trang_thai = 'DA_DONG'; u.ngay_dong = homNay(); u.nguoi_dong = tenNguoi(); u.lich_su.push({ t: homNay() + ' ' + gioPhut(), ai: tenNguoi(), viec: 'Đóng do huỷ phiếu: ' + p.ly_do_huy }); } });
        if (p.ma_kh) { var k = timKH(p.ma_kh); if (k && k.ma_phieu === ma) { k.trang_thai = 'CHO'; k.ma_phieu = ''; k.ngay_lam = ''; ghiNK('Kế hoạch về Chờ (phiếu huỷ)', 'KE_HOACH_NT', k.ma_kh, 'XONG', 'CHO'); } }
        ghiNK('Huỷ phiếu', 'PHIEU_SO_CHE', ma, cu, 'HUY · ' + p.ly_do_huy);
        return sao(p);
      });
    },
    moLaiPhieu: function (ma, lyDo, pu) {
      pu = pu || {};
      return goi(function () {
        canVai(['QUAN_LY', 'QC'], 'mở lại phiếu');
        var p = timPhieu(ma); if (!p) loi('Không thấy phiếu ' + ma); if (p.trang_thai !== 'DAT') loi('Chỉ mở lại phiếu đang Đạt.');
        if (!String(lyDo || '').trim()) loi('Cần ghi lý do mở lại (lỗi phát hiện sau).');
        if (!pu.to || !pu.han) loi('Chọn tổ chịu trách nhiệm và hạn xử lý.');
        S.dem.punch++; var mp = 'P-' + pad(S.dem.punch, 4);
        S.punch.push({ ma_punch: mp, ma_phieu: ma, mo_ta: '[Mở lại] ' + String(lyDo).trim(), muc_do: pu.muc || 'B', to: pu.to, han: pu.han, trang_thai: 'MO', ngay_mo: homNay(), ngay_dong: '', nguoi_dong: '', anh_truoc: pu.anh || [], anh_sau: [],
          lich_su: [{ t: homNay() + ' ' + gioPhut(), ai: tenNguoi(), viec: 'Mở lại phiếu ' + ma }] });
        p.trang_thai = 'CHO_DONG_PUNCH'; ghiNK('Mở lại phiếu', 'PHIEU_SO_CHE', ma, 'DAT', 'CHO_DONG_PUNCH · ' + mp);
        return { ma_phieu: ma, ma_punch: mp };
      });
    },
    dsChungChi: function (ma_vt) { return goi(function () { return sao(S.chung_chi.filter(function (c) { return !ma_vt || c.ma_vt === ma_vt; })); }); },
    luuChungChi: function (c) {
      return goi(function () {
        canVai(['QC_VT', 'QUAN_LY'], 'thêm chứng chỉ');
        var v = timVT(c.ma_vt); if (!v) loi('Không thấy vật tư ' + c.ma_vt);
        if (['MTC', 'CO', 'CQ', 'KHAC'].indexOf(c.loai) < 0) loi('Chọn loại chứng chỉ (MTC / CO / CQ / Khác).');
        if (!String(c.so || '').trim()) loi('Nhập số chứng chỉ.');
        S.dem.cc = (S.dem.cc || S.chung_chi.length) + 1;
        var o = { ma_cc: 'CC-' + pad(S.dem.cc, 4), ma_vt: v.ma_vt, so_heat: v.so_heat, loai: c.loai, so: String(c.so).trim(), ngay: c.ngay || homNay(), ten_tep: c.tep ? c.tep.ten : '', link: c.tep ? (c.tep.link || '') : '', ghi_chu: String(c.ghi_chu || '').trim(), nguoi: tenNguoi(), luc: homNay() + ' ' + gioPhut() };
        S.chung_chi.push(o);
        if (o.loai === 'MTC' && laTrong(v.so_mtc)) { v.so_mtc = o.so; ghiNK('Gán số MTC', 'VAT_TU', v.ma_vt, '', o.so); }
        ghiNK('Thêm chứng chỉ ' + o.loai, 'CHUNG_CHI', o.ma_cc, '', v.so_heat + ' · ' + o.so);
        return sao(o);
      });
    },
    cauHinh: function () { return goi(function () { return cauHinhHienTai(); }); },
    /* NỐI DỮ LIỆU: part → các tấm thép đã dùng theo báo cáo truy xuất, kèm thông tin nghiệm thu vật tư (MRIR) */
    goiYTX: function (part) {
      return goi(function () {
        var k = chuanHeat(part), m = {}, ds = []; if (k.length < 2) return [];
        (S.tx_ct || []).forEach(function (x) { if (x.k_part !== k || !x.k_tam) return; var key = x.du_an + '|' + x.k_tam; if (m[key]) { m[key].so_dong++; return; }
          m[key] = { tx_du_an: x.du_an, ma_tam: x.ma_tam, so_heat: x.so_heat, quy_cach_part: x.quy_cach, cau_kien: x.cau_kien, ban_ve: x.ban_ve, so_dong: 1, co_mrir: false }; ds.push(m[key]); });
        (S.tx_vt || []).forEach(function (v) { var o = m[v.du_an + '|' + v.k_tam]; if (!o) return; o.co_mrir = true; o.quy_cach = v.quy_cach; o.mac = v.mac; o.so_mtc = v.so_mtc; o.so_mrir = v.so_mrir; o.ket_qua = v.ket_qua; o.heat_mrir = v.so_heat; o.nha_sx = v.nha_sx; });
        return sao(ds.slice(0, 12));
      });
    },
    /* QC chọn 1 tấm theo MRIR → app tự có vật tư "đã nghiệm thu" tương ứng cho dự án (không phải nạp tay) */
    dungVatTuTX: function (o) {
      return goi(function () {
        canVai(['QC'], 'chọn vật tư theo hồ sơ truy xuất');
        var da = layDuAn(o.du_an); if (!da) loi('Chọn dự án của phiếu trước khi chọn tấm thép.');
        if (da.trang_thai !== 'DANG_CHAY') loi('Dự án ' + da.ten + ' không còn chạy.');
        var kt = chuanHeat(o.ma_tam), v = (S.tx_vt || []).filter(function (x) { return x.k_tam === kt && (!o.tx_du_an || x.du_an === o.tx_du_an); })[0];
        if (!v) loi('Mã tấm ' + o.ma_tam + ' không có trong danh sách nghiệm thu vật tư (MRIR). Không dùng được.');
        var kq = chuanTen(v.ket_qua); if (kq && kq.indexOf('acc') !== 0 && kq !== 'dat') loi('Mã tấm ' + v.ma_tam + ' có kết quả nghiệm thu "' + v.ket_qua + '". Không dùng cho sơ chế.');
        var qc = String(v.quy_cach || '').replace(/\s+/g, ''), cu = S.vt.filter(function (x) { return chuanHeat(x.so_heat) === chuanHeat(v.so_heat) && chuanHeat(x.quy_cach) === chuanHeat(qc) && x.du_an === da.ma; })[0];
        if (cu) { if (cu.trang_thai !== 'DAT') loi('Vật tư ' + cu.so_heat + ' · ' + cu.quy_cach + ' đang "' + TT.VT[cu.trang_thai][0] + '" trong app.'); return sao(cu); }
        S.dem.vt++; var kg = so(v.kl_kg), sl = so(v.sl);
        var moi = { ma_vt: 'VT-' + pad(S.dem.vt, 4), so_heat: chuanHeat(v.so_heat), quy_cach: qc, mac_thep: v.mac || '', so_luong: isFinite(sl) ? sl : '', khoi_luong_tan: isFinite(kg) ? Math.round(kg / 10) / 100 : '', so_mtc: v.so_mtc || '', so_mir: v.so_mrir || '',
          du_an: da.ma, ncc: v.nha_sx || '', ngay_ve: '', trang_thai: 'DAT', ghi_chu: 'Theo MRIR · mã tấm ' + v.ma_tam + ' · ' + v.du_an, ngay_nt: homNay(), nguoi_nt: 'MRIR', ma_lan: '' };
        S.vt.push(moi); ghiNK('Lấy vật tư từ MRIR', 'VAT_TU', moi.ma_vt, '', v.ma_tam + ' · heat ' + moi.so_heat + ' · ' + qc); return sao(moi);
      });
    },
    /* GHI LỖI NHANH tại hiện trường (không cần lập phiếu): gắn với lệnh cắt / chi tiết, bắt buộc có ảnh */
    taoPunch: function (o) {
      return goi(function () {
        canVai(['QC'], 'ghi lỗi (punch)');
        var mt = String(o.mo_ta || '').trim(); if (!mt) loi('Mô tả lỗi.'); if (!MUC[o.muc]) loi('Chọn mức độ.'); if (!o.to) loi('Chọn tổ chịu trách nhiệm.'); if (!chuanNgay(o.han)) loi('Chọn hạn xử lý.');
        if (!(o.anh && o.anh.length)) loi('Cần ít nhất 1 ảnh chụp lỗi.');
        if (!String(o.lsx || '').trim() && !String(o.ma_chi_tiet || '').trim()) loi('Thiếu lệnh cắt hoặc chi tiết bị lỗi.');
        var loai = LOAI_LOI.indexOf(o.loai) >= 0 ? o.loai : 'Khác';
        S.dem.punch++; var u = { ma_punch: 'P-' + pad(S.dem.punch, 4), ma_phieu: '', mo_ta: mt, muc_do: o.muc, to: o.to, han: chuanNgay(o.han), trang_thai: 'MO', ngay_mo: homNay(), ngay_dong: '', nguoi_dong: '', anh_truoc: o.anh, anh_sau: [],
          lich_su: [{ t: homNay() + ' ' + gioPhut(), ai: tenNguoi(), viec: 'Ghi lỗi tại hiện trường' }], lsx: String(o.lsx || '').trim(), ma_chi_tiet: String(o.ma_chi_tiet || '').trim(), cong_trinh: String(o.cong_trinh || '').trim(), loai_loi: loai };
        S.punch.push(u);
        /* mỗi lần ghi lỗi tại hiện trường = 1 lượt kiểm KHÔNG ĐẠT trong sổ kiểm nhanh */
        S.dem.kn = (S.dem.kn || 0) + 1; S.kn = S.kn || [];
        S.kn.push({ ma_kn: 'KN-' + pad(S.dem.kn, 4), lsx: u.lsx, ma_chi_tiet: u.ma_chi_tiet, cong_trinh: u.cong_trinh, kq: 'KHONG_DAT', sl: '', ma_punch: u.ma_punch, ngoai_lenh: o.ngoai_lenh === 'CO' ? 'CO' : 'KHONG', ghi_chu: loai + ': ' + mt.slice(0, 80), nguoi: tenNguoi(), ngay: homNay(), luc: homNay() + ' ' + gioPhut(), anh: [] });
        ghiNK('Ghi lỗi tại hiện trường', 'PUNCH', u.ma_punch, '', [u.lsx, u.ma_chi_tiet, loai, mt].filter(Boolean).join(' · ')); return sao(ganDA(u));
      });
    },
    /* BẢNG ĐIỀU HÀNH (1 lần gọi cho cả màn): KPI tháng theo sổ lệnh + nhịp 14 ngày + tồn theo dự án + lệnh trễ + lỗi mở theo loại */
    bangDieuHanh: function (thang) {
      return goi(function () {
        if (!/^\d{4}-\d{2}$/.test(String(thang || ''))) thang = homNay().slice(0, 7);
        var t0 = thang + '-01', t1 = thang + '-31', hn = homNay(), s0 = function (v) { var k = so(v); return isFinite(k) ? k : 0; };
        /* KPI theo sổ lệnh (cùng cách tính với màn Kế hoạch cắt) */
        var kpi = { so_lenh: 0, ke_hoach: 0, da_cat: 0, ton: 0, xn: 0, tre: 0 }, mDA = {}, tonDA = [], tre = [];
        (S.ah1_lsx || []).forEach(function (x) {
          var a = chuanNgay(x.bat_dau), b = chuanNgay(x.ket_thuc); if (!x.lsx || !a || !b || a > t1 || b < t0) return;
          var tong = s0(x.tong_kl), cat = s0(x.da_cat), ton = s0(x.con_lai), xn = klXacNhan(x.lsx);
          var tt = ton <= 0.005 && tong > 0 ? 'XONG' : (String(x.canh_bao_tre || '').indexOf('Trễ') >= 0 || (b < hn && ton > 0.005)) ? 'TRE' : (a > hn) ? 'SAP' : 'DANG';
          kpi.so_lenh++; kpi.ke_hoach += tong; kpi.da_cat += cat; kpi.ton += ton; kpi.xn += xn; if (tt === 'TRE') { kpi.tre++; tre.push({ lsx: x.lsx, cong_trinh: x.du_an || '', ton: ton, tong: tong, ket_thuc: b, tre_ngay: b < hn ? soNgay(b, hn) : 0 }); }
          var k = x.du_an || '(chưa ghi công trình)', g = mDA[k]; if (!g) { g = mDA[k] = { ten: k, ton: 0, tong: 0, da_cat: 0 }; tonDA.push(g); }
          g.ton += ton; g.tong += tong; g.da_cat += cat;
        });
        kpi.so_da = tonDA.length;
        tonDA.sort(function (a, b) { return b.ton - a.ton; }); tre.sort(function (a, b) { return b.tre_ngay - a.tre_ngay || b.ton - a.ton; });
        /* nhịp 14 ngày: xưởng ra bài (lượt) ↔ QC đã kiểm (phiếu + kiểm nhanh, không tính huỷ) */
        var ds14 = [], mN = {}, i, d;
        for (i = 13; i >= 0; i--) { d = new Date(); d.setDate(d.getDate() - i); var n = isoNgay(d); mN[n] = { ngay: n, ra_bai: 0, tan: 0, kiem: 0 }; ds14.push(mN[n]); }
        (S.ah1_cat || []).forEach(function (x) { var n = chuanNgay(x.ngay_ra_bai), o = mN[n]; if (o && x.ten_chi_tiet) { o.ra_bai++; o.tan += s0(x.kl_tong) / 1000; } });
        S.phieu.forEach(function (ph) { var o = mN[ph.ngay]; if (o && ph.trang_thai !== 'HUY') o.kiem++; });
        (S.kn || []).forEach(function (x) { var o = mN[x.ngay]; if (o && x.kq !== 'HUY') o.kiem++; });
        /* lỗi mở theo loại */
        var mL = {}, loai = [], quaHan = 0, moL = S.punch.filter(function (u) { return u.trang_thai !== 'DA_DONG'; });
        moL.forEach(function (u) { var k = u.loai_loi || 'Khác', g = mL[k]; if (!g) { g = mL[k] = { ten: k, so: 0 }; loai.push(g); } g.so++; if (u.han && u.han < hn) quaHan++; });
        loai.sort(function (a, b) { return b.so - a.so; });
        var kn7 = (S.kn || []).filter(function (x) { return x.kq !== 'HUY' && x.ngay >= ngayCach(-6); });
        return sao({ thang: thang, luc: homNay() + ' ' + gioPhut(), kpi: kpi, ngay: ds14, ton_da: tonDA.slice(0, 8), lenh_tre: tre.slice(0, 10),
          punch: { mo: moL.length, qua_han: quaHan, loai: loai },
          kn: { hom_nay_dat: (S.kn || []).filter(function (x) { return x.kq === 'DAT' && x.ngay === hn; }).length, hom_nay_loi: (S.kn || []).filter(function (x) { return x.kq === 'KHONG_DAT' && x.ngay === hn; }).length, ngoai_lenh7: kn7.filter(function (x) { return x.ngoai_lenh === 'CO'; }).length },
          phieu_homnay: S.phieu.filter(function (ph) { return ph.ngay === hn && ph.trang_thai !== 'HUY'; }).length });
      });
    },
    /* KIỂM NHANH TẠI HIỆN TRƯỜNG — QC kiểm thực tế ĐẠT thì ghi 1 chạm, không cần lập phiếu đo đầy đủ.
       Cho ghi cả khi CHƯA CÓ LỆNH trong sổ xưởng (ngoai_lenh = CO). */
    accNhanh: function (o) {
      return goi(function () {
        o = o || {}; canVai(['QC'], 'ghi kiểm nhanh tại hiện trường');
        var part = String(o.ma_chi_tiet || '').trim(), lsx = String(o.lsx || '').trim(), ct = String(o.cong_trinh || '').trim();
        if (!part) loi('Ghi mã chi tiết (part) đang kiểm.');
        if (!lsx && !ct) loi('Không có lệnh thì phải chọn dự án (công trình) để sau đối chiếu.');
        var cu = knCua(lsx, part).filter(function (x) { return x.kq === 'DAT'; })[0];
        if (cu) loi('Chi tiết ' + part + (lsx ? ' của lệnh ' + lsx : '') + ' đã được ' + cu.nguoi + ' ghi ĐẠT lúc ' + cu.luc + ' (' + cu.ma_kn + '). Nhầm thì huỷ dòng đó trước.');
        var slv = so(o.sl);
        S.dem.kn = (S.dem.kn || 0) + 1; S.kn = S.kn || [];
        var k = { ma_kn: 'KN-' + pad(S.dem.kn, 4), lsx: lsx, ma_chi_tiet: part, cong_trinh: ct, kq: 'DAT', sl: isFinite(slv) && slv > 0 ? slv : '', ma_punch: '', ngoai_lenh: o.ngoai_lenh === 'CO' ? 'CO' : 'KHONG', ghi_chu: String(o.ghi_chu || '').trim(), nguoi: tenNguoi(), ngay: homNay(), luc: homNay() + ' ' + gioPhut(), anh: o.anh || [] };
        S.kn.push(k); ghiNK('Kiểm nhanh ĐẠT', 'KIEM_NHANH', k.ma_kn, '', [lsx, part, ct].filter(Boolean).join(' · ') + (k.ngoai_lenh === 'CO' ? ' · NGOÀI LỆNH' : ''));
        return sao(k);
      });
    },
    huyKiemNhanh: function (ma, lyDo) {
      return goi(function () {
        var k = (S.kn || []).filter(function (x) { return x.ma_kn === ma; })[0]; if (!k) loi('Không thấy lượt kiểm ' + ma + '.');
        if (k.kq !== 'DAT') loi('Chỉ huỷ được lượt ghi ĐẠT (lượt lỗi xử lý ở punch ' + (k.ma_punch || '') + ').');
        var ld = String(lyDo || '').trim(); if (!ld) loi('Ghi lý do huỷ.');
        if (vai !== 'QUAN_LY' && k.nguoi !== tenNguoi()) loi('Chỉ chính người ghi hoặc Quản lý QC được huỷ.');
        k.kq = 'HUY'; k.ghi_chu = (k.ghi_chu ? k.ghi_chu + ' · ' : '') + 'HUỶ: ' + ld + ' (' + tenNguoi() + ' ' + homNay() + ' ' + gioPhut() + ')';
        ghiNK('Huỷ lượt kiểm nhanh', 'KIEM_NHANH', ma, 'DAT', ld); return sao(k);
      });
    },
    dsKiemNhanh: function (tu, den) {
      return goi(function () {
        tu = chuanNgay(tu) || ngayCach(-6); den = chuanNgay(den) || homNay();
        var ds = (S.kn || []).filter(function (x) { return x.ngay >= tu && x.ngay <= den; }).map(function (x) { var y = Object.assign({}, x); y.du_an = duAnTheoTenAH1(x.cong_trinh); return y; })
          .filter(function (x) { return !daChon || !x.du_an || x.du_an === daChon; }).sort(function (a, b) { return a.luc < b.luc ? 1 : -1; });
        var hl = ds.filter(function (x) { return x.kq !== 'HUY'; });
        return sao({ tu: tu, den: den, ds: ds.slice(0, 300), tong: { so: hl.length, dat: hl.filter(function (x) { return x.kq === 'DAT'; }).length, loi: hl.filter(function (x) { return x.kq === 'KHONG_DAT'; }).length, ngoai_lenh: hl.filter(function (x) { return x.ngoai_lenh === 'CO'; }).length, huy: ds.length - hl.length } });
      });
    },
    /* SỔ KHỐI LƯỢNG QC XÁC NHẬN: từng lần xác nhận + cộng theo dự án, theo QC, theo ngày */
    soKhoiLuong: function (tu, den) {
      return goi(function () {
        var s0 = function (v) { var k = so(v); return isFinite(k) ? k : 0; }, ds = (S.xn || []).filter(function (x) { return (!tu || x.ngay >= tu) && (!den || x.ngay <= den); }).map(function (x) { var y = Object.assign({}, x); y.du_an = duAnTheoTenAH1(x.cong_trinh); return y; })
          .filter(function (x) { return !daChon || !x.du_an || x.du_an === daChon; }).sort(function (a, b) { return a.luc < b.luc ? 1 : -1; });
        function gop(f) { var m = {}, o = []; ds.forEach(function (x) { if (x.trang_thai === 'HUY') return; var k = x[f] || '(chưa ghi)', g = m[k]; if (!g) { g = m[k] = { ten: k, tan: 0, lan: 0, lenh: {} }; o.push(g); } g.tan += s0(x.kl_tan); g.lan++; g.lenh[x.lsx] = 1; });
          return o.map(function (g) { return { ten: g.ten, tan: g.tan, lan: g.lan, so_lenh: Object.keys(g.lenh).length }; }).sort(function (a, b) { return b.tan - a.tan; }); }
        var hl = ds.filter(function (x) { return x.trang_thai !== 'HUY'; });
        return sao({ tu: tu || '', den: den || '', ds: ds, tong: { tan: hl.reduce(function (s, x) { return s + s0(x.kl_tan); }, 0), lan: hl.length, huy: ds.length - hl.length }, theo_da: gop('cong_trinh'), theo_qc: gop('nguoi'), theo_ngay: gop('ngay').sort(function (a, b) { return a.ten < b.ten ? 1 : -1; }) });
      });
    },
    /* TRUY XUẤT THEO HỒ SƠ THẬT (MRIR + MTR): gõ part / cấu kiện / bản vẽ / heat / mã tấm / số MTC / số MRIR.
       Trên máy chủ S.tx_ct, S.tx_vt chỉ chứa phần đã tìm theo khoá; ở bản mẫu chứa toàn bộ → lọc lại ở đây cho cả hai. */
    truyXuatTX: function (q) {
      return goi(function () {
        var k = chuanHeat(q), rong = { q: String(q || ''), ct: [], tong_ct: 0, vt: [], tom: {}, khop: [], canh: [], tt: S.tx_tt || null };
        if (k.length < 2) return rong;
        var KC = [['k_part', 'part'], ['k_ck', 'cấu kiện'], ['k_bv', 'bản vẽ'], ['k_heat', 'heat'], ['k_tam', 'mã tấm'], ['k_mtc', 'số MTC']], KV = [['k_tam', 'mã tấm'], ['k_heat', 'heat'], ['k_mtc', 'số MTC'], ['k_mrir', 'số MRIR']], khop = {};
        var ct = (S.tx_ct || []).filter(function (x) { return KC.some(function (p) { if (x[p[0]] === k) { khop[p[1]] = 1; return true; } return false; }); });
        var tam = {}; ct.forEach(function (x) { if (x.k_tam) tam[x.du_an + '|' + x.k_tam] = 1; });
        var vt = (S.tx_vt || []).filter(function (v) { var tr = KV.some(function (p) { if (v[p[0]] === k) { khop[p[1]] = 1; return true; } return false; }); return tr || tam[v.du_an + '|' + v.k_tam]; });
        if (!ct.length && !vt.length) return rong;
        function ds(a, f) { var m = {}, o = []; a.forEach(function (x) { var v = String(x[f] || '').trim(); if (v && !m[v]) { m[v] = 1; o.push(v); } }); return o; }
        var canh = [], coVT = {}, daTra = S.tx_tra ? {} : null; vt.forEach(function (v) { (coVT[v.du_an + '|' + v.k_tam] = coVT[v.du_an + '|' + v.k_tam] || []).push(v); });
        if (S.tx_tra) S.tx_tra.forEach(function (x) { daTra[x] = 1; });
        var baoT = {};
        ct.forEach(function (x) {
          var key = x.du_an + '|' + x.k_tam; if (!x.k_tam) { if (!baoT['kt' + x.part]) { baoT['kt' + x.part] = 1; canh.push('Part ' + x.part + ' (cấu kiện ' + x.cau_kien + ') không ghi mã tấm.'); } return; }
          if (daTra && !daTra[key]) return;
          var vs = coVT[key];
          if (!vs) { if (!baoT['m' + key]) { baoT['m' + key] = 1; canh.push('Mã tấm ' + x.ma_tam + ' có trong báo cáo truy xuất nhưng KHÔNG có trong danh sách nghiệm thu vật tư (MRIR) của ' + x.du_an + '.'); } return; }
          if (x.k_heat && !vs.some(function (v) { return v.k_heat === x.k_heat; }) && !baoT['h' + key + x.k_heat]) { baoT['h' + key + x.k_heat] = 1; canh.push('LỆCH HEAT: part ' + x.part + ' ghi heat ' + x.so_heat + ' cho mã tấm ' + x.ma_tam + ', nhưng MRIR ghi heat ' + ds(vs, 'so_heat').join(', ') + '.'); }
        });
        vt.forEach(function (v) { var kqv = chuanTen(v.ket_qua); if (kqv && kqv.indexOf('acc') !== 0 && kqv !== 'dat') canh.push('Mã tấm ' + v.ma_tam + ' (heat ' + v.so_heat + ') có kết quả nghiệm thu "' + v.ket_qua + '" nhưng xuất hiện trong hồ sơ.'); });
        return sao({ q: String(q), ct: ct.slice(0, 150), tong_ct: Math.max(S.tx_tong || 0, ct.length), vt: vt, khop: Object.keys(khop), canh: canh, tt: S.tx_tt || null,
          tom: { du_an: ds(ct.concat(vt), 'du_an'), ban_ve: ds(ct, 'ban_ve'), cau_kien: ds(ct, 'cau_kien'), part: ds(ct, 'part'), heat: ds(ct.concat(vt), 'so_heat'), ma_tam: ds(ct.concat(vt), 'ma_tam'), mtc: ds(ct.concat(vt), 'so_mtc'), mrir: ds(ct.concat(vt), 'so_mrir') } });
      });
    },
    trangThaiTX: function () { return goi(function () { return sao({ tt: S.tx_tt || null, nguon: S.tx_nguon || [] }); }); },
    dongBoTX: function () { return goi(function () { canVai(['QUAN_LY'], 'đồng bộ nguồn truy xuất'); return 'Bản mẫu: không có file nguồn thật để đồng bộ.'; }); },
    /* NẠP HỒ SƠ TRUY XUẤT NGAY TRÊN APP (theo dự án, từng lượt ≤ 4.000 dòng). Trên máy chủ: Code_TX.gs ghi thẳng vào kho truy xuất (không qua đây). */
    napTX: function (o) {
      return goi(function () {
        var m = txNapMo(o), L = S.tx_lan = S.tx_lan || [], lan, thay = 0;
        if (m.moi) {
          L.forEach(function (x) { if (!txCungLan(x, m)) return; var nh = '[' + x.ma_lan + ']'; ['tx_vt', 'tx_ct'].forEach(function (f) { S[f] = (S[f] || []).filter(function (r) { return String(r.nguon || '').slice(-nh.length) !== nh; }); }); x.trang_thai = 'XOA'; x.ghi_chu = 'Thay bằng lần nạp mới'; thay++; });
          lan = { ma_lan: txMaLanMoi(L), du_an: m.da.ten, ma_du_an: m.da.ma, loai: m.nb.loai, ten_file: m.ten_file, tab: m.tab, so_dong: 0, so_bo_qua: 0, nguoi: tenNguoi(), luc: homNay() + ' ' + gioPhut(), trang_thai: 'DANG', ghi_chu: '' }; L.push(lan);
        } else { lan = L.filter(function (x) { return x.ma_lan === o.ma_lan; })[0]; if (!lan || lan.trang_thai !== 'DANG') loi('Lần nạp ' + o.ma_lan + ' không còn mở. Nạp lại từ đầu.'); if (lan.loai !== m.nb.loai) loi('Sai loại bảng của lần nạp ' + o.ma_lan + '.'); }
        var c = txChuyen(m.rows, m.nb, lan.du_an, txNhanLan(lan)), f = lan.loai === 'TX_VAT_TU' ? 'tx_vt' : 'tx_ct';
        S[f] = (S[f] || []).concat(c.ds); lan.so_dong = (so(lan.so_dong) || 0) + c.ds.length; lan.so_bo_qua = (so(lan.so_bo_qua) || 0) + c.bo_qua;
        if (o.cuoi) { lan.trang_thai = 'XONG'; ghiNK('Nạp hồ sơ truy xuất', 'LAN_NAP_TX', lan.ma_lan, '', lan.du_an + ' · ' + lan.ten_file + (lan.tab ? ' › ' + lan.tab : '') + ' · ' + lan.so_dong + ' dòng'); }
        return sao({ ma_lan: lan.ma_lan, nb: m.nb, loai: lan.loai, them: c.ds.length, bo_qua: c.bo_qua, so_dong: lan.so_dong, xong: lan.trang_thai === 'XONG', thay: thay });
      });
    },
    dsLanNapTX: function () { return goi(function () { return sao(txTomLan(S.tx_lan || [])); }); },
    xoaLanNapTX: function (ma) {
      return goi(function () {
        canVai(['QUAN_LY'], 'xoá lần nạp hồ sơ truy xuất');
        var lan = (S.tx_lan || []).filter(function (x) { return x.ma_lan === ma && x.trang_thai !== 'XOA'; })[0]; if (!lan) loi('Không thấy lần nạp ' + ma + '.');
        var nh = '[' + lan.ma_lan + ']', truoc = (S.tx_vt || []).length + (S.tx_ct || []).length;
        ['tx_vt', 'tx_ct'].forEach(function (f) { S[f] = (S[f] || []).filter(function (r) { return String(r.nguon || '').slice(-nh.length) !== nh; }); });
        lan.trang_thai = 'XOA'; lan.ghi_chu = 'Xoá bởi ' + tenNguoi() + ' ' + homNay() + ' ' + gioPhut();
        var n = truoc - (S.tx_vt || []).length - (S.tx_ct || []).length; ghiNK('Xoá lần nạp hồ sơ truy xuất', 'LAN_NAP_TX', lan.ma_lan, lan.du_an + ' · ' + lan.ten_file, n + ' dòng'); return { ma_lan: ma, da_xoa: n };
      });
    },
    /* Trên máy chủ: Code_TX.gs nạp sẵn TOÀN BỘ dòng của dự án vào S.tx_vt / S.tx_ct trước khi gọi */
    kiemTX: function (tenDuAn) { return goi(function () { var t = String(tenDuAn || ''); if (!t) loi('Chọn dự án cần kiểm soát.'); return sao(txKiem(t, (S.tx_vt || []).filter(function (x) { return x.du_an === t; }), (S.tx_ct || []).filter(function (x) { return x.du_an === t; }))); }); },
    duAnTX: function () { return goi(function () { return sao(S.tx_da || txDuAn(S.tx_vt || [], S.tx_ct || [])); }); },
    capNhatPunch: function (ma, viec, opt) {
      opt = opt || {};
      return goi(function () {
        var p = timPunch(ma); if (!p) loi('Không thấy punch ' + ma);
        var ghi = String(opt.ghi_chu || '').trim();
        if (viec === 'BAO_SUA') {
          canVai(['TO_TRUONG', 'QC'], 'báo đã sửa');
          if (p.trang_thai !== 'MO') loi('Chỉ báo sửa được punch đang Mở.');
          if (p.anh_truoc.length && !(opt.anh && opt.anh.length)) loi('Punch có ảnh lỗi → cần chụp ảnh SAU khi sửa.');
          p.anh_sau = (opt.anh || []); p.trang_thai = 'DA_SUA';
          p.lich_su.push({ t: homNay() + ' ' + gioPhut(), ai: tenNguoi(), viec: 'Báo đã sửa' + (ghi ? ': ' + ghi : '') });
        } else if (viec === 'DONG' || viec === 'MO_LAI') {
          canVai(['QC'], viec === 'DONG' ? 'đóng punch' : 'mở lại punch');
          if (p.trang_thai !== 'DA_SUA') loi('Chỉ xử lý được punch ở trạng thái "Đã sửa · chờ QC".');
          if (viec === 'MO_LAI' && !ghi) loi('Cần ghi lý do kiểm lại chưa đạt.');
          p.trang_thai = viec === 'DONG' ? 'DA_DONG' : 'MO';
          if (viec === 'DONG') { p.ngay_dong = homNay(); p.nguoi_dong = tenNguoi(); }
          p.lich_su.push({ t: homNay() + ' ' + gioPhut(), ai: tenNguoi(), viec: (viec === 'DONG' ? 'Đóng punch' : 'Kiểm lại chưa đạt, mở lại') + (ghi ? ': ' + ghi : '') });
        } else loi('Việc không hợp lệ');
        ghiNK('Punch: ' + viec, 'PUNCH_ITEM', ma, '', p.trang_thai);
        capNhatTTPhieu(p.ma_phieu);
        return sao(ganDA(p));
      });
    },
    dsKeHoach: function (tu, den) {
      return goi(function () {
        return sao(S.ke_hoach.filter(function (k) { return theoDA(k.du_an) && (!tu || k.ngay >= tu) && (!den || k.ngay <= den); })
          .map(function (k) { var x = Object.assign({}, k); x.tt = ttKH(k); return x; })
          .sort(function (a, b) { return a.ngay < b.ngay ? -1 : a.ngay > b.ngay ? 1 : a.xuong < b.xuong ? -1 : a.xuong > b.xuong ? 1 : a.ma_kh < b.ma_kh ? -1 : 1; }));
      });
    },
    luuKeHoach: function (k, laMoi) {
      return goi(function () {
        canVai(['QUAN_LY', 'QC'], laMoi ? 'lập kế hoạch nghiệm thu' : 'sửa kế hoạch');
        var da = layDuAn(k.du_an); if (!da) loi('Chọn dự án.');
        if (da.trang_thai !== 'DANG_CHAY') loi('Dự án ' + da.ten + ' đang "' + TT_DA[da.trang_thai][0] + '".');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(k.ngay || '')) loi('Chọn ngày nghiệm thu.');
        if (XUONG.indexOf(k.xuong) < 0) loi('Chọn xưởng.');
        if (!congDoan(k.cong_doan)) loi('Chọn công đoạn.');
        if (!String(k.ma_chi_tiet || '').trim()) loi('Nhập mã chi tiết / hạng mục cần nghiệm thu.');
        var sl = so(k.so_luong); if (k.so_luong !== '' && k.so_luong != null && !(sl > 0)) loi('Số lượng phải lớn hơn 0.');
        var o = { du_an: da.ma, ngay: k.ngay, xuong: k.xuong, cong_doan: k.cong_doan, ma_chi_tiet: String(k.ma_chi_tiet).trim().toUpperCase(), ban_ve: String(k.ban_ve || '').trim(), so_luong: isFinite(sl) ? sl : '', ghi_chu: String(k.ghi_chu || '').trim() };
        if (laMoi) { S.dem.kh = (S.dem.kh || 0) + 1; o.ma_kh = 'KH-' + pad(S.dem.kh, 4); o.trang_thai = 'CHO'; o.ma_phieu = ''; o.ngay_lam = ''; o.nguoi_lap = tenNguoi(); S.ke_hoach.push(o); ghiNK('Lập kế hoạch', 'KE_HOACH_NT', o.ma_kh, '', o.ngay); return sao(o); }
        var cu = timKH(k.ma_kh); if (!cu) loi('Không thấy kế hoạch ' + k.ma_kh); if (cu.trang_thai !== 'CHO') loi('Chỉ sửa được kế hoạch đang chờ.');
        ghiNK('Sửa kế hoạch', 'KE_HOACH_NT', cu.ma_kh, cu.ngay + ' ' + cu.ma_chi_tiet, o.ngay + ' ' + o.ma_chi_tiet); Object.assign(cu, o); return sao(cu);
      });
    },
    huyKeHoach: function (ma, lyDo) {
      return goi(function () {
        canVai(['QUAN_LY'], 'huỷ kế hoạch');
        var k = timKH(ma); if (!k) loi('Không thấy kế hoạch ' + ma); if (k.trang_thai !== 'CHO') loi('Chỉ huỷ được kế hoạch đang chờ.');
        if (!String(lyDo || '').trim()) loi('Cần ghi lý do huỷ.');
        k.trang_thai = 'HUY'; k.ghi_chu = String(lyDo).trim(); ghiNK('Huỷ kế hoạch', 'KE_HOACH_NT', ma, 'CHO', 'HUY'); return sao(k);
      });
    },
    baoCao: function (tu, den) {
      return goi(function () {
        var t = homNay(), r = { tu: tu, den: den, duAn: daChon ? sao(layDuAn(daChon)) : null, lapLuc: hienNgay(t) + ' ' + gioPhut() };
        var PH = S.phieu.filter(function (p) { return theoDA(p.du_an) && p.ngay >= tu && p.ngay <= den && p.trang_thai !== 'HUY'; });
        r.tong = PH.length; r.dat1 = PH.filter(phieuDatLanDau).length; r.tyLe = r.tong ? r.dat1 / r.tong * 100 : NaN;
        r.hmKiem = 0; r.hmLoi = 0; r.slCT = 0;
        PH.forEach(function (p) { r.hmKiem += p.ket_qua.length; r.hmLoi += p.ket_qua.filter(function (x) { return x.kq === 'KHONG_DAT'; }).length; r.slCT += Number(p.so_ct) || 0; });
        var mp = {}; PH.forEach(function (p) { mp[p.ma_phieu] = 1; });
        var PU = S.punch.filter(function (u) { return mp[u.ma_phieu]; });
        r.punch = { tong: PU.length, mo: PU.filter(function (u) { return u.trang_thai === 'MO'; }).length, sua: PU.filter(function (u) { return u.trang_thai === 'DA_SUA'; }).length,
          dong: PU.filter(function (u) { return u.trang_thai === 'DA_DONG'; }).length, qh: PU.filter(quaHan).length, A: PU.filter(function (u) { return u.muc_do === 'A'; }).length };
        function nhom(ds, khoa, nhan) { return ds.map(function (g) { var x = PH.filter(function (p) { return p[khoa] === g; }), d = x.filter(phieuDatLanDau).length, l = 0; x.forEach(function (p) { l += p.ket_qua.filter(function (k) { return k.kq === 'KHONG_DAT'; }).length; }); return { ten: nhan(g), phieu: x.length, dat1: d, loi: l, tyLe: x.length ? d / x.length * 100 : NaN }; }); }
        r.theoCD = nhom(CONG_DOAN.map(function (c) { return c.ma; }), 'cong_doan', function (m) { return congDoan(m).ten; });
        r.theoXuong = nhom(XUONG, 'xuong', function (x) { return x; });
        r.theoDuAn = daChon ? [] : nhom(DU_AN.map(function (d) { return d.ma; }), 'du_an', tenDuAn).filter(function (x) { return x.phieu; });
        var dem = {}; PH.forEach(function (p) { p.ket_qua.forEach(function (k) { if (k.kq === 'KHONG_DAT') dem[k.ma_hm] = (dem[k.ma_hm] || 0) + 1; }); });
        r.topLoi = Object.keys(dem).map(function (m) { var h = hangMuc(m), c = CONG_DOAN.filter(function (x) { return x.hm.indexOf(h) >= 0; })[0]; return { ten: h ? h.ten : m, cd: c ? c.ten : '', n: dem[m] }; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 5);
        r.theoNgay = []; var d0 = new Date(tu + 'T00:00:00'), d1 = new Date(den + 'T00:00:00'), nd = 0;
        for (var d = d0; d <= d1 && nd < 62; d.setDate(d.getDate() + 1), nd++) { var iso = isoNgay(d), x = PH.filter(function (p) { return p.ngay === iso; }); r.theoNgay.push({ ngay: iso, phieu: x.length, dat1: x.filter(phieuDatLanDau).length }); }
        var KH = S.ke_hoach.filter(function (k) { return theoDA(k.du_an) && k.ngay >= tu && k.ngay <= den; });
        r.kh = { tong: KH.filter(function (k) { return k.trang_thai !== 'HUY'; }).length, xong: KH.filter(function (k) { return k.trang_thai === 'XONG'; }).length, tre: KH.filter(function (k) { return ttKH(k) === 'TRE'; }).length,
          cho: KH.filter(function (k) { return k.trang_thai === 'CHO' && ttKH(k) !== 'TRE'; }).length, huy: KH.filter(function (k) { return k.trang_thai === 'HUY'; }).length };
        r.kh.tyLe = r.kh.tong ? r.kh.xong / r.kh.tong * 100 : NaN;
        r.dsTre = sao(KH.filter(function (k) { return ttKH(k) === 'TRE'; }));
        r.dsPhieu = sao(PH.slice().sort(function (a, b) { return a.ngay < b.ngay ? 1 : -1; }).map(function (p) { var x = Object.assign({}, p); x.dat1 = phieuDatLanDau(p); x.punch_mo = S.punch.filter(function (u) { return u.ma_phieu === p.ma_phieu && u.trang_thai !== 'DA_DONG'; }).length; return x; }));
        return r;
      });
    },
    napSDC: function (pt, tenFile) {
      return goi(function () {
        canVai(['QC', 'QUAN_LY'], 'nạp sơ đồ cắt');
        if (!pt || pt.thieu.length) loi('Thiếu cột bắt buộc, không ghi.');
        S.dem.lan_sdc = (S.dem.lan_sdc || 0) + 1; var lan = 'LS-' + pad(S.dem.lan_sdc, 4), them = 0, moi = 0;
        pt.dong.forEach(function (d) {
          if (d.tt !== 'OK') return; var g = d.gt, sd = S.sdc.filter(function (x) { return x.ma_sdc === g.ma_sdc; })[0];
          if (sd && sd.du_an && g.du_an && sd.du_an !== g.du_an) { d.tt = 'LOI'; d.ly_do = 'SDC ' + g.ma_sdc + ' thuộc dự án ' + tenDuAn(sd.du_an); return; }
          if (!sd) { sd = { ma_sdc: g.ma_sdc, du_an: g.du_an, xuong: g.xuong, may: g.may, ngay_cat: g.ngay_cat || homNay(), dong: [], nguon: (tenFile || 'Dán từ Excel') + ' · ' + lan }; S.sdc.push(sd); moi++; }
          if (sd.dong.some(function (x) { return chuanHeat(x.part) === g.part && x.ma_vt === g.ma_vt; })) return;
          sd.dong.push({ part: g.part, ma_vt: g.ma_vt, so_heat: g.so_heat, quy_cach: g.quy_cach, sl: g.sl }); them++;
        });
        ghiNK('Nạp sơ đồ cắt', 'SO_DO_CAT', lan, '', them + ' dòng cắt, ' + moi + ' SDC mới');
        return { ma_lan: lan, them: them, moi: moi };
      });
    },
    phanTichBang: function (bang, da) { return goi(function () { return phanTichBang(bang, da); }); },
    phanTichSDC: function (bang, da) { return goi(function () { return phanTichSDC(bang, da); }); },
    dongTheoPart: function (part) { return goi(function () { return sao(dongCuaPart(part)); }); },
    timAH1: function (q) {
      return goi(function () {
        var k = chuanHeat(q), kl = k.replace(/-/g, '_'); if (!k) return { cat: [], ct: [], lsx: [], tt: S.ah1_tt || null };
        return sao({ cat: (S.ah1_cat || []).filter(function (x) { return x.k_ten === k || x.k_lsx === kl; }),
          ct: (S.ah1_ct || []).filter(function (x) { return x.k_ten === k || x.k_code === k || x.k_lsx === kl; }),
          lsx: (S.ah1_lsx || []).filter(function (x) { return x.k_lsx === kl; }), tt: S.ah1_tt || null });
      });
    },
    dsChoNT: function () {
      return goi(function () {
        var t = homNay(), daNT = {}; S.phieu.forEach(function (p) { if (p.trang_thai !== 'HUY') daNT[chuanHeat(p.ma_chi_tiet)] = 1; });
        return sao((S.ah1_cat || []).map(function (x) { var y = Object.assign({}, x); y.moi_nt = chuanNgay(x.moi_nghiem_thu); y.du_an = duAnTheoTenAH1(x.cong_trinh); return y; })
          .filter(function (x) { return !daChon || !x.du_an || x.du_an === daChon; })
          .filter(function (x) { return /^\d{4}-\d{2}-\d{2}$/.test(x.moi_nt) && x.moi_nt <= t && soNgay(x.moi_nt, t) <= 30 && !daNT[chuanHeat(x.ten_chi_tiet)]; })
          .sort(function (a, b) { return a.moi_nt < b.moi_nt ? 1 : a.moi_nt > b.moi_nt ? -1 : 0; }).slice(0, 200));
      });
    },
    /* Kế hoạch cắt của xưởng AH1 (bản sao AH1_CAT) theo ngày ra bài, đánh dấu chi tiết đã có phiếu sơ chế */
    keHoachAH1: function (tu, den) {
      return goi(function () {
        var daNT = {}; S.phieu.forEach(function (p) { if (p.trang_thai !== 'HUY') daNT[chuanHeat(p.ma_chi_tiet)] = p.ma_phieu; });
        /* ngày có lượt cắt gần nhất TRƯỚC và SAU khoảng đang xem (để khi khoảng trống vẫn biết xem ở đâu) */
        var gan = S.ah1_gan || (function () { var t = '', s2 = ''; (S.ah1_cat || []).forEach(function (x) { var n = chuanNgay(x.ngay_ra_bai); if (!/^\d{4}-\d{2}-\d{2}$/.test(n)) return; if (tu && n < tu && n > t) t = n; if (den && n > den && (!s2 || n < s2)) s2 = n; }); return { truoc: t, sau: s2 }; })();
        var ds = (S.ah1_cat || []).map(function (x) { var y = Object.assign({}, x); y.ngay = chuanNgay(x.ngay_ra_bai); y.moi_nt = chuanNgay(x.moi_nghiem_thu); y.du_an = duAnTheoTenAH1(x.cong_trinh); y.ma_phieu = daNT[chuanHeat(x.ten_chi_tiet)] || ''; return y; })
          .filter(function (x) { return /^\d{4}-\d{2}-\d{2}$/.test(x.ngay) && (!tu || x.ngay >= tu) && (!den || x.ngay <= den) && (!daChon || !x.du_an || x.du_an === daChon); })
          .sort(function (a, b) { return a.ngay < b.ngay ? -1 : a.ngay > b.ngay ? 1 : String(a.may).localeCompare(String(b.may)); });
        var tan = ds.reduce(function (s, x) { var k = so(x.kl_tong); return s + (isFinite(k) ? k : 0); }, 0) / 1000;
        return sao({ tong: ds.length, da_nt: ds.filter(function (x) { return x.ma_phieu; }).length, tan: tan, ds: ds.slice(0, 300), gan: gan });
      });
    },
    /* Tiến độ cắt xưởng AH1 theo công trình trong tháng 'YYYY-MM':
       - LSX "đang chạy trong tháng" = khoảng bắt đầu–kết thúc của lệnh giao với tháng (sổ "Kế hoạch cắt theo lệnh", đơn vị TẤN)
       - cắt trong tháng = tổng KL các lượt ra bài trong tháng (sổ "NHẬP LIỆU", đơn vị kg → đổi ra tấn) */
    tienDoCatAH1: function (thang) {
      return goi(function () {
        if (!/^\d{4}-\d{2}$/.test(String(thang || ''))) thang = homNay().slice(0, 7);
        var t0 = thang + '-01', t1 = thang + '-31', m = {}, ds = [];
        function nhom(ten) { ten = String(ten || '').trim() || '(chưa ghi công trình)'; if (!m[ten]) { m[ten] = { cong_trinh: ten, du_an: duAnTheoTenAH1(ten), so_lsx: 0, tong: 0, da_cat: 0, ton: 0, tre: 0, cat_thang: 0, luot: 0 }; ds.push(m[ten]); } return m[ten]; }
        function s0(v) { var k = so(v); return isFinite(k) ? k : 0; }
        (S.ah1_lsx || []).forEach(function (x) {
          var a = chuanNgay(x.bat_dau), b = chuanNgay(x.ket_thuc); if (!a || !b || a > t1 || b < t0) return;
          var g = nhom(x.du_an); g.so_lsx++; g.tong += s0(x.tong_kl); g.da_cat += s0(x.da_cat); g.ton += s0(x.con_lai); if (String(x.canh_bao_tre || '').indexOf('Trễ') >= 0) g.tre++;
        });
        (S.ah1_cat || []).forEach(function (x) {
          var n = chuanNgay(x.ngay_ra_bai); if (!n || n < t0 || n > t1) return;
          var g = nhom(x.cong_trinh); g.cat_thang += s0(x.kl_tong) / 1000; g.luot++;
        });
        ds = ds.filter(function (g) { return !daChon || !g.du_an || g.du_an === daChon; }).sort(function (a, b) { return b.ton - a.ton || b.cat_thang - a.cat_thang; });
        var tg = { so_lsx: 0, tong: 0, da_cat: 0, ton: 0, tre: 0, cat_thang: 0, luot: 0 };
        ds.forEach(function (g) { Object.keys(tg).forEach(function (k) { tg[k] += g[k]; }); });
        return sao({ thang: thang, ds: ds, tong: tg });
      });
    },
    /* YÊU CẦU RIÊNG CỦA DỰ ÁN (mã màu, cách khoan lỗ, đóng số…): QC thấy ngay khi mở lệnh và khi lập phiếu */
    dsYeuCau: function () { return goi(function () { return sao((S.yc || []).filter(function (y) { return y.hoat_dong !== 'KHONG'; })); }); },
    luuYeuCau: function (o) {
      return goi(function () {
        canVai(['QUAN_LY'], 'thêm / sửa yêu cầu dự án');
        var ct = String(o.cong_trinh || '').trim(), nd = String(o.noi_dung || '').trim(), loai = String(o.loai || '').trim();
        if (!ct) loi('Chọn công trình.'); if (LOAI_YC.indexOf(loai) < 0) loi('Chọn loại yêu cầu.'); if (!nd) loi('Nhập nội dung yêu cầu.');
        var y = o.ma_yc ? (S.yc || []).filter(function (x) { return x.ma_yc === o.ma_yc; })[0] : null;
        if (o.ma_yc && !y) loi('Không thấy yêu cầu ' + o.ma_yc);
        if (y) { var cu = y.loai + ': ' + y.noi_dung; y.loai = loai; y.noi_dung = nd; y.nguoi = tenNguoi(); y.luc = homNay() + ' ' + gioPhut(); ghiNK('Sửa yêu cầu dự án', 'YEU_CAU_DU_AN', y.ma_yc, cu, loai + ': ' + nd); return sao(y); }
        S.dem.yc = Math.max(S.dem.yc || 0, (S.yc || []).length) + 1;
        y = { ma_yc: 'YC-' + pad(S.dem.yc, 4), cong_trinh: ct, loai: loai, noi_dung: nd, hoat_dong: 'CO', nguoi: tenNguoi(), luc: homNay() + ' ' + gioPhut() };
        S.yc.push(y); ghiNK('Thêm yêu cầu dự án', 'YEU_CAU_DU_AN', y.ma_yc, '', ct + ' · ' + loai + ': ' + nd); return sao(y);
      });
    },
    tatYeuCau: function (ma) {
      return goi(function () {
        canVai(['QUAN_LY'], 'bỏ yêu cầu dự án');
        var y = (S.yc || []).filter(function (x) { return x.ma_yc === ma; })[0]; if (!y) loi('Không thấy yêu cầu ' + ma);
        y.hoat_dong = 'KHONG'; ghiNK('Bỏ yêu cầu dự án', 'YEU_CAU_DU_AN', ma, y.loai + ': ' + y.noi_dung, 'KHONG'); return sao(y);
      });
    },
    /* QC XÁC NHẬN KHỐI LƯỢNG THEO LỆNH CẮT (tấn). Không cho vượt kế hoạch của lệnh; vượt số xưởng báo đã cắt thì vẫn ghi nhưng gắn cờ để soát. */
    xacNhanKL: function (o) {
      return goi(function () {
        canVai(['QC'], 'xác nhận khối lượng');
        var lsx = String(o.lsx || '').trim(), kl = so(o.kl_tan), kk = chuanHeat(lsx).replace(/-/g, '_'); if (!lsx) loi('Thiếu số lệnh cắt.');
        if (!isFinite(kl) || kl <= 0) loi('Nhập khối lượng xác nhận (tấn) lớn hơn 0.');
        var l = (S.ah1_lsx || []).filter(function (x) { return x.k_lsx === kk; })[0], da = klXacNhan(lsx), s0 = function (v) { var k = so(v); return isFinite(k) ? k : 0; };
        var tong = l ? s0(l.tong_kl) : 0, cat = l ? s0(l.da_cat) : 0;
        if (l && tong > 0 && da + kl > tong + 0.005) loi('Vượt kế hoạch của lệnh ' + lsx + ': kế hoạch ' + fmt(tong, 2) + ' tấn, QC đã xác nhận ' + fmt(da, 2) + ' tấn, chỉ còn được xác nhận ' + fmt(Math.max(0, tong - da), 2) + ' tấn.');
        var vuot = !!l && da + kl > cat + 0.005;
        S.dem.xn = Math.max(S.dem.xn || 0, (S.xn || []).length) + 1;
        var x = { ma_xn: 'XN-' + pad(S.dem.xn, 4), lsx: l ? l.lsx : lsx, cong_trinh: (l && l.du_an) || String(o.cong_trinh || ''), ngay: chuanNgay(o.ngay) || homNay(), kl_tan: kl, sl_chi_tiet: isFinite(so(o.sl_chi_tiet)) ? so(o.sl_chi_tiet) : '', ghi_chu: String(o.ghi_chu || '').trim(),
          vuot_xuong: vuot ? 'CO' : '', trang_thai: 'HIEU_LUC', ly_do_huy: '', nguoi: tenNguoi(), luc: homNay() + ' ' + gioPhut() };
        S.xn.push(x); ghiNK('QC xác nhận khối lượng', 'XAC_NHAN_KL', x.ma_xn, '', x.lsx + ' · ' + fmt(kl, 2) + ' tấn' + (vuot ? ' · VƯỢT số xưởng báo đã cắt (' + fmt(cat, 2) + ' tấn)' : ''));
        return sao({ xn: x, tong_xn: da + kl, canh: vuot ? 'Đã ghi. Lưu ý: tổng QC xác nhận (' + fmt(da + kl, 2) + ' tấn) đang LỚN HƠN số xưởng báo đã cắt (' + fmt(cat, 2) + ' tấn).' : '' });
      });
    },
    huyXacNhanKL: function (ma, lyDo) {
      return goi(function () {
        canVai(['QC', 'QUAN_LY'], 'huỷ xác nhận khối lượng');
        var x = (S.xn || []).filter(function (y) { return y.ma_xn === ma; })[0]; if (!x) loi('Không thấy ' + ma); if (x.trang_thai === 'HUY') loi('Đã huỷ rồi.');
        if (!String(lyDo || '').trim()) loi('Cần ghi lý do huỷ.');
        x.trang_thai = 'HUY'; x.ly_do_huy = String(lyDo).trim(); ghiNK('Huỷ xác nhận khối lượng', 'XAC_NHAN_KL', ma, fmt(x.kl_tan, 2) + ' tấn', 'HUY · ' + x.ly_do_huy); return sao(x);
      });
    },
    /* HIỆN TRƯỜNG 1 NGÀY: xưởng ra bài gì, QC đã kiểm bao nhiêu, còn tồn chưa kiểm (7 ngày), lỗi chưa đóng, khối lượng QC xác nhận */
    hienTruong: function (ngay) {
      return goi(function () {
        ngay = chuanNgay(ngay) || homNay(); var d = new Date(ngay + 'T00:00:00'); d.setDate(d.getDate() - 6); var tu = isoNgay(d), daNT = {}, s0 = function (v) { var k = so(v); return isFinite(k) ? k : 0; };
        S.phieu.forEach(function (p) { if (p.trang_thai !== 'HUY') daNT[chuanHeat(p.ma_chi_tiet)] = p.ma_phieu; });
        (S.kn || []).forEach(function (x) { var k2 = chuanHeat(x.ma_chi_tiet); if (x.kq === 'DAT' && !daNT[k2]) daNT[k2] = x.ma_kn; });
        var cat = (S.ah1_cat || []).map(function (x) { return { ten_chi_tiet: x.ten_chi_tiet, lsx: x.lsx, cong_trinh: x.cong_trinh || '', may: x.may || '', ngay: chuanNgay(x.ngay_ra_bai), kl: s0(x.kl_tong) / 1000, sl_tong: x.sl_tong || '', du_an: duAnTheoTenAH1(x.cong_trinh), ma_phieu: daNT[chuanHeat(x.ten_chi_tiet)] || '', ngay_ra_bai: x.ngay_ra_bai, ca: x.ca || '', giao_dvgc: x.giao_dvgc || '' }; })
          .filter(function (x) { return x.ten_chi_tiet && x.ngay >= tu && x.ngay <= ngay && (!daChon || !x.du_an || x.du_an === daChon); });
        var hn = cat.filter(function (x) { return x.ngay === ngay; }), ton = cat.filter(function (x) { return !x.ma_phieu; }).sort(function (a, b) { return a.ngay < b.ngay ? -1 : a.ngay > b.ngay ? 1 : 0; });
        var ph = S.phieu.map(ganDA).filter(function (p) { return p.ngay === ngay && p.trang_thai !== 'HUY' && theoDA(p.du_an); }), theoQC = {}, mCT = {}, ctr = [];
        ph.forEach(function (p) { var k = p.nguoi_qc || '(chưa ghi)'; theoQC[k] = theoQC[k] || { nguoi: k, phieu: 0, dat: 0 }; theoQC[k].phieu++; if (p.trang_thai === 'DAT') theoQC[k].dat++; });
        hn.forEach(function (x) { var k = x.cong_trinh || '(chưa ghi công trình)', g = mCT[k]; if (!g) { g = mCT[k] = { cong_trinh: k, luot: 0, tan: 0, da_kiem: 0 }; ctr.push(g); } g.luot++; g.tan += x.kl; if (x.ma_phieu) g.da_kiem++; });
        var pu = S.punch.map(ganDA).filter(function (u) { return u.trang_thai !== 'DA_DONG' && theoDA(u.du_an); }), xn = (S.xn || []).filter(function (x) { return x.trang_thai !== 'HUY' && x.ngay === ngay; });
        return sao({ ngay: ngay, tu: tu, ra_bai: { luot: hn.length, tan: hn.reduce(function (s, x) { return s + x.kl; }, 0), da_kiem: hn.filter(function (x) { return x.ma_phieu; }).length },
          ton: { so: ton.length, ds: ton.slice(0, 60) }, phieu: { so: ph.length, dat: ph.filter(function (p) { return p.trang_thai === 'DAT'; }).length, cho_punch: ph.filter(function (p) { return p.trang_thai === 'CHO_DONG_PUNCH'; }).length },
          theo_qc: Object.keys(theoQC).map(function (k) { return theoQC[k]; }), theo_ct: ctr.sort(function (a, b) { return b.tan - a.tan; }),
          punch: { mo: pu.length, qua_han: pu.filter(function (u) { return u.han && u.han < homNay(); }).length }, xn: { so: xn.length, tan: xn.reduce(function (s, x) { return s + s0(x.kl_tan); }, 0) },
          kn: (function () { var k3 = (S.kn || []).filter(function (x) { return x.kq !== 'HUY' && x.ngay === ngay; }); return { so: k3.length, dat: k3.filter(function (x) { return x.kq === 'DAT'; }).length, loi: k3.filter(function (x) { return x.kq === 'KHONG_DAT'; }).length, ngoai_lenh: k3.filter(function (x) { return x.ngoai_lenh === 'CO'; }).length }; })() });
      });
    },
    /* KẾ HOẠCH GIA CÔNG XƯỞNG: các lệnh sản xuất có khoảng Bắt đầu–Kết thúc giao với tháng 'YYYY-MM' (sổ "Kế hoạch cắt theo lệnh", TẤN).
       tt: TRE (sổ ghi Trễ, hoặc quá ngày kết thúc mà còn tồn) · DANG · SAP (chưa tới ngày bắt đầu) · XONG (tồn = 0) */
    keHoachXuong: function (thang) {
      return goi(function () {
        if (!/^\d{4}-\d{2}$/.test(String(thang || ''))) thang = homNay().slice(0, 7);
        var t0 = thang + '-01', t1 = thang + '-31', hn = homNay(), s0 = function (v) { var k = so(v); return isFinite(k) ? k : 0; };
        var ds = (S.ah1_lsx || []).map(function (x) {
          var a = chuanNgay(x.bat_dau), b = chuanNgay(x.ket_thuc), tong = s0(x.tong_kl), cat = s0(x.da_cat), ton = s0(x.con_lai);
          var tt = ton <= 0.005 && tong > 0 ? 'XONG' : (String(x.canh_bao_tre || '').indexOf('Trễ') >= 0 || (b && b < hn && ton > 0.005)) ? 'TRE' : (a && a > hn) ? 'SAP' : 'DANG';
          return { lsx: x.lsx, zone: x.zone || '', hang_muc: x.hang_muc || '', dvgc: x.dvgc || '', ma_da: x.ma_da || '', cong_trinh: x.du_an || '', du_an: duAnTheoTenAH1(x.du_an), tong: tong, da_cat: cat, ton: ton, bat_dau: a, ket_thuc: b, tt: tt, xn: klXacNhan(x.lsx),
            tre_ngay: tt === 'TRE' && b && b < hn ? soNgay(b, hn) : 0 };
        }).filter(function (x) { return x.lsx && x.bat_dau && x.ket_thuc && x.bat_dau <= t1 && x.ket_thuc >= t0 && (!daChon || !x.du_an || x.du_an === daChon); });
        var thuTu = { TRE: 0, DANG: 1, SAP: 2, XONG: 3 };
        ds.sort(function (a, b) { return thuTu[a.tt] - thuTu[b.tt] || (a.ket_thuc < b.ket_thuc ? -1 : a.ket_thuc > b.ket_thuc ? 1 : 0) || b.ton - a.ton; });
        var tg = { so: ds.length, tong: 0, da_cat: 0, ton: 0, xn: 0, TRE: 0, DANG: 0, SAP: 0, XONG: 0 }, mDA = {}, da = [];
        ds.forEach(function (x) { tg.tong += x.tong; tg.da_cat += x.da_cat; tg.ton += x.ton; tg.xn += x.xn; tg[x.tt]++;
          var k = x.cong_trinh || '(chưa ghi công trình)', g = mDA[k]; if (!g) { g = mDA[k] = { cong_trinh: k, du_an: x.du_an, so: 0, tong: 0, da_cat: 0, ton: 0, xn: 0, TRE: 0, DANG: 0, SAP: 0, XONG: 0, so_yc: dsYeuCauCua(k).length }; da.push(g); }
          g.so++; g.tong += x.tong; g.da_cat += x.da_cat; g.ton += x.ton; g.xn += x.xn; g[x.tt]++; });
        da.sort(function (a, b) { return b.ton - a.ton || b.tong - a.tong; });
        return sao({ thang: thang, ds: ds, tong: tg, da: da });
      });
    },
    /* 1 lệnh SX: thông tin lệnh + các lượt cắt xưởng đã ghi, đánh dấu chi tiết đã có phiếu sơ chế → nghiệm thu ngay từ đây */
    chiTietLSX: function (lsx) {
      return goi(function () {
        var kl = chuanHeat(lsx).replace(/-/g, '_'), daNT = {}; S.phieu.forEach(function (p) { if (p.trang_thai !== 'HUY') daNT[chuanHeat(p.ma_chi_tiet)] = p.ma_phieu; });
        var l = (S.ah1_lsx || []).filter(function (x) { return x.k_lsx === kl; })[0] || null, m = {}, ds = [];
        /* 1) danh mục chi tiết của lệnh (sổ "CHI TIẾT AH1") */
        (S.ah1_ct || []).filter(function (x) { return x.k_lsx === kl && x.ten_chi_tiet; }).forEach(function (x) {
          var k = chuanHeat(x.ten_chi_tiet); if (m[k]) return;
          m[k] = { ten_chi_tiet: x.ten_chi_tiet, lsx: x.lsx, code: x.code || '', cau_kien: x.cau_kien || '', quy_cach: [x.day, x.rong1, x.dai].filter(Boolean).join('×') || x.qui_cach || '', mac_thep: x.mac_thep || '', sl_tong: x.sl || '',
            may: x.may_cat || '', cong_trinh: x.du_an || '', ngay_ra_bai: '', ngay: '', ca: '', moi_nt: '', giao_dvgc: x.dvgc || '', phieu_ban_giao: '', da_cat: false }; ds.push(m[k]);
        });
        /* 2) ghép lượt cắt xưởng đã ghi (sổ "NHẬP LIỆU"): lấy lượt mới nhất của mỗi chi tiết */
        (S.ah1_cat || []).filter(function (x) { return x.k_lsx === kl && x.ten_chi_tiet; }).forEach(function (x) {
          var k = chuanHeat(x.ten_chi_tiet), n = chuanNgay(x.ngay_ra_bai), o = m[k];
          if (!o) { o = m[k] = { ten_chi_tiet: x.ten_chi_tiet, lsx: x.lsx, code: '', cau_kien: '', quy_cach: [x.day, x.rong1, x.dai].filter(Boolean).join('×'), mac_thep: '', sl_tong: x.sl_tong || '', may: '', cong_trinh: x.cong_trinh || '', ngay: '', da_cat: false }; ds.push(o); }
          if (!o.da_cat || n > o.ngay) { o.da_cat = true; o.ngay = n; o.ngay_ra_bai = x.ngay_ra_bai; o.ca = x.ca || ''; o.may = x.may || o.may; o.moi_nt = chuanNgay(x.moi_nghiem_thu); o.giao_dvgc = x.giao_dvgc || o.giao_dvgc || ''; o.phieu_ban_giao = x.phieu_ban_giao || ''; if (x.sl_tong) o.sl_tong = x.sl_tong; if (!o.cong_trinh) o.cong_trinh = x.cong_trinh || ''; }
        });
        var knDat = {}, knLoi = {}; (S.kn || []).forEach(function (x) { if (x.kq === 'HUY' || chuanHeat(x.lsx).replace(/-/g, '_') !== kl) return; (x.kq === 'DAT' ? knDat : knLoi)[chuanHeat(x.ma_chi_tiet)] = x; });
        ds.forEach(function (o) { var k2 = chuanHeat(o.ten_chi_tiet); o.du_an = duAnTheoTenAH1(o.cong_trinh); o.ma_phieu = daNT[k2] || ''; var d2 = knDat[k2]; o.kn = d2 ? 'DAT' : knLoi[k2] ? 'KHONG_DAT' : ''; o.kn_luc = d2 ? d2.luc + ' · ' + d2.nguoi : ''; });
        /* việc cần làm lên trước: đã cắt chưa có phiếu → chưa cắt → đã có phiếu */
        function hang(o) { return o.ma_phieu || o.kn === 'DAT' ? 2 : o.da_cat ? 0 : 1; }
        ds.sort(function (a, b) { return hang(a) - hang(b) || (a.ngay < b.ngay ? 1 : a.ngay > b.ngay ? -1 : 0) || String(a.ten_chi_tiet).localeCompare(String(b.ten_chi_tiet)); });
        var ctr = (l && l.du_an) || (ds[0] && ds[0].cong_trinh) || '', xn = (S.xn || []).filter(function (x) { return chuanHeat(x.lsx).replace(/-/g, '_') === kl; }).sort(function (a, b) { return a.luc < b.luc ? 1 : -1; });
        return sao({ lsx: l, cong_trinh: ctr, cat: ds.slice(0, 300), tong: ds.length, da_cat: ds.filter(function (x) { return x.da_cat; }).length, da_nt: ds.filter(function (x) { return x.ma_phieu; }).length,
          yc: dsYeuCauCua(ctr), xn: xn, tong_xn: klXacNhan(lsx) });
      });
    },
    dsSDC: function () { return goi(function () { return sao(S.sdc.filter(function (d) { return theoDA(d.du_an); }).sort(function (a, b) { return a.ngay_cat < b.ngay_cat ? 1 : -1; })); }); },
    sdcTheoPart: function (part) { return goi(function () { return sao(sdcCuaPart(part)); }); },
    hoSoSDC: function (ma) {
      return goi(function () {
        var d = S.sdc.filter(function (x) { return x.ma_sdc === ma; })[0]; if (!d) loi('Không thấy sơ đồ cắt ' + ma);
        var hp = {}; return sao({ sdc: d, tam: tamSDC(d).map(function (t) { return timVT(t.ma_vt); }).filter(Boolean),
          dong: d.dong.map(function (x) { var ph = S.phieu.filter(function (p) { return chuanHeat(p.ma_chi_tiet) === chuanHeat(x.part); }), hp2 = hp[x.part] || (hp[x.part] = heatCuaPart(x.part));
            return { part: x.part, ma_vt: x.ma_vt, so_heat: x.so_heat, quy_cach: x.quy_cach, sl: x.sl, so_phieu: ph.length, lech: ph.filter(function (p) { return !hp2[p.ma_vt]; }).length, dat: ph.filter(function (p) { return p.trang_thai === 'DAT'; }).length }; }) });
      });
    },
    kiemSoat: function () {
      return goi(function () {
        var t = homNay(), VT = S.vt.filter(function (v) { return theoDA(v.du_an); }), PH = S.phieu.filter(function (p) { return theoDA(p.du_an) && p.trang_thai !== 'HUY'; }),
          PU = S.punch.map(ganDA).filter(function (u) { return theoDA(u.du_an); }), KH = S.ke_hoach.filter(function (k) { return theoDA(k.du_an); }), ds = [];
        function nhom(id, ten, muc, giai, items) { ds.push({ id: id, ten: ten, muc: muc, giai: giai, items: items }); }
        nhom('PH_VT_KHONG_DAT', 'Phiếu sơ chế dùng vật tư KHÔNG còn ở trạng thái Đạt', 'cao', 'Vật tư bị đổi trạng thái sau khi đã sơ chế. Kiểm tra lại chi tiết đã làm.',
          PH.filter(function (p) { var v = timVT(p.ma_vt); return v && v.trang_thai !== 'DAT'; }).map(function (p) { var v = timVT(p.ma_vt); return { loai: 'PHIEU', ma: p.ma_phieu, mo_ta: p.ma_phieu + ' · ' + p.ma_chi_tiet + ' · heat ' + v.so_heat + ' đang "' + TT.VT[v.trang_thai][0] + '"' }; }));
        var SD = S.sdc.filter(function (d) { return theoDA(d.du_an); });
        nhom('SDC_VT_KHONG_DAT', 'Sơ đồ cắt dùng vật tư KHÔNG ở trạng thái Đạt', 'cao', 'Dừng cắt / kiểm tra part đã cắt từ tấm này.',
          [].concat.apply([], SD.map(function (d) { return tamSDC(d).map(function (t) { return { d: d, v: timVT(t.ma_vt) }; }).filter(function (x) { return x.v && x.v.trang_thai !== 'DAT'; }); }))
            .map(function (x) { return { loai: 'SDC', ma: x.d.ma_sdc, mo_ta: x.d.ma_sdc + ' · heat ' + x.v.so_heat + ' đang "' + TT.VT[x.v.trang_thai][0] + '" · ' + x.d.dong.filter(function (y) { return y.ma_vt === x.v.ma_vt; }).map(function (y) { return y.part + ' ×' + y.sl; }).join(', ') }; }));
        var lech = [];
        PH.forEach(function (p) { var hp = heatCuaPart(p.ma_chi_tiet), ks = Object.keys(hp); if (ks.length && !hp[p.ma_vt]) lech.push({ loai: 'CT', ma: p.ma_chi_tiet, mo_ta: p.ma_phieu + ' · part ' + p.ma_chi_tiet + ' · phiếu ghi heat ' + p.so_heat + ', SDC chỉ có heat ' + ks.map(function (m) { return hp[m]; }).join(' / ') }); });
        nhom('PH_LECH_SDC', 'Phiếu sơ chế ghi heat khác heat trong sơ đồ cắt', 'cao', 'Xác nhận part được cắt từ tấm nào; sửa phiếu hoặc SDC.', lech);
        var ctPH = {}; PH.forEach(function (p) { ctPH[chuanHeat(p.ma_chi_tiet)] = 1; });
        nhom('PART_CHUA_SDC', 'Part đã nghiệm thu sơ chế nhưng chưa có sơ đồ cắt', 'tb', 'Nạp sơ đồ cắt để truy được part về tấm / heat.',
          Object.keys(PH.reduce(function (o2, p) { if (!sdcCuaPart(p.ma_chi_tiet).length) o2[p.ma_chi_tiet] = 1; return o2; }, {})).map(function (c) { return { loai: 'CT', ma: c, mo_ta: 'Part ' + c }; }));
        nhom('PU_QH', 'Punch quá hạn chưa đóng', 'cao', 'Đốc thúc tổ chịu trách nhiệm hoặc QC đóng nếu đã sửa.',
          PU.filter(quaHan).map(function (u) { return { loai: 'PHIEU', ma: u.ma_phieu, mo_ta: u.ma_punch + ' · ' + u.to + ' · quá ' + soNgay(u.han, t) + ' ngày · ' + u.mo_ta }; }));
        nhom('KH_TRE', 'Kế hoạch nghiệm thu trễ', 'cao', 'Nghiệm thu bù hoặc Quản lý QC huỷ kèm lý do.',
          KH.filter(function (k) { return ttKH(k) === 'TRE'; }).map(function (k) { return { loai: 'CT', ma: k.ma_chi_tiet, mo_ta: k.ma_kh + ' · ' + hienNgay(k.ngay) + ' · ' + k.xuong + ' · ' + (congDoan(k.cong_doan) || {}).ten + ' · ' + k.ma_chi_tiet }; }));
        var ctHeat = {}; PH.forEach(function (p) { (ctHeat[p.ma_chi_tiet] = ctHeat[p.ma_chi_tiet] || {})[p.ma_vt] = 1; });
        nhom('CT_NHIEU_HEAT', 'Part ghi nhận từ 2 heat nhưng chưa có sơ đồ cắt để đối chiếu', 'cao', 'Nạp sơ đồ cắt của part để xác nhận các heat.',
          Object.keys(ctHeat).filter(function (c) { return Object.keys(ctHeat[c]).length > 1 && !dongCuaPart(c).length; }).map(function (c) { return { loai: 'CT', ma: c, mo_ta: c + ' · ' + Object.keys(ctHeat[c]).map(function (m) { return (timVT(m) || {}).so_heat; }).join(' / ') }; }));
        nhom('VT_THIEU_MTC', 'Vật tư chưa có số MTC', 'tb', 'Bổ sung chứng chỉ trước khi cho sơ chế.',
          VT.filter(function (v) { return laTrong(v.so_mtc) && !S.chung_chi.some(function (c) { return c.ma_vt === v.ma_vt && c.loai === 'MTC'; }); }).map(function (v) { return { loai: 'VT', ma: v.ma_vt, mo_ta: v.so_heat + ' · ' + v.quy_cach + ' · ' + tenDuAn(v.du_an) + ' · ' + TT.VT[v.trang_thai][0] }; }));
        nhom('VT_CHO_LAU', 'Vật tư về quá 3 ngày chưa nghiệm thu xong', 'tb', 'QC vật tư nghiệm thu hoặc ghi lý do chờ.',
          VT.filter(function (v) { return (v.trang_thai === 'CHUA_NT' || v.trang_thai === 'CHO_BO_SUNG') && v.ngay_ve && soNgay(v.ngay_ve, t) > 3; }).map(function (v) { return { loai: 'VT', ma: v.ma_vt, mo_ta: v.so_heat + ' · ' + v.quy_cach + ' · về ' + hienNgay(v.ngay_ve) + ' (' + soNgay(v.ngay_ve, t) + ' ngày) · ' + TT.VT[v.trang_thai][0] }; }));
        nhom('PU_CHO_QC', 'Punch tổ đã sửa, QC chưa đóng', 'tb', 'QC kiểm lại và đóng / mở lại.',
          PU.filter(function (u) { return u.trang_thai === 'DA_SUA'; }).map(function (u) { return { loai: 'PHIEU', ma: u.ma_phieu, mo_ta: u.ma_punch + ' · ' + u.to + ' · ' + u.mo_ta }; }));
        nhom('PH_THIEU_ANH', 'Phiếu có hạng mục không đạt nhưng không có ảnh', 'tb', 'Bổ sung ảnh lỗi làm bằng chứng.',
          PH.filter(function (p) { if (phieuDatLanDau(p) || (p.anh && p.anh.length)) return false; return !S.punch.some(function (u) { return u.ma_phieu === p.ma_phieu && (u.anh_truoc.length || u.anh_sau.length); }); })
            .map(function (p) { return { loai: 'PHIEU', ma: p.ma_phieu, mo_ta: p.ma_phieu + ' · ' + hienNgay(p.ngay) + ' · ' + p.ma_chi_tiet }; }));
        nhom('PH_THIEU_BV', 'Phiếu thiếu số bản vẽ hoặc rev', 'tb', 'Bổ sung để đối chiếu đúng bản vẽ đang dùng.',
          PH.filter(function (p) { return !p.ban_ve || !p.rev; }).map(function (p) { return { loai: 'PHIEU', ma: p.ma_phieu, mo_ta: p.ma_phieu + ' · ' + p.ma_chi_tiet + ' · ' + (!p.ban_ve ? 'thiếu bản vẽ' : 'thiếu rev') }; }));
        return { ds: ds, tong: ds.reduce(function (n, g) { return n + g.items.length; }, 0), cao: ds.filter(function (g) { return g.muc === 'cao'; }).reduce(function (n, g) { return n + g.items.length; }, 0) };
      });
    },
    /* TRUY XUẤT — chỉ đọc. q = heat no / mã VT / MTC / MIR / mã chi tiết / mã phiếu / mã punch / mã kế hoạch */
    truyXuat: function (q) {
      return goi(function () {
        var k = chuanHeat(q), kq = []; if (!k) return kq;
        var VT = S.vt.filter(function (v) { return theoDA(v.du_an); }), PH = S.phieu.filter(function (p) { return theoDA(p.du_an); });
        PH.forEach(function (p) { if (p.ma_phieu === k) kq.push({ loai: 'PHIEU', ma: p.ma_phieu, nhan: 'Phiếu sơ chế ' + p.ma_phieu, phu: hienNgay(p.ngay) + ' · ' + (congDoan(p.cong_doan) || {}).ten + ' · ' + p.ma_chi_tiet + ' · ' + tenDuAn(p.du_an) }); });
        S.punch.forEach(function (u) { if (u.ma_punch === k) { var ph = timPhieu(u.ma_phieu); if (ph && theoDA(ph.du_an)) kq.push({ loai: 'PHIEU', ma: u.ma_phieu, nhan: 'Punch ' + u.ma_punch + ' → phiếu ' + u.ma_phieu, phu: u.mo_ta }); } });
        S.ke_hoach.forEach(function (x) { if (x.ma_kh === k && theoDA(x.du_an)) kq.push({ loai: 'CT', ma: x.ma_chi_tiet, nhan: 'Kế hoạch ' + x.ma_kh + ' → chi tiết ' + x.ma_chi_tiet, phu: hienNgay(x.ngay) + ' · ' + TT.KH[ttKH(x)][0] }); });
        var mir = {}; VT.forEach(function (v) { if (v.so_mir && chuanHeat(v.so_mir) === k) mir[v.so_mir] = (mir[v.so_mir] || 0) + 1; });
        Object.keys(mir).forEach(function (m) { kq.push({ loai: 'MIR', ma: m, nhan: 'Lô nhập / MIR ' + m, phu: mir[m] + ' vật tư' }); });
        var vtKhop = VT.filter(function (v) { return chuanHeat(v.so_heat) === k || v.ma_vt.toUpperCase() === k || (v.so_mtc && chuanHeat(v.so_mtc) === k); });
        if (!vtKhop.length && k.length >= 3) vtKhop = VT.filter(function (v) { return chuanHeat(v.so_heat).indexOf(k) >= 0; });
        vtKhop.forEach(function (v) { kq.push({ loai: 'VT', ma: v.ma_vt, nhan: 'Heat ' + v.so_heat + ' · ' + v.quy_cach, phu: v.mac_thep + ' · ' + tenDuAn(v.du_an) + ' · ' + TT.VT[v.trang_thai][0], tt: v.trang_thai }); });
        S.sdc.forEach(function (d) { if (theoDA(d.du_an) && chuanHeat(d.ma_sdc) === k) { var tm = tamSDC(d); kq.push({ loai: 'SDC', ma: d.ma_sdc, nhan: 'Sơ đồ cắt ' + d.ma_sdc, phu: tm.length + ' heat (' + tm.map(function (t) { return t.so_heat; }).join(', ') + ') · ' + partSDC(d).length + ' part · cắt ' + hienNgay(d.ngay_cat) }); } });
        var ct = {}; PH.forEach(function (p) { ct[p.ma_chi_tiet] = 1; }); S.ke_hoach.forEach(function (x) { if (theoDA(x.du_an)) ct[x.ma_chi_tiet] = 1; });
        S.sdc.forEach(function (d) { if (theoDA(d.du_an)) d.dong.forEach(function (x) { ct[x.part] = 1; }); });
        Object.keys(ct).filter(function (c) { var u = chuanHeat(c); return u === k || (k.length >= 3 && u.indexOf(k) >= 0); }).forEach(function (c) {
          var n = PH.filter(function (p) { return p.ma_chi_tiet === c; }).length, sd = sdcCuaPart(c), hp = heatCuaPart(c); if (!kq.some(function (x) { return x.loai === 'CT' && x.ma === c; })) kq.push({ loai: 'CT', ma: c, nhan: 'Part mark ' + c, phu: (sd.length ? 'Heat ' + Object.keys(hp).map(function (m) { return hp[m]; }).join(' / ') + ' · SDC ' + sd.map(function (d) { return d.ma_sdc; }).join(', ') + ' · ' : 'Chưa có sơ đồ cắt · ') + n + ' phiếu sơ chế' });
        });
        return kq.slice(0, 30);
      });
    },
    hoSoVatTu: function (ma) {
      return goi(function () {
        var v = timVT(ma); if (!v) loi('Không thấy vật tư ' + ma);
        var chungChi = S.chung_chi.filter(function (c) { return c.ma_vt === ma; });
        var ph = S.phieu.filter(function (p) { return p.ma_vt === ma; }).sort(function (a, b) { return a.ngay < b.ngay ? -1 : 1; });
        var mp = {}; ph.forEach(function (p) { mp[p.ma_phieu] = 1; });
        var lan = S.lan_nap.filter(function (l) { return l.ma_lan === v.ma_lan; })[0] || null;
        return sao({ chung_chi: chungChi, sdc: S.sdc.filter(function (d) { return d.dong.some(function (x) { return x.ma_vt === ma; }); }).map(function (d) { return { ma_sdc: d.ma_sdc, ngay_cat: d.ngay_cat, may: d.may, xuong: d.xuong, so_tam: tamSDC(d).length, dong: d.dong.filter(function (x) { return x.ma_vt === ma; }) }; }), vt: v, lan: lan, cungLo: v.so_mir ? S.vt.filter(function (x) { return x.so_mir === v.so_mir && x.ma_vt !== ma; }) : [],
          phieu: ph.map(function (p) { var x = Object.assign({}, p); x.dat1 = phieuDatLanDau(p); x.punch_mo = S.punch.filter(function (u) { return u.ma_phieu === p.ma_phieu && u.trang_thai !== 'DA_DONG'; }).length; return x; }),
          punch: S.punch.filter(function (u) { return mp[u.ma_phieu]; }), chiTiet: Object.keys(ph.reduce(function (o2, p) { o2[p.ma_chi_tiet] = 1; return o2; }, {})),
          nhatKy: S.nhat_ky.filter(function (n) { return n.ma === ma || n.ma === v.ma_lan; }) });
      });
    },
    hoSoChiTiet: function (ma) {
      return goi(function () {
        var ph = S.phieu.filter(function (p) { return p.ma_chi_tiet === ma && theoDA(p.du_an); }).sort(function (a, b) { return a.ngay < b.ngay ? -1 : a.ngay > b.ngay ? 1 : a.ma_phieu < b.ma_phieu ? -1 : 1; });
        var kh = S.ke_hoach.filter(function (x) { return x.ma_chi_tiet === ma && theoDA(x.du_an); }).map(function (x) { var y = Object.assign({}, x); y.tt = ttKH(x); return y; });
        var sd = sdcCuaPart(ma).filter(function (d) { return theoDA(d.du_an); });
        if (!ph.length && !kh.length && !sd.length) loi('Không thấy part mark ' + ma);
        var dc = dongCuaPart(ma).filter(function (x) { return theoDA(x.du_an); });
        var heat = {}; ph.forEach(function (p) { heat[p.ma_vt] = timVT(p.ma_vt); }); dc.forEach(function (x) { heat[x.ma_vt] = timVT(x.ma_vt); });
        var vtSDC = {}; dc.forEach(function (x) { vtSDC[x.ma_vt] = 1; });
        var lechSDC = sd.length ? ph.filter(function (p) { return !vtSDC[p.ma_vt]; }).map(function (p) { return p.ma_phieu; }) : [];
        var mp = {}; ph.forEach(function (p) { mp[p.ma_phieu] = 1; });
        var daQua = {}; ph.forEach(function (p) { daQua[p.cong_doan] = daQua[p.cong_doan] || (p.trang_thai === 'DAT' ? 'DAT' : 'CHO'); if (p.trang_thai === 'DAT') daQua[p.cong_doan] = 'DAT'; });
        var duAn = (ph[0] || kh[0] || sd[0]).du_an;
        return sao({ ma: ma, du_an: duAn, phieu: ph.map(function (p) { var x = Object.assign({}, p); x.dat1 = phieuDatLanDau(p); x.punch = S.punch.filter(function (u) { return u.ma_phieu === p.ma_phieu; }); return x; }),
          vatTu: Object.keys(heat).map(function (m) { return heat[m]; }).filter(Boolean), canhBaoHeat: lechSDC.length > 0 || (!dc.length && Object.keys(heat).length > 1),
          sdc: dc, slCat: dc.reduce(function (n, x) { return n + (Number(x.sl) || 0); }, 0), lechSDC: lechSDC,
          keHoach: kh, congDoan: CONG_DOAN.map(function (c) { return { ma: c.ma, ten: c.ten, tt: daQua[c.ma] || '' }; }),
          punchMo: S.punch.filter(function (u) { return mp[u.ma_phieu] && u.trang_thai !== 'DA_DONG'; }).length });
      });
    },
    hoSoMIR: function (mir) {
      return goi(function () {
        var ds = S.vt.filter(function (v) { return v.so_mir === mir && theoDA(v.du_an); }); if (!ds.length) loi('Không thấy MIR ' + mir);
        return sao({ mir: mir, ncc: ds[0].ncc, ngay_ve: ds[0].ngay_ve, du_an: ds[0].du_an, vt: ds.map(function (v) { var x = Object.assign({}, v); x.so_phieu = S.phieu.filter(function (p) { return p.ma_vt === v.ma_vt; }).length; return x; }) });
      });
    },
    hoSoPhieu: function (ma) {
      return goi(function () { var p = timPhieu(ma); if (!p) loi('Không thấy phiếu ' + ma); return sao({ phieu: p, punch: S.punch.filter(function (x) { return x.ma_phieu === ma; }), vt: timVT(p.ma_vt), kh: p.ma_kh ? timKH(p.ma_kh) : null, nhatKy: S.nhat_ky.filter(function (n) { return n.ma === ma; }) }); });
    },
    tongQuan: function () {
      return goi(function () {
        var t = homNay(), r = {}, VT = S.vt.filter(function (v) { return theoDA(v.du_an); }), PH = S.phieu.filter(function (p) { return theoDA(p.du_an); }),
          PU = S.punch.map(ganDA).filter(function (u) { return theoDA(u.du_an); });
        r.duAn = daChon ? sao(layDuAn(daChon)) : null;
        r.vt = { DAT: 0, CHUA_NT: 0, CHO_BO_SUNG: 0, KHONG_DAT: 0, tanDat: 0 };
        VT.forEach(function (v) { r.vt[v.trang_thai]++; if (v.trang_thai === 'DAT' && isFinite(v.khoi_luong_tan)) r.vt.tanDat += Number(v.khoi_luong_tan) || 0; });
        r.phieuHomNay = PH.filter(function (p) { return p.ngay === t; }).length;
        r.phieu7 = PH.filter(function (p) { return soNgay(p.ngay, t) <= 6; }).length;
        r.phieuCho = PH.filter(function (p) { return p.trang_thai === 'CHO_DONG_PUNCH'; }).length;
        r.phieuDat = PH.filter(function (p) { return p.trang_thai === 'DAT'; }).length;
        r.punchMo = PU.filter(function (p) { return p.trang_thai === 'MO'; }).length;
        r.punchSua = PU.filter(function (p) { return p.trang_thai === 'DA_SUA'; }).length;
        r.punchQuaHan = PU.filter(quaHan).length;
        r.theoTo = TO.map(function (to) { var ds = PU.filter(function (p) { return p.to === to; }); return { to: to, mo: ds.filter(function (p) { return p.trang_thai === 'MO'; }).length, sua: ds.filter(function (p) { return p.trang_thai === 'DA_SUA'; }).length, qh: ds.filter(quaHan).length, dong: ds.filter(function (p) { return p.trang_thai === 'DA_DONG'; }).length }; });
        r.theoXuong = XUONG.map(function (x) { var o = { xuong: x, tong: 0 }; CONG_DOAN.forEach(function (c) { o[c.ma] = PH.filter(function (p) { return p.xuong === x && p.cong_doan === c.ma; }).length; o.tong += o[c.ma]; }); return o; });
        r.gap = sao(PU.filter(function (p) { return quaHan(p) || (p.muc_do === 'A' && p.trang_thai !== 'DA_DONG'); }));
        r.nhatKy = sao(S.nhat_ky.slice(-8).reverse());
        var KHd = S.ke_hoach.filter(function (k) { return theoDA(k.du_an); });
        r.khHomNay = KHd.filter(function (k) { return k.ngay === t && k.trang_thai !== 'HUY'; }).length;
        r.khHomNayXong = KHd.filter(function (k) { return k.ngay === t && k.trang_thai === 'XONG'; }).length;
        r.khTre = KHd.filter(function (k) { return ttKH(k) === 'TRE'; }).length;
        r.soDuAn = DU_AN.filter(function (d) { return d.trang_thai === 'DANG_CHAY'; }).length;
        return r;
      });
    }
  };

  var GHI = ['accNhanh', 'huyKiemNhanh', 'napTX', 'xoaLanNapTX', 'napVatTu', 'capNhatVatTu', 'luuPhieu', 'capNhatPunch', 'luuDuAn', 'luuKeHoach', 'huyKeHoach', 'napSDC', 'huyPhieu', 'moLaiPhieu', 'luuChungChi', 'dongBoTX', 'luuYeuCau', 'tatYeuCau', 'xacNhanKL', 'huyXacNhanKL', 'dungVatTuTX', 'taoPunch'];
  /* gửi 1 yêu cầu lên máy chủ, trả nguyên { kq, du_an } */
  function guiMayChu(ten, args) {
    if (NT_URL) return fetch(NT_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ ten: ten, args: args, daChon: daChon, dn: dangNhap() }), redirect: 'follow' })
      .then(function (r) { if (!r.ok) throw new Error('Máy chủ trả lỗi ' + r.status + '.'); return r.text(); }, function () { throw new Error('MAT_MANG: Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.'); })
      .then(function (t) { var j; try { j = JSON.parse(t); } catch (e) { throw new Error('Máy chủ chưa mở cho trang này (cần triển khai Web App quyền "Anyone").'); } if (j && j.loi) throw new Error(String(j.loi).replace(/^Error:\s*/, '')); return j; });
    return new Promise(function (ok, ko) {
      google.script.run.withSuccessHandler(ok)
        .withFailureHandler(function (e) { ko(new Error(e && e.message ? String(e.message).replace(/^Error:\s*/, '') : String(e))); })
        .apiGoi(ten, args, daChon, dangNhap());
    });
  }
  /* ĐỆM PHÍA TRÌNH DUYỆT (hiện ngay số lần trước, làm mới phía sau): chỉ cho các màn danh sách / tổng hợp; KHÔNG đệm truy xuất, hồ sơ, phân tích */
  var DEM_API = { bangDieuHanh: 1, dsKiemNhanh: 1, truyXuatTX: 1, goiYTX: 1, dsLanNapTX: 1, kiemTX: 1, duAnTX: 1, soKhoiLuong: 1, hienTruong: 1, dsYeuCau: 1, keHoachXuong: 1, khoiDong: 1, dsKeHoach: 1, tongQuan: 1, keHoachAH1: 1, tienDoCatAH1: 1, dsChoNT: 1, dsPhieu: 1, dsPunch: 1, dsVatTu: 1, dsDuAn: 1, dsLanNap: 1, kiemSoat: 1, baoCao: 1, dsSDC: 1, cauHinh: 1, trangThaiTX: 1 };
  var KHOA_DEM = 'nt_dem_v1|', DEM_TUOI = 8000, DEM_HAN = 12 * 3600e3, henMoi = null;
  function apRaw(r) { if (r && r.du_an) { DU_AN = r.du_an; S.du_an = DU_AN; } return r ? r.kq : r; }
  /* tatCa = true: đăng xuất / mất quyền → bỏ hết. Sau khi LƯU: chỉ bỏ số liệu danh sách, giữ phần người dùng + cấu hình (khoiDong) để lần sau mở vẫn vào được khi mạng yếu */
  function xoaDem(tatCa) { try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf(KHOA_DEM) === 0 && (tatCa || k.indexOf(KHOA_DEM + 'khoiDong|') !== 0)) localStorage.removeItem(k); }); } catch (e) {} }
  function baoMoi(ten, r) {
    if (ten === 'khoiDong' && r && r.kq && r.kq.nguoi) { vai = r.kq.nguoi.vai; tenND = r.kq.nguoi.ten || r.kq.nguoi.email; datCauHinh(r.kq.cau_hinh); }
    clearTimeout(henMoi); henMoi = setTimeout(function () { try { window.dispatchEvent(new CustomEvent('nt-du-lieu-moi', { detail: ten })); } catch (e) {} }, 200);
  }
  function loiNen(e) {
    var m = String(e && e.message || e);
    if (m.indexOf('CAN_DANG_NHAP') >= 0 || m.indexOf('chưa được cấp quyền') >= 0) { xoaDem(true); try { location.reload(); } catch (e2) {} return; }
    try { window.dispatchEvent(new CustomEvent('nt-mat-mang', { detail: m })); } catch (e3) {}
  }
  function goiMayChu(ten, args) {
    if (GHI.indexOf(ten) >= 0) return guiMayChu(ten, args).then(function (r) { xoaDem(); return apRaw(r); });
    if (!DEM_API[ten]) return guiMayChu(ten, args).then(apRaw);
    var k = KHOA_DEM + ten + '|' + daChon + '|' + ((dangNhap() || {}).email || '') + '|' + JSON.stringify(args), c = null;
    try { c = JSON.parse(ls(k) || 'null'); } catch (e) { c = null; }
    if (c && !(Date.now() - c.t < DEM_HAN)) c = null;
    function moi() { return guiMayChu(ten, args).then(function (r) { var j = JSON.stringify(r), khac = !!c && c.j !== j; if (j.length < 400000) ls(k, JSON.stringify({ t: Date.now(), j: j })); if (khac) baoMoi(ten, r); return r; }); }
    if (c) { if (Date.now() - c.t > DEM_TUOI) moi().catch(loiNen); return Promise.resolve(apRaw(JSON.parse(c.j))); }
    return moi().then(apRaw);
  }
  var API = API_GOC;
  if (CHE_DO === 'that') { API = {}; Object.keys(API_GOC).forEach(function (k) { API[k] = function () { return goiMayChu(k, Array.prototype.slice.call(arguments)); }; }); }
  /* đăng nhập bằng email + PIN khi máy chủ không đọc được email Google */
  var KHOA_DN = 'nt_dang_nhap_v1';
  function dangNhap() { try { return JSON.parse(ls(KHOA_DN) || 'null'); } catch (e) { return null; } }
  function hienDangNhap(thongBao) {
    return new Promise(function (ok) {
      var cu = document.getElementById('ntDangNhap'); if (cu) cu.remove();
      var d = dangNhap() || {}, o = document.createElement('div'); o.id = 'ntDangNhap';
      o.setAttribute('style', 'position:fixed;inset:0;z-index:100;background:rgba(10,15,25,.55);display:grid;place-items:center;padding:16px');
      o.innerHTML = '<form style="background:var(--panel,#fff);color:var(--fg,#142033);border-radius:12px;padding:22px;width:min(100%,380px);display:flex;flex-direction:column;gap:12px;box-shadow:0 12px 40px rgba(0,0,0,.3)" novalidate>' +
        '<div style="display:flex;gap:10px;align-items:center"><span style="display:grid;place-items:center;width:40px;height:40px;border-radius:8px;background:#E2231A;color:#fff;font:700 13px system-ui">DDC</span><b style="font-size:18px">QC Sơ chế An Hạ</b></div>' +
        '<p style="margin:0;font-size:14px">Đăng nhập bằng email công ty và mã PIN do Quản lý QC cấp (tab NGUOI_DUNG, cột ma_pin).</p>' +
        '<div><label for="dnEmail">Email công ty</label><input id="dnEmail" type="email" autocomplete="username" value="' + esc(d.email || '') + '" required></div>' +
        '<div><label for="dnPin">Mã PIN</label><input id="dnPin" type="password" inputmode="numeric" autocomplete="current-password" required></div>' +
        (thongBao ? '<p role="alert" style="margin:0;color:var(--bad,#b91c1c);font-weight:700">' + esc(thongBao) + '</p>' : '') +
        '<button type="submit" class="nb nb-pri nb-lon">Đăng nhập</button></form>';
      document.body.appendChild(o);
      var f = o.querySelector('form'); (d.email ? f.querySelector('#dnPin') : f.querySelector('#dnEmail')).focus();
      f.addEventListener('submit', function (e) { e.preventDefault(); var em = f.querySelector('#dnEmail').value.trim(), pin = f.querySelector('#dnPin').value.trim(); if (!em || !pin) return;
        ls(KHOA_DN, JSON.stringify({ email: em, pin: pin })); o.remove(); ok(); });
    });
  }
  function batDau(thongBao) {
    return goiMayChu('khoiDong', []).catch(function (e) {
      var m = String(e && e.message || e); if (m.indexOf('CAN_DANG_NHAP') < 0) throw e;
      var tb = m.replace(/^.*CAN_DANG_NHAP:\s*/, ''); if (!dangNhap() && /^Nhập email/.test(tb)) tb = '';
      return hienDangNhap(tb).then(function () { return batDau(); });
    });
  }
  function kiemGiaoDienMoi() {
    if (!NT_URL || typeof fetch === 'undefined') return;
    try { ls('nt_ui_ok', String(BAN_SO)); } catch (e) {}
    fetch(NT_URL + '?ui=1&so=' + BAN_SO, { redirect: 'follow' }).then(function (r) { return r.json(); }).then(function (g) {
      if (!g || !(g.so > BAN_SO) || !g.html) return;
      ls('nt_ui', JSON.stringify({ so: g.so, v: g.v, html: g.html, url: NT_URL }));
      try { window.dispatchEvent(new CustomEvent('nt-ban-moi', { detail: g.v })); } catch (e) {}
    }).catch(function () {});
  }
  var sanSang = CHE_DO !== 'that' ? Promise.resolve(null) : batDau().then(function (r) { try { kiemGiaoDienMoi(); } catch (e) {} return r; }).then(function (r) {
    vai = r.nguoi.vai; tenND = r.nguoi.ten || r.nguoi.email; datCauHinh(r.cau_hinh); return r;
  });
  /* ---------- khối hiển thị dùng chung ---------- */
  function htmlAnh(ds) {
    if (!ds || !ds.length) return '';
    return '<div class="nt-anh">' + ds.map(function (a) { return '<figure><img src="' + esc(a.thumb) + '" alt="' + esc(a.ten) + '"><figcaption>' + esc(a.luc || '') + '</figcaption></figure>'; }).join('') + '</div>';
  }
  function htmlKetQua(p) {
    var cd = congDoan(p.cong_doan);
    return '<table class="nt-kq"><thead><tr><th scope="col">Hạng mục</th><th scope="col">Cho phép</th><th scope="col">Bản vẽ</th><th scope="col">Thực đo</th><th scope="col">Kết quả</th></tr></thead><tbody>' +
      p.ket_qua.map(function (x) {
        var h = hangMuc(x.ma_hm) || { ten: x.ma_hm, kieu: 'so' };
        var td = h.kieu === 'mat' ? (x.td === 'DAT' ? 'Đạt' : 'Không đạt') : fmtSo(so(x.td)) + (h.dv ? ' ' + h.dv : '');
        return '<tr><td>' + esc(h.ten) + '</td><td>' + esc(moTaYeuCau(h)) + '</td><td class="num">' + (h.kieu === 'so' ? esc(fmtSo(so(x.yc))) : '—') + '</td><td class="num">' + esc(td) + '</td><td>' + pill('KQ', x.kq) + '</td></tr>';
      }).join('') + '</tbody></table>' + (cd ? '' : '');
  }
  function htmlPunch(p, nut) {
    var qh = quaHan(p) ? '<span class="pill p-b">' + ic('alert') + 'Quá hạn ' + soNgay(p.han, homNay()) + ' ngày</span>' : '';
    return '<article class="nt-punch" data-ma="' + esc(p.ma_punch) + '">' +
      '<header><b class="mono">' + esc(p.ma_punch) + '</b>' + pill('PUNCH', p.trang_thai) + '<span class="pill p-m' + esc(p.muc_do) + '">Mức ' + esc(MUC[p.muc_do] || p.muc_do) + '</span>' + qh + '</header>' +
      '<p class="nt-punch-mt">' + esc(p.mo_ta) + '</p>' +
      '<dl class="nt-dl"><div><dt>' + (p.ma_phieu ? 'Phiếu' : 'Lệnh cắt · chi tiết') + '</dt><dd class="mono">' + esc(p.ma_phieu || [p.lsx, p.ma_chi_tiet].filter(Boolean).join(' · ') || '—') + '</dd></div>' + (!p.ma_phieu && p.cong_trinh ? '<div><dt>Dự án</dt><dd>' + esc(p.cong_trinh) + '</dd></div>' : '') + '<div><dt>Tổ</dt><dd>' + esc(p.to) + '</dd></div><div><dt>Hạn</dt><dd>' + esc(hienNgay(p.han)) + '</dd></div>' +
      (p.ngay_dong ? '<div><dt>Đóng</dt><dd>' + esc(hienNgay(p.ngay_dong)) + '</dd></div>' : '') + '</dl>' +
      (p.anh_truoc.length ? '<p class="nt-nho">Ảnh lỗi</p>' + htmlAnh(p.anh_truoc) : '') + (p.anh_sau.length ? '<p class="nt-nho">Ảnh sau khi sửa</p>' + htmlAnh(p.anh_sau) : '') +
      (nut ? nut : '') + '</article>';
  }
  function nutPunch(p) {
    if (p.trang_thai === 'MO' && (vai === 'TO_TRUONG' || vai === 'QC')) return '<div class="nt-act"><button type="button" class="nb nb-pri" data-punch="BAO_SUA" data-ma="' + esc(p.ma_punch) + '">' + ic('check') + 'Báo đã sửa</button></div>';
    if (p.trang_thai === 'DA_SUA' && vai === 'QC') return '<div class="nt-act"><button type="button" class="nb nb-ok" data-punch="DONG" data-ma="' + esc(p.ma_punch) + '">' + ic('check') + 'Đóng punch</button><button type="button" class="nb" data-punch="MO_LAI" data-ma="' + esc(p.ma_punch) + '">' + ic('x') + 'Chưa đạt, mở lại</button></div>';
    return '';
  }
  function htmlLichSu(ds) { return '<ol class="nt-ls">' + ds.map(function (x) { return '<li><span class="mono">' + esc(x.t) + '</span> · ' + esc(x.ai) + ' · ' + esc(x.viec) + '</li>'; }).join('') + '</ol>'; }
  function htmlPhieu(d, chiDoc) {
    var p = d.phieu, cd = congDoan(p.cong_doan);
    return '<div class="nt-phieu"><header><h3 class="mono">' + esc(p.ma_phieu) + '</h3>' + pill('PHIEU', p.trang_thai) + '</header>' + (p.trang_thai === 'HUY' ? '<p class="pf-loi">Đã huỷ: ' + esc(p.ly_do_huy || '') + '</p>' : '') +
      '<dl class="nt-dl"><div><dt>Ngày</dt><dd>' + esc(hienNgay(p.ngay)) + '</dd></div><div><dt>Dự án</dt><dd>' + esc(tenDuAn(p.du_an)) + '</dd></div><div><dt>Xưởng</dt><dd>' + esc(p.xuong) + '</dd></div>' +
      '<div><dt>Công đoạn</dt><dd>' + esc(cd ? cd.ten : p.cong_doan) + '</dd></div><div><dt>Chi tiết</dt><dd class="mono">' + esc(p.ma_chi_tiet) + ' · SL ' + esc(p.so_ct || '—') + '</dd></div>' +
      '<div><dt>Bản vẽ</dt><dd class="mono">' + esc(p.ban_ve || '—') + (p.rev ? ' rev ' + esc(p.rev) : '') + '</dd></div><div><dt>Vật tư</dt><dd class="mono">' + esc(p.ma_vt) + ' · heat ' + esc(p.so_heat) + '</dd></div><div><dt>QC</dt><dd>' + esc(p.nguoi_qc) + '</dd></div></dl>' +
      htmlKetQua(p) + (p.ghi_chu ? '<p><b>Ghi chú:</b> ' + esc(p.ghi_chu) + '</p>' : '') + htmlAnh(p.anh) +
      (d.punch.length ? '<h4>Punch của phiếu (' + d.punch.length + ')</h4>' + d.punch.map(function (x) { return htmlPunch(x, chiDoc ? '' : nutPunch(x)); }).join('') : '<p class="nt-nho">Không có punch.</p>') +
      (!chiDoc && p.trang_thai !== 'HUY' && (vai === 'QC' || vai === 'QUAN_LY') ? '<div class="nt-act">' + (p.trang_thai === 'DAT' ? '<button type="button" class="nb" data-mo-lai-phieu="' + esc(p.ma_phieu) + '">' + ic('flag') + 'Mở lại (lỗi phát hiện sau)</button>' : '') + '<button type="button" class="nb" data-huy-phieu="' + esc(p.ma_phieu) + '">' + ic('x') + 'Huỷ phiếu</button></div>' : '') +
      (!chiDoc && p.trang_thai !== 'HUY' && vai === 'QC' ? '<div class="nt-act"><button type="button" class="nb" data-tuong-tu="' + esc(p.ma_phieu) + '">' + ic('copy') + 'Lập phiếu tương tự (chi tiết kế tiếp)</button></div>' : '') +
      (NT_LINK_TX ? '<p class="nt-nho"><a href="' + NT_LINK_TX + '#' + esc(p.ma_phieu) + '" target="_blank" rel="noopener">Mở hồ sơ truy xuất ' + esc(p.ma_phieu) + '</a></p>' : '') + '</div>';
  }

  /* ---------- FORM PHIẾU SƠ CHẾ (dùng chung điện thoại + web) ---------- */
  var NT_LINK_TX = '';
  var KHOA_NHAP = 'nt_nhap_v1';
  function PhieuForm(goc, opt) {
    opt = opt || {};
    var st = { vt: null, ket_qua: {}, anh: [] }, id = 'pf' + Math.random().toString(36).slice(2, 6), hen = 0;
    function opts(ds, chon, rong) { return (rong ? '<option value="">' + esc(rong) + '</option>' : '') + ds.map(function (x) { var v = typeof x === 'string' ? x : x.ma, t = typeof x === 'string' ? x : x.ten; return '<option value="' + esc(v) + '"' + (v === chon ? ' selected' : '') + '>' + esc(t) + '</option>'; }).join(''); }
    goc.innerHTML =
      '<form class="pf" novalidate>' +
      '<div class="pf-nhap" hidden></div><div class="pf-kh" hidden></div>' +
      '<fieldset class="pf-sec"><legend><span class="pf-so">1</span>Vật tư dùng để sơ chế</legend>' +
      '<label for="' + id + '-heat">Heat no, mã vật tư hoặc số MTC</label>' +
      '<div class="pf-hang"><input id="' + id + '-heat" name="heat" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="' + id + '-heat-e"><button type="button" class="nb nb-pri" data-act="kt">' + ic('search') + 'Kiểm tra</button></div>' +
      '<p class="pf-loi" id="' + id + '-heat-e" hidden></p><div class="pf-vt" aria-live="polite"></div></fieldset>' +
      '<fieldset class="pf-sec"><legend><span class="pf-so">2</span>Thông tin chi tiết</legend><div class="pf-luoi">' +
      '<div><label for="' + id + '-du_an">Dự án</label><select id="' + id + '-du_an" name="du_an" aria-describedby="' + id + '-du_an-e">' + opts(DU_AN.filter(function (d) { return d.trang_thai === 'DANG_CHAY'; }), daChon && layDuAn(daChon) && layDuAn(daChon).trang_thai === 'DANG_CHAY' ? daChon : '', 'Chọn dự án') + '</select><p class="pf-loi" id="' + id + '-du_an-e" hidden></p></div>' +
      '<div><label for="' + id + '-xuong">Xưởng</label><select id="' + id + '-xuong" name="xuong" aria-describedby="' + id + '-xuong-e">' + opts(XUONG, opt.xuong || '', 'Chọn xưởng') + '</select><p class="pf-loi" id="' + id + '-xuong-e" hidden></p></div>' +
      '<div><label for="' + id + '-cong_doan">Công đoạn</label><select id="' + id + '-cong_doan" name="cong_doan" aria-describedby="' + id + '-cong_doan-e">' + opts(CONG_DOAN, '', 'Chọn công đoạn') + '</select><p class="pf-loi" id="' + id + '-cong_doan-e" hidden></p></div>' +
      '<div><label for="' + id + '-ma_chi_tiet">Part mark / mã chi tiết</label><input id="' + id + '-ma_chi_tiet" name="ma_chi_tiet" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="' + id + '-ma_chi_tiet-e"><p class="pf-loi" id="' + id + '-ma_chi_tiet-e" hidden></p></div>' +
      '<div class="pf-sdc" hidden aria-live="polite"></div><div class="pf-sdc pf-tx" hidden aria-live="polite"></div>' +
      '<div><label for="' + id + '-ban_ve">Số bản vẽ</label><input id="' + id + '-ban_ve" name="ban_ve" autocomplete="off" autocapitalize="characters" spellcheck="false"></div>' +
      '<div class="pf-2"><div><label for="' + id + '-rev">Rev</label><input id="' + id + '-rev" name="rev" autocomplete="off" autocapitalize="characters"></div>' +
      '<div><label for="' + id + '-so_ct">SL chi tiết kiểm</label><input id="' + id + '-so_ct" name="so_ct" type="number" inputmode="numeric" min="1"></div></div>' +
      '</div></fieldset>' +
      '<fieldset class="pf-sec"><legend><span class="pf-so">3</span>Kết quả đo</legend><div class="pf-hm"><p class="pf-goi">Chọn công đoạn ở mục 2 để hiện các hạng mục cần đo.</p></div></fieldset>' +
      '<fieldset class="pf-sec"><legend><span class="pf-so">4</span>Ảnh hiện trường</legend>' +
      '<label class="nb pf-chup" for="' + id + '-anh">' + ic('camera') + 'Chụp / chọn ảnh</label><input id="' + id + '-anh" class="pf-file" type="file" accept="image/*" capture="environment" multiple>' +
      '<p class="pf-goi">Ảnh được nén trước khi gửi. Không bắt buộc.</p><div class="pf-anh"></div></fieldset>' +
      '<fieldset class="pf-sec"><legend><span class="pf-so">5</span>Ghi chú</legend><label for="' + id + '-ghi_chu" class="sr">Ghi chú</label><textarea id="' + id + '-ghi_chu" name="ghi_chu" rows="3"></textarea></fieldset>' +
      '<div class="pf-bar"><p class="pf-tom" aria-live="polite"></p><p class="pf-loi pf-loi-chung" role="alert" hidden></p><button type="submit" class="nb nb-pri nb-lon">' + ic('check') + 'Lưu phiếu</button></div>' +
      '</form>';
    var f = goc.querySelector('form');
    function $(n) { return f.querySelector('[name="' + n + '"]'); }
    function baoLoi(n, msg) { var e = f.querySelector('#' + id + '-' + n + '-e'), i = $(n); if (e) { e.textContent = msg || ''; e.hidden = !msg; } if (i) { if (msg) i.setAttribute('aria-invalid', 'true'); else i.removeAttribute('aria-invalid'); } }
    function veVT(ds) {
      var o = f.querySelector('.pf-vt');
      if (!ds) { o.innerHTML = ''; return; }
      if (!ds.length) { o.innerHTML = '<div class="pf-the p-b-bd">' + ic('alert') + '<div><b>Không tìm thấy vật tư.</b> Vật tư chưa được nạp vào danh sách đã nghiệm thu. Liên hệ QC vật tư trước khi sơ chế.</div></div>'; return; }
      o.innerHTML = ds.map(function (v) {
        var daF = $('du_an').value, khac = daF && v.du_an && v.du_an !== daF, ok = v.trang_thai === 'DAT' && !khac, chon = st.vt && st.vt.ma_vt === v.ma_vt;
        return '<div class="pf-the' + (ok ? '' : ' p-b-bd') + (chon ? ' chon' : '') + '"><div class="pf-the-t"><b class="mono">' + esc(v.so_heat) + '</b> · ' + esc(v.quy_cach) + ' · ' + esc(v.mac_thep) + pill('VT', v.trang_thai) + '</div>' +
          '<div class="pf-nho">' + esc(v.ma_vt) + ' · MTC ' + esc(v.so_mtc || 'chưa có') + ' · ' + esc(tenDuAn(v.du_an)) + (v.ghi_chu ? ' · ' + esc(v.ghi_chu) : '') + '</div>' +
          (ok ? '<button type="button" class="nb' + (chon ? ' nb-ok' : '') + '" data-act="chon-vt" data-ma="' + esc(v.ma_vt) + '">' + ic('check') + (chon ? 'Đang dùng vật tư này' : 'Dùng vật tư này') + '</button>'
            : '<p class="pf-chan">' + ic('x') + (khac ? 'Vật tư thuộc dự án ' + esc(tenDuAn(v.du_an)) + ', không dùng cho dự án đang chọn.' : 'Không được lập phiếu: vật tư chưa NT đạt.') + '</p>') + '</div>';
      }).join('');
    }
    function kiemVT() {
      var q = $('heat').value.trim(); baoLoi('heat', '');
      if (!q) { baoLoi('heat', 'Nhập heat no hoặc mã vật tư.'); return Promise.resolve(); }
      f.querySelector('[data-act="kt"]').disabled = true;
      return API.traVatTu(q).then(function (ds) {
        f.querySelector('[data-act="kt"]').disabled = false; st._ds = ds;
        var daF = $('du_an').value, dat = ds.filter(function (v) { return v.trang_thai === 'DAT' && (!daF || !v.du_an || v.du_an === daF); });
        if (dat.length === 1 && (!st.vt || st.vt.ma_vt !== dat[0].ma_vt)) chonVT(dat[0]); else if (!dat.some(function (v) { return st.vt && v.ma_vt === st.vt.ma_vt; })) st.vt = null;
        veVT(ds); capNhatTom(); hen_luu();
      });
    }
    function chonVT(v) { st.vt = v; if (!$('du_an').value && v.du_an) $('du_an').value = v.du_an; veVT(st._ds || [v]); capNhatTom(); hen_luu(); if ($('ma_chi_tiet').value.trim()) goiYSDC(); }
    function veHM() {
      var cd = congDoan($('cong_doan').value), o = f.querySelector('.pf-hm');
      if (!cd) { o.innerHTML = '<p class="pf-goi">Chọn công đoạn ở mục 2 để hiện các hạng mục cần đo.</p>'; capNhatTom(); return; }
      o.innerHTML = cd.hm.map(function (h) {
        var x = st.ket_qua[h.ma] || (st.ket_qua[h.ma] = { yc: '', td: '', punch: { mo_ta: '', muc: 'B', to: '', han: ngayCach(2), anh: [] } }), b = id + '-' + h.ma;
        var vao = h.kieu === 'mat'
          ? '<div class="pf-mat" role="radiogroup" aria-label="' + esc(h.ten) + '"><button type="button" role="radio" aria-checked="' + (x.td === 'DAT') + '" class="nb pf-r" data-hm="' + h.ma + '" data-gt="DAT">' + ic('check') + 'Đạt</button><button type="button" role="radio" aria-checked="' + (x.td === 'KHONG_DAT') + '" class="nb pf-r" data-hm="' + h.ma + '" data-gt="KHONG_DAT">' + ic('x') + 'Không đạt</button></div>'
          : '<div class="pf-so2">' + (h.kieu === 'so' ? '<div><label for="' + b + '-yc">Bản vẽ (' + esc(h.dv) + ')</label><input id="' + b + '-yc" data-hm="' + h.ma + '" data-f="yc" type="text" inputmode="decimal" value="' + esc(x.yc) + '"></div>' : '') +
            '<div><label for="' + b + '-td">Thực đo (' + esc(h.dv) + ')</label><input id="' + b + '-td" data-hm="' + h.ma + '" data-f="td" type="text" inputmode="decimal" value="' + esc(x.td) + '"></div></div>';
        return '<div class="pf-dong" data-dong="' + h.ma + '"><div class="pf-dong-t"><div><b>' + esc(h.ten) + '</b><span class="pf-nho">Cho phép: ' + esc(moTaYeuCau(h)) + '</span></div><span class="pf-kq" id="' + b + '-kq"></span></div>' + vao +
          '<p class="pf-loi" id="' + b + '-e" hidden></p>' +
          '<div class="pf-pu" id="' + b + '-pu" hidden><p class="pf-pu-t">' + ic('flag') + 'Punch sẽ được mở cho hạng mục này</p>' +
          '<label for="' + b + '-mt">Mô tả lỗi</label><textarea id="' + b + '-mt" rows="2" data-hm="' + h.ma + '" data-p="mo_ta">' + esc(x.punch.mo_ta) + '</textarea>' +
          '<div class="pf-luoi pf-luoi3"><div><label for="' + b + '-muc">Mức độ</label><select id="' + b + '-muc" data-hm="' + h.ma + '" data-p="muc">' + opts(Object.keys(MUC).map(function (k) { return { ma: k, ten: MUC[k] }; }), x.punch.muc) + '</select></div>' +
          '<div><label for="' + b + '-to">Tổ chịu trách nhiệm</label><select id="' + b + '-to" data-hm="' + h.ma + '" data-p="to">' + opts(TO, x.punch.to, 'Chọn tổ') + '</select></div>' +
          '<div><label for="' + b + '-han">Hạn xử lý</label><input id="' + b + '-han" type="date" data-hm="' + h.ma + '" data-p="han" value="' + esc(x.punch.han) + '"></div></div>' +
          '<label class="nb pf-chup" for="' + b + '-pa">' + ic('camera') + 'Ảnh lỗi</label><input id="' + b + '-pa" class="pf-file" type="file" accept="image/*" capture="environment" multiple data-hm="' + h.ma + '" data-p="anh"><div class="pf-anh" id="' + b + '-pal"></div></div></div>';
      }).join('');
      cd.hm.forEach(function (h) { capNhatDong(h.ma); veAnhPunch(h.ma); });
      capNhatTom();
    }
    function capNhatDong(ma) {
      var h = hangMuc(ma), x = st.ket_qua[ma], b = id + '-' + ma, r = danhGia(h, x.yc, x.td);
      var kq = f.querySelector('#' + b + '-kq'); if (kq) kq.innerHTML = pill('KQ', r);
      var pu = f.querySelector('#' + b + '-pu'); if (pu) pu.hidden = r !== 'KHONG_DAT';
      if (r === 'KHONG_DAT' && (x.punch.tu || !x.punch.mo_ta)) { x.punch.mo_ta = moTaLoi(h, x.yc, x.td); x.punch.tu = true; var mt = f.querySelector('#' + b + '-mt'); if (mt) mt.value = x.punch.mo_ta; }
      var row = f.querySelector('[data-dong="' + ma + '"]'); if (row) { row.classList.toggle('loi', r === 'KHONG_DAT'); row.classList.toggle('dat', r === 'DAT'); }
      f.querySelectorAll('.pf-r[data-hm="' + ma + '"]').forEach(function (bt) { bt.setAttribute('aria-checked', String(bt.getAttribute('data-gt') === x.td)); });
    }
    function goiYTXF() {
      var t = $('ma_chi_tiet'), o3 = f.querySelector('.pf-tx'), hoi = t.value.trim().toUpperCase(); if (!hoi) { o3.hidden = true; return; } if (goiYTXF.hoi === hoi && !o3.hidden) return; goiYTXF.hoi = hoi;
      API.goiYTX(hoi).then(function (ds) { if (goiYTXF.hoi !== hoi) return; st.tx = ds; if (!ds.length) { o3.hidden = true; return; }
        o3.hidden = false; o3.innerHTML = ic('link') + '<span>Theo hồ sơ truy xuất, part này làm từ <b>' + ds.length + ' tấm thép</b> đã nghiệm thu:</span>' + ds.map(function (x, i) {
          var ok = x.co_mrir && (!x.ket_qua || /^acc/i.test(x.ket_qua)), lech = x.co_mrir && x.heat_mrir && chuanHeat(x.heat_mrir) !== chuanHeat(x.so_heat);
          return '<button type="button" class="nb" data-act="tam-tx" data-i="' + i + '"' + (ok ? '' : ' disabled') + '><span class="mono">' + esc(x.ma_tam) + '</span> · heat <span class="mono">' + esc(x.so_heat) + '</span>' + (x.quy_cach ? ' · ' + esc(x.quy_cach) : '') + (x.mac ? ' · ' + esc(x.mac) : '') +
            (!x.co_mrir ? ' · KHÔNG có trong MRIR' : !ok ? ' · kết quả ' + esc(x.ket_qua) : '') + (lech ? ' · LỆCH heat MRIR ' + esc(x.heat_mrir) : '') + '</button>'; }).join('') +
          '<b style="width:100%">Bấm tấm đang dùng: app tự lấy heat, mác, số MTC, số MRIR. Phải chọn Dự án trước.</b>'; }).catch(function () { o3.hidden = true; });
    }
    function goiYSDC() {
      goiYTXF();
      var t = $('ma_chi_tiet'), o2 = f.querySelector('.pf-sdc'); if (!t.value.trim()) { o2.hidden = true; return Promise.resolve(); }
      var hoi = t.value.trim().toUpperCase(); goiYSDC.hoi = hoi;
      return API.dongTheoPart(hoi).then(function (dcAll) { if (goiYSDC.hoi !== hoi) return;
        var dc = dcAll, hp = {}; dc.forEach(function (x) { (hp[x.ma_vt] = hp[x.ma_vt] || { so_heat: x.so_heat, quy_cach: x.quy_cach, sl: 0, sdc: {} }).sl += Number(x.sl) || 0; hp[x.ma_vt].sdc[x.ma_sdc] = 1; });
        var ks = Object.keys(hp), khoaV = t.value.trim().toUpperCase() + '|' + ks.join(',') + '|' + (st.vt ? st.vt.ma_vt : '');
        if (o2.getAttribute('data-k') === khoaV && !o2.hidden) return; /* không vẽ lại khi không đổi: tránh mất cú bấm khi ô part mất focus */
        o2.setAttribute('data-k', khoaV);
        if (!ks.length) { o2.hidden = false; o2.className = 'pf-sdc canh-v'; o2.innerHTML = ic('alert') + '<span>Part ' + esc(t.value.trim().toUpperCase()) + ' chưa có trong sơ đồ cắt nào. Vẫn lưu được, nhưng truy xuất sẽ dựa vào heat QC chọn.</span>'; }
        else {
          o2.hidden = false; o2.className = 'pf-sdc';
          o2.innerHTML = ic('link') + '<span>Theo sơ đồ cắt, part cắt từ <b>' + ks.length + ' heat</b>:</span>' + ks.map(function (m) { var h = hp[m], on = st.vt && st.vt.ma_vt === m;
            return '<button type="button" class="nb' + (on ? ' nb-ok' : '') + '" data-act="heat-sdc" data-ma="' + esc(m) + '">' + (on ? ic('check') : '') + '<span class="mono">' + esc(h.so_heat) + '</span> · ' + esc(h.quy_cach) + ' · ' + h.sl + ' cái · ' + esc(Object.keys(h.sdc).join(', ')) + '</button>'; }).join('');
          if (!st.vt && ks.length === 1) { $('heat').value = ks[0]; return kiemVT(); }
          else if (!st.vt) o2.innerHTML += '<b style="width:100%">Chọn heat của tấm đang nghiệm thu.</b>';
          else if (!hp[st.vt.ma_vt]) { o2.className = 'pf-sdc canh-v'; o2.innerHTML += '<b style="width:100%">Heat đang chọn (' + esc(st.vt.so_heat) + ') KHÔNG có trong sơ đồ cắt của part này!</b>'; }
        }
      });
    }
    function capNhatTom() {
      var cd = congDoan($('cong_doan').value), t = f.querySelector('.pf-tom');
      if (!cd) { t.innerHTML = st.vt ? 'Vật tư: <b class="mono">' + esc(st.vt.so_heat) + '</b>' : 'Chưa chọn vật tư'; return; }
      var d = 0, k = 0, c = 0; cd.hm.forEach(function (h) { var x = st.ket_qua[h.ma] || {}, r = danhGia(h, x.yc, x.td); if (r === 'DAT') d++; else if (r === 'KHONG_DAT') k++; else c++; });
      var canh = [];
      if (k && !st.anh.length && !cd.hm.some(function (h) { var x = st.ket_qua[h.ma] || {}; return x.punch && x.punch.anh && x.punch.anh.length; })) canh.push('chưa có ảnh lỗi');
      if (!$('ban_ve').value.trim()) canh.push('chưa nhập số bản vẽ'); else if (!$('rev').value.trim()) canh.push('chưa nhập rev');
      t.innerHTML = (canh.length ? '<span class="pf-tom-c">' + ic('alert') + 'Nên bổ sung: ' + esc(canh.join(', ')) + '</span>' : '') + '<span class="pf-tom-o"><b>' + d + '</b> đạt</span><span class="pf-tom-o' + (k ? ' do' : '') + '"><b>' + k + '</b> không đạt → ' + k + ' punch</span><span class="pf-tom-o"><b>' + c + '</b> chưa nhập</span>';
    }
    function veAnh() { f.querySelector('.pf-anh:not([id])').innerHTML = st.anh.map(function (a, i) { return '<figure><img src="' + esc(a.thumb) + '" alt="' + esc(a.ten) + '"><button type="button" class="nb nb-xoa" data-xoa-anh="' + i + '" aria-label="Xoá ảnh ' + (i + 1) + '">' + ic('trash') + '</button></figure>'; }).join(''); }
    function veAnhPunch(ma) { var o = f.querySelector('#' + id + '-' + ma + '-pal'); if (o) o.innerHTML = st.ket_qua[ma].punch.anh.map(function (a, i) { return '<figure><img src="' + esc(a.thumb) + '" alt="' + esc(a.ten) + '"><button type="button" class="nb nb-xoa" data-xoa-pa="' + ma + '|' + i + '" aria-label="Xoá ảnh lỗi ' + (i + 1) + '">' + ic('trash') + '</button></figure>'; }).join(''); }
    function giaTri() { var o = {}; ['du_an', 'xuong', 'cong_doan', 'ma_chi_tiet', 'ban_ve', 'rev', 'so_ct', 'ghi_chu', 'heat'].forEach(function (n) { o[n] = $(n).value; }); return o; }
    function hen_luu() { clearTimeout(hen); hen = setTimeout(function () { var kq = {}; Object.keys(st.ket_qua).forEach(function (k) { var x = st.ket_qua[k]; kq[k] = { yc: x.yc, td: x.td, punch: { mo_ta: x.punch.mo_ta, muc: x.punch.muc, to: x.punch.to, han: x.punch.han, anh: [] } }; }); ls(KHOA_NHAP, JSON.stringify({ luc: gioPhut(), gt: giaTri(), vt: st.vt, kq: kq })); }, 400); }
    function xoaNhap() { ls(KHOA_NHAP, null); }
    function phucHoi() {
      var t; try { t = JSON.parse(ls(KHOA_NHAP) || 'null'); } catch (e) { t = null; } if (!t || !t.gt) return false;
      var co = Object.keys(t.gt).some(function (k) { return t.gt[k]; }); if (!co) return false;
      Object.keys(t.gt).forEach(function (n) { if ($(n)) $(n).value = t.gt[n] || ''; });
      st.vt = t.vt; st.ket_qua = t.kq || {}; if (st.vt) { st._ds = [st.vt]; veVT([st.vt]); }
      veHM();
      var b = f.querySelector('.pf-nhap'); b.hidden = false;
      b.innerHTML = ic('clock') + '<span>Đã khôi phục bản nháp lưu lúc ' + esc(t.luc) + ' (ảnh không lưu trong nháp).</span><button type="button" class="nb" data-act="bo-nhap">Bỏ nháp, làm mới</button>';
      return true;
    }
    function lamMoi() { xoaNhap(); PhieuForm(goc, opt); }

    f.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var a = b.getAttribute('data-act');
      if (a === 'kt') kiemVT();
      else if (a === 'chon-vt') { var v = (st._ds || []).filter(function (x) { return x.ma_vt === b.getAttribute('data-ma'); })[0]; if (v) chonVT(v); }
      else if (a === 'bo-nhap') lamMoi();
      else if (a === 'tam-tx') { var xT = (st.tx || [])[+b.getAttribute('data-i')]; if (!xT) return; if (!$('du_an').value) { baoLoi('heat', 'Chọn Dự án ở mục 2 trước, rồi bấm lại tấm thép.'); $('du_an').focus(); return; }
        b.disabled = true; API.dungVatTuTX({ ma_tam: xT.ma_tam, tx_du_an: xT.tx_du_an, du_an: $('du_an').value }).then(function (v) { b.disabled = false; $('heat').value = v.ma_vt; st.vt = null; kiemVT(); }).catch(function (er) { b.disabled = false; baoLoi('heat', er.message); }); }
      else if (a === 'heat-sdc') { $('heat').value = b.getAttribute('data-ma'); st.vt = null; f.querySelector('.pf-sdc').removeAttribute('data-k'); kiemVT(); }
      else if (a === 'bo-kh') { st.ma_kh = ''; f.querySelector('.pf-kh').hidden = true; }
      else if (b.classList.contains('pf-r')) { var ma = b.getAttribute('data-hm'); st.ket_qua[ma].td = b.getAttribute('data-gt'); capNhatDong(ma); capNhatTom(); hen_luu(); }
      else if (b.hasAttribute('data-xoa-anh')) { st.anh.splice(+b.getAttribute('data-xoa-anh'), 1); veAnh(); }
      else if (b.hasAttribute('data-xoa-pa')) { var s = b.getAttribute('data-xoa-pa').split('|'); st.ket_qua[s[0]].punch.anh.splice(+s[1], 1); veAnhPunch(s[0]); }
    });
    f.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.name === 'heat') { e.preventDefault(); kiemVT(); } });
    f.addEventListener('input', function (e) {
      var t = e.target, ma = t.getAttribute('data-hm');
      if (ma && t.getAttribute('data-f')) { st.ket_qua[ma][t.getAttribute('data-f')] = t.value; var er = f.querySelector('#' + id + '-' + ma + '-e'); if (er) er.hidden = true; capNhatDong(ma); capNhatTom(); }
      else if (ma && t.getAttribute('data-p') && t.type !== 'file') { st.ket_qua[ma].punch[t.getAttribute('data-p')] = t.value; if (t.getAttribute('data-p') === 'mo_ta') st.ket_qua[ma].punch.tu = false; }
      else if (t.name) baoLoi(t.name, '');
      capNhatTom(); hen_luu();
    });
    f.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'ma_chi_tiet') goiYSDC();
      if (t.name === 'cong_doan') { baoLoi('cong_doan', ''); veHM(); hen_luu(); }
      else if (t.name === 'du_an') { baoLoi('du_an', ''); if (st.vt && st.vt.du_an && st.vt.du_an !== t.value) st.vt = null; if (st._ds) veVT(st._ds); capNhatTom(); hen_luu(); }
      else if (t.getAttribute('data-p') && t.type !== 'file') { st.ket_qua[t.getAttribute('data-hm')].punch[t.getAttribute('data-p')] = t.value; hen_luu(); }
      else if (t.type === 'file') {
        var ds = Array.prototype.slice.call(t.files || []), ma = t.getAttribute('data-hm');
        Promise.all(ds.map(function (fl) { return nenAnh(fl); })).then(function (a) { if (ma) { st.ket_qua[ma].punch.anh = st.ket_qua[ma].punch.anh.concat(a); veAnhPunch(ma); } else { st.anh = st.anh.concat(a); veAnh(); } t.value = ''; capNhatTom(); })
          .catch(function (er) { var c = f.querySelector('.pf-loi-chung'); c.textContent = er.message; c.hidden = false; });
      }
    });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var c = f.querySelector('.pf-loi-chung'), dauTien = null, n = 0; c.hidden = true;
      function sai(el) { n++; if (!dauTien) dauTien = el; }
      if (!st.vt) { baoLoi('heat', 'Chưa chọn vật tư đã NT đạt. Bấm "Kiểm tra" rồi "Dùng vật tư này".'); sai($('heat')); }
      if (st.vt && st.vt.du_an && $('du_an').value && st.vt.du_an !== $('du_an').value) { baoLoi('du_an', 'Vật tư đã chọn thuộc dự án ' + tenDuAn(st.vt.du_an) + '.'); sai($('du_an')); }
      [['du_an', 'Chọn dự án.'], ['xuong', 'Chọn xưởng.'], ['cong_doan', 'Chọn công đoạn.'], ['ma_chi_tiet', 'Nhập mã chi tiết.']].forEach(function (x) { if (!$(x[0]).value.trim()) { baoLoi(x[0], x[1]); sai($(x[0])); } });
      var cd = congDoan($('cong_doan').value);
      if (cd) cd.hm.forEach(function (h) {
        var x = st.ket_qua[h.ma], r = danhGia(h, x.yc, x.td), er = f.querySelector('#' + id + '-' + h.ma + '-e'), msg = '';
        if (!r) msg = h.kieu === 'mat' ? 'Chọn Đạt hoặc Không đạt.' : h.kieu === 'so' ? 'Nhập đủ số bản vẽ và thực đo (dạng số).' : 'Nhập số thực đo.';
        else if (r === 'KHONG_DAT' && (!x.punch.mo_ta.trim() || !x.punch.to || !x.punch.han)) msg = 'Hạng mục không đạt: điền đủ mô tả lỗi, tổ chịu trách nhiệm và hạn xử lý.';
        if (er) { er.textContent = msg; er.hidden = !msg; } if (msg) sai(f.querySelector('[data-dong="' + h.ma + '"] input, [data-dong="' + h.ma + '"] button'));
      });
      if (n) { c.textContent = 'Còn ' + n + ' chỗ cần sửa. Xem dòng chữ đỏ dưới từng ô.'; c.hidden = false; if (dauTien) { dauTien.focus(); dauTien.scrollIntoView({ block: 'center' }); } return; }
      var g = giaTri(), nut = f.querySelector('[type=submit]'); nut.disabled = true; nut.innerHTML = ic('clock') + 'Đang lưu…';
      API.luuPhieu({ ma_kh: st.ma_kh || '', ma_vt: st.vt.ma_vt, du_an: g.du_an, xuong: g.xuong, cong_doan: g.cong_doan, ma_chi_tiet: g.ma_chi_tiet, ban_ve: g.ban_ve, rev: g.rev, so_ct: g.so_ct, ghi_chu: g.ghi_chu, ket_qua: st.ket_qua, anh: st.anh, lsx: opt.tuAH1 ? (opt.tuAH1.lsx || '') : '' })
        .then(function (r) { xoaNhap(); var o2 = Object.assign({}, opt); delete o2.keHoach; delete o2.mau; delete o2.tuAH1; if (opt.onLuu) opt.onLuu(r); PhieuForm(goc, o2); })
        .catch(function (er) { nut.disabled = false; nut.innerHTML = ic('check') + 'Lưu phiếu'; c.textContent = er.message; c.hidden = false; c.scrollIntoView({ block: 'center' }); });
    });
    if (opt.tuAH1) {
      var a1 = opt.tuAH1; xoaNhap();
      $('xuong').value = XUONG.indexOf('AH1') >= 0 ? 'AH1' : ''; $('ma_chi_tiet').value = a1.ten_chi_tiet; $('so_ct').value = a1.sl_tong || '';
      if (daChon && layDuAn(daChon) && layDuAn(daChon).trang_thai === 'DANG_CHAY') $('du_an').value = daChon;
      goiYSDC(); var ba = f.querySelector('.pf-kh'); ba.hidden = false;
      ba.innerHTML = ic('clock') + '<span>Theo kế hoạch xưởng AH1: lệnh SX <b class="mono">' + esc(a1.lsx) + '</b>' + (a1.may ? ' · ' + esc(a1.may) : '') + (a1.ngay_ra_bai ? ' · ra bài ' + esc(hienNgay(chuanNgay(a1.ngay_ra_bai))) : ' · sổ xưởng chưa ghi ra bài') + (a1.phieu_ban_giao ? ' · phiếu BG ' + esc(a1.phieu_ban_giao) : '') + ' · ' + esc(a1.cong_trinh || '') + '. Chọn dự án, công đoạn, heat rồi nhập kết quả.' +
        (a1.yc && a1.yc.length ? '<br><b>Yêu cầu của dự án:</b> ' + a1.yc.map(function (y) { return '<b>' + esc(y.loai) + '</b>: ' + esc(y.noi_dung); }).join(' · ') : '') + '</span>';
    } else if (opt.mau && !opt.keHoach) {
      var m = opt.mau; xoaNhap();
      $('du_an').value = m.du_an; $('xuong').value = m.xuong; $('cong_doan').value = m.cong_doan; $('ban_ve').value = m.ban_ve || ''; $('rev').value = m.rev || ''; $('so_ct').value = m.so_ct || '';
      veHM(); $('heat').value = m.ma_vt; kiemVT();
      var bm = f.querySelector('.pf-kh'); bm.hidden = false;
      bm.innerHTML = ic('copy') + '<span>Lập tương tự phiếu <b class="mono">' + esc(m.ma_phieu) + '</b>: đã điền dự án, xưởng, công đoạn, vật tư, bản vẽ. Nhập mã chi tiết mới và kết quả đo.</span>';
      setTimeout(function () { $('ma_chi_tiet').focus(); }, 50);
    } else if (opt.keHoach) {
      var k = opt.keHoach; xoaNhap(); st.ma_kh = k.ma_kh;
      $('du_an').value = k.du_an; $('xuong').value = k.xuong; $('cong_doan').value = k.cong_doan; $('ma_chi_tiet').value = k.ma_chi_tiet; $('ban_ve').value = k.ban_ve || ''; $('so_ct').value = k.so_luong || '';
      veHM(); goiYSDC(); var bk = f.querySelector('.pf-kh'); bk.hidden = false;
      bk.innerHTML = ic('clock') + '<span>Nghiệm thu theo kế hoạch <b class="mono">' + esc(k.ma_kh) + '</b> · ngày ' + esc(hienNgay(k.ngay)) + ' · ' + esc(tenDuAn(k.du_an)) + '. Lưu phiếu xong, kế hoạch tự chuyển "Đã nghiệm thu".</span><button type="button" class="nb" data-act="bo-kh">Bỏ liên kết</button>';
    } else if (!phucHoi() && opt.heat) { $('heat').value = opt.heat; kiemVT(); }
    capNhatTom();
    return { datHeat: function (h) { $('heat').value = h; return kiemVT(); } };
  }

  function pt(x) { return isFinite(x) ? fmt(x, 1) + '%' : '—'; }
  function vanBanBaoCao(r) {
    var L = [];
    L.push('BÁO CÁO KẾT QUẢ NGHIỆM THU SƠ CHẾ');
    L.push('Dự án: ' + (r.duAn ? r.duAn.ten + (r.duAn.ma_hd ? ' (' + r.duAn.ma_hd + ')' : '') : 'Tất cả dự án'));
    L.push('Thời gian: ' + (r.tu === r.den ? 'ngày ' + hienNgay(r.tu) : 'từ ' + hienNgay(r.tu) + ' đến ' + hienNgay(r.den)));
    L.push('');
    L.push('1. Phiếu nghiệm thu: ' + r.tong + ' phiếu, ' + fmt(r.slCT) + ' chi tiết kiểm. Đạt ngay lần đầu: ' + r.dat1 + ' phiếu (' + pt(r.tyLe) + ').');
    L.push('2. Hạng mục đo: ' + r.hmKiem + ', không đạt: ' + r.hmLoi + '.');
    L.push('3. Punch phát sinh: ' + r.punch.tong + ' (mức A: ' + r.punch.A + '). Còn mở: ' + r.punch.mo + ', tổ đã sửa chờ QC: ' + r.punch.sua + ', đã đóng: ' + r.punch.dong + ', QUÁ HẠN: ' + r.punch.qh + '.');
    L.push('4. Kế hoạch: đã nghiệm thu ' + r.kh.xong + '/' + r.kh.tong + ' (' + pt(r.kh.tyLe) + '), TRỄ: ' + r.kh.tre + ', còn chờ: ' + r.kh.cho + (r.kh.huy ? ', huỷ: ' + r.kh.huy : '') + '.');
    var cd = r.theoCD.filter(function (x) { return x.phieu; });
    if (cd.length) { L.push(''); L.push('Theo công đoạn:'); cd.forEach(function (x) { L.push('- ' + x.ten + ': ' + x.phieu + ' phiếu, đạt lần đầu ' + x.dat1 + ' (' + pt(x.tyLe) + '), hạng mục lỗi ' + x.loi); }); }
    if (r.topLoi.length) { L.push(''); L.push('Lỗi hay gặp:'); r.topLoi.forEach(function (x) { L.push('- ' + x.ten + ' (' + x.cd + '): ' + x.n + ' lần'); }); }
    if (r.dsTre.length) { L.push(''); L.push('Kế hoạch TRỄ:'); r.dsTre.forEach(function (k) { L.push('- ' + k.ma_kh + ' · ' + hienNgay(k.ngay) + ' · ' + k.xuong + ' · ' + (congDoan(k.cong_doan) || {}).ten + ' · ' + k.ma_chi_tiet + (r.duAn ? '' : ' · ' + tenDuAn(k.du_an))); }); }
    L.push(''); L.push('Lập lúc ' + r.lapLuc + ' · ' + tenNguoi());
    return L.join('\n');
  }
  /* ---------- khối hiển thị: kế hoạch + báo cáo (dùng chung) ---------- */
  function htmlKH(k, nut) {
    var cd = congDoan(k.cong_doan) || { ten: k.cong_doan }, tt = k.tt || ttKH(k);
    return '<article class="nt-kh tt-' + tt + '" data-ma="' + esc(k.ma_kh) + '"><header><b class="mono">' + esc(k.ma_kh) + '</b>' + pill('KH', tt) + '<span class="nt-nho">' + esc(hienNgay(k.ngay)) + ' · ' + esc(k.xuong) + '</span></header>' +
      '<p class="nt-kh-t">' + esc(cd.ten) + ' · <span class="mono">' + esc(k.ma_chi_tiet) + '</span>' + (k.so_luong ? ' · SL ' + esc(fmtSo(k.so_luong)) : '') + '</p>' +
      '<p class="nt-nho">' + esc(tenDuAn(k.du_an)) + (k.ban_ve ? ' · BV ' + esc(k.ban_ve) : '') + (k.ma_phieu ? ' · phiếu ' + esc(k.ma_phieu) : '') + (k.ghi_chu ? ' · ' + esc(k.ghi_chu) : '') + '</p>' + (nut || '') + '</article>';
  }
  function nutKH(k) {
    var tt = k.tt || ttKH(k), h = '';
    if (k.trang_thai === 'CHO' && vai === 'QC') h += '<button type="button" class="nb nb-pri" data-nt-kh="' + esc(k.ma_kh) + '">' + ic('check') + 'Nghiệm thu</button>';
    if (k.trang_thai === 'XONG' && k.ma_phieu) h += '<button type="button" class="nb" data-xem="' + esc(k.ma_phieu) + '">' + ic('file') + 'Xem phiếu ' + esc(k.ma_phieu) + '</button>';
    return h ? '<div class="nt-act">' + h + '</div>' : '';
  }
  function o(nhan, so_, phu, cls) { return '<div class="bc-o' + (cls ? ' ' + cls : '') + '"><span>' + esc(nhan) + '</span><b>' + so_ + '</b>' + (phu ? '<small>' + phu + '</small>' : '') + '</div>'; }
  function htmlBaoCao(r, gon) {
    var h = '<div class="bc">';
    h += '<p class="bc-tieu"><b>' + esc(r.duAn ? r.duAn.ten : 'Tất cả dự án') + '</b> · ' + esc(r.tu === r.den ? 'ngày ' + hienNgay(r.tu) : hienNgay(r.tu) + ' – ' + hienNgay(r.den)) + '</p>';
    h += '<div class="bc-kpi">' +
      o('Phiếu nghiệm thu', r.tong, fmt(r.slCT) + ' chi tiết kiểm') +
      o('Đạt ngay lần đầu', pt(r.tyLe), r.dat1 + '/' + r.tong + ' phiếu', isFinite(r.tyLe) ? (r.tyLe >= 90 ? 'xanh' : r.tyLe >= 70 ? 'vang' : 'do') : '') +
      o('Hạng mục không đạt', r.hmLoi, 'trên ' + r.hmKiem + ' hạng mục đo', r.hmLoi ? 'do' : '') +
      o('Punch còn mở', r.punch.mo + r.punch.sua, r.punch.sua + ' chờ QC đóng · ' + r.punch.qh + ' quá hạn', r.punch.qh ? 'do' : '') +
      o('Hoàn thành kế hoạch', pt(r.kh.tyLe), r.kh.xong + '/' + r.kh.tong + ' · trễ ' + r.kh.tre, r.kh.tre ? 'do' : 'xanh') + '</div>';
    var mx = Math.max.apply(null, [1].concat(r.theoNgay.map(function (x) { return x.phieu; })));
    if (r.theoNgay.length > 1) h += '<h3>Phiếu theo ngày</h3><div class="bc-ngay" role="table" aria-label="Số phiếu theo ngày">' + r.theoNgay.map(function (x) {
      return '<div role="row"><span role="cell" class="mono">' + esc(hienNgay(x.ngay).slice(0, 5)) + '</span><span role="cell" class="bc-thanh"><i class="d" style="width:' + (x.dat1 / mx * 100) + '%"></i><i class="l" style="width:' + ((x.phieu - x.dat1) / mx * 100) + '%"></i></span><span role="cell" class="num">' + (x.phieu ? x.phieu + ' phiếu · ' + x.dat1 + ' đạt lần đầu' : '·') + '</span></div>'; }).join('') +
      '</div><p class="nt-nho"><span class="bc-cg d"></span>Đạt lần đầu <span class="bc-cg l"></span>Có hạng mục không đạt</p>';
    function bang(tieu, cot1, ds) {
      ds = ds.filter(function (x) { return x.phieu; }); if (!ds.length) return '';
      return '<div class="bc-bang"><h3>' + tieu + '</h3><div class="cuon"><table class="nt-kq"><thead><tr><th scope="col">' + cot1 + '</th><th scope="col" class="num">Phiếu</th><th scope="col" class="num">Đạt lần đầu</th><th scope="col" class="num">Tỷ lệ</th><th scope="col" class="num">HM lỗi</th></tr></thead><tbody>' +
        ds.map(function (x) { return '<tr><td>' + esc(x.ten) + '</td><td class="num">' + x.phieu + '</td><td class="num">' + x.dat1 + '</td><td class="num"><b>' + pt(x.tyLe) + '</b></td><td class="num">' + (x.loi || '·') + '</td></tr>'; }).join('') + '</tbody></table></div></div>';
    }
    h += '<div class="bc-hai">' + bang('Theo công đoạn', 'Công đoạn', r.theoCD) + bang('Theo xưởng', 'Xưởng', r.theoXuong) + '</div>';
    if (r.theoDuAn && r.theoDuAn.length) h += bang('Theo dự án', 'Dự án', r.theoDuAn);
    h += '<div class="bc-hai"><div><h3>Lỗi hay gặp</h3>' + (r.topLoi.length ? '<ol class="bc-loi">' + r.topLoi.map(function (x) { return '<li><b>' + esc(x.ten) + '</b> <span class="nt-nho">(' + esc(x.cd) + ')</span> · ' + x.n + ' lần</li>'; }).join('') + '</ol>' : '<p class="nt-nho">Không có hạng mục không đạt.</p>') + '</div>' +
      '<div><h3>Kế hoạch trễ (' + r.dsTre.length + ')</h3>' + (r.dsTre.length ? r.dsTre.map(function (k) { return htmlKH(k); }).join('') : '<p class="nt-nho">Không có kế hoạch trễ.</p>') + '</div></div>';
    if (!gon) h += '<h3>Danh sách phiếu (' + r.dsPhieu.length + ')</h3><div class="cuon"><table class="nt-kq"><thead><tr><th scope="col">Mã phiếu</th><th scope="col">Ngày</th>' + (r.duAn ? '' : '<th scope="col">Dự án</th>') + '<th scope="col">Xưởng</th><th scope="col">Công đoạn</th><th scope="col">Chi tiết</th><th scope="col">Lần đầu</th><th scope="col" class="num">Punch mở</th><th scope="col">Trạng thái</th></tr></thead><tbody>' +
      (r.dsPhieu.length ? r.dsPhieu.map(function (p) { return '<tr><td><button type="button" class="nb" data-xem="' + esc(p.ma_phieu) + '">' + esc(p.ma_phieu) + '</button></td><td>' + esc(hienNgay(p.ngay)) + '</td>' + (r.duAn ? '' : '<td>' + esc(tenDuAn(p.du_an)) + '</td>') + '<td>' + esc(p.xuong) + '</td><td>' + esc((congDoan(p.cong_doan) || {}).ten) + '</td><td class="mono">' + esc(p.ma_chi_tiet) + '</td><td>' + pill('KQ', p.dat1 ? 'DAT' : 'KHONG_DAT') + '</td><td class="num">' + (p.punch_mo || '·') + '</td><td>' + pill('PHIEU', p.trang_thai) + '</td></tr>'; }).join('') : '<tr><td colspan="9" class="tr-rong">Không có phiếu trong khoảng này.</td></tr>') + '</tbody></table></div>';
    h += '<p class="nt-nho">Đạt ngay lần đầu = phiếu mà mọi hạng mục đo đều đạt khi nghiệm thu (chưa cần sửa). Lập lúc ' + esc(r.lapLuc) + '.</p></div>';
    return h;
  }
  function htmlKiemSoat(r) {
    if (!r.tong) return '<div class="ks-ok">' + ic('check') + '<span><b>Hồ sơ đầy đủ.</b> Không có mục nào cần xử lý' + (daChon ? ' cho dự án này' : '') + '.</span></div>';
    return '<div class="ks">' + r.ds.filter(function (g) { return g.items.length; }).map(function (g) {
      return '<details class="ks-g ks-' + g.muc + '"' + (g.muc === 'cao' ? ' open' : '') + '><summary><span class="ks-so">' + g.items.length + '</span><span class="ks-t"><b>' + esc(g.ten) + '</b><small>' + (g.muc === 'cao' ? 'MỨC CAO · ' : 'Cần bổ sung · ') + esc(g.giai) + '</small></span></summary>' +
        '<ul>' + g.items.map(function (x) { return '<li><button type="button" class="ks-i" data-mo="' + x.loai + '" data-ma="' + esc(x.ma) + '">' + esc(x.mo_ta) + ic('chev') + '</button></li>'; }).join('') + '</ul></details>';
    }).join('') + '</div>';
  }
  function vanBanKiemSoat(r) {
    var L = ['KIỂM SOÁT HỒ SƠ NGHIỆM THU SƠ CHẾ', 'Dự án: ' + (daChon ? tenDuAn(daChon) : 'Tất cả dự án') + ' · ' + hienNgay(homNay()), 'Tổng ' + r.tong + ' mục, MỨC CAO: ' + r.cao, ''];
    r.ds.filter(function (g) { return g.items.length; }).forEach(function (g) { L.push((g.muc === 'cao' ? '[CAO] ' : '') + g.ten + ': ' + g.items.length); g.items.slice(0, 10).forEach(function (x) { L.push('  - ' + x.mo_ta); }); if (g.items.length > 10) L.push('  … và ' + (g.items.length - 10) + ' mục khác'); });
    return L.join('\n');
  }
  function khoangNgay(loai) {
    var t = homNay(), d = new Date();
    if (loai === 'nay') return [t, t];
    if (loai === '7') return [ngayCach(-6), t];
    if (loai === 'thang') return [t.slice(0, 8) + '01', t];
    if (loai === 'tuan') { var w = (d.getDay() + 6) % 7; return [ngayCach(-w), t]; }
    return [ngayCach(-29), t];
  }
  /* ---------- sao chép bảng sang Excel (tải file bị chặn trong khung xem) ---------- */
  function saoChep(text, nut) {
    function xong(ok) { if (!nut) return; var c = nut.innerHTML; nut.innerHTML = ic(ok ? 'check' : 'alert') + (ok ? 'Đã chép, dán vào Excel' : 'Không chép được'); setTimeout(function () { nut.innerHTML = c; }, 2200); }
    try { navigator.clipboard.writeText(text).then(function () { xong(true); }, function () { du(); }); } catch (e) { du(); }
    function du() { var t = document.createElement('textarea'); t.value = text; t.setAttribute('aria-label', 'Dữ liệu để chép'); document.body.appendChild(t); t.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) { } t.remove(); xong(ok); }
  }

  GOC.NT = {
    CHE_DO: CHE_DO, LOAI_LOI: LOAI_LOI, TX_COT: TX_COT, TX_TEN_LOAI: TX_TEN_LOAI, TX_LO_TOI_DA: TX_LO_TOI_DA, txNhan: txNhan, txChuyen: txChuyen, txNapMo: txNapMo, txNhanLan: txNhanLan, txMaLanMoi: txMaLanMoi, txCungLan: txCungLan, txTomLan: txTomLan, LOAI_YC: LOAI_YC, BAN_SO: BAN_SO, sanSang: sanSang, API_GOC: API_GOC, GHI: GHI,
    datKho: function (k) { S = k; DU_AN = S.du_an; }, layKho: function () { return S; }, khoRong: khoRong, duLieuMau: duLieuMau,
    datNguCanh: function (c) { vai = c.vai; daChon = c.daChon && layDuAn(c.daChon) ? c.daChon : ''; tenND = c.ten || ''; },
    tenNguoiDung: function () { return tenND; }, dangXuat: function () { ls(KHOA_DN, null); xoaDem(true); location.reload(); }, xoaDem: xoaDem, QUA_WEB: !!NT_URL,
    PHIEN_BAN: PHIEN_BAN, API: API, PhieuForm: PhieuForm,
    XUONG: XUONG, TO: TO, CONG_DOAN: CONG_DOAN, MUC: MUC, VAI: VAI, TT: TT, COT: COT, TSV_MAU: TSV_MAU,
    congDoan: congDoan, hangMuc: hangMuc, tenDuAn: tenDuAn, moTaYeuCau: moTaYeuCau, danhGia: danhGia,
    esc: esc, ic: ic, pill: pill, hienNgay: hienNgay, homNay: homNay, soNgay: soNgay, fmt: fmt, fmtSo: fmtSo, quaHan: quaHan,
    htmlKiemSoat: htmlKiemSoat, vanBanKiemSoat: vanBanKiemSoat, datLinkTX: function (u) { NT_LINK_TX = u; }, linkTX: function () { return NT_LINK_TX; },
    vanBanBaoCao: vanBanBaoCao, htmlBaoCao: htmlBaoCao, htmlKH: htmlKH, nutKH: nutKH, khoangNgay: khoangNgay, pt: pt, isoNgay: isoNgay, ngayCach: ngayCach,
    chuanNgay: chuanNgay,
    phanTichBang: phanTichBang, phanTichSDC: phanTichSDC, TSV_SDC_MAU: TSV_SDC_MAU, docTSV: docTSV, nenAnh: nenAnh, saoChep: saoChep, chuanTen: chuanTen,
    htmlPhieu: htmlPhieu, htmlPunch: htmlPunch, nutPunch: nutPunch, htmlLichSu: htmlLichSu, htmlAnh: htmlAnh,
    dsDA: function () { return DU_AN.slice(); }, datCauHinh: datCauHinh, cauHinhHienTai: cauHinhHienTai, QUY_TAC: QUY_TAC, duAnTheoTenAH1: duAnTheoTenAH1, layDuAn: layDuAn,
    layDA: function () { return daChon; }, datDA: function (m) { daChon = m && layDuAn(m) ? m : ''; ls(KHOA_DA, daChon || null); },
    layVai: function () { return vai; }, datVai: function (v) { if (VAI[v]) { vai = v; ls(KHOA_VAI, v); } },
    xoaDuLieuMau: function () { ls(KHOA, null); ls(KHOA_NHAP, null); S = duLieuMau(); DU_AN = S.du_an; luuKho(); }
  };
}).call(this);
