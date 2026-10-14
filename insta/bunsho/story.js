const {chromium}=require('playwright');const path=require('path');
const F='file://'+path.resolve('../vid/fonts');const OUT='/home/user/onmyo-tengan/insta/bunsho';
const yy=`<svg width="150" height="150" viewBox="-52 -52 104 104"><circle r="50" fill="none" stroke="#c9a45c" stroke-width="2"/><path d="M0,-46 A46,46 0 0,1 0,46 A23,23 0 0,1 0,0 A23,23 0 0,0 0,-46Z" fill="#c9a45c"/><path d="M0,-46 A46,46 0 0,0 0,46 A23,23 0 0,0 0,0 A23,23 0 0,1 0,-46Z" fill="none"/><circle cy="-23" r="6" fill="#c9a45c"/><circle cy="23" r="6" fill="#0f1a3a"/></svg>`;
const css=`@font-face{font-family:S;src:url(${F}/f1.ttf);font-weight:500}@font-face{font-family:S;src:url(${F}/f2.ttf);font-weight:800}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;font-family:S;color:#e8dcc0;background:radial-gradient(ellipse at 50% 42%,#1d2f63 0%,#121e45 45%,#0a1230 100%)}
.f1{position:absolute;left:40px;right:40px;top:200px;bottom:200px;border:2px solid #c9a45c88}.f2{position:absolute;left:56px;right:56px;top:216px;bottom:216px;border:1px solid #c9a45c44}
.lab{position:absolute;top:470px;width:100%;text-align:center;color:#c9a45c;font-size:34px;letter-spacing:.7em;font-weight:500}
.wrap{position:absolute;left:110px;right:110px;top:560px;bottom:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.t{font-size:96px;font-weight:800;color:#e3c27f;letter-spacing:.12em;line-height:1.2}
.h{font-size:72px;font-weight:800;color:#e3c27f;letter-spacing:.1em}
.ln{width:120px;height:2px;background:#c9a45c;margin:44px auto}
.s{font-size:44px;line-height:1.9;color:#ddd2b8;letter-spacing:.08em}
.li{font-size:44px;line-height:1.7;text-align:left;color:#ddd2b8}.li b{color:#e3c27f;font-weight:800;margin-right:14px}
.price{font-size:120px;font-weight:800;color:#e3c27f;letter-spacing:.02em}.price small{font-size:44px;margin-left:10px}
.badge{display:inline-block;border:2px solid #c9a45c;color:#e3c27f;font-size:40px;padding:10px 34px;letter-spacing:.2em;margin-bottom:36px}
.note{font-size:34px;color:#b9ad92;line-height:1.8;margin-top:30px}
.pg{position:absolute;bottom:330px;width:100%;text-align:center;color:#c9a45c;font-size:34px;letter-spacing:.5em}`;
const P=[
`<div class=lab>MENU</div><div class=wrap>${yy}<div style="height:50px"></div><div class=badge>初回限定</div><div class=t>文章鑑定</div><div class=ln></div><div class=s>いま一番知りたいことを一つ、<br>易で観て、文章でお答えします</div></div>`,
`<div class=lab>FOR YOU</div><div class=wrap><div class=h>こんな迷いに</div><div class=ln></div><div class=li><b>◆</b>この人と進めていいのか<br><b>◆</b>転職すべきか、留まるべきか<br><b>◆</b>この話、受けるべきか<br><b>◆</b>いま、動く時か待つ時か</div><div class=note>迷いの中にいる時ほど、<br>自分では答えが見えなくなります。</div></div>`,
`<div class=lab>CONTENTS</div><div class=wrap><div class=h>鑑定の内容</div><div class=ln></div><div class=li><b>一</b>ご質問は一つ（一問一卦）<br><b>二</b>得た卦と爻、その意味<br><b>三</b>いまの状況の読み解き<br><b>四</b>これからの動き方の助言</div><div class=note>明治の易聖・高島嘉右衛門の<br>『高島易断』に基づいて観ます。</div></div>`,
`<div class=lab>PRICE</div><div class=wrap><div class=h>料金</div><div class=ln></div><div class=price>5,500<small>円（税込）</small></div><div class=s style="margin-top:30px">初回の方　お一人様一回限り</div><div class=note>ご入金確認後、文章でお届けします。<br>お支払い方法はお申込み時にご案内します。</div></div>`,
`<div class=lab>CONTACT</div><div class=wrap>${yy}<div style="height:40px"></div><div class=h>お申込み</div><div class=ln></div><div class=s>プロフィールのリンクから<br>お気軽にどうぞ</div><div class=note>さらに詳しく、本質やこれからの流れまで<br>観たい方は　個別鑑定（初回 55,000円）</div></div>`];
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1080,height:1920}});
 for(let i=0;i<P.length;i++){await p.setContent(`<html><head><style>${css}</style></head><body><div class=f1></div><div class=f2></div>${P[i]}<div class=pg>${i+1} / ${P.length}</div></body></html>`);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);await p.screenshot({path:`${OUT}/bunsho_${i+1}.png`});}
 await b.close();})();
