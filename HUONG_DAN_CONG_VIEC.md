# Hướng dẫn — Công việc QC (PMS) & App điện thoại

Cập nhật 31/10/2026. Trang: `ban_do_qc.html` · App: `ban_do_qc.html?app=1`

## 1. Quản lý — triển khai dữ liệu dùng chung (làm 1 lần, ~10 phút)

Chưa làm bước này thì bảng công việc **chỉ lưu trên từng máy** (mỗi máy một bảng riêng).

1. Tạo Google Sheet mới tên **QC CONG VIEC**. Chia sẻ: **chỉ nội bộ** (không bật "Bất kỳ ai có link").
2. Trong Sheet: **Tiện ích mở rộng → Apps Script**. Xoá code mẫu, dán toàn bộ file `cong_cu_pc/QC_CONG_VIEC.gs`, bấm **Lưu**.
3. Chọn hàm `khoiTao` → **Chạy** → cấp quyền. Sheet có thêm 2 tab **VIEC** và **NHAT KY**.
4. **Cài đặt dự án** (bánh răng) → **Thuộc tính tập lệnh** → Thêm `PMS_KEY` = mã nhóm tự đặt (ví dụ 8 ký tự). Mã này dùng để **đọc và ghi** — chỉ đưa cho QC/quản lý.
5. **Triển khai → Triển khai mới → Ứng dụng web** · Thực thi: **Tôi** · Quyền truy cập: **Bất kỳ ai** → copy URL kết thúc bằng `/exec`.
6. Dán URL vào `pms_api.js`: `window.QC_PMS_API = "https://script.google.com/macros/s/…/exec";` rồi đẩy lên GitHub.
7. Mỗi máy (kể cả điện thoại QC) mở **Không gian công việc → ⚙ → Mã nhóm** → nhập mã → Lưu.

**Cập nhật code Apps Script về sau:** Triển khai → Quản lý triển khai → ✏ → **Phiên bản mới** (giữ nguyên URL). Không tạo triển khai mới.
**Đổi mã nhóm:** sửa `PMS_KEY` → mọi máy nhập lại mã trong ⚙.

## 2. QC — cài app lên điện thoại

1. Mở link `…/ban_do_qc.html?app=1`.
2. **Android (Chrome):** bấm "📲 Cài app vào điện thoại" cuối trang, hoặc ⋮ → Thêm vào màn hình chính.
   **iPhone (Safari):** nút Chia sẻ → Thêm vào MH chính.
3. Lần đầu: chọn **"Bạn là ai"** (gõ tên / mã SPM). Vào ⚙ của Không gian công việc nhập **mã nhóm**.

## 3. Việc hằng ngày

| Ai | Làm gì | Ở đâu |
|---|---|---|
| Hệ thống | Kế hoạch ngày tự thành việc (theo phân bổ + tồn chờ NT SPM) | tự động |
| Quản lý | Giao thêm việc: **＋ Tạo việc** (người, dự án, tổ, khâu, tấn, ưu tiên, hạn, nhãn, mô tả) | Không gian công việc |
| QC | Xem **Việc của tôi**, 🔔 thông báo khi được giao / trả về / bình luận | App |
| QC | Cuối ca: **✍ Nhập kết quả** — Đạt / Không đạt (phiếu kiểm tra, loại lỗi, NCR) / Chưa làm (lý do) → **Gửi** | App |
| Hệ thống | Đạt → **Hoàn thành** · Không đạt → **Chờ duyệt** · Chưa làm → **Vướng** | tự động |
| Quản lý | Mở thẻ Chờ duyệt → chọn **Xử lý** (Sửa lại & NT lại / NCR / Nhượng bộ / Loại bỏ) → **Duyệt**, hoặc **↩ Trả về** | Không gian công việc |
| Quản lý | Theo dõi: **Theo người** (tải từng QC), **Báo cáo** (KH vs TH, đúng hạn, quá hạn), **⬇ Excel** | Không gian công việc |

## 4. Các cách xem

Danh sách (nhóm theo trạng thái / người / dự án / xưởng / ưu tiên) · Kanban (kéo thả) · Lịch tuần · Gantt 4 tuần · Theo người · Báo cáo.
Bộ lọc: người, xưởng, dự án, ưu tiên, nhãn, tìm; phạm vi Hôm nay / Tuần này / Quá hạn / Tất cả. **Góc nhìn đã lưu** giữ bộ lọc hay dùng (lưu trên từng máy).

## 5. Giới hạn hiện tại

- Thông báo hiện khi app **đang mở** (kiểm 1 phút/lần). Thông báo khi app tắt cần máy chủ đẩy — chưa có.
- Đính kèm là **link** (bản vẽ / ảnh trên Drive); chưa tải ảnh trực tiếp lên.
- Tiêu chí & dung sai trong phiếu kiểm tra là **mẫu tạm** — QA cần duyệt / thay bằng ITP thật.
- Kế hoạch ngày dựa trên SPM do PC đẩy (`qcdata.js`); SPM vẫn là nơi ghi nghiệm thu chính thức.
