// 毎日のニュースに登場した人物を、見つかった生年月日とあわせて命式データ化するための収集スクリプト。
// 人物探し・生年月日検索（Web検索）は手前でCloudセッション側が行い、
// その結果をここに candidates として渡すと、命式・大運・流年を計算してデータに追記する。
//   node collect.js candidates.json   候補者を追記
//   node collect.js --rebuild         既存データの命式表（chart）を作り直す
const fs=require('fs');
const path=require('path');
const E=require('./engine.js');

const DATA_JSON=path.join(__dirname,'..','..','data','news-meimeifu.json');
const DATA_CSV=path.join(__dirname,'..','..','data','news-meimeifu.csv');

const NAYIN_NAMES=['海中金','炉中火','大林木','路傍土','剣鋒金','山頭火','澗下水','城頭土','白蝋金','楊柳木','泉中水','屋上土','霹靂火','松柏木','長流水','砂中金','山下火','平地木','壁上土','金箔金','覆燈火','天河水','大駅土','釵釧金','桑柘木','大渓水','沙中土','天上火','石榴木','大海水'];
const TENOTSU={甲:'丑未',戊:'丑未',庚:'丑未',乙:'子申',己:'子申',丙:'酉亥',丁:'酉亥',壬:'卯巳',癸:'卯巳',辛:'寅午'};
const YOJIN={甲:'卯',丙:'午',戊:'午',庚:'酉',壬:'子'};
const SEASON_BY_BRANCH={寅:['春','木'],卯:['春','木'],辰:['春','木'],巳:['夏','火'],午:['夏','火'],未:['夏','火'],申:['秋','金'],酉:['秋','金'],戌:['秋','金'],亥:['冬','水'],子:['冬','水'],丑:['冬','水']};

function loadExisting(){
  if(!fs.existsSync(DATA_JSON)) return [];
  return JSON.parse(fs.readFileSync(DATA_JSON,'utf8'));
}

function cell(engine,stem,branch,isDay){
  return {
    s:stem, b:branch,
    tg:isDay?'日主':E.tenTG(engine.ds,stem),
    un:E.juunishi(engine.ds,branch),
    btg:E.branchTG(engine.ds,branch),
  };
}

function reiStatus(dayEl,seasonEl){
  if(dayEl===seasonEl) return '旺令';
  if(E.SN[seasonEl]===dayEl) return '相令';
  if(E.SN[dayEl]===seasonEl) return '休令';
  if(E.KN[dayEl]===seasonEl) return '囚令';
  return '死令';
}

// 命式表（FiveAgents風）に必要な値をひとまとめにして返す
function buildChart(engine, now){
  const n=engine.natal;
  const pillars={
    年:cell(engine,engine.natalStems.年柱,engine.natalBranches.年柱),
    月:cell(engine,engine.natalStems.月柱,engine.natalBranches.月柱),
    日:cell(engine,engine.natalStems.日柱,engine.natalBranches.日柱,true),
  };
  if(engine.natalStems.時柱) pillars.時=cell(engine,engine.natalStems.時柱,engine.natalBranches.時柱);

  const daiunList=engine.du.list.filter(p=>p.ageStart<=99).map(p=>({
    a0:p.ageStart,a1:p.ageEnd,
    ...cell(engine,E.STEMS[p.stemIdx],E.BRANCHES[p.branchIdx]),
  }));

  const year=now.getFullYear();
  const age=engine.ageAt(year);
  const yInfo=engine.yearInfo(year);
  const ryunen=cell(engine,E.STEMS[yInfo.stemIdx],E.BRANCHES[yInfo.branchIdx]);
  let daiun=null;
  if(age>=engine.du.startAge){
    const cd=E.daiunAtAge(engine.du,age);
    daiun={a0:cd.ageStart,a1:cd.ageEnd,...cell(engine,E.STEMS[cd.stemIdx],E.BRANCHES[cd.branchIdx])};
  }

  const dayIdx=n.day.kanshiIdx;
  const xun=Math.floor(dayIdx/10);
  const kubou=E.BRANCHES[(xun*10+10)%12]+E.BRANCHES[(xun*10+11)%12];
  const monthBr=engine.natalBranches.月柱;
  const tt=E.TENTOKU[monthBr];
  const [season,seasonEl]=SEASON_BY_BRANCH[monthBr];

  return {
    pillars, daiunList,
    now:{age,ryunen,daiun},
    dir:engine.du.dir===1?'順行':'逆行',
    cycle:engine.du.cycle,
    startAge:engine.du.startAge,
    extras:{
      天徳:tt?tt.vals.join(''):'',
      天乙:TENOTSU[engine.ds]||'',
      羊刃:YOJIN[engine.ds]||'',
      空亡:kubou,
      干支番号:dayIdx+1,
      納音:NAYIN_NAMES[Math.floor(dayIdx/2)],
      月令:reiStatus(engine.dayEl,seasonEl)+'（'+season+'生まれ）',
    },
  };
}

function todayAgeAndFlow(engine, now){
  const age=engine.ageAt(now.getFullYear());
  const yInfo=engine.yearInfo(now.getFullYear());
  const yStem=E.STEMS[yInfo.stemIdx], yBr=E.BRANCHES[yInfo.branchIdx];
  const hasDaiun=age>=engine.du.startAge;
  const cd=hasDaiun?E.daiunAtAge(engine.du,age):null;
  return {
    age,
    ryunen: yStem+yBr,
    daiun: hasDaiun ? E.STEMS[cd.stemIdx]+E.BRANCHES[cd.branchIdx] : null,
  };
}

function buildRecordCore(candidate, collectedAt, now){
  const {name, y, m, d, sex, newsTitle, newsUrl, birthSourceUrl} = candidate;
  if(y==null || m==null || d==null){
    return {
      collectedAt, name, birthDate:null, sex:sex||null,
      newsTitle, newsUrl, birthSourceUrl:birthSourceUrl||null,
      status:'生年月日不明のため命式計算スキップ',
    };
  }
  const engine=E.makeEngine(y,m,d,sex||'男');
  const flow=todayAgeAndFlow(engine, now);
  return {
    collectedAt, name,
    birthDate: y+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0'),
    sex: sex||null,
    newsTitle, newsUrl, birthSourceUrl:birthSourceUrl||null,
    status:'ok',
    dayStem: engine.ds,
    natal: {
      年柱: engine.natalStems.年柱+engine.natalBranches.年柱,
      月柱: engine.natalStems.月柱+engine.natalBranches.月柱,
      日柱: engine.natalStems.日柱+engine.natalBranches.日柱,
    },
    startAge: engine.du.startAge,
    daiunDir: engine.du.dir===1?'順行':'逆行',
    daiunCycle: engine.du.cycle,
    現在の年齢: flow.age,
    現在の大運: flow.daiun,
    今年の流年: flow.ryunen,
    chart: buildChart(engine, now),
  };
}

const DETAIL_KEYS=['newsDate','newsSummary','newsPoints','whyPerson'];
function buildRecord(candidate, collectedAt, now){
  const core=buildRecordCore(candidate, collectedAt, now);
  const extra={};
  DETAIL_KEYS.forEach(k=>{ if(candidate[k]!=null) extra[k]=candidate[k]; });
  return {...core, ...extra};
}

function toCsvRow(r){
  const cols=[r.collectedAt,r.name,r.birthDate||'',r.sex||'',r.status,
    r.dayStem||'', r.natal?r.natal.年柱:'', r.natal?r.natal.月柱:'', r.natal?r.natal.日柱:'',
    r.現在の大運||'', r.今年の流年||'', r.newsTitle||'', r.newsUrl||''];
  return cols.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',');
}

function writeAll(all){
  fs.mkdirSync(path.dirname(DATA_JSON),{recursive:true});
  fs.writeFileSync(DATA_JSON, JSON.stringify(all,null,2));
  const header='"収集日","氏名","生年月日","性別","状態","日主","年柱","月柱","日柱","現在の大運","今年の流年","ニュース見出し","ニュースURL"';
  fs.writeFileSync(DATA_CSV, header+'\n'+all.map(toCsvRow).join('\n')+'\n');
}

function main(candidates){
  const now=new Date();
  const collectedAt=now.toISOString().slice(0,10);
  const existing=loadExisting();
  const newRecords=candidates.map(c=>buildRecord(c,collectedAt,now));
  writeAll(existing.concat(newRecords));
  return newRecords;
}

// 既存の行を、記録されている生年月日・性別・収集日から作り直す
function rebuild(){
  const all=loadExisting().map(r=>{
    if(!r.birthDate) return r;
    const [y,m,d]=r.birthDate.split('-').map(Number);
    return buildRecord({
      name:r.name,y,m,d,sex:r.sex,newsTitle:r.newsTitle,newsUrl:r.newsUrl,birthSourceUrl:r.birthSourceUrl,
      newsDate:r.newsDate,newsSummary:r.newsSummary,newsPoints:r.newsPoints,whyPerson:r.whyPerson,
    },r.collectedAt,new Date(r.collectedAt+'T12:00:00+09:00'));
  });
  writeAll(all);
  return all;
}

module.exports={main,buildRecord,buildChart,rebuild};

if(require.main===module){
  const arg=process.argv[2];
  if(arg==='--rebuild'){
    console.log('rebuilt '+rebuild().length+' rows');
  }else if(arg){
    console.log(JSON.stringify(main(JSON.parse(fs.readFileSync(arg,'utf8'))),null,2));
  }else{
    console.error('使い方: node collect.js candidates.json | --rebuild');
    process.exit(1);
  }
}
