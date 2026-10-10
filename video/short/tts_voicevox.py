# VOICEVOX（ローカル・APIなし／完全オフライン）で読み上げ音声を作る → a/NN.mp3
# 前提: VOICEVOX ENGINE か VOICEVOX本体を起動し、http://127.0.0.1:50021 で待受けていること。
#   環境変数 VOICEVOX_URL で変更可（既定 http://127.0.0.1:50021）。
# 話者は役ごとに名前＋スタイルで指定（環境になければ近いものへフォールバック）。
#   VV_N="青山龍星:ナレーション"  VV_TAKASHIMA="玄野武宏:ノーマル"  VV_HAHA="九州そら:ノーマル" で上書き可。
# 読みは readings.fix() で統一（edge-tts版と同じ辞書）。
import json,os,sys,time,urllib.request,urllib.parse,subprocess
from readings import fix
URL=os.environ.get('VOICEVOX_URL','http://127.0.0.1:50021').rstrip('/')
S=json.load(open('script.json',encoding='utf-8'))['lines']
# 役→(話者名, スタイル名, 速度, 抑揚, 音高, 文末の間秒)。荘厳・実話ナレーション向けの既定。
ROLE={
 'N':        (os.environ.get('VV_N','青山龍星:しっとり'),            0.98,1.15,0.0,0.35),
 '高島':     (os.environ.get('VV_TAKASHIMA','玄野武宏:ノーマル'),   0.92,1.10,-0.03,0.4),
 '母':       (os.environ.get('VV_HAHA','九州そら:ノーマル'),         1.0,1.1,0.0,0.3),
}
def get(path):
    return json.load(urllib.request.urlopen(URL+path,timeout=30))
def post(path,data=None):
    req=urllib.request.Request(URL+path,data=data if isinstance(data,bytes) else json.dumps(data).encode(),
        headers={'Content-Type':'application/json'},method='POST')
    return urllib.request.urlopen(req,timeout=120)
def build_speaker_map():
    m={}
    for sp in get('/speakers'):
        for st in sp['styles']: m[(sp['name'],st['name'])]=st['id']
    return m
def resolve(spec,smap):
    name,_,style=spec.partition(':')
    if (name,style) in smap: return smap[(name,style)]
    # 同名の別スタイル→その話者の先頭
    for (n,s),i in smap.items():
        if n==name: print(f'  [!] {spec} が無いので {n}:{s} を使用'); return i
    i=sorted(smap.values())[0]; print(f'  [!] {spec} が見つからず id={i} を使用'); return i
def synth(text,sid,speed,inton,pitch,post_pause):
    kana=fix(text)
    q=json.load(post('/audio_query?'+urllib.parse.urlencode({'text':kana,'speaker':sid})))
    q['speedScale']=speed; q['intonationScale']=inton; q['pitchScale']=pitch
    q['prePhonemeLength']=0.1; q['postPhonemeLength']=post_pause
    wav=post('/synthesis?'+urllib.parse.urlencode({'speaker':sid}),json.dumps(q).encode()).read()
    return wav
def main():
    try: smap=build_speaker_map()
    except Exception as e: sys.exit(f'VOICEVOX ENGINE に接続できません（{URL}）。起動を確認してください: {e}')
    os.makedirs('a',exist_ok=True)
    cache={}
    for i,ln in enumerate(S):
        spec,sp,it,pi,pp=ROLE[ln['who']]
        sid=cache.setdefault(spec,resolve(spec,smap))
        wav=synth(ln['t'],sid,sp,it,pi,pp)
        out=f'a/{i:02d}.mp3'
        p=subprocess.run(['ffmpeg','-loglevel','error','-y','-i','pipe:0','-ar','44100','-ac','2','-b:a','192k',out],
                         input=wav)
        print(i,ln['who'],'→',out,'|',fix(ln['t'])[:30])
    print('ok')
main()
