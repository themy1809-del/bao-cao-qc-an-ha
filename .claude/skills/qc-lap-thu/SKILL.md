---
name: qc-lap-thu
description: Quy trinh BAT BUOC khi sua / dong goi app QC LAP THU (web Flask + app chup chay tren may chu DIM cua user). Dung moi khi user gui zip CAP_NHAT_MAY_CHU_*, nho sua tab ①②③④, kho anh, doc ban ve / so phan AI, Excel/Word bao cao, hoac hoi "cap nhat may chu sao".
---

# QC LAP THU — quy trinh harness (user The My chot 13/11/2026)

## 0. Ma nguon O DAU (doc truoc tien)
- Ma app **KHONG** nam trong repo nay va **KHONG BAO GIO** duoc dua len repo cong khai / Drive (user: "qua rui ro").
- Ban duy nhat nam tren may chu DIM (`C:\QC_LAP_THU\TU_DONG_HOA`). Thu muc nhap cua phien cloud BI XOA khi may tam bi thu hoi.
- Bat dau phien moi: xin user gui lai **zip CAP_NHAT_MAY_CHU_<ban moi nhat>.zip** (ban tu giao, khong co key). Chi lam tren ban do.
- KHONG xin / mo / in: `config.txt`, `cau_hinh_ai.txt`, `tai_anh_drive.py`, `web_nguoi_dung.json`, `web_phien.json`, `web_khoa*`, `qcah.json`.

## 1. Moi lan sua
1. Giai nen vao thu muc rieng trong scratchpad; ghi chu `# <ban>: ...` (khong dau) tai cho sua.
2. Tang `PHIEN_BAN` trong `qclt/__init__.py` dang `"4.x (dd/mm/yyyy)"`.
3. Kiem: `python3 -m py_compile` moi .py; JS: `new Function(<script>)` bang node; giao dien: Playwright (Chromium `/opt/pw-browsers/chromium`)
   voi API GIA LAP (route `**/api/**`) khi khong chay duoc may chu that — ghi ro trong bao cao la "API gia lap".
4. Doan ma may chu doc lap (vd dieu kien chan 409): chay NGUYEN VAN doan do voi du lieu gia (bang su that) truoc khi giao.

## 2. Giao goi
- Giao **zip DAY DU** (moi file app da co trong goi truoc + file moi), khong chi file doi — de user luon co ban tron ven.
- Hook `.claude/hooks/quet_goi.py` tu CHAN gui zip co file cam / chuoi giong key. Neu bi chan: sua goi, KHONG tat hook.
- Trong goi co `KIEM_TRA\kiem_tra_app.py` + `CHAY_KIEM_TRA.bat`: user chay tren may chu sau khi cap nhat
  (ban sao cach ly trong %TEMP%, khong dung du lieu that, khong goi AI) -> gui lai file `KIEM_TRA\KET_QUA_*.txt`.
  Them chuc nang moi -> them muc kiem tuong ung vao `kiem_tra_app.py` (cung goi).
- Huong dan cap nhat: giai nen -> Ctrl+A chep de `TU_DONG_HOA` -> dong cua so "QC LAP THU WEB" -> chay `CHAY_WEB_LAP_THU.bat`
  -> Ctrl+F5 -> thay "· ban <x>" canh ten. Chi doi `web\*.html` thi chep de file do, khong can khoi dong lai.

## 3. AI (doc ban ve / so phan)
- Moi luot goi AI ghi `ai_nhat_ky.csv` (module `ai_nhat_ky.py`, boc `_call_ai` sketch va `analyze` phan). `BAO_CAO_AI.py` tom tat.
- Do do chinh xac DWG: `DO_CHINH_XAC_BAN_VE.py` (so preset AI <-> DWG QC chot). Khong ket luan "AI doc tot/kem" khi chua co so do that.
- DWG do AI doc phai qua "Duyet DWG" (tab ③) truoc khi vao bao cao; PDF xuat thang tu CAD (lop chu) = chinh xac 100%.

## 4. Quyet dinh user da chot (dung lam lai)
- Anh Word giu GIAN VUA KHUNG, khong cat (ke ca Level 4:3 vao khung ~2:1).
- Khong de anh / so cua PAIR / key len bat ky dich vu nao ngoai may chu.
- Bao cao cuoi: DONE / CHANGED / NOT CHANGED / TESTED / RISK / NEXT STEP + "Anh can lam"; chua kiem duoc thi ghi UNKNOWN.
