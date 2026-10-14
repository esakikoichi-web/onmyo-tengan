import subprocess as sp,wave,struct,math,glob,os
U='/root/.claude/uploads/70a4a33c-0b34-5313-8564-9adb7143cea2/'
K=['e21785f3-___1__','__246__3','__246__4','___1___4','___1___5','___1___6','___1___7','____3_____2','___1___8','89f23bf8-___1___22','__246__5','___1___10','___1___11','___1___12','__246__6','__246__7','916b85a1-___1___13','___1___14']
# pause after each line (seconds of breath before next), longer at story beats
P=[0.9,0.6,0.6,0.6,0.7,0.6,0.6,0.8,0.6,0.6,0.6,0.7,0.6,0.9,0.8,0.6,0.7,0]
def env(f):
    sp.run(['ffmpeg','-v','error','-y','-i',f,'-ac','1','-ar','16000','e.wav'])
    w=wave.open('e.wav');n=w.getnframes();d=struct.unpack('<%dh'%n,w.readframes(n));s=800
    return [20*math.log10(max(1e-9,(sum(x*x for x in d[i:i+s])/s)**.5/32768)) for i in range(0,n,s)],0.05
for i,k in enumerate(K):
    f=[x for x in glob.glob(U+'*'+k+'.m4a')][0]
    e,st=env(f);on=[j for j,v in enumerate(e) if v>-36]
    a=max(0,on[0]*st-0.12);b=min(len(e)*st,(on[-1]+1)*st+0.25)
    sp.run(['ffmpeg','-v','error','-y','-ss',str(a),'-to',str(b),'-i',f,'-af',f'afftdn=nf=-40,afade=t=in:d=0.08,afade=t=out:st={b-a-0.2}:d=0.2,apad=pad_dur={P[i]}','-ar','44100','-ac','1',f'n{i:02d}.wav'],check=True)
    print(i,round(a,2),round(b,2))
