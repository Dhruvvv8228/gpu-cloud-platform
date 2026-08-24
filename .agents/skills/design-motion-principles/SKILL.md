---
name: design-motion-principles
description: >-
  Web motion and interaction audit framework for Google Antigravity & Gemini based on
  Emil Kowalski, Jakub Krehel, and Jhey Tompkins motion principles.
---

# Design Motion Principles (Gemini Edition)

Use this skill to audit and orchestrate web animations, micro-interactions, and physics-based transitions in React, Next.js, and CSS.

## 1. Motion Philosophies

### Lens 1: Emil Kowalski (Minimal & Polished SaaS Motion)
- **Principle**: Motion must be fast, predictable, and feel like physical weight.
- **Rules**:
  - Replace generic 500ms fade-ins with snappy **150ms - 220ms** transitions.
  - Pair opacity transitions with subtle spatial translation (**opacity 0->1 + translate-y 4px->0px**).
  - Use `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for natural decelerating entrance.

### Lens 2: Jakub Krehel (Physics & Interaction Orchestration)
- **Principle**: Hover and press states must instantly reflect user input.
- **Rules**:
  - Hover states trigger in **100ms**; press states shrink slightly (`scale-95`).
  - Active status indicators use multi-layer pulse rings instead of harsh blinking.

### Lens 3: Jhey Tompkins (Creative CSS & Micro-Details)
- **Principle**: Subtle CSS glowing borders, gradient shimmers, and backdrop blurs bring interfaces to life without JavaScript overhead.
- **Rules**:
  - Hardware-accelerated CSS properties (`transform`, `opacity`, `filter`).

---

## 2. Motion Audit & Fix Workflow

When evaluating UI motion:
1. **Check Duration**: Flag any transition over 300ms.
2. **Check Easing**: Flag linear transitions on UI element entrances.
3. **Orchestration**: Stagger list items by **30ms** per item.
