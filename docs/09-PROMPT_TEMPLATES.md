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

-------------------------------------
Template 4 — Phase 1 Build Task (Next.js / Payload / MySQL)

TASK: [e.g. "Build the Programs landing pages" / "Build the
University Partners collection"]

REFER TO:
- docs/11-PHASE1_TASKS.md (find the matching phase, follow its checklist)
- docs/10-PHASE1_SITEMAP.md (confirm exact page/route)
- docs/12-PAYLOAD_SCHEMA.md (exact fields to use — do not invent new ones)
- docs/03-DESIGN_SYSTEM.md (visual rules still apply)

REQUIREMENTS:
- Reuse homepage design system, reduced animation (inner page, not homepage)
- Mandatory SEO field group present (title, description, keywords,
  slug, schema JSON, scripts)
- Match the Payload field structure exactly as defined in
  docs/12-PAYLOAD_SCHEMA.md

OUTPUT:
- Files changed/created
- Payload config changes (collection/global + fields)
- Route(s) added
- Confirmation SEO fields render correctly
- Update docs/06-DEVELOPMENT_LOG.md and docs/11-PHASE1_TASKS.md
  checkboxes once done

Do NOT dump full files. Be concise.
-------------------------------------
Template 5 — Add Fields to an Existing Page (MASTER PROMPT)

Use this any time a page was shipped with the default/sensible field
set (because content wasn't finalized yet) and now needs specific new
fields added. This is the one prompt the client should reuse for every
future "I want to add X to page Y" request — no re-planning needed.

TASK: Add new fields to [page name] in Payload

REFER TO:
- docs/12-PAYLOAD_SCHEMA.md (find this page's current field list)
- docs/10-PHASE1_SITEMAP.md (confirm this is a Global or a Collection)

NEW FIELDS NEEDED:
1. [Field name] — [Field type: text / richText / image / repeater /
   relationship / select / etc.] — [required or optional] —
   [1 line: what it's for]
2. [Field name] — [Field type] — [required/optional] — [what it's for]
3. [Add as many as needed]

REQUIREMENTS:
- Add these fields to the existing Payload config for this page
  (do not remove or break any existing fields)
- Mandatory SEO field group must remain untouched
- If this page is a Collection (not a Global), confirm whether the new
  fields apply to ALL entries or only new ones going forward
- Update docs/12-PAYLOAD_SCHEMA.md with the new field list for this page
- Update the corresponding Next.js component/template to render the
  new fields, matching existing page styling (reduced animation, same
  as other inner pages)

OUTPUT:
- Payload config diff
- Next.js template diff
- Updated docs/12-PAYLOAD_SCHEMA.md section for this page
- Confirmation existing content/entries still work without errors

Do NOT dump full files. Be concise.
-------------------------------------

Example Usage:

TASK: Add new fields to the "CSR & Community Impact" page in Payload

REFER TO:
- docs/12-PAYLOAD_SCHEMA.md (csr Global)
- docs/10-PHASE1_SITEMAP.md (confirms this is a Global, page #6)

NEW FIELDS NEEDED:
1. impactStats — repeater (number + label pairs, e.g. "500+ Students
   Supported") — optional — for a stats row near the top of the page
2. partnerOrganizations — relationship to university-partners,
   multiple, optional — to show which partners are involved in CSR work

REQUIREMENTS:
- Add to existing `csr` Global config
- Keep existing heroImage, richText body, gallery fields untouched
- SEO field group untouched
- Update docs/12-PAYLOAD_SCHEMA.md csr row with these new fields
- Update the CSR page Next.js template to render the stats row and
  partner logos, reduced-animation style matching other inner pages

OUTPUT:
- Payload config diff
- Next.js template diff
- Updated docs/12-PAYLOAD_SCHEMA.md
- Confirmation page still renders correctly with no content yet in the
  new fields (graceful empty state)

Do NOT dump full files. Be concise.
-------------------------------------
Template 6 — Integration Task (Cloudinary / Cloudflare / Zoho / Zapier)

TASK: [e.g. "Wire up newsletter form to Zoho via Zapier"]

REFER TO:
- docs/13-INTEGRATIONS_GUIDE.md (find the matching section, follow its
  checklist exactly)

REQUIREMENTS:
- Follow the integration plan step-by-step as written in
  docs/13-INTEGRATIONS_GUIDE.md — do not invent a different approach
- If credentials/API keys are needed, use placeholders and flag clearly
  what the client needs to provide
- Test end-to-end before marking done

OUTPUT:
- What was configured/built
- What still needs the client's input (API keys, account access, etc.)
- Confirmation of a successful end-to-end test (or what's blocking it)
- Update docs/06-DEVELOPMENT_LOG.md

Do NOT dump full files. Be concise.
-------------------------------------
