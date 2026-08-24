---
name: frontend-design
description: >-
  Pre-code design thinking framework for Google Antigravity & Gemini.
  Locks visual mood, typographic identity, color palette, spatial rhythm,
  and background textures before generating code to eliminate AI design slop.
---

# Frontend Design Thinking Framework (Gemini Edition)

Use this skill BEFORE writing any frontend code (React, Next.js, HTML, CSS, Tailwind).

## 1. Pre-Code Design Checklist (Mandatory Thinking Phase)

Before outputting a single line of code, document the following design choices:

1. **Target Audience & Emotion**:
   - Who is using this application? What primary emotion should it evoke? (e.g., *Engineering Precision*, *Editorial Sophistication*, *Cyberpunk Energy*, *Minimalist Luxury*).
2. **Dominant Visual Mood**:
   - Select one distinct aesthetic axis:
     - `Technical / Cloud Control Plane` (Dark-first, high density, crisp borders, monospaced metrics, subtle glow accents).
     - `Editorial / Magazine` (Large high-contrast serif typography, asymmetric grid, generous whitespace).
     - `Neo-Brutalist` (Heavy black borders, hard offset box-shadows, raw un-rounded corners, high-contrast primary colors).
     - `Glassmorphic / Futuristic` (Deep blurred backdrops, multi-layered translucency, hairline borders).
3. **Typographic Identity (Anti-Inter Rule)**:
   - **Never default to raw `Inter` or browser system-ui without intent**.
   - Combine a distinctive Display Header font with a clean body font:
     - *Technical/Cloud*: `Geist Sans` / `JetBrains Mono` or `Fira Code` for data.
     - *Editorial*: `Newsreader` / `Playfair Display` header + `Plus Jakarta Sans` body.
     - *Modern SaaS*: `Outfit` / `Space Grotesk` header + `Satoshi` body.
4. **Color System (Anti-Purple-Slop Rule)**:
   - **Banned**: `violet-600` / `purple-500` gradients on white backgrounds.
   - Use a intentional color hierarchy:
     - **Base Surface**: Tailored dark neutral (e.g., Slate 950 `#020617`, Zinc 950 `#09090b`, or Charcoal `#0f172a`).
     - **Primary Accent**: Single sharp brand color (e.g., Electric Blue `#2563eb`, Cyber Emerald `#10b981`, or Amber Glow `#f59e0b`).
     - **Muted Surfaces**: 4-level elevation step (`#090d16` -> `#0f172a` -> `#1e293b` -> `#334155`).
5. **Layout & Spatial Composition**:
   - **Banned**: Centered hero section + 3 identical feature cards grid.
   - Use asymmetric grids, split screens, sticky sidebar consoles, or dense multi-column telemetry dashboards.

---

## 2. Execution Principles

- **Design First, Code Second**: Write out the visual specification in markdown before code generation.
- **High Information Density**: Cloud provider and developer platforms require high data density without clutter.
- **Micro-Animations**: Add purpose-driven hover micro-interactions and status pulse indicators.
