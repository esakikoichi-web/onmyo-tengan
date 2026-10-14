import json,urllib.parse,subprocess,os,time
P=json.load(open('p2.json'))
for line in P['s']:
    n,d=line.split('|',1); d=d.replace('{tk}',P['tk'])
    out=f'v2/{n}.jpg'
    if os.path.exists(out) and os.path.getsize(out)>20000: continue
    q=urllib.parse.quote(P['style']+': '+d)
    for k in range(6):
        url=f'https://image.pollinations.ai/prompt/{q}?width=768&height=1365&nologo=true&seed={300+int(n)*7+k}'
        r=subprocess.run(['curl','-sS','-m','180','-o',out,'-w','%{http_code}',url],capture_output=True,text=True)
        print(n,r.stdout,flush=True)
        if r.stdout=='200' and os.path.getsize(out)>20000: break
        time.sleep(15)
    time.sleep(6)
