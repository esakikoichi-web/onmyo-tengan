const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const F='file://'+path.resolve('../vid/fonts');
const img='data:image/png;base64,'+fs.readFileSync('katen.png').toString('base64');
const css=`
@font-face{font-family:M;src:url(${F}/f1.ttf);font-weight:500}
@font-face{font-family:MB;src:url(${F}/f2.ttf);font-weight:800}
@font-face{font-family:R;src:url(${F}/f3.ttf);font-weight:500}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#0a0710;font-family:M;color:#f3ead6}
.bg{position:absolute;inset:0;background-image:url('${img}');background-size:cover;background-position:center;filter:brightness(.92)}
.top{position:absolute;top:0;left:0;right:0;height:560px;background:linear-gradient(180deg,rgba(8,6,14,.92) 30%,rgba(8,6,14,0))}
.btm{position:absolute;bottom:0;left:0;right:0;height:760px;background:linear-gradient(0deg,rgba(6,4,10,.96) 58%,rgba(6,4,10,0))}
.eyebrow{position:absolute;top:70px;left:0;right:0;text-align:center;font-family:R;font-size:38px;letter-spacing:.42em;color:#d9b45a}
.title{position:absolute;top:140px;left:60px;right:60px;text-align:center;font-family:MB;font-weight:800;font-size:82px;line-height:1.35;text-shadow:0 4px 24px rgba(0,0,0,.8)}
.ka{position:absolute;top:385px;left:0;right:0;text-align:center;font-family:MB;font-size:52px;letter-spacing:.3em;color:#f3cf74;text-shadow:0 2px 14px rgba(0,0,0,.8)}
.ka small{font-family:R;font-size:30px;letter-spacing:.15em;color:#cdb77f;display:block;margin-top:8px}
.body{position:absolute;bottom:230px;left:72px;right:72px;text-align:center;font-family:MB;font-weight:800;font-size:58px;line-height:1.6;white-space:pre-line;text-shadow:0 4px 22px rgba(0,0,0,.85)}
.hl{color:#f3cf74;text-shadow:0 0 22px rgba(243,207,116,.5),0 4px 22px rgba(0,0,0,.85)}
.brand{position:absolute;bottom:118px;left:0;right:0;text-align:center;font-family:R;font-size:40px;letter-spacing:.44em;color:#c6a455}
.rule{position:absolute;bottom:196px;left:50%;transform:translateX(-50%);width:120px;height:2px;background:linear-gradient(90deg,transparent,#8a7334,transparent)}
`;
const body=`手に入れることより、\n〈持ち続ける〉ことの方が、難しい。`;
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.setContent(`<html><head><style>${css}</style></head><body>
  <div class="bg"></div><div class="top"></div><div class="btm"></div>
  <div class="eyebrow">易で読み解く</div>
  <div class="title">全てを手に入れる<br>方法とは？</div>
  <div class="ka">火天大有<small>か て ん た い ゆ う</small></div>
  <div class="body">${body.replace(/〈/g,'<span class="hl">').replace(/〉/g,'</span>')}</div>
  <div class="rule"></div><div class="brand">青 龍 孔 一</div>
  </body></html>`);
 await p.evaluate(()=>Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode().catch(()=>0))]));
 await p.screenshot({path:'火天大有_投稿.png'});
 await b.close();console.log('ok');
})();
