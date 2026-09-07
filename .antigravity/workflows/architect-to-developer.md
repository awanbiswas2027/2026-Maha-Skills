# Workflow: Architect → Antigravity Developer

Repeatable loop for turning an architecture decision into merged, verified code.

## Roles

- **Chief Architect (human + Claude Code):** owns `docs/`, the OpenAPI contract, ADRs, slice
  sequencing, and every handoff spec. Reviews plans and PRs. Does not write feature code.
- **Antigravity Agent (developer):** implements one handoff at a time, produces verification
  Artifacts, opens the PR.

## The loop

```
1. ARCHITECT   Write handoff spec  → docs/11-agent-delivery/handoffs/HANDOFF-<slice>-<name>.md
                 (from HANDOFF_SPEC_TEMPLATE.md; update openapi.yaml + traceability matrix first)
2. AGENT       Read handoff + linked docs + AGENTS.md + .antigravity/rules.md
3. AGENT       Produce Implementation Plan Artifact in Agent Manager  → PAUSE
4. ARCHITECT   Review plan. Approve, or annotate and send back to step 3.
5. AGENT       Implement in scope. Run all gates (AGENTS.md §3). Attach Artifacts.
6. AGENT       Open PR: feat(<domain>): <title> (REQ-xxx), links the handoff file.
7. ARCHITECT   Review against DEFINITION_OF_DONE.md. Merge, or request changes → step 5.
8. ARCHITECT   Tick the slice's test gate; unblock the next slice.
```

## Guarantees the architect provides in every handoff

- Exact file paths to create/modify (agent does not go hunting).
- The API delta as an OpenAPI fragment.
- The data-model delta as DDL or SQLAlchemy model sketch.
- The list of `TEST-xxx` gates that must pass.
- Explicit out-of-scope list.

## Guarantees the agent provides back

- Plan artifact before code.
- Zero scope creep.
- All gates green, output pasted.
- Browser/CLI verification artifact of the thing actually working.
- Open questions raised as `OQ:` rather than guessed.

## Parallelism

Multiple agents may run concurrently only on handoffs the architect has marked
`Parallel-safe: yes` (no shared files, no overlapping migrations, no OpenAPI collisions).
