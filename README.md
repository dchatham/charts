# Candosa — Client Summary Daily Report

A self-contained daily report of the five Candosa dashboard metrics, with a 30-day
trend line for each. Data comes from **candobro** (Slack), which reconstructs it
from the production database and event logs.

**Metrics tracked**
- Active customers (total)
- Onboarding
- Migrants
- Non-migrants (active)
- Quarter submitted or completed
- Migrant activation rate (% onboarded, chart only)

## Files
| File | Purpose |
|------|---------|
| `index.html` | The published report (generated — do not edit by hand). |
| `data.json` | Source of truth: `metrics` (config) + `days` (the rolling 30-day series). |
| `template.html` | HTML template with `/*__DATA__*/` and `/*__BUILT__*/` placeholders. |
| `build.js` | Injects `data.json` + a build timestamp into `template.html` → `index.html`. |
| `merge.js` | Upserts a single day into `data.json` and keeps the last 30 (rolling window). |

## Daily update (single-day merge — preferred)
Ask candobro for **today only**, then merge it in:
1. Ask candobro in Slack for today's values: the five metrics, migrated activated,
   total migrated imported, and a one-line milestone.
2. Write them to `today.json`:
   ```json
   { "date":"2026-07-01","label":"Jul 1","activos":305,"onboarding":24,
     "migrados":80,"noMigrados":225,"trimestre":4,"pctOnboarded":70,
     "migAct":188,"migImp":269,"milestone":"…" }
   ```
3. Merge, rebuild, publish:
   ```bash
   node merge.js today.json    # upsert today, keep last 30, bump lastUpdated
   node build.js
   git add -A && git commit -m "Report: $(date +%F)" && git push
   ```

`merge.js` is idempotent — re-running the same date updates that row instead of
duplicating it. The `metrics` array (labels, colors, `share`/`overlay`/`numKey`
config, explanations) is never touched by the daily update, so all chart features
carry forward automatically.

For a full rebuild-from-scratch, replace the entire `days` array in `data.json`
with 30 rows and run `node build.js`.
