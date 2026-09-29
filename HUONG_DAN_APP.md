# HƯỚNG DẪN DÙNG APP TRA CỨU HỒ SƠ QC
# `app.html` — Nhà máy An Hạ, DDC

> Dành cho **người dùng cuối** (QC, điều hành, kho vận). Không cần biết gì về code.
> Phần kỹ thuật dành cho người sửa code nằm ở cuối, mục 8.

---

## 1. App này trả lời câu gì?

**"Cấu kiện này hồ sơ tới đâu rồi?"**

Gõ một mã cấu kiện → biết ngay: đã mời fit-up chưa, có báo cáo FUR chưa, đã mời nghiệm thu
final chưa, có DIR/VIR chưa, đã trình kí chưa, đã bàn giao hồ sơ chưa — và **có bị nâng Rev
mà chưa nghiệm thu lại không**.

Dán **cả một danh sách** (hoặc kéo file Excel vào) → ra bảng tình trạng của toàn bộ danh sách,
kèm số liệu tổng hợp, và **xuất ra Excel** được.

**App chỉ ĐỌC.** Không sửa, không ghi gì vào Google Sheet. Dùng thoải mái, không sợ hỏng dữ liệu.

---

## 2. Mở app

Mở đường dẫn `app.html` trên trang QC (hỏi anh The My để lấy link chính xác).
Chạy được trên máy tính và điện thoại. Không cần cài gì, không cần đăng nhập.

---

## 3. Việc ĐẦU TIÊN phải làm: tải dự án

App mở lên sẽ tự vào thẻ **Dự án**.

1. Tìm dự án cần tra trong danh sách.
2. Bấm **Tải**.
3. Chờ vài giây — thẻ chuyển sang **màu xanh** và hiện số cấu kiện (ví dụ *✓ 45.832 cấu kiện*).

> **Chỉ cần tải một lần.** Sau đó mọi thao tác tra cứu chạy **tức thì ngay trên máy anh**,
> không phải chờ mạng nữa.

**Tải được nhiều dự án cùng lúc.** Khi đó tra cứu sẽ tìm xuyên suốt tất cả các dự án đã tải —
tiện khi danh sách mã trộn nhiều dự án.

### Nếu thẻ dự án hiện màu ĐỎ
Nghĩa là không đọc được. Lý do thường gặp:

| Báo lỗi | Nghĩa là | Cách xử lý |
|---|---|---|
| *Sheet chưa chia sẻ công khai* | File dự án chưa mở quyền xem cho người có link | Báo anh The My mở quyền **Người xem** |
| *Layout chưa hỗ trợ* | Bảng gốc của dự án theo mẫu app chưa biết đọc | Báo anh The My kèm tên dự án |
| *HTTP 4xx / 5xx* | Mạng hoặc Google đang trục trặc | Bấm **Thử lại** |

*Ghi chú (28/09/2026): hai dự án **10726-043 WOLF SUMMIT** và **WOLF QC DINH FITUP** hiện
**chưa chia sẻ** nên app không tải được.*

---

## 4. Tra MỘT mã

Vào thẻ **Tra cứu**, gõ mã vào ô lớn rồi bấm **Enter**.

- Gõ **một phần** của mã cũng ra (ví dụ gõ `ASL2001` sẽ ra mọi cây thuộc bản vẽ đó).
- Bấm phím `/` ở bất cứ đâu để nhảy ngay vào ô tìm.
- Dưới ô tìm có **6 mã vừa tra gần nhất**, bấm là tra lại.

### Đọc kết quả

**Thanh bậc tiến độ** — đọc từ trái sang phải:

```
Mời fitup → FUR → Mời final → DIR/VIR → Trình kí → Bàn giao
```

- Ô **xanh lá có dấu ✓** = đã xong bậc đó.
- Ô **viền xanh dương** = bậc đang tới, tức là **việc cần làm tiếp theo**.
- Ô **xám mờ** = chưa tới.

**Nhãn màu bên cạnh mã:**

| Nhãn | Nghĩa |
|---|---|
| 🟢 Xanh lá | Hồ sơ đã xong bước đó |
| 🔵 Xanh dương | Đang chạy |
| 🟡 Vàng | Chưa mời nghiệm thu |
| 🔴 **NÂNG REV — CẦN NT LẠI** | **Quan trọng nhất.** Cây này đã nghiệm thu ở rev cũ, nhưng bản vẽ đã nâng rev → **phải mời nghiệm thu lại** |
| 🟡 mời lại | RFI có đuôi `-R2`/`-R3`, hoặc đã mời nhiều đợt |

Bên dưới là **toàn bộ thông tin hồ sơ**: bản vẽ, khu vực/hạng mục, milestone, xưởng, rev,
ngày mời fitup, số RFI, báo cáo FUR, ngày mời final, số DIR/VIR, QC kiểm, trình kí, bàn giao, NDT.

Nút **Chép mã** để dán mã sang chỗ khác.

---

## 5. Tra NHIỀU mã — phần hay dùng nhất

### Cách 1: dán danh sách
Vào thẻ **Tra cứu**, kéo xuống ô **"Tra nhiều mã cùng lúc"**, dán danh sách —
**mỗi dòng một mã** (ngăn bằng dấu phẩy hoặc tab cũng được) → bấm **Tra danh sách**.

### Cách 2: nhập từ file
Bấm **Nhập từ file**, chọn file `.xlsx`, `.xls`, `.csv` hoặc `.txt`.
App **tự nhặt mọi ô trông giống mã cấu kiện** (có cả chữ lẫn số, dài từ 4 ký tự) — không cần
cắt gọt file trước. Nhập xong app tra luôn.

> Danh sách dài (hàng nghìn mã) sẽ mất một lúc — app hiện **"đang tra 1.200 / 3.000 mã…"**
> và **trang vẫn dùng được bình thường**, không bị đơ.

### Đọc bảng kết quả

Trên cùng là **6 thẻ số liệu**, **bấm vào thẻ nào là lọc theo thẻ đó**:

| Thẻ | Nghĩa |
|---|---|
| Mã đã tra | Tổng số mã trong danh sách |
| Không tìm thấy | Không có trong các dự án **đã tải** — thường là do chưa tải đúng dự án |
| Chưa mời NT final | **Việc cần làm** |
| Đã bàn giao hồ sơ | Đã xong hẳn |
| Nâng Rev — NT lại | **Gấp** — phải mời nghiệm thu lại |
| **Chỉ khớp một phần** | ⚠️ **Đọc kỹ mục dưới** |

#### ⚠️ Nhãn "khớp một phần" nghĩa là gì?

Khi mã anh tra **không khớp đúng** với mã nào, app sẽ tìm cây có mã **chứa** chuỗi anh nhập
và hiện nó ra, kèm nhãn vàng **"khớp một phần"**.

**Đây KHÔNG chắc là cây anh cần.** Ví dụ tra `05ASL2001-05` (gõ thiếu) thì app trả về
`05ASL2001-054` — có thể đúng, mà cũng có thể anh đang cần `-051`.

👉 **Thấy nhãn này thì phải kiểm lại mã gốc.** Bấm thẻ **"Chỉ khớp một phần"** để lọc ra
toàn bộ các dòng như vậy và soát một lượt.

Ô **Lọc nhanh** ở dưới lọc tiếp theo mã hoặc theo tên bản vẽ.
Bấm **một dòng bất kỳ** để mở chi tiết đầy đủ của cây đó.

### Xuất Excel
Bấm **Xuất Excel** → file `TraCuu_HoSoQC_<ngày>.xlsx`, **27 cột**, có cột **"Kiểu khớp"**
ghi rõ *khớp đúng* hay *KHỚP MỘT PHẦN*. Nút **In** để in hoặc lưu PDF.

---

## 6. Hai thẻ còn lại

**Bản vẽ** — danh sách bản vẽ, sắp theo số cây bị nâng Rev rồi tới số lượng cấu kiện.
Mỗi dòng có thanh **tiến độ mời nghiệm thu**. Bấm một bản vẽ để xem toàn bộ cây thuộc bản vẽ đó.

**Tổng quan** — số liệu của **toàn bộ dự án đã tải**:
- 6 thẻ số lớn
- Biểu đồ **Bậc tiến độ hồ sơ**: còn bao nhiêu cây ở mỗi bậc
- Biểu đồ **Tiến độ theo xưởng**: mỗi xưởng chia 3 phần **không chồng lấn** —
  đã bàn giao / đã mời final (chưa bàn giao) / chưa mời final. Ba phần cộng lại đúng bằng tổng.
- Bảng **cảnh báo nâng Rev** — bấm một dòng để xem chi tiết cây đó.

---

## 7. Mẹo dùng nhanh

| Thao tác | Cách |
|---|---|
| Nhảy vào ô tìm | phím `/` |
| Tra | `Enter` |
| Đóng bảng chi tiết bản vẽ | `Esc` |
| Đổi nền sáng / tối | nút ◐ góc phải trên |
| In / lưu PDF | nút **In** ở thẻ Kết quả |

**Số liệu cũ?** App đọc Google Sheet **tại thời điểm bấm Tải**. Muốn số mới nhất thì vào
thẻ **Dự án** bấm **Tải lại**.

---

## 8. Phần dành cho người sửa code

- `app.html` **độc lập** — không ảnh hưởng `index.html`, `qc.html`, `doc.html`.
- Logic đọc bảng gốc nằm ở **`ddc_core.js`** (tách nguyên văn từ `doc.html`). **Đừng viết lại**,
  gọi `DDC_CORE.*`.
- **Không dùng `onclick` nội tuyến với dữ liệu động** — mã cấu kiện và tên bản vẽ có thể chứa
  dấu nháy, sẽ làm vỡ thuộc tính HTML. Dùng `data-*` + uỷ nhiệm sự kiện như hiện tại.
- Bảng màu biểu đồ **đã qua kiểm chứng** (6 kiểm tra, cả nền sáng lẫn tối):
  sáng `#15803D,#2563EB,#B4690E` · tối `#22986A,#3E7CE0,#B5821E`.
  ΔE tritan nằm trong dải sàn → **bắt buộc giữ** chú giải + nhãn trực tiếp + khe hở 2px.
- Mảng khoá `KEYS` được dựng sẵn một lần trong `dungIDX()`. **Đừng gọi `Object.keys(IDX)`
  trong vòng lặp** — trước đây làm vậy khiến 3.000 mã mất 44,5 giây và treo trình duyệt.
- Tra danh sách chạy **theo lô 150 mã** qua `setTimeout` để không chặn luồng giao diện.

### Số đo hiệu năng đã kiểm chứng (45.832 cấu kiện, đúng quy mô `BISON_U2`)

| Thao tác | Thời gian |
|---|---|
| Tải dự án | 1,3 – 2,8 s |
| Bộ nhớ JS | ~121 MB / dự án lớn |
| Tra 1 mã (khớp một phần) | 0,22 s |
| Tra danh sách 500 mã | 1,3 s |
| Thẻ Bản vẽ | 0,2 s |
| Thẻ Tổng quan | 0,4 s |
| **Xấu nhất: 3.000 mã không tồn tại** | **24,8 s, có tiến độ, không treo** |

### Giới hạn đã biết
- Bảng kết quả hiện tối đa **400 dòng** mỗi lần vẽ; danh sách bản vẽ **400**; bảng nâng Rev **300**.
  (Xuất Excel thì **đủ toàn bộ**, không bị cắt.)
- Tải nhiều dự án lớn cùng lúc sẽ tốn bộ nhớ tương ứng (~121 MB mỗi dự án ~45k cây).
- **CHƯA chạy được với Google Sheet thật** trong môi trường phát triển (bị chặn ra
  `docs.google.com`); toàn bộ kiểm thử dùng dữ liệu giả lập đúng cấu trúc gviz.
  **Cần chạy thử thật một lần trên máy người dùng.**
