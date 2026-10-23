import re, sys, html, collections
import fugashi

tagger = fugashi.Tagger()
KAN = r"[㐀-鿿豈-﫿々〆]"
KAN_RE = re.compile(KAN)
GAN = "甲乙丙丁戊己庚辛壬癸"
SHI = "子丑寅卯辰巳午未申酉戌亥"
ON = dict(zip(GAN, "こう おつ へい てい ぼ き こう しん じん き".split()))
ON.update(zip(SHI, "し ちゅう いん ぼう しん し ご び しん ゆう じゅつ がい".split()))

def load_over(path):
    d = {}
    for ln in open(path, encoding="utf-8"):
        ln = ln.strip()
        if not ln or ln.startswith("#"): continue
        w, r = ln.split(None, 1)
        d[w] = r.strip()
    return d

OVER = load_over(sys.argv[3])
SINGLE = load_over(__import__("os").path.join(__import__("os").path.dirname(sys.argv[3]),"single.txt"))
OVER_RE = re.compile("|".join(sorted(map(re.escape, OVER), key=len, reverse=True)))

def kata2hira(s):
    return "".join(chr(ord(c) - 0x60) if "ァ" <= c <= "ヶ" else c for c in s)

def rb(base, yomi):
    return f"<ruby>{base}<rt>{yomi}</rt></ruby>"

def ruby_word(surf, yomi):
    """surf: token surface, yomi: hiragana reading. Put ruby only over kanji parts."""
    if not KAN_RE.search(surf) or not yomi:
        return html.escape(surf)
    # split surface into alternating kana / kanji chunks, align kana chunks to reading
    parts = re.findall(KAN + "+|[^" + KAN[1:-1] + "]+", surf)
    pat = ""
    for p in parts:
        pat += "(.+?)" if KAN_RE.match(p) else "(" + re.escape(kata2hira(p)) + ")"
    m = re.fullmatch(pat, yomi)
    if not m:
        return rb(html.escape(surf), yomi)
    out = ""
    for p, g in zip(parts, m.groups()):
        out += rb(p, g) if KAN_RE.match(p) else html.escape(p)
    return out

VOCAB = collections.Counter()

def tag_plain(text):
    out = ""
    toks = list(tagger(text))
    for i, w in enumerate(toks):
        s = w.surface
        if not KAN_RE.search(s):
            out += html.escape(s); continue
        if all(c in ON for c in s) and (len(s) > 1 or w.feature.pos1 in ("名詞", "記号", "補助記号") or (w.feature.kana or "") in ("", "*")):
            out += "".join(rb(c, ON[c]) for c in s)
            VOCAB[(s, "+".join(ON[c] for c in s))] += 1
            continue
        if s in SINGLE:
            VOCAB[(s, SINGLE[s] + " S")] += 1
            out += rb(html.escape(s), SINGLE[s]); continue
        k = w.feature.kana
        y = kata2hira(k) if k and k != "*" else ""
        VOCAB[(s, y)] += 1
        out += ruby_word(s, y) if y else html.escape(s)
    return out

def rubify(text):
    text = html.unescape(text)
    out, pos = "", 0
    for m in OVER_RE.finditer(text):
        if len(m.group(0)) == 1:
            a = text[m.start()-1] if m.start() else ""
            b = text[m.end()] if m.end() < len(text) else ""
            if (a and KAN_RE.match(a)) or (b and KAN_RE.match(b)) or (b and "ぁ" <= b <= "ん" and b not in "はのをがとにもへでやよ"):
                continue
        out += tag_plain(text[pos:m.start()])
        w = m.group(0); r = OVER[w]
        if "|" in r:  # per-kanji readings "a|b|c"
            ks = [c for c in w if KAN_RE.match(c)]
            rs = r.split("|"); j = 0; seg = ""
            for c in w:
                if KAN_RE.match(c): seg += rb(c, rs[j]); j += 1
                else: seg += html.escape(c)
            out += seg
        else:
            out += ruby_word(w, r)
        VOCAB[(w, r + " *")] += 1
        pos = m.end()
    return out + tag_plain(text[pos:])

src = open(sys.argv[1], encoding="utf-8").read()
head, body = src.split("<body>", 1)
pieces = re.split(r"(<[^>]+>)", body)
skip = False
for i, p in enumerate(pieces):
    if p.startswith("<"):
        if p.startswith("<script") or p.startswith("<style"): skip = True
        if p.startswith("</script") or p.startswith("</style"): skip = False
        continue
    if not skip and KAN_RE.search(p):
        pieces[i] = rubify(p)
open(sys.argv[2], "w", encoding="utf-8").write(head + "<body>" + "".join(pieces))
if len(sys.argv) > 4:
    with open(sys.argv[4], "w", encoding="utf-8") as f:
        for (s, y), n in sorted(VOCAB.items(), key=lambda x: -x[1]):
            f.write(f"{n}\t{s}\t{y}\n")
