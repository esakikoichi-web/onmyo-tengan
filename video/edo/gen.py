import base64,json,os,sys,urllib.request,urllib.error
KEY=os.environ['GEMINI_API_KEY']
MODELS=['gemini-2.5-flash-image','gemini-3-pro-image-preview']
STYLE=('Japanese anime / gekiga illustration style, cinematic and nostalgic, Edo period Japan, warm lantern lighting, '
 'detailed semi-realistic anime, rich atmospheric colors, vertical 9:16 composition. '
 'Absolutely no text, no letters, no kanji, no signature, no watermark. Scene: ')
P={
 'machi':'A lively Edo-period merchant street at dusk, wooden shopfronts with noren curtains, paper lanterns glowing, townspeople in kimono, prosperous and warm atmosphere.',
 'souji':'An Edo shopkeeper in the early morning, sweeping and cleaning the front of his wooden shop with a bamboo broom, soft dawn light, fresh and pure mood, noren curtain.',
 'kyaku':'An Edo merchant warmly and respectfully welcoming his very first customer of the day with a deep bow at the shop entrance, sincere and humble, lanterns, warm light.',
 'okage':'An Edo merchant bowing gratefully with hands together, saying thanks, surrounded by goods in his shop, humble and warm expression, customers in background.',
 'han':'A grand prosperous Edo merchant house (oodana) with many workers, stacked goods and coins, success and abundance, warm golden evening light.',
}
os.makedirs('g',exist_ok=True)
for sc in sys.argv[1:] or list(P):
    if os.path.exists(f'g/{sc}.png'): print('skip',sc);continue
    body=json.dumps({'contents':[{'parts':[{'text':STYLE+P[sc]}]}],'generationConfig':{'responseModalities':['IMAGE'],'imageConfig':{'aspectRatio':'9:16'}}}).encode()
    ok=False
    for m in MODELS:
        req=urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent',body,{'Content-Type':'application/json','x-goog-api-key':KEY})
        try:r=json.load(urllib.request.urlopen(req,timeout=180))
        except urllib.error.HTTPError as e:print(sc,m,e.code);continue
        for c in r.get('candidates',[]):
            for p in c.get('content',{}).get('parts',[]):
                d=p.get('inlineData') or p.get('inline_data')
                if d:open(f'g/{sc}.png','wb').write(base64.b64decode(d['data']));print(sc,'<-',m);ok=True;break
            if ok:break
        if ok:break
    if not ok:print(sc,'FAIL')
