# -*- coding: utf-8 -*-
"""md_to_trich.py — trich SAN LUONG TO tu sheet MASTERDATA (file goc PKHSX) -> md_to.js (06/11/2026)
Nguon: https://docs.google.com/spreadsheets/d/1G6Kno1cLo8psJMvmf0jmmxdh_c8QspvFOfR_SBuJr2o  tab "MASTERDATA 1" (gid 944713689)
Chay: python md_to_trich.py [duong_dan_csv]   (khong co tham so -> tai gviz CSV ~50MB)
Ra:   md_to.js  = window.MD_TO={built, rows:[ [thang, xuong, to_goc, ma_spm, stage, W_tan, QCW_tan, n] ...]}
Quy uoc (user 06/11): SX = Weight, NT = QC Weight; AH6-DAI 1/2 gop vao AH6; bo AH.VP (Packing/Delivery); kg -> tan.
"""
import csv,sys,re,json,io,collections,datetime,urllib.request
ID='1G6Kno1cLo8psJMvmf0jmmxdh_c8QspvFOfR_SBuJr2o';GID='944713689'
def num(s):
  try:return float(str(s).replace(',',''))
  except:return 0.0
def maTo(sub,xw):
  u=sub.strip().upper()
  m=re.search(r'RÁP HOÀN THIỆN\s*(\d+)',u)
  if m:return f'TO{m.group(1)}RH'
  m=re.search(r'RÁP THÔ\s*(\d+)',u)
  if m:return f'TO{m.group(1)}RT'
  if 'HÀN HOÀN THIỆN' in u:return 'HH'
  if 'HÀN THÔ' in u:return 'HT'
  m=re.search(r'TỔ HÀN\s*(\d+)',u)
  if m:return f'TO{m.group(1)}HA'
  if 'GCN' in u:return 'TO1GCN'
  if 'THÀNH PHẨM' in u:return 'TO1TP'
  if 'NẮN' in u or 'MÀI' in u:return 'TO1NM'
  return ''
def xuong(w):
  w=w.strip()
  if w.startswith('AH6'):return 'AH6'
  if w.startswith('AH.VP'):return ''
  return w
def main():
  if len(sys.argv)>1: txt=open(sys.argv[1],encoding='utf-8',errors='replace').read()
  else:
    url=f'https://docs.google.com/spreadsheets/d/{ID}/gviz/tq?tqx=out:csv&gid={GID}'
    txt=urllib.request.urlopen(url,timeout=180).read().decode('utf-8','replace')
  R=list(csv.reader(io.StringIO(txt)))
  rows=[r for r in R if len(r)>16 and re.match(r'^20\d\d-\d\d-\d\d',r[1] or '')]
  agg=collections.defaultdict(lambda:[0.0,0.0,0])
  for r in rows:
    xw=xuong(r[3]);
    if not xw:continue
    k=(r[1][:7],xw,r[6].strip() or xw,maTo(r[6],xw),r[7].strip())
    a=agg[k];a[0]+=num(r[12])/1000;a[1]+=num(r[13])/1000;a[2]+=1
  out=[[k[0],k[1],k[2],k[3],k[4],round(v[0],2),round(v[1],2),v[2]] for k,v in sorted(agg.items())]
  js='window.MD_TO='+json.dumps({'built':datetime.date.today().strftime('%d/%m/%Y'),'src':'MASTERDATA 1 (PKHSX)','cols':['thang','xuong','to','maSPM','stage','sxT','qcT','n'],'rows':out},ensure_ascii=False,separators=(',',':'))+';\n'
  open('md_to.js','w',encoding='utf-8').write(js)
  print('md_to.js:',len(out),'dong,',len(js)//1024,'KB; thang',out[0][0],'->',out[-1][0])
if __name__=='__main__':main()
