import base64,json,os,sys,urllib.request,urllib.error
KEY=os.environ['GEMINI_API_KEY']
MODELS=[os.environ.get('GEMINI_IMAGE_MODEL','gemini-2.5-flash-image'),'gemini-3-pro-image-preview']
STYLE=('Chinese historical ink-and-color painting blended with cinematic drama, Warring States period China (戦国時代), '
 'rich traditional palette of jade green, gold, crimson and deep ink, dramatic lighting, ornate ancient Chinese palace and robes, '
 'vertical 9:16 composition, solemn and epic. Absolutely no text, no letters, no kanji, no characters written, no signature, no watermark. Scene: ')
P={
 'heki':'Extreme close-up of a flawless circular jade disc (bi) glowing with soft green light, held reverently in two hands, radiant and priceless, dark background, a sense of a national treasure.',
 'chou':'A magnificent ancient Chinese palace treasury of the state of Zhao at night, a single circular jade disc displayed on a pedestal under a shaft of light, guards in the shadows, awe and reverence.',
 'shou':'A powerful, imposing King of Qin (Zhao Xiang) seated on a dragon throne, pointing a demanding finger, cunning expression, opulent crimson and gold hall.',
 'wana':'A dark ominous scene symbolizing a trap: the state of Qin as looming shadow over a small jade disc, storm clouds, spears in silhouette, a sense of no escape.',
 'rin':'A dignified, sharp-eyed envoy (Lin Xiangru) in scholar robes standing resolute before the Qin court, holding the jade disc close, brave and composed.',
 'torikaeshi':'The envoy Lin Xiangru stepping back and clutching the jade disc protectively, the Qin king reaching out, tension in a grand hall, dramatic.',
 'ikari':'Lin Xiangru enraged, hair bristling upward pushing up his cap, standing beside a great stone palace pillar, holding the jade disc high as if to smash it, furious and defiant, fire in his eyes.',
 'gojitsu':'Lin Xiangru calm and shrewd, gesturing with composure, suggesting a five-day purification ritual; incense smoke, a tense standoff with the king.',
 'nigasu':'A loyal servant in plain clothes secretly clutching the jade disc wrapped in cloth, slipping away through a dark back alley at night, moonlight, suspenseful escape.',
 'kokuhaku':'Lin Xiangru kneeling calmly before the furious Qin king in the grand hall, offering himself for punishment, serene and fearless, courtiers shocked.',
 'kanketsu':'The flawless jade disc returned safely, resting on a silk cushion back in the Zhao palace, bathed in warm dawn light, peaceful and triumphant.',
 'kanpeki':'A single perfect flawless circular jade disc floating in a beam of golden light against deep darkness, utterly complete and unblemished, serene and iconic.',
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
