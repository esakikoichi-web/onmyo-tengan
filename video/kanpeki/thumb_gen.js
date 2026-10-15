const {chromium}=require('playwright');const fs=require('fs');
function img(p){return 'data:image/png;base64,'+fs.readFileSync(p).toString('base64');}
const variants=[
 {bg:'g/ikari.png',out:'thumb/t1.png',eyebrow:'語 源 の 話',big:'完璧',sub:'その由来、知ってた？',pos:'center'},
 {bg:'g/ikari.png',out:'thumb/t2.png',eyebrow:'',big:'「完璧」は\n命がけだった',sub:'',pos:'center',small:true},
 {bg:'g/kanpeki.png',out:'thumb/t3.png',eyebrow:'易 で 読 み 解 く',big:'完璧',sub:'本当の意味とは',pos:'center'},
];
const css=(v)=>`
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#000;font-family:'Shippori Mincho'}
.bg{position:absolute;inset:0;background:url('${img(v.bg)}') center/cover}
.sh{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.85) 8%,rgba(0,0,0,.15) 45%,rgba(0,0,0,.55))}
.eyebrow{position:absolute;top:120px;left:0;right:0;text-align:center;font-size:44px;letter-spacing:.44em;color:#f0d98a;text-shadow:0 4px 18px #000}
.big{position:absolute;top:50%;left:40px;right:40px;transform:translateY(-55%);text-align:center;font-weight:800;color:#fff;
 font-size:${v.small?170:300}px;line-height:1.08;white-space:pre-line;
 -webkit-text-stroke:${v.small?14:22}px #2a0606;paint-order:stroke fill;text-shadow:0 10px 40px rgba(0,0,0,.95)}
.hlred{color:#ff3b30;-webkit-text-stroke:22px #2a0606}
.sub{position:absolute;bottom:360px;left:0;right:0;text-align:center;font-weight:800;font-size:72px;color:#f7ecc8;
 -webkit-text-stroke:9px #1a1206;paint-order:stroke fill;text-shadow:0 6px 24px #000}
`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});fs.mkdirSync('thumb',{recursive:true});
for(const v of variants){
 const big=v.out.endsWith('t1.png')||v.out.endsWith('t3.png')?`<span class="hlred">${v.big}</span>`:v.big;
 await p.setContent(`<html><head><meta charset="utf-8"><style>${css(v)}</style></head><body>
  <div class="bg"></div><div class="sh"></div>
  ${v.eyebrow?`<div class="eyebrow">${v.eyebrow}</div>`:''}
  <div class="big">${big}</div>
  ${v.sub?`<div class="sub">${v.sub}</div>`:''}
  </body></html>`);
 await p.evaluate(()=>document.fonts.ready);
 await p.screenshot({path:v.out});
}
await b.close();console.log('thumbs ok');})();
