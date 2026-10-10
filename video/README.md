# 高島易断 実話動画の作り方

- long/ : 横長の解説版（約3分47秒）「魚を貫く針」
- short/ : 縦型60秒ショート（影絵風）「魚を貫く針」

## 必要なもの
- フォント：video/fonts/ に Noto Serif JP（500/800）を f1.ttf/f2.ttf、Zen Maru Gothic（500/700）を f3.ttf/f4.ttf として置く
  （Google Fonts の css2 API から取得。各スクリプトは ../vid/fonts を参照しているのでパスを合わせる）
- python: pykakasi（読み上げ用のかな変換）。声は edge-tts か VOICEVOX のどちらか。、node: playwright（画面）、ffmpeg

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

## 顔の一貫性・掴み（短編テンプレ）
- 登場人物は先に基準顔 g/ref_man.png（患者）・g/ref_takashima.png（高島嘉右衛門）を作り、各場面に参照画像として渡して同じ顔で描く（gen_art.py の REFS）。
- 高島嘉右衛門は実写肖像（video/short/ref_real/takashima_real.png・PD）を種に画風変換して基準顔を作る（REF_SEED）。実物の面立ちを保てる。
- 作り直し：基準顔から変えるなら g/ref_*.png を消す。場面だけなら g/<場面>.png を消して該当場面を再生成。
- 掴み（hook）は frames.js で字幕を大きく（.sub.big）、キーワードを金色強調（.hl）にしている。

## 読み（ナレーション）
- tts.py は読み上げ文を「手動辞書 R → 全文かな変換(pykakasi) → edge-tts」の順で処理し、漢字の自動誤読を防ぐ。
- 固有名詞・難読・誤読しやすい語（高島嘉右衛門／若宮／青龍孔一／以て→もって／一言→ひとこと／一手→いって／LINE→ライン 等）は R に登録して最優先で置換する。
- 新しい語で読みがおかしい時は R に1行足すだけでよい。

## 声（2系統）
読みは readings.py の fix() で統一（edge-tts版・VOICEVOX版 共通）。新しい語は readings.py の R に1行足すだけ。

### A. VOICEVOX（推奨・ローカル・APIなし）
1. VOICEVOX（本体 or ENGINE）を起動し http://127.0.0.1:50021 で待受け（PCならGUIを起動するだけ）。
   - 別ホストなら VOICEVOX_URL で指定。
2. `python3 tts_voicevox.py` → a/NN.mp3
   - 既定の声：N=青山龍星「しっとり」／高島=玄野武宏「ノーマル」／母=九州そら「ノーマル」。
   - 変更は環境変数 VV_N / VV_TAKASHIMA / VV_HAHA（例 VV_N="青山龍星:ノーマル"）。
3. `bash build.sh`

### B. edge-tts（簡易・無料だがオンライン通信）
1. `python3 tts.py` → a/NN.mp3
2. `bash build.sh`

### C. 自分の声（推奨・AI完全排除）
1. 録音台本.txt を見ながら、10行を1本に続けて録音（スマホのボイスメモでOK）。自然な間で読んでよい。
2. `python3 align_voice.py <録音ファイル>` → **文字起こし(faster-whisper)の時刻で台本の各行に合わせて自動分割**し a/NN.mp3（＋整音）。
   - 無音の位置に頼らないので、行の途中で間が空いてもズレにくい。完全ローカル・API不使用。
   - モデルは環境変数 WHISPER_MODEL（既定 small。精度を上げるなら medium）。
   - 特定カットを録り直したい時は、その番号の a/NN.mp3 だけ差し替えてもよい。
3. `bash build.sh`
※ 依存: faster-whisper, pykakasi, ffmpeg（無音分割の簡易版 split_voice.py も残してある）。録音台本.txt は script.json から作成（本文＝各行のt）。
