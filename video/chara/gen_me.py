import base64,json,os,urllib.request
KEY=os.environ['GEMINI_API_KEY']
M='gemini-2.5-flash-image'
photo=base64.b64encode(open('/root/.claude/uploads/e8c227fc-5371-5fc3-8de3-759aa3e89271/adb7a73f-image.jpg','rb').read()).decode()
prompt=('Using the uploaded photo as the face reference, create a stylized character portrait in epic seinen manga / anime style like the series Kingdom (bold ink linework, dramatic cel shading, high contrast). '
 'Keep this man clearly recognizable: same messy voluminous wavy hair with lighter brown highlighted tips, same strong eyebrows, light stubble/goatee, calm confident gaze, same facial structure. '
 'Reimagine him as a mystical Japanese fortune-teller: wearing a deep indigo-navy kimono/haori with subtle blue dragon embroidery, a faint ethereal glowing BLUE DRAGON (seiryu) coiling in the dark background, blue and gold highlights, mysterious oriental divination atmosphere. '
 'Front-facing upper-body portrait, vertical 9:16. Absolutely no text, no letters, no watermark.')
body=json.dumps({'contents':[{'parts':[{'inline_data':{'mime_type':'image/jpeg','data':photo}},{'text':prompt}]}],'generationConfig':{'responseModalities':['IMAGE'],'imageConfig':{'aspectRatio':'9:16'}}}).encode()
req=urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{M}:generateContent',body,{'Content-Type':'application/json','x-goog-api-key':KEY})
r=json.load(urllib.request.urlopen(req,timeout=180))
for c in r.get('candidates',[]):
 for p in c.get('content',{}).get('parts',[]):
  d=p.get('inlineData') or p.get('inline_data')
  if d: open('narrator_me.png','wb').write(base64.b64decode(d['data'])); print('ok'); break
