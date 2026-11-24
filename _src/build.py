"""使い方: python _src/build.py a|b|final b   （final のときは選んだ案を index.html / style.css に出力）"""
import os, sys, shutil
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = os.path.join(R, '_src')
rd = lambda n: open(os.path.join(S, n), encoding='utf-8').read()
URL = 'https://agarieyrn-create.github.io/ai-seminar-lp/'
DESC = '60歳からのAI活用セミナー。スマホに話しかけるだけのAIを、講師がそばでお教えします。那覇市・参加無料・全3回。※架空のセミナーによるデザイン制作例です。'
FAVC = {'a': '2f5d3a', 'b': '0b5cad'}


def head(css, theme, final):
    og = ''
    if final:
        og = f'''<link rel="canonical" href="{URL}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ja_JP">
<meta property="og:title" content="はじめてのAI教室｜60歳からのAI活用セミナー（架空）">
<meta property="og:description" content="{DESC}">
<meta property="og:url" content="{URL}">
<meta property="og:image" content="{URL}images/ogp.jpg">
<meta name="twitter:card" content="summary_large_image">
'''
    return f'''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>おだやかAI教室｜60歳からのAI活用セミナー（那覇市・参加無料）</title>
<meta name="description" content="{DESC}">
{og}<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23{FAVC[theme]}'/%3E%3C/svg%3E">
<link rel="preload" as="image" href="images/hero.webp">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Noto+Serif+JP:wght@700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{css}">
</head>
<body>
'''


tail = '\n<script src="links.js" defer></script>\n</body>\n</html>\n'
body = rd('body.html')
shutil.copy(os.path.join(R, '..', '_motion', 'links.js'), os.path.join(R, 'links.js'))
mode = sys.argv[1]
if mode in ('a', 'b'):
    open(os.path.join(R, f'style-{mode}.css'), 'w', encoding='utf-8').write(rd('base.css') + '\n' + rd(f'theme_{mode}.css'))
    open(os.path.join(R, f'preview-{mode}.html'), 'w', encoding='utf-8').write(head(f'style-{mode}.css', mode, False) + body + tail)
else:
    t = sys.argv[2]
    open(os.path.join(R, 'style.css'), 'w', encoding='utf-8').write(rd('base.css') + '\n' + rd(f'theme_{t}.css'))
    open(os.path.join(R, 'index.html'), 'w', encoding='utf-8').write(head('style.css', t, True) + body + tail)
print('built', mode)
