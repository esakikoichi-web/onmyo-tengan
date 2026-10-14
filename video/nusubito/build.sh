set -e
GAP=0.4; rm -rf c; mkdir -p c; : > vlist.txt; : > alist.txt
ffmpeg -loglevel error -y -f lavfi -i anullsrc=r=24000:cl=mono -t $GAP -c:a libmp3lame -b:a 64k sil.mp3
for a in a/*.mp3; do b=$(basename $a .mp3); d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $a); D=$(python3 -c "print(round($d+$GAP,3))"); N=$(python3 -c "print(int(round(($d+$GAP)*30)))")
 ffmpeg -loglevel error -y -loop 1 -i f/${b}_bg.png -loop 1 -i f/${b}_tx.png -filter_complex "[0]scale=1188:2112,zoompan=z='1+0.07*on/$N':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$N:s=1080x1920:fps=30[v];[v][1]overlay,fade=t=in:st=0:d=0.25,format=yuv420p" -t $D -r 30 -c:v libx264 -preset veryfast -crf 20 c/$b.mp4
 echo "file 'c/$b.mp4'" >> vlist.txt; echo "file '$a'" >> alist.txt; echo "file 'sil.mp3'" >> alist.txt; done
ffmpeg -loglevel error -y -f concat -safe 0 -i alist.txt -ar 24000 -ac 1 voice.wav
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 voice.wav)
ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='0.030*sin(2*PI*73.42*t)*(0.6+0.4*sin(2*PI*0.07*t))+0.022*sin(2*PI*110*t)*(0.6+0.4*sin(2*PI*0.05*t+1))+0.014*sin(2*PI*146.83*t)+0.010*sin(2*PI*174.61*t)*(0.5+0.5*sin(2*PI*0.06*t+2))':s=24000:d=$DUR" -af "afade=t=in:d=2,afade=t=out:st=$(python3 -c "print($DUR-3)"):d=3,lowpass=f=700" bgm.wav
ffmpeg -loglevel error -y -i voice.wav -i bgm.wav -filter_complex "[1]volume=0.6[b];[0][b]amix=inputs=2:duration=first:normalize=0" -ar 44100 -ac 2 mix.wav
ffmpeg -loglevel error -y -f concat -safe 0 -i vlist.txt -i mix.wav -c:v copy -c:a aac -b:a 160k -shortest -movflags +faststart 盗人は五か月後に捕まる.mp4
ffprobe -v error -show_entries format=duration,size -of csv=p=0 盗人は五か月後に捕まる.mp4
