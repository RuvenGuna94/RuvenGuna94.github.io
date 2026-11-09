# Ruven Guna

A personal, reading-first website about learning and building in data and AI.

**Website:** https://ruvenguna94.github.io/

## Scope

Home, Projects, Labs and Writing, with two project families: AI Governance and RAG Engineering. Project details remain explicitly labelled placeholders until verified. Articles and lab guides are added when ready; local sample drafts are not included in the public repository or deployment.

## Stack

- Astro static output with Markdown/MDX content collections and schema validation
- Custom CSS with Merlot and Sage light/dark themes
- Locally served Manrope, Fraunces and JetBrains Mono fonts
- GitHub Pages deployment through GitHub Actions

The site has no backend, accounts, database or analytics tracking.

## Local development

Use Node 24 and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local address printed by Astro, normally http://localhost:4321/.

```sh
pnpm check
pnpm build
pnpm verify:dist
pnpm preview
```

The build creates `dist/`. The output verification checks local links and ensures draft pages and preview notices are absent. The optional browser QA script requires Playwright Chromium and the local reading samples; those samples are intentionally not distributed in this repository.

## Content and design

`src/content/projects/`, `src/content/labs/` and `src/content/writing/` contain content. Schemas live in `src/content.config.ts`; reusable layouts live in `src/layouts/`; shared CSS tokens and responsive rules live in `src/styles/global.css`.

Keep articles and labs `draft: true` until approved. Articles require an approved publication date before becoming non-draft. Production builds exclude drafts, and RSS includes only published, dated articles. Do not set `PREVIEW_DRAFTS=true` in deployment.

Manrope is the reading face, Fraunces is reserved for selected headings, and JetBrains Mono is used for code. Both themes prioritise text contrast, comfortable reading columns, keyboard navigation and mobile reflow. Avoid emoji and emoticons by default. Articles use a casual voice; repository documentation uses a technical, professional tone. Each section should add new information.

## Deployment

Pushes to `main` and manual workflow runs build the site, verify the static output and deploy to GitHub Pages. The workflow sets `SITE_URL` to the repository owner's GitHub Pages origin. For a future repository subpath, set `BASE_PATH` and verify all routes before deploying.

## Enterprise readiness and roadmap

This is a static personal publication. The roadmap addresses its operational needs; it is not an enterprise-readiness certification or a delivery commitment.

| Gap or unassessed area | Proposed enhancement | Provisional priority | Acceptance check |
| --- | --- | --- | --- |
| Automated accessibility and visual regression checks are not in CI | Add production-page browser checks to pull requests | Before routine publishing | Deliberate accessibility and layout regressions fail CI |
| Screen-reader, actual 200%+ zoom and real-device behaviour remain unassessed | Review representative long articles and labs using assistive technology and real devices | Before design sign-off | Record tested environments and resolve reading/navigation blockers |
| Dependency maintenance and availability monitoring are not configured | Establish dependency review and assess lightweight uptime checks | Later enhancement | Document the update and recovery process; verify alert delivery if monitoring is enabled |
| Real project repositories and evidence are not supplied | Replace overview placeholders and assess application-specific gaps | Before detailed project publication | Claims, diagrams and roadmap items are traceable to verified implementation evidence |

Each project's write-up and README should separately document verified enterprise-readiness gaps, their impact, proposed enhancements and acceptance checks. Distinguish confirmed gaps from unassessed areas and optional improvements.
