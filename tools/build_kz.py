import json,glob,os
R=os.path.dirname(os.path.abspath(__file__))+'/..'
out={}
for f in sorted(glob.glob(R+'/source/kousetsu_ja/[0-9][0-9].json')):
    out[int(os.path.basename(f)[:2])]=json.load(open(f))
open(R+'/takashima_kousetsu.js','w').write('// 高島の講説（全訳）：漢訳『高島易断』（source/gaodao）からの日本語訳\nTK.kz='+json.dumps(out,ensure_ascii=False)+';\n')
print(len(out))
