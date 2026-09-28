# DATA_MODEL.md
# Mô hình dữ liệu THỰC TẾ — dựng lại từ mã nguồn + file dữ liệu (28/09/2026)

> Mọi cấu trúc dưới đây được đọc trực tiếp từ file trong repo và từ mã Apps Script.
> Số dòng / số cột đều **đếm lại bằng script**, không lấy theo tài liệu cũ.
> Chỗ chưa xác minh được ghi **UNKNOWN — NEED USER CONFIRMATION**.

---

## 1. TOÀN CẢNH: 5 kho dữ liệu, 4 hệ "định danh cấu kiện" khác nhau

| Kho | Vật lý | Đơn vị 1 dòng | Khoá định danh |
|---|---|---|---|
| **SPM → `qcdata.js`** | file JS tĩnh trong repo | 1 dòng Pivot đã gộp | **KHÔNG có mã cấu kiện** |
| **Bảng gốc dự án** (Excel → Google Sheet) | 1 file / dự án | 1 cấu kiện | cột *Member punch no* (tên cột thay đổi theo layout) |
| **`DATA QC`** (hệ 1 dựng) | tab trong file dự án | 1 cấu kiện | **cột 4 `Member punch no`** |
| **PACKING LIST** | 3 file ngoài | 1 cấu kiện / gói | **`Part No`** (UPPERCASE, trim) |
| **`ddc_data.js` / DDC live** | JS tĩnh + gviz | 1 dự án (đã gộp) | `pn` (đọc lại từ bảng gốc theo layout) |

---

## 2. `qcdata.js` — `window.QCDATA` (nguồn của dashboard hệ 3)

### 2.1 Cấu trúc thực tế (bản `updated: "27/09/2026"`, `source: "spm.xlsx"`)

```js
window.QCDATA = {
  updated : "27/09/2026",
  source  : "spm.xlsx",
  P  : [...115 tên dự án...],           // Project
  X  : ["AH2","AH3","AH4","AH6","AH9"], // Xưởng (5)
  T  : [...45 tên tổ...],               // Tổ
  Q  : [...55 mã QC viên...],           // QC user ("—" = chưa có người kiểm)
  PL : ["Đã QC (AH)","Chưa QC","QC khác","Miễn QC"],   // Phân loại QC (4)
  rows : [ ...18.733 mảng, mỗi mảng 14 phần tử... ],
  proj : [ ...115 object tổng hợp theo dự án... ],
  check: { f: 39720.8, w: 35355.6, p: 26426.0 }        // tổng đối soát (tấn)
}
```

### 2.2 Lược đồ 1 dòng `rows[i]` (14 phần tử — đã đếm lại, **không** có phần tử thứ 15)

| idx | Tên | Kiểu | Ghi chú |
|---|---|---|---|
| 0 | `P` index | int | tên dự án đầy đủ = `D.P[r[0]]` |
| 1 | `X` index | int | xưởng = `D.X[r[1]]` |
| 2 | `T` index | int | tổ = `D.T[r[2]]`; khoá tổ = `X + "." + T` (`toKey`) |
| 3 | **QCDate** | `"YYYY-MM-DD"` hoặc `""` | ngày QC nghiệm thu. **Rỗng = chưa nghiệm thu** |
| 4 | **WorkDate** | `"YYYY-MM-DD"` | ngày gia công |
| 5 | `Q` index | int | QC viên |
| 6 | `PL` index | int | phân loại QC |
| 7 | Fitup | float | **tấn** |
| 8 | Welding | float | **tấn** |
| 9 | Painting | float | **tấn** |
| 10 | Qnty Fitup | int | số lượng (cây) |
| 11 | Qnty Welding | int | |
| 12 | Qnty Painting | int | |
| 13 | memo | string | ghi chú SPM — **nơi duy nhất chứa mã lỗi NCR và chữ "reject"** |

`proj[i]` = `{name, bom, f, w, p, tf, tw, tp, pct, status}` (tấn; `t*` = tồn; `pct` = % Painting/BOM).

### 2.3 Thống kê đã đếm lại từ file đang chạy
- `rows`: **18.733** dòng, **mọi dòng đều dài đúng 14**.
- QCDate: có ở **16.980** dòng, khoảng **2025-07-09 → 2026-09-27**.
- WorkDate: có ở **18.733** dòng, khoảng **2024-11-19 → 2026-09-27**.
- Phân loại: `Đã QC (AH)` **16.820** · `Chưa QC` **1.284** · `Miễn QC` **469** · `QC khác` **160**.
  → **Không có giá trị `Rớt` nào trong bản dữ liệu hiện tại.**
- memo khác rỗng: **4.290** dòng.

### 2.4 ⚠️ LỆCH GIỮA `spm_flatten.py` TRONG REPO VÀ `qcdata.js` ĐANG CHẠY

| Điểm | `spm_flatten.py` (repo, 13/09) | `qcdata.js` (đang chạy, 27/09) |
|---|---|---|
| Độ dài 1 dòng | **15** (`[14]` = Zone) | **14** |
| Mảng `Z` (Zone/Hạng mục) | **có** (`'Z':_Z`) | **không có** |
| Giá trị `PL` | `Đã QC (AH)` / `Chưa QC` / `QC khác` / **`Rớt`** | `Đã QC (AH)` / `Chưa QC` / `QC khác` / **`Miễn QC`** |

**Kết luận: `spm_flatten.py` trong repo KHÔNG phải bộ sinh ra `qcdata.js` đang chạy.**
Bản thật đang nằm trên PC của user. → **UNKNOWN — NEED USER CONFIRMATION: xin bản `spm_flatten.py` thật.**

Hệ quả đã kiểm chứng trong `qc.html`:
- Dòng 4110: `var KH_HASZONE = (… Array.isArray(D.Z) && D.Z.length>0);`
  → vì `D.Z` không tồn tại, **tính năng drill-down KHSX theo Hạng mục đang TẮT ÂM THẦM**
  (không báo lỗi, không ai biết).
- Dòng 4120 `D.Z[r[14]]` chỉ chạy khi `KH_HASZONE` đúng → không crash.
- `qc.html` có 4 chỗ lọc bỏ `'Miễn QC'` (dòng 1339, 1382, 1470, 1563) khi tính sản lượng SX
  → nếu chạy `capnhat.yml`, 469 dòng `Miễn QC` sẽ biến thành `Rớt`/khác và **sai số liệu SX**.

---

## 3. `DATA QC` — 18 cột chuẩn (hệ 1 Apps Script)

### 3.1 Danh sách cột (`DQC_GOC` 13 cột + `DQC_THEM` 5 cột)

| # | Tên cột | Nguồn |
|---|---|---|
| 1 | Guid | `BD_EP.guid` |
| 2 | Item | `BD_EP.item` (điền xuống cho ô merge) |
| 3 | Part no | `part`, nếu rỗng thì lấy `punch` |
| 4 | **Member punch no** | `punch`, nếu rỗng thì lấy `part` — **KHOÁ ĐỊNH DANH** |
| 5 | RFI fab | `rfi` |
| 6 | RFI Fab date | `rfiD` (đổi sang kiểu ngày) |
| 7 | VIR report no | `vir` |
| 8 | VIR report date | `virD` |
| 9 | DIR Report no | `dir` |
| 10 | RFI Gal | `gal` |
| 11 | RFI Gal date | `galD` |
| 12 | Gal Report no | `galR` |
| 13 | Cảnh báo | tính ra: danh sách tên cột thiếu, nối bằng `"; "` |
| 14 | Dự án | tên dự án (từ registry) |
| 15 | Milestone | `ms` (điền xuống) |
| 16 | Xưởng | `xuong` (điền xuống) |
| 17 | RFI FUR | `rfiFur` |
| 18 | FUR Report no | `furRep` |

Định dạng: đóng băng 1 hàng + 4 cột; cột 6/8/11 format `dd/mm/yyyy`;
cột 13 tô đỏ `#FCE8E6` bằng conditional formatting khi có nội dung.

### 3.2 `BD_EP` — bảng khai báo cột (10 mục, nguồn duy nhất, tab `BAN DO COT` chỉ HIỂN THỊ)

`BD_KEY` = `guid, item, part, punch, rfi, rfiD, vir, virD, dir, gal, galD, galR, ms, xuong, rfiFur, furRep`

| Khoá dự án | tieuDe | punch | rfi / rfiD | vir / virD | dir | ms | xuong | furRep | khác |
|---|---|---|---|---|---|---|---|---|---|
| `BISON_U2` | 4 | H | Y / Z | AG / — | AF | D | S | AD | guid=H (**cố ý** = punch) |
| `CHECKLIST_BISON` | 4 | H | Y / Z | AE / — | AD | D | S | — | guid=B |
| `VIOLA_KCT` | 5 | M | AU / AT | AZ / — | AY | E | AA | AP | rfiFur=AM |
| `VIOLA_TED` | 4 | J | AP / AO | AV / AU | — | D | X | AT | DIR+VIR chung 1 cột → chỉ điền VIR |
| `SVĐVINFATS` | 4 | G | — | — | — | — | P | — | chỉ có guid/item/part/punch/xuong |
| `10725-011` | 4 | J | AP / AO | AV / AU | — | D | X | AT | = VIOLA_TED theo mã chính thức |
| `10725-009` | 5 | M | AU / AT | AZ / — | AY | E | AA | AP | = VIOLA_KCT theo mã chính thức |
| `10726-043` | 5 | E | AD / AE | AI / AJ | AL | L | U | AF | galR=BP; 20.286 CK |
| `10726-054` | 3 | N | AH / AI | AR / AS | AL | — | X | AP | không có Milestone/Gal |
| `EVAPCO - GREGORY - DUCTING` | 4 | P | AK / AL | AQ / AR | — | C | Y | AO | gal=BK, galD=BM, galR=BU; **punch=P (mã làm hồ sơ), item=B, part=O (mã SPM)** |
| `10725-008` | 2 | H | AB / AC | AF / AG | AI | C | U | — | guid=B |

> Dự án **không** có trong `BD_EP` → `taoDataQC` trả `"CHUA KHAI BAO COT"` và **giữ nguyên `DATA QC` cũ**
> (bịt lỗ hổng tự đoán cột, 26/09). Không được khôi phục cơ chế tự đoán.

### 3.3 4 chốt an toàn trước khi ghi `DATA QC` (đọc từ `taoDataQC`)
1. `nguonThieuDong` — bảng gốc ít dòng hơn Excel (theo tab `DOI CHIEU`) → **DỪNG**, giữ nguyên `DATA QC`.
2. `timEp(duAn)` rỗng → **DỪNG**, báo `CHUA KHAI BAO COT`.
3. `soatCotMaCauKien(rows)` — cột mã cấu kiện không giống mã cấu kiện → **DỪNG**.
4. Số cấu kiện tụt < 80 % lần trước (so `_CHUP`) → **DỪNG**, trừ khi vừa Run `choPhepGiam()` trong 30 phút.
Ngoài ra: cột số báo cáo mà **toàn ngày tháng** (`cotToanNgay`) thì **bỏ trống**, không điền bừa.

### 3.4 `_CHUP` — ảnh chụp trạng thái (tab ẩn trong từng file dự án)
- Cột A = **Mã cấu kiện** (`rows[i][3]` = *Member punch no*) — **đây chính là khoá định danh của hệ 1**.
- Cột B = `"T" + maTrangThai` — 4 bit: `[RFI fab][VIR][DIR][RFI Gal]`, mỗi bit `1` nếu ô có giá trị.
  Tiền tố `T` để Sheets không đổi `"0110"` thành số `110`; khi đọc lại có `padStart(4,'0')`.
- Ô `C1` = thời điểm chụp `dd/MM/yyyy HH:mm` (Asia/Ho_Chi_Minh).
- `soSanhAnhChup` so 2 ảnh → đếm `moi / mat / rfi / vir / dir / gal / matRfi` → ghi `NHAT KY` + `THAY DOI`.

### 3.5 `DOI CHIEU` — biên bản đối chiếu Excel ↔ Google
Ghi khi `b.clear` (trạng thái `DANG DONG BO`) và khi `b.done` (`KHOP` / `LECH`).
`DATA QC` bị **chặn dựng** khi tab này còn `DANG DONG BO` hoặc số dòng lệch.
Hệ 3 (`_dcLoadProject`) **đọc ô A của tab `DOI CHIEU`** để biết tên tab bảng gốc,
mặc định `CHECK_LIST` nếu không đọc được.

---

## 4. `BD_REV` + `BD_PACK` (hệ 2)

`BD_REV` — cột Rev trên **bảng gốc** (không phải DATA QC):

| Dự án | tieuDe | punch | rev | revNT | section |
|---|---|---|---|---|---|
| `10725-011` (DUCTING TED) | 4 | J | I | AQ | S |
| `EVAPCO - GREGORY - DUCTING` | 4 | P | I | AM | E |
| `10726-043` (WOLF SUMMIT) | 5 | E | G | AC | R |
| `10726-054` (CONDENSATE TANK) | 3 | N | H | AJ | R |

Dự án không khai `BD_REV` → cột "Rev đã nâng" ghi `(chua khai BD_REV)`, phần nợ báo cáo vẫn chạy bình thường.

`BD_PACK` — file packing theo TỪNG cấu kiện, tab `Status`:

| Khoá dự án | File packing |
|---|---|
| `CHECKLIST_BISON`, `BISON_U2` | `1Tq3pCRh…` |
| `10725-009`, `VIOLA_KCT` | `1610zRYT…` |
| `10725-008` | `1RCTPxc3…` |

Cách đọc (`layPacking_`): dò **theo TÊN cột không dấu**, không theo vị trí —
`PART NO` (bắt buộc), `SL DA DI HANG…` hoặc đúng `DA DI HANG` (Gregory), `PACKAGE NO`.
Ghép dự án: khớp **tuyệt đối** trước, rồi khớp **tiền tố** (`indexOf(...) === 0`).
Mỗi file packing chỉ đọc 1 lần / lượt quét (`packCache`).

---

## 5. `DDC_CORE` — bộ đọc bảng gốc phía WEB (trong `doc.html` và `qc.html`)

Đây là **bộ đọc thứ hai, độc lập với `BD_EP`**, viết bằng JS, dò cột theo **tên tiêu đề**
trong 8 dòng đầu (`findHdr` / `findExact`, chuẩn hoá bằng `norm`).

### 5.1 Nhận dạng layout (`detectLayout`, theo thứ tự)
| Layout | Dấu hiệu | Cột mã cấu kiện (`pn`) |
|---|---|---|
| **A** | có `rev spm` **và** `fir report no` | `member punch no` |
| **B** | có `rfi no-fur` | `member punch no` |
| **C** | có `report no. fir-vir` | `member no tên hồ sơ` (fallback `member no` + 4) |
| **D** | có `bbnt ck trước khi sử dụng` | `tên cấu kiện` |
| (dự phòng) | có `member punch no` | B nếu có `date-dir+vir`, ngược lại A |
| không khớp | — | `err: 'Layout chưa hỗ trợ'` |

### 5.2 Trường chuẩn hoá của 1 cấu kiện (`normRow`)
`pn, dwg, grp1, grp2, ms, ph, ws, wsCut, w (kg), qty, weld, rev, planD,`
`fitRfi, fitD, fitRep, fitRev, fitQA, fitInv,`
`finRfiAll[], finRfi, finD, finInv, finRev, finQc, dir, vir, finDone,`
`kiDDC, kiKH, bgHs, ndt, moiLai, revWarnFit, revWarnFin, revWarn, fitAppl`

Quy ước đọc giá trị:
- `lastTok` / `allTok`: ô có nhiều giá trị ngăn bởi `, ; \n` → lấy **giá trị cuối** (và giữ cả danh sách cho RFI final).
- `lastDate`: lấy **ngày muộn nhất** trong ô; chiều dd/mm hay mm/dd được **tự dò** bằng cách
  đếm bằng chứng trên tối đa 3.000 dòng (`M._dmy`).
- `numOr`: chuỗi có dấu `,` → hiểu theo kiểu Việt Nam (`.` ngăn nghìn, `,` thập phân).

### 5.3 `ddc_data.js` — `window.DDC_SEED` (bản lưu dự phòng, **built 20/09/2026 11:15**)
4 dự án: `BISON_U2` (layout A, 45.832 CK, 2.910,46 t) · `VIOLA_KCT` (B, 40.524 CK, 2.484,09 t, code 10725-009)
· `VIOLA_TED` (C, 878 CK, 636,34 t, code 10725-011) · `SVĐVINFATS` (D, 1.995 CK, 6.485,43 t, code 10626-051).
Mỗi dự án có `byWs`, `byWsCut`, `byGrp`, `byDwg`, `byM`, `byMPlan`, `rfi`, `warnList`, `caps`, `revBy`.
Seed này chỉ dùng khi đọc live thất bại (`meta.stale = true`).

### 5.4 Registry — hệ 1, hệ 2 và hệ 3 đọc **CÙNG MỘT TAB** (đã đính chính 28/09)

> **ĐÍNH CHÍNH.** Bản tài liệu đầu (28/09, vòng 1) kết luận *"hệ 1/2 và hệ 3 đọc hai tab khác nhau"*.
> **Kết luận đó SAI.** Sau khi đọc file thật qua Drive: thứ tự tab trong `DANH MUC DỰ AN` là
> `DANH MUC` → `KIEM CHUNG` → `NHAT KY` → `THAY DOI` → `BAN DO COT` → `TIEU DE GOC`
> → `BAO CAO DATA QC` → `Sheet1`. Tức **`getSheets()[0]` CHÍNH LÀ tab `DANH MUC`**.

| | Hệ 1 & 2 (Apps Script) | Hệ 3 (web) |
|---|---|---|
| Vị trí | `getSheets()[0]` = tab **`DANH MUC`** | `sheet=DANH MUC` (dự phòng `gid=1397171776`) |
| Cột dùng | A = `Ma du an`, B = `Spreadsheet ID` | dò tiêu đề: `ma du an`, `spreadsheet id`, `cap nhat cuoi`, `spm` |

→ **Không có nguy cơ lệch tab.** Cả ba hệ dùng chung một nguồn danh mục.
*(Lưu ý còn lại: cột `SPM` mà hệ 3 tìm **chưa tồn tại** trong registry — tiêu đề hiện có là
`Ma du an | Spreadsheet ID | Link | Ngay tao | Cap nhat cuoi | So o dang dung`.
Nên `_dcSpmName` luôn phải đoán tên dự án bằng so tiền tố / so token, hoặc dựa vào
`localStorage['ddc_alias']` của từng máy.)*

### 5.5 Nội dung registry thật (đọc 28/09/2026) — **11 dự án**

| # | Ma du an | Spreadsheet ID | Cập nhật cuối |
|---|---|---|---|
| 1 | `BISON_U2` | `1L_PNa0ez…` | 28/09 19:42 |
| 2 | `VIOLA_KCT` | `1cXQjEkY…` | 28/09 19:20 |
| 3 | `VIOLA_TED` | `1xsZ0suRE…` | 21/09 10:05 |
| 4 | `SVĐVINFATS` | `1OSoqIJel…` | 21/09 10:06 |
| 5 | `10725-008 DGRP EVAPCO-GREGORY-STRUCTURAL` | `1FGb7z2cv…` | 28/09 19:05 |
| 6 | `CHECKLIST_BISON (STEEL)_UNIT 1_CỤM AH_21.09.2026` | `1ZsKEknif…` | 28/09 19:28 |
| 7 | `10725-011 DGRP VIOLA - DUCTING SDM & TED` | `15zHzlQP…` | 28/09 19:42 |
| 8 | `10726-054 DG VIOLA CONDENSATE TANK` | `1EsChDAJ…` | 28/09 19:43 |
| 9 | `EVAPCO - GREGORY - DUCTING` | `1ee9XfyCO…` | 28/09 19:43 |
| 10 | `10726-043 WOLF SUMMIT_STEEL (200POR17540)` | `1WSM5ZIb…` | 28/09 19:56 |
| 11 | **`WOLF QC DINH FITUP`** (mới 27/09, chưa có trong tài liệu cũ) | `1tsxEgJqV…` | 28/09 20:02 |

**Chốt được 1 câu UNKNOWN:** tên đầy đủ của `10725-011` là
`10725-011 DGRP VIOLA - DUCTING SDM & TED` — **có chứa "VIOLA"** → **khớp `CB_LOC`**
→ dự án này **CÓ** vào dashboard cảnh báo và **CÓ** dính bug báo thừa "Chưa có DIR" (§7bis.3a).

**`VIOLA_TED` (#3) và `10725-011` (#7) là CÙNG một dự án, hai file khác nhau**, cùng 878 cấu kiện,
và **cả hai vẫn đang được đồng bộ** (NHAT KY 28/09 có cả hai) → đúng như mục TODO "xoá VIOLA_TED cũ".

### 5.6 Trạng thái dựng `DATA QC` thật (tab `BAO CAO DATA QC`, 28/09)

| Dự án | Tab dữ liệu | Kết quả |
|---|---|---|
| 10725-011 TED | `PKL` | OK 878/878 |
| 10726-054 | `PKL` | OK 32/32 |
| **EVAPCO - GREGORY - DUCTING** | `Checklist` | 🔴 **"CHUA KHAI BAO COT"** |
| 10726-043 WOLF | `Checklist_QC` | OK 20.286/20.286 |
| **WOLF QC DINH FITUP** | `PKL` | 🔴 **"CHUA KHAI BAO COT"** |
| CHECKLIST_BISON | `CHECK_LIST` | OK 45.139/45.139 |
| VIOLA_TED | `PKL` | OK 878/878 |
| SVĐVINFATS | `PKL` | OK 10.032/10.033 |
| 10725-008 GREGORY | `GRERY_STEEL` | OK 53.966/53.966 |
| BISON_U2 | `CHECK_LIST` | OK 45.832/45.832 |
| VIOLA_KCT | `PKL` | OK 40.524/40.524 |

**Đây là bằng chứng cứng cho 3 việc:**
1. **Hệ 1 `'27/09 gre-duct'` VẪN CHƯA ĐƯỢC DÁN** — nếu đã dán thì
   `EVAPCO - GREGORY - DUCTING` phải chạy được, chứ không báo "CHUA KHAI BAO COT".
2. **`WOLF QC DINH FITUP` là dự án mới chưa khai `BD_EP`** — chưa có trong bất kỳ tài liệu nào trước đây.
3. Cơ chế **chặn tự đoán cột đang hoạt động đúng như thiết kế** (2 dự án chưa khai đều bị chặn,
   không dựng bậy).

---

## 6. `ncr_data.js`, `aop_data.js`, `khsx_data.js`

### `window.NCRDATA` (6.831 B, `updated: "03/07/2026"`)
```
stage      : {MAT,PRE,FIT,DIM,WEL,GRI,BLA,PAI,PAC,DRW} → tên tiếng Việt
stageChuan : ánh xạ công đoạn lỗi → Dim / Welding / Painting / Bản vẽ
nn         : 8 nguyên nhân gốc 8M (DES, MAN, MAC, MET, MAT, ENV, INS, MGT)
rows       : [ Tên dự án, Nơi phát hiện (xưởng), "YYYY-MM-DD", KL kg, mã lỗi, mã nguyên nhân ]
```
Khi mở trang, `index.html`/`qc.html` **ghi đè `rows`** bằng bản LIVE đọc CSV từ
Sheet `1DqerGEB…` gid 0 (dò cột theo tiêu đề `Tên dự án`, `Nơi phát hiện`,
`Thời điểm phát hiện`, `Khối lượng`, `MÃ LỖI NCR`, `Tình trạng`; chỉ nhận ngày `d/m/yyyy`;
mã lỗi tách bằng `|` thành `code | nguyên nhân`). Đọc hỏng → giữ bản tĩnh.

### `window.AOPDATA` (3.182 B, `updated: "03/07/2026"`) — AOP 2026 KPI Phòng QC
4 khía cạnh BSC với trọng số: Tài chính 45 % · Khách hàng 30 % · Quy trình nội bộ 15 % · Học tập 10 %
(chuỗi `persp[].objs[].krs[]` với `code, text, w, unit, target`).

### `window.KHSX` (41.722 B, `built: "12/09/2026"`)
Nguồn `KH GIA CÔNG THÁNG NM AH (Cut-off ngày 20 hàng tháng).xlsx`.
`gc[ "YYYY-MM" ] = { sheet, cols[], rows[] }`, mỗi `rows[]` = `[xưởng, ĐÃ RHT, TỒN RHT, PHÂN BỔ MỚI, TỔNG Phân Bổ, Đã BH SHOP, KH BH SDC]` (tấn).
Dashboard còn đọc **live** từ Sheet `1kqMlDG4…` (gid `0` = cấu kiện, gid `731881045` = "1-Báo Cáo Dự Án").

---

## 7. QUAN HỆ DỮ LIỆU — cách các kho nối với nhau (và chỗ nối bị đứt)

```
                        ┌──────────── mã số dự án  /\d{5}-\d{3}/ ────────────┐
                        │        (hệ 2 maSo_ ; hệ 3 _dcSpmName)              │
                        ▼                                                    ▼
  QCDATA.P[i]  "10725-008 DGRP EVAPCO-GREGORY-STRUCTURAL"      DANH MUC DU AN.ma "10725-008"
  (tên đầy đủ, 115 dự án)                                      → Spreadsheet ID → file dự án
        ▲                                                                    │
        │ khớp bằng: cột SPM ở registry  →  localStorage 'ddc_alias'          │
        │            →  so tiền tố code  →  so mọi token ≥3 ký tự            │
        └────────────────────────────────────────────────────────────────────┘

  file dự án ──┬── bảng gốc ──► (hệ 1, BD_EP)   ──► DATA QC.col4 Member punch no ──┐
               │            └─► (hệ 3, DDC_CORE) ──► m.pn                          │
               ├── DATA QC  ──► (hệ 2) nợ FUR / nợ DIR-VIR                         │
               ├── DOI CHIEU ─► (hệ 1 chốt an toàn) + (hệ 3 lấy tên tab gốc)       │
               └── _CHUP ─────► (hệ 1) so sánh ngày trước, khoá = Member punch no ─┘
                                                                                   │
  PACKING.Status.'Part No' (UPPER, trim) ══════ khớp trực tiếp ════════════════════┘
```

### 7.1 **Component unique ID — trả lời trực tiếp**

| Hệ | Có ID cấu kiện? | ID là gì | Phạm vi duy nhất |
|---|---|---|---|
| **SPM / `qcdata.js` / dashboard tổng quan** | **KHÔNG** | 1 dòng = 1 tổ hợp `(Dự án, Zone, Xưởng, WorkDate, QCWorkshop, QCDate, QCUser, memo)` đã gộp | không có khái niệm cấu kiện |
| **Hệ 1 `DATA QC` / `_CHUP`** | **CÓ** | **`Member punch no`** (cột 4), sau `.trim()` | duy nhất **trong 1 dự án** |
| **Hệ 2** | dùng lại | `DATA QC` cột 4; đối chiếu packing bằng `.trim().toUpperCase()` | trong 1 dự án |
| **Hệ 3 `DDC_CORE`** | **CÓ** | `m.pn`, cột tuỳ layout (A/B: `member punch no`; C: `member no tên hồ sơ`; D: `tên cấu kiện`) | trong 1 dự án |
| **PACKING** | **CÓ** | `Part No` (UPPERCASE) | trong 1 file packing |

**Không tồn tại ID cấu kiện DUY NHẤT TOÀN HỆ THỐNG.** `Guid` có trong `DATA QC` (cột 1)
nhưng **không được dùng làm khoá ở bất kỳ đâu**; riêng `BISON_U2` còn **cố ý** đặt `guid = punch`.
Mã SPM và mã làm hồ sơ có thể **khác nhau** (GREGORY DUCTING: `part = O` là mã SPM `2-00BLK…`,
`punch = P` là mã hồ sơ `00BLK…`).

### 7.2 Chỗ nối đã biết là YẾU
1. **Dự án ↔ dự án**: khớp bằng regex `\d{5}-\d{3}` hoặc khớp tiền tố tên.
   Dự án **không có mã số** (`VIOLA_KCT`, `CHECKLIST_BISON`, `BISON_U2`, `SVĐVINFATS`)
   phải khai **thêm khoá riêng** trong `BD_PACK`/`BD_REV` — chính là bug đã sửa ở `ban-8`.
2. **`ddc_alias` nằm trong `localStorage` của từng máy** (`_dcAlias`/`_dcAliasSet`) →
   ánh xạ dự án DDC ↔ SPM **không chia sẻ được**, mỗi người một kiểu.
3. **`qcdata.js` không có mã cấu kiện** → không thể nối SPM ↔ DATA QC ở mức cấu kiện.
   Mọi so sánh "SX vs QC" ở dashboard đều là so **theo tấn, theo kỳ**, không phải theo cây.

---

---

## 7bis. DASHBOARD CẢNH BÁO của hệ 1 (`capNhatCanhBao` → `veTongQuan`)

File đích: **TRUNG TAM CANH BAO - EVAPCO** (`1m-3O2N…`, id cũng lưu ở Script Property `CANHBAO_ID`).

### 7bis.1 Cách chạy
1. Duyệt registry (sheet 1). Bỏ qua dự án **không khớp** `CB_LOC = ['EVAPCO','BISON','GREGORY','VIOLA']`
   (`thuocLoc`, so sau khi bỏ dấu).
2. Dự án **đang đồng bộ** (`dangDongBo`) hoặc **đọc lỗi / chưa có DATA QC**
   → **giữ nguyên số liệu LẦN TRƯỚC** (`giuCu`), **không để trống bảng**.
3. Đọc `DATA QC` cột **D..P** (13 cột: Member punch no → Xưởng).
4. Bỏ dòng tiêu đề lọt xuống vùng dữ liệu (ô mã lại là tên cột).
5. Gộp nhóm theo khoá `chuanNhomMS(Milestone) + \x01 + chuanNhomXuong(Xưởng)`.
6. Ghi 2 tab ẩn `_DU LIEU GOC` (8 cột) và `_CHI TIET CAU KIEN` (7 cột, tối đa `CB_MAX = 45.000` dòng),
   rồi gọi `veTongQuan()` vẽ tab hiển thị.

Tab trong file cảnh báo: `TONG QUAN` · `CHUA MOI NT` · `KIEM TRA LO` ·
`DANH SACH CAN XU LY` · `_DU LIEU GOC` (ẩn) · `_CHI TIET CAU KIEN` (ẩn).
Ô `B3` của `TONG QUAN` là ô chọn dự án (data validation) — đổi ô này rồi chạy `veTongQuan` để lọc.

### 7bis.2 Công thức từng cột (đọc trực tiếp từ mã)
| Cột hiển thị | Công thức |
|---|---|
| Tổng CK | đếm mọi dòng có Member punch no |
| **Đủ hồ sơ** | cột **`Cảnh báo` (cột 13) RỖNG** |
| Chưa đủ HS | `Tổng CK − Đủ hồ sơ` |
| Chưa mời NT | `thieu(RFI fab)` |
| % chưa mời | `Chưa mời NT / Tổng CK` |
| **Chưa có DIR** | `coGiaTri(RFI fab) && thieu(DIR Report no)` |
| **Chưa có VIR** | `coGiaTri(RFI fab) && thieu(VIR report no)` |
| % đủ | `Đủ hồ sơ / Tổng CK` |

### 7bis.3 ⚠️ HAI KHÔNG NHẤT QUÁN ĐÃ XÁC MINH

**(a) `Chưa có DIR` / `Chưa có VIR` KHÔNG áp ngưỡng `AD` mà `taoDataQC` dùng.**
`taoDataQC` có quy tắc: công đoạn mà **cả dự án đều trống** (tỷ lệ < `NGUONG = 0.02`)
thì **không báo thiếu** — nên cột `Cảnh báo` để trống, và cột **"Đủ hồ sơ" / "Chưa đủ HS" là ĐÚNG**.
Nhưng `capNhatCanhBao` tính `o.dir`/`o.vir` **thẳng từ ô**, **không** qua ngưỡng đó.

Hệ quả: dự án **cố ý bỏ trống cột DIR** (DIR và VIR chung 1 cột, chỉ điền VIR)
sẽ bị **"Chưa có DIR" đếm bằng đúng số cấu kiện đã có RFI fab** — con số này **vô nghĩa**.
Các khai báo `BD_EP` **không có khoá `dir`**:

| Dự án | Có khớp `CB_LOC`? | Ảnh hưởng |
|---|---|---|
| `VIOLA_TED` | có (chứa "VIOLA") | **bị báo thừa** |
| `EVAPCO - GREGORY - DUCTING` | có (chứa "EVAPCO"/"GREGORY") | **bị báo thừa** |
| `10725-011` | tuỳ **tên trong registry**: nếu là `10725-011 DGRP VIOLA - DUCTING SDM & TED` → có; nếu chỉ là `10725-011` → **không vào dashboard cảnh báo** | **UNKNOWN — NEED USER CONFIRMATION** |
| `SVĐVINFATS` | có? (không chứa từ khoá nào → **không** khớp `CB_LOC`) | không ảnh hưởng; ngoài ra không khai `rfi` nên điều kiện `coGiaTri(RFI)` luôn sai |

> Đây là **báo thừa (over-report)**, không phải mất dữ liệu, và **không** làm sai
> cột "Chưa đủ HS". Chưa sửa — chờ anh xác nhận đây là lỗi hay là cố ý.

**(b) Hệ 1 và hệ 2 định nghĩa "nợ final" KHÁC NHAU → số hai bên không so trực tiếp được.**

| | Hệ 1 (dashboard cảnh báo) | Hệ 2 (KIEM TRA BC-REV) |
|---|---|---|
| Cách đếm | **Tách riêng**: `Chưa có DIR` và `Chưa có VIR` là 2 con số | **Gộp một**: nợ final = có RFI fab **và VIR RỖNG VÀ DIR RỖNG** |
| 1 cấu kiện có VIR, thiếu DIR | bị tính vào `Chưa có DIR` | **KHÔNG** tính là nợ |
| Áp ngưỡng `AD` (cả cột trống thì bỏ qua) | **không** | (không cần — vì đòi cả hai cùng rỗng) |

→ Khi đối chiếu số giữa "TRUNG TAM CANH BAO" và "TRUNG TAM KIEM TRA BC & REV",
**phải nhớ hai bên đang đo hai thứ khác nhau.**

### 7bis.4 `kiemChung` — 12 hạng mục tự kiểm (0 → 11)
`0.` Khai báo cột trong `BD_EP` (chưa khai → dừng, chỉ báo 1 dòng) ·
`1.` Bảng gốc đủ dòng so với Excel · `2.` Dòng tiêu đề đúng ·
`3.` Đối chiếu ngược N cấu kiện mẫu · `4.` Không có dòng tiêu đề lẫn vào dữ liệu ·
`5.` Cột `Member punch no` là mã thật · `6.` `RFI Fab date` đúng kiểu NGÀY ·
`7.` Cột `Cảnh báo` đúng quy ước · `8.` `RFI fab` không lấy nhầm RFI fit-up ·
`9.` `VIR` và `DIR` không trùng cột · `10.` Cột `Xưởng` không lấy nhầm ·
`11.` `GUID` không bị điền xuống hàng loạt.

---

## 8. Chưa xác định được
- `spm_flatten.py` bản thật trên PC → **UNKNOWN — NEED USER CONFIRMATION**
- Tab `DANH MUC` (hệ 3) và sheet 1 (hệ 1/2) của registry có đồng bộ không → **UNKNOWN — NEED USER CONFIRMATION**
- Cấu trúc trả về của Web App phân công QC (`?cb=`, `?gallery=1`) → suy ra từ mã tiêu thụ,
  **chưa có mã nguồn phía server** → **UNKNOWN — NEED USER CONFIRMATION**
- Ý nghĩa nghiệp vụ chính xác của phân loại `Miễn QC` → **UNKNOWN — NEED USER CONFIRMATION**
- Tên chính xác của dự án `10725-011` trong registry (quyết định nó có vào dashboard
  cảnh báo hay không, xem §7bis.3a) → **UNKNOWN — NEED USER CONFIRMATION**
- Cột `Chưa có DIR` báo thừa cho dự án dùng chung cột DIR/VIR là **lỗi** hay **cố ý**
  → **UNKNOWN — NEED USER CONFIRMATION**
