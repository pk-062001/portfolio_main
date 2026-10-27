"""
Regenerates every asset derived from the source photo.

Usage (from client/):
    pip install "rembg[cpu]" pillow
    python scripts/prepare_assets.py [path/to/photo.png]
    python scripts/prepare_assets.py --reuse   # skip background removal, reuse the existing cutout

Outputs:
    src/assets/portrait/portrait-cutout.png  transparent cutout used in the About section
    public/portrait-map.png                  small grayscale+alpha map sampled by the hero particle portrait
    public/og-image.jpg                      1200x630 social share card
    public/apple-touch-icon.png              180x180 home-screen icon
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
ARGS = [a for a in sys.argv[1:] if not a.startswith("--")]
REUSE = "--reuse" in sys.argv
default_source = ROOT.parent / "docs" / "New_image.png"
if not default_source.exists():
    default_source = ROOT.parent / "docs" / "Image.png"
SOURCE = Path(ARGS[0]) if ARGS else default_source

BG = (8, 8, 10)
ACCENT = (255, 107, 53)
TEXT = (237, 237, 239)
MUTED = (161, 161, 170)
FONT_DIR = Path("C:/Windows/Fonts")


def font(name, size):
    for candidate in (FONT_DIR / name, Path(name)):
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default(size)


def make_cutout(photo):
    if photo.mode == "RGBA":
        alpha = photo.getchannel("A")
        if alpha.getextrema()[0] < 50:
            bbox = alpha.point(lambda a: 255 if a > 24 else 0).getbbox()
            return photo.crop(bbox)
    try:
        from rembg import remove
        cutout = remove(photo).convert("RGBA")
        bbox = cutout.getchannel("A").point(lambda a: 255 if a > 24 else 0).getbbox()
        return cutout.crop(bbox)
    except ImportError:
        raise RuntimeError("Image is not cut out (lacks alpha transparency) and rembg is not installed.")


def make_particle_map(cutout, width=160):
    # Head and shoulders read best as particles, so keep the top portion of the figure.
    w, h = cutout.size
    crop_h = 0.63 if h > w * 1.1 else 0.5
    bust = cutout.crop((int(w * 0.04), 0, int(w * 0.96), int(h * crop_h)))
    height = round(width * bust.height / bust.width)
    small = bust.resize((width, height), Image.LANCZOS)

    alpha = small.getchannel("A").point(lambda a: 255 if a > 110 else 0)

    # A gentle gamma lift keeps skin mid-tones visible without flattening dark areas.
    luminance = ImageOps.autocontrast(small.convert("L"), cutoff=2).point(lambda v: round(255 * (v / 255) ** 0.85))
    edges = ImageOps.autocontrast(luminance.filter(ImageFilter.FIND_EDGES))
    detail = Image.blend(luminance, edges, 0.28)
    out = Image.merge("LA", (detail, alpha))
    out.save(ROOT / "public" / "portrait-map.png", optimize=True)
    return out.size


def radial_glow(size, center, radius, color, strength):
    glow = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    cx, cy = center
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=(*color, strength))
    return glow.filter(ImageFilter.GaussianBlur(radius // 2))


def make_og(cutout):
    size = (1200, 630)
    card = Image.new("RGBA", size, (*BG, 255))
    card.alpha_composite(radial_glow(size, (930, 330), 320, ACCENT, 70))
    card.alpha_composite(radial_glow(size, (160, 80), 260, (124, 156, 255), 30))

    grid_layer = Image.new("RGBA", size, (0, 0, 0, 0))
    grid = ImageDraw.Draw(grid_layer)
    for x in range(0, size[0], 48):
        grid.line([(x, 0), (x, size[1])], fill=(255, 255, 255, 10))
    for y in range(0, size[1], 48):
        grid.line([(0, y), (size[0], y)], fill=(255, 255, 255, 10))
    card.alpha_composite(grid_layer)

    person = cutout.copy()
    target_h = 600
    person = person.resize((round(person.width * target_h / person.height), target_h), Image.LANCZOS)
    card.alpha_composite(person, (size[0] - person.width - 40, size[1] - person.height))

    draw = ImageDraw.Draw(card)
    draw.rounded_rectangle((72, 92, 372, 132), radius=20, outline=(*ACCENT, 160), width=2)
    draw.ellipse((90, 106, 102, 118), fill=(*ACCENT, 255))
    draw.text((114, 99), "Available for new roles", font=font("seguisb.ttf", 22), fill=TEXT)

    draw.text((70, 180), "Prathamesh", font=font("segoeuib.ttf", 92), fill=TEXT)
    draw.text((70, 278), "Kokkula", font=font("segoeuib.ttf", 92), fill=TEXT)
    draw.text((72, 404), "Senior Full-Stack Engineer", font=font("seguisb.ttf", 38), fill=ACCENT)
    draw.text((72, 460), "Payments · Auth · Real-time · Cloud · Applied AI", font=font("segoeui.ttf", 27), fill=MUTED)
    draw.text((72, 548), "pk062001-portfolio.vercel.app", font=font("consola.ttf", 24), fill=MUTED)

    card.convert("RGB").save(ROOT / "public" / "og-image.jpg", quality=86, optimize=True, progressive=True)


def make_touch_icon():
    icon = Image.new("RGB", (180, 180), BG)
    draw = ImageDraw.Draw(icon)
    draw.rounded_rectangle((0, 0, 179, 179), radius=40, fill=BG)
    draw.text((90, 92), "pk", font=font("segoeuib.ttf", 96), fill=TEXT, anchor="mm")
    draw.ellipse((138, 118, 154, 134), fill=ACCENT)
    icon.save(ROOT / "public" / "apple-touch-icon.png", optimize=True)


def main():
    portrait_dir = ROOT / "src" / "assets" / "portrait"
    portrait_dir.mkdir(parents=True, exist_ok=True)
    cutout_path = portrait_dir / "portrait-cutout.png"

    if REUSE and cutout_path.exists():
        cutout = Image.open(cutout_path).convert("RGBA")
    else:
        cutout = make_cutout(Image.open(SOURCE).convert("RGBA"))
        cutout.save(cutout_path, optimize=True)

    (ROOT / "public").mkdir(exist_ok=True)
    map_size = make_particle_map(cutout)
    make_og(cutout)
    make_touch_icon()
    print(f"cutout {cutout.size}, particle map {map_size}")


if __name__ == "__main__":
    main()
