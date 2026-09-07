# Antigravity Workspace Rules — MahaSkills

These rules are always in context for every Antigravity agent run in this workspace. They are
enforced in addition to `AGENTS.md` (repo root) and the linked `docs/`.

## Operating mode

- **Plan before code.** For any task larger than a one-file change, produce a plan Artifact in the
  Agent Manager and pause for human (Chief Architect) approval. Do not begin edits until approved.
- **Stay in declared scope.** Implement exactly what the active handoff spec in
  `docs/11-agent-delivery/handoffs/` describes. Out-of-scope findings go into the PR description
  under "Observations", never into the diff.
- **One slice per branch.** Branch name: `feat/<REQ-ID>-<short-title>`. Never commit to `main`.
- **Small commits, Conventional Commits format**, each referencing a `REQ-xxx` or `TEST-xxx` id.

## Verification (Artifacts to attach to every task)

1. `ruff check . && black --check .` output (backend touched) — must be clean.
2. `pytest -q` output (backend touched) — all green, new tests for new logic.
3. `npm run lint && npm run typecheck && npm test && npm run build` output (frontend touched) — all green.
4. `npx @stoplight/spectral-cli lint docs/03-api/openapi.yaml` output (API touched) — no errors.
5. Browser Artifact: screenshot or recording of the feature working against `npm run dev` +
   `docker compose up` for any user-facing change. Test the actual role-based flow.
6. For data/pipeline changes: a run log of the affected Airflow DAG or Celery task on sample data.

A task is not complete until all applicable Artifacts above are attached.

## Code constraints (hard fail if violated)

- TypeScript: `strict` true, no `any`, no non-null `!` on network data, named exports only.
- Python: full type hints, Pydantic v2 for all I/O, `async` for all DB/HTTP/Redis, no raw SQL strings.
- i18n: no literal user-facing strings; keys added to `mr`, `hi`, `en` locale files together.
- Security: RBAC guard on every route; candidate PII pseudonymized at ingest; nothing sensitive logged.
- Contract-first: edit `docs/03-api/openapi.yaml` in the same change as the endpoint; regenerate
  `frontend/src/types/api.ts`.
- No new runtime dependency without noting it in the PR and in `docs/10-decisions/` if architectural.

## When blocked

If the handoff is ambiguous, contradicts a doc, or needs a decision above implementation level:
stop, write the question into the task's Artifact/notes as `OQ:` (open question), and do not guess.
The Chief Architect resolves it in the handoff file or a new ADR.

## Knowledge

Persist durable, reusable facts (build quirks, non-obvious conventions, resolved gotchas) to
`.antigravity/knowledge.md`. Do not persist secrets or task-specific trivia.
