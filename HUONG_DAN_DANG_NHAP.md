# HƯỚNG DẪN BẬT ĐĂNG NHẬP CHO DASHBOARD QC

> Từ 29/09/2026. Dành cho anh The My (người đẩy dữ liệu từ PC).

## Hiện trạng

- Mã đăng nhập **đã có trên web** nhưng **chưa bật**. Dashboard vẫn chạy như cũ, ai có link cũng xem được,
  vì `qcdata.js` trên GitHub vẫn là dữ liệu thường.
- Đăng nhập **tự bật** ngay khi anh đẩy lên một `qcdata.js` **đã khoá** (làm theo mục dưới).

## Cách hoạt động (1 câu)

`qcdata.js` được **mã hoá trên PC** trước khi đẩy lên. Trên mạng chỉ còn chuỗi mã hoá.
Người xem nhập tên + mật khẩu ở `dangnhap.html`, trình duyệt của họ tự giải mã. Mật khẩu không gửi đi đâu.

## Làm MỘT LẦN trên PC

1. Mở cửa sổ lệnh trong thư mục repo, chạy:
   ```
   pip install cryptography
   ```
2. Chép `nguoi_dung_MAU.csv` thành **`nguoi_dung.csv`** và điền người thật:

   | cột | ghi gì |
   |---|---|
   | `ten_dang_nhap` | chữ thường không dấu, số, `.` `_` `-` (vd `kientv`) |
   | `mat_khau` | **từ 10 ký tự**, mỗi người một mật khẩu riêng |
   | `vai` | ghi `all` (từ 30/09 chế độ xem theo vai trò đã tắt, cột này không còn tác dụng — vẫn phải có cho đúng mẫu) |
   | `ho_ten` | tên hiện trên dashboard |

   `nguoi_dung.csv` **không bao giờ lên GitHub** (đã chặn trong `.gitignore`). Cất file này cẩn thận.
3. Cài chốt chặn để không lỡ đẩy dữ liệu chưa khoá:
   ```
   python khoa_qcdata.py --cai-chan
   ```

## Làm MỖI LẦN cập nhật dữ liệu

> **Cách dễ nhất (01/10/2026):** thay file `CAP_NHAT_VA_PUSH.bat` trên PC bằng bản mới ở
> `cong_cu_pc/CAP_NHAT_VA_PUSH.bat` (tự về máy trong thư mục `qc_dashboard_public` sau lần chạy kế tiếp).
> Bản mới tự chạy `khoa_qcdata.py` khi có `qc_dashboard_public\nguoi_dung.csv`; khoá lỗi thì **không** đẩy dữ liệu chưa khoá.
> Chưa có `nguoi_dung.csv` thì chạy y như bản cũ. Nếu dùng file .bat này thì bỏ qua lệnh tay bên dưới.

Sau khi sinh `qcdata.js` như mọi khi, **trước khi đẩy lên**:
```
python khoa_qcdata.py
```
→ `qcdata.js` được khoá tại chỗ. Bản gốc chưa khoá nằm ở `_out/qcdata_goc.js` (không lên GitHub).
Sau đó đẩy lên như bình thường. Nếu quên bước này, git sẽ **chặn** và báo `CHAN: qcdata.js CHUA KHOA`.

## Việc thường gặp

| Muốn | Làm |
|---|---|
| Thêm người | thêm dòng vào `nguoi_dung.csv` → `python khoa_qcdata.py --tu-goc` → đẩy lên |
| Cho một người **nghỉ xem** | xoá dòng của họ → `python khoa_qcdata.py --tu-goc` → đẩy lên. Kể cả máy đã "ghi nhớ" cũng bị đẩy ra |
| Đổi mật khẩu | sửa cột `mat_khau` → `--tu-goc` → đẩy lên. Người đó phải đăng nhập lại bằng mật khẩu mới |
| Kiểm tra một tài khoản mở được chưa | `python khoa_qcdata.py --thu kientv` (hỏi mật khẩu) |
| Có người quên mật khẩu | đặt mật khẩu mới như dòng "Đổi mật khẩu" |

## Phía người xem

- Mở link dashboard như cũ → tự chuyển sang trang đăng nhập → nhập tên + mật khẩu.
- Ô **"Ghi nhớ trên máy này 30 ngày"**: chỉ bật trên máy riêng.
- Nút **👤 Tên · Đăng xuất** ở đầu trang: xoá sạch dữ liệu đã giải mã trên máy đó.
- Khi anh đẩy dữ liệu mới, người đang đăng nhập **không phải nhập lại** mật khẩu.

## Giới hạn — cần biết

1. Chỉ bảo vệ dữ liệu **từ lúc bật trở đi**. Các bản `qcdata.js` cũ vẫn nằm trong **lịch sử GitHub công khai**.
   Muốn xoá hẳn: chuyển repo sang riêng tư hoặc xoá lịch sử — việc anh phải quyết.
2. Chỉ khoá `qcdata.js`. Các Google Sheet (NCR, KHSX, danh mục dự án) vẫn đọc trực tiếp; mã sheet vẫn nằm
   trong mã nguồn trang, sheet nào để "ai có link cũng xem" thì vẫn xem được.
3. Chặn người ngoài, **chưa chia quyền theo trang**: ai đăng nhập được cũng xem được mọi tab.
4. Độ an toàn phụ thuộc mật khẩu: mật khẩu ngắn/dễ đoán thì dễ bị dò. Dùng ≥ 10 ký tự, không trùng nhau.

## Phần kỹ thuật (người sửa code)

- `khoa_qcdata.py` ↔ `dangnhap.html` phải cùng định dạng `fmt: "qcenc-1"`:
  PBKDF2-SHA256 600.000 vòng (muối cố định theo tên → khoá riêng chỉ đổi khi đổi mật khẩu),
  AES-256-GCM, dữ liệu nén gzip trước khi mã hoá. Mỗi lần khoá sinh khoá dữ liệu mới + `v` + `ts` mới.
- `qc_khoa.js` đặt ngay sau `<script src="qcdata.js">` ở `qc.html` và `kiem_tra_waiting.html`.
  `qcdata.js` chưa khoá → không làm gì. Đã khoá → đọc bản giải mã trong `sessionStorage` (khớp `v` hoặc `ts` mới hơn),
  chưa có thì chuyển `dangnhap.html`. **Không dùng `window.stop()`** — nó huỷ luôn lệnh chuyển trang.
- `dangnhap.html` luôn nạp `qcdata.js?t=…` (bỏ qua bộ đệm) và có cầu chì chống chuyển qua lại quá 3 lần/phút.
- Hai trang lưu `index_backup_1108.html`, `qc_backup_truoc_ddc.html` **không** gắn đăng nhập → khi đã khoá, 2 trang này
  không đọc được dữ liệu (đúng ý: không để lọt).
- Đã kiểm thử 18 kịch bản (sai/đúng mật khẩu, mật khẩu có dấu, ghi nhớ, đăng xuất, dữ liệu mới, thu hồi quyền,
  điện thoại) + KPI sau giải mã khớp 6/6 + chốt chặn git.
