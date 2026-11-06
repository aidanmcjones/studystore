"""Run after build.py from the repo root. Fails if a sitemap page is deeper than two clicks from home, lacks a
visible breadcrumb nav or BreadcrumbList JSON-LD, has no lastmod, or a child page is not linked from its index."""
import re, os, glob, sys
from collections import deque
sm = re.findall(r'<loc>(.*?)</loc>(?:<lastmod>(.*?)</lastmod>)?', open('sitemap.xml').read())
def path(u):
    p = re.sub(r'^https://[^/]+/', '', u)
    return p + 'index.html' if (p == '' or p.endswith('/')) else (p if p.endswith('.html') else p + '.html')
files = {path(u): lm for u, lm in sm}
def links(f):
    out = set()
    for h in re.findall(r'href="([^"#?]*)"', open(f).read()):
        h = re.sub(r'^https://(www\.)?studystore\.co', '', h) or '/'
        if h.startswith(('http', 'mailto', 'tel')): continue
        n = h[1:] if h.startswith('/') else os.path.normpath(os.path.join(os.path.dirname(f), h))
        if n in ('', '.'): n = 'index.html'
        if n.endswith('/'): n += 'index.html'
        if os.path.isdir(n) and os.path.exists(n + '/index.html'): n += '/index.html'
        if not n.endswith('.html') and os.path.exists(n + '.html'): n += '.html'
        out.add(n)
    return out
depth = {'index.html': 0}; q = deque(['index.html'])
while q:
    f = q.popleft()
    for n in links(f):
        if n.endswith('.html') and n not in depth and os.path.exists(n):
            depth[n] = depth[f] + 1; q.append(n)
errs = []
for p, lm in files.items():
    if not lm: errs.append(f'no lastmod: {p}')
    if depth.get(p, 99) > 2: errs.append(f'deeper than 2 clicks: {p}')
    if p == 'index.html' or p.count('/') == 0: continue
    t = open(p).read()
    if '"BreadcrumbList"' not in t: errs.append(f'no BreadcrumbList JSON-LD: {p}')
    if 'class="crumbs' not in t: errs.append(f'no visible breadcrumb nav: {p}')
for hub in ['notes', 'practice', 'products', 'tools', 'compare']:
    ln = links(f'{hub}/index.html')
    for c in glob.glob(f'{hub}/*.html'):
        if c.endswith('index.html') or c not in files: continue
        if c not in ln: errs.append(f'{hub}/index.html does not link {c}')
        if f'{hub}/index.html' not in links(c) and hub != 'practice': errs.append(f'{c} has no link back to {hub}/index.html')
for hub in glob.glob('practice/*/index.html'):
    if hub not in files: errs.append(f'hub not in sitemap: {hub}')
for e in errs[:40]: print(e)
print('index crawl test:', 'FAIL %d' % len(errs) if errs else 'ok', f'({len(files)} sitemap pages)')
sys.exit(1 if errs else 0)
