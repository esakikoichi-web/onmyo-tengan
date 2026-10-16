const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const L=JSON.parse(fs.readFileSync('script.json','utf8')).lines;const ART=require('./art.js');
const F='file://'+path.resolve('../vid/fonts');
const css=`@font-face{font-family:M;src:url(${F}/f1.ttf);font-weight:500}@font-face{font-family:M;src:url(${F}/f2.ttf);font-weight:800}@font-face{font-family:R;src:url(${F}/f3.ttf);font-weight:500}@font-face{font-family:R;src:url(${F}/f4.ttf);font-weight:700}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;font-family:M;color:#f3ead6;background:transparent}
.hd{position:absolute;top:70px;left:0;right:0;text-align:center}.hd .a{font-size:40px;color:#c9a24a;letter-spacing:.3em}.hd .b{font-size:72px;font-weight:800;letter-spacing:.16em;margin-top:10px}
.sub{position:absolute;left:50px;right:50px;top:1390px;bottom:240px;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:800;font-size:78px;line-height:1.45;white-space:pre-line;text-shadow:0 4px 18px rgba(0,0,0,.6)}
.who{display:block;font-family:R;font-weight:700;font-size:40px;color:#14162a;background:#c9a24a;border-radius:30px;padding:4px 26px;margin:0 auto 18px;width:max-content}
.ft{position:absolute;bottom:110px;left:0;right:0;text-align:center;font-size:40px;color:#c9a24a;letter-spacing:.25em}
.cta2{font-size:64px;color:#e8b84c;display:block;margin-top:24px}
.art{width:1080px;height:1080px}`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});fs.mkdirSync('f',{recursive:true});
 const done={};
 for(let i=0;i<L.length;i++){const ln=L[i];
  if(!done[ln.sc]){await p.setViewportSize({width:1080,height:1080});await p.setContent(`<html><head><style>${css}</style></head><body style="width:1080px;height:1080px">${ART[ln.sc]().replace('<svg ','<svg class="art" ')}</body></html>`);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:`f/art_${ln.sc}.png`});done[ln.sc]=1;}
  await p.setViewportSize({width:1080,height:1920});
  const who=ln.who==='N'?'':`<span class="who">${ln.who}</span>`;
  const sub=ln.sc==='cta'?`${ln.sub}<span class="cta2">青龍孔一　公式LINE</span>`:ln.sub;
  await p.setContent(`<html><head><style>${css}</style></head><body><div class="hd"><div class="a">明治の易者 実話</div><div class="b">魚を貫く針</div></div><div class="sub"><div>${who}${sub}</div></div><div class="ft">易の名人 高島嘉右衛門の実占より</div></body></html>`);
  await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:`f/t_${String(i).padStart(2,'0')}.png`,omitBackground:true});}
 await b.close();console.log('ok');})();
