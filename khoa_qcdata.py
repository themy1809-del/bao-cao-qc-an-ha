# -*- coding: utf-8 -*-
"""
khoa_qcdata.py — KHOA (ma hoa) qcdata.js truoc khi day len GitHub.

Vi sao: repo dang CONG KHAI. Ai co link deu tai duoc qcdata.js (18.000+ dong san luong
tung du an). Sau khi khoa, file tren mang chi con la chuoi ma hoa; chi nguoi co ten dang
nhap + mat khau trong nguoi_dung.csv moi mo duoc dashboard.

Cach dung tren PC (chay SAU spm_flatten.py, TRUOC khi git push):
    pip install cryptography            (chi can 1 lan)
    python khoa_qcdata.py               khoa qcdata.js tai cho; ban goc cat vao _out/qcdata_goc.js
    python khoa_qcdata.py --tu-goc      khoa lai tu _out/qcdata_goc.js (sau khi sua danh sach nguoi dung)
    python khoa_qcdata.py --thu TEN     thu dang nhap bang TEN (hoi mat khau) de kiem tra file da khoa
    python khoa_qcdata.py --cai-chan    cai "chot chan" vao git: CHAN commit neu qcdata.js chua khoa

nguoi_dung.csv (KHONG BAO GIO dua len GitHub — da co trong .gitignore), 4 cot:
    ten_dang_nhap,mat_khau,vai,ho_ten
    ten_dang_nhap : chu thuong khong dau, so, dau . _ -   (vd: kientv)
    mat_khau      : toi thieu 10 ky tu
    vai           : gd | qlqc | qcv | sx | hs | all   (trang mo dau tren dashboard)
    ho_ten        : ten hien thi

Mat ma: PBKDF2-SHA256 (600.000 vong) -> khoa rieng tung nguoi; AES-256-GCM.
Moi lan chay sinh KHOA DU LIEU MOI -> xoa 1 nguoi khoi CSV roi chay lai la nguoi do het vao.
Dinh dang phai khop voi dangnhap.html (fmt "qcenc-1").
"""
import base64, csv, getpass, gzip, hashlib, json, os, re, secrets, shutil, sys, unicodedata

try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
except ImportError:
    sys.exit('Thieu thu vien. Chay:  pip install cryptography')

GOC = os.path.dirname(os.path.abspath(__file__))
F_DATA = os.path.join(GOC, 'qcdata.js')
F_USER = os.path.join(GOC, 'nguoi_dung.csv')
F_BAK = os.path.join(GOC, '_out', 'qcdata_goc.js')
ITER = 600000
VAI = {'gd', 'qlqc', 'qcv', 'sx', 'hs', 'all'}
MUOI_TEN = 'qc-an-ha|'


def b64(b):
    return base64.b64encode(b).decode('ascii')


def nfc(s):
    return unicodedata.normalize('NFC', s)


def ma_ten(ten):
    return hashlib.sha256((MUOI_TEN + ten.strip().lower()).encode('utf-8')).hexdigest()


def kek(mat_khau, salt):
    return hashlib.pbkdf2_hmac('sha256', nfc(mat_khau).encode('utf-8'), salt, ITER, 32)


def doc_json(text):
    i, j = text.find('{'), text.rfind('}')
    if i < 0 or j <= i:
        raise ValueError('khong thay doi tuong JSON')
    return json.loads(text[i:j + 1])


def da_khoa(text):
    return 'QCDATA_ENC' in text[:200]


def doc_nguoi_dung():
    if not os.path.exists(F_USER):
        sys.exit('Chua co %s. Chep nguoi_dung_MAU.csv thanh nguoi_dung.csv roi dien that.' % F_USER)
    ds, loi, seen = [], [], set()
    with open(F_USER, encoding='utf-8-sig', newline='') as f:
        for n, r in enumerate(csv.DictReader(f), start=2):
            ten = (r.get('ten_dang_nhap') or '').strip().lower()
            mk = r.get('mat_khau') or ''
            vai = (r.get('vai') or 'all').strip().lower()
            ho = (r.get('ho_ten') or ten).strip()
            if not ten and not mk:
                continue
            if not re.fullmatch(r'[a-z0-9._-]{2,40}', ten):
                loi.append('dong %d: ten_dang_nhap "%s" chi duoc chu thuong khong dau, so, . _ -' % (n, ten))
            if ten in seen:
                loi.append('dong %d: trung ten "%s"' % (n, ten))
            seen.add(ten)
            if len(mk) < 10:
                loi.append('dong %d (%s): mat khau phai tu 10 ky tu' % (n, ten))
            if 'DoiMatKhau' in mk:
                loi.append('dong %d (%s): van dung mat khau MAU — hay doi' % (n, ten))
            if vai not in VAI:
                loi.append('dong %d (%s): vai "%s" khong hop le (%s)' % (n, ten, vai, '|'.join(sorted(VAI))))
            ds.append((ten, mk, vai, ho))
    if loi:
        sys.exit('nguoi_dung.csv co loi:\n  ' + '\n  '.join(loi))
    if not ds:
        sys.exit('nguoi_dung.csv chua co nguoi dung nao.')
    return ds


def khoa(text_goc, ds):
    obj = doc_json(text_goc)
    if not (isinstance(obj, dict) and obj.get('rows')):
        raise ValueError('qcdata.js goc khong co rows')
    k_dl = AESGCM.generate_key(bit_length=256)
    iv = secrets.token_bytes(12)
    than = gzip.compress(json.dumps(obj, ensure_ascii=False, separators=(',', ':')).encode('utf-8'), 9)
    ct = AESGCM(k_dl).encrypt(iv, than, None)
    users = []
    for ten, mk, vai, ho in ds:
        salt = secrets.token_bytes(16)
        ivu = secrets.token_bytes(12)
        goi = json.dumps({'k': b64(k_dl), 'vai': vai, 'ten': ho, 'u': ten}, ensure_ascii=False).encode('utf-8')
        users.append({'id': ma_ten(ten), 's': b64(salt), 'iv': b64(ivu),
                      'w': b64(AESGCM(kek(mk, salt)).encrypt(ivu, goi, None))})
    users.sort(key=lambda u: u['id'])  # khong lo thu tu trong CSV
    enc = {'fmt': 'qcenc-1', 'v': secrets.token_hex(8), 'updated': obj.get('updated', ''),
           'iter': ITER, 'users': users, 'iv': b64(iv), 'ct': b64(ct)}
    return ('// qcdata.js - DA KHOA. Mo bang dangnhap.html. Tao boi khoa_qcdata.py\n'
            'window.QCDATA_ENC=' + json.dumps(enc, separators=(',', ':')) + ';\n'), obj


def thu(ten):
    text = open(F_DATA, encoding='utf-8').read()
    if not da_khoa(text):
        sys.exit('qcdata.js CHUA khoa.')
    enc = doc_json(text)
    u = next((x for x in enc['users'] if x['id'] == ma_ten(ten)), None)
    mk = getpass.getpass('Mat khau cua %s: ' % ten)
    if not u:
        sys.exit('SAI ten dang nhap hoac mat khau.')
    try:
        goi = json.loads(AESGCM(kek(mk, base64.b64decode(u['s']))).decrypt(base64.b64decode(u['iv']), base64.b64decode(u['w']), None))
    except Exception:
        sys.exit('SAI ten dang nhap hoac mat khau.')
    obj = json.loads(gzip.decompress(AESGCM(base64.b64decode(goi['k'])).decrypt(base64.b64decode(enc['iv']), base64.b64decode(enc['ct']), None)))
    print('DANG NHAP DUOC: %s (vai %s) — %d dong, cap nhat %s, check %s' % (goi['ten'], goi['vai'], len(obj['rows']), obj.get('updated'), obj.get('check')))


def cai_chan():
    hook_dir = os.path.join(GOC, '.git', 'hooks')
    if not os.path.isdir(hook_dir):
        sys.exit('Khong thay thu muc .git — chay lenh nay trong thu muc repo.')
    p = os.path.join(hook_dir, 'pre-commit')
    open(p, 'w', newline='\n').write(
        '#!/bin/sh\n'
        '# Chot chan tu khoa_qcdata.py: khong cho commit qcdata.js chua khoa\n'
        'if git diff --cached --name-only | grep -qx "qcdata.js"; then\n'
        '  if ! git show :qcdata.js | head -c 200 | grep -q QCDATA_ENC; then\n'
        '    echo "CHAN: qcdata.js CHUA KHOA. Chay: python khoa_qcdata.py  roi commit lai."\n'
        '    exit 1\n'
        '  fi\n'
        'fi\n')
    try:
        os.chmod(p, 0o755)
    except Exception:
        pass
    print('Da cai chot chan: %s' % p)


def main():
    a = sys.argv[1:]
    if '--thu' in a:
        i = a.index('--thu')
        if i + 1 >= len(a):
            sys.exit('Dung: python khoa_qcdata.py --thu TEN')
        return thu(a[i + 1].strip().lower())
    if '--cai-chan' in a:
        return cai_chan()
    ds = doc_nguoi_dung()
    if '--tu-goc' in a:
        if not os.path.exists(F_BAK):
            sys.exit('Khong co %s' % F_BAK)
        text = open(F_BAK, encoding='utf-8').read()
    else:
        text = open(F_DATA, encoding='utf-8').read()
        if da_khoa(text):
            print('qcdata.js DA KHOA roi — khong lam gi. (Sua nguoi dung xong thi chay --tu-goc)')
            return
        os.makedirs(os.path.dirname(F_BAK), exist_ok=True)
        shutil.copyfile(F_DATA, F_BAK)
    out, obj = khoa(text, ds)
    tmp = F_DATA + '.tmp'
    open(tmp, 'w', encoding='utf-8', newline='\n').write(out)
    os.replace(tmp, F_DATA)
    print('DA KHOA qcdata.js: %d dong, cap nhat %s, %d nguoi dung. Ban goc: %s' % (
        len(obj['rows']), obj.get('updated'), len(ds), F_BAK))


if __name__ == '__main__':
    main()
