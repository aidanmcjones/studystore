"""Fail if any built page links to a redirecting or missing internal URL (run after build.py, from the repo root)."""
import re,glob,os,collections,sys
from urllib.parse import urljoin,urlparse
B='https://www.studystore.co'
red=[ l.split()[0] for l in open('_redirects') if l.strip() and not l.startswith('#')]
def exists(path):
    # path like /a/b or /a/b/ ; returns kind
    if path.endswith('/'): return os.path.exists('.'+path+'index.html')
    if path.endswith('.html'): return 'redir' if os.path.exists('.'+path) else None
    if os.path.exists('.'+path+'.html'): return True
    if os.path.isdir('.'+path): return 'dirredir'  # redirects to /x/
    if os.path.isfile('.'+path): return True
    return None
res=collections.defaultdict(list)
for p in glob.glob('**/*.html',recursive=True):
    if p.startswith(('.deploy','node_modules','templates','content','tests')): continue
    t=open(p,errors='ignore').read()
    pu=B+'/'+p
    if p.endswith('index.html'): pu=B+'/'+p[:-10]
    else: pu=B+'/'+p[:-5]
    for m in re.finditer(r'(?:href|src|action)="([^"]+)"',t):
        u=m.group(1)
        if re.match(r'(mailto|tel|data|javascript|#|\{)',u): continue
        a=urljoin(pu,u); pr=urlparse(a)
        if pr.netloc not in ('www.studystore.co','studystore.co'): continue
        if pr.netloc!='www.studystore.co': res['apex'].append((p,u)); continue
        if pr.path.startswith(('/assets/','/media/','/api/')): continue
        k=exists(pr.path)
        if k is not True: res[str(k)].append((p,u))
print('internal link problems:' if res else 'internal links clean')
for k,v in res.items():
    c=collections.Counter(u for _,u in v); print(k,len(v),len(c))
    for u,n in c.most_common(15): print('  ',n,u,[p for p,x in v if x==u][0])

sys.exit(1 if res else 0)
