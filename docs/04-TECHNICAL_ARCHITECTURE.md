# Technical Architecture - Maverick Business Academy

## Current Phase

Static homepage prototype.

## Prototype Stack

- Vanilla HTML5
- Custom CSS with CSS variables
- Vanilla JavaScript ES6 using IIFE modules
- GSAP 3.12.5
- GSAP ScrollTrigger
- GSAP ScrollToPlugin
- Lenis 1.0.42
- D3.js 7.8.5 and TopoJSON lazy-loaded by `partners.js`
- No jQuery
- No NPM
- No build process

## File Structure

```text
maverick-cursor/
  index.html
  README.md
  PROJECT_CONTEXT.md
  docs/
    01-PROJECT_BRIEF.md
    02-CLIENT_SOP.md
    03-DESIGN_SYSTEM.md
    04-TECHNICAL_ARCHITECTURE.md
    05-CONTENT_SOURCE.md
    06-DEVELOPMENT_LOG.md
    07-CHANGE_LOG.md
    08-AI_INSTRUCTIONS.md
    09-PROMPT_TEMPLATES.md
  assets/
    css/
      main.css
      sections.css
      responsive.css
    js/
      main.js
      navigation.js
      animations.js
      partners.js
      testimonials.js
      scroll-controls.js
    images/
      logo.png
      world-map.svg
      worldHigh.svg
      universities/
        placeholder-logo.png
    videos/
      maverick-hero.mp4
      maverick-hero-2.mp4
```

## CSS Architecture

### `assets/css/main.css`

Contains:

- CSS custom properties
- Reset
- Base body styles
- Lenis setup styles
- Typography utilities
- Layout utilities
- Button styles
- Placeholder image/video system
- Reveal helper classes
- Section labels
- Scrollbar styling
- Navbar, dropdown, and mega menu styles
- Hero styles
- Numbers styles
- Who We Are styles
- What We Do styles
- How We Do It styles
- Light section utility system

### `assets/css/sections.css`

Contains section modules for:

- Alumni Network
- Featured Programs
- Why Maverick
- Global Opportunities and Pathways
- University Partners
- Faculty Insights
- Upcoming Events
- Video Testimonials
- Final CTA
- Shared scroll row controls

Approximate line count: 2146 lines.

### `assets/css/responsive.css`

Contains responsive rules for:

- Navbar
- Hero
- Numbers
- What Is Maverick
- Who We Are
- What We Do
- How We Do It

Breakpoints:

- `max-width: 1024px`
- `max-width: 768px`
- `max-width: 480px`

## JavaScript Architecture

### `assets/js/main.js`

Bootstrap module for Lenis smooth scroll, loading state, anchor scrolling, and global scroll helper.

### `assets/js/navigation.js`

Navigation interaction module for scroll state, hide/show behavior, desktop mega menu, dropdowns, mobile menu, mobile accordions, keyboard access, and resize handling.

### `assets/js/animations.js`

GSAP/ScrollTrigger animation module for all homepage sections.

Init functions:

- `initHeroAnimations`
- `initHeroScrollAnimations`
- `initNumbersAnimations`
- `initWIMAnimations`
- `initWWAAnimations`
- `initWWDAnimations`
- `initHWDIAnimations`
- `initAlumniAnimations`
- `initProgramsAnimations`
- `initWhyMaverickAnimations`
- `initOpportunitiesAnimations`
- `initPartnersAnimations`
- `initInsightsAnimations`
- `initEventsAnimations`
- `initTestimonialsAnimations`
- `initFinalCTAAnimations`
- `initAllAnimations`

### `assets/js/partners.js`

Dynamic Section 11 module. Renders partner data, mobile country list, detail panel, and lazy-loaded D3/TopoJSON world map.

### `assets/js/testimonials.js`

Dynamic Section 14 module. Renders testimonial cards and controls video modal behavior.

### `assets/js/scroll-controls.js`

Shared horizontal scroll module. Adds drag, momentum, arrow controls, and button state handling for scroll rows.

## Architectural Patterns

### IIFE Pattern (All JS Modules)

All JavaScript files use Immediately Invoked Function Expression pattern:

```javascript
(function () {
  "use strict";
  // module code here
})();
```

This avoids global scope pollution and creates module isolation.

### Animation Init Pattern

Every section animation follows this structure:

```javascript
function initSectionNameAnimations() {
  if (!elementExists("#section-id")) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    // Set elements to final visible state, skip animations
    return;
  }

  // FOUC prevention (gsap.set hidden states)
  // Animations (gsap.to with ScrollTrigger)
}
```

All section init functions are called from `initAllAnimations()`.

### Lazy Loading Pattern

Used in `partners.js` for D3 library:

```javascript
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      loadScript(D3_CDN);
      loadScript(TOPOJSON_CDN);
      renderMap();
      observer.unobserve(entries[0].target);
    }
  },
  { rootMargin: "200px" },
);

observer.observe(document.getElementById("university-partners"));
```

### Dynamic Rendering Pattern

Used in `partners.js` and `testimonials.js`:

```javascript
const dataArray = [...]; // PHP migration: replace with DB query

function renderItems() {
  const container = document.getElementById('...');
  let html = '';
  dataArray.forEach(item => {
    html += `<article class="..." data-id="${item.id}">...</article>`;
  });
  container.innerHTML = html;
}
```

## Performance Optimizations

### Currently Implemented

- D3.js library lazy loaded (saves ~310KB from initial page load)
- World map TopoJSON fetched on demand
- IntersectionObserver for lazy triggers (200px margin)
- All images use `loading="lazy"` attribute
- GSAP animations use only transform and opacity
- Debounced resize handlers (250ms debounce for D3 map re-render)
- Number counter animations use `once: true`
- Scroll-snap for horizontal carousels
- All scripts use `defer` attribute
- ScrollTrigger uses `toggleActions: 'play none none none'`

### Pending Optimizations

- Image compression and WebP conversion
- Critical CSS extraction
- Service worker for offline cache
- Resource hints for fonts and hero video
- Font subsetting for Roboto and Poppins

## CDN Dependencies

Loaded in `index.html`:

1. `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
2. `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`
3. `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js`
4. `https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js`

Lazy-loaded by `partners.js`:

1. `https://cdn.jsdelivr.net/npm/d3@7.8.5/dist/d3.min.js`
2. `https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js`
3. `https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json`

## Font Loading

- Roboto: Google Fonts
- Poppins: Google Fonts

## Script Order

Project scripts load with `defer`:

1. `assets/js/main.js`
2. `assets/js/navigation.js`
3. `assets/js/animations.js`
4. `assets/js/partners.js`
5. `assets/js/testimonials.js`
6. `assets/js/scroll-controls.js`

## Known Runtime Warnings

- `animations.js` warns if GSAP or ScrollTrigger is missing.
- `animations.js` warns if `lenisReady` does not fire within 1 second.
- `main.js` logs an error if Lenis is missing or initialization fails.
- `partners.js` logs errors if D3/TopoJSON/world map fetches fail.

## Production Architecture (Phase 1) — UPDATED

> **Stack change notice:** The PHP/custom-admin-panel plan previously
> described in this section has been scrapped entirely and is no longer
> in use. Phase 1 now uses Next.js + Payload CMS + MySQL. See the
> full plan in the dedicated docs below — this section is kept short
> and just points there to avoid duplicating/diverging content.

### Planned Tech Stack

- **Next.js** (App Router) — frontend framework
- **Payload CMS 3.x** — installed natively inside the Next.js app
  (single repo, single deployment; admin panel at `/admin`)
- **MySQL** — database, via Payload's MySQL adapter
- **Cloudinary** — image and video hosting/delivery
- **Cloudflare** — CDN + caching
- **Zoho** — newsletter / CRM
- **Zapier** — automation between site forms and Zoho
- Same frontend visual design preserved from this prototype — 0%
  visual/feature change in the conversion to Next.js
- AI-assisted development (Cursor AI handles ~99% of implementation)

### Where to Find the Full Phase 1 Plan

- **docs/10-PHASE1_SITEMAP.md** — full page inventory: 33 static-structure
  pages + 3 dynamic CMS collections (Programs, University Partners,
  Insights)
- **docs/11-PHASE1_TASKS.md** — phase-wise build plan, start to finish
- **docs/12-PAYLOAD_SCHEMA.md** — Payload Collections, Globals, and the
  mandatory SEO field group (title, description, keywords, slug, schema
  JSON, scripts) required on every page
- **docs/13-INTEGRATIONS_GUIDE.md** — Cloudinary, Cloudflare, and the
  Zoho + Zapier newsletter/CRM integration plan

### Conversion Rules Carried Forward From Prototype

The markup conventions below (DYNAMIC START/END comments, `data-*`
attributes for dynamic values, relative asset paths, no inline styles,
semantic HTML) remain useful signals during the Next.js conversion —
they mark exactly which parts of the existing HTML need to become
Payload-driven components vs. which stay static markup.

```html
<!-- DYNAMIC START: name -->
...items rendered dynamically from Payload data...
<!-- DYNAMIC END: name -->
```

```html
<span data-counter-target="5000">0</span>
<article data-country-id="uk">...</article>
```

### Data Layer Migration Mapping (Updated for Payload)

| Section           | Current Source                            | Phase 1 Source                                                                                            |
| ----------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1-10, 12, 13, 15  | Static HTML                               | Payload Global (`home`) — see docs/12-PAYLOAD_SCHEMA.md                                                   |
| 11 - Partners     | `countriesData[]` in `partners.js`        | `university-partners` Payload collection, feeding the World Map admin (docs/11-PHASE1_TASKS.md Phase 1.5) |
| 14 - Testimonials | `testimonialsData[]` in `testimonials.js` | Testimonials field on the relevant Global/collection (video URLs via Cloudinary)                          |
| Footer newsletter | Placeholder form                          | POST → webhook → Zapier → Zoho, see docs/13-INTEGRATIONS_GUIDE.md                                         |
| All forms         | No backend                                | Next.js API routes → Zapier → Zoho CRM/Campaigns                                                          |

### Out of Scope / Removed

- Custom PHP admin panel — replaced entirely by Payload's built-in
  admin UI
- WordPress data export/migration — not applicable, this is a fresh
  build, not a WordPress migration
- Mailchimp — replaced by Zoho per client decision

## Browser Support

- Chrome and Edge: latest 2 versions
- Firefox: latest 2 versions
- Safari: latest 2 versions (desktop)
- Mobile Safari: iOS 14+
- Chrome Android: latest version
- No support for Internet Explorer
