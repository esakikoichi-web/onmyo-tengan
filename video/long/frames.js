const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const S=JSON.parse(fs.readFileSync('script.json','utf8'));
const F='file://'+path.resolve('fonts');
const TRI={"乾":[1,1,1],"兌":[1,1,0],"離":[1,0,1],"震":[1,0,0],"巽":[0,1,1],"坎":[0,1,0],"艮":[0,0,1],"坤":[0,0,0]};
const G={23:{name:"山地剥",up:"艮",lo:"坤"},20:{name:"風地観",up:"巽",lo:"坤"}};
function hexsvg(n,mv,w){const g=G[n];const b=TRI[g.lo].concat(TRI[g.up]);let s=`<svg width="${w}" height="${w*1.05}" viewBox="0 0 200 210">`;
 for(let i=0;i<6;i++){const y=180-i*34,c=i===mv?'#e8604c':'#c9a24a';if(b[i])s+=`<rect x="10" y="${y}" width="180" height="20" rx="3" fill="${c}"/>`;else s+=`<rect x="10" y="${y}" width="78" height="20" rx="3" fill="${c}"/><rect x="112" y="${y}" width="78" height="20" rx="3" fill="${c}"/>`;}
 return s+'</svg>';}
const css=`@font-face{font-family:M;src:url(${F}/f1.ttf);font-weight:500}@font-face{font-family:M;src:url(${F}/f2.ttf);font-weight:800}@font-face{font-family:R;src:url(${F}/f3.ttf);font-weight:500}@font-face{font-family:R;src:url(${F}/f4.ttf);font-weight:700}
*{margin:0;box-sizing:border-box}body{width:1920px;height:1080px;overflow:hidden;font-family:M;color:#f3ead6;
background:radial-gradient(ellipse at 30% 20%,#2a2d4d 0%,#15172b 55%,#0b0c18 100%)}
.frame{position:absolute;inset:28px;border:2px solid rgba(201,162,74,.45);border-radius:6px}
.frame:after{content:"";position:absolute;inset:10px;border:1px solid rgba(201,162,74,.2)}
.cap{position:absolute;left:80px;top:70px;font-size:34px;color:#c9a24a;letter-spacing:.2em;border-left:6px solid #c9a24a;padding-left:22px}
.wm{position:absolute;right:120px;top:90px;font-size:520px;font-weight:800;color:rgba(201,162,74,.10);line-height:1}
.center{position:absolute;left:0;right:0;top:150px;height:560px;display:flex;align-items:center;justify-content:center;gap:90px}
.bub{position:absolute;left:120px;right:120px;bottom:70px;min-height:230px;background:rgba(250,244,230,.96);color:#1d1a2e;border-radius:28px;padding:42px 60px 40px 60px;font-family:R;font-weight:500;font-size:50px;line-height:1.55;box-shadow:0 10px 40px rgba(0,0,0,.45)}
.bub.n{background:rgba(12,13,26,.82);color:#f3ead6;border:2px solid rgba(201,162,74,.6)}
.who{position:absolute;top:-38px;left:46px;background:#c9a24a;color:#14162a;font-family:R;font-weight:700;font-size:38px;padding:6px 30px;border-radius:30px}
.bub:not(.n):before{content:"";position:absolute;top:-30px;left:300px;border:22px solid transparent;border-bottom:26px solid rgba(250,244,230,.96)}
.hl{font-size:56px;font-weight:800;color:#f3ead6;letter-spacing:.15em}.sm{font-size:34px;color:#c9a24a;letter-spacing:.2em}
.vt{writing-mode:vertical-rl;font-size:110px;font-weight:800;line-height:1.5;letter-spacing:.12em;color:#f3ead6}
.arrow{font-size:80px;color:#c9a24a}`;
function vis(sc){
 if(sc.vis==='title')return`<div class="wm">剥</div><div class="center" style="flex-direction:column;gap:30px;top:180px"><div class="sm">明治の易聖 高島嘉右衛門 ／ 実占録</div><div style="font-size:150px;font-weight:800;letter-spacing:.18em">魚を貫く針</div><div class="sm">山地剥 六五</div></div>`;
 if(sc.vis==='place')return`<div class="wm">${sc.big||''}</div>`;
 if(sc.vis==='hex'||sc.vis==='lesson'){const left=`<div style="text-align:center">${hexsvg(sc.hex,sc.mv,300)}<div class="hl" style="margin-top:18px">山地剥 <span style="color:#e8604c">六五</span></div></div>`;
   const right=sc.vis==='hex'?`<div class="arrow">→</div><div style="text-align:center;opacity:.8">${hexsvg(20,4,220)}<div class="sm" style="margin-top:14px">之卦 風地観</div></div>`:`<div style="max-width:820px;font-size:64px;font-weight:800;line-height:1.6">崩れていく時こそ、<br>打つべき一手を<br><span style="color:#e8b84c">すぐに打つ。</span></div>`;
   return `<div class="center">${left}${right}</div>`;}
 if(sc.vis==='yaoji')return`<div class="wm" style="font-size:440px">魚</div><div class="center" style="flex-direction:column;gap:34px;top:150px"><div class="sm">六五 爻辞</div><div style="font-size:120px;font-weight:800;letter-spacing:.14em">魚を貫く。</div><div style="font-size:104px;font-weight:800;letter-spacing:.1em;color:#e8b84c">宮人を以て寵せらる。</div></div>`;
 if(sc.vis==='quote')return`<div class="center"><div style="max-width:1400px;font-size:72px;font-weight:800;line-height:1.6;text-align:center">「${sc.q}」<div class="sm" style="margin-top:30px">― 中村敬宇</div></div></div>`;
 if(sc.vis==='cta')return`<div class="center" style="flex-direction:column;gap:40px;top:170px"><div style="font-size:92px;font-weight:800;letter-spacing:.1em">あなたの迷いも、一卦で観ます。</div><div style="font-size:60px;color:#e8b84c;font-weight:800;letter-spacing:.2em">青龍孔一　公式LINE</div><div class="sm">易経・四柱推命 鑑定</div></div>`;
 return'';}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});fs.mkdirSync('f',{recursive:true});
 for(let i=0;i<S.scenes.length;i++){const sc=S.scenes[i];for(let j=0;j<sc.lines.length;j++){const ln=sc.lines[j];const n=ln.who==='N';
  const h=`<html><head><style>${css}</style></head><body><div class="frame"></div><div class="cap">${sc.cap}</div>${vis(sc)}${sc.vis==='cta'&&j===sc.lines.length-1?'':''}<div class="bub${n?' n':''}">${n?'':`<div class="who">${ln.who}</div>`}${ln.t}</div></body></html>`;
  await p.setContent(h,{waitUntil:'load'});await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:`f/${String(i).padStart(2,'0')}_${String(j).padStart(2,'0')}.png`});}}
 await b.close();console.log('ok');})();
