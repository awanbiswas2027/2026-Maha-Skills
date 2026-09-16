# MahaSkills — Accessibility Specification (WCAG 2.1 AA & GIGW 3.0)

**Platform:** MahaSkills · Government of Maharashtra (DSEEI / MSInS)  
**Problem Statement ID:** 26134  
**Compliance Standards:** W3C WCAG 2.1 Level AA · Government of India Guidelines for Indian Government Websites (GIGW 3.0)  
**Version:** 1.0  
**Status:** Canonical Accessibility Baseline  

---

## 1. Statutory Compliance Requirements

Under India's **Rights of Persons with Disabilities Act, 2016** and **GIGW 3.0**, all digital platforms deployed by the Government of Maharashtra must adhere strictly to WCAG 2.1 Level AA guidelines. MahaSkills ensures complete accessibility across all citizen-facing and administrative portals.

---

## 2. Core Accessibility Pillars

### 2.1 Keyboard Navigation & Focus Management
* **Skip to Main Content:** Every page renders a hidden skip link (`#main-content`) as the first focusable element.
* **Visible Focus Indicator:** All interactive elements (links, buttons, form inputs) exhibit a distinct 2px solid primary focus ring with a 2px offset (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`).
* **Modal Traps:** Dialogs, sidebars, and slide-overs trap keyboard focus using Radix UI primitives. Pressing `Escape` closes the overlay and restores focus to the triggering element.

### 2.2 Screen Reader Support & ARIA Semantics
* **Semantic Landmarks:** Pages use `<header>`, `<nav>`, `<main id="main-content">`, `<aside>`, and `<footer>` landmarks.
* **Dynamic Content Announcements:** Live regions (`aria-live="polite"`) announce filter updates, CSV validation progress, and pathway quiz transitions.
* **Icon Buttons:** All icon-only triggers (e.g. search icons, language toggles, export buttons) include an explicit `aria-label` or visually hidden screen reader text (`<span className="sr-only">`).

### 2.3 Contrast & Color Independence
* **Text Contrast:** Normal body text satisfies a minimum contrast ratio of $4.5:1$ against the background; bold or large text ($\ge 18\text{pt}$) satisfies $3:1$.
* **Information Independence:** Information is never conveyed by color alone. Heatmaps and gap status badges pair color fills with descriptive text (`High`, `Medium`, `Low`) and distinct icon glyphs.

### 2.4 Multilingual Pronunciation & Language Attributes
* **HTML `lang` Attribute:** Dynamically updates on the root `<html>` element (`lang="mr"`, `lang="hi"`, `lang="en"`) to instruct screen readers to load the correct speech synthesis phoneme engine.
* **Inline Language Switches:** Any mixed text (e.g., an English technical term within a Marathi description) is wrapped in `<span lang="en">` to ensure accurate pronunciation.

### 2.5 Accessible Data Visualizations & Charts
* **Accessible Tables:** Every graphical chart (e.g. Recharts gap heatmaps, vacancy trend lines) provides an immediately adjacent "View as Accessible Data Table" toggle.
* **Keyboard Navigation in Charts:** Chart points and bar columns support keyboard navigation with tooltips exposed via `aria-describedby`.
