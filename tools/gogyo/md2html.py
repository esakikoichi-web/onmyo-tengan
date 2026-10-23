import html, re, sys

src, dst = sys.argv[1], sys.argv[2]
lines = open(src, encoding="utf-8").read().split("\n")

def inline(s):
    s = html.escape(s, quote=False)
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)

out, toc, i, n = [], [], 0, 0
title = sub = ""
while i < len(lines):
    ln = lines[i]
    if ln.startswith("# ") and not title:
        title = ln[2:].strip(); i += 1
        while i < len(lines) and not lines[i].strip(): i += 1
        sub = lines[i].strip(); i += 1
        continue
    if ln.startswith("## 目次"):
        i += 1
        while i < len(lines) and not lines[i].startswith("---"): i += 1
        out.append("<!--TOC-->")
        continue
    if ln.startswith("# "):
        n += 1; t = ln[2:].strip()
        out.append(f'<h1 class="part" id="p{n}">{inline(t)}</h1>')
        toc.append((1, f"p{n}", t)); i += 1; continue
    if ln.startswith("## "):
        n += 1; t = ln[3:].strip()
        out.append(f'<h2 class="sec" id="s{n}">{inline(t)}</h2>')
        toc.append((2, f"s{n}", t)); i += 1; continue
    if ln.startswith("### "):
        out.append(f"<h3>{inline(ln[4:].strip())}</h3>"); i += 1; continue
    if ln.startswith("---"):
        i += 1; continue
    if ln.startswith("|"):
        rows = []
        while i < len(lines) and lines[i].startswith("|"):
            rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")]); i += 1
        body = [r for r in rows[1:] if not all(re.fullmatch(r"-+", c) for c in r)]
        if rows[1:] and all(re.fullmatch(r"-+", c) for c in rows[1]):
            head = rows[0]
        else:
            head, body = None, [r for r in rows if not all(re.fullmatch(r"-+", c) for c in r)]
        h = '<div class="tw"><table class="tri">'
        if head:
            h += "<tr>" + "".join(f"<th>{inline(c)}</th>" for c in head) + "</tr>"
        for r in body:
            h += "<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>"
        out.append(h + "</table></div>"); continue
    if ln.startswith("> "):
        buf = []
        while i < len(lines) and lines[i].startswith("> "):
            buf.append(lines[i][2:]); i += 1
        t = inline(" ".join(buf))
        t = re.sub(r"^<b>(.+?)</b>\s*", r'<span class="kl">\1</span>', t)
        out.append(f'<div class="kd">{t}</div>'); continue
    if ln.startswith("- "):
        buf = []
        while i < len(lines) and lines[i].startswith("- "):
            buf.append(f"<li>{inline(lines[i][2:])}</li>"); i += 1
        out.append('<ul class="sen">' + "".join(buf) + "</ul>"); continue
    if ln.startswith("※"):
        out.append(f'<p class="note">{inline(ln)}</p>'); i += 1; continue
    if ln.strip():
        out.append(f"<p>{inline(ln.strip())}</p>")
    i += 1

tochtml = '<div class="toc">'
for lv, a, t in toc:
    if lv == 1:
        tochtml += f'<div class="tp">{html.escape(t)}</div>'
    else:
        tochtml += f'<a href="#{a}"><b>{html.escape(t)}</b></a>'
tochtml += "</div>"
body = "\n".join(out).replace("<!--TOC-->", tochtml)

def find(prefix):
    for lv, a, t in toc:
        if t.startswith(prefix): return a
    return "top"

nav = [("序", "解説", find("解説")), ("行", "五行", find("一 ")), ("支", "干支", find("二 ")),
       ("配", "配当", find("六 ")), ("味", "気味", find("七 ")), ("神", "神霊", find("九 "))]
navhtml = "".join(f'<a href="#{a}"><b>{k}</b>{l}</a>' for k, l, a in nav)

css = open(sys.argv[3], encoding="utf-8").read()
page = f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>{html.escape(title)}</title>
<meta name="description" content="隋・蕭吉『五行大義』（中村璋八訳注）の解説と本文を、五行・干支・配当・気味・情性・神々・五霊ごとに整理した講話集">
<link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@500;700;800&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
<div class="wrap" id="top">
<header>
  <div class="ttl">{html.escape(title)}</div>
  <div class="sub">{html.escape(sub)}</div>
  <button class="themebtn" id="themebtn" aria-label="表示切替">◐</button>
</header>
<main>
{body}
</main>
</div>
<nav class="tabs"><div class="in">{navhtml}</div></nav>
<script>
(function(){{var b=document.getElementById("themebtn"),r=document.documentElement;
try{{var s=localStorage.getItem("gogyo-theme");if(s)r.setAttribute("data-theme",s);}}catch(e){{}}
b.onclick=function(){{var d=r.getAttribute("data-theme")==="dark"||(!r.getAttribute("data-theme")&&matchMedia("(prefers-color-scheme: dark)").matches);var n=d?"light":"dark";r.setAttribute("data-theme",n);try{{localStorage.setItem("gogyo-theme",n);}}catch(e){{}}}};}})();
</script>
</body>
</html>
"""
open(dst, "w", encoding="utf-8").write(page)
print(len(toc), "headings")
