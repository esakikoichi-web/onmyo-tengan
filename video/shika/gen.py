import base64,json,os,sys,urllib.request,urllib.error
KEY=os.environ['GEMINI_API_KEY']
MODELS=[os.environ.get('GEMINI_IMAGE_MODEL','gemini-2.5-flash-image'),'gemini-3-pro-image-preview']
STYLE=('Epic seinen manga / anime style like the series Kingdom, ancient China atmosphere, bold dynamic ink linework, dramatic cel shading, intense cinematic emotion, high contrast, vertical 9:16 composition. Mystical I-Ching / oriental divination mood with subtle deep-blue and gold accents. Absolutely no text, no letters, no kanji, no signature, no watermark. Scene: ')
P={
 'trap':'A devastated man in dark robes on his knees in shadow, gold coins slipping through his open hands and turning into black smoke, a faint deceptive golden glow luring from the dark, a sense of ruin and regret.',
 'hon':'An ancient Chinese bamboo-slip scroll and a glowing I-Ching hexagram symbol (six horizontal lines, water-over-thunder) floating in darkness, mystical blue light, solemn and ominous.',
 'karyudo':'A lone hunter with a bow in ancient China at the edge of a vast dark forest, aiming at a single deer disappearing between the trees, no companion beside him, tense.',
 'fukairi':'The hunter pushing deeper into a dense dark forest, eyes fixated greedily on the fleeing deer ahead, branches clawing, deeper and deeper, obsession on his face.',
 'mayou':'The hunter alone at dusk, lost, surrounded by endless identical towering trees in every direction, the deer gone, no path, fading light, despair and disorientation.',
 'hikikaeshi':'A wise composed sage in robes pausing at a forest fork, calmly reading subtle signs, choosing to turn back, serene wisdom, faint blue aura of insight.',
 'hamaru':'A man sinking into a dark bog deep in the forest, grasping desperately at branches, dragged down, the lost deer nowhere, cautionary and grim.',
 'toushi':'Symbolic: a glowing deceptive golden lure floating above a pitch-black abyss in a dark forest, tempting and dangerous, the modern trap as an ancient omen.',
 'wana':'Silhouette of a modern man about to step into a dark ominous forest shaped like a snare, a glowing phone screen in his hand casting cold light, unaware of the danger, dramatic.',
 'mori':'A tiny lone human figure standing before an immense, overwhelming pitch-dark forest stretching endlessly, dwarfed and vulnerable, no guide, vast and foreboding.',
 'gujin':'A lantern-bearing guide figure (yuren, forest warden) standing at the threshold of the dark forest, offering light and direction, trustworthy and calm, warm glow against the dark.',
 'eki':'A majestic ethereal BLUE DRAGON (seiryu) of I-Ching wisdom coiling through the dark forest, its glowing body forming a clear illuminated path between the trees, guiding light, mystical and awe-inspiring.',
 'michi':'A clear luminous path opening through the forest toward a radiant dawn, hope and resolve, a single circular jade/blue divination light glowing at the end, serene and iconic.',
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
