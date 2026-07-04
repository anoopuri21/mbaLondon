# AI Agent Instructions — Maverick Business Academy

## ⚠️ READ THIS ENTIRE FILE FIRST (3 minutes)

This file overrides any default AI behavior. Follow exactly.

---

## CORE PRINCIPLE

**Be efficient. Save tokens. Verify before assuming.**
Every unnecessary file read, every redundant question,
every verbose response wastes user's AI quota.

---

## SMART FILE READING (Token Optimization)

### Tier 1 — Always Read First

For ANY task, read ONLY these two files first:

1. `PROJECT_CONTEXT.md` (current state — short)
2. This file (`docs/08-AI_INSTRUCTIONS.md`)

That's it. Do not read anything else yet.

### Tier 2 — Read Based On Task Type

After Tier 1, read ONLY what is relevant to your task:

| Task Type                                            | Read These Files                                                                             |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Building a new section (Phase 0 prototype reference) | docs/03-DESIGN_SYSTEM.md + docs/05-CONTENT_SOURCE.md + existing CSS/HTML for similar section |
| Fixing a bug                                         | docs/06-DEVELOPMENT_LOG.md + the affected file(s) only                                       |
| Adding animation                                     | docs/03-DESIGN_SYSTEM.md (animation section only) + animations.js                            |
| Client request                                       | docs/02-CLIENT_SOP.md + docs/07-CHANGE_LOG.md                                                |
| Architecture question (Phase 1 stack)                | docs/04-TECHNICAL_ARCHITECTURE.md + docs/10-PHASE1_SITEMAP.md                                |
| Any Phase 1 build task (Next.js/Payload/MySQL)       | docs/11-PHASE1_TASKS.md (find current phase) + docs/12-PAYLOAD_SCHEMA.md                     |
| Adding/editing a Payload collection or field         | docs/12-PAYLOAD_SCHEMA.md (update this doc too if adding new fields)                         |
| Cloudinary / Cloudflare / Zoho / Zapier work         | docs/13-INTEGRATIONS_GUIDE.md                                                                |
| Adding fields to an existing/underdeveloped page     | docs/09-PROMPT_TEMPLATES.md (use the "Add Fields to an Existing Page" master prompt)         |
| Setup/onboarding                                     | All docs/ files (one-time only)                                                              |

### Never Do This

- ❌ Read all source code files "just in case"
- ❌ Read full docs folder for every task
- ❌ Re-read files you read in same session
- ❌ Read images/videos folder content listings

---

## VERIFICATION PROTOCOL (Saves Tokens)

Before asking the user a question, check if the answer
exists in:

1. PROJECT_CONTEXT.md
2. The relevant docs/ file (from Tier 2 table)
3. Existing code patterns

Only ask the user if information is genuinely missing.

### Example

❌ BAD: "What color should I use for the heading?"
✅ GOOD: (Check docs/03-DESIGN_SYSTEM.md first — colors are defined)

❌ BAD: "Should this section be dark or light?"
✅ GOOD: (Check section background pattern table in docs/03)

---

## WHEN TO STOP AND ASK USER

Stop and ask user ONLY when:

- Information is missing from all documentation
- Two rules conflict and you cannot decide
- Task is ambiguous in scope (could mean 2+ things)
- User's intent is unclear
- A change would affect 3+ existing sections

Do NOT stop and ask when:

- Information exists in docs (look harder)
- Standard implementation choice (use industry best practice)
- Minor styling decision (follow design system)
- Variable naming (use BEM pattern already in code)

---

## CRITICAL RULES (Never Break)

### Design

1. NO border-radius > 2px anywhere
2. NO colored backgrounds — only #000, #FFF, #F5F0EB
3. Sections MUST alternate dark/light (see pattern table)
4. Accent gold #C9A96E only on CTAs, hovers, accent lines
5. Display font: Roboto | Body font: Poppins

### Code

6. All complex animations: GSAP only (no CSS keyframes)
7. ScrollTrigger: "play none none none" (never reverse)
8. Counters: once: true
9. Always check `elementExists()` before animating
10. Always respect `prefersReducedMotion`
11. CSS variables only — never hardcode colors
12. IIFE pattern for all JavaScript files

### Files

13. NEVER create new CSS or JS files without permission
14. CSS goes in main.css under commented sections
15. Responsive CSS in responsive.css only
16. Animations in animations.js only
17. Navigation logic in navigation.js only

### Phase 1 (Next.js + Payload + MySQL) — Additional Rules

18. PHP/custom-admin-panel approach is SCRAPPED — never reference it,
    never build it. Stack is Next.js + Payload CMS + MySQL only. See
    docs/04-TECHNICAL_ARCHITECTURE.md and docs/11-PHASE1_TASKS.md
19. Homepage conversion to Next.js must be pixel-identical — 0% visual
    or feature change from the existing index.html/CSS/JS
20. Inner pages reuse the homepage design system but use LESS animation
    than the homepage (performance priority on inner pages)
21. Existing CSS files are imported as global stylesheets in Next.js —
    NEVER rewritten into Tailwind or CSS-in-JS
22. Every page (static Global or dynamic Collection entry) MUST include
    the mandatory SEO field group: title, description, keywords, slug,
    schema JSON, scripts. No page ships without it.
23. FAQ fields on program detail pages must be an unlimited repeater —
    never hardcode a max count
24. World Map admin: the Programs dropdown must only pull from existing
    Programs collection entries — never allow free-text program entry
    at the university level
25. Don't invent new Payload fields/collections without checking
    docs/12-PAYLOAD_SCHEMA.md first — if a field genuinely needs adding,
    update that doc as part of the change (or use the master prompt in
    docs/09-PROMPT_TEMPLATES.md)

---

## OUTPUT RULES (Token Optimization)

### Be Concise

- No unnecessary explanations
- No "I will now do X" preambles
- Skip pleasantries (no "Great question!", "Absolutely!")
- Use tables and bullets over paragraphs
- Code first, explanation only if asked

### When Editing Files

Report format:
Files changed:

file1.ext (lines added/removed/modified)
file2.ext (lines added/removed/modified)
Summary: [1 sentence per file]

Issues found: [if any]

### When Building New Section

Report format:
Built: [section name]

HTML: X lines added to index.html
CSS: X lines added to main.css
Responsive: X lines added to responsive.css
JS: X lines added to animations.js
Animation triggers: [list functions added]

### What NOT To Output

- ❌ Full file dumps when only 10 lines changed
- ❌ "Here is the explanation of what I did..."
- ❌ Repeating user's request back to them
- ❌ Listing every CSS property you used
- ❌ Code comments explaining obvious things

---

## SECTION BUILDING WORKFLOW

When asked to build a new section:

1. Check PROJECT_CONTEXT.md sections table for:
   - Section ID
   - Required theme (dark/light)
   - Status

2. Check docs/05-CONTENT_SOURCE.md for content

3. Check docs/03-DESIGN_SYSTEM.md for:
   - Theme tokens (dark or light)
   - Animation patterns

4. Build in this order:
   - HTML inside existing <section> tag
   - CSS in main.css with section comment
   - Responsive CSS in responsive.css
   - GSAP animation as new function in animations.js
   - Call function from initAllAnimations()

5. After building:
   - Update PROJECT_CONTEXT.md status
   - Update docs/06-DEVELOPMENT_LOG.md
   - Brief report to user

---

## BUG FIXING WORKFLOW

When asked to fix a bug:

1. Read docs/06-DEVELOPMENT_LOG.md "Bug Fixes Applied" section
   (maybe already fixed before, avoid duplicate work)

2. Identify root cause before patching symptoms

3. Fix in minimal scope (don't refactor unrelated code)

4. Test that fix doesn't break existing sections

5. Add entry to docs/06-DEVELOPMENT_LOG.md

---

## CLIENT REQUEST WORKFLOW

When user mentions a new client request:

1. Add entry to docs/07-CHANGE_LOG.md using template

2. Assess impact:
   - Affected sections
   - Database changes needed
   - URL structure changes
   - Effort estimate

3. Wait for user approval before implementing

4. After implementation, update all affected docs

---

## COMMON MISTAKES TO AVOID

| Mistake                            | Why Bad              | Correct                       |
| ---------------------------------- | -------------------- | ----------------------------- |
| Reading all docs for small task    | Wastes tokens        | Use Tier 2 table              |
| Asking questions answered in docs  | Wastes tokens        | Search docs first             |
| Verbose explanations               | Wastes tokens        | Be concise                    |
| Creating new files                 | Breaks structure     | Add to existing               |
| Hardcoding colors                  | Breaks design system | Use CSS variables             |
| Heavy font weights (700+)          | Looks bulky          | Use 500-600                   |
| Same dark color everywhere         | Looks flat           | Alternate dark/light          |
| Forgetting ScrollTrigger.refresh() | Triggers misfire     | Always refresh after creating |
| Missing prefersReducedMotion       | Bad accessibility    | Always handle                 |
| Not updating docs after work       | Future AI confused   | Always update log             |

---

## QUICK REFERENCE CARDS

### Dark Section Tokens

background: #000000
primary text: #FFFFFF
secondary: rgba(255,255,255,0.55)
tertiary: rgba(255,255,255,0.35)
borders: rgba(255,255,255,0.08)
accent: #C9A96E

### Light Section Tokens

background: #FFFFFF
primary text: #000000
secondary: rgba(0,0,0,0.6)
tertiary: rgba(0,0,0,0.4)
borders: rgba(0,0,0,0.08)
accent: #C9A96E

### Animation Defaults

Entrance ease: power3.out
Section reveal duration: 1.0-1.2s
ScrollTrigger start: "top 80%"
Stagger: 0.1-0.12s
Scrub value: 1 to 2

### Typography Defaults

Headlines: Roboto, weight 600 (not 700)
Body: Poppins, weight 400
Labels: Poppins, weight 500, uppercase, 0.2em spacing
Letter-spacing headlines: -0.02em
Line-height headlines: 1.05
Line-height body: 1.7
