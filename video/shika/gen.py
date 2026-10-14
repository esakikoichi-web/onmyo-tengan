import base64,json,os,sys,urllib.request,urllib.error
KEY=os.environ['GEMINI_API_KEY']
MODELS=[os.environ.get('GEMINI_IMAGE_MODEL','gemini-2.5-flash-image'),'gemini-3-pro-image-preview']
STYLE=('Epic seinen manga / anime style like the series Kingdom, Warring States period China, bold dynamic ink linework, dramatic cel shading, intense cinematic action and emotion, high contrast, vertical 9:16 composition. Vivid full color. Absolutely no text, no letters, no kanji, no signature, no watermark, no floating symbols, no decorative rune circles. Scene: ')
P={
 'trap':'Close-up of a defeated man in simple robes on his knees, head down in despair, a handful of gold coins slipping from his open hands, a sense of total ruin and regret, dark dramatic lighting.',
 'hon':'An old wise sage with a long beard, holding an open ancient bamboo-slip scroll, reading a grave warning by candlelight in a dark chamber, solemn and intense.',
 'karyudo':'A lone young hunter drawing a bow in a misty ancient forest, locked onto a single deer slipping away between the trees, no companion with him, tense and determined.',
 'fukairi':'The young hunter running deeper into a dense forest, eyes greedily fixed on the fleeing deer ahead, obsessed expression, branches rushing past, dramatic motion.',
 'mayou':'The hunter standing alone at dusk, lost and exhausted, surrounded by endless identical towering trees, the deer gone, no path anywhere, despair on his face.',
 'hikikaeshi':'A calm dignified sage in robes halting at a fork in the forest, raising a hand, choosing to turn back with wise composure, resolute.',
 'hamaru':'A man up to his waist in a dark forest bog, grasping desperately at a branch as he is dragged down, panic on his face, grim and cautionary.',
 'toushi':'A tempting mirage of a glowing golden deer standing at the edge of a sheer cliff in the dark forest, luring and dangerous, a man reaching toward it unaware of the drop.',
 'wana':'A modern man in a dark jacket holding a glowing smartphone, about to step into the mouth of an ominous dark forest, cold light on his face, unaware of danger, dramatic manga style.',
 'mori':'A tiny lone man standing at the edge of an immense, overwhelming dark forest that stretches endlessly before him, dwarfed and vulnerable, vast and foreboding.',
 'gujin':'A calm guide holding up a glowing lantern at the threshold of the dark forest, lighting the way forward for a traveler, trustworthy and reassuring, warm light against the dark.',
 'eki':'A majestic blue dragon soaring through the dark forest, its glowing body carving a clear bright path between the trees, guiding light, awe-inspiring Kingdom manga style.',
 'michi':'A clear bright path opening through the forest toward a radiant sunrise, a lone figure walking forward with resolve, hope and clarity, serene and iconic.',
}
os.makedirs('g',exist_ok=True)
targets=sys.argv[1:] or list(P)
for sc in targets:
    if os.path.exists(f'g/{sc}.png'): print('skip',sc); continue
    body=json.dumps({'contents':[{'parts':[{'text':STYLE+P[sc]}]}],
      'generationConfig':{'responseModalities':['IMAGE'],'imageConfig':{'aspectRatio':'9:16'}}}).encode()
    done=False
    for m in MODELS:
        req=urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent',body,
          {'Content-Type':'application/json','x-goog-api-key':KEY})
        try: r=json.load(urllib.request.urlopen(req,timeout=180))
        except urllib.error.HTTPError as e: print(sc,m,'ERR',e.code); continue
        for c in r.get('candidates',[]):
            for p in c.get('content',{}).get('parts',[]):
                d=p.get('inlineData') or p.get('inline_data')
                if d: open(f'g/{sc}.png','wb').write(base64.b64decode(d['data'])); print(sc,'<-',m); done=True;break
            if done:break
        if done:break
    if not done: print(sc,'FAILED')
