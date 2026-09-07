# ADR-001: React 18 with TypeScript & Vite for Client Applications

## Status
Accepted

## Context
MahaSkills requires a high-performance, accessible, and trilingual (Marathi, Hindi, English) web client serving both government officials, institutional administrators, employers, and prospective student candidates across diverse network environments (including 3G/4G connections in rural Maharashtra).

## Decision
We adopt **React 18** with **TypeScript** and **Vite** as the standard frontend engineering foundation. The UI is built using **Tailwind CSS** with **Radix UI / shadcn/ui** primitives to ensure WCAG 2.1 AA and GIGW 3.0 compliance.

## Consequences
### Positive
* Fast development iteration and sub-second HMR with Vite.
* Strict compile-time type safety preventing runtime undefined errors.
* Uncompromised accessibility foundations via headless Radix UI primitives.
* Excellent bundle size optimization ($< 250\text{KB}$ initial gzipped JavaScript).

### Negative / Trade-offs
* Requires careful code-splitting for heavy analytical assets (e.g., SVG choropleth maps, Recharts).
