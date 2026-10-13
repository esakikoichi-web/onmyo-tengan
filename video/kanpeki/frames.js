// 各行を 1080x1920 のフルフレームに（背景＝g/<sc>.png＋字幕）。f/NN.png を出力。
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const L=JSON.parse(fs.readFileSync('script.json','utf8')).lines;
const F='file://'+path.resolve('../vid/fonts');
const css=`
@font-face{font-family:M;src:url(${F}/f1.ttf);font-weight:500}
@font-face{font-family:MB;src:url(${F}/f2.ttf);font-weight:800}
@font-face{font-family:R;src:url(${F}/f3.ttf);font-weight:500}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#060407;font-family:M;color:#f3ead6}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.top{position:absolute;top:0;left:0;right:0;height:300px;background:linear-gradient(180deg,rgba(6,4,7,.85),rgba(6,4,7,0))}
.btm{position:absolute;bottom:0;left:0;right:0;height:720px;background:linear-gradient(0deg,rgba(5,3,6,.94) 46%,rgba(5,3,6,0))}
.eyebrow{position:absolute;top:66px;left:0;right:0;text-align:center;font-family:R;font-size:36px;letter-spacing:.44em;color:#d9b45a}
.sub{position:absolute;bottom:250px;left:70px;right:70px;text-align:center;font-family:MB;font-weight:800;font-size:72px;line-height:1.5;white-space:pre-line;text-shadow:0 5px 26px rgba(0,0,0,.92)}
.hl{color:#9ce0b0;text-shadow:0 0 22px rgba(130,220,160,.45),0 5px 26px rgba(0,0,0,.92)}
.brand{position:absolute;bottom:120px;left:0;right:0;text-align:center;font-family:R;font-size:38px;letter-spacing:.44em;color:#c6a455}
.rule{position:absolute;bottom:196px;left:50%;transform:translateX(-50%);width:110px;height:2px;background:linear-gradient(90deg,transparent,#8a7334,transparent)}
`;
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 fs.mkdirSync('f',{recursive:true});
 for(let i=0;i<L.length;i++){
  const img='data:image/png;base64,'+fs.readFileSync(`g/${L[i].sc}.png`).toString('base64');
  const sub=L[i].sub.replace(/“完璧”|「完璧」|完璧/g,m=>`<span class="hl">${m}</span>`);
  await p.setContent(`<html><head><style>${css}</style></head><body>
   <div class="bg" style="background-image:url('${img}')"></div>
   <div class="top"></div><div class="btm"></div>
   <div class="eyebrow">語 源 の 話</div>
   <div class="sub">${sub}</div>
   <div class="rule"></div><div class="brand">青 龍 孔 一</div>
   </body></html>`);
  await p.evaluate(()=>Promise.all([document.fonts.ready,...[...document.images].map(x=>x.decode().catch(()=>0))]));
  await p.screenshot({path:`f/${String(i).padStart(2,'0')}.png`});
 }
 await b.close();console.log('frames ok');
})();
