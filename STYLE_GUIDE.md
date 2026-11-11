# Typography and reading standard

Reviewed 11 November 2026. This is the shared formatting contract for new pages and components. It records the local typography review; it does not authorise publication.

## Font roles

- **Manrope:** paragraphs, articles, lab instructions, navigation, controls, cards, metadata, tables and footer. Use 400 for reading, 500–600 for UI emphasis and 600–700 for headings. Avoid long passages in bold.
- **Fraunces:** site identity, homepage greeting and selected page/article titles. Use the bundled 500 weight. Do not use it for body paragraphs or dense technical UI.
- **JetBrains Mono:** code blocks and inline technical identifiers, using the bundled 400 weight.

Fonts are bundled locally through Fontsource in `src/layouts/Base.astro`, with system fallbacks. Reuse the existing weights before adding font files or another family.

## Shared sizes

The implementation lives in `src/styles/typography-tokens.css`; `src/styles/global.css` applies those tokens. Pixel equivalents below assume the browser's normal 16px root. They are not fixed-pixel rules: keep the root size unset and use the relative tokens so reader preferences scale the text.

| Role | Desktop | Mobile | Token / convention |
| --- | --- | --- | --- |
| Body and long-form prose | 18px | 17px | `--text-body`: 1.125rem / 1.0625rem |
| Navigation, footer, social links, section links, callouts and references | 16px | 16px | `--text-ui`: 1rem |
| Metadata, tags, captions, short labels, contents links and theme control | 14px minimum | 14px minimum | `--text-small`: .875rem |
| Main display title | Fluid 34.4–51.2px | 35.2px | `--text-h1` |
| Article/lab title | Fluid 32–44.8px | 32px minimum | `--text-article-title` |
| Section heading | 24.8px | 21.6px | `--text-h2` |
| Prose H2 | 24px | 24px | `--text-prose-h2` |
| Prose H3 and list titles | 20px | 20px | `--text-h3` |
| Project card title | 21.6px, weight 700 | Same | `--text-card-title` |
| Code block | 16px | 16px | `--text-code`: 1rem |
| Inline code | 15px | 15px | `--text-inline-code`: .9375rem |
| Table text | 16px | 16px | `--text-ui`; use a scroll wrapper |

Use roles rather than inventing a new size for each component. A genuinely different role should get a named token and a short explanation here. Decorative symbols and portrait dimensions are not text-size roles.

## Reading layout

Body line height is 1.75; article and lab paragraphs/list items use 1.8; headings use approximately 1.3–1.4. Keep paragraphs left-aligned with visible paragraph spacing. Do not fully justify text, use long all-caps labels or add broad letter-spacing to reading text.

Use `--reading-width` for long-form columns. Its current value is **58ch in Manrope**, measured in the browser to produce about **67–74 actual characters on full lines** in the representative samples. The earlier 68ch setting produced about 85–89 characters because `ch` measures the zero glyph, not an average character. Reading comfort takes precedence over the brief's initial approximate CSS width. Last lines and mobile lines will naturally be shorter.

Keep the wider site shell for navigation, home sections and project grids. Never stretch article paragraphs to fill that shell. Recheck actual line lengths after changing font family, weight or body size.

Code blocks use comfortable line height and keyboard-focusable horizontal scrolling. Tables use 16px text and a minimum width inside a labelled, keyboard-focusable scroll region. Horizontal scrolling belongs inside code/table regions, not on the whole page.

## Contrast and semantics

Use dark ink for light-mode body text and light cream for dark-mode body text. Keep normal text at least 4.5:1 against its actual background; larger text requires at least 3:1. Prefer the stronger threshold for all text when practical. Use the darker sage token for light-mode links and light sage in dark mode. Underline prose and action links so colour is not their only cue.

Use one H1, followed by meaningful H2/H3 sections. Heading level describes the document structure, not the desired font size. `ProjectCards` defaults to H3 within a homepage H2 section; pass `headingLevel="h2"` on the Projects index. The same card-title token styles both levels.

These font choices and sizes are editorial decisions, not values mandated by WCAG. Font preference is personal; measurable contrast, scaling, spacing tolerance and reading width matter more than naming one universally best font.

## Adding a page

1. Use `Base.astro` for the shared shell. Use `Reading.astro` for articles and labs so the prose width, code/table handling, contents links and notices stay consistent.
2. For a new reading region, apply `.prose` and the shared reading-width token. For UI, use the body family and the appropriate shared size token.
3. Preserve system theme selection, saved appearance preference, visible focus and underlined links. Do not add inline typography values when a role already exists.
4. Check desktop, 390px mobile and 320px reflow widths in both themes. Confirm fonts loaded, text did not clip, and navigation and the footer wrap comfortably.
5. Check an enlarged browser default-font preference and the text-spacing overrides below. Do not hide overflow to conceal a failing text layout.

## Accessibility checks and scope

WCAG AA requires text resizing up to 200% without loss of content/functionality. Text-spacing tolerance means the page must survive user overrides of 1.5 line height, 2em paragraph spacing, .12em letter spacing and .16em word spacing. Those override values are not mandatory default styling.

The 11 November local audit passed **24 normal page/theme/width checks and 16 text-spacing/font-preference stress checks**, with zero detected failures. It covers Home, Projects, a sample article and a sample lab in both themes at 1280, 390 and 320px, plus 320px text-spacing and 200% root-font-preference stress cases. Automated checks examine contrast/accessibility, overflow, heading clipping and small text. The before/after line measurements are from representative paragraph samples.

A doubled root-font preference is not the same as every browser's actual zoom behaviour. These checks do not constitute full WCAG certification; screen-reader, real-device and actual browser-zoom sessions remain separate checks before final accessibility sign-off.

## References

- [W3C: minimum contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C: text resizing](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [W3C: text-spacing tolerance](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- [W3C: visual presentation, Level AAA](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html) — useful reading-width guidance, not an AA certification claim.
