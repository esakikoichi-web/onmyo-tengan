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
2.5 （任意）python3 gen_art.py → g/*.png（Gemini の絵）
3. node frames.js → f/art_*.png（影絵）と f/t_*.png（文字）
4. bash build.sh → 魚を貫く針_ショート.mp4

## 画像生成（Gemini）を使う場合
- `GEMINI_API_KEY=... python3 gen_art.py` → g/<場面>.png を生成（既存はスキップ。作り直す場面は消してから実行。`python3 gen_art.py hook zei` のように場面指定も可）
- モデルは `GEMINI_IMAGE_MODEL`（カンマ区切りで順に試す。既定 gemini-3-pro-image-preview,gemini-2.5-flash-image）
- その後 node frames.js → bash build.sh。g/ に画像がある場面はそれが使われ、無い場面は art.js の影絵になる
- 「宮」の場面は文字化けを避けるため、背景だけ生成して文字は frames.js で重ねる
