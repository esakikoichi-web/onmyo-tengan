set -e
GAP=0.35; rm -f clips.txt; mkdir -p c
N=$(ls a/*.mp3 | wc -l)
for i in $(seq -f "%02g" 0 $((N-1))); do
 d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 a/$i.mp3)
 D=$(python3 -c "print(round($d+$GAP,3))"); FR=$(python3 -c "print(int(($d+$GAP)*30)+1)")
 # 静止画をごく僅かにズーム（呼吸感）。フェードで柔らかく繋ぐ。
 ffmpeg -loglevel error -y -loop 1 -i f/$i.png -i a/$i.mp3 -filter_complex \
  "[0]scale=1188:2112,zoompan=z='1+0.010*on/$FR':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$FR:s=1080x1920:fps=30,fade=t=in:d=0.4,fade=t=out:st=$(python3 -c "print(round($D-0.4,3))"):d=0.4,format=yuv420p[v];[1]apad=pad_dur=$GAP,afade=t=in:d=0.15,afade=t=out:st=$(python3 -c "print(round($D-0.3,3))"):d=0.3[a]" \
  -map "[v]" -map "[a]" -t $D -r 30 -c:v libx264 -preset veryfast -crf 20 -c:a aac -b:a 160k -ar 44100 -ac 2 c/$i.mp4
 echo "file 'c/$i.mp4'" >> clips.txt
done
ffmpeg -loglevel error -y -f concat -safe 0 -i clips.txt -c copy body.mp4
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 body.mp4)
# 静かな低音パッドのBGM
ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='0.030*sin(2*PI*110*t)*(0.6+0.4*sin(2*PI*0.07*t))+0.020*sin(2*PI*146.83*t)*(0.6+0.4*sin(2*PI*0.05*t+1))+0.014*sin(2*PI*220*t)*(0.5+0.5*sin(2*PI*0.06*t+2))':s=44100:d=$DUR" \
 -af "afade=t=in:d=2,afade=t=out:st=$(python3 -c "print($DUR-3)"):d=3,lowpass=f=820" -ac 2 bgm.wav
ffmpeg -loglevel error -y -i body.mp4 -i bgm.wav -filter_complex "[1]volume=0.5[b];[0:a][b]amix=inputs=2:duration=first:normalize=0[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k -movflags +faststart 占いは使うもの_ショート.mp4
ffprobe -v error -show_entries format=duration,size -of csv=p=0 占いは使うもの_ショート.mp4
