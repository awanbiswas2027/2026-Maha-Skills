# MahaSkills — Engineering & Coding Standards

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Version:** 1.0  
**Status:** Canonical Coding Standards Baseline  

---

## 1. Frontend Development Standards (React & TypeScript)

* **TypeScript Strictness:** `"strict": true`, `"noImplicitAny": true`, `"exactOptionalPropertyTypes": true`. The use of `any` is strictly banned in production code; use `unknown` with runtime type narrowing or generic type parameters.
* **Component Architecture:** Functional components exclusively, using named exports:
  ```tsx
  export const GapHeatmapCard: React.FC<GapHeatmapCardProps> = ({ districtId, sectorId }) => { ... };
  ```
* **Styling:** Tailwind CSS utility classes organized via `prettier-plugin-tailwindcss`. Dynamic class combinations must use `cn()` (`clsx` + `tailwind-merge`).
* **Forms & Validation:** All forms utilize `react-hook-form` coupled with `zod` schema resolvers. Form state must be validated client-side before dispatching network requests.
* **Internationalization:** Never embed raw English or Marathi strings in JSX. Every user-visible text string must use `t('domain.key')` from `react-i18next`.

---

## 2. Backend Development Standards (Python & FastAPI)

* **Type Hinting:** 100% of function signatures must include Python type annotations (`typing.Annotated`, `typing.Optional`, `list`, `dict`).
* **Data Validation:** All request bodies and query parameters must be validated via **Pydantic v2** models with explicit field descriptions and validation constraints.
* **Async IO:** All database access, external HTTP requests, and Redis operations must use non-blocking asynchronous calls (`async/await`) with `asyncpg` and `httpx`.
* **Database Queries:** Raw string SQL concatenation is forbidden. All queries must utilize SQLAlchemy 2.0 ORM or parameterized Core statements.
* **Code Formatting:** Code style enforced via `ruff` and `black` with a line-length limit of 100 characters.

---

## 3. Git Workflow & Commit Conventions

* **Branching Strategy:** GitHub Flow with short-lived feature branches: `feat/REQ-ID-short-title`, `fix/issue-id-short-title`.
* **Conventional Commits:** All commit messages must follow the Conventional Commits specification:
  ```text
  feat(lmi): add nightly deduplication task for naukri scraper (REQ-LMI-01)
  fix(placements): correct salary range validation bounds (REQ-PLA-01)
  test(gap-scoring): add unit tests for oversupply heuristic (TEST-GAP-002)
  ```
* **Pre-Commit Hooks:** Husky runs `lint-staged`, type-checking (`tsc --noEmit`), and secrets scanning (`gitleaks`) prior to any commit.
