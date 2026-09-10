from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "artwork"
OUTPUT_DIR = SOURCE_DIR / "print-masters"

SOURCES = {
    "currently-revolting": {
        "file": "chibi-currently-revolting.png",
        "shape": "portrait",
        "flood_threshold": 18,
    },
    "liber-tea": {
        "file": "chibi-liber-tea.png",
        "shape": "portrait",
        "flood_threshold": 18,
    },
    "give-me-a-minute": {
        "file": "chibi-give-me-a-minute.png",
        "shape": "portrait",
        "flood_threshold": 18,
    },
    "original-group-project": {
        "file": "chibi-original-group-project.png",
        "shape": "square",
        "flood_threshold": 20,
    },
    "washingtons-boat-club": {
        "file": "chibi-washingtons-boat-club.png",
        "shape": "landscape",
        "flood_threshold": 34,
    },
}

APPAREL_SIZES = {
    "portrait": (4500, 5400),
    "square": (4500, 4500),
    "landscape": (5400, 3600),
}

POSTER_SIZES = {
    # 12 x 18, 12 x 12, and 18 x 12 inches plus 0.125-inch bleed on every edge.
    "portrait": (3675, 5475),
    "square": (3675, 3675),
    "landscape": (5475, 3675),
}

STICKER_SIZE = (1800, 1800)  # Supports up to a 6-inch sticker at 300 DPI.
MUG_SIZE = (3300, 1275)  # Flexible 11 x 4.25-inch wrap master at 300 DPI.


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="PNG", dpi=(300, 300), compress_level=6)


def extract_badge(source: Image.Image, flood_threshold: int) -> Image.Image:
    """Remove only the exterior field connected to the image corners."""
    rgb = source.convert("RGB")
    flood = rgb.copy()
    marker = (255, 0, 255)
    ImageDraw.floodfill(flood, (0, 0), marker, thresh=flood_threshold)

    flood_array = np.asarray(flood)
    background = np.all(flood_array == marker, axis=2)
    background_mask = Image.fromarray((background * 255).astype(np.uint8), "L")

    # Contract the cut line by one source pixel to eliminate dark exterior halos,
    # then soften only the antialiased edge.
    background_mask = background_mask.filter(ImageFilter.MaxFilter(3))
    alpha = Image.eval(background_mask, lambda value: 255 - value)
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.45))

    rgba = rgb.convert("RGBA")
    rgba.putalpha(alpha)
    bbox = alpha.getbbox()
    if not bbox:
        raise RuntimeError("Badge extraction removed the entire image")
    return rgba.crop(bbox)


def resize_preserving_detail(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    resized = image.resize(size, Image.Resampling.LANCZOS)
    if resized.mode == "RGBA":
        rgb = resized.convert("RGB").filter(
            ImageFilter.UnsharpMask(radius=1.1, percent=65, threshold=4)
        )
        rgb.putalpha(resized.getchannel("A"))
        return rgb
    return resized.filter(ImageFilter.UnsharpMask(radius=1.1, percent=65, threshold=4))


def contain(
    image: Image.Image,
    canvas_size: tuple[int, int],
    fill_ratio: float,
) -> Image.Image:
    canvas_width, canvas_height = canvas_size
    max_width = round(canvas_width * fill_ratio)
    max_height = round(canvas_height * fill_ratio)
    scale = min(max_width / image.width, max_height / image.height)
    target = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    resized = resize_preserving_detail(image, target)
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    position = ((canvas_width - target[0]) // 2, (canvas_height - target[1]) // 2)
    canvas.alpha_composite(resized, position)
    return canvas


def cover(image: Image.Image, canvas_size: tuple[int, int]) -> Image.Image:
    canvas_width, canvas_height = canvas_size
    scale = max(canvas_width / image.width, canvas_height / image.height)
    target = (round(image.width * scale), round(image.height * scale))
    resized = resize_preserving_detail(image.convert("RGB"), target)
    left = (target[0] - canvas_width) // 2
    top = (target[1] - canvas_height) // 2
    return resized.crop((left, top, left + canvas_width, top + canvas_height))


def make_mug_wrap(badge: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", MUG_SIZE, (0, 0, 0, 0))
    max_badge = (1180, 1125)
    scale = min(max_badge[0] / badge.width, max_badge[1] / badge.height)
    target = (round(badge.width * scale), round(badge.height * scale))
    motif = resize_preserving_detail(badge, target)

    # Duplicate the same complete design on both viewing faces of the mug.
    for center_x in (825, 2475):
        x = round(center_x - motif.width / 2)
        y = round((MUG_SIZE[1] - motif.height) / 2)
        canvas.alpha_composite(motif, (x, y))
    return canvas


def main() -> None:
    extracted: dict[str, Image.Image] = {}

    for slug, spec in SOURCES.items():
        source_path = SOURCE_DIR / spec["file"]
        if not source_path.exists():
            raise FileNotFoundError(source_path)
        source = Image.open(source_path)
        badge = extract_badge(source, int(spec["flood_threshold"]))
        extracted[slug] = badge

        apparel = contain(badge, APPAREL_SIZES[str(spec["shape"])], 0.96)
        save_png(apparel, OUTPUT_DIR / "apparel" / f"{slug}-apparel-300dpi.png")

        sticker = contain(badge, STICKER_SIZE, 0.94)
        save_png(sticker, OUTPUT_DIR / "stickers" / f"{slug}-sticker-6in-300dpi.png")

        poster = cover(source, POSTER_SIZES[str(spec["shape"])])
        save_png(poster, OUTPUT_DIR / "posters" / f"{slug}-poster-with-bleed-300dpi.png")

    mug = make_mug_wrap(extracted["liber-tea"])
    save_png(mug, OUTPUT_DIR / "mugs" / "liber-tea-mug-wrap-300dpi.png")


if __name__ == "__main__":
    main()
