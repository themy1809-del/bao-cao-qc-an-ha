/* pb_gn.js — SAN LUONG XUONG TU GHI NHAN (ban tinh, chi KHOI LUONG)
   Nguon: file "XUONG AH3 - BANG LUONG XUONG" (rieng tu cua xuong), tab GhiNhan_SL_BaoCao,
   CHI lay cot A Xuong · B To · C Cong doan · D KL xuong giao · E KL da thuc hien · I Thang.
   KHONG lay cot don gia / thanh tien / luong (F–H) — repo cong khai.
   Chup ngay 14/11/2026. Thang cua xuong = THANG DUONG LICH (1 -> cuoi thang): doi chieu SPM T11 khop tung to (24, 85, 29, 521, 144, 143, 727). Don vi theo file xuong (UNKNOWN — NEED USER CONFIRMATION: tan hay khac).
   Moi dong: [ma to, giao, da lam]; null = o trong tren sheet. Ten to + khau + to SPM o mang TO. */
window.PB_GN = {
  cap: '14/11/2026',
  nguon: 'Xưởng AH3 tự ghi nhận (tab GhiNhan_SL_BaoCao)',
  TO: {
    RT3: {ten: 'Tổ ráp thô 3 AH3', xw: 'AH3', cd: 'Cutting', k: 'f', spm: ['AH3.TO3RT']},
    RT1: {ten: 'Tổ ráp thô 1 AH3', xw: 'AH3', cd: '01 BuiltUp', k: 'f', spm: ['AH3.TO1RT']},
    RT2: {ten: 'Tổ ráp thô 2 AH3', xw: 'AH3', cd: '01 BuiltUp', k: 'f', spm: ['AH3.TO2RT']},
    RH1: {ten: 'Tổ ráp hoàn thiện 1 AH3', xw: 'AH3', cd: '05 Fitup', k: 'f', spm: ['AH3.TO1RH']},
    RH2: {ten: 'Tổ ráp hoàn thiện 2 AH3', xw: 'AH3', cd: '05 Fitup', k: 'f', spm: ['AH3.TO2RH']},
    RH3: {ten: 'Tổ ráp hoàn thiện 3 AH3', xw: 'AH3', cd: '05 Fitup', k: 'f', spm: ['AH3.TO3RH']},
    RH4: {ten: 'Tổ ráp hoàn thiện 4 AH3', xw: 'AH3', cd: '05 Fitup', k: 'f', spm: ['AH3.TO4RH']},
    RH5: {ten: 'Tổ ráp hoàn thiện 5 AH3', xw: 'AH3', cd: '05 Fitup', k: 'f', spm: ['AH3.TO5RH']},
    RH6: {ten: 'Tổ ráp hoàn thiện 6 AH3', xw: 'AH3', cd: '05 Fitup', k: 'f', spm: ['AH3.TO6RH']},
    /* 14/11 user xac nhan: Tổ hàn 1 = TO1HA. Tren SPM to nay ghi duoi ma HH tu 02/2026 (HH T11 = 727 = xuong ghi nhan 727; TO1HA chi co T01 = 57 ~ 56) -> cong ca hai */
    HA1: {ten: 'Tổ hàn 1 AH3', xw: 'AH3', cd: '06 Welding', k: 'w', spm: ['AH3.TO1HA', 'AH3.HH']},
    HA2: {ten: 'Tổ hàn 2 AH3', xw: 'AH3', cd: '06 Welding', k: 'w', spm: ['AH3.TO2HA']},
    NM:  {ten: 'Tổ nắn chỉnh/mài chà AH3', xw: 'AH3', cd: '07 Clean', k: 'w', spm: []},
    TP3: {ten: 'Tổ thành phẩm AH3', xw: 'AH7', cd: '10 Painting', k: 'p', spm: ['AH3.TO1TP']},
    TP2: {ten: 'Tổ thành phẩm AH2', xw: 'AH7', cd: '10 Painting', k: 'p', spm: ['AH2.TO1TP']}
  },
  /* 14/11 user "k hien du an": KL theo DU AN cua xuong — tab "MM.YYYY QUAN TRI SAN XUAT" cot M:R (CHI khoi luong; bo cot chi phi / luong khoan ben phai).
     rht = khoi Ráp hoàn thiện, rt = khoi Ráp thô. Moi dong [ten du an, KL phan bo, KL da lam]. */
  DA: {
    '2026-11': {
      rht: [['10626-051 DG SÂN VẬN ĐỘNG HÙNG VƯƠNG',504,576],['10625-045 DGRP CẦU VƯỢT MỸ THỦY - NAM ANH',51,0],['10726-041 DG XK 4 SETS RUBBER TIRED GANTRY CRANES',40,105],['10626-181 DG TN CC&TC CẦU ĐIỂM NHẤN SUNSET BRIDGE',100,0],['10626-142 DG TN KHU CC CAO TẦNG KH TMDV THUẬN GIAO',22,22],['10626-076 DG TN SÂN BAY PHÚ QUỐC CẦU ỐNG CỐ ĐỊNH',213,45],['10626-155 DG TN NÚI TUYẾT',50,0],['DỰ ÁN NỘI BỘ CHO NHÀ MÁY AN HẠ - 2026',2,0],['TCTN.DNS.26.004 ĐƯỜNG CAO TỐC VIN',100,0],['10625-030 DGRP GA T2 CẢNG HÀNG KHÔNG QT PHÚ QUỐC',5,0],['10725-003 DGRP BISON-STRUCTURE STEEL',200,99],['10725-007 DGRP BISON-SDM ATO AND TED',23,0],['10725-008 DGRP EVAPCO-GREGORY-STRUCTURAL STEEL',41,0],['10725-009 DGRP VIOLA - STRUCTURAL STEEL',42,0],['10725-011 DGRP VIOLA - DUCTING SDM & TED',50,24],['10725-012 DGRP EVAPCO - GREGORY - DUCTING',32,25],['10626-110 DG TN NM CÀ PHÊ TRUNG NGUYÊN LEGEND',50,45]],
      rt: [['10626-051 DG SÂN VẬN ĐỘNG HÙNG VƯƠNG',504,248],['10625-045 DGRP CẦU VƯỢT MỸ THỦY - NAM ANH',51,0],['10626-110 DG TN NM CÀ PHÊ TRUNG NGUYÊN LEGEND',50,26],['10626-142 DG TN KHU CC CAO TẦNG KH TMDV THUẬN GIAO',22,0],['10725-003 DGRP BISON-STRUCTURE STEEL',200,79],['10725-008 DGRP EVAPCO-GREGORY-STRUCTURAL STEEL',41,0],['10725-009 DGRP VIOLA - STRUCTURAL STEEL',42,0],['10725-011 DGRP VIOLA - DUCTING SDM & TED',50,24],['10725-012 DGRP EVAPCO - GREGORY - DUCTING',32,32],['10626-155 DG TN NÚI TUYẾT',50,13],['10626-181 DG TN CC&TC CẦU ĐIỂM NHẤN SUNSET BRIDGE',100,0],['10626-076 DG TN SÂN BAY PHÚ QUỐC CẦU ỐNG CỐ ĐỊNH',213,176],['10726-041 DG XK 4 SETS RUBBER TIRED GANTRY CRANES',40,36]]
    },
    '2026-10': {
      rht: [['10626-051 DG SÂN VẬN ĐỘNG HÙNG VƯƠNG',1668,1552],['10725-008 GREGORY_STEEL STRUCTURE (TEXAS, USA)',212,125],['10625-030 ĐẦU TƯ MỞ RỘNG CẢNG HÀNG KHÔNG QUỐC TẾ PHÚ QUỐC',150,144],['10725-011 DGRP VIOLA - DUCTING SDM & TED',148,0],['10725-003 DGRP BISON-STRUCTURE STEEL',0,105],['10625-045 DGRP CẦU VƯỢT MỸ THỦY - NAM ANH',50,0],['10725-092 DGRP 200POR9251285 STEEL WI1 PHASE 2',48,99],['10626-142 DG TN KHU CC CAO TẦNG KH TMDV THUẬN GIAO',0,33],['10725-143 DG DANIELI DPC45EU7 PACIFIC',0,12],['10726-014 DG BEDPLATE FOR HOIST 625T',29,29],['10725-012 DGRP EVAPCO - GREGORY - DUCTING',45,13]],
      rt: [['10626-051 DG SÂN VẬN ĐỘNG HÙNG VƯƠNG',1668,1107],['10625-030 ĐẦU TƯ MỞ RỘNG CẢNG HÀNG KHÔNG QUỐC TẾ PHÚ QUỐC',100,3],['10725-092 DGRP 200POR9251285 STEEL WI1 PHASE 2',100,0],['10626-142 DG TN KHU CC CAO TẦNG KH TMDV THUẬN GIAO',0,22],['10625-045 DGRP CẦU VƯỢT MỸ THỦY - NAM ANH',50,0],['10725-008 GREGORY_STEEL STRUCTURE (TEXAS, USA)',0,18]]
    }
  },
  THANG: {
    '2026-11': [['RT3',null,null],['RT1',413,238],['RT2',null,null],['RH1',120,24],['RH2',0,85],['RH3',129,88],['RH4',40,29],['RH5',751,521],['RH6',364,144],['HA1',1364,727],['HA2',40,143],['NM',1404,807],['TP3',1242,997],['TP2',1242,1244]],
    '2026-10': [['RT3',null,null],['RT1',600,504],['RT2',null,null],['RH1',100,79],['RH2',319,186],['RH3',200,224],['RH4',179,149],['RH5',700,800],['RH6',523,435],['HA1',1723,1854],['HA2',398,217],['NM',2121,2114],['TP3',2021,2403],['TP2',2000,2690]],
    '2026-09': [['RT3',0,0],['RT1',600,608],['RT2',0,0],['RH1',200,156],['RH2',215,146],['RH3',240,294],['RH4',204,176],['RH5',675,584],['RH6',488,405],['HA1',1603,1411],['HA2',419,202],['NM',2268,1758],['TP3',2022,1883],['TP2',2000,1804]],
    '2026-08': [['RT3',0,1],['RT1',600,417],['RT2',null,null],['RH1',200,163],['RH2',215,269],['RH3',240,188],['RH4',204,152],['RH5',675,590],['RH6',488,272],['HA1',1603,1397],['HA2',419,164],['NM',2268,1558],['TP3',2022,1723],['TP2',2000,1959]],
    '2026-07': [['RT3',null,230],['RT1',480,515],['RT2',0,0],['RH1',100,127],['RH2',280,180],['RH3',160,210],['RH4',258,175],['RH5',710,508],['RH6',508,220],['HA1',1678,761],['HA2',338,154],['NM',2016,1031],['TP3',1916,1392],['TP2',1900,175]],
    '2026-06': [['RT3',null,303],['RT1',500,433],['RT2',0,0],['RH1',70,82],['RH2',212,110],['RH3',80,155],['RH4',180,127],['RH5',483,419],['RH6',276,195],['HA1',909,0],['HA2',392,201],['NM',1301,1137],['TP3',1231,960],['TP2',1200,1193]],
    '2026-05': [['RT3',null,304],['RT1',683,590],['RT2',0,0],['RH1',91,70],['RH2',148,171],['RH3',33,73],['RH4',150,134],['RH5',366,242],['RH6',328,206],['HA1',918,0],['HA2',198,298],['NM',1116,1033],['TP3',1025,1447],['TP2',1200,1290]],
    '2026-04': [['RT3',null,125],['RT1',596,436],['RT2',0,0],['RH1',0,0],['RH2',100,81],['RH3',188,157],['RH4',93,125],['RH5',115,130],['RH6',356,242],['HA1',253,251],['HA2',919,0],['NM',1149,1156],['TP3',1049,1149],['TP2',1000,1480]],
    '2026-03': [['RT3',0,0],['RT1',438,438],['RT2',0,0],['RH1',79,79],['RH2',162,162],['RH3',114,114],['RH4',76,76],['RH5',297,297],['RH6',191,191],['HA1',813,732],['HA2',0,0],['NM',1074,824],['TP3',973,961],['TP2',1000,1056]],
    '2026-02': [['RT3',0,1056],['RT1',225,155],['RH1',100,30],['RH2',150,78],['RH3',14,17],['RH4',37,11],['RH5',282,185],['RH6',198,86],['HA1',601,0],['NM',797,448],['TP3',697.2,415],['TP2',700,451]],
    '2026-01': [['RT3',null,0],['RT1',358,284],['RT2',0,0],['RH1',120,84],['RH2',219,120],['RH3',96,59],['RH4',113,104],['RH5',274,213],['RH6',268,151],['HA1',906,56],['NM',1164,681],['TP3',1019,863],['TP2',1000,853]],
    '2025-12': [['RT3',0,0],['RT1',423,387],['RT2',0,0],['RH1',150,100],['RH2',163,133],['RH3',47,61],['RH4',162,143],['RH5',293,321],['RH6',294,196],['HA1',1024,673],['NM',1174,931],['TP3',874,585],['TP2',900,751]],
    '2025-11': [['RT3',0,194],['RT1',389,286.3],['RT2',0,0],['RH1',150,84.8],['RH2',140,85.6],['RH3',39,25.5],['RH4',45,79.6],['RH5',315,208],['RH6',297,278.3],['HA1',828,630.7],['HA2',227,31],['NM',1055,562.5],['TP2',800,617.1],['TP3',809,558.9]],
    '2025-10': [['RT3',0,167],['RT1',150,95.1],['RT2',0,0],['RH1',161,141.1],['RH2',0,13.6],['RH3',0,10.8],['RH4',45,42.5],['RH5',186,153.1],['RH6',112,111.7],['HA1',604,558.7],['HA2',0,0],['NM',604,513.2],['TP2',null,null],['TP3',475,323.5]]
  }
};
