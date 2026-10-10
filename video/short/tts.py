import certifi,json,asyncio,os
certifi.where=lambda:"/root/.ccr/ca-bundle.crt"
import edge_tts,pykakasi
S=json.load(open('script.json',encoding='utf-8'))['lines']
V={"N":("ja-JP-KeitaNeural","+4%","-2Hz"),"高島":("ja-JP-KeitaNeural","-6%","-10Hz"),"母":("ja-JP-NanamiNeural","+0%","-5Hz")}
# 固有名詞・難読・文脈で誤読しやすい語は先に手動でかな化（pykakasiより優先）
R=[("青龍孔一","せいりゅうこういち"),("高島嘉右衛門","たかしまかえもん"),("嘉右衛門","かえもん"),
   ("若宮","わかみや"),("鍼医","しんい"),("宮人","きゅうじん"),("寵せらる","ちょうせらる"),("宮の字","みやのじ"),
   ("穿つ","うがつ"),("以て","もって"),("一卦","いっか"),("一言","ひとこと"),("一手","いって"),
   ("匙","さじ"),("易","えき"),("観ます","みます"),("LINE","ライン")]
_k=pykakasi.kakasi()
def fix(t):
    for a,b in R: t=t.replace(a,b)
    # 残った漢字をすべてひらがなへ（edge-ttsの自動読みに任せず原文どおりに読ませる）
    return ''.join(x['hira'] for x in _k.convert(t))
async def one(i,ln):
    out=f"a/{i:02d}.mp3"
    v,r,p=V[ln['who']]
    for k in range(4):
        try: await edge_tts.Communicate(fix(ln['t']),v,rate=r,pitch=p).save(out);return
        except Exception as e: print('retry',e);await asyncio.sleep(4)
async def main():
    os.makedirs('a',exist_ok=True)
    await asyncio.gather(*[one(i,l) for i,l in enumerate(S)])
asyncio.run(main())
