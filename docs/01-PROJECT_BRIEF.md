# Project Brief - Maverick Business Academy

## Overview

A premium cinematic homepage prototype for Maverick Business Academy (MBA London), an international education brand positioning itself as a premium global business school.

## Inspiration

Visual reference: tks.world - black and white aesthetic, scroll-driven storytelling, GSAP animations, premium feel.

## Phase 0 Scope (Current)

Build a fully functional homepage prototype with 15 sections, navbar, and footer. No backend, no admin panel - pure HTML/CSS/JS demo for client approval.

## Phase 1+ Roadmap (Future)

After client approval:

- Convert prototype to PHP-based website
- Build custom admin panel for content management
- Migrate existing WordPress data
- Add multi-language support (English + Arabic)
- Integrate CRM for lead capture

## Target Audience

- Prospective students (16-30) seeking international business education
- Working professionals seeking executive/MBA programs
- Corporate clients seeking training partnerships
- Parents researching premium options for their children

## Brand Positioning

- Premium, intentional, editorial
- Globally connected
- Career-transforming
- Not another college site - feels like a luxury brand for education

## Success Criteria

- Cinematic feel comparable to top design agency websites
- Mobile-perfect responsive behavior
- Premium typography and spacing
- Smooth animations without performance issues
- PHP-ready architecture with semantic HTML, clean data attributes, and separation of concerns

## Current Status

- All 15 homepage sections are built in `index.html`
- Navbar and mobile menu are complete
- Footer is present in `index.html`
- GSAP animation module covers hero and all homepage content sections
- Section 11 uses dynamic JS rendering for partner map/detail content
- Section 14 uses dynamic JS rendering for testimonials
- Horizontal scroll modules with drag and arrow controls are shared across Sections 12, 13, and 14
- Asset folders contain current image, video, and logo placeholder files
- Polish pass pending after final review

## Tech Stack Summary

- Vanilla HTML5 / CSS3 / JavaScript ES6
- GSAP 3.12.5 + ScrollTrigger + ScrollToPlugin
- Lenis 1.0.42 smooth scroll
- D3.js 7.8.5 + TopoJSON lazy-loaded for Section 11
- Roboto + Poppins fonts via CDN
- No build tools, no frameworks, no NPM
