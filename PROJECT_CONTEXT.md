# PROJECT CONTEXT — Maverick Business Academy (mbaLondon)

## ⚠️ AI AGENTS: Read This First

This file describes the current state of the codebase.
For full project details, read the docs/ folder in this order:

- docs/01-PROJECT_BRIEF.md — Project scope
- docs/02-CLIENT_SOP.md — Client requirements (page-by-page content/SOP)
- docs/03-DESIGN_SYSTEM.md — Visual rules (CRITICAL — do not violate)
- docs/04-TECHNICAL_ARCHITECTURE.md — Phase 1 tech stack & architecture
- docs/05-CONTENT_SOURCE.md — All copy/content
- docs/06-DEVELOPMENT_LOG.md — Progress and issues
- docs/07-CHANGE_LOG.md — Change history
- docs/08-AI_INSTRUCTIONS.md — How AI/Cursor should work on this repo
- docs/09-PROMPT_TEMPLATES.md — Ready-to-use prompts, including the master
  "add fields to an underdeveloped page" prompt
- docs/10-PHASE1_SITEMAP.md — Full static + dynamic page inventory
- docs/11-PHASE1_TASKS.md — Phase-wise build plan, start to end
- docs/12-PAYLOAD_SCHEMA.md — Collections, globals, fields
- docs/13-INTEGRATIONS_GUIDE.md — Cloudinary, Cloudflare, Zoho, Zapier

## Project Summary

Premium cinematic website for Maverick Business Academy (MBA London).
Inspired by tsk.world — scroll-driven storytelling, black-and-white with
gold accent, GSAP animations.

## Current Status: Phase 0 COMPLETE ✅

Phase 0 was a static HTML/CSS/JS prototype of the homepage. **All 15
sections, navbar, footer, preloader, and custom cursor are built and
complete.** (The previous version of this file incorrectly listed
sections 7–15, footer, preloader, and cursor as "Not started" — that was
outdated; see docs/06-DEVELOPMENT_LOG.md and docs/07-CHANGE_LOG.md for
the real build history.)

Phase 0 stack (do not touch, do not modify — reference/visual baseline only):

- HTML5 + Custom CSS + Vanilla JS
- GSAP 3.12.5 + ScrollTrigger (CDN)
- Lenis 1.0.42 smooth scroll (CDN)

## Now Starting: Phase 1 — Full Rebuild

Phase 1 converts the static prototype into a production website with a
CMS-driven admin panel.

### New Tech Stack (Phase 1)

- **Next.js** — framework, pixel-identical conversion of existing HTML
- **Payload CMS 3.x** — installed natively inside the Next.js app
  (single repo, single deployment, admin panel at `/maverick-admin`)
- **MySQL** — database (via Payload's MySQL adapter)
- **Cloudinary** — image and video hosting/delivery
- **Cloudflare** — CDN + caching
- **Zoho** — newsletter / CRM
- **Zapier** — automation glue between the site and Zoho (and other tools)

### Non-negotiable Conversion Rules

1. Visual design and features = **0% change** from the existing
   index.html/CSS/JS. This is a like-for-like conversion to Next.js, not
   a redesign.
2. Inner pages reuse the homepage's visual design system as their base.
   Inner pages use **less animation** than the homepage to keep page load
   fast.
3. Existing CSS (main.css, sections.css, responsive.css, animations.css)
   is imported into Next.js as global stylesheets — NOT rewritten in
   Tailwind or CSS-in-JS.
4. Every page (static or CMS-driven) has mandatory admin-editable SEO
   fields: title, description, keywords, URL slug, schema JSON, custom
   scripts. No exceptions.
5. Course/program detail pages have an unlimited-entry FAQ repeater field
   in the admin panel.
6. ~99% of implementation work happens via Cursor AI. See
   docs/08-AI_INSTRUCTIONS.md and the root-level `.cursorrules` file.

## File Map (Phase 0, current)

index.html — All sections
assets/css/main.css — All styles + CSS variables
assets/css/responsive.css — Breakpoints
assets/css/sections.css — Section-specific styles
assets/css/animations.css — Animation-specific styles
assets/js/main.js — Lenis setup + lenisReady event
assets/js/animations.js — All GSAP animations
assets/js/navigation.js — Navbar behavior
assets/js/scroll-controls.js — Scroll control behavior
assets/js/partners.js — Partner section logic
assets/js/testimonials.js — Testimonials section logic
assets/videos/maverick-hero.mp4 — Hero background videos
assets/images/logo.png — Website logo
assets/images/world-map.svg — Map image

## Script Init Order (Phase 0 reference — preserve behavior in Next.js)

main.js (Lenis) → lenisReady event → animations.js (ScrollTriggers) → navigation.js

## Sections Built (Phase 0 — ALL COMPLETE)

| #   | Section              | ID                    | Theme | Status      |
| --- | -------------------- | --------------------- | ----- | ----------- |
| —   | Navbar               | #navbar               | —     | ✅ Complete |
| 1   | Hero                 | #hero                 | DARK  | ✅ Complete |
| 2   | Numbers              | #numbers              | LIGHT | ✅ Complete |
| 3   | What Is Maverick     | #what-is-maverick     | DARK  | ✅ Complete |
| 4   | Who We Are           | #who-we-are           | LIGHT | ✅ Complete |
| 5   | What We Do           | #what-we-do           | DARK  | ✅ Complete |
| 6   | How We Do It         | #how-we-do-it         | LIGHT | ✅ Complete |
| 7   | Alumni Network       | #alumni-network       | DARK  | ✅ Complete |
| 8   | Featured Programs    | #featured-programs    | LIGHT | ✅ Complete |
| 9   | Why Maverick         | #why-maverick         | DARK  | ✅ Complete |
| 10  | Global Opportunities | #global-opportunities | LIGHT | ✅ Complete |
| 11  | University Partners  | #university-partners  | DARK  | ✅ Complete |
| 12  | Faculty Insights     | #faculty-insights     | LIGHT | ✅ Complete |
| 13  | Upcoming Events      | #upcoming-events      | DARK  | ✅ Complete |
| 14  | Video Testimonials   | #video-testimonials   | LIGHT | ✅ Complete |
| 15  | Final CTA            | #final-cta            | DARK  | ✅ Complete |
| —   | Footer               | #footer               | DARK  | ✅ Complete |
| —   | Preloader            | #preloader            | —     | ✅ Complete |
| —   | Custom Cursor        | #cursor-dot           | —     | ✅ Complete |

## Immediate Next Steps (Phase 1)

See docs/11-PHASE1_TASKS.md for the full phase-wise plan. Summary:

1. Phase 1.0 — Next.js + Payload + MySQL project setup
2. Phase 1.1 — Convert existing homepage HTML to Next.js (pixel-identical)
3. Phase 1.2 — Build Payload schema (collections, globals, SEO fields)
4. Phase 1.3 — Build inner static pages (33 total, reduced animation)
5. Phase 1.4 — Build dynamic collection pages (Programs, Partners, Insights)
6. Phase 1.5 — World map admin interface
7. Phase 1.6 — Integrations: Cloudinary, Cloudflare, Zoho + Zapier
8. Phase 1.7 — QA, performance, launch

## CSS Classes Available (DO NOT REDEFINE — reuse as-is in Next.js)

Layout: .container, .container--wide, .section-wrapper, .flex-center,
.flex-between, .grid-2, .grid-3, .grid-4, .full-height, .full-width
Typography: .display-text, .section-title, .section-subtitle, .card-title,
.body-text, .caption-text, .accent-text, .gradient-text
Animation: .text-reveal-wrapper, .text-reveal-inner, .fade-up, .fade-in, .scale-in
Buttons: .btn, .btn--primary, .btn--secondary, .btn--ghost
Labels: .section-label (gold line + uppercase text)
Placeholders: .img-placeholder, .video-placeholder

## Design Tokens (IMPLEMENTED — see docs/03-DESIGN_SYSTEM.md for full list)

- Sections ALTERNATE: dark (#000) → light (#FFF) → dark → light
- Accent gold: #C9A96E (sparingly)
- Display font: Roboto | Body font: Poppins
- Max border-radius: 2px
- All complex animations: GSAP only
- ScrollTrigger: play once, never reverse
- Light section background: #FFFFFF / primary text: #000000 /
  secondary text: rgba(0,0,0,0.6) / tertiary text: rgba(0,0,0,0.4) /
  borders: rgba(0,0,0,0.08)
