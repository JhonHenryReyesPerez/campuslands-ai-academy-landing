"""Extrae los logos 'campuslands AI' de los renders del manual (no hay archivo original local).
Color-to-alpha contra el fondo Black del manual: alpha = max canal sobre el fondo; color = desmezcla."""
import sys
from PIL import Image
import numpy as np

A = sys.argv[1]  # carpeta manual-de-marca-ai-academy-v1.assets
OUT = sys.argv[2]

def extract(page, box, name, pad=6):
    im = np.asarray(Image.open(f"{A}/{page}").convert("RGB")).astype(float)
    x0, y0, x1, y1 = box
    c = im[y0:y1, x0:x1]
    bg = np.median(np.concatenate([c[0], c[-1], c[:, 0], c[:, -1]]), axis=0)
    d = np.clip((c - bg) / (255 - bg), 0, 1)
    a = d.max(axis=2)
    a[a < 0.03] = 0  # ruido de compresión
    safe = np.where(a > 0, a, 1)[..., None]
    rgb = np.clip(bg + (c - bg) / safe, 0, 255)
    out = np.dstack([rgb, a * 255]).astype(np.uint8)
    img = Image.fromarray(out, "RGBA")
    bb = img.getbbox()
    img = img.crop((bb[0] - pad, bb[1] - pad, bb[2] + pad, bb[3] + pad))
    img.save(f"{OUT}/{name}.png", optimize=True)
    print(name, "bg", bg.round(1), "size", img.size)
    return img

extract("pagina-01.png", (180, 450, 800, 910), "logo-principal")
extract("pagina-06.png", (140, 790, 760, 965), "logo-horizontal-blanca")
extract("pagina-06.png", (270, 1400, 620, 1690), "casco-blanco")
