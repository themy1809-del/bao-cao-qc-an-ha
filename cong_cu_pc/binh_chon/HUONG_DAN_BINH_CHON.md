# BÌNH CHỌN QC AN HẠ — hướng dẫn triển khai & vận hành (14/11/2026)

Web app bình chọn chạy trên **Google Apps Script gắn với Google Sheet** của tài khoản công ty `mydt@daidung.vn`.
Người bầu đăng nhập bằng **email công ty @daidung.vn** → hệ thống tự nhận diện, không nhập tên, không mã PIN.
Mỗi người chọn đúng **2** ứng viên (sửa được trong tab `CAU_HINH`). Kết quả tính lại sau **mỗi phiếu**, trang tự làm mới mỗi 10 giây.

## 1. Thành phần

| Thành phần | Ở đâu | Ghi chú |
|---|---|---|
| Google Sheet **"QC An Hạ — BÌNH CHỌN (phiếu + kết quả)"** | Drive của `mydt@daidung.vn` — id `1yzJkKXO4VVUvZfV-dbCu4_1viZ7QXgoYm4jA71AFD6w` | 6 tab: `CAU_HINH`, `UNG_VIEN` (34), `NGUOI_BO_PHIEU` (57), `PHIEU`, `KET_QUA`, `NHAT_KY`. Đã nạp sẵn dữ liệu 14/11. |
| `BINH_CHON.gs` | thư mục này → dán vào Apps Script của Sheet (tệp `Code.gs`) | Toàn bộ logic: xác thực email, chống bầu 2 lần, khoá ghi, tính kết quả, đọc ảnh Drive. |
| `binh_chon.html` | thư mục này → dán vào Apps Script (tệp HTML tên **`binh_chon`**) | Giao diện: bỏ phiếu (thẻ có ảnh), kết quả (xếp hạng + thanh), sáng/tối, điện thoại/PC. |
| Thư mục ảnh **"Anh profile"** | Drive `thaonm@daidung.vn`, id trong `CAU_HINH.THU_MUC_ANH` | Tên file = `MSNV<tab>HỌ TÊN`; script khớp theo MSNV, không có thì theo tên (2 người có MSNV khác nhau giữa 2 danh sách). |

Trong repo **không có** tên nhân sự: danh sách nằm trong Sheet. `binh_chon.html` mở trực tiếp trên máy = chế độ xem thử với tên giả.

## 2. Triển khai (1 lần, ~10 phút, làm bằng tài khoản `mydt@daidung.vn`)

1. Mở Sheet → **Tiện ích mở rộng → Apps Script**. Xoá code mẫu.
2. Tệp `Code.gs`: dán **toàn bộ** `BINH_CHON.gs`. Bấm **+ → HTML**, đặt tên **`binh_chon`** (không gõ `.html`), dán **toàn bộ** `binh_chon.html`. Lưu (Ctrl+S).
3. Bánh răng **Cài đặt dự án** → tích *Hiển thị tệp manifest "appsscript.json"* → mở `appsscript.json`, sửa `"timeZone": "Asia/Ho_Chi_Minh"`. Lưu.
4. Chọn hàm **`khoiTao`** → **Chạy** → cấp quyền (Sheet + Drive). Nhật ký phải in `OK 14/11 ban-1 — 34 ung vien, 57 nguoi bo phieu`.
   Nếu báo *Khong mo duoc thu muc anh* → nhờ `thaonm@daidung.vn` chia sẻ thư mục "Anh profile" (quyền xem) cho `mydt@daidung.vn`, hoặc xoá giá trị `THU_MUC_ANH` (trang vẫn chạy, không có ảnh).
5. **Triển khai → Triển khai mới** → Loại **Ứng dụng web**:
   - Mô tả: `BINH CHON QC`
   - Thực thi với tư cách: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai trong daidung.vn** ← bắt buộc, để script đọc được email người bầu.
   → **Triển khai** → copy URL `…/exec` → gửi Zalo cho phòng QC.
6. Tự thử: mở URL bằng email công ty → trang hiện tên bạn (email `mydt` đã gắn sẵn với tên bạn trong `NGUOI_BO_PHIEU`) → chọn 2 người → Gửi → tab Kết quả nhảy số ngay. Mở Sheet thấy dòng mới ở `PHIEU` và `KET_QUA` cập nhật.

**Cập nhật code về sau**: Triển khai → Quản lý triển khai → ✏ → Phiên bản mới (GIỮ NGUYÊN URL). Không tạo triển khai mới.

## 3. Luồng người bầu

1. Mở link → đăng nhập Google bằng email công ty.
2. Email có sẵn trong `NGUOI_BO_PHIEU` → vào thẳng. Chưa có → màn **"Bạn là ai?"**: chọn tên trong danh sách (chỉ hiện tên chưa ai nhận) → email được ghi vào cột `EMAIL`, lần sau không hỏi lại. Không thấy tên → tự khai (khi `CHO_PHEP_NGOAI_DS = TRUE`), ghi chú "Ngoài DS" để quản trị kiểm tra.
3. Bấm 2 thẻ → thanh dưới hiện "Đã chọn 2/2" → **Gửi phiếu** → xác nhận → màn "Đã ghi nhận" → **Xem kết quả**.
4. Gửi lại = **thay** phiếu cũ (khi `CHO_SUA_PHIEU = TRUE`); mỗi email luôn chỉ 1 dòng trong `PHIEU`. Không được chọn chính mình (so cả MSNV lẫn tên).

## 4. Tab `CAU_HINH` (sửa trực tiếp, có hiệu lực ngay lần tải trang sau)

| Khoá | Ý nghĩa |
|---|---|
| `TIEU_DE`, `MO_TA`, `TEN_DON_VI` | Chữ trên đầu trang |
| `SO_NGUOI_CHON` | Số người phải chọn mỗi phiếu (mặc định 2) |
| `MO_BINH_CHON` | FALSE = đóng (chỉ còn xem kết quả) |
| `HAN_CHOT` | `dd/mm/yyyy hh:mm`; để trống = không giới hạn; qua hạn tự đóng |
| `CHO_SUA_PHIEU` | TRUE = gửi lại thay phiếu cũ; FALSE = gửi rồi khoá |
| `TU_CHON_MINH` | FALSE = cấm chọn chính mình |
| `HIEN_KET_QUA` | `MOI_NGUOI` · `QUAN_TRI` (chỉ quản trị) · `SAU_HAN_CHOT` |
| `CHO_PHEP_NGOAI_DS` | TRUE = email không có trong `NGUOI_BO_PHIEU` vẫn được tự khai tên |
| `THU_MUC_ANH` | ID thư mục ảnh Drive |
| `QUAN_TRI_EMAIL` | Email quản trị (cách nhau dấu phẩy): thấy danh sách **chưa nộp**, xem kết quả khi đang ẩn, nút *Làm mới ảnh* |

Thêm/bớt ứng viên: sửa tab `UNG_VIEN` (cột `DUOC_BAU` = FALSE để tạm ẩn). Thêm người bầu: thêm dòng `NGUOI_BO_PHIEU` (điền sẵn `EMAIL` nếu biết → khỏi bước "Bạn là ai?").
Huỷ phiếu của một người: xoá dòng của họ trong `PHIEU` rồi chạy lại `khoiTao` (hoặc đợi phiếu kế tiếp, `KET_QUA` tự tính lại).

## 5. Bảo mật / dữ liệu

- Sheet để **riêng tư** (không "bất kỳ ai có link"). Web app chỉ cho người trong `daidung.vn`; script chạy bằng quyền chủ sở hữu nên người bầu **không** cần quyền xem Sheet.
- Trang chỉ trả về số phiếu tổng hợp; ai bầu ai chỉ xem được trong tab `PHIEU` (chủ sở hữu Sheet).
- Ảnh được đọc một lần và cache 6 giờ trên Apps Script (`CacheService`), file > 95 KB bị bỏ qua (đổi ảnh nhỏ hơn).
- Không commit danh sách nhân sự / phiếu vào repo công khai (quy tắc CLAUDE.md §4B).

## 6. Kiểm tra trong repo

```bash
node kiem_tra/kiem_cu_phap.js cong_cu_pc/binh_chon/binh_chon.html
python3 -m http.server 8765 &
node kiem_tra/ui_audit.js cong_cu_pc/binh_chon/binh_chon.html   # phải DAT HET (chế độ xem thử)
```
