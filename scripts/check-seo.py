#!/usr/bin/env python3
"""Check the public sitemap and canonical page metadata using only the standard library."""

import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import ssl
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET


CANONICAL_ORIGIN = "https://www.faangin.com"
PAGE_PATHS = ("/", "/coding-interview", "/system-design-interview", "/behavioral-interview")
TLS_CONTEXT = ssl.create_default_context()
# Some macOS Python installs omit their own CA bundle. Use the system trust
# bundle in that case, while retaining certificate and hostname verification.
if sys.platform == "darwin" and not ssl.get_default_verify_paths().cafile and Path("/etc/ssl/cert.pem").is_file():
    TLS_CONTEXT.load_verify_locations("/etc/ssl/cert.pem")


def fetch(url):
    request = Request(url, headers={"User-Agent": "Faangin-SEO-Check/1.0"})
    with urlopen(request, timeout=25, context=TLS_CONTEXT) as response:
        if response.status != 200:
            raise ValueError(f"HTTP {response.status}")
        return response.read().decode("utf-8", errors="replace"), response.headers


class PageMetadata(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.titles = []
        self.descriptions = []
        self.canonicals = []
        self.h1_count = 0
        self.jsonld = []
        self.noindex = False
        self._svg_depth = 0
        self._title = None
        self._jsonld = None

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == "svg":
            self._svg_depth += 1
        if tag == "title" and not self._svg_depth:
            self._title = []
        if tag == "h1":
            self.h1_count += 1
        if tag == "meta":
            name = (attrs.get("name") or "").lower()
            content = attrs.get("content") or ""
            if name == "description":
                self.descriptions.append(content.strip())
            if name in ("robots", "googlebot", "bingbot") and "noindex" in content.lower():
                self.noindex = True
        if tag == "link" and "canonical" in (attrs.get("rel") or "").lower().split():
            self.canonicals.append(attrs.get("href"))
        if tag == "script" and (attrs.get("type") or "").lower() == "application/ld+json":
            self._jsonld = []

    def handle_data(self, data):
        if self._title is not None:
            self._title.append(data)
        if self._jsonld is not None:
            self._jsonld.append(data)

    def handle_endtag(self, tag):
        if tag == "title" and self._title is not None:
            self.titles.append(" ".join("".join(self._title).split()))
            self._title = None
        if tag == "script" and self._jsonld is not None:
            self.jsonld.append("".join(self._jsonld))
            self._jsonld = None
        if tag == "svg":
            self._svg_depth = max(0, self._svg_depth - 1)


def inspect_page(base_url, path):
    html, headers = fetch(base_url + path)
    page = PageMetadata()
    page.feed(html)
    errors = []
    if len(page.titles) != 1 or not page.titles[0]:
        errors.append("expected one nonempty title")
    if len(page.descriptions) != 1 or not page.descriptions[0]:
        errors.append("expected one nonempty description")
    expected_canonical = CANONICAL_ORIGIN + path
    valid_canonicals = ([expected_canonical], [CANONICAL_ORIGIN]) if path == "/" else ([expected_canonical],)
    if page.canonicals not in valid_canonicals:
        errors.append("canonical does not match the production URL")
    if page.h1_count != 1:
        errors.append(f"expected one H1, found {page.h1_count}")
    if page.noindex or "noindex" in headers.get("X-Robots-Tag", "").lower():
        errors.append("page is marked noindex")
    if not page.jsonld:
        errors.append("missing JSON-LD")
    for block in page.jsonld:
        try:
            value = json.loads(block)
            objects = value if isinstance(value, list) else [value]
            if not objects or not all(isinstance(item, dict) for item in objects):
                raise ValueError("expected JSON-LD objects")
            if not all("@context" in item and ("@type" in item or "@graph" in item) for item in objects):
                raise ValueError("missing JSON-LD context or type")
        except (json.JSONDecodeError, ValueError) as error:
            errors.append(f"invalid JSON-LD ({error})")
    return page, errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("base_url", nargs="?", default=CANONICAL_ORIGIN)
    parser.add_argument("--assets", action="store_true", help="also check favicon, brand mark, and social image responses")
    args = parser.parse_args()
    base_url = args.base_url.rstrip("/")
    base = urlsplit(base_url)
    if base.scheme not in ("http", "https") or not base.netloc or base.path or base.query or base.fragment or base.username or base.password:
        parser.error("base_url must be an HTTP or HTTPS origin without a path or credentials")

    failures = []
    expected_urls = {CANONICAL_ORIGIN + path for path in PAGE_PATHS}
    try:
        sitemap, _ = fetch(base_url + "/sitemap.xml")
        root = ET.fromstring(sitemap)
        urls = [element.text.strip() for element in root.iter() if element.tag.split("}")[-1] == "loc" and element.text]
        if len(urls) != len(PAGE_PATHS) or set(urls) != expected_urls:
            raise ValueError("expected the four unique canonical production page URLs")
        print("PASS sitemap contains all four canonical pages")
    except (HTTPError, URLError, TimeoutError, ValueError, ET.ParseError) as error:
        failures.append(f"sitemap {error}")

    try:
        robots_text, _ = fetch(base_url + "/robots.txt")
        robots = RobotFileParser()
        robots.parse(robots_text.splitlines())
        if CANONICAL_ORIGIN + "/sitemap.xml" not in (robots.site_maps() or []):
            raise ValueError("missing canonical Sitemap directive")
        if not all(robots.can_fetch(agent, CANONICAL_ORIGIN + path) for agent in ("Googlebot", "bingbot") for path in PAGE_PATHS):
            raise ValueError("indexable pages are blocked for search crawlers")
        print("PASS robots permits search crawling and points to the canonical sitemap")
    except (HTTPError, URLError, TimeoutError, ValueError) as error:
        failures.append(f"robots {error}")

    seen = {"title": {}, "description": {}}
    for path in PAGE_PATHS:
        try:
            page, errors = inspect_page(base_url, path)
            for label, values in (("title", page.titles), ("description", page.descriptions)):
                if len(values) == 1 and values[0]:
                    normalized = " ".join(values[0].split()).casefold()
                    if normalized in seen[label]:
                        errors.append(f"{label} duplicates {seen[label][normalized]}")
                    seen[label][normalized] = path
            if errors:
                failures.extend(f"{path} {error}" for error in errors)
            else:
                print(f"PASS {path} title, description, canonical, H1, and JSON-LD")
        except (HTTPError, URLError, TimeoutError, ValueError) as error:
            failures.append(f"{path} {error}")

    if args.assets:
        for path in ("/favicon.ico", "/icon.png", "/apple-icon.png", "/brand/faangin-mark.svg", "/brand/faangin-mark.png", "/opengraph-image"):
            try:
                _, headers = fetch(base_url + path)
                if not headers.get_content_type().startswith("image/"):
                    raise ValueError("expected an image response")
                print(f"PASS {path} image response")
            except (HTTPError, URLError, TimeoutError, ValueError) as error:
                failures.append(f"{path} {error}")

    for failure in failures:
        print(f"FAIL {failure}", file=sys.stderr)
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
