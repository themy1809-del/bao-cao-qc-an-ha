// Gom qcdata.js + phan_bo_qc.js + pb_to.js + md_to.js thanh 1 file data.json cho cong_cu_pc/obsidian_xuat.py
// Chay trong thu muc repo:  node cong_cu_pc/obsidian_dump.js data.json
var fs=require('fs');function ld(f){eval(fs.readFileSync(f,'utf8').replace(/^window\./m,'global.'));}
global.window={};require(require('path').resolve('phan_bo_qc.js'));var PB=window.PHAN_BO_QC;
ld('qcdata.js');try{ld('pb_to.js');}catch(e){global.PB_TO={xuong:{}};}try{ld('md_to.js');}catch(e){global.MD_TO=null;}
if(!global.QCDATA||!QCDATA.rows)throw new Error('qcdata.js chua giai ma (dang khoa) — chay tren may da co ban mo');
var out={D:{X:QCDATA.X,T:QCDATA.T,P:QCDATA.P,Q:QCDATA.Q,PL:QCDATA.PL,updated:QCDATA.updated,rows:QCDATA.rows},PB:{KHU:PB.KHU,NGUOI:PB.NGUOI,TEAMS:(PB.TEAMS||[]).map(function(t){return {id:t.id,ten:t.ten,ngan:t.ngan,cd:t.cd,NGUOI:t.NGUOI};}),PHU_TRACH:PB.PHU_TRACH,capNhat:PB.capNhat},PBTO:global.PB_TO,MD:global.MD_TO};
fs.writeFileSync(process.argv[2]||'data.json',JSON.stringify(out));console.log('OK',(process.argv[2]||'data.json'),QCDATA.rows.length,'dong SPM');
