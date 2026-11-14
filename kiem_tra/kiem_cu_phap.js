/* kiem_tra/kiem_cu_phap.js — kiem cu phap JS (14/11/2026, harness)
   Chay: node kiem_tra/kiem_cu_phap.js [tep.html|tep.js ...]   (khong doi so = moi trang .html + .js cua du an, bo ban luu *_backup*)
   .html: tach tung khoi <script> noi tuyen (khong co src, khong phai json) va bien dich thu; .js: bien dich thu ca tep.
   In "OK" hoac dong loi kem so dong; ma thoat 1 neu co loi. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
let files=process.argv.slice(2);
if(!files.length)files=fs.readdirSync(ROOT).filter(f=>/\.(html|js)$/.test(f)&&!/backup|truoc_/.test(f)).map(f=>path.join(ROOT,f));
let bad=0;
function thu(code,ten,dong0){try{new vm.Script(code,{filename:ten});return null;}catch(e){const m=/:(\d+)/.exec((e.stack||'').split('\n')[0]);const ln=m?(+m[1]+dong0-1):'?';return ten+':'+ln+'  '+e.message;}}
files.forEach(f=>{const ten=path.relative(ROOT,path.resolve(f));if(!fs.existsSync(f)){return;}const s=fs.readFileSync(f,'utf8');const loi=[];
  if(/\.js$/.test(f)){const e=thu(s,ten,1);if(e)loi.push(e);}
  else{const re=/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;let m,k=0;while((m=re.exec(s))){if(/type\s*=\s*["']?(application\/(ld\+)?json|text\/template|module)/i.test(m[1]))continue;k++;const dong=s.slice(0,m.index).split('\n').length;const e=thu(m[2],ten+' (khối script '+k+')',dong);if(e)loi.push(e);}}
  if(loi.length){bad+=loi.length;loi.forEach(x=>console.log('LOI  '+x));}else console.log('OK   '+ten);});
if(bad){console.log('CU PHAP: '+bad+' loi');process.exitCode=1;}else console.log('CU PHAP: DAT');
