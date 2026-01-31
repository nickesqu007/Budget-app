const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const match = html.match(/function parseAmount\([^)]*\)\{[^}]*\}/);
if (!match) {
  throw new Error('parseAmount function not found');
}

const parseAmount = eval(`(${match[0].replace('function parseAmount', 'function')})`);

assert.strictEqual(parseAmount('123.45'), 123.45);
assert.strictEqual(parseAmount('1234,56'), 1234.56);
assert.strictEqual(parseAmount('-42.00'), -42);
assert.strictEqual(parseAmount('not a number'), 0);

console.log('parseAmount tests passed');
