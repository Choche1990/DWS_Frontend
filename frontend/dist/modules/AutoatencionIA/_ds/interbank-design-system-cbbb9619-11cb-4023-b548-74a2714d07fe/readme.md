# Interbank Design System

Interbank is a retail bank in Peru — mobile app, online banking, branch network, correspondent agents ("Agentes Interbank"), email/WhatsApp communications, and trade/POS marketing materials. This design system is built from Interbank's internal 2025 graphic manual and PowerPoint template.

**Sources provided** (in `uploads/`, kept for reference — not linked/accessible externally):
- `MANUAL IBK_2025_linea gráfica.pdf` / `manual_ibk_2025.pdf` — 118-page internal brand manual (strategy, logo usage, color, typography, iconography, UX color, information containers, diagonal system, cobranding, Agentes Interbank, sub-brands, application pieces). Extracted full text is preserved at `scratch_manual_text.txt`.
- `Template Interbank.pptx` — internal PPTX template with editable brand-shape masters (oval/diagonal containers, color slide, container slide). Media extracted to `scratch_pptx_media/`.
- `interbank-logo-color.png`, `interbank-logo-white.png`, `interbank-isotipo.png` — official logo files.
- `Poppins-Regular.ttf`, `Poppins-SemiBold.ttf` — brand's own font files.

No Figma or codebase was attached — this system is built from brand-guidelines documents only, so the component inventory (Button, Input, Select, Checkbox, Radio, Switch, Card, Badge, Tag, Tabs, Toast, Tooltip) is an author-chosen standard set sized to a bank app/web's needs, not a copied inventory from a source library.

## Index

- `styles.css` — root stylesheet, imports everything under `tokens/`.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`.
- `assets/logos/` — Interbank logo (color, white) + isotipo.
- `assets/fonts/` — Poppins Regular & SemiBold (self-hosted TTFs).
- `guidelines/` — 25 foundation specimen cards (Colors, Type, Spacing, Brand groups).
- `components/forms/` — Button, IconButton, Input, Select, Checkbox, Radio, Switch.
- `components/display/` — Card, Badge, Tag.
- `components/navigation/` — Tabs.
- `components/feedback/` — Toast, Tooltip.
- `ui_kits/mobile-app/` — click-through phone prototype: Login → Home → Transfer → Agente locator.
- `ui_kits/marketing-web/` — landing page: header, hero, product benefits, Agente banner, footer.
- `ui_kits/slides/` — 4 slide templates recreating the PPTX template's own slides (title, colors, contenedores, content).

## Intentional additions

The manual defines no digital component library, so the following are standard additions, not brand-defined primitives: Button `ghost` variant, IconButton, Input, Select, Checkbox, Radio, Switch, Card, Badge, Tag, Tabs, Toast, Tooltip. All follow the manual's color, radius, and type rules.

## Company & product context

Interbank's brand strategy (manual ch. 1, "Estrategia") is built around a single **Big Idea**: Interbank helps Peruvians reach their dreams today, because time matters more than money. The bank promises a close, agile, secure experience, rewards loyalty, and is available 24/7.

**Personality:** Innovador, Digital, Cercano, Amable, Seguro, Confiable, Empático, Inclusivo, Comprometido con el Perú.

**Target:** Peruvians 35–45, digitally-savvy, value control and security, seeking top-tier experiences and a partner to grow with.

**Products represented in this system:** mobile banking app, marketing/informational website, branch & Agente Interbank correspondent network, email/mailing pieces, and internal communication pieces (per manual ch. 11 "Piezas").

## Content fundamentals

- **Language:** Spanish (Peru), the only language across all provided source material.
- **Voice, 4 dimensions (verbatim from manual):**
  1. *Empático y cercano* — natural, understandable, personalized language.
  2. *Resolutivo y dinámico* — direct, simple, clear language for fast solutions.
  3. *Confiable y profesional* — close but respectful tone; objective, practical, credible.
  4. *Didáctico y ágil* — teaches while conveying security and ease.
- **Person:** Speaks directly to the customer in second person ("Acompañamos a los peruanos a alcanzar sus sueños, hoy" / "Recibe tu sueldo y participa"). Warm but not overfamiliar — no slang, no exclamation-heavy hype copy.
- **Casing:** Sentence case throughout headlines and buttons — never ALL CAPS, no title case. CTAs are short, direct verbs: "Hazlo ya", "Pídelo hoy", "Ingresar", "Transferir ahora".
- **Numbers/money:** Bold or SemiBold weight, set apart from body text — treated as their own visual unit (see manual 03.7 usage rule "títulares, números o cualquier comunicación de breve contenido").
- **Emoji:** Not used anywhere in the manual or template. Do not introduce them.
- **Avoid:** Generic banking buzzwords absent from the manual's own vocabulary (e.g. "líder", "premium"). Every sample headline in this system is adapted directly from real manual copy ("El tiempo vale más que el dinero", "Acompañamos a los peruanos a alcanzar sus sueños, hoy").

## Visual foundations

- **Color:** Verde IBK `#05BE50` is the corporate identity signal — ~80% of any print/general piece (manual 03.3). Four secondary greens (`#A0FF96`, `#00D03C`, `#008C37`, `#005F1E`) add dynamism in small (~5% each) doses, and must only combine in the manual's approved high-contrast pairs (03.4) — e.g. never Verde3+Verde4 or Verde1+White. Azul IBK `#0039A6` lives in the logotype symbol and as a strictly limited accent — never a dominant UI color. For app/product (UX) surfaces, use the separate ~24%-each ratio across the four greens + ~5% blue accent (ch. 05) instead of the 80% print rule.
- **Buttons:** only two approved digital colors — Verde IBK (primary) and Azul IBK (secondary/alternate contrast). No other button colors are brand-approved.
- **Type:** Single family, Poppins, across Light/Regular/SemiBold/Bold — an intentionally extreme weight range. Bold/SemiBold for headlines, numbers, and short-form content; Regular/Light for body copy. Never mix more than two weights in one piece. Verdana (Regular/Bold) is used exclusively for email/mailings — never elsewhere.
- **Geometry:** everything rounded/soft. Three signature containers, all container-based (never freeform):
  - **Oval container** (4X×15X grid) — houses the logo lockup, white or green background, positive/negative logo.
  - **Diagonal container** — derived from the isotipo's window shape, center-extracted with modified corners; used for photo/text/closing panels, always composed left-to-right.
  - **Rectangular information container** — rounded rectangle for text/photo, sizes vary but corner proportion is fixed; never overlapped, never two of the same color adjacent, no transparency.
- **Agente Interbank module:** square container, 4X×4X grid, isotipo + "agente" wordmark centered, always negative color (blue + white on green).
- **Cobranding:** partner logo inside the oval container always scales to 9X (80%) against Interbank's 11X (100%) — Interbank is always visually dominant.
- **Sub-brands:** endorsed via the isotipo + name set in Poppins SemiBold, Pantone 360C, separated by a 2pt gray divider line.
- **Backgrounds:** flat color fields (mostly Verde IBK or white) or warm real photography inside the defined containers — no gradients, no textures/patterns, no illustrated heroes. Photography should feel close/authentic per the brand personality, not stock-photo generic.
- **Icons:** simple, minimal-shape linear icons (single Verde IBK color) at 40/56/72/88px, plus a two-tone illustrated icon family (front detail + darker "shadow" back shape). No source vector files were provided in the uploads (the manual only lists icon names/uses); see Iconography below.
- **Shadows:** the manual shows no drop-shadow system for flat brand pieces — containers are flat-filled. For UI surfaces (cards, buttons) this system uses a light `0 4px 20px rgba(0,0,0,0.08)` elevation only where lift is functionally needed (e.g. an "elevated" Card), never a heavy Material-style shadow.
- **Corners:** consistently rounded — `8px` (small controls), `16px` (medium containers/isotipo container), `24px` (large info containers), full pill (buttons, tags, badges).
- **Hover/press:** buttons darken one step (Verde IBK → Verde 03) on hover and scale to 0.97 on press — no color-lightening, no opacity fades (not specified in manual; kept minimal/functional).
- **Motion:** the manual defines no animation system. This system uses only short (120–150ms) ease transitions for state changes (toggle slide, tab underline, button press) — no bounces, no elaborate choreography.
- **Transparency/blur:** the manual explicitly disallows transparency on information containers (06.7, "No usar transparencias"). Avoid glass/blur effects generally.
- **Accessibility:** WCAG AA (4.5:1) minimum on body text/CTAs. `#05BE50` on white is only ~2.5:1 — use it for large graphic/background surfaces only, pairing small text with black (~8.5:1), never white. For white text on dark green, use Verde 04 `#005F1E` (~7.9:1). Focus states always visible (blue-tinted ring). Touch targets ≥44px.

## Iconography

- The manual describes two icon families — **linear** (single-color, minimal-shape, Verde IBK) and **illustrated** (two-part: a lighter "front" + darker "shadow" back shape) — each used at 40/56/72/88px.
- **No actual icon files (SVG/PNG/font) were included in any uploaded source.** The PPTX media only contained brand *shape* assets (rounded rects, diagonal panels used for oval/diagonal containers), not icons. Per instructions, no icons were hand-drawn or fabricated for this system.
- **Recommended substitution:** a simple, single-weight line icon set with rounded joins — e.g. [Phosphor Icons](https://phosphoricons.com) (regular weight) or [Lucide](https://lucide.dev) — recolored to Verde IBK, sized to the 40/56/88px scale. This is flagged as a substitution, not a brand asset; ask the brand team for the real linear + illustrated icon library before shipping production UI.
- No emoji or unicode-glyph icons appear anywhere in the source material — none should be introduced.

## Caveats & fonts

- Poppins **Light (300)** and **Bold (700)** were not provided as files — only Regular and SemiBold TTFs were uploaded. `tokens/fonts.css` self-hosts Regular/SemiBold from the provided files and loads Light/Bold from Google Fonts (same foundry family, not a stylistic substitute). If exact licensed Light/Bold TTFs exist internally, swap them in for full self-hosting.
- No real icon assets were provided (see Iconography above) — flagged for follow-up.
- No Figma file or app codebase was attached, so UI kits and components are built purely from the brand manual + PPTX template, sized to a bank's typical needs (login, home, transfer, agent locator, marketing landing page) rather than copied from an existing product.
