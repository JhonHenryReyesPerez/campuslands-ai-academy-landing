import { recomendar, MISIONES } from './recomendador.js';
import { HERRAMIENTAS, GRUPOS } from './herramientas.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reducido = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

document.documentElement.classList.add('js');

/* ---------- Menú móvil ---------- */
const menuBtn = $('[data-menu-btn]');
const menu = $('[data-menu]');
function cerrarMenu() { menu.classList.remove('abierto'); menuBtn.setAttribute('aria-expanded', 'false'); }
menuBtn.addEventListener('click', () => {
  const abrir = menuBtn.getAttribute('aria-expanded') !== 'true';
  menu.classList.toggle('abierto', abrir);
  menuBtn.setAttribute('aria-expanded', String(abrir));
});
menu.addEventListener('click', (e) => { if (e.target.closest('a')) cerrarMenu(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('abierto')) { cerrarMenu(); menuBtn.focus(); }
});

/* ---------- Viaje: progreso, altímetro, fase, dock, brecha ---------- */
const secciones = $$('main > section[data-fase]');
const progreso = $('[data-progreso]');
const fill = $('[data-altimetro-fill]');
const altTxt = [$('[data-alt]'), $('[data-dock-alt]')];
const faseTxt = [$('[data-fase]', $('[data-altimetro]')), $('[data-dock-fase]')];
const dock = $('[data-dock]');
const hero = $('[data-hero]');
const cierre = $('[data-cierre]');
const brecha = $('.brecha');
const urgencia = $('[data-urgencia]');
const argumentos = $$('[data-argumentos] li');
const enlacesMenu = $$('.menu a[href^="#"]');
let faseActual = '', altActual = -1, pendiente = false;

function setTexto(nodos, v) { for (const n of nodos) if (n) n.textContent = v; }

function alHacerScroll() {
  pendiente = false;
  // Lecturas de diseño primero, escrituras después: una sola recomposición por cuadro.
  const h = innerHeight;
  const max = document.documentElement.scrollHeight - h;
  const p = max > 0 ? clamp(scrollY / max) : 0;
  let actual = secciones[0];
  for (const s of secciones) if (s.getBoundingClientRect().top <= h * 0.4) actual = s;
  const enHero = hero.getBoundingClientRect().bottom > h * 0.35;
  const enCierre = cierre.getBoundingClientRect().top < h * 0.75;
  const r = urgencia.getBoundingClientRect();
  const vistos = argumentos.map((li) => li.getBoundingClientRect().top < h * 0.7);

  progreso.style.setProperty('--p', p);
  fill.style.setProperty('--p', p);
  const alt = Math.round(p * 400); // 400 km: órbita baja
  if (alt !== altActual) { altActual = alt; setTexto(altTxt, alt); }
  if (actual.dataset.fase !== faseActual) {
    faseActual = actual.dataset.fase;
    setTexto(faseTxt, faseActual);
    for (const a of enlacesMenu) {
      if (a.getAttribute('href') === `#${actual.id}`) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  }

  const ocultar = (enHero || enCierre) && !dock.contains(document.activeElement);
  dock.classList.toggle('oculto', ocultar);
  dock.inert = ocultar;
  document.documentElement.classList.toggle('con-dock', !ocultar);

  // La brecha se dibuja mientras recorres la sección.
  brecha.style.setProperty('--p', clamp((h * 0.75 - r.top) / Math.max(1, r.height - h * 0.5)).toFixed(3));
  argumentos.forEach((li, i) => li.classList.toggle('visto', vistos[i]));
}
function pedirScroll() { if (!pendiente) { pendiente = true; requestAnimationFrame(alHacerScroll); } }
addEventListener('scroll', pedirScroll, { passive: true });
addEventListener('resize', pedirScroll);
alHacerScroll();

/* ---------- Hero: órbitas, inclinación y elección de perfil ---------- */
const orbita = $('[data-orbita]');
const plano = $('[data-orbita-plano]');
const astros = $$('[data-astro]').filter((li) => li.dataset.astro !== 'nebula').map((li, i) => ({
  li, a: parseFloat(li.style.getPropertyValue('--a')), v: [9, 6, 4, 2.5][i], // grados por segundo: lo interior gira más rápido
  rx: parseFloat(li.style.getPropertyValue('--rx')), ry: parseFloat(li.style.getPropertyValue('--ry')),
}));
// En la mitad trasera de la órbita el astro pasa detrás del núcleo y su etiqueta va arriba.
function colocar(s) {
  const rad = (s.a + giroTactil) * Math.PI / 180;
  s.li.style.left = `${50 + Math.cos(rad) * s.rx}%`;
  s.li.style.top = `${50 + Math.sin(rad) * s.ry}%`;
  s.li.classList.toggle('atras', Math.sin(rad) < 0);
}
let heroVisible = true, pausa = false, detenido = false, girando = false, t0 = 0, giroTactil = 0;
astros.forEach(colocar);

function girar(t) {
  if (!heroVisible || pausa || detenido || reducido.matches || document.hidden) { girando = false; return; }
  const dt = Math.min(64, t - (t0 || t)) / 1000; t0 = t;
  for (const s of astros) { s.a = (s.a + s.v * dt) % 360; colocar(s); }
  requestAnimationFrame(girar);
}
function arrancar() { if (!girando && heroVisible && !pausa && !detenido && !reducido.matches) { girando = true; t0 = 0; requestAnimationFrame(girar); } }
new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; arrancar(); }).observe(orbita);
document.addEventListener('visibilitychange', arrancar);
reducido.addEventListener('change', arrancar);
// Pausa temporal solo sobre los enlaces de las misiones (no sobre el botón de pausa).
const misiones = $('.orbita__misiones');
misiones.addEventListener('pointerover', (e) => { if (e.pointerType === 'mouse' && e.target.closest('a')) pausa = true; });
// Se reanuda solo si ni el ratón ni el foco siguen en una misión.
misiones.addEventListener('pointerout', (e) => { if (!e.relatedTarget?.closest?.('.orbita__misiones a')) { pausa = misiones.contains(document.activeElement); arrancar(); } });
misiones.addEventListener('focusin', () => { pausa = true; });
misiones.addEventListener('focusout', (e) => { pausa = !!e.relatedTarget && misiones.contains(e.relatedTarget) || !!misiones.querySelector('a:hover'); arrancar(); });

// Pausa persistente de la animación automática.
const btnPausa = $('[data-pausa]');
btnPausa.addEventListener('click', () => {
  detenido = !detenido;
  btnPausa.setAttribute('aria-pressed', String(detenido));
  btnPausa.textContent = detenido ? 'Reanudar órbitas' : 'Pausar órbitas';
  arrancar();
});

// Cursor: el plano orbital se inclina hacia donde miras.
hero.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse' || reducido.matches) return;
  const r = hero.getBoundingClientRect();
  plano.style.setProperty('--tx', `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`);
  plano.style.setProperty('--ty', `${((e.clientY - r.top) / r.height - 0.5) * -12}deg`);
});
hero.addEventListener('pointerleave', () => { plano.style.removeProperty('--tx'); plano.style.removeProperty('--ty'); });

// Táctil: arrastrar en horizontal hace girar las órbitas (el scroll vertical sigue libre).
let xTactil = null;
orbita.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') xTactil = e.clientX; });
orbita.addEventListener('pointermove', (e) => {
  if (xTactil === null || reducido.matches) return;
  giroTactil += (e.clientX - xTactil) * 0.6; xTactil = e.clientX;
  for (const s of astros) colocar(s);
});
for (const ev of ['pointerup', 'pointercancel']) orbita.addEventListener(ev, () => { xTactil = null; });

const PERFILES = {
  empresa: { nucleo: 'Tu empresa', intro: 'Formamos a cada área con casos de su propia operación: desde una sesión de 4 horas hasta un programa diseñado para tu empresa.', caso: 'empresario', anillos: ['odyssey'] },
  equipo: { nucleo: 'Tu equipo', intro: 'Tu gente aprende con las tareas que ya hace y sale con prompts, agentes y flujos listos para usar el lunes.', caso: 'innovacion', anillos: ['ignition', 'booster', 'liftoff'] },
  yo: { nucleo: 'Tú', intro: 'Aprende a usar la IA en tu propio trabajo, en sesiones con un trainer o a tu ritmo con material pregrabado.', caso: 'independiente', anillos: ['ignition'] },
};
const intro = $('[data-hero-intro]');
intro.setAttribute('aria-live', 'polite');
$('[data-quien]').addEventListener('change', (e) => {
  const p = PERFILES[e.target.value];
  intro.textContent = p.intro;
  $('[data-nucleo]').textContent = p.nucleo;
  // Las órbitas que suele recorrer este perfil se iluminan (sin recomendar una sola misión).
  for (const el of $$('[data-anillo]')) el.classList.toggle('activo', p.anillos.includes(el.dataset.anillo));
  for (const li of $$('[data-astro]')) li.classList.toggle('activo', p.anillos.includes(li.dataset.astro) || (e.target.value === 'yo' && li.dataset.astro === 'nebula'));
  $('[data-orbita-nota]').innerHTML = 'Afina tu ruta: <a href="#recomendador">calcula tu misión en tres preguntas</a>.';
  // La elección acompaña el resto del viaje.
  const r = $(`[data-recomendador] input[name="quien"][value="${e.target.value}"]`);
  if (r && !r.checked) { r.checked = true; invalidarResultado(); }
  seleccionarPerfil($(`#tab-${p.caso}`), false);
});

/* ---------- Constelación de herramientas ---------- */
const ficha = $('[data-ficha]');
const fichaCasa = ficha.parentElement;
const angosto = matchMedia('(max-width: 1023px)');

function dibujarLineas() {
  for (const g of $$('.constelacion')) {
    const svg = $('svg', g);
    const base = g.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${base.width} ${base.height}`);
    const puntos = $$('.estrella', g).map((b) => {
      const r = b.getBoundingClientRect();
      return `${(r.left - base.left + 5).toFixed(1)},${(r.top - base.top + r.height / 2).toFixed(1)}`;
    });
    $('polyline', svg).setAttribute('points', puntos.join(' '));
  }
}
if (!angosto.matches) dibujarLineas();
addEventListener('resize', () => { if (!angosto.matches) dibujarLineas(); });
document.fonts?.ready.then(() => { if (!angosto.matches) dibujarLineas(); });

$('[data-cielo]').addEventListener('click', (e) => {
  const b = e.target.closest('.estrella');
  if (!b) return;
  const t = HERRAMIENTAS[b.dataset.tool];
  const g = b.closest('.constelacion');
  for (const x of $$('.estrella')) x.setAttribute('aria-pressed', String(x === b));
  for (const x of $$('.constelacion')) x.classList.toggle('activa', x === g);
  $('[data-ficha-grupo]').textContent = GRUPOS[g.dataset.grupo];
  $('[data-ficha-nombre]').textContent = b.textContent;
  $('[data-ficha-que]').textContent = t.que;
  $('[data-ficha-tarea]').textContent = t.tarea;
  $('[data-ficha-vacia]').hidden = true;
  $('[data-ficha-contenido]').hidden = false;
  // En pantallas angostas la ficha se abre junto a la estrella tocada.
  if (angosto.matches) g.append(ficha); else if (ficha.parentElement !== fichaCasa) fichaCasa.append(ficha);
  ficha.classList.remove('entra'); void ficha.offsetWidth; ficha.classList.add('entra');
});
for (const b of $$('.estrella')) b.setAttribute('aria-pressed', 'false');
angosto.addEventListener('change', () => {
  if (!angosto.matches) { fichaCasa.append(ficha); dibujarLineas(); return; }
  const activa = $('.estrella[aria-pressed="true"]');
  if (activa) activa.closest('.constelacion').append(ficha);
});

/* ---------- Casos de uso: pestañas ---------- */
const tabs = $$('[data-perfiles] [role="tab"]');
function seleccionarPerfil(tab, foco = true) {
  for (const t of tabs) {
    const sel = t === tab;
    t.setAttribute('aria-selected', String(sel));
    t.tabIndex = sel ? 0 : -1;
    $(`#${t.getAttribute('aria-controls')}`).hidden = !sel;
  }
  if (foco) tab.focus();
}
for (const t of tabs) t.addEventListener('click', () => seleccionarPerfil(t));
$('[data-perfiles]').addEventListener('keydown', (e) => {
  const i = tabs.indexOf(document.activeElement);
  const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
  if (n === undefined || i < 0) return;
  e.preventDefault();
  seleccionarPerfil(tabs[(n + tabs.length) % tabs.length]);
});

/* ---------- Recomendador ---------- */
const form = $('[data-recomendador]');
const res = $('[data-resultado]');
const max = $('[data-max]');
function cambiarMax(cual) {
  const src = `assets/img/max-${cual}.webp`;
  if (max.getAttribute('src') === src) return;
  max.src = src; max.classList.add('cambia');
  setTimeout(() => max.classList.remove('cambia'), 400);
}
// Si cambia una respuesta, la sugerencia anterior deja de valer.
function invalidarResultado() {
  $('[data-error]').textContent = '';
  res.hidden = true;
  for (const c of $$('[data-mision]')) { c.classList.remove('sugerida'); $('.mision__sello', c)?.remove(); }
  cambiarMax('analitico');
}
form.addEventListener('change', invalidarResultado);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  if (!d.quien || !d.meta || !d.modo) {
    $('[data-error]').textContent = 'Responde las tres preguntas para calcular tu misión.';
    return;
  }
  const { mision, motivo, alternativa } = recomendar(d);
  const m = MISIONES[mision];
  $('[data-res-nombre]').textContent = m.nombre;
  $('[data-res-duracion]').textContent = m.duracion;
  $('[data-res-motivo]').textContent = motivo;
  $('[data-res-cta]').textContent = mision === 'nebula' ? 'Accede a Nebula' : `Inscríbete en ${m.nombre}`;
  $('[data-res-ver]').href = `#mision-${mision}`;
  const alt = $('[data-res-alt]');
  alt.hidden = !alternativa;
  if (alternativa) {
    const a = MISIONES[alternativa];
    alt.innerHTML = mision === 'nebula'
      ? `Si prefieres sesiones con un trainer, mira <a href="#mision-${alternativa}">${a.nombre} (${a.duracion})</a>.`
      : `Como se forman varias áreas, también puedes pedir <a href="#mision-${alternativa}">${a.nombre}</a> para adaptar la ruta a cada rol.`;
  }
  for (const c of $$('[data-mision]')) {
    const es = c.dataset.mision === mision;
    c.classList.toggle('sugerida', es);
    $('.mision__sello', c)?.remove();
    if (es) c.insertAdjacentHTML('afterbegin', '<p class="pill mision__sello">Sugerida para ti</p>');
  }
  res.hidden = false;
  cambiarMax('idea');
  res.focus({ preventScroll: true });
  res.scrollIntoView({ behavior: reducido.matches ? 'auto' : 'smooth', block: 'nearest' });
});
