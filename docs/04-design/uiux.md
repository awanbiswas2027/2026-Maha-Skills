# MahaSkills UI/UX Specification

**Platform:** MahaSkills, Labour-Market Intelligence & Curriculum Alignment Platform
**Owner:** Government of Maharashtra, DSEEI / MSInS · Problem Statement 26134
**Document type:** UI/UX execution contract for frontend engineers and AI coding agents
**Version:** 1.1 · **Date:** 2026-09-17 · **Status:** Accepted. Product-owner decisions UX-Q1 to UX-Q11 are recorded in Appendix B; corrections C-02 to C-09 are approved and written back to DESIGN_SYSTEM.md.

---

## 1. Purpose

### 1.1 What this document is

This is the rulebook for how every MahaSkills screen, component, state and interaction looks and behaves. It turns the PRD and the `docs/04-design/` baseline into rules that are **explicit, deterministic and testable**. A frontend engineer or AI agent holding `PRD + uiux.md + the existing component system` must be able to build and visually verify a feature without inventing a design language.

Every rule has an ID (for example `TBL-04`). Cite rule IDs in PR descriptions, review comments and QA findings.

Rule verbs:

- **MUST / MUST NOT**: non-negotiable. A violation is a defect.
- **SHOULD / SHOULD NOT**: the default. Deviating requires a one-line reason in the PR.
- **MAY**: allowed, not required.

### 1.2 Precedence

When two sources disagree, apply this order and raise the conflict (do not silently pick one, per `AGENTS.md` §1):

1. Statutory and compliance docs: `docs/04-design/ACCESSIBILITY.md` (WCAG 2.1 AA, GIGW 3.0), `docs/05-security/DATA_PRIVACY.md` (DPDP 2023), `docs/05-security/RBAC_MATRIX.md`.
2. `docs/01-product/PRD.md` and `docs/04-design/INFORMATION_ARCHITECTURE.md` (what exists, for whom).
3. **This document** (how it looks and behaves).
4. `docs/04-design/DESIGN_SYSTEM.md` and `docs/04-design/UI_UX_SPECIFICATION.md` (token and screen baseline). Where this document corrects a baseline value, the correction is tagged `C-xx` with its reason (§7.8). Most corrections exist because a baseline value fails item 1.
5. Installed skill presets under `.agents/skills/` (reference only; never a source of brand values).

### 1.3 Source inventory

Every named source was located and read before this document was written. Nothing below is invented from a source that could not be inspected.

| Named source | Where it actually is | What it actually is | How this document uses it |
|:---|:---|:---|:---|
| **Taste Skills** | `.agents/skills/design-taste-frontend/SKILL.md` (from `Leonxlnx/taste-skill`) | An anti-slop skill for **landing pages, portfolios and redesigns**. Its §13 says it is *not* for dashboards, data tables or multi-step forms. | Anti-default discipline, the public-sector dial preset, state completeness, contrast checks, "motion must be motivated", reduced motion, Core Web Vitals, AI-tell bans, copy self-audit. Applied in full only to the public landing page. See §4. |
| **Impeccable** | `.agents/skills/impeccable/SKILL.md` + `DESIGN.md` (a `typeui.sh` preset from `bergside/awesome-design-skills`) | A **visual preset** (amber `#CC8800`, burnt orange `#C55221`, Chakra Petch, cream "editorial poster" look) plus a generic guideline-authoring discipline. It is *not* the long-form "Impeccable" anti-pattern skill some teams use; that package is not installed. | The authoring discipline: tokens first, explicit states, testable accessibility, do/don't pairs, and "if aesthetics conflict with accessibility, accessibility wins". The palette and font are rejected. See §5. |
| **awesome-design.md** | No file with this name exists. The matching source is `bergside/awesome-design-skills` in `skills-lock.json`: 67 presets in `.agents/skills/*/SKILL.md` + `DESIGN.md`. | A catalogue of style presets (enterprise, ant, corporate, clean, shadcn, material, minimal, glassmorphism, neon and others). They share one template: foundations, required states, WCAG 2.2 AA, a 12/14/16/20/24/32 type scale, 4px/8px spacing. | Treated as the "awesome-design" source. Its shared structure is adopted. Its per-preset palettes and fonts are rejected. See §6. |
| **playwright-cli** | `.agents/skills/playwright-cli/` (from `microsoft/playwright-cli`) | A CLI for driving a browser: snapshots, screenshots, resize, console, network mocking, tracing, video, annotation. | The mandatory visual QA loop (§28) and visual regression process (§29). **It is not installed** (see §1.4). |
| **image2three.js** | `.agents/skills/img2threejs/` (from `img2threejs/img2threejs`, v2.0.0) | A pipeline that rebuilds **one physical object or character from a reference photo** as procedural Three.js code, with Python gates and screenshot review. It is not a charting, mapping or data-visualisation library. | Strict, narrow usage rules (§27). Not used on any analytical or workflow screen. |
| PRD and product docs | `docs/01-product/`, `docs/04-design/`, `docs/05-security/`, `docs/02-architecture/FRONTEND_ARCHITECTURE.md`, `docs/backend_architecture_specification.md` §H, §J, §K | Canonical product, IA, accessibility, RBAC, matching and recommendation contracts. | Roles, routes, workflows, explainability requirements. |
| Existing frontend | `frontend/` (React 18, TS, Vite, Tailwind 3.4, shadcn/ui on Radix, TanStack Query/Table/Virtual, Recharts, react-hook-form, zod, zustand, i18next, lucide-react) | Three shells, a working gap dashboard, heatmap tile grid, priority table, course finder, pathway quiz. Most other routes are placeholders. Data is mocked in `*Data.ts` files. | Token values, primitives and patterns to keep. Deviations are listed in Appendix A. |
| Screenshots / mockups | None for the product UI. `pxpipe_images/` holds rendered *documentation* images, not UI mockups. | | No visual reference exists beyond the running app. |

### 1.4 Missing dependencies (documented, not worked around)

| Dependency | State | Consequence | Action |
|:---|:---|:---|:---|
| `playwright-cli` global command | Not on PATH; `npx --no-install playwright` also fails | The §28 loop cannot run yet | Approved (UX-Q10) |
| `@playwright/test` | Not in `frontend/package.json` (only `@axe-core/playwright` is) | Automated a11y (`TEST-NFR-003`) and screenshot baselines (§29) cannot run | Approved (UX-Q10) |
| `three` | Not a dependency | image2three.js output cannot render | Approved (UX-Q6, UX-Q10); added by the 3D prompt |
| Maharashtra district boundary TopoJSON | Decided in OQ-09, not in the repo | The choropleth in `UI_UX_SPECIFICATION.md` §2.1 cannot be built; the current heatmap is a tile grid | Tile grid stays as the fallback (§15.6). |
| Self-hosted fonts | Fonts load from Google Fonts via `<link>` in `index.html` | External dependency on a government page; Taste §3.A bans this in production | Approved (UX-Q3): self-host via @fontsource (§8.1) |

---

## 2. Product Design Philosophy

### 2.1 What MahaSkills is, visually

MahaSkills is **an instrument for public decisions**. Officers use it to decide which ITI seats to add, which syllabus to revise, and where to spend capital grants. Trainees use it to decide which course to take. The interface has one job: **make the evidence behind those decisions legible, and make the next action obvious.**

The design reading (Taste §0.B format):

> **Reading this as:** a trust-first, trilingual public-sector analytics and workflow product for government officers (dense, repeat, long-session use), plus a mobile-first public guidance flow for trainees, with a restrained institutional language, built on the existing shadcn/ui + Tailwind system.

### 2.2 The decision chain

Every screen serves one or more links of this chain, and a user must be able to move along it without losing context:

| Link | Question the UI answers | Where it lives |
|:---|:---|:---|
| **Data** | What is the raw signal, and how fresh and complete is it? | Data freshness line, source and "as of" labels, evidence tabs, accessible data tables |
| **Insight** | What changed, and where is the problem? | KPI deltas, heatmap, ranked gap tables, templated insight sentences |
| **Decision** | What should be done, and why? | Recommendation dossiers, factor breakdowns, trigger rules, thresholds |
| **Action** | How do I do it now? | Contextual primary action per row or page, review forms, plan builder, upload |
| **Outcome** | Did it work? | Placement rate against target (KPI-01 62%), workflow status timeline, audit trail |

**Rule PHI-01.** A new screen MUST declare in its handoff spec which links of the chain it serves and which link a user reaches next from it. A screen that shows data with no path to insight or action is incomplete.

### 2.3 Government and enterprise context

These facts shape every rule below:

- **Repeat professional users.** Officers use the tool weekly for hours. Efficiency beats first-impression delight. Density is higher than in consumer apps.
- **Auditability.** Decisions are defended in committees. Every number must be traceable to its source, run and time.
- **Trilingual, Marathi first.** `mr` is the default locale (`index.html lang="mr"`, `fallbackLng: 'mr'`). Devanagari text is ~20-40% longer than English and needs extra line height. Layouts MUST survive the longest of the three strings.
- **Slower environments.** District offices and rural users may have older hardware and weak networks. Heavy decoration, large bundles and 3D are costs, not features.
- **Statutory accessibility.** WCAG 2.1 AA and GIGW 3.0 are legal requirements (RPwD Act 2016), not polish.
- **Privacy by design.** There is **zero candidate search** and no view of any individual candidate for any role other than the candidate (ADR-005, IA §3). Placement data is shown only as anonymised aggregates.

**Rule PHI-02.** Do NOT use consumer-app patterns that trade efficiency for delight: onboarding carousels, gamified streaks, infinite scroll on work lists, swipe-only actions, confetti, pull-to-refresh as the only refresh.

---

## 3. Design Principles

Each principle below says what it means, why it exists, where it applies, what to avoid, and how it shows up in code.

### P1. Hierarchy before decoration

- **Means:** On every screen, one element is visually dominant. It is the thing the user came for. Size, weight, position and color are spent in that order to create hierarchy.
- **Why:** Officers scan. If three things compete, none is read.
- **Applies:** Every page, card and table.
- **Avoid:** Four KPI cards with equal weight and equal colored icons. Gradient headers competing with the data below.
- **Implementation:** One `text-2xl font-semibold` page title. One primary KPI at `text-3xl`, the others at `text-2xl`. One `variant="default"` button per view region; the rest `outline`, `ghost` or `link`.

### P2. Restraint

- **Means:** Every visual treatment (color, border, shadow, icon, motion) must carry information. If removing it loses nothing, remove it.
- **Why:** Decoration dilutes the signal colors that encode severity and status.
- **Applies:** Everywhere; strictest in AppShell.
- **Avoid:** Colored icon tiles beside every heading, pulsing dots, gradient washes, `Sparkles` icons for "important".
- **Implementation:** Color in AppShell is limited to: primary (brand and actions), semantic status (`success`, `warning`, `danger`, `info`), gap severity, and chart series. Neutral everything else.

### P3. Consistency over local optimisation

- **Means:** The same concept looks and behaves the same everywhere. A gap severity badge is identical on the dashboard, in tables and in dossiers.
- **Why:** Repeat users learn the vocabulary once.
- **Applies:** Components, labels, severity colors, number formats, date formats.
- **Avoid:** A second severity color map inside a feature file (current `GapHeatmap.tsx` and `PriorityInterventionsTable.tsx` each define their own).
- **Implementation:** One `SeverityBadge`, one `formatNumber`, one `formatDate`. A feature MUST NOT define its own `getSeverityClass`.

### P4. Deliberate information density

- **Means:** Density is set per surface, not per whim: AppShell is dense, CandidateShell is comfortable, landing is airy.
- **Why:** Officers compare many rows; trainees read one course at a time on a phone.
- **Applies:** Tables, dashboards, cards.
- **Avoid:** Consumer-style 24px card padding in a 36-row district table. Cramped 12px text on a trainee's phone.
- **Implementation:** The `VISUAL_DENSITY` dial (§4.1) maps to row heights (§16.3) and padding (§10.2).

### P5. Progressive disclosure

- **Means:** Show the summary; reveal detail on demand, in place, without losing context.
- **Why:** The evidence behind a gap score is large. Most users need the score and trend; reviewers need everything.
- **Applies:** Dossiers, factor breakdowns, gap inputs, validation errors, long descriptions.
- **Avoid:** Hiding **critical** information (eligibility gates, errors, scope limits, data incompleteness) behind a disclosure. Nested disclosures more than two levels deep.
- **Implementation:** Summary row → expandable row or side drawer → full detail page. "Show calculation" disclosure beside every gap score.

### P6. Contextual actions

- **Means:** Actions sit next to the object they act on and name that object.
- **Why:** "Review" on a row is clearer than a global "Actions" menu.
- **Applies:** Tables, cards, detail headers, alerts.
- **Avoid:** Generic "Manage", "More", "Proceed" buttons. Actions only in a far-off toolbar.
- **Implementation:** Row action: `Review recommendation`. Alert action: `Open Pune plan`. See §24.

### P7. Cognitive load budget

- **Means:** A view asks the user to hold at most about seven things in mind at once.
- **Why:** Long sessions and bilingual reading raise fatigue.
- **Applies:** Dashboards (≤ 4 KPIs), forms (≤ 7 fields per group), charts (≤ 6 series), filters (≤ 5 visible).
- **Avoid:** A 30-field single-page form. A chart with 12 colored lines.
- **Implementation:** Limits are enforced by the rules in §14 to §17.

### P8. Accessibility is a design input

- **Means:** Contrast, focus, semantics and non-color cues are decided when a component is designed, not audited at the end.
- **Why:** It is a statutory requirement, and retrofitting it costs more.
- **Applies:** Every component and state.
- **Avoid:** Color-only severity, placeholder-as-label, icon-only buttons without names, tokens that fail contrast.
- **Implementation:** §21. Token corrections `C-02` to `C-08` exist because baseline values failed WCAG.

### P9. Trust through provenance

- **Means:** Every number shows where it came from, when, and how complete it is.
- **Why:** Committees ask. Unexplained numbers erode trust in the whole platform.
- **Applies:** KPIs, charts, gap scores, recommendations, course outcomes.
- **Avoid:** Bare numbers. Fake-precise decimals. Hard-coded deltas like `+18% YoY hiring` with no source (present in `DashboardView.tsx`).
- **Implementation:** `DataFreshness` line on every analytical page; source and period in every chart subtitle; `n` (sample size) next to every rate.

### P10. Explainability over authority

- **Means:** The system shows *why* it recommends something, and the user decides.
- **Why:** The backend spec makes explainability a hard requirement (BE §J.3, §K.2). The UI must not undo that with a bare score.
- **Applies:** Pathway quiz results, curriculum recommendations, gap scores, forecasts.
- **Avoid:** "AI Score: 91%". "Recommended for you" without reasons.
- **Implementation:** §19.

### P11. Responsive by task, not by scaling

- **Means:** Each breakpoint gets the layout that best serves the task possible on that device.
- **Why:** A trainee on a 360px phone picks a course; a district officer on a phone checks an alert. Neither needs a shrunken desktop.
- **Applies:** Every page.
- **Avoid:** Squeezing a 9-column table into 360px. Hiding the primary action on mobile.
- **Implementation:** §11 per-component behavior table.

### P12. Interaction quality

- **Means:** Every interactive element has all its states (default, hover, focus-visible, active, disabled, loading, error), responds within 100ms, and gives feedback.
- **Why:** Missing states are the most common defect in generated UI.
- **Applies:** Buttons, inputs, rows, tabs, map regions, chart points.
- **Avoid:** A button that does nothing visible for 2 seconds. Hover-only affordances.
- **Implementation:** §25 state matrix per component.

### P13. Honesty in data display

- **Means:** Show real data, labelled mocks, or nothing. Never decorative numbers.
- **Why:** The roadmap (Q7) forbids showing roadmap items as live. Jury and officers alike judge credibility.
- **Applies:** Landing stats, KPIs, demo fixtures.
- **Avoid:** Invented "Target 62%+" presented as achieved, forecasts shown as facts, placeholder routes that look finished.
- **Implementation:** Mock data in dev MUST be visually tagged (`Badge variant="outline"`: "Sample data") until wired to the API. Forecasts are labelled "Forecast" (§15.5).

---

## 4. Taste Skills Integration

### 4.1 Dials per surface

Taste's three dials (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`) are set per shell. Its own preset for "public-sector service" is `3 / 2 / 5`; MahaSkills starts there.

| Surface | VARIANCE | MOTION | DENSITY | Reason |
|:---|:---:|:---:|:---:|:---|
| `AppShell` (officers, reviewers, employers, admin) | 2 | 2 | 7 | Predictable grid, state-change motion only, dense data |
| `CandidateShell` + public course finder and quiz | 3 | 2 | 4 | Comfortable reading on phones, calm |
| `PublicShell` landing page | 4 | 3 | 4 | Some compositional freedom; still trust-first |

**Rule TST-01.** These dial values are fixed. An agent MUST NOT raise them for a feature without a `UX-Q` decision.

What the dials mean in practice (from Taste §7, translated):

- `VARIANCE 2-3`: symmetric 12-column grid, equal gutters, left-aligned content. No overlaps, no masonry, no asymmetric hero.
- `MOTION 2`: no automatic animation. Hover, press, focus, and state transitions only (§22).
- `DENSITY 7`: tight padding, 1px dividers instead of card boxes inside data regions, tabular numerals for all numbers. (Taste says `font-mono` for numbers at density 8+; MahaSkills uses Inter `tabular-nums` instead because no mono font is loaded and mono digits read as "code". See TYP-06.)

### 4.2 Taste rules adopted (translated to MahaSkills)

| Taste rule | MahaSkills rule |
|:---|:---|
| §0.D Anti-default discipline (no AI purple, no three equal cards, no glass, no infinite micro-animations) | §30 anti-pattern library; `TST-02` below |
| §0.A.6 "Quiet constraints (public-sector, accessibility) override aesthetic preference" | Precedence §1.2 |
| §2 One design system per project; do not recreate an official system's CSS | shadcn/ui + Radix is the only system. MUST NOT add Carbon, Fluent, MUI or Ant components. |
| §3.C One icon family, standardised stroke | lucide-react only (already a dependency; Taste permits it when the project depends on it), stroke 2 (§26.1) |
| §3.E Breakpoints, `min-h-[100dvh]`, grid over flex math | §11 |
| §3.F Verify dependencies before importing | `AI-05` |
| §4.1 Inter is acceptable for public-sector, accessibility-first work | Inter + Noto Sans Devanagari kept (§8) |
| §4.2 One accent color, locked; no warm/cool gray mixing | Saffron accent used only for the rules in §9.3; slate neutrals only |
| §4.4 Cards only when elevation carries hierarchy; one documented radius system | §10.4, `RAD-*` rules |
| §4.5 Full state cycles; button and form contrast checks; no duplicate CTA intent | §20, §21, `CNT-06` |
| §4.6 Label above input, error below, no placeholder-as-label | §17 |
| §4.7 Nav on one line at desktop, height ≤ 80px | Topbar 64px (§10.3); nav labels must fit (§12) |
| §4.9 Fake-precise numbers are flagged; copy self-audit | P13, `CNT-09` |
| §5 Motion must be motivated | §22 |
| §6.A Animate only `transform` and `opacity` | `MOT-03` |
| §6.B Reduced motion is mandatory | `MOT-05` |
| §6.D LCP < 2.5s, INP < 200ms, CLS < 0.1 | QA gate §32 (the PRD's dashboard render target is < 2.0s) |
| §6.F Documented z-index scale | §7.6 |
| §8.B No pure `#000` or `#fff` text surfaces | Foreground is slate-950 `#020817`; card white is allowed as a surface only |
| §9 AI tells (neon glows, gradient text, oversized H1, generic names, filler verbs) | §30 |
| §9.G Em-dash ban | `CNT-08`: no em-dash or en-dash in UI strings |
| §11 Redesign protocol: audit before touching, never silently change URLs, nav labels, form field names | `AI-09` |
| §14 Pre-flight checklist | Adapted into §32 |

### 4.3 Taste rules rejected, and why

| Taste rule | Decision | Reason |
|:---|:---|:---|
| Default dials `8 / 6 / 4` | Rejected | Built for marketing pages. Public-sector preset applies. |
| Motion library (`motion/react`), GSAP sticky stacks, horizontal scroll hijack, marquees | Rejected | Not dependencies; scroll hijacking harms accessibility and task speed. `tailwindcss-animate` is enough. |
| Image generation first, "every page needs real photography" | Rejected for AppShell; limited on landing (§26) | Officers need data, not mood images. |
| Serif and display-font rotation | Rejected | Inter + Noto Sans Devanagari are canonical and cover the three scripts. |
| Bento grids, split-screen heroes, zigzag sections | Landing page only, within variance 4 | Not applicable to work screens. |
| Dark mode mandatory from the start | Adopted (UX-Q2) | Light and dark are both release gates; dark tokens in §7.2a; system default plus manual toggle (§9.4). |
| "Scoring bars with filled tracks are banned" | Not applied in AppShell | That ban targets landing-page decoration. Progress toward a statutory target (placement rate vs 62%) is real information (§15.8). |
| Tactile press `scale-[0.98]` | Rejected | Motion dial 2; use color change on `:active`. |

### 4.4 DO / DON'T

| DO | DON'T |
|:---|:---|
| Page header: plain background, `text-2xl font-semibold` title, one-line scope and period below it | Gradient banner (`bg-gradient-to-r from-primary/10`) with a pulsing dot and `font-extrabold` title |
| KPI label in `text-sm text-muted-foreground`, value `text-3xl font-semibold tabular-nums`, delta with arrow and words | KPI with a decorative colored icon and a hard-coded "+18% YoY" string |
| Severity shown as a badge with text and glyph | Severity shown only by tile background color |
| One primary button per region | Two filled buttons side by side with the same visual weight |
| `Review Electrician recommendation` | `Review` alone repeated in 10 rows with no accessible name difference |

---

## 5. Impeccable UI Principles

### 5.1 The discipline adopted

The Impeccable preset's authoring rules are adopted as process rules. Its brand values are not.

| Impeccable rule | MahaSkills rule |
|:---|:---|
| "Prefer semantic tokens over raw values" | `TOK-01`: features MUST NOT use raw Tailwind palette classes (`bg-rose-50`, `text-emerald-700`, `bg-amber-500`) or hex values. Use semantic tokens (§7). |
| "Define tokens and foundations before component rules" | §7 precedes §25. New components MUST use existing tokens; a new token requires a doc update in the same PR. |
| "Required states: default, hover, focus-visible, active, disabled, loading, error" | §25.1 state matrix. |
| "Describe keyboard, pointer and touch behavior" | Every component entry in §25 lists all three. |
| "Include responsive behavior and edge cases (long labels, empty states, overflow)" | §11.4, and the Marathi long-string test in §28.5. |
| "No rule may depend on ambiguous adjectives; anchor to a token, threshold or example" | Rule-writing standard for this document and for handoff specs. |
| "Every accessibility statement must be testable" | §21 lists the test for each rule. |
| "Flag conflicts between aesthetics and accessibility, then prioritise accessibility" | Precedence §1.2; corrections §7.8. |
| "Pair every do-rule with a don't-example" | DO/DON'T tables throughout. |
| "If introducing a new pattern, include migration guidance" | Appendix A lists migrations for current code. |
| "End with a QA checklist executable in review" | §32. |

### 5.2 The preset values, rejected

| Impeccable value | Decision |
|:---|:---|
| Primary `#CC8800`, secondary `#C55221`, cream and burnt-orange section rhythm | Rejected. Conflicts with the canonical navy identity; alternating colored sections are a marketing device. |
| Chakra Petch display and body font | Rejected. It has no Devanagari glyphs, so Marathi and Hindi would fall back to a different font mid-sentence. |
| Weights 100 to 900 | Rejected. Only 400, 500, 600, 700 are loaded (TYP-03). |
| Spacing 4/8/12/16/24/32 | Compatible with the canonical 4px scale; the canonical scale is kept. |

### 5.3 Preventing generated-UI defects

These are mechanical checks. An agent MUST run them on changed files before declaring a UI task done, and paste the counts in the PR (AI-17).

| ID | Defect | Allowed count |
|:---|:---|:---|
| `IMP-01` | Gradient backgrounds | 0 outside `features/landing` |
| `IMP-02` | Sub-scale text sizes | 0 |
| `IMP-03` | Unloaded font weights | 0 |
| `IMP-04` | Decorative pulse, spin, bounce, ping | `animate-pulse` only inside `Skeleton`; `animate-spin` only inside `Spinner` |
| `IMP-05` | Raw palette colors in features | 0 (use tokens) |
| `IMP-06` | Off-system radius | 0 (see `RAD-01`) |
| `IMP-07` | Glass and blur effects | 1 (sticky header only) |
| `IMP-08` | Language-branched strings | 0 (also run the ESLint i18n check when configured) |
| `IMP-09` | Hand-rolled SVG icon paths | 0 (map geometry loaded from data is exempt) |
| `IMP-10` | Z-index values | only the values in §7.6 |
| `IMP-11` | Emoji in UI | 0 (visual review) |
| `IMP-12` | Em-dash or en-dash in locale files | 0 |

```bash
# Run from the repo root. Each command prints matches with line numbers; compare with the allowed counts above.
rg -n "bg-gradient-to" frontend/src --glob '!**/landing/**'                        # IMP-01
rg -n "text-\[(9|10|11)px\]" frontend/src                                         # IMP-02
rg -n "font-(extrabold|black|thin|extralight|light)\b" frontend/src               # IMP-03
rg -n "animate-(pulse|spin|bounce|ping)" frontend/src                             # IMP-04
rg -n "(bg|text|border|ring|fill|stroke)-(rose|emerald|amber|indigo|red|green|yellow|orange|blue|purple|violet|sky|teal|pink)-[0-9]" frontend/src/features   # IMP-05
rg -n "rounded-(xl|2xl|3xl)" frontend/src                                         # IMP-06
rg -n "backdrop-blur" frontend/src                                                # IMP-07
rg -n "isMarathi|isHindi|i18n\.language ===" frontend/src                         # IMP-08
rg -n "<path d=" frontend/src/features                                            # IMP-09
rg -n "\bz-(\[[^\]]+\]|[0-9]+)" frontend/src                                      # IMP-10
rg -n "[\x{2013}\x{2014}]" frontend/public/locales                                # IMP-12
```

The list of visual anti-patterns (card-grid overload, nested modals, unexplained scores and more) is in §30.

---

## 6. awesome-design.md Integration

`awesome-design.md` does not exist as a file. The installed `bergside/awesome-design-skills` collection (67 presets) is the equivalent source. The presets reviewed in full were: `enterprise`, `ant`, `corporate`, `clean`, `shadcn`, `material`, `minimal`, `refined`, `professional`, `impeccable`. The others (`neon`, `glassmorphism`, `brutalism`, `claymorphism`, `retro`, `pacman` and similar) were checked by name and description only; they are consumer or novelty styles.

### 6.1 Classification

| Practice from the collection | Classification | MahaSkills adaptation |
|:---|:---|:---|
| Shared authoring template: foundations → components → a11y → content → anti-patterns → QA checklist | **Project-wide standard** | The structure of this document and of every handoff spec's UI section |
| Required state list (default, hover, focus-visible, active, disabled, loading, error) | **Project-wide standard** | §25.1 |
| WCAG 2.2 AA, keyboard-first, visible focus | **Project-wide standard** | Canonical target is WCAG 2.1 AA (statutory). Where 2.2 adds testable criteria (2.4.11 focus not obscured, 2.5.8 target size), apply them as well (§21). |
| `enterprise`: "44px+ touch targets", "semantic HTML before ARIA", "avoid mixing visual metaphors", "document accessibility rationale" | **Project-wide standard** | `A11Y-12`, `A11Y-02`, P3 |
| `enterprise` and `ant`: data density, modular grid, strong data hierarchy | **Project-wide standard** for AppShell | §10, §14 |
| 12/14/16/20/24/32 type scale | **Compatible** | The canonical scale (12/14/16/18/20/24/30) is kept; it is a superset in practice |
| 4px / 8pt spacing | **Project-wide standard** | Canonical 4px base (§10.1) |
| `enterprise`: dark theme, glass-like panels, subtle gradients | **Inappropriate** | Conflicts with P2 and with GIGW's light, high-contrast norm |
| `material`: purple primary, dynamic theming, built-in motion | **Inappropriate** | Brand conflict; motion dial 2 |
| `corporate`, `clean`: Poppins display with Open Sans or Roboto body | **Inappropriate** | Fonts are canonical; no Devanagari |
| `ant`: Plus Jakarta Sans | **Inappropriate** | Same reason |
| `shadcn`: monochrome black primary, Geist | **Context only** | shadcn is the component foundation, but its default monochrome look MUST NOT ship unstyled (Taste §9.E). MahaSkills tokens replace it. |
| `minimal`, `refined`: large whitespace, serif display | **Context only** | Landing page whitespace only; no serif. |
| `bento`, `storytelling`, `editorial` | **Context only** | Landing page composition only, within variance 4. |
| `glassmorphism`, `neon`, `gradient`, `neumorphism`, `claymorphism`, `brutalism` and similar | **Prohibited** | Any of these in MahaSkills is a P1 defect (§29.2). |

**Rule AWD-01.** An agent MUST NOT load a style preset from `.agents/skills/` and apply its palette, fonts, radii or shadows to MahaSkills. Presets are reference material for structure and discipline only.

---

## 7. Design Tokens

### 7.1 Token architecture

- Tokens are CSS custom properties holding **HSL triplets without `hsl()`** in `frontend/src/index.css`, mapped to Tailwind color names in `frontend/tailwind.config.js` as `hsl(var(--token))`. This is the existing shadcn pattern and it stays.
- **TOK-01.** Feature code MUST use semantic Tailwind names (`bg-primary`, `text-muted-foreground`, `bg-success-subtle`). Raw palette classes and hex values are forbidden in features (check `IMP-05`).
- **TOK-02.** Adding or changing a token requires, in the same PR: the `index.css` value, the `tailwind.config.js` mapping, a row in the tables below, and a contrast check result.
- **TOK-03.** Opacity modifiers on semantic colors (`bg-primary/10`) MAY be used for hover and selected fills only. Text MUST NOT use opacity modifiers (`text-muted-foreground/80` fails contrast unpredictably).

### 7.2 Color tokens (light theme, the reference theme)

"Rendered" is the hex the HSL value actually produces. Contrast is measured against white `#FFFFFF` unless stated.

| Token | HSL value | Rendered | Status | Use |
|:---|:---|:---|:---|:---|
| `--background` | `210 40% 98%` | `#F8FAFC` | Canonical | Page background |
| `--foreground` | `222.2 84% 4.9%` | `#020817` | Canonical | Primary text (19.1:1 on background) |
| `--card` | `0 0% 100%` | `#FFFFFF` | Canonical | Card and table surface |
| `--card-foreground` | `222.2 84% 4.9%` | `#020817` | Canonical | Text on cards |
| `--popover` / `--popover-foreground` | as card | | Canonical | Menus, popovers, tooltips (tooltip uses inverse, §25) |
| `--primary` | `221.2 83.2% 32.5%` | `#0E3998` | Canonical (see note 1) | Brand navy: primary buttons, active nav, links, selected state, focus ring (10.2:1) |
| `--primary-foreground` | `210 40% 98%` | `#F8FAFC` | Canonical | Text on primary (9.7:1) |
| `--secondary` / `--secondary-foreground` | `210 40% 96.1%` / `222.2 47.4% 11.2%` | `#F1F5F9` / `#0F172A` | Canonical | Secondary buttons |
| `--muted` | `210 40% 96.1%` | `#F1F5F9` | Canonical | Table header fill, disabled fill, subtle panels |
| `--muted-foreground` | `215.3 19.3% 34.5%` | `#475569` | **Corrected C-04** (was `#64748B`) | Secondary text, labels, captions (7.6:1 on card, 6.9:1 on muted) |
| `--accent` | `37.7 92.1% 44.1%` | `#D88B09` | Canonical (see note 1) | Maharashtra saffron. Restricted use, §9.3 |
| `--accent-foreground` | `222.2 84% 4.9%` | `#020817` | **Corrected C-02** (was near-white, 2.8:1) | Text on saffron (7.3:1) |
| `--destructive` | `0 72.2% 50.6%` | `#DC2626` | **Corrected C-03** (was `#EF4444`, 3.8:1 with white) | Destructive buttons, danger status (4.8:1 with white) |
| `--destructive-foreground` | `210 40% 98%` | `#F8FAFC` | Canonical | Text on destructive |
| `--border` | `214.3 31.8% 91.4%` | `#E2E8F0` | Canonical | Decorative dividers and card outlines only |
| `--input` | `215.4 16.3% 46.9%` | `#64748B` | **Corrected C-05** (was `#E2E8F0`, 1.2:1) | Form control borders (4.8:1, meets WCAG 1.4.11) |
| `--ring` | `221.2 83.2% 32.5%` | `#0E3998` | Canonical | Focus ring |
| `--success` | `162.9 93.5% 24.3%` | `#047857` | **New C-06** (doc value `#16A260` fails, 3.3:1) | Success status, positive delta (5.5:1) |
| `--success-foreground` | `210 40% 98%` | | New | Text on success |
| `--success-subtle` / `--success-subtle-foreground` | `151.8 81% 95.9%` / `163.1 88.1% 19.8%` | `#ECFDF5` / `#065F46` | New | Success badge and alert (7.3:1) |
| `--warning` | `26 90.5% 37.1%` | `#B45309` | **New C-07** (doc value `#F59F0A` fails, 2.1:1) | Warning status (5.0:1) |
| `--warning-foreground` | `210 40% 98%` | | New | Text on warning |
| `--warning-subtle` / `--warning-subtle-foreground` | `48 100% 96.1%` / `22.7 82.5% 31.4%` | `#FFFBEB` / `#92400E` | New | Warning badge and alert (6.8:1) |
| `--danger-subtle` / `--danger-subtle-foreground` | `0 85.7% 97.3%` / `0 73.7% 41.8%` | `#FEF2F2` / `#B91C1C` | New | Error badge, alert, inline error text (5.9:1) |
| `--info` | `224.3 76.3% 48%` | `#1D4ED8` | New | Informational status |
| `--info-subtle` / `--info-subtle-foreground` | `213.8 100% 96.9%` / `225.9 70.7% 40.2%` | `#EFF6FF` / `#1E40AF` | New | Info badge and alert (8.0:1) |

Note 1: `DESIGN_SYSTEM.md` comments call primary `#1E3A8A` and accent `#D97706`, but the HSL strings in both that doc and the code render `#0E3998` and `#D88B09`. The HSL strings are the tokens; the comments are wrong. Both values pass contrast. Fix the comments in a docs PR (Appendix A, item A-01).

### 7.2a Color tokens (dark theme)

Applied under `.dark`. Contrast measured against `--card` (#0F172A) unless stated.

| Token | HSL | Rendered | Notes |
|:---|:---|:---|:---|
| `--background` | `222.2 84% 4.9%` | `#020817` | Page |
| `--foreground` | `210 40% 98%` | `#F8FAFC` | 17.1:1 on card |
| `--card`, `--popover` | `222.2 47.4% 11.2%` | `#0F172A` | One step lighter than background |
| `--card-foreground`, `--popover-foreground`, `--secondary-foreground`, `--destructive-foreground` | `210 40% 98%` | `#F8FAFC` | |
| `--primary`, `--ring` | `213.1 93.9% 67.8%` | `#60A5FA` | 7.0:1 on card; ring 7.9:1 on background |
| `--primary-foreground`, `--accent-foreground` | `222.2 84% 4.9%` | `#020817` | 7.9:1 on primary |
| `--secondary`, `--muted`, `--border` | `217.2 32.6% 17.5%` | `#1E293B` | border is decorative only |
| `--muted-foreground` | `215 20.2% 65.1%` | `#94A3B8` | 7.0:1 on card, 5.7:1 on muted |
| `--accent` | `37.7 92.1% 44.1%` | `#D88B09` | unchanged |
| `--destructive` | `0 72.2% 50.6%` | `#DC2626` | fill only, 4.8:1 with white |
| `--input` | `215.7 16.4% 55.9%` | `#7C8BA1` | 5.2:1 on card (WCAG 1.4.11) |
| `--success` / `--warning` / `--info` | same as light | `#047857` / `#B45309` / `#1D4ED8` | fills with white text |
| `--success-subtle` / `--success-subtle-foreground` | `165.7 91.3% 9%` / `156.2 71.6% 66.9%` | `#022C22` / `#6EE7B7` | 9.9:1 |
| `--warning-subtle` / `--warning-subtle-foreground` | `20.9 91.7% 14.1%` / `45.9 96.7% 64.5%` | `#451A03` / `#FCD34D` | 10.4:1 |
| `--danger-subtle` / `--danger-subtle-foreground` | `0 74.7% 15.5%` / `0 93.5% 81.8%` | `#450A0A` / `#FCA5A5` | 8.5:1 |
| `--info-subtle` / `--info-subtle-foreground` | `226.2 57% 21%` / `211.7 96.4% 78.4%` | `#172554` / `#93C5FD` | 8.2:1 |

Dark chart tokens (all ≥ 6.5:1 on card): `--chart-1` `213.1 93.9% 67.8%`, `--chart-2` `172.5 66% 50.4%`, `--chart-3` `43.3 96.4% 56.3%`, `--chart-4` `255.1 91.7% 76.3%`, `--chart-5` `328.6 85.5% 70.2%`, `--chart-6` `215 20.2% 65.1%`.
This table replaces the existing `.dark` block in `index.css`.

### 7.3 Gap severity tokens

Three levels matching the backend (`gapscoring.gap_score.severity IN ('LOW','MEDIUM','HIGH')`, UX-Q1); display thresholds LOW < 40, MEDIUM 40-59, HIGH ≥ 60; 60 is the PRD §7.4 recommendation trigger; the backend spec sets no numeric thresholds, so these must be aligned with the backend when it defines them (raise `OQ:` if they differ).

| Token | Light HSL | Light | Text (light) | Dark HSL | Dark | Text (dark) |
|:---|:---|:---|:---|:---|:---|:---|
| `--gap-low` | `149.3 80.4% 90%` | `#D1FAE5` | foreground 17.6:1 | `163.1 88.1% 19.8%` | `#065F46` | `#ECFDF5` 7.3:1 |
| `--gap-medium` | `24.6 95% 53.1%` | `#F97316` | `#020817` 7.1:1 | `32.1 94.6% 43.7%` | `#D97706` | `#020817` 6.3:1 |
| `--gap-high` | `0 73.7% 41.8%` | `#B91C1C` | white 6.5:1 | `0 90.6% 70.8%` | `#F87171` | `#020817` 7.2:1 |

Each level also defines `--gap-<level>-foreground` with the text colour above.

**Correction C-08.** Baseline tokens were mid-lightness (unreadable in grayscale, white text failed); corrected ramp changes lightness monotonically (light luminance 0.88 → 0.33 → 0.11, dark 0.09 → 0.28 → 0.33); current code uses four levels with indigo for MODERATE, migration A-04 moves it to three.

**GAP-01.** Severity MUST always be shown with the text label and a glyph as well as color (ACCESSIBILITY.md §2.3). Glyphs: `LOW` none, `MEDIUM` `TriangleAlert`, `HIGH` `OctagonAlert`.

### 7.4 Chart tokens

| Token | HSL | Rendered | Contrast on card | Default meaning |
|:---|:---|:---|:---|:---|
| `--chart-1` | `224.4 64.3% 32.9%` | `#1E3A8A` | 10.4:1 | Primary series (demand, the selected entity) |
| `--chart-2` | `175.3 77.4% 26.1%` | `#0F766E` | 5.5:1 | Comparison series (supply, capacity) |
| `--chart-3` | `32.1 94.6% 43.7%` | `#D97706` | 3.2:1 | Third series |
| `--chart-4` | `262.1 83.3% 57.8%` | `#7C3AED` | 5.7:1 | Fourth series |
| `--chart-5` | `335.1 77.6% 42%` | `#BE185D` | 6.0:1 | Fifth series |
| `--chart-6` | `215.4 16.3% 46.9%` | `#64748B` | 4.8:1 | "Other", baseline, state average, benchmark |

All six meet the 3:1 non-text contrast minimum. **CHT-01**: series colors are assigned in this order and never reassigned per chart; "state average" and "district median" are always `--chart-6` with a dashed stroke. Gap severity uses §7.3, never chart tokens.

### 7.5 Radius, shadow and motion tokens

| Token | Value | Use |
|:---|:---|:---|
| `--radius` | `0.5rem` (8px) | Canonical base |
| `rounded-lg` | 8px | Cards, panels, dialogs, drawers' inner containers, table wrappers |
| `rounded-md` | 6px | Buttons, inputs, selects, tabs, menu items, map tiles |
| `rounded-sm` | 4px | Badges, chips, tags, tooltip |
| `rounded-full` | 9999px | Avatars, progress bar ends, radio indicators, toggle switches. Nothing else. |

**RAD-01.** `rounded-xl`, `rounded-2xl` and `rounded-3xl` MUST NOT be used. **RAD-02.** A child MUST NOT have a larger radius than its container.

| Shadow | Tailwind | Use |
|:---|:---|:---|
| None | `shadow-none` | Anything inside a card; table rows; nested panels |
| Subtle | `shadow-sm` | Top-level cards (canonical "Standard") |
| Elevated | `shadow-md` | Popovers, dropdown menus, sticky table header when scrolled, hover on **clickable** cards only |
| Modal | `shadow-xl` | Dialogs and drawers |

**SHD-01.** A static, non-clickable card MUST NOT gain a shadow on hover.

| Motion token | Value | Use |
|:---|:---|:---|
| `duration-fast` | 100ms | Hover and press color changes |
| `duration-base` | 150ms | Tooltips, menus, accordion, tab indicator |
| `duration-slow` | 200ms | Dialogs, drawers, toasts |
| `ease-out-standard` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entering elements |
| `ease-in-standard` | `cubic-bezier(0.4, 0, 1, 1)` | Exiting elements (exit at `duration-base`) |

### 7.6 Z-index scale

| Layer | Class | Elements |
|:---|:---|:---|
| Base | `z-0` | Content |
| Sticky in-page | `z-10` | Sticky table header, sticky first column, sticky review form |
| Sticky app chrome | `z-30` | Candidate bottom nav, bulk action bar |
| Header | `z-40` | App header (existing) |
| Overlay | `z-50` | Dialog, drawer, popover, dropdown, tooltip (Radix portals) |
| Toast | `z-[60]` | Toast viewport |

### 7.7 Where tokens are defined in code

Implementing this section is its own handoff (Appendix A, A-02). Until then, agents building new UI MUST NOT invent substitutes: if a needed token (for example `bg-success-subtle`) does not exist yet, the PR that first needs it adds it per TOK-02.

### 7.8 Correction register

| ID | Change | Reason | Breaks visually |
|:---|:---|:---|:---|
| C-01 | Reserved | | |
| C-02 | `--accent-foreground` to dark | White on saffron is 2.8:1 (fails AA) | Accent-filled elements get dark text |
| C-03 | `--destructive` to `#DC2626` | `#EF4444` with white is 3.8:1; the design doc itself names "Crimson Red #DC2626" | Slightly darker red |
| C-04 | `--muted-foreground` to `#475569` | `#64748B` on `--muted` is 4.3:1 (fails AA at 14px); table headers sit on muted | Secondary text slightly darker |
| C-05 | `--input` to `#64748B` | Input borders at 1.2:1 fail WCAG 1.4.11 (3:1) | Form controls get visible borders |
| C-06 | `--success` to `#047857` | Doc value fails with white text and as text | |
| C-07 | `--warning` to `#B45309` | Doc value is 2.1:1 | |
| C-08 | Gap ramp reduced to three levels and reordered by lightness | Severity unreadable without hue; white text fails; backend has three levels | Four levels become three; indigo removed |
| C-09 | Button `outline` and `ghost` hover to `bg-muted text-foreground` | shadcn default maps hover to `accent`, which here is saffron with white text | Hover becomes gray, not saffron |

---

## 8. Typography

### 8.1 Families

| Role | Stack | Notes |
|:---|:---|:---|
| All UI text | `Inter, "Noto Sans Devanagari", sans-serif` (existing `font-sans`) | Inter renders Latin; Devanagari falls through to Noto per glyph |
| Devanagari-only blocks | `font-devanagari` | Only where a block is known to be Marathi or Hindi |
| Codes (QP codes, course codes, IDs, trace IDs) | `ui-monospace, SFMono-Regular, Consolas, monospace` via `font-mono` | Never for metrics |

- **TYP-01.** No other font families. No serif anywhere.
- **TYP-02.** Fonts are self-hosted with `@fontsource/inter` and `@fontsource/noto-sans-devanagari`, importing only weights 400, 500, 600, 700 (latin, latin-ext, devanagari subsets) in `main.tsx`, `font-display: swap`. The Google Fonts `<link>` tags are removed. **TYP-03.** `font-extrabold`, `font-black`, `font-thin`, `font-light`, `font-extralight` MUST NOT be used; the browser synthesises them and Devanagari rendering degrades.

### 8.2 Scale

Canonical sizes from `DESIGN_SYSTEM.md` §2, with assigned roles:

| Role | Class | Size / line height | Weight | Use |
|:---|:---|:---|:---|:---|
| Display | `text-3xl` | 30 / 36 | 700 | Landing hero title only; primary KPI value |
| Page title (H1) | `text-2xl` | 24 / 32 | 600 | One per page |
| Section title (H2) | `text-lg` | 18 / 28 | 600 | Card titles, section headings, dialog titles |
| Subsection (H3) | `text-base` | 16 / 24 | 600 | Groups inside a card, form group legends |
| Body | `text-base` | 16 / 24 | 400 | Prose, candidate-facing text, form input values |
| Dense body | `text-sm` | 14 / 20 | 400 / 500 | Table cells, AppShell descriptions, labels |
| Label | `text-sm` | 14 / 20 | 500 | Form labels, filter labels, KPI labels |
| Caption / metadata | `text-xs` | 12 / 16 | 400 / 500 | Timestamps, sources, units, badge text |
| Secondary KPI value | `text-2xl` | 24 / 32 | 600 | KPIs after the first |

- **TYP-04.** Minimum text size is 12px (`text-xs`). Arbitrary sizes (`text-[10px]`, `text-[11px]`) are forbidden (check `IMP-02`).
- **TYP-05.** Heading levels follow document order: one `h1` per page, `h2` for sections, no skipped levels. `CardTitle` MUST render the level that fits the outline (it currently hard-codes `h3` and `text-2xl`; migration A-05).
- **TYP-06.** All numbers in tables, KPIs, charts and comparisons use `tabular-nums`. `font-mono` MUST NOT be used for metrics.
- **TYP-07.** Prose width is capped at `max-w-prose` (65ch) in English. Dashboards and tables are not capped.
- **TYP-08.** Letter spacing: default. `tracking-tight` MAY be used on `text-2xl` and larger in Latin only. Wide uppercase tracking (eyebrow labels) is not used (Taste §4.7 eyebrow restraint; also, Devanagari has no case).
- **TYP-09.** `uppercase` MUST NOT be applied to translatable strings. Enum values like `HIGH` are never displayed raw; they are translated labels (`t('gap.severity.high')`).

### 8.3 Devanagari rules

- **TYP-10.** When `html[lang="mr"]` or `html[lang="hi"]`, body line height is 1.65 (existing rule in `index.css`). Headings MUST also get at least `leading-snug` (1.375); `leading-none` and `leading-tight` are forbidden on any translatable text because they clip matras.
- **TYP-11.** In `mr` and `hi`, `text-xs` MAY be used only for non-essential metadata (timestamps, sources). Badges, labels and table content use `text-sm` minimum in those locales.
- **TYP-12.** Components MUST NOT set a fixed height on a text container. Use `min-h-*`. Labels MUST wrap rather than truncate unless a tooltip exposes the full text.
- **TYP-13.** Mixed-script strings wrap the embedded English term in `<span lang="en">` (ACCESSIBILITY.md §2.4).

### 8.4 Numbers, dates and units

- **NUM-01.** One formatter module (`lib/format.ts`) owns all formatting. Components MUST NOT call `toLocaleString` directly.
- **NUM-02.** Numbers use Indian grouping (`1,23,456`) via `Intl.NumberFormat('<lang>-IN')` with Latin digits (`numberingSystem: 'latn'`) in all locales (UX-Q4, decided). Devanagari digits are not used anywhere.
- **NUM-03.** Large counts use lakh and crore in words in prose and KPIs ("2.4 lakh"), and full digits in tables.
- **NUM-04.** Currency: `₹18,500 / month`. Never `₹18.5k/mo`; "k" is not an Indian convention.
- **NUM-05.** Percentages: whole numbers for rates shown to candidates (`68%`); one decimal in analytical tables (`68.4%`). Never more than one decimal.
- **NUM-06.** Gap scores: whole numbers (`74`), 0 to 100. The current `toFixed(1)` in tables is migration A-06.
- **NUM-07.** Dates: `17 Sep 2026` style via `Intl.DateTimeFormat('<lang>-IN', { day: 'numeric', month: 'short', year: 'numeric' })`. Relative time ("3 days ago") MAY be used with the absolute date in a `title` and tooltip.
- **NUM-08.** Every number has a unit in its label or suffix. A delta always shows its sign (`+4`, `−2`) and comparison period ("vs Aug 2026").

---

## 9. Color System

### 9.1 Roles

| Role | Tokens | Allowed for | Not allowed for |
|:---|:---|:---|:---|
| Brand / interactive | `primary` | Primary buttons, links, active nav, selected rows and tiles (as `primary/10` fill + primary border), focus ring, chart series 1 | Status meaning, large background washes |
| Neutral | `background`, `card`, `muted`, `border`, `foreground`, `muted-foreground` | 90%+ of every AppShell screen | |
| Status | `success`, `warning`, `destructive`, `info` and their `-subtle` pairs | Status badges, alerts, validation, deltas | Decoration, icons without meaning, section headers |
| Severity | `gap-*` | Gap scores, heatmap, severity badges | Anything that is not a gap score |
| Data series | `chart-1..6` | Chart marks and their legends | UI chrome |
| Saffron accent | `accent` | See §9.3 | Hover states, buttons, status |

### 9.2 Rules

- **COL-01.** Color MUST NOT be the only carrier of meaning. Pair with text, glyph, pattern or position.
- **COL-02.** Delta color follows **desirability, not direction**. A rising gap score is bad (`destructive`); a rising placement rate is good (`success`). The component takes a `goodDirection: 'up' | 'down'` prop.
- **COL-03.** A value is colored by status only when it crosses a documented threshold. Placement rate is not green by default (currently always green in `PriorityInterventionsTable.tsx`; migration A-07). Thresholds: below 25% `destructive` (oversupply rule, PRD §7.3), 25% to below 62% neutral, 62% and above `success` (KPI-01 target).
- **COL-04.** Status fills in badges and alerts use `-subtle` backgrounds with `-subtle-foreground` text. Solid status fills are only for buttons and the critical heatmap tile.
- **COL-05.** Text on any fill MUST meet 4.5:1 (3:1 for 18px+ or 14px+ bold). UI component boundaries and chart marks MUST meet 3:1 against adjacent colors.
- **COL-06.** Neutrals are slate only. Do not introduce gray, zinc, neutral or stone.

### 9.3 Saffron accent: restricted use

Saffron is the state identity color. It is used sparingly so it stays meaningful:

- The 3px top rule of the app header (all shells, UX-Q5).
- The "Sample data" and "Development" tags (the dev role switcher already uses this family).
- Landing page highlights, at most one per viewport.

**COL-07.** Saffron MUST NOT be used for hover, buttons, links, status, or chart series (the amber chart token is a different hue and role).

### 9.4 Dark mode

Dark mode is in scope for v1 (UX-Q2). Both themes are release gates.

- **COL-08.** Theme follows `prefers-color-scheme`; header theme control (System / Light / Dark) overrides it; stored in `localStorage` key `mahaskills.theme`; applied as `dark` class on `<html>` before first paint by an inline script in `index.html`.
- **COL-09.** Components use semantic tokens only; `dark:` variants with raw palette colours forbidden.
- **COL-10.** In dark mode elevation = lighter surface (background < card < popover), not shadows.
- **COL-11.** Charts, heatmap, logo and the 3D hero each have a verified dark rendering; chart tokens switch per §7.2a.
- **COL-12.** Status text on dark surfaces uses `-subtle-foreground` tokens, never the solid status colour.
- **COL-13.** Every QA screenshot set includes dark mode at viewports L and M.

---

## 10. Spacing & Layout

### 10.1 Spacing scale

Base unit 4px. Allowed steps (canonical): `1` 4px, `2` 8px, `3` 12px, `4` 16px, `6` 24px, `8` 32px, `12` 48px, `16` 64px. Step `5` (20px) MAY be used for card padding in CandidateShell only.

- **SPC-01.** Arbitrary spacing values (`p-[18px]`, `mt-[7px]`) MUST NOT be used.
- **SPC-02.** Use `gap-*` on flex and grid parents instead of margins on children.

### 10.2 Component and section spacing

| Context | AppShell (density 7) | CandidateShell / Public (density 4) |
|:---|:---|:---|
| Page padding | `px-4 py-4` below `md`, `px-6 py-6` at `md`+ | `px-4 py-6` |
| Between page sections | `space-y-6` (24px) | `space-y-8` (32px) |
| Card padding | `p-4` (16px) | `p-5` (20px) |
| Card header to body | `gap-3` | `gap-4` |
| Grid gutters | `gap-4` (16px); `gap-6` between major columns at `lg`+ | `gap-4` |
| Form field to field | `gap-4` | `gap-5` |
| Label to control | `gap-1.5` (6px) | `gap-2` |
| Inline icon to text | `gap-1.5` for 16px icons, `gap-2` for 20px | same |
| Landing sections | n/a | `py-12` below `md`, `py-16` at `md`+ |

### 10.3 Fixed dimensions

| Element | Value | Source |
|:---|:---|:---|
| Header height | 64px (`h-16`) | Existing code; Taste nav cap 80px |
| Sidebar width, expanded | 256px (`w-64`) | Existing code (UI_UX spec says 260px; A-08 aligns the doc) |
| Sidebar width, collapsed | 64px (`w-16`) | New; icon rail with tooltips |
| Candidate bottom nav | 56px + `env(safe-area-inset-bottom)` | New |
| Table row | 40px default (§16.3) | New |
| Control height | 40px (`h-10`) default, 36px (`h-9`) small | Existing button sizes |
| Minimum touch target | 44×44px on touch layouts (`< lg`) | `enterprise` preset, WCAG 2.5.5 |

### 10.4 Containers and grouping

- **LAY-01.** Group content with space and 1px dividers first, cards second. A card is used only for a self-contained unit that could be moved or collapsed (a chart, a KPI group, a panel).
- **LAY-02.** Cards MUST NOT be nested inside cards. Inside a card, use a `border-t` divided section or a `bg-muted` inset panel.
- **LAY-03.** A card has at most one title row. Title rows carry: title, optional one-line description, optional right-aligned actions (max one button + one overflow menu).

### 10.5 Page layouts

| Layout | Max content width | Structure |
|:---|:---|:---|
| **Dashboard** | Fluid to 1600px (`max-w-[1600px] mx-auto`) | Header → optional alert strip → KPI row → 12-column primary zone (8/4 or 7/5) → full-width ranked list → secondary evidence |
| **List / table page** | Fluid to 1600px | Header with primary action → filter bar → result count and view options → table → pagination |
| **Detail page** | 1280px (`max-w-7xl`) | Entity header → key metrics → tabs → tab content (main 8 cols + aside 4 cols at `xl`) |
| **Form page** | 768px (`max-w-3xl`) | Header → error summary slot → fieldset groups → sticky action footer |
| **Split review (workbench)** | Fluid | Evidence pane (7 cols) + sticky decision pane (5 cols) at `xl`; stacked below with the decision form after evidence and a sticky "Record decision" button |
| **Candidate page** | 896px (`max-w-4xl`, existing) | Single column |
| **Landing** | 1152px (`max-w-6xl`, existing) | Sections |

`max-w-[1600px]` is the one sanctioned arbitrary width. Define it once as a `maxWidth.content` entry in `tailwind.config.js` (as `max-w-content`) when A-02 lands.

### 10.6 Overlays

| Overlay | Width | Use |
|:---|:---|:---|
| Dialog `sm` | 400px | Confirmation |
| Dialog `md` | 560px | Short form (≤ 5 fields), handoff notice (Mahaswayam) |
| Dialog `lg` | 720px | Validation error detail, comparison |
| Drawer `md` (right) | 480px | Row detail preview, filter panel on tablet |
| Drawer `lg` (right) | 720px | Dossier preview, district detail from heatmap |
| Mobile | Dialogs become full-width bottom sheets below `md`; drawers become full-screen | |

- **OVL-01.** Maximum dialog height is `85dvh`; the body scrolls, header and footer stay fixed.
- **OVL-02.** A dialog MUST NOT open another dialog. Use a step inside the dialog or navigate to a page.

---

## 11. Grid & Responsive System

### 11.1 Breakpoints

Tailwind defaults (already configured): `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. Container max is 1400px at `2xl` (existing config).

| Class name in this doc | Width | Represents | Shell behavior |
|:---|:---|:---|:---|
| **Mobile** | < 768 | Android phones (360 baseline) | AppShell: header + menu button opens full-screen nav drawer. CandidateShell: bottom nav. |
| **Tablet** | 768 to 1279 | Tablets, small laptops | AppShell: off-canvas drawer nav (UI_UX spec §1.1); sidebar hidden |
| **Laptop** | 1280 to 1535 | 1366×768 office laptops | AppShell: persistent sidebar (collapsible to 64px rail) |
| **Desktop** | ≥ 1536 | 1920 monitors | AppShell: persistent sidebar; content capped at 1600px |

Current code shows the sidebar from `md` (768) and has no drawer below that; the AppShell has no mobile navigation at all. Migration A-09.

### 11.2 Grid

- 12-column CSS grid (`grid grid-cols-12 gap-4`) for AppShell page regions at `lg`+. Below `lg`, regions stack in source order.
- **GRD-01.** Source order equals priority order. The most important region comes first in the DOM so stacking keeps priority.
- **GRD-02.** No flexbox percentage math (`w-[calc(33%-1rem)]`); use grid.
- **GRD-03.** Full-height regions use `min-h-[100dvh]`, never `h-screen`.

### 11.3 Responsive behavior per component

| Component | Laptop / Desktop | Tablet | Mobile |
|:---|:---|:---|:---|
| Sidebar nav | Persistent, collapsible | Drawer | Full-screen drawer |
| Page header actions | Inline right | Inline right, secondary into overflow | Primary stays visible below title (full width); secondary into overflow menu |
| Breadcrumb | Full trail | Full trail, truncate middle | Back link to parent only |
| KPI row (4) | 4 columns | 2×2 | 2×2 at ≥ 360; values `text-2xl` |
| Filter bar | Inline, ≤ 5 visible, "More filters" | 2 inline + "Filters" drawer | "Filters (n)" button opens full-screen sheet; applied filters as removable chips |
| Heatmap / map | 7-col with 5-col detail panel | Full width; detail opens in drawer | Tile grid 2 columns grouped by division; tap opens detail page, not drawer |
| Charts | Per card width | Full width | Full width, height 240px, legend above, fewer ticks; "View as table" stays |
| Data table (comparison task) | Full | Horizontal scroll, sticky first column | Horizontal scroll, sticky first column, ≤ 4 default columns |
| Data table (pick-one task) | Table | Table | Transforms to stacked cards (§16.9) |
| Split review workbench | Side by side | Stacked; decision button sticky at bottom | Stacked; same |
| Dialog | Centered | Centered | Bottom sheet |
| Stepper | Horizontal with labels | Horizontal, labels for current step only | "Step 2 of 4: ITI capacity" text + progress bar |
| Toast | Bottom right | Bottom right | Top, full width minus 16px |
| Tabs | Tabs | Tabs, horizontal scroll | Tabs, horizontal scroll; never convert to a select without a label |

### 11.4 Responsive rules

- **RSP-01.** No horizontal page scroll at any required viewport, including 320px width at 400% zoom for PublicShell and CandidateShell (WCAG 1.4.10). Tables scroll inside their own container only.
- **RSP-02.** The primary action of a page MUST be reachable without scrolling horizontally and MUST NOT be hidden at any breakpoint.
- **RSP-03.** Hide secondary information on mobile only if it is still reachable (detail page, disclosure, or column toggle). Never hide status, errors, scope, or data-incompleteness notices.
- **RSP-04.** Every multi-column layout declares its below-`md` behavior in the same component (Taste §4.7).
- **RSP-05.** Test with the longest locale string (usually Marathi) at every required viewport (§28.5).

---

## 12. Navigation

### 12.1 Global structure

| Element | Rule |
|:---|:---|
| **Header** | Left: state emblem slot + "MahaSkills" wordmark + department line (hidden below `sm`). Right: global search (AppShell, `lg`+), language switcher, notifications, user menu. The dev role switcher appears only when `import.meta.env.DEV` (NAV-09). |
| **Skip link** | First focusable element: "Skip to main content" → `#main-content` (ACCESSIBILITY.md §2.1). Currently missing; migration A-10. |
| **Sidebar** | Role-filtered items from IA §2 (§23). Grouped with non-interactive group labels when a role has more than 6 items. Scope indicator at the top (existing, keep). |
| **Page header** | Breadcrumb → H1 → scope + period + freshness line → actions. |
| **Tabs** | Sibling views of the same entity or dataset only. |
| **Footer** | PublicShell only: GIGW-required links (accessibility statement, privacy, terms, contact, sitemap, last updated). |

### 12.2 Rules

- **NAV-01. Active state.** The active sidebar item uses `bg-primary/10 text-primary font-medium` plus a 3px left `primary` bar and `aria-current="page"`. A solid `bg-primary` fill is not used (current code; migration A-11), so the active item does not compete with primary buttons.
- **NAV-02. Match by route prefix, longest match wins.** `/placements/benchmarks` activates "ITI monitoring", not "Placements upload".
- **NAV-03. Breadcrumbs** on every AppShell page deeper than a top-level nav item. Each crumb is a link except the last (`aria-current="page"`). Crumb labels use entity names, not IDs.
- **NAV-04. Drill-down path is preserved in the URL.** Example: `Labour market › Skill demand › PLC programming › Pune › Chakan cluster` is `/analytics/lmi/skills/plc-programming?district=pune&cluster=chakan`. Reloading or sharing restores the same view (FRONTEND_ARCHITECTURE §2, URL state).
- **NAV-05. Filters, sort, page, active tab and open drawer ID live in the URL** (`useSearchParams`). Back and forward MUST restore them.
- **NAV-06. Detail → list return** restores the list's filters, sort, page and scroll position. Use a "Back to <list name>" link that points to the stored list URL, not `history.back()` alone (a deep-linked user has no history).
- **NAV-07. Deep links respect scope.** A district officer opening a URL for another district sees the scope-denied page (`AUTH_SCOPE_RESTRICTED`, §20.4), not an empty page.
- **NAV-08. Tabs** use Radix Tabs; the active tab is in the URL (`?tab=evidence`). Maximum 6 tabs; more means the page is two pages.
- **NAV-09. Dev tooling** (role switcher) renders only in development builds and carries the "Development" tag.
- **NAV-10. Language switcher** is a labelled group ("Language") of three buttons with `aria-pressed`, each label in its own script and `lang` attribute (`<button lang="mr">मराठी</button>`). Switching keeps the current route and state.
- **NAV-11. Nav labels** fit on one line at 256px in all three locales. If a Marathi label does not fit, shorten it in the locale file; do not shrink the font.
- **NAV-12. Global search** covers only the entities in IA §3 and MUST NOT offer candidate search in any form.

---

## 13. Information Hierarchy

### 13.1 The standard stack

Data-heavy pages follow this order. Each level is visually weaker than the one above it.

```
1. Page         where am I?            breadcrumb + H1
2. Context      for what scope/when?   scope badge, period, data freshness
3. Primary      the one number         the lead KPI (largest type on the page)
   metric
4. Main         what it means          templated insight sentence or the lead chart/map
   insight
5. Supporting   why                    breakdown, trend, comparison
   evidence
6. Detail       the rows               ranked table, drill-down
7. Action       what next              contextual actions on rows + one page-level primary action
```

**HIE-01.** A page MUST have exactly one level-3 primary metric or one level-4 lead visual; never several equal ones. **HIE-02.** Actions appear at level 7 per row, and the single page-level primary action sits in the page header, so it is visible first even though it is conceptually last.

### 13.2 Applied to MahaSkills pages

The brief lists candidate profiles and job pages. The PRD does not support them in that form: no role may view an individual candidate (ADR-005), and ingested job postings are demand signals, not listings to apply to. The table maps each brief term to the PRD entity that exists.

| Page (PRD entity) | Context | Primary metric | Main insight | Supporting evidence | Detail | Action |
|:---|:---|:---|:---|:---|:---|:---|
| State dashboard (Policy Maker) | Statewide, current gap run, freshness | Net skill shortage (vacancies minus trained supply) | Heatmap + "5 districts moved to High since last run" | Sector breakdown, trend | Top 10 priority interventions | Review recommendation / Open approvals queue |
| District workbench (District Officer) | Own district, FY, freshness | High-gap trades count | "Pune: PLC programming gap 81, rising 4 weeks" | Trade gap table, ITI capacity | ITI compliance leaderboard | Open plan builder |
| Labour-market analytics (skill demand) | Scope, period, sources | Postings count for the selection | Trend direction and top growing skills | Trend chart, district split, top employers | Skill ranking table | Drill into skill / Export |
| Skill-gap page (skill × district) | Skill, district, run | Gap score with severity | Trigger text and trend | Score calculation inputs | Courses covering this skill | View recommendation |
| Curriculum recommendation (dossier) | Type, status, SSC, age | Estimated placement uplift (with basis) | Trigger rule sentence | 12-month demand, employers, comparable courses | Sources with contribution | Approve / Request changes / Reject |
| Course (training) page | Course code, NSQF, district availability | Verified placement rate with `n` | "Placed within a median of 45 days" | Salary, employers, trend | ITIs offering it | Enrol via Mahaswayam |
| Institute (ITI) page | District, institute code | Placement rate vs district median | Courses above and below benchmark | Course performance chart, asset deficits | Course table | Upload placement return (own institute) |
| Placement outcomes (aggregate) | Scope, batch year, completeness | Placement rate | Change vs last batch | By course, by district | Anonymised batch table | Download report |
| Job role / occupation (NSQF QP) | Sector, SSC, NSQF level | Current demand (postings) | Demand trend and districts | Required skills, related courses | Linked skills | View courses |
| Candidate's own pathway results | Quiz inputs summary | Top recommendation match (with factors) | Reason sentence | Factor breakdown, outcomes | Other 2 recommendations | Enrol via Mahaswayam |

**HIE-03.** Pages MUST NOT be a grid of visually equal cards. Test: squint at the screenshot (§28.6 step "Squint"); if you cannot say which region matters most, the hierarchy fails (P1 defect).

---

## 14. Dashboard Design

### 14.1 The five questions

A dashboard is done only when a user can answer these without leaving it:

| Question | Component that answers it | Rule |
|:---|:---|:---|
| What changed? | KPI deltas vs the previous gap run; "Changes since last run" list (max 5 items) | **DSH-01** Every KPI shows a delta and its comparison period, or an explicit "No comparison available". |
| Why did it change? | Driver breakdown: which districts or sectors contributed most; gap score inputs | **DSH-02** A changed KPI links to its breakdown. |
| Why does it matter? | Thresholds and targets on the visual (62% placement target, gap ≥ 60 high) | **DSH-03** Targets are drawn as reference lines or target markers, labelled. |
| What should I inspect next? | Ranked list sorted by severity × change; drill-down links | **DSH-04** Every map region, bar and row is a link to its detail. |
| What action can I take? | Row-level contextual actions; one page-level primary action | **DSH-05** Every alert and ranked item offers a named action or states "No action required". |

### 14.2 Anatomy (top to bottom)

1. **Page header.** H1 names the scope ("Pune district", "Maharashtra"). Below it: scope badge, period selector, `DataFreshness` ("Gap scores as of 15 Sep 2026, run 2026-37 · Placement returns: 34 of 38 ITIs"). Primary action right.
2. **Alert strip** (conditional). Only actionable, role-relevant alerts: stale data, overdue submissions, SLA breaches, new critical gaps. Max 3 visible, "View all alerts (n)" after. Absent when there are none; no "All good!" filler.
3. **KPI row.** 3 or 4 KPIs. The first is primary (`text-3xl`). KPIs sit in one card divided by vertical dividers, not four separate cards (LAY-01). **DSH-06** No decorative icons in KPIs.
4. **Primary zone.** Lead visual (map or trend, 7 or 8 columns) + context panel (selected item detail, 5 or 4 columns).
5. **Ranked action list.** Full width. Top 10, "View all" to the full list page.
6. **Secondary evidence.** Below the fold. Optional.

### 14.3 KPI (metric) card

```
Net skill shortage                 ← label, text-sm, muted-foreground
+18,420                            ← value, text-3xl/600, tabular-nums
▲ 1,240 vs run 2026-36             ← delta: glyph + signed value + period, colored per COL-02
Vacancies 94,300 · Trained 75,880  ← optional composition, text-xs
```

- **KPI-01.** Label says what is counted, with unit. No abbreviations without a tooltip.
- **KPI-02.** The value is formatted per §8.4 and never truncated.
- **KPI-03.** Clicking the KPI (if it has a breakdown) navigates to it; the whole block is one link with an accessible name ("Net skill shortage, 18,420, view breakdown").
- **KPI-04.** A sparkline MAY be added (last 12 points, no axes, `chart-1`, 32px tall) with its values available in the breakdown.
- **KPI-05.** Loading: skeleton the value and delta only; the label renders immediately.

### 14.4 Filters and time range

- **DSH-07.** Dashboard-level filters: scope (locked for scoped roles, with a lock glyph and tooltip "Limited to your district"), period, sector. Max 3 on a dashboard; more belongs on an analytics page.
- **DSH-08.** Time range options: "Latest run", "Last 4 weeks", "Last 12 months", "Financial year". Custom ranges only on analytics pages.
- **DSH-09.** Changing a filter updates all widgets, announces "Dashboard updated for Nashik" via `aria-live="polite"`, and keeps the previous data visible (dimmed to 60% opacity) until new data arrives. Never blank the page.

### 14.5 Insight summaries and recommendations on dashboards

- **DSH-10.** Insight sentences are generated from templates with data slots (like backend reason codes), never free text from a model. Example: "{count} districts moved to High since {run}". They appear above the lead visual, max 2 sentences.
- **DSH-11.** A recommendation on a dashboard shows its type, target, trigger rule and status, and links to the dossier. It never shows a bare score.

### 14.6 Dashboard don'ts

| DON'T | Instead |
|:---|:---|
| Gradient hero banner with a pulsing status dot | Plain header with freshness line |
| Four identical KPI cards with colored icon tiles | One divided KPI card with a primary KPI |
| "State Intelligence Command Center" | "Maharashtra overview" (plain, translatable) |
| Chart without a stated period and source | Chart subtitle with unit · scope · period · source |
| A dashboard that only displays | Ranked list with named actions |

---

## 15. Data Visualization

Recharts is the charting library (existing dependency). No second chart library.

### 15.1 Choosing the form

| Question the user asks | Use | Don't use |
|:---|:---|:---|
| How has one or a few measures changed over time? | **Line chart** (≤ 6 series) | Area chart with overlapping fills |
| How do categories compare? | **Horizontal bar chart**, sorted descending (labels are long, especially in Marathi) | Pie or donut with more than 3 slices |
| How is a total composed, across a few categories? | **Stacked bar** (≤ 5 segments), with a total label | Stacked area |
| How does one total's volume change over time? | **Area chart** (single series only) | Multi-series area |
| Where is the problem, across districts and sectors? | **Heatmap matrix** (district × sector), sequential gap ramp | Rainbow palette |
| Where is the problem geographically? | **Choropleth map** of 36 districts, always with a ranked table | Map as the only representation |
| Is there a relationship between two measures? | **Scatter plot** (for example demand vs capacity per trade), with quadrant labels | Scatter for fewer than 8 points (use a table) |
| Which items are top or bottom? | **Ranking table** with inline bar | Bar chart with 30 bars |
| What is the single current value? | **KPI** | A one-bar chart |
| How far are we from a target? | **Progress bar with target marker** | Gauge or radial chart |
| How do two courses compare for a candidate? | **Comparison table** (side by side) | Radar chart |

**VIZ-01.** If fewer than 4 data points exist, show a table or a KPI, not a chart. **VIZ-02.** Pie, donut, radar, gauge, 3D charts and dual y-axes MUST NOT be used.

### 15.2 ChartCard anatomy

```
[Title]                                   [View as table] [⋯ Export]
[Subtitle: unit · scope · period · source]
[Optional insight sentence]
[Legend (if > 1 series), top-left, direct labels preferred]
[Plot]
[Footnote: data completeness, forecast note, n]
```

- **VIZ-03. Title** names what is measured, neutrally ("Job postings for PLC programming"). The finding goes in the insight sentence, not the title.
- **VIZ-04. Subtitle** always contains unit, scope, period, and source ("Postings per month · Pune · Sep 2025 to Aug 2026 · NCS, Naukri").
- **VIZ-05. Axes.** Bar charts start at zero. Line charts MAY start above zero when stated in the axis. Axis labels in `text-xs muted-foreground`; max 6 y-ticks, formatted per §8.4. Gridlines horizontal only, `--border`.
- **VIZ-06. Legend.** Direct labels at line ends when ≤ 3 series. Otherwise a legend above the plot, left-aligned, in series order, with the same glyph shape as the mark. Legend items toggle series and are buttons with `aria-pressed`.
- **VIZ-07. Tooltip.** Shows period, series name, value with unit, and comparison if relevant. Appears on hover **and** keyboard focus. Never the only way to read a value.
- **VIZ-08. Height.** 280px default, 360px for lead visuals, 240px on mobile. Charts MUST have a fixed-height container so they do not collapse to 0 (a common Recharts defect with `ResponsiveContainer`).
- **VIZ-09. Animation.** `isAnimationActive={false}`, or `animationDuration={300}` when the motion shows a data change after a filter. Recharts' default 1500ms is forbidden.
- **VIZ-10. Accessible alternative.** Every chart has "View as table" (ACCESSIBILITY.md §2.5) that swaps the plot for a `DataTable` with the same data in place, and an `aria-label` summary on the chart figure ("Line chart: postings rose from 120 to 410 between Sep 2025 and Aug 2026").
- **VIZ-11. Empty state.** Plot area shows the reason and next step (§20.2); axes are not drawn.
- **VIZ-12. Error state.** Plot area shows the error block with retry; title and subtitle still render.
- **VIZ-13. Loading.** Skeleton rectangle of the plot height; title renders immediately.

### 15.3 Series and color

- **VIZ-14.** Maximum 6 series. More → small multiples (shared axes) or a table.
- **VIZ-15.** Use `chart-1..6` in order (CHT-01). The selected or focal entity is always `chart-1`; benchmarks are `chart-6` dashed.
- **VIZ-16.** Line strokes 2px; benchmark 1.5px dashed `4 4`. Points shown only on hover or when ≤ 12 points.
- **VIZ-17.** Where two series are compared, distinguish them by stroke style or marker shape as well as color.

### 15.4 Missing and partial data

- **VIZ-18.** Missing periods are gaps in the line (`connectNulls={false}`), never interpolated.
- **VIZ-19.** A period with incomplete data (for example, the current month, or fewer than all ITIs reported) is drawn with a dashed segment and footnoted "Aug 2026 incomplete: 34 of 38 ITIs reported".

### 15.5 Forecasts (Phase 4)

- **VIZ-20.** Forecast values use a dashed line in the series color, a prediction interval band (series color at 15% opacity), a vertical "Today" reference line, and the label "Forecast" in the legend.
- **VIZ-21.** The footnote names the model and version ("Prophet v1.2, trained to Aug 2026") and the interval ("80% interval").
- **VIZ-22.** Forecasts MUST NOT appear in KPI values as if they were measured.

### 15.6 Geographic visualization

- **GEO-01.** The choropleth uses the 36-district TopoJSON decided in OQ-09, loaded lazily. Until it exists, the division-grouped tile grid (current `GapHeatmap`) is the approved representation, re-styled per §7.3.
- **GEO-02.** Fill uses the gap ramp; district borders `--card` 1px; selected district gets a 2px `--foreground` outline, not a color change.
- **GEO-03.** Every district is keyboard-focusable (tab order: division by division, alphabetical), with an accessible name "Pune, gap score 81, critical".
- **GEO-04.** Hover and focus show the same tooltip: district, score, severity label, vacancies, placement rate.
- **GEO-05.** A legend shows the three bins with their thresholds and glyphs.
- **GEO-06.** The map is always paired with a ranked table of the same districts (visible or one click away).
- **GEO-07.** Tiles show the district name and score as text; the score badge is `text-xs` minimum (the current `text-[10px]` is migration A-12).
- **GEO-08.** No 3D extrusion, no globe, no animated flyovers (§27).

### 15.7 Heatmap matrix

- **HMX-01.** Rows are sorted by the row total or by the user's chosen column; never alphabetical by default.
- **HMX-02.** Cell values are printed when the cell is ≥ 32px wide; otherwise they are in the tooltip and the table alternative.
- **HMX-03.** Empty cells (no data) use a diagonal hatch pattern on `--muted`, not the lowest color.

### 15.8 Progress toward target

- **PRG-01.** Horizontal bar, 8px tall, `--muted` track, fill colored per COL-03, a 2px `--foreground` target marker with a label ("Target 62%"), and the value as text beside it.
- **PRG-02.** Progress bars carry `role="progressbar"` or `role="meter"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and a text label.

### 15.9 Visualization anti-patterns

| Anti-pattern | Why it is banned |
|:---|:---|
| Charts added "because the page looks empty" | No decision served |
| Rainbow or categorical colors for an ordered measure | Implies categories, hides order |
| Truncated bar axis | Exaggerates differences |
| Unlabelled axes or units | Unreadable |
| Legend far from the plot, or colors that differ from legend | Lookup errors |
| Dual y-axes | Invites false correlation |
| Pie with many slices, donut with a number in the middle | Poor comparison |
| Animated count-ups on KPIs | Delays reading; motion without meaning |
| Chart-only information with no table alternative | Fails ACCESSIBILITY.md §2.5 |
| Smoothed curves (`type="monotone"` is allowed; `type="basis"` or heavy smoothing is not) | Misrepresents data points |

---

## 16. Tables

Tables use TanStack Table (existing dependency) with TanStack Virtual for long lists, rendered through the shadcn `Table` primitives.

### 16.1 Column hierarchy

- **TBL-01.** The first column is the identity column (entity name, with its code as a second line in `text-xs muted-foreground font-mono`). It is a real link to the detail page.
- **TBL-02.** Column order: identity → the column the table is sorted by → key metrics → status → secondary attributes → row actions.
- **TBL-03.** At 1366px, show at most 8 columns by default. More columns are available through "Columns" (a checkbox menu), persisted in the URL.

### 16.2 Alignment

| Content | Alignment |
|:---|:---|
| Text, names, badges, dates | Left |
| Numbers, currency, percentages, scores | Right, `tabular-nums`, header right-aligned too |
| Rank | Right |
| Single icon or checkbox | Center |
| Row actions | Right |

**TBL-04.** Numbers MUST NOT be centered (current tables center them; migration A-06).

### 16.3 Density

| Density | Row height | Cell padding | Text | Default for |
|:---|:---|:---|:---|:---|
| Compact | 32px | `px-3 py-1.5` | `text-sm` | Validation error grid, audit log |
| Default | 40px | `px-3 py-2` | `text-sm` | All AppShell tables |
| Comfortable | 48px | `px-4 py-3` | `text-sm` / `text-base` | Candidate-facing tables, tables with two-line cells |

Header row: 40px, `bg-muted`, `text-sm font-medium text-muted-foreground`. Row separators: `border-b border-border`. No zebra striping (hover fill is enough). Row hover: `bg-muted/50`. Selected: `bg-primary/5` + `aria-selected`.

### 16.4 Sorting

- **TBL-05.** Every table declares a default sort, shown in the header with a glyph and `aria-sort`.
- **TBL-06.** Sortable headers are buttons: click toggles descending → ascending → default for numeric columns, ascending → descending for text. Unsortable headers are plain text.
- **TBL-07.** Sorting is server-side for paginated data.

### 16.5 Filtering

- **TBL-08.** Filters live in a `FilterBar` above the table, never inside column headers (except a search box for the identity column on client-side tables).
- **TBL-09.** The result count is always visible ("214 trades · filtered by Pune, Automotive"), with "Clear filters".
- **TBL-10.** Text search debounces 300ms and searches the identity column plus codes.

### 16.6 Pagination and long lists

- **TBL-11.** Server pagination with page size 25 (options 25, 50, 100), shown as "1-25 of 214" with previous/next and page number input. Page and size in the URL.
- **TBL-12.** Client-side lists over 200 rows (for example the validation error grid) use TanStack Virtual with a sticky header; the row count and "Download errors (CSV)" stay visible.
- **TBL-13.** Infinite scroll MUST NOT be used for work lists.

### 16.7 Selection and bulk actions

- **TBL-14.** Selection checkboxes only when a bulk action exists. Header checkbox selects the current page and offers "Select all 214".
- **TBL-15.** When one or more rows are selected, a bulk action bar replaces the table toolbar: "3 selected · [Action] · [Action] · Clear selection". Bulk destructive actions require confirmation (§17.7).

### 16.8 Row actions

- **TBL-16.** Clicking the identity link opens the detail. The whole row is not a click target unless the row has no other interactive element (avoids nested interactive controls).
- **TBL-17.** At most one inline action button (`size="sm" variant="outline"`) plus an overflow menu (`IconButton` "More actions for <name>"). Action labels include the object for screen readers: visible "Review", accessible name "Review Electrician recommendation, Pune".
- **TBL-18.** Critical actions MUST NOT exist only in an overflow menu.

### 16.9 Sticky elements, scrolling and mobile

- **TBL-19.** Header is sticky within the table's scroll container (`sticky top-0 z-10`) for tables taller than the viewport.
- **TBL-20.** When the table is wider than its container: horizontal scroll inside the wrapper, sticky identity column with a right shadow while scrolled, and a visible scrollbar. The wrapper has `tabIndex={0}`, `role="region"` and an `aria-label` so keyboard users can scroll it.
- **TBL-21. Table → cards on mobile.** Below `md`, transform to stacked cards **only when the user's mobile task is to pick one item** (course directory, ITI directory, review queue, alerts). Keep the table with horizontal scroll when the task is **comparison across rows** (gap rankings, benchmarks, validation errors). A card shows: identity, the primary metric, status, and the row action; other columns go to the detail page.

### 16.10 States

| State | Treatment |
|:---|:---|
| Loading (first) | Header renders; 5 skeleton rows matching column widths |
| Loading (refetch, filter change) | Existing rows stay, dimmed to 60%; a 2px indeterminate bar at the top of the table; `aria-busy="true"` |
| Empty (no data yet) | Single row spanning all columns with the EmptyState (§20.2), first-use variant |
| Empty (filters) | "No trades match these filters." + "Clear filters" button |
| Error | Header renders; ErrorState in the body with retry; previous data is not shown as current |
| Partial | Banner above the table: what is missing and why |

### 16.11 Accessibility

- **TBL-22.** Real `<table>` markup with `<caption>` (can be visually hidden) naming the table, `<th scope="col">`, and `<th scope="row">` for the identity cell.
- **TBL-23.** Do not use `role="grid"` unless implementing full grid keyboard navigation (not required in v1).

---

## 17. Forms

react-hook-form + zod (existing dependencies). Radix primitives for select, checkbox, radio, dialog.

### 17.1 Structure

- **FRM-01.** Group related fields in `<fieldset>` with a `<legend>` (`text-base font-semibold`). At most 7 fields per group.
- **FRM-02.** A form that has more than 3 groups, or more than 12 fields, or that does not fit one screen at 1366×768, is split into steps (§17.8).
- **FRM-03.** Single column. Two columns are allowed only for short related pairs (from/to dates, district/taluka) at `md`+.
- **FRM-04.** Field width reflects expected input length (pincode `w-32`, GSTIN `w-64`), not always full width.

### 17.2 Labels and helper text

- **FRM-05.** Every control has a visible `<Label>` above it. Placeholder text MUST NOT replace a label and MUST NOT contain instructions.
- **FRM-06.** Helper text sits between label and control (`text-sm muted-foreground`), connected with `aria-describedby`. Format hints go here ("15 characters, for example 27AAACM1234F1Z5").
- **FRM-07.** Required fields: label suffix `*` in `destructive` color with `aria-hidden`, `aria-required="true"` on the control, and a form-level note "Fields marked * are required" before the first field.

### 17.3 Validation

- **FRM-08. Timing.** Validate format on blur. Validate everything on submit. After the first submit attempt, re-validate a field on change.
- **FRM-09. Inline error.** Below the control: `danger-subtle-foreground` text with an `OctagonAlert` 16px glyph, `text-sm`, connected with `aria-describedby`; control gets `aria-invalid="true"` and `border-destructive` (UI_UX spec §3).
- **FRM-10. Error summary.** On a failed submit, an alert at the top lists every error as a link to its field ("Enter the GSTIN in the correct format"), receives focus, and is announced. Required for forms with more than 3 fields.
- **FRM-11. Message wording.** Say what to do, not what went wrong: "Enter a placement month between April 2025 and August 2026", not "Invalid date".
- **FRM-12.** Server validation errors (`error.errors[]` / `error.details[]`) map to fields by `field`; unmapped errors go to the summary.

### 17.4 Control states

| State | Treatment |
|:---|:---|
| Default | `border-input` (4.8:1), `bg-card` |
| Hover | No change. Inputs have no hover style. |
| Focus | 2px `ring` with 2px offset (existing `focus-visible` classes) |
| Invalid | `border-destructive` + inline error |
| Disabled | `bg-muted`, `text-muted-foreground`, `cursor-not-allowed`; reason available in helper text ("Locked after publishing") |
| Read-only | Plain text value with label, not a disabled input |

### 17.5 Submission, loading and success

- **FRM-13.** On submit: the submit button shows an inline spinner, keeps its label ("Submitting plan..."), and is disabled; the rest of the form is `aria-busy`. Double submission is impossible.
- **FRM-14.** Success after a create or state change: navigate to the resulting entity with a success toast ("District plan submitted for sanction"). Success on an in-place save: inline "Saved at 14:32" next to the button.
- **FRM-15.** Unsaved changes: navigating away asks for confirmation (dialog: "Leave without saving?" · "Stay" · "Leave").
- **FRM-16.** Long forms autosave a draft every 30 seconds where the API supports drafts (district plans), showing "Draft saved 14:32".

### 17.6 Concurrency conflicts

- **FRM-17.** On `409 CONFLICT` (stale `If-Match`), show a `warning` alert above the form: "This plan was changed by someone else at 14:20. Your edits are kept below." Actions: "Review latest version" (opens a side-by-side comparison) and "Discard my changes". Never overwrite silently; never lose the user's input.

### 17.7 Destructive actions

- **FRM-18.** Destructive buttons use `variant="destructive"` and name the object ("Reject recommendation").
- **FRM-19.** Confirmation dialog states the object, the consequence, and whether it is reversible. The confirm button repeats the action label; the cancel button is focused by default.
- **FRM-20.** Workflow decisions that are terminal (`REJECTED`, `PUBLISHED`, plan publish) require a confirmation dialog, and rejections and change requests require a non-empty comment (BE §H.1).
- **FRM-21.** Reversible actions (hide an alert, remove a filter) do not confirm; they offer "Undo" in a toast for 8 seconds.

### 17.8 Multi-step forms

Used for: District plan builder (4 stages per UI_UX spec §2.2), employer registration, pathway quiz (5 steps), CSV upload (select → validate → review → submit).

- **FRM-22.** Show a stepper with step names. Completed steps are links; future steps are not.
- **FRM-23.** Validate each step on "Continue"; do not validate future steps.
- **FRM-24.** "Back" keeps entered data. Step and draft ID live in the URL.
- **FRM-25.** The last step is a review summary with "Change" links per section, then the submit action.
- **FRM-26.** Step transitions move focus to the new step heading and announce "Step 2 of 4, ITI capacity allocation".
- **FRM-27.** The pathway quiz starts with the DPDP consent notice (OQ-08, S7) as its own step, before any input.

### 17.9 CSV upload (placement returns)

- **FRM-28.** Dropzone is also a button ("Choose CSV file"); drag and drop is optional. It states accepted type, size limit and a template download link.
- **FRM-29.** Client-side checks (type, size, header row) run immediately and report in place.
- **FRM-30.** Server validation shows progress with named stages; results show counts ("1,204 rows valid · 17 rows with errors") and the virtualized error grid (row, column, value, problem, how to fix) with "Download errors (CSV)".
- **FRM-31.** Submission of a file with errors is blocked (atomic batch isolation, PRD §7.1); the primary action reads "Fix errors and upload again".

---

## 18. Entity Detail Pages

### 18.1 Shared anatomy

```
Breadcrumb
EntityHeader: name (H1) · codes · status badge · scope · last updated
              primary action · secondary actions · overflow
Key metrics: 2 to 4 KPIs in one divided strip
Tabs: Overview · <entity-specific> · History
Tab body: main (8 cols) + aside (4 cols) at xl; stacked below
```

- **ENT-01.** The header is the same component everywhere (`EntityHeader`). Workflow-specific content lives in tabs, not in the header.
- **ENT-02.** The "History" tab (timeline of state transitions and audit events) exists for every entity with a workflow.
- **ENT-03.** The aside holds context the user needs while reading the main column: status, owners, SLA, related links. It is sticky at `xl`.
- **ENT-04.** Entities differ below the header when their workflows differ. Do not force identical tabs.

### 18.2 Per-entity structure

| Entity (route) | Header | Key metrics | Tabs | Primary action (role) |
|:---|:---|:---|:---|:---|
| **District** (`/districts/:id`) | Name, division, scope | Avg gap score, net shortage, placement rate vs target, ITIs | Overview (gap by sector), Trades, ITIs, Plan, History | Open plan (DO, own district) |
| **ITI institute** (`/institutes/:id`) | Name, code, district, type | Placement rate vs district median, courses, submission status | Overview, Courses, Placements, Assets, Trainers | Upload placement return (own ITI) |
| **Course** (`/candidate/courses/:id` and internal) | Title, course code, NSQF, duration | Verified placement rate (n), median salary, median time to placement | Overview, Outcomes, Where offered, Skills taught | Enrol via Mahaswayam (candidate) |
| **Job role / QP** (`/taxonomy/roles/:id`) | Title, QP code, sector, SSC, NSQF | Demand (postings), gap score, courses covering | Overview, Skills, Demand, Courses | View courses |
| **Skill** (`/taxonomy/skills/:id`) | Name, aliases, emerging flag | Demand trend, districts with critical gap | Demand, Gap by district, Courses, Aliases | Admin: Edit skill |
| **Curriculum recommendation** (`/recommendations/:id`) | Type, target course or role, status with step, SSC | Estimated uplift (with basis), gap score at trigger, age vs SLA | Evidence dossier, Reasons & sources, Decision, History | Record decision (current step's role only) |
| **District training plan** (`/district-plans/:id`) | District, FY, status, version | Seats proposed, equipment deficit (₹), trainer upskilling count | Intake targets, Equipment gaps, Budget score, History | Submit / Sanction per role and status |
| **Employer (own profile)** (`/employer/profile`) | Enterprise name, GSTIN (verified badge), sector | Open skill needs, surveys answered | Skill needs, Surveys, Curriculum reviews | Submit skill needs |
| **Placement batch** (`/placements/batches/:id`) | Institute, month, upload time, status | Rows, valid, errors, placement rate | Summary, Errors, History | Upload corrected file |

**ENT-05. Candidate profile.** No role other than the candidate sees an individual candidate. The candidate's own page (`/candidate/dashboard`) shows their saved courses, quiz results and Mahaswayam handoff status. Any design that shows an individual candidate to an officer, employer or reviewer is a P0 defect (DPDP).

**ENT-06. Job postings.** Individual postings are not pages. They appear only as aggregated counts, top employers and trends, with sources.

### 18.3 Recommendation review workbench

This is the most important workflow screen (UI_UX spec §2.4; BE §H.1).

- **REV-01.** Split layout (§10.5): evidence left, decision right (sticky).
- **REV-02.** The top of the evidence pane is the trigger rule sentence (BE §K.2), then the estimated uplift with its basis, then the dossier sections in fixed order: 12-month demand trend, top hiring employers, comparable courses with placement rates, affected districts, sources with contribution.
- **REV-03.** The decision pane shows the workflow stepper (Draft → SSC review → DSEEI approval → Published), the current step's owner role, the SLA ("Due in 3 working days", `warning` at ≤ 2 days, `destructive` when overdue), and the decision form.
- **REV-04.** Decision options are radio cards: Approve, Request changes, Reject. Comment is required for the last two, optional for Approve. The submit button label matches the choice ("Reject recommendation").
- **REV-05.** If the user's role is not the current step's role, the decision pane shows who acts next and no form. It never shows disabled Approve buttons without explanation.
- **REV-06.** Terminal states show the decision, actor role, time and comment; no form.

---

## 19. AI / Recommendation UX

### 19.1 What exists

The PRD's only matcher is the Pathway Quiz: **candidate → course** (BE §J). Candidate ↔ job matching is not in v1. Curriculum recommendations are rule-triggered with weighted reasons (BE §K). Gap scores are formula-based with stored inputs (BE §D.7). Forecasts arrive in Phase 4 (ML, advisory). The UI must expose each of these honestly.

**AIX-01.** The UI MUST NOT label rule-based or formula-based outputs as "AI". Use the specific name: "Gap score", "Match", "Recommendation", "Forecast".

### 19.2 Match results (pathway quiz)

Each of the top 3 course results shows:

```
Electrician (NSQF 4) · Govt ITI Aundh, Pune
Strong match · 82 / 100                      ← band label first, number second
Why this course
  • Matches your 12th-pass education          ← reasons from match_explanation, localized
  • Interest in Electrical, 22 employers hiring in Pune
Match breakdown  [Show]                        ← disclosure
  Skills alignment      ███████░░  27 of 30
  Local demand          ██████░░░  19 of 25
  Placement outcomes    ███████░░  15 of 20
  Education fit         █████████  15 of 15
  Location fit          ██████░░░   6 of 10
  Total                            82 of 100
Outcomes: 68% placed (n = 142, 2024-25 batch) · ₹14,200 / month median
[Enrol via Mahaswayam]   [Compare]
```

- **AIX-02. Never a bare score.** A match number always appears with its band label and at least one reason. "AI Score: 91%" is a P1 defect.
- **AIX-03. Bands, not false precision.** Bands (UX-Q7, decided): 75-100 "Strong match", 50-74 "Good match", 0-49 "Weak match". Weak matches are shown after stronger ones with a `warning-subtle` note "Weak match: this course fits few of your answers. See why below."; their factor breakdown is expanded by default; the number is secondary text; ineligible courses (AIX-05) are still never shown.
- **AIX-04. Factor breakdown** lists the five factors with the names from BE §J.2 in plain language, each as "contribution of weight" (for example "27 of 30"). Contributions sum to the total; the UI shows the sum.
- **AIX-05. Eligibility is a gate, not a factor to hide.** If `EDUCATION_FIT = 0`, the course is not shown as a match. If the user asks why a course is missing, "Why not shown?" explains "Requires 10th pass; you selected 8th pass".
- **AIX-06. Reasons** come from backend templates (`match_explanation`) in the active language. The UI MUST NOT generate reason text.
- **AIX-07. Inputs are visible and editable.** The results page shows a summary of the answers ("12th pass · Pune · Electrical, Automotive · Marathi · Can relocate within Maharashtra") with "Change answers".

### 19.3 Confidence and uncertainty

- **AIX-08. Sample size.** Every rate shown to a candidate or officer shows `n` and period. If `n < 30`, show "Limited data (n = 12)" in `warning-subtle` and replace the percentage with a range or "Not enough data" (threshold n ≥ 30, UX-Q8, decided).
- **AIX-09. Data age.** Outcomes older than 18 months show "Based on the 2023-24 batch".
- **AIX-10. Forecast uncertainty** is shown as an interval, never a single number alone (VIZ-20).
- **AIX-11. ML advisory.** Where ML similarity adjusted a factor (BE §J.4), the breakdown notes "Includes skill-similarity estimate (model v1.2)". If the ML service is down, results still show, with no error to the candidate (degraded quality is logged, not displayed).

### 19.4 Curriculum recommendations

- **AIX-12.** A recommendation always displays: type, trigger rule sentence, top 3 reasons with weights, estimated uplift and its basis, gap score run, generated date, and status.
- **AIX-13. Staleness.** If `generated_at` is older than the revalidation window, show "Evidence from 12 Jul 2026. Re-evaluation pending." If withdrawn because the gap closed, show the withdrawal reason (BE §K.2).
- **AIX-14. Evidence links.** Each source row links to the underlying data view (postings trend, employer needs, survey results) filtered to the same scope and period.

### 19.5 Gap score explanation

- **AIX-15.** Next to every gap score in a detail view: "How is this calculated?" disclosure showing the PRD §7.3 formula in words and the stored inputs (demand count, trend factor, trained capacity, placement rate, normalisation constant) with their sources and the run ID.

### 19.6 Feedback

- **AIX-16. Candidates** MAY rate "Was this helpful?" (Yes / No) on results. Only anonymous counters are stored (S7). No free-text field.
- **AIX-17. Officers and employers** give feedback through the workflow (comments, curriculum reviews), which feeds `recommendation_feedback`. The UI shows "Your feedback is used in the next recommendation run".

### 19.7 AI UX don'ts

| DON'T | DO |
|:---|:---|
| "AI Score: 91%" | "Strong match · 82 / 100" + reasons + breakdown |
| "Recommended by AI" badge, sparkle icons | "Recommended because…" |
| Hide ineligible results silently | Explain on request |
| Show a forecast as a KPI | Label and band it |
| Generate explanation text client-side | Render backend reason codes via i18n templates |
| A confidence percentage with no definition | Sample size and data age |

---

## 20. Loading / Empty / Error States

Every data-bound component MUST implement all four: loading, empty, error, success. Partial and offline apply where noted.

### 20.1 Loading

- **STA-01. Skeletons, delayed.** Show skeletons only if loading exceeds 300ms (avoids flicker). Skeletons match the final layout's shape (UI_UX spec §3). `animate-pulse` is allowed only here; under reduced motion the skeleton is static.
- **STA-02. Progressive rendering.** Page chrome, headers, labels and filters render immediately. Each widget loads independently (one TanStack query per widget). A slow widget never blocks the page.
- **STA-03. Spinners** only inside buttons (FRM-13) and for actions under 2 seconds with no layout to preview. No full-page spinners (UI_UX spec §3).
- **STA-04. Long operations** (> 10 seconds: CSV validation, report generation) show named stages and allow leaving the page, with a notification on completion.
- **STA-05.** Loading regions set `aria-busy="true"`; completion of a user-initiated load is announced politely.

### 20.2 Empty

Every empty state has: a heading that explains why, one sentence of context, and one next action. An illustration is optional (UI_UX spec §3 mentions one); if used, it is a single neutral line illustration at most 96px tall, never decorative color.

| Type | Heading pattern | Action |
|:---|:---|:---|
| First use | "No placement returns uploaded yet" | "Upload first placement return" |
| No results | "No trades match these filters" | "Clear filters" |
| Not yet computed | "Gap scores for this district are not ready" + "The next run is on 22 Sep 2026" | "View last run" (if any) |
| Not applicable | "Budget modelling is available to DSEEI officers" | Link to what the role can do |
| Cleared | "All alerts reviewed" | none (no celebration) |

**STA-06.** Empty and zero are different. A KPI with value 0 shows "0"; a KPI with no data shows "No data" with the reason in its tooltip.

### 20.3 Error

**STA-07.** Error messages say what happened, what it means for the user, and what to do. "Something went wrong" alone is forbidden.

| Situation | Where | Content |
|:---|:---|:---|
| Widget fetch failure (5xx, network) | In the widget | "Could not load placement trend." + "Try again" + "Error reference: {traceId}" |
| Whole page fetch failure | Page body | Same, plus "Go to dashboard" |
| `AUTHENTICATION_ERROR` / `AUTH_TOKEN_EXPIRED` | Dialog | "Your session has ended. Sign in again to continue." Unsaved form data is kept. |
| `AUTHORIZATION_ERROR` / `AUTH_FORBIDDEN` | Page (403) | "You don't have access to this page." + what the role can access + helpdesk |
| `AUTH_SCOPE_RESTRICTED` | Page | "This page is for Nashik district. Your access is limited to Pune." + "Go to Pune dashboard" |
| `RESOURCE_NOT_FOUND` | Page (404) | "This recommendation does not exist or was removed." + back to list |
| `VALIDATION_ERROR` | Form | Inline + summary (§17.3) |
| `BUSINESS_RULE_VIOLATION` | Alert above the action | Message keyed by sub-code (`PLAN_ALREADY_PUBLISHED` → "This plan is already published and can't be edited.") |
| `CONFLICT` | Form | §17.6 |
| `RATE_LIMITED` | Toast | "Too many requests. Try again in {Retry-After} seconds." |
| `EXTERNAL_SERVICE_ERROR` (Mahaswayam) | Dialog | "Mahaswayam is not responding. Your course choice is saved. Try again later." |
| `SERVICE_UNAVAILABLE` | Banner | "MahaSkills is under maintenance until 18:00." |

- **STA-08.** Server `error.message` is English only; the UI MUST NOT display it. Map `error.code` (and sub-code) to i18n keys `errors.<CODE>`. Unknown codes fall back to `errors.UNKNOWN` with the trace ID.
- **STA-09.** Show `traceId` (when present) as selectable text so it can be quoted to the helpdesk.
- **STA-10.** Errors use the `danger-subtle` alert with an `OctagonAlert` glyph and `role="alert"` for blocking errors; widget errors use `role="status"`.

### 20.4 Partial data

- **STA-11.** When a dataset is incomplete, say so where the data is shown: "Data incomplete: 4 of 38 ITIs have not submitted August 2026 returns." with a link to the missing list (for roles that can act).
- **STA-12.** Averages and totals over incomplete data are labelled "(partial)". Charts follow VIZ-19.
- **STA-13.** Stale data: if the latest gap run is older than 8 days (the pipeline is weekly), the `DataFreshness` line turns `warning` and says "Gap scores are 11 days old. The weekly update did not run."

### 20.5 Offline and network failure

- **STA-14.** When the browser goes offline or requests fail with network errors, show a persistent top banner: "You are offline. Showing data from 14:05. Changes can't be saved." Cached queries remain visible, marked with that time.
- **STA-15.** Submit actions are disabled offline with the banner as the reason; form input is kept.
- **STA-16.** Recovery removes the banner and refetches visible queries; announce "Back online".
- The offline-first mobile app is Phase 4 (React Native) and out of scope here.

---

## 21. Accessibility

Target: WCAG 2.1 AA and GIGW 3.0 (statutory), plus the WCAG 2.2 criteria listed. Each rule names how it is tested.

| ID | Rule | Test |
|:---|:---|:---|
| A11Y-01 | Skip link to `#main-content` is the first focusable element | Keyboard: first Tab shows it |
| A11Y-02 | Semantic landmarks: `header`, `nav` (labelled), `main#main-content`, `aside`, `footer`. Semantic HTML before ARIA. | axe; snapshot shows landmarks |
| A11Y-03 | One `h1`; no skipped heading levels | axe `heading-order` |
| A11Y-04 | Focus ring on every interactive element: 2px `ring` + 2px offset; never removed without replacement | Keyboard walk; screenshot of focus states |
| A11Y-05 | Focused element is never fully hidden by sticky header or bottom nav (WCAG 2.4.11) | Tab through a long page at 1366×768 and 360×800; use `scroll-padding-top: 72px` |
| A11Y-06 | Logical tab order follows visual order; no positive `tabIndex` | Keyboard walk |
| A11Y-07 | Dialogs and drawers trap focus, close on Escape, return focus to the trigger (Radix) | Keyboard |
| A11Y-08 | Every input has a programmatic label; errors connected with `aria-describedby`; `aria-invalid` set | axe `label`; screen reader spot check |
| A11Y-09 | Text contrast ≥ 4.5:1 (≥ 3:1 for large); non-text UI and chart marks ≥ 3:1 | axe `color-contrast`; token table §7 |
| A11Y-10 | No information by color alone (severity, status, deltas, chart series) | Grayscale screenshot review (§28.6) |
| A11Y-11 | Icon-only buttons have an accessible name; decorative icons `aria-hidden="true"` | axe `button-name` |
| A11Y-12 | Touch targets ≥ 44×44px below `lg`; ≥ 24×24px with spacing on desktop (WCAG 2.5.8) | Snapshot with `--boxes` |
| A11Y-13 | `html lang` updates on language switch; mixed-language spans carry `lang` | `playwright-cli eval "document.documentElement.lang"` |
| A11Y-14 | Tables: `caption`, `th scope`, sortable headers with `aria-sort` | axe; code review |
| A11Y-15 | Charts: `figure` with summary `aria-label`, keyboard-reachable points with tooltip, "View as table" | Keyboard; screen reader |
| A11Y-16 | Live regions announce filter results, validation progress, step changes, background completion (`aria-live="polite"`); blocking errors use `role="alert"` | Screen reader spot check |
| A11Y-17 | `prefers-reduced-motion: reduce` disables transforms, skeleton pulse, chart animation | Emulated reduced motion (§28.4) |
| A11Y-18 | Content reflows at 320px width without loss (Public and Candidate shells); AppShell usable at 200% zoom on 1366×768 | Resize and zoom checks |
| A11Y-19 | Text spacing overrides (WCAG 1.4.12) do not clip text; no fixed-height text containers | Inject spacing CSS via `run-code`, screenshot |
| A11Y-20 | Session timeout warns 2 minutes before expiry with "Stay signed in" (WCAG 2.2.1) | Manual |
| A11Y-21 | Automated axe scan: 0 violations on every page (`TEST-NFR-003`) | `@axe-core/playwright` (pending `@playwright/test`) |
| A11Y-22 | Hover-revealed content (tooltips) is dismissible with Escape, hoverable, and persistent (WCAG 1.4.13) | Manual |

**A11Y-23.** Accessibility is checked at every loop iteration (§28), not at the end. A P0/P1 accessibility finding blocks completion.

---

## 22. Motion

### 22.1 Where motion is useful

| Purpose | Example | Spec |
|:---|:---|:---|
| Feedback | Button press, toggle | Color change, `duration-fast`, no transform |
| State change | Accordion expand, tab indicator, row expand | Height/opacity, `duration-base`, `ease-out-standard` |
| Continuity | Dialog and drawer open/close | Fade + 8px translate (dialog) or slide (drawer), `duration-slow` in, `duration-base` out |
| Cause and effect | Filter applied → widgets dim then update | Opacity 100% → 60% → 100%, `duration-base` |
| Attention to new content | New toast | Slide in from edge, `duration-slow` |
| Progress | Upload stages, indeterminate bar | Linear, continuous only while work runs |

### 22.2 Rules

- **MOT-01.** Motion must answer "what does this communicate?" in one sentence (Taste §5). If not, remove it.
- **MOT-02.** Maximum duration 200ms for UI transitions; 300ms for chart data transitions (VIZ-09). No page transition animations between routes.
- **MOT-03.** Animate only `opacity` and `transform`.
- **MOT-04. Prohibited:** looping decorative animation (pulsing dots, spinning icons like the `Compass` in `PathwayQuiz.tsx`, migration A-13), count-up numbers, parallax, scroll-triggered reveals in AppShell, auto-playing carousels, hover lift on static cards, animated gradients, entrance animation on every page load.
- **MOT-05. Reduced motion.** Under `prefers-reduced-motion: reduce`: transforms are removed (fade only, ≤ 100ms or none), skeleton pulse stops, indeterminate bars become a static striped bar with text, charts do not animate. Implement with Tailwind `motion-safe:` / `motion-reduce:` variants.
- **MOT-06.** Nothing moves without user action except progress indicators for running work and toasts.
- **MOT-07.** Landing page (motion dial 3) MAY use a single fade-in on the hero on first load, `duration-slow`, disabled under reduced motion.

---

## 23. Role-Based UX

Roles come from PRD §4 and IA §2. UX changes per role are about **priorities and language**, not just hidden menu items.

### 23.1 Role profiles

| Role | Core question | Default landing | Primary tasks | Information priority | Scope display |
|:---|:---|:---|:---|:---|:---|
| **POLICY_MAKER** (DSEEI/MSInS) | "Where should the state act and spend?" | State overview (`/dashboard/policy-maker`) | Review statewide gaps; approve recommendations at DSEEI step; sanction district plans and budgets | Statewide severity → approvals due → budget impact → trends | "Maharashtra (all 36 districts)" |
| **DISTRICT_OFFICER** | "What does my district need this year, and who is falling behind?" | District workbench (`/dashboard/district-officer`) | Build and submit the annual plan; monitor ITI placement submissions; act on alerts | Own district critical trades → plan status → ITI compliance → equipment deficits | Locked district badge with lock glyph |
| **ITI_PRINCIPAL** | "Is my institute on track, and what must I submit?" | Institute overview (`/dashboard/iti`) | Upload monthly placement returns; fix validation errors; compare courses to district benchmarks; maintain asset register | Submission due and status → course performance vs benchmark → asset gaps | Institute name + district, locked |
| **SSC_REVIEWER** | "Which proposals need my technical decision, and are they sound?" | Review queue (`/recommendations/review-queue`) | Review dossiers; approve, request changes or reject; align taxonomy | Items due by SLA → evidence quality → taxonomy alignment | Assigned sector(s) |
| **EMPLOYER** | "How do I tell the system what skills we need, and is it listening?" | Employer dashboard (`/employer/dashboard`) | Submit skill needs; answer 2-minute surveys; review draft syllabi | Open requests and surveys → curriculum drafts to review → hiring signal summary | Enterprise name, GSTIN verification status |
| **ADMIN** | "Is the data flowing, and is the system healthy and secure?" | Admin overview (`/admin`) | Monitor ingestion DAGs; manage taxonomy; review audit logs; manage users | Pipeline failures → stale data → audit anomalies → taxonomy queue | "System-wide" |
| **CANDIDATE** / public | "Which course should I take, and will it get me a job?" | Pathway quiz (`/candidate/pathway`); returning users see `/candidate/dashboard` | Take quiz; explore courses; compare; enrol via Mahaswayam | Personal fit → verified outcomes → where offered → how to enrol | None (personal) |

The current router uses `/dashboard` for all roles and sends SSC reviewers and employers to a page not in their navigation (migration A-14). IA routes are the target.

### 23.2 Rules

- **ROL-01. Different defaults, same components.** Roles share components; what changes is the default filters, the order of dashboard sections, the primary action, and terminology.
- **ROL-02. Show what the role can do, not a list of what it can't.** Items the role cannot use are absent from navigation. Actions the role can *see but not perform right now* (for example, a plan the officer submitted and cannot edit) are shown with the reason ("Awaiting DSEEI sanction"), not as unexplained disabled buttons.
- **ROL-03. Scope is always visible** in the sidebar scope indicator and in every page's context line. Scoped filters are rendered locked, not hidden, so users understand the limit.
- **ROL-04. Permission-gated actions** use `<PermissionGate>` (FRONTEND_ARCHITECTURE §5) and mirror RBAC_MATRIX exactly. The UI never widens a scope; the backend remains the security boundary.
- **ROL-05. Candidate isolation.** CandidateShell has no links into AppShell and no government jargon.
- **ROL-06. Multi-role users.** One role per user (UX-Q9, decided). No production role switcher is built. The dev persona switcher stays development-only (NAV-09).

### 23.3 Terminology by audience

| Concept | Officer, reviewer, admin | Employer | Candidate |
|:---|:---|:---|:---|
| Gap score | Gap score (0-100) | Skill shortage level | Not shown; "High local demand" badge only |
| Placement rate | Placement rate (verified) | Placement rate | "68 of 100 trainees got jobs" + rate |
| Job role / QP | Job role (QP code) | Job role | Job |
| NSQF level | NSQF level 4 | NSQF level 4 | "Level 4 (after 10th)" |
| Recommendation | Curriculum recommendation | Curriculum draft | Not shown |
| Match | n/a | n/a | "How well this course fits you" |
| Intake capacity | Sanctioned intake | Trained supply | Seats |

---

## 24. Content Design

### 24.1 Voice

Precise, concise, neutral, action-oriented, understandable. Plain language that translates cleanly into Marathi and Hindi.

- **CNT-01.** Sentences ≤ 20 words in UI text. Paragraphs ≤ 3 sentences.
- **CNT-02.** Use the user's words from §23.3, not system names. No database or enum names in UI.
- **CNT-03.** Sentence case for all headings, buttons and labels ("Upload placement return"), not Title Case.
- **CNT-04.** Buttons start with a verb and name the object: `Submit district plan`, `Review curriculum gaps`, `Download error report`. Max 4 words for primary buttons in English.
- **CNT-05.** Banned vague labels when a specific one is possible: Proceed, Continue (except in multi-step forms), Manage, More, Click here, Submit (alone), OK, Yes/No in dialogs.
- **CNT-06.** One label per intent across the product. "Enrol via Mahaswayam" everywhere, not also "Apply now" and "Register".
- **CNT-07.** No marketing superlatives in AppShell ("Command Center", "Intelligence", "Real-time", "Seamless", "Empower"). Name the thing: "Maharashtra overview".
- **CNT-08.** No em-dash (—) or en-dash (–) in UI strings; use a colon, a comma, or two sentences. Ranges use a hyphen ("2024-25").
- **CNT-09.** No invented numbers. Every number on screen comes from data or is tagged "Sample data" (P13).
- **CNT-10.** Every string goes through `t('domain.key')` with keys in `mr`, `hi` and `en` together (AGENTS.md rule 4). The English fallback in `t(key, fallback)` MUST match `en/translation.json`; the current code mixes Marathi fallbacks into `t()` calls (migration A-15).
- **CNT-11.** Keys are semantic (`plan.submit.button`), not positional (`page2.text3`).
- **CNT-12.** Use interpolation and ICU plurals, never string concatenation (`t('gap.districts_count', { count })`).
- **CNT-13.** Official names stay official: "Mahaswayam", "MahaDBT", "NCVET", "NSQF", "Sector Skill Council". Expand acronyms on first use per page or in a tooltip.
- **CNT-14.** Demo personas and fixtures use obviously synthetic names and email domains (`@example.gov.in`), never the names of real officials.

### 24.2 Patterns

| Situation | Bad | Better |
|:---|:---|:---|
| Row action | Manage | Review curriculum gaps |
| Empty list | No data | No placement returns for August 2026 yet |
| Error | Something went wrong | Could not load the district list. Try again. |
| Validation | Invalid input | Enter a 15-character GSTIN, for example 27AAACM1234F1Z5 |
| Confirmation | Are you sure? | Reject this recommendation? The SSC will be notified. This can't be undone. |
| Success | Success! | District plan submitted for DSEEI sanction |
| Disabled reason | (none) | Editing is locked after publishing |
| Page title | State Skill Intelligence Command Center | Maharashtra overview |
| Consent (quiz) | By continuing you agree… | Your answers are used only to suggest courses. They are not shared with companies. |

### 24.3 Copy self-audit

Before completing a UI task, re-read every visible string in all three locales (Taste §4.9). Flag and rewrite anything that is grammatically broken, has an unclear referent, sounds like filler, or is untranslated.

---

## 25. Component Library

The foundation is shadcn/ui on Radix (in `components/ui/`). Currently present: `Button`, `Card`, `Table`. Radix packages installed: dialog, dropdown-menu, label, select, slot, tabs, toast. Components below marked **New** must be created (in `components/ui/` for primitives, `components/common/` for composites). Components needing a new Radix package (tooltip, popover, checkbox, radio-group, collapsible, progress) require architect approval for the dependency (`GUARDRAILS.md`).

### 25.1 Universal state matrix

Every interactive component implements, as relevant:

| State | Visual | Behavior |
|:---|:---|:---|
| Default | Per variant | |
| Hover | Fill or border shift within the same hue; `duration-fast` | Pointer only; never the only affordance |
| Focus-visible | 2px `ring`, 2px offset | Keyboard focus only |
| Active / pressed | One step darker fill | |
| Selected / current | `primary/10` fill + primary text or border; `aria-selected`/`aria-current`/`aria-pressed` | |
| Disabled | 50% opacity (existing) or muted fill; reason available | Not focusable unless it has a tooltip reason; then use `aria-disabled` and keep focusable |
| Loading | Inline spinner, label retained | `aria-busy`, no double action |
| Error | `destructive` border and message | `aria-invalid` |

### 25.2 Components

**Button** (exists)
- Purpose: trigger an action. Variants: `default` (primary, one per region), `outline` (secondary), `ghost` (tertiary, toolbars), `destructive`, `link`. Sizes: `default` 40px, `sm` 36px, `lg` 44px, `icon` 40px.
- Changes: hover of `outline`/`ghost` becomes `bg-muted text-foreground` (C-09). Add `loading` prop (spinner + `aria-busy` + disabled). Add `lg` as default on touch layouts.
- Responsive: primary actions full width below `sm` when alone in a footer.
- A11y: native `<button>`; `asChild` links keep link semantics; label never wraps on desktop (Taste CTA wrap ban).

**IconButton** (New, wraps Button `size="icon"`)
- Purpose: compact actions in toolbars and rows. Allowed only when the icon is universally understood (close, more actions, search, previous/next, sort, download, menu) **and** it has a tooltip and `aria-label`. Otherwise use a text button.
- Size 40px (32px visual in dense tables with 40px hit area).

**Input, Textarea** (New)
- Purpose: text entry. Anatomy: label, optional helper, control, error. States per §17.4. Textarea shows a character count when a limit exists.
- A11y: label association, `aria-describedby`, `autocomplete` attributes.

**Select** (New, Radix Select installed)
- Purpose: choose one from ≤ 15 known options. Above 15, use Combobox.
- Keyboard: type-ahead, arrows, Enter, Escape. Mobile: Radix select (not native) for consistent trilingual rendering.

**Combobox** (New; needs Popover and a command list, dependency approval)
- Purpose: search and choose from long lists (districts, job roles, skills, ITIs). Shows code + name; supports Marathi and English matching.
- A11y: `role="combobox"` pattern, `aria-activedescendant`, results count announced.

**DatePicker / MonthPicker** (New)
- Purpose: pick dates and months (placement month, FY). Typed input `DD/MM/YYYY` always available alongside the calendar. Month picker for placement returns. Constrained ranges shown as disabled with reason.
- Dependency: calendar component needs approval; typed input is the minimum viable implementation.

**FilterBar** (New, composite)
- Purpose: filter a page's data. Anatomy: up to 5 inline filters, search box, "More filters" drawer, applied-filter chips, result count, "Clear filters".
- Behavior: state in URL; locked scope filters show a lock glyph. Responsive per §11.3.

**Tabs** (New, Radix Tabs installed)
- Purpose: switch sibling views. Underline style: 2px `primary` indicator, `text-sm font-medium`. Active tab in URL. Max 6. Horizontal scroll on overflow with fade edges.

**Dialog (Modal)** (New, Radix Dialog installed)
- Sizes per §10.6. Anatomy: title, optional description, body, footer (cancel left of confirm in LTR, confirm is the rightmost). No nested dialogs. Bottom sheet below `md`.

**Drawer (Sheet)** (New, Radix Dialog)
- Right side, sizes per §10.6. Used for previews and filter panels. URL holds the open item ID. Full screen below `md`.

**Toast** (New, Radix Toast installed)
- Purpose: transient confirmation or recoverable error. Variants: success, info, warning, error. Duration 6s (8s with Undo); errors needing action are not toasts. Max 3 stacked. `aria-live` polite (errors assertive).

**Tooltip** (New; needs `@radix-ui/react-tooltip`)
- Purpose: name icon buttons, explain abbreviations, show full truncated text. Inverse style (`bg-foreground text-background`, `text-xs`, `rounded-sm`). Delay 300ms. Never holds essential information or interactive content.

**Breadcrumb** (New)
- `nav aria-label="Breadcrumb"` with ordered list; separators `aria-hidden`; mobile shows parent link only.

**Badge** (New, replaces ad-hoc spans)
- Purpose: short categorical labels (NSQF level, sector, "Sample data"). Variants: `neutral`, `outline`, `info`. `rounded-sm`, `text-xs font-medium` (`text-sm` in mr/hi), height 20px.

**StatusBadge** (exists, must be rebuilt)
- Purpose: workflow and record status. Props: `status` (typed enum), not a free string. Renders translated label + glyph with `-subtle` tokens. Map: `DRAFT` neutral, `SSC_REVIEW`/`DSEEI_APPROVAL`/`UNDER_REVIEW`/`VALIDATING` info, `CHANGES_REQUESTED` warning, `APPROVED`/`PUBLISHED`/`COMPLETED`/`ACTIVE` success, `REJECTED`/`FAILED` danger. The current version prints the raw enum and uses raw palette classes (migration A-16).

**SeverityBadge** (New)
- Purpose: gap severity only. Uses `gap-*` tokens, label, glyph (GAP-01), optional score ("81 · High").

**KPI / MetricStrip** (New)
- Anatomy and rules per §14.3. Props: `label`, `value`, `unit`, `delta`, `comparisonLabel`, `goodDirection`, `href`, `loading`, `partial`.

**DataTable** (New, wraps TanStack Table + shadcn Table)
- All §16 rules built in: sort, server pagination, column visibility, selection, bulk bar, row actions, sticky header/column, density prop, states, caption, mobile card renderer prop.

**Pagination** (New)
- "1-25 of 214", previous/next buttons with labels, page input, page size select. `nav aria-label="Pagination"`.

**ChartCard** (New)
- Anatomy per §15.2; props: `title`, `subtitle`, `insight`, `footnote`, `data`, `tableColumns`, `state`. Owns the "View as table" toggle and the export menu.

**InsightCard** (New)
- Purpose: one templated finding with its evidence link. Anatomy: glyph (info/warning), sentence, "View <evidence>" link. No decorative icon tiles.

**RecommendationCard** (New)
- Two variants. `curriculum`: type, target, trigger sentence, status, SLA, "Review recommendation". `course-match`: per §19.2 layout.

**FactorBreakdown** (New)
- Rows of factor name, bar (contribution/weight, no background-track decoration beyond `muted`), "27 of 30", total row. Accessible as a table.

**Timeline** (New)
- Purpose: workflow history and audit trail. Each event: actor role (never personal data for candidates), action, time, comment. Vertical list, newest first, `ol` semantics.

**Stepper** (New)
- Purpose: workflow position (read-only) and multi-step forms (interactive). Labels always visible on desktop. Current step `aria-current="step"`.

**EmptyState** (New)
- Props: `type` (§20.2), `title`, `description`, `action`. Center-aligned within its container, `max-w-sm`.

**ErrorState** (New)
- Props: `error` (API envelope), `onRetry`. Renders mapped message, retry, trace ID.

**Skeleton** (New)
- `bg-muted rounded-md motion-safe:animate-pulse`. Shape props for text line, KPI, table row, chart.

**Search (GlobalSearch)** (New)
- Header search with `Ctrl+K`/`/` shortcut; grouped results by entity type (IA §3); keyboard navigable; no candidate results ever.

**EntityHeader** (New)
- Anatomy per §18.1. Props: `title`, `codes`, `status`, `scope`, `updatedAt`, `primaryAction`, `secondaryActions`, `overflowActions`.

**DataFreshness** (New)
- One line: data source(s), as-of time, run ID, completeness; `warning` style when stale (STA-13).

**ScopeIndicator** (exists inline in AppShell; extract per FRONTEND_ARCHITECTURE §3)
- Role label + scope; lock glyph when scoped.

**LanguageSwitcher** (exists inline in Header; extract)
- Per NAV-10.

**Alert** (New)
- Inline, persistent message: `info`, `success`, `warning`, `danger`, with title, body, optional action. `role="alert"` only for blocking errors.

### 25.3 Extending the library

- **CMP-01.** Before creating a component, search `components/ui` and `components/common`. Extend with a variant before adding a new component.
- **CMP-02.** A new reusable pattern requires, in the same PR: the component, its states, a usage note appended to this section, and screenshots at the required viewports.
- **CMP-03.** Feature folders MUST NOT contain generic UI primitives (buttons, badges, tables styled locally).

---

## 26. Image & Media Guidelines

### 26.1 Iconography

- **ICN-01. Library:** `lucide-react` only (existing dependency). No second icon family, no hand-drawn SVG icons (Taste §3.C).
- **ICN-02. Stroke** 2 (lucide default); do not override per icon.
- **ICN-03. Sizes:** 16px (`h-4 w-4`) inline with `text-sm`; 20px (`h-5 w-5`) with `text-base` and in bottom nav; 24px only in empty states. No other sizes.
- **ICN-04. Color:** icons inherit text color (`currentColor`). Colored icons only when they carry status (a warning glyph in a warning alert).
- **ICN-05. Semantic use only.** An icon must add meaning or speed recognition. Decorative icons beside headings, KPI labels and card titles are not used (current `Sparkles` usage is migration A-17).
- **ICN-06. Fixed meanings.** One icon per concept across the product:

| Concept | Icon |
|:---|:---|
| Dashboard | `LayoutDashboard` |
| Gap analysis | `TrendingUp` |
| Recommendations | `FileCheck` |
| Taxonomy | `Network` |
| Placements upload | `Upload` |
| District plans | `MapPin` |
| Employer | `Briefcase` |
| Admin | `Settings` |
| Warning | `TriangleAlert` |
| Error / critical | `OctagonAlert` |
| Info | `Info` |
| Success | `CircleCheck` |
| Scope locked | `Lock` |
| External link (Mahaswayam) | `ExternalLink` |
| More actions | `EllipsisVertical` |
| Sort | `ArrowUpDown`, `ArrowUp`, `ArrowDown` |

- **ICN-07. Icon-only buttons** are allowed only for the concepts in IconButton (§25.2), with `aria-label` and tooltip. Navigation items always show text labels (except the collapsed sidebar rail, which shows tooltips).
- **ICN-08.** Decorative icons get `aria-hidden="true"`.

### 26.2 Images and illustrations

- **IMG-01. AppShell:** no photographs, stock images or mood illustrations. The only images are the MahaSkills logo (§26.3), entity logos where officially provided (employer logos only with permission), and empty-state line illustrations (optional).
- **IMG-02. Landing page:** MAY use real photographs of Maharashtra ITIs and trainees with documented consent and license, in at most 2 placements. No stock photos of foreign settings, no AI-generated people, no div-built fake dashboards (Taste §4.8); a real screenshot of the product is allowed if it shows sample-tagged data.
- **IMG-03.** Every meaningful image has localized `alt` text; decorative images use `alt=""`.
- **IMG-04.** Images declare `width` and `height` (CLS < 0.1), use `loading="lazy"` below the fold, are served as WebP/AVIF at most 200KB, with responsive `srcset`.
- **IMG-05.** No text baked into images (untranslatable).
- **IMG-06. Emblem use.** The State Emblem of India and the Government of Maharashtra seal MUST NOT be drawn, traced, imitated or generated (State Emblem of India (Prohibition of Improper Use) Act, 2005). The header emblem slot stays empty until DSEEI supplies an approved file. The MahaSkills logo (§26.3) is used instead and must not resemble either emblem.
- **IMG-07.** No video autoplay. Any video has captions in all three languages and a transcript.

### 26.3 Brand assets (UX-Q5, decided: create them)

- **BRD-01.** Original simple geometric SVG mark (2-4 flat shapes, e.g. upward-stepping bars suggesting demand → skills → jobs); `--primary` plus at most one `--accent` shape; no gradients, no text in the mark, no map outline, no lion capital, no chakra, no seal shapes.
- **BRD-02.** Lockups: mark + "MahaSkills" and mark + "महास्किल्स", weight 700; live text in the header, outlined only in exported files.
- **BRD-03.** Files in `frontend/public/brand/`: `logo-mark.svg`, `logo-mark-dark.svg`, `logo-lockup-en.svg`, `logo-lockup-mr.svg`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `og-image.png` (1200×630, no fake data), plus `frontend/public/site.webmanifest`; `index.html` uses `favicon.svg` (it currently points to a missing `/favicon.ico`).
- **BRD-04.** Legible at 16px; ≥ 3:1 against light and dark header; optimised SVG with `viewBox`, `role="img"` and `<title>` when inline.
- **BRD-05.** Header replaces the "म" tile with the 32px mark plus live-text wordmark.

---

## 27. image2three.js Usage

### 27.1 What the tool is

`img2threejs` rebuilds a **single object or character** from a reference photo as procedural Three.js TypeScript (a `Group` factory), through a gated pipeline: `forge/next.py` state checks, spec authoring, locked build passes, multi-angle screenshot review, and a correction loop. It needs Python 3.10+, a browser preview, and `three` in the frontend. It does not produce charts, maps, or data-driven geometry, and its README marks several showcase models as unfinished placeholders.

### 27.2 Default: not used

**3D-01.** 3D MUST NOT appear in AppShell or CandidateShell. That covers dashboards, tables, forms, workflows, maps, CRUD screens, dossiers, and any place where information must be read quickly.

**3D-02.** No 3D maps, extruded choropleths, globes or 3D charts, whatever the tool.

### 27.3 Approved use: landing hero only (UX-Q6, decided)

One Three.js scene in the public landing hero visual column; subject = the logo mark extruded (`THREE.ExtrudeGeometry` from the SVG paths, bevelled) with flat materials read from CSS tokens at runtime so it follows the theme; img2threejs not required for this (it reconstructs from photos) but any future real-equipment model must use it and 3D-10; interaction = tilt toward pointer max 8°, ease back on leave, drag rotates within ±25°, "Reset view" button, no idle animation.

Everything else ("a 3D Maharashtra", "a spinning skill network", "a hero globe") is decorative and rejected.

### 27.4 Conditions when approved

- **3D-03. Performance.** Loaded lazily after the page is interactive, in its own chunk; not part of the initial bundle. Triangle budget ≤ 60k (the tool's "standard" tier). Frame rate ≥ 30fps on a mid-range Android device; otherwise show the fallback. LCP must be unaffected (the 3D canvas is never the LCP element).
- **3D-04. Fallback.** A static rendered image (captured by the tool's own screenshot step) is shown first and remains if WebGL is unavailable, `prefers-reduced-motion` is set, `navigator.connection.saveData` is true, or the device reports low memory.
- **3D-05. No autoplay motion.** The model is static until the user interacts. No auto-rotate loops.
- **3D-06. Interaction.** Orbit by drag, with visible "Rotate left/right" and "Reset view" buttons for keyboard and switch users. Page scroll is never captured by the canvas (wheel zoom disabled).
- **3D-07. Accessibility alternative.** The canvas has `role="img"` and a localized `aria-label`; a text description of what the model shows sits beside it. The content must be fully understandable without the model.
- **3D-08. Responsive.** Below `md`, show the static image only, with an optional "View in 3D" button.
- **3D-09. Honesty.** Label the model "Illustration" (the tool itself says a single image cannot guarantee accurate geometry). Never present it as a real specific machine at a specific ITI.
- **3D-10. Pipeline evidence.** A model is accepted only with the tool's own evidence: the `next.py` state file showing all mandatory steps complete, turntable captures, and the comparison sheet. Attach them to the PR.
- **3D-11. Dependency.** `three` is approved (UX-Q10). No react-three-fiber, drei or post-processing without a new decision.

---

## 28. Playwright Visual QA

Building successfully is not the same as being done. Every significant UI change goes through this loop.

### 28.1 Setup

```bash
# One-time, after architect approval (see §1.4)
npm install -g @playwright/cli@latest

# Run the app (from frontend/)
npm run dev          # serves http://localhost:3000 (vite.config.ts)
```

Screenshots go to `temp/ux-evidence/<branch>/` (`temp/` is git-ignored). Do not commit them; attach them to the PR (`gh pr comment <n> --attach <file>`, see `.agents/skills/playwright-cli/references/pr-attachments.md`). Note: the CLI's default `.playwright-cli/` output folder is not git-ignored; do not commit it.

If `playwright-cli` is not approved yet, run the identical steps in the Claude desktop in-app browser (`mcp__Claude_Browser__*` tools: `resize_window`, `navigate`, `read_console_messages`, `computer` screenshot) or Antigravity's browser, and record the same evidence.

### 28.2 Required viewports

| ID | Size | Represents | Required for |
|:---|:---|:---|:---|
| **L** | 1366 × 768 | Most common government laptop | All AppShell pages (primary review viewport) |
| **D** | 1440 × 900 | Desktop workstation | All pages |
| **T** | 768 × 1024 | Tablet portrait (drawer nav boundary) | All pages |
| **M** | 360 × 800 | Baseline Android phone | All Public and Candidate pages; AppShell pages must be usable (navigation, reading, primary action) |
| W | 1920 × 1080 | Large monitor | Dashboards (optional) |
| R | 320 × 800 | 400% zoom reflow | Public and Candidate pages |

### 28.3 The loop

```
IMPLEMENT → RUN → OPEN PAGE → CHECK CONSOLE → INTERACT → SCREENSHOT → INSPECT
    ↑                                                                   ↓
    └──────── FIX ← CLASSIFY (P0-P3) ← COMPARE WITH uiux.md ←──────── RESIZE
```

Mandatory steps for every significant UI change:

1. **Identify the target** page(s), role(s), and states in the handoff.
2. **Implement.**
3. **Run** `npm run dev` (and the backend if the feature is API-wired).
4. **Open** the page in a named session:
   ```bash
   playwright-cli -s=ux open http://localhost:3000/
   playwright-cli -s=ux localstorage-set i18nextLng en     # then repeat for mr and hi
   playwright-cli -s=ux goto http://localhost:3000/dashboard
   ```
5. **Select the role.** The persona store is not persisted, so a reload resets it; use the dev role switcher after each load. Its "DEV:" text is hidden below 640px, so target it by its title attribute:
   ```bash
   playwright-cli -s=ux click "button[title='Development Persona & Role Switcher']"
   playwright-cli -s=ux find "District Skill Officer"      # returns the option's ref
   playwright-cli -s=ux click <ref>
   ```
6. **Check console and network.** Zero errors and zero React warnings are required.
   ```bash
   playwright-cli -s=ux console warning
   playwright-cli -s=ux requests
   ```
7. **Test the primary interaction** (the handoff's main task), by keyboard first, then pointer:
   ```bash
   playwright-cli -s=ux press Tab               # first Tab must reveal the skip link
   playwright-cli -s=ux snapshot --boxes        # check focus order, target sizes, landmarks
   ```
8. **Capture screenshots** for each required viewport:
   ```bash
   playwright-cli -s=ux resize 1366 768
   playwright-cli -s=ux screenshot --filename=temp/ux-evidence/<branch>/dashboard-do-L-en.png
   ```
9. **Inspect** the screenshot using the checklist in §28.6.
10. **Check responsive** at T and M (and R where required):
    ```bash
    playwright-cli -s=ux resize 360 800
    playwright-cli -s=ux --raw eval "document.documentElement.scrollWidth > window.innerWidth"   # must be false
    ```
11. **Compare against uiux.md**: run the §5.3 mechanical checks on changed files and walk §32.
12. **Fix** every P0 and P1 finding (§29.2).
13. **Repeat** from step 3 until no P0/P1 remains. Record P2/P3 in the PR under "Observations".

### 28.4 Exercising states

For API-wired features, mock responses with the CLI (see `references/request-mocking.md`). Paths follow `docs/03-api/openapi.yaml`.

```bash
# Empty
playwright-cli -s=ux route "**/v1/gap-scores*" --body='{"success":true,"data":[],"meta":{"total":0}}' --content-type=application/json
# Error with trace id
playwright-cli -s=ux route "**/v1/gap-scores*" --status=500 --body='{"success":false,"data":null,"error":{"code":"INTERNAL_ERROR","message":"x"},"traceId":"01J9TEST"}' --content-type=application/json
# Scope denied
playwright-cli -s=ux route "**/v1/districts/21*" --status=403 --body='{"success":false,"data":null,"error":{"code":"AUTH_SCOPE_RESTRICTED","message":"x"}}' --content-type=application/json
# Slow (loading skeletons)
playwright-cli -s=ux run-code "async page => { await page.route('**/v1/gap-scores*', async r => { await new Promise(f => setTimeout(f, 3000)); await r.continue(); }); }"
# Offline
playwright-cli -s=ux run-code "async page => { await page.context().setOffline(true); }"
# Reduced motion
playwright-cli -s=ux run-code "async page => { await page.emulateMedia({ reducedMotion: 'reduce' }); }"
# Text spacing (WCAG 1.4.12)
playwright-cli -s=ux run-code "async page => { await page.addStyleTag({ content: '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }' }); }"
# Remove all mocks
playwright-cli -s=ux unroute
```

Features that still read from mock files (`*Data.ts`) cannot be driven by route mocking. For those, verify loading, empty and error states with component tests (Vitest, with MSW which is already a dev dependency) and state the limitation in the PR.

### 28.5 Required scenarios per major workflow

| Scenario | What to capture |
|:---|:---|
| Happy path | Each step of the primary task, at L and M |
| Empty | First-use and no-results variants |
| Error | Widget error, page error, and the relevant 403/409/422 |
| Loading | Skeleton state (3s delay) |
| Edge cases | Longest Marathi strings; 0 values; 100% values; 36 districts all critical; 1 row; 10,000-row validation grid; very long entity names; missing optional fields |
| Language | `mr` at L and M, `hi` at L, `en` at L |
| Role | Every role that can reach the page, including a role that can see but not act |

### 28.6 Screenshot inspection checklist

For each screenshot, check and note findings with the rule ID:

1. **Squint:** blur your eyes or view at 25%. Is the most important region obvious? (HIE-01)
2. **Grayscale:** can severity, status and series be told apart without color? (A11Y-10). Use `run-code "async page => page.addStyleTag({content:'html{filter:grayscale(1)}'})"`.
3. **Alignment:** do edges line up on the 12-column grid; are numbers right-aligned?
4. **Spacing:** only scale values; consistent gaps between equivalent elements.
5. **Typography:** one H1; sizes from the scale; no clipped Devanagari; no sub-12px text.
6. **Overflow:** no horizontal page scroll; no text overflowing buttons, badges or cells; truncation has a tooltip.
7. **Charts:** non-zero height; axis labels readable; legend matches marks; "View as table" present.
8. **Tables:** sticky header works when scrolled; identity column sticky on horizontal scroll; row actions reachable.
9. **Overlays:** dialog centered and within 85dvh; focus trapped; nothing hidden under the header.
10. **Sticky elements:** header and bottom nav do not cover focused elements or content.
11. **Navigation:** active item correct; breadcrumb correct; mobile nav reachable.
12. **States:** loading, empty, error look like §20.
13. **Hover and focus:** capture at least one hovered row and one focused control per page.
14. **Content:** strings translated, specific, no raw enums, no em-dashes.

---

## 29. Visual Regression

### 29.1 Process

**Now (manual, required):** for every PR that changes UI, attach before and after screenshots at L and M for each changed page, in `en` and `mr`. Reviewers compare them against §28.6.

**Next (automated, once `@playwright/test` is approved):**

- A `frontend/tests/visual/` suite with `expect(page).toHaveScreenshot()` per page × role × viewport (L, T, M) × state (default, empty, error).
- Deterministic rendering: mocked API responses (route fixtures), fixed clock (`page.clock.setFixedTime`), `animations: 'disabled'`, `reducedMotion: 'reduce'`, fonts awaited (`document.fonts.ready`), locale fixed per test.
- Thresholds: `maxDiffPixelRatio: 0.01` for full pages; `0` for component-level shots.
- Baselines are generated and compared only in the Linux CI container (font rendering differs on Windows and macOS). Local runs are for debugging.
- Baseline updates (`--update-snapshots`) require the PR to state why the visual change is intended and to include the diff images.
- The axe scan runs in the same suite (A11Y-21).

### 29.2 Severity

| Level | Definition | Examples | Gate |
|:---|:---|:---|:---|
| **P0 - blocks usability** | A user cannot complete the task, is misled, or is excluded | Primary action hidden or unreachable; page crashes; keyboard trap; data shown for the wrong scope; individual candidate data exposed; wrong number displayed; text unreadable (contrast < 3:1); horizontal page scroll that hides content on mobile | Must fix before merge |
| **P1 - major defect** | The task is possible but significantly harder, or a required rule is broken | Missing loading/empty/error state; severity by color only; unexplained score; chart without table alternative; clipped Devanagari; focus ring missing; overlapping elements; table unusable on mobile; untranslated strings; console errors; contrast between 3:1 and 4.5:1 on body text; prohibited styles (§6.1) | Must fix before merge |
| **P2 - noticeable inconsistency** | Works, but deviates from the system | Off-scale spacing; wrong radius; raw palette class; inconsistent icon; wrong button variant hierarchy; numbers not right-aligned; non-specific label | Fix in the same PR if touched; otherwise log as follow-up |
| **P3 - polish** | Minor visual refinement | 1-2px misalignment; slightly uneven wrapping; tooltip delay | Log |

**VRG-01.** A feature is not complete while any P0 or P1 finding is open. **VRG-02.** Findings are recorded as `[P1][TBL-04] Numbers centered in Priority table, dashboard, L, en`.

---

## 30. Anti-Patterns

Any of these in a PR is a defect at the listed severity.

| Anti-pattern | What it looks like | Severity | Do instead |
|:---|:---|:---|:---|
| Generic AI dashboard | Gradient header, "Command Center" title, four icon-tile KPI cards, pulsing live dot | P1 | §14.2 anatomy |
| Card-grid overload | Every section in its own card; equal cards in rows | P2 | LAY-01, HIE-01 |
| Nested cards | Card inside card | P2 | LAY-02 |
| Excessive rounding | `rounded-xl`/`2xl`, pill buttons | P2 | RAD-01 |
| Random gradients | Background washes, gradient text | P1 | Plain surfaces |
| Glassmorphism | `backdrop-blur` panels, translucent cards | P1 | Solid surfaces |
| Giant typography | `text-5xl`+ in AppShell; `font-extrabold` | P2 | §8.2 |
| Low-information decoration | Sparkles, colored icon tiles, decorative dots, wavy underlines | P2 | ICN-05 |
| Excessive shadows | `shadow-lg` on static cards; hover lift on non-clickable cards | P2 | SHD-01 |
| Arbitrary colors | Indigo severity, emerald placement text, raw palette classes | P2 (P1 if meaning changes) | §9 |
| Inconsistent icons | Two icons for one concept, mixed families | P2 | ICN-06 |
| Nested modals | Dialog opening a dialog | P1 | OVL-02 |
| Cramped tables | 10-11px text, centered numbers, 12 columns at 1366 | P1 | §16 |
| Hidden critical actions | Approve only in an overflow menu; primary action hidden on mobile | P0 | TBL-18, RSP-02 |
| Unexplained AI scores | "AI Score 91%", bare match percentages | P1 | §19 |
| Decorative 3D | Globes, 3D maps, spinning models | P1 | §27 |
| Excessive animation | Spinning icons, count-ups, long chart animations | P2 | §22 |
| Mobile overflow | Page scrolls sideways; buttons overflow | P0/P1 | RSP-01 |
| Inaccessible charts | No table alternative, color-only series, hover-only tooltips | P1 | VIZ-07, VIZ-10 |
| Inconsistent states | Some widgets with skeletons, others blank; generic errors | P1 | §20 |
| Hard-coded or mixed-language strings | `isMarathi ? 'x' : 'y'`, Marathi fallbacks in `t()` | P1 | CNT-10 |
| Raw enums on screen | `HIGH`, `UNDER_REVIEW` shown as-is | P1 | TYP-09 |
| Fake numbers | Hard-coded "+18% YoY" | P1 | P13 |
| Candidate data exposure | Any officer view of an individual trainee | P0 | ENT-05 |
| Placeholder routes looking finished | Heading-only pages in navigation without "Coming in Phase 3" | P2 | Mark as not yet available |

---

## 31. UX Decision Framework

When several choices are valid, decide in this order and stop at the first criterion that separates them:

1. **User task:** which option lets the role finish its primary task (§23.1) fastest and with fewest errors?
2. **Information hierarchy:** which keeps the one most important thing dominant (§13)?
3. **Accessibility:** which meets §21 with less risk?
4. **Consistency:** which reuses an existing component or pattern?
5. **Performance:** which renders faster on a mid-range device and weak network?
6. **Responsiveness:** which adapts better to T and M?
7. **Visual refinement:** which looks calmer and more precise?
8. **Novelty:** last, and only if 1 to 7 are equal.

**DEC-01.** Write the deciding criterion in the PR when you choose between alternatives ("Chose a table over cards on mobile: comparison task, criterion 1").

**DEC-02.** If the decision is not covered by this document and affects more than one screen, stop and raise a `UX-Q` rather than inventing a pattern.

Worked examples:

| Choice | Decision | Deciding criterion |
|:---|:---|:---|
| Heatmap tile grid vs choropleth for mobile | Tile grid | 1 (tap targets, readable names) |
| Drawer vs page for district detail on tablet | Drawer | 1 (keeps map context) |
| Donut vs horizontal bar for sector share | Horizontal bar | 2 and 3 |
| Custom date picker vs typed input | Typed input first | 3 and 4 |
| 3D equipment model vs photo on course page | Photo | 5 |

---

## 32. Definition of Done

A UI feature is complete only when every applicable box is checked. This extends `docs/11-agent-delivery/DEFINITION_OF_DONE.md`; it does not replace it. A passing build, passing tests, a working API or a rendering page is **not** sufficient.

**Understanding**
- [ ] Requirement understood; handoff states which decision-chain links the screen serves (PHI-01)
- [ ] User flow defined for each role that can reach the screen, including roles that can see but not act
- [ ] Information hierarchy established: one primary metric or lead visual (HIE-01)

**Build**
- [ ] Correct component patterns used from §25; no local primitives (CMP-03)
- [ ] Design tokens respected; §5.3 mechanical checks pass on changed files
- [ ] No unnecessary custom styling; no arbitrary values
- [ ] Responsive behavior implemented per §11.3 for every layout
- [ ] Loading state implemented (§20.1)
- [ ] Empty state implemented (§20.2)
- [ ] Error state implemented, mapped by error code (§20.3)
- [ ] Partial and stale data handled where the data can be incomplete (§20.4)
- [ ] Interaction states implemented (§25.1)
- [ ] All strings in `mr`, `hi`, `en`; no raw enums; copy self-audit done (§24.3)
- [ ] No unexplained AI or analytics output; scores have reasons, rates have `n` (§19)

**Accessibility**
- [ ] Keyboard walk complete; focus visible and not obscured
- [ ] axe scan 0 violations (or manual equivalent until `@playwright/test` is approved)
- [ ] Color-independent meaning verified in grayscale
- [ ] Reduced motion verified

**Verification**
- [ ] §28 loop run; console clean (no errors or React warnings)
- [ ] Screenshots reviewed at L, D, T, M (and R for public/candidate pages), in `en` and `mr`, and in dark mode at L and M
- [ ] Required scenarios captured (§28.5)
- [ ] All P0 and P1 findings fixed; P2/P3 logged
- [ ] Performance: LCP < 2.5s, CLS < 0.1 on the page (Lighthouse or Playwright trace), dashboard render < 2.0s (PRD NFR)

**Documentation**
- [ ] Any new pattern or token added to this document in the same PR (TOK-02, CMP-02)
- [ ] Deviations from this document listed with reasons

---

## 33. AI Agent Implementation Rules

These rules apply to any AI agent (Antigravity, Claude Code, others) implementing MahaSkills UI.

- **AI-01. Read before building.** Read the handoff, this document's sections relevant to the screen, the PRD section, and the existing components. Do not start from a generic template.
- **AI-02. Declare the read.** In the implementation plan, state: the shell, dial values (§4.1), the page layout (§10.5), the hierarchy stack (§13), the components used (§25), and the states to implement.
- **AI-03. Use the system, never a new one.** DO use shadcn/Radix primitives and the tokens in §7. DO NOT install or mimic another design system, style preset or icon set.
- **AI-04. No raw values.** DO use semantic token classes. DO NOT use hex, raw palette classes, arbitrary pixel values or arbitrary z-indexes.
- **AI-05. Verify dependencies.** DO check `frontend/package.json` before importing. DO NOT add a dependency without architect approval (`GUARDRAILS.md`); state the install command in the plan instead.
- **AI-06. Strings.** DO add every string to all three locale files in the same change. DO NOT branch on `i18n.language` to pick a string.
- **AI-07. States are part of the feature.** DO implement loading, empty, error (and partial where relevant) in the same PR as the happy path.
- **AI-08. Explain, don't assert.** DO render backend reasons, factors, sources, sample sizes and freshness. DO NOT show a score, rate or recommendation without them. DO NOT generate explanatory text in the client.
- **AI-09. Don't change what users rely on.** DO NOT rename routes, navigation labels, form field names or analytics identifiers without approval (Taste §11.F).
- **AI-10. Privacy.** DO NOT render, log or put into URLs any candidate identifier. DO NOT add candidate search.
- **AI-11. Scope.** DO render scoped filters as locked. DO NOT hide scope or widen it client-side.
- **AI-12. Verify visually.** DO run the §28 loop and attach evidence. DO NOT declare a UI task done because `npm run build` passed.
- **AI-13. Classify findings.** DO fix every P0/P1. DO list P2/P3 as observations. DO NOT fix unrelated screens in the same PR (scope creep, `GUARDRAILS.md`).
- **AI-14. When unsure, pick by §31.** If §31 does not resolve it and the choice affects more than one screen, stop and raise a `UX-Q`.
- **AI-15. Prefer fewer, better elements.** When choosing between adding a visual element and not adding it, do not add it unless it answers one of the five dashboard questions (§14.1) or a task step.
- **AI-16. Migrations.** When touching a file listed in Appendix A, fix the listed deviation in that file if it is within the handoff's scope; otherwise note it.
- **AI-17. Mechanical self-check.** DO run the §5.3 ripgrep checks on changed files and paste the counts in the PR.
- **AI-18. Cite rules.** DO reference rule IDs in PR descriptions for any non-obvious design decision.

---

## Appendix A. Current-state deviations and migrations

Found while reading the code on 2026-09-17. Each item names the rule it breaks. Fix within a handoff that already touches the file (AI-16), or as a dedicated design-system handoff (A-02).

| ID | Location | Deviation | Rule | Severity |
|:---|:---|:---|:---|:---|
| A-01 | `docs/04-design/DESIGN_SYSTEM.md` §1 | Hex comments do not match the HSL tokens | §7.2 note 1 | P3 |
| A-02 | `frontend/src/index.css`, `tailwind.config.js` | `--success`, `--warning`, `--info`, `-subtle`, `--gap-*`, `--chart-*` tokens documented but not defined; corrections C-02 to C-09 not applied | §7 | P1 |
| A-03 | `components/ui/button.tsx` | `outline`/`ghost` hover uses saffron `accent` with near-white text (2.8:1) | C-09, A11Y-09 | P1 |
| A-04 | `GapHeatmap.tsx`, `PriorityInterventionsTable.tsx` | Local severity maps; `MODERATE` is indigo; raw palette classes | P3, C-08, IMP-05 | P1 |
| A-05 | `components/ui/card.tsx` | `CardTitle` is always `h3` at `text-2xl` | TYP-05 | P2 |
| A-06 | `PriorityInterventionsTable.tsx` | Numbers centered; gap score `toFixed(1)`; `text-xs`/`text-[10px]`/`text-[11px]` in cells | TBL-04, NUM-06, IMP-02 | P1 |
| A-07 | `PriorityInterventionsTable.tsx`, `CourseCard.tsx` | Placement rate always green | COL-03 | P2 |
| A-08 | `docs/04-design/UI_UX_SPECIFICATION.md` §1.1 | Sidebar 260px vs code 256px | §10.3 | P3 |
| A-09 | `components/layout/AppShell.tsx` | Sidebar appears from 768px; no drawer for tablet; no navigation at all below 768px | §11.1, RSP-02 | P0 |
| A-10 | All shells | No skip link | A11Y-01 | P1 |
| A-11 | `AppShell.tsx` | Active nav is a solid primary fill; no `aria-current` | NAV-01 | P2 |
| A-12 | `GapHeatmap.tsx` | `text-[10px]` scores, `py-0.2` (invalid class), color-only severity on tiles, `title` attribute as the only oversupply label | GEO-07, GAP-01 | P1 |
| A-13 | `PathwayQuiz.tsx` | Spinning `Compass` icon; gradient header | MOT-04, IMP-01 | P2 |
| A-14 | `app/routes.tsx`, `DevRoleSwitcher.tsx` | One `/dashboard` for all roles; SSC reviewer, employer sent to a page not in their nav; no route guards | §23.1, NAV-07 | P1 |
| A-15 | `AppShell.tsx`, `Header.tsx`, `DashboardView.tsx`, `LandingPage.tsx`, `CourseCard.tsx` | `isMarathi ? … : …` string branching; Marathi text as `t()` fallback; English-only strings | CNT-10, IMP-08 | P1 |
| A-16 | `components/common/StatusBadge.tsx` | Prints raw enum; raw palette classes; `rounded-full` | TYP-09, TOK-01, RAD | P1 |
| A-17 | `DashboardView.tsx`, `PriorityInterventionsTable.tsx`, `CourseCard.tsx` | `Sparkles` and colored decorative icons | ICN-05 | P2 |
| A-18 | `DashboardView.tsx` | Gradient header, pulsing dot, `font-extrabold`, "Command Center" title, hard-coded "+18% YoY hiring", "34 / 38 (89%)" literals, KPIs as four separate cards with icons | §14.6, P13, IMP-01/03/04 | P1 |
| A-19 | `LandingPage.tsx` | Pulsing dot eyebrow; wavy saffron underline; `font-extrabold`; "62%+" target shown in a stats bar beside factual counts | IMP-03/04, P13 | P2 |
| A-20 | `Header.tsx` | Language buttons lack `aria-pressed`, group label and `lang`; `text-white` instead of token; dev switcher shown in all builds | NAV-10, NAV-09 | P1 |
| A-21 | `CourseCard.tsx` | `₹18.5k/mo` format; `text-[10px]` units; no `n` for placement rate | NUM-04, AIX-08 | P1 |
| A-22 | `components/ui/table.tsx` | Wrapper not keyboard-scrollable, no region label | TBL-20 | P2 |
| A-23 | `frontend/index.html` | Google Fonts `<link>` in production; favicon points to a missing `/favicon.ico` | §8.1, BRD-03 | P2 |
| A-24 | `useAuthStore.ts` | Demo personas use names that may belong to real officials | CNT-14 | P2 |
| A-25 | `frontend/src/features/**` | `rounded-xl` used for most containers | RAD-01 | P2 |

## Appendix B. Product-owner decisions

| ID | Question | Decision | Applied in |
|:---|:---|:---|:---|
| UX-Q1 | Gap severity levels | Three levels `LOW` (<40), `MEDIUM` (40-59), `HIGH` (≥60), matching backend | §7.3, DESIGN_SYSTEM.md |
| UX-Q2 | Dark mode scope | In scope for v1 (system default + manual toggle); light and dark are release gates | §4.3, §7.2a, §9.4 |
| UX-Q3 | Font self-hosting | Self-host fonts via `@fontsource/inter` and `@fontsource/noto-sans-devanagari`; remove Google Fonts `<link>` | §1.4, §8.1, TYP-02 |
| UX-Q4 | Number digits format | Latin digits with Indian grouping in all locales; no Devanagari digits | NUM-02 |
| UX-Q5 | Logo & brand assets | Create original MahaSkills logo mark + lockups. Never draw/imitate State Emblem or Maharashtra seal | §9.3, IMG-01, IMG-06, §26.3 |
| UX-Q6 | 3D visual use | 3D effect approved for landing hero only (extruded logo mark) | §1.4, §27.3 |
| UX-Q7 | Pathway match bands | 75-100 Strong match, 50-74 Good match, 0-49 Weak match (shown with warning-subtle note) | AIX-03 |
| UX-Q8 | Minimum sample threshold | Minimum sample size n ≥ 30 before showing placement rate | AIX-08 |
| UX-Q9 | User role model | One role per user; no production role switcher; dev switcher stays dev-only | ROL-06 |
| UX-Q10 | Approved dependencies | Approved dependencies (only these): `@playwright/test`, global `@playwright/cli`, `@radix-ui/react-tooltip`, `@radix-ui/react-popover`, `@radix-ui/react-checkbox`, `@radix-ui/react-radio-group`, `@radix-ui/react-collapsible`, `@radix-ui/react-progress`, `@fontsource/inter`, `@fontsource/noto-sans-devanagari`, `three`, `@types/three`, `cmdk` | §1.4, §27.4 |
| UX-Q11 | Design system corrections | Approved corrections C-02 to C-09 written back to DESIGN_SYSTEM.md | DESIGN_SYSTEM.md |

Delivery decision (same date): the frontend is rebuilt in place in `frontend/`, slice by slice.

## Appendix C. Change log

| Version | Date | Change |
|:---|:---|:---|
| 1.1 | 2026-09-17 | Product-owner decisions UX-Q1 to UX-Q11 applied. |
| 1.0 | 2026-09-17 | First version. Synthesised from Taste Skill, the Impeccable and awesome-design-skills presets, playwright-cli, img2threejs, the PRD, `docs/04-design/`, the backend specification and the current frontend code. |
