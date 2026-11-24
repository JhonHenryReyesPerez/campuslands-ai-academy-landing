// node tests/pausa.test.mjs
import assert from 'node:assert/strict';
import { INICIO, siguiente, enPausa } from '../js/pausa.js';

const tras = (...ev) => enPausa(ev.reduce((e, x) => siguiente(e, x), INICIO));
const raton = (dentro) => ({ tipo: 'puntero', puntero: 'mouse', dentro });
const dedo = (dentro) => ({ tipo: 'puntero', puntero: 'touch', dentro });
const foco = (dentro) => ({ tipo: 'foco', dentro });
const boton = { tipo: 'boton' };

assert.equal(tras(), false);
assert.equal(tras(dedo(true), foco(true), dedo(false), foco(false)), false); // tocar una misión y volver
assert.equal(tras(dedo(true)), false);
assert.equal(tras(raton(true)), true);
assert.equal(tras(foco(true), raton(true), raton(false)), true); // el foco sigue dentro
assert.equal(tras(raton(true), foco(true), foco(false)), true); // el ratón sigue encima
assert.equal(tras(boton, raton(true), raton(false)), true); // la pausa del botón persiste
assert.equal(tras(boton, boton), false);

console.log('pausa: ok');
