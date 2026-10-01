@echo off
chcp 65001 >nul
title Cap nhat va Push GitHub
cd /d "%~dp0"
rem ============================================================
rem  Ban 01/10/2026 (Claude): giu nguyen 3 buoc cu, THEM buoc khoa du lieu
rem  khi da bat dang nhap (co file qc_dashboard_public\nguoi_dung.csv).
rem  Chua co nguoi_dung.csv -> chay y nhu ban cu.
rem ============================================================
echo ============================================================
echo    CAP NHAT DU LIEU  +  DAY LEN GITHUB  (1 nut)
echo ============================================================
echo.
if not exist "qc_dashboard_public\.git" (
  echo [!] Chua thiet lap Git. Hay chay CAI_DAT_LAN_DAU.bat truoc 1 lan.
  pause
  exit /b 1
)

echo [1/4] Cap nhat tu SPM  Update spm\spm.xlsx ...
if not exist "Update spm\spm.xlsx" (
  echo     - KHONG thay "Update spm\spm.xlsx"
  echo     - BO QUA buoc cap nhat SPM, van tiep tuc day giao dien len GitHub.
  goto :KHOA
)
where python >nul 2>&1
if errorlevel 1 (
  echo     - Chua cai Python, bo qua buoc cap nhat SPM.
  goto :KHOA
)
python spm_flatten.py "Update spm\spm.xlsx" "%~dp0."
if errorlevel 1 (
  echo.
  echo [!] Cap nhat SPM that bai - xem loi o tren. Du lieu cu giu nguyen.
  echo     Van tiep tuc day giao dien len GitHub.
  goto :KHOA
)
echo.
echo [2/4] Chep du lieu sang ban public...
copy /Y qcdata.js "qc_dashboard_public\qcdata.js" >nul
echo.

:KHOA
echo [3/4] Khoa du lieu (dang nhap)...
cd /d "%~dp0qc_dashboard_public"
if not exist "nguoi_dung.csv" (
  echo     - Chua bat dang nhap ^(khong co nguoi_dung.csv^) -^> du lieu len mang o dang THUONG.
  goto :PUSH
)
python khoa_qcdata.py
if errorlevel 1 (
  echo.
  echo [X] KHOA DU LIEU THAT BAI - xem loi o tren.
  echo     KHONG day qcdata.js chua khoa len mang: tra lai ban cu tren GitHub.
  git checkout -- qcdata.js
  echo     Van tiep tuc day giao dien len GitHub.
)
echo.

:PUSH
echo [4/4] Day len GitHub...
cd /d "%~dp0qc_dashboard_public"
if exist ".git\index.lock" (
  del /f /q ".git\index.lock"
  echo     - Da go khoa git con sot
)
git add -A
git commit -m "Cap nhat QC %date% %time%"
if errorlevel 1 echo     - Khong co thay doi moi, bo qua commit
git pull --rebase
git push
if errorlevel 1 (
  echo.
  echo ============================================================
  echo  [X] PUSH THAT BAI. Kiem tra theo thu tu:
  echo   1. Co mang khong?           ping github.com
  echo   2. Da dang nhap GitHub chua?
  echo      git config --global credential.helper manager
  echo      roi chay lai, Windows se hien cua so dang nhap.
  echo   3. Remote hien tai:
  git remote -v
  echo   4. Nhanh hien tai:
  git branch --show-current
  echo ============================================================
  cd /d "%~dp0"
  pause
  exit /b 1
)
cd /d "%~dp0"
echo.
echo ============================================================
echo  [v] XONG! Cho GitHub Pages build ~1 phut roi mo:
echo.
echo      https://themy1809-del.github.io/bao-cao-qc-an-ha/
echo.
echo  LUU Y: bam Ctrl+F5 de khong dinh cache cu.
echo  Kiem tra: dong "nguon SPM dd/mm/yyyy" ngay duoi tieu de trang
echo  phai la ngay cua file SPM vua cap nhat.
echo ============================================================
echo.
pause
