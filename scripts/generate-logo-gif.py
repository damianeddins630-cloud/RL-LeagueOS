#!/usr/bin/env python3
"""Generate an animated GIF logo for RL LeagueOS."""

import math
from pathlib import Path

from PIL import Image, ImageDraw

SIZE = 256
FRAMES = 48
OUTPUT = Path(__file__).parent.parent / "public" / "logo-animated.gif"

BG = (10, 14, 26)
BLUE_LIGHT = (79, 195, 255)
BLUE_MID = (0, 136, 255)
BLUE_DARK = (0, 71, 171)
WHITE = (255, 255, 255)


def hex_points(cx: float, cy: float, radius: float, rotation: float = 0.0) -> list[tuple[float, float]]:
    points = []
    for i in range(6):
        angle = rotation + math.pi / 6 + i * math.pi / 3
        points.append((cx + radius * math.cos(angle), cy + radius * math.sin(angle)))
    return points


def draw_frame(frame_index: int) -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), BG + (255,))
    draw = ImageDraw.Draw(img)

    t = frame_index / FRAMES * 2 * math.pi
    pulse = 0.5 + 0.5 * math.sin(t * 2)

    # Pulsing glow
    glow_radius = int(90 + 12 * pulse)
    for r in range(glow_radius, 40, -4):
        alpha = int(30 * (1 - (r - 40) / (glow_radius - 40)) * (0.4 + 0.6 * pulse))
        draw.ellipse(
            (SIZE // 2 - r, SIZE // 2 - r, SIZE // 2 + r, SIZE // 2 + r),
            fill=(*BLUE_MID, alpha),
        )

    # Rotating dashed outer ring
    ring_rotation = t
    ring_points = hex_points(SIZE // 2, SIZE // 2, 108, ring_rotation)
    for i in range(6):
        start = ring_points[i]
        end = ring_points[(i + 1) % 6]
        if i % 2 == 0:
            draw.line([start, end], fill=(*BLUE_LIGHT, 140), width=3)

    # Boost trails
    trail_alpha = int(80 + 120 * (0.5 + 0.5 * math.sin(t * 4)))
    draw.polygon([(30, 118), (12, 128), (30, 138)], fill=(*BLUE_LIGHT, trail_alpha))
    draw.polygon([(226, 118), (244, 128), (226, 138)], fill=(*BLUE_LIGHT, int(trail_alpha * 0.6)))

    # Shield body
    shield_outer = hex_points(SIZE // 2, SIZE // 2, 88, 0)
    draw.polygon(shield_outer, fill=BG)
    draw.polygon(shield_outer, outline=BLUE_MID, width=4)

    shield_mid = hex_points(SIZE // 2, SIZE // 2, 72, 0)
    draw.polygon(shield_mid, fill=BLUE_MID)

    shield_inner = hex_points(SIZE // 2, SIZE // 2, 56, 0)
    draw.polygon(shield_inner, fill=BG)

    # Stylized L
    draw.rectangle((98, 88, 118, 148), fill=WHITE)
    draw.rectangle((98, 132, 152, 148), fill=WHITE)

    # Ball accent with pulse
    ball_r = 10 + int(2 * pulse)
    draw.ellipse((168, 96, 168 + ball_r * 2, 96 + ball_r * 2), fill=WHITE)

    return img.convert("P", palette=Image.ADAPTIVE)


def main() -> None:
    frames = [draw_frame(i) for i in range(FRAMES)]
    frames[0].save(
        OUTPUT,
        save_all=True,
        append_images=frames[1:],
        duration=50,
        loop=0,
        disposal=2,
    )
    print(f"Saved {OUTPUT}")


if __name__ == "__main__":
    main()
