/**********************************************************************
 *  SPM_TU_DONG.gs — Xu ly file SPM tren Google (khong can Python / Git / may ca nhan)
 *  Nha may An Ha (DDC) · 15/10/2026 · PHIEN_BAN_SPM 'v2026-10-15-goc'
 *
 *  LUONG:  SPM -> Export to Excel -> keo file vao thu muc Drive SPM_UPLOAD
 *          -> moi 30' script tu: doc file -> kiem tra -> GHEP THEO KY voi qcdata.js tren GitHub
 *          -> (CHE_DO='THAT') day qcdata.js len GitHub  |  (CHE_DO='THU') chi luu ban thu + gui mail so sanh
 *          -> chuyen file da xu ly sang SPM_DA_XU_LY.
 *
 *  Phan xu ly (spmXuLy_) la BAN CHUYEN NGUYEN VAN tu spm_flatten.py (nhanh RowAreaHeaders + GHEP THEO KY),
 *  da doi chieu tung dong voi ban Python tren cung file SPM truoc khi giao.
 *
 *  CAI DAT 1 LAN: xem HUONG_DAN o cuoi file (ham huongDan()).
 **********************************************************************/

/*======================== CAU HINH ========================*/
var CHE_DO        = 'THU';          // 'THU' = chi thu (KHONG day len web) · 'THAT' = day len GitHub
var THU_MUC_UPLOAD = 'SPM_UPLOAD';  // ten thu muc tren Drive (tai khoan dang chay script) — tu tao neu chua co
var THU_MUC_XONG   = 'SPM_DA_XU_LY';
var GH_OWNER  = 'themy1809-del';
var GH_REPO   = 'bao-cao-qc-an-ha';
var GH_BRANCH = 'main';
var GH_PATH   = 'qcdata.js';
var MAIL_BAO  = 'mydt@daidung.vn';  // nhan mail bao ket qua / loi
var PHIEN_BAN_SPM = 'v2026-10-15-goc';
// PAT GitHub KHONG ghi o day: Project Settings (banh rang) -> Script Properties -> them  GITHUB_TOKEN = <PAT>

/*==================== PHAN XU LY (thuan JS) ====================*/
var SPM_CANON = ['AH1','AH2','AH3','AH4','AH6','AH9'];
var SPM_MIEN_QC_TO = {'TO1TO':1,'TO1XG':1,'TO1TI':1};
var SPM_PROC = ['Fitup','Welding','Painting','Final'];
var SPM_STAGE_KW = [['BOM','bom'],['Fitup','fitup'],['Welding','welding'],['Painting','painting'],['Final','final']];

/* round() cua Python: lam tron NUA-CHAN tren GIA TRI CHINH XAC cua so thuc (khop tung so voi ban Python) */
function pyRound_(x, n){
  n = n || 0;
  if (typeof x !== 'number' || !isFinite(x)) return x;
  if (x === 0) return 0;
  var neg = x < 0, s = Math.abs(x).toFixed(100), dot = s.indexOf('.');
  var ip = s.slice(0, dot), fp = s.slice(dot + 1);
  var keep = ip + fp.slice(0, n), rest = fp.slice(n);
  var up;
  if (rest.charAt(0) > '5') up = true;
  else if (rest.charAt(0) < '5') up = false;
  else up = /[1-9]/.test(rest.slice(1)) ? true : ((+keep.charAt(keep.length - 1)) % 2 === 1);
  if (up) {
    var a = keep.split(''), i = a.length - 1;
    while (i >= 0) { if (a[i] === '9') { a[i] = '0'; i--; } else { a[i] = String(+a[i] + 1); break; } }
    if (i < 0) a.unshift('1');
    keep = a.join('');
  }
  var ipLen = keep.length - n, str = keep.slice(0, ipLen) + (n ? '.' + keep.slice(ipLen) : '');
  var v = parseFloat(str);
  return neg ? -v : v;
}
function spmEmpty_(v){ return v === null || v === undefined || v === ''; }
function spmStr_(v){
  if (v === null || v === undefined) return '';
  if (Object.prototype.toString.call(v) === '[object Date]') {
    var p = function(k){ return (k < 10 ? '0' : '') + k; };
    return v.getFullYear() + '-' + p(v.getMonth() + 1) + '-' + p(v.getDate()) + ' 00:00:00';
  }
  return String(v);
}
function spmTrim_(s){ return String(s).replace(/^\s+|\s+$/g, ''); }
function spmNum_(v){ return (typeof v === 'number' && isFinite(v)) ? v : 0; }
function spmAhParse_(nm){
  var U = spmStr_(nm).toUpperCase(), m = /AH[123469]/.exec(U);
  if (!m) return [null, null];
  var t = (U.slice(0, m.index) + U.slice(m.index + m[0].length)).replace(/^[. \-\/]+|[. \-\/]+$/g, '');
  return [m[0], t || '(chung)'];
}
function spmClean_(v){ var s = spmTrim_(spmStr_(v)); return /\sTotal$/.test(s) && s.slice(-6) === ' Total' ? spmTrim_(s.slice(0, -6)) : s; }
function spmCset_(v){ if (spmEmpty_(v)) return null; var c = spmClean_(v); return (c && c !== 'Total') ? c : null; }
function spmIsoq_(x){
  var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(spmStr_(x || ''));
  if (!m) return '';
  var p = function(k){ k = +k; return (k < 10 ? '0' : '') + k; };
  return m[3] + '-' + p(m[1]) + '-' + p(m[2]);
}
function spmStatus_(pct, bom){
  if (bom == 0) return 'Không BOM';
  if (pct >= 95) return 'Hoàn thành';
  if (pct >= 50) return 'Đang hoàn thiện';
  if (pct > 0) return 'Còn tồn đọng';
  return 'Chưa sơn';
}
function SpmLoi_(msg){ this.message = msg; this.name = 'SpmLoi'; }

/**
 * rows   : mang 2 chieu gia tri o (sheet dau tien cua file SPM xuat), o trong = '' hoac null
 * old    : doi tuong QCDATA hien tai (tu GitHub) hoac null
 * opt    : { source:'spm.xlsx', updated:'dd/mm/yyyy', ghep:bool, thaySach:bool }
 * tra ve : { obj: QCDATA moi, log:[...], canhBao:[...] }   — loi cau truc: throw SpmLoi_
 */
function spmXuLy_(rows, old, opt){
  opt = opt || {};
  var log = [], canhBao = [];
  var maxc = 0; for (var i0 = 0; i0 < Math.min(60, rows.length); i0++) maxc = Math.max(maxc, rows[i0].length);
  var W = Math.max(maxc, 22);
  var all = rows.map(function(r){ var a = r.slice(); while (a.length < W) a.push(null); return a; });

  /* dong tieu de cong doan */
  var HR = null;
  for (var i = 0; i < Math.min(40, all.length); i++) {
    var r = all[i], hb = false, hf = false;
    for (var c = 0; c < r.length; c++) { var s = spmTrim_(spmStr_(r[c])).toLowerCase(); if (s.indexOf('bom') >= 0) hb = true; if (s.indexOf('fitup') >= 0) hf = true; }
    if (hb && hf) { HR = i; break; }
  }
  if (HR === null) throw new SpmLoi_('Khong tim thay dong tieu de cong doan (00.BOM / 01.Fitup). File SPM sai dinh dang.');
  var hdr = all[HR], sub = all[HR + 1] || [];
  var STG_W = {}, STG_HDR = {};
  SPM_STAGE_KW.forEach(function(kv){
    for (var j = 0; j < hdr.length; j++) {
      if (spmTrim_(spmStr_(hdr[j])).toLowerCase().indexOf(kv[1]) >= 0) {
        STG_HDR[kv[0]] = j; var wc = null;
        for (var cc = j; cc <= j + 2; cc++) { if (cc < sub.length && spmTrim_(spmStr_(sub[cc])).toLowerCase() === 'weight') { wc = cc; break; } }
        if (wc === null) wc = j + 1;
        STG_W[kv[0]] = wc; break;
      }
    }
  });
  if (STG_W.BOM === undefined || STG_W.Fitup === undefined) throw new SpmLoi_('Khong do duoc cot Weight cua BOM/Fitup. File sai mau.');
  var BOMW = STG_W.BOM, ND = Infinity;
  for (var k0 in STG_HDR) ND = Math.min(ND, STG_HDR[k0]);
  if (ND < 4) throw new SpmLoi_('File SPM chi co ' + ND + ' cot nhan dong — Pivot thieu truong trong ROWS.');
  var DATA0 = HR + 2;
  var gw = function(row, st){ var c = STG_W[st]; return (c !== undefined && c < row.length) ? spmNum_(row[c]) : 0; };
  var gq = function(row, st){ var c = STG_HDR[st]; return (c !== undefined && c < row.length) ? pyRound_(spmNum_(row[c]), 0) : 0; };

  /* mau 8000 dong dau (giong Python) — dung de biet cot QC User / Status co gia tri khong */
  var samp = {};
  for (var si = DATA0; si < Math.min(all.length, DATA0 + 8000); si++) {
    for (var sc = 1; sc < ND; sc++) {
      var v0 = sc < all[si].length ? all[si][sc] : null;
      if (!spmEmpty_(v0)) { var sv0 = spmTrim_(spmStr_(v0)); if (/Total$/.test(sv0)) sv0 = spmTrim_(sv0.slice(0, -6)); if (sv0 && sv0 !== 'Total') (samp[sc] = samp[sc] || []).push(sv0); }
    }
  }

  /* RowAreaHeaders -> cot theo TEN (BAT BUOC voi ban Google) */
  var RAH = null;
  for (var hi = 0; hi < HR; hi++) for (var hc = 0; hc < all[hi].length; hc++) {
    var hv = all[hi][hc];
    if (typeof hv === 'string' && spmTrim_(hv).toLowerCase().indexOf('rowareaheaders') === 0) {
      RAH = hv.split(':').slice(1).join(':').split(',').map(function(x){ return spmTrim_(x).toLowerCase(); });
    }
  }
  if (!RAH || RAH.length !== ND) throw new SpmLoi_('File khong co dong RowAreaHeaders hop le (' + (RAH ? RAH.length : 0) + ' truong / ' + ND + ' cot). Xuat lai SPM bang Export to Excel.');
  var ix = function(){ var names = Array.prototype.slice.call(arguments); for (var q = 0; q < RAH.length; q++) if (names.indexOf(RAH[q]) >= 0) return q; return null; };
  var L_PROJ = ix('project') || 0, L_PHASE = ix('phase'), L_ZONE = ix('zone'), L_WS = ix('workshop');
  var L_WD = ix('work date','workdate'), L_QCWS = ix('qc workshop','qcworkshop'), L_QCDATE = ix('qc date','qcdate');
  var L_QCU = ix('qc user','qcuser'), L_STATUS = ix('qc status','qcstatus','status'), L_MEMO = ix('memo');
  if (L_WS === null || L_WD === null || L_QCWS === null) throw new SpmLoi_('Pivot thieu truong Workshop / Work Date / QC Workshop trong ROWS.');
  if (L_QCDATE === null) throw new SpmLoi_('Pivot thieu truong QC Date — SPM chi xuat 7 cap + Memo, kiem lai bo cuc.');
  if (L_MEMO === null) L_MEMO = ND - 1;
  if (!samp[L_QCDATE] || !samp[L_WD]) throw new SpmLoi_('Cot Work Date / QC Date TRONG trong file (SPM chi xuat 7 cap + Memo) — xep lai Pivot: Project > Phase > Workshop > Work Date > QC Workshop > QC User > QC Date > Memo.');
  if (L_QCU !== null && !samp[L_QCU]) L_QCU = null;
  if (L_STATUS !== null && !samp[L_STATUS]) L_STATUS = null;
  log.push('[DO CAP theo TEN] ' + RAH.join(', '));
  if (L_QCU === null) canhBao.push('QC User TRONG — thong ke theo nguoi QC se thieu.');
  var hm = function(ctx){ var a = (L_PHASE !== null ? ctx[L_PHASE] : '') || '', b = (L_ZONE !== null ? ctx[L_ZONE] : '') || ''; return (a && b) ? (a + ' | ' + b) : (a || b); };

  /* duyet dong */
  var ctxp = null, projBOM = new Map(), byProj = new Map(), fctx = [], flat = [];
  for (var f0 = 0; f0 < ND; f0++) fctx.push(null);
  for (var ri = DATA0; ri < all.length; ri++) {
    var row = all[ri];
    var fsub = false, allEmpty = true;
    for (var e = 0; e < ND; e++) if (!spmEmpty_(row[e])) { allEmpty = false; break; }
    if (allEmpty) fctx[L_MEMO] = null;
    for (var ci = 0; ci < ND; ci++) {
      var cv = row[ci];
      if (!spmEmpty_(cv)) {
        var sv = spmTrim_(spmStr_(cv));
        if (/Total$/.test(sv)) { fsub = true; fctx[ci] = spmTrim_(sv.slice(0, -6)); } else fctx[ci] = sv;
        for (var cj = ci + 1; cj < ND; cj++) fctx[cj] = null;
      }
    }
    if (!fsub) {
      var bom = spmNum_(row[BOMW]), fw = SPM_PROC.map(function(s){ return gw(row, s); });
      if (bom || fw.some(function(x){ return x; })) {
        var ap = spmAhParse_(fctx[L_WS] || ''), fx = ap[0], ft = ap[1], qc = fctx[L_QCWS] || '';
        if (fx !== null && SPM_CANON.indexOf(fx) >= 0) {
          var statusRaw = (L_STATUS !== null ? fctx[L_STATUS] : '') || '', stv = statusRaw.toLowerCase(), pl;
          if (stv) pl = stv.indexOf('reject') >= 0 ? 'Rớt' : (stv.indexOf('accept') >= 0 ? 'Đã QC (AH)' : 'Chưa QC');
          else pl = qc.toUpperCase().indexOf('AH') === 0 ? 'Đã QC (AH)' : (!spmTrim_(qc) ? 'Chưa QC' : 'QC khác');
          if (pl !== 'Đã QC (AH)' && pl !== 'Rớt' && SPM_MIEN_QC_TO[ft] && !fctx[L_QCDATE] &&
              !spmTrim_((L_QCU !== null ? fctx[L_QCU] : '') || '') && !fw[1] && !fw[2]) pl = 'Miễn QC';
          var memo = (L_MEMO !== null && L_MEMO !== L_STATUS && [L_QCU, L_QCDATE, L_QCWS, L_WD].indexOf(L_MEMO) < 0) ? (fctx[L_MEMO] || '') : '';
          flat.push([fctx[L_PROJ] || '', hm(fctx), fx, ft, fctx[L_QCDATE] || '', qc, (L_QCU !== null ? fctx[L_QCU] : '') || '', pl, statusRaw]
            .concat(fw.map(function(x){ return pyRound_(x / 1000, 3); }))
            .concat([fctx[L_WD] || '', gq(row, 'Fitup'), gq(row, 'Welding'), gq(row, 'Painting'), memo]));
        }
      }
    }
    var c0 = spmCset_(row[L_PROJ]);
    if (c0 !== null) ctxp = c0;
    if (c0 !== null && spmNum_(row[BOMW]) > 0) projBOM.set(ctxp, Math.max(projBOM.has(ctxp) ? projBOM.get(ctxp) : 0, spmNum_(row[BOMW])));
    var rawws = row[L_WS];
    if (!spmEmpty_(rawws) && /Total$/.test(spmTrim_(spmStr_(rawws)))) {
      var ap2 = spmAhParse_(spmClean_(rawws));
      if (ap2[0] && SPM_CANON.indexOf(ap2[0]) >= 0) {
        if (!byProj.has(ctxp)) byProj.set(ctxp, {Fitup:0, Welding:0, Painting:0, Final:0});
        var pp0 = byProj.get(ctxp);
        SPM_PROC.forEach(function(s){ pp0[s] += gw(row, s); });
      }
    }
  }
  if (!flat.length) throw new SpmLoi_('Khong co dong du lieu nao cua xuong An Ha trong file.');
  var wds = flat.map(function(f){ return f[13]; }).filter(Boolean);
  log.push('[DOC SPM] ' + flat.length + ' dong');

  var t3 = function(x){ return pyRound_(x / 1000, 1); };
  var byProjL = [];
  byProj.forEach(function(p, pr){
    if (!pr) return;
    var b = projBOM.has(pr) ? projBOM.get(pr) : 0, pct = b ? pyRound_(p.Painting / b * 100, 0) : 0, st = {}, ton = {};
    SPM_PROC.forEach(function(s){ st[s] = t3(p[s]); ton[s] = t3(Math.max(0, b - p[s])); });
    byProjL.push({proj:pr, bom:t3(b), st:st, ton:ton, pct:pct, status:spmStatus_(pct, b)});
  });
  byProjL = byProjL.map(function(o, i){ return [o, i]; }).sort(function(a, b){ return (b[0].ton.Painting - a[0].ton.Painting) || (a[1] - b[1]); }).map(function(x){ return x[0]; });

  /* bang chi so */
  var P = [], X = [], T = [], Q = [], PL = [], Z = [], Pm = new Map(), Xm = new Map(), Tm = new Map(), Qm = new Map(), PLm = new Map(), Zm = new Map();
  var ixq = function(mp, lst, v){ if (!mp.has(v)) { mp.set(v, lst.length); lst.push(v); } return mp.get(v); };
  var HASZ = (L_ZONE !== null || L_PHASE !== null);
  var R = flat.map(function(fr){
    var a = [ixq(Pm, P, fr[0]), ixq(Xm, X, fr[2]), ixq(Tm, T, fr[3]), spmIsoq_(fr[4]), spmIsoq_(fr[13]),
             ixq(Qm, Q, (fr[6] || '—')), ixq(PLm, PL, fr[7]),
             pyRound_(fr[9], 3), pyRound_(fr[10], 3), pyRound_(fr[11], 3), Math.trunc(fr[14]), Math.trunc(fr[15]), Math.trunc(fr[16]), fr[17]];
    if (HASZ) a.push(ixq(Zm, Z, (fr[1] || '(chua ghi)')));
    return a;
  });
  var projq = byProjL.map(function(r){ return {name:r.proj, bom:r.bom, f:r.st.Fitup, w:r.st.Welding, p:r.st.Painting,
    tf:r.ton.Fitup, tw:r.ton.Welding, tp:r.ton.Painting, pct:r.pct, status:r.status}; });

  /* GHEP THEO KY */
  var mode = 'thay-sach', OLD = (!opt.thaySach && old && old.rows && old.rows.length) ? old : null;
  var acts = R.filter(function(r){ return r[3] || r[4]; }).map(function(r){ var a = r[3] || '', b = r[4] || ''; return a > b ? a : b; });
  var KF = acts.length ? acts.reduce(function(m, x){ return x < m ? x : m; }) : '';
  var KT = acts.length ? acts.reduce(function(m, x){ return x > m ? x : m; }) : '';
  if (OLD) {
    var owd = OLD.rows.map(function(r){ return r[4]; }).filter(Boolean);
    var omin = owd.length ? owd.reduce(function(m, x){ return x < m ? x : m; }) : '';
    if (opt.ghep) mode = 'ghep';
    else if (omin && KF && omin < KF.slice(0, 8) + '01' &&
             ((+KF.slice(0, 4)) * 12 + (+KF.slice(5, 7))) - ((+omin.slice(0, 4)) * 12 + (+omin.slice(5, 7))) >= 2) mode = 'ghep';
  }
  if (opt.ghep && !OLD) throw new SpmLoi_('Che do ghep nhung khong doc duoc qcdata.js cu (da KHOA?).');
  if (mode === 'ghep') {
    var OP = OLD.P, OX = OLD.X, OT = OLD.T, OQ = OLD.Q, OPL = OLD.PL, OZ = OLD.Z;
    var inr = function(d){ return !!d && KF <= d && d <= KT; };
    var key = function(a, b, c, d){ return a + '\u0001' + b + '\u0001' + c + '\u0001' + d; };
    var kept = [], oldAcc = new Map(), wait = [];
    OLD.rows.forEach(function(r){
      var k = key(OP[r[0]], OX[r[1]], OT[r[2]], r[4]);
      if (inr(r[3]) || inr(r[4])) {
        if (r[4] && r[4] < KF && OPL[r[6]] !== 'Chưa QC') {
          if (!oldAcc.has(k)) oldAcc.set(k, [0, 0, 0, 0, 0, 0]);
          var a = oldAcc.get(k); for (var q = 0; q < 6; q++) a[q] += r[7 + q];
        }
        return;
      }
      kept.push(r);
      if (OPL[r[6]] === 'Chưa QC' && r[4] && r[4] < KF) wait.push(kept.length - 1);
    });
    var newAcc = new Map();
    R.forEach(function(r){
      if (r[4] && r[4] < KF) {
        var k = key(P[r[0]], X[r[1]], T[r[2]], r[4]);
        if (!newAcc.has(k)) newAcc.set(k, [0, 0, 0, 0, 0, 0]);
        var a = newAcc.get(k); for (var q = 0; q < 6; q++) a[q] += r[7 + q];
      }
    });
    var delta = new Map();
    newAcc.forEach(function(v, k){ if (!oldAcc.has(k)) oldAcc.set(k, [0, 0, 0, 0, 0, 0]); var o = oldAcc.get(k);
      delta.set(k, v.map(function(x, q){ return Math.max(x - o[q], 0); })); });
    var tru = 0, bo = {};
    wait.forEach(function(wi){
      var r = kept[wi] = kept[wi].slice(), k = key(OP[r[0]], OX[r[1]], OT[r[2]], r[4]), d = delta.get(k);
      if (!d) return;
      for (var q = 0; q < 6; q++) {
        var m = Math.min(r[7 + q], d[q]);
        r[7 + q] = q < 3 ? pyRound_(r[7 + q] - m, 3) : pyRound_(r[7 + q] - m, 0);
        d[q] -= m; if (q < 3) tru += m;
      }
      if (r[7] + r[8] + r[9] <= 0.0005) bo[wi] = 1;
    });
    HASZ = HASZ || !!(OZ && OZ.length);
    var M = [];
    kept.forEach(function(r, wi){
      if (bo[wi]) return;
      var z = (OZ && OZ.length && r.length > 14) ? OZ[r[14]] : '(chua ghi)';
      var a = [ixq(Pm, P, OP[r[0]]), ixq(Xm, X, OX[r[1]]), ixq(Tm, T, OT[r[2]]), r[3], r[4],
               ixq(Qm, Q, OQ[r[5]]), ixq(PLm, PL, OPL[r[6]])].concat(r.slice(7, 14));
      if (HASZ) a.push(ixq(Zm, Z, z));
      M.push(a);
    });
    if (HASZ) R.forEach(function(r){ if (r.length < 15) r.push(ixq(Zm, Z, '(chua ghi)')); });
    log.push('[GHEP THEO KY] File moi: ' + KF + ' -> ' + KT + ' | giu ' + M.length + ' dong cu ngoai ky, bo ' +
             (OLD.rows.length - kept.length) + ' dong cu trong ky, them ' + R.length + ' dong moi');
    log.push('Tru ' + pyRound_(tru, 1) + ' t "Chua QC" cu da duoc nghiem thu trong ky (' + Object.keys(bo).length + ' dong cu het cho -> bo)');
    R = M.concat(R);
    var pf = new Map();
    R.forEach(function(r){ var n = P[r[0]]; if (!pf.has(n)) pf.set(n, [0, 0, 0]); var a = pf.get(n); a[0] += r[7]; a[1] += r[8]; a[2] += r[9]; });
    var bomMap = new Map();
    (OLD.proj || []).forEach(function(q){ bomMap.set(q.name, q.bom); });
    projq.forEach(function(q){ if (q.bom > 0) bomMap.set(q.name, q.bom); });
    var pq = [];
    pf.forEach(function(v, nm){
      var b = bomMap.has(nm) ? bomMap.get(nm) : 0, pct = b ? pyRound_(v[2] / b * 100, 0) : 0;
      pq.push({name:nm, bom:b, f:pyRound_(v[0], 1), w:pyRound_(v[1], 1), p:pyRound_(v[2], 1),
               tf:pyRound_(Math.max(0, b - v[0]), 1), tw:pyRound_(Math.max(0, b - v[1]), 1), tp:pyRound_(Math.max(0, b - v[2]), 1),
               pct:pct, status:spmStatus_(pct, b)});
    });
    projq = pq.map(function(o, i){ return [o, i]; }).sort(function(a, b){ return (b[0].tp - a[0].tp) || (a[1] - b[1]); }).map(function(x){ return x[0]; });
    var wd2 = R.map(function(r){ return r[4]; }).filter(Boolean);
    log.push('Sau ghep: ' + R.length + ' dong | ngay lam ' + (wd2.length ? wd2.reduce(function(m, x){ return x < m ? x : m; }) : '-') +
             ' -> ' + (wd2.length ? wd2.reduce(function(m, x){ return x > m ? x : m; }) : '-'));
  } else {
    log.push('[THAY SACH] Ghi de toan bo bang file moi');
  }
  var sum = function(idx){ var s = 0; R.forEach(function(r){ s += r[idx]; }); return pyRound_(s, 1); };
  var obj = {updated:opt.updated || '', source:opt.source || 'spm.xlsx', P:P, X:X, T:T, Q:Q, PL:PL, rows:R, proj:projq,
             check:{f:sum(7), w:sum(8), p:sum(9)}};
  if (HASZ) obj.Z = Z;
  return {obj:obj, log:log, canhBao:canhBao, mode:mode, nFile:flat.length, KF:KF, KT:KT};
}
function spmText_(obj){ return 'window.QCDATA=' + JSON.stringify(obj) + ';'; }
function spmParseQcdata_(txt){
  var i = txt.indexOf('{'), j = txt.lastIndexOf('}');
  if (i < 0 || j <= i) return null;
  try { var o = JSON.parse(txt.slice(i, j + 1)); return (o && o.rows && o.rows.length) ? o : null; } catch (e) { return null; }
}

/*==================== PHAN GOOGLE (Drive / GitHub / Mail) ====================*/
function spmToken_(){
  var t = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!t) throw new SpmLoi_('Chua co GITHUB_TOKEN trong Script Properties.');
  return t;
}
function spmGh_(method, path, body, raw){
  var opt = {method:method, muteHttpExceptions:true, headers:{Authorization:'Bearer ' + spmToken_(),
             Accept: raw ? 'application/vnd.github.raw' : 'application/vnd.github+json', 'X-GitHub-Api-Version':'2022-11-28'}};
  if (body) { opt.contentType = 'application/json'; opt.payload = JSON.stringify(body); }
  var res = UrlFetchApp.fetch('https://api.github.com/repos/' + GH_OWNER + '/' + GH_REPO + path, opt);
  var code = res.getResponseCode();
  if (code >= 300) throw new SpmLoi_('GitHub ' + method + ' ' + path + ' -> HTTP ' + code + ': ' + res.getContentText().slice(0, 300));
  return raw ? res.getContentText('UTF-8') : JSON.parse(res.getContentText('UTF-8'));
}
function spmDocQcdataGithub_(){
  return spmGh_('get', '/contents/' + encodeURI(GH_PATH) + '?ref=' + GH_BRANCH, null, true);
}
/* Day 1 file len GitHub bang Git Data API (on dinh voi file > 1 MB) */
function spmDayGithub_(text, msg){
  var ref = spmGh_('get', '/git/ref/heads/' + GH_BRANCH);
  var headSha = ref.object.sha;
  var commit = spmGh_('get', '/git/commits/' + headSha);
  var blob = spmGh_('post', '/git/blobs', {content:Utilities.base64Encode(text, Utilities.Charset.UTF_8), encoding:'base64'});
  var tree = spmGh_('post', '/git/trees', {base_tree:commit.tree.sha, tree:[{path:GH_PATH, mode:'100644', type:'blob', sha:blob.sha}]});
  var nc = spmGh_('post', '/git/commits', {message:msg, tree:tree.sha, parents:[headSha]});
  spmGh_('patch', '/git/refs/heads/' + GH_BRANCH, {sha:nc.sha, force:false});
  return nc.sha;
}
function spmThuMuc_(ten){ var it = DriveApp.getFoldersByName(ten); return it.hasNext() ? it.next() : DriveApp.createFolder(ten); }
/* Doi .xlsx -> Google Sheet tam -> doc gia tri -> xoa file tam. Can bat Advanced Service "Drive API". */
function spmDocXlsx_(file){
  var tmp = Drive.Files.create({name:'_tmp_spm_' + Date.now(), mimeType:'application/vnd.google-apps.spreadsheet'}, file.getBlob());
  try {
    var sh = SpreadsheetApp.openById(tmp.id).getSheets()[0];
    return sh.getDataRange().getValues();
  } finally {
    try { DriveApp.getFileById(tmp.id).setTrashed(true); } catch (e) {}
  }
}
function spmMail_(tieuDe, noiDung){
  try { MailApp.sendEmail({to:MAIL_BAO, subject:'[SPM tu dong] ' + tieuDe, body:noiDung + '\n\n— ' + PHIEN_BAN_SPM + ' · che do ' + CHE_DO}); } catch (e) {}
}
function spmSoSanh_(cu, moi){
  var tong = function(D){ var m = new Map(); D.rows.forEach(function(r){ var n = D.P[r[0]]; if (!m.has(n)) m.set(n, [0, 0, 0]); var a = m.get(n); a[0] += r[7]; a[1] += r[8]; a[2] += r[9]; }); return m; };
  var a = tong(cu), b = tong(moi), lech = [];
  var ten = new Set(); a.forEach(function(v, k){ ten.add(k); }); b.forEach(function(v, k){ ten.add(k); });
  ten.forEach(function(k){ var x = a.get(k) || [0, 0, 0], y = b.get(k) || [0, 0, 0];
    var d = [0, 1, 2].map(function(i){ return Math.round((y[i] - x[i]) * 100) / 100; });
    if (d.some(function(v){ return Math.abs(v) >= 0.01; })) lech.push(k.slice(0, 50) + '  F ' + d[0] + '  W ' + d[1] + '  P ' + d[2]); });
  var goc = function(D){ var o = {}; Object.keys(D).forEach(function(k){ if (k !== 'updated' && k !== 'source') o[k] = D[k]; }); return JSON.stringify(o); };
  var giong = goc(cu) === goc(moi);
  return [giong ? '>>> GIONG HET ban dang tren web (moi so, moi dong) <<<' : '>>> KHAC ban dang tren web (xem chi tiet duoi) <<<',
          'So dong : ' + cu.rows.length + ' -> ' + moi.rows.length,
          'Fitup   : ' + cu.check.f + ' -> ' + moi.check.f,
          'Welding : ' + cu.check.w + ' -> ' + moi.check.w,
          'Painting: ' + cu.check.p + ' -> ' + moi.check.p,
          'Du an lech tan: ' + lech.length].concat(lech.slice(0, 30)).join('\n');
}

/** CHAY CHINH — Trigger moi 30' goi ham nay. */
function xuLySpmMoi(){
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    var up = spmThuMuc_(THU_MUC_UPLOAD), xong = spmThuMuc_(THU_MUC_XONG);
    var it = up.getFiles(), files = [];
    while (it.hasNext()) { var f = it.next(); if (/\.xlsx$/i.test(f.getName())) files.push(f); }
    if (!files.length) return;
    files.sort(function(a, b){ return b.getLastUpdated() - a.getLastUpdated(); });
    var file = files[0];
    var tz = Session.getScriptTimeZone() || 'Asia/Ho_Chi_Minh';
    var stamp = Utilities.formatDate(new Date(), tz, 'yyyyMMdd_HHmm');
    var oldTxt = spmDocQcdataGithub_(), old = spmParseQcdata_(oldTxt);
    if (!old) throw new SpmLoi_('qcdata.js tren GitHub khong doc duoc (da KHOA dang nhap?) — dung, khong ghi de.');
    var rows = spmDocXlsx_(file);
    var kq = spmXuLy_(rows, old, {source:'spm.xlsx', updated:Utilities.formatDate(new Date(), tz, 'dd/MM/yyyy')});
    var moi = kq.obj;
    /* chot chan truoc khi day */
    var loi = [];
    if (kq.mode !== 'ghep') loi.push('Khong o che do GHEP THEO KY (file phu toan bo lich su?) — can nguoi kiem tay.');
    if (moi.rows.length < old.rows.length * 0.9) loi.push('So dong giam qua 10% (' + old.rows.length + ' -> ' + moi.rows.length + ').');
    if (moi.check.f < old.check.f * 0.97) loi.push('Tong Fitup giam qua 3% (' + old.check.f + ' -> ' + moi.check.f + ').');
    if (kq.canhBao.length) loi = loi.concat(kq.canhBao);
    var bao = kq.log.join('\n') + '\n\n' + spmSoSanh_(old, moi);
    var txt = spmText_(moi);
    if (CHE_DO !== 'THAT' || loi.length) {
      xong.createFile('qcdata_THU_' + stamp + '.js', txt, 'application/javascript');
      spmMail_((loi.length ? 'DUNG — KHONG day: ' : 'BAN THU (chua day len web): ') + file.getName(),
               (loi.length ? 'LY DO DUNG:\n- ' + loi.join('\n- ') + '\n\n' : '') + bao +
               '\n\nBan thu da luu: ' + THU_MUC_XONG + '/qcdata_THU_' + stamp + '.js');
    } else {
      var sha = spmDayGithub_(txt, 'Cap nhat QC (Google SPM tu dong) ' + stamp);
      spmMail_('DA CAP NHAT web: ' + file.getName(), bao + '\n\nCommit: ' + sha.slice(0, 7));
    }
    file.setName(stamp + '_' + file.getName());
    file.moveTo(xong);
  } catch (e) {
    spmMail_('LOI — du lieu cu GIU NGUYEN', String(e && e.message || e) + '\n\n' + (e && e.stack || ''));
  } finally {
    lock.releaseLock();
  }
}

/** Kiem tra cau hinh (khong xu ly file, khong day gi). Chay tay 1 lan sau khi cai. */
function kiemTraCauHinh(){
  var out = [];
  out.push('Che do: ' + CHE_DO);
  out.push('Thu muc upload: ' + spmThuMuc_(THU_MUC_UPLOAD).getUrl());
  out.push('Thu muc da xu ly: ' + spmThuMuc_(THU_MUC_XONG).getUrl());
  try { var t = spmDocQcdataGithub_(), o = spmParseQcdata_(t); out.push('Doc GitHub qcdata.js: ' + (o ? ('OK ' + o.rows.length + ' dong, cap nhat ' + o.updated) : 'KHONG DOC DUOC')); }
  catch (e) { out.push('Doc GitHub LOI: ' + e.message); }
  try { var r = spmGh_('get', ''); out.push('Quyen ghi repo (push): ' + (r.permissions && r.permissions.push ? 'CO' : 'KHONG')); }
  catch (e) { out.push('Kiem quyen LOI: ' + e.message); }
  try { Drive.Files.list({pageSize:1}); out.push('Drive API (Advanced Service): OK'); }
  catch (e) { out.push('Drive API CHUA BAT: Services (+) -> Drive API -> Add'); }
  Logger.log(out.join('\n'));
}
function batLichSpm(){
  tatLichSpm();
  ScriptApp.newTrigger('xuLySpmMoi').timeBased().everyMinutes(30).create();
  Logger.log('Da bat lich: xuLySpmMoi moi 30 phut.');
}
function tatLichSpm(){
  ScriptApp.getProjectTriggers().forEach(function(t){ if (t.getHandlerFunction() === 'xuLySpmMoi') ScriptApp.deleteTrigger(t); });
}
