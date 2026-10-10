import certifi,json,asyncio,os
certifi.where=lambda:"/root/.ccr/ca-bundle.crt"
import edge_tts
from readings import fix
S=json.load(open('script.json',encoding='utf-8'))['lines']
V={"N":("ja-JP-KeitaNeural","+4%","-2Hz"),"高島":("ja-JP-KeitaNeural","-6%","-10Hz"),"母":("ja-JP-NanamiNeural","+0%","-5Hz")}
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
