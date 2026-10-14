import base64,json,os,urllib.request,urllib.error
KEY=os.environ['GEMINI_API_KEY']
M='gemini-2.5-flash-image'
STYLE=('Epic seinen manga / anime style like the series Kingdom, bold dynamic ink linework, dramatic cel shading, high contrast, vertical 9:16. Absolutely no text, no letters, no watermark. ')
P=('Character reference sheet of an original Japanese fortune-teller narrator (NOT a real person): a calm, dignified man in his late 30s, long black hair tied back, wearing a deep indigo-navy traditional kimono/haori with subtle blue dragon embroidery, serene confident expression, faint ethereal BLUE DRAGON (seiryu) coiling in the dark background with soft glowing aura. Mystical oriental divination atmosphere, dark background with blue and gold highlights. Front-facing upper-body portrait, consistent recognizable face and outfit for a recurring channel character.')
body=json.dumps({'contents':[{'parts':[{'text':STYLE+P}]}],'generationConfig':{'responseModalities':['IMAGE'],'imageConfig':{'aspectRatio':'9:16'}}}).encode()
req=urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{M}:generateContent',body,{'Content-Type':'application/json','x-goog-api-key':KEY})
r=json.load(urllib.request.urlopen(req,timeout=180))
for c in r.get('candidates',[]):
 for p in c.get('content',{}).get('parts',[]):
  d=p.get('inlineData') or p.get('inline_data')
  if d: open('narrator.png','wb').write(base64.b64decode(d['data'])); print('ok'); break
