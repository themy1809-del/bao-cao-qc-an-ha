#!/usr/bin/env python3
# PreToolUse — CHAN cac thao tac CLAUDE.md cam (14/11/2026):
#  1) sua tay qcdata.js (Edit/Write/MultiEdit, hoac Bash ghi de / sed -i / cp / mv / tee / rm vao qcdata.js)
#  2) git commit khi qcdata.js dang nam trong vung staged (PC moi duoc day tep nay)
#  3) git add / commit thu muc vault Obsidian "QC An Ha" (co ten nhan su)
# Ma thoat 2 = chan, thong bao (stderr) duoc dua lai cho Claude.
import json, re, subprocess, sys
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
tool = d.get('tool_name', '')
ti = d.get('tool_input', {}) or {}
def chan(msg):
    print('CHAN (harness · CLAUDE.md): ' + msg, file=sys.stderr)
    sys.exit(2)
if tool in ('Edit', 'Write', 'MultiEdit', 'NotebookEdit'):
    fp = str(ti.get('file_path') or ti.get('notebook_path') or '')
    if re.search(r'(^|/)qcdata\.js$', fp):
        chan('khong sua tay qcdata.js — tep nay do PC day len tu SPM (CAP_NHAT_VA_PUSH.bat).')
elif tool == 'Bash':
    cmd = str(ti.get('command') or '')
    viet = r'(>>?\s*\S*qcdata\.js\b|\bsed\s+(-\w*\s+)*-i[^|;&\n]*qcdata\.js|\b(cp|mv|tee|truncate|rm|install)\b[^|;&\n]*\bqcdata\.js\b)'
    if re.search(viet, cmd):
        chan('lenh nay ghi / xoa qcdata.js — khong sua tay, khong ghi de (CLAUDE.md muc 3).')
    if re.search(r'\bgit\s+add\b[^|;&\n]*(QC An Ha|QC_An_Ha)', cmd):
        chan('khong dua vault Obsidian (co ten nhan su) vao repo cong khai.')
    if re.search(r'\bgit\s+add\b[^|;&\n]*\bqcdata\.js\b', cmd):
        chan('khong tu commit qcdata.js — PC day tep nay.')
    if re.search(r'\bgit\s+commit\b', cmd):
        try:
            st = subprocess.run(['git', 'diff', '--cached', '--name-only'], capture_output=True, text=True, timeout=10).stdout.split()
        except Exception:
            st = []
        if 'qcdata.js' in st:
            chan('qcdata.js dang trong vung staged — bo ra truoc: git restore --staged qcdata.js')
sys.exit(0)
