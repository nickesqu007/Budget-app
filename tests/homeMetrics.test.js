const fs = require('fs');
const path = require('path');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function sliceSection(startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  if (start === -1 || end === -1) {
    throw new Error(`Could not find section ${startMarker} -> ${endMarker}`);
  }
  return html.slice(start, end).trim();
}

const isFutureSource = sliceSection('function isFuture', 'function inRange');
const inRangeSource = sliceSection('function inRange', 'function escapeHtml');
const getTransactionsSource = sliceSection('function getTransactionsInRange', 'function normalizeCategory');
const normalizeSource = sliceSection('function normalizeCategory', 'function rollupSpendingByCategory');
const rollupSource = sliceSection('function rollupSpendingByCategory', 'const toastQueue');
const kpiSource = sliceSection('function getKpiMetrics', 'function renderKpiCards');
const addGoalSource = sliceSection('function addGoalRecord', 'function renderGoals');

const isFuture = eval(`(${isFutureSource.replace('function isFuture', 'function').trim()})`);
const inRange = eval(`(${inRangeSource.replace('function inRange', 'function').trim()})`);
const getTransactionsInRange = eval(`(${getTransactionsSource.replace('function getTransactionsInRange', 'function').trim()})`);
const normalizeCategory = eval(`(${normalizeSource.replace('function normalizeCategory', 'function').trim()})`);
const rollupSpendingByCategory = eval(`(${rollupSource.replace('function rollupSpendingByCategory', 'function').trim()})`);
const getKpiMetrics = eval(`(${kpiSource.replace('function getKpiMetrics', 'function').trim()})`);
const addGoalRecord = eval(`(${addGoalSource.replace('function addGoalRecord', 'function').trim()})`);

const metrics = getKpiMetrics();
assert.strictEqual(metrics.length, 5, 'Expected 5 KPI metrics');
const cardIds = metrics.map(m => m.cardId);
assert.strictEqual(new Set(cardIds).size, cardIds.length, 'KPI card IDs should be unique');

const range = { start: new Date('2025-02-01'), end: new Date('2025-02-28') };
const expenses = [
  { date: '2025-02-02', category: 'Groceries', amount: 50 },
  { date: '2025-02-03', category: 'grocery', amount: 25 },
  { date: '2025-02-03', category: 'Food', amount: 10 },
  { date: '2025-03-01', category: 'Food', amount: 99 }
];
const totals = rollupSpendingByCategory(expenses, range);
assert.strictEqual(totals.Groceries, 75);
assert.strictEqual(totals.Food, 10);

const list = [];
const goal = { id: 'goal-1', name: 'Trip', targetAmount: 1000 };
const added = addGoalRecord(list, goal);
assert.strictEqual(added.length, 1);
const updated = addGoalRecord(added, { ...goal, targetAmount: 1200 });
assert.strictEqual(updated.length, 1);
assert.strictEqual(updated[0].targetAmount, 1200);

console.log('home metrics tests passed');
