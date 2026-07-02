#!/usr/bin/env node
/**
 * Merge a single day into data.json (rolling 30-day window).
 * Usage: node merge.js today.json
 *   today.json = one day object, e.g.
 *   { "date":"2026-07-01","label":"Jul 1","activos":305,"onboarding":24,
 *     "migrados":80,"noMigrados":225,"trimestre":4,"pctOnboarded":70,
 *     "migAct":188,"migImp":269,"milestone":"…" }
 *
 * Upserts by date (replaces the row if that date already exists, else appends),
 * sorts chronologically, keeps the most recent WINDOW days, and rewrites data.json.
 */
const fs = require('fs');
const path = require('path');

const WINDOW = 30;
const dir = __dirname;
const dataPath = path.join(dir, 'data.json');
const dayPath = process.argv[2] || path.join(dir, 'today.json');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const day = JSON.parse(fs.readFileSync(dayPath, 'utf8'));

if (!day.date || !/^\d{4}-\d{2}-\d{2}$/.test(day.date)) {
  console.error('ERROR: the day needs a "date" in YYYY-MM-DD form.');
  process.exit(1);
}
if (!day.label) day.label = new Date(day.date + 'T12:00:00Z')
  .toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

const i = data.days.findIndex(d => d.date === day.date);
if (i >= 0) data.days[i] = { ...data.days[i], ...day };   // update existing day (idempotent)
else data.days.push(day);                                 // append new day

data.days.sort((a, b) => a.date.localeCompare(b.date));   // YYYY-MM-DD sorts chronologically
if (data.days.length > WINDOW) data.days = data.days.slice(-WINDOW);
data.lastUpdated = data.days[data.days.length - 1].date;

// Serialize with one metric/day per line so daily diffs stay small and readable.
const s = '{\n' +
  `  "report": ${JSON.stringify(data.report)},\n` +
  `  "source": ${JSON.stringify(data.source)},\n` +
  `  "lastUpdated": ${JSON.stringify(data.lastUpdated)},\n` +
  `  "metrics": [\n` + data.metrics.map(m => '    ' + JSON.stringify(m)).join(',\n') + `\n  ],\n` +
  `  "days": [\n` + data.days.map(d => '    ' + JSON.stringify(d)).join(',\n') + `\n  ]\n` +
  '}\n';
fs.writeFileSync(dataPath, s);

console.log(`Merged ${day.date}; window now ${data.days.length} days (${data.days[0].date} → ${data.days[data.days.length-1].date}).`);
