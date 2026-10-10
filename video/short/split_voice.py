# 自分の声の1本録音を、無音で10カットに分割して a/NN.mp3 を作る。
# 使い方: python3 split_voice.py <録音ファイル>  （mp3/m4a/wav/aac など何でも可）
#   ちょうど10個になるよう、無音の長さ/しきい値を自動調整して探す。
#   うまく10個にならない時は、各行の間をもっとはっきり空けて録り直すか、
#   環境変数 EXPECT=カット数, MINSIL=最短無音ms, PAD=前後に残す無音ms を調整。
import os,sys,glob
from pydub import AudioSegment, silence
if len(sys.argv)<2: sys.exit('使い方: python3 split_voice.py <録音ファイル>')
src=sys.argv[1]
EXPECT=int(os.environ.get('EXPECT','10'))
PAD=int(os.environ.get('PAD','150'))
MINSILS=[int(os.environ['MINSIL'])] if os.environ.get('MINSIL') else [900,700,600,500,400,350]
def save(chunks):
    os.makedirs('a',exist_ok=True)
    for f in glob.glob('a/*.mp3'): os.remove(f)
    for i,c in enumerate(chunks):
        out=f'a/{i:02d}.mp3'
        c.set_frame_rate(44100).set_channels(2).export(out,format='mp3',bitrate='192k')
        print(f'  {out}  {len(c)/1000:.2f}秒')
audio=AudioSegment.from_file(src)
print(f'読み込み: {src}  長さ{len(audio)/1000:.1f}秒  平均{audio.dBFS:.1f}dBFS')
best=None
for ms in MINSILS:
    for rel in [14,16,18,20,22,12,24]:
        thr=audio.dBFS-rel
        chunks=silence.split_on_silence(audio,min_silence_len=ms,silence_thresh=thr,keep_silence=PAD)
        chunks=[c for c in chunks if len(c)>=300]  # ごく短い雑片は除外
        if best is None or abs(len(chunks)-EXPECT)<abs(best[0]-EXPECT):
            best=(len(chunks),ms,rel,chunks)
        if len(chunks)==EXPECT:
            print(f'  → {EXPECT}カット検出 (無音{ms}ms, しきい値{thr:.1f}dBFS)')
            save(chunks); sys.exit(0)
n,ms,rel,chunks=best
print(f'[!] ちょうど{EXPECT}個になりませんでした。最も近い検出= {n}個 (無音{ms}ms, dBFS-{rel})')
print('    → 各行の間を1〜2秒はっきり空けて録り直すか、EXPECT/MINSIL/PAD を調整してください。')
print('    とりあえず検出結果を書き出します（番号がズレている可能性あり・要確認）。')
save(chunks)
