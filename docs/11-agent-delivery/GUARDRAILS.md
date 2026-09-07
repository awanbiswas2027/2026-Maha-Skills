# Agent Guardrails

Limits on autonomous-agent behaviour in this repo. Applies to Antigravity and any other agent.

## Autonomy boundary

| Agent may, without asking | Agent must get architect approval | Agent must never |
| --- | --- | --- |
| Read any file in the repo | Merge a PR | Commit or push to `main` |
| Create a `feat/*` branch | Change `docs/03-api/openapi.yaml` shape beyond the handoff fragment | Force-push, rewrite shared history |
| Run lint / typecheck / tests / build | Add a runtime dependency | Edit `.env`, print/commit secrets |
| Run `docker compose up`, local `uvicorn`/`vite` | Create or edit an ADR in `docs/10-decisions/` | Delete or rewrite `docs/01`–`docs/10` content |
| Generate `frontend/src/types/api.ts` from the spec | Change CI config, Dockerfiles, `docker-compose.yml` | Disable a test, lint rule, or type check to pass a gate |
| Write migrations additively | Any destructive migration (drop/rename column, data backfill) | Run migrations against a non-local database |
| Attach Artifacts, open a PR | Widen an RBAC scope or auth rule | Call external paid/production APIs or real scraper targets at scale |

## Command allowlist (safe to run unattended)

```
ruff, black, pytest, mypy
npm run lint | typecheck | test | build | dev
npx @stoplight/spectral-cli lint docs/03-api/openapi.yaml
docker compose up/down/logs/ps   (local only)
alembic upgrade head             (local DB only)
git checkout -b, git add, git commit, git push origin feat/*
```

Anything not listed → ask first.

## Scope creep

Out-of-scope improvements (refactors, unrelated bug fixes, "while I was here" changes) go in the PR
description under **Observations** as suggested follow-up handoffs. They do not go in the diff.

## Data & privacy

- Use only synthetic/sample fixtures. No real candidate, employer, or placement data in the repo.
- Scraper DAGs run against fixtures or a single throttled request in dev — never bulk-hit Naukri /
  LinkedIn / Indeed / NCS from an agent run.
- Any code touching candidate identifiers must route through the pseudonymization helper; a plain
  identifier reaching storage or a response is a blocking defect.

## Stop conditions

Halt and hand back to the architect if: the handoff contradicts a canonical doc; a gate can only be
passed by weakening it; the change needs a schema-breaking migration; or an `OQ:` blocks progress.
