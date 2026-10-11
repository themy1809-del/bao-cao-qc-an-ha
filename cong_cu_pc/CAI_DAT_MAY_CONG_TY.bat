@echo off
chcp 65001 >nul
title Cai dat may cong ty - Bao cao QC An Ha
cd /d "%~dp0"
rem ============================================================
rem  CAI_DAT_MAY_CONG_TY.bat  (11/10/2026)
rem  Chay 1 LAN tren may cong ty, trong 1 THU MUC TRONG moi tao
rem  (vd D:\BaoCaoQC). Script se:
rem    1) kiem Python + Git (thieu thi bao link tai, dung lai)
rem    2) cai thu vien Python: openpyxl, pywinauto
rem    3) tai code dashboard ve thu muc qc_dashboard_public
rem    4) chep spm_flatten.py, CAP_NHAT_VA_PUSH.bat, so_sanh_qcdata.py,
rem       qcdata.js (lam nen ghep thang) ra thu muc nay
rem    5) tao thu muc "Update spm"
rem  KHONG chua mat khau / PAT nao. Lan push dau tien Windows se
rem  hoi dang nhap GitHub -> dan PAT MOI (fine-grained) cua may nay.
rem ============================================================
echo ============================================================
echo    CAI DAT MAY CONG TY - BAO CAO QC AN HA
echo    Thu muc: %~dp0
echo ============================================================
echo.

echo [1/5] Kiem tra Python va Git...
where python >nul 2>&1
if errorlevel 1 goto :THIEU_PY
where git >nul 2>&1
if errorlevel 1 goto :THIEU_GIT
python --version
git --version
echo.

echo [2/5] Cai thu vien Python (openpyxl, pywinauto)...
python -m pip install --upgrade openpyxl pywinauto
if errorlevel 1 goto :LOI_PIP
echo.

echo [3/5] Tai code dashboard ve qc_dashboard_public ...
if exist "qc_dashboard_public\.git" goto :DA_CO_REPO
git clone https://github.com/themy1809-del/bao-cao-qc-an-ha.git qc_dashboard_public
if errorlevel 1 goto :LOI_CLONE
goto :CHEP
:DA_CO_REPO
echo     - Da co qc_dashboard_public, chi cap nhat ban moi nhat.
cd /d "%~dp0qc_dashboard_public"
git pull
cd /d "%~dp0"

:CHEP
echo.
echo [4/5] Chep cong cu ra thu muc goc...
copy /Y "qc_dashboard_public\spm_flatten.py" "spm_flatten.py" >nul
copy /Y "qc_dashboard_public\cong_cu_pc\CAP_NHAT_VA_PUSH.bat" "CAP_NHAT_VA_PUSH.bat" >nul
copy /Y "qc_dashboard_public\cong_cu_pc\so_sanh_qcdata.py" "so_sanh_qcdata.py" >nul
if exist "qcdata.js" goto :CO_QCDATA
copy /Y "qc_dashboard_public\qcdata.js" "qcdata.js" >nul
echo     - Da lay qcdata.js tu GitHub lam nen de GHEP theo thang.
goto :THU_MUC
:CO_QCDATA
echo     - Da co qcdata.js o thu muc nay, GIU NGUYEN (khong ghi de).

:THU_MUC
echo.
echo [5/5] Tao thu muc "Update spm"...
if not exist "Update spm" mkdir "Update spm"

echo.
echo ============================================================
echo  [v] XONG. Viec tiep theo:
echo   1. Xuat SPM dung bo cuc 7 cap + Memo:
echo      Project ^> Phase ^> Workshop ^> Work Date ^> QC Workshop ^> QC User ^> QC Date ^> Memo
echo      luu thanh:  %~dp0Update spm\spm.xlsx
echo   2. Chay CAP_NHAT_VA_PUSH.bat
echo      Lan dau Windows hoi dang nhap GitHub: chon "Token" va dan
echo      PAT MOI (fine-grained, chi repo bao-cao-qc-an-ha, Contents RW).
echo   3. Push duoc roi -^> vao GitHub XOA PAT cu cua may ca nhan.
echo ============================================================
pause
exit /b 0

:THIEU_PY
echo.
echo [X] Chua co PYTHON. Tai tai: https://www.python.org/downloads/
echo     Khi cai NHO TICK o "Add python.exe to PATH". Cai xong chay lai file nay.
pause
exit /b 1
:THIEU_GIT
echo.
echo [X] Chua co GIT. Tai tai: https://git-scm.com/download/win
echo     Cai mac dinh (Next lien tuc). Cai xong DONG cua so nay, chay lai file nay.
pause
exit /b 1
:LOI_PIP
echo.
echo [X] Cai thu vien loi. May cong ty co the chan pip / can proxy.
echo     Chup man hinh loi gui Claude, hoac nho IT cai: openpyxl, pywinauto
pause
exit /b 1
:LOI_CLONE
echo.
echo [X] Khong tai duoc tu GitHub. Kiem tra mang / proxy cong ty.
echo     Thu mo https://github.com tren trinh duyet cua may nay.
pause
exit /b 1
