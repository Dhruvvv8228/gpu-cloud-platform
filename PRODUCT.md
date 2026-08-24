# PRODUCT.md - Product Identity & Design System Specification

## 1. Product Core Positioning
- **Product Name**: NVIDIA GPU Cloud Compute Marketplace & Control Plane
- **Primary Tagline**: *NVIDIA GPU Compute. On Demand.*
- **Supporting Tagline**: *Deploy high-performance GPU infrastructure by the hour for AI, ML, inference, training, computer vision and high-performance workloads.*
- **Target Audience**: AI Researchers, Machine Learning Engineers, MLOps Teams, Computer Vision Developers, and Enterprise Infrastructure Architects.
- **Brand Personality**: Technical, Precise, Assertive, Ultra-Performant, Sophisticated.

---

## 2. Aesthetic Axis & Visual Mood
- **Visual Aesthetic**: `Technical / Cloud Control Plane`
- **Surface Elevation Steps**:
  - **Base Canvas**: `#020617` (`slate-950`)
  - **Level 1 Elevation (Cards & Widgets)**: `rgba(15, 23, 42, 0.65)` (`slate-900/65` with `backdrop-blur-md`)
  - **Level 2 Elevation (Modals & Deep Panels)**: `rgba(2, 6, 23, 0.85)` (`slate-950/85`)
- **Border Rules**: Hairline 1px borders (`rgba(255, 255, 255, 0.08)` or `slate-800/80`). Zero raw borderless white components.

---

## 3. Typographic Identity & Anti-Slop Scale
- **Display & Section Headers**: Sans-Serif Bold (`font-extrabold tracking-tight text-white`).
- **Telemetry & Data Metrics**: Monospaced Font (`JetBrains Mono` / `font-mono`) for GPU model codes, VRAM capacities, TFLOPS performance metrics, IP addresses, customer instance IDs, and wallet ledger balances.
- **Meta Labels & Badges**: Monospaced Uppercase Tracking (`text-[10px] uppercase tracking-wider font-mono font-semibold text-slate-500`).

---

## 4. Color Palette Tokens
- **Background Slate**: `#020617` (`bg-slate-950`)
- **Primary Accent**: Electric Blue `#2563eb` (`bg-blue-600`) - Used for primary CTAs and active navigation tabs.
- **Status Emerald**: Cyber Emerald `#10b981` (`text-emerald-400`, `bg-emerald-950`) - Used for online status pills, live uptime, and positive ledger deposits.
- **Warning Amber**: Amber Glow `#f59e0b` (`text-amber-400`) - Used for node halting, burn rates, and resource alerts.
- **Critical Red**: Destructive Red `#ef4444` (`text-red-400`) - Used for instance termination and key revocation.

---

## 5. Motion Principles (Kowalski / Krehel / Tompkins)
- **Entrance Durations**: **180ms cubic-bezier(0.16, 1, 0.3, 1)** with `opacity 0 -> 1` and `translate-y(4px -> 0px)`.
- **Hover Micro-Feedback**: **100ms** duration with `-2px` Y-axis lift, border highlight, and subtle blue/emerald shadow glow.
- **Button Physics**: Active state compression (`scale(0.97)`).
- **Status Indicators**: Multi-layer CSS animated pulse rings for active `RUNNING` nodes.

---

## 6. AI Slop Prevention Rules (59-Rule Audit)
1. **No Purple-on-White Gradients**: Never use `purple-500 to indigo-600` gradients on white backgrounds.
2. **No Centered 3-Card Feature Grids**: Use asymmetric multi-column layouts, sticky sidebar consoles, or dense data telemetry tables.
3. **No Un-styled Text Buttons**: All buttons must have explicit background step, border, hover transition, and active compression states.
4. **No Raw Provider Detail Leaks**: Never expose internal provider IDs (`vm-nebius-123`). Customers receive clean platform IDs (`inst_419413`).
