#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Xuat du lieu QC An Ha thanh VAULT OBSIDIAN (theo skill .claude/skills/obsidian/*).

Cach dung (tren PC, trong thu muc repo):
  node cong_cu_pc/obsidian_dump.js  >  (sinh data.json)        -- hoac dung file data.json san co
  python cong_cu_pc/obsidian_xuat.py data.json khsx.csv thu_muc_vault [YYYY-MM]

  data.json : {D:QCDATA, PB:{KHU,NGUOI,TEAMS,PHU_TRACH}, PBTO:PB_TO, MD:MD_TO}  (xem obsidian_dump.js)
  khsx.csv  : sheet KHSX tai qua gviz (headers=2)
  YYYY-MM   : thang chot (21 thang truoc -> 20 thang nay); mac dinh = thang cua ngay SPM moi nhat

Ket qua (vault):
  QC An Hạ.md            trang chu: nhung cac bang .base, so do nguon du lieu (mermaid)
  Dự án/<mã>.md          1 ghi chu / du an: properties (xuong, KHSX con rap/han, SX, NT, cho NT, PB to) + wikilink
  Xưởng/AHx.md           1 ghi chu / xuong: callout tong hop, danh sach to & QC, link canvas
  Tổ/AHx TOnRH.md        1 ghi chu / to: SX thang, PB to, % hoan thanh, du an
  QC/<Tên>.md            1 ghi chu / QC: NT thang, Final DIM, du an, xuong
  Bases/*.base           bang Obsidian Bases (loc theo tag, formula %, summary)
  Sơ đồ/AHx.canvas       JSON Canvas: line -> to (kich thuoc theo tan) -> QC
Quy tac so lieu = ban_do_qc.html (thang chot 21->20, Fitup = r[7], Han r[8], Son r[9], Final DIM = ghi chu ACC tren dong Han).
"""
import sys,os,re,csv,json,io,hashlib,datetime,unicodedata,collections

def num(s):
    s=str(s or '').strip().replace(',','')
    try: return float(s)
    except: return 0.0
def pad2(n): return '%02d'%n
def fm(v,d=0):
    if v is None: return '—'
    s=('{:,.%df}'%d).format(v).replace(',','#').replace('.',',').replace('#','.')
    return s
def bo_dau(s):
    s=unicodedata.normalize('NFD',s).replace('đ','d').replace('Đ','D')
    return ''.join(c for c in s if unicodedata.category(c)!='Mn')
def ten_file(s):
    return re.sub(r'[\\/:*?"<>|#^\[\]]+',' ',str(s)).strip()
def title_case(s):
    return ' '.join(w[:1].upper()+w[1:].lower() for w in str(s).split())
def bc_ten(p):  # ten du an bo ma + DGRP/DG
    return re.sub(r'^(DGRP|DG)\s+','',re.sub(r'^\S+\s+','',str(p).strip()),flags=re.I)
def bc_ma(p): return str(p).strip().split(' ')[0]
def hid(s): return hashlib.md5(s.encode('utf-8')).hexdigest()[:16]
def yq(s):  # yaml quoted string
    return json.dumps(str(s),ensure_ascii=False)

def thang_chot(d):
    y,m,dd=int(d[:4]),int(d[5:7]),int(d[8:10])
    if dd>20:
        m+=1
        if m>12: m=1;y+=1
    return y,m
def ky(y,m):
    pm,py=(m-1,y) if m>1 else (12,y-1)
    return '%d-%s-21'%(py,pad2(pm)),'%d-%s-20'%(y,pad2(m))

def main():
    if len(sys.argv)<4: print(__doc__);sys.exit(1)
    data=json.load(open(sys.argv[1],encoding='utf-8'));khsx_path=sys.argv[2];OUT=sys.argv[3]
    D=data['D'];PB=data['PB'];PBTO=(data.get('PBTO') or {}).get('xuong',{});
    rows=D['rows'];X=D['X'];T=D['T'];P=D['P'];Q=D['Q'];PL=D['PL']
    maxd=max((r[4] or '') for r in rows)
    if len(sys.argv)>4: y,m=int(sys.argv[4][:4]),int(sys.argv[4][5:7])
    else: y,m=thang_chot(maxd)
    ym='%d-%s'%(y,pad2(m));tu,den=ky(y,m);Tm='T%d'%m
    iOK=PL.index('Đã QC (AH)');iCho=PL.index('Chưa QC');iMien=PL.index('Miễn QC')
    # ---- ten QC theo ma SPM
    spm2ten={};ten2team={};ten2khu=collections.defaultdict(set)
    for t in PB.get('TEAMS') or [{'id':'kt','ngan':'Kích thước','NGUOI':PB['NGUOI']}]:
        for n in (t.get('NGUOI') or PB['NGUOI']):
            ten=title_case(n['ten'])
            if n.get('spm'): spm2ten[n['spm'].lower()]=ten
            ten2team.setdefault(ten,t.get('ngan') or t.get('ten'))
            if n.get('khu'): ten2khu[ten].add(n['khu'])
    FD_AL={'kienv':'kiennv','kien':'kiennv','cuongkt':'cuongtk','vutpt':'vupt','vuppt':'vupt','truongbv':'truongba','hieunnv':'hieunv','hienv':'hieunv'}
    def qc_ten(i):
        c=Q[i] if 0<=i<len(Q) else ''
        return spm2ten.get(str(c).lower(),title_case(c) if ' ' in str(c) else str(c))
    def fd_name(r):
        if not (r[8]>0 and r[13] and re.search('acc',str(r[13]),re.I)): return ''
        nm=re.sub(r'\s+',' ',re.sub(r'\bacc\b',' ',str(r[13]).lower().replace(':',' ').replace('：',' '))).strip()
        nm=FD_AL.get(nm,nm)
        return nm if re.match(r'^[a-z][a-z0-9._]{1,14}$',nm) else ''
    # ---- tong hop SPM
    PJ=collections.defaultdict(lambda:{'ten':'','x':collections.defaultdict(lambda:{'f':0,'w':0,'p':0,'n':0,'nt':0,'cho':0,'to':set(),'qc':collections.Counter()})})
    TO=collections.defaultdict(lambda:{'f':0,'w':0,'p':0,'n':0,'cho':0,'pj':collections.Counter(),'qc':collections.Counter()})
    QC=collections.defaultdict(lambda:{'nt':0,'fd':0,'n':0,'pj':collections.Counter(),'x':collections.Counter(),'to':collections.Counter()})
    for r in rows:
        ma=bc_ma(P[r[0]]);x=X[r[1]];tk=x+' '+T[r[2]];pj=PJ[ma];pj['ten']=pj['ten'] or bc_ten(P[r[0]]);px=pj['x'][x]
        f,w,p=float(r[7] or 0),float(r[8] or 0),float(r[9] or 0);n=(r[10] or 0)+(r[11] or 0)+(r[12] or 0)
        if r[6]==iCho: px['cho']+=f+w+p;TO[tk]['cho']+=f+w+p
        if r[6]==iMien: continue
        wd=r[4] or ''
        if tu<=wd<=den:
            px['f']+=f;px['w']+=w;px['p']+=p;px['n']+=n;px['to'].add(tk)
            TO[tk]['f']+=f;TO[tk]['w']+=w;TO[tk]['p']+=p;TO[tk]['n']+=n;TO[tk]['pj'][ma]+=f+w+p
        qd=r[3] or ''
        if r[6]==iOK and tu<=qd<=den:
            nm=qc_ten(r[5]);v=f+w+p;px['nt']+=v;px['qc'][nm]+=v;TO[tk]['qc'][nm]+=v
            QC[nm]['nt']+=v;QC[nm]['n']+=n;QC[nm]['pj'][ma]+=v;QC[nm]['x'][x]+=v;QC[nm]['to'][tk]+=v
            fdn=fd_name(r)
            if fdn:
                fn=spm2ten.get(fdn,fdn);QC[fn]['fd']+=w;QC[fn]['pj'][ma]+=0;QC[fn]['x'][x]+=0
    # ---- KHSX
    KH=collections.defaultdict(lambda:{'ten':'','kl':0,'r':0,'h':0,'sl':0,'slr':0})
    K=list(csv.reader(open(khsx_path,encoding='utf-8-sig')))
    hdr=[re.sub(r'^-?[\d,\.]+\s*','',h).strip().lower() for h in K[0]]
    def ci(n):
        c=[i for i,h in enumerate(hdr) if h.startswith(n.lower())];return c[0] if c else -1
    iKL,iR,iH,iSL,iSLR=ci('tổng khối lượng'),ci('tkl ráp hoàn thiện còn lại'),ci('tkl hàn hoàn thiện còn lại'),ci('tổng số lượng'),ci('tsl ráp hoàn thiện còn lại')
    for r in K[1:]:
        if len(r)<=max(iKL,iR,iH): continue
        ma=bc_ma(r[0]);x=r[3].strip().upper()
        if not ma or not x: continue
        z=KH[(ma,x)];z['ten']=z['ten'] or bc_ten(r[0])
        z['kl']+=num(r[iKL])/1000;z['r']+=num(r[iR])/1000;z['h']+=num(r[iH])/1000;z['sl']+=num(r[iSL]);z['slr']+=num(r[iSLR])
    # ---- PB to (sheet)
    PBT={}  # (x,to)->{kl,ds}
    PBP=collections.defaultdict(lambda:collections.defaultdict(float))  # (ma)->{to:kl}
    for x,months in PBTO.items():
        z=months.get(ym)
        if not z: continue
        for r in z['rows']:
            for t in r.get('to') or []:
                if not t.get('to'): continue
                k=x+' '+t['to'];PBT.setdefault(k,{'kl':0,'ds':[]});PBT[k]['kl']+=t.get('kl') or 0;PBT[k]['ds'].append((r['ma'],bc_ten(r['ten']),t.get('kl') or 0,t.get('ghi','')))
                PBP[r['ma']][k]+=t.get('kl') or 0
    xs=sorted(set([x for (_,x) in KH if re.match(r'^AH\d$',x)]+[x for x in X if re.match(r'^AH\d$',x)]),key=lambda s:(len(s),s))
    # ====== ghi file
    def W(path,txt):
        p=os.path.join(OUT,path);os.makedirs(os.path.dirname(p),exist_ok=True);open(p,'w',encoding='utf-8').write(txt)
    for d in ['Dự án','Xưởng','Tổ','QC','Bases','Sơ đồ']: os.makedirs(os.path.join(OUT,d),exist_ok=True)
    def wl(folder,name,alias=None):
        n=ten_file(name);return '[[%s/%s%s]]'%(folder,n,('|'+alias) if alias else '')
    def wlt(folder,name,alias=None):  # trong bang: escape |
        n=ten_file(name);return '[[%s/%s%s]]'%(folder,n,('\\|'+alias) if alias else '')
    # ---- Du an
    all_ma=set(PJ)|set(ma for (ma,_) in KH)|set(PBP)
    n_pj=0
    for ma in sorted(all_ma):
        pj=PJ.get(ma);khx={x:z for (m2,x),z in KH.items() if m2==ma}
        ten=(pj and pj['ten']) or (next(iter(khx.values()))['ten'] if khx else ma)
        xw=sorted(set(list(khx)+list(pj['x'] if pj else [])))
        sx=sum(v['f']+v['w']+v['p'] for v in (pj['x'].values() if pj else []));sxf=sum(v['f'] for v in (pj['x'].values() if pj else []));sxw=sum(v['w'] for v in (pj['x'].values() if pj else []));sxp=sum(v['p'] for v in (pj['x'].values() if pj else []))
        nt=sum(v['nt'] for v in (pj['x'].values() if pj else []));cho=sum(v['cho'] for v in (pj['x'].values() if pj else []))
        kl=sum(z['kl'] for z in khx.values());cr=sum(z['r'] for z in khx.values());ch=sum(z['h'] for z in khx.values())
        pbt=sum(PBP[ma].values()) if ma in PBP else 0
        if sx<0.05 and nt<0.05 and cho<0.05 and cr+ch<0.5 and pbt<0.05: continue  # du an da xong, khong con gi
        n_pj+=1
        tt='dang-chay' if (sx>0.05 or cr+ch>0.5) else ('cho-nt' if cho>0.05 else 'xong')
        fmx='\n'.join(['---','ma: '+yq(ma),'ten: '+yq(ten),'aliases:','  - '+yq(ten),'tags:','  - du-an','  - '+tt]+
            ['xuong:']+['  - '+yq('[[Xưởng/%s]]'%x) for x in xw]+
            ['khsx_tong_t: %.1f'%kl,'con_rap_t: %.1f'%cr,'con_han_t: %.1f'%ch,'sx_thang_t: %.1f'%sx,'sx_rap_t: %.1f'%sxf,'sx_han_t: %.1f'%sxw,'sx_son_t: %.1f'%sxp,'nt_thang_t: %.1f'%nt,'cho_nt_t: %.1f'%cho,'pb_to_t: %.1f'%pbt,'thang: '+yq(ym),'---'])
        b=[fmx,'# %s %s'%(ma,ten),'']
        if cr+ch>0.5: b.append('> [!info] KHSX còn lại\n> Còn ráp **%s t** · còn hàn **%s t** trên tổng **%s t** (%s cấu kiện).'%(fm(cr),fm(ch),fm(kl),fm(sum(z['sl'] for z in khx.values()))))
        if cho>0.05: b.append('\n> [!warning] Chờ QC nghiệm thu\n> **%s t** đang chờ nghiệm thu.'%fm(cho,1))
        b.append('\n## Theo xưởng — tháng %d/%d (%s → %s)\n'%(m,y,tu[8:]+'/'+tu[5:7],den[8:]+'/'+den[5:7]))
        b.append('| Xưởng | KHSX còn ráp | còn hàn | SX ráp | SX hàn | SX sơn | NT tháng | Chờ NT | Tổ | QC |\n|---|---:|---:|---:|---:|---:|---:|---:|---|---|')
        for x in xw:
            z=khx.get(x,{'r':0,'h':0});v=pj['x'][x] if pj and x in pj['x'] else {'f':0,'w':0,'p':0,'nt':0,'cho':0,'to':set(),'qc':collections.Counter()}
            tos=', '.join(wlt('Tổ',t,t.split(' ',1)[1]) for t in sorted(v['to']));qcs=', '.join(wlt('QC',q,q.split(' ')[-1]) for q,_ in v['qc'].most_common(3))
            b.append('| %s | %s | %s | %s | %s | %s | %s | %s | %s | %s |'%(wlt('Xưởng',x),fm(z['r']),fm(z['h']),fm(v['f'],1),fm(v['w'],1),fm(v['p'],1),fm(v['nt'],1),fm(v['cho'],1),tos or '—',qcs or '—'))
        if ma in PBP:
            b.append('\n## Phân bổ tổ tháng %d (sheet PB xưởng)\n'%m)
            for k,v in sorted(PBP[ma].items(),key=lambda a:-a[1]): b.append('- %s: **%s t**'%(wl('Tổ',k,k),fm(v)))
        W('Dự án/%s.md'%ten_file(ma),'\n'.join(b)+'\n')
    # ---- To
    for tk,v in sorted(TO.items()):
        x,to=tk.split(' ',1)
        if not re.match(r'^AH\d$',x): continue
        sx=v['f']+v['w']+v['p']
        pb=PBT.get(tk);pbk=pb['kl'] if pb else 0
        if sx<0.05 and v['cho']<0.05 and not pb: continue
        khau='Hàn' if v['w']>v['f'] and v['w']>v['p'] else ('Sơn' if v['p']>v['f'] else 'Ráp')
        pct=('%.0f'%(100*sx/pbk)) if pbk>0 else ''
        fmx='\n'.join(['---','to: '+yq(to),'xuong: '+yq('[[Xưởng/%s]]'%x),'khau: '+yq(khau),'tags:','  - to','  - '+bo_dau(khau).lower(),'sx_thang_t: %.1f'%sx,'cau_kien: %d'%v['n'],'cho_nt_t: %.1f'%v['cho'],'pb_to_t: %.1f'%pbk]+(['hoan_thanh_pct: '+pct] if pct else [])+['thang: '+yq(ym),'---'])
        b=[fmx,'# %s — %s'%(tk,khau),'']
        b.append('> [!abstract] Tháng %d/%d\n> SX **%s t** · %d cấu kiện · chờ NT **%s t**%s'%(m,y,fm(sx,1),v['n'],fm(v['cho'],1),(' · PB tổ **%s t** → đã làm **%s%%**'%(fm(pbk),pct)) if pbk>0 else ''))
        b.append('\n## Dự án tổ làm tháng %d\n'%m)
        for ma,t in v['pj'].most_common():
            if t<0.05: continue
            b.append('- %s — **%s t**%s'%(wl('Dự án',ma,ma+' '+PJ[ma]['ten']),fm(t,1),(' (PB tổ %s t)'%fm(PBP[ma][tk]) if ma in PBP and tk in PBP[ma] else '')))
        if pb:
            b.append('\n## Phân bổ tháng %d (sheet PB %s)\n'%(m,x))
            for ma,ten,kl,ghi in sorted(pb['ds'],key=lambda a:-a[2]): b.append('- %s — **%s**'%(wl('Dự án',ma,ma+' '+ten),ghi or fm(kl)+' t'))
        if v['qc']: b.append('\n## QC nghiệm thu\n');b+=['- %s — %s t'%(wl('QC',q),fm(t,1)) for q,t in v['qc'].most_common()]
        W('Tổ/%s.md'%ten_file(tk),'\n'.join(b)+'\n')
    # ---- QC
    for nm,v in sorted(QC.items()):
        if v['nt']<0.5 and v['fd']<0.5: continue
        xw=[x for x,_ in v['x'].most_common()]
        fmx='\n'.join(['---','ten: '+yq(nm),'team: '+yq(ten2team.get(nm,'—')),'tags:','  - qc','xuong:']+['  - '+yq('[[Xưởng/%s]]'%x) for x in xw if re.match(r'^AH\d',x)]+
            ['nt_thang_t: %.1f'%v['nt'],'final_dim_t: %.1f'%v['fd'],'cau_kien: %d'%v['n'],'so_du_an: %d'%len([1 for _,t in v['pj'].items()]),'thang: '+yq(ym),'---'])
        b=[fmx,'# '+nm,'','> [!success] Nghiệm thu tháng %d/%d\n> **%s t** · %d cấu kiện · Final DIM **%s t** · %d dự án'%(m,y,fm(v['nt'],1),v['n'],fm(v['fd'],1),len(v['pj']))]
        b.append('\n## Dự án\n');b+=['- %s — %s t'%(wl('Dự án',ma,ma+' '+PJ[ma]['ten']),fm(t,1)) for ma,t in v['pj'].most_common()]
        if v['to']: b.append('\n## Tổ\n');b+=['- %s — %s t'%(wl('Tổ',tk,tk),fm(t,1)) for tk,t in v['to'].most_common()]
        W('QC/%s.md'%ten_file(nm),'\n'.join(b)+'\n')
    # ---- Xuong + canvas
    KHU={k['id']:k for k in PB['KHU']}
    for x in xs:
        tos=[(tk,v) for tk,v in TO.items() if tk.startswith(x+' ') and (v['f']+v['w']+v['p']>0.05 or tk in PBT)]
        tos.sort(key=lambda a:-(a[1]['f']+a[1]['w']+a[1]['p']))
        qcs=collections.Counter()
        for tk,v in tos:
            for q,t in v['qc'].items(): qcs[q]+=t
        cr=sum(z['r'] for (ma,xx),z in KH.items() if xx==x);ch=sum(z['h'] for (ma,xx),z in KH.items() if xx==x)
        sx=sum(v['f']+v['w']+v['p'] for _,v in tos);nt=sum(v['nt'] for pj in PJ.values() for xx,v in pj['x'].items() if xx==x)
        cho=sum(v['cho'] for pj in PJ.values() for xx,v in pj['x'].items() if xx==x)
        pbs=sum(PBT[tk]['kl'] for tk in PBT if tk.startswith(x+' '))
        k=KHU.get(x,{});line=int(k.get('line') or 1)
        fmx='\n'.join(['---','xuong: '+yq(x),'ten: '+yq(k.get('ten',x)),'tags:','  - xuong','so_line: %d'%line,'con_rap_t: %.1f'%cr,'con_han_t: %.1f'%ch,'sx_thang_t: %.1f'%sx,'nt_thang_t: %.1f'%nt,'cho_nt_t: %.1f'%cho,'pb_to_t: %.1f'%pbs,'thang: '+yq(ym),'---'])
        b=[fmx,'# '+k.get('ten',x),'','> [!info] Tháng %d/%d\n> KHSX còn ráp **%s t** · còn hàn **%s t** · SX **%s t** · NT **%s t** · chờ NT **%s t**%s'%(m,y,fm(cr),fm(ch),fm(sx),fm(nt),fm(cho),(' · PB tổ **%s t**'%fm(pbs)) if pbs else '')]
        b.append('\nSơ đồ: [[Sơ đồ/%s.canvas|%s.canvas]]\n'%(x,x))
        b.append('## Tổ\n\n| Tổ | SX tháng | Cấu kiện | Chờ NT | PB tổ | % |\n|---|---:|---:|---:|---:|---:|')
        for tk,v in tos:
            pbk=PBT[tk]['kl'] if tk in PBT else 0;s2=v['f']+v['w']+v['p']
            b.append('| %s | %s | %d | %s | %s | %s |'%(wlt('Tổ',tk,tk.split(' ',1)[1]),fm(s2,1),v['n'],fm(v['cho'],1),fm(pbk) if pbk else '—',('%.0f%%'%(100*s2/pbk)) if pbk else '—'))
        b.append('\n## QC nghiệm thu tháng %d\n'%m);b+=['- %s — %s t'%(wl('QC',q),fm(t,1)) for q,t in qcs.most_common()]
        b.append('\n## Dự án đang chạy\n\n![[Bases/Dự án.base#%s]]'%x)
        W('Xưởng/%s.md'%x,'\n'.join(b)+'\n')
        # canvas: line groups -> to nodes (width ~ tan) -> qc nodes
        nodes=[];edges=[];LW=1100;LH=170;y0=0
        mx=max([v['f']+v['w']+v['p'] for _,v in tos]+[1])
        for li in range(line):
            gid=hid(x+'line'+str(li));nodes.append({'id':gid,'type':'group','x':0,'y':y0,'width':LW,'height':LH,'label':'%s · Line %d'%(x,li+1)})
            xx=20
            for i,(tk,v) in enumerate(tos):
                if i%line!=li: continue
                s2=v['f']+v['w']+v['p'];w=int(120+300*(s2/mx)**0.5)
                nid=hid(tk);nodes.append({'id':nid,'type':'file','file':'Tổ/%s.md'%ten_file(tk),'x':xx,'y':y0+40,'width':w,'height':110,'color':'5' if v['w']>v['f'] else '6'})
                xx+=w+20
            y0+=LH+40
        qx=0
        for q,t in qcs.most_common(8):
            qid=hid('qc'+q);nodes.append({'id':qid,'type':'file','file':'QC/%s.md'%ten_file(q),'x':qx,'y':y0+40,'width':240,'height':90,'color':'4'});qx+=260
            for tk,v in tos:
                if v['qc'].get(q,0)>=1: edges.append({'id':hid(q+tk),'fromNode':hid(tk),'toNode':qid,'fromSide':'bottom','toSide':'top','label':'%s t'%fm(v['qc'][q])})
        nodes.append({'id':hid(x+'tit'),'type':'text','x':0,'y':-120,'width':LW,'height':90,'text':'# %s — tháng %d/%d\nSX **%s t** · NT **%s t** · KHSX còn ráp **%s t**. Màu xanh = tổ ráp, cam = tổ hàn, mũi tên = QC nghiệm thu.'%(x,m,y,fm(sx),fm(nt),fm(cr))})
        ids=[n['id'] for n in nodes];assert len(ids)==len(set(ids))
        for e in edges: assert e['fromNode'] in ids and e['toNode'] in ids
        W('Sơ đồ/%s.canvas'%x,json.dumps({'nodes':nodes,'edges':edges},ensure_ascii=False,indent=1))
    # ---- Canvas toan nha may: dat 6 xuong dung vi tri mat bang (PB.KHU x,y,w,h cua so_do_nha_may 1440x864), phong to SC lan
    SC=2.6;nodes=[];edges=[]
    nodes.append({'id':hid('nmtit'),'type':'text','x':0,'y':-170,'width':1440*SC,'height':120,'text':'# Nhà máy An Hạ — tháng %d/%d\nVị trí xưởng theo mặt bằng thật. Ô tổ to nhỏ theo tấn sản xuất tháng (xanh = ráp, cam = hàn, xanh lá = sơn). Dưới mỗi xưởng là QC nghiệm thu nhiều nhất; mũi tên = tấn đã nghiệm thu cho tổ.'%(m,y)})
    for k in PB['KHU']:
        x=k['id']
        if x not in xs or not re.match(r'^AH\d$',x): continue
        gx,gy,gw,gh=int(k['x']*SC),int(k['y']*SC),int(k['w']*SC),int(k['h']*SC)
        tos=[(tk,v) for tk,v in TO.items() if tk.startswith(x+' ') and (v['f']+v['w']+v['p']>0.05 or tk in PBT)]
        tos.sort(key=lambda a:-(a[1]['f']+a[1]['w']+a[1]['p']))
        sx=sum(v['f']+v['w']+v['p'] for _,v in tos);nt=sum(v['nt'] for pj in PJ.values() for xx,v in pj['x'].items() if xx==x)
        cr=sum(z['r'] for (ma,xx),z in KH.items() if xx==x)
        qcs=collections.Counter()
        for tk,v in tos:
            for q,t in v['qc'].items(): qcs[q]+=t
        nodes.append({'id':hid('g'+x),'type':'group','x':gx,'y':gy,'width':gw,'height':gh,'label':'%s · SX %s t · NT %s t · KHSX còn ráp %s t'%(x,fm(sx),fm(nt),fm(cr)),'color':'1' if cr>500 else ('2' if cr>100 else '4')})
        nodes.append({'id':hid('f'+x),'type':'file','file':'Xưởng/%s.md'%x,'x':gx+12,'y':gy+36,'width':min(gw-24,260),'height':70})
        # o to: xep theo hang, rong theo can bac 2 tan, cao 64
        mx=max([v['f']+v['w']+v['p'] for _,v in tos]+[1]);cx,cy=gx+12,gy+36+70+14;rowh=64
        n_to=0
        for tk,v in tos:
            if cy+rowh>gy+gh-10: break
            s2=v['f']+v['w']+v['p'];w=int(90+140*(s2/mx)**0.5)
            if cx+w>gx+gw-12: cx=gx+12;cy+=rowh+10
            if cy+rowh>gy+gh-10: break
            col='5' if v['w']>v['f'] and v['w']>v['p'] else ('4' if v['p']>v['f'] else '6')
            nodes.append({'id':hid('nm'+tk),'type':'file','file':'Tổ/%s.md'%ten_file(tk),'x':cx,'y':cy,'width':w,'height':rowh,'color':col});n_to+=1;cx+=w+10
        # QC duoi xuong
        qx=gx
        for q,t in qcs.most_common(max(1,min(4,gw//230))):
            qid=hid('nmqc'+x+q);nodes.append({'id':qid,'type':'file','file':'QC/%s.md'%ten_file(q),'x':qx,'y':gy+gh+24,'width':220,'height':64,'color':'4'});qx+=230
            best=[(tk,v['qc'][q]) for tk,v in tos if v['qc'].get(q,0)>=1][:3]
            for tk,t2 in best:
                if any(n['id']==hid('nm'+tk) for n in nodes): edges.append({'id':hid('e'+x+q+tk),'fromNode':hid('nm'+tk),'toNode':qid,'fromSide':'bottom','toSide':'top','label':'%s t'%fm(t2)})
    ids=[n['id'] for n in nodes];assert len(ids)==len(set(ids))
    for e in edges: assert e['fromNode'] in ids and e['toNode'] in ids
    W('Sơ đồ/Nhà máy An Hạ.canvas',json.dumps({'nodes':nodes,'edges':edges},ensure_ascii=False,indent=1))
    # ---- Bases
    W('Bases/Dự án.base','''filters:
  and:
    - file.hasTag("du-an")
formulas:
  con_lai: 'con_rap_t + con_han_t'
  tien_do: 'if(khsx_tong_t > 0, ((khsx_tong_t - con_rap_t) / khsx_tong_t * 100).round(0) + "%", "")'
properties:
  note.ma:
    displayName: Mã
  note.ten:
    displayName: Dự án
  note.xuong:
    displayName: Xưởng
  note.con_rap_t:
    displayName: Còn ráp (t)
  note.con_han_t:
    displayName: Còn hàn (t)
  note.sx_thang_t:
    displayName: SX tháng (t)
  note.sx_rap_t:
    displayName: SX ráp (t)
  note.sx_han_t:
    displayName: SX hàn (t)
  note.nt_thang_t:
    displayName: NT tháng (t)
  note.cho_nt_t:
    displayName: Chờ NT (t)
  note.pb_to_t:
    displayName: PB tổ (t)
  formula.tien_do:
    displayName: Ráp xong
views:
  - type: table
    name: Đang chạy
    filters:
      and:
        - file.hasTag("dang-chay")
    sort:
      - property: con_rap_t
        direction: DESC
    order:
      - file.name
      - ten
      - xuong
      - con_rap_t
      - con_han_t
      - sx_thang_t
      - nt_thang_t
      - cho_nt_t
      - pb_to_t
      - formula.tien_do
    summaries:
      con_rap_t: Sum
      con_han_t: Sum
      sx_thang_t: Sum
      nt_thang_t: Sum
      cho_nt_t: Sum
  - type: table
    name: Chờ nghiệm thu
    filters:
      and:
        - 'cho_nt_t > 0.5'
    sort:
      - property: cho_nt_t
        direction: DESC
    order:
      - file.name
      - ten
      - xuong
      - cho_nt_t
      - nt_thang_t
    summaries:
      cho_nt_t: Sum
'''+''.join('''  - type: table
    name: %s
    filters:
      and:
        - 'xuong.contains(link("Xưởng/%s"))'
    sort:
      - property: con_rap_t
        direction: DESC
    order:
      - file.name
      - ten
      - con_rap_t
      - con_han_t
      - sx_thang_t
      - nt_thang_t
      - cho_nt_t
      - pb_to_t
    summaries:
      con_rap_t: Sum
      sx_thang_t: Sum
      nt_thang_t: Sum
'''%(x,x) for x in xs))
    W('Bases/Tổ.base','''filters:
  and:
    - file.hasTag("to")
formulas:
  hoan_thanh: 'if(pb_to_t > 0, (sx_thang_t / pb_to_t * 100).round(0) + "%", "")'
properties:
  note.to:
    displayName: Tổ
  note.xuong:
    displayName: Xưởng
  note.khau:
    displayName: Khâu
  note.sx_thang_t:
    displayName: SX tháng (t)
  note.cau_kien:
    displayName: Cấu kiện
  note.cho_nt_t:
    displayName: Chờ NT (t)
  note.pb_to_t:
    displayName: PB tổ (t)
  formula.hoan_thanh:
    displayName: Đã làm / PB
views:
  - type: table
    name: Theo xưởng
    groupBy:
      property: xuong
      direction: ASC
    sort:
      - property: sx_thang_t
        direction: DESC
    order:
      - file.name
      - khau
      - sx_thang_t
      - cau_kien
      - cho_nt_t
      - pb_to_t
      - formula.hoan_thanh
    summaries:
      sx_thang_t: Sum
      cau_kien: Sum
      cho_nt_t: Sum
      pb_to_t: Sum
  - type: cards
    name: Thẻ tổ
    sort:
      - property: sx_thang_t
        direction: DESC
    order:
      - file.name
      - sx_thang_t
      - pb_to_t
      - formula.hoan_thanh
''')
    W('Bases/QC.base','''filters:
  and:
    - file.hasTag("qc")
properties:
  note.ten:
    displayName: QC
  note.team:
    displayName: Team
  note.xuong:
    displayName: Xưởng
  note.nt_thang_t:
    displayName: NT tháng (t)
  note.final_dim_t:
    displayName: Final DIM (t)
  note.cau_kien:
    displayName: Cấu kiện
  note.so_du_an:
    displayName: Dự án
views:
  - type: table
    name: Theo team
    groupBy:
      property: team
      direction: ASC
    sort:
      - property: nt_thang_t
        direction: DESC
    order:
      - file.name
      - xuong
      - nt_thang_t
      - final_dim_t
      - cau_kien
      - so_du_an
    summaries:
      nt_thang_t: Sum
      final_dim_t: Sum
      cau_kien: Sum
''')
    # ---- Trang chu
    home='''---
title: QC An Hạ
tags:
  - home
thang: %s
spm: %s
---
# QC An Hạ — tháng %d/%d

> [!info] Nguồn số liệu
> SPM `%s` · KHSX đọc %s · PB tổ: sheet phân bổ xưởng (%s). Kỳ chốt %s → %s.
> Vault này do `cong_cu_pc/obsidian_xuat.py` sinh ra — **đừng sửa tay số liệu**, chạy lại script để cập nhật.

## Xưởng

Sơ đồ toàn nhà máy: [[Sơ đồ/Nhà máy An Hạ.canvas|Nhà máy An Hạ.canvas]]

%s

## Dự án đang chạy

![[Bases/Dự án.base#Đang chạy]]

## Tổ — SX tháng so với phân bổ

![[Bases/Tổ.base#Theo xưởng]]

## QC nghiệm thu

![[Bases/QC.base#Theo team]]

## Dòng dữ liệu

```mermaid
graph LR
  SPM[SPM.xlsx] --> QD[qcdata.js]
  KHSX[Sheet KHSX] --> BD[ban_do_qc.html]
  PBS[Sheet PB tổ xưởng] --> PBT[pb_to.js]
  MD[MASTERDATA PKHSX] --> MDT[md_to.js]
  QD --> BD
  PBT --> BD
  MDT --> BD
  QD --> V[Vault Obsidian]
  KHSX --> V
  PBT --> V
```
'''%(ym,D.get('updated',''),m,y,D.get('updated',''),datetime.date.today().strftime('%d/%m/%Y'),', '.join(sorted(PBTO)) or 'chưa có',tu[8:]+'/'+tu[5:7],den[8:]+'/'+den[5:7],
        '\n'.join('- [[Xưởng/%s|%s]] — [[Sơ đồ/%s.canvas|sơ đồ]]'%(x,KHU.get(x,{}).get('ten',x),x) for x in xs))
    W('QC An Hạ.md',home)
    os.makedirs(os.path.join(OUT,'.obsidian'),exist_ok=True)
    W('.obsidian/app.json','{}');W('.obsidian/core-plugins.json',json.dumps(['file-explorer','global-search','graph','backlink','canvas','outgoing-link','tag-pane','properties','page-preview','bases','outline','word-count','file-recovery']))
    print('OK vault %s: %d dự án, %d tổ, %d QC, %d xưởng — tháng %s'%(OUT,n_pj,len([1 for f in os.listdir(os.path.join(OUT,'Tổ'))]),len(os.listdir(os.path.join(OUT,'QC'))),len(xs),ym))
if __name__=='__main__': main()
