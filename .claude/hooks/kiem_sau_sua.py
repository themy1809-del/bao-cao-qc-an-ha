#!/usr/bin/env python3
# PostToolUse — sau moi lan Claude sua .html / .js trong du an: kiem cu phap ngay (kiem_tra/kiem_cu_phap.js).
# Loi -> ma thoat 2, noi dung loi dua lai cho Claude de sua lien. (14/11/2026)
import json, os, subprocess, sys
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)
ti = d.get('tool_input', {}) or {}
fp = str(ti.get('file_path') or '')
root = os.environ.get('CLAUDE_PROJECT_DIR') or os.getcwd()
if not fp.endswith(('.html', '.js')) or fp.endswith('qcdata.js'):
    sys.exit(0)
ab = os.path.abspath(fp)
if not ab.startswith(os.path.abspath(root) + os.sep) or '/.claude/' in ab:
    sys.exit(0)
try:
    r = subprocess.run(['node', os.path.join(root, 'kiem_tra', 'kiem_cu_phap.js'), ab], capture_output=True, text=True, timeout=60)
except Exception:
    sys.exit(0)
if r.returncode != 0:
    print('KIEM CU PHAP (harness) — tep vua sua co loi, sua ngay:\n' + r.stdout.strip(), file=sys.stderr)
    sys.exit(2)
sys.exit(0)
