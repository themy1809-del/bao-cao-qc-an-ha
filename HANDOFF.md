# HANDOFF.md
# Current Project Handoff

> Cầu nối giữa các phiên Chat/Cowork và Claude Code Cloud. Cập nhật mỗi khi xong việc lớn
> hoặc đổi việc đang làm.
> **Cập nhật lần cuối: 28/09/2026 — phiên Claude Code Cloud rà soát toàn bộ repo.**
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
  Trang mới nhất = `qc.html` (20/09, `BẢN MỚI 20/9 v100`); trang chủ `index.html` = **bản 11/08**.
  URL Pages đang phát cho nhân viên: **UNKNOWN — NEED USER CONFIRMATION**.
- **PC Windows**: KEO_DULIEU.vbs + QUAN_LY.vbs + NHAT_KY.txt + DANG_CHAY.khoa, Task Scheduler
  17:00 hằng ngày (chế độ 1). Đường dẫn thư mục trên PC: **UNKNOWN — NEED USER CONFIRMATION**.

## 2. CURRENT TASK

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
- **(MỚI, cao)** Đồng bộ `index.html` ↔ `qc.html` hoặc chuyển hướng — sau khi user chốt link chính thức.
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
| `index.html` (trang chủ Pages) thiếu Doc Control + KHSX | `index.html` | **MỞ** | thiếu **188 hàm**, 9 tab thay vì 10; logic lõi thì giống hệt |
| Dashboard cảnh báo **báo thừa cột "Chưa có DIR"** | hệ 1 `capNhatCanhBao` | **MỞ — chờ xác nhận** | Không áp ngưỡng `AD` như `taoDataQC` → dự án dùng chung cột DIR/VIR (`VIOLA_TED`, `EVAPCO - GREGORY - DUCTING`, có thể cả `10725-011`) bị đếm thừa. Cột "Chưa đủ HS" vẫn ĐÚNG |
| Hệ 1 và hệ 2 đếm "nợ final" **khác định nghĩa** | `capNhatCanhBao` ↔ `quetMotDuAn_` | **MỞ — chờ xác nhận** | Hệ 1 tách riêng DIR/VIR; hệ 2 chỉ tính khi **cả hai** rỗng → số 2 file không so trực tiếp được |
| Khoá `'anha2026'` lộ trong mã client trên repo công khai | `qc.html:2277`, `index.html:1957` | **MỞ** | ai cũng ghi đè được bảng phân công QC |
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
