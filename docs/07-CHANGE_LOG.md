# Change Log — Maverick Business Academy

## How To Use This File
When a new requirement comes (from client, from us, or from 
anyone), add it here FIRST before implementing.

Format:
- Date
- Source (client / internal / user feedback)
- What changed
- Impact on existing work
- Priority (critical / high / medium / low / future)
- Status (pending / approved / implemented / rejected)

---

## Scope Changes

### [Template — Copy This For Each Change]
**Date:** YYYY-MM-DD
**Source:** Client / Internal / Feedback
**Request:** What is being asked
**Impact:**
- Which existing pages/sections affected?
- Does database schema need changes?
- Does admin panel need new features?
- Does URL structure change?
- Estimated effort (small / medium / large)
**Priority:** Critical / High / Medium / Low / Future
**Status:** Pending / Approved / In Progress / Done / Rejected
**Notes:** Any additional context

---

## Change History

### Change #001 — Section Background Pattern
**Date:** Current
**Source:** Internal (design review)
**Request:** Change from all-dark sections to alternating 
dark/light pattern like TSK.world
**Impact:**
- All existing sections need background review
- Numbers and Who We Are need light theme conversion
- New CSS utility class needed (.section--light)
- No database impact
- No URL impact
- Effort: Medium
**Priority:** High
**Status:** Approved — Implementation starting

### Change #002 — Phase 1 Tech Stack Pivot (PHP → Next.js + Payload CMS)
**Date:** Current
**Source:** Client
**Request:** Scrap the previously planned PHP 8.x custom-MVC +
custom-admin-panel approach entirely. Rebuild Phase 1 on:
Next.js, Payload CMS (3.x, installed natively inside the Next.js app),
MySQL, Cloudinary (images/video), Cloudflare (CDN/cache), Zoho
(newsletter/CRM), Zapier (automation between site and Zoho).
**Impact:**
- Full page inventory finalized: 33 static-structure pages + 3 dynamic
  CMS collections (Programs, University Partners, Insights) — see
  docs/10-PHASE1_SITEMAP.md
- Database schema replaced — now Payload Collections/Globals on MySQL
  instead of custom tables — see docs/12-PAYLOAD_SCHEMA.md
- Admin panel replaced — Payload's built-in admin UI at `/admin`
  instead of a custom-built PHP admin panel
- Every page (static or dynamic) now requires a mandatory SEO field
  group: title, description, keywords, slug, schema JSON, scripts
- Program detail pages require an unlimited-entry FAQ repeater field
- New simplified World Map admin interface required (country →
  university → programs, programs pulled from existing Programs
  collection only) — see docs/11-PHASE1_TASKS.md Phase 1.5
- Existing CSS imported as global stylesheets into Next.js, not
  rewritten in Tailwind
- Homepage conversion to Next.js must be pixel-identical (0% visual/
  feature change); inner pages reuse homepage design system with
  reduced animation for performance
- WordPress data migration — no longer applicable (was previously
  planned, now removed; this is a fresh build)
- Mailchimp — replaced by Zoho per this decision
- New docs added: 10-PHASE1_SITEMAP.md, 11-PHASE1_TASKS.md,
  12-PAYLOAD_SCHEMA.md, 13-INTEGRATIONS_GUIDE.md
- docs/04-TECHNICAL_ARCHITECTURE.md "Future Production Architecture"
  section rewritten to point to the new docs instead of describing PHP
- PROJECT_CONTEXT.md corrected: Phase 0 (all 15 sections + navbar +
  footer + preloader + cursor) is fully complete, not partially built
  as previously stated, and now points to the new Phase 1 stack
- Effort: Large
**Priority:** Critical
**Status:** Approved — Docs updated, implementation starting per
docs/11-PHASE1_TASKS.md

---

## Future Ideas (Not Yet Approved)
Track ideas here that might be added later:

| Idea | Source | Priority | Notes |
|------|--------|----------|-------|
| Live chat integration | — | Low | Client may request later |
| Multi-language support | — | Future | Arabic/other languages — not part of Phase 1 scope as currently defined; revisit after Phase 1 launch |
| Student portal | — | Future | Login area for enrolled students |
| Payment gateway | — | Future | Online fee payment |
| Course comparison tool | — | Low | Compare 2-3 courses side by side |
| AI chatbot | — | Future | Answer admission queries |
| Analytics dashboard | — | Medium | Could be a Payload admin add-on, or external (e.g. GA4 via Cloudflare/Next.js) — TBD |