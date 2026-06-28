-------------------------------------
Template 1 — Build New Section

TASK: Build Section [X] — [Section Name]

REFER TO:
- docs/03-DESIGN_SYSTEM.md (theme, animation rules)
- docs/05-CONTENT_SOURCE.md (content for this section)
- PROJECT_CONTEXT.md (section ID and theme)

REQUIREMENTS:
- Section ID: [#section-id]
- Theme: [DARK / LIGHT]
- Add HTML inside existing <section> tag
- Add CSS in main.css under: /* ===== [SECTION NAME] ===== */
- Add responsive in responsive.css under matching comment
- Add GSAP animation as new function init[Name]Animations()
- Call from initAllAnimations()
- Use existing utility classes — do not redefine

SPECIFIC TO THIS SECTION:
[Add 2-3 lines describing what makes this section unique]
[Example: "Cards in grid with stagger reveal"]
[Example: "Split layout — text left, image right"]

OUTPUT:
- Files changed with line ranges
- List of additions
- Issues found (if any)
- Suggestions for improvement (if any)

Do NOT dump full files. Be concise.
-------------------------------------
Example Usage:
TASK: Build Section 5 — What We Do

REFER TO:
- docs/03-DESIGN_SYSTEM.md
- docs/05-CONTENT_SOURCE.md
- PROJECT_CONTEXT.md

REQUIREMENTS:
- Section ID: #what-we-do
- Theme: DARK
- Add HTML inside existing <section> tag
- Add CSS in main.css under: /* ===== WHAT WE DO ===== */
- Add responsive in responsive.css under matching comment
- Add GSAP animation as new function initWhatWeDoAnimations()
- Call from initAllAnimations()
- Use existing utility classes

SPECIFIC TO THIS SECTION:
3 large category cards (Academic, Professional, International).
Cards reveal with stagger on scroll. Each card has icon + 
heading + list of items underneath.

OUTPUT:
- Files changed with line ranges
- List of additions
- Issues found
- Suggestions for improvement

Do NOT dump full files. Be concise.

-------------------------------------
Template 2 — Fix Bug Or Improve

TASK: Fix [issue name] in [section/feature name]

REFER TO:
- docs/06-DEVELOPMENT_LOG.md (check if already fixed)
- The affected file(s) only

ISSUES TO FIX:
1. [Specific issue with what's wrong]
2. [Another issue if multiple]
3. [Another issue]

EXPECTED RESULT:
[1-2 lines describing desired outcome]

CONSTRAINTS:
- Do not break existing animations
- Do not modify unrelated sections
- Follow design system rules

OUTPUT:
- Files changed with line ranges
- Root cause of each issue
- Fixes applied
- Any side effects to watch for

Do NOT dump full files. Be concise.
-------------------------------------

Example Usage:

TASK: Fix card backgrounds and typography in Numbers section

REFER TO:
- docs/06-DEVELOPMENT_LOG.md
- main.css numbers section
- index.html numbers section

ISSUES TO FIX:
1. Cards showing black background on light theme — 
   should be white
2. Heading "Impact / Beyond / Education." too heavy and 
   compressed — needs lighter weight and better spacing
3. Cards visually ordinary — need index numbers (01-06) 
   above each stat for editorial feel

EXPECTED RESULT:
Numbers section feels premium and TSK-like with proper 
white cards, elegant heading, and editorial numbering.

CONSTRAINTS:
- Keep all counter animations working
- Do not touch animations.js logic
- Maintain accessibility

OUTPUT:
- Files changed with line ranges
- Root cause of card background issue
- All fixes applied
- Any visual concerns

Do NOT dump full files. Be concise.

-------------------------------------
Template 3 — Quick Task Or Discussion

TASK: [One line description]

CONTEXT:
[2-3 lines max — what you need and why]

REFER TO:
- [Only specific file(s) needed]

DELIVERABLES:
- [What you want as output]

Do NOT read all docs. Do NOT dump files. Be brief.
-------------------------------------

Example Usage:

TASK: Convert Who We Are section to light theme

CONTEXT:
Following the same pattern we used for Numbers section.
Add section--light class and override any dark-specific values.

REFER TO:
- main.css who-we-are section
- index.html who-we-are section

DELIVERABLES:
- Class added to section tag
- List of CSS overrides applied
- Confirmation it works

Do NOT read all docs. Do NOT dump files. Be brief.
