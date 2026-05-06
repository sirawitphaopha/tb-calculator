# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A static single-page TB dose calculator for adults (>15 years) based on Thai NTP 2021 and WHO 2025 guidelines. No build system, no dependencies, no backend — just three files served directly from the filesystem or any static host.

- `index.html` — all markup; loads Tailwind CSS from CDN, Google Fonts (Prompt), `style.css`, and `script.js`
- `script.js` — all application logic (~1,000 lines of vanilla JavaScript)
- `style.css` — custom styles: input validation states, mobile grid layout, `renal-blink` animation

## Running the App

Open `index.html` directly in a browser. No server, no install, no build step required.

To simulate a static server locally:
```
python3 -m http.server 8080
```
Then visit `http://localhost:8080`.

## Architecture of `script.js`

### Data Flow

Every input change (weight, height, age, gender, Serum Cr) calls `calculate()`, which re-renders all three drug tables completely. User-entered actual doses are preserved across re-renders via the module-level `doseCache` object (keyed by drug name).

### Key Functions

**Drug dose helpers** (`hDose`, `rDose`, `zDose`, `eDose`, `sDose`) — take weight (and age for Streptomycin) and return `{mg, tab, warn, warnMsg?}`. The `tab` field is a Thai-language string like `"R300 × 1 แคป"`. These encode the discrete pill/capsule sizes available in Thai hospitals.

**`calculate()`** — the main engine. Runs on every input event:
1. Validates all inputs via `validateField()` / `validateWeight()`; returns early with error state if invalid
2. Computes BMI and CKD-EPI 2021 eGFR
3. Runs Cockcroft-Gault CrCl for Actual BW, Ideal BW, and Adjusted BW
4. Selects which BW to use for CrCl: short stature (<152 cm) → Actual; underweight (ABW < IBW) → Actual; obese (ABW > 1.2× IBW) → Adjusted; otherwise → Ideal
5. Builds first-line and MDR-TB drug arrays, then calls `renderTable()` for each
6. Renders the FDC weight-band table

**`renderTable(drugs, tbodyId, hoverCls, textCls, borderCls)`** — generates raw HTML strings and sets `innerHTML`. Each row includes an `<input>` for the actual dose; the `oninput` handler calls `updateMgKg()` and writes directly to `doseCache`.

**`window.updateMgKg(input, weight, drugName, range)`** — live-updates the mg/kg cell in the same `<tr>` without re-rendering the whole table. Must be on `window` because it is called from inline `oninput` attributes in generated HTML.

**`calcFdcReverse()` / `lockFdc(active)`** — FDC reverse calculator. Rifafour locks out both Rifinah inputs; Rifinah-150 and Rifinah-300 can be used together. Lock state must be re-initialized on page load (browser autofill).

**`aminoDW(abw, ibw, adjBw, shortStature)`** — selects dosing weight for aminoglycosides (Streptomycin, Amikacin): capped at 100 kg; short stature always uses Actual BW.

### Critical Invariants

- **`doseCache`** — never cleared by `calculate()` itself; only cleared by `resetAll()`. This is intentional so user-entered doses survive table re-renders.
- **CrCl < 30 threshold** — triggers the `renal-blink` CSS animation on renally-adjusted drug rows and shows/hides the `fdcRenalBanner` warning (HRZE/Rifafour contraindicated).
- **Short stature flag** (`h_cm < 152`) — disables IBW and AdjBW entirely for both CrCl selection and aminoglycoside dosing weight.
- **Cockcroft-Gault validated range** — ages 18–92 only. Ages outside this range show an orange warning but do not block calculation (unlike height/weight/Cr which block with red errors).
- **R capsule constraint** — Rifampicin capsules cannot be split, so `rDose()` uses whole-capsule increments (R300 or R450), which can put patients <25 kg above the mg/kg range. This is an intentional clinical trade-off documented in the source.

## Mobile Layout

The mobile breakpoint is `≤767px`. The layout uses `display: contents` on wrapper elements (`#crclTopBox`, `#crclHeaderBw`, `#crclContentRow`) so their children can participate directly in the outer CSS grid. This is the only way the L-shaped CrCl+BMI layout works on mobile without duplicating HTML.

The "📱 Mobile View" button on desktop injects a `<style id="mobileForceStyle">` tag that overrides Tailwind's responsive classes, capping the app at 390 px width for screenshots and testing.

## Drug Reference Data

| Section | Source | Notes |
|---|---|---|
| First-line (H, R, Z, E) | Thai NTP 2021 Table 5.1 | Discrete pill sizes: H100, R300/450 cap, Z500, E400/500 |
| FDC weight bands | WHO Adult Bands | Rifafour e-275, Rifinah-150, Rifinah-300 |
| MDR-TB Group A+B | Thai NTP 2021 Table 6.3 | Shorter regimen |
| MDR-TB Group C | Thai NTP 2021 | Amikacin uses aminoglycoside dosing weight |
| CrCl | Cockcroft-Gault | Renal adjustment threshold: CrCl < 30 mL/min → 3×/week dosing |
| eGFR | CKD-EPI 2021 | Display only; not used for dose adjustment |
| BMI | WHO Asia-Pacific cutoffs | 23 = overweight, 25 = obese I |
