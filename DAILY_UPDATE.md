# Daily report update — runbook

The report is a **rolling 30-day window**. Each day you pull **one** day from
candobro and merge it. **Never re-pull all 30 days.**

The whole job is: ask candobro → save its JSON to `today.json` → run one script.

---

## 1. Ask candobro for today's row (Slack)

candobro is a Slack bot. **DM channel: `D0BBBH668TE`** (bot user `U08QEHDJJF4`).

Send candobro this message, with today's date filled in. It asks for a single
strict-JSON row so there is nothing to parse or map by hand:

```
Hi candobro — daily one-row update for the Candosa client-summary report.
For TODAY (<YYYY-MM-DD>) ONLY, reply with a SINGLE JSON object on ONE line,
using EXACTLY these keys (integers only, no units; milestone = one short sentence):

{"date":"<YYYY-MM-DD>","activos":0,"onboarding":0,"migrados":0,"noMigrados":0,"trimestre":0,"migAct":0,"migImp":0,"uploads":0,"waClients":0,"waMessages":0,"taxDocs":0,"milestone":"…"}

Definitions:
- activos: active customers total (migrated + non-migrated)
- onboarding: clients still onboarding (no activity assigned yet)
- migrados: migrated clients imported but NOT yet activated (remaining)
- noMigrados: fully set-up / active non-migrated customers
- trimestre: current-quarter tax filings submitted or completed
- migAct: cumulative migrated clients activated (all-time)
- migImp: total migrated clients imported (all-time)
- uploads: distinct clients who uploaded >=1 document today
- waClients: distinct clients who messaged on WhatsApp today
- waMessages: cumulative all-time WhatsApp messages (running total)
- taxDocs: cumulative total tax documents in system (running total)

Reply with the raw JSON only — nothing else.
```

**If candobro replies "I'm being rate-limited"**, wait ~30–60s and resend. Retry
a few times before giving up. If some numbers still aren't available, drop those
keys — a partial row is fine (see below).

---

## 2. Save it and publish

Save candobro's JSON reply to **`today.json`** (gitignored), then run:

```bash
bin/update-day.sh
```

That merges the day into the rolling window, rebuilds `index.html`, commits
`Report: <date>`, and pushes to `main`. GitHub Pages redeploys automatically:
**https://dennis643.github.io/charts/**

`day.example.json` shows the exact shape of a day file.

---

## Notes

- **`pctOnboarded` (activation rate) is derived automatically** from `migAct` /
  `migImp` — you don't need it from candobro.
- **Partial rows are safe.** Any field you leave out just shows a gap for that
  day; re-run with the same `date` later to fill it in without disturbing the
  other fields.
- The `metrics` block in `data.json` carries all chart config (labels, colors,
  sections, explanations) and is never touched by a daily update.
- Data source is **candobro only**. This repo is not synced from any other repo.

---

## For the sidebar Routine

Point the daily routine at this prompt (collapse "daily report a/b" into this one):

> Update the Candosa daily report. Open the candobro Slack DM (channel
> `D0BBBH668TE`) and ask for **today's single-day row** exactly as specified in
> `DAILY_UPDATE.md` (pull **one day only** — never re-pull 30).
>
> **Retry until candobro answers with data.** After sending, wait ~60s and read
> the DM. If candobro replies with the "I'm being rate-limited" message (or hasn't
> replied yet), wait ~2–3 minutes and resend, and repeat — keep going for up to
> ~2 hours (~30–40 attempts). Do not give up after the first failure; only stop
> early once you have valid JSON.
>
> When candobro returns the JSON, save it to `today.json`, run
> `bin/update-day.sh` (merge → rebuild → commit → push to `main`), and Slack
> Dennis (channel_id `U0AKELYLUCX`) a one-line confirmation with the link
> https://dennis643.github.io/charts/. If candobro still hasn't cleared after
> ~2 hours, Slack Dennis to say so and stop.
