# 高島易断 実話動画の作り方

- long/ : 横長の解説版（約3分47秒）「魚を貫く針」
- short/ : 縦型60秒ショート（影絵風）「魚を貫く針」

## 必要なもの
- フォント：video/fonts/ に Noto Serif JP（500/800）を f1.ttf/f2.ttf、Zen Maru Gothic（500/700）を f3.ttf/f4.ttf として置く
  （Google Fonts の css2 API から取得。各スクリプトは ../vid/fonts を参照しているのでパスを合わせる）
- python: edge-tts（声）、node: playwright（画面）、ffmpeg

## 手順（short）
1. script.json に台本（sc=場面、who=話者、t=読み上げ、sub=字幕）
2. python3 tts.py → a/*.mp3
3. node frames.js → f/art_*.png（影絵）と f/t_*.png（文字）
4. bash build.sh → 魚を貫く針_ショート.mp4

## 画像生成APIを使う場合
art.js の影絵の代わりに、画像生成APIで f/art_<場面>.png を作れば、そのまま組み込まれる。
