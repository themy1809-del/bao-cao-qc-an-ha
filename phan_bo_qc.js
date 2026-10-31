/* ============ PHAN BO TEAM QC KICH THUOC — dung cho ban_do_qc.html ============
   Nguon: SO_DO_TEAM_QC_KICH_THUOC_13-10-2026.pdf (Bo phan QC, cap nhat 13/10/2026).
   Sua phan bo: sua mang NGUOI ben duoi roi day len GitHub.
   - spm  : ma QC trong SPM (= phan truoc @ cua email). De '' neu chua biet.
   - khu  : ma khu vuc (khop KHU.id)
   - cd   : cong doan · da : du an / line · gc : ghi chu
   - moi  : nhan su moi · tn : truong nhom · kiem : kiem nhiem tu khu khac
   - vang : dang vang mat (ra site / nghi) — KHONG ghi ly do ca nhan vao day (repo cong khai)
   - anh  : ma file anh chan dung tren Google Drive (user yeu cau gan co dinh 27/10) — CHI ma file anh, KHONG SDT / ngay sinh / link Sheet nhan su
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
    /* 27/10 user: AH9 mo rong them xuong ben trai (khu nha kho goc tren-trai mat bang). gop -> bam vao mo AH9 */
    {id:'AH9MR', ten:'AH9 mở rộng', mo:'Phần mở rộng của xưởng AH9', x:62, y:100, w:228, h:235, cao:44, spmX:'', gop:'AH9'},
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
    {ten:'VŨ ĐẠI PHONG', anh:'17u0_0Uf75sj2_WaemSGZxHXt7NgW_ZUO',          spm:'',         khu:'AH1',   cd:'Sơ chế',          da:'Cắt – Khoan – Chấn · truy xuất vật liệu', gc:''},
    {ten:'LÊ MINH TRÍ', anh:'12v-ZFiWW0H4TgpqWlw7BJIX5EqOc4j5K',           spm:'',         khu:'AH1',   cd:'Sơ chế · Truy xuất', da:'Xưởng AH1', gc:'', moi:1},
    {ten:'NGUYỄN VĂN HIẾU', anh:'1VNzna2z4qcDzTl5TOB9d_0YEiFV1ysoG',       spm:'hieunv2',  khu:'AH2',   cd:'Fitup · Final',   da:'Line 2 – AH2', gc:'kiêm Danieli AH2 MR'},
    {ten:'NGUYỄN VĂN KIÊN', anh:'1dV4bPgHPJ0DbBCTZuAddp90guyFRWNBc',       spm:'kiennv',   khu:'AH2',   cd:'Fitup · Final',   da:'Line 1 – AH2', gc:'kiêm Danieli AH2 MR'},
    {ten:'KHƯƠNG HỒNG QUÂN', anh:'1todgXYbV2VkLtTrC4nepl9A_jfTVQhLt',      spm:'quankh',   khu:'AH2',   cd:'Fitup · Final',   da:'Cẩu KONE – Line 3', gc:''},
    {ten:'NGUYỄN VĂN TRÌNH', anh:'1vBE3B9OysDcXtAE0TkTwD3i_v9VLWpdf',      spm:'trinhnv',  khu:'AH2',   cd:'Fitup · Final',   da:'Cẩu KONE · Ducting EVAPCO', gc:''},
    {ten:'NGUYỄN TRÍ HẢO', anh:'1xu1ZSDLKwkZxCgXZXDdlEI41U8D6Z6yU',        spm:'haont',    khu:'AH2',   cd:'Fitup · Final',   da:'chưa giao line', gc:'đã đi làm lại (27/10)'},
    {ten:'PHAN TRƯỜNG ĐÔNG', anh:'1RrKgn0JlNWxthRACutnbkTh9npv6c82p',      spm:'dongpt',   khu:'AH3',   cd:'Fitup',           da:'SVĐ Hùng Vương', gc:'bàn giao lắp thử buồng bi AH9 cho Mỹ'},
    {ten:'HUỲNH NGỌC TƯỜNG', anh:'10nNowg5F3x0jAsZpmqTN1pe2oslvPfKK',      spm:'tuonghn',  khu:'AH3',   cd:'Final',           da:'Hùng Vương', gc:'kiêm lắp thử kết cấu WOLF SUMMIT'},
    {ten:'TRẦN KHẮC CƯỜNG', anh:'159Y8h1KW3Ac5uDWpDSAJgjxoVVa-XgzK',       spm:'cuongtk',  khu:'AH3',   cd:'Fitup · Final',   da:'EVAPCO · Phú Quốc', gc:'hỗ trợ Phú Quốc phần còn lại'},
    {ten:'PHẠM TRƯỜNG VŨ', anh:'1wGGYJ9aDyNqNxOGqgxfzByHhrfN9BkPB',        spm:'vupt',     khu:'AH3',   cd:'Fitup',           da:'SVĐ Hùng Vương · Line 5', gc:'hỗ trợ Final Hùng Vương'},
    {ten:'NGUYỄN XUÂN HÒA', anh:'1_ff5MiB0u4fOQDI1vbAXuNBKtbjmH9N2',       spm:'hoanx',    khu:'AH4',   cd:'Final',           da:'EVAPCO', gc:''},
    {ten:'ĐỖ TẤN VŨ', anh:'1EfLJsAR60I_qnX_NFV7UoQIHR56es3QZ',             spm:'vudt1',    khu:'AH4',   cd:'Fitup',           da:'EVAPCO', gc:'', moi:1},
    {ten:'PHẠM TẤN DƯƠNG', anh:'1pQPh2dOFvv9bdroySfoo7GhjUdDgr8zm',        spm:'duongpt',  khu:'AH4',   cd:'Fitup',           da:'EVAPCO', gc:'từ AH9 · hỗ trợ Hòa Final', moi:1},
    {ten:'TRẦN QUỐC THÁI', anh:'1WWyMTCTVQPevIbp19aHkZnAZ2NbfzSsJ',        spm:'thaitq',   khu:'AH6',   cd:'Final',           da:'Toàn xưởng AH6', gc:'', moi:1},
    {ten:'NGUYỄN HOÀNG GIANG', anh:'1-Myh3ANpXmrJkXO4d2Oq526ER3BaNwT_',    spm:'giangnh',  khu:'AH6',   cd:'Fitup',           da:'Xưởng AH6 · TED AH6', gc:'vắng mặt (27/10)', moi:1, vang:1},
    {ten:'ĐẬU THẾ MỸ', anh:'1234bPm7_ykiu3h4Y_AagE0GU0kwDmWCO',            spm:'mydt',     khu:'AH9',   cd:'Lắp thử',         da:'Buồng bi AH9 · sắp xếp AH6/AH9', gc:'Trưởng nhóm', tn:1},
    {ten:'TRỊNH VĂN TRÒN', anh:'1szmUH4lCL6GruZ2HC40e7g7NN7-uMxgx',        spm:'trontv',   khu:'AH9',   cd:'Final',           da:'Final · Line 1, Line 2 (tất cả dự án AH9)', gc:'cập nhật 27/10'},
    {ten:'BÙI ANH TRƯỞNG', anh:'1BY4xeLRaCogn9PSWxFsyVSJ-t15vIynR',        spm:'truongba', khu:'AH9',   cd:'Fitup',           da:'Fitup · Line 2', gc:'cập nhật 27/10 · trước: Tổ RHT2, RHT3 · TED 2 tổ gia công'},
    {ten:'HỒ TRINH DINH', anh:'1qGhuLoJyAZsYoB1QavdogiMscygCS2GL',         spm:'dinhht',   khu:'AH9',   cd:'Fitup',           da:'Fitup · Line 1', gc:'cập nhật 27/10', moi:1},
    {ten:'HUỲNH HUÂN HUY', anh:'1TtA0WFW_yTV-WW4mzhgYLHQovJ316oXd',        spm:'huyhh',    khu:'AH9',   cd:'—',               da:'TED GCN AH3', gc:'', moi:1},
    {ten:'HUỲNH NGỌC TƯỜNG', anh:'10nNowg5F3x0jAsZpmqTN1pe2oslvPfKK',      spm:'tuonghn',  khu:'AH9',   cd:'Lắp thử',         da:'Kết cấu WOLF SUMMIT', gc:'kiêm từ AH3', kiem:1},
    {ten:'NGUYỄN VĂN HIẾU', anh:'1VNzna2z4qcDzTl5TOB9d_0YEiFV1ysoG',       spm:'hieunv2',  khu:'AH2MR', cd:'—',               da:'DANIELI', gc:'kiêm từ AH2', kiem:1},
    {ten:'NGUYỄN VĂN KIÊN', anh:'1dV4bPgHPJ0DbBCTZuAddp90guyFRWNBc',       spm:'kiennv',   khu:'AH2MR', cd:'—',               da:'DANIELI', gc:'kiêm từ AH2', kiem:1},
    {ten:'NGUYỄN NGỌC TÍNH', anh:'1bqTv5ymz58-dKAdOGXHdOlEKKSDyKvs-',      spm:'tinhnn',   khu:'AH8',   cd:'Lắp thử',         da:'EVAPCO — AH8', gc:'chuyển từ AH4'},
    {ten:'BÙI VÂN ĐIỆP', anh:'1XvUxwFrpN1Fm_2iAmuMLVsC_UOpLnw14',          spm:'diepbv',   khu:'AH9',   cd:'—',               da:'—', gc:'ra site / vắng', vang:1},
    {ten:'NGUYỄN PHAN ĐĂNG QUANG', anh:'1JRnhsOMycPkqiAPIKMXewxLZ8ipcUkTA', spm:'quangnpd', khu:'AH6',   cd:'Fitup · Final',   da:'chưa giao line', gc:'đã đi làm lại (27/10)'},
    {ten:'VÕ TUẤN VŨ', anh:'1HBaFQYOK3jcODNPerDa6o797o_pjUPhJ',          spm:'vuvt',     khu:'AH3',   cd:'DIM',             da:'Xưởng AH3', gc:'cập nhật 31/10 · trước: Team Hàn AH4'}
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
      {ten:'LÊ VIẾT TRỌNG', anh:'1LLZWZO1urUiKwJSnBrCA5lSJ320699n_',       spm:'tronglv',  khu:'AH9', cd:'Hàn', da:'—', gc:'Trưởng nhóm', tn:1},
      {ten:'TRẦN XUÂN PHÁT', anh:'1SeJYMdeGf_KzLnQ3TtFBV5jHXJydFVYa',      spm:'phattx',   khu:'AH2', cd:'Hàn', da:'—', gc:''},
      {ten:'HUỲNH HỒNG QUÂN', anh:'1gKMsaUJym8UUpnevzK7e_5Bj5hzKhjiT',     spm:'quanhh',   khu:'AH2', cd:'Hàn', da:'—', gc:''},
      {ten:'TRẦN MINH TIẾN', anh:'1y5JJYDHZ_wVm4BV-leYkVMJZF4WcK1ds',      spm:'tientm',   khu:'AH2', cd:'Hàn', da:'—', gc:''},
      {ten:'NGUYỄN DUY KHANG', anh:'1vc1Rxw_RwyU6xYOtRqPNonN2mjO13unc',    spm:'khangnd',  khu:'AH3', cd:'Hàn', da:'—', gc:''},
      {ten:'PHẠM HOÀNG LONG', anh:'1ZG23sjPYbmE8fC11Y_J4aAqw_I5f16HD',     spm:'longph1',  khu:'AH3', cd:'Hàn', da:'—', gc:''},
      {ten:'VÕ HOÀNG SANG', anh:'1fbnZU1Nko_LH7-bc6jDmqkcMixuxIYKc',       spm:'sangvh',   khu:'AH4', cd:'Hàn', da:'—', gc:''},
      /* 31/10: VO TUAN VU (vuvt) chuyen sang Team Kich thuoc — DIM AH3 theo user */
      {ten:'TRẦN NGUYỄN ĐẠI PHÁT', anh:'1SB2Aidt-DjIAYahxNTed2giAQq8F6J9k',spm:'phattnd',  khu:'AH6', cd:'Hàn', da:'—', gc:''},
      {ten:'NGUYỄN NGỌC CHUNG', anh:'1x2hj6ia4B3gJPs7ak7G_CTuCafO6qu41',   spm:'chungnn',  khu:'AH9', cd:'Hàn', da:'—', gc:''},
      {ten:'TRẦN VĂN DƯƠNG', anh:'1Ll6aC-2IDYG03BLpjGTAXIlFcYLy8UdD',      spm:'duongtv',  khu:'AH4', cd:'Hàn', da:'—', gc:'cập nhật 31/10 · trước: AH9'}
     ]},
    {id:'son', ten:'Team QC Sơn & Đóng gói', ngan:'Sơn', cd:'p', capNhat:'27/10/2026',
     nguon:'Sheet nhân sự QC_HR_DATA_CENTER (không ghi xưởng) — khu vực TẠM theo xưởng nghiệm thu sơn nhiều nhất trong SPM 30 ngày',
     NGUOI:[
      {ten:'TRỊNH VĂN QUÂN', anh:'1-swiz-sjBU05y6LhSHq-xgJRLW8AgDe1',      spm:'quantrinh',khu:'AH2', cd:'Sơn', da:'—', gc:'Trưởng nhóm · cũng NT nhiều ở AH3', tn:1, tam:1},
      {ten:'NGÔ VĂN ĐỨC', anh:'1Nyk981-aUbArGZ9qTrsQR1c3HJtOupe3',         spm:'ducnv2',   khu:'AH2', cd:'Sơn', da:'—', gc:'', tam:1},
      {ten:'TRỊNH HỮU LỢI', anh:'1midPoIKCEq-THEOWOa29ZcSts24sfKJ9',       spm:'loith',    khu:'AH2', cd:'Sơn', da:'—', gc:'', tam:1},
      {ten:'HOÀNG NGỌC TUÂN', anh:'1badPdDYTy7N3FnNZR5Bh2UlUUrz9Sm2e',     spm:'tuanhn',   khu:'AH2', cd:'Sơn', da:'—', gc:'', tam:1},
      {ten:'NGUYỄN ANH TUẤN', anh:'1pKqMaMBIiDB_UY3gGxCP7aWk-IzKcM7E',     spm:'tuanna1',  khu:'AH3', cd:'Sơn', da:'—', gc:'', tam:1},
      {ten:'NGUYỄN HOÀNG LONG', anh:'1ESpC7JD95eSN-UZcFEJQtLrsZ1O2FN1X',   spm:'longnh1',  khu:'',    cd:'Sơn', da:'—', gc:'chưa có lượt NT trong SPM'},
      {ten:'ĐÀO NHỰT HUY', anh:'1Nc0lyQkv0fb7j4z0RWVLK8nmZImLjOej',        spm:'huydn1',   khu:'',    cd:'Đóng gói', da:'—', gc:'chưa có lượt NT trong SPM'},
      {ten:'HUỲNH VĂN THON', anh:'1ZEweu0MtcJqhq-eA9niJm33PYpFTx10J',      spm:'thonhv',   khu:'',    cd:'Đóng gói', da:'—', gc:'chưa có lượt NT trong SPM'}
     ]}
  ]
};
