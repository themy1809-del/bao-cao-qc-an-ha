/* kiem_tra/kiem_du_lieu.js — kiem tra du lieu tinh (14/11/2026, harness)
   - qcdata.js: tong tan Fitup/Han/Son cua cac dong = QCDATA.check (lech < 0,2 t) — cung quy tac qc.html; bo qua neu tep dang KHOA (ma hoa).
   - phan_bo_qc.js: nap duoc, KHU co id AHx, PB_SHEETS / PB_DANHMUC co id dung dang.
   - pb_to.js, md_to.js: nap duoc, co du lieu.
   Ma thoat 1 neu co loi. */
const fs=require('fs'),path=require('path'),vm=require('vm');const ROOT=path.resolve(__dirname,'..');let bad=0;
function nap(f){const ctx={window:{}};ctx.global=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(ROOT,f),'utf8'),ctx,{filename:f});return ctx.window;}
function ok(m){console.log('OK   '+m);}function loi(m){bad++;console.log('LOI  '+m);}
try{const W=nap('qcdata.js'),D=W.QCDATA;if(!D||!D.rows){ok('qcdata.js dang khoa (ma hoa) — bo qua doi chieu tong');}
  else{const s={f:0,w:0,p:0};D.rows.forEach(r=>{s.f+=+r[7]||0;s.w+=+r[8]||0;s.p+=+r[9]||0;});const c=D.check||{};
    const lech=['f','w','p'].map(k=>Math.abs(s[k]-(c[k]||0)));if(lech.every(x=>x<0.2))ok('qcdata.js '+D.rows.length+' dong, cap nhat '+D.updated+', tong khop check (F '+s.f.toFixed(1)+' / H '+s.w.toFixed(1)+' / S '+s.p.toFixed(1)+')');
    else loi('qcdata.js tong lech check: '+JSON.stringify({tinh:s,check:c}));}}catch(e){loi('qcdata.js khong nap duoc: '+e.message);}
try{const PB=nap('phan_bo_qc.js').PHAN_BO_QC;if(!PB||!PB.KHU)throw new Error('khong co PHAN_BO_QC.KHU');
  const sai=PB.KHU.filter(k=>!k.id);if(sai.length)loi('phan_bo_qc.js co '+sai.length+' khu thieu id');
  const sh=PB.PB_SHEETS||{};Object.keys(sh).forEach(x=>{if(!/^AH\d$/.test(x)||!/^[\w-]{20,}$/.test(sh[x].id||''))loi('PB_SHEETS.'+x+' sai dang');});
  if(PB.PB_DANHMUC&&!/^[\w-]{20,}$/.test(PB.PB_DANHMUC.id||''))loi('PB_DANHMUC id sai dang');
  ok('phan_bo_qc.js '+PB.KHU.length+' khu, '+(PB.NGUOI||[]).length+' nguoi, PB_SHEETS: '+(Object.keys(sh).join(',')||'—')+(PB.PB_DANHMUC?', co link chung':''));}catch(e){loi('phan_bo_qc.js: '+e.message);}
[['pb_to.js','PB_TO',o=>Object.keys(o.xuong||{}).length+' xuong'],['md_to.js','MD_TO',o=>(o.rows||[]).length+' dong'],['pb_gn.js','PB_GN',o=>{const L=Object.keys(o.THANG||{});if(!L.length)throw new Error('khong co thang');L.forEach(m=>o.THANG[m].forEach(x=>{if(!o.TO[x[0]])throw new Error(m+': to la '+x[0]);}));return L.length+' thang ghi nhan';}]].forEach(([f,k,mo])=>{if(!fs.existsSync(path.join(ROOT,f)))return;try{const o=nap(f)[k];if(!o)throw new Error('khong co window.'+k);ok(f+' '+mo(o));}catch(e){loi(f+': '+e.message);}});
if(bad){console.log('DU LIEU: '+bad+' loi');process.exitCode=1;}else console.log('DU LIEU: DAT');
