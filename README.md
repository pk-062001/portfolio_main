# Prathamesh Kokkula — Portfolio

Personal portfolio of **Prathamesh Kokkula**, Senior Full-Stack Engineer.
Live at **[pk062001-portfolio.vercel.app](https://pk062001-portfolio.vercel.app/)**.

A static, SEO-first site built with [Astro](https://astro.build): dark/light themes, a hand-written WebGL particle portrait, scroll-driven motion, case-study pages and a `Ctrl/⌘ + K` command palette — while shipping ~7 KB of JavaScript on first load.

| Lighthouse (mobile) | Score |
| ------------------- | ----- |
| Performance         | 97–99 |
| Accessibility       | 100   |
| Best Practices      | 100   |
| SEO                 | 100   |

## Features

- **Particle portrait** — the hero portrait is ~10k WebGL points sampled from a photo cut-out. It morphs out of a rotating core, reacts to the cursor, scatters on scroll and recolours with the theme. It is skipped on Data Saver, 2G, low-end devices and software renderers (a CSS halftone image is shown instead) and respects `prefers-reduced-motion`.
- **Fast on slow networks** — static HTML with inlined CSS, self-hosted fonts with metric-matched fallbacks (no layout shift), AVIF/WebP images, and lazy-loaded smooth scrolling (desktop only).
- **SEO** — canonical URLs, Open Graph / Twitter cards, JSON-LD (`Person`, `WebSite`, `CreativeWork`, `BreadcrumbList`), sitemap, `robots.txt` and a web manifest.
- **Projects as content** — each project is a Markdown file; the home page cards and `/work/<slug>` case studies are generated from them.
- **Contact form** — EmailJS, with automatic fallback to FormSubmit and then `mailto:`. No backend to run.
- **Accessible** — skip link, keyboard-navigable command palette and menu, visible focus, AA contrast in both themes.

## Tech stack

Astro 7 · TypeScript · vanilla CSS (design tokens) · WebGL 1 · Lenis · `@astrojs/sitemap` · EmailJS / FormSubmit · Vercel

## Getting started

Requires **Node.js 22.23.4 or newer** (Node 24 LTS recommended).

```bash
npm install          # installs client/ dependencies via postinstall
npm run dev          # http://localhost:4321
npm run build        # outputs client/dist
npm run preview      # serve the production build
```

All scripts at the repo root proxy into `client/`. Inside `client/` you can also run `npm run check` (Astro + TypeScript diagnostics).

> On an older Node you can run any command through a temporary Node 24 without upgrading:
> `npx -y -p node@24 node node_modules/astro/bin/astro.mjs build` (from `client/`).

## Project structure

```text
.
├── client/                      # The Astro site
│   ├── public/                  # Served as-is: résumé PDF, favicon, OG image, portrait map
│   ├── scripts/prepare_assets.py
│   └── src/
│       ├── assets/portrait/     # Photo cut-out (optimised by astro:assets)
│       ├── components/          # Hero, About, Experience, Work, Stack, Contact, Nav, Footer…
│       ├── content/projects/    # ← one Markdown file per project
│       ├── data/                # ← site.ts, experience.ts, skills.ts (all copy lives here)
│       ├── layouts/Base.astro   # <head>, SEO tags, theme bootstrap
│       ├── pages/               # index, work/[slug], 404, robots.txt
│       ├── scripts/             # motion, particle portrait, contact form
│       └── styles/global.css    # design tokens + shared utilities
├── docs/                        # Source photo and résumé (not deployed)
├── AGENTS.md                    # Architecture & conventions for future changes
└── vercel.json
```

## Editing content

| What                                       | Where                                |
| ------------------------------------------ | ------------------------------------ |
| Name, role, tagline, contact, socials, stats, About story | `client/src/data/site.ts` |
| Jobs, achievements, education              | `client/src/data/experience.ts`      |
| Skills bento + marquee                     | `client/src/data/skills.ts`          |
| Projects                                   | `client/src/content/projects/*.md`   |
| Résumé                                     | replace `client/public/Prathamesh_Kokkula_Resume.pdf` |

### Adding a project

1. Copy `client/src/content/projects/_TEMPLATE.md` to e.g. `my-project.md` (the file name becomes the URL: `/work/my-project`).
2. Fill in the front-matter — `title`, `tagline`, `summary`, `year`, `role`, `status`, `stack`, up to four `highlights`, an `accent` colour and `order`.
3. Add `live:` / `repo:` URLs when available — the buttons appear automatically.
4. Optionally add a screenshot: put it next to the file (e.g. `my-project-cover.png`) and set `cover: ./my-project-cover.png` plus `coverAlt`. Without a cover, a styled mock-up is drawn using `mock: dashboard | chat | marketplace`.
5. Write the case study in Markdown below the front-matter.

Set `draft: true` to hide a project. Files starting with `_` are ignored. The build validates every field, so typos fail loudly.

### Updating the portrait / OG image

The portrait cut-out, particle map, social preview image and Apple touch icon are generated from `docs/Image.png`:

```bash
python -m venv .venv && .venv/Scripts/pip install "rembg[cpu]" pillow   # once
cd client
../.venv/Scripts/python scripts/prepare_assets.py ../docs/Image.png
```

Pass `--reuse` to regenerate only the derived images without re-running background removal.

## Contact form setup

The form tries these in order:

1. **EmailJS** — used when all three keys are set.
2. **FormSubmit** — free, no account. The **first** submission sends an activation email to `VITE_CONTACT_TO_EMAIL` (or the address in `site.ts`); click *Activate* once and every later message is delivered.
3. **`mailto:`** — opens the visitor's mail app as a last resort.

Environment variables (set in Vercel → Project → Settings → Environment Variables, or in `client/.env` locally — see `client/.env.example`):

| Variable                    | Purpose                    |
| --------------------------- | -------------------------- |
| `VITE_EMAILJS_SERVICE_ID`   | EmailJS service ID         |
| `VITE_EMAILJS_TEMPLATE_ID`  | EmailJS template ID        |
| `VITE_EMAILJS_PUBLIC_KEY`   | EmailJS public key         |
| `VITE_CONTACT_TO_EMAIL`     | Inbox for FormSubmit       |

Available EmailJS template variables: `{{from_name}}`, `{{from_email}}`, `{{reply_to}}`, `{{subject}}`, `{{message}}`, `{{to_email}}` and `{{submitted_at}}`.

## Deployment

Deployed on Vercel. `vercel.json` builds `client/` and serves `client/dist`, with long-term caching for hashed assets and baseline security headers. In the Vercel dashboard set **Node.js version to 24.x** (Project → Settings → General).

If the site moves to a custom domain, update `site` in `client/astro.config.mjs` and `url` in `client/src/data/site.ts` so canonical URLs, the sitemap and social cards point to the right place.

## License

© Prathamesh Kokkula. The code is free to read and learn from; please don't republish the personal content, photo or résumé.
