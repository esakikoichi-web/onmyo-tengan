import certifi,json,asyncio,os
certifi.where=lambda:"/root/.ccr/ca-bundle.crt"
import edge_tts
S=json.load(open('script.json',encoding='utf-8'))
V={"N":("ja-JP-KeitaNeural","+8%","+0Hz"),"T":("ja-JP-KeitaNeural","+2%","-10Hz"),"A":("ja-JP-KeitaNeural","+6%","+8Hz")}
R=[("盗人","ぬすびと"),("易聖","えきせい"),("夕べ","ゆうべ"),("嘉右衛門","かえもん"),("天沢履","てんたくり"),("九二","きゅうじ"),("上九","じょうきゅう"),("履むを視て祥を考う","ふむをみて、しょうをかんがう"),("其れ旋れば","それめぐれば"),("元吉","げんきち"),("縛に就く","ばくにつく"),("一卦","いっか"),("観ます","みます"),("卦","か"),("衣服","いふく"),("主","あるじ"),("品","しな"),("五か月","ごかげつ")]
def fix(t):
    for a,b in R: t=t.replace(a,b)
    return t
async def one(i,l):
    out=f"a/{i:02d}.mp3"
    if os.path.exists(out): return
    v,r,p=V[l['who']]
    for k in range(4):
        try: await edge_tts.Communicate(fix(l['t']),v,rate=r,pitch=p).save(out);return
        except Exception as e: print('retry',i,e);await asyncio.sleep(4*(k+1))
async def main():
    os.makedirs('a',exist_ok=True)
    await asyncio.gather(*[one(i,l) for i,l in enumerate(S)])
asyncio.run(main())
