/* ============ PHAN BO TEAM QC KICH THUOC — dung cho ban_do_qc.html ============
   Nguon: SO_DO_TEAM_QC_KICH_THUOC_13-10-2026.pdf (Bo phan QC, cap nhat 13/10/2026).
   Sua phan bo: sua mang NGUOI ben duoi roi day len GitHub.
   - spm  : ma QC trong SPM (= phan truoc @ cua email). De '' neu chua biet.
   - khu  : ma khu vuc (khop KHU.id)
   - cd   : cong doan · da : du an / line · gc : ghi chu
   - moi  : nhan su moi · tn : truong nhom · kiem : kiem nhiem tu khu khac
   - vang : dang vang mat (ra site / nghi) — KHONG ghi ly do ca nhan vao day (repo cong khai)
   KHONG dua so dien thoai / ngay sinh / anh ca nhan vao file nay.
   Anh chan dung lay tu Sheet nhan su qua link nhap tren trang (luu trong may nguoi xem).
============================================================================ */
window.PHAN_BO_QC = {
  capNhat: '13/10/2026',
  nguon: 'Sơ đồ Team QC Kích thước 13/10/2026',
  /* Anh tong mat bang NM An Ha (user gui 27/10/2026) — lam nen mat dat cua ban do 3D. Toa do khu vuc tinh theo anh nay (px). */
  NEN: {src:'so_do_nha_may.webp', w:1440, h:864},
  /* Khu vuc tren mat bang. spmX = ten xuong trong SPM (de doi chieu so lieu that). AH1/AH8/AH2 MR khong co trong SPM. */
  KHU: [
    {id:'AH9',   ten:'AH9',    mo:'Xuất hàng — Fitup / Final', x:302, y:90,  w:212, h:205, cao:64, line:2, spmX:'AH9'},
    {id:'AH4',   ten:'AH4',    mo:'Fitup / Final — EVAPCO',     x:985, y:75,  w:375, h:120, cao:58, spmX:'AH4'},
    {id:'AH1',   ten:'AH1',    mo:'Sơ chế — Cắt · Khoan · Chấn', x:985, y:197, w:375, h:101, cao:54, line:2, spmX:''},
    {id:'AH6',   ten:'AH6',    mo:'Fitup / Final',              x:299, y:313, w:353, h:148, cao:56, line:3, spmX:'AH6'},
    {id:'AH3',   ten:'AH3',    mo:'Fitup / Final — hàn',        x:670, y:303, w:195, h:475, cao:70, line:3, spmX:'AH3'},
    {id:'AH2',   ten:'AH2',    mo:'Fitup / Final',              x:935, y:305, w:280, h:383, cao:70, line:3, spmX:'AH2'},
    {id:'AH2MR', ten:'AH2 MR', mo:'Gia công lắp thử DANIELI (Mock-up area)', x:935, y:690, w:280, h:86, cao:46, spmX:''},
    {id:'AH8',   ten:'AH8',    mo:'Lắp thử EVAPCO', x:1240, y:326, w:148, h:248, cao:40, spmX:'', chuaRoViTri:true}
  ],
  /* So LINE moi xuong (user 27/10): AH3 3 · AH2 3 · AH1 2 · AH6 3 · AH9 2. AH4 chua co so -> 1 (tam).
     TO_LINE: to gia cong thuoc line nao, khoa 'XUONG.TO' -> so line (vd 'AH2.TO1RH':1).
     De TRONG = chua co so do to-line -> trang ban do xep TAM luan phien theo khoi luong va ghi ro "xep tam". */
  TO_LINE: {},
  /* Khu phu tro chi de ve (khong co QC) */
  PHU: [
    {ten:'Kho vật tư (thép tấm & hình)', x:529, y:83,  w:428, h:209, phang:1},
    {ten:'Packing',                      x:937, y:312, w:60,  h:98,  phang:1},
    {ten:'Phòng họp',                    x:1255, y:636, w:110, h:70}
  ],
  NGUOI: [
    {ten:'VŨ ĐẠI PHONG',          spm:'',         khu:'AH1',   cd:'Sơ chế',          da:'Cắt – Khoan – Chấn · truy xuất vật liệu', gc:''},
    {ten:'LÊ MINH TRÍ',           spm:'',         khu:'AH1',   cd:'Sơ chế · Truy xuất', da:'Xưởng AH1', gc:'', moi:1},
    {ten:'NGUYỄN VĂN HIẾU',       spm:'hieunv2',  khu:'AH2',   cd:'Fitup · Final',   da:'Line 2 – AH2', gc:'kiêm Danieli AH2 MR'},
    {ten:'NGUYỄN VĂN KIÊN',       spm:'kiennv',   khu:'AH2',   cd:'Fitup · Final',   da:'Line 1 – AH2', gc:'kiêm Danieli AH2 MR'},
    {ten:'KHƯƠNG HỒNG QUÂN',      spm:'quankh',   khu:'AH2',   cd:'Fitup · Final',   da:'Cẩu KONE – Line 3', gc:''},
    {ten:'NGUYỄN VĂN TRÌNH',      spm:'trinhnv',  khu:'AH2',   cd:'Fitup · Final',   da:'Cẩu KONE · Ducting EVAPCO', gc:''},
    {ten:'NGUYỄN TRÍ HẢO',        spm:'haont',    khu:'AH2',   cd:'Fitup · Final',   da:'chưa giao line', gc:'đã đi làm lại (27/10)'},
    {ten:'PHAN TRƯỜNG ĐÔNG',      spm:'dongpt',   khu:'AH3',   cd:'Fitup',           da:'SVĐ Hùng Vương', gc:'bàn giao lắp thử buồng bi AH9 cho Mỹ'},
    {ten:'HUỲNH NGỌC TƯỜNG',      spm:'tuonghn',  khu:'AH3',   cd:'Final',           da:'Hùng Vương', gc:'kiêm lắp thử kết cấu WOLF SUMMIT'},
    {ten:'TRẦN KHẮC CƯỜNG',       spm:'cuongtk',  khu:'AH3',   cd:'Fitup · Final',   da:'EVAPCO · Phú Quốc', gc:'hỗ trợ Phú Quốc phần còn lại'},
    {ten:'PHẠM TRƯỜNG VŨ',        spm:'vupt',     khu:'AH3',   cd:'Fitup',           da:'SVĐ Hùng Vương · Line 5', gc:'hỗ trợ Final Hùng Vương'},
    {ten:'NGUYỄN XUÂN HÒA',       spm:'hoanx',    khu:'AH4',   cd:'Final',           da:'EVAPCO', gc:''},
    {ten:'ĐỖ TẤN VŨ',             spm:'vudt1',    khu:'AH4',   cd:'Fitup',           da:'EVAPCO', gc:'', moi:1},
    {ten:'PHẠM TẤN DƯƠNG',        spm:'duongpt',  khu:'AH4',   cd:'Fitup',           da:'EVAPCO', gc:'từ AH9 · hỗ trợ Hòa Final', moi:1},
    {ten:'TRẦN QUỐC THÁI',        spm:'thaitq',   khu:'AH6',   cd:'Final',           da:'Toàn xưởng AH6', gc:'', moi:1},
    {ten:'NGUYỄN HOÀNG GIANG',    spm:'giangnh',  khu:'AH6',   cd:'Fitup',           da:'Xưởng AH6 · TED AH6', gc:'', moi:1},
    {ten:'ĐẬU THẾ MỸ',            spm:'mydt',     khu:'AH9',   cd:'Lắp thử',         da:'Buồng bi AH9 · sắp xếp AH6/AH9', gc:'Trưởng nhóm', tn:1},
    {ten:'TRỊNH VĂN TRÒN',        spm:'trontv',   khu:'AH9',   cd:'Final',           da:'Final · Line 1, Line 2 (tất cả dự án AH9)', gc:'cập nhật 27/10'},
    {ten:'BÙI ANH TRƯỞNG',        spm:'truongba', khu:'AH9',   cd:'Fitup',           da:'Fitup · Line 2', gc:'cập nhật 27/10 · trước: Tổ RHT2, RHT3 · TED 2 tổ gia công'},
    {ten:'HỒ TRINH DINH',         spm:'dinhht',   khu:'AH9',   cd:'Fitup',           da:'Fitup · Line 1', gc:'cập nhật 27/10', moi:1},
    {ten:'HUỲNH HUÂN HUY',        spm:'huyhh',    khu:'AH9',   cd:'—',               da:'TED GCN AH3', gc:'', moi:1},
    {ten:'HUỲNH NGỌC TƯỜNG',      spm:'tuonghn',  khu:'AH9',   cd:'Lắp thử',         da:'Kết cấu WOLF SUMMIT', gc:'kiêm từ AH3', kiem:1},
    {ten:'NGUYỄN VĂN HIẾU',       spm:'hieunv2',  khu:'AH2MR', cd:'—',               da:'DANIELI', gc:'kiêm từ AH2', kiem:1},
    {ten:'NGUYỄN VĂN KIÊN',       spm:'kiennv',   khu:'AH2MR', cd:'—',               da:'DANIELI', gc:'kiêm từ AH2', kiem:1},
    {ten:'NGUYỄN NGỌC TÍNH',      spm:'tinhnn',   khu:'AH8',   cd:'Lắp thử',         da:'EVAPCO — AH8', gc:'chuyển từ AH4'},
    {ten:'BÙI VÂN ĐIỆP',          spm:'diepbv',   khu:'AH9',   cd:'—',               da:'—', gc:'ra site / vắng', vang:1},
    {ten:'NGUYỄN PHAN ĐĂNG QUANG',spm:'quangnpd', khu:'AH6',   cd:'—',               da:'—', gc:'ra site / vắng', vang:1}
    /* 27/10: TRAN VAN DUONG (duongtv) bo khoi Team Kich thuoc theo user — la QC Han (xem TEAMS 'han') */
  ],
  /* ===== MOI TEAM 1 SO DO RIENG (27/10/2026) =====
     cd    = cong doan team ky NT trong SPM: f=Fitup (cot 7), w=Han (cot 8), p=Son (cot 9)
     loc   = (tuy chon) chi tinh tai cho nguoi co cong doan (cd) khop mau nay — Team Kich thuoc: chi nguoi lam Fitup
     tam   = 1 khi khu vuc la TAM tinh theo SPM (chua co so do that) */
  TEAMS: [
    {id:'kt', ten:'Team QC Kích thước', ngan:'Kích thước', cd:'f', loc:'fitup', capNhat:'13/10/2026',
     nguon:'Sơ đồ Team QC Kích thước 13/10/2026 (PDF)', NGUOI:null /* = NGUOI o tren */},
    {id:'han', ten:'Team QC Hàn', ngan:'Hàn', cd:'w', capNhat:'27/10/2026',
     nguon:'Sheet nhân sự QC_HR_DATA_CENTER — cột WORKSHOP (chưa có sơ đồ PDF riêng)',
     NGUOI:[
      {ten:'LÊ VIẾT TRỌNG',       spm:'tronglv',  khu:'AH9', cd:'Hàn', da:'—', gc:'Trưởng nhóm', tn:1},
      {ten:'TRẦN XUÂN PHÁT',      spm:'phattx',   khu:'AH2', cd:'Hàn', da:'—', gc:''},
      {ten:'HUỲNH HỒNG QUÂN',     spm:'quanhh',   khu:'AH2', cd:'Hàn', da:'—', gc:''},
      {ten:'TRẦN MINH TIẾN',      spm:'tientm',   khu:'AH2', cd:'Hàn', da:'—', gc:''},
      {ten:'NGUYỄN DUY KHANG',    spm:'khangnd',  khu:'AH3', cd:'Hàn', da:'—', gc:''},
      {ten:'PHẠM HOÀNG LONG',     spm:'longph1',  khu:'AH3', cd:'Hàn', da:'—', gc:''},
      {ten:'VÕ HOÀNG SANG',       spm:'sangvh',   khu:'AH4', cd:'Hàn', da:'—', gc:''},
      {ten:'VÕ TUẤN VŨ',          spm:'vuvt',     khu:'AH4', cd:'Hàn', da:'—', gc:''},
      {ten:'TRẦN NGUYỄN ĐẠI PHÁT',spm:'phattnd',  khu:'AH6', cd:'Hàn', da:'—', gc:''},
      {ten:'NGUYỄN NGỌC CHUNG',   spm:'chungnn',  khu:'AH9', cd:'Hàn', da:'—', gc:''},
      {ten:'TRẦN VĂN DƯƠNG',      spm:'duongtv',  khu:'AH9', cd:'Hàn', da:'—', gc:''}
     ]},
    {id:'son', ten:'Team QC Sơn & Đóng gói', ngan:'Sơn', cd:'p', capNhat:'27/10/2026',
     nguon:'Sheet nhân sự QC_HR_DATA_CENTER (không ghi xưởng) — khu vực TẠM theo xưởng nghiệm thu sơn nhiều nhất trong SPM 30 ngày',
     NGUOI:[
      {ten:'TRỊNH VĂN QUÂN',      spm:'quantrinh',khu:'AH2', cd:'Sơn', da:'—', gc:'Trưởng nhóm · cũng NT nhiều ở AH3', tn:1, tam:1},
      {ten:'NGÔ VĂN ĐỨC',         spm:'ducnv2',   khu:'AH2', cd:'Sơn', da:'—', gc:'', tam:1},
      {ten:'TRỊNH HỮU LỢI',       spm:'loith',    khu:'AH2', cd:'Sơn', da:'—', gc:'', tam:1},
      {ten:'HOÀNG NGỌC TUÂN',     spm:'tuanhn',   khu:'AH2', cd:'Sơn', da:'—', gc:'', tam:1},
      {ten:'NGUYỄN ANH TUẤN',     spm:'tuanna1',  khu:'AH3', cd:'Sơn', da:'—', gc:'', tam:1},
      {ten:'NGUYỄN HOÀNG LONG',   spm:'longnh1',  khu:'',    cd:'Sơn', da:'—', gc:'chưa có lượt NT trong SPM'},
      {ten:'ĐÀO NHỰT HUY',        spm:'huydn1',   khu:'',    cd:'Đóng gói', da:'—', gc:'chưa có lượt NT trong SPM'},
      {ten:'HUỲNH VĂN THON',      spm:'thonhv',   khu:'',    cd:'Đóng gói', da:'—', gc:'chưa có lượt NT trong SPM'}
     ]}
  ]
};
