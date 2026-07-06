# Chart update questions for @candobro

Every time this project opens, update the charts by asking **@candobro** in Slack
(DM channel `D0BBBH668TE`, bot user `U08QEHDJJF4`) the questions below.

Retry until candobro answers with data: after sending, wait ~60s and read the DM.
If it replies "I'm being rate-limited" (or is silent), wait ~2–3 min and resend —
keep looping for up to ~2h. A partial answer is fine; never fabricate numbers.

---

## The questions

1. **Today's clients-over-activated** — total active customers (migrated + non-migrated)
   over how many are already activated.
   → keys: `activos` (total active), `migAct` / `migImp` (drives activation rate).

2. **Tax-filing pipeline** — where every active client currently sits in the
   tax-filing pipeline, from document upload through to completed filing.
   → pipeline stage counts (upload → in progress → draft → completed).

3. **Turnaround time** — time from when a client finishes uploading documents
   ("quarter over") until draft tax results are presented for approval.
   → `trimestre` context / turnaround days.

4. **Total active vs. activated** — total active customers (migrated plus
   non-migrated) over how many are already activated.
   → keys: `activos`, `migAct`.

5. **Migrated, imported, not yet activated** — number of migrated clients that
   have been imported but are not yet activated.
   → keys: `migrados` (remaining), `migImp` (total imported).

6. **Tax documents running total** — today's running total of all tax documents
   held in the system.
   → key: `taxDocs`.

7. **Slack messages day over day** — how many Slack messages were sent in our
   system by clients, day over day, over the last 30 days.
   → daily client Slack message counts (30-day series).

---

## After candobro answers

Save the JSON to `today.json`, then run `bin/update-day.sh` (merge → rebuild →
commit → push to `main`). GitHub Pages redeploys: https://dennis643.github.io/charts/

See `DAILY_UPDATE.md` for the exact JSON row shape and key definitions.
