# 11 — Agent Delivery

How architecture in `docs/01`–`docs/10` becomes shipped code, using **Google Antigravity** agents as
the implementation layer under a human + Claude Code **Chief Architect**.

## Contents

| File | Purpose |
| --- | --- |
| [`HANDOFF_SPEC_TEMPLATE.md`](HANDOFF_SPEC_TEMPLATE.md) | The template every work assignment copies. |
| [`DEFINITION_OF_DONE.md`](DEFINITION_OF_DONE.md) | The single checklist a PR is merged against. |
| [`GUARDRAILS.md`](GUARDRAILS.md) | Hard limits on agent autonomy (commands, scope, security). |
| `handoffs/` | One spec per unit of work, named `HANDOFF-<slice>-<name>.md`. |

## The model

```
          docs/01-10  (canonical: PRD, architecture, API, security, data, ops)
                │  Chief Architect distills into a self-contained spec
                ▼
   docs/11-agent-delivery/handoffs/HANDOFF-slice-N.md
                │  Antigravity agent: plan → approve → implement → verify
                ▼
        Pull Request  (gates green + verification Artifacts attached)
                │  Chief Architect reviews vs DEFINITION_OF_DONE.md
                ▼
             main  →  slice test gate ticked  →  next slice unblocked
```

## Why Antigravity specifically

- **Agent Manager** runs multiple implementation agents in parallel on `Parallel-safe` handoffs.
- **Artifacts** (plans, task lists, screenshots, browser recordings) are the review surface — they
  map 1:1 to the verification requirements in `DEFINITION_OF_DONE.md`.
- **Editor + terminal + browser** in one agent lets a single run implement a vertical slice and
  prove the UI works end-to-end.
- Config lives in `AGENTS.md` (root) and `.antigravity/` so the same specs also drive Claude Code,
  Cursor, or a human without change.

## Adding a new piece of work

1. Confirm the requirement exists in `docs/01-product/REQUIREMENTS_TRACEABILITY.md` (`REQ-xxx`).
2. Land the API/schema change in `docs/03-api/openapi.yaml` + `docs/02-architecture/DATABASE_SCHEMA.md`.
3. Copy `HANDOFF_SPEC_TEMPLATE.md` → `handoffs/HANDOFF-<slice>-<name>.md`, fill every section.
4. Assign it to an Antigravity agent (paste the file path as the task, or open it in the workspace).
