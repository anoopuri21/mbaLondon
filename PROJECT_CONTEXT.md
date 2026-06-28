# PROJECT CONTEXT — Maverick Business Academy

## ⚠️ AI AGENTS: Read This First
This file describes the current state of the codebase.
For full project details, read the docs/ folder:
- docs/01-PROJECT_BRIEF.md — Project scope
- docs/02-CLIENT_SOP.md — Client requirements
- docs/03-DESIGN_SYSTEM.md — Visual rules (CRITICAL)
- docs/04-TECHNICAL_ARCHITECTURE.md — Tech patterns
- docs/05-CONTENT_SOURCE.md — All copy/content
- docs/06-DEVELOPMENT_LOG.md — Progress and issues

## Project Summary
Premium cinematic homepage prototype for Maverick Business Academy
(MBA London). Inspired by tsk.world — scroll-driven storytelling,
black and white with gold accent, GSAP animations.

Static HTML/CSS/JS only. No frameworks. No build tools.

## Tech Stack
- HTML5 + Custom CSS + Vanilla JS
- GSAP 3.12.5 + ScrollTrigger (CDN)
- Lenis 1.0.42 smooth scroll (CDN)

## Critical Design Rules (See docs/03-DESIGN_SYSTEM.md for full list)
- Sections ALTERNATE: dark (#000) → light (#FFF) → dark → light
- Accent gold: #C9A96E (sparingly)
- Display font: Clash Display | Body font: Poppins
- Max border-radius: 2px
- All complex animations: GSAP only
- ScrollTrigger: play once, never reverse

## File Map
index.html — All sections
assets/css/main.css — All styles + CSS variables
assets/css/responsive.css — Breakpoints
assets/js/main.js — Lenis setup + lenisReady event
assets/js/animations.js — All GSAP animations
assets/js/navigation.js — Navbar behavior
assets/videos/maverick-hero.mp4 — Hero background video


## Script Init Order
main.js (Lenis) → lenisReady event → animations.js (ScrollTriggers) → navigation.js

## Sections Built
| # | Section | ID | Theme | Status |
|---|---------|-----|-------|--------|
| — | Navbar | #navbar | — | ✅ Complete |
| 1 | Hero | #hero | DARK | ✅ Complete |
| 2 | Numbers | #numbers | LIGHT | ✅ Complete |
| 3 | What Is Maverick | #what-is-maverick | DARK | ✅ Complete |
| 4 | Who We Are | #who-we-are | LIGHT | ✅ Complete |
| 5 | What We Do | #what-we-do | DARK | ✅ Complete |
| 6 | How We Do It | #how-we-do-it | LIGHT | ✅ Complete |
| 7 | Alumni Network | #alumni-network | DARK | ❌ Not started |
| 8 | Featured Programs | #featured-programs | LIGHT | ❌ Not started |
| 9 | Why Maverick | #why-maverick | DARK | ❌ Not started |
| 10 | Global Opportunities | #global-opportunities | LIGHT | ❌ Not started |
| 11 | University Partners | #university-partners | DARK | ❌ Not started |
| 12 | Faculty Insights | #faculty-insights | LIGHT | ❌ Not started |
| 13 | Upcoming Events | #upcoming-events | DARK | ❌ Not started |
| 14 | Video Testimonials | #video-testimonials | LIGHT | ❌ Not started |
| 15 | Final CTA | #final-cta | DARK | ❌ Not started |
| — | Footer | #footer | DARK | ❌ Not started |
| — | Preloader | #preloader | — | ❌ Not started |
| — | Custom Cursor | #cursor-dot | — | ❌ Not started |

## Immediate Next Steps
1. Visual review of alternating pattern
2. Build Alumni Network section (DARK)
3. Build Featured Programs section (LIGHT)
4. Continue building remaining sections

## CSS Classes Available (DO NOT REDEFINE)
Layout: .container, .container--wide, .section-wrapper, .flex-center,
        .flex-between, .grid-2, .grid-3, .grid-4, .full-height, .full-width
Typography: .display-text, .section-title, .section-subtitle, .card-title,
            .body-text, .caption-text, .accent-text, .gradient-text
Animation: .text-reveal-wrapper, .text-reveal-inner, .fade-up, .fade-in, .scale-in
Buttons: .btn, .btn--primary, .btn--secondary, .btn--ghost
Labels: .section-label (gold line + uppercase text)
Placeholders: .img-placeholder, .video-placeholder

## Light Section Tokens (IMPLEMENTED)
Background: #FFFFFF
Primary text: #000000
Secondary text: rgba(0,0,0,0.6)
Tertiary text: rgba(0,0,0,0.4)
Borders: rgba(0,0,0,0.08)
Accent: #C9A96E (unchanged)
