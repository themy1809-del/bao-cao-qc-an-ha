@echo off
chcp 65001 >nul
title Cai lich KEO BAN DO 17:30
rem ============================================================
rem  He 4 "DONG BO BAN DO COT" - tao lich Task Scheduler 17:30 hang ngay.
rem  Chay khi nguoi dung DANG DANG NHAP (de thay o Z:).
rem  Chay lai file nay = cap nhat lich (khong tao trung).
rem ============================================================
set "VBS=%~dp0KEO_BANDO.vbs"
if not exist "%VBS%" (
  echo [!] Khong thay %VBS%
  pause
  exit /b 1
)
schtasks /Create /F /SC DAILY /ST 17:30 /TN "QC_KEO_BANDO" /TR "wscript.exe \"%VBS%\" tudong"
if errorlevel 1 (
  echo [!] Tao lich THAT BAI.
) else (
  echo [OK] Da tao lich QC_KEO_BANDO luc 17:30 hang ngay.
  echo      Xem/sua: Task Scheduler ^> Task Scheduler Library ^> QC_KEO_BANDO
)
pause
