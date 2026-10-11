# Gemini の画像生成で各場面の絵を作る → g/<場面>.png（1:1）
# 使い方: GEMINI_API_KEY=... python3 gen_art.py [場面...]
#   既にある画像は飛ばす。作り直すときは g/<場面>.png を消す（refを作り直すなら g/ref_*.png も消す）
# 顔の一貫性：先に g/ref_man.png（患者）と g/ref_takashima.png（高島嘉右衛門）を生成し、
#   登場する場面にはその参照画像を渡して同じ顔で描かせる。
import base64,json,os,sys,time,urllib.request,urllib.error
KEY=os.environ.get('GEMINI_API_KEY') or sys.exit('GEMINI_API_KEY が未設定です')
# 既定は安いflashを優先（1枚約6円）。高画質にしたい時だけ
#   GEMINI_IMAGE_MODEL=gemini-3-pro-image-preview（約20円/枚）を指定する。
MODELS=[m for m in os.environ.get('GEMINI_IMAGE_MODEL','gemini-2.5-flash-image,gemini-3-pro-image-preview').split(',') if m]
STYLE=('Japanese ukiyo-e woodblock print style blended with cinematic lighting, Meiji era Japan (1881), '
 'deep indigo night palette with warm lantern gold highlights, washi paper texture, dramatic composition, '
 'square 1:1, absolutely no text, no letters, no kanji, no signatures, no watermark. Scene: ')
# 登場人物の基準となる顔（キャラクターシート）
REFP={
 'man':('Character reference portrait, single person centered, plain dark background. '
  'A Japanese man in his early twenties, Meiji era (1881), oval face, thin build, short black hair tied in a small topknot (chonmage), gentle worried eyes, wearing a plain striped cotton yukata. Calm neutral expression, head and shoulders. '),
 'takashima':('Character reference portrait, single person centered, plain dark background. '
  'Render THIS EXACT real historical person (from the attached photograph of Takashima Kaemon in his later years) as an ukiyo-e woodblock portrait, faithfully keeping his real facial features: elderly Japanese man, long face, high forehead with receding short grey hair, calm heavy-lidded wise eyes, downturned mouth, wearing a dark formal kimono/haori. Head and shoulders, serene authoritative expression. '),
}
# 基準顔の“種”になる実写（あれば画風変換して使う）
REF_SEED={'takashima':'ref_real/takashima_real.png'}
P={
 'hook':'A young Japanese man in a cotton yukata lies on a futon in a dim tatami room, clutching his stomach in agony, sweat on his brow; a paper andon lamp glows beside him; worried atmosphere. Dramatic close-up of his pained face.',
 'town':'Meiji-era Yokohama street at night: gas lamps, Western-style brick buildings beside traditional wooden shops, a rickshaw, people in kimono and some in bowler hats, a full moon over the harbor.',
 'visit':'An elderly mother in a plain kimono kneels and bows urgently before the Meiji-era diviner from the reference (elderly, short grey hair, long calm face) in a dark haori, in a lamp-lit tatami study; on a low table lie a bundle of bamboo divination sticks (zeichiku).',
 'zei':'The elderly diviner from the reference (short grey hair, long calm face) raises a fan of fifty thin bamboo divination sticks (zeichiku) before his forehead in solemn concentration; a large pale moon glows behind him; mystical rays of light; a faint image of a fish pierced in a line appears in the mist.',
 'miya':'An empty, mystical night sky background: a soft glowing moon-like halo of gold light in the center over deep indigo, faint drifting mist and subtle gold dust, minimal, plenty of empty space in the middle for a large title character to be overlaid later.',
 'hari':'A traditional Japanese acupuncturist in a dark kimono carefully inserts a thin gold needle into the abdomen of the young man from the reference, who lies on a futon; stylized lightning-like swirls suggest his stomach rumbling like thunder; lantern light, a sense of relief.',
 'lesson':'A lone figure standing on a crumbling mountain ridge at dawn, rocks falling away behind, raising one hand decisively toward the rising sun; mist in the valleys below; resolute and hopeful mood.',
 'cta':'A majestic blue dragon (seiryu) coiling through clouds above Mount Fuji at sunrise, golden light breaking through, auspicious and calm, leaving the lower third relatively simple.',
}
# どの場面にどの参照顔を渡すか
REFS={'hook':['man'],'visit':['takashima'],'zei':['takashima'],'hari':['man']}

def b64img(path):
    return {'inlineData':{'mimeType':'image/png','data':base64.b64encode(open(path,'rb').read()).decode()}}
def call(prompt,imgs=(),seeds=()):
    parts=[b64img(s) for s in seeds]+[b64img(f'g/ref_{k}.png') for k in imgs]
    parts.append({'text':prompt})
    body=json.dumps({'contents':[{'parts':parts}],
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
                    if d: return base64.b64decode(d['data']),m
            err=f'{m}: 画像なし {json.dumps(r)[:300]}'
    sys.exit(f'失敗 → {err}')

def ensure_ref(k):
    f=f'g/ref_{k}.png'
    if os.path.exists(f): print('skip ref',k); return
    seeds=[REF_SEED[k]] if k in REF_SEED and os.path.exists(REF_SEED[k]) else []
    data,m=call(STYLE+REFP[k],seeds=seeds)
    open(f,'wb').write(data); print('ref',k,'←',m,'(実写種あり)' if seeds else '')

os.makedirs('g',exist_ok=True)
targets=sys.argv[1:] or list(P)
# 必要な参照顔を先に用意
for k in {r for sc in targets for r in REFS.get(sc,[])}:
    ensure_ref(k)
for sc in targets:
    if os.path.exists(f'g/{sc}.png'): print('skip',sc); continue
    data,m=call(STYLE+P[sc],REFS.get(sc,[]))
    open(f'g/{sc}.png','wb').write(data); print(sc,'←',m)
