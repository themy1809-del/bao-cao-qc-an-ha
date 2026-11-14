/* kiem_tra/ui_audit.js — do giao dien theo skill ui-ux-pro-max + WCAG 2.1 AA (02/11/2026)
   Chay:  python3 -m http.server 8765 &   roi   node kiem_tra/ui_audit.js [trang.html ...]
   In ra moi trang x theme x co man: contrast (chu < 4.5:1), noLabel (o thieu nhan), clickDiv (bam duoc ma ban phim khong toi),
   emoji (emoji tuong hinh con hien), lt44 (nut < 44px tren man cam ung), loi JS. Ket qua dung: tat ca = 0.
   Ngoai le da biet: app.html dai tieu de do (do nham, thuc te ~5:1); link "Xem tat ca" trong cau (WCAG mien); o tich nam trong label. */
const {chromium}=require('playwright');
const AUDIT=()=>{
 function rgb(s){const m=s.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);return {r:p[0],g:p[1],b:p[2],a:p[3]==null?1:p[3]};}
 function lum(c){const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b);}
 function bgOf(el){let cs=[];for(let e=el;e;e=e.parentElement){const s=getComputedStyle(e);if(s.backgroundImage&&s.backgroundImage!=='none'&&!/gradient/.test(s.backgroundImage))return null;let c=rgb(s.backgroundColor);if(/gradient/.test(s.backgroundImage)){const g=s.backgroundImage.match(/rgba?\([^)]+\)/);if(g)c=rgb(g[0]);}if(c&&c.a>0){cs.push(c);if(c.a>=1)break;}}
   let base={r:255,g:255,b:255};if(cs.length&&cs[cs.length-1].a>=1)base=cs.pop();for(let i=cs.length-1;i>=0;i--){const c=cs[i];base={r:c.r*c.a+base.r*(1-c.a),g:c.g*c.a+base.g*(1-c.a),b:c.b*c.a+base.b*(1-c.a)};}return base;}
 const vis=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity>0.1;};
 const out={contrast:[],noName:[],noLabel:[],noAlt:[],small:[],clickDiv:[]};
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const seen=new Set();let n;
 while(n=walker.nextNode()){const t=n.textContent.trim();if(t.length<2)continue;const el=n.parentElement;if(!el||seen.has(el)||!vis(el))continue;seen.add(el);
   if(el.closest('#world'))continue; // 3D scene labels checked separately
   const s=getComputedStyle(el),fg=rgb(s.color),bg=bgOf(el);if(!fg||!bg)continue;
   const f={r:fg.r*fg.a+bg.r*(1-fg.a),g:fg.g*fg.a+bg.g*(1-fg.a),b:fg.b*fg.a+bg.b*(1-fg.a)};
   const L1=lum(f),L2=lum(bg),cr=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);const fs=parseFloat(s.fontSize),bold=+s.fontWeight>=700;
   const need=(fs>=24||(fs>=18.66&&bold))?3:4.5;if(cr<need)out.contrast.push({t:t.slice(0,40),sel:el.className||el.tagName,cr:+cr.toFixed(2),need,fs});}
 document.querySelectorAll('button,a[href],[role=button],select,input,textarea').forEach(e=>{if(!vis(e))return;
   const nm=(e.getAttribute('aria-label')||e.innerText||e.value||e.title||e.getAttribute('placeholder')||'').trim();
   if(/^(BUTTON|A)$/.test(e.tagName)&&!nm)out.noName.push(e.outerHTML.slice(0,90));
   if(/^(INPUT|SELECT|TEXTAREA)$/.test(e.tagName)&&e.type!=='hidden'){const lab=e.labels&&e.labels.length||e.getAttribute('aria-label')||e.closest('label');if(!lab)out.noLabel.push((e.id||'')+' '+(e.getAttribute('placeholder')||e.tagName));}
   const r=e.getBoundingClientRect();if(r.height<24||r.width<24)out.small.push((e.innerText||e.getAttribute('aria-label')||e.tagName).trim().slice(0,20)+' '+Math.round(r.width)+'x'+Math.round(r.height));});
 document.querySelectorAll('img').forEach(e=>{if(vis(e)&&!e.hasAttribute('alt'))out.noAlt.push(e.src.slice(-40));});
 document.querySelectorAll('[data-khu],[data-sel],[data-q],.clickable,tr.click,[data-moim],[data-mobang],[data-pms],[data-khnmo]').forEach(e=>{if(!vis(e))return;if(/^(BUTTON|A|SELECT|INPUT)$/.test(e.tagName))return;if(e.tabIndex<0&&!e.closest('button'))out.clickDiv.push((e.className||e.tagName)+':'+(e.innerText||'').trim().slice(0,20));});
 const agg=a=>{const m={};a.forEach(x=>{const k=typeof x==='string'?x.replace(/\d+x\d+$/,'').replace(/:.*/,''):x.sel+'|'+x.cr;m[k]=(m[k]||0)+1});return m;};
 return {n:{contrast:out.contrast.length,noName:out.noName.length,noLabel:out.noLabel.length,noAlt:out.noAlt.length,small:out.small.length,clickDiv:out.clickDiv.length},
  contrast:Object.values(out.contrast.reduce((m,x)=>{const k=x.sel+'|'+x.cr;if(!m[k])m[k]={...x,n:0};m[k].n++;return m;},{})).sort((a,b)=>a.cr-b.cr).slice(0,14),
  noName:out.noName.slice(0,6),noLabel:out.noLabel.slice(0,10),noAlt:out.noAlt.slice(0,5),small:agg(out.small),clickDiv:agg(out.clickDiv)};
};
const RX='[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{2712}\\u{2715}-\\u{27BF}\\u{2300}-\\u{23FF}]'; // ✓ ✔ (2713/2714) la dau chu duoc phep (CLAUDE.md 4B)
/* 14/11 harness: UA_BASE = goc URL (mac dinh http://localhost:8765/), UA_PRE = doan JS chay sau khi tai trang (vd bam tab), UA_WAIT = ms cho them */
const BASE=process.env.UA_BASE||'http://localhost:8765/',PRE=process.env.UA_PRE||'',WAIT=+process.env.UA_WAIT||0;
const PAGES=process.argv.slice(2).length?process.argv.slice(2):['qc.html','ban_do_qc.html','app.html','doc.html','kiem_tra_waiting.html','section_tracker.html','cong_cu_pc/binh_chon/binh_chon.html'];
(async()=>{const b=await chromium.launch();let bad=0;
for(const pg of PAGES)for(const th of ['dark','light'])for(const [w,h] of [[1400,900],[375,812]]){
  const c=await b.newContext({viewport:{width:w,height:h},hasTouch:w<900,isMobile:w<900});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.route(/^https?:\/\/(?!localhost)/,r=>r.abort());await p.goto(BASE+pg);await p.waitForTimeout(3000);if(PRE){await p.evaluate(PRE).catch(()=>{});await p.waitForTimeout(WAIT||1500);}
  await p.evaluate(t=>document.documentElement.setAttribute('data-theme',t),th);await p.waitForTimeout(200);
  const r=await p.evaluate(AUDIT);
  const emo=await p.evaluate(rx=>(document.body.innerText.match(new RegExp(rx,'gu'))||[]).length,RX);
  const lt44=w<900?await p.evaluate(()=>[...document.querySelectorAll('button,select,input:not([type=checkbox]):not([type=radio])')].filter(e=>{const q=e.getBoundingClientRect();return q.width>0&&q.height>0&&q.height<44}).length):0;
  const row={contrast:r.n.contrast,noLabel:r.n.noLabel,clickDiv:r.n.clickDiv,emoji:emo,lt44,loiJS:errs.length};bad+=Object.values(row).reduce((a,x)=>a+x,0);
  console.log(pg.padEnd(24),th.padEnd(6),String(w).padEnd(5),JSON.stringify(row));r.contrast.slice(0,3).forEach(x=>console.log('     tuong phan',x.cr,x.sel,x.t));
  await c.close();}
console.log(bad?'CON LOI: '+bad+' (xem tren; tru ngoai le da biet)':'DAT HET');await b.close();if(bad)process.exitCode=1;})();
