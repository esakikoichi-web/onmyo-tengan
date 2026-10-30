// 毎日のニュースに登場した人物を、見つかった生年月日とあわせて命式データ化するための収集スクリプト。
// 人物探し・生年月日検索（Web検索）は手前でCloudセッション側が行い、
// その結果をここに candidates として渡すと、命式・大運・流年を計算してデータに追記する。
const fs=require('fs');
const path=require('path');
const E=require('./engine.js');

const DATA_JSON=path.join(__dirname,'..','..','data','news-meimeifu.json');
const DATA_CSV=path.join(__dirname,'..','..','data','news-meimeifu.csv');

function loadExisting(){
  if(!fs.existsSync(DATA_JSON)) return [];
  return JSON.parse(fs.readFileSync(DATA_JSON,'utf8'));
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

function buildRecord(candidate, collectedAt, now){
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
  };
}

function toCsvRow(r){
  const cols=[r.collectedAt,r.name,r.birthDate||'',r.sex||'',r.status,
    r.dayStem||'', r.natal?r.natal.年柱:'', r.natal?r.natal.月柱:'', r.natal?r.natal.日柱:'',
    r.現在の大運||'', r.今年の流年||'', r.newsTitle||'', r.newsUrl||''];
  return cols.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',');
}

function main(candidates){
  const now=new Date();
  const collectedAt=now.toISOString().slice(0,10);
  const existing=loadExisting();
  const newRecords=candidates.map(c=>buildRecord(c,collectedAt,now));
  const all=existing.concat(newRecords);
  fs.mkdirSync(path.dirname(DATA_JSON),{recursive:true});
  fs.writeFileSync(DATA_JSON, JSON.stringify(all,null,2));
  const header='"収集日","氏名","生年月日","性別","状態","日主","年柱","月柱","日柱","現在の大運","今年の流年","ニュース見出し","ニュースURL"';
  const csvBody=all.map(toCsvRow).join('\n');
  fs.writeFileSync(DATA_CSV, header+'\n'+csvBody+'\n');
  return newRecords;
}

module.exports={main,buildRecord};

if(require.main===module){
  const inputPath=process.argv[2];
  if(!inputPath){
    console.error('使い方: node collect.js candidates.json');
    process.exit(1);
  }
  const candidates=JSON.parse(fs.readFileSync(inputPath,'utf8'));
  const added=main(candidates);
  console.log(JSON.stringify(added,null,2));
}
