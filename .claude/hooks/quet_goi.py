#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""HARNESS (Claude Code, PreToolUse SendUserFile): CHAN gui file cho user neu goi/tep co the lo bi mat.
- .zip: ten file cam (config.txt, cau_hinh_ai.txt, tai_anh_drive.py, tai khoan/phien web, qcah.json, __pycache__, KET_QUA/)
  + noi dung moi file van ban trong zip co mau key (sk-ant-, AIza..., JWT eyJ...).
- tep van ban (.py .html .js .txt .json .md .csv .bat): quet mau key.
Exit 2 + thong bao -> Claude Code chan lenh gui. Khong in gia tri key ra man hinh."""
import json, os, re, sys, zipfile

CAM = re.compile(r"(^|/)(config\.txt|cau_hinh_ai\.txt|tai_anh_drive\.py|web_nguoi_dung\.json|web_phien\.json|web_khoa(_phien\.txt)?|"
                 r"qcah\.json|web_han_muc\.json|SKETCH_MEMORY\.json)$|(^|/)__pycache__/|(^|/)KET_QUA/", re.I)
KEY = re.compile(rb"sk-ant-[A-Za-z0-9_\-]{8,}|AIza[0-9A-Za-z_\-]{20,}|eyJ[A-Za-z0-9_\-]{30,}\.[A-Za-z0-9_\-]{10,}")
VB = (".py", ".html", ".htm", ".js", ".txt", ".json", ".md", ".csv", ".bat", ".cfg", ".ini", ".xml")


def quet(path):
    loi = []
    if path.lower().endswith(".zip"):
        try:
            with zipfile.ZipFile(path) as z:
                for n in z.namelist():
                    if CAM.search(n.replace("\\", "/")):
                        loi.append("zip co file CAM: %s" % n)
                    elif n.lower().endswith(VB) and z.getinfo(n).file_size < 20 * 1024 * 1024 and KEY.search(z.read(n)):
                        loi.append("zip: %s co chuoi giong KEY" % n)
        except zipfile.BadZipFile:
            loi.append("zip hong: %s" % os.path.basename(path))
    elif path.lower().endswith(VB) and os.path.isfile(path) and os.path.getsize(path) < 20 * 1024 * 1024:
        with open(path, "rb") as f:
            if KEY.search(f.read()):
                loi.append("%s co chuoi giong KEY" % os.path.basename(path))
    return loi


def main():
    try:
        d = json.load(sys.stdin)
    except Exception:
        return 0
    files = (d.get("tool_input") or {}).get("files") or []
    loi = []
    for f in files:
        f = os.path.expanduser(str(f))
        if not os.path.isabs(f):
            f = os.path.join(d.get("cwd") or os.getcwd(), f)
        if os.path.exists(f):
            loi += quet(f)
    if loi:
        sys.stderr.write("HARNESS CHAN GUI FILE (co the lo bi mat):\n- " + "\n- ".join(loi[:20]) +
                         "\nGo file cam / key khoi goi roi dong goi lai.\n")
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
