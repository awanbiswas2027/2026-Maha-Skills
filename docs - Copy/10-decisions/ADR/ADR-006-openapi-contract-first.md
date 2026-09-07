# ADR-006: Contract-First API Development with OpenAPI 3.1

## Status
Accepted

## Context
In complex multi-tier projects where frontend and backend are developed across distributed teams, hand-written markdown API specifications drift rapidly from actual server implementations, causing integration delays, type mismatches, and broken contracts.

## Decision
We enforce a **Contract-First development model** anchored on a canonical **OpenAPI 3.1 YAML** file (`docs/03-api/openapi.yaml`). 
* **Frontend:** Generates TypeScript interfaces using `openapi-typescript` and seeds local development mocks via Mock Service Worker (MSW) or Prism.
* **Backend:** FastAPI routes validate payloads against schemas derived directly from the OpenAPI contract.
* **CI Gates:** Breaking schema modifications fail automated PR gates verified via Spectral linting.

## Consequences
### Positive
* Perfect type synchronization between frontend and backend.
* Frontend slices can be developed and tested against mock servers independently of backend deployment.
* Living, interactive API documentation (Swagger UI / Redoc) generated automatically.
