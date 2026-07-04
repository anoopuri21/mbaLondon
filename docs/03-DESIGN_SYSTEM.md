# Design System - Maverick Business Academy

## Core Principle

**Premium. Editorial. Intentional.**

Every visual decision must reinforce a high-end, international, transformative brand identity.

## Color Palette

### Primary

- Pure Black: `#000000`
- Near Black: `#0A0A0A`
- White: `#FFFFFF`
- Warm White: `#F5F0EB`

### Accent

- Gold Accent: `#C9A96E` - CTAs, hover states, accent lines, and key highlights
- Gold Light: `#E8D5B0` - hover state of gold accent

### Greys

- Dark Charcoal: `#111111`
- Muted Grey: `#2A2A2A`
- Light Grey: `#A0A0A0`

## Typography

### Fonts

- Headlines: Roboto
- Body: Poppins
- Fallback: system-ui, sans-serif

### CSS Font Variables

- `--fs-hero`: massive hero headline
- `--fs-hero-sub`: hero subtitle
- `--fs-section-title`: section H2 headings
- `--fs-card-title`: card H3 titles
- `--fs-body`: body paragraphs
- `--fs-caption`: small text and labels

### Hierarchy Rules

- Section labels: uppercase, tracked, gold
- H2 headings: Roboto, tight line height
- Body: Poppins, readable line height
- Buttons: uppercase, tracked, medium weight

## Section Background Alternation

| #      | Section              | Background |
| ------ | -------------------- | ---------- |
| 1      | Hero                 | DARK       |
| 2      | Numbers              | LIGHT      |
| 3      | What Is Maverick     | DARK       |
| 4      | Who We Are           | LIGHT      |
| 5      | What We Do           | DARK       |
| 6      | How We Do It         | LIGHT      |
| 7      | Alumni Network       | DARK       |
| 8      | Featured Programs    | LIGHT      |
| 9      | Why Maverick         | DARK       |
| 10     | Global Opportunities | LIGHT      |
| 11     | University Partners  | DARK       |
| 12     | Faculty Insights     | LIGHT      |
| 13     | Upcoming Events      | DARK       |
| 14     | Video Testimonials   | LIGHT      |
| 15     | Final CTA            | DARK       |
| Footer | Site footer          | DARK       |

## Border Radius

- Maximum rectangular radius: 2px in current section modules
- Exception: circular play button overlays in video cards

## Spacing System

- Section padding desktop: typically 120px top/bottom
- Section padding mobile: typically 80px top/bottom
- Final CTA desktop padding: 160px
- Container max width: `--max-width`
- Container padding: `--container-padding`
- Grid gaps: `--grid-gap`, `--grid-gap-tight`, `--grid-gap-loose`

## Component Patterns

### Section Header

Structure:

- Section label
- Heading with text-reveal animation
- Subtitle paragraph

Text-reveal pattern:

```html
<span class="text-reveal-wrapper">
  <span class="text-reveal-inner">TEXT</span>
</span>
```

### Buttons

- Primary: gold background, black text
- Secondary: transparent background, themed border
- Ghost: transparent background, gold border and text
- Hover behavior: color/border transition and arrow movement where applicable

### Cards

- Thin borders
- Minimal radius
- Hover border/color shifts
- Horizontal card rows use shared scroll controls where applicable

## Animation Patterns

- Text reveal: `.text-reveal-wrapper` + `.text-reveal-inner`
- Fade up: `.fade-up`
- Fade in: `.fade-in`
- Scale in: `.scale-in`
- Counters: GSAP proxy object
- Parallax: scrubbed ScrollTrigger timelines
- Pinned storytelling: Section 3 / `#what-is-maverick`

## Responsive Breakpoints

- `@media (max-width: 1024px)`
- `@media (max-width: 768px)`
- `@media (max-width: 480px)`

## Current Asset Treatment

- Hero uses `assets/videos/maverick-hero.mp4`
- Repeated image cards currently use `assets/images/universities/placeholder-logo.png`
- Placeholder system exists in `main.css`
