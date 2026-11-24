# Campuslands AI Academy · Landing

Rediseño de la landing de Campuslands AI Academy con la identidad del manual de marca v1.0. Una sola página en HTML, CSS y JavaScript, sin dependencias ni paso de compilación.

**Sitio publicado:** https://jhonhenryreyesperez.github.io/campuslands-ai-academy-landing/

## Cómo correrlo

El sitio está en `landing/`. Cualquier servidor estático sirve. Los módulos ES no cargan desde `file://`, así que no basta con abrir el archivo.

```bash
cd landing
# opción 1: Python
python -m http.server 5173
# opción 2: Node
npx serve .
```

Abre http://localhost:5173.

Prueba de la lógica del recomendador:

```bash
node landing/tests/recomendador.test.mjs
```

Publicación: GitHub Pages despliega `landing/` en cada push a `main` (`.github/workflows/pages.yml`).

## Estructura

```
landing/index.html            contenido completo (funciona sin JS)
landing/css/styles.css        tokens de marca y estilos, móvil primero
landing/js/main.js            interacción: viaje con scroll, órbitas, constelación, pestañas, recomendador
landing/js/recomendador.js    reglas del recomendador (lógica pura)
landing/js/herramientas.js    fichas de las 14 herramientas
landing/assets/fonts/         Poppins 400–800, subconjunto latino (licencia OFL)
landing/assets/brand/         logos y favicon
landing/assets/img/           Max y fotografía del trainer
landing/tests/                prueba del recomendador
assets-src/                   scripts y fuentes que generan las imágenes
```

## La experiencia

La página es un vuelo: bajar es ganar altitud. Un altímetro (riel lateral en escritorio, dock en móvil) indica la fase de la misión.

1. **Hero que reacciona**: el plano orbital de las cinco misiones se inclina con el cursor y, en táctil, gira al arrastrarlo. La pregunta «¿Quién se prepara para despegar?» adapta el mensaje, ilumina las órbitas de ese perfil y preselecciona el caso de uso y la primera respuesta del recomendador.
2. **Narrativa con scroll**: en «¿Por qué ahora?» las trayectorias con IA y en espera se separan mientras bajas, y los argumentos se activan al pasar. Una barra de progreso y el altímetro acompañan todo el recorrido.
3. **Recomendador de planes**: tres preguntas (quién se forma, qué quiere lograr, cómo prefiere aprender) sugieren una misión, explican por qué y la destacan en la ruta de ascenso.
4. **Exploración libre**: las 14 herramientas forman cinco constelaciones según el tipo de tarea; cada estrella abre su ficha con una tarea real.

Inscripción y WhatsApp están siempre a mano: botón fijo en la cabecera y dock inferior en móvil.

## Accesibilidad y rendimiento

- Navegación completa con teclado, foco visible, pestañas con flechas, preguntas frecuentes con `<details>`.
- `prefers-reduced-motion` detiene las órbitas, la inclinación y los revelados.
- Contraste según la tabla del manual. Probado a 375 px.
- Lighthouse 12 móvil sobre el sitio publicado (23 nov 2026, dos mediciones): Rendimiento 100, Accesibilidad 100, Buenas prácticas 100, SEO 100; LCP 1,4–1,5 s; sin errores en consola.

## Recursos

- Logos «campuslands AI»: extraídos de los renders del manual de marca con `assets-src/extraer_logos.py` (desmezcla exacta del fondo, sin redibujar ni recolorear).
- Max: las cuatro expresiones aprobadas del visor (lámina de la pág. 16 del manual) y tres poses aprobadas de cuerpo entero (pág. 17): «Presentando», «Trabajando» y «Descansando».
- Fotografía: fotograma real del trainer Andrés Leal, de una clase grabada de AI Academy, en color natural.
- Regenerar las imágenes (requiere Python con `pip install pillow numpy scipy` y los renders del manual de marca, que no se incluyen en este repositorio):

```bash
python assets-src/extraer_logos.py <carpeta-renders-manual> assets-src/logos
python assets-src/preparar_imagenes.py <carpeta-renders-manual> assets-src landing/assets/img
```
