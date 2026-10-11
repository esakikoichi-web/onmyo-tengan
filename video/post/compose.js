// 易経の投稿画像を作る。post.json を読んで 1080x1920 の画像を出力。
// post.json: {img, eyebrow, title, ka, yomi, body, out}  bodyは〈…〉で金色強調。
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=JSON.parse(fs.readFileSync(process.argv[2]||'post.json','utf8'));
const F='file://'+path.resolve('../vid/fonts');
const img='data:image/png;base64,'+fs.readFileSync(D.img).toString('base64');
const css=`
@font-face{font-family:M;src:url(${F}/f1.ttf);font-weight:500}
@font-face{font-family:MB;src:url(${F}/f2.ttf);font-weight:800}
@font-face{font-family:R;src:url(${F}/f3.ttf);font-weight:500}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#0a0710;font-family:M;color:#f3ead6}
.bg{position:absolute;inset:0;background-image:url('${img}');background-size:cover;background-position:center;filter:brightness(.9)}
.top{position:absolute;top:0;left:0;right:0;height:560px;background:linear-gradient(180deg,rgba(8,6,14,.93) 32%,rgba(8,6,14,0))}
.btm{position:absolute;bottom:0;left:0;right:0;height:720px;background:linear-gradient(0deg,rgba(6,4,10,.96) 56%,rgba(6,4,10,0))}
.eyebrow{position:absolute;top:70px;left:0;right:0;text-align:center;font-family:R;font-size:38px;letter-spacing:.42em;color:#d9b45a}
.title{position:absolute;top:150px;left:60px;right:60px;text-align:center;font-family:MB;font-weight:800;font-size:84px;line-height:1.34;text-shadow:0 4px 24px rgba(0,0,0,.85)}
.ka{position:absolute;top:400px;left:0;right:0;text-align:center;font-family:MB;font-size:52px;letter-spacing:.3em;color:#f3cf74;text-shadow:0 2px 14px rgba(0,0,0,.85)}
.ka small{font-family:R;font-size:30px;letter-spacing:.15em;color:#cdb77f;display:block;margin-top:8px}
.body{position:absolute;bottom:230px;left:72px;right:72px;text-align:center;font-family:MB;font-weight:800;font-size:60px;line-height:1.58;white-space:pre-line;text-shadow:0 4px 22px rgba(0,0,0,.9)}
.hl{color:#f3cf74;text-shadow:0 0 22px rgba(243,207,116,.5),0 4px 22px rgba(0,0,0,.9)}
.brand{position:absolute;bottom:118px;left:0;right:0;text-align:center;font-family:R;font-size:40px;letter-spacing:.44em;color:#c6a455}
.rule{position:absolute;bottom:196px;left:50%;transform:translateX(-50%);width:120px;height:2px;background:linear-gradient(90deg,transparent,#8a7334,transparent)}
`;
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.setContent(`<html><head><style>${css}</style></head><body>
  <div class="bg"></div><div class="top"></div><div class="btm"></div>
  <div class="eyebrow">${D.eyebrow||'易で読み解く'}</div>
  <div class="title">${D.title.replace(/\n/g,'<br>')}</div>
  <div class="ka">${D.ka}<small>${D.yomi}</small></div>
  <div class="body">${D.body.replace(/〈/g,'<span class="hl">').replace(/〉/g,'</span>')}</div>
  <div class="rule"></div><div class="brand">青 龍 孔 一</div>
  </body></html>`);
 await p.evaluate(()=>Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode().catch(()=>0))]));
 await p.screenshot({path:D.out});
 await b.close();console.log('ok',D.out);
})();
