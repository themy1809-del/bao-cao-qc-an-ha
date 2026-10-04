# HỆ 4 — ĐỒNG BỘ THEO BẢN ĐỒ CỘT (BanDoCheckList)

Máy công ty mở từng file checklist trên ổ `Z:` (**chỉ đọc, không lưu**), lấy **đúng các cột đã khai**
trong file Google Sheet **BanDoCheckList**, rồi ghi vào **chính file đó**: mỗi dự án 1 tab.
Chạy tự động **17:30 hằng ngày** (sau KEO_DULIEU 17:00 của hệ 1 — hai hệ độc lập, không dùng chung code).

```
BanDoCheckList (tab Data Qc Doc / NDT / CongDoan NT)
      │  ① PC hỏi: "hôm nay kéo những gì?"  (GET ?lenh=viec)
      ▼
KEO_BANDO.vbs trên PC ── mở Excel Z:\...\checklist.xlsx/.xlsb/.xlsm (chỉ đọc)
      │  ② gửi từng gói 1.000 dòng (POST lenh=ghi)
      ▼
BanDoCheckList: tab "<tên dự án>", tab "NDT - <tên dự án>", NHAT KY DONG BO, TONG HOP DONG BO
```

## 1. Bộ file

| File | Đặt ở đâu | Việc |
|---|---|---|
| `DONGBO_BANDO.gs` + `appsscript.json` | Apps Script **gắn vào BanDoCheckList** | đọc bản đồ, nhận dữ liệu, ghi tab |
| `KEO_BANDO.vbs` | 1 thư mục trên máy công ty (vd `D:\QC_BANDO\`) | mở Excel, lấy cột, gửi lên |
| `CAI_LICH_BANDO.bat` | cùng thư mục với VBS | tạo lịch 17:30 |

## 2. Cài đặt lần đầu (khoảng 15 phút)

**Bước 1 — gắn script vào BanDoCheckList** (cần quyền **Chỉnh sửa** file; file do thonhv@daidung.vn sở hữu)
1. Mở BanDoCheckList → **Tiện ích mở rộng → Apps Script**.
2. Xoá nội dung `Code.gs`, dán toàn bộ `DONGBO_BANDO.gs`.
3. ⚙️ Cài đặt dự án → tick **Hiển thị tệp kê khai "appsscript.json"** → dán nội dung `appsscript.json`
   (múi giờ phải là **(GMT+07:00) Ho Chi Minh**).
4. Chọn hàm **`taoKhoa`** → **Chạy** → cấp quyền → mở **Nhật ký thực thi**, chép dãy `KHOA_BANDO = ...`.
5. Chọn hàm **`xemTruoc`** → **Chạy** → nhật ký hiện số việc và các lỗi bản đồ (bản 04/10: 119 việc, 14 lỗi — xem mục 5).

**Bước 2 — triển khai web app (CHỈ LÀM 1 LẦN)**
1. **Triển khai → Tùy chọn triển khai mới → Ứng dụng web**. Thực thi với tư cách: **Tôi**. Ai có quyền truy cập: **Bất kỳ ai**.
2. Chép URL `/exec`. Mở URL trên trình duyệt → phải thấy `READY - DONG BO BAN DO - phien ban dang chay: 04/10 ban-1`.
3. Những lần sửa code sau: **Triển khai → Quản lý → ✏️ → Phiên bản mới** (GIỮ NGUYÊN URL). Không tạo triển khai mới.

**Bước 3 — máy công ty**
1. Chép `KEO_BANDO.vbs` + `CAI_LICH_BANDO.bat` vào 1 thư mục, vd `D:\QC_BANDO\`.
2. Mở `KEO_BANDO.vbs` bằng Notepad, sửa 2 dòng đầu:
   `URL_WEBAPP = "<URL /exec ở bước 2>"`, `KHOA = "<dãy KHOA_BANDO ở bước 1>"`. Lưu.
3. **Nhấp đúp `KEO_BANDO.vbs`** để chạy thử → xong sẽ hiện hộp thoại "XONG – n tab".
4. Kiểm tra trên BanDoCheckList: tab **TONG HOP DONG BO** (dòng đỏ = có lỗi), tab **NHAT KY DONG BO**.
5. Nhấp đúp **`CAI_LICH_BANDO.bat`** → tạo lịch 17:30 hằng ngày.

> Máy phải **đang đăng nhập** lúc 17:30 (để thấy ổ `Z:`). Nếu muốn chạy khi đã khoá máy/đăng xuất,
> điền `THAY_O_Z = "\\SERVER\THU_MUC"` (đường dẫn mạng thật của ổ Z) trong VBS.

## 3. Mỗi tab dự án có gì

- **Tab `<tên dự án>`** (82 cột cố định): Nguồn file · Nguồn sheet · Dòng Excel · Phân khu quản lý · Index ·
  Member Punch No · GUID · Weight · **CĐ1…CĐ16 × (RFI, Date, Report, QC Check)** — tên công đoạn lấy
  từ tab `CongDoan NT` · 10 cột NDT (khi NDT nằm ngay trong sheet checklist).
- **Tab `NDT - <tên dự án>`**: khi tab NDT khai file NDT riêng — Member Punch No + 10 cột NDT.
- Dự án có nhiều sheet/file (vd Cầu Mỹ Thủy 12 sheet) → **gộp vào 1 tab**, phân biệt bằng cột Nguồn.
- Chỉ lấy dòng có **Member Punch No hoặc GUID**. Giá trị giữ **nguyên văn** (kể cả "Not applicable");
  ngày ghi dạng `dd/mm/yyyy`; Weight là số.
- Mỗi lần chạy **ghi đè tại chỗ** (không xoá tab → giữ link/gid). File không mở được → **giữ dữ liệu cũ**
  của tab đó và ghi lỗi.

## 4. Khai báo — quy tắc (không tự đoán cột)

- Ô vị trí cột phải là **chữ cái cột** (A, AB, BT…). Trống / "Not applicable" / "-" / "N/A" = không khai.
- Bắt buộc: ĐƯỜNG DẪN, TÊN FILE, TÊN SHEET, DÒNG DỮ LIỆU ĐẦU TIÊN, **cột MEMBER PUNCH NO**. Thiếu → dòng đó
  **KHÔNG kéo**, báo ở NHAT KY.
- Tab NDT: nếu **TÊN FILE trống** → NDT nằm trong sheet checklist (chỉ áp khi dự án có đúng 1 sheet checklist).
  Nếu có TÊN FILE → cần TÊN SHEET, DÒNG ĐẦU, cột MEMBER PUNCH NO.
  Thư mục file NDT: lấy cột **"ĐƯỜNG DẪN"** của tab NDT nếu có (thêm cột mới với đúng tiêu đề này, ở
  vị trí nào cũng được); không có thì tìm trong thư mục checklist của dự án.
- Đuôi gõ nhầm `.xlxs` → tự dùng `.xlsx` nếu có, ghi chú lại.
- Tiêu đề trong tab Data Qc Doc được dò theo **TÊN**, nên chèn thêm cột không làm lệch.
  Nhóm công đoạn đếm theo **vị trí** (nhóm "công đoạn 15" thứ hai = CĐ16).

## 5. Lỗi bản đồ hiện có (04/10/2026) — cần người phụ trách sửa

| Tab / dòng | Dự án | Thiếu |
|---|---|---|
| Data Qc Doc 35 | 10626-008 Sân vận động PVF Hưng Yên | cột MEMBER PUNCH NO |
| Data Qc Doc 39 | 10825-051 Nhà xưởng An Phước 2 | cột MEMBER PUNCH NO |
| Data Qc Doc 40 | 10725-002 Perdaman Urea Plant Towers | cột MEMBER PUNCH NO |
| Data Qc Doc 47 | 10626-073 Sân bay Phú Quốc sàn thép | cột MEMBER PUNCH NO |
| NDT 23, 24 | Kingston (Ducting / Steel) | cột DỰ ÁN đang là đường dẫn, chưa có tên dự án |
| NDT 44 | 10725-105 MTE India | dòng đầu, cột MEMBER PUNCH NO |
| NDT 45 | 10725-012 Gregory Ducting | tên sheet, dòng đầu, cột MEMBER PUNCH NO |
| NDT 46–50 | APEC S3 Bao che, PVF Hưng Yên, Perdaman, Wolf Summit, Danieli | cột MEMBER PUNCH NO |

Sửa xong bản đồ không cần làm gì thêm — lần chạy sau tự lấy.

## 6. Khi có sự cố

| Hiện tượng | Xem / làm |
|---|---|
| Hộp thoại "KHÔNG lấy được danh sách việc: SAI KHOA" | KHOA trong VBS khác Script Properties → chép lại |
| `LOI HTTP 401/403` | web app chưa để "Bất kỳ ai" |
| Tab TONG HOP dòng đỏ "KHONG THAY FILE" | đường dẫn/tên file trong bản đồ sai, hoặc ổ Z: chưa kết nối |
| "KHONG CO SHEET" | tên sheet trong bản đồ khác tên thật (phân biệt dấu cách) |
| "KHONG MO DUOC FILE" | file có mật khẩu / hỏng |
| Lịch không chạy | máy tắt/đăng xuất lúc 17:30; xem `NHAT_KY_BANDO.txt` cạnh VBS |
| "Dang co phien khac chay" | xoá `DANG_CHAY_BANDO.khoa` (tự hết hạn sau 3 giờ) |
