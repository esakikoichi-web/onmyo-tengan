# denoise.rnnn について
- 音声デノイズ（ffmpeg arnndn）用の RNNoise モデル。
- 出典: GregorR/rnnoise-models（somnolent-hogwash, sh.rnnn）。元は Xiph RNNoise。BSDライセンス。
- align_voice.py が整音チェーンで使用（無ければ afftdn にフォールバック）。
