#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Trich sheet "PHAN BO DU AN THANG mm/yyyy XUONG AHx" (phan bo theo TO) -> pb_to.js cho ban_do_qc.html.
Cach dung:
  python pb_to_trich.py AH3 2026-11 <file.csv>        # CSV xuat tu Google Sheet (File > Download > CSV)
  python pb_to_trich.py AH3 2026-11 <sheet_id> [gid]  # neu sheet da chia se "Bat ky ai co lien ket": tai qua gviz
Chay nhieu lan cho nhieu xuong/thang: file pb_to.js duoc GOP (giu cac xuong/thang da co).
Cot sheet: B STT | C Du an | D KL thuc hien | E Con lai | F Rap tho (to) | G Rap hoan thien (to) | H KL RHT | I KL lap thu | J Khu vuc lap thu.
Dong STT trong + cot G co to = dong tiep cua du an tren (du an chia cho nhieu to RHT).
Ma to -> ma SPM: RHTn -> TOnRH, RTn -> TOnRT, 'Toan phat' -> nha thau phu (giu ten), 'ok' -> da xong rap tho.
Don vi: tieu de ghi (kg) nhung so tren sheet la TAN (tong 1.495 ~ KHSX AH3 con rap 1.232 t) -> giu nguyen, coi la tan.
"""
import sys,os,re,csv,json,io,datetime,urllib.request
HERE=os.path.dirname(os.path.abspath(__file__));OUT=os.path.join(HERE,'..','pb_to.js')
def ma_to(s):
    s=(s or '').strip()
    if not s: return ''
    m=re.match(r'^RHT\s*(\d+)$',s,re.I)
    if m: return 'TO%sRH'%m.group(1)
    m=re.match(r'^RT\s*(\d+)$',s,re.I)
    if m: return 'TO%sRT'%m.group(1)
    return s
def so(s):
    s=(s or '').strip().replace('.','').replace(',','.')
    try: return float(s)
    except: return None
def doc(rows):
    out=[];cur=None
    for r in rows:
        r=list(r)+['']*(10-len(r))
        stt,pj,kl,cl,rt,rht,klr,klt,khu=r[1],r[2].strip(),so(r[3]),so(r[4]),r[5].strip(),r[6].strip(),so(r[7]),so(r[8]),r[9].strip()
        if stt.strip().lower() in ('total','tổng','tong','stt'): continue
        if pj:
            cur={'ma':pj.split(' ')[0],'ten':pj,'kl':kl or 0,'conLai':cl or 0,'rt':[ma_to(x) for x in re.split(r'\s*[-,/]\s*',rt) if x.strip()] if rt else [],'to':[],'lapThu':klt or 0,'khuLT':khu}
            out.append(cur)
        if cur is None: continue
        if rht:
            cur['to'].append({'to':ma_to(rht),'kl':klr or 0,'ghi':'' if klr is not None else r[7].strip()})
        elif khu and not cur['khuLT']: cur['khuLT']=khu
    return out
def main():
    if len(sys.argv)<4: print(__doc__);sys.exit(1)
    xw,ym,src=sys.argv[1].upper(),sys.argv[2],sys.argv[3]
    if os.path.exists(src):
        txt=open(src,encoding='utf-8-sig').read();goc=os.path.basename(src)
    else:
        gid=sys.argv[4] if len(sys.argv)>4 else '0'
        url='https://docs.google.com/spreadsheets/d/%s/gviz/tq?tqx=out:csv&gid=%s'%(src,gid)
        txt=urllib.request.urlopen(url,timeout=60).read().decode('utf-8-sig');goc=src
        if txt.lstrip().startswith('<'): sys.exit('Sheet chua chia se cong khai (401). Xuat CSV roi chay lai.')
    rows=doc(csv.reader(io.StringIO(txt)))
    old={}
    if os.path.exists(OUT):
        m=re.search(r'window\.PB_TO=(\{.*\});?\s*$',open(OUT,encoding='utf-8').read(),re.S)
        if m: old=json.loads(m.group(1)).get('xuong',{})
    old.setdefault(xw,{})[ym]={'src':goc,'don':'t','rows':rows}
    tong=sum(r['kl'] for r in rows)
    js='/* pb_to.js — PHAN BO DU AN THEO TO (sheet "PHAN BO DU AN THANG .. XUONG ..") -> ban_do_qc.html tab San luong PB.\n   Sinh boi cong_cu_pc/pb_to_trich.py, KHONG sua tay. Don vi tan. */\nwindow.PB_TO='+json.dumps({'built':datetime.datetime.now().strftime('%Y-%m-%d %H:%M'),'xuong':old},ensure_ascii=False,separators=(',',':'))+';\n'
    open(OUT,'w',encoding='utf-8').write(js)
    print('OK %s %s: %d du an, %.0f t -> %s'%(xw,ym,len(rows),tong,os.path.normpath(OUT)))
if __name__=='__main__': main()
