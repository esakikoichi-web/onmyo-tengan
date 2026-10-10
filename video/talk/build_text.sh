set -e
# 声なし版：各行の文字量から表示時間を決め、BGMだけで聴かせる。
rm -f clips.txt; mkdir -p c
N=$(python3 -c "import json;print(len(json.load(open('script.json'))['lines']))")
python3 - <<'PY' > durs.txt
import json,re
for ln in json.load(open('script.json'))['lines']:
    s=re.sub(r'[〈〉\n　 ]','',ln['sub'])
    d=max(2.6, 1.3+0.165*len(s))      # 読む時間の目安
    print(round(d,3))
PY
mapfile -t DUR < durs.txt
for i in $(seq -f "%02g" 0 $((N-1))); do
 D=${DUR[$((10#$i))]}; FR=$(python3 -c "print(int($D*30)+1)")
 ffmpeg -loglevel error -y -loop 1 -i f/$i.png -filter_complex \
  "[0]scale=1188:2112,zoompan=z='1+0.010*on/$FR':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$FR:s=1080x1920:fps=30,fade=t=in:d=0.45,fade=t=out:st=$(python3 -c "print(round($D-0.45,3))"):d=0.45,format=yuv420p[v]" \
  -map "[v]" -t $D -r 30 -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p c/$i.mp4
 echo "file 'c/$i.mp4'" >> clips.txt
done
ffmpeg -loglevel error -y -f concat -safe 0 -i clips.txt -c copy body.mp4
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 body.mp4)
ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='0.032*sin(2*PI*110*t)*(0.6+0.4*sin(2*PI*0.07*t))+0.022*sin(2*PI*146.83*t)*(0.6+0.4*sin(2*PI*0.05*t+1))+0.015*sin(2*PI*220*t)*(0.5+0.5*sin(2*PI*0.06*t+2))':s=44100:d=$DUR" \
 -af "afade=t=in:d=2,afade=t=out:st=$(python3 -c "print($DUR-3)"):d=3,lowpass=f=820,volume=0.8" -ac 2 bgm.wav
ffmpeg -loglevel error -y -i body.mp4 -i bgm.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 160k -movflags +faststart 占いは使うもの_無声_ショート.mp4
ffprobe -v error -show_entries format=duration,size -of csv=p=0 占いは使うもの_無声_ショート.mp4
