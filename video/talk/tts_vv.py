# VOICEVOX（ローカル）で各行を読み上げ → a/NN.mp3。読みは readings.fix() で統一。
import json,os,sys,urllib.request,urllib.parse,subprocess
from readings import fix
URL=os.environ.get('VOICEVOX_URL','http://127.0.0.1:50021').rstrip('/')
SPK=os.environ.get('VV_SPEAKER','青山龍星:しっとり')
S=json.load(open('script.json',encoding='utf-8'))['lines']
def get(p): return json.load(urllib.request.urlopen(URL+p,timeout=30))
def post(p,d):
    return urllib.request.urlopen(urllib.request.Request(URL+p,data=d,headers={'Content-Type':'application/json'},method='POST'),timeout=120)
smap={}
for sp in get('/speakers'):
    for st in sp['styles']: smap[(sp['name'],st['name'])]=st['id']
name,_,style=SPK.partition(':')
sid=smap.get((name,style)) or next((i for (n,s),i in smap.items() if n==name), sorted(smap.values())[0])
os.makedirs('a',exist_ok=True)
for i,ln in enumerate(S):
    q=json.load(post('/audio_query?'+urllib.parse.urlencode({'text':fix(ln['t']),'speaker':sid}),b''))
    q['speedScale']=0.96; q['intonationScale']=1.1; q['pitchScale']=0.0
    q['prePhonemeLength']=0.15; q['postPhonemeLength']=0.45
    wav=post('/synthesis?'+urllib.parse.urlencode({'speaker':sid}),json.dumps(q).encode()).read()
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i','pipe:0','-ar','44100','-ac','2','-b:a','192k',f'a/{i:02d}.mp3'],input=wav)
    print(i,'→',fix(ln['t'])[:28])
print('ok')
