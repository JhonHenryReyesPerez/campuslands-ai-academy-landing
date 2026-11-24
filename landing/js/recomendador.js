// Recomendador de misión. Reglas basadas solo en lo que incluye cada misión (sin umbrales inventados).
// Probado en tests/recomendador.test.mjs.

export const MISIONES = {
  ignition: { nombre: 'Ignition', duracion: '4 horas' },
  booster: { nombre: 'Booster', duracion: '8 horas' },
  liftoff: { nombre: 'Liftoff', duracion: '12 horas' },
  odyssey: { nombre: 'Odyssey', duracion: 'Personalizado' },
  nebula: { nombre: 'Nebula', duracion: 'Pregrabado' },
};

// Objetivo -> misión guiada cuyo temario lo cubre.
const POR_META = { entender: 'ignition', agentes: 'booster', automatizar: 'liftoff', medida: 'odyssey' };

const POR_QUE = {
  ignition: 'Entiendes el impacto real de la IA en tu industria y la usas como asistente diario desde la primera sesión.',
  booster: 'Trabajas técnicas de prompting para resultados precisos y construyes agentes personalizados para tu rol.',
  liftoff: 'Aprendes a automatizar procesos reales con n8n y diseñas flujos aplicados a tu negocio.',
  odyssey: 'El programa se diseña para tu empresa: eliges herramientas, duración y profundidad.',
  nebula: 'Avanzas a tu ritmo con contenidos por niveles y acceso 24/7.',
};

/**
 * @param {{quien:'yo'|'equipo'|'empresa', meta:'entender'|'agentes'|'automatizar'|'medida', modo:'guiado'|'ritmo'}} r
 * @returns {{mision:string, motivo:string, alternativa:string|null}}
 */
export function recomendar({ quien, meta, modo }) {
  if (!['yo', 'equipo', 'empresa'].includes(quien) || !(meta in POR_META) || !['guiado', 'ritmo'].includes(modo)) {
    throw new Error('Respuestas incompletas o no válidas');
  }
  // Pregrabado solo encaja si no piden un programa a medida.
  if (modo === 'ritmo' && meta !== 'medida') {
    return { mision: 'nebula', motivo: POR_QUE.nebula, alternativa: POR_META[meta] };
  }
  const mision = POR_META[meta];
  // Varias áreas con un objetivo estándar: la guiada encaja, pero Odyssey puede adaptarla a cada rol.
  const alternativa = quien === 'empresa' && mision !== 'odyssey' ? 'odyssey' : null;
  return { mision, motivo: POR_QUE[mision], alternativa };
}
