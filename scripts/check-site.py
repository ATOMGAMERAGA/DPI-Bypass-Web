"""Check the published HTML, internal links, structured data and sitemap.

Run after `node scripts/build-site.mjs`. Uses only the Python standard library.
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import struct
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://dpi.atomland.xyz'
ROUTES = ['/', '/android/', '/windows/', '/linux/', '/sinirsiz-paylasim/']

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids = []
        self.links = []
        self.assets = []
        self.meta = {}
        self.canonical = None
        self.h1 = 0
        self.title = ''
        self.in_title = False
        self.in_json = False
        self.json_text = ''
        self.schemas = []
        self.feed(source)

    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'h1':
            self.h1 += 1
        if tag == 'title':
            self.in_title = True
        if tag == 'a' and 'href' in attrs:
            self.links.append(attrs['href'])
        if tag in ('img', 'script') and 'src' in attrs:
            self.assets.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical = attrs.get('href')
        if tag == 'link' and attrs.get('rel') in ('stylesheet', 'icon', 'apple-touch-icon'):
            self.assets.append(attrs['href'])
        if tag == 'meta':
            self.meta[attrs.get('name') or attrs.get('property')] = attrs.get('content')
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.in_json = True
            self.json_text = ''

    def handle_data(self, text):
        if self.in_title:
            self.title += text
        if self.in_json:
            self.json_text += text

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if tag == 'script' and self.in_json:
            self.schemas.extend(json.loads(self.json_text))
            self.in_json = False

def local_file(route):
    target = ROOT / unquote(route).lstrip('/')
    return target / 'index.html' if route.endswith('/') else target

pages = {route: Page(local_file(route).read_text(encoding='utf-8')) for route in ROUTES}
titles = set()
descriptions = set()
link_count = 0
for route, page in pages.items():
    assert page.h1 == 1, (route, 'Expected exactly one H1')
    assert len(page.ids) == len(set(page.ids)), (route, 'Duplicate element IDs')
    assert page.title and page.title not in titles, (route, 'Missing or duplicate page title')
    titles.add(page.title)
    description = page.meta.get('description')
    assert description and description not in descriptions, (route, 'Missing or duplicate description')
    descriptions.add(description)
    assert page.canonical == SITE + route, (route, 'Incorrect canonical')
    assert page.meta.get('og:url') == page.canonical, (route, 'Open Graph URL differs from canonical')
    assert page.meta.get('og:image') == SITE + '/assets/img/social.png', (route, 'Incorrect share image')
    assert page.schemas, (route, 'Missing structured data')
    if route in ('/android/', '/windows/', '/linux/'):
        app = next(schema for schema in page.schemas if schema.get('@type') == 'SoftwareApplication')
        assert app['url'] == page.canonical and app['offers']['price'] == '0'
    for href in page.links + page.assets:
        url = urlsplit(href)
        if url.scheme or url.netloc:
            continue
        target_route = url.path or route
        assert target_route.startswith('/'), (route, href, 'Expected root-relative local URL')
        target = local_file(target_route)
        assert target.is_file(), (route, href, 'Local link or asset is missing')
        if url.fragment:
            other = pages.get(target_route) or Page(target.read_text(encoding='utf-8'))
            assert unquote(url.fragment) in other.ids, (route, href, 'Anchor target is missing')
        link_count += 1
    assert '/releases/download/' not in local_file(route).read_text(encoding='utf-8'), (route, 'Version-pinned download URL')

sitemap = ET.parse(ROOT / 'sitemap.xml')
locations = {node.text for node in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
assert locations == {SITE + route for route in ROUTES}, 'Sitemap and public routes differ'
assert SITE + '/sitemap.xml' in (ROOT / 'robots.txt').read_text(), 'Robots lacks the sitemap'
assert 'noindex' in Page((ROOT / '404.html').read_text(encoding='utf-8')).meta['robots']
png = (ROOT / 'assets/img/social.png').read_bytes()
assert png[:8] == b'\x89PNG\r\n\x1a\n' and struct.unpack('>II', png[16:24]) == (1200, 630)
print(f'PASS: {len(pages)} pages, {link_count} internal links/assets, metadata, JSON-LD, sitemap, 404 and share image')
