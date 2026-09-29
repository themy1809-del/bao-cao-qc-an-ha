# CLAUDE.md
# QC Management / Dashboard Project — EVAPCO · DDC Nhà máy An Hạ

> Cập nhật 28/09/2026 sau đợt rà soát toàn bộ repo. Phần bổ sung so với bản trước:
> mục 2B (hệ 3 — dashboard web, chính là repo này) và mục 2C (những gì đã xác minh / chưa xác minh).
> Chi tiết kỹ thuật nằm ở `SYSTEM_ARCHITECTURE.md`, `DATA_MODEL.md`,
> `SECURITY_MODEL.md`, `PERFORMANCE_PLAN.md`.

## 1. ROLE
Act as a careful senior software developer for an existing QC Management System.

The project is already in use/development. Preserve existing behavior unless the user explicitly requests a change.

User: The My — QC manager, DDC An Hạ. Làm việc bằng tiếng Việt.

## 2. PROJECT CONTEXT

### 2A. Hai project Apps Script + VBS trên PC (mã nguồn KHÔNG nằm trong repo này)

- **Hệ 1 "DATA HỒ SƠ"** (`AppsScript_Code.gs.txt`, PHIEN_BAN `'27/09 gre-duct'` trong gói bàn giao,
  bản đang deploy là `'26/09 bit-lo-hong'` Version 9, BẢN CỐ ĐỊNH):
  PC đẩy Excel checklist lúc 17:00 qua web app /exec → mỗi dự án 1 file
  "DATA - <dự án>" (bảng gốc + DATA QC 18 cột + DOI CHIEU + _CHUP + DASHBOARD) → 18:00
  trigger chốt cuối ngày dựng lại DATA QC + dashboard TRUNG TAM CANH BAO - EVAPCO.
- **Hệ 2 "KIEM TRA BC-REV"** (`KIEMTRA_BC_REV.gs.txt`, PHIEN_BAN_BC `'27/09 ban-8'`,
  CHỈ ĐỌC nguồn): quét 19:00 → file riêng "TRUNG TAM KIEM TRA BC & REV"
  (TONG QUAN / CHI TIET / TRA CUU / TIM THAY / NHAT KY REV / DOI CHIEU SX /
  DANH MUC LINK / _HOSO ẩn) + menu 🔎 TRA CUU QC.
  Nội dung: RFI fit-up thiếu FUR, RFI final thiếu DIR/VIR, nâng Rev chưa NT lại,
  đối chiếu đi hàng theo TỪNG cấu kiện với PACKING LIST.
- **PC**: KEO_DULIEU.vbs (đẩy dữ liệu), QUAN_LY.vbs (menu + Task Scheduler 17:00),
  NHAT_KY.txt, DANG_CHAY.khoa.

### 2B. Hệ 3 "DASHBOARD WEB" — **chính là repo này**

Repo `themy1809-del/bao-cao-qc-an-ha`, nhánh `main`, **CÔNG KHAI**, phát qua **GitHub Pages**.
Toàn bộ là trang tĩnh; **không có backend riêng, không có đăng nhập**.

| File | Vai trò | Commit cuối |
|---|---|---|
| `qc.html` | **Dashboard DUY NHẤT** — 11 tab (thêm 06 Dự án 29/09), Doc Control nhúng `app.html?embed=1`, khối Sức khoẻ dữ liệu ở tab 09; lớp giao diện `ux2909` cuối file: cổng vai trò `?vai=`, nhãn trạng thái KPI, chú giải, tóm tắt nhanh | 29/09/2026 |
| `index.html` | **Chỉ chuyển hướng** sang `qc.html` (từ 29/09) | 29/09/2026 |
| `index_backup_1108.html` | Bản lưu `index.html` 11/08 cũ (không ai link tới) | 29/09/2026 |
| `doc.html` | Giao diện Document Control độc lập | 20/09/2026 |
| `qc_backup_truoc_ddc.html` | Bản lưu trước khi thêm Doc Control (`v90 KHSX`) | 20/09/2026 |
| `kiem_tra_waiting.html`, `section_tracker.html` | 2 trang phụ độc lập | 11/08/2026 |
| `qcdata.js` | `window.QCDATA` — 18.733 dòng SPM, 1,26 MB, **đẩy tay từ PC** | 27/09/2026 |
| `ddc_data.js` / `khsx_data.js` / `ncr_data.js` / `aop_data.js` | dữ liệu tĩnh dự phòng | 20/09 → 11/08 |
| `apiurl.js` | `window.QC_ASSIGN_API` = URL Web App phân công QC | 11/08/2026 |
| `spm_flatten.py` | bộ chuyển SPM Pivot → qcdata.js | 13/09/2026 |
| `.github/workflows/capnhat.yml` | **ĐÃ TẮT 29/09** (`if: false`) — trước đây tự sinh qcdata.js, chưa từng chạy; bật lại sẽ đẩy dữ liệu CHƯA KHOÁ | 29/09/2026 |
| **`app.html`** | **APP TRA CỨU riêng biệt** (mới 28/09) — tra 1 mã / tra danh sách / import Excel / xuất Excel / duyệt bản vẽ / tổng quan. Chỉ đọc gviz. | 28/09/2026 |
| **`ddc_core.js`** | Bộ đọc bảng gốc dùng chung — tách **nguyên văn** từ `doc.html`. | 28/09/2026 |
| `dangnhap.html` / `qc_khoa.js` / `khoa_qcdata.py` | **Đăng nhập** (29/09): PC mã hoá `qcdata.js`; trình duyệt giải mã. Chưa khoá thì không làm gì. Xem `HUONG_DAN_DANG_NHAP.md` | 29/09/2026 |

> **Khi sửa `app.html`:** đây là file ĐỘC LẬP, không ảnh hưởng `qc.html`/`doc.html`.
> Logic đọc dữ liệu nằm ở `ddc_core.js` — **đừng viết lại**, hãy gọi `DDC_CORE.*`.
> **Không dùng `onclick` nội tuyến với dữ liệu động** (mã cấu kiện / tên bản vẽ có thể chứa
> dấu nháy → vỡ thuộc tính HTML). Dùng `data-*` + uỷ nhiệm sự kiện như hiện tại.
> `ddc_core.js` là bản sao thứ 3 của `DDC_CORE` (cùng với 2 bản nội tuyến trong
> `doc.html`/`qc.html`) — gộp làm một là việc RIÊNG, phải được duyệt trước.

Luồng: `SPM.xlsx → (python trên PC) → qcdata.js → git push → GitHub Pages → trình duyệt`.
Khi mở trang, JS còn đọc **trực tiếp** nhiều Google Sheet qua `gviz` (NCR live, Quản lý dự án,
KHSX, registry + file dự án cho Doc Control) và gọi Web App phân công QC qua JSONP/POST.

### 2C. Ba lệch pha ĐÃ XÁC MINH — đọc trước khi sửa bất cứ thứ gì
1. ~~`index.html` cũ hơn `qc.html` 2 thế hệ.~~ **Đã xử lý 29/09**: `index.html` chuyển hướng sang `qc.html`.
   Từ nay chỉ sửa `qc.html`; quy tắc "giữ 2 file cùng hành vi" không còn áp dụng cho `index.html`.
2. **`spm_flatten.py` trong repo KHÔNG sinh ra `qcdata.js` đang chạy** (lệch số cột, lệch mảng `Z`,
   lệch giá trị `PL`). Hệ quả: drill-down KHSX theo Hạng mục đang **tắt âm thầm**.
3. **Hệ 1 và hệ 3 đọc bảng gốc bằng HAI bộ khai báo cột khác nhau** (`BD_EP` ↔ `DDC_CORE.buildMap`).
   *(Đính chính 28/09: phần "đọc hai tab khác nhau của registry" là SAI — cả ba hệ đọc
   CÙNG tab `DANH MUC`, vì đó là `getSheets()[0]`. Xem `DATA_MODEL.md` §5.4.)*

### 2D. Quyền chia sẻ Google Sheets — đã khảo sát thật 28/09
**6 file đang mở `anyone: WRITER`** (ai có link cũng sửa được): 3 file PACKING
+ 3 file DATA dự án do chính user sở hữu (`VIOLA_KCT`, `10725-008`, `CHECKLIST_BISON`).
Registry mở `commenter`. 2 file WOLF **không** chia sẻ nên tab Doc Control không đọc được.
File `TRUNG TAM CANH BAO` để `domain daidung.vn · reader` — **đây là mẫu đúng, theo mẫu này**.
Chi tiết + thứ tự xử lý: `SECURITY_MODEL.md` §1bis và §4.

The exact current implementation must be determined from the source code.
Do not invent missing business rules.

## 3. NON-NEGOTIABLE RULES
- Do not delete working functions without explicit approval.
- Do not refactor unrelated code.
- Do not change Google Sheet structure/columns without approval
  (đặc biệt: thứ tự 18 cột DATA QC, tab DOI CHIEU/_CHUP, registry cột A=tên B=id).
- Do not change existing business logic unless explicitly requested.
- Do not create duplicate functions when an existing function can be reused.
- Do not replace the existing architecture just because another architecture is preferred.
- Protect existing integrations and frontend/backend communication.
- Never expose confidential company information.
- Before a large change, inspect dependencies and affected files.

**Quy tắc riêng của project (đã đóng băng với user):**
- Điểm sửa ĐƯỢC PHÉP duy nhất — Hệ 1: `BD_EP`, `CHOT_GIO`.
  Hệ 2: `BD_REV`, `BD_PACK`, `GIO_QUET`, `SX_FILE_ID`. Sửa chỗ khác phải hỏi trước.
- **Hệ 3 (repo này): mọi thay đổi mã ứng dụng phải được user duyệt trước.**
  Riêng `qcdata.js` do PC đẩy — **không sửa tay**, không commit đè.
- KHÔNG bao giờ tạo deployment mới cho /exec. Cập nhật: Deploy → Manage
  deployments → ✏️ → New version (GIỮ NGUYÊN URL — URL nằm cứng trong VBS trên PC).
- Dự án chưa khai BD_EP → hệ thống CHẶN dựng DATA QC ("CHUA KHAI BAO COT").
  KHÔNG khôi phục cơ chế tự đoán cột.
- Hệ 2 chỉ ĐỌC file dự án/packing/SX; chỉ ghi vào file kết quả riêng của nó.
- Mỗi lần sửa code Apps Script: tăng PHIEN_BAN/PHIEN_BAN_BC dạng `'dd/mm mo-ta'`;
  kiểm tra `node --check` + soát trùng tên hàm TRƯỚC khi giao.
- Sửa `qc.html` (`index.html` chỉ là chuyển hướng — giữ nguyên, đừng chép dashboard vào lại);
  sau khi sửa phải đối chiếu `QCDATA.check.f/w/p` và KPI trang Tổng quan — **lệch 0**.
- Số liệu phải có bằng chứng: tải file gốc về đếm lại độc lập trước khi kết luận.

**Bẫy kỹ thuật đã gặp (đọc trước khi sửa):**
- `undefined < 0` là false → chốt chặn cột viết `!(x >= 0)`; `layKhaiBao` đã
  chuẩn hoá mọi cột thiếu = -1, giữ nguyên cơ chế này.
- Google cắt hàm 6 phút → giữ mẫu G_BATDAU/HAN + resume (DQC_XONG/BC_XONG, 30').
- tryLock phải nằm TRONG try (nếu không VBS nhận trang HTML `<!DOCTYPE`).
- Không xoá/tạo lại tab (mất gid + link chia sẻ) — luôn ghi đè tại chỗ.
- "Not applicable"/"-"/"N/A"/"0" = không có giá trị.
- Timezone cả 2 project Apps Script phải là (GMT+07:00) Ho Chi Minh.
- Packing: Bison/Viola cột "SL đã đi hàng", Gregory "Đã đi hàng" (đừng bắt
  "KL đã đi hàng") — luôn dò cột theo TÊN không dấu.
- **Hệ 3:** `qcdata.js` hiện KHÔNG có mảng `Z` → mọi code đụng `D.Z`/`r[14]`
  phải giữ chốt chặn kiểu `KH_HASZONE` (`qc.html:4110`), đừng bỏ.
- **Hệ 3 — đăng nhập:** trang mới đọc `qcdata.js` phải đặt `<script src="qc_khoa.js">` NGAY SAU nó.
  Đổi định dạng mã hoá thì sửa ĐỒNG THỜI `khoa_qcdata.py` + `dangnhap.html`. Không dùng `window.stop()` trong chốt chặn.
- **Hệ 3:** đừng thêm chỗ nào nhét dữ liệu Sheet vào `innerHTML` mà không escape —
  3 chỗ hở cũ đã vá 29/09 (NCR, ảnh Section, KHSX) — dùng `esc2()`/`_dhEsc()` sẵn có (xem `SECURITY_MODEL.md` §S3).

## 4. UI RULES
- Avoid purple.
- Fit-up: light blue. Final: dark blue. (Quy ước cho UI mới.)
- KPI numbers must be clear and prominent.
- Dashboard should prioritize practical QC information over decoration.
- Preserve the existing visual language unless redesign is explicitly requested.
- Quy ước màu HIỆN CÓ trên các sheet (giữ nguyên): đỏ nhạt #f4cccc = có nợ hồ sơ,
  đỏ đậm #e06666/#ea9999 = đã đi hàng còn nợ (gấp nhất), xanh nhạt #d9ead3 = đủ,
  vàng #fff2cc = dòng dự án / ô nhập, header #1c4587 chữ trắng.
- Quy ước màu HIỆN CÓ trên dashboard web (giữ nguyên): nhận diện đỏ Đại Dũng `#E2231A`,
  Fitup `#2563EB`, Welding `#F59E0B`, Painting `#16A34A`, Final DIM `#0F766E`;
  có 2 theme sáng/tối qua `data-theme`.
- Báo cáo phải để người ngoài đọc hiểu: tên dự án ĐẦY ĐỦ, nói rõ nợ HỒ SƠ GÌ
  kèm số lượng, đơn vị đúng (khối lượng = TẤN), số làm tròn 2 chữ số.

## 5. WORKFLOW
Before editing:
1. Read HANDOFF.md.
2. Read PROJECT_STATUS.md.
3. Read SYSTEM_ARCHITECTURE.md / DATA_MODEL.md (+ SECURITY_MODEL.md, PERFORMANCE_PLAN.md nếu liên quan).
4. Inspect relevant source files.
5. Identify affected functions and dependencies.
6. State the implementation plan for non-trivial changes.

After editing:
1. Review all changed files.
2. Check syntax and references (`node --check` bản copy + grep trùng tên hàm).
3. Check frontend/backend compatibility (VBS ↔ doPost; công thức TRA CUU ↔ số cột CHI TIET/_HOSO;
   `qc.html` ↔ lược đồ `QCDATA.rows`).
4. Check that existing business logic remains intact.
5. Check for likely regressions.
6. Update HANDOFF.md và PROJECT_STATUS.md khi trạng thái dự án thay đổi.

## 6. COMMUNICATION
The user prefers:
- Vietnamese explanations.
- Simple practical English for technical messages/comments when needed.
- Clear steps.
- No unnecessary theory.
- Giao cả việc 1 tin nhắn → tự chia bước làm hết; CHỈ dừng khi kẹt thật hoặc sắp
  xóa/ghi đè dữ liệu; việc trải nhiều dự án chia subagent và soát bằng chứng
  từng tác tử; kết thúc nêu "Tôi đã làm" + "Anh cần làm".
- Thông tin không xác minh được → ghi **UNKNOWN — NEED USER CONFIRMATION**, không đoán.

Use this report format:
DONE:
CHANGED:
NOT CHANGED:
TESTED:
RISK:
NEXT STEP:
