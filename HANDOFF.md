# HANDOFF.md
# Current Project Handoff

> Cầu nối giữa các phiên Chat/Cowork và Claude Code Cloud. Cập nhật mỗi khi xong việc lớn
> hoặc đổi việc đang làm.
> **Cập nhật lần cuối: 29/09/2026 — nâng cấp dashboard `qc.html`, trang chủ chuyển hướng về `qc.html`.**
> Bản 27/09 chỉ mô tả hệ 1 + hệ 2. Bản này bổ sung **hệ 3 (dashboard web = repo này)**
> đã được dựng lại từ mã nguồn thật, và ghi rõ các lệch pha đã xác minh.

## 1. PROJECT
Project name: Hệ thống hồ sơ QC thép EVAPCO — DDC An Hạ (đồng bộ + kiểm tra + dashboard).
Purpose: Tự động kéo Excel checklist QC lên Google Sheets, dựng bảng chuẩn DATA QC 18 cột
cho từng dự án, tự kiểm chứng, cảnh báo thiếu hồ sơ, theo dõi nâng Rev, đối chiếu
đi hàng theo từng cấu kiện với packing list, và trình bày toàn bộ trên dashboard web.

Current deployment / environment:
- **Hệ 1 "DATA HỒ SƠ"**: Apps Script id `1vSH9wS0aen0UH62_b0vjC2SzKJuEppVQWxNw1HV6L9OJ6qUvejMpj9FQ`,
  code = `AppsScript_Code.gs.txt`. Bản trong gói bàn giao = `'27/09 gre-duct'` (**chưa dán**);
  bản ĐÃ deploy = `'26/09 bit-lo-hong'` **Version 9** (26/09 12:53). Web app /exec:
  `https://script.google.com/macros/s/AKfycbwYnGKYdxVb6BdrZzpDuDzqhfwCs_hQSeminIHHk-KbMVKnOIYqeVfKk9LhcY2Nb7X1uA/exec`
  (TOKEN `thau2026`; kiểm tra sống: mở /exec → `READY - phien ban dang chay: …`).
- **Hệ 2 "KIEM TRA BC-REV"**: project Apps Script riêng —
  **UNKNOWN — NEED USER CONFIRMATION: script id** (xem tab `DANH MUC LINK` nhóm B).
  Code chuẩn = `KIEMTRA_BC_REV.gs.txt` `'27/09 ban-8'`. Không có deployment.
  *(Đã đối chiếu: file user gửi lên 28/09 và file trong gói bàn giao **giống hệt nhau**.)*
- File kết quả hệ 2 "TRUNG TAM KIEM TRA BC & REV" (ĐÃ XÁC NHẬN):
  `1PlIysoeBO0GLxx849iEA3Biu8l0I496V7Kauf1-UJCo` — bản ban-7 đã chạy 16:58 27/09.
- **Hệ 3 "DASHBOARD WEB" = repo `themy1809-del/bao-cao-qc-an-ha`**:
  nhánh `main`, **repo CÔNG KHAI** (`private: false`), **GitHub Pages BẬT** (`has_pages: true`),
  có `.nojekyll`. 50 commit, toàn bộ do `Themy <themy1809@gmail.com>` đẩy từ PC.
  **Từ 29/09: `qc.html` là dashboard DUY NHẤT.** `index.html` chỉ còn là trang chuyển hướng
  sang `qc.html` (giữ nguyên `?query` và `#hash`). Bản 11/08 cũ lưu ở `index_backup_1108.html`.
  Link chung: `https://themy1809-del.github.io/bao-cao-qc-an-ha/` → tự mở `qc.html`.
- **PC Windows**: KEO_DULIEU.vbs + QUAN_LY.vbs + NHAT_KY.txt + DANG_CHAY.khoa, Task Scheduler
  17:00 hằng ngày (chế độ 1). Đường dẫn thư mục trên PC: **UNKNOWN — NEED USER CONFIRMATION**.

## 2. CURRENT TASK

**MỚI 29/09 (vòng 8): nâng cấp tab Chất lượng + Bảng điều khiển KHSX** (đã lên `main`).
- Tab 07 Chất lượng (khối `cl2909`): xu hướng FPY 12 tháng + tấn lỗi mã/rớt; lỗi mã theo tổ (dùng `fpyCalc`);
  NCR theo tháng bỏ 2 trục tung → 2 khung; 8M vòng → thanh ngang; tên dự án đầy đủ; escape dữ liệu Sheet NCR.
  Đối chiếu: FPY T9 99,51% = KPI; tổng lỗi mã theo tổ 54,3 t = KPI.
- Tab 11 KHSX (khối `kh2909`): thêm tab con **"Bảng điều khiển"** làm trang mở đầu — 4 ô số (phân bổ, tiến độ chung,
  quá hạn, đến hạn 7 ngày), dòng chảy 6 công đoạn, lịch đến hạn theo xưởng × tuần (bấm ô xem danh sách),
  20 dự án kèm mốc gần nhất (bấm dòng → `khDrill`). Chỉ trình bày lại `_khLive` bằng đúng công thức `_khTq`/`_khLiveDraw`.
  5 tab con cũ giữ nguyên. Đối chiếu trên dữ liệu mẫu đúng cấu trúc sheet: quá hạn, đến hạn 7 ngày, tiến độ chung,
  phân bổ, ráp HT — khớp tab cũ. **Chưa chạy với sheet thật** (máy phát triển bị chặn Google).
- **Đăng nhập (khoa_qcdata.py / dangnhap.html / qc_khoa.js)**: chỉ ở nhánh `claude/audit-existing-system-hjmvx9`,
  CHƯA gắn, CHƯA lên `main` — chờ user cho phép.

---

**MỚI 29/09 (vòng 7): giao diện đa người dùng — "ai nhìn cũng hiểu".** Chỉ thêm lớp trình bày
(khối `<style id="ux2909">` + script cuối `qc.html`), **không đổi cách tính số nào** — KPI 6/6 khớp,
`QCDATA.check` không đổi, bảng tab Dự án giống từng ký tự.
| Việc | Chi tiết |
|---|---|
| Sửa tràn ngang | Trước: điện thoại 390px bị phình 637–916px ở 6 tab; màn rộng 1500px bị phình ở Tổng quan + Báo cáo ngày. Nguyên nhân: ô lưới `.r2/.r23/.kpis` mặc định `min-width:auto`. Sau: 11/11 tab đúng bề rộng ở 390 / 1280 / 1500px |
| Dòng phụ KPI | bỏ cắt "…" → xuống dòng (trước đó phần phân tuổi Waiting bị cắt mất) |
| Bỏ huy hiệu nổi | "BẢN MỚI 20/9 v100 · COMPONENT CONTROL ✓" cố định góc phải, đè lên bảng/biểu đồ ở mọi tab |
| Nhãn trạng thái KPI | ✓/✕/! + chữ, **chỉ** cho KPI có ngưỡng thật trong mã (bảng `KST`) — nhiều KPI dùng lớp `b` chỉ để tô màu nhấn, không gắn nhãn. NCR: nếu chưa đọc được sheet live thì ghi "? Chưa đọc được NCR live" thay vì "không có phiếu" |
| Số CHƯA ĐẠT ở theme tối | trước hiện màu XANH LÁ (màu nhấn theme tối) → nay đỏ |
| Tóm tắt nhanh | đầu tab Tổng quan: Cần chú ý / Đang tốt / Tồn chờ NT — đọc lại chính các KPI đã vẽ |
| Chú giải thuật ngữ | nút "ⓘ Chú giải" + ⓘ cạnh nhãn KPI; 19 mục, chỉ ghi điều đọc được trong mã |
| Cổng vai trò | Ban Giám đốc / Quản lý QC / QC viên / Sản xuất / Hồ sơ — đổi thứ tự menu + trang mở đầu; link riêng `?vai=gd|qlqc|qcv|sx|hs`; nhớ trên máy (`localStorage qcVaiTro_v1`). Lần đầu vào (link không tham số) hiện thẻ mời chọn, không chặn trang. Link `?qc=…` cũ vẫn chạy |
| Biểu đồ công đoạn | thẻ hẹp thì xếp dọc thanh + vòng tỉ trọng, không cắt nhãn |

**Chưa làm (cần duyệt vì là đổi biểu đồ):** 2 biểu đồ 2 trục tung (sản lượng ngày + %; NCR số vụ + kg)
nên tách làm 2; vòng "Top dự án" 7 lát nhãn bị cắt → nên đổi sang thanh ngang; ô chọn ngày hiện
theo ngôn ngữ trình duyệt.

---

**MỚI 29/09 (vòng 6): rà soát số liệu + nâng cấp dashboard** theo yêu cầu "kiểm tra rà soát số liệu,
nâng cấp, đưa dữ liệu vào tab Doc Control, thêm bớt bỏ để vận hành chuyên nghiệp".

Rà soát số liệu (`qcdata.js` 28/09: 18.826 dòng, 115 dự án) — đếm lại độc lập bằng Python:
- `QCDATA.check` f/w/p khớp tổng `rows`; `proj[]` khớp `rows` **115/115** dự án (không đếm trùng).
- KPI Tổng quan tháng 9/2026 **khớp 6/6**: 4.165,4 · 3.688,9 · 3.536,2 · 3.189,2 · Waiting 5.797,2 t · FPY 99,5 %.
- Dải "Tỷ lệ QC NT/SX" 82,8 % = 10.018,4 / 12.095,6 t — khớp.
- 290 dòng giống hệt nhau = va chạm khi làm phẳng SPM (mất Zone/Xưởng QC) — **không phải đếm trùng**.
- PL ↔ ngày QC nhất quán 100 %. 5 dòng tồn = 0 tấn.
- **131 dòng ngày NT trước ngày gia công** (518,4 t; >3 ngày: 9 dòng) = lỗi nhập SPM, không phải lỗi dashboard.
- **Waiting: 2.546,1 t (44 %, 734 dòng) đã chờ >90 ngày** → con số Waiting đúng nhưng dễ hiểu sai;
  đã thêm dòng phân tuổi ngay dưới KPI, **không đổi con số**.

Đã sửa (chỉ `qc.html`, `index.html`, `app.html`; KHÔNG đụng `qcdata.js`/`doc.html`/Apps Script):
| Việc | Chi tiết |
|---|---|
| Trang chủ | `index.html` → chuyển hướng `qc.html`; bản cũ lưu `index_backup_1108.html` |
| Tab **06 Dự án** (khôi phục) | View "tiến độ & tồn so với BOM" của bản 11/08 bị Doc Control đè `rDU` → mất. Giữ lại qua `var rPJ=rDU;` trước chỗ đè; HTML chép nguyên văn từ bản cũ. Tab sau đánh số lại 07→11 |
| Doc Control | nút **🔍 Tra cứu hàng loạt · import Excel** mở `app.html?embed=1` trong khung (nạp lười, lần bấm đầu) |
| `app.html` | chế độ `?embed=1`: ẩn header, theo theme trang mẹ. Mở độc lập thì y như cũ |
| Tổng quan | dưới KPI Waiting: ">90 ngày: X t (Y %)" + "≤30 · 31–90" |
| Tab 09 Dữ liệu | khối **SỨC KHOẺ DỮ LIỆU** tự kiểm 7 mục mỗi lần mở |
| Nhãn | 3 thẻ dải tháng ghi rõ cơ sở ngày (NT vs gia công) — **chỉ đổi chữ, không đổi số** |

Kiểm thử: KPI bản cũ vs bản mới 6/6 KHỚP; bảng tab Dự án giống từng ký tự bản cũ; `/?qc=kientv` →
`/qc.html?qc=kientv` còn giữ bộ lọc; không lỗi JS. Còn để nguyên: mô-đun Doc Control bị lặp 2 lần
trong `qc.html` (`rDU` bị gán ~dòng 5500 và ~5850) — gộp là việc RIÊNG.

**Chờ user:** (1) Waiting có nên tách riêng phần >90 ngày khỏi KPI không (hiện chỉ thêm ngữ cảnh);
(2) dọn 131 dòng ngày NT < ngày gia công và các cây chờ >90 ngày trên SPM.

---

**MỚI 28/09 (vòng 4): đã dựng xong APP TRA CỨU riêng biệt** theo yêu cầu của user
("một app riêng biệt, đa chức năng, tương tác được, import list vào được, giao diện chuyên nghiệp").
Thêm **2 file mới**, **không đụng** `index.html` / `qc.html` / `doc.html`:

| File | Nội dung |
|---|---|
| `ddc_core.js` | Tách **nguyên văn** bộ đọc bảng gốc từ `doc.html` (dòng 123–414). Đã `diff`: giống 100%. `doc.html`/`qc.html` vẫn giữ bản nội tuyến của chúng — gộp lại là việc RIÊNG, phải hỏi trước. |
| `app.html` | App tra cứu độc lập, **chỉ đọc** Google Sheet qua gviz. |

Chức năng `app.html`: chọn & tải nhiều dự án (tải 1 lần → tra cứu chạy tức thì trên máy) ·
tra 1 mã (khớp đúng hoặc một phần) ra thẻ chi tiết + bậc thang tiến độ hồ sơ + cảnh báo nâng Rev ·
**tra nhiều mã: dán danh sách hoặc import `.xlsx/.xls/.csv/.txt`** → bảng kết quả + 5 KPI bấm lọc được
+ xuất Excel · duyệt theo bản vẽ · tổng quan theo xưởng + danh sách nâng Rev · sáng/tối · chạy được trên điện thoại.

**Đã TEST thật** bằng Chromium + giả lập phản hồi gviz (egress ra `docs.google.com` bị chính sách
môi trường chặn — không phải lỗi app): registry → `detectLayout`=A → `buildMap` → `normRow` →
chỉ mục → tra cứu. 7 cấu kiện mẫu: 5 đã mời fitup / 5 đã mời final / 2 chưa / 1 bàn giao / 1 nâng Rev
— **khớp 100%** với số đếm tay. Không còn lỗi JS.

**Lỗi đã bắt được và sửa trong lúc test:** `onclick` nội tuyến dùng `JSON.stringify` sinh dấu nháy kép
**bên trong** `onclick="..."` làm **vỡ thuộc tính HTML** (lọc chip không ăn, mở bản vẽ ra 0 dòng, 2 lỗi JS)
→ đã chuyển sang `data-*` + uỷ nhiệm sự kiện.

**Vòng 5 — stress test + hoàn thiện (28/09):**
- Test với **45.832 cấu kiện** (đúng quy mô `BISON_U2` thật): tải 1,3–2,8s · bộ nhớ 121 MB ·
  tra 1 mã 0,22s · tra 500 mã 1,3s · tab Bản vẽ 0,2s · tab Tổng quan 0,4s · không lỗi JS.
- **Lỗi hiệu năng tìm được:** dán 3.000 mã KHÔNG tồn tại → **44,5 giây đứng máy**
  (mỗi mã không khớp lại gọi `Object.keys(IDX)` dựng lại mảng 45.000 khoá).
  Đã sửa: dựng sẵn `KEYS` một lần + tra **theo lô 150 mã** qua `setTimeout` có hiện tiến độ
  → 24,8s và **không còn đóng băng trình duyệt**.
- **Lỗi đúng/sai nghiêm trọng hơn đã sửa:** khi tra danh sách, mã không khớp đúng thì code lấy
  `hits[0]` của phép **khớp một phần** và trình bày như thể đó chính là cấu kiện cần tra
  → người QC có thể tin nhầm sang **một cây khác**. Nay có nhãn **"khớp một phần"**,
  thẻ số liệu + bộ lọc riêng, và cột **"Kiểu khớp"** trong file Excel xuất ra.
- Thêm **`HUONG_DAN_APP.md`** (hướng dẫn cho người dùng cuối + ràng buộc kỹ thuật + số đo hiệu năng).
- Thêm **`.gitignore`**, gỡ `__pycache__/*.pyc` khỏi repo.

**CÒN LẠI cho app:** chưa chạy thử với **Google Sheet thật** (container bị chặn egress) —
anh mở `app.html` trên máy anh và thử 1 dự án là biết ngay. Hai dự án WOLF sẽ **không tải được**
vì chưa chia sẻ (xem `SECURITY_MODEL.md` §S0c).

**Việc đang làm:** *Rà soát toàn hệ thống (audit) — dựng lại kiến trúc thật từ mã nguồn,
lập bộ tài liệu chuẩn, CHƯA sửa mã ứng dụng.* Yêu cầu của user: "Do NOT modify application
code yet. Do not make major code changes until I approve the architecture."

**Đã làm xong trong phiên này (28/09):**
- Đọc toàn bộ repo: 6 trang HTML, 5 file dữ liệu JS, `spm_flatten.py`, workflow, `apiurl.js`.
- Đọc `AppsScript_Code.gs.txt` (3.904 dòng), `KIEMTRA_BC_REV.gs.txt` (913 dòng),
  `KEO_DULIEU.vbs`, `QUAN_LY.vbs`.
- Đếm lại `qcdata.js` bằng script (không tin tài liệu cũ).
- Tạo/cập nhật 7 tài liệu: `CLAUDE.md`, `HANDOFF.md`, `PROJECT_STATUS.md`,
  `SYSTEM_ARCHITECTURE.md`, `DATA_MODEL.md`, `SECURITY_MODEL.md`, `PERFORMANCE_PLAN.md`.

**3 PHÁT HIỆN LỚN (có bằng chứng, chưa sửa):**

1. **`index.html` — trang chủ GitHub Pages — cũ hơn `qc.html` 2 thế hệ.**
   `index.html` commit 11/08 (`afaa7ad`); `qc.html` commit 20/09 (`bcc0ea8`).
   Đã đo chính xác: `index.html` có **9 tab** (tab 05 là "Dự án" bản cũ, **không có** tab `10 KHSX`),
   **thiếu 188 hàm**, và **không có hàm nào riêng** — tức là **tập con thực sự** của `qc.html`.
   Repo chỉ có **1 nhánh `main`**, không có `gh-pages`, không có `docs/`
   → Pages phục vụ từ `main`/gốc, nên `/` **chắc chắn** trả về `index.html`.
   **Tin tốt:** logic lõi (`F()`, `val()`, `isReject`, `fpyCalc`, `STG`) của 2 file **giống hệt nhau**
   → đồng bộ hoặc chuyển hướng là thao tác **rủi ro thấp**, không mất logic nào.

2. **`spm_flatten.py` trong repo KHÔNG phải bộ sinh ra `qcdata.js` đang chạy.**
   | | `spm_flatten.py` (repo) | `qcdata.js` (đang chạy 27/09) |
   |---|---|---|
   | dài 1 dòng | 15 phần tử (có `[14]` Zone) | **14 phần tử** |
   | mảng `Z` | có | **không có** |
   | giá trị `PL` | …/`Rớt` | …/**`Miễn QC`** (469 dòng) |
   Hệ quả: `KH_HASZONE` (`qc.html:4110`) = false → **drill-down KHSX theo Hạng mục đang tắt âm thầm**.
   Và nếu workflow `capnhat.yml` chạy, nó sẽ ghi đè `qcdata.js` bằng cấu trúc sai → **sai số liệu SX**
   (4 chỗ trong `qc.html` đang lọc bỏ `'Miễn QC'`).

3. **Rủi ro bảo mật: repo CÔNG KHAI + khoá ghi nằm trong mã client.**
   `qc.html:2277` / `index.html:1957` gửi `POST {key:'anha2026', cfg}` tới Web App phân công QC;
   URL nằm ở `apiurl.js`. Cả hai đều công khai → bất kỳ ai cũng ghi đè được bảng phân công
   (email nhận mail nhắc việc, phạm vi xưởng/tổ/dự án). Ngoài ra toàn bộ `qcdata.js`
   (115 dự án, 55 QC viên, sản lượng theo ngày) và `aop_data.js` (KPI/AOP 2026) đang công khai.
   Chi tiết: `SECURITY_MODEL.md`.

**BỔ SUNG 28/09 (vòng 3, đọc trực tiếp Google Drive) — 4 việc GẤP:**

- 🔴 **6 file Google Sheet đang mở `anyone: WRITER`** — ai có link cũng sửa được:
  3 file PACKING (`1Tq3pCRh…`, `1610zRYT…`, `1RCTPxc3…`) + 3 file DATA dự án
  **do chính anh sở hữu** (`VIOLA_KCT` 40.524 CK, `10725-008` 53.966 CK,
  `CHECKLIST_BISON` 45.139 CK = **139.629 cấu kiện**). File packing chính là
  "cơ sở thật của việc đã đi hàng" — sửa được nó là toàn bộ cảnh báo đi hàng sai theo.
  *(File `TRUNG TAM CANH BAO` đang để `domain daidung.vn · reader` — đây là mẫu đúng.)*
- 🟠 Registry mở `commenter` thay vì `reader`.
- 🟡 **2 dự án WOLF không chia sẻ** (`10726-043`, `WOLF QC DINH FITUP`)
  → tab Doc Control trên web **không đọc được**, sẽ hiện lỗi (seed không có 2 dự án này).
- 🔴 **Bằng chứng cứng: hệ 1 `'27/09 gre-duct'` VẪN CHƯA ĐƯỢC DÁN.**
  Tab `BAO CAO DATA QC` ngày 28/09 ghi `EVAPCO - GREGORY - DUCTING` = **"CHUA KHAI BAO COT"**.
  Tab `NHAT KY` ngày 28/09 19:29 vẫn còn dòng **`#ERROR!`** (bug `'=== CHOT CUOI NGAY ==='`).
  Ngoài ra `BISON_U2` 28/09: **+594 mới / −9 mất → "CAN XEM LAI"**, chưa ai xử lý;
  `10725-011`: **+22 VIR** (khớp đúng 22 CK nợ DIR/VIR đã kiểm chứng — có thể đã xong).

**Exact next action — CHỜ USER TRẢ LỜI TRƯỚC KHI SỬA CODE:**

0. **(LÀM NGAY, không cần chờ gì)** Đổi quyền 3 file DATA của anh từ `writer` → `reader`
   và registry từ `commenter` → `reader`; báo trungpt/cuongntk đổi 3 file packing.
   Việc này **không ảnh hưởng hệ nào** (web chỉ cần reader; Apps Script chạy bằng tài khoản anh).
1. **Repo công khai là cố ý hay vô ý?** (quyết định mọi bước bảo mật tiếp theo)
2. **Link dashboard đang phát cho nhân viên là `/` (index.html) hay `/qc.html`?**
   - Nếu là `/` → cần quyết: đồng bộ `index.html` theo `qc.html`, hay đổi `index.html`
     thành trang chuyển hướng sang `qc.html`.
3. **Gửi bản `spm_flatten.py` THẬT đang chạy trên PC** để đồng bộ với repo và sửa `capnhat.yml`.
4. **Cột "Chưa có DIR" trên dashboard cảnh báo báo thừa cho dự án dùng chung cột DIR/VIR
   là LỖI hay CỐ Ý?** (nếu là lỗi thì sửa 1 dòng trong `capNhatCanhBao`, nhưng đây là
   hệ 1 đang đóng băng nên phải có anh duyệt)
5. ~~Tên chính xác của `10725-011`~~ → **ĐÃ TỰ TRA ĐƯỢC**:
   `10725-011 DGRP VIOLA - DUCTING SDM & TED` → có chứa "VIOLA" → **CÓ** khớp `CB_LOC`
   → **CÓ** dính bug báo thừa "Chưa có DIR". Không cần anh trả lời nữa.
6. **6 file mở `anyone: writer` là cố ý hay lỡ tay?**
7. **Có muốn 2 dự án WOLF lên tab Doc Control không?** (muốn thì phải mở public — thêm phơi nhiễm;
   không thì chấp nhận WOLF chỉ có trên Google Sheet, không có trên web)
8. **`WOLF QC DINH FITUP` có cần khai `BD_EP` không?** (hiện đang bị chặn "CHUA KHAI BAO COT")
4. Sau khi user duyệt kiến trúc → thực hiện theo thứ tự trong `SECURITY_MODEL.md` §4
   và `PERFORMANCE_PLAN.md` §3 (giai đoạn A trước, rẻ và rủi ro thấp).

**Việc cũ vẫn treo (hệ 1 + hệ 2, từ bản 27/09 — chưa có bằng chứng đã làm):**
- User dán hệ 1 `'27/09 gre-duct'` → Save → Deploy → Manage deployments → ✏️ → New version
  (GIỮ URL) → ▷ `chayTatCa`/`chayTiep` → ▷ `kiemChung`.
  *Lưu ý:* GREGORY DUCTING đổi mã cấu kiện từ mã SPM `2-00BLK…` sang mã hồ sơ `00BLK…`
  → NHAT KY sẽ báo ~736 mới / 736 mất MỘT LẦN — đúng chủ đích.
- User dán hệ 2 `ban-8` → Save → ▷ `quetTatCa` → kiểm tra `VIOLA_KCT` đã có số ở cột
  "DA DI HANG mà còn thiếu hồ sơ" chưa (ước từ packing: ~13.179 cấu kiện đã đi).
- Xử lý 57 cấu kiện GREGORY đã đi hàng còn thiếu DIR/VIR (tab CHI TIET, lọc B7="CO").

## 3. COMPLETED
- [x] Hệ 1 hoàn chỉnh + đóng băng: đồng bộ ghi đè tại chỗ, DOI CHIEU KHOP/LECH, chunk thích ứng,
      khoá chống chạy chéo, resume 6 phút, ảnh chụp _CHUP + NHAT KY, chốt cuối ngày 17:00/18:00.
- [x] BD_EP toàn quyền trong code (tab BAN DO COT chỉ hiển thị); **11 khai báo** đã xác minh trong mã:
      BISON_U2, CHECKLIST_BISON, VIOLA_KCT, VIOLA_TED, SVĐVINFATS, 10725-011, 10725-009,
      10725-008, 10726-043, 10726-054, `EVAPCO - GREGORY - DUCTING`.
- [x] kiemChung 11 hạng mục + đối chiếu ngược 25 mẫu; các dự án chính 11/11 DAT.
- [x] Bịt lỗ hổng tự đoán cột (26/09): chưa khai BD_EP → CHẶN + báo "CHUA KHAI BAO COT";
      deploy Version 9, URL giữ nguyên.
- [x] Sửa tieuDe TED 7→4; layKhaiBao chuẩn hoá -1; khai 10726-054 và 10726-043 WOLF.
- [x] Dashboard cảnh báo: quy tắc B cột ngày, chuẩn hoá Milestone/Xưởng, VIOLA vào CB_LOC.
- [x] Hệ 2 BC-REV ban-1→ban-8 (mã hoàn chỉnh): nợ FUR/DIR-VIR, Rev + NHAT KY REV,
      DOI CHIEU SX, TRA CUU tương tác + _HOSO + menu 🔎 + TIM THAY, DANH MUC LINK,
      đối chiếu packing per-piece; ban-8 thêm khoá `VIOLA_KCT`.
- [x] Kiểm chứng độc lập TED: nợ đúng 22 CK DIR/VIR, FUR = 0 — khớp dashboard 100 %.
- [x] Skill `qc-evapco-dongbo` đã lưu vào tài khoản user.
- [x] **(28/09) Rà soát toàn bộ hệ 3 + lập bộ 7 tài liệu chuẩn.**

## 4. IN PROGRESS
- Item: Chờ user duyệt kiến trúc sau đợt rà soát; chờ trả lời 3 câu hỏi ở mục 2.
- Related files: `SYSTEM_ARCHITECTURE.md`, `DATA_MODEL.md`, `SECURITY_MODEL.md`, `PERFORMANCE_PLAN.md`.
- Expected result: user chốt phương án → mới bắt đầu sửa mã (giai đoạn A của `PERFORMANCE_PLAN.md`
  và mục 3–5 của `SECURITY_MODEL.md` §4).

## 5. TODO
- ~~Đồng bộ `index.html` ↔ `qc.html`~~ — **XONG 29/09** (chuyển hướng).
- **(MỚI 29/09)** User xác nhận cách hiển thị Waiting >90 ngày; dọn SPM 131 dòng ngày NT < ngày gia công.
- **(MỚI, cao)** Lấy `spm_flatten.py` thật; sửa hoặc tắt `.github/workflows/capnhat.yml`.
- **(MỚI, cao)** Xử lý lộ khoá `'anha2026'` + quyết định repo public/private.
- **(MỚI, trung bình)** Bỏ poll lại 1,26 MB mỗi 180 giây (`PERFORMANCE_PLAN.md` A1).
- **(MỚI, trung bình)** Escape 3 chỗ `innerHTML` còn hở (`SECURITY_MODEL.md` S3).
- **(MỚI, thấp)** Thêm `.gitignore`; gỡ `__pycache__/spm_flatten.cpython-310.pyc`;
  bổ sung `HUONG_DAN_VAN_HANH.md` + `HUONG_DAN_PHANCONG_WEBAPP.md` (đang bị tham chiếu mà không tồn tại).
- Đưa 6 dự án chỉ có bên file SX vào hệ thống QC: 10725-003 (đã giao 2.867 tấn!),
  10725-007 (255 tấn), 10725-012, 10725-092, 10626-025, 10726-046. Ưu tiên CAO với -003/-007.
  Cần user cho PC kéo PKL lên + đọc cấu trúc file thật rồi khai BD_EP (KHÔNG đoán cột).
- Vệ sinh hệ 1 — xoá hàng VIOLA_TED cũ trong DANH MUC DU AN; archive cổng cũ
  `AKfycbzJTmFaBe3HmtG_U2W6XuaeB0kwT6MFB0FMa0ruEM7ry3aIZdSLB4fICG2q10doyBFzcQ`;
  xác nhận timezone GMT+7 ở CẢ 2 project.
- Packing cho DUCTING (TED 10725-011, WOLF...) — 3 file hiện tại chỉ là Steel Structure. Hỏi user.
- BISON U1: xác nhận cột Part No của U1 trùng định dạng packing (00BLB1001-001…).

## 6. BLOCKED
- **Duyệt kiến trúc**: chờ user trả lời 3 câu hỏi ở mục 2 → chưa được sửa mã ứng dụng.
- **Repo public/private**: chỉ user quyết được. Nếu chuyển private thì GitHub Pages của repo
  private cần gói trả phí → cần phương án phát dashboard thay thế.
- **`spm_flatten.py` thật**: Claude không truy cập được PC của user.
- Xác minh số "đã đi hàng còn thiếu hồ sơ" chính thức: chờ user chạy `quetTatCa` ban-8
  (Claude không chạy Apps Script thay user).
- 6 dự án SX-only: chờ user quyết + kéo PKL lên.
- Script id project hệ 2 + script id Web App phân công QC: chờ user cung cấp.

## 7. KNOWN BUGS
| Bug | Vùng ảnh hưởng | Trạng thái | Ghi chú |
|---|---|---|---|
| Drill-down KHSX theo Hạng mục **tắt âm thầm** | `qc.html` `KH_HASZONE` (dòng 4110) | **MỞ** | `qcdata.js` không có mảng `Z`; nguyên nhân gốc = lệch `spm_flatten.py` |
| `index.html` (trang chủ Pages) thiếu Doc Control + KHSX | `index.html` | **ĐÃ SỬA 29/09** | `index.html` chuyển hướng sang `qc.html`; bản cũ = `index_backup_1108.html` |
| Tab "Dự án: tiến độ & tồn" biến mất khỏi `qc.html` | `qc.html` `rDU` | **ĐÃ SỬA 29/09** | khôi phục thành tab 06 qua `rPJ` |
| Mô-đun Doc Control lặp 2 lần trong `qc.html` | `qc.html` ~5500/~5850 | **MỞ** | chạy đúng (bản sau thắng); gộp là việc riêng |
| Dashboard cảnh báo **báo thừa cột "Chưa có DIR"** | hệ 1 `capNhatCanhBao` | **MỞ — chờ xác nhận** | Không áp ngưỡng `AD` như `taoDataQC` → dự án dùng chung cột DIR/VIR (`VIOLA_TED`, `EVAPCO - GREGORY - DUCTING`, có thể cả `10725-011`) bị đếm thừa. Cột "Chưa đủ HS" vẫn ĐÚNG |
| Hệ 1 và hệ 2 đếm "nợ final" **khác định nghĩa** | `capNhatCanhBao` ↔ `quetMotDuAn_` | **MỞ — chờ xác nhận** | Hệ 1 tách riêng DIR/VIR; hệ 2 chỉ tính khi **cả hai** rỗng → số 2 file không so trực tiếp được |
| Khoá `'anha2026'` lộ trong mã client trên repo công khai | `qc.html:2277` (+ `index_backup_1108.html`) | **MỞ** | ai cũng ghi đè được bảng phân công QC |
| 3 chỗ nhét dữ liệu Sheet vào `innerHTML` không escape | `qc.html` NCR list / `secGalRender` / bảng KHSX | **MỞ** | XSS lưu trữ từ người sửa được Sheet |
| `capnhat.yml` có thể ghi đè `qcdata.js` bằng cấu trúc sai | `.github/workflows/capnhat.yml` | **MỞ** | chưa từng chạy, nhưng vẫn kích hoạt được |
| `__pycache__/*.pyc` bị commit; repo không có `.gitignore` | repo | **MỞ** | dọn dẹp |
| Rủi ro: file packing đổi tên cột lần nữa | `layPacking_` | THEO DÕI | dò theo tên không dấu |
| Rủi ro: 'Tổng hợp da' của SX đổi bố cục | `ghiDoiChieuSX_` | THEO DÕI | dò dòng tiêu đề "Tên dự án"; cột E/P/Q cố định vị trí |
| (Hệ 1 & hệ 2) | — | không còn bug mở nào đã biết | |

## 8. IMPORTANT BUSINESS LOGIC
Chỉ ghi quy tắc ĐÃ XÁC MINH trong mã. Chi tiết đầy đủ: `DATA_MODEL.md`.

**Hệ 1 — dựng DATA QC:**
- "Not applicable" / "-" / "N/A" / "0" / trống = **KHÔNG có giá trị** (`khongApDung`, `coGiaTri`).
- **Quy tắc B** (user chốt 24/09): cột NGÀY chỉ bị báo thiếu khi cột SỐ tương ứng có giá trị THẬT (`coThat`).
- Công đoạn mà **cả dự án đều trống** (tỷ lệ < `NGUONG = 0.02`) → coi như dự án không có công đoạn đó,
  **không báo thiếu** (`AD.*`).
- Cột số báo cáo mà nội dung **toàn ngày tháng** → **bỏ trống**, không điền bừa (`cotToanNgay`).
- Dự án 1 file nhiều tab: **tab NHIỀU DÒNG NHẤT** là tab chính (`laTabChinh`) — chỉ tab đó dựng DATA QC.
- 4 chốt an toàn trước khi ghi DATA QC: nguồn thiếu dòng / chưa khai BD_EP / cột mã sai /
  số cấu kiện tụt > 20 % (trừ khi vừa `choPhepGiam()` trong 30 phút).
- `_CHUP`: khoá = **Member punch no**; trạng thái = 4 bit `[RFI fab][VIR][DIR][RFI Gal]`, tiền tố `T`.
- Dashboard cảnh báo chỉ nhận dự án khớp `CB_LOC = ['EVAPCO','BISON','GREGORY','VIOLA']`;
  dự án **đang đồng bộ / đọc lỗi → GIỮ số liệu lần trước**, không để trống bảng;
  "Đủ hồ sơ" = cột `Cảnh báo` RỖNG; "Chưa mời NT" = `thieu(RFI fab)`;
  "Chưa có DIR/VIR" = `coGiaTri(RFI fab) && thieu(DIR/VIR)` — **không** áp ngưỡng `AD`
  (xem bug ở §7). Giới hạn danh sách cấu kiện `CB_MAX = 45.000`.
- `kiemChung` có **12 hạng mục (0→11)**; mục 0 = "chưa khai `BD_EP`" thì dừng luôn,
  không chấm 11 mục còn lại bằng cột đoán mò.
- Milestone/Xưởng chuẩn hoá hoa/thường/khoảng trắng KHI GỘP NHÓM (không sửa dữ liệu gốc).
- BISON_U2: `Guid = Member punch no` là **CỐ Ý** (đối tác chạy code theo punch).
- VIOLA_TED/10725-011 và GREGORY DUCTING: DIR và VIR chung 1 cột → **chỉ điền VIR, DIR để trống**.

**Hệ 2 — rà nợ báo cáo:**
- Nợ fit-up: **có RFI FUR (cột 17)** mà **FUR Report (cột 18) trống**.
- Nợ final: **có RFI fab (cột 5)** mà **VIR (7) VÀ DIR (9) đều trống**.
- Rev: đã nghiệm thu ở rev X (cột Rev NT), bản vẽ đang rev Y ≠ X → **CẦN NGHIỆM THU LẠI**;
  rev đổi giữa 2 lần quét → ghi NHAT KY REV kèm tình trạng đã NT ở rev cũ hay chưa.
- Cơ sở "đã đi hàng" = **PACKING LIST per-piece** (tab `Status`, `SL đã đi hàng > 0`);
  số tấn của điều hành SX **chỉ tham khảo cấp dự án**.
- Ghép dự án ↔ SX: khớp bằng **mã số** `/\d{5}-\d{3}/` (`maSo_`).

**Hệ 3 — dashboard web:**
- `isAcc(r)` = **có QCDate** (`r[3]`) và **không phải reject** → tính vào khối lượng nghiệm thu.
- `isAccAH` = `isAcc` và **không phải "QC khác"** → dùng cho **bảng xếp hạng từng QC viên**
  (người ngoài BD.VP/luongnd không được đứng tên).
- `isReject(r)` = `PL === 'Rớt'` **hoặc** memo khớp `reject|fail|rớt|không đạt`.
- `isTon(r)` = `PL === 'Chưa QC'` → tồn chờ nghiệm thu.
- **FPY** = `(accept − accept_có_lỗi) / (accept + reject)`, tính **theo tấn** (`fpyCalc`).
- Mã lỗi NCR nhận từ memo bằng regex `\b(MAT|PRE|FIT|DIM|WEL|GRI|BLA|PAI|PAC|DRW)\s*-\s*\d{1,2}\b`.
- Khi tính **sản lượng SX** (mẫu số), `'Miễn QC'` bị **loại trừ** (4 chỗ trong `qc.html`).
- `DDC_CORE`: `revWarn` = đã mời/NT ở rev cũ mà bản vẽ đã nâng rev
  (`finRev < rev` với final, `fitRev < rev` với fitup và cấu kiện có hàn);
  `moiLai` = RFI kết thúc `-R2/-R3` hoặc ô RFI có nhiều giá trị;
  thang tiến độ hồ sơ `_dcStep`: bàn giao hồ sơ › trình kí KH › trình kí DDC › đã NT final ›
  đã mời final › bàn giao QA › FUR xong › đã mời fitup › chưa mời.

## 9. DATA / GOOGLE SHEETS
Danh sách ID đầy đủ: `SYSTEM_ARCHITECTURE.md` §4. Lược đồ chi tiết: `DATA_MODEL.md`.

- **DANH MUC DU AN (registry)**: `146lyk2TjTD6LwNR9R6bpXYhKzZxXISTIDvBzEbD5tz0`
  - **Cả 3 hệ đọc CÙNG tab `DANH MUC`** (đó chính là `getSheets()[0]`).
    Cột A = `Ma du an`, B = `Spreadsheet ID`. *(Đính chính bản 28/09 vòng 1 — không có lệch tab.)*
  - Thứ tự tab thật: `DANH MUC` · `KIEM CHUNG` · `NHAT KY` · `THAY DOI` · `BAN DO COT`
    · `TIEU DE GOC` · `BAO CAO DATA QC` · `Sheet1`.
  - Registry hiện có **11 dự án** — danh sách đầy đủ ở `DATA_MODEL.md` §5.5,
    gồm dự án mới **`WOLF QC DINH FITUP`** (27/09) chưa có trong tài liệu cũ.
  - Cột `SPM` mà hệ 3 tìm (`_dcSpmName`) **chưa tồn tại** trong registry → hệ 3 luôn phải
    đoán tên dự án bằng so tiền tố/token hoặc `localStorage['ddc_alias']` của từng máy.
- TRUNG TAM CANH BAO - EVAPCO: `1m-3O2NQ76hYAj1OysAonSClnFCPM1dixyKJOBH317Nc`
- TONG HOP BAO CAO EVAPCO (SX): `1RrP0qmkGH9dsYYpf3ZzkXgkqxOVlVQvtMdITZX8KHQ0`, tab `Tổng hợp da`
  (A=Tên dự án, B=Shipment, E=TKL, P=Đã giao, Q=Chưa giao; đơn vị TẤN)
- PACKING: Bison `1Tq3pCRh…` · Viola `1610zRYT…` · Gregory `1RCTPxc3…`, tab `Status`
- File kết quả hệ 2: `1PlIysoeBO0GLxx849iEA3Biu8l0I496V7Kauf1-UJCo`
- **Sheet mà dashboard web đọc trực tiếp (phải công khai link):**
  NCR live `1DqerGEB_XpzUjcnvf8l3Srb93WXSRPwhdYRN34BUtlg` (gid 0) ·
  Quản lý dự án / Section `1hDz5QDbf4hEJAYJhq7JLlut9pMLK9wDXnAXaXt_1LCE` ·
  KHSX `1kqMlDG4zJljpK9l6IpZf6-RAEdZj_CcwmliRcZgUMMs` (gid 0 và 731881045)
- File dự án tiêu biểu: 10725-011 TED `15zHzlQPxmOwy-Rle1MPJblGedF8Cyh65fpVKkoJMieI` ·
  10726-054 `1EsChDAJNBFMnYwYiwgoKxA852wrpVAwuaqenAaOedJ0` ·
  10726-043 WOLF `1WSM5ZIbYO_tlsLl4QGES1oC-TtQGBP-idghMCHq35W8`

**DATA QC 18 cột cố định:** Guid | Item | Part no | Member punch no | RFI fab | RFI Fab date |
VIR report no | VIR report date | DIR Report no | RFI Gal | RFI Gal date | Gal Report no |
Cảnh báo | Dự án | Milestone | Xưởng | RFI FUR | FUR Report no.

**`window.QCDATA` (hệ 3):** `P[115] X[5] T[45] Q[55] PL[4] rows[18733×14] proj[115] check{f,w,p}`.
Lược đồ 1 dòng: `[P, X, T, QCDate, WorkDate, Q, PL, Fitup_t, Welding_t, Painting_t, Qnty_F, Qnty_W, Qnty_P, memo]`.

**Component unique ID:** **không có ID duy nhất toàn hệ thống.**
Hệ 1/2 dùng `Member punch no`; hệ 3 dùng `pn` (cột tuỳ layout A/B/C/D); packing dùng `Part No`;
`qcdata.js` **hoàn toàn không có mã cấu kiện** (chỉ là dòng Pivot đã gộp).
`Guid` tồn tại nhưng **không được dùng làm khoá ở bất cứ đâu**.

## 10. IMPORTANT FILES
| File | Ở đâu | Purpose | Hàm quan trọng |
|---|---|---|---|
| `AppsScript_Code.gs.txt` | **gói bàn giao, KHÔNG trong repo** | Hệ 1 (~3.900 dòng) | `doPost`, `BD_EP`/`timEp`/`layKhaiBao`, `taoDataQC`, `chayTatCa`/`chayTiep`, `kiemChung`/`doiChieuNguoc`, `chotCuoiNgay`/`chotTiep`, `capNhatCanhBao`/`veTongQuan`, `nguonThieuDong`, `ghiAnhChup`/`docAnhChup`, `ghiBanDoTuCode` |
| `KIEMTRA_BC_REV.gs.txt` | **gói bàn giao, KHÔNG trong repo** | Hệ 2 (913 dòng, chỉ đọc) | `quetTatCa`/`quetTiep`/`quet_`, `quetMotDuAn_`, `kiemRev_`, `layPacking_`/`BD_PACK`, `docSection_`/`timBangGoc_`, `ghiKetQua_`, `taoTraCuu_`, `caiMenuTraCuu`/`moMenu`/`timCauKienToanBo`, `ghiDoiChieuSX_`/`maSo_`, `taoDanhMucLink`, `layFileBC` |
| `KEO_DULIEU.vbs` / `QUAN_LY.vbs` | **gói bàn giao, KHÔNG trong repo** | PC → /exec ; menu PC | `TimFileMoiNhat`, `GuiChunk`, `LayKhoa` ; `DongBoMotDuAn`, `CaiLich` |
| `qc.html` | repo | **Dashboard chính (10 tab)** | `F`/`Fnodate`/`val`/`qval`, `render`/`renderAll`/`setView`, `rTQ rND rXT rQC rDU rCL rKP rDL rQL rKH`, `fpyCalc`, `gsInput`, `asgFetch`/`asgSave`, `DDC_CORE`, `_dcLoad`/`_dcLoadProject`/`_dcMemSearchGo`, `khLiveLoad`, `_loadQLDA`, `secGalLoad` |
| `index.html` | repo | Trang chủ Pages — **bản cũ 11/08** | (như trên, thiếu `rKH` và `DDC_CORE`) |
| `doc.html` | repo | Document Control độc lập | `DDC_CORE` (`detectLayout`/`buildMap`/`normRow`/`aggregate`), `_docSearch`, `_dcRender` |
| `qcdata.js` | repo | `window.QCDATA` — **do PC đẩy, không sửa tay** | — |
| `spm_flatten.py` | repo | SPM Pivot → qcdata.js — **lệch bản thật** | `find_input`, dò cột tự động, `flatFull` |
| `.github/workflows/capnhat.yml` | repo | tự sinh qcdata.js — **chưa từng chạy** | — |
| `CLAUDE.md` / `HANDOFF.md` / `PROJECT_STATUS.md` / `SYSTEM_ARCHITECTURE.md` / `DATA_MODEL.md` / `SECURITY_MODEL.md` / `PERFORMANCE_PLAN.md` | repo | Bộ tài liệu chuẩn | — |

## 11. RECENT CHANGES
| Date | Change | Files | Reason |
|---|---|---|---|
| 29/09 | Rà soát số liệu dashboard (khớp 6/6 KPI); `index.html`→chuyển hướng; khôi phục tab 06 Dự án; Doc Control nhúng app tra cứu; khối Sức khoẻ dữ liệu; phân tuổi Waiting | `qc.html`, `index.html`, `index_backup_1108.html`, `app.html` | User yêu cầu nâng cấp dashboard + đưa app vào Doc Control |
| 28/09 | **Rà soát toàn hệ thống; dựng lại kiến trúc từ mã nguồn; lập bộ 7 tài liệu. KHÔNG sửa mã ứng dụng.** | 7 file `.md` | User yêu cầu audit trước khi duyệt kiến trúc |
| 27/09 | `qcdata.js` cập nhật (commit `fba9e18`, đẩy từ PC) | `qcdata.js` | cập nhật số liệu hằng ngày |
| 27/09 | ban-8: thêm khoá `VIOLA_KCT` vào BD_PACK; hệ 1 `'27/09 gre-duct'` khai GREGORY DUCTING; fix `#ERROR!` NHAT KY (`=== ` → `*** `) | (gói bàn giao) | VIOLA_KCT không ghép được packing; dự án mới chưa khai |
| 27/09 | ban-7: đối chiếu PACKING per-piece (BD_PACK, `layPacking_`, cột "Da di hang", cột TONG QUAN đỏ đậm) | `KIEMTRA_BC_REV.gs.txt` | "đi hàng đang chỉ là đoán, không có cơ sở" |
| 27/09 | ban-4→6: DOI CHIEU SX nhóm theo dự án; DANH MUC LINK; TRA CUU tương tác + _HOSO + menu 🔎 | `KIEMTRA_BC_REV.gs.txt` | user cần truy xuất bấm-là-ra |
| 26/09 | `'26/09 bit-lo-hong'` + deploy V9: CHẶN tự đoán cột | `AppsScript_Code.gs.txt` | dự án mới dựng sai lặng lẽ |
| 24/09 | `'24/09 sua-3-loi'`: tieuDe TED 7→4; `layKhaiBao` chuẩn hoá -1; khai 10726-054 | `AppsScript_Code.gs.txt` | mất 3 CK đầu TED; crash kiemChung |
| 20/09 | `qc.html` v100 COMPONENT CONTROL (thêm Doc Control); `doc.html`; `ddc_data.js` | repo | thêm khối Document Control |
| 13/09 | `spm_flatten.py` + `khsx_data.js` | repo | thêm KHSX |
| 11/08 | `index.html`, `ncr_data.js`, `aop_data.js`, `apiurl.js`, `capnhat.yml`, 2 trang phụ | repo | **lần cuối `index.html` được cập nhật** |

Bug ĐÃ SỬA đáng nhớ (đừng tái phạm): tự đoán cột dựng sai lặng lẽ; `undefined < 0`;
tieuDe sai nuốt cấu kiện đầu; xoá-tạo-lại tab làm mất gid; `waitLock` ngoài try → trang HTML;
"SAI TOKEN" chứa "OK"; `_CHUP` "0110"→110; interleaved sync; deployment cũ vẫn sống;
starvation dự án cuối khi restart `chayTatCa` liên tục.

## 12. DO NOT CHANGE
- Existing business logic unless explicitly requested.
- Existing data structure unless explicitly approved (18 cột DATA QC, registry A/B, DOI CHIEU, _CHUP,
  lược đồ 14 phần tử của `QCDATA.rows`).
- Production-related configuration without confirmation (URL /exec, TOKEN, giờ 17/18/19h).
- Điểm sửa được phép DUY NHẤT (Apps Script): hệ 1 `BD_EP`+`CHOT_GIO`;
  hệ 2 `BD_REV`+`BD_PACK`+`GIO_QUET`+`SX_FILE_ID`.
- `qcdata.js`: **không sửa tay, không commit đè** — do PC sinh và đẩy.

## 13. NEXT SESSION INSTRUCTION
Phiên Claude Code kế tiếp nên:
1. Đọc `CLAUDE.md`.
2. Đọc `HANDOFF.md` (file này).
3. Đọc `PROJECT_STATUS.md`.
4. Đọc `SYSTEM_ARCHITECTURE.md` + `DATA_MODEL.md` (thêm `SECURITY_MODEL.md` / `PERFORMANCE_PLAN.md` nếu liên quan).
5. **Kiểm tra user đã trả lời 3 câu hỏi ở mục 2 chưa.** Chưa trả lời → **KHÔNG sửa mã ứng dụng**,
   chỉ hỏi lại cho gọn.
6. Đã trả lời → làm theo đúng thứ tự đã chốt, mỗi lần một việc, có đối soát số liệu trước/sau.
7. Bất kỳ chỗ nào ghi **UNKNOWN — NEED USER CONFIRMATION** → hỏi user hoặc tra sheet sống, **không đoán**.
