# 五行大義講話の生成

```
python3 tools/gogyo/md2html.py 五行大義.md /tmp/plain.html tools/gogyo/gogyo.css
python3 tools/gogyo/ruby.py /tmp/plain.html gogyo_taigi.html tools/gogyo/over.txt
```

ruby.py は fugashi と unidic-lite が必要（`pip install fugashi unidic-lite`）。
読みの誤りは over.txt（語句単位）と single.txt（一字単位）に追記して直す。
