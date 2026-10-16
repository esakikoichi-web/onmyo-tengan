# 引き継ぎメモ（陰陽天眼・高島易断講話）

## ユーザー
- 本名：江﨑孔一／占い師名：青龍孔一
- 目標：高島嘉右衛門のような「日本一の易者」
- 返答は日本語で。

## 絶対ルール
1. **原文にないものは足さない。** 翻訳・解説に注釈や補足を勝手に加えない。
2. **確認してから言う。** 「無い」「できていない」と言う前に必ず実物を確認する。
3. **PRは作らない。** 作業ブランチ `claude/takashima-senrei` に commit & push のみ。
4. **フォントはすべて明朝体（しっぽり明朝）。** 読み込まれていることを実際に確認する。ゴシックが混ざるのは厳禁。

## サイト（成果物）
- 公開URL：https://claude.ai/artifact/B6UQrq3LjQSw1tU6FEAwYZ （サイドバーに固定済み）
- 本体：`takashima_ekidan.html` ＋ `takashima_*.js`
- 占筮履歴（「これまでの占筮」）は Artifact の db コレクション `zei`。

### ビルド＆公開手順
スクラッチパッド（`$S`）で実行する。
```
# 1) スクリプトをインライン化
node -e 'const fs=require("fs");const R="/home/user/onmyo-tengan/";let h=fs.readFileSync(R+"takashima_ekidan.html","utf8");h=h.replace(/<script src="([^"]+)"><\/script>/g,(m,f)=>"<script>"+fs.readFileSync(R+f,"utf8").replace(/<\/script/gi,"<\\/script")+"</script>");fs.writeFileSync("高島易断講話_preview.html",h)'
# 2) 事前レンダリング（Playwright chromium /opt/pw-browsers を使用。playwright install はしない）
node /home/user/onmyo-tengan/tools/static.js "$PWD/高島易断講話_preview.html" "$PWD/高島易断講話_static.html"
# 3) ダウンロード用コピー
cp 高島易断講話_static.html 高島易断講話.html
```
4) Artifact ツールで publish：`file_path` = `$S/高島易断講話_static.html`、`url` = 上記URL。
   **`capabilities` は省略する**（省略すれば db が引き継がれる）。

## 占例の記録手順（ユーザーが「〇〇の△爻」で占ったとき）
1. 原文（`source/gaodao/NN-*.txt` の `### 九四` 等、および `takashima_kousetsu.js`）を確認して判断する。
2. `takashima_myrei.js` の末尾 `];` の直前に追記する（Python で `s.rindex('];')` に挿入）。
   形式：`{n:卦番号, yi:爻index(0始まり), date:"YYYY-MM-DD", t:"題", d:"判断", r:"結果（未記入可）"}`
3. ArtifactData で `zei` に書き込む。形式：`{d, n, name, p, q, ts, y, zn}`
   - 卦名はサイト表記に合わせる（例：坤為地、雷地豫、雷水解、地水師、火雷噬嗑、山雷頤、坎為水、水地比、風澤中孚、山澤損、水火既濟、水山蹇）。
4. ビルド → publish → commit & push。
5. 結果記入のタイミングに合わせてリマインダー（send_later）を作成・更新する。

コミットメッセージ末尾：
```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01MFDsaTwboDwHmFFa1ot2LW
```
push：`git push -q origin claude/takashima-senrei`

## 高島の講説（全訳）
- 64卦すべて完了。`source/kousetsu_ja/NN.json` → `python3 tools/build_kz.py` → `takashima_kousetsu.js`
  （形式 `TK.kz={n:{k:[...],y:{"初九":[...]}}}`）。
- 巽六四は原文に講説が無いため欠。用九・用六はあり（爻数385）。
- 原文中の現代中国語の編者注（帝乙の伝記・京房注・馬王堆注・廬の定義・「本書認為」など）は除外済み。

## 結果待ちの占例とリマインダー
リマインダーは旧セッション session_01MFDsaTwboDwHmFFa1ot2LW に届く（新しいチャットには届かない）。
| 予定ID | 日時 | 対象 |
|---|---|---|
| trig_01MTP4ehKPyiDLtX6DpxHVad | 2026-10-31 20:00 JST | 晋六五（10件）、晋上九（今月の運気）、豫九四（宮下さん10月売上2500万）、離上九（途中） |
| trig_01Rd8waywXB6eqoyVb2ZDwHm | 2026-11-14 | 離上九（文章鑑定） |
| trig_01L2rUFLsCLwiVLAhJM2QkZs | 2027-10-15 | 恒初六（買取大吉1年黒字）、解九四（好きなものリール）、既済初九（途中）、中孚九五（12月退職）、坎九二（キャリアアドバイザー） |
| trig_01QMHR49Pqjkmx8jXB9tUk7m | 2030-10-15 | 既済初九（最終） |
- 噬嗑九四（次の仕事で一番大事なこと）：次の仕事が決まった時に記入（リマインダー無し）。

## ユーザーの現状（2026-10-16時点）
- 2026年12月末でイーライフグループを退職予定。
- 次の仕事：東京・副業可・未経験可の、建設業界特化・中小・両面型のキャリアアドバイザーを検討中。
  候補：アンドパッド（ビルダーワーク）、建設みらい総研、ウィルグループ、建設キャリア転職（CIC）。
- キャリアコンサルタント資格を目指す（約35〜45万円、専門実践教育訓練給付あり。会社支援か実務3年ルート）。
- 易の要点：坎九二＝CAは「険」だが「小得」、之卦比＝誰につくかが大事。噬嗑九四＝剛く・まっすぐ（金矢）。

## その他
- `video/`、`insta/`：インスタ用素材。`SENREI_DONE.md`：作業記録。
