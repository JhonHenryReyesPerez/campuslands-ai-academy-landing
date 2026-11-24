"""Genera las imágenes del sitio a partir de recursos locales.
- Max: expresiones aprobadas del visor, recortadas de la lámina grande del manual, pagina-16.png (fondo lila aprobado).
- Max de cuerpo entero: poses aprobadas de pagina-17.png (fondo Black), recortadas sin alterar la ilustración.
- Trainer: fotograma real (s=8) de 'reto-02-edicion/Video de ejemplo.mp4', color natural con leve contraste."""
import sys
from PIL import Image, ImageOps
import numpy as np

MANUAL, SRC, OUT = sys.argv[1], sys.argv[2], sys.argv[3]

# Expresiones del visor en la lámina grande (pagina-16.png, fondo lila aprobado).
page = Image.open(f"{MANUAL}/pagina-16.png").convert("RGB")
for name, cx in [("cansado", 292), ("motivado", 630), ("analitico", 968), ("idea", 1308)]:
    page.crop((cx - 150, 1085, cx + 150, 1385)).resize((272, 272), Image.LANCZOS).save(f"{OUT}/max-{name}.webp", quality=88)

# Poses de cuerpo entero: el fondo Black conectado al borde pasa a transparente;
# el visor (negro, encerrado por el casco) se conserva. Bordes suaves por distancia al fondo.
from scipy import ndimage as nd
BG = np.array([5, 5, 7.0])
p17 = np.asarray(Image.open(f"{MANUAL}/pagina-17.png").convert("RGB")).astype(float)
for name, (x0, x1, y0, y1) in {
    "presentando": (115, 365, 60, 404), "trabajando": (822, 1052, 72, 404), "descansando": (1254, 1488, 34, 404),
}.items():
    c = p17[y0:y1, x0:x1]
    d = np.abs(c - BG).max(-1)
    fondo, _ = nd.label(d <= 14)
    borde = set(np.unique(np.concatenate([fondo[0], fondo[-1], fondo[:, 0], fondo[:, -1]]))) - {0}
    exterior = np.isin(fondo, list(borde))
    a = np.where(exterior, 0, 1.0)
    a = np.maximum(a, np.clip((d - 6) / 40, 0, 1) * (nd.distance_transform_edt(exterior) < 3))
    piezas, n = nd.label(a > .05)  # solo la figura mayor: descarta bordes de poses vecinas
    a = a * (piezas == 1 + np.argmax(nd.sum(np.ones_like(a), piezas, range(1, n + 1))))
    rgb = np.clip((c - BG * (1 - a[..., None])) / np.maximum(a[..., None], 1e-3), 0, 255)
    Image.fromarray(np.dstack([rgb, a * 255]).astype(np.uint8), "RGBA").save(f"{OUT}/max-{name}.webp", quality=90)

im = Image.open(f"{SRC}/trainer-frame-ejemplo-8s.png").convert("RGB").crop((600, 70, 1360, 1020))  # 4:5
im = ImageOps.autocontrast(im, cutoff=0.5)
for w in (360, 720):
    im.resize((w, w * 5 // 4), Image.LANCZOS).save(f"{OUT}/trainer-{w}.webp", quality=80)
print("ok")

# Logos para la web: escalado proporcional a 2x del tamaño mostrado, WebP con alfa.
LOGOS = f"{SRC}/logos"
for name, w in [("logo-horizontal-blanca", 336), ("logo-principal", 300)]:
    im = Image.open(f"{LOGOS}/{name}.png")
    im.resize((w, round(im.size[1] * w / im.size[0])), Image.LANCZOS).save(f"{OUT}/../brand/{name}.webp", quality=92, method=6)

# Favicon: casco solo (versión blanca) sobre Black, 96 px (mínimo del manual: 32 px).
casco = Image.open(f"{LOGOS}/casco-blanco.png")
fav = Image.new("RGBA", (96, 96), (5, 5, 7, 255))
w = 75; h = round(casco.size[1] * w / casco.size[0])
fav.alpha_composite(casco.resize((w, h), Image.LANCZOS), ((96 - w) // 2, (96 - h) // 2))
fav.save(f"{OUT}/../brand/favicon.png", optimize=True)
