const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const S=JSON.parse(fs.readFileSync('script.json','utf8'));
const G=path.resolve('../gen'),F='file://'+path.resolve('../vid/fonts');
const LINES=[1,1,0,1,1,1];
const css=`@font-face{font-family:M;src:url(${F}/f1.ttf);font-weight:500}@font-face{font-family:M;src:url(${F}/f2.ttf);font-weight:800}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;font-family:M;background:transparent}`;
function hex(hi,count){let s='<div style="position:absolute;left:0;right:0;top:470px;display:flex;justify-content:center">';s+='<svg width="560" height="620" viewBox="0 0 560 620">';
 for(let i=0;i<6;i++){const y=540-i*100;const on=hi.includes(i);const c=on?'#ffd27a':'#b8913f';const f=on?'url(#gl)':'none';
  if(LINES[i])s+=`<rect x="80" y="${y}" width="400" height="48" rx="6" fill="${c}" filter="${f}"/>`;else s+=`<rect x="80" y="${y}" width="180" height="48" rx="6" fill="${c}" filter="${f}"/><rect x="300" y="${y}" width="180" height="48" rx="6" fill="${c}" filter="${f}"/>`;
  if(count&&i>=1)s+=`<text x="520" y="${y+40}" font-size="46" font-weight="800" fill="#ffd27a" font-family="M">${i}</text>`;}
 const nm=['初九','九二','六三','九四','九五','上九'];if(count||hi.length)for(const i of (count?[1,5]:hi))s+=`<text x="0" y="${540-i*100+38}" font-size="34" fill="#f3ead6" font-family="M">${nm[i]}</text>`;
 return s+'<defs><filter id="gl" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg></div>';}
function bgHtml(l){const b=l.bg;let img='',dark=0,extra='';
 const m=b.split(':');if(m[1]){img=`file://${G}/${m[1]}.jpg`;}
 if(m[0]==='hex'){dark=.62;extra=hex(l.hi||[],false);}
 if(m[0]==='count'){dark=.7;extra=hex([1,2,3,4,5],true);}
 if(b==='cta'){return `<html><head><style>${css} body{background:radial-gradient(ellipse at 50% 38%,#4a3a14 0%,#120f08 45%,#050505 100%)}</style></head><body>
 <div style="position:absolute;left:470px;width:140px;top:0;height:900px;background:linear-gradient(#ffe7a3cc,#ffd27a00);filter:blur(30px)"></div>
 <div style="position:absolute;left:290px;top:640px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,#ffe39a 0%,#c99a3a66 35%,#0000 70%);"></div>${hex([1],false).replace('top:470px','top:300px').replace(/#b8913f/g,'#d8b360')}</body></html>`;}
 return `<html><head><style>${css} body{background:#000}.im{position:absolute;left:-30px;top:0;width:1140px;height:2026px;object-fit:cover;object-position:center top}</style></head><body><img class="im" src="${img}"><div style="position:absolute;inset:0;background:rgba(0,0,0,${dark})"></div>${extra}</body></html>`;}
function txtHtml(l){const cap=l.c.split('\n').map(x=>x.replace(/「/g,'<span class=q>「').replace(/」/g,'」</span>')).join('<br>');
 const n=l.c.split('\n').length;const mx=Math.max(...l.c.split('\n').map(x=>x.length));const fs=Math.min(64,Math.floor(960/mx));
 return `<html><head><style>${css}
 .grad{position:absolute;left:0;right:0;bottom:0;height:900px;background:linear-gradient(#0000,#000c 45%,#000f)}
 .top{position:absolute;top:70px;width:100%;text-align:center;color:#d4ae5c;font-size:34px;letter-spacing:.5em;font-weight:500}
 .top:after{content:"";display:block;width:90px;height:2px;background:#d4ae5c88;margin:18px auto 0}
 .box{position:absolute;left:50px;right:50px;bottom:300px;display:flex;flex-direction:column;align-items:center;gap:30px}.cap{text-align:center;color:#fff;font-weight:800;font-size:${fs}px;line-height:1.55;text-shadow:0 4px 14px #000,0 0 4px #000;white-space:nowrap}
 .q{color:#ffe2a0}
 .tag{align-self:flex-start;background:#8e1c18;border:3px solid #d4ae5c;color:#fff;font-size:40px;font-weight:800;padding:8px 26px;letter-spacing:.12em}
 .ft{position:absolute;bottom:120px;width:100%;text-align:center;color:#d4ae5c;font-size:36px;letter-spacing:.6em}
 .ft:before{content:"";display:block;width:90px;height:2px;background:#d4ae5c88;margin:0 auto 22px}</style></head><body>
 <div class=grad></div><div class=top>高島易断 実占録</div><div class=box>${l.tag?`<div class=tag>${l.tag}</div>`:''}<div class=cap>${cap}</div></div><div class=ft>青龍孔一</div></body></html>`;}
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1080,height:1920}});fs.mkdirSync('f',{recursive:true});
 for(let i=0;i<S.length;i++){const id=String(i).padStart(2,'0');
  await p.goto('file://'+path.resolve('blank.html'));await p.setContent(bgHtml(S[i]),{waitUntil:'load'});await p.evaluate(async()=>{for(const im of document.images){if(!im.complete)await new Promise(r=>im.onload=im.onerror=r)}});await p.waitForTimeout(100);await p.screenshot({path:`f/${id}_bg.png`});
  await p.setContent(txtHtml(S[i]),{waitUntil:'load'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);await p.screenshot({path:`f/${id}_tx.png`,omitBackground:true});}
 await b.close();})();
