// 公開中の「運命譜ジェネレーター」(tools/unmeifu-generator/index.html) の計算部分をそのまま切り出して engine.js を作る。
// 計算ロジックは運命譜ジェネレーターを唯一の元にし、ここでは書き換えない。
const fs=require('fs');
const path=require('path');
const src=path.join(__dirname,'..','unmeifu-generator','index.html');
const html=fs.readFileSync(src,'utf8');
const body=html.slice(html.indexOf('<script>')+'<script>'.length, html.lastIndexOf('</script>'));
const engine=body.slice(0, body.indexOf('/* ---- page logic ---- */'));
const out='// 自動生成: node build-engine.js （元: tools/unmeifu-generator/index.html）\n'+engine+
'\nmodule.exports={computeChart,daiun,daiunAtAge,daiunAtAgeCycle,makeEngine,STEMS,BRANCHES,kanshiIndex,kanshiStr,tenTG,juunishi,branchTG,TENTOKU,STEM_GOGYO,SN,KN};\n';
fs.writeFileSync(path.join(__dirname,'engine.js'),out);
console.log('engine.js regenerated ('+out.length+' bytes)');
