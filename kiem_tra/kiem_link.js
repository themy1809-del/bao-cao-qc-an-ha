/* kiem_tra/kiem_link.js — doi chieu LINK trong ma voi danh muc LINK CHUNG (14/11/2026, harness)
   Danh muc: kiem_tra/link_chung.csv (ban sao tab "TAT CA LINK" cua file link chung, khong co email).
   Quet moi .html/.js/.py/.bat cua du an (bo qcdata.js, *_data.js, ban luu): id Google Sheet (>= 40 ky tu) va Web App (AKfyc...).
   Link co trong ma ma CHUA co trong danh muc -> LOI (them vao file link chung + link_chung.csv). Ma thoat 1 neu co loi. */
const fs=require('fs'),path=require('path');const ROOT=path.resolve(__dirname,'..');
const csv=fs.readFileSync(path.join(__dirname,'link_chung.csv'),'utf8');
const DM=new Set((csv.match(/[A-Za-z0-9_-]{40,}/g)||[]).concat(csv.match(/AKfyc[A-Za-z0-9_-]+/g)||[]));
const files=[].concat(...['.','cong_cu_pc'].map(d=>{const p=path.join(ROOT,d);return fs.existsSync(p)?fs.readdirSync(p).map(f=>path.join(d,f)):[];}))
  .filter(f=>/\.(html|js|py|bat)$/.test(f)&&!/(^|\/)(qcdata\.js|[a-z]+_data\.js|md_to\.js|pb_to\.js)$/.test(f)&&!/backup|truoc_/.test(f));
const seen={};files.forEach(f=>{const s=fs.readFileSync(path.join(ROOT,f),'utf8').replace(/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+\/=]+/gi,''); /* bo anh nhung base64 */
  (s.match(/(?<![A-Za-z0-9_-])1[A-Za-z0-9_-]{39,}(?![A-Za-z0-9_-])/g)||[]).concat(s.match(/AKfyc[A-Za-z0-9_-]{20,}/g)||[]).forEach(id=>{(seen[id]=seen[id]||new Set()).add(f.replace(/^\.\//,''));});});
let bad=0;Object.keys(seen).sort().forEach(id=>{const ok=DM.has(id);if(!ok)bad++;console.log((ok?'OK   ':'LOI  ')+id.slice(0,18)+'…  '+[...seen[id]].join(', ')+(ok?'':'  ← CHƯA có trong danh mục link chung'));});
console.log(bad?'LINK: '+bad+' link trong mã chưa có trong danh mục (thêm vào file link chung tab TAT CA LINK + kiem_tra/link_chung.csv)':'LINK: DAT ('+Object.keys(seen).length+' link trong mã đều có trong danh mục)');
if(bad)process.exitCode=1;
