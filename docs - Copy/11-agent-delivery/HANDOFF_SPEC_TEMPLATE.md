# HANDOFF-<slice>-<name>

| Field | Value |
| --- | --- |
| Slice | `<0–11 from IMPLEMENTATION_PLAN.md>` |
| Requirement(s) | `REQ-xxx`, `REQ-yyy` |
| Test gate(s) | `TEST-xxx`, `TEST-yyy` |
| Branch | `feat/<REQ-ID>-<short-title>` |
| Parallel-safe | `yes / no` (no shared files, migrations, or OpenAPI paths with other open handoffs) |
| Status | `Draft / Ready / In progress / In review / Done` |
| Assigned agent | `<Antigravity agent id / name>` |

## 1. Objective

_One paragraph: what capability exists after this is merged, and for which role._

## 2. Context to read first

- `docs/…` (list every doc section the agent must read)
- Prior handoffs this depends on: `HANDOFF-…`

## 3. Scope — in

- Bullet list of concrete, verifiable changes.

## 4. Scope — out (do NOT touch)

- Explicit exclusions. Anything not listed in §3 is out.

## 5. Files to create / modify

| Path | Action | Note |
| --- | --- | --- |
| `backend/app/api/v1/endpoints/<x>.py` | modify | add route `…` |
| `backend/app/services/<x>_service.py` | create | business logic |
| `backend/app/models/<x>.py` | modify | new column `…` |
| `docs/03-api/openapi.yaml` | modify | see §6 |
| `frontend/src/features/<x>/…` | create | components `…` |
| `frontend/src/types/api.ts` | regenerate | from openapi.yaml |
| `frontend/public/locales/{mr,hi,en}/<ns>.json` | modify | new keys |
| `backend/tests/test_<x>.py` | create | covers `TEST-xxx` |

## 6. API delta (OpenAPI fragment)

```yaml
# paste the exact paths/schemas to add or change in docs/03-api/openapi.yaml
```

## 7. Data-model delta

```sql
-- DDL or SQLAlchemy model sketch; migration file name
```

## 8. Acceptance criteria (Gherkin)

```gherkin
Scenario: <…>
  Given <role> …
  When …
  Then …
```

## 9. Verification required (attach as Artifacts)

- [ ] `ruff check . && black --check .` clean
- [ ] `pytest -q` green (new tests for `TEST-xxx`)
- [ ] `npm run lint && npm run typecheck && npm test && npm run build` green
- [ ] `npx @stoplight/spectral-cli lint docs/03-api/openapi.yaml` no errors
- [ ] Browser Artifact: `<role>` flow working against local stack
- [ ] (data/pipeline) DAG / Celery task run log on sample data

## 10. Definition of Done

Per [`DEFINITION_OF_DONE.md`](DEFINITION_OF_DONE.md). PR titled `feat(<domain>): <title> (REQ-xxx)`,
links this file, updates `docs/01-product/REQUIREMENTS_TRACEABILITY.md`.

## 11. Open questions

_Architect fills known ambiguities here. Agent appends `OQ:` items; do not guess past them._
