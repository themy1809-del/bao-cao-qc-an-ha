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
  /* Khu vuc tren mat bang (toa do theo so do tong mat bang NM An Ha, don vi px tren mat phang 1440x800).
     spmX = ten xuong trong SPM (de doi chieu so lieu that). AH1/AH8/AH2 MR khong co trong SPM. */
  KHU: [
    {id:'AH9',   ten:'AH9',    mo:'Xuất hàng — Fitup / Final', x:275, y:30,  w:220, h:215, cao:64, spmX:'AH9'},
    {id:'AH4',   ten:'AH4',    mo:'Fitup / Final — EVAPCO',     x:980, y:15,  w:390, h:118, cao:58, spmX:'AH4'},
    {id:'AH1',   ten:'AH1',    mo:'Sơ chế — Cắt · Khoan · Chấn', x:980, y:140, w:390, h:105, cao:54, spmX:''},
    {id:'AH6',   ten:'AH6',    mo:'Fitup / Final',              x:270, y:262, w:370, h:158, cao:56, spmX:'AH6'},
    {id:'AH3',   ten:'AH3',    mo:'Fitup / Final — hàn',        x:655, y:250, w:215, h:510, cao:70, spmX:'AH3'},
    {id:'AH2',   ten:'AH2',    mo:'Fitup / Final',              x:885, y:250, w:340, h:390, cao:70, spmX:'AH2'},
    {id:'AH2MR', ten:'AH2 MR', mo:'Gia công lắp thử DANIELI (Mock-up)', x:885, y:648, w:340, h:112, cao:46, spmX:''},
    {id:'AH8',   ten:'AH8',    mo:'Lắp thử EVAPCO', x:1262, y:300, w:120, h:150, cao:44, spmX:'', chuaRoViTri:true}
  ],
  /* Khu phu tro chi de ve (khong co QC) */
  PHU: [
    {ten:'Kho vật tư (thép tấm & hình)', x:510, y:25,  w:440, h:215},
    {ten:'Packing',                      x:893, y:258, w:150, h:70},
    {ten:'Phòng họp',                    x:1262, y:560, w:95,  h:100}
  ],
  NGUOI: [
    {ten:'VŨ ĐẠI PHONG',          spm:'',         khu:'AH1',   cd:'Sơ chế',          da:'Cắt – Khoan – Chấn · truy xuất vật liệu', gc:''},
    {ten:'LÊ MINH TRÍ',           spm:'',         khu:'AH1',   cd:'Sơ chế · Truy xuất', da:'Xưởng AH1', gc:'', moi:1},
    {ten:'NGUYỄN VĂN HIẾU',       spm:'hieunv2',  khu:'AH2',   cd:'Fitup · Final',   da:'Line 2 – AH2', gc:'kiêm Danieli AH2 MR'},
    {ten:'NGUYỄN VĂN KIÊN',       spm:'kiennv',   khu:'AH2',   cd:'Fitup · Final',   da:'Line 1 – AH2', gc:'kiêm Danieli AH2 MR'},
    {ten:'KHƯƠNG HỒNG QUÂN',      spm:'quankh',   khu:'AH2',   cd:'Fitup · Final',   da:'Cẩu KONE – Line 3', gc:''},
    {ten:'NGUYỄN VĂN TRÌNH',      spm:'trinhnv',  khu:'AH2',   cd:'Fitup · Final',   da:'Cẩu KONE · Ducting EVAPCO', gc:''},
    {ten:'NGUYỄN TRÍ HẢO',        spm:'haont',    khu:'AH2',   cd:'—',               da:'—', gc:'', vang:1},
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
    {ten:'TRỊNH VĂN TRÒN',        spm:'trontv',   khu:'AH9',   cd:'Final',           da:'Tất cả dự án AH9', gc:''},
    {ten:'BÙI ANH TRƯỞNG',        spm:'truongba', khu:'AH9',   cd:'Fitup',           da:'Tổ RHT2, RHT3 · TED 2 tổ gia công', gc:'luân chuyển từ AH4'},
    {ten:'HỒ TRINH DINH',         spm:'dinhht',   khu:'AH9',   cd:'Fitup',           da:'Line 1', gc:'', moi:1},
    {ten:'HUỲNH HUÂN HUY',        spm:'huyhh',    khu:'AH9',   cd:'—',               da:'TED GCN AH3', gc:'', moi:1},
    {ten:'HUỲNH NGỌC TƯỜNG',      spm:'tuonghn',  khu:'AH9',   cd:'Lắp thử',         da:'Kết cấu WOLF SUMMIT', gc:'kiêm từ AH3', kiem:1},
    {ten:'NGUYỄN VĂN HIẾU',       spm:'hieunv2',  khu:'AH2MR', cd:'—',               da:'DANIELI', gc:'kiêm từ AH2', kiem:1},
    {ten:'NGUYỄN VĂN KIÊN',       spm:'kiennv',   khu:'AH2MR', cd:'—',               da:'DANIELI', gc:'kiêm từ AH2', kiem:1},
    {ten:'NGUYỄN NGỌC TÍNH',      spm:'tinhnn',   khu:'AH8',   cd:'Lắp thử',         da:'EVAPCO — AH8', gc:'chuyển từ AH4'},
    {ten:'BÙI VÂN ĐIỆP',          spm:'diepbv',   khu:'AH9',   cd:'—',               da:'—', gc:'ra site / vắng', vang:1},
    {ten:'NGUYỄN PHAN ĐĂNG QUANG',spm:'quangnpd', khu:'AH6',   cd:'—',               da:'—', gc:'ra site / vắng', vang:1},
    {ten:'TRẦN VĂN DƯƠNG',        spm:'duongtv',  khu:'AH9',   cd:'—',               da:'—', gc:'ra site / vắng', vang:1}
  ]
};
