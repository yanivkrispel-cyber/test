"""Bake the site's warm-steel photo grade into files, so the browser never filters while scrolling.

Usage: python3 grade_photos.py  ->  assets/graded/<same name>.webp
"""
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).parent
SRC = ROOT / "assets" / "photos"
OUT = ROOT / "assets" / "graded"

# tritone: near-black shadows, warm copper mids, bone highlights
BLACK, MID, WHITE = "#0A0A0A", "#6C635D", "#E9E4DE"


def grade(path: Path) -> Image.Image:
    gray = ImageOps.grayscale(Image.open(path).convert("RGB"))
    gray = ImageOps.autocontrast(gray, cutoff=1)
    gray = ImageEnhance.Contrast(gray).enhance(1.12)
    gray = ImageEnhance.Brightness(gray).enhance(0.8)
    return ImageOps.colorize(gray, black=BLACK, mid=MID, white=WHITE, midpoint=150)


def main() -> None:
    OUT.mkdir(exist_ok=True)
    files = sorted(SRC.glob("*.webp"))
    for f in files:
        grade(f).save(OUT / f.name, "WEBP", quality=82, method=6)
    print(f"{len(files)} photos graded -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
