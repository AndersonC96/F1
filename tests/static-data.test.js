import test from 'node:test';
import assert from 'node:assert/strict';
import { translateCountry, toFlag } from '../assets/js/static-data.js';

test('static-data: translateCountry()', () => {
  assert.equal(translateCountry('Brazil'), 'Brasil');
  assert.equal(translateCountry('United Kingdom'), 'Reino Unido');
  assert.equal(translateCountry('Unknown'), 'Unknown');
});

test('static-data: toFlag()', () => {
  assert.equal(toFlag('Brazil'), '🇧🇷');
  assert.equal(toFlag('Italy'), '🇮🇹');
  assert.equal(toFlag('UnknownCountry'), '🏁');
});
