---
name: impeccable
description: >-
  Advanced design vocabulary, 23 steering commands, and 59-rule AI slop detector
  for Google Antigravity & Gemini to audit and eliminate generic AI design tells.
---

# Impeccable Design Steering & Anti-Slop Detector (Gemini Edition)

Impeccable equips Antigravity and Gemini with professional design vocabulary and automated audit detectors to fix generic AI-generated interfaces.

## 1. Commands Quick Reference

Use these slash commands or natural language directives during execution:

| Command | Action |
| :--- | :--- |
| `/impeccable init` | Interview product identity and write `PRODUCT.md` design system rules. |
| `/impeccable polish` | Final-pass cleanup, alignment check, border contrast, and micro-padding fix. |
| `/impeccable critique` | Detailed UX audit scoring typography, contrast, layout, and AI anti-patterns. |
| `/impeccable typeset` | Audit typography scale, font-weight contrast, line-height, and tracking. |
| `/impeccable layout` | Fix composition grid, spatial rhythm, column alignment, and asymmetry. |
| `/impeccable bolder` | Amplify a safe, boring UI into an assertive visual statement. |
| `/impeccable colorize` | Re-theme using curated, harmonious color palettes (no purple slop). |
| `/impeccable audit` | Scan codebase against the 59-rule AI Slop Detector. |
| `/impeccable live` | Interactively tune UI components with variant options. |

---

## 2. The 59-Rule AI Slop Detector

When auditing code, flag and eliminate the following AI tells:

### Anti-Pattern 1: Color & Gradients
- ❌ `bg-gradient-to-r from-purple-500 to-indigo-600` on white card backgrounds.
- ❌ Using raw `bg-white` and `bg-gray-100` without depth or border definition.
- ✅ *Fix*: Dark-first slate/zinc surface steps (`#020617` -> `#0f172a` -> `#1e293b`) with hairline 1px borders (`border-slate-800`).

### Anti-Pattern 2: Typography
- ❌ Single font-weight (`font-medium`) used across headers, labels, and body text.
- ❌ Missing tracking adjustments on uppercase labels.
- ✅ *Fix*: High contrast scale (`text-4xl font-extrabold` headers vs `text-xs uppercase tracking-wider text-slate-400` labels vs `font-mono text-emerald-400` data values).

### Anti-Pattern 3: Grid & Layout
- ❌ 3 centered feature cards with identical icon + title + description layout.
- ❌ Centered text align on wide multi-paragraph hero sections.
- ✅ *Fix*: Asymmetric multi-column layouts, data tables, split heroes, and sticky sidebars.

### Anti-Pattern 4: Micro-Interactions
- ❌ Static buttons with zero hover/active state feedback.
- ✅ *Fix*: Smooth 150ms transitions, hover shadow glow, border highlights, and status indicators.
