/* ================================================================
   DDC_CORE — bo doc BANG GOC cua file du an (layout A/B/C/D)
   TACH NGUYEN VAN tu doc.html (dong 123-414, ban 20/09/2026).
   KHONG sua mot ky tu logic nao.
   Dung boi: app.html (Cong tra cuu).
   LUU Y: doc.html va qc.html VAN giu ban noi tuyen rieng cua chung
   - gop lai lam mot la viec RIENG, phai hoi truoc (tranh hoi quy).
   ================================================================ */
(function(root){
'use strict';

function norm(s){return String(s==null?'':s).replace(/\s+/g,' ').trim().toLowerCase();}
function isReal(v){
  if(v==null)return false; var s=String(v).trim();
  if(!s)return false;
  var u=s.toUpperCase().replace(/\s+/g,' ');
  if(u==='NOT APPLICABLE'||u==='N/A'||u==='NA'||u==='-'||u==='#N/A'||u==='FALSE'||u==='0'&&false)return false;
  var l=norm(s);
  if(l.indexOf('k mời')===0||l.indexOf('không mời')===0||l.indexOf('k moi')===0)return false;
  return true;
}
var MON={jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12};
function parseDate1(s,dmy){
  if(s==null)return null; s=String(s).trim(); if(!s)return null;
  var d=null,m=s.match(/^(\d{1,2})[\/\-]([A-Za-z]{3,})[\/\-,\s]*(\d{4})/);
  if(m){var mo=MON[m[2].slice(0,3).toLowerCase()];if(mo)d=new Date(+m[3],mo-1,+m[1]);}
  if(!d){m=s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
    if(m){var a=+m[1],b=+m[2],y=+m[3];
      if(a>12&&b<=12)d=new Date(y,b-1,a);
      else if(b>12&&a<=12)d=new Date(y,a-1,b);
      else d=dmy===false?new Date(y,a-1,b):new Date(y,b-1,a);}}
  if(!d){m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);if(m)d=new Date(+m[1],+m[2]-1,+m[3]);}
  if(d&&d.getFullYear()<1990)return null; /* 30/12/1899 = ô rỗng kiểu Excel */
  return d;
}
function lastDate(s,dmy){
  if(s==null)return null; var parts=String(s).split(/[,;\n]+/),best=null;
  for(var i=0;i<parts.length;i++){var d=parseDate1(parts[i],dmy);if(d&&(!best||d>best))best=d;}
  return best;
}
function lastTok(s){
  if(s==null)return ''; var p=String(s).split(/[,;\n]+/).map(function(x){return x.trim();}).filter(Boolean);
  return p.length?p[p.length-1]:'';
}
function allTok(s){if(s==null)return[];return String(s).split(/[,;\n]+/).map(function(x){return x.trim();}).filter(function(x){return x&&isReal(x);});}
function numOr(v,d){var s=String(v==null?'':v).trim();
  if(s.indexOf(',')>=0){s=s.replace(/\./g,'').replace(/,/g,'.');}
  var n=parseFloat(s);return isNaN(n)?d:n;}
function ym(d){return d?d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2):null;}
function dstr(d){return d?('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear():'';}

function findHdr(rows,labels,maxRow){
  maxRow=Math.min(maxRow||8,rows.length);
  for(var r=0;r<maxRow;r++){var row=rows[r]||[];
    for(var c=0;c<row.length;c++){var v=norm(row[c]);if(!v)continue;
      for(var k=0;k<labels.length;k++){if(v.indexOf(labels[k])>=0)return {r:r,c:c};}
    }}
  return null;
}
function findExact(rows,label,maxRow,minC){
  maxRow=Math.min(maxRow||8,rows.length);minC=minC||0;
  for(var r=0;r<maxRow;r++){var row=rows[r]||[];
    for(var c=minC;c<row.length;c++){if(norm(row[c])===label)return c;}}
  return -1;
}

function detectLayout(rows){
  if(findHdr(rows,['rev spm'])&&findHdr(rows,['fir report no']))return 'A';
  if(findHdr(rows,['rfi no-fur']))return 'B';
  if(findHdr(rows,['report no. fir-vir','report no fir-vir']))return 'C';
  if(findHdr(rows,['bbnt ck trước khi sử dụng','bbnt ck truoc khi su dung']))return 'D';
  if(findHdr(rows,['member punch no']))return findHdr(rows,['date-dir+vir'])?'B':'A';
  return null;
}

function buildMap(rows,layout){
  function ix(lbls){var h=findHdr(rows,lbls);return h?h.c:-1;}
  var M={pn:-1,dwg:-1,ms:-1,ph:-1,grp1:-1,grp2:-1,w:-1,qty:-1,planD:-1,rev:-1,weld:-1,
    ws:-1,wsCut:-1,moiLai:-1,fitRfi:-1,fitD:-1,fitRev:-1,fitQc:-1,fitRep:-1,fitQA:-1,
    finRfi:-1,finD:-1,finRev:-1,finQc:-1,dir:-1,vir:-1,kiDDC:-1,kiKH:-1,bgHs:-1,
    rqNdt:-1,mt:-1,ut:-1,finChk:-1,zone:-1,code:null};
  if(layout==='A'){
    M.pn=ix(['member punch no']);M.dwg=ix(['tên bản vẽ']);M.ms=ix(['note5']);
    M.grp1=ix(['note6']);M.grp2=ix(['item']);
    M.w=ix(['weight [kg]']);M.qty=ix(['số lượng']);
    M.planD=ix(['after cutting plan date']);M.rev=ix(['rev spm']);
    M.ws=ix(['after cutting plan workshop']);M.weld=ix(['có hàn/không hàn']);
    M.moiLai=ix(['ghi chú tình trạng mời lại']);
    M.finRfi=ix(['rfi no']);M.finD=M.finRfi>=0?M.finRfi+1:-1;
    M.finRev=ix(['rev nthu']);M.finQc=ix(['checked qc']);
    M.fitRep=ix(['fir report no']);M.fitD=ix(['date fit']);
    M.dir=ix(['dir report no']);M.vir=ix(['vir report no']);
    M.kiDDC=ix(['trình kí ddc','trình ký ddc']);M.kiKH=ix(['trình kí khách hàng','trình ký khách hàng']);
    M.bgHs=ix(['tình trạng bàn giao hồ sơ']);
    M.rqNdt=ix(['rq ndt no']);M.mt=ix(['mt report no']);M.ut=ix(['ut report no']);
  }else if(layout==='B'){
    M.pn=ix(['member punch no']);M.dwg=ix(['drawing']);M.ms=ix(['note5']);
    M.ph=findExact(rows,'phase');M.grp1=ix(['note6']);M.grp2=ix(['note2']);M.zone=findExact(rows,'zone');
    M.w=ix(['weight [kg]']);M.rev=ix(['rev no']);
    M.wsCut=ix(['cutting assign workshop']);M.ws=ix(['fitup assign']);
    M.weld=findExact(rows,'note');
    M.fitD=ix(['date-fur']);M.fitRfi=ix(['rfi no-fur']);M.fitQc=ix(['qc check']);
    M.fitRep=ix(['report no-fur']);M.fitQA=ix(['bàn giao qa']);
    M.finChk=ix(['date-dir+vir']);M.finD=M.finChk;M.finRfi=ix(['rfi no-dir+vir']);
    M.planD=ix(['after cutting plan date']);
    (function(){var found=[],r,c,row;
      for(r=0;r<Math.min(8,rows.length);r++){row=rows[r]||[];for(c=0;c<row.length;c++){if(norm(row[c])==='rev qc')found.push(c);}}
      found.sort(function(a,b){return a-b;});
      M.fitRev=found.length?found[0]:-1;
      for(var k=0;k<found.length;k++){if(found[k]>M.finRfi){M.finRev=found[k];break;}}
      if(M.finRev<0&&found.length)M.finRev=found[found.length-1];
      M.finQc=findExact(rows,'qc check',8,M.finRfi>=0?M.finRfi+1:0);})();
  }else if(layout==='C'){
    M.pn=ix(['member no tên hồ sơ']);if(M.pn<0)M.pn=ix(['member no'])>=0?ix(['member no'])+4:-1;
    M.dwg=ix(['drawing']);M.ms=ix(['note5']);M.ph=findExact(rows,'phase');if(M.ph<0)M.ph=1;
    M.grp1=ix(['note6']);M.grp2=findExact(rows,'zone');if(M.grp2<0)M.grp2=0;
    var sec=ix(['section']);M.w=sec>=0?sec+2:-1;
    M.rev=M.dwg>=0?M.dwg+1:-1;
    M.wsCut=ix(['cutting assign workshop']);M.ws=ix(['after cutting plan workshop']);
    M.planD=M.ws>=1?M.ws-1:-1;
    /* cột Hàn/K Hàn: dò theo giá trị dữ liệu trong probe */
    (function(){for(var r=3;r<Math.min(10,rows.length);r++){var row=rows[r]||[];
      for(var c=0;c<row.length;c++){var v=norm(row[c]);if(v==='hàn'||v==='k hàn'){M.weld=c;return;}}}})();
    M.fitD=ix(['report no. fir-vir','report no fir-vir'])-1;
    M.fitRep=ix(['report no. fir-vir','report no fir-vir']);
    /* RFI chính = ô 'RFI No.' KHÔNG kèm trial/blas/pc/paint */
    (function(){for(var r=0;r<Math.min(8,rows.length);r++){var row=rows[r]||[];
      for(var c=0;c<row.length;c++){var v=norm(row[c]);
        if(v.indexOf('rfi no')===0&&v.indexOf('trial')<0&&v.indexOf('blas')<0&&v.indexOf(' pc')<0&&v.indexOf('paint')<0){M.finRfi=c;return;}}}})();
    M.finD=M.finRfi>=1?M.finRfi-1:-1;M.finRev=M.finRfi>=0?M.finRfi+1:-1;
    M.finQc=findExact(rows,'checked qc',8,M.finRfi>=0?M.finRfi+1:0);
    M.dir=ix(['report no. dir-vir','report no dir-vir']);
    M.mt=ix(['mt report no']);M.ut=ix(['ut report no']);
  }else if(layout==='D'){
    M.pn=ix(['tên cấu kiện']);M.dwg=ix(['mã cấu kiện']);
    M.grp1=ix(['mã hạng mục']);M.grp2=ix(['tên hạng mục']);
    var mat=ix(['material']);M.w=mat>=0?mat+1:-1;
    M.ws=ix(['nhà máy']);
    M.weld=ix(['ndt yes/no']);
    M.fitRep=ix(['bb hàn hoàn thiện']);
    M.finRfi=ix(['bbnt ck trước khi sử dụng','bbnt ck truoc']);
    M.finD=M.finRfi>=0?M.finRfi+1:-1;
    M.finQc=M.finRfi>=0?M.finRfi+2:-1;
    M.dir=M.finRfi;               /* BBNT = biên bản NT => coi như đã NT */
    M.kiDDC=ix(['chứng nhận xuất xưởng']);
    M.bgHs=ix(['biên bản giao nhận']);
    M.mt=findExact(rows,'mt');M.ut=findExact(rows,'ut');
    M._noFit=true;
  }
  var h=findHdr(rows,layout==='D'?['tên cấu kiện']:['member punch no','member no tên hồ sơ']);
  M._start=h?h.r+1:4;
  /* D: dòng ngay dưới header là dòng mẫu report -> bỏ qua khi pn trống, normRow tự lọc */
  return M;
}

function cell(row,i){return i>=0&&i<row.length?row[i]:null;}

function normRow(row,M,layout){
  var pn=cell(row,M.pn); if(!isReal(pn))return null;
  var weldRaw=norm(cell(row,M.weld));
  var welded;
  if(layout==='A')welded=weldRaw.indexOf('không')<0&&weldRaw.indexOf('hàn')>=0;
  else if(M.weld<0)welded=true;
  else welded=(weldRaw==='hàn'||weldRaw==='yes'||weldRaw==='có'||weldRaw==='co');
  var m={
    fitAppl:0,
    pn:String(pn).trim(),
    dwg:String(cell(row,M.dwg)||'').trim(),
    grp1:String(cell(row,M.grp1)||'').trim(),
    grp2:String(cell(row,M.grp2)||'').trim(),
    ms:String(cell(row,M.ms)||'').trim(),
    ph:String(cell(row,M.ph)||'').trim(),
    ws:String(cell(row,M.ws)||'').trim()||String(cell(row,M.wsCut)||'').trim(),
    wsCut:String(cell(row,M.wsCut)||'').trim(),
    w:numOr(cell(row,M.w),0),
    qty:numOr(cell(row,M.qty),1),
    weld:welded?1:0,
    rev:isReal(cell(row,M.rev))||String(cell(row,M.rev))==='0'?numOr(cell(row,M.rev),null):null,
    planD:lastDate(cell(row,M.planD),M._dmy)
  };
  /* FITUP */
  m.fitRfi=isReal(cell(row,M.fitRfi))?lastTok(cell(row,M.fitRfi)):'';
  m.fitD=lastDate(cell(row,M.fitD),M._dmy);
  m.fitRep=isReal(cell(row,M.fitRep))?lastTok(cell(row,M.fitRep)):'';
  m.fitRev=isReal(cell(row,M.fitRev))?numOr(cell(row,M.fitRev),null):null;
  m.fitQA=lastDate(cell(row,M.fitQA),M._dmy);
  m.fitInv=!!(m.fitRfi||m.fitD||m.fitRep);
  if(layout==='A')m.fitInv=!!m.fitRep;
  /* FINAL */
  m.finRfiAll=allTok(cell(row,M.finRfi));
  m.finRfi=m.finRfiAll.length?m.finRfiAll[m.finRfiAll.length-1]:'';
  m.finD=lastDate(cell(row,M.finD),M._dmy);
  m.finInv=!!(m.finRfi||m.finD);
  m.finRev=isReal(cell(row,M.finRev))||String(cell(row,M.finRev))==='0'?numOr(cell(row,M.finRev),null):null;
  m.finQc=isReal(cell(row,M.finQc))?String(cell(row,M.finQc)).trim():'';
  m.dir=isReal(cell(row,M.dir))?lastTok(cell(row,M.dir)):'';
  m.vir=isReal(cell(row,M.vir))?lastTok(cell(row,M.vir)):'';
  m.finDone=(M.dir>=0||M.vir>=0)?!!(m.dir||m.vir):null;
  /* hồ sơ + NDT */
  m.kiDDC=M.kiDDC>=0?isReal(cell(row,M.kiDDC)):null;
  m.kiKH=M.kiKH>=0?isReal(cell(row,M.kiKH)):null;
  m.bgHs=M.bgHs>=0?isReal(cell(row,M.bgHs)):null;
  m.ndt=(M.rqNdt>=0||M.mt>=0||M.ut>=0)?(isReal(cell(row,M.rqNdt))||isReal(cell(row,M.mt))||isReal(cell(row,M.ut))):null;
  m.moiLai=M.moiLai>=0?isReal(cell(row,M.moiLai)):(m.finRfiAll.length>1||/-R\d+$/i.test(m.finRfi));
  /* cảnh báo nâng rev */
  m.revWarnFin=(m.rev!=null&&m.finRev!=null&&m.finInv&&m.finRev<m.rev)?1:0;
  m.revWarnFit=(m.rev!=null&&m.fitRev!=null&&m.weld&&m.fitInv&&m.fitRev<m.rev)?1:0;
  m.revWarn=(m.revWarnFin||m.revWarnFit)?1:0;
  m.fitAppl=(M._noFit?0:m.weld);
  return m;
}

function mini(){return {n:0,t:0};}
function add(o,w){o.n++;o.t+=w;}
function aggregate(ma,rows,meta,pre){
  var layout=(pre&&pre.layout)||detectLayout(rows);
  if(!layout)return {ma:ma,err:'Layout chưa hỗ trợ — gửi mẫu sheet để khai báo thêm',meta:meta||{}};
  var M=(pre&&pre.M)||buildMap(rows,layout);
  if(pre&&pre.start!=null)M._start=pre.start;
  (function(){var ev_d=0,ev_m=0,cols=[M.planD,M.fitD,M.finD,M.fitQA],i,r,c,v,mm;
    for(r=M._start;r<Math.min(rows.length,M._start+3000);r++){var row=rows[r]||[];
      for(i=0;i<cols.length;i++){c=cols[i];if(c==null||c<0)continue;v=row[c];if(v==null)continue;
        var parts=String(v).split(/[,;\n]+/);
        for(var k=0;k<parts.length;k++){mm=parts[k].trim().match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.]\d{4}/);
          if(mm){if(+mm[1]>12)ev_d++;else if(+mm[2]>12)ev_m++;}}}}
    M._dmy=ev_m>ev_d?false:true;})();
  var ms=[],i,r;
  for(i=M._start;i<rows.length;i++){r=normRow(rows[i],M,layout);if(r)ms.push(r);}
  var P={ma:ma,layout:layout,meta:meta||{},mem:ms.length,tan:0,qty:0,
    weld:mini(),khan:mini(),
    fitReq:mini(),fitInv:mini(),fitRep:mini(),fitQA:mini(),
    finInv:mini(),finDone:mini(),finNot:mini(),
    kiDDC:mini(),kiKH:mini(),bgHs:mini(),ndt:mini(),
    rev:mini(),moiLai:mini(),od:mini(),soon:mini(),vir:mini(),bgIssue:mini(),revCrit:mini(),
    byWs:{},byWsCut:{},byGrp:{},byDwg:{},byM:{},byMPlan:{},byMPlanNot:{},rfi:{},
    warnList:[],revBy:{none:0,fit:0,fin:0,ndt:0,bg:0},
    caps:{finDone:(M.dir>=0||M.vir>=0),hoso:(M.bgHs>=0||M.kiDDC>=0),ndt:(M.mt>=0||M.rqNdt>=0),fitQA:M.fitQA>=0}};
  for(i=0;i<Math.min(4,rows.length);i++){var row0=rows[i]||[];
    for(var c0=0;c0<row0.length;c0++){var v0=String(row0[c0]||'');var mm0=v0.match(/(\d{5}-\d{3})/);if(mm0){P.code=mm0[1];break;}}
    if(P.code)break;}
  var _today=new Date();_today.setHours(0,0,0,0);
  var _soonEnd=new Date(_today.getTime()+7*864e5);
  ms.forEach(function(m){
    var t=m.w/1000; P.tan+=t; P.qty+=m.qty;
    var _od=(m.planD&&m.planD<_today&&!m.finInv);if(_od)add(P.od,t);
    var _soon=(m.planD&&m.planD>=_today&&m.planD<=_soonEnd&&!m.finInv);if(_soon)add(P.soon,t);
    add(m.weld?P.weld:P.khan,t);
    if(m.fitAppl){add(P.fitReq,t);if(m.fitInv)add(P.fitInv,t);if(m.fitRep)add(P.fitRep,t);if(m.fitQA)add(P.fitQA,t);}
    if(m.finInv)add(P.finInv,t);else add(P.finNot,t);
    if(m.finDone)add(P.finDone,t);
    if(m.kiDDC)add(P.kiDDC,t);if(m.kiKH)add(P.kiKH,t);if(m.bgHs)add(P.bgHs,t);if(m.ndt)add(P.ndt,t);
    if(m.vir)add(P.vir,t);
    if(m.bgHs&&P.caps.ndt&&!m.ndt)add(P.bgIssue,t);
    if(m.revWarn){add(P.rev,t);if(P.warnList.length<400)P.warnList.push([m.pn,m.dwg,m.rev,(m.revWarnFin?m.finRev:m.fitRev),(m.revWarnFin?'FINAL':'FITUP'),m.finRfi||m.fitRfi,m.ws]);
      if(m.bgHs){P.revBy.bg++;add(P.revCrit,t);}else if(m.ndt)P.revBy.ndt++;else if(m.finDone||m.finInv)P.revBy.fin++;else if(m.fitRep||m.fitInv)P.revBy.fit++;else P.revBy.none++;}
    if(m.moiLai)add(P.moiLai,t);
    function wsAdd(map,key){var W=map[key]||(map[key]={mem:0,tan:0,han:0,fitReq:0,fitReqT:0,fitInv:0,fitInvT:0,fitRep:0,fitQA:0,finInv:0,finInvT:0,finDone:0,finDoneT:0,kiDDC:0,bgHs:0,rev:0,od:0,odT:0});
      W.mem++;W.tan+=t;if(m.weld)W.han++;
      if(m.fitAppl){W.fitReq++;W.fitReqT+=t;if(m.fitInv){W.fitInv++;W.fitInvT+=t;}if(m.fitRep)W.fitRep++;if(m.fitQA)W.fitQA++;}
      if(m.finInv){W.finInv++;W.finInvT+=t;}
      if(m.finDone){W.finDone++;W.finDoneT+=t;}
      if(m.kiDDC)W.kiDDC++;if(m.bgHs)W.bgHs++;if(m.revWarn)W.rev++;
      if(_od){W.od++;W.odT+=t;}
      if(_soon)W.soon=(W.soon||0)+1;}
    var ws=m.ws||'?';wsAdd(P.byWs,ws);
    if(m.wsCut)wsAdd(P.byWsCut,m.wsCut);
    var gk=[(m.ms||'?'),(m.grp1||'?'),(m.grp2||'?'),(m.ph||'')].join('‖');
    var G=P.byGrp[gk]||(P.byGrp[gk]={mem:0,tan:0,han:0,fitReq:0,fitInv:0,fitRep:0,finInv:0,finInvT:0,finDone:0,bgHs:0,ndt:0,rev:0,od:0});
    G.mem++;G.tan+=t;if(m.weld)G.han++;if(m.fitAppl){G.fitReq++;if(m.fitInv)G.fitInv++;if(m.fitRep)G.fitRep++;}
    if(m.ndt)G.ndt++;
    if(m.finInv){G.finInv++;G.finInvT+=t;}if(m.finDone)G.finDone++;if(m.bgHs)G.bgHs++;if(m.revWarn)G.rev++;if(_od)G.od++;if(_soon)G.soon=(G.soon||0)+1;
    var dk=m.dwg||'?';
    var Dg=P.byDwg[dk]||(P.byDwg[dk]={grp:m.grp1||m.grp2||'',mem:0,tan:0,fitInv:0,finInv:0,finDone:0,bgHs:0,rev:0,d:null,wsc:{},fitReq:0,od:0,han:0});
    Dg.wsc[ws]=(Dg.wsc[ws]||0)+1;Dg.mem++;Dg.tan+=t;if(m.weld)Dg.han++;if(m.fitAppl)Dg.fitReq++;if(m.fitInv)Dg.fitInv++;if(m.finInv)Dg.finInv++;if(m.finDone)Dg.finDone++;if(m.bgHs)Dg.bgHs++;if(m.revWarn)Dg.rev++;if(_od)Dg.od++;if(_soon)Dg.soon=(Dg.soon||0)+1;
    if(m.finD&&(!Dg.d||m.finD>Dg.d))Dg.d=m.finD;
    var mo=ym(m.finD);if(mo){var B=P.byM[mo]||(P.byM[mo]={inv:0,invT:0,done:0,doneT:0});B.inv++;B.invT+=t;if(m.finDone){B.done++;B.doneT+=t;}}
    var pmo=ym(m.planD);if(pmo){var BP=P.byMPlan[pmo]||(P.byMPlan[pmo]={n:0,t:0});BP.n++;BP.t+=t;
      if(!m.finInv){var BN=P.byMPlanNot[pmo]||(P.byMPlanNot[pmo]={n:0,t:0});BN.n++;BN.t+=t;}}
    m.finRfiAll.forEach(function(rf){var R=P.rfi[rf]||(P.rfi[rf]={type:'FINAL',n:0,t:0,d:null,qc:m.finQc||''});R.n++;R.t+=t;if(m.finD&&(!R.d||m.finD>R.d))R.d=m.finD;});
    if(m.fitRfi){var R2=P.rfi[m.fitRfi]||(P.rfi[m.fitRfi]={type:'FITUP',n:0,t:0,d:null,qc:''});R2.n++;R2.t+=t;if(m.fitD&&(!R2.d||m.fitD>R2.d))R2.d=m.fitD;}
  });
  var dwgArr=Object.keys(P.byDwg).map(function(k){var d=P.byDwg[k];
    var wsBest='',wsN=0,wk;for(wk in d.wsc){if(d.wsc[wk]>wsN){wsN=d.wsc[wk];wsBest=wk;}}
    return [k,d.grp,d.mem,+d.tan.toFixed(2),d.fitInv,d.finInv,d.finDone,d.bgHs,d.rev,dstr(d.d),wsBest,d.fitReq,d.od,d.han,d.soon||0];});
  dwgArr.sort(function(a,b){return b[8]-a[8]||b[3]-a[3];});
  P.dwg=dwgArr.length; P.byDwg=dwgArr.slice(0,800);
  var rfiArr=Object.keys(P.rfi).map(function(k){var r=P.rfi[k];return [k,r.type,r.n,+r.t.toFixed(2),dstr(r.d),r.qc];});
  rfiArr.sort(function(a,b){return (b[4]||'').split('/').reverse().join('')<(a[4]||'').split('/').reverse().join('')?-1:1;});
  P.rfi=rfiArr;
  P.tan=+P.tan.toFixed(2);
  Object.keys(P.byGrp).forEach(function(k){var g=P.byGrp[k];g.tan=+g.tan.toFixed(2);g.finInvT=+g.finInvT.toFixed(2);});
  [P.byWs,P.byWsCut].forEach(function(mp){Object.keys(mp).forEach(function(k){var w=mp[k];['tan','fitReqT','fitInvT','finInvT','finDoneT','odT'].forEach(function(f){w[f]=+(w[f]||0).toFixed(2);});});});
  ['weld','khan','fitReq','fitInv','fitRep','fitQA','finInv','finDone','finNot','kiDDC','kiKH','bgHs','ndt','rev','moiLai','od','soon','vir','bgIssue','revCrit'].forEach(function(k){P[k].t=+P[k].t.toFixed(2);});
  return P;
}

var API={norm:norm,isReal:isReal,parseDate1:parseDate1,lastDate:lastDate,detectLayout:detectLayout,buildMap:buildMap,normRow:normRow,aggregate:aggregate,ym:ym,dstr:dstr};
if(typeof module!=='undefined'&&module.exports)module.exports=API;
root.DDC_CORE=API;
})(typeof window!=='undefined'?window:globalThis);
