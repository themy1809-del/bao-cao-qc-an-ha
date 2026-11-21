# HỌC HỎI TỪ MÃ NGUỒN MỞ — kho ý tưởng cho app QC Sơ chế
(Khảo sát 21/11/2026 bằng tác tử đọc web; CHỈ HỌC CÁCH LÀM, KHÔNG chép code —
AGPL (OpenMES, Grist) tuyệt đối không chép; MIT cũng tự viết lại theo kiến trúc app mình.)

## 1. Đã khảo sát đợt 1 (app cùng loại)
| Nguồn | Sao | Học được |
|---|---|---|
| quality-ms (Laravel, QMS thép EN 10204) | nhỏ | TỰ ĐỐI CHIẾU chứng chỉ MTC với giới hạn spec trước khi Đạt; CHẶN ghi số đo khi thiết bị đo hết hạn hiệu chuẩn; NCR TỰ SINH từ lượt kiểm không đạt; AI đọc PDF chứng chỉ nhưng NGƯỜI xác nhận mới lưu |
| cmsc447-punchlist (React+Go) | nhỏ | Ghim lỗi lên BẢN VẼ PDF: lưu toạ độ theo hệ PDF nên zoom/xoay không lệch; 2 kiểu xuất (bản làm việc sửa được / bản phát hành khoá); ảnh thu nhỏ trên máy trước khi upload |
| snagflow (Next.js+Supabase) | nhỏ | Vòng đời snag 4 bước; BẮT BUỘC ảnh sửa trước khi duyệt (mình đã có); quyền kiểm ở máy chủ không chỉ ẩn nút (mình đã có); upload retry không tạo bản ghi trùng |
| OpenMES (Laravel, AGPL) | 203★ | Bắt buộc đúng THỨ TỰ bước công đoạn; lỗi nghiêm trọng tự CHẶN công đoạn; audit log bất biến; PWA xếp hàng thao tác khi mất mạng, đồng bộ snapshot + delta |
| steel-fabrication-qms-system (tài liệu) | nhỏ | Chuỗi cổng kiểm: vật liệu→mill cert→truy xuất→mối hàn (mã thợ + hạn chứng chỉ)→kích thước→bề mặt→độ dày mạ→xuất xưởng; thiết bị đo có sổ hiệu chuẩn theo serial |
| industryERP (FastAPI) | nhỏ | Import Excel có bước XEM TRƯỚC khớp cột rồi mới lưu (mình đã có ở napTX); trừ kho 1 lần theo sự kiện |
| dearauditor-qms-baseline | 19★ | QMS = bộ SOP có mã + rev (R00→R23) + bảng index máy đọc được; bản phát hành gắn tag ngày; audit dựa lịch sử bất biến |
| crossfire-ncr-system | nhỏ | NCR 3 vai: QA tạo → Engineering disposition → Operations quyết + corrective action → đóng |

## 2. Khung QMS rút gọn (áp cho app mình)
- Chuỗi: NCR → nguyên nhân gốc (bộ mã DES/MAT/MC… trong SỔ TAY QC) → CAPA → kiểm tra xác nhận → đóng (đóng BẮT BUỘC có bằng chứng xác nhận).
- 3 trụ: sổ kiểm soát tài liệu (mã + rev, bản cũ Superseded không sửa đè) · audit trail CHỈ THÊM (NHAT_KY đã là vậy) · trạng thái là danh sách đóng, MÁY CHỦ kiểm chuyển trạng thái hợp lệ.
- App đã có ~70%: PUNCH = NCR thu nhỏ, NHAT_KY = audit, MA_LOI = bộ mã chuẩn (bản 21). Thiếu: cột nguyên nhân gốc + CAPA + người xác nhận trên punch; sổ tài liệu có rev.
- Trên Google Sheets: 1 tab / thực thể; ID ổn định (không tham chiếu số dòng); LockService khi sinh ID; cột mới chỉ THÊM CUỐI.

## 3. Lộ trình áp dụng đã đề xuất với user (21/11, chờ duyệt)
1. Quét QR mở hồ sơ (html5-qrcode, chạy ngay trên trình duyệt) — lợi nhất cho hiện trường.
2. Punch → NCR mini: + nguyên nhân gốc + hành động khắc phục + người xác nhận (cột thêm cuối).
3. NCR tự sinh từ lượt kiểm không đạt.
4. Ghi-offline có hàng đợi (service worker + IndexedDB, gửi lại khi có mạng).
5. Ghim lỗi lên bản vẽ PDF (pdf.js) — lớn, làm sau cùng.

## 4. Đợt 2 (21/11): hệ dữ liệu nhiều nguồn + quản trị công cụ/thiết bị
| Nguồn | Sao | Học được |
|---|---|---|
| Snipe-IT (Laravel, AGPL — không chép code) | 15k★ | Quản lý tài sản chuẩn: CHECK-OUT / CHECK-IN từng công cụ cho từng người, "kits" cho mượn cả bộ, chữ ký khi nhận, thông báo khi giao-trả; import CSV; 25 bộ đồng bộ nguồn ngoài; có cả mẫu cộng đồng dùng Google Sheets làm sổ mượn-trả hàng loạt |
| NocoDB | 65k★ | NHIỀU VIEW trên 1 bảng (Grid / Kanban / Form / Calendar); form nhập liệu tự sinh; API tự sinh từ cấu trúc bảng |
| Grist (Apache-2.0) | 12k★ | **Incremental import**: nạp lại file mới KHÔNG trùng theo khoá (mình đã làm giống ở napTX thay-bản-cũ); webhook CÓ ĐIỀU KIỆN theo cột; lịch sử hành động có giới hạn dung lượng; API token phạm vi hẹp |
| Baserow | 6k★ | 1 dataset nhiều view; API-first; tách tính năng lõi/khỏi mở rộng |
| ILLA builder | 12k★ | Tách lớp "nguồn dữ liệu" khỏi giao diện; automation chạy theo lịch hoặc webhook |
| HAMS (MERN, quản thiết bị y tế) / LabTrack | nhỏ | Đúng nghiệp vụ QUẢN CÔNG CỤ ĐO: tài sản + QR định danh + lịch HIỆU CHUẨN định kỳ + hạn bảo hành + ticket hỏng (Open → Review → Repair → Resolved, 3 trạng thái vận hành/hiệu chuẩn/ticket tách riêng); xoá mềm; lịch sử hiệu chuẩn chỉ-thêm; email khi đổi trạng thái |

### Mẫu "app quản trị công cụ đo" trên nền Sheets + Apps Script (khi user cần làm)
- Tab `CONG_CU` (ma_cc, ten, serial, loai, nguoi_giu, trang_thai, han_hieu_chuan, ghi_chu) + tab `CC_GIAO_DICH` CHỈ-THÊM (luc, ma_cc, nguoi, hanh_dong MUON/TRA/HIEU_CHUAN/HONG, ghi_chu) — trạng thái hiện tại suy từ giao dịch cuối.
- QR dán trên công cụ = link app `?cc=<ma>`; quét là ra hồ sơ + nút Mượn/Trả 1 chạm.
- Nhắc hạn hiệu chuẩn: trigger hằng ngày quét cột `han_hieu_chuan`, đến hạn thì hiện ở Bảng điều hành (+ email nếu cần).
- CHẶN dùng kết quả đo của thiết bị quá hạn hiệu chuẩn (học quality-ms): khi lập phiếu chọn thiết bị → máy chủ kiểm hạn.

### Mẫu "kho dữ liệu nhiều nguồn" (đã áp dụng một phần, giữ làm chuẩn)
- Mỗi nguồn khai ở 1 tab danh mục (như NGUON_TX) → bộ chép tự động so phiên bản, CHỈ ĐỌC nguồn.
- Nạp tay: xem trước khớp cột → lưu mapping theo nguồn → upsert theo KHOÁ TỰ NHIÊN (không nhân đôi khi nạp lại) → sổ lần nạp xoá được từng lần (nhãn [TXN-xxx]).
- Trên 1 kho dựng nhiều "view" cho từng vai thay vì nhiều kho.

