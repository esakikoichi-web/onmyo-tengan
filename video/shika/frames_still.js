// 静止画テスト用：g/<sc>.png を背景に、明朝・自動フィット字幕を乗せて f/NN.png を出力。
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const L=JSON.parse(fs.readFileSync('script.json','utf8')).lines;
const css=`
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#060407;font-family:'Shippori Mincho';color:#f3ead6}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.top{position:absolute;top:0;left:0;right:0;height:300px;background:linear-gradient(180deg,rgba(6,4,7,.75),rgba(6,4,7,0))}
.btm{position:absolute;bottom:0;left:0;right:0;height:720px;background:linear-gradient(0deg,rgba(5,3,6,.94) 40%,rgba(5,3,6,0))}
.eyebrow{position:absolute;top:60px;left:0;right:0;text-align:center;font-family:'Shippori Mincho';font-size:34px;letter-spacing:.44em;color:#d9b45a}
.sub{position:absolute;bottom:250px;left:56px;right:56px;text-align:center;font-family:'Shippori Mincho';font-weight:800;line-height:1.46;text-shadow:0 5px 26px rgba(0,0,0,.98),0 0 10px rgba(0,0,0,.85)}
.sub .ln{white-space:nowrap;display:block}
.hl{color:#9ce0b0;text-shadow:0 0 22px rgba(130,220,160,.5),0 5px 26px rgba(0,0,0,.95)}
.brand{position:absolute;bottom:118px;left:0;right:0;text-align:center;font-family:'Shippori Mincho';font-size:36px;letter-spacing:.44em;color:#c6a455}
.rule{position:absolute;bottom:196px;left:50%;transform:translateX(-50%);width:110px;height:2px;background:linear-gradient(90deg,transparent,#8a7334,transparent)}
`;
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 fs.mkdirSync('f',{recursive:true});
 for(let i=0;i<L.length;i++){
  const img='data:image/png;base64,'+fs.readFileSync(`g/${L[i].sc}.png`).toString('base64');
  const subLines=L[i].sub.split('\n').map(line=>line.replace(/“完璧”|「完璧」|完璧/g,m=>`<span class="hl">${m}</span>`)).map(h=>`<div class="ln">${h}</div>`).join('');
  await p.setContent(`<html><head><style>${css}</style></head><body>
   <div class="bg" style="background-image:url('${img}')"></div>
   <div class="top"></div><div class="btm"></div>
   <div class="eyebrow">易 で 読 み 解 く</div>
   <div class="sub">${subLines}</div>
   <div class="rule"></div><div class="brand">青 龍 孔 一</div>
   </body></html>`);
  await p.evaluate(()=>document.fonts.ready);
  await p.evaluate(()=>{const s=document.querySelector('.sub');const ls=[...s.querySelectorAll('.ln')];const mw=s.clientWidth,mh=560;let z=72;s.style.fontSize=z+'px';const fit=()=>ls.every(l=>l.scrollWidth<=mw)&&s.scrollHeight<=mh;while(z>30&&!fit()){z-=2;s.style.fontSize=z+'px';}});
  await p.screenshot({path:`f/${String(i).padStart(2,'0')}.png`});
 }
 await b.close();console.log('frames ok');
})();
