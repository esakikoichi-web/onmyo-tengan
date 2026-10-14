const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const C=JSON.parse(fs.readFileSync('cap.json','utf8'));const F='file://'+path.resolve('../vid/fonts');
fs.writeFileSync('blank.html','<html></html>');
const css=`@font-face{font-family:S;src:url(${F}/sm8.ttf);font-weight:800}*{margin:0;font-family:S}body{width:1080px;height:1920px;background:transparent;overflow:hidden}
.cov{position:absolute;left:0;right:0;top:1280px;height:520px;background:linear-gradient(#0000 0%,#000e 22%,#000 40%,#000 85%,#0000 100%)}
.cap{position:absolute;left:30px;right:30px;top:1390px;height:330px;display:flex;align-items:center;justify-content:center;text-align:center;color:#fff;font-weight:800;line-height:1.6;text-shadow:0 3px 10px #000}
.k{color:#9fe0b0}`;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1080,height:1920}});await p.goto('file://'+path.resolve('blank.html'));
for(let i=0;i<C.length;i++){const t=C[i][2];const mx=Math.max(...t.split('\n').map(x=>x.length));const fs_=Math.min(60,Math.floor(1000/mx));
 const h=t.split('\n').map(x=>x.replace(/「完璧」/g,'「<span class=k>完璧</span>」')).join('<br>');
 await p.setContent(`<html><head><style>${css}</style></head><body><div class=cov></div><div class=cap style="font-size:${fs_}px"><div>${h}</div></div></body></html>`);
 await p.evaluate(async()=>{await document.fonts.load('800 40px S','完');await document.fonts.ready});
 if(!await p.evaluate(()=>document.fonts.check('800 40px S','璧')))throw new Error('font');
 await p.screenshot({path:`c${String(i).padStart(2,'0')}.png`,omitBackground:true});}
await b.close();})();
