const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function sliceFunction(startName, endName) {
  const start = html.indexOf(`function ${startName}`);
  const end = html.indexOf(`function ${endName}`);
  if (start === -1 || end === -1) {
    throw new Error(`Function ${startName} or ${endName} not found`);
  }
  return html.slice(start, end).trim();
}

const parseSource = sliceFunction('parseAmount', 'validateAmountInput');
const validateSource = sliceFunction('validateAmountInput', 'validateOptionalAmountInput');

const parseAmount = eval(`(${parseSource.replace('function parseAmount', 'function').trim()})`);
const validateAmountInput = eval(`(${validateSource.replace('function validateAmountInput', 'function').trim()})`);

assert.strictEqual(validateAmountInput('').ok, false);
assert.strictEqual(validateAmountInput('abc').ok, false);
assert.strictEqual(validateAmountInput('0').ok, false);
assert.strictEqual(validateAmountInput('10').ok, true);
assert.strictEqual(validateAmountInput('123.45').ok, true);
assert.strictEqual(validateAmountInput('1,234.56').ok, true);

console.log('transaction validation tests passed');
