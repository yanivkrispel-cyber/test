"""Build a single self-contained HTML file (images inlined as data URIs) for sending.

Usage: python3 build_single.py  ->  netanel-proposal.html
"""
import base64
import io
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).parent
MAX_EDGE = 1100
QUALITY = 62


def data_uri(rel: str) -> str:
    path = ROOT / rel
    if path.suffix == ".png":
        raw, mime = path.read_bytes(), "image/png"
    else:
        im = Image.open(path).convert("RGB")
        im.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=QUALITY, method=6)
        raw, mime = buf.getvalue(), "image/webp"
    return f"data:{mime};base64,{base64.b64encode(raw).decode()}"


def main() -> None:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    refs = sorted(set(re.findall(r"assets/[\w./-]+\.(?:webp|png)", html)))
    cache = {ref: data_uri(ref) for ref in refs}
    out = re.sub(r"assets/[\w./-]+\.(?:webp|png)", lambda m: cache[m.group(0)], html)
    target = ROOT / "netanel-proposal.html"
    target.write_text(out, encoding="utf-8")
    print(f"{len(refs)} assets inlined -> {target.name} ({target.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
