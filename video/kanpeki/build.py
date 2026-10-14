import json,subprocess as sp
V="/root/.claude/uploads/70a4a33c-0b34-5313-8564-9adb7143cea2/00ea6626-___________.mp4"
C=json.load(open('cap.json'));GAP=0.3
def dur(f):return float(sp.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
vl=open('vl.txt','w');al=open('al.txt','w')
sp.run(['ffmpeg','-v','error','-y','-f','lavfi','-i','anullsrc=r=44100:cl=mono','-t',str(GAP),'sil.wav'])
for i,(a,b,_) in enumerate(C):
    id=f'{i:02d}';D=dur(f'v{id}.wav')+GAP
    if i==len(C)-1: D+=1.5
    f=D/(b-a)
    sp.run(['ffmpeg','-v','error','-y','-ss',str(a),'-t',str(b-a),'-i',V,'-loop','1','-i',f'c{id}.png','-filter_complex',
      f"[0:v]setpts={f}*(PTS-STARTPTS),fps=30,scale=1080:1920[v];[v][1]overlay=shortest=0,trim=duration={D},fade=t=in:st=0:d=0.2,format=yuv420p",
      '-an','-t',str(D),'-r','30','-c:v','libx264','-preset','veryfast','-crf','19',f'k{id}.mp4'],check=True)
    vl.write(f"file 'k{id}.mp4'\n");al.write(f"file 'v{id}.wav'\nfile 'sil.wav'\n")
vl.close();al.close()
sp.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i','al.txt','-ar','44100','-ac','1','voice.wav'],check=True)
T=dur('voice.wav')+1.5
sp.run(['ffmpeg','-v','error','-y','-f','lavfi','-i',f"aevalsrc='0.030*sin(2*PI*73.42*t)*(0.6+0.4*sin(2*PI*0.07*t))+0.022*sin(2*PI*110*t)*(0.6+0.4*sin(2*PI*0.05*t+1))+0.014*sin(2*PI*146.83*t)+0.010*sin(2*PI*174.61*t)*(0.5+0.5*sin(2*PI*0.06*t+2))':s=44100:d={T}",'-af',f'afade=t=in:d=2,afade=t=out:st={T-3}:d=3,lowpass=f=700','bgm.wav'],check=True)
sp.run(['ffmpeg','-v','error','-y','-i','voice.wav','-i','bgm.wav','-filter_complex','[0]apad[a];[1]volume=0.5[b];[a][b]amix=inputs=2:duration=longest:normalize=0','-t',str(T),'-ac','2','mix.wav'],check=True)
out='/home/user/onmyo-tengan/video/kanpeki/完璧_青龍孔一の声.mp4'
sp.run(['mkdir','-p','/home/user/onmyo-tengan/video/kanpeki'])
sp.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i','vl.txt','-i','mix.wav','-c:v','copy','-c:a','aac','-b:a','160k','-shortest','-movflags','+faststart',out],check=True)
print(dur(out))
