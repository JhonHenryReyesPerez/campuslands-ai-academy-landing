// Cuándo giran las órbitas. Lógica pura, probada en tests/pausa.test.mjs.
export const INICIO = { raton: false, foco: false, detenido: false };

// El tacto no cuenta como ratón: al levantar el dedo no hay un «salir» fiable.
export function siguiente(e, { tipo, dentro, puntero }) {
  if (tipo === 'puntero') return puntero === 'mouse' ? { ...e, raton: dentro } : e;
  if (tipo === 'foco') return { ...e, foco: dentro };
  return { ...e, detenido: !e.detenido }; // botón
}
export const enPausa = (e) => e.raton || e.foco || e.detenido;
