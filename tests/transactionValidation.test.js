const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const parseStart = html.indexOf('function parseAmount');
const parseEnd = html.indexOf('function validateTxnAmount');
const start = html.indexOf('function validateTxnAmount');
const end = html.indexOf('function uid');
if (parseStart === -1 || parseEnd === -1 || start === -1 || end === -1) {
  throw new Error('validateTxnAmount function not found');
}

const parseSource = html.slice(parseStart, parseEnd).trim();
const fnSource = html.slice(start, end).trim();
const parseAmount = eval(`(${parseSource.replace('function parseAmount', 'function').trim()})`);
const validateTxnAmount = eval(`(${fnSource.replace('function validateTxnAmount', 'function').trim()})`);

assert.strictEqual(validateTxnAmount('').valid, false);
assert.strictEqual(validateTxnAmount('not a number').valid, false);
assert.strictEqual(validateTxnAmount('25.50').valid, true);

console.log('transaction validation tests passed');
