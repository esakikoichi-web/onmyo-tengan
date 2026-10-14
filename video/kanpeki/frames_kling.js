// Kling動画に重ねる透明オーバーレイ（背景なし）。字幕・人物名タグ・フッター（透かし隠し）。fo/NN.png（透過）。
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const L=JSON.parse(fs.readFileSync('script.json','utf8')).lines;
const F='file://'+path.resolve('../vid/fonts');
const css=`
@font-face{font-family:M;src:url(${F}/f1.ttf);font-weight:500}
@font-face{font-family:MB;src:url(${F}/f2.ttf);font-weight:800}
@font-face{font-family:MIN;src:url(${F}/f1.ttf);font-weight:500}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:transparent;font-family:M;color:#f3ead6}
.top{position:absolute;top:0;left:0;right:0;height:360px;background:linear-gradient(180deg,rgba(6,4,7,.82),rgba(6,4,7,0))}
.btm{position:absolute;bottom:0;left:0;right:0;height:760px;background:linear-gradient(0deg,rgba(5,3,6,.96) 30%,rgba(5,3,6,.55) 55%,rgba(5,3,6,0))}
.footer{position:absolute;bottom:0;left:0;right:0;height:104px;background:#050306}
.eyebrow{position:absolute;top:60px;left:0;right:0;text-align:center;font-family:MIN;font-size:34px;letter-spacing:.44em;color:#d9b45a}
/* 登場人物：テレビの下テロップ風。その人の下に国名＋名前（明朝）。複数人は各人の下に。 */
.nametag{position:absolute;transform:translate(-50%,-50%);display:flex;align-items:stretch;font-family:MB;font-weight:800;color:#f3ead6;text-shadow:0 3px 16px rgba(0,0,0,.98);white-space:nowrap}
.nametag .kuni{font-family:MB;font-weight:800;font-size:34px;color:#1a0f08;background:#d9b45a;padding:5px 15px;display:flex;align-items:center}
.nametag .nm{font-family:MB;font-weight:800;font-size:42px;padding:3px 20px;background:linear-gradient(90deg,rgba(120,20,22,.97),rgba(70,10,12,.94));border:2px solid #d9b45a;border-left:none;letter-spacing:.06em;display:flex;align-items:center}
.sub{position:absolute;bottom:250px;left:70px;right:70px;text-align:center;font-family:MB;font-weight:800;font-size:72px;line-height:1.5;white-space:pre-line;text-shadow:0 5px 26px rgba(0,0,0,.98),0 0 10px rgba(0,0,0,.8)}
.hl{color:#9ce0b0;text-shadow:0 0 22px rgba(130,220,160,.5),0 5px 26px rgba(0,0,0,.95)}
.brand{position:absolute;bottom:34px;left:0;right:0;text-align:center;font-family:MIN;font-size:36px;letter-spacing:.44em;color:#c6a455}
.rule{position:absolute;bottom:120px;left:50%;transform:translateX(-50%);width:110px;height:2px;background:linear-gradient(90deg,transparent,#8a7334,transparent)}
`;
// カットindex→ そのカットに映る人物の名札（x,yは画面比率＝人物の下あたり）
const TAGS={
 3:[{k:'秦',n:'昭王',x:0.50,y:0.66}],
 5:[{k:'趙',n:'藺相如',x:0.50,y:0.70}],
 6:[{k:'趙',n:'藺相如',x:0.27,y:0.64},{k:'秦',n:'昭王',x:0.74,y:0.64}],
 7:[{k:'趙',n:'藺相如',x:0.55,y:0.70}],
 8:[{k:'趙',n:'藺相如',x:0.28,y:0.66},{k:'秦',n:'昭王',x:0.73,y:0.62}],
 10:[{k:'秦',n:'昭王',x:0.46,y:0.40},{k:'趙',n:'藺相如',x:0.60,y:0.72}],
};
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 fs.mkdirSync('fo',{recursive:true});
 for(let i=0;i<L.length;i++){
  const sub=L[i].sub.replace(/“完璧”|「完璧」|完璧/g,m=>`<span class="hl">${m}</span>`);
  const nm=(TAGS[i]||[]).map(t=>`<div class="nametag" style="left:${t.x*1080}px;top:${t.y*1920}px"><span class="kuni">${t.k}</span><span class="nm">${t.n}</span></div>`).join('');
  await p.setContent(`<html><head><style>${css}</style></head><body>
   <div class="top"></div><div class="btm"></div><div class="footer"></div>
   <div class="eyebrow">語 源 の 話</div>
   ${nm}
   <div class="sub">${sub}</div>
   <div class="rule"></div><div class="brand">青 龍 孔 一</div>
   </body></html>`);
  await p.evaluate(()=>document.fonts.ready);
  await p.screenshot({path:`fo/${String(i).padStart(2,'0')}.png`,omitBackground:true});
 }
 await b.close();console.log('overlays ok');
})();
