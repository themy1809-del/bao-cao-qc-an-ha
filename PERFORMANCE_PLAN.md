# PERFORMANCE_PLAN.md
# Hiện trạng hiệu năng + kế hoạch (chưa thực hiện) — 28/09/2026

> Phần "HIỆN TRẠNG" là **số đo thật từ mã nguồn và file** trong repo.
> Phần "KẾ HOẠCH" là **đề xuất, chưa làm gì cả**, chờ user duyệt kiến trúc.

---

## 1. HIỆN TRẠNG — các con số đã đo

### 1.1 Khối lượng phải tải mỗi lần mở `qc.html`

| Thành phần | Dung lượng | Chặn render? |
|---|---|---|
| `qc.html` (HTML + CSS + JS nội tuyến, 6.005 dòng) | **592 KB** | có |
| `qcdata.js` | **1.261 KB** | có — `<script src>` đồng bộ |
| `ddc_data.js` | **278 KB** | có |
| `khsx_data.js` | 42 KB | có |
| `ncr_data.js` + `aop_data.js` + `apiurl.js` | 11 KB | có |
| echarts 5.5.0 + xlsx 0.18.5 + html2canvas + jspdf (cdnjs) | **≈ 1,5 MB** (chưa nén) | có — 4 thẻ `<script>` trong `<head>` |
| Font Be Vietnam Pro (7 weight, Google Fonts) | vài trăm KB | có |

→ **Tổng ~3,7 MB mỗi lần mở trang**, trong đó **1,3 MB JSON phải `JSON.parse` trên luồng chính**
trước khi vẽ được bất cứ thứ gì. GitHub Pages có gzip nên đường truyền nhẹ hơn,
nhưng **thời gian parse + dựng chỉ số không đổi**.

Mã có "phao cứu sinh" cho việc này: splash `Đang tải dữ liệu QC…` và bộ đếm **7 giây**
→ nếu chưa xong thì hiện nút **THỬ LẠI** (`qc.html:405`). Tức là tác giả đã gặp
tình huống tải quá lâu trong thực tế.

### 1.2 ⚠️ Vòng lặp kiểm tra bản mới — tốn băng thông nhất

`qc.html:880-882` (và `index.html:673-675`):
```js
setInterval(function(){ _fs(function(s){ … }) }, 180000);
// _fs: fetch('qcdata.js?_cb='+Date.now(), {cache:'no-store'}).then(r=>r.text())
```
Cứ **180 giây**, trang tải lại **TOÀN BỘ `qcdata.js` 1,26 MB** (ép `no-store`, thêm cache-buster)
chỉ để so một chữ ký rồi **vứt đi**.

- 1 tab mở: **≈ 25 MB/giờ**, **≈ 200 MB/ngày làm việc 8 tiếng**.
- 10 người cùng mở: **≈ 2 GB/ngày** tải từ GitHub Pages.
- Đây là chi phí **vô ích 100 %** — chỉ cần `HEAD` hoặc đọc `ETag`/`Last-Modified`.

### 1.3 Chi phí tính toán mỗi lần đổi bộ lọc

- `D.rows` = **18.733 dòng**.
- `qc.html` gọi `F()` **23 lần** và `Fnodate()` **33 lần**; có **29 chỗ** duyệt thẳng `D.rows`.
- `renderAll()` → `render(CUR)` vẽ lại **toàn bộ view hiện tại**; một view có thể gọi
  `F()`/`Fnodate()` nhiều lần → **mỗi cú bấm lọc quét lại 18.733 dòng hàng chục lượt**.
- Không có chỉ mục (index) theo xưởng/tổ/dự án/ngày; không có memo hoá kết quả;
  không có `requestAnimationFrame` hay debounce cho `gsInput()` (gõ mỗi ký tự là quét lại
  `D.Q` + `_TOS` + `D.X` + `D.P`).
- `_asgWaitOf(c)` quét **toàn bộ `D.rows` cho TỪNG người** trong bảng phân công
  → bảng 20 người = **374.660 lượt duyệt** mỗi lần `asgRender()`.

### 1.4 Biểu đồ
**59 biểu đồ ECharts** khác nhau (`setOpt('…')`) trong `qc.html`, giữ trong `CH{}`.
`togTheme()` **dispose toàn bộ** rồi vẽ lại từ đầu; `resize` được gọi lại sau mỗi `setView`.
Animation mặc định **1.600 ms** (`animationDuration=1600`) cho mọi biểu đồ.

### 1.5 Document Control (tab 05) — nặng nhất về mạng
`_dcLoad()` chạy **TUẦN TỰ** (`chain = chain.then(...)`), mỗi dự án **3 lượt fetch**:
1. tab `DOI CHIEU` (`limit 5`) → lấy tên tab bảng gốc
2. tab bảng gốc (`limit 8`) → dò layout + bản đồ cột
3. `select <các cột> where <pn> is not null` → **toàn bộ cấu kiện**

Với dữ liệu trong `ddc_data.js`, khối lượng lượt 3 là:
`BISON_U2` 45.832 · `VIOLA_KCT` 40.524 · `SVĐVINFATS` 1.995 · `VIOLA_TED` 878
→ **≈ 89.229 dòng CSV** kéo qua `gviz`, **phân tích bằng JS trên luồng chính**,
rồi `DDC_CORE.aggregate` duyệt lại toàn bộ để gộp theo xưởng/nhóm/bản vẽ/tháng/RFI.

Giảm nhẹ đã có sẵn trong mã:
- Cache `localStorage['ddcA1_'+sid]` theo `upd` của registry.
- Khi vượt quota `localStorage`: cắt bớt `byDwg→300`, `warnList→200`, `rfi→200` rồi lưu lại.
- `P.byDwg` chỉ giữ **800** bản vẽ đầu; `warnList` tối đa **400**; bảng cấu kiện hiển thị tối đa **400** dòng.
- Bảng "Dữ liệu chi tiết" (tab 08) giới hạn **400** dòng.

### 1.6 Phía Apps Script (hệ 1 & hệ 2) — đã có xử lý giới hạn 6 phút
- Hệ 1: `NANG_TOI_DA = 8000` (bảng lớn hơn thì `doPost` **không** làm việc nặng);
  ghi `DATA QC` theo lô `KHOI_GHI = 10000` dòng + `SpreadsheetApp.flush()`;
  chỉ kẻ viền/format toàn bảng khi `rows.length ≤ 5000`;
  `ghiAnhChup` ghi lô 20.000 dòng, lỗi thì `sleep(5000)` thử lại 1 lần;
  resume qua `PropertiesService` (`DQC_XONG`), chốt cuối ngày tự gọi `chotTiep` mỗi 2 phút.
- Hệ 2: `HAN = 4.5 * 60 * 1000` (dừng ở 4,5 phút), resume `BC_XONG` hạn 30 phút,
  `TOI_DA_CT = 400` dòng chi tiết / loại vấn đề / dự án, `_HOSO` tối đa 3.000 dòng,
  mỗi file packing chỉ đọc 1 lần / lượt (`packCache`), `moLai_` retry sau 5 giây.
- VBS: `CHUNK_ROWS = 1000`, `chunk = Int(45000/nC)`, retry phân loại lỗi, khoá `DANG_CHAY.khoa`.

→ **Phần Apps Script đang được xử lý hiệu năng tốt.** Vấn đề hiệu năng tập trung ở **hệ 3 (web)**.

### 1.7 Vấn đề "im lặng" đã phát hiện
`qc.html:4110` `KH_HASZONE` = `false` vì `qcdata.js` hiện **không có mảng `Z`**
→ tính năng drill-down KHSX theo Hạng mục **không chạy, không báo lỗi**.
Đây không phải lỗi hiệu năng nhưng nằm cùng nguyên nhân gốc: `spm_flatten.py` trong repo
lệch với bản sinh dữ liệu thật (xem `DATA_MODEL.md` §2.4).

---

## 2. XẾP HẠNG VẤN ĐỀ

| # | Vấn đề | Mức | Chi phí sửa | Rủi ro khi sửa |
|---|---|---|---|---|
| P1 | Poll lại **1,26 MB mỗi 180 s** | **Cao** | Thấp (đổi sang `HEAD` + `ETag`) | Thấp — khoanh trong 1 hàm `_fs` |
| P2 | `qcdata.js` 1,26 MB nạp đồng bộ, chặn render | **Cao** | Trung bình | Trung bình — đổi cách nạp |
| P3 | Quét lại 18.733 dòng hàng chục lượt mỗi cú lọc | **Cao** | Trung bình (thêm chỉ mục + memo hoá) | Trung bình — đụng nhiều hàm render |
| P4 | `_asgWaitOf` quét toàn bảng cho từng người | Trung bình | Thấp (gộp 1 lượt quét) | Thấp — 1 hàm |
| P5 | DDC tải tuần tự 89.229 dòng qua gviz | Trung bình | Trung bình (tải song song có giới hạn) | Trung bình — dễ chạm quota gviz |
| P6 | 4 thư viện CDN ~1,5 MB nạp cả khi không dùng | Trung bình | Thấp (`defer` + nạp theo yêu cầu cho xlsx/jspdf/html2canvas) | Thấp |
| P7 | 59 biểu đồ, animation 1.600 ms, vẽ lại toàn bộ khi đổi theme | Thấp | Thấp | Thấp |
| P8 | `ddc_data.js` 278 KB nạp trên `qc.html` dù thường bị ghi đè bằng bản live | Thấp | Thấp (nạp theo yêu cầu khi vào tab 05) | Thấp |

---

## 3. KẾ HOẠCH ĐỀ XUẤT — **CHƯA THỰC HIỆN, CHỜ DUYỆT**

Nguyên tắc: **giữ nguyên hành vi và số liệu**; không đổi cấu trúc dữ liệu;
không refactor ngoài phạm vi; mỗi bước làm được độc lập và quay lui được.

### Giai đoạn A — sửa rẻ, rủi ro thấp (không đổi số liệu)
- **A1 (P1):** trong `_fs`, đổi `fetch(... ).text()` thành `fetch(..., {method:'HEAD'})`
  và so `ETag`/`Last-Modified` thay vì tải cả file. Nếu máy chủ không trả header,
  lùi về `Range: bytes=0-2047` chỉ đọc phần đầu. → giảm ~200 MB/ngày/tab xuống gần 0.
- **A2 (P6):** thêm `defer` cho `echarts`; `xlsx`, `jspdf`, `html2canvas` chỉ nạp
  khi người dùng bấm Xuất Excel / PDF / PNG.
- **A3 (P4):** `asgRender()` tính **một lần** bảng tồn theo xưởng/tổ/dự án rồi tra cứu,
  thay vì gọi `_asgWaitOf` lặp cho từng người.
- **A4 (P7):** giảm `animationDuration` xuống ~600 ms; khi `togTheme()` chỉ `setOption`
  lại theme thay vì `dispose` toàn bộ (giữ nguyên nếu ECharts không cho đổi theme nóng).
- **A5 (P8):** chuyển `ddc_data.js` sang nạp theo yêu cầu khi mở tab 05.

### Giai đoạn B — cần thiết kế, phải đối soát số liệu trước/sau
- **B1 (P3):** dựng **chỉ mục một lần** sau khi nạp `QCDATA`
  (mảng vị trí theo `x`, `to`, `pj`, `q`, `pl`, và mảng ngày đã sắp xếp),
  cho `F()`/`Fnodate()` giao tập chỉ số thay vì `filter` toàn mảng.
  **Bắt buộc:** so `check.f/w/p` và toàn bộ KPI trước–sau, lệch 0.
- **B2 (P2):** tách `qcdata.js` thành phần "tổng hợp nhẹ" (vẽ ngay) và phần "chi tiết"
  (nạp nền) — **chỉ làm nếu A1 chưa đủ**, vì việc này đụng vào bộ sinh dữ liệu trên PC.
- **B3 (P5):** cho `_dcLoad` chạy song song có giới hạn (2–3 dự án cùng lúc)
  thay vì tuần tự; giữ nguyên cơ chế cache và fallback seed.

### Điều kiện tiên quyết cho MỌI việc trên
1. User **duyệt kiến trúc** (yêu cầu hiện tại nêu rõ: chưa sửa code ứng dụng).
2. Chốt được **trang nào là chính thức** (`index.html` hay `qc.html`) — nếu không,
   mọi tối ưu làm trên `qc.html` sẽ không tới tay người dùng (xem `SYSTEM_ARCHITECTURE.md` §1.2).
3. Có **bản `spm_flatten.py` thật** để mọi thay đổi liên quan dữ liệu không bị lệch cấu trúc.

---

## 4. Cách đo lại sau này (để có bằng chứng, không đoán)
- DevTools → Network: tổng byte + thời gian `DOMContentLoaded` khi mở `qc.html` (tải sạch cache).
- DevTools → Performance: thời gian một cú bấm lọc xưởng (từ `tog()` đến khi vẽ xong).
- Đếm băng thông poll: để tab mở 1 giờ, xem tổng byte của `qcdata.js` trong Network.
- Sau mỗi thay đổi: đối chiếu `check.f/w/p` và các KPI trang Tổng quan — **phải lệch 0**.

---

## 5. Chưa xác định được
- Số người dùng đồng thời thực tế → **UNKNOWN — NEED USER CONFIRMATION**
- Thời gian mở trang thực tế tại nhà máy (mạng, cấu hình máy) → **UNKNOWN — NEED USER CONFIRMATION**
- Có ai mở dashboard trên điện thoại / 3G không → **UNKNOWN — NEED USER CONFIRMATION**
- Giới hạn quota gviz thực tế khi nhiều người cùng mở tab Doc Control → **UNKNOWN — NEED USER CONFIRMATION**
