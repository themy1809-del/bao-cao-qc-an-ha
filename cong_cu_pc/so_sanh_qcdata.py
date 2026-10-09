#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""So sanh 2 file qcdata.js (ban CU dang chay vs ban MOI vua tao) truoc khi day len web.
Dung: python so_sanh_qcdata.py qcdata_cu.js qcdata_moi.js
Ket qua: tong Fitup/Welding/Painting, so dong theo PhanLoaiQC, lech theo du an, Zone co hay khong.
Chi DOC 2 file, khong ghi gi.
"""
import sys, json
from collections import defaultdict

def load(p):
    t = open(p, encoding='utf-8').read()
    return json.loads(t[t.index('{'):t.rindex('}') + 1])

def tong(D):
    pj = defaultdict(lambda: [0.0, 0.0, 0.0])
    pl = defaultdict(int)
    for r in D['rows']:
        a = pj[D['P'][r[0]]]
        a[0] += r[7]; a[1] += r[8]; a[2] += r[9]
        pl[D['PL'][r[6]]] += 1
    return pj, pl

if len(sys.argv) < 3:
    sys.exit("Dung: python so_sanh_qcdata.py qcdata_cu.js qcdata_moi.js")
A, B = load(sys.argv[1]), load(sys.argv[2])
pa, la = tong(A); pb, lb = tong(B)
print("                 CU            MOI")
print("Ngay du lieu  : %-13s %s" % (A.get('updated'), B.get('updated')))
print("So dong       : %-13d %d" % (len(A['rows']), len(B['rows'])))
for k in ('f', 'w', 'p'):
    print("Tong %-9s: %-13s %s" % ({'f': 'Fitup', 'w': 'Welding', 'p': 'Painting'}[k], A['check'][k], B['check'][k]))
print("\nPhan loai QC (so dong):")
for k in sorted(set(la) | set(lb)):
    print("  %-12s %8d %8d%s" % (k, la.get(k, 0), lb.get(k, 0), '' if la.get(k, 0) == lb.get(k, 0) else '   <- KHAC'))
print("\nZone (hang muc): CU %s | MOI %s" % (
    ('%d gia tri' % len(A['Z'])) if A.get('Z') else 'KHONG CO',
    ('%d gia tri' % len(B['Z'])) if B.get('Z') else 'KHONG CO'))
lech = []
for p in sorted(set(pa) | set(pb)):
    x, y = pa.get(p, [0, 0, 0]), pb.get(p, [0, 0, 0])
    d = [round(y[i] - x[i], 2) for i in range(3)]
    if any(abs(v) >= 0.01 for v in d):
        lech.append((p, x, y, d))
print("\nDu an lech tan (F/W/P): %d" % len(lech))
for p, x, y, d in lech[:40]:
    print("  %-50s F %+.2f  W %+.2f  P %+.2f" % (p[:50], d[0], d[1], d[2]))
if B.get('Z'):
    print("\nDanh sach Zone trong ban MOI (phai TRUNG ten Hang muc ben KHSX):")
    for z in B['Z'][:200]:
        print("  -", z)
print("\nKET LUAN:", "KHOP — co the day len" if not lech and A['check'] == B['check']
      else "CO LECH — xem ky (neu SPM moi xuat ngay khac thi lech la binh thuong)")
