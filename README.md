TASK: REPLACE entire content of README.md in project root.

File path: M:\work\maverick-cursor\README.md

REPLACE ENTIRE FILE WITH:

# Maverick Business Academy — Homepage Prototype

## Quick Start — READ BEFORE DOING ANYTHING

If you are a developer or AI assistant working on this project,
read these files in this exact order before writing any code:

1. `docs/01-PROJECT_BRIEF.md` — What we are building and why
2. `docs/02-CLIENT_SOP.md` — Client-approved structure and content rules
3. `docs/03-DESIGN_SYSTEM.md` — Visual rules (STRICT — never break)
4. `docs/04-TECHNICAL_ARCHITECTURE.md` — Tech stack and patterns
5. `docs/05-CONTENT_SOURCE.md` — Current state of all sections
6. `docs/06-DEVELOPMENT_LOG.md` — Session-by-session build history
7. `docs/07-CHANGE_LOG.md` — Version-by-version changes
8. `docs/08-AI_INSTRUCTIONS.md` — Rules for AI assistants
9. `docs/09-PROMPT_TEMPLATES.md` — Reusable prompt templates

## Project Phases

### Phase 0 — Homepage Prototype (CURRENT)

Static HTML/CSS/JavaScript prototype of the homepage for client
approval. No backend, no admin panel. Pure frontend demo.

**Status:** 15 sections built, footer pending, polish pass pending.

### Phase 1 — PHP Website + Admin Panel (NEXT, after client approval)

After client signs off on Phase 0 prototype:

- Convert prototype to PHP-based dynamic website
- Build custom admin panel for non-technical content management
- Migrate existing WordPress data to new database
- Connect all dynamic sections (Section 11 partners, Section 14
  testimonials, Section 13 events, Footer newsletter, etc.) to
  database-driven content
- Add multi-language support (English + Arabic)
- Integrate CRM for lead capture (Apply Now, Newsletter, Contact)
- Development approach: AI-assisted (using Cascade / Cursor /
  Codex / Antigravity / Claude as primary development tools)

### Phase 2 — Future Enhancements

- Mobile app (React Native or similar)
- Online course delivery platform integration
- Student portal
- Alumni network platform

## Run Locally

### Option 1: Local Web Server (Recommended)

Required for D3 map and dynamic features to work properly
(due to fetch CORS restrictions on file:// origin).

- VS Code Live Server extension (right-click index.html →
  "Open with Live Server")
- OR Python: `python -m http.server 8000` then
  `http://localhost:8000`
- OR Node.js: `npx http-server -p 8000`
- OR XAMPP: place folder in htdocs, start Apache, open
  `http://localhost/maverick-cursor/`

### Option 2: Direct File Open

Opening `index.html` directly in browser works for most
sections, but Section 11 (University Partners map) will
fail to load world map data.

## Tech Stack (Phase 0 — Prototype)

- Vanilla HTML5 / CSS3 / JavaScript ES6+
- GSAP 3.12.5 + ScrollTrigger + ScrollToPlugin (CDN)
- Lenis 1.0.42 smooth scroll (CDN)
- D3.js 7.8.5 + TopoJSON (lazy-loaded for Section 11)
- Clash Display + Poppins fonts (CDN)
- No frameworks, no NPM, no build tools

## Tech Stack (Phase 1 — Production, Planned)

- PHP 8+ (custom MVC, no framework)
- MySQL / MariaDB
- Custom admin panel (PHP + vanilla JS)
- Same frontend (HTML/CSS/JS preserved from prototype)
- AI-assisted development (Cascade, Cursor, Codex)

## Project Structure

maverick-cursor/
├── index.html ← Main homepage
├── README.md ← This file
├── PROJECT_CONTEXT.md ← AI context file
├── docs/ ← Project documentation
│ ├── 01-PROJECT_BRIEF.md
│ ├── 02-CLIENT_SOP.md
│ ├── 03-DESIGN_SYSTEM.md
│ ├── 04-TECHNICAL_ARCHITECTURE.md
│ ├── 05-CONTENT_SOURCE.md
│ ├── 06-DEVELOPMENT_LOG.md
│ ├── 07-CHANGE_LOG.md
│ ├── 08-AI_INSTRUCTIONS.md
│ └── 09-PROMPT_TEMPLATES.md
└── assets/
├── css/
│ ├── main.css ← Variables, base, navbar, hero
│ ├── sections.css ← Per-section styles
│ └── responsive.css ← Responsive overrides
├── js/
│ ├── main.js ← Lenis + utilities
│ ├── navigation.js ← Navbar behavior
│ ├── animations.js ← All GSAP animations
│ ├── partners.js ← Section 11 D3 map module
│ ├── testimonials.js ← Section 14 video carousel
│ └── scroll-controls.js ← Shared horizontal scroll
├── images/
│ ├── logo.png
│ ├── world-map.svg
│ └── universities/
│ └── placeholder-logo.png
└── videos/
└── maverick-hero.mp4

## Critical Rules

### Design System (STRICT)

- NO CSS frameworks (Tailwind, Bootstrap, etc.)
- NO border-radius > 2px (exception: video play button circles)
- NO colored backgrounds — only black, near-black, white, warm white
- Sections MUST alternate dark and light backgrounds
- All complex animations via GSAP only (no CSS keyframes for
  scroll-triggered effects)
- Accent gold (`#C9A96E`) used sparingly — CTAs, hover states,
  accent lines only
- BEM naming: `.section__element--modifier`

### Code Quality

- IIFE pattern for all JavaScript modules
- `elementExists()` guard before animations
- `prefersReducedMotion` check in all animations
- `ScrollTrigger toggleActions: 'play none none none'`
- Counters use `once: true`
- All interactive elements have `aria-label`
- Keyboard navigation supported (Tab, Enter, Space, ESC)

### PHP-Ready Markup

- Repeating items wrapped with HTML comments:
  `<!-- DYNAMIC START: name --> ... <!-- DYNAMIC END: name -->`
- Dynamic values in `data-*` attributes
- No inline styles
- All paths relative

### Before Making Changes

1. Read `docs/03-DESIGN_SYSTEM.md`
2. Read `docs/04-TECHNICAL_ARCHITECTURE.md`
3. Check `docs/05-CONTENT_SOURCE.md` for current status
4. Read latest entries in `docs/06-DEVELOPMENT_LOG.md`

## Documentation

See `docs/` folder for complete project documentation including
client SOP, design system, technical architecture, content source,
development log, change log, AI instructions, and prompt templates.
