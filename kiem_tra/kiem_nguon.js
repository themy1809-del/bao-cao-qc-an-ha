/* kiem_tra/kiem_nguon.js — kiem tra TRUC TUYEN cac sheet nguon (14/11/2026, harness)
   Mo tung sheet qua gviz (curl, qua proxy neu co) va xac nhan DUNG TAB, DUNG MAU:
     - PB_SHEETS (phan bo xuong): co "Plan Workshop" (ban hanh gia cong) hoac "THANG mm/yyyy" + dong ma du an (mau PB to)
     - PB_DANHMUC (link chung, tab PHAN BO XUONG): co dong AHx
     - KHSX: co cot "Tong khoi luong"; registry Doc Control: co cot "Spreadsheet ID"
   Ket qua: OK / CANH BAO (sheet rieng tu — trang dung so du phong) / LOI (doc duoc nhung SAI TAB / SAI MAU -> trang mat so).
   Khong co mang -> bo qua (ma thoat 0). Ma thoat 1 neu co LOI. */
const fs=require('fs'),path=require('path'),vm=require('vm'),{execFileSync}=require('child_process');const ROOT=path.resolve(__dirname,'..');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(ROOT,'phan_bo_qc.js'),'utf8'),ctx);const PB=ctx.window.PHAN_BO_QC||{};
const ban=fs.readFileSync(path.join(ROOT,'ban_do_qc.html'),'utf8'),qc=fs.readFileSync(path.join(ROOT,'qc.html'),'utf8');
const khsx=(/KHSX_SHEET='([\w-]+)',KHSX_GID='(\d+)'/.exec(ban)||[]),reg=(/DDC_REG=\{id:'([\w-]+)',gid:'(\d+)'\}/.exec(qc)||[]);
const DS=[];Object.keys(PB.PB_SHEETS||{}).forEach(x=>DS.push({ten:'Phân bổ '+x,id:PB.PB_SHEETS[x].id,gid:PB.PB_SHEETS[x].gid||'0',ok:t=>/Plan Workshop/i.test(t)||(/TH[AÁ]NG\s*\d{1,2}\s*\/\s*\d{4}/i.test(t)&&/\n[^\n]*\d{5}-\d{3}/.test(t))}));
Object.keys(PB.PB_GN_SHEET||{}).forEach(x=>DS.push({ten:'Xưởng tự ghi nhận '+x+' (sheet trung gian)',id:PB.PB_GN_SHEET[x].id,gid:PB.PB_GN_SHEET[x].gid||'0',ok:t=>/KL xuong giao/i.test(t)&&/\d{1,2}\/\d{4}/.test(t)}));
if(PB.PB_DANHMUC)DS.push({ten:'Link chung (PHAN BO XUONG)',id:PB.PB_DANHMUC.id,gid:PB.PB_DANHMUC.gid||'0',ok:t=>/(^|\n)"?AH\d"?,/.test(t)});
if(khsx[1])DS.push({ten:'KHSX',id:khsx[1],gid:khsx[2],ok:t=>/T[oổ]ng kh[oố]i l[uư][oợ]ng/i.test(t),h2:1});
if(reg[1])DS.push({ten:'Registry Doc Control',id:reg[1],gid:reg[2],ok:t=>/Spreadsheet ID/i.test(t)});
function get(u){try{return execFileSync('curl',['-sSL','--max-time','40',u],{encoding:'utf8',maxBuffer:64<<20});}catch(e){return null;}}
let bad=0,mang=true;
for(const d of DS){const t=get('https://docs.google.com/spreadsheets/d/'+d.id+'/gviz/tq?tqx=out:csv'+(d.h2?'&headers=2':'')+'&gid='+d.gid);
  if(t===null){mang=false;console.log('BO QUA '+d.ten+' — không có mạng');continue;}
  if(/^\s*</.test(t)){console.log('CANH BAO '+d.ten+' — sheet chưa chia sẻ công khai (trang dùng số dự phòng)');continue;}
  if(d.ok(t.slice(0,200000)))console.log('OK   '+d.ten+' (gid '+d.gid+', '+(t.split('\n').length-1)+' dòng)');
  else{bad++;console.log('LOI  '+d.ten+' — gid '+d.gid+' đọc được nhưng SAI TAB / SAI MẪU. Dòng đầu: '+t.split('\n')[0].slice(0,120));}}
console.log(bad?'NGUON: '+bad+' sheet sai tab/mẫu — sửa link ở file link chung + phan_bo_qc.js':(mang?'NGUON: DAT':'NGUON: bỏ qua (không có mạng)'));
if(bad)process.exitCode=1;
