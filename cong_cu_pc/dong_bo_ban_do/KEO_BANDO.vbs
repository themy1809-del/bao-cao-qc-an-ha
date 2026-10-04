' ======================================================================
'  KEO_BANDO.vbs  -  He 4 "DONG BO BAN DO COT"   (ban 04/10 ban-1)
'  May cong ty: doc ban do cot tu Google Sheet BanDoCheckList, mo tung
'  file checklist tren o Z: (CHI DOC, khong luu), lay dung cac cot da khai,
'  day len Google Sheet: moi du an 1 tab.
'  Chay tay: nhap dup file nay.  Chay tu dong: CAI_LICH_BANDO.bat (17:30).
'  KHONG dung chung voi KEO_DULIEU.vbs (he 1) - 2 file doc lap.
' ======================================================================
Option Explicit

' ---------------- CAU HINH (chi sua 4 dong nay) ----------------
Const URL_WEBAPP = "DAN_URL_EXEC_VAO_DAY"
Const KHOA = "DAN_KHOA_VAO_DAY"
Const THAY_O_Z = ""            ' vd "\\SERVER\DATA" neu Task Scheduler khong thay o Z:
Const SO_DONG_MOI_GOI = 1000
' ---------------------------------------------------------------

Dim fso, thuMuc, fLog, fKhoa, tuDong, phien
Set fso = CreateObject("Scripting.FileSystemObject")
thuMuc = fso.GetParentFolderName(WScript.ScriptFullName)
fLog = thuMuc & "\NHAT_KY_BANDO.txt"
fKhoa = thuMuc & "\DANG_CHAY_BANDO.khoa"
tuDong = (WScript.Arguments.Count > 0)
phien = DinhDangGio(Now, True)

If fso.FileExists(fKhoa) Then
  If DateDiff("n", fso.GetFile(fKhoa).DateLastModified, Now) < 180 Then
    GhiLog "Dang co phien khac chay (DANG_CHAY_BANDO.khoa) -> thoat"
    WScript.Quit 1
  End If
End If
fso.CreateTextFile(fKhoa, True).Close

Dim xl, wbMo, duongMo, dsKetQua, daMoi
Set dsKetQua = CreateObject("Scripting.Dictionary")   ' tab -> Array(duAn, loai, soDong, soNguon, soLoi, ghiChu)
Set daMoi = CreateObject("Scripting.Dictionary")      ' tab da ghi de (moi=1) trong phien nay
Set wbMo = Nothing: duongMo = ""

ChayChinh
DonDep
WScript.Quit 0

' ======================================================================
Sub ChayChinh()
  GhiLog "=== BAT DAU phien " & phien
  Dim tl, dong, i, f, nViec, nLoiBD
  tl = GoiWeb("GET", URL_WEBAPP & "?lenh=viec&k=" & KHOA & "&phien=" & phien, "", True)
  If Left(tl, 3) <> "OK" & vbTab Then
    GhiLog "KHONG lay duoc danh sach viec: " & Left(tl, 300)
    If Not tuDong Then MsgBox "KHONG lay duoc danh sach viec:" & vbCrLf & Left(tl, 300), 16, "KEO BAN DO"
    Exit Sub
  End If
  dong = Split(Replace(tl, vbCr, ""), vbLf)
  f = Split(dong(0), vbTab)
  nViec = CLng(f(2)): nLoiBD = CLng(f(3))
  GhiLog "Phien ban server " & f(1) & " - " & nViec & " viec, " & nLoiBD & " loi ban do (xem tab NHAT KY DONG BO)"

  If Not MoExcel() Then Exit Sub
  For i = 1 To UBound(dong)
    If Trim(dong(i)) <> "" Then LamViec Split(dong(i), vbTab)
  Next
  DongWorkbook

  ' --- tong hop
  Dim k, body, a
  body = "META" & vbTab & KHOA & vbTab & "ketthuc" & vbTab & phien
  For Each k In dsKetQua.Keys
    a = dsKetQua(k)
    body = body & vbLf & k & vbTab & a(0) & vbTab & a(1) & vbTab & a(2) & vbTab & a(3) & vbTab & a(4) & vbTab & a(5)
  Next
  GoiWeb "POST", URL_WEBAPP, body, True
  GhiLog "=== XONG phien " & phien & " - " & dsKetQua.Count & " tab"
  If Not tuDong Then MsgBox "XONG - " & dsKetQua.Count & " tab. Xem tab TONG HOP DONG BO tren Google Sheet." & vbCrLf & "Nhat ky: " & fLog, 64, "KEO BAN DO"
End Sub

' f: 0 id, 1 loai, 2 duAn, 3 tab, 4 path, 5 sheet, 6 dongDau, 7 cotKhoa, 8 cotRa
Sub LamViec(f)
  Dim loai, duAn, tab, duong, tenSheet, dongDau, cotKhoa, cotRa, tenFile, ghiChu
  If UBound(f) < 8 Then Exit Sub
  loai = f(1): duAn = f(2): tab = f(3): duong = f(4): tenSheet = f(5)
  dongDau = CLng(f(6)): cotKhoa = Split(f(7), ","): cotRa = Split(f(8), ",")
  ghiChu = ""
  If Not dsKetQua.Exists(tab) Then dsKetQua.Add tab, Array(duAn, loai, 0, 0, 0, "")

  If THAY_O_Z <> "" And UCase(Left(duong, 2)) = "Z:" Then duong = THAY_O_Z & Mid(duong, 3)
  If Not fso.FileExists(duong) Then
    If LCase(Right(duong, 5)) = ".xlxs" And fso.FileExists(Left(duong, Len(duong) - 5) & ".xlsx") Then
      duong = Left(duong, Len(duong) - 5) & ".xlsx"
      ghiChu = "ban do ghi .xlxs, da dung .xlsx"
    Else
      BaoLoi tab, duAn, duong, tenSheet, "KHONG THAY FILE": Exit Sub
    End If
  End If
  tenFile = fso.GetFileName(duong)

  ' --- mo workbook (dung lai neu cung file voi viec truoc)
  Dim ws, loiMo
  If LCase(duong) <> LCase(duongMo) Then
    DongWorkbook
    On Error Resume Next
    Set wbMo = xl.Workbooks.Open(duong, 0, True, , "x_khong_co_mk_x", , True)
    loiMo = Err.Description: Err.Clear
    On Error GoTo 0
    If wbMo Is Nothing Then BaoLoi tab, duAn, tenFile, tenSheet, "KHONG MO DUOC FILE: " & loiMo: Exit Sub
    duongMo = duong
  End If
  Set ws = Nothing
  On Error Resume Next
  Set ws = wbMo.Worksheets(tenSheet)
  Err.Clear
  On Error GoTo 0
  If ws Is Nothing Then BaoLoi tab, duAn, tenFile, tenSheet, "KHONG CO SHEET": Exit Sub

  ' --- bo loc (chi trong bo nho, file KHONG duoc luu)
  On Error Resume Next
  If ws.FilterMode Then ws.ShowAllData
  Dim lo
  For Each lo In ws.ListObjects
    If lo.AutoFilter.FilterMode Then lo.AutoFilter.ShowAllData
  Next
  Err.Clear
  On Error GoTo 0

  ' --- dong cuoi = dong cuoi co du lieu o cac cot khoa (MP, GUID)
  Dim j, r, dongCuoi, ur, idxKhoa(), idxRa(), maxCot
  ReDim idxKhoa(UBound(cotKhoa)): ReDim idxRa(UBound(cotRa))
  dongCuoi = 0: maxCot = 1
  For j = 0 To UBound(cotKhoa)
    idxKhoa(j) = SoCot(cotKhoa(j))
    r = ws.Cells(ws.Rows.Count, idxKhoa(j)).End(-4162).Row
    If r > dongCuoi Then dongCuoi = r
    If idxKhoa(j) > maxCot Then maxCot = idxKhoa(j)
  Next
  ur = ws.UsedRange.Row + ws.UsedRange.Rows.Count - 1
  If ur > dongCuoi And ur - dongCuoi <= 5000 Then dongCuoi = ur   ' phong dong an
  For j = 0 To UBound(cotRa)
    idxRa(j) = SoCot(cotRa(j))
    If idxRa(j) > maxCot Then maxCot = idxRa(j)
  Next

  Dim moi, n, dl, hang(), cap, coKhoa, dongs(), nd, tong, t1(1, 1)
  moi = Not daMoi.Exists(tab)
  nd = 0: tong = 0: cap = 256: ReDim dongs(cap)
  If dongCuoi >= dongDau Then
    dl = ws.Range(ws.Cells(dongDau, 1), ws.Cells(dongCuoi, maxCot)).Value
    If Not IsArray(dl) Then t1(1, 1) = dl: dl = t1
    For n = 1 To UBound(dl, 1)
      coKhoa = False
      For j = 0 To UBound(idxKhoa)
        If Trim(ChuoiO(dl(n, idxKhoa(j)))) <> "" Then coKhoa = True: Exit For
      Next
      If coKhoa Then
        ReDim hang(UBound(idxRa) + 1)
        hang(0) = CStr(dongDau + n - 1)
        For j = 0 To UBound(idxRa)
          If idxRa(j) > 0 Then hang(j + 1) = ChuoiO(dl(n, idxRa(j))) Else hang(j + 1) = ""
        Next
        If nd > cap Then cap = cap * 2: ReDim Preserve dongs(cap)
        dongs(nd) = Join(hang, vbTab): nd = nd + 1
        If nd >= SO_DONG_MOI_GOI Then
          If Not GuiGoi(loai, duAn, moi, tenFile, tenSheet, dongs, nd, tab) Then Exit Sub
          moi = False: tong = tong + nd: nd = 0
        End If
      End If
    Next
  End If
  If nd > 0 Or moi Then
    If Not GuiGoi(loai, duAn, moi, tenFile, tenSheet, dongs, nd, tab) Then Exit Sub
    tong = tong + nd
  End If

  Dim a: a = dsKetQua(tab)
  a(2) = a(2) + tong: a(3) = a(3) + 1
  If ghiChu <> "" Then a(5) = Trim(a(5) & " " & ghiChu)
  dsKetQua(tab) = a
  GhiLog "OK  " & tab & " <- " & tenFile & " [" & tenSheet & "] " & tong & " dong"
  NhatKyWeb duAn, tenFile, tenSheet, "OK", tong, ghiChu
End Sub

Function GuiGoi(loai, duAn, moi, tenFile, tenSheet, dongs, nd, tab)
  Dim body, i, tl, m, phan()
  If moi Then m = "1" Else m = "0"
  ReDim phan(nd)
  phan(0) = "META" & vbTab & KHOA & vbTab & "ghi" & vbTab & phien & vbTab & loai & vbTab & duAn & vbTab & m & vbTab & tenFile & vbTab & tenSheet
  For i = 0 To nd - 1: phan(i + 1) = dongs(i): Next
  body = Join(phan, vbLf)
  tl = GoiWeb("POST", URL_WEBAPP, body, False)
  If Left(tl, 3) = "OK" & vbTab Then
    If moi Then daMoi(tab) = True
    GuiGoi = True
  Else
    BaoLoi tab, duAn, tenFile, tenSheet, "LOI GHI LEN SHEET: " & Left(tl, 200)
    GuiGoi = False
  End If
End Function

Sub BaoLoi(tab, duAn, tenFile, tenSheet, lyDo)
  Dim a
  If Not dsKetQua.Exists(tab) Then dsKetQua.Add tab, Array(duAn, "", 0, 0, 0, "")
  a = dsKetQua(tab): a(4) = a(4) + 1: a(5) = Trim(a(5) & " " & lyDo & " (" & tenSheet & ")")
  dsKetQua(tab) = a
  GhiLog "LOI " & tab & " <- " & tenFile & " [" & tenSheet & "] " & lyDo
  NhatKyWeb duAn, tenFile, tenSheet, "LOI", 0, lyDo
End Sub

Sub NhatKyWeb(duAn, tenFile, tenSheet, tt, soDong, ghiChu)
  GoiWeb "POST", URL_WEBAPP, "META" & vbTab & KHOA & vbTab & "nhatky" & vbTab & phien & vbLf & _
    Sach(duAn) & vbTab & Sach(tenFile) & vbTab & Sach(tenSheet) & vbTab & tt & vbTab & soDong & vbTab & Sach(ghiChu), True
End Sub

' ---------------- Excel ----------------
Function MoExcel()
  On Error Resume Next
  Set xl = CreateObject("Excel.Application")
  If Err.Number <> 0 Then GhiLog "KHONG mo duoc Excel: " & Err.Description: MoExcel = False: Exit Function
  xl.Visible = False: xl.DisplayAlerts = False: xl.ScreenUpdating = False
  xl.AskToUpdateLinks = False: xl.EnableEvents = False
  xl.AutomationSecurity = 3        ' tat macro khi mo .xlsm
  Err.Clear
  MoExcel = True
End Function

Sub DongWorkbook()
  On Error Resume Next
  If Not wbMo Is Nothing Then wbMo.Close False   ' KHONG luu
  Set wbMo = Nothing: duongMo = ""
  Err.Clear
End Sub

Sub DonDep()
  On Error Resume Next
  DongWorkbook
  xl.Quit
  Set xl = Nothing
  fso.DeleteFile fKhoa, True
End Sub

' ---------------- tien ich ----------------
Function SoCot(chu)
  Dim i, s: s = 0: chu = UCase(Trim(chu))
  For i = 1 To Len(chu): s = s * 26 + (Asc(Mid(chu, i, 1)) - 64): Next
  SoCot = s
End Function

Function ChuoiO(v)
  Dim s
  Select Case VarType(v)
    Case 0, 1: s = ""
    Case 7: s = Right("0" & Day(v), 2) & "/" & Right("0" & Month(v), 2) & "/" & Year(v)
    Case 10: s = "#LOI"
    Case 2, 3, 4, 5, 6, 14, 17: s = Trim(Str(v))   ' Str: luon dung dau cham thap phan
    Case Else: s = CStr(v)
  End Select
  ChuoiO = Sach(s)
End Function

Function Sach(s)
  Sach = Replace(Replace(Replace(CStr(s), vbTab, " "), vbCr, " "), vbLf, " ")
End Function

Function GoiWeb(method, url, body, lapMang)
  Dim h, lan, kq
  For lan = 1 To 3
    kq = ""
    On Error Resume Next
    Set h = CreateObject("MSXML2.ServerXMLHTTP.6.0")
    h.setTimeouts 30000, 60000, 360000, 360000
    h.open method, url, False
    If method = "POST" Then
      h.setRequestHeader "Content-Type", "text/plain; charset=utf-8"
      h.send Utf8Bytes(body)
    Else
      h.send
    End If
    If Err.Number <> 0 Then
      kq = "LOI MANG: " & Err.Description
    ElseIf h.status <> 200 Then
      kq = "LOI HTTP " & h.status
    Else
      kq = DocUtf8(h.responseBody)
    End If
    Err.Clear
    On Error GoTo 0
    ' Goi lai khi: server dang ban (chua ghi gi), hoac loi mang/HTTP neu lapMang=True.
    ' Lenh "ghi" truyen lapMang=False de khong ghi trung 1 goi du lieu.
    If InStr(kq, "DANG BAN") = 0 Then
      If Not lapMang Then Exit For
      If Left(kq, 8) <> "LOI MANG" And Left(kq, 8) <> "LOI HTTP" Then Exit For
    End If
    WScript.Sleep 5000 * lan
  Next
  GoiWeb = kq
End Function

Function Utf8Bytes(s)
  Dim st: Set st = CreateObject("ADODB.Stream")
  st.Type = 2: st.Charset = "utf-8": st.Open: st.WriteText s
  st.Position = 0: st.Type = 1: st.Position = 3     ' bo BOM
  Utf8Bytes = st.Read: st.Close
End Function

Function DocUtf8(b)
  Dim st: Set st = CreateObject("ADODB.Stream")
  st.Type = 1: st.Open: st.Write b
  st.Position = 0: st.Type = 2: st.Charset = "utf-8"
  DocUtf8 = st.ReadText: st.Close
End Function

Function DinhDangGio(d, gon)
  If gon Then
    DinhDangGio = Year(d) & Right("0" & Month(d), 2) & Right("0" & Day(d), 2) & "-" & Right("0" & Hour(d), 2) & Right("0" & Minute(d), 2)
  Else
    DinhDangGio = Right("0" & Day(d), 2) & "/" & Right("0" & Month(d), 2) & "/" & Year(d) & " " & Right("0" & Hour(d), 2) & ":" & Right("0" & Minute(d), 2) & ":" & Right("0" & Second(d), 2)
  End If
End Function

Sub GhiLog(s)
  On Error Resume Next
  Dim t: Set t = fso.OpenTextFile(fLog, 8, True, -1)   ' Unicode
  t.WriteLine DinhDangGio(Now, False) & "  " & s
  t.Close
End Sub
