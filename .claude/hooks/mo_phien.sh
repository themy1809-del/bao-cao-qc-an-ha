#!/usr/bin/env bash
# SessionStart — nap boi canh dau phien (14/11/2026): quy tac cung, trang thai git, du lieu, 5 dong HANDOFF moi nhat.
cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
echo "[HARNESS QC An Ha] Quy tac: tra loi tieng Viet; KHONG sua tay / commit qcdata.js; doi giao dien -> goi skill ui-ux-pro-max; truoc khi giao chay: bash kiem_tra/harness.sh (hoac /kiem-tra)."
echo "Nhanh: $(git rev-parse --abbrev-ref HEAD 2>/dev/null) · thay doi chua commit: $(git status --porcelain 2>/dev/null | wc -l) tep"
node -e "try{const vm=require('vm'),fs=require('fs');const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync('qcdata.js','utf8'),c);const D=c.window.QCDATA;console.log('SPM (qcdata.js): '+(D&&D.rows?D.rows.length+' dong, cap nhat '+D.updated:'dang khoa'));}catch(e){}" 2>/dev/null
echo "HANDOFF moi nhat:"; grep -E '^- [0-9]{2}/[0-9]{2}/20' HANDOFF.md 2>/dev/null | tail -5 | python3 -c "import sys;[print(l.rstrip()[:180]) for l in sys.stdin]"
exit 0
