
/* ---- engine.js (ported, require/module.exports removed) ---- */
const STEMS=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const BRANCHES=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const STEM_GOGYO={甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
const BRANCH_GOGYO={寅:'木',卯:'木',巳:'火',午:'火',辰:'土',戌:'土',丑:'土',未:'土',申:'金',酉:'金',子:'水',亥:'水'};
const JUUSHIN_MAP={
 '甲':{'甲':'比肩','乙':'敗財','丙':'食神','丁':'傷官','戊':'偏財','己':'正財','庚':'偏官','辛':'正官','壬':'偏印','癸':'印綬'},
 '乙':{'乙':'比肩','甲':'劫財','丁':'食神','丙':'傷官','己':'偏財','戊':'正財','辛':'偏官','庚':'正官','癸':'偏印','壬':'印綬'},
 '丙':{'丙':'比肩','丁':'敗財','戊':'食神','己':'傷官','庚':'偏財','辛':'正財','壬':'偏官','癸':'正官','甲':'偏印','乙':'印綬'},
 '丁':{'丁':'比肩','丙':'劫財','己':'食神','戊':'傷官','辛':'偏財','庚':'正財','癸':'偏官','壬':'正官','乙':'偏印','甲':'印綬'},
 '戊':{'戊':'比肩','己':'敗財','庚':'食神','辛':'傷官','壬':'偏財','癸':'正財','甲':'偏官','乙':'正官','丙':'偏印','丁':'印綬'},
 '己':{'己':'比肩','戊':'劫財','辛':'食神','庚':'傷官','癸':'偏財','壬':'正財','乙':'偏官','甲':'正官','丁':'偏印','丙':'印綬'},
 '庚':{'庚':'比肩','辛':'敗財','壬':'食神','癸':'傷官','甲':'偏財','乙':'正財','丙':'偏官','丁':'正官','戊':'偏印','己':'印綬'},
 '辛':{'辛':'比肩','庚':'劫財','癸':'食神','壬':'傷官','乙':'偏財','甲':'正財','丁':'偏官','丙':'正官','己':'偏印','戊':'印綬'},
 '壬':{'壬':'比肩','癸':'敗財','甲':'食神','乙':'傷官','丙':'偏財','丁':'正財','戊':'偏官','己':'正官','庚':'偏印','辛':'印綬'},
 '癸':{'癸':'比肩','壬':'劫財','乙':'食神','甲':'傷官','丁':'偏財','丙':'正財','己':'偏官','戊':'正官','辛':'偏印','庚':'印綬'},
};
const JUUNISHI_TABLE={
 '甲':{子:'沐浴',丑:'冠帯',寅:'建禄',卯:'帝旺',辰:'衰',巳:'病',午:'死',未:'墓',申:'絶',酉:'胎',戌:'養',亥:'長生'},
 '乙':{午:'長生',巳:'沐浴',辰:'冠帯',卯:'建禄',寅:'帝旺',丑:'衰',子:'病',亥:'死',戌:'墓',酉:'絶',申:'胎',未:'養'},
 '丙':{寅:'長生',卯:'沐浴',辰:'冠帯',巳:'建禄',午:'帝旺',未:'衰',申:'病',酉:'死',戌:'墓',亥:'絶',子:'胎',丑:'養'},
 '丁':{酉:'長生',申:'沐浴',未:'冠帯',午:'建禄',巳:'帝旺',辰:'衰',卯:'病',寅:'死',丑:'墓',子:'絶',亥:'胎',戌:'養'},
 '戊':{寅:'長生',卯:'沐浴',辰:'冠帯',巳:'建禄',午:'帝旺',未:'衰',申:'病',酉:'死',戌:'墓',亥:'絶',子:'胎',丑:'養'},
 '己':{酉:'長生',申:'沐浴',未:'冠帯',午:'建禄',巳:'帝旺',辰:'衰',卯:'病',寅:'死',丑:'墓',子:'絶',亥:'胎',戌:'養'},
 '庚':{巳:'長生',午:'沐浴',未:'冠帯',申:'建禄',酉:'帝旺',戌:'衰',亥:'病',子:'死',丑:'墓',寅:'絶',卯:'胎',辰:'養'},
 '辛':{子:'長生',亥:'沐浴',戌:'冠帯',酉:'建禄',申:'帝旺',未:'衰',午:'病',巳:'死',辰:'墓',卯:'絶',寅:'胎',丑:'養'},
 '壬':{申:'長生',酉:'沐浴',戌:'冠帯',亥:'建禄',子:'帝旺',丑:'衰',寅:'病',卯:'死',辰:'墓',巳:'絶',午:'胎',未:'養'},
 '癸':{卯:'長生',寅:'沐浴',丑:'冠帯',子:'建禄',亥:'帝旺',戌:'衰',酉:'病',申:'死',未:'墓',午:'絶',巳:'胎',辰:'養'},
};
let CAL='auto';
function useGreg(y,m,d){ if(CAL==='gregorian') return true; if(CAL==='julian') return false; return (y>1582)||(y===1582&&(m>10||(m===10&&d>=15))); }
function jdnGregorian(y,m,d){const a=Math.floor((14-m)/12);const yy=y+4800-a;const mm=m+12*a-3;return d+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-Math.floor(yy/100)+Math.floor(yy/400)-32045;}
function jdnJulian(y,m,d){const a=Math.floor((14-m)/12);const yy=y+4800-a;const mm=m+12*a-3;return d+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-32083;}
function toJDN(y,m,d){return useGreg(y,m,d)?jdnGregorian(y,m,d):jdnJulian(y,m,d);}
function jdToParts(jd){
  jd+=9/24;
  let Z=Math.floor(jd+0.5), F=jd+0.5-Z, A;
  const greg=(CAL==='gregorian')||(CAL==='auto'&&Z>=2299161);
  if(CAL==='julian') A=Z;
  else if(greg){const al=Math.floor((Z-1867216.25)/36524.25);A=Z+1+al-Math.floor(al/4);}
  else A=Z;
  const B=A+1524,C=Math.floor((B-122.1)/365.25),Dd=Math.floor(365.25*C),E=Math.floor((B-Dd)/30.6001);
  const day=B-Dd-Math.floor(30.6001*E)+F, month=E<14?E-1:E-13, year=month>2?C-4716:C-4715;
  const di=Math.floor(day),frac=day-di,tot=Math.round(frac*1440),h=Math.floor(tot/60),mi=tot%60;
  return {year,month,day:di,h,m:mi};
}
function isLeapFor(y){ const g=(CAL==='gregorian')||(CAL==='auto'&&y>=1583); return g?((y%4===0&&y%100!==0)||y%400===0):(((y%4)+4)%4===0); }
function daysInMonth(y,m){const md=[31,isLeapFor(y)?29:28,31,30,31,30,31,31,30,31,30,31];return md[m-1];}
const D2R=Math.PI/180;
function norm360(x){x%=360;return x<0?x+360:x;}
function sunAppLon(jde){
  const T=(jde-2451545.0)/36525.0;
  const L0=norm360(280.46646+36000.76983*T+0.0003032*T*T);
  const M=norm360(357.52911+35999.05029*T-0.0001537*T*T)*D2R;
  const C=(1.914602-0.004817*T-0.000014*T*T)*Math.sin(M)+(0.019993-0.000101*T)*Math.sin(2*M)+0.000289*Math.sin(3*M);
  const omega=(125.04-1934.136*T)*D2R;
  return norm360(L0+C-0.00569-0.00478*Math.sin(omega));
}
function deltaT(y){
  let u,t;
  if(y<-500){u=(y-1820)/100;return -20+32*u*u;}
  if(y<500){u=y/100;return 10583.6-1014.41*u+33.78311*u*u-5.952053*u**3-0.1798452*u**4+0.022174192*u**5+0.0090316521*u**6;}
  if(y<1600){u=(y-1000)/100;return 1574.2-556.01*u+71.23472*u*u+0.319781*u**3-0.8503463*u**4-0.005050998*u**5+0.0083572073*u**6;}
  if(y<1700){t=y-1600;return 120-0.9808*t-0.01532*t*t+t**3/7129;}
  if(y<1800){t=y-1700;return 8.83+0.1603*t-0.0059285*t*t+0.00013336*t**3-t**4/1174000;}
  if(y<1860){t=y-1800;return 13.72-0.332447*t+0.0068612*t*t+0.0041116*t**3-0.00037436*t**4+0.0000121272*t**5-0.0000001699*t**6+0.000000000875*t**7;}
  if(y<1900){t=y-1860;return 7.62+0.5737*t-0.251754*t*t+0.01680668*t**3-0.0004473624*t**4+t**5/233174;}
  if(y<1920){t=y-1900;return -2.79+1.494119*t-0.0598939*t*t+0.0061966*t**3-0.000197*t**4;}
  if(y<1941){t=y-1920;return 21.20+0.84493*t-0.076100*t*t+0.0020936*t**3;}
  if(y<1961){t=y-1950;return 29.07+0.407*t-t*t/233+t**3/2547;}
  if(y<1986){t=y-1975;return 45.45+1.067*t-t*t/260-t**3/718;}
  if(y<2005){t=y-2000;return 63.86+0.3345*t-0.060374*t*t+0.0017275*t**3+0.000651814*t**4+0.00002373599*t**5;}
  if(y<2050){t=y-2000;return 62.92+0.32217*t+0.005589*t*t;}
  u=(y-1820)/100;return -20+32*u*u;
}
function solarTermJD(targetDeg, approxY, approxM, approxD){
  let jde=jdnGregorian(approxY,approxM,approxD)+0.5;
  for(let i=0;i<8;i++){
    const diff=((targetDeg-sunAppLon(jde)+540)%360)-180;
    jde+=diff*(365.25/360);
  }
  return jde-deltaT(approxY)/86400;
}
function monthBranchIdxFromLon(lon){const sec=Math.floor(norm360(lon-315)/30);return (2+sec)%12;}
function dayPillar(y,m,d){const idx=((toJDN(y,m,d)+49)%60+60)%60;return {stemIdx:idx%10,branchIdx:idx%12,kanshiIdx:idx};}
function yearPillarStem(ganshiYear){const idx=((ganshiYear-1984)%60+60)%60;return {stemIdx:idx%10,branchIdx:idx%12,kanshiIdx:idx};}
function pickNearest(arr,t){let best=arr[0];for(const v of arr)if(Math.abs(v-t)<Math.abs(best-t))best=v;return best;}
function computeChart(y,m,d,h,min,sex){
  const timeKnown=(h!==null&&min!==null);
  const eh=timeKnown?h:23, emin=timeKnown?min:59;
  const jdUT=toJDN(y,m,d)-0.5+(eh*60+emin)/1440-9/24;
  const jde=jdUT+deltaT(y)/86400;
  const lon=sunAppLon(jde);
  const mbIdx=monthBranchIdxFromLon(lon);
  const risshunJD=solarTermJD(315,y,2,4);
  const ganshiYear=(jdUT>=risshunJD)?y:(y-1);
  const yp=yearPillarStem(ganshiYear);
  const yearStemIdx=yp.stemIdx;
  const starts=[2,4,6,8,0];
  const grp=yearStemIdx%5;
  const monthSeq=(mbIdx-2+12)%12;
  const monthStemIdx=(starts[grp]+monthSeq)%10;
  const dp=dayPillar(y,m,d);
  const dayStemIdx=dp.stemIdx, dayBranchIdx=dp.branchIdx;
  const dayStem=STEMS[dayStemIdx];
  let hp=null;
  if(timeKnown){
    const tot=h*60+min; let bi;
    if(tot>=1380||tot<60) bi=0; else bi=Math.min(Math.floor((tot-60)/120)+1,11);
    const startStems=[0,2,4,6,8];
    const effDay=(tot>=1380)?(dayStemIdx+1)%10:dayStemIdx;
    const si=(startStems[effDay%5]+bi)%10;
    hp={stemIdx:si,branchIdx:bi};
  }
  return {
    timeKnown, ganshiYear, monthBranch:BRANCHES[mbIdx],
    year:{stemIdx:yp.stemIdx,branchIdx:yp.branchIdx,kanshiIdx:yp.kanshiIdx},
    month:{stemIdx:monthStemIdx,branchIdx:mbIdx},
    day:{stemIdx:dayStemIdx,branchIdx:dayBranchIdx,kanshiIdx:dp.kanshiIdx},
    hour:hp, dayStem
  };
}
function tenTG(dayStem,targetStem){return (JUUSHIN_MAP[dayStem]&&JUUSHIN_MAP[dayStem][targetStem])||'';}
const BRANCH_STEM_SEI={子:'壬',丑:'己',寅:'甲',卯:'乙',辰:'戊',巳:'丁',午:'丙',未:'己',申:'庚',酉:'辛',戌:'戊',亥:'癸'};
function branchTG(dayStem,branch){return tenTG(dayStem,BRANCH_STEM_SEI[branch]);}
function juunishi(dayStem,branch){return (JUUNISHI_TABLE[dayStem]&&JUUNISHI_TABLE[dayStem][branch])||'';}
function kanshiIndex(si,bi){for(let i=si;i<60;i+=10)if(i%12===bi)return i;for(let i=si+10;i<120;i+=10)if(i%12===bi)return i-60;return -1;}
function daiun(chart,y,m,d,sex){
  const isYang=chart.year.stemIdx%2===0;
  const dir=(sex==='男')?(isYang?1:-1):(isYang?-1:1);
  const birthJDN=toJDN(y,m,d);
  const setsuJDN=(lonDeg,seedD,anchor)=>{
    let jd=solarTermJD(lonDeg,y,m,seedD);
    jd=pickNearest([jd,jd-365.2422,jd+365.2422],anchor);
    const p=jdToParts(jd);
    return toJDN(p.year,p.month,p.day);
  };
  let days;
  if(dir===1){
    const nextLon=(315+30*(((chart.month.branchIdx-2+12)%12)+1))%360;
    days=setsuJDN(nextLon,Math.min(d+20,28),birthJDN+15)-birthJDN;
  }else{
    const curLon=(315+30*((chart.month.branchIdx-2+12)%12))%360;
    days=birthJDN-setsuJDN(curLon,d,birthJDN-15);
  }
  if(days<0)days=0;
  const startAge=Math.round(days/3);
  const cycle=startAge<=1?10:startAge; // 大運の巡りは起運数と同じ年数。起運数が0〜1の時だけ10年固定にする（起運数2はそのまま2年運として扱い、別途10年版も併記する）
  const mKanshi=kanshiIndex(chart.month.stemIdx,chart.month.branchIdx);
  const kanshiOf=i=>{const k=((mKanshi+dir*(i-1))%60+60)%60;return {stemIdx:k%10,branchIdx:k%12};};
  const listVar=[];
  for(let i=1; 1+(i-1)*cycle<=100 && i<=200; i++){
    const a=1+(i-1)*cycle; listVar.push({...kanshiOf(i),ageStart:a,ageEnd:a+cycle-1});
  }
  return {dir,startAge,cycle,mKanshi,list:listVar};
}
function daiunAtAgeCycle(du,age,cycle){
  const i=Math.max(1,Math.floor((age-1)/cycle)+1);
  const k=((du.mKanshi+du.dir*(i-1))%60+60)%60;
  const a=1+(i-1)*cycle;
  return {stemIdx:k%10,branchIdx:k%12,ageStart:a,ageEnd:a+cycle-1};
}
function daiunAtAge(du,age){
  if(age==null||age<0) return null;
  return daiunAtAgeCycle(du,age,du.cycle);
}
function kanshiStr(o){return STEMS[o.stemIdx]+BRANCHES[o.branchIdx];}
function displayWidth(s){let w=0;for(const ch of s)w+=/[\x00-\xFF]/.test(ch)?1:2;return w;}
function padKind(kind,maxW){return kind+' '.repeat(Math.max(0,maxW-displayWidth(kind)));}

/* ---- run3.js (ported, require/module.exports removed) ---- */
const CHU={"子":"午","丑":"未","寅":"申","卯":"酉","辰":"戌","巳":"亥","午":"子","未":"丑","申":"寅","酉":"卯","戌":"辰","亥":"巳"};
const ROKUGO={"子":"丑","丑":"子","寅":"亥","亥":"寅","卯":"戌","戌":"卯","辰":"酉","酉":"辰","巳":"申","申":"巳","午":"未","未":"午"};
const ROKUGO_EL={'丑子':'土','寅亥':'木','卯戌':'火','酉辰':'金','巳申':'水','午未':null};
const SANGO=[["寅","午","戌"],["申","子","辰"],["巳","酉","丑"],["亥","卯","未"]];
const SANGO_EL={"寅午戌":"火","申子辰":"水","巳酉丑":"金","亥卯未":"木"};
const HOGO=[["寅","卯","辰"],["巳","午","未"],["申","酉","戌"],["亥","子","丑"]];
const HOGO_EL={"寅卯辰":"木","巳午未":"火","申酉戌":"金","亥子丑":"水"};
const GAI={"子":"未","未":"子","丑":"午","午":"丑","寅":"巳","巳":"寅","卯":"辰","辰":"卯","申":"亥","亥":"申","酉":"戌","戌":"酉"};
const PO={"子":"酉","酉":"子","午":"卯","卯":"午","巳":"申","申":"巳","寅":"亥","亥":"寅","丑":"辰","辰":"丑","未":"戌","戌":"未"};
const SELFPUN=["辰","午","酉","亥"];
const KEI_GROUPS=[["寅","巳","申"],["丑","戌","未"]];
const KEI_PAIR=[["子","卯"]];
const STEM_CHONG={"甲":"庚","庚":"甲","乙":"辛","辛":"乙","丙":"壬","壬":"丙","丁":"癸","癸":"丁"};
const GOU_STEM={"甲己":"土","乙庚":"金","丙辛":"水","丁壬":"木","戊癸":"火"};
function gouPair(a,b){const k1=a+b,k2=b+a;return GOU_STEM[k1]||GOU_STEM[k2]||null;}
const SN={木:'火',火:'土',土:'金',金:'水',水:'木'};
const SP={火:'木',土:'火',金:'土',水:'金',木:'水'};
const KN={木:'土',土:'水',水:'火',火:'金',金:'木'};
const KP={土:'木',水:'土',火:'水',金:'火',木:'金'};
function elCategory(dayEl, el){
  if(el===dayEl) return '比劫';
  if(el===SN[dayEl]) return '食傷';
  if(el===SP[dayEl]) return '印';
  if(el===KN[dayEl]) return '財';
  if(el===KP[dayEl]) return '官';
  return '';
}
const TENTOKU={
  "亥":{type:'stem',vals:['乙','庚']}, "子":{type:'branch',vals:['巳','申']},
  "丑":{type:'stem',vals:['庚','乙']}, "寅":{type:'stem',vals:['丁','壬']},
  "卯":{type:'branch',vals:['申','巳']}, "辰":{type:'stem',vals:['壬','丁']},
  "巳":{type:'stem',vals:['辛','丙']}, "午":{type:'branch',vals:['亥','寅']},
  "未":{type:'stem',vals:['甲','己']}, "申":{type:'stem',vals:['癸','戊']},
  "酉":{type:'branch',vals:['寅','亥']}, "戌":{type:'stem',vals:['丙','辛']},
};

function makeEngine(Y,M,D,SEX,h,min){
  const natal=computeChart(Y,M,D,h!==undefined?h:null,min!==undefined?min:null,SEX);
  const ds=natal.dayStem;
  const dayEl=STEM_GOGYO[ds];
  const du=daiun(natal,Y,M,D,SEX);
  const natalStems={年柱:STEMS[natal.year.stemIdx],月柱:STEMS[natal.month.stemIdx],日柱:ds};
  const natalBranches={年柱:BRANCHES[natal.year.branchIdx],月柱:BRANCHES[natal.month.branchIdx],日柱:BRANCHES[natal.day.branchIdx]};
  if(natal.hour){ natalStems.時柱=STEMS[natal.hour.stemIdx]; natalBranches.時柱=BRANCHES[natal.hour.branchIdx]; }
  const monthBranchNatal=natalBranches.月柱;
  const tentokuDef=TENTOKU[monthBranchNatal];

  function ageAt(y){ return y - natal.ganshiYear + 1; }
  function yearInfo(y){ return computeChart(y,6,15,null,null,SEX).year; }
  function monthInfo(y,m,day){ return computeChart(y,m,day||15,null,null,SEX).month; }

  function fuyinHanyinNotes(flowStem, flowBranch, baseStems, baseBranches){
    const notes=[];
    const stBase=baseStems||natalStems, brBase=baseBranches||natalBranches;
    Object.keys(stBase).forEach(label=>{
      const nst=stBase[label], nbr=brBase[label];
      if(nst===flowStem && nbr===flowBranch) notes.push(label+'反言');
      else if(CHU[flowBranch]===nbr && (STEM_CHONG[flowStem]===nst || KN[STEM_GOGYO[flowStem]]===STEM_GOGYO[nst])) notes.push(label+'天戦地冲');
    });
    return notes;
  }

  function stemNotes(flowStem, extraStems, baseStems){
    const notes=[];
    if(tentokuDef && tentokuDef.type==='stem' && tentokuDef.vals.includes(flowStem)) notes.push('天徳');
    const all={...(baseStems||natalStems), ...extraStems};
    const groups={};
    Object.entries(all).forEach(([label,st])=>{
      if(st===flowStem) return;
      const el=gouPair(flowStem,st);
      if(el){
        let cat=elCategory(dayEl,el);
        if(cat){
          if(cat==='比劫') cat='比肩';
          const key=[flowStem,st].sort().join('')+'|'+cat;
          if(!groups[key]) groups[key]={labels:[],pair:[flowStem,st].sort().join(''),cat};
          groups[key].labels.push(label);
        }
      }
    });
    Object.values(groups).forEach(g=>{
      const lbl=g.labels.join('').replace(/柱/g,'')+'柱';
      const marks='△'.repeat(g.labels.length);
      notes.push(lbl+'の'+g.pair+'で'+g.cat+marks);
    });
    return notes;
  }

  function branchNotes(flowBr, extraBranches, allFlowBranches, baseBranches, suppressLabels){
    const notes=[];
    const sup=suppressLabels||new Set();
    if(tentokuDef && tentokuDef.type==='branch' && tentokuDef.vals.includes(flowBr)) notes.push('天徳');
    const all={...(baseBranches||natalBranches), ...extraBranches};
    const rokugoGroup={labels:[]};
    Object.entries(all).forEach(([label,br])=>{
      if(br===flowBr) return;
      if(CHU[flowBr]===br && !sup.has(label)) notes.push(label+'冲');
      if(PO[flowBr]===br && ROKUGO[flowBr]!==br) notes.push(label+'破');
      if(ROKUGO[flowBr]===br) rokugoGroup.labels.push(label);
      if(GAI[flowBr]===br) notes.push(label+'害');
    });
    if(rokugoGroup.labels.length){
      const br=ROKUGO[flowBr];
      const key=[flowBr,br].sort().join('');
      const el=ROKUGO_EL[key];
      if(el){
        let cat=elCategory(dayEl,el); if(cat==='比劫')cat='比肩';
        const lbl=rokugoGroup.labels.join('').replace(/柱/g,'')+'柱';
        const marks='△'.repeat(rokugoGroup.labels.length);
        notes.push(lbl+'の'+[flowBr,br].join('')+'合'+el+(cat?'で'+cat+marks:''));
      }
    }
    const allPresent=[...allFlowBranches, ...Object.values(all)];
    KEI_GROUPS.forEach(g=>{
      if(!g.includes(flowBr)) return;
      const matched=g.filter(b=> b===flowBr || allPresent.includes(b));
      if(matched.length>=2) notes.push([...new Set(matched)].join('')+'の刑');
    });
    KEI_PAIR.forEach(p=>{
      if(!p.includes(flowBr)) return;
      const other=p.find(x=>x!==flowBr);
      if(allPresent.includes(other)) notes.push(p.join('')+'の刑');
    });
    if(SELFPUN.includes(flowBr)){
      const cnt=allFlowBranches.filter(b=>b===flowBr).length + Object.values(all).filter(b=>b===flowBr).length;
      if(cnt>=2) notes.push(flowBr+flowBr+'の自刑');
    }
    const groups={};
    SANGO.forEach(t=>{
      if(!t.includes(flowBr)) return;
      const presentMembers=t.filter(b=> b===flowBr || allPresent.includes(b));
      if(presentMembers.length<2) return;
      const full = presentMembers.length>=3;
      Object.entries(all).forEach(([label,br])=>{
        if(br===flowBr || !t.includes(br)) return;
        const el=SANGO_EL[t.join('')];
        if(!el) return;
        let cat=elCategory(dayEl,el);
        if(!cat) return;
        if(cat==='比劫')cat='比肩';
        const key=t.join('')+'|'+cat+'|'+(full?'full':'half');
        if(!groups[key]) groups[key]={labels:[],pair: full? t.join('') : [flowBr,br].filter((v,i,a)=>a.indexOf(v)===i).sort().join(''),cat,mark: full?'▲':'△'};
        groups[key].labels.push(label);
      });
    });
    HOGO.forEach(t=>{
      if(!t.includes(flowBr)) return;
      const need=t.filter(b=>b!==flowBr);
      const matchLabels=need.map(b=>{
        const found=Object.entries(all).find(([label,br])=>br===b);
        return found?found[0]:(allFlowBranches.includes(b)?'同柱':null);
      });
      if(matchLabels.every(x=>x)){
        const el=HOGO_EL[t.join('')];
        let cat=el?elCategory(dayEl,el):'';
        if(cat==='比劫')cat='比肩';
        if(cat){
          const key=t.join('')+'|'+cat+'|hogo';
          if(!groups[key]) groups[key]={labels:[],pair:t.join(''),cat,mark:'▲'};
          groups[key].labels.push(...matchLabels);
        }
      }
    });
    Object.values(groups).forEach(g=>{
      const lbl=[...new Set(g.labels)].join('').replace(/柱/g,'')+'柱';
      const marks=g.mark.repeat(g.labels.length);
      notes.push(lbl+'の'+g.pair+'で'+g.cat+marks);
    });
    return [...new Set(notes)];
  }

  function crossFlowNotes(stem,branch,extraStemPool,extraBranchPool){
    const notes=[];
    Object.keys(extraStemPool||{}).forEach(label=>{
      const ost=extraStemPool[label], obr=extraBranchPool[label];
      if(ost===stem && obr===branch) notes.push(label+'と反言');
      else if(CHU[branch]===obr && (STEM_CHONG[stem]===ost || KN[STEM_GOGYO[stem]]===STEM_GOGYO[ost])) notes.push(label+'天戦地冲');
    });
    return notes;
  }
  function fmtPillar(kind,stem,branch,extraStemPool,extraBranchPool,allFlowBranches,baseStems,baseBranches){
    const tg=tenTG(ds,stem), un=juunishi(ds,branch), btg=branchTG(ds,branch);
    const fh=fuyinHanyinNotes(stem,branch,baseStems,baseBranches);
    const cf=crossFlowNotes(stem,branch,extraStemPool,extraBranchPool);
    const suppressLabels=new Set([...fh,...cf].filter(n=>n.endsWith('天戦地冲')).map(n=>n.replace(/と?天戦地冲$/,'')));
    const sN=stemNotes(stem, extraStemPool, baseStems);
    const bN=branchNotes(branch, extraBranchPool, allFlowBranches, baseBranches, suppressLabels);
    const notes=[...fh,...cf,...sN,...bN];
    const tIdx=notes.indexOf('天徳');
    if(tIdx>0){ notes.splice(tIdx,1); notes.unshift('天徳'); }
    const noteStr = notes.length? '（'+notes.join('＋')+'）' : '';
    const unPadded = un.length<2 ? '　'+un : un; // 十二運が1文字の語は全角スペースで2文字幅に揃える
    return kind+' / '+stem+branch+' '+tg+' '+unPadded+' '+btg+noteStr;
  }

  return {natal,ds,dayEl,du,ageAt,yearInfo,monthInfo,fmtPillar,natalStems,natalBranches};
}


module.exports={computeChart,daiun,daiunAtAge,daiunAtAgeCycle,makeEngine,STEMS,BRANCHES,kanshiIndex,kanshiStr,tenTG,juunishi,branchTG,TENTOKU,STEM_GOGYO,SN,KN};
