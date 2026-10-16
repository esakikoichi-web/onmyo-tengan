set -e
GAP=0.2; rm -f clips.txt; mkdir -p c
N=$(ls a/*.mp3 | wc -l)
for i in $(seq -f "%02g" 0 $((N-1))); do
 sc=$(python3 -c "import json;print(json.load(open('script.json',encoding='utf-8'))['lines'][int('$i')]['sc'])")
 d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 a/$i.mp3); D=$(python3 -c "print(round($d+$GAP,3))"); FR=$(python3 -c "print(int(($d+$GAP)*30)+1)")
 ffmpeg -loglevel error -y -loop 1 -i f/art_$sc.png -loop 1 -i f/t_$i.png -i a/$i.mp3 -filter_complex "[0]scale=2160:2160,zoompan=z='1+0.0009*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$FR:s=1080x1080:fps=30[z];color=c=0x0b0c18:s=1080x1920:r=30[bg];[bg][z]overlay=0:300:shortest=1[v1];[v1][1]overlay=0:0:shortest=1,format=yuv420p[v];[2]apad=pad_dur=$GAP[a]" -map "[v]" -map "[a]" -t $D -c:v libx264 -preset veryfast -crf 22 -c:a aac -b:a 128k -ar 44100 -ac 2 c/$i.mp4
 echo "file 'c/$i.mp4'" >> clips.txt
done
ffmpeg -loglevel error -y -f concat -safe 0 -i clips.txt -c copy body.mp4
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 body.mp4)
ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='0.030*sin(2*PI*110*t)*(0.6+0.4*sin(2*PI*0.08*t))+0.022*sin(2*PI*164.81*t)*(0.6+0.4*sin(2*PI*0.05*t+1))+0.016*sin(2*PI*220*t)+0.012*sin(2*PI*261.63*t)*(0.5+0.5*sin(2*PI*0.06*t+2))':s=44100:d=$DUR" -af "afade=t=in:d=2,afade=t=out:st=$(python3 -c "print($DUR-3)"):d=3,lowpass=f=900" -ac 2 bgm.wav
ffmpeg -loglevel error -y -i body.mp4 -i bgm.wav -filter_complex "[1]volume=0.6[b];[0:a][b]amix=inputs=2:duration=first:normalize=0[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 128k -movflags +faststart 魚を貫く針_ショート.mp4
ffprobe -v error -show_entries format=duration,size -of csv=p=0 魚を貫く針_ショート.mp4
