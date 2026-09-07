# ADR-003: TanStack Query for Server State & Zustand for Client State

## Status
Accepted

## Context
Previous project documentation contained conflicting state management recommendations (`Zustand + Axios` in `PROJECT_BREAKDOWN.md` vs. `TanStack Query + shadcn/ui` in the frontend brief). Storing asynchronous server data in manual client-side stores introduces stale caches, race conditions, and boilerplate.

## Decision
We cleanly separate server and client state:
1. **Server State:** Managed exclusively by **TanStack Query v5** (stale-while-revalidate caching, query key factories, automated background deduplication, and optimistic updates).
2. **Client State:** Managed by lightweight **Zustand** stores strictly for transient UI state (sidebar collapse, active language/locale, course comparison tray).

## Consequences
### Positive
* Eliminates thousands of lines of boilerplate async actions, loading flags, and error reducers.
* Automatic background refetching and cache synchronization across analytical dashboards.
* Clean separation of concerns between remote API state and local interface state.
