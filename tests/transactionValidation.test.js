const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const parseStart = html.indexOf('function parseAmount');
const parseEnd = html.indexOf('function validateAmountInput');
const start = html.indexOf('function validateAmountInput');
const end = html.indexOf('function uid');
if (parseStart === -1 || parseEnd === -1 || start === -1 || end === -1) {
  throw new Error('validateAmountInput function not found');
}

const parseSource = html.slice(parseStart, parseEnd).trim();
const fnSource = html.slice(start, end).trim();
const parseAmount = eval(`(${parseSource.replace('function parseAmount', 'function').trim()})`);
const validateAmountInput = eval(`(${fnSource.replace('function validateAmountInput', 'function').trim()})`);

assert.strictEqual(validateAmountInput('').ok, false);
assert.strictEqual(validateAmountInput('abc').ok, false);
assert.strictEqual(validateAmountInput('0').ok, false);
assert.strictEqual(validateAmountInput('10').ok, true);
assert.strictEqual(validateAmountInput('123.45').ok, true);
assert.strictEqual(validateAmountInput('1,234.56').ok, true);

console.log('transaction validation tests passed');
