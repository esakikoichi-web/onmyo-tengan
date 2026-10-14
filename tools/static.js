const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
const src=process.argv[2];await p.goto('file://'+src+'#home');await p.waitForTimeout(500);
const routes=['home','jo','gua','rei','furoku','hiku','zei'];for(let i=1;i<=64;i++)routes.push('gua/'+i);for(let i=1;i<=64;i++)for(let k=0;k<6;k++)routes.push('y/'+i+'/'+k);for(let k=0;k<9;k++)routes.push('rei/t'+k);for(let k=1;k<=6;k++)routes.push('rei/f'+k);for(const k of ['','/bungen','/keiji1','/keiji2','/sekka','/joka','/zakka','/kaiun'])routes.push('ten'+k);
await p.evaluate(()=>{window.__SB=1});let secs='';const ZD=await p.evaluate(()=>JSON.stringify({g:TK.gua.map(g=>({n:g.n,name:g.name,up:g.up,lo:g.lo,yp:(g.yao||[]).map(y=>y.p),yt:(g.yao||[]).map(y=>y.t)})),tri:{"乾":{b:[1,1,1],o:"天"},"兌":{b:[1,1,0],o:"沢"},"離":{b:[1,0,1],o:"火"},"震":{b:[1,0,0],o:"雷"},"巽":{b:[0,1,1],o:"風"},"坎":{b:[0,1,0],o:"水"},"艮":{b:[0,0,1],o:"山"},"坤":{b:[0,0,0],o:"地"}}}));
for(const r of routes){await p.evaluate(h=>{location.hash=h;},r);await p.waitForTimeout(r.startsWith('y/')?15:60);
 const html=await p.$eval('#app',e=>e.innerHTML);secs+=`<section class="pg" id="${r}">${html}</section>\n`;}
await b.close();
let h=fs.readFileSync('/home/user/onmyo-tengan/takashima_ekidan.html','utf8');
h=h.replace(/<script[\s\S]*?<\/script>/g,'');
h=h.replace('<main id="app"></main>','<main id="app">'+secs+'</main>');
h=h.replace('</head>','<style>section.pg{display:none;scroll-margin-top:80px}section.pg:target{display:block}#app:not(:has(section.pg:target)) #home{display:block}</style></head>');
const src0=fs.readFileSync('/home/user/onmyo-tengan/takashima_ekidan.html','utf8');const zjs=src0.slice(src0.indexOf('var ZN=['),src0.indexOf('function route(){'));
const zs=`<script>(function(){var D=${ZD};var TK={gua:D.g.map(function(g){return{n:g.n,name:g.name,up:g.up,lo:g.lo,yao:g.yp.map(function(p,i){return{p:p,t:g.yt[i]}})}})};var TRI=D.tri;var PN=['初','二','三','四','五','上'];function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}function yname(g,i){var y=(g.yao||[])[i];return y?y.p:PN[i];}var app=document.getElementById('zei');${zjs.replace(/<\/script/gi,'<\\/script')}
function go(){if(location.hash==='#zei'&&!app.dataset.on){app.dataset.on=1;vZei();}var hh=location.hash.split('/');var m=(hh[0]==='#y'&&hh.length===3)?[0,hh[1],hh[2]]:null;if(m){yInject(+m[1],+m[2],document.getElementById(location.hash.slice(1)));}}window.addEventListener('hashchange',function(){if(location.hash==='#zei'){app.dataset.on='';}go();});go();})();</script>`;
h=h.replace('</body>',zs+'</body>');
fs.writeFileSync(process.argv[3],h);console.log(h.length);
})();
