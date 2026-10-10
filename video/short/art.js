// 影絵（切り絵）風シーン：1080x1080 の SVG
const K='#06070d';
function sky(top,bot,moon){return `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient>
<radialGradient id="mg"><stop offset="0" stop-color="#ffe9b0" stop-opacity=".95"/><stop offset=".35" stop-color="#e8b84c" stop-opacity=".55"/><stop offset="1" stop-color="#e8b84c" stop-opacity="0"/></radialGradient>
<radialGradient id="lg"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient></defs>
<rect width="1080" height="1080" fill="url(#sk)"/>${moon?`<circle cx="${moon[0]}" cy="${moon[1]}" r="${moon[2]*2.4}" fill="url(#mg)"/><circle cx="${moon[0]}" cy="${moon[1]}" r="${moon[2]}" fill="#f6e7c1"/>`:''}`;}
function mist(y,o){return `<path d="M0,${y} C200,${y-30} 400,${y+20} 600,${y-10} S900,${y-25} 1080,${y} L1080,${y+60} L0,${y+60}Z" fill="#c9a24a" opacity="${o}"/>`;}
const S={};
S.hook=()=>`<svg viewBox="0 0 1080 1080">${sky('#1b1d3a','#3a2a3e',[800,230,70])}
<circle cx="880" cy="640" r="260" fill="url(#lg)"/>
<rect x="0" y="820" width="1080" height="260" fill="${K}"/>
<rect x="150" y="760" width="760" height="70" rx="14" fill="#10121f"/><ellipse cx="225" cy="752" rx="70" ry="26" fill="${K}"/>
<circle cx="265" cy="708" r="44" fill="${K}"/>
<path d="M300,735 C380,700 470,700 545,728 C600,750 640,758 680,745 L700,780 L560,785 C470,790 380,792 300,778 Z" fill="${K}"/>
<path d="M590,752 C630,680 690,668 728,692 C756,712 748,764 704,778 Z" fill="${K}"/>
<path d="M372,726 C418,690 460,702 478,736 L460,748 C444,728 414,724 392,742 Z" fill="${K}"/>
<g fill="${K}"><rect x="840" y="590" width="96" height="160" rx="6" fill="#ffcf73" opacity=".85"/><rect x="840" y="590" width="96" height="160" rx="6" fill="none" stroke="${K}" stroke-width="10"/><rect x="884" y="590" width="8" height="160"/><rect x="845" y="750" width="10" height="70"/><rect x="921" y="750" width="10" height="70"/></g>
<g stroke="#e8b84c" stroke-width="6" fill="none" stroke-linecap="round" opacity=".9"><path d="M220,640 q-14,-22 4,-40"/><path d="M262,622 q-6,-26 14,-40"/><path d="M305,640 q8,-24 30,-30"/></g></svg>`;
S.town=()=>`<svg viewBox="0 0 1080 1080">${sky('#16183a','#5a3a52',[230,200,55])}${mist(640,.12)}
<g fill="${K}">
<rect x="60" y="520" width="200" height="440"/><rect x="120" y="380" width="80" height="150"/><polygon points="110,385 160,300 210,385"/><circle cx="160" cy="450" r="26" fill="#e8b84c"/><circle cx="160" cy="450" r="20" fill="${K}"/>
<rect x="80" y="580" width="30" height="50" fill="#ffcf73" opacity=".8"/><rect x="140" y="580" width="30" height="50" fill="#ffcf73" opacity=".8"/><rect x="200" y="580" width="30" height="50" fill="#ffcf73" opacity=".8"/>
<polygon points="280,620 420,540 560,620"/><rect x="300" y="615" width="240" height="345"/>
<polygon points="560,600 700,520 840,600"/><rect x="580" y="595" width="240" height="365"/>
<rect x="850" y="470" width="190" height="490"/><polygon points="840,475 945,420 1050,475"/>
<rect x="870" y="520" width="34" height="56" fill="#ffcf73" opacity=".75"/><rect x="930" y="520" width="34" height="56" fill="#ffcf73" opacity=".75"/><rect x="990" y="520" width="34" height="56" fill="#ffcf73" opacity=".75"/>
<rect x="0" y="900" width="1080" height="180"/>
<rect x="470" y="660" width="8" height="250"/><rect x="452" y="640" width="44" height="34" rx="6" fill="#ffcf73"/><circle cx="474" cy="657" r="60" fill="url(#lg)"/>
<circle cx="700" cy="880" r="44" fill="none" stroke="${K}" stroke-width="10"/><path d="M640,860 L760,860 L760,800 C740,770 700,770 680,800 Z"/><path d="M760,860 L900,840 L905,852 L765,875 Z"/>
<circle cx="725" cy="760" r="22"/><path d="M705,780 L745,780 L752,850 L700,850 Z"/>
<circle cx="890" cy="770" r="22"/><path d="M872,792 L908,792 L930,860 L880,868 Z"/><path d="M880,860 L870,900 L884,900 L896,862 Z"/><path d="M910,858 L935,898 L948,892 L922,855 Z"/>
</g></svg>`;
function seated(x,y,s,extra){return `<g transform="translate(${x},${y}) scale(${s})" fill="${K}"><circle cx="40" cy="-210" r="38"/><path d="M20,-176 C-5,-140 -25,-60 -30,20 L150,20 C150,-40 120,-130 70,-176 Z"/><path d="M60,-120 C95,-100 115,-70 120,-40 L104,-34 C96,-60 80,-84 52,-100 Z"/>${extra||''}</g>`;}
S.visit=()=>`<svg viewBox="0 0 1080 1080">${sky('#1a1830','#3b2d2a',null)}
<rect x="80" y="160" width="920" height="560" rx="8" fill="#e8c88a" opacity=".16"/><g stroke="${K}" stroke-width="14" opacity=".8"><line x1="80" y1="160" x2="80" y2="720"/><line x1="1000" y1="160" x2="1000" y2="720"/><line x1="80" y1="160" x2="1000" y2="160"/><line x1="540" y1="160" x2="540" y2="720"/><line x1="80" y1="440" x2="1000" y2="440"/></g>
<circle cx="540" cy="560" r="380" fill="url(#lg)" opacity=".5"/>
<rect x="0" y="780" width="1080" height="300" fill="${K}"/>
${seated(250,780,1.25,'<path d="M30,-176 C40,-160 52,-150 66,-152 L60,-170 Z"/>')}
<g fill="${K}"><rect x="455" y="690" width="170" height="20" rx="4"/><rect x="470" y="705" width="12" height="80"/><rect x="598" y="705" width="12" height="80"/><rect x="525" y="610" width="34" height="82" rx="4"/>
${[...Array(9)].map((_,i)=>`<rect x="${528+i*3.2}" y="${560+(i%3)*6}" width="2.4" height="60"/>`).join('')}
<circle cx="700" cy="705" r="34"/><circle cx="726" cy="684" r="20"/><path d="M712,716 C752,650 842,650 872,712 C890,748 890,768 880,782 L690,782 C680,754 690,730 712,716 Z"/><path d="M700,724 L648,770 L664,782 L716,740 Z"/></g></svg>`;
S.zei=()=>`<svg viewBox="0 0 1080 1080">${sky('#0f1030','#2b1f3d',null)}
<circle cx="540" cy="430" r="330" fill="url(#mg)" opacity=".75"/><circle cx="540" cy="430" r="190" fill="#f6e7c1" opacity=".9"/>
<g stroke="${K}" stroke-width="5" stroke-linecap="round">${[...Array(25)].map((_,i)=>{const a=(-60+i*5)*Math.PI/180;return `<line x1="540" y1="430" x2="${540+Math.sin(a)*330}" y2="${430-Math.cos(a)*330}"/>`}).join('')}</g>
<g fill="${K}"><ellipse cx="540" cy="448" rx="54" ry="24"/>
<path d="M430,850 C420,720 460,580 512,462 L542,472 C506,580 478,720 476,860 Z"/><path d="M650,850 C660,720 620,580 568,462 L538,472 C574,580 602,720 604,860 Z"/>
<circle cx="540" cy="700" r="84"/>
<path d="M260,1080 C280,880 380,800 540,790 C700,800 800,880 820,1080 Z"/></g></svg>`;
S.miya=()=>`<svg viewBox="0 0 1080 1080">${sky('#0d0e22','#251a33',null)}
<circle cx="540" cy="520" r="420" fill="url(#mg)" opacity=".45"/>
<text x="540" y="700" text-anchor="middle" font-family="M" font-weight="800" font-size="560" fill="#f6e7c1" opacity=".96">宮</text>
<text x="540" y="890" text-anchor="middle" font-family="M" font-weight="800" font-size="64" fill="#e8b84c" letter-spacing="10">宮人 ＝ 若宮</text></svg>`;
S.hari=()=>`<svg viewBox="0 0 1080 1080">${sky('#1b1d3a','#4a3a2e',null)}<circle cx="520" cy="640" r="330" fill="url(#lg)" opacity=".55"/>
<rect x="0" y="820" width="1080" height="260" fill="${K}"/>
<rect x="90" y="760" width="640" height="70" rx="14" fill="#10121f"/><ellipse cx="160" cy="752" rx="64" ry="24" fill="${K}"/>
<g fill="${K}"><circle cx="195" cy="712" r="40"/><path d="M230,735 C330,712 450,712 560,730 C620,740 660,742 700,740 L705,782 L230,782 Z"/>
<circle cx="830" cy="560" r="40"/><path d="M800,600 C770,650 760,720 770,790 L940,790 C940,720 910,640 870,600 Z"/>
<path d="M808,640 C760,660 680,690 600,700 L598,716 C680,712 770,690 822,668 Z"/></g>
<line x1="600" y1="708" x2="548" y2="728" stroke="#ffe9b0" stroke-width="5"/><circle cx="548" cy="728" r="16" fill="#ffe9b0" opacity=".8"/>
<g stroke="#e8b84c" stroke-width="7" fill="none" opacity=".9"><path d="M470,600 l-24,40 l26,0 l-24,44"/><path d="M560,580 l-18,34 l22,0 l-18,38"/></g></svg>`;
S.lesson=()=>`<svg viewBox="0 0 1080 1080">${sky('#1d1b3e','#c77b4a',[540,760,120])}${mist(720,.18)}
<g fill="${K}"><path d="M0,1080 L0,820 L160,700 L260,760 L380,620 L470,690 L540,560 L610,690 L700,600 L820,760 L930,690 L1080,800 L1080,1080Z"/>
<circle cx="540" cy="508" r="20"/><path d="M526,528 L554,528 L560,600 L548,600 L544,566 L536,566 L532,600 L520,600 Z"/><path d="M528,540 L496,520 L500,512 L532,530 Z"/><path d="M552,540 L590,510 L596,518 L556,548 Z"/></g>
<g fill="#e8b84c" opacity=".9">${[...Array(7)].map((_,i)=>`<circle cx="${200+i*120}" cy="${430-((i*37)%60)}" r="4"/>`).join('')}</g></svg>`;
S.cta=()=>`<svg viewBox="0 0 1080 1080">${sky('#121436','#e0905a',[540,640,150])}${mist(660,.2)}
<g fill="${K}"><path d="M0,1080 L0,760 L300,780 L420,560 L470,530 L540,500 L610,530 L660,560 L780,780 L1080,760 L1080,1080Z"/></g>
<path d="M470,530 L540,500 L610,530 L585,560 L560,540 L540,565 L520,540 L495,560 Z" fill="#f3ead6" opacity=".9"/></svg>`;
module.exports=S;
