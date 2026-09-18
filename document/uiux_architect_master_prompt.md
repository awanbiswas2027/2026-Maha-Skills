# UI/UX Architect & Design Systems Specification Prompt

You are a Principal Product Designer, UX Architect, Design Systems Engineer, and Frontend Design Reviewer.

Your task is to CREATE or REWRITE a new file:

uiux.md

for the MahaSkills project.

The purpose of uiux.md is to become the project's authoritative UI/UX execution specification — a practical design and implementation contract that frontend developers and AI coding agents must follow.

============================================================
1. SOURCE MATERIALS — READ THESE FIRST
============================================================

Before writing uiux.md, inspect the repository and locate/read all relevant source materials, especially:

1. Taste Skills
2. Impeccable / Impeccable UI/UX guidance
3. playwright-cli
4. awesome-design.md
5. image2three.js
6. Existing PRD / product documentation
7. Existing frontend code
8. Existing design system/components
9. Existing screenshots/mockups/assets
10. Existing frontend architecture

Do NOT assume these resources are identical or interchangeable.

Treat each as a different source of knowledge.

Your job is to synthesize them into one coherent design system and implementation methodology.

If one of the named resources does not exist locally:

- search the repository
- inspect available skill/documentation directories
- inspect package/tooling configuration
- determine whether it exists under another name
- document the missing dependency instead of inventing its contents

Do not fabricate guidance from files you could not inspect.

============================================================
2. PRIMARY OBJECTIVE
============================================================

Create a comprehensive:

uiux.md

that answers:

“How should every screen, component, interaction, layout, visual element, responsive behavior, and UX decision in MahaSkills be designed and implemented?”

The document must be EXECUTABLE.

Another AI coding agent should be able to read uiux.md and make UI decisions without repeatedly asking:

- What should this look like?
- Which component should I use?
- How should spacing work?
- How should tables behave?
- How should dashboards be structured?
- When should charts be used?
- How should errors look?
- How should responsive behavior work?
- How should visual regression be checked?
- When should images or 3D be used?
- How should accessibility be handled?

============================================================
3. IMPORTANT DESIGN PRINCIPLE
============================================================

Do not create a generic “modern SaaS” design.

MahaSkills is an enterprise/government-scale labour-market intelligence platform.

The design must communicate:

- credibility
- intelligence
- institutional trust
- clarity
- analytical depth
- efficiency
- accessibility
- professionalism
- data confidence
- actionability

The interface must support:

DATA
→ INSIGHT
→ DECISION
→ ACTION
→ OUTCOME

Avoid design decisions that optimize visual novelty at the expense of comprehension.

============================================================
4. CREATE A DESIGN PHILOSOPHY
============================================================

Define the project's core design principles.

For every principle explain:

- what it means
- why it exists
- where it applies
- what to avoid
- implementation examples

Include principles around:

- hierarchy
- restraint
- consistency
- information density
- progressive disclosure
- contextual actions
- visual hierarchy
- cognitive load
- accessibility
- trust
- explainability
- responsiveness
- interaction quality

Do not use vague statements such as:

“Make it beautiful.”

Translate principles into observable UI behavior.

============================================================
5. USE TASTE SKILLS
============================================================

Extract useful visual/design heuristics from the Taste Skills material.

Convert them into concrete MahaSkills rules.

For example, define how the product should handle:

- visual hierarchy
- composition
- spacing
- typography
- scale
- contrast
- rhythm
- alignment
- density
- emphasis
- visual balance
- consistency

Do not copy generic theory without translating it into implementation rules.

Create explicit:

DO
and
DON'T

examples wherever useful.

============================================================
6. USE IMPECCABLE / IMPECCABLE UI GUIDANCE
============================================================

Use the available Impeccable guidance to establish a high-quality UI discipline.

Translate it into rules for:

- typography
- spacing
- component composition
- color usage
- visual polish
- hierarchy
- interaction states
- empty states
- loading states
- responsive layouts
- forms
- dashboards
- tables
- navigation
- accessibility
- micro-interactions

Explicitly prevent common AI-generated UI problems such as:

- excessive gradients
- excessive rounded cards
- unnecessary glassmorphism
- repetitive card grids
- arbitrary color usage
- huge headings
- poor typography hierarchy
- excessive empty space
- decorative icons everywhere
- inconsistent spacing
- default browser-looking forms
- generic dashboard layouts
- meaningless animations
- visual noise

============================================================
7. USE awesome-design.md
============================================================

Read awesome-design.md carefully.

Extract useful patterns and design practices.

Then determine:

- which practices should become project-wide standards
- which are inappropriate for MahaSkills
- which should only be used in specific contexts

Do not blindly copy another design system.

Create a MahaSkills-specific adaptation.

============================================================
8. USE PLAYWRIGHT-CLI AS A DESIGN QA SYSTEM
============================================================

Playwright is not merely for functional testing.

Use playwright-cli as part of the UI/UX development loop.

Define how AI/frontend agents should use it to:

1. launch the application
2. navigate to target pages
3. inspect viewport behavior
4. capture screenshots
5. test interactions
6. inspect responsive layouts
7. verify states
8. identify visual regressions
9. compare intended vs actual UI

Create a repeatable visual QA loop:

IMPLEMENT
→ RUN
→ OPEN PAGE
→ SCREENSHOT
→ INSPECT
→ IDENTIFY ISSUES
→ FIX
→ RE-RUN
→ VERIFY

Define required viewport checks, for example:

- desktop
- laptop
- tablet
- mobile

Use realistic viewport sizes.

Require screenshot evidence for major screens.

Do not declare a UI finished simply because the React build succeeds.

============================================================
9. VISUAL REGRESSION PROCESS
============================================================

Define a visual acceptance process.

For every major page verify:

- alignment
- spacing
- typography
- hierarchy
- overflow
- chart sizing
- table behavior
- modal behavior
- sticky elements
- responsive navigation
- loading states
- error states
- empty states
- hover states
- focus states

Create a severity system:

P0 — blocks usability
P1 — major visual/interaction defect
P2 — noticeable inconsistency
P3 — polish issue

Require P0/P1 issues to be fixed before a feature is considered complete.

============================================================
10. IMAGE2THREE.JS
============================================================

Read and understand image2three.js before deciding how it should be used.

Do not insert 3D merely because 3D is possible.

Define explicit rules for when 3D is appropriate.

Possible use cases may include:

- high-level product storytelling
- strategic visualizations
- geographic/structural representations
- concept visualization
- selected landing/overview sections

Do NOT use 3D for:

- dense administrative tables
- forms
- ordinary CRUD screens
- workflows where it increases cognitive load
- critical information that must remain instantly readable

If image2three.js is used:

- define performance expectations
- define fallback behavior
- define accessibility alternatives
- define responsive behavior
- define interaction principles
- prevent decorative 3D from interfering with task completion

============================================================
11. DESIGN SYSTEM
============================================================

Define a complete design-token strategy.

Document:

COLOR
- primary
- secondary
- surface
- background
- border
- text
- muted text
- success
- warning
- danger
- info
- chart colors

TYPOGRAPHY
- font family
- display sizes
- headings
- body
- captions
- labels
- numeric/data typography

SPACING
- base unit
- spacing scale
- section spacing
- component spacing

RADIUS
- small
- medium
- large
- special cases

SHADOWS
- subtle
- elevated
- modal

MOTION
- durations
- easing
- reduced-motion behavior

Define actual values or token names wherever the existing code/design system already establishes them.

Do not invent arbitrary values when existing project tokens exist.

============================================================
12. LAYOUT SYSTEM
============================================================

Define:

- global max-width behavior
- page gutters
- grid system
- sidebar width
- topbar height
- content density
- dashboard layout
- detail page layout
- table page layout
- form page layout
- modal sizing
- drawer sizing

Explain how layouts transform across breakpoints.

============================================================
13. INFORMATION HIERARCHY
============================================================

Define a consistent hierarchy for data-heavy pages.

For example:

Page
→ Context
→ Primary metric
→ Main insight
→ Supporting evidence
→ Detail
→ Action

Apply this to:

- dashboards
- labour-market analytics
- skill-gap pages
- curriculum pages
- candidate profiles
- job pages
- training pages
- placement pages

Prevent pages from becoming collections of visually equal cards.

============================================================
14. DASHBOARD DESIGN RULES
============================================================

Define exactly how dashboards should be designed.

Include:

- KPI hierarchy
- metric cards
- trend indicators
- charts
- insight summaries
- filters
- time-range controls
- drill-down
- alerts
- recommendations

Important rule:

A dashboard should help a user answer:

What changed?
Why did it change?
Why does it matter?
What should I inspect next?
What action can I take?

Avoid decorative dashboards.

============================================================
15. DATA VISUALIZATION RULES
============================================================

Define when to use:

- line chart
- bar chart
- stacked bar
- area chart
- heatmap
- scatter plot
- geographic visualization
- ranking table
- KPI
- progress visualization

Define:

- chart title
- subtitle
- units
- tooltip
- legend
- empty state
- error state
- accessible alternative

Explicitly define visualization anti-patterns.

Do not use charts solely because they look sophisticated.

============================================================
16. TABLES
============================================================

Define enterprise table standards.

Include:

- column hierarchy
- alignment
- density
- sorting
- filtering
- pagination
- selection
- bulk actions
- row actions
- sticky headers
- responsive behavior
- horizontal scrolling rules
- empty state
- loading state
- error state

Determine when a table should become cards on mobile.

============================================================
17. FORMS
============================================================

Define standards for:

- field grouping
- labels
- helper text
- validation
- errors
- required fields
- disabled states
- loading states
- success states
- destructive actions
- multi-step forms

Explain how complex enterprise forms should be structured.

Avoid unnecessarily long single-page forms.

============================================================
18. ENTITY DETAIL PAGES
============================================================

Define a consistent structure for:

- candidate profile
- employer profile
- job detail
- institution
- curriculum
- training course
- placement

Example:

Header
→ Identity
→ Key metrics
→ Primary status
→ Main information
→ Related data
→ Timeline
→ Actions

Do not force every entity to have the same layout when their workflows differ.

============================================================
19. MATCHING & AI UX
============================================================

Matching and recommendation interfaces must be explainable.

Never show:

“AI Score: 91%”

without context.

Instead expose relevant factors such as:

Skill compatibility
Experience compatibility
Education compatibility
Location compatibility
Missing requirements
Recommendation reasons

Define UX patterns for:

- confidence
- uncertainty
- explanation
- recommendation
- evidence
- feedback

The design should help the user understand the recommendation rather than blindly trust it.

============================================================
20. LOADING / EMPTY / ERROR STATES
============================================================

Define standardized UX patterns for:

LOADING
- skeletons
- progressive rendering
- spinner only where appropriate

EMPTY
- explain why the space is empty
- provide useful next action

ERROR
- explain what happened
- provide recovery
- avoid generic “Something went wrong”

PARTIAL DATA
- clearly indicate incompleteness

OFFLINE / NETWORK FAILURE
- define behavior where relevant

============================================================
21. ACCESSIBILITY
============================================================

Define accessibility as a design requirement.

Cover:

- keyboard navigation
- focus states
- semantic structure
- contrast
- labels
- error messaging
- accessible dialogs
- accessible tables
- chart alternatives
- reduced motion
- screen readers
- touch target sizing

Prefer WCAG-oriented implementation practices.

Do not treat accessibility as a final checklist.

============================================================
22. MOTION
============================================================

Define:

- where motion is useful
- where it is prohibited
- transition duration
- easing
- enter/exit patterns
- loading transitions
- navigation transitions
- reduced-motion behavior

Motion should communicate:

- hierarchy
- cause/effect
- state change
- continuity

Never use motion only to make a UI appear “fancy.”

============================================================
23. RESPONSIVE DESIGN
============================================================

Define behavior for:

- desktop
- laptop
- tablet
- mobile

Do not simply scale desktop UI downward.

For every major component specify whether it should:

- resize
- stack
- collapse
- scroll
- transform into cards
- move actions
- simplify
- hide secondary information

Prioritize task completion over visual fidelity to desktop.

============================================================
24. NAVIGATION
============================================================

Define standards for:

- sidebar
- topbar
- breadcrumbs
- tabs
- contextual navigation
- detail → list navigation
- drill-down navigation
- back navigation
- deep links

Navigation must preserve context.

For example:

Labour Market
→ Skill Demand
→ Python
→ Maharashtra
→ District
→ Employer

A user should understand where they are and how to return.

============================================================
25. ROLE-BASED UX
============================================================

MahaSkills has different user roles.

Define how UX changes according to role.

Do not simply hide random navigation items.

Explain:

- what each role needs to know
- primary tasks
- information priority
- default dashboard
- actions
- permissions
- terminology

The role model must come from the PRD.

============================================================
26. DESIGN FOR GOVERNMENT / ENTERPRISE CONTEXT
============================================================

The interface must account for:

- high information density
- long workflows
- repeat users
- administrative users
- auditability
- clarity
- reliability
- potentially slower environments
- accessibility
- multilingual expansion where relevant

Avoid consumer-app patterns that reduce efficiency for professional users.

============================================================
27. CONTENT DESIGN
============================================================

Define UX writing standards.

Text should be:

- precise
- concise
- neutral
- action-oriented
- understandable

Avoid vague labels such as:

“Proceed”
“Continue”
“Manage”
“More”

when more specific language is possible.

Example:

Bad:
“Manage”

Better:
“Review curriculum gaps”

============================================================
28. ICONOGRAPHY
============================================================

Define:

- icon style
- size
- stroke consistency
- semantic usage
- tooltip rules
- when icon-only buttons are allowed

Never use icons as decoration without meaning.

============================================================
29. COMPONENT LIBRARY
============================================================

Define required reusable components.

At minimum evaluate:

- Button
- IconButton
- Input
- Select
- Combobox
- DatePicker
- FilterBar
- Tabs
- Modal
- Drawer
- Toast
- Tooltip
- Breadcrumb
- Badge
- Status
- KPI
- DataTable
- Pagination
- ChartCard
- InsightCard
- RecommendationCard
- Timeline
- EmptyState
- ErrorState
- Skeleton
- Search
- EntityHeader

Document:

- purpose
- usage
- variants
- states
- responsive behavior
- accessibility requirements

============================================================
30. AI AGENT IMPLEMENTATION RULES
============================================================

This document will be consumed by AI coding agents.

Therefore every important rule should be:

- explicit
- deterministic
- testable

Use formulations such as:

“DO X when Y.”

“DO NOT use X for Y.”

“Prefer A over B when C.”

Avoid vague statements such as:

“Keep the UI elegant.”

============================================================
31. PLAYWRIGHT-BASED IMPLEMENTATION LOOP
============================================================

Define a mandatory loop for every significant UI change:

1. Identify target page.
2. Implement.
3. Run the application.
4. Use playwright-cli.
5. Navigate to the page.
6. Check console/runtime errors.
7. Test the primary interaction.
8. Capture screenshot.
9. Inspect layout.
10. Check responsive viewport.
11. Compare against uiux.md.
12. Fix defects.
13. Repeat until acceptable.

For major workflows include:

- happy path
- empty state
- error state
- loading state
- edge case

============================================================
32. VISUAL QUALITY GATE
============================================================

A page is NOT complete merely because:

- TypeScript compiles
- tests pass
- API works
- page renders

A page is complete only when:

- hierarchy is correct
- spacing is consistent
- typography is correct
- interaction states work
- responsive behavior works
- accessibility is acceptable
- visual regression is checked
- no major console errors exist
- primary workflow is usable

============================================================
33. ANTI-PATTERN LIBRARY
============================================================

Create a section explicitly documenting things the project must avoid.

Include examples of:

- generic AI dashboard
- card-grid overload
- excessive rounded containers
- random gradients
- giant typography
- low-information decoration
- excessive shadows
- arbitrary colors
- inconsistent icons
- nested modals
- cramped tables
- hidden critical actions
- unexplained AI scores
- decorative 3D
- excessive animation
- mobile overflow
- inaccessible charts
- inconsistent states

============================================================
34. DECISION FRAMEWORK
============================================================

When there are multiple valid UI choices, use this order:

1. User task
2. Information hierarchy
3. Accessibility
4. Consistency
5. Performance
6. Responsiveness
7. Visual refinement
8. Novelty

Do not choose a visual pattern merely because it looks impressive.

============================================================
35. DOCUMENT STRUCTURE
============================================================

The final uiux.md should contain:

# MahaSkills UI/UX Specification

## 1. Purpose
## 2. Product Design Philosophy
## 3. Design Principles
## 4. Taste Skills Integration
## 5. Impeccable UI Principles
## 6. awesome-design.md Integration
## 7. Design Tokens
## 8. Typography
## 9. Color System
## 10. Spacing & Layout
## 11. Grid & Responsive System
## 12. Navigation
## 13. Information Hierarchy
## 14. Dashboard Design
## 15. Data Visualization
## 16. Tables
## 17. Forms
## 18. Entity Detail Pages
## 19. AI / Recommendation UX
## 20. Loading / Empty / Error States
## 21. Accessibility
## 22. Motion
## 23. Role-Based UX
## 24. Content Design
## 25. Component Library
## 26. Image & Media Guidelines
## 27. image2three.js Usage
## 28. Playwright Visual QA
## 29. Visual Regression
## 30. Anti-Patterns
## 31. UX Decision Framework
## 32. Definition of Done
## 33. AI Agent Implementation Rules

============================================================
36. DEFINITION OF DONE
============================================================

Create a clear UI/UX Definition of Done.

A feature is complete only when:

[ ] Requirement understood
[ ] User flow defined
[ ] Appropriate information hierarchy established
[ ] Correct component patterns used
[ ] Responsive behavior defined
[ ] Accessibility handled
[ ] Loading state implemented
[ ] Empty state implemented
[ ] Error state implemented
[ ] Interaction states implemented
[ ] Playwright checked
[ ] Screenshot reviewed
[ ] Major visual issues fixed
[ ] No major console/runtime errors
[ ] Design tokens respected
[ ] No unnecessary custom styling
[ ] No unexplained AI/analytics behavior
[ ] Documentation updated when a new design pattern is introduced

============================================================
37. IMPORTANT
============================================================

Do not create uiux.md as a theoretical design essay.

It must be an ENGINEERING-READY UI/UX CONTRACT.

A frontend developer should be able to take:

PRD
+
uiux.md

and consistently implement the product.

An AI coding agent should be able to use:

uiux.md
+
Playwright
+
existing component system

to implement and visually verify each feature without inventing its own design language.

============================================================
38. FINAL SELF-REVIEW
============================================================

Before saving uiux.md, review the document as:

1. Principal Product Designer
2. Accessibility specialist
3. Frontend architect
4. Design-system engineer
5. AI coding-agent evaluator

Ask:

- Are the rules specific enough to implement?
- Are design decisions explainable?
- Are they consistent?
- Are they measurable?
- Are they compatible with the actual project?
- Does the document prevent generic AI-generated UI?
- Does it define responsive behavior?
- Does it define states?
- Does it define visual QA?
- Does Playwright have a real role?
- Is image2three.js used selectively rather than decoratively?
- Can a new developer understand how to extend the design system?
- Can an AI agent make a design decision without guessing?

Fix weaknesses before finishing.

OUTPUT:

Create/update ONLY:

uiux.md

Do not modify application code unless explicitly requested.

After creating uiux.md, provide a concise summary of:

- what was incorporated from each source
- major design principles established
- Playwright QA methodology
- image2three.js usage rules
- any source material that could not be located
- any assumptions that still require product-owner confirmation
