# Definition of Done

A handoff PR is merged only when **every** applicable box is checked. The Chief Architect reviews
against this list — nothing else.

## Correctness

- [ ] Implements 100% of the handoff §3 scope; 0% of §4 out-of-scope.
- [ ] All acceptance criteria (handoff §8) demonstrably pass.
- [ ] Behaviour matches `docs/` — no silent contradictions; discrepancies raised as `OQ:` or ADR.

## Contract & types

- [ ] `docs/03-api/openapi.yaml` updated in this PR; `npx @stoplight/spectral-cli lint` passes.
- [ ] `frontend/src/types/api.ts` regenerated from the spec; no drift.
- [ ] TypeScript `strict`, no `any`, no unchecked non-null on network data.
- [ ] Python: full type hints, Pydantic v2 models for all request/response I/O.

## Quality gates (output pasted into PR)

- [ ] `ruff check . && black --check .` — clean (backend touched).
- [ ] `pytest -q` — green; new/changed logic has tests mapped to `TEST-xxx`.
- [ ] `npm run lint && npm run typecheck && npm test && npm run build` — green (frontend touched).

## Security & compliance

- [ ] RBAC role + scope guard on every new/changed endpoint (`docs/05-security/RBAC_MATRIX.md`).
- [ ] Candidate PII pseudonymized at ingest; not logged, returned, or persisted raw (DPDP 2023).
- [ ] No secrets in code, fixtures, or logs; new env keys only in `.env.example`.
- [ ] No raw SQL string building; parameterized/ORM only.

## i18n & accessibility

- [ ] No literal user-facing strings; keys added to `mr`, `hi`, and `en` together.
- [ ] New UI meets WCAG 2.1 AA basics: labels, focus order, contrast, keyboard operable.

## Verification artifacts attached

- [ ] Browser screenshot or recording of the feature working in the correct role context.
- [ ] For pipelines/engines: a run log against sample data.

## Hygiene

- [ ] Branch `feat/<REQ-ID>-<title>`; Conventional Commits; each commit cites a `REQ`/`TEST` id.
- [ ] PR title `feat(<domain>): <slice title> (REQ-xxx)`, links the handoff file.
- [ ] `docs/01-product/REQUIREMENTS_TRACEABILITY.md` row updated to `Implemented`.
- [ ] No unrelated file churn, no committed build output, no `.env`.
