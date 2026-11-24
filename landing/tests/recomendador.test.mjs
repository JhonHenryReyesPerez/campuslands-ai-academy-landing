// node tests/recomendador.test.mjs
import assert from 'node:assert/strict';
import { recomendar } from '../js/recomendador.js';

const r = (quien, meta, modo) => recomendar({ quien, meta, modo });

assert.equal(r('yo', 'entender', 'guiado').mision, 'ignition');
assert.equal(r('equipo', 'agentes', 'guiado').mision, 'booster');
assert.equal(r('equipo', 'automatizar', 'guiado').mision, 'liftoff');
assert.equal(r('empresa', 'medida', 'guiado').mision, 'odyssey');
assert.equal(r('empresa', 'medida', 'ritmo').mision, 'odyssey'); // a medida no cabe en pregrabado
assert.deepEqual(r('yo', 'agentes', 'ritmo'), { mision: 'nebula', motivo: r('yo', 'agentes', 'ritmo').motivo, alternativa: 'booster' });
assert.equal(r('empresa', 'automatizar', 'guiado').alternativa, 'odyssey');
assert.equal(r('equipo', 'automatizar', 'guiado').alternativa, null);
assert.throws(() => r('yo', 'otra', 'guiado'));

// Todas las combinaciones válidas devuelven una misión conocida.
for (const q of ['yo', 'equipo', 'empresa'])
  for (const m of ['entender', 'agentes', 'automatizar', 'medida'])
    for (const o of ['guiado', 'ritmo'])
      assert.ok(['ignition', 'booster', 'liftoff', 'odyssey', 'nebula'].includes(r(q, m, o).mision));

console.log('recomendador: ok');
