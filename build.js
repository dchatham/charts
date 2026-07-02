#!/usr/bin/env node
/**
 * Build the Candosa daily report.
 * Reads data.json + template.html, injects the data inline, writes index.html.
 * Run after updating data.json:  node build.js
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const data = fs.readFileSync(path.join(dir, 'data.json'), 'utf8');
const tpl  = fs.readFileSync(path.join(dir, 'template.html'), 'utf8');

// Validate JSON early so a bad edit fails loudly instead of shipping a blank page.
JSON.parse(data);

// Stamp the exact build time (to the minute) in Central time, e.g. "Jun 30, 2026, 2:09 PM CDT".
const built = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Chicago', month: 'short', day: 'numeric', year: 'numeric',
  hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
}).format(new Date());

let out = tpl.replace('/*__DATA__*/{}', data.trim());
if (out === tpl) {
  console.error('ERROR: placeholder /*__DATA__*/{} not found in template.html');
  process.exit(1);
}
out = out.replace('/*__BUILT__*/null', JSON.stringify(built));

fs.writeFileSync(path.join(dir, 'index.html'), out);
console.log('Built index.html from data.json (' + JSON.parse(data).days.length + ' days) at ' + built);
