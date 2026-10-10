# Gemini の画像生成で各場面の絵を作る → g/<場面>.png（1:1）
# 使い方: GEMINI_API_KEY=... python3 gen_art.py [場面...]   （既にある画像は飛ばす。作り直すときは g/<場面>.png を消す）
import base64,json,os,sys,time,urllib.request,urllib.error
KEY=os.environ.get('GEMINI_API_KEY') or sys.exit('GEMINI_API_KEY が未設定です')
MODELS=[m for m in os.environ.get('GEMINI_IMAGE_MODEL','gemini-3-pro-image-preview,gemini-2.5-flash-image').split(',') if m]
STYLE=('Japanese ukiyo-e woodblock print style blended with cinematic lighting, Meiji era Japan (1881), '
 'deep indigo night palette with warm lantern gold highlights, washi paper texture, dramatic composition, '
 'square 1:1, absolutely no text, no letters, no kanji, no signatures, no watermark. Scene: ')
P={
 'hook':'A young Japanese man in a cotton yukata lies on a futon in a dim tatami room, clutching his stomach in agony, sweat on his brow; a paper andon lamp glows beside him; worried atmosphere.',
 'town':'Meiji-era Yokohama street at night: gas lamps, Western-style brick buildings beside traditional wooden shops, a rickshaw, people in kimono and some in bowler hats, a full moon over the harbor.',
 'visit':'An elderly mother in a plain kimono kneels and bows urgently before a dignified Meiji-era diviner in a dark haori (Takashima Kaemon, about 50, shaved head, calm sharp eyes) in a lamp-lit tatami study; on a low table lie a bundle of bamboo divination sticks (zeichiku).',
 'zei':'Close-up of the diviner\'s hands raising a fan of fifty thin bamboo divination sticks before his forehead in solemn concentration; a large pale moon glows behind him; mystical rays of light; a faint image of a fish pierced in a line appears in the mist.',
 'miya':'An empty, mystical night sky background: a soft glowing moon-like halo of gold light in the center over deep indigo, faint drifting mist and subtle gold dust, minimal, plenty of empty space in the middle for a large title character to be overlaid later.',
 'hari':'A traditional Japanese acupuncturist (hari-i) in a dark kimono carefully inserts a thin gold needle into the abdomen of a young man lying on a futon; stylized lightning-like swirls suggest his stomach rumbling like thunder; lantern light, a sense of relief.',
 'lesson':'A lone figure standing on a crumbling mountain ridge at dawn, rocks falling away behind, raising one hand decisively toward the rising sun; mist in the valleys below; resolute and hopeful mood.',
 'cta':'A majestic blue dragon (seiryu) coiling through clouds above Mount Fuji at sunrise, golden light breaking through, auspicious and calm, leaving the lower third relatively simple.',
}
def gen(sc):
    body=json.dumps({'contents':[{'parts':[{'text':STYLE+P[sc]}]}],
      'generationConfig':{'responseModalities':['IMAGE'],'imageConfig':{'aspectRatio':'1:1'}}}).encode()
    err=None
    for m in MODELS:
        for k in range(3):
            req=urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent',body,
              {'Content-Type':'application/json','x-goog-api-key':KEY})
            try: r=json.load(urllib.request.urlopen(req,timeout=180))
            except urllib.error.HTTPError as e:
                err=f'{m}: {e.code} {e.read()[:300]!r}'
                if e.code in (400,403,404): break
                time.sleep(5*(k+1)); continue
            for c in r.get('candidates',[]):
                for p in c.get('content',{}).get('parts',[]):
                    d=p.get('inlineData') or p.get('inline_data')
                    if d: open(f'g/{sc}.png','wb').write(base64.b64decode(d['data'])); return m
            err=f'{m}: 画像なし {json.dumps(r)[:300]}'
    sys.exit(f'{sc} 失敗 → {err}')
os.makedirs('g',exist_ok=True)
for sc in sys.argv[1:] or P:
    if os.path.exists(f'g/{sc}.png'): print('skip',sc); continue
    print(sc,'←',gen(sc))
