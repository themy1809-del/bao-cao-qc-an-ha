# Mẫu sheet "Phân bổ dự án theo tổ" của xưởng (PB tổ)

Dùng cho tab **Sản lượng PB** của `ban_do_qc.html`: trang so từng dòng phân bổ với sản xuất tháng (SPM)
và hiện **Hoàn thành / Còn lại / Vượt PB / Ngoài PB** cho từng xưởng. File mẫu: `mau/PB_TO_MAU.csv`
(mở Google Sheets → Tệp → Nhập → tải file này lên).

## Quy tắc bắt buộc (trang đọc theo đúng vị trí cột)
| Cột | Nội dung | Ghi chú |
|---|---|---|
| A | để trống | |
| B | STT | dòng tổng ghi `Total` (trang bỏ qua) |
| C | Mã + tên dự án | **bắt đầu bằng mã** dạng `10626-051 …` — mã phải trùng mã trên SPM |
| D | Khối lượng thực hiện của dự án trong tháng | **đơn vị TẤN** |
| E | Còn lại (chuyển tháng sau) | tấn |
| F | Tổ ráp thô | `RT1`, hoặc `RHT5 - RHT6` |
| G | Tổ ráp hoàn thiện | `RHT1`…`RHT6` (= TO1RH…TO6RH trên SPM), `RT1` (= TO1RT). Tên khác (vd `Toàn phát`) = thầu phụ, không theo dõi SPM |
| H | Khối lượng giao cho tổ ở cột G | tấn. Ghi chữ (vd `Đã xong`) nếu không còn khối lượng |
| I | Khối lượng lắp thử | tấn, có thể trống |
| J | Khu vực lắp thử | có thể trống |

- Tiêu đề (ô B2) phải có chữ **`THÁNG mm/yyyy`** — trang lấy tháng từ đây.
- Một dự án chia cho **nhiều tổ**: dòng đầu ghi đủ B–H, các dòng sau **chỉ ghi G và H** (để trống B–F).
- Mỗi tháng 1 tab; tab đang dùng đặt **đầu tiên** (hoặc báo `gid` của tab).
- Mỗi xưởng 1 file riêng.

## Nối vào trang
1. Chia sẻ file: **Bất kỳ ai có liên kết → Người xem** (để trang tự đọc mỗi 5 phút).
2. Thêm id file vào `phan_bo_qc.js`, mục `PB_SHEETS`, ví dụ:
   `PB_SHEETS: {AH3:{id:'…',gid:'0'}, AH4:{id:'…',gid:'0'}}`
3. Nếu file không chia sẻ công khai: xuất CSV rồi chạy
   `python cong_cu_pc/pb_to_trich.py AH4 2026-12 <file.csv>` (ghi vào `pb_to.js`).

## Cách trang tính
So từng dòng (tổ × dự án) với tấn ráp của **chính tổ đó, dự án đó** trong kỳ 21 → 20 theo SPM:
Hoàn thành = min(SX, PB) · Còn lại = PB − SX · Vượt PB = SX − PB · Ngoài PB = SX của tổ/dự án không có trong sheet.
