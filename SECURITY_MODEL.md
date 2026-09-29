# SECURITY_MODEL.md
# Mô hình bảo mật THỰC TẾ (không phải mong muốn) — 28/09/2026

> Tài liệu mô tả **đúng những gì mã nguồn đang làm**. Mọi mục đều có dòng mã dẫn chứng.
> Đây là **báo cáo hiện trạng**, chưa sửa gì. Mọi thay đổi chờ user duyệt.

---

## 0. KẾT LUẬN NGẮN

**Hệ thống hiện KHÔNG CÓ cơ chế xác thực nào.** Không có trang đăng nhập,
không có mật khẩu, không có phiên làm việc, không có phân quyền.
Ranh giới bảo mật duy nhất là **"ai biết link"** —
và các link đó đang nằm trong một **repo GitHub CÔNG KHAI**.

---

## 1. Hệ thống đăng nhập / người dùng hiện có

### 1.1 Phía web (hệ 3) — **KHÔNG CÓ**
Đã tìm toàn bộ `index.html`, `qc.html`, `doc.html`, `section_tracker.html`,
`kiem_tra_waiting.html` với các từ khoá `password / login / đăng nhập / auth / session / role`:
**không có kết quả nào là cơ chế xác thực.**

Những thứ *trông giống* người dùng nhưng **không phải**:

| Nơi | Nội dung | Thực chất |
|---|---|---|
| `doc.html:88` | `<div class="av">QC</div><div class="nm">Phòng QC An Hạ</div><div class="rl">Document Control</div>` | **HTML tĩnh viết cứng** — trang trí, không đọc từ đâu, không kiểm tra gì |
| `qc.html` mục 08 "Phân công QC" | bảng mã QC + email `<mã>@daidung.vn` | **cấu hình gửi mail**, không phải tài khoản. `asgAddRow()` cho phép ai cũng thêm người tuỳ ý |
| `TEAM_DIM = ['hoanx','haont','quankh','trontv','quangnpd']` (`qc.html:2157`) | danh sách mã QC | danh sách thí điểm viết cứng, không phải quyền |
| `?qc=<mã>` trên URL (`qc.html:4562`) | tự lọc theo QC viên | **chỉ là bộ lọc**, không giới hạn người xem thấy gì |
| `localStorage` (`qcFilters_v1`, `qcSpmTheme_v2`, `qcui`, `bsc…`, `ddc_alias`, `ddcA1_<sid>`) | trạng thái UI + cache | lưu trên máy từng người, không phải danh tính |

### 1.2 Phía Apps Script — 2 chuỗi bí mật, cả hai đều là "shared secret" tĩnh

| Chuỗi | Ở đâu | Bảo vệ cái gì | Mức độ lộ |
|---|---|---|---|
| `TOKEN = 'thau2026'` | `AppsScript_Code.gs.txt:11` (server) + `KEO_DULIEU.vbs:18` (PC) | `doPost` của Web App hệ 1 — **đường GHI vào mọi file dự án** | Chỉ nằm trên PC + server. **KHÔNG có trong repo công khai.** |
| `key: 'anha2026'` | **`qc.html:2277` và `index.html:1957`** — tức là **trong repo CÔNG KHAI** | `POST` lưu cấu hình phân công QC vào Web App `AKfycbwXuNubSP2_…` | **ĐÃ LỘ HOÀN TOÀN** |

Không có cơ chế xoay khoá, hết hạn, giới hạn tần suất, hay ghi nhật ký truy cập nào ở cả hai.

### 1.3 Phía Google Sheets — quyền dựa trên chia sẻ file
Hệ 3 đọc Sheet **từ trình duyệt người dùng** qua `gviz`. Để chạy được,
các Sheet phải mở ở mức **"Bất kỳ ai có link → Người xem"**. Mã nguồn tự nói ra điều đó:
- `doc.html:449` / `qc.html:4925`: `throw new Error('sheet chưa chia sẻ công khai?')`
- `qc.html:2878`: `'Chia sẻ "Bất kỳ ai có link → Người xem" chưa?'`
- `qc.html:3313`: `'Kiểm tra mạng và quyền chia sẻ "Anyone with the link"'`

→ Mọi Sheet ở bảng §4 của `SYSTEM_ARCHITECTURE.md` mà hệ 3 đọc đều **đang hoặc cần phải** ở chế độ
link công khai. Trạng thái thực tế từng file: **UNKNOWN — NEED USER CONFIRMATION** (cần user mở
Chia sẻ của từng file và chụp lại).

---

## 1bis. KHẢO SÁT QUYỀN CHIA SẺ THẬT (28/09 — đọc qua connector Google Drive)

Trước đây mục này ghi UNKNOWN. Nay đã đọc **quyền thật của 21 file**. Kết quả:

| File | Chủ sở hữu | Quyền cho `anyone` |
|---|---|---|
| **TRUNG TAM CANH BAO** `1m-3O2N…` | mydt | **domain `daidung.vn` · reader** ✅ **CHUẨN** |
| DANH MUC DU AN (registry) `146lyk2…` | mydt | ⚠️ **commenter** |
| TRUNG TAM KIEM TRA BC & REV `1PlIysoe…` | mydt | reader *(không cần — web không đọc file này)* |
| NCR `1DqerGEB…` | thaonm | reader *(web cần)* |
| Quản lý dự án `1hDz5QDb…` | mydt | reader *(web cần)* |
| KHSX `1kqMlDG4…` | linhdv | reader *(web cần)* |
| SX Tổng hợp `1RrP0qmk…` | linhdv | reader |
| **PACKING Bison** `1Tq3pCRh…` | trungpt | 🔴 **WRITER** |
| **PACKING Viola** `1610zRYT…` | cuongntk | 🔴 **WRITER** |
| **PACKING Gregory** `1RCTPxc3…` | trungpt | 🔴 **WRITER** |
| **DATA VIOLA_KCT** `1cXQjEkY…` | **mydt** | 🔴 **WRITER** |
| **DATA 10725-008 GREGORY** `1FGb7z2cv…` | **mydt** | 🔴 **WRITER** |
| **DATA CHECKLIST_BISON** `1ZsKEknif…` | **mydt** | 🔴 **WRITER** |
| DATA BISON_U2 `1L_PNa0ez…` | mydt | reader |
| DATA VIOLA_TED `1xsZ0suRE…` | mydt | reader |
| DATA SVĐVINFATS `1OSoqIJel…` | mydt | reader |
| DATA 10725-011 TED `15zHzlQP…` | mydt | reader |
| DATA 10726-054 `1EsChDAJ…` | mydt | reader |
| DATA EVAPCO-GREGORY-DUCTING `1ee9XfyCO…` | mydt | reader |
| DATA 10726-043 WOLF `1WSM5ZIb…` | mydt | **KHÔNG chia sẻ** (owner + qaqc.ddc) |
| DATA WOLF QC DINH FITUP `1tsxEgJqV…` | mydt | **KHÔNG chia sẻ** (chỉ owner) |

### 🔴 S0 — SÁU file đang mở `anyone: WRITER` — ai có link cũng **SỬA ĐƯỢC**
Đây là rủi ro **nghiêm trọng nhất** của toàn hệ thống, nặng hơn cả khoá `'anha2026'`.

**(a) Cả 3 file PACKING LIST đều ghi được.** Đây chính là **"cơ sở thật" của việc đã đi hàng** —
thứ mà anh yêu cầu xây vì *"kết quả đi hàng đang chỉ là đoán, không có cơ sở"*.
Ai sửa cột `SL đã đi hàng` là toàn bộ cảnh báo *"đã lên cont mà còn thiếu hồ sơ"* sai theo,
và hệ 2 sẽ **âm thầm tin số sai đó** (nó chỉ đọc, không kiểm chứng ngược).
→ 3 file này **không do anh sở hữu** (trungpt, cuongntk) → phải báo chủ sở hữu đổi.

**(b) 3 file DATA dự án do CHÍNH ANH sở hữu cũng đang mở ghi:**
`VIOLA_KCT` (40.524 CK) · `10725-008 GREGORY` (53.966 CK) · `CHECKLIST_BISON` (45.139 CK)
→ **139.629 cấu kiện** có thể bị người ngoài sửa. Đây là **bảng gốc** mà hệ 1 dựng `DATA QC` từ đó.
→ 3 file này **anh tự đổi quyền được ngay**, không ảnh hưởng gì:
  - Web Doc Control chỉ cần **reader**, không cần writer.
  - Apps Script hệ 1/2 chạy dưới tài khoản của anh nên không phụ thuộc quyền `anyone`.

**Có bằng chứng là hệ thống CÓ THỂ làm đúng:** file `TRUNG TAM CANH BAO` đang để
`domain daidung.vn · reader` — đúng chuẩn nội bộ. Các file khác nên theo mẫu này.

### 🟠 S0b — Registry mở `commenter`, không phải `reader`
`DANH MUC DU AN` cho `anyone` quyền **bình luận**. Người ngoài chèn comment vào registry
gây nhiễu và lộ thêm thông tin; web chỉ cần `reader`.

### 🟡 S0c — Hai file WOLF KHÔNG chia sẻ → tab Doc Control KHÔNG đọc được
`10726-043 WOLF SUMMIT` và `WOLF QC DINH FITUP` không mở cho `anyone`.
Chúng **có trong registry**, nên `_dcLoadProject` sẽ ném lỗi
`'sheet chưa chia sẻ công khai?'`; vì `ddc_data.js` (seed) **không có** 2 dự án này,
tab Doc Control sẽ hiện dòng lỗi thay vì số liệu.
→ Đây vừa là lỗi chức năng vừa là **quyết định phải cân nhắc**: muốn WOLF lên Doc Control
thì phải mở public (thêm phơi nhiễm), hoặc chấp nhận WOLF không có trên web.

### Đánh giá lại S1 sau khảo sát
Repo công khai (S1) vốn đã nặng; **cộng với S0** thì bức tranh là:
link tới các Sheet **nằm sẵn trong repo công khai**, và một số Sheet trong đó **cho ghi**.
Tức là chuỗi tấn công đầy đủ — tìm repo → lấy ID → sửa dữ liệu sản xuất — **không cần mật khẩu gì cả**.

---

## 2. RỦI RO ĐÃ XÁC MINH (xếp theo mức nghiêm trọng)

### 🔴 S1 — Repo CÔNG KHAI chứa toàn bộ dữ liệu QC sản xuất
**Bằng chứng:** GitHub API trả `"private": false`, `"visibility": "public"`, `"has_pages": true`.

Đang công khai cho bất kỳ ai trên Internet:
- `qcdata.js` (1,23 MB): **18.733 dòng** sản lượng, **115 tên dự án đầy đủ** của khách hàng
  (EVAPCO, VinFast, sân bay Long Thành, HPDQ…), **55 mã QC viên**, **45 tổ**, khối lượng tấn từng ngày.
- `ddc_data.js` (278 KB): tình trạng hồ sơ 4 dự án, 89.229 cấu kiện.
- `khsx_data.js`: kế hoạch gia công từng tháng theo xưởng.
- `ncr_data.js`: lịch sử lỗi chất lượng theo dự án/xưởng.
- `aop_data.js`: **toàn bộ chỉ tiêu KPI/AOP 2026 và trọng số BSC của phòng QC**.
- `apiurl.js`: URL Web App phân công QC.
- Mọi Spreadsheet ID ở `SYSTEM_ARCHITECTURE.md` §4.

**Cần user quyết:** repo này có **cố ý** để công khai không?
→ **UNKNOWN — NEED USER CONFIRMATION.** Nếu không cố ý thì đây là mục số 1 phải xử lý.

### 🔴 S2 — Ai cũng ghi đè được cấu hình phân công QC
**Bằng chứng:** `qc.html:2277`
```js
fetch(window.QC_ASSIGN_API,{method:'POST',mode:'no-cors',
  headers:{'Content-Type':'text/plain;charset=utf-8'},
  body:JSON.stringify({key:'anha2026', cfg:cfg})})
```
URL (`apiurl.js`) + khoá (`'anha2026'`) đều nằm công khai trong repo.
Một lệnh `curl` là ghi đè được toàn bộ bảng phân công: đổi email nhận mail nhắc việc,
xoá người, đổi phạm vi xưởng/tổ/dự án. `mode:'no-cors'` nghĩa là client **không đọc được phản hồi**,
nên hỏng cũng khó biết ngay (mã có bù bằng cách `asgFetch` lại sau 1,6 s để đếm số người).

**Hệ quả nghiệp vụ:** mail nhắc tồn waiting hằng ngày có thể bị chuyển sang địa chỉ ngoài.

### 🟠 S3 — XSS lưu trữ: nội dung Google Sheet được nhét thẳng vào `innerHTML`
Dữ liệu từ Sheet (ai sửa được Sheet thì chèn được mã) đi thẳng vào DOM **không escape**:

| Nơi | Trường không escape |
|---|---|
| `qc.html` `renderNCR` (danh sách NCR live) | **ĐÃ SỬA 29/09** — escape qua `ES()` cho mọi trường từ Sheet `1DqerGEB…` |
| `qc.html` `secGalRender()` | **ĐÃ SỬA 29/09** — `_sgE()` escape mọi trường; `_sgImg()` chỉ nhận ảnh `data:image`/`https`/đường dẫn tương đối (chặn `javascript:`); dấu nháy trong tên tổ không còn phá `onclick`. Thử cài mã độc: không chạy. *(Ghi chú: thẻ `secGalCard` hiện không có trong HTML nên khối này đang không hiển thị.)* |
| `qc.html` `_khPjBuild` / các bảng KHSX | **CÒN MỞ** ở 5 tab con cũ (nhiều trường lấy từ Sheet KHSX). Tab con mới "Bảng điều khiển" (khối `kh2909`) đã escape |

(Ngược lại, khối Document Control **có** escape qua `_dcEsc()`, và bảng dữ liệu chi tiết `rDL()`
**có** escape memo — nên rủi ro tập trung ở 3 chỗ trên.)

### 🟠 S4 — JSONP: 6 chỗ nạp `<script>` từ nguồn ngoài, chạy như mã của trang
`asgFetch` (phân công), `secGalLoad` (ảnh Section), `_loadQLDA`, `_qlLoadSec`,
`_khJsonp`, `_khPjLoad` (dự phòng) đều tạo `<script src=…>` rồi **thực thi phản hồi**.
Nếu Web App bị chiếm, hoặc mạng bị can thiệp, kẻ tấn công chạy JS tuỳ ý trong trang dashboard.
Không có `Content-Security-Policy`, không có `Subresource-Integrity` cho 4 thư viện CDN.

### 🟡 S5 — Web App phân công QC không có mã nguồn để rà soát
`AKfycbwXuNubSP2_…` nhận cả GET lẫn POST, ghi cấu hình, và (qua `?gallery=1`) trả ảnh.
Không ai trong repo/gói bàn giao biết nó kiểm tra gì, chạy dưới quyền tài khoản nào,
và `doPost` có xác thực thật không. → **UNKNOWN — NEED USER CONFIRMATION.**

### 🟡 S6 — Truy vấn gviz ghép chuỗi từ ô nhập
`qc.html:5450` (`_dcMemSearchGo`):
```js
q=String(q||'').trim().toUpperCase().replace(/'/g,'');
… "upper("+sel.pnL+") contains '"+q+"'"
```
Có bỏ dấu nháy đơn nên **không thoát được chuỗi**, rủi ro thấp; nhưng đây vẫn là ghép chuỗi
truy vấn thủ công, không giới hạn độ dài, và là thói quen cần bỏ nếu mở rộng.

### 🟡 S7 — `.github/workflows/capnhat.yml` có `permissions: contents: write`
Workflow tự commit + push vào repo. Hiện chưa từng chạy (§1.5 `SYSTEM_ARCHITECTURE.md`),
nhưng nó cho phép **bất kỳ ai push được vào `Update spm/`** kích hoạt một job ghi vào repo.
Với repo công khai, cộng thêm việc `spm_flatten.py` trong repo sinh ra cấu trúc KHÁC bản đang chạy
(`DATA_MODEL.md` §2.4), đây vừa là rủi ro bảo mật vừa là rủi ro số liệu.

### 🟢 S8 — Thông tin cá nhân
Mã QC viên (55 mã) công khai; quy ước email `<mã>@daidung.vn` (`asgAddRow`) nên
**suy ra được email công ty của 55 người**. `qcdata.js` còn cho phép dựng hồ sơ năng suất từng người
theo ngày (`qcHeat`, "Nhịp làm việc QC viên theo ngày").

### 🟢 S9 — Không có nhật ký truy cập, không giới hạn tần suất
Không nơi nào ghi lại ai đã xem/sửa gì trên hệ 3. Hệ 1 có `NHAT_KY.txt` (PC) và tab `NHAT KY`
(registry) nhưng chỉ ghi hoạt động đồng bộ, không ghi truy cập.

---

## 3. Những gì ĐANG làm ĐÚNG (giữ nguyên)

- `TOKEN` hệ 1 **không** bị đưa lên repo công khai.
- `doPost` hệ 1 đặt `lock.tryLock` **bên trong `try`** (nếu không, VBS nhận về trang HTML `<!DOCTYPE`).
- Hệ 2 **chỉ đọc** nguồn, ghi vào **file kết quả riêng** → không thể làm hỏng dữ liệu gốc.
- Hệ 1 có 4 chốt an toàn chống ghi đè `DATA QC` bằng dữ liệu cụt (`DATA_MODEL.md` §3.3).
- Hệ 3 escape đầy đủ trong khối Document Control (`_dcEsc`) và bảng dữ liệu chi tiết.
- `_dcFetch` kiểm tra phản hồi có phải HTML không trước khi parse → phát hiện được sheet chưa chia sẻ.

---

## 4. Thứ tự xử lý ĐỀ XUẤT (chưa làm — chờ user duyệt)

| Ưu tiên | Việc | Ảnh hưởng |
|---|---|---|
| **0a** | **Đổi 3 file DATA của anh từ `anyone: writer` → `reader`** (`VIOLA_KCT`, `10725-008`, `CHECKLIST_BISON`) | **Anh làm được ngay trong 2 phút, không hỏng gì.** Web chỉ cần reader; Apps Script không phụ thuộc |
| **0b** | **Báo trungpt / cuongntk đổi 3 file PACKING từ `writer` → `reader`** | Bảo vệ cơ sở "đã đi hàng" — không tự làm được, phải nhờ chủ sở hữu |
| **0c** | Đổi registry từ `commenter` → `reader` | Anh tự làm; web vẫn chạy bình thường |
| 1 | Xác nhận repo công khai là **cố ý hay không** (S1) | quyết định toàn bộ các bước sau |
| 2 | Nếu không cố ý: chuyển repo sang **private** + đổi cách phát dashboard | Pages của repo private cần gói trả phí → cần phương án thay thế |
| 3 | Bỏ khoá `'anha2026'` khỏi mã client; chuyển xác thực về phía Web App (S2) | phải sửa `qc.html`/`index.html` + Web App |
| 4 | Escape 3 chỗ `innerHTML` còn hở (S3) | sửa nhỏ, khoanh vùng được |
| 5 | Vô hiệu hoá hoặc sửa `capnhat.yml` cho khớp `spm_flatten.py` thật (S7) | tránh ghi đè `qcdata.js` sai cấu trúc |
| 6 | Rà lại quyền chia sẻ từng Google Sheet (§1.3) | cần user thao tác trên Drive |
| 7 | Thêm `.gitignore`, gỡ `__pycache__/*.pyc` khỏi repo | dọn dẹp |

> **KHÔNG thực hiện mục nào trong bảng này cho tới khi user duyệt kiến trúc.**

---

## 5. Chưa xác định được
- Repo công khai là cố ý hay vô ý → **UNKNOWN — NEED USER CONFIRMATION**
- ~~Trạng thái chia sẻ thật của từng Sheet~~ → **ĐÃ XÁC MINH 28/09**, xem §1bis
- 6 file mở `anyone: writer` là **cố ý** hay do lỡ tay → **UNKNOWN — NEED USER CONFIRMATION**
- Có muốn đưa 2 dự án WOLF lên tab Doc Control không (phải mở public) → **UNKNOWN — NEED USER CONFIRMATION**
- Mã nguồn + cơ chế xác thực của Web App phân công QC → **UNKNOWN — NEED USER CONFIRMATION**
- Dashboard có được phát ra ngoài công ty (khách hàng EVAPCO…) không → **UNKNOWN — NEED USER CONFIRMATION**
