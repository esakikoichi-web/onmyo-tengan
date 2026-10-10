// 静かな暗い画＋大きな文字（顔なし・テキスト主役）。各行を1080x1920のフルフレームPNGに。
// 〈…〉で囲んだ語は金色強調。
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const L=JSON.parse(fs.readFileSync('script.json','utf8')).lines;
const F='file://'+path.resolve('../vid/fonts');
const css=`
@font-face{font-family:M;src:url(${F}/f1.ttf);font-weight:500}
@font-face{font-family:M;src:url(${F}/f2.ttf);font-weight:800}
@font-face{font-family:R;src:url(${F}/f3.ttf);font-weight:500}
*{margin:0;box-sizing:border-box}
html,body{width:1080px;height:1920px}
body{position:relative;overflow:hidden;font-family:M;color:#efe7d4;
 background:radial-gradient(130% 80% at 50% 26%, #1a1630 0%, #0d0b17 55%, #070509 100%);}
.glow{position:absolute;top:-180px;left:50%;transform:translateX(-50%);width:900px;height:900px;border-radius:50%;
 background:radial-gradient(circle, rgba(232,184,76,.16) 0%, rgba(232,184,76,0) 62%);filter:blur(8px)}
.vig{position:absolute;inset:0;box-shadow:inset 0 0 420px 80px rgba(0,0,0,.72)}
.wrap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 84px}
.txt{text-align:center;font-weight:800;font-size:74px;line-height:1.62;white-space:pre-line;
 text-shadow:0 6px 30px rgba(0,0,0,.6);letter-spacing:.02em}
.hl{color:#f3cf74;text-shadow:0 0 26px rgba(243,207,116,.5),0 6px 30px rgba(0,0,0,.6)}
.brand{position:absolute;bottom:92px;left:0;right:0;text-align:center;font-family:R;
 font-size:40px;letter-spacing:.42em;color:#b9994f;opacity:.85}
.rule{position:absolute;bottom:170px;left:50%;transform:translateX(-50%);width:120px;height:2px;
 background:linear-gradient(90deg,transparent,#8a7334,transparent);opacity:.7}
`;
function fmt(s){return s.replace(/〈/g,'<span class="hl">').replace(/〉/g,'</span>');}
(async()=>{
 const b=await chromium.launch();
 const p=await b.newPage({viewport:{width:1080,height:1920}});
 fs.mkdirSync('f',{recursive:true});
 for(let i=0;i<L.length;i++){
  const html=`<html><head><style>${css}</style></head><body>
   <div class="glow"></div>
   <div class="wrap"><div class="txt">${fmt(L[i].sub)}</div></div>
   <div class="rule"></div><div class="brand">青 龍 孔 一</div>
   <div class="vig"></div></body></html>`;
  await p.setContent(html);
  await p.evaluate(()=>document.fonts.ready);
  await p.screenshot({path:`f/${String(i).padStart(2,'0')}.png`});
 }
 await b.close();console.log('frames ok');
})();
