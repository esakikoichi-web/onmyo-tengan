# 自分の声の1本録音を、文字起こし(faster-whisper)の時刻で台本の各行に合わせて分割 → a/NN.mp3
# 無音の位置に頼らないので、自然に読むだけで正しく切れる。完全ローカル・API不使用。
# 使い方: python3 align_voice.py <録音ファイル>
import sys,os,glob,wave,subprocess,difflib
import numpy as np,pykakasi
from faster_whisper import WhisperModel
import json
if len(sys.argv)<2: sys.exit('使い方: python3 align_voice.py <録音ファイル>')
SRC=sys.argv[1]
# 整音チェーン: 低音カット→RNNデノイズ(arnndn)→残留ヒス用の軽いゲート→音量統一
RNNN=os.environ.get('RNNN_MODEL','denoise.rnnn')
_dn=f'arnndn=m={RNNN}:mix=0.9,' if os.path.exists(RNNN) else 'afftdn=nf=-30:tn=1,'
AF='highpass=f=90,'+_dn+'loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100'
S=json.load(open('script.json',encoding='utf-8'))['lines']
_k=pykakasi.kakasi()
def hira(t): return ''.join(x['hira'] for x in _k.convert(t))
# 1) 16k mono wav にして word単位で文字起こし
subprocess.run(['ffmpeg','-loglevel','error','-y','-i',SRC,'-ar','16000','-ac','1','/tmp/_align16.wav'],check=True)
w=wave.open('/tmp/_align16.wav','rb'); dur=w.getnframes()/w.getframerate()
a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768.0
m=WhisperModel(os.environ.get('WHISPER_MODEL','small'),device='cpu',compute_type='int8')
segs,_=m.transcribe(a,language='ja',vad_filter=True,word_timestamps=True)
# 2) 認識語を「ひらがな1文字→時刻」の列に展開
chars=[]; times=[]
for s in segs:
    for wd in (s.words or []):
        h=hira(wd.word.strip())
        if not h: continue
        for j,ch in enumerate(h):
            chars.append(ch); times.append(wd.start+(wd.end-wd.start)*(j+0.5)/len(h))
asr=''.join(chars)
if not asr: sys.exit('文字起こしに失敗しました。録音を確認してください。')
# 3) 台本（読み）を連結し、行ごとの終端文字位置を記録
script=''; bounds=[]
for ln in S:
    script+=hira(ln['t']); bounds.append(len(script))
# 4) 台本読み と 認識読み を文字単位でアライン。台本位置→認識位置の対応表を作る
sm=difflib.SequenceMatcher(None,script,asr,autojunk=False)
map_s2a={}
for a1,b1,n in sm.get_matching_blocks():
    for k in range(n): map_s2a[a1+k]=b1+k
def s_to_time(sp):
    # 台本位置spに最も近い対応を探し、その認識時刻を返す
    for d in range(0,len(script)):
        for q in (sp-d,sp+d):
            if q in map_s2a: return times[min(map_s2a[q],len(times)-1)]
    return None
# 5) 各行の終端時刻 → 区切り時刻
edges=[0.0]
for bi in bounds[:-1]:
    t=s_to_time(bi)
    edges.append(t if t else edges[-1])
edges.append(dur)
# 単調増加を保証
for i in range(1,len(edges)):
    if edges[i]<edges[i-1]+0.2: edges[i]=edges[i-1]+0.2
edges[-1]=max(edges[-1],edges[-2]+0.2)
# 6) 元音源から各区間を切り出し（整音込み）
for f in glob.glob('a/*.mp3'): os.remove(f)
os.makedirs('a',exist_ok=True)
for i in range(len(S)):
    st=max(0,edges[i]-0.08); en=min(dur,edges[i+1]+0.08)
    out=f'a/{i:02d}.mp3'
    subprocess.run(['ffmpeg','-loglevel','error','-y','-ss',f'{st:.3f}','-to',f'{en:.3f}','-i',SRC,
        '-af',AF,
        '-ac','2','-b:a','192k',out],check=True)
    print(f'{out}  {st:6.2f}-{en:6.2f} ({en-st:4.2f}s)  {hira(S[i]["t"])[:26]}')
print('ok')
