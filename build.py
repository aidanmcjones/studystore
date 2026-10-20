#!/usr/bin/env python3
"""Render templates/*.html into the site using site.json. Stdlib only.

Usage: python3 build.py
Placeholders in templates:
  {{root}} relative path to site root, {{site_name}}, {{disclaimer}}, {{contact}},
  {{updated}}, {{base_url}}, {{buy:SLUG}}, {{price:SLUG}}, {{title:SLUG}},
  any other top-level site.json string key.
"""
import json, re, html
from pathlib import Path

ROOT = Path(__file__).parent
site = json.loads((ROOT / "site.json").read_text())
products = {p["slug"]: p for p in site["products"]}

# (template, output, title, description, noindex)
PAGES = [
    ("index.html", "index.html", "StudyStore | Original MCAT study packs",
     "Original, high-yield MCAT study packs: an Anki deck plus a printable cheat sheet. Pack 1: Amino Acids, Proteins and Enzyme Kinetics, $9.", False),
    ("aa-enzymes.html", "products/aa-enzymes.html", "Amino Acids, Proteins & Enzyme Kinetics MCAT Pack | StudyStore",
     "120 original Anki cards and a 2-page printable cheat sheet covering amino acids, protein structure, and enzyme kinetics for MCAT prep. $9.", False),
    ("refund.html", "refund.html", "Refund Policy | StudyStore",
     "StudyStore offers a 14-day, no-questions-asked refund on every digital pack.", False),
    ("terms.html", "terms.html", "Terms of Sale | StudyStore",
     "Terms of sale for StudyStore digital study packs, sold through Lemon Squeezy as merchant of record.", False),
    ("privacy.html", "privacy.html", "Privacy Policy | StudyStore",
     "StudyStore collects no data, sets no cookies, and runs no analytics. Payments are handled by Lemon Squeezy.", False),
    ("404.html", "404.html", "Page not found | StudyStore", "Page not found.", True),
]

def contact():
    e = site.get("support_email")
    if e:
        return f'Contact: <a href="mailto:{html.escape(e)}">{html.escape(e)}</a>'
    return "Support email launching this week."

def buy(slug, cls="btn"):
    p = products[slug]
    url = p.get("checkout_url")
    if url:
        return f'<a class="{cls}" href="{html.escape(url)}" rel="noopener">Buy now, {html.escape(p["price"])}</a>'
    return f'<a class="{cls} off" aria-disabled="true" role="link" tabindex="-1">Available soon</a>'

def render(text, root):
    def sub(m):
        k = m.group(1).strip()
        if k == "root": return root
        if k == "contact": return contact()
        if ":" in k:
            kind, slug = k.split(":", 1)
            if kind == "buy": return buy(slug)
            if kind == "buyghost": return buy(slug, "btn ghost")
            if kind == "price": return products[slug]["price"]
            if kind == "title": return html.escape(products[slug]["title"])
        if k in site and isinstance(site[k], str): return site[k]
        raise KeyError(f"unknown placeholder {k}")
    return re.sub(r"\{\{\s*([^}]+?)\s*\}\}", sub, text)

base = (ROOT / "templates" / "base.html").read_text()
urls = []
for tpl, out, title, desc, noindex in PAGES:
    root = "../" * out.count("/")
    body = (ROOT / "templates" / tpl).read_text()
    page = base.replace("{{content}}", body)
    page = page.replace("{{page_title}}", html.escape(title)).replace("{{page_desc}}", html.escape(desc))
    page = page.replace("{{page_url}}", f'{site["base_url"]}/{out}' if out != "index.html" else site["base_url"] + "/")
    page = page.replace("{{robots}}", '<meta name="robots" content="noindex">' if noindex else "")
    if noindex:
        root = "/studystore/" if site["base_url"].endswith("/studystore") else "/"
    page = render(page, root)
    dest = ROOT / out
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(page)
    if not noindex:
        urls.append(site["base_url"] + "/" + ("" if out == "index.html" else out))

sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
sm += [f"  <url><loc>{u}</loc></url>" for u in urls] + ["</urlset>", ""]
(ROOT / "sitemap.xml").write_text("\n".join(sm))
(ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {site['base_url']}/sitemap.xml\n")
print(f"built {len(PAGES)} pages")
