#!/usr/bin/env bash
# kiem_tra/harness.sh — CHAY TOAN BO KIEM TRA truoc khi giao / day len main (14/11/2026)
# Dung:  bash kiem_tra/harness.sh            (day du: cu phap + du lieu + bao ve + giao dien ~4-6 phut)
#        bash kiem_tra/harness.sh --nhanh    (bo phan giao dien, ~5 giay)
#        bash kiem_tra/harness.sh --trang ban_do_qc.html   (giao dien chi 1 trang + cac tab cua no)
# Ket qua: bang tong ket + ma thoat 0 (DAT) / 1 (CON LOI).
cd "$(dirname "$0")/.." || exit 1
NHANH=0; TRANG=""
while [ $# -gt 0 ]; do case "$1" in --nhanh) NHANH=1;; --trang) TRANG="$2"; shift;; esac; shift; done
KQ=(); LOI=0
buoc(){ local ten="$1"; shift; echo; echo "=== $ten"; if "$@"; then KQ+=("DAT      $ten"); else KQ+=("CON LOI  $ten"); LOI=1; fi; }
buoc "1. Cu phap JS (moi trang + tep .js)" node kiem_tra/kiem_cu_phap.js
buoc "2. Du lieu (qcdata khop check, phan bo, pb_to, md_to)" node kiem_tra/kiem_du_lieu.js
bao_ve(){ local ok=0
  if ! git diff --quiet -- qcdata.js 2>/dev/null; then echo "LOI  qcdata.js bi sua trong thu muc lam viec — CLAUDE.md: khong sua tay. Tra lai: git checkout -- qcdata.js"; ok=1; else echo "OK   qcdata.js khong bi sua tay"; fi
  if git diff --cached --name-only 2>/dev/null | grep -qx qcdata.js; then echo "LOI  qcdata.js dang duoc dua vao commit"; ok=1; fi
  if git ls-files --error-unmatch 'QC An Ha' >/dev/null 2>&1; then echo "LOI  vault Obsidian (co ten nhan su) dang nam trong repo"; ok=1; fi
  return $ok; }
buoc "3. Bao ve (qcdata.js, du lieu nhan su)" bao_ve
buoc "3b. Link trong ma deu co trong danh muc LINK CHUNG" node kiem_tra/kiem_link.js
buoc "3c. Sheet nguon truc tuyen dung tab / dung mau" node kiem_tra/kiem_nguon.js
if [ $NHANH -eq 0 ]; then
  PORT=8765; MO=0
  if ! curl -s -o /dev/null "http://localhost:$PORT/"; then python3 -m http.server $PORT >/dev/null 2>&1 & SRV=$!; MO=1; sleep 1.5; fi
  if [ -n "$TRANG" ]; then buoc "4. Giao dien $TRANG" node kiem_tra/ui_audit.js "$TRANG"
  else buoc "4. Giao dien moi trang (2 theme x 2 co man)" node kiem_tra/ui_audit.js; fi
  if [ -z "$TRANG" ] || [ "$TRANG" = "ban_do_qc.html" ]; then
    buoc "5. Giao dien ban_do_qc — tab San luong PB" env UA_PRE="document.querySelector('[data-tab=pb]').click()" UA_WAIT=1500 node kiem_tra/ui_audit.js ban_do_qc.html
    buoc "6. Giao dien ban_do_qc — tab Mo phong (Mang luoi)" env UA_PRE="localStorage.setItem('bdqcMpMode','net');document.querySelector('[data-tab=mp]').click()" UA_WAIT=2500 node kiem_tra/ui_audit.js ban_do_qc.html
  fi
  [ $MO -eq 1 ] && kill $SRV 2>/dev/null
fi
echo; echo "================ TONG KET HARNESS ================"; for x in "${KQ[@]}"; do echo "  $x"; done
if [ $LOI -eq 0 ]; then echo "  => DAT HET — duoc phep giao / day len main"; else echo "  => CON LOI — sua truoc khi giao"; fi
exit $LOI
