import urllib.parse,subprocess,os,time
st="dark seinen manga comic panel, gekiga style, heavy black ink lines, cel shading, dramatic lighting, Meiji era Japan"
S={"02":"messy tatami room at night, an open wooden clothing chest, many colorful silk kimonos thrown on the floor, burglary aftermath, one candle",
"06":"a young Japanese woman in kimono sewing colorful silk fabric with needle and thread by an oil lamp, behind her a sly thin old Japanese man with grey stubble in shabby kimono watching, dim room",
"11":"two Japanese policemen in black Meiji police uniforms with sabers holding a thin old Japanese man in shabby kimono and a young Japanese woman in kimono, both tied with rope, dawn street"}
for n,d in S.items():
  for v in range(2):
    out=f'v3/{n}_{v}.jpg'
    if os.path.exists(out) and os.path.getsize(out)>20000: continue
    q=urllib.parse.quote(st+': '+d)
    for k in range(5):
        r=subprocess.run(['curl','-sS','-m','180','-o',out,'-w','%{http_code}',f'https://image.pollinations.ai/prompt/{q}?width=768&height=1365&nologo=true&seed={900+v*31+k}'],capture_output=True,text=True)
        print(n,v,r.stdout,flush=True)
        if r.stdout=='200' and os.path.getsize(out)>20000: break
        time.sleep(15)
    time.sleep(6)
