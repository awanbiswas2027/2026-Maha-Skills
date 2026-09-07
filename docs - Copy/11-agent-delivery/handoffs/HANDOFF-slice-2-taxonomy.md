# HANDOFF-slice-2-taxonomy

| Field | Value |
| --- | --- |
| Slice | 2 — Data Primitives & Taxonomy Hierarchy |
| Requirement(s) | `REQ-TAX-01`, `REQ-TAX-02` (see REQUIREMENTS_TRACEABILITY.md) |
| Test gate(s) | `TEST-TAX-001`, `TEST-TAX-002` |
| Branch | `feat/REQ-TAX-01-taxonomy-tree` |
| Parallel-safe | no (adds migrations + `taxonomy` OpenAPI paths) |
| Status | Ready |
| Assigned agent | _(unassigned — Antigravity)_ |

## 1. Objective

An Admin/Data Steward and any authenticated role can browse the full NSQF skill taxonomy
(Sector → SSC → Job Role → Skills) as an interactive, searchable tree at `/taxonomy`, backed by a
real database query instead of the current hard-coded stub in `endpoints/taxonomy.py`.

## 2. Context to read first

- `docs/02-architecture/DATABASE_SCHEMA.md` — taxonomy tables, partitioning, indexes.
- `docs/03-api/API_SPECIFICATION.md` §taxonomy + `docs/03-api/openapi.yaml`.
- `docs/04-design/UI_UX_SPECIFICATION.md` — tree view + `SkillBadge` spec.
- `docs/05-security/RBAC_MATRIX.md` — `taxonomy:read` (all authenticated), `taxonomy:write` (Admin).
- `docs/07-development/IMPLEMENTATION_PLAN.md` Slice 2.
- Existing: `backend/app/models/taxonomy.py`, `backend/app/api/v1/endpoints/taxonomy.py`,
  `scripts/seed_taxonomy.py`, `frontend/src/features/taxonomy/`.

## 3. Scope — in

- Alembic migration creating `sectors`, `sscs`, `job_roles`, `skills`, `job_role_skills` from the
  existing SQLAlchemy models (align any column gaps with `DATABASE_SCHEMA.md`; add indexes on
  `job_roles.sector_id`, `job_roles.ssc_id`, `skills.sector_id`, and a trigram/`ILIKE` index for
  title search).
- `taxonomy_service.py`: async query assembling the nested tree; `search(q, nsqf_level?, sector?)`.
- Replace the stub `GET /v1/taxonomy/tree` with the DB-backed version; add
  `GET /v1/taxonomy/search`.
- Extend `scripts/seed_taxonomy.py` to seed SSCs, job roles, skills, and role↔skill links for the
  5 seeded sectors (≥ 3 job roles + ≥ 5 skills per sector; include ≥ 1 `is_emerging` skill).
- OpenAPI update (§6) + regenerate `frontend/src/types/api.ts`.
- Frontend: `/taxonomy` route, `TaxonomyTreeView`, `SkillBadge`, search box; TanStack Query hook +
  query keys; i18n namespace `taxonomy` in `mr`/`hi`/`en`.
- Tests: backend service + endpoint tests (`TEST-TAX-001`), frontend tree render/expand/search test
  (`TEST-TAX-002`).

## 4. Scope — out (do NOT touch)

- Elasticsearch indexing (deferred to a later handoff — use PostgreSQL `ILIKE`/trigram for now).
- Taxonomy **editing** UI/endpoints (`taxonomy:write`).
- NLP enrichment / job-posting skill mapping (Slice 3).
- Auth/RBAC internals — only consume the existing guards.

## 5. Files to create / modify

| Path | Action | Note |
| --- | --- | --- |
| `backend/alembic/versions/<ts>_taxonomy_tables.py` | create | migration from models |
| `backend/app/models/taxonomy.py` | modify | reconcile columns/indexes with schema doc |
| `backend/app/services/taxonomy_service.py` | create | tree assembly + search |
| `backend/app/api/v1/endpoints/taxonomy.py` | modify | DB-backed `/tree`, new `/search` |
| `backend/app/schemas/taxonomy.py` | create | Pydantic v2 response models |
| `docs/03-api/openapi.yaml` | modify | see §6 |
| `scripts/seed_taxonomy.py` | modify | add sscs/job_roles/skills/links |
| `backend/tests/test_taxonomy.py` | create | `TEST-TAX-001` |
| `frontend/src/types/api.ts` | regenerate | from openapi.yaml |
| `frontend/src/features/taxonomy/TaxonomyTreeView.tsx` | create | recursive tree |
| `frontend/src/features/taxonomy/SkillBadge.tsx` | create | type + emerging variant |
| `frontend/src/features/taxonomy/useTaxonomyTree.ts` | create | TanStack Query hook |
| `frontend/src/features/taxonomy/index.ts` | modify | barrel exports |
| `frontend/src/app/routes.tsx` | modify | add `/taxonomy` (AuthGuard) |
| `frontend/src/lib/query-keys.ts` | modify | `taxonomy` keys |
| `frontend/public/locales/{mr,hi,en}/taxonomy.json` | create | UI strings |
| `frontend/src/features/taxonomy/TaxonomyTreeView.test.tsx` | create | `TEST-TAX-002` |

## 6. API delta (OpenAPI fragment)

```yaml
paths:
  /v1/taxonomy/tree:
    get:
      operationId: getTaxonomyTree
      tags: [taxonomy]
      security: [{ bearerAuth: [] }]
      responses:
        "200":
          description: Full Sector→SSC→JobRole→Skill tree
          content:
            application/json:
              schema: { $ref: "#/components/schemas/ApiResponse_TaxonomyTree" }
  /v1/taxonomy/search:
    get:
      operationId: searchTaxonomy
      tags: [taxonomy]
      security: [{ bearerAuth: [] }]
      parameters:
        - { name: q, in: query, required: true, schema: { type: string, minLength: 2 } }
        - { name: nsqf_level, in: query, schema: { type: integer, minimum: 1, maximum: 10 } }
        - { name: sector_code, in: query, schema: { type: string } }
      responses:
        "200":
          description: Flat list of matching job roles and skills
          content:
            application/json:
              schema: { $ref: "#/components/schemas/ApiResponse_TaxonomySearch" }
components:
  schemas:
    TaxonomyJobRole:
      type: object
      required: [id, qp_code, title_en, title_mr, nsqf_level, skills]
      properties:
        id: { type: string, format: uuid }
        qp_code: { type: string }
        title_en: { type: string }
        title_mr: { type: string }
        nsqf_level: { type: integer }
        skills:
          type: array
          items: { $ref: "#/components/schemas/TaxonomySkill" }
    TaxonomySkill:
      type: object
      required: [id, name_en, name_mr, skill_type, is_emerging]
      properties:
        id: { type: string, format: uuid }
        name_en: { type: string }
        name_mr: { type: string }
        skill_type: { type: string, enum: [TECHNICAL, CORE, PROFESSIONAL] }
        is_emerging: { type: boolean }
    # TaxonomySector / TaxonomySsc / TaxonomyTree + the two ApiResponse_* wrappers
    # follow the existing ApiResponse<T> envelope in this file.
```

## 7. Data-model delta

Tables already sketched in `backend/app/models/taxonomy.py`. Migration must:

```sql
-- create sectors, sscs, job_roles, skills, job_role_skills (per models + DATABASE_SCHEMA.md)
CREATE INDEX ix_job_roles_sector_id ON job_roles (sector_id);
CREATE INDEX ix_job_roles_ssc_id    ON job_roles (ssc_id);
CREATE INDEX ix_skills_sector_id    ON skills (sector_id);
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX ix_job_roles_title_en_trgm ON job_roles USING gin (title_en gin_trgm_ops);
CREATE INDEX ix_skills_name_en_trgm     ON skills    USING gin (name_en gin_trgm_ops);
```

## 8. Acceptance criteria (Gherkin)

```gherkin
Scenario: Authenticated user browses the taxonomy tree
  Given a seeded database and a logged-in District Officer
  When they open /taxonomy
  Then they see all seeded sectors collapsed
  And expanding "Automotive & Electric Vehicles" reveals its SSCs, then job roles, then skills
  And an emerging skill renders with the SkillBadge "emerging" variant

Scenario: Search filters the taxonomy
  Given the user is on /taxonomy
  When they type "battery" in the search box
  Then only job roles and skills matching "battery" are listed, each with its NSQF level

Scenario: Endpoint requires auth
  When GET /v1/taxonomy/tree is called without a bearer token
  Then the response status is 401 with error code AUTH_UNAUTHENTICATED
```

## 9. Verification required (attach as Artifacts)

- [ ] `ruff check . && black --check .` clean
- [ ] `pytest -q` green incl. `test_taxonomy.py` (`TEST-TAX-001`)
- [ ] `npm run lint && npm run typecheck && npm test && npm run build` green (`TEST-TAX-002`)
- [ ] `npx @stoplight/spectral-cli lint docs/03-api/openapi.yaml` no errors
- [ ] Browser recording: log in → `/taxonomy` → expand a sector to skills → search "battery"
- [ ] `python scripts/seed_taxonomy.py` run log showing seeded counts

## 10. Definition of Done

Per `../DEFINITION_OF_DONE.md`. PR: `feat(taxonomy): DB-backed NSQF taxonomy tree + search (REQ-TAX-01)`,
links this file, flips the `REQ-TAX-01` / `REQ-TAX-02` rows to `Implemented`.

## 11. Open questions

- `OQ-TAX-A`: Should `skill_type` enum include `PROFESSIONAL` or only `TECHNICAL`/`CORE`? Current
  model default is `TECHNICAL`. **Architect answer:** use `[TECHNICAL, CORE, PROFESSIONAL]`; keep DB
  default `TECHNICAL`.
- `OQ-TAX-B`: Tree payload size with full seed — if > 500 KB, add `?sector_code=` filtering to `/tree`
  and lazy-load per sector. Flag actual measured size in the PR.
