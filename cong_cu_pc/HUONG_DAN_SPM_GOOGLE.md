# Cập nhật SPM bằng Google (không cần Python / Git / máy cá nhân)

File code: `cong_cu_pc/SPM_TU_DONG.gs` (bản 15/10/2026, `v2026-10-15-goc`).
Phần xử lý là bản chuyển nguyên văn từ `spm_flatten.py`. Đã đối chiếu trên 3 file SPM thật: **giống hệt 100%**
(từng số, từng dòng, đúng thứ tự). File SPM lỗi (mất cột ngày): cả hai bản đều **dừng, giữ nguyên dữ liệu cũ**.

## Cách chạy hằng ngày (sau khi cài xong)
SPM → Export to Excel (bố cục 7 cấp + Memo) → **kéo file vào thư mục Drive `SPM_UPLOAD`**. Hết.
Script cứ 30 phút kiểm 1 lần, xử lý, đẩy lên web, gửi mail báo kết quả, chuyển file sang `SPM_DA_XU_LY`.

Bố cục Pivot bắt buộc (SPM chỉ xuất được 7 cấp + Memo):
`Project > Phase > Workshop > Work Date > QC Workshop > QC User > QC Date > Memo`

## Cài 1 lần (khoảng 15 phút, trên tài khoản công ty mydt@daidung.vn)
1. Vào **script.google.com** → **New project**. Đặt tên: `SPM tu dong`.
2. Xoá đoạn code mẫu, dán **toàn bộ** nội dung `SPM_TU_DONG.gs` → **Ctrl+S**.
3. Bên trái, mục **Services** bấm **(+)** → chọn **Drive API** → **Add**.
4. **Project Settings** (bánh răng):
   - Time zone: **(GMT+07:00) Ho Chi Minh**.
   - **Script Properties** → Add script property: tên `GITHUB_TOKEN`, giá trị = **PAT mới** (fine-grained, chỉ repo
     `bao-cao-qc-an-ha`, quyền **Contents: Read and write**, hạn 90 ngày). PAT dán ở đây, **không gửi qua chat**.
5. Chọn hàm **`kiemTraCauHinh`** → **Run** → cho phép quyền. Execution log phải có:
   - `Doc GitHub qcdata.js: OK ... dong`
   - `Quyen ghi repo (push): CO`
   - `Drive API (Advanced Service): OK`
   Đồng thời Drive tự có 2 thư mục `SPM_UPLOAD` và `SPM_DA_XU_LY`.

## Giai đoạn THỬ (CHE_DO = 'THU' — mặc định, KHÔNG đẩy lên web)
Chạy song song với cách cũ 3–5 ngày:
1. Cập nhật như cũ (máy cá nhân chạy `CAP_NHAT_VA_PUSH.bat`) **trước**.
2. Sau đó kéo **cùng file** `spm.xlsx` vào `SPM_UPLOAD`, chạy tay hàm **`xuLySpmMoi`**.
3. Mail về dòng đầu phải là: `>>> GIONG HET ban dang tren web <<<`.

## Chuyển sang chạy THẬT
Sau 3–5 ngày đều "GIONG HET":
1. Sửa dòng `var CHE_DO = 'THU';` thành `var CHE_DO = 'THAT';` → **Ctrl+S**.
2. Chạy hàm **`batLichSpm`** (bật lịch 30 phút).
3. **Ngừng** chạy `CAP_NHAT_VA_PUSH.bat` trên máy cá nhân. Vào GitHub **xoá PAT của máy cá nhân**.

## Chốt chặn (tự dừng, KHÔNG đẩy, gửi mail lý do)
- File không có dòng RowAreaHeaders / thiếu Workshop, Work Date, QC Workshop, QC Date / cột ngày trống.
- Không ở chế độ ghép theo kỳ (file phủ toàn bộ lịch sử → cần người kiểm tay).
- Số dòng giảm > 10% hoặc tổng Fitup giảm > 3% so với bản trên web.
- QC User trống.
- `qcdata.js` trên GitHub không đọc được (đã bật khoá đăng nhập).
Mọi lỗi: dữ liệu cũ trên web **giữ nguyên**.

## Tắt / tạm dừng
Chạy hàm **`tatLichSpm`**. Muốn quay lại cách cũ: chạy `CAP_NHAT_VA_PUSH.bat` như trước, không cần đổi gì.
