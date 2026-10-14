set -e
GAP=0.08; CLIP=5.041667
# カット順の sc（script.json と同じ並び）
SCS=(ikari heki chou shou wana rin torikaeshi ikari gojitsu nigasu kokuhaku kanketsu kanpeki kanpeki)
# sc → KlingクリップID
declare -A MAP=( [ikari]=4634 [heki]=4676 [chou]=4765 [shou]=4772 [wana]=4794 [rin]=4785 [torikaeshi]=4813 [gojitsu]=4828 [nigasu]=4841 [kokuhaku]=4836 [kanketsu]=5139 [kanpeki]=4865 )
rm -f clips.txt; mkdir -p ck
N=${#SCS[@]}
for idx in $(seq 0 $((N-1))); do
 i=$(printf '%02g' $idx)
 sc=${SCS[$idx]}; vid=kling/${MAP[$sc]}.mp4
 d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 a/$i.mp3)
 D=$(python3 -c "print(round($d+$GAP,3))")
 # クリップをD秒にフィット：短ければ等速トリム、長ければスロー。1080x1920に拡大→中央クロップ。
 PTS=$(python3 -c "print(round(max(1.0,$D/$CLIP),4))")
 ffmpeg -loglevel error -y -i "$vid" -i a/$i.mp3 -filter_complex \
  "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setpts=${PTS}*PTS,trim=0:$D,setpts=PTS-STARTPTS,fps=30[base];\
   movie=fo/$i.png[ov];[base][ov]overlay=0:0,fade=t=in:d=0.25,fade=t=out:st=$(python3 -c "print(round($D-0.3,3))"):d=0.3,format=yuv420p[v];\
   [1:a]apad=pad_dur=$GAP,afade=t=in:d=0.12,afade=t=out:st=$(python3 -c "print(round($D-0.3,3))"):d=0.3[a]" \
  -map "[v]" -map "[a]" -t $D -r 30 -c:v libx264 -preset veryfast -crf 20 -c:a aac -b:a 160k -ar 44100 -ac 2 ck/$i.mp4
 echo "file 'ck/$i.mp4'" >> clips.txt
done
ffmpeg -loglevel error -y -f concat -safe 0 -i clips.txt -c copy kbody.mp4
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 kbody.mp4)
ffmpeg -loglevel error -y -f lavfi -i "aevalsrc='0.030*sin(2*PI*110*t)*(0.6+0.4*sin(2*PI*0.07*t))+0.020*sin(2*PI*146.83*t)*(0.6+0.4*sin(2*PI*0.05*t+1))+0.014*sin(2*PI*220*t)*(0.5+0.5*sin(2*PI*0.06*t+2))':s=44100:d=$DUR" \
 -af "afade=t=in:d=2,afade=t=out:st=$(python3 -c "print($DUR-3)"):d=3,lowpass=f=860" -ac 2 bgm.wav
ffmpeg -loglevel error -y -i kbody.mp4 -i bgm.wav -filter_complex "[1]volume=0.5[b];[0:a][b]amix=inputs=2:duration=first:normalize=0[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k -movflags +faststart 完璧の語源_キングダム動画_60秒.mp4
ffprobe -v error -show_entries format=duration,size -of csv=p=0 完璧の語源_キングダム動画_60秒.mp4
