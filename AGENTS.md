# FieldLog

Source of product facts: `docs/FieldLog-V1-PRD-v2.4.md`. Version 2.4 is the canonical consolidated specification, adding sign-up, verification, test-mode subscription (FR-61 to FR-64), promoting FR-06 and FR-07 to Musts, and defining Section 7.13 (AI/vector stack). Where it changes an earlier version, version 2.4 wins. Pointers like "PRD 7.4" are section numbers; FR, NFR, US, A, NA and P ids are rows in it. Workspace rules live in .agents/rules/. AGENTS.md holds product facts; the rules files hold the detail it leaves out. Where this file and the PRD differ, stop and ask Rox.

## What FieldLog is

FieldLog is a responsive web app, built as a Progressive Web App (PWA, a website that can be installed and work offline), for field supervisors on environmental remediation and restoration sites. They capture photos and structured notes once, on site, even with no signal (PRD 1). From those entries it builds a draft daily site report with no re-typing, which a project reviewer approves or sends back. V1 is "capture once, report automatically": capture, link to project and site, draft report, review, approve, then search and export a PDF of an approved report (FR-42). Word export is a Should (FR-42a) and is built only when Rox asks. V1 also has optional AI help: suggested report summaries (FR-58) and search by meaning (FR-59), each behind an admin switch that is off by default.

## Who uses it

- Field supervisor (primary): captures entries on site, often on a phone with poor or no signal, and submits the daily report.
- Reviewer: exactly one per project, set by the admin (FR-52). Approves a report or requests changes, mostly on a desktop browser.
- Backup reviewer: optional, one per project. Decides a report whose author is the main reviewer. How a reviewer is "absent" is not in the PRD, so do not build it (see Open questions).
- Organisation admin: sets up projects, sites and users, assigns roles, and sees and sets the retention period, on desktop only. Reads the whole organisation (PRD 7.4). Pick-list screens are a Should (FR-53); lists are seeded by script.
- A user cannot hold Supervisor and a review role on the same project. A user never reviews a report they created (FR-40, FR-52).
- The buyer is the employing organisation. It is not a role in the app.

## What the agent must do well

Never lose a captured entry or overwrite an EntryVersion, from the phone with no signal through to the approved report (G3, NFR-01, NFR-02). An edit adds a new EntryVersion and the old one stays (FR-17).

- All capture steps work offline after first sign-in (FR-20), except on iOS in a normal Safari tab, where offline capture is blocked until FieldLog is installed to the home screen (FR-27).
- "Saved on this phone" appears only after the entry and its photos are written to IndexedDB in one transaction (FR-21).
- FieldLog never deletes unsynced data (FR-28). It deletes local data in two cases only: a synced photo after 7 days when storage is low (PRD 7.3, NA13), and everything on a closed account (FR-57), but only after the server has acknowledged every entry captured before deactivation and its photos are VERIFIED. In every other case, including session expiry and a 401, it deletes nothing (FR-04).
- An expired or unpaid subscription never rejects a sync batch, deletes local or server data, or blocks FR-57. It blocks only: starting a Visit online, submit, approve, invites (FR-63).
- Unsynced data is kept at least 14 days, with a daily warning from day 10 (FR-28). Sign-out is blocked while the user has unsynced entries unless they confirm (FR-05).
- Sync is an add-only log of operations, each with a client UUID and one type: CREATE_ENTRY, ADD_VERSION, DELETE_ENTRY, ADD_PHOTO or REMOVE_PHOTO. A repeated operation is acknowledged, not applied twice (FR-24).
- The server rejects any operation on an entry in a submitted or approved revision except ADD_VERSION (FR-24).
- Each photo carries a SHA-256 checksum of the compressed file, computed on the device. The server downloads the stored object, recomputes SHA-256 and marks the photo FAILED on a mismatch (P10).
- Every server query is scoped by organisationId and membership, except that the admin reads the whole organisation. Permissions are checked on the server for every request (FR-02, FR-03, PRD 7.4).

## Capture rules

- Location, camera photo: browser location at capture (accuracy 100 m or better), then photo EXIF, then a manual map pin, then none (FR-12).
- Location, gallery photo: EXIF, then a manual map pin, then browser location only if the user taps "I am at this place now", then none (FR-12). Store the location source.
- Occurred time: for gallery entries the first photo's EXIF DateTimeOriginal (site local time unless OffsetTimeOriginal is present), otherwise the corrected save time. It sets the Visit and the report order (FR-11a).
- Flags: "No location" when the source is none. "Outside site" when more than the site radius plus 500 m from the site centre. Clock difference when the device clock is off by over 10 minutes at sync. "Added from gallery later" when saved more than 2 hours after the photo time (FR-11a, FR-12, FR-13).
- Note: activity type and work status (pick-lists, required), quantity and unit (optional), free text up to 500 characters (FR-14).
- Before submission an entry can be edited or deleted. After submission it cannot be edited or deleted in that revision; a change is a new version used only in the next revision (FR-17, FR-24).

## Report and review rules

- A Visit is one supervisor, one site, one local date in the site's time zone. Each Visit has one report (FR-29).
- Submitting freezes the revision with a snapshot and SHA-256, and the status becomes Submitted (FR-36).
- A late entry is one that reaches a Visit whose report is already Submitted or Approved. It is never dropped (FR-29a). On a Submitted report it joins the next revision. On an Approved report the server creates a new Draft revision and the approved one stays the latest approved version. It is not the same as the "Added from gallery later" flag.
- Approve needs no comment. Request changes needs a comment of at least 10 characters (FR-37). An approved revision is locked (FR-39).
- Four statuses, taken from the newest revision: Draft, Submitted, Changes requested, Approved. "Latest approved: revision N" is shown beside it (FR-41).
- The standard template has these sections in order: header, weather, work summary, entry log, issues and observations, flags, supervisor summary, review block, footer (P12).
- The completeness check blocks on an unsynced entry, a missing required field, or a photo in PENDING_UPLOAD or UPLOADED. It warns on location or clock flags. A photo FAILED after all retries does not block (FR-32).

## Fixed numbers

14 days offline, warning on day 10. Up to 10 photos per entry (FR-15, MVP Should). Note 500 characters, summary 2,000 (NA8). Image accepted up to 25 MB, output 1,600 px long edge and 450 KB or less (P1, P5). Sync batch of 25 operations (P8). Presigned URLs 15 minutes (P9). Sync every 60 seconds while open and online (FR-22). Retention default 7 years (FR-55). Semantic search 2 s or less at p95 (NFR-21). Price ₦7,300/active supervisor/month in NGN test mode (FR-63). 14-day trial; 14-day grace period (PAST_DUE). Email code 6 digits, 10 min expiry, 3 tries (FR-62). Lockout 10 failed sign-ins for 15 min (FR-07). Rate limits: sign-in 10/15min/acct & 50/15min/IP, sign-up 5/hr/IP, reset 3/hr/email, sync 120/min/user (PRD 7.7). Unfinalized payment attempt timeout check: 10 minutes (FR-64, NA31).

## Scope: what to build

- Build only Must requirements in PRD section 5. Build a Should only when Rox names it. Never build a Could or a Won't. Rox has named FR-58 and FR-59 for build, after the Musts they depend on, and named FR-15 (up to 10 photos per entry) on 25 Oct 2026. FR-06 and FR-07 are Musts. No other Should is named.
- Musts are the rows marked Must. Ranges such as FR-09 to FR-17, FR-20 to FR-28 and FR-29 to FR-33 contain Shoulds (FR-16, FR-26, FR-31, FR-32a) that are not in the MVP; FR-15 is in the MVP.
- Must areas: access (FR-01 to FR-07, FR-61 sign-up, FR-62 email verification), billing (FR-63 subscription, FR-64 checkout and payment attempts), capture (FR-09 to FR-14, FR-17, plus the named Should FR-15), offline and sync (FR-20 to FR-25, FR-27, FR-28), reports (FR-29, FR-29a, FR-30, FR-32, FR-33), review (FR-36 to FR-42), search (FR-46), admin (FR-51, FR-52, FR-54, FR-55, FR-57). Total: 45 Musts, 14 Shoulds, 4 Coulds, 4 Won'ts (67 total).
- Rox, not the agent, decides when the build has slipped and what is cut.
- The go decision uses four measures: median time from last photo to submission (the north-star), median reporting minutes per report, the dual-running rate, and data integrity (G1, 11.1, Phase 3).

## Not in scope

- Won't in V1: single sign-on and multi-factor sign-in, voice notes and dictation, a template builder, a map view of entries (FR-50). The map pin picker for one entry is a Must (FR-12).
- HSE incidents, environmental sampling and lab results, progress dashboards, action tracking, procedures and training library, public website, native iOS and Android apps, chat or messaging, a user in more than one organisation, live payments, refunds and invoices (PRD 3.2). One marketing page at / is allowed.
- System integrations: no link to document-management or project systems. The PDF export, invite email and object storage are not integrations. Review comments are not chat.
- AI is allowed only as FR-58 and FR-59 (PRD 6 Part B, 7.13). Nothing else may call a language model or image model, and no AI step may run when the organisation's switch for it is off. Every suggestion needs a person to accept it. No automatic captions, summaries or approvals.
- Retention deletion is not built (FR-55). The admin screen only shows and sets the retention period.

## Stack

- Named in the PRD: Next.js (App Router), Prisma, PostgreSQL. TypeScript is explicitly named in PRD 7.1.
- Auth.js with database sessions and the custom adapter from PRD 7.4. Switch to the first-party session module only when Rox says the week-1 proof failed.
- Serwist service worker for the app shell (the pages and scripts that load offline). Dexie over IndexedDB for the local store and outbox (PRD 7.1, 7.3).
- pg-boss for background jobs, run by a separate long-running Node worker from the same codebase.
- S3-compatible private object storage with presigned URLs.
- Use exifr, browser canvas, sharp, @react-pdf/renderer and Zod (NA7). Install docx only if Rox asks for Word. Replace a library only with Rox's approval.
- Email: Gmail SMTP, for testing only in the app's region (NA14), for codes, invites and resets; notification emails (FR-43) stay unbuilt. No error tracker is chosen; ask Rox before installing one.
- Payments: Flutterwave hosted checkout in test mode only (FR-64, PRD 7.14). Card details never reach FieldLog. Install only the package Rox names; never use live keys.
- AI stack (PRD 7.13): Gemini on Google Cloud (Vertex AI) at the regional endpoint in the app's region. Never use the Gemini API free tier or the paid Gemini API key route, and never call a global endpoint. Install only the one Google client package Rox names. Caching, grounding, file storage and stored sessions stay off.
- Vector search: the pgvector extension in PostgreSQL, embeddings in their own table, one cosine HNSW index. Read and write the vector column with raw SQL, because Prisma's normal client cannot. Retrieval chunk: 1 EntryVersion = 1 chunk (NA32).
- Never send GPS, user names or email addresses to the AI provider (PRD 6 Part B rule 3, 7.13). Photos sent are the compressed JPEGs only.
- Hosting: one UK or EU region for every service; staging and production use separate databases and buckets; the host must run a persistent Node process (A5, 7.10).
- The only environment variable named in the PRD is DATABASE_URL. The AI settings need more; Rox has not named them (PRD Q33). Ask Rox before adding any.

## Route map

Routes from PRD 7.2, relative to the Next.js App Router root. Folders other than these routes are not defined; ask Rox before creating a top-level folder.

```
page.tsx at the root         Marketing page (public)
sign-in/ (?mode=sign-in|sign-up|reset), invite/[token]/, reset/[token]/   Access (public)
(app)/today/                 Supervisor home: recent sites, sync status, today's entries
(app)/capture/               New entry form (?siteId=)
(app)/entry/                 Entry view, edit and history (?id=)
(app)/visit/                 Visit preview from local data, offline (?id=)
(app)/reports/               Report list with status filter
(app)/reports/[reportId]/    Report, revisions, submit
(app)/review/                Reviewer queue of submitted reports
(app)/search/                Search by project, site and date; meaning search when switched on
(admin)/admin/               projects, sites, users, pick-lists, settings
(admin)/admin/billing/       Subscription, seats, pay, payment history
api/sync/                    bootstrap, pull, batches
api/photos/[photoId]/        upload-url, complete
api/reports/[reportId]/      read and edit, submit, reviews, exports
api/search/                  Filtered search, plus meaning ranking (FR-59)
api/billing/                 checkout (admin), webhook (public, signature checked)
api/ai/                      Suggestion requests and accept, edit, reject (FR-58)
api/health/                  Liveness
```

- Field screens (today, capture, entry, visit) are client components that read only from the local store, except the online history on the entry view, which comes from the server (PRD 7.1, 7.2).
- Server components are used only for online screens: review, reports list, search and admin.
- Sync and upload use route handlers; admin and review forms use server actions.

## How to work in this codebase

- Work on one FR id at a time and name it at the top of your response.
- Packages named in the Stack section may be installed. Any other package needs Rox's approval first: stop and ask.
- The Prisma schema in PRD section 10 is fixed. Never add, rename or remove a model, field, enum or index.
- Approved schema additions (Q19, Q34, PRD 10): AI columns and models (AiSuggestion, EntryEmbedding, pgvector, HNSW index) and billing/auth additions (Subscription, Payment, PaymentAttempt, EmailToken, RateLimitCounter, User.emailVerifiedAt, enums and audit actions). For these only, copy PRD section 10 exactly into migrations. Do not change a name, type or size. Anything else in the schema stays forbidden.
- Never run `prisma migrate`, `prisma db push` or any command that changes a database. Rox runs migrations.
- Add a CI check that fails any migration that drops the HNSW index, because Prisma proposes to drop it (PRD 7.13, Q26).
- Application code and tests may contain Prisma queries, but the agent never runs a migration, reset, seed or query against any database. Rox runs them.
- When the PRD is silent, stop and ask instead of assuming. If Rox tells you to proceed, list each assumption at the end of the response.
- A Must is done when its user story in PRD 5.8 passes and every NFR in 7.12 that applies to it holds. This list is not complete; it names the ones most often missed: save entry within 2 s at p95, 170 KB gzipped JavaScript on capture, every capture flow passing in flight mode on each supported browser (NFR-03), WCAG 2.2 AA, latest two versions of Chrome, Safari, Edge and Firefox, and tenant-isolation tests per API route. The 14-day device test (NFR-04) and database recovery (NFR-11) are run in Phase 1 week 10, not per FR (PRD 13).

## Definitions

- Organisation: the tenant. Every table except Organisation already has an organisationId column; no table is changed to add one.
- Project: a client job with a unique code per organisation. Site: a location within a project, with a time zone that sets the Visit date.
- Membership: a user's role on one project: Supervisor, Reviewer or Backup reviewer (FR-52 and the Role enum). Admin is set per organisation.
- Entry: one capture event with photos and a structured note. Entry version: immutable content of an entry; any change adds a version.
- Photo source: CAMERA or GALLERY; it decides the location chain. Location source: browser, EXIF, manual map pin or none.
- Occurred time, Visit: see Capture rules and Report rules. Report: one per Visit. Revision: a version of a report, frozen on submission and locked once approved.
- Pick-list: admin-managed options for activity types, work statuses (with an issue marker), units and weather.
- Flag: a marker shown to the reviewer (see Capture rules), plus "Photo failed to upload" (FR-32).
- Completeness check: the pre-submit check in Report and review rules.
- Sync operation: one typed, client-identified change sent to the server. Outbox: the local queue of operations waiting to sync.
- Audit event: an append-only record of each create, change, submit, decision, export and sign-out with unsynced work (NFR-16).
- Soft delete: a delete that marks the row and keeps it.
- Must, Should, Could, Won't: priorities in PRD 5. Must is built, Should only when Rox names it, Could is not built, Won't is never built.
- North-star: median time from the supervisor's last site photo of the day to the submitted report. Dual-running: a report also sent by the old method (email, Word or WhatsApp). Pilot: one organisation mandated to use FieldLog for daily reports.

## Open questions for Rox

These are problems in the PRD itself. The file above follows the audit's proposed reading; confirm or change it.

1. FR-03 says roles are Supervisor or Reviewer; FR-52 and the schema add Backup reviewer. The file uses three roles.
2. PRD 11.5 says value is judged on three signals; G1, 11.1 and Phase 3 add reporting effort. The file uses four measures.
3. FR-20 says all capture works offline; FR-27 blocks iOS capture until installed. The file states the iOS exception.
4. How is a main reviewer "absent" detected for the Backup reviewer (FR-52)? Nothing in the PRD says.
5. Should the admin pick-list screen (FR-53, a Should) be built, or only a seed script? The file assumes a seed script.
6. Answered 26 October 2026: email is Gmail SMTP, for testing only. Error tracker: still open.
7. Answered 23 October 2026, changed 26 October 2026: payments are in V1 as Flutterwave test-mode subscription checkout (FR-63, FR-64); live payments are not. Gemini and pgvector are in V1 as FR-58 and FR-59. The Gemini free tier fails the no training, 30-day and region rules, so Vertex AI at a regional endpoint is used instead.
8. Answered 28 October 2026: the canonical PRD is at `docs/FieldLog-V1-PRD-v2.4.md`.
9. Answered: TypeScript is explicitly named as the implementation language in PRD 7.1.
10. AI questions still open (PRD 14, Q20 to Q33): the exact wording of FR-58 and FR-59 (Q20), the DPIA and what text is embedded (Q21, Q22), how long suggestions are kept (Q24), the pgvector version (Q25), Google's log retention in days (Q31), whether FR-58 and FR-59 are Should or Must and when they are built (Q32), and the AI environment variable names (Q33). Until Rox answers Q31 and the DPIA is signed, build and test with every AI switch off and do not turn one on.
