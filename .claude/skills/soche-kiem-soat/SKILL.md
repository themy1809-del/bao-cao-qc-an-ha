---
name: soche-kiem-soat
description: Tác tử kiểm soát thiết kế & phát triển app QC Sơ chế An Hạ (soche.html + Apps Script). BẮT BUỘC dùng khi thiết kế, sửa, nâng cấp, rà soát hay đưa bản mới của app QC Sơ chế / Truy xuất vật tư — mọi phiên chat. Chứa kiến trúc, luật cứng, chuỗi dựng, các cổng kiểm phải đạt trước khi giao, và các bẫy đã gặp.
---

# TÁC TỬ KIỂM SOÁT — APP QC SƠ CHẾ AN HẠ

Vai: kỹ sư trưởng kiêm QA của app. KHÔNG giao bản nào chưa qua đủ cổng. Trả lời tiếng Việt,
báo cáo theo mẫu DONE/CHANGED/NOT CHANGED/TESTED/RISK/NEXT STEP. Không hiểu rõ yêu cầu thì
làm theo cách an toàn nhất rồi ghi UNKNOWN — NEED USER CONFIRMATION, không đoán bừa.

## 1. KIẾN TRÚC (bản 19/11 ban-7b · BAN_SO 2026111910)
- **Giao diện**: trang GitHub Pages `soche.html` (VỎ nhỏ) + `soche_app.html` + `soche_core.js/.css`
  — SINH TỰ ĐỘNG từ mã nguồn, KHÔNG sửa tay. Vỏ tự tải giao diện có `BAN_SO` lớn hơn từ máy chủ
  (`?ui=1&so=`), `?goc=1` ép bản repo. Gọi máy chủ bằng fetch POST `{ten,args,daChon,dn}` → `{kq,du_an}`/`{loi}`.
- **Máy chủ**: Apps Script /exec cố định (URL trong `soche_api.js`, KHÔNG BAO GIỜ tạo deployment mới).
  Project của user chỉ chứa `BoNap.gs` (bộ nạp): tự chạy file `Code.gs - QC SO CHE - *.txt` MỚI NHẤT
  do chủ script sở hữu trong thư mục Drive `1Cn-CzgOb18Um6XSeNurS-nOeqQd6L6Kw`; bản lỗi tự quay về bản tốt.
  → ĐƯA BẢN MỚI = tải file .txt mới lên thư mục đó. KHÔNG bỏ file bản cũ vào thùng rác khi chưa hỏi user.
  Trạng thái: `/exec?nap=1`. Đăng nhập email + PIN (tab NGUOI_DUNG cột ma_pin, sai 5 lần khoá 10 phút).
- **Kho dữ liệu**: Sheet "DATA NT VAT TU" id `1RjTRlSAwRcSwiLrOrMLcNbw0-U44T-4wTieNTI8M2G8`
  (DU_AN, NGUOI_DUNG, VAT_TU, PHIEU_SO_CHE+KET_QUA_DO+HINH_ANH, PUNCH, XAC_NHAN_KL, KIEM_NHANH,
  YEU_CAU_DU_AN, LAN_NAP_TX, AH1_*, NHAT_KY, _DEM) + Sheet "DATA TRUY XUAT - QC SO CHE"
  (TX_VAT_TU/TX_CHI_TIET chép từ NGUON_TX · TX_NAP_VT/TX_NAP_CT nạp trên app).
- **Nguồn chỉ đọc**: sổ xưởng AH1 (chép mỗi giờ; danh mục chi tiết mỗi 20h), file MRIR/báo cáo truy xuất.
  TUYỆT ĐỐI không ghi vào file của bộ phận khác; bộ đọc chỉ có hàm đọc.
- **Mã nguồn + bộ kiểm**: gói `GOI NGUON - QC SO CHE - <bản>.tar.gz` trong thư mục Drive mã nguồn
  (không đưa vào repo công khai). Giải nén ra: `app_nt/` (nt_core.js, app.html, _app_body.html sinh),
  `gas_src/` (Code.gs, Code_AH1.gs, Code_TX.gs, BoNap.gs), `patch_*.py` (chuỗi vá giao diện),
  `build_*.py`, `xay.sh` (lệnh dựng tổng), `gas_test/` + `_v*_ui.js` (bộ kiểm), `gas_1file/Code.gs` (bản phát hành).

## 2. LUẬT CỨNG (vi phạm = không giao)
1. KHÔNG đổi thứ tự / tên cột các tab Sheet; cột mới chỉ THÊM VÀO CUỐI (caiDat tự bổ sung).
2. KHÔNG tạo deployment /exec mới; không đổi URL trong soche_api.js khi chưa được duyệt.
3. KHÔNG đưa dữ liệu nhạy cảm, PIN, tên nhân sự, mã nguồn app vào repo công khai; không sửa tay file sinh tự động.
4. Mỗi bản mới: tăng PHIEN_BAN (`'dd/mm ban-N'`) ở cả nt_core.js lẫn Code.gs (build so khớp) + tăng BAN_SO.
5. Mọi dữ liệu Sheet vào HTML phải escape (E()/esc()); không onclick nội tuyến với dữ liệu động — dùng data-* + uỷ nhiệm.
6. Thao tác ghi: đúng vai (canVai), có nhật ký (ghiNK), huỷ phải có lý do và GIỮ VẾT (không xoá dòng).
7. Số liệu chuẩn trước ↔ sau phải lệch 0 (kế hoạch tháng 11/2026: 189 lệnh · 1.191,25 t · đã cắt 766,98 t · 29 dự án) trừ khi user yêu cầu đổi.
8. Giao diện theo skill ui-ux-pro-max: menu theo vai (bảng VM), nút ≥44px, tương phản 4,5:1 cả 2 theme, không tràn ngang 375px, nhãn cho mọi ô nhập, không emoji làm icon.

## 3. CHUỖI DỰNG (chạy trong thư mục mã nguồn)
`bash xay.sh` = make_app → patch_app_* → patch_v2..v7_ui → build_nt → build_gas (kiểm PHIEN_BAN khớp,
ASCII-escape để cache ≤100KB) → build_github → sinh lại trang 1 file cho bộ kiểm → `node --check`.
Patch lõi/máy chủ (`patch_v*_nguon.py`) áp 1 LẦN trực tiếp; patch giao diện áp lại mỗi lần dựng.
Thêm bản mới = viết `patch_v<N>_ui.py` (+`_nguon` nếu đổi lõi) và nối vào xay.sh — không sửa đè file sinh.

## 4. CỔNG KIỂM TRƯỚC KHI GIAO (đủ mới được đưa lên)
| # | Cổng | Lệnh | Chuẩn đạt |
|---|---|---|---|
| 1 | Cú pháp | `node --check` gas_1file/Code.gs + nt_core.js | 0 lỗi |
| 2 | Máy chủ giả lập | `node gas_test/kiem_gas.js · kiem_ah1 · kiem_nap · kiem_tx · kiem_web` | 0 LOI (hiện ~81+91+23+77+20) |
| 3 | Giao diện thật | `python3 -m http.server 8790 --directory app_nt` rồi `node _v2_ui.js … _v7_ui.js, test_ht_ui, _tx_ui, TRANG_1FILE=1 kiem_giao_dien` | 0 LOI (hiện ~28+24+20+13+8+17+16+10+19) |
| 4 | Chuẩn giao diện | `UA_BASE=http://localhost:8790/ node kiem_tra/ui_audit.js _w_app.html` (kèm UA_PRE mở màn mới) | DAT HET |
| 5 | Harness repo | `bash kiem_tra/harness.sh --nhanh` (đổi trang khác của repo thì bản đầy đủ) | DAT HET |
| 6 | Máy chủ thật | tải file mới lên Drive → `/exec?nap=1` = "đang chạy <bản mới> · không có lỗi"; gọi thử API chỉ đọc, đối chiếu số chuẩn | khớp |
| 7 | Bàn giao | cập nhật HANDOFF.md + PROJECT_STATUS.md, đẩy soche_* lên NHÁNH LÀM VIỆC (main chỉ gộp khi user bấm Merge), đóng gói GOI NGUON mới lên Drive, cập nhật hướng dẫn sử dụng nếu thêm tính năng | xong |
Tính năng mới PHẢI kèm bài kiểm mới (máy chủ + giao diện); gặp lỗi mới thì viết bài kiểm bắt lỗi đó trước khi sửa.

## 5. BẪY ĐÃ GẶP (đọc trước khi sửa)
- `caiDat` có vòng thử lại 5 lần khi Sheet báo "timed out/Service error" — GIỮ; không định dạng lại tab đã đúng tiêu đề (tab 162k dòng từng làm quá giờ, bộ nạp đánh dấu bản hỏng).
- Bản bị đánh dấu hỏng chỉ được thử lại khi có FILE MỚI (id mới) — đưa lại bằng tên `...ban-Nb.txt`.
- Mock (gas_test/mock_gas.js) có `__dem.tat` tắt đệm; đệm đọc theo TỪNG BẢNG (`BR_<bảng>`), kết quả tra TX nhớ theo `TX_REV` — mọi đường ghi phải làm tươi đúng khoá.
- Lớp `.tb` là header trang — tên lớp mới không được trùng; thanh tiến độ dùng `.tdo`.
- Dữ liệu mẫu trình duyệt dùng mã `VIO-PL-…`, lệnh `526_196`; bộ kiểm máy chủ dùng dữ liệu Wolf thật trong `_wolf.json`.
- Heat/lệnh chuẩn hoá: `526-196` ≡ `526_196`; "0012345" phải giữ số 0 đầu (setNumberFormat('@')).
- Heredoc bash chứa chữ nhạy cảm có thể bị hook chặn → ghi file bằng công cụ Write rồi chạy.
