"""Build a single self-contained HTML file (images inlined as data URIs) for sending.

Usage: python3 build_single.py                              ->  netanel-proposal.html
       python3 build_single.py v3.html netanel-proposal-v3.html
"""
import base64
import io
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).parent
MAX_EDGE = 760
QUALITY = 50
# graded photos fill the screen in v3, so they keep more pixels
GRADED_EDGE = 1280
GRADED_QUALITY = 62


def data_uri(rel: str) -> str:
    path = ROOT / rel
    if path.suffix == ".png":
        raw, mime = path.read_bytes(), "image/png"
    else:
        im = Image.open(path).convert("RGB")
        edge, quality = (GRADED_EDGE, GRADED_QUALITY) if "/graded/" in rel else (MAX_EDGE, QUALITY)
        im.thumbnail((edge, edge), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=quality, method=6)
        raw, mime = buf.getvalue(), "image/webp"
    return f"data:{mime};base64,{base64.b64encode(raw).decode()}"


def main(source: str = "index.html", target_name: str = "netanel-proposal.html") -> None:
    html = (ROOT / source).read_text(encoding="utf-8")
    refs = sorted(set(re.findall(r"assets/[\w./-]+\.(?:webp|png)", html)))
    cache = {ref: data_uri(ref) for ref in refs}
    out = re.sub(r"assets/[\w./-]+\.(?:webp|png)", lambda m: cache[m.group(0)], html)
    target = ROOT / target_name
    target.write_text(out, encoding="utf-8")
    print(f"{len(refs)} assets inlined -> {target.name} ({target.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main(*sys.argv[1:3])
