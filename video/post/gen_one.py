import base64,json,os,sys,urllib.request,urllib.error
KEY=os.environ['GEMINI_API_KEY']
MODELS=['gemini-2.5-flash-image','gemini-3-pro-image-preview']
prompt=sys.argv[2] if len(sys.argv)>2 else ''
out=sys.argv[1]
body=json.dumps({'contents':[{'parts':[{'text':prompt}]}],
  'generationConfig':{'responseModalities':['IMAGE'],'imageConfig':{'aspectRatio':'3:4'}}}).encode()
for m in MODELS:
    req=urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent',body,
      {'Content-Type':'application/json','x-goog-api-key':KEY})
    try: r=json.load(urllib.request.urlopen(req,timeout=180))
    except urllib.error.HTTPError as e: print(m,'ERR',e.code,e.read()[:200]); continue
    for c in r.get('candidates',[]):
        for p in c.get('content',{}).get('parts',[]):
            d=p.get('inlineData') or p.get('inline_data')
            if d: open(out,'wb').write(base64.b64decode(d['data'])); print('OK',m,out); sys.exit(0)
    print(m,'no image')
sys.exit('failed')
