// edo_times風：フルbg画像＋大きい明朝テロップ（白＋赤強調）。ブランド名なし。f/NN.png。
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const L=JSON.parse(fs.readFileSync('script.json','utf8')).lines;
const F='file://'+path.resolve('../vid/fonts');
const css=`
@font-face{font-family:MIN;src:url(${F}/f2.ttf);font-weight:800}   /* Noto Serif JP = 明朝 */
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#000;font-family:MIN}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.sh{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.7) 10%,rgba(0,0,0,.05) 42%,rgba(0,0,0,.35))}
.cap{position:absolute;left:60px;right:60px;top:52%;transform:translateY(-50%);text-align:center;
 font-family:MIN;font-weight:800;font-size:80px;line-height:1.5;white-space:pre-line;color:#fff;
 -webkit-text-stroke:9px #1a1206;paint-order:stroke fill;text-shadow:0 6px 26px rgba(0,0,0,.9)}
.hl{color:#ff4d3d;-webkit-text-stroke:9px #230a06}
`;
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 fs.mkdirSync('f',{recursive:true});
 for(let i=0;i<L.length;i++){
  const img='data:image/png;base64,'+fs.readFileSync(`g/${L[i].sc}.png`).toString('base64');
  const cap=L[i].sub.replace(/〈/g,'<span class="hl">').replace(/〉/g,'</span>');
  await p.setContent(`<html><head><style>${css}</style></head><body>
   <div class="bg" style="background-image:url('${img}')"></div><div class="sh"></div>
   <div class="cap">${cap}</div></body></html>`);
  await p.evaluate(()=>Promise.all([document.fonts.ready,...[...document.images].map(x=>x.decode().catch(()=>0))]));
  await p.screenshot({path:`f/${String(i).padStart(2,'0')}.png`});
 }
 await b.close();console.log('frames ok');
})();
