import certifi,json,asyncio,os,subprocess,sys
certifi.where=lambda:"/root/.ccr/ca-bundle.crt"
import edge_tts
S=json.load(open('script.json',encoding='utf-8'))
V={"N":("ja-JP-KeitaNeural","-6%","+0Hz"),"高島":("ja-JP-KeitaNeural","-12%","-9Hz"),"若宮":("ja-JP-KeitaNeural","-4%","+6Hz"),"母":("ja-JP-NanamiNeural","-8%","-6Hz")}
R=[("嘉右衛門","かえもん"),("境町","さかいまち"),("錠太郎","じょうたろう"),("筮竹","ぜいちく"),("山地剥","さんちはく"),("六五","りくご"),("五爻","ごこう"),("爻辞","こうじ"),("爻","こう"),("宮人","きゅうじん"),("寵せらる","ちょうせらる"),("穿つ","うがつ"),("穿つこと","うがつこと"),("利しからざる无し","よろしからざるなし"),("中村敬宇","なかむらけいう"),("貫魚","かんぎょ"),("易の象","えきのしょう"),("剥","はく"),("万死","ばんし"),("鍼医","しんい"),("易聖","えきせい"),("実占","じっせん"),("一卦","いっか"),("観ます","みます"),("青龍孔一","せいりゅうこういち"),("上の爻","うえのこう"),("一本の陽","いっぽんのよう"),("姓","せい")]
def fix(t):
    for a,b in R: t=t.replace(a,b)
    return t
async def one(i,j,ln):
    out=f"a/{i:02d}_{j:02d}.mp3"
    if os.path.exists(out): return
    v,r,p=V[ln['who']]
    for k in range(4):
        try: await edge_tts.Communicate(fix(ln['t']),v,rate=r,pitch=p).save(out);return
        except Exception as e: print('retry',i,j,e,flush=True);await asyncio.sleep(4*(k+1))
async def main():
    os.makedirs('a',exist_ok=True);sem=asyncio.Semaphore(4)
    async def w(*a):
        async with sem: await one(*a)
    await asyncio.gather(*[w(i,j,ln) for i,sc in enumerate(S['scenes']) for j,ln in enumerate(sc['lines'])])
asyncio.run(main())
