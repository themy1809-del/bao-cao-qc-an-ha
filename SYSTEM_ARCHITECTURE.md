# SYSTEM_ARCHITECTURE.md
# Kiến trúc hệ thống THỰC TẾ — dựng lại từ mã nguồn (28/09/2026)

> Tài liệu này được dựng lại bằng cách ĐỌC MÃ NGUỒN THẬT trong repo
> `themy1809-del/bao-cao-qc-an-ha` (nhánh `claude/audit-existing-system-hjmvx9`,
> gốc `main` @ `fba9e18`) + 2 file Apps Script và 2 file VBS trong bộ bàn giao.
> Mọi con số đều đếm lại từ file. Chỗ nào không xác định được ghi rõ
> **UNKNOWN — NEED USER CONFIRMATION**. Không suy đoán.

---

## 0. TÓM TẮT: hệ thống gồm 3 HỆ ĐỘC LẬP, không hệ nào gọi hệ nào

| # | Hệ | Nơi chạy | Mã nguồn ở đâu | Ghi / Đọc |
|---|---|---|---|---|
| 1 | **DATA HỒ SƠ** (đồng bộ Excel → Google Sheets, dựng DATA QC) | Apps Script project riêng + PC Windows | `AppsScript_Code.gs.txt`, `KEO_DULIEU.vbs`, `QUAN_LY.vbs` — **KHÔNG có trong repo này** | Ghi vào file dự án |
| 2 | **KIEM TRA BC-REV** (rà nợ báo cáo, nâng Rev, đối chiếu packing) | Apps Script project riêng | `KIEMTRA_BC_REV.gs.txt` — **KHÔNG có trong repo này** | Chỉ ĐỌC nguồn, ghi file kết quả riêng |
| 3 | **DASHBOARD WEB** (repo này) | GitHub Pages (tĩnh) + trình duyệt người dùng | `index.html`, `qc.html`, `doc.html`, `*.js`, `spm_flatten.py` | Chỉ ĐỌC (trừ 1 lối ghi: phân công QC) |

**Điểm nối duy nhất giữa hệ 3 và hệ 1/2:** hệ 3 đọc **cùng file Google Sheets**
(`DANH MUC DU AN` + file dự án) qua **gviz** bằng JavaScript trong trình duyệt.
Hệ 3 **không** gọi Apps Script của hệ 1 hay hệ 2, **không** đọc tab `DATA QC`.
Hệ 3 tự phân tích lại **bảng gốc** (tab CHECK_LIST / tab ghi trong `DOI CHIEU`)
bằng bộ `DDC_CORE` viết bằng JS — tức là **logic đọc cột bị làm 2 lần, 2 nơi,
2 ngôn ngữ, 2 bảng khai báo khác nhau** (`BD_EP` bên Apps Script ↔ `DDC_CORE.buildMap`
bên JS). Đây là rủi ro kiến trúc lớn nhất hiện nay (xem mục 6).

---

## 1. HỆ 3 — DASHBOARD WEB (nội dung của repo này)

### 1.1 Hạ tầng
- Repo: `https://github.com/themy1809-del/bao-cao-qc-an-ha`
- Nhánh mặc định: `main`. Tạo 21/06/2026. Push gần nhất 27/09/2026.
- **`private: false` → repo CÔNG KHAI.** `has_pages: true` → GitHub Pages đang BẬT.
- Có `.nojekyll` (tắt xử lý Jekyll — phục vụ file tĩnh nguyên trạng).
- URL GitHub Pages thực tế: **UNKNOWN — NEED USER CONFIRMATION**
  (mặc định sẽ là `https://themy1809-del.github.io/bao-cao-qc-an-ha/`,
  nhưng chưa xác nhận được nhánh/thư mục nguồn Pages đang dùng).
- 50 commit, **toàn bộ** do `Themy <themy1809@gmail.com>` đẩy lên,
  thông điệp dạng `Cap nhat QC <thứ> <mm/dd/yyyy> <giờ>` → đẩy từ script trên PC.

### 1.2 Các trang HTML (4 trang chạy được + 1 bản lưu)

| File | Dung lượng | Dòng | Commit cuối | Nạp dữ liệu | Vai trò |
|---|---|---|---|---|---|
| `index.html` | 341.580 B | 2.801 | **11/08/2026** (`afaa7ad`) | qcdata, apiurl, ncr, aop | Trang chủ Pages — **BẢN CŨ NHẤT** |
| `qc.html` | 592.367 B | 6.005 | **20/09/2026** (`bcc0ea8`) | qcdata, apiurl, ncr, **khsx**, **ddc**, aop | **Bản mới nhất, đầy đủ nhất** (nhãn `BẢN MỚI 20/9 v100 · COMPONENT CONTROL ✓`) |
| `qc_backup_truoc_ddc.html` | 467.501 B | 4.575 | 20/09/2026 (`02d338a`) | qcdata, apiurl, ncr, khsx, aop | Bản lưu trước khi thêm Doc Control (nhãn `BẢN MỚI 12/9 v90 · KHSX ✓`) |
| `doc.html` | 139.841 B | 1.564 | 20/09/2026 (`bcc0ea8`) | **chỉ** ddc_data | Giao diện Document Control độc lập |
| `kiem_tra_waiting.html` | 21.124 B | 238 | 11/08/2026 | qcdata | Trang phân tích tồn WAITING riêng |
| `section_tracker.html` | 8.758 B | 76 | 11/08/2026 | (không) — đọc gviz trực tiếp | Theo dõi Section theo tổ |

> **PHÁT HIỆN QUAN TRỌNG:** `index.html` — trang mà GitHub Pages phục vụ mặc định —
> **chậm hơn `qc.html` 2 thế hệ**: không có tab `10 KHSX`, không có tab
> `05 Doc Control`, không nạp `khsx_data.js` / `ddc_data.js`, không chứa `DDC_CORE`.
> Người mở link Pages gốc sẽ thấy bản 11/08, không thấy Document Control.
> Cần user xác nhận: link đang phát cho mọi người là `/` hay `/qc.html`?
> → **UNKNOWN — NEED USER CONFIRMATION**

### 1.3 Thư viện ngoài (CDN, nạp trên mọi trang lớn)
Từ `cdnjs.cloudflare.com`: `echarts 5.5.0`, `xlsx 0.18.5` (SheetJS),
`html2canvas 1.4.1`, `jspdf 2.5.1`. Font `Be Vietnam Pro` từ Google Fonts.
→ Dashboard **không chạy được offline** và phụ thuộc 2 CDN bên ngoài.

### 1.4 Luồng dữ liệu của hệ 3

```
 [SPM.xlsx – PivotTable]
        │  (chạy TAY trên PC: python spm_flatten.py)
        ▼
   qcdata.js  (window.QCDATA – 1,23 MB, 18.733 dòng)
        │  git push từ PC  ("Cap nhat QC …")
        ▼
   GitHub repo (public) ──► GitHub Pages ──► trình duyệt
                                              │
   ddc_data.js (seed 20/09) ───────────────────┤
   khsx_data.js (13/09) ──────────────────────┤
   ncr_data.js (03/07) ───────────────────────┤
   aop_data.js (03/07) ───────────────────────┤
   apiurl.js  (URL Web App) ──────────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼ (khi mở trang, JS gọi thẳng ra Google)            ▼
   gviz CSV/JSON (chỉ đọc):                              Apps Script /exec (đọc+GHI):
   · 146lyk2…  DANH MUC DU AN, tab "DANH MUC" gid 1397171776   · GET  ?cb=…      → phân công QC (JSONP)
   · <sid> từng dự án: tab "DOI CHIEU" → tên tab gốc → CHECK_LIST · GET ?gallery=1 → ảnh Section
   · 1DqerGEB…  NCR live (gid 0, CSV)                          · POST {key:'anha2026', cfg:{…}} → LƯU phân công
   · 1hDz5QDb…  Quản lý dự án (JSONP, nhiều tab)
   · 1kqMlDG4…  KHSX TỔNG HỢP BÁO CÁO DDC AN HẠ (gid 0, 731881045)
```

### 1.5 GitHub Actions — `.github/workflows/capnhat.yml`
- Kích hoạt khi push vào `Update spm/**`, hoặc chạy tay (`workflow_dispatch`).
- Việc làm: cài `openpyxl` → `python spm_flatten.py "Update spm/spm.xlsx" _out`
  → `cp _out/qcdata.js qcdata.js` → commit dưới tên `auto-capnhat` → push.
- **Thực tế: workflow NÀY CHƯA BAO GIỜ CHẠY THÀNH CÔNG.** Không có commit nào
  của `auto-capnhat` trong 50 commit; `Update spm/spm.xlsx` không tồn tại trong repo
  (chỉ có `Update spm/DOC_TOI_DAY.txt`). Dữ liệu thực tế được đẩy tay từ PC.
- **Rủi ro:** nếu ai đó upload `spm.xlsx` theo hướng dẫn trong `DOC_TOI_DAY.txt`,
  workflow sẽ ghi đè `qcdata.js` bằng bản sinh từ `spm_flatten.py` TRONG REPO —
  mà bản này **sinh ra cấu trúc KHÁC** với `qcdata.js` đang chạy (xem `DATA_MODEL.md` §2.3).

### 1.6 Tài liệu / file được tham chiếu nhưng KHÔNG có trong repo
| Được nhắc ở | Tên file | Trạng thái |
|---|---|---|
| `Update spm/DOC_TOI_DAY.txt` | `HUONG_DAN_VAN_HANH.md` | không có |
| `qc.html`, `index.html` (asgRender) | `HUONG_DAN_PHANCONG_WEBAPP.md` | không có |
| `apiurl.js` | `DAY_LEN_GITHUB.bat` | không có |
| `qc.html` (rDL → srcBox) | `capnhat_spm.bat` | không có |
| `asgDownload()` | `mailcfg.js` | sinh phía client, không lưu repo |
| `HANDOFF.md` §10 | `AppsScript_Code.gs.txt`, `KIEMTRA_BC_REV.gs.txt`, `KEO_DULIEU.vbs`, `QUAN_LY.vbs` | không có trong repo (chỉ có trong gói bàn giao) |

Ngoài ra `__pycache__/spm_flatten.cpython-310.pyc` bị commit nhầm; repo **không có `.gitignore`**.

---

## 2. HỆ 1 — "DATA HỒ SƠ" (Apps Script + VBS trên PC)

*Nguồn: `AppsScript_Code.gs.txt` (3.904 dòng), `KEO_DULIEU.vbs` (659 dòng), `QUAN_LY.vbs` (438 dòng).*

```
 Excel checklist (PC)
    │  Task Scheduler 17:00 (chế độ 1) → QUAN_LY.vbs → KEO_DULIEU.vbs
    │  POST JSON theo lô CHUNK_ROWS=1000 dòng, kèm TOKEN
    ▼
 Web App /exec  (doPost)  ── LockService.tryLock(180000) TRONG try ──┐
    │  ghi đè TẠI CHỖ vào bảng gốc (KHÔNG xoá trước)                 │
    │  b.clear → đánh dấu "DANG DONG BO", ghiDoiChieu                │
    │  b.done  → cắt phần thừa, ghiDoiChieu (KHOP/LECH), ghiNhatKy   │
    │           nếu lastRow ≤ NANG_TOI_DA(8000): lamDep + capNhatDashboard
    │           + tinhTienDoHoSo + (nếu laTabChinh) taoDataQC        │
    ▼                                                                │
 File "DATA - <dự án>" (1 file / dự án, id ở registry cột B)         │
   ├── tab bảng gốc (tab NHIỀU DÒNG NHẤT = tab chính)                │
   ├── tab DATA QC   (18 cột chuẩn — do taoDataQC dựng)              │
   ├── tab DOI CHIEU (Excel ↔ Google: KHOP / LECH / DANG DONG BO)    │
   ├── tab _CHUP     (ẩn: ảnh chụp Mã cấu kiện + mã trạng thái 4 bit)│
   └── tab DASHBOARD                                                 │
    │                                                                │
    ▼  Trigger 18:00 (CHOT_GIO=18) chotCuoiNgay → chotTiep mỗi 2'    │
 capNhatCanhBao → file "TRUNG TAM CANH BAO - EVAPCO" (1m-3O2N…) ─────┘
```

Điểm cần nhớ:
- `PHIEN_BAN` trong bản bàn giao = `'27/09 gre-duct'`; `doGet()` trả
  `READY - phien ban dang chay: <PHIEN_BAN>` (cách kiểm tra bản đang sống).
- `NANG_TOI_DA = 8000`: bảng lớn hơn thì `doPost` KHÔNG làm việc nặng, phải chạy tay `chayTatCa`.
- Chống hết giờ 6 phút: mẫu `G_BATDAU` + `HAN` + resume qua `PropertiesService` (`DQC_XONG`).
- 4 chốt an toàn trước khi ghi `DATA QC` (xem `DATA_MODEL.md` §3.3).
- Điểm sửa được phép: **chỉ** `BD_EP` và `CHOT_GIO`.

## 3. HỆ 2 — "KIEM TRA BC-REV" (Apps Script độc lập, chỉ đọc)

*Nguồn: `KIEMTRA_BC_REV.gs.txt`, `PHIEN_BAN_BC = '27/09 ban-8'` (bản trong gói bàn giao
và bản user vừa gửi lên **giống hệt nhau, byte-for-byte**).*

```
 Trigger 19:00 (GIO_QUET=19, SAU chốt 18:00)  →  quetTatCa / quetTiep
    │ đọc DANH MUC DU AN (146lyk2…) sheet 1: A=tên, B=id
    ├─ A. mỗi dự án: đọc tab DATA QC (18 cột) → nợ FUR / nợ DIR-VIR
    ├─ B. đọc bảng gốc theo BD_REV → Rev nâng chưa NT lại + NHAT KY REV
    ├─ C. đọc file SX 1RrP0qmk… tab 'Tổng hợp da' → DOI CHIEU SX (tấn)
    └─ D. đọc 3 file PACKING (tab 'Status') theo BD_PACK → "đã lên cont mà thiếu hồ sơ"
    ▼
 File kết quả RIÊNG "TRUNG TAM KIEM TRA BC & REV" (1PlIysoe…)
   TONG QUAN · CHI TIET · TRA CUU · TIM THAY · NHAT KY REV
   · DOI CHIEU SX · DANH MUC LINK · _HOSO (ẩn) · _REV <dự án> (ẩn)
   + menu 🔎 TRA CUU QC (onOpen trigger)
```
- Không có `doPost`/`doGet` → **không cần Deploy**.
- Giới hạn 6 phút: `HAN = 4.5*60*1000`, resume qua `BC_XONG` (hạn 30 phút).
- `TOI_DA_CT = 400` dòng chi tiết / 1 loại vấn đề / 1 dự án; `_HOSO` tối đa 3.000 dòng.
- Điểm sửa được phép: **chỉ** `BD_REV`, `BD_PACK`, `GIO_QUET`, `SX_FILE_ID`.
- Script id của project hệ 2: **UNKNOWN — NEED USER CONFIRMATION** (lấy ở tab `DANH MUC LINK` nhóm B).

---

## 4. Bản đồ mọi ID Google đang được mã nguồn tham chiếu

| ID | Tên | Dùng ở | Quyền cần |
|---|---|---|---|
| `146lyk2TjTD6LwNR9R6bpXYhKzZxXISTIDvBzEbD5tz0` | DANH MUC DU AN (registry) | Hệ 1 (`REGISTRY_ID`), Hệ 2 (`REGISTRY_ID`), Hệ 3 (`DDC_REG.id`, gid `1397171776`) | Hệ 3 cần **ai có link cũng xem được** |
| `1m-3O2NQ76hYAj1OysAonSClnFCPM1dixyKJOBH317Nc` | TRUNG TAM CANH BAO - EVAPCO | Hệ 1 (`capNhatCanhBao`), Hệ 2 (`CANH_BAO_ID`) | nội bộ |
| `1PlIysoeBO0GLxx849iEA3Biu8l0I496V7Kauf1-UJCo` | TRUNG TAM KIEM TRA BC & REV | Hệ 2 (kết quả, lưu trong Script Properties `BC_FILE_ID`) | nội bộ |
| `1RrP0qmkGH9dsYYpf3ZzkXgkqxOVlVQvtMdITZX8KHQ0` | TONG HOP BAO CAO EVAPCO (điều hành SX) | Hệ 2 (`SX_FILE_ID`, tab `Tổng hợp da`) | chỉ đọc |
| `1Tq3pCRhwPr2GsZhCxF0C6ZsDS25Bps9r-cGers4Ai-s` | PACKING Bison | Hệ 2 (`BD_PACK`: `CHECKLIST_BISON`, `BISON_U2`) | chỉ đọc |
| `1610zRYTRHpAgqcYRq3RM8_76H5gxg7sndtzuW04I6js` | PACKING Viola | Hệ 2 (`BD_PACK`: `10725-009`, `VIOLA_KCT`) | chỉ đọc |
| `1RCTPxc3AGn9NjLxrqDp-UG-gCnaGDThWREKr9cmMh7c` | PACKING Gregory | Hệ 2 (`BD_PACK`: `10725-008`) | chỉ đọc |
| `1DqerGEB_XpzUjcnvf8l3Srb93WXSRPwhdYRN34BUtlg` | Sổ NCR (live) | Hệ 3 `index.html`/`qc.html` gviz CSV gid 0 | **ai có link cũng xem được** |
| `1hDz5QDbf4hEJAYJhq7JLlut9pMLK9wDXnAXaXt_1LCE` | Quản lý dự án / theo dõi Section | Hệ 3 `qc.html` (`QLDA_SHEET_ID`), `section_tracker.html` (`SID`, tab `Dự án Bison - Ducting - Ted`) | **ai có link cũng xem được** |
| `1kqMlDG4zJljpK9l6IpZf6-RAEdZj_CcwmliRcZgUMMs` | TỔNG HỢP BÁO CÁO DDC AN HẠ (KHSX) | Hệ 3 `qc.html` (`KH_SHEET`, gid `0` và `731881045`) | **ai có link cũng xem được** |
| `1vSH9wS0aen0UH62_b0vjC2SzKJuEppVQWxNw1HV6L9OJ6qUvejMpj9FQ` | Script id project hệ 1 | Hệ 2 (`SCRIPT_DHS`, chỉ để in link) | — |
| `AKfycbwYnGKYdxVb…/exec` | Web App hệ 1 (nhận dữ liệu từ VBS) | `KEO_DULIEU.vbs`, Hệ 2 (`CONG_EXEC`, chỉ để in link) | TOKEN `thau2026` |
| `AKfycbwXuNubSP2_…/exec` | Web App PHÂN CÔNG QC | Hệ 3 `apiurl.js` → `window.QC_ASSIGN_API` | key `anha2026` |

> Mã nguồn của Web App phân công QC (`AKfycbwXuNubSP2_…`) **không có trong repo
> và không có trong gói bàn giao**. Nó nhận `GET ?cb=` (JSONP phân công),
> `GET ?gallery=1` (ảnh Section) và `POST {key, cfg}` (lưu phân công).
> → **UNKNOWN — NEED USER CONFIRMATION: mã nguồn + script id của Web App này.**

---

## 5. Đường ghi dữ liệu (tổng cộng có 3, không hơn)

1. **VBS → `/exec` hệ 1 → file dự án** — bảo vệ bằng `TOKEN='thau2026'` + `LockService`.
2. **Hệ 2 → file kết quả riêng của nó** — không đụng vào file nào khác.
3. **Trình duyệt bất kỳ → `/exec` phân công QC** — bảo vệ bằng chuỗi `'anha2026'`
   **viết cứng trong `qc.html`/`index.html` trên repo công khai**. Xem `SECURITY_MODEL.md`.

Ngoài 3 đường trên, toàn bộ hệ 3 là **chỉ đọc**.

---

## 6. Rủi ro kiến trúc đã xác minh (không phải suy đoán)

| # | Rủi ro | Bằng chứng trong mã |
|---|---|---|
| A1 | **Hai bộ đọc cột song song, không đồng bộ** | `BD_EP` (Apps Script, 10 khai báo) vs `DDC_CORE.buildMap` (JS, 4 layout A/B/C/D dò theo tên tiêu đề). Cùng 1 file dự án, 2 bộ có thể ra 2 kết quả khác nhau mà không ai đối chiếu. |
| A2 | **`index.html` (trang chủ Pages) cũ hơn `qc.html` 2 thế hệ** | commit 11/08 vs 20/09; thiếu view `v_kh`, thiếu `DDC_CORE`, không nạp `ddc_data.js`/`khsx_data.js`. |
| A3 | **`spm_flatten.py` trong repo KHÔNG sinh ra `qcdata.js` đang chạy** | `qcdata.js` có `PL=[…,'Miễn QC']`, dòng 14 phần tử, **không có** mảng `Z`; `spm_flatten.py` sinh `PL` không có `'Miễn QC'`, dòng 15 phần tử, **có** `Z`. |
| A4 | **Workflow `capnhat.yml` chưa từng chạy, nhưng vẫn "sống"** | 0 commit của `auto-capnhat`; nếu ai upload `spm.xlsx` → ghi đè `qcdata.js` bằng cấu trúc khác (A3). |
| A5 | **Repo công khai chứa toàn bộ dữ liệu QC sản xuất + URL Web App ghi được + khoá `anha2026`** | `private:false`; `apiurl.js`; `qc.html:2277`. |
| A6 | **Hệ 3 phụ thuộc các Sheet phải mở "ai có link cũng xem được"** | `_dcFetch` báo lỗi `'sheet chưa chia sẻ công khai?'`; `_loadQLDA` báo `'Chia sẻ "Bất kỳ ai có link → Người xem" chưa?'`. |
| A7 | **Không có `.gitignore`; `__pycache__/*.pyc` đã bị commit** | `find` repo. |
| A8 | **Bộ tài liệu vận hành bị tham chiếu nhưng không tồn tại** | §1.6. |

---

## 7. Những gì tài liệu này CHƯA xác định được

- URL GitHub Pages thật đang phát cho nhân viên → **UNKNOWN — NEED USER CONFIRMATION**
- Trang nào là "dashboard chính thức": `index.html` hay `qc.html` → **UNKNOWN — NEED USER CONFIRMATION**
- Mã nguồn + script id Web App phân công QC (`AKfycbwXuNubSP2_…`) → **UNKNOWN — NEED USER CONFIRMATION**
- Script id project Apps Script hệ 2 → **UNKNOWN — NEED USER CONFIRMATION**
- Đường dẫn thư mục đồng bộ trên PC Windows → **UNKNOWN — NEED USER CONFIRMATION**
- Phiên bản `spm_flatten.py` thật đang dùng trên PC → **UNKNOWN — NEED USER CONFIRMATION**
- Trạng thái chia sẻ thực tế của từng Google Sheet ở §4 → **UNKNOWN — NEED USER CONFIRMATION**
