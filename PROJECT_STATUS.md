# PROJECT_STATUS.md
# Cập nhật: 28/09/2026 — sau đợt rà soát toàn hệ thống (audit)

## STATUS

### DONE
**Hệ 1 "DATA HỒ SƠ" (Apps Script + VBS)**
- Hoàn chỉnh, đóng băng (BẢN CỐ ĐỊNH). Bản ĐÃ deploy: `'26/09 bit-lo-hong'` **Version 9**
  (26/09 12:53), URL /exec giữ nguyên. Bản trong gói bàn giao `'27/09 gre-duct'` **chưa dán**.
- Đồng bộ PC→Google: ghi đè tại chỗ (giữ gid), DOI CHIEU KHOP/LECH, chunk thích ứng,
  retry phân loại lỗi, khoá `DANG_CHAY.khoa`, `TimFileMoiNhat`, trim dòng/cột rỗng, ngày ISO.
- Chốt cuối ngày: PC 17:00 (Task Scheduler) + Google 18:00 (`chotCuoiNgay`, `chotTiep` mỗi 2',
  `CHOT_GIO = 18`).
- `BD_EP` toàn quyền — **11 khai báo đã xác minh trong mã**; dự án CHƯA khai → CHẶN dựng
  + báo "CHUA KHAI BAO COT".
- `kiemChung` 11 hạng mục + đối chiếu ngược; CHECKLIST_BISON U1 & GREGORY 11/11 DAT.
- Đã sửa & xác minh: TED tieuDe 4 → 878 CK; 10726-054 → 32 CK; 10726-043 WOLF → 20.286 CK.
- Dashboard cảnh báo (quy tắc B, chuẩn hoá Milestone/Xưởng, VIOLA trong `CB_LOC`).

**Hệ 2 "KIEM TRA BC-REV" (Apps Script, chỉ đọc)**
- `ban-1 → ban-8` hoàn chỉnh trong gói bàn giao (`PHIEN_BAN_BC = '27/09 ban-8'`).
  Đã đối chiếu byte-for-byte: file user gửi 28/09 **giống hệt** file trong gói bàn giao.
- Nội dung: nợ FUR / DIR-VIR, Rev + NHAT KY REV, DOI CHIEU SX, TRA CUU tương tác + `_HOSO`
  + menu 🔎 + TIM THAY, DANH MUC LINK, đối chiếu PACKING per-piece.
- Kiểm chứng độc lập TED: nợ đúng 22 CK DIR/VIR, FUR = 0 — khớp dashboard 100 %.
- ban-7 ĐÃ CHẠY 16:58 27/09: GREGORY 57 CK đã đi hàng còn thiếu DIR/VIR; BISON U1/U2 = 0;
  TED 22 ✓; WOLF 747 (chưa đi hàng); GREGORY DUCTING 5.

**Hệ 3 "DASHBOARD WEB" (repo này) — mới được rà soát 28/09**
- Đã dựng lại toàn bộ kiến trúc từ mã nguồn thật, có bằng chứng theo dòng mã.
- Đã đếm lại `qcdata.js` bằng script: **18.733 dòng × 14 phần tử**, 115 dự án, 5 xưởng,
  45 tổ, 55 QC viên; QCDate 2025-07-09 → 2026-09-27; `check = {f:39720.8, w:35355.6, p:26426.0}` tấn.
- Đã lập **bộ 7 tài liệu chuẩn**: `CLAUDE.md`, `HANDOFF.md`, `PROJECT_STATUS.md`,
  `SYSTEM_ARCHITECTURE.md`, `DATA_MODEL.md`, `SECURITY_MODEL.md`, `PERFORMANCE_PLAN.md`.
- Skill tài khoản `qc-evapco-dongbo` đã lưu.

### IN PROGRESS
- **Chờ user DUYỆT KIẾN TRÚC.** Theo yêu cầu 28/09: "Do NOT modify application code yet" —
  phiên này **không sửa một dòng mã ứng dụng nào**, chỉ tạo/cập nhật tài liệu.
- Chờ user trả lời 3 câu chặn (xem `HANDOFF.md` §2):
  1. Repo công khai là cố ý hay vô ý?
  2. Link dashboard phát cho nhân viên là `/` (index.html) hay `/qc.html`?
  3. Bản `spm_flatten.py` thật đang chạy trên PC?
- Việc cũ vẫn treo: user dán hệ 1 `'27/09 gre-duct'` (cần New version) và hệ 2 `ban-8`,
  rồi chạy `chayTatCa`/`kiemChung` và `quetTatCa` — **chưa có bằng chứng đã làm**.

### TODO (đã xếp lại ưu tiên sau audit)
**Cao — hệ 3**
1. Quyết định repo public/private + xử lý khoá `'anha2026'` lộ trong `qc.html`/`index.html`.
2. Chốt trang chính thức, rồi đồng bộ `index.html` với `qc.html` (hoặc chuyển hướng).
3. Lấy `spm_flatten.py` thật → sửa/tắt `.github/workflows/capnhat.yml` cho khỏi ghi đè
   `qcdata.js` bằng cấu trúc sai.

**Trung bình — hệ 3**
4. Bỏ vòng poll tải lại **1,26 MB mỗi 180 giây** (`PERFORMANCE_PLAN.md` A1).
5. Escape 3 chỗ `innerHTML` còn hở (`SECURITY_MODEL.md` S3).
6. Nạp theo yêu cầu cho `xlsx`/`jspdf`/`html2canvas`/`ddc_data.js`.

**Thấp — hệ 3**
7. Thêm `.gitignore`, gỡ `__pycache__/spm_flatten.cpython-310.pyc`.
8. Bổ sung 2 tài liệu đang bị tham chiếu mà không tồn tại:
   `HUONG_DAN_VAN_HANH.md`, `HUONG_DAN_PHANCONG_WEBAPP.md`.

**Hệ 1 & 2 (giữ nguyên từ bản 27/09)**
9. Đưa 6 dự án SX-only vào hệ thống QC (ưu tiên 10725-003 đã giao 2.867 tấn, 10725-007 255 tấn;
   còn 10725-012, 10725-092, 10626-025, 10726-046).
10. Vệ sinh hệ 1: xoá hàng VIOLA_TED cũ trong DANH MUC DU AN; archive deployment cũ `AKfycbzJT…`;
    xác nhận timezone (GMT+07:00) ở CẢ 2 project.
11. Hỏi user về packing DUCTING (TED/WOLF) — 3 file hiện có chỉ là Steel Structure.
12. WOLF 10726-043: khuyên bên Excel bỏ tab trùng (Checklist vs Checklist_QC) + Sheet1 rỗng.

### BLOCKED
- **Duyệt kiến trúc** → chưa được sửa mã ứng dụng (chặn mục 1–6 của TODO).
- **Repo public/private** → chỉ user quyết. Repo private + GitHub Pages cần gói trả phí,
  nên phải có phương án phát dashboard thay thế trước khi chuyển.
- **`spm_flatten.py` thật** → nằm trên PC user, Claude không truy cập được.
- **Xác minh số "đã đi hàng còn thiếu hồ sơ" chính thức** → chờ user chạy `quetTatCa` ban-8.
- **6 dự án SX-only** → chờ user quyết + kéo PKL lên.
- **Script id hệ 2** + **mã nguồn/script id Web App phân công QC** → chờ user cung cấp.
- Hàng TEST trong danh mục: ĐÃ XOÁ ✓. Hàng VIOLA_TED cũ (`1xsZ0su…`): **VẪN CÒN** — user cần xoá.

### KNOWN BUGS
**Mới phát hiện 28/09 (đều đang MỞ, chưa sửa):**
- Drill-down KHSX theo Hạng mục **tắt âm thầm** — `qcdata.js` không có mảng `Z`,
  `KH_HASZONE` (`qc.html:4110`) = false. Nguyên nhân gốc: `spm_flatten.py` lệch bản thật.
- `index.html` (trang chủ Pages) thiếu **188 hàm** so với `qc.html`: 9 tab thay vì 10,
  tab 05 là "Dự án" bản cũ, không có tab 10 KHSX. Logic lõi 2 file **giống hệt**.
- **(hệ 1)** Dashboard cảnh báo **báo thừa cột "Chưa có DIR"** cho dự án dùng chung
  cột DIR/VIR — `capNhatCanhBao` không áp ngưỡng `AD` như `taoDataQC`. Cột "Chưa đủ HS" vẫn đúng.
- **(hệ 1 ↔ hệ 2)** Hai hệ đếm "nợ final" **khác định nghĩa** → số của
  "TRUNG TAM CANH BAO" và "TRUNG TAM KIEM TRA BC & REV" không so trực tiếp được.
- Khoá `'anha2026'` lộ trong mã client trên repo công khai → ai cũng ghi đè được bảng phân công QC.
- 3 chỗ nhét dữ liệu Google Sheet vào `innerHTML` **không escape** (XSS lưu trữ).
- `.github/workflows/capnhat.yml` có thể ghi đè `qcdata.js` bằng cấu trúc sai (mất `Miễn QC`).
- `__pycache__/*.pyc` bị commit; repo không có `.gitignore`.

**Hệ 1 & hệ 2:** không còn bug MỞ nào đã biết trong mã.
Theo dõi (không phải bug): file packing / SX đổi tên cột hay bố cục → `layPacking_` /
`ghiDoiChieuSX_` dò theo tên, nhưng đổi hẳn thì phải cập nhật đúng 1 chỗ tương ứng.

## CURRENT STATE
Last meaningful change: **28/09 — rà soát toàn hệ thống, dựng lại kiến trúc từ mã nguồn,
lập bộ 7 tài liệu chuẩn. KHÔNG sửa mã ứng dụng (đúng yêu cầu của user).**
Thay đổi mã gần nhất trước đó: 27/09 `qcdata.js` (`fba9e18`, PC đẩy);
20/09 `qc.html` v100 COMPONENT CONTROL.
Current task: chờ user duyệt kiến trúc + trả lời 3 câu chặn.
Next required action: xem `HANDOFF.md` §2 "Exact next action".

## RELEASE SAFETY
Phiên 28/09 **không phát hành gì** — chỉ thêm/cập nhật tài liệu `.md`.
- [x] Existing functions checked — **không đụng tới hàm nào**
- [x] Existing data structure preserved — **không đổi cấu trúc dữ liệu nào**
- [x] Frontend/backend compatibility — **không đổi giao diện gọi nào**
- [x] Regression risks reviewed — **rủi ro hồi quy = 0** (chỉ thêm file `.md`)
- [ ] Manual verification của 3 phát hiện lớn — **cần user xác nhận** trước khi sửa

Checklist bắt buộc cho MỌI lần phát hành sau này (hệ 3):
- [ ] `QCDATA.check.f/w/p` và KPI trang Tổng quan **lệch 0** trước ↔ sau
- [ ] `qc.html` và `index.html` cùng hành vi (hoặc nói rõ lý do chỉ sửa 1 file)
- [ ] Mở thử `qc.html` với cache sạch: splash tắt, không có lỗi trong `window.__ERRS`
- [ ] Tab 05 Doc Control tải được ít nhất 1 dự án live (không rơi về seed)
