# Handoff: Scroll-Timeline Portfolio (“Index of work”)

A single-page, reverse-chronological portfolio that lists projects newest-first along a
vertical timeline, with **per-language ("code type") highlight colors** and a **crayon**
visual identity (manila paper / warm chalk).

---

## Overview
A static, one-page site that renders a person’s projects as a descending **index**:

- A **masthead** (name, tagline, derived summary stats, GitHub link, running marquee).
- A **timeline body** grouped by year. Each year shows a **giant sticky year number** on the
  left and its projects as **editorial index rows** on the right, joined by a hairline spine.
- A **footer** (how it was built + source link).

The data is fully separated from the view: the page reads a single `window.REPOS` array and
renders it **as-is** (assumed already newest-first). Year dividers, the running `01…N` index,
and all summary stats are derived at runtime.

---

## About the Design Files
> **Special case — read this.** Unlike a typical handoff, the four files in this bundle are
> **both the design reference AND production-ready code.** They are intentionally framework-free
> vanilla **HTML/CSS/JS** with no build step, designed to be dropped straight onto **GitHub Pages**.

Two valid ways to use this package:

1. **Ship as-is.** Copy `index.html`, `style.css`, `app.js`, `data.js` to a repo and enable
   GitHub Pages. Edit `data.js` to swap in real projects. Done.
2. **Port into an existing app.** If you’re integrating into a React/Vue/Svelte/etc. codebase,
   treat the HTML as a **pixel-accurate spec** and recreate it with your stack’s components and
   patterns, using the exact tokens, type scale, and behaviors documented below. Keep the
   `REPOS` data model — it maps cleanly to a component prop / API shape.

There are **no external assets** to fetch (no images); fonts come from Google Fonts and two tiny
SVGs are inlined (favicon + film grain).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, motion, and interactions. Recreate
pixel-for-pixel if porting.

---

## Screens / Views
This is a **single page**. It has five regions, top to bottom.

### 1. Top bar (`.topbar`)
- **Layout:** flex row, space-between, wraps on narrow widths. 20px vertical padding, 1px bottom
  hairline (`--rule`).
- **Left:** `.mark` — mono caption, uppercase, 11.5px, letter-spacing .14em, `--fg-dim`. Text:
  `◆  selected work — an index`.
- **Right (`.topnav`, gap 18px):**
  - `.gh-link` — mono 12px, color `--link`; hover underline + text → `--accent`. Text `github ↗`.
    `rel="noopener" target="_blank"`.
  - `.theme-toggle` — pill button (1px `--rule`, radius 999px, padding 7×12). Contains a 9px
    `.tt-dot` filled `--accent` + a mono uppercase label showing the current theme (`dark`/`light`).

### 2. Hero (`.hero`)
- **Layout:** flex, wrap, items end, space-between; padding `clamp(40px,8vw,96px)` top /
  `clamp(36px,5vw,60px)` bottom.
- **`.name`** — Bricolage Grotesque 800, `clamp(64px,13.5vw,188px)`, line-height .86,
  letter-spacing -.045em, `text-transform: lowercase`. (Current content is editable copy:
  `이루왕 / eeruwang`.)
- **`.tagline`** — Bricolage 400, `clamp(17px,2.3vw,26px)`, line-height 1.32, `--fg-dim`,
  `text-wrap: balance`.

### 3. Stat band (`#stats.stat-strip`) — built by JS
- **Layout:** flex row, 1px top & bottom hairlines. Each `.stat` is `flex:1 1 0`, min-width 130px,
  padding 22px 4px 20px, with a 1px left divider between cells. Collapses to a 2-col grid ≤540px.
- **Each stat:** big number `.n` (Bricolage 700, `clamp(30px,4.4vw,52px)`, tabular-nums) over a
  mono label `.l` (10.5px, letter-spacing .18em, uppercase, `--fg-faint`).
- **Values (derived from `REPOS`):** `projects` = count, `stars` = Σ stars, `commits` = Σ commits,
  `since` = earliest year. Numbers use thousands separators (`toLocaleString('en-US')`).

### 4. Marquee (`.marquee`) — decorative
- Overflow-hidden strip, 1px bottom hairline, 13px vertical padding. Inner `.marquee-track`
  (two duplicated `.marquee-seq`) translates `-50%` over **26s linear infinite**.
- Items: mono 12px, uppercase, letter-spacing .16em, `--fg-dim`; separators `✦` in `--accent`.
  Copy: `Newest first ✦ Scroll back in time ↓ ✦ 2023 → 2026 ✦ Selected work`.
- `aria-hidden="true"`; animation disabled under reduced-motion.

### 5. Timeline (`#timeline`) — built by JS
Repos are grouped into consecutive **year blocks**. Continuous running index `01…N` across all
rows (newest = `01`).

**Year block (`.year-block`)** — CSS grid `minmax(180px,0.8fr) minmax(0,2.5fr)`, gap `0 40px`,
items start.
- **Left rail (`.year-rail`)** — carries an inline `--accent` = that year’s **dominant language** ink.
  - `.year-num` — Bricolage 800, `clamp(46px,6.2vw,96px)`, line-height .85, letter-spacing -.04em,
    **`position: sticky; top: 90px`**, right-aligned (so it hugs the spine).
  - `.year-meta` — right-aligned: a mono `.count` (`04 projects`) + a `.bar` (46×8px solid `--accent`).
- **Right list (`.year-list`)** — `border-left: 1px solid var(--rule)` (the spine), `padding-left: 46px`
  (`--gutter`).

**Project row (`.row`)** — carries an inline `--accent` = **its own language** ink.
- Padding `28px 26px 26px 0` (see *Direct edits* below — currently overridden to left-pad 10px),
  1px top hairline (none on first row).
- **`.row::after`** — 9px node dot on the spine (`left: calc(var(--gutter)*-1 - 5px); top: 38px`),
  hollow at rest (`background var(--bg)`, 1px `--rule-strong`).
- **`.row-top`** — flex baseline: `.row-index` (mono 13px/500, `--fg-faint`) + `.row-headline`.
  - **`.row-title-line`** — optional `.org` badge (mono 12px pill, 1px `--rule-strong`, radius 999px)
    + `.row-title` link (Bricolage 700, `clamp(24px,3vw,40px)`, line-height 1.02, letter-spacing
    -.025em) containing a trailing `.arr` `↗` that slides in on hover.
- **`.row-desc`** — Bricolage 400/16px, line-height 1.5, `--fg-dim`, max-width 56ch (omitted when
  `description` is null). Indented `margin-left: 44px`.
- **`.row-meta`** — mono 12.5px, flex wrap, gap `9px 22px`, indented `margin-left: 44px`:
  - `.date` (`YYYY.MM`, `--fg-faint`)
  - `.stars` (`★ 1,240`, `--fg`) — **only when stars ≥ 1**
  - `.commits` (`<b>1,240</b> commits`, always shown)
  - `.lang` (a 9px `.dot` filled `var(--accent)` + the language name, `--fg-dim`)
  - `.live` (`Live ↗`, `margin-left:auto`, underlined) — **only when `live` is set**

**End cap (`.tl-end`)** — mono 11px uppercase caption after the last row, e.g.
`— the beginning · 2023 —`. (Currently centered + bold via a direct edit.)

### Footer (`.site-footer`)
- Flex, wrap, items end, space-between; 1px top hairline; padding-top 34px, padding-bottom 80px.
- `.foot-lead` — Bricolage 500, `clamp(18px,2.4vw,26px)` (currently overridden inline to 15px /
  width 515px). Copy: *“Hand-coded in plain HTML, CSS & JavaScript. No framework, no bundler, no
  build step.”*
- `.foot-src` — mono 13px, `Link ↗`, color `--link`, hover → `--accent`. `rel="noopener"`.

---

## Interactions & Behavior

### Per-language highlight (the core idea)
The accent color is **not global or user-picked** — it is **derived from each project’s language
(“code type”)** and cascades through CSS custom properties:
- **`:root --accent`** is a fallback; at load, JS sets it on `<html>` to the **site’s most-used
  language** ink (drives chrome: toggle dot, marquee marks, focus ring).
- Each **`.year-rail`** gets an inline `--accent` = that year’s **dominant** language ink (drives
  the year `.bar`).
- Each **`.row`** gets an inline `--accent` = **its** language ink (drives the dot, the hover wash,
  the node, and the title-on-hover).
- Language inks are tuned **mid-tone “crayon” values** (hue-faithful, normalized lightness) so
  they remain legible on **both** the manila and chalk backgrounds. See *Design Tokens → Language ink*.

### Row hover — “color in”
On `.row:hover`:
- `.row::before` wash sweeps in: `transform: scaleX(0)→scaleX(1)`, origin left, **0.5s
  `cubic-bezier(.76,0,.14,1)`**, background `color-mix(in srgb, var(--accent) 18%, transparent)`.
- `.row-title` → `var(--accent)` (large text stays legible); `.row-index` → `--fg`; `.org` border →
  `var(--accent)` (text → `--fg`).
- `.row::after` node fills `var(--accent)` and `scale(1.5)`.
- `.row-title .arr` arrow: opacity 0→1, translate(-4px,2px)→0.
- (Disabled cleanly under reduced-motion: the wash `::before` is hidden.)

### Reveal on scroll
Elements with `.reveal` start `opacity:0; translateY(30px)` and transition to visible
(**0.7s `cubic-bezier(.2,.8,.2,1)`**) when `.is-visible` is added. Implementation in `app.js`:
- **Primary:** `IntersectionObserver` (`rootMargin: '0px 0px -8% 0px'`, `threshold: 0.12`),
  one-shot (`unobserve` after reveal).
- **Safety net:** a `getBoundingClientRect` pass on `load` + `scroll` + `resize` (rAF-throttled)
  reveals anything within view, so content never stays hidden where IO is unreliable.
- Honors `prefers-reduced-motion` (everything shown, no transition).

### Sticky year numbers
`.year-num { position: sticky; top: 90px }` on desktop — the giant year pins beside its rows while
that year block is in view, then releases. Static (non-sticky) below 860px.

### Theme toggle (dark ⇄ light)
- `<html data-theme>` switches the whole crayon palette via CSS variables.
- A **pre-paint inline script in `<head>`** reads `localStorage.theme` (falling back to
  `prefers-color-scheme`) and sets `data-theme` **before first paint** to avoid a flash.
- The `.theme-toggle` button flips and **persists** `localStorage.theme`, and updates its label +
  `aria-label`.
- Body color/background cross-fade over 0.45s.

### Responsive
- **≤860px:** two-column year block collapses to single column; the year number becomes a static
  left-aligned section header (`clamp(54px,17vw,96px)`); `--pad` 40→22, `--gutter` 46→30; hero stacks.
- **≤540px:** stat band → 2-col grid; `.name` `clamp(56px,19vw,96px)`; row desc/meta indent reset to 0.

---

## State Management
Minimal, all client-side:
- **`window.REPOS`** (in `data.js`) — the single source of truth, read once at start.
- **Theme** — `localStorage.theme` (`'dark'|'light'`); applied pre-paint and on toggle.
- **Reveal** — transient `IntersectionObserver` + scroll listeners; no persisted state.
- **Derived at runtime (no stored state):** summary stats, year groupings, running index, and all
  `--accent` values (site/year/row) computed from `REPOS`.

If porting to a framework: `REPOS` → a list prop or fetched array; theme → a context/store with
the same pre-hydration guard; reveal → an `IntersectionObserver` hook or a library equivalent.

---

## Design Tokens

### Color — crayon palette (CSS variables, swap by `[data-theme]`)
**Dark — “warm chalk”**
| token | value |
|---|---|
| `--bg` | `#211f1a` |
| `--bg-2` | `#2c2924` |
| `--fg` | `#f2e9d4` |
| `--fg-dim` | `#a99f88` |
| `--fg-faint` | `#6e6757` |
| `--rule` | `rgba(242,233,212,.15)` |
| `--rule-strong` | `rgba(242,233,212,.32)` |
| `--link` | `var(--fg)` |

**Light — “manila paper”**
| token | value |
|---|---|
| `--bg` | `#f2e9d3` |
| `--bg-2` | `#fbf5e6` |
| `--fg` | `#2c281f` |
| `--fg-dim` | `#6b6253` |
| `--fg-faint` | `#9d927c` |
| `--rule` | `rgba(44,40,31,.17)` |
| `--rule-strong` | `rgba(44,40,31,.34)` |
| `--link` | `var(--fg)` |

`--accent` is **not** theme-fixed — default `#e2542f`, then set per site/year/row from language.

### Language ink (the per-“code type” highlight) — `LANG_COLORS` in `app.js`
Mid-tone, hue-faithful crayon values; fallback `#9c8f76`.
| lang | ink | lang | ink | lang | ink |
|---|---|---|---|---|---|
| JavaScript | `#e0a52b` | Shell | `#5aa84a` | Scala | `#d24a44` |
| TypeScript | `#2f86d0` | HTML | `#d9603a` | Clojure | `#5ba85f` |
| Python | `#4577b8` | CSS | `#8064c0` | Zig | `#d98a4a` |
| Go | `#1fa6bf` | SCSS | `#cf6597` | Nix | `#6a78d0` |
| Rust | `#c2703a` | Svelte | `#e2542f` | Markdown | `#3f7fc9` |
| Ruby | `#d8443f` | Vue | `#43a986` | Objective-C | `#4a86d0` |
| Java | `#b9772e` | Dart | `#2aa6b0` | Kotlin | `#8a6fd0` |
| C | `#8d8474` | Elixir | `#8763b0` | PHP | `#6d72c4` |
| C++ | `#e25b86` | Haskell | `#7a6aa8` | Lua | `#5a5fc0` |
| C# | `#3f9e57` | Swift | `#e9683a` | *fallback* | `#9c8f76` |

### Typography
- **Display & body:** **Bricolage Grotesque** (Google Fonts, `opsz 12..96`, weights 400/500/600/700/800).
- **Mono / technical:** **JetBrains Mono** (weights 400/500/700).
- Scale (size · weight · line-height · tracking):
  | role | font | size | wt | lh | tracking |
  |---|---|---|---|---|---|
  | name | Bricolage | `clamp(64px,13.5vw,188px)` | 800 | .86 | -.045em (lowercase) |
  | year number | Bricolage | `clamp(46px,6.2vw,96px)` | 800 | .85 | -.04em |
  | stat number | Bricolage | `clamp(30px,4.4vw,52px)` | 700 | .95 | -.02em |
  | row title | Bricolage | `clamp(24px,3vw,40px)` | 700 | 1.02 | -.025em |
  | footer lead | Bricolage | `clamp(18px,2.4vw,26px)` | 500 | 1.28 | -.01em |
  | tagline | Bricolage | `clamp(17px,2.3vw,26px)` | 400 | 1.32 | — |
  | description | Bricolage | 16px | 400 | 1.5 | — |
  | meta / index | JetBrains Mono | 12–13px | 500 | — | — |
  | captions/labels | JetBrains Mono | 10.5–12px | 400/500 | — | .14–.18em, uppercase |

### Spacing / layout
- `--maxw: 1280px`; `--pad: 40px` (22px ≤860); `--gutter: 46px` (30px ≤860).
- Timeline grid: `minmax(180px,0.8fr) minmax(0,2.5fr)`, column gap 40px.
- Row vertical padding 28px (top) / 26px (bottom); desc & meta indent 44px.
- Section paddings: see *Screens* (hero/footer use clamp()).

### Radii, borders, shadows
- **Radii:** pills/badges/toggle `999px`; dots `50%`. Rows are **ruled, not boxed** — no card radius.
- **Borders:** 1px hairlines using `--rule`; stronger 1px `--rule-strong` for the node + org badge.
- **Shadows:** none (flat editorial). The only “shadow” is the focus-ring (`outline: 2px var(--accent)`).

### Motion
- Easing: `--ease: cubic-bezier(.2,.8,.2,1)`; `--wipe: cubic-bezier(.76,0,.14,1)`.
- Reveal 0.7s · hover wash 0.5s · theme cross-fade 0.45s · marquee 26s linear · arrow/node 0.25–0.3s.

---

## Assets
- **No images.** All imagery is typographic/structural.
- **Fonts:** Google Fonts — Bricolage Grotesque + JetBrains Mono (`<link>` in `<head>`).
- **Favicon:** inline SVG data-URI (charcoal square `#211f1a` + accent square `#e2542f`).
- **Film grain:** inline SVG `feTurbulence` noise on `.grain` (fixed overlay, `opacity:.04`,
  `z-index:60`, `pointer-events:none`).
- If integrating into a branded app, replace the favicon/grain with your own system; everything
  else is CSS.

---

## Data model — `window.REPOS` (in `data.js`)
Array of project objects, **kept newest-first** (the view does not sort). The renderer reads only
this array.

| field | type | rule |
|---|---|---|
| `name` | string | `"repo"` or `"owner/repo"`; the part before `/` renders as a small **org badge**, the rest is the linked title. |
| `description` | string \| null | shown as the body line; **omitted when null**. |
| `date` | `"YYYY-MM-DD"` | displayed as **`YYYY.MM`**; drives year grouping + dividers. |
| `stars` | number | **hidden when 0**; shown as `★ 1,234` when ≥ 1. |
| `commits` | number | **always** shown, thousands-separated. |
| `lang` | string | language name → a colored dot **and** the row’s highlight ink. |
| `url` | string | GitHub link on the title. |
| `live` | string \| null | renders `Live ↗`; **omitted when null**. |

Derived automatically: running index `01…N`, year dividers on year change, summary stats
(count / Σstars / Σcommits / earliest year), and the site/year/row accent inks.

**Security:** all user-supplied strings are inserted via `textContent` (never `innerHTML`), so
they are HTML-escaped by construction. External links use `rel="noopener" target="_blank"`.
Preserve both when porting.

---

## Files (in this bundle)
| file | role |
|---|---|
| `index.html` | Document shell: pre-paint theme script, font links, masthead markup, timeline mount (`#timeline`), footer, script tags. |
| `style.css` | All styling: crayon tokens, type system, masthead/stat/marquee, timeline grid + sticky years + rows, hover wash, reveal, responsive, reduced-motion. |
| `app.js` | Renders from `REPOS`: language ink map + dominant-language logic, stats, year blocks, index rows, reveal observer, theme toggle. No dependencies. |
| `data.js` | `window.REPOS` content — **the only file you normally edit** to add/remove projects. |

### Direct edits to be aware of
`index.html` ends with a `<style id="__om-edit-overrides">` block of `!important` rules made by
direct manipulation in the editor — they are **intentional** and should be kept (or folded into
`style.css` when porting). Current overrides: project rows left-padding set to `10px`; the end-cap
(`.tl-end`) centered + bold; two width/justify tweaks on the 2026 block’s rows. The masthead name
copy (`이루왕 / eeruwang`) and the footer lead’s inline `font-size:15px; width:515px` are likewise
intentional content/style edits.

---

## Implementation checklist (if porting to a framework)
1. Recreate the crayon token sets as theme variables; wire a dark/light switch with a pre-hydration
   guard (no flash) + persistence.
2. Load Bricolage Grotesque + JetBrains Mono; match the type scale exactly.
3. Model `REPOS` as data; render newest-first **without sorting**; insert year dividers on change;
   compute the running index + summary stats.
4. Implement the **per-language ink**: a `langColor(lang)` map (mid-tone crayon), plus
   site-dominant and year-dominant derivations; expose as a CSS variable per scope.
5. Build the sticky giant year + ruled index rows + spine/node; honor all field rules
   (org badge, null description, hidden 0-stars, comma commits, `Live ↗`).
6. Reveal-on-scroll via `IntersectionObserver` (+ reduced-motion fallback); the “color-in” hover wash.
7. Keep escaping (`textContent`/framework auto-escaping) and `rel="noopener"` on external links.
