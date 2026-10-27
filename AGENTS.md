# AGENTS.md — context for future changes

Read this before editing the portfolio. It records how the site is built, the conventions that keep it fast, and what is still pending. Keep it up to date when something structural changes.

## Owner & facts (source of truth for copy)

- **Prathamesh Kokkula**, Senior Full-Stack Engineer, Mumbai (IST). Email `kprathamesh2001@gmail.com`, phone `+91 87790 99074` (public by choice), GitHub `pk-062001`, LinkedIn in `site.ts`. No other profiles should be added unless asked.
- **BXI — Barter Exchange of India** (Aug 2025 → present, Senior Software Developer): a two-person team that owns everything end-to-end — the marketplace and listing modules, third-party integrations (Razorpay, Pine Labs, HDFC, Yes Bank, Juspay, MSG91, Firebase, NodeMailer), RBAC/JWT, admin dashboard, AWS + DigitalOcean ops.
- **Odyssey Technologies** (Jul 2023 → Jul 2025, Software Developer): worked on **Snorkel TX** (MFA server) and **xorkee** (digital signing / passwordless). Résumé metrics: 10+ APIs, 35% faster delivery, 25% faster page loads, 30% CI/CD improvement.
- Education: B.E. Computer Engineering, PVPPCOE (Mumbai University), CGPA 9.09.
- Résumé source: `docs/Prathamesh_Resume_2026.pdf` (deployed copy: `client/public/Prathamesh_Kokkula_Resume.pdf`). Photo source: `docs/New_image.png` (legacy: `docs/Image.png`).
- Do not invent metrics, employers or technologies. TypeScript was deliberately left out of the skills list.

## Stack & commands

- **Astro 7** static site in `client/`, deployed to **Vercel free tier** at `https://pk062001-portfolio.vercel.app`. Root `package.json` only proxies scripts (`postinstall` installs `client/`).
- Requires **Node ≥ 22.23.4**. The owner's machine has Node 22.18, so run Astro through Node 24:
  `cd client; npx -y -p node@24 node node_modules/astro/bin/astro.mjs build` (also `dev`, `preview`, `check`).
- Always finish with `astro check` (expect 0 errors / 0 warnings) and a `build`.
- Lighthouse (mobile), from `%TEMP%`, against `astro preview --port 4322`:
  `npx -y -p node@24 -p lighthouse lighthouse http://localhost:4322/ --quiet --output=json --output-path=lh.json --chrome-flags="--headless=new --no-sandbox"` (set `CHROME_PATH` first).
  Baseline: Performance 97–99, A11y/BP/SEO 100, CLS ≈ 0.003, ~7 KB initial JS (gzip).
- No git repo locally; the legacy React + Express version is backed up at `c:\Prathamesh\PK\portfolio-legacy-backup\`.

## File map

| Path (in `client/src`) | Role |
| --- | --- |
| `data/site.ts` | Identity, tagline, contact, nav, socials, stats, About story/facts/principles |
| `data/experience.ts` | Roles (`wins` support `**bold**`), Odyssey product cards, education |
| `data/skills.ts` | Stack bento groups (`featured` spans 2 cols) + hero marquee |
| `content.config.ts` | Zod schema for the `projects` collection |
| `content/projects/*.md` | One file per project; `_TEMPLATE.md` documents every field; `_`-prefixed files are ignored |
| `lib/projects.ts` | `getProjects()` — drops drafts, sorts by `order` then `year` |
| `layouts/Base.astro` | `<head>`: SEO/OG/Twitter, JSON-LD slot, font preloads, no-flash theme script, Nav/Footer/CommandPalette |
| `pages/index.astro` | Home: Hero → Marquee → Stats → About → Experience → Work → Stack → Contact (+ Person/WebSite JSON-LD) |
| `pages/work/[slug].astro` | Case study pages (+ CreativeWork/Breadcrumb JSON-LD) |
| `components/Split.astro` | Wraps heading words in `.split-word` spans **at build time** for the word-reveal animation |
| `components/ProjectCover.astro` | Real `cover` image, or a CSS mock (`dashboard` / `chat` / `marketplace`) tinted by `accent` |
| `components/Icon.astro` | Inline SVG icon set — add new icons to its path map |
| `scripts/motion.ts` | Reveals, counters, spotlight, magnetic buttons, lazy Lenis, hash-link scrolling; exports `toggleTheme`, `scrollToHash` |
| `scripts/particle-portrait.ts` | WebGL1 particle portrait (`mountPortrait`) |
| `scripts/contact.ts` | `validateContact` + `sendContact` (EmailJS → FormSubmit → mailto) |
| `styles/global.css` | Fonts, tokens, themes, shared utilities (`.container`, `.btn`, `.chip`, `.card`, `.eyebrow`, `.prose`…) |
| `client/scripts/prepare_assets.py` | Generates portrait cut-out, `public/portrait-map.png`, `public/og-image.jpg`, apple-touch-icon |

## Design system

- Dark theme default, light via toggle. Theme lives on `<html data-theme>`, persisted in `localStorage('theme')`; toggling dispatches a `themechange` event and uses a View Transition circular reveal.
- Accent: `--accent` `#ff6b35` (dark) / `#e04d16` (light). Secondary `--cool` `#7c9cff`. Text tokens `--text`, `--text-muted`, `--text-dim` are tuned for AA contrast — re-check Lighthouse if changed.
- Fonts (self-hosted via Fontsource): Geist Variable (UI), Geist Mono (labels/eyebrows), Instrument Serif italic (accent words in `<em class="serif">`). `global.css` defines size-adjusted `Geist Fallback` / `Instrument Serif Fallback` faces so swaps don't shift layout — update `size-adjust` if fonts change.
- Section pattern: `<section class="section">` → `.container` → `.eyebrow` + `<Split as="h2" class="section-title">…</Split>` + `.lede`.

## Conventions & gotchas

- **Scoped CSS doesn't reach child components.** Classes passed to `<Icon>` (or any element rendered by another component) must be styled with `:global(...)`.
- **Animations:** add `data-reveal` (optional `style="--d:120"` delay in ms) to fade/slide in; use `<Split>` for headings. Animate only `opacity`/`transform` — `filter: blur` on reveals was removed because it cost ~300 ms of style/layout on mobile. Everything must stay visible without JS (`html:not(.js)`) and with `prefers-reduced-motion`.
- **CSS is inlined** (`build.inlineStylesheets: 'always'`) to avoid render-blocking requests; keep component CSS lean.
- **Same-page links** use `/#id`; `motion.ts` intercepts them for smooth scrolling (Lenis on desktop) and the command palette calls `scrollToHash`.
- `.sheet[hidden]` needs an explicit `display:none` because the mobile sheet sets `display:flex`.
- Env vars: `vite.envPrefix` includes `VITE_` so the existing Vercel `VITE_EMAILJS_*` keys work.
- Content schema uses Zod 4 from `astro/zod` — use `z.url()`, not `z.string().url()`.

## Particle portrait

- The photo appears only as the hero particle portrait. About uses a CSS "platform I run" card (BXI ownership), not the cut-out.
- Map: `public/portrait-map.png` (160×127, grayscale + alpha, head & shoulders). Each opaque pixel becomes a point; brightness drives size/colour. Desktop ≈ 9.8k points, mobile (`innerWidth < 768`, sample step 1.35) ≈ 5k.
- Lifecycle: idle-loaded from `Hero.astro`; skipped on Data Saver / 2G / ≤2 CPU cores / ≤1 GB RAM; throws on software renderers (SwiftShader/llvmpipe) → `.is-fallback` shows a CSS halftone of the same map. Pauses off-screen and on hidden tabs. Reduced motion renders one static frame.
- Scroll scatter starts after 20% of the hero has scrolled. Additive blending in dark mode, normal in light.
- To change the photo: `python client/scripts/prepare_assets.py docs/New_image.png` (transparent PNGs are processed directly; non-transparent requires `rembg`). `--reuse` skips background removal.

## Contact form

- EmailJS keys were **missing** on the live Vercel deployment (only `VITE_CONTACT_TO_EMAIL` was set), so the form falls back to **FormSubmit**, which needs a one-time activation click from the first email it sends to `kprathamesh2001@gmail.com`. If messages don't arrive, check that activation first, then the EmailJS keys.
- Hidden honeypot input `_honey` rejects bots silently.

## Deployment

`vercel.json`: `framework: null`, install `npm install --prefix client`, build `npm run build --prefix client`, output `client/dist`. Immutable caching for `/_astro/*`, 1-week caching for the portrait map / OG image / icons, plus nosniff, Referrer-Policy, X-Frame-Options and Permissions-Policy headers. Vercel's Node version must be 24.x. If the domain changes, update `site` in `astro.config.mjs` and `url` in `data/site.ts`.

## Pending / to verify with the owner

- Add `live` / `repo` links and real screenshots (`cover`) for OrbitHR, Real-Time Chat and StayScape when available.
- Confirm the Real-Time Chat and StayScape write-ups (years 2024/2023, feature lists) and OrbitHR's year (2026) / status.
- Activate FormSubmit or add EmailJS keys in Vercel.
- Optional: custom domain.
