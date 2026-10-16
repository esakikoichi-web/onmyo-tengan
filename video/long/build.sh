set -e
rm -f list.txt alist.txt
GAP=0.45
for f in f/*.png; do b=$(basename $f .png); d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 a/$b.mp3); echo "file '$f'" >> list.txt; echo "duration $(python3 -c "print(round($d+$GAP,3))")" >> list.txt; echo "file 'a/$b.mp3'" >> alist.txt; echo "file 'sil.mp3'" >> alist.txt; done
echo "file '$(ls f/*.png | tail -1)'" >> list.txt
ffmpeg -loglevel error -y -f lavfi -i anullsrc=r=24000:cl=mono -t $GAP -c:a libmp3lame -b:a 48k sil.mp3
ffmpeg -loglevel error -y -f concat -safe 0 -i alist.txt -ar 24000 -ac 1 voice.wav
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 voice.wav)
ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='0.030*sin(2*PI*110*t)*(0.6+0.4*sin(2*PI*0.08*t))+0.022*sin(2*PI*164.81*t)*(0.6+0.4*sin(2*PI*0.05*t+1))+0.016*sin(2*PI*220*t)+0.012*sin(2*PI*261.63*t)*(0.5+0.5*sin(2*PI*0.06*t+2))+0.008*sin(2*PI*329.63*t)*(0.5+0.5*sin(2*PI*0.09*t))':s=24000:d=$DUR" -af "afade=t=in:d=3,afade=t=out:st=$(python3 -c "print($DUR-4)"):d=4,lowpass=f=900" bgm.wav
ffmpeg -loglevel error -y -i voice.wav -i bgm.wav -filter_complex "[1]volume=0.55[b];[0][b]amix=inputs=2:duration=first:normalize=0" -ar 44100 -ac 2 mix.wav
ffmpeg -loglevel error -y -f concat -safe 0 -i list.txt -i mix.wav -vf "fps=30,format=yuv420p" -c:v libx264 -preset medium -crf 23 -tune stillimage -c:a aac -b:a 128k -shortest -movflags +faststart 魚を貫く針_試作.mp4
ffprobe -v error -show_entries format=duration,size -of csv=p=0 魚を貫く針_試作.mp4
