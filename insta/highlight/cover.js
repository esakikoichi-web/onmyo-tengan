const {chromium}=require('playwright');const path=require('path');
const F='file://'+path.resolve('../vid/fonts');const OUT='/home/user/onmyo-tengan/insta/highlight';
const ch=process.argv[2]||'初',name=process.argv[3]||'hatsu';
const css=`@font-face{font-family:S;src:url(${F}/sm8.ttf);font-weight:800}*{margin:0}body{width:1080px;height:1920px;overflow:hidden;background:radial-gradient(circle at 50% 50%,#1d2f63 0%,#121e45 40%,#0a1230 100%);display:flex;align-items:center;justify-content:center}
.k{font-family:S;font-weight:800;font-size:660px;line-height:1;color:#d9b56c;background:linear-gradient(170deg,#f1d79b 0%,#d2a75a 55%,#a97f3a 100%);-webkit-background-clip:text;color:transparent;transform:translateY(-10px)}`;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1080,height:1920}});await p.goto('file://'+path.resolve('blank.html'));
 await p.setContent(`<html><head><style>${css}</style></head><body><div class=k>${ch}</div></body></html>`);
 await p.evaluate(async()=>{await document.fonts.load('800 100px S','初');await document.fonts.ready});
 if(!await p.evaluate(()=>document.fonts.check('800 100px S','初')))throw new Error('font');
 await p.screenshot({path:`${OUT}/${name}.png`});await b.close();})();
