# FieldLog V1 Product Requirements Document

**Version** 2.3 | **Date** 26 October 2026 | **Owner** Rox, Product Manager | **Status** Draft for build planning

This PRD is written from prompt version 2 (`fieldlog-prd-prompt-v2.md`). It stands alone and does not replace PRD v1.1. Sources: survey respondents R1 to R3, decided assumptions A1 to A18, and new assumptions marked [NEW ASSUMPTION] and listed as NA1 to NA26 in section 12.

**Changes from v2.2.** Version 2.3 makes FieldLog meet the Ship & Found brief, as Rox decided on 26 October 2026. Organisations sign up and pay a monthly subscription per active supervisor through Flutterwave hosted checkout in test mode (FR-61 to FR-64). Password reset (FR-06) and lockout (FR-07) become Musts. An expired subscription never rejects a sync upload or deletes data. Section 17 lists every change.

**Changes from v2.1.** Version 2.2 adds two V1 Should requirements named by Rox: an AI-generated report summary suggestion (FR-58) and supervisor semantic search across reports and photo-linked entry text (FR-59). Both are online-only, non-blocking and dropped first if the build slips. AI photo captions remain out of V1. The AI columns, embedding storage and pgvector extension are proposed but not applied; they need Rox's explicit approval (Q19). Lines changed or added in this version are marked [v2.2]. Section 15.1 lists the changes.

**Changes from v2.0.** Version 2.1 applies all 29 fixes (L1 to L29) from the live review of v2.0. Lines changed or added in that version are marked [v2.1] where the change is a requirement, rule or number. Section 15 lists every fix with where it landed.

### Choices made in this version (change these if you disagree)

Three calls were open after the review. This version uses the review's recommended answer for the first two and leaves the third open.

| # | Choice | What v2.1 does | How to reverse it |
|---|---|---|---|
| C1 | Reporting effort as a second main metric (changes A16) | Go needs both the elapsed-time measure and reporting effort at least 50% lower than baseline (G1, 11.1, 11.4, Phase 3, NA22, FR-32a). | Remove NA22 and FR-32a, and delete the effort lines in G1, 11.1, 11.2, 11.4 and Phase 3. |
| C2 | Word export moved from Must to Should | PDF export is a Must (FR-42). Word export is FR-42a, a Should, delivered by pilot week 2 if requested. | Set FR-42 back to PDF and Word, delete FR-42a. The Must count goes to 40. |
| C3 | Budget and latest pilot start date | Not set. Open question Q17. The team cost line in section 8 is blank until it is answered. | Answer Q17 and fill in the section 8 team cost line. |

Other proposed numbers added by the review, which Rox has not yet confirmed: the 30-minute Phase 0 sizing threshold (NA20), the 2-hour and 500 m back-fill thresholds (NA23), and the pilot sponsor and signed agreement requirement (Phase 0 exit).

---

## 1. Product summary

FieldLog is a responsive web app, built as a Progressive Web App (PWA), that lets field supervisors on environmental remediation and restoration sites capture photos and structured notes once, on site, even with no signal (R1, R2, A6). From those entries it builds a draft daily site report with no re-typing, which a project reviewer approves or sends back (R1, R3, A1). The V1 focus is "capture once, report automatically": capture, link to project and site, draft report, review, approve, then search and export. It is for field supervisors first and reviewers second (A1). Now is the time because all three surveyed supervisors report losing time to manual reporting (R1, R2, R3; the amount per report is measured in Phase 0). The pilot needs one organisation to mandate FieldLog for daily reports for six weeks (A17); Phase 0 does not exit until that organisation has signed the pilot agreement. [v2.1]

## 2. Problem statement

**Problem.** Field supervisors cannot capture evidence once, on site, and have it flow straight into a reviewable report. This is worst when they have no signal (R1, R2).

**Who.** Field supervisors in soil and groundwater remediation, shoreline cleanup, and site inspection and supervision (R1, R2, R3). Reviewers and project managers depend on their reports (A1).

**What happens today.**

| Step | Today | Evidence |
|---|---|---|
| Record | Notes on paper or in a notebook | R1, R3 |
| Photograph | Photos on a phone, often a personal phone, taken first and sorted later | R1, R2, R3 |
| Locate | GPS-tagged photos, a map app, or folders by site | R1, R2, R3 |
| Write up | Retype into Word, email or WhatsApp | R1, R2, R3 |
| No signal | Save and upload later, or ask someone for help | R1, R2 |
| Find latest version | Ask someone, dates in file names, or an approval stamp | R1, R2, R3 |

**Impact.**

- Time: each respondent loses time to these problems (R1, R2, R3), period unknown. Phase 0 measures median minutes spent writing each daily report today, reports per week, and the channel used (Word, email or WhatsApp) with at least 5 supervisors [NEW ASSUMPTION] (NA20). [v2.1]
- Approvals: stress and delayed approvals (R1).
- Quality: missing information, unclear owners for issues and conflicting records (R1).
- Retrieval: old records are hard to find (R3).
- Device limits: poor signal (R1, R2), battery and storage (R1).

**Evidence strength.** Three supervisors, one survey, no reviewers (A1). Treat this as direction, not proof. The pilot must test it (A16, A17).

## 3. Goals and non-goals

### 3.1 Goals

| ID | Goal | Measure | Target | Source |
|---|---|---|---|---|
| G1 | Cut reporting time and effort | Median time from the supervisor's last site photo of the day to submitted report, and median minutes of reporting effort per daily report (NA22) | 50% shorter than the pre-pilot baseline on both | A16 |
| G2 | Capture on site, not back-filled | Share of entries whose corrected save time is within 2 hours of the photo's EXIF time (where present) and whose location, where present, is inside the site radius plus 500 m | At least 80% [NEW ASSUMPTION] (NA10, NA23) | R1, R3 |
| G3 | No lost or altered data | Gaps between deviceSeq values issued by each device and entries stored on the server; stored photos failing checksum | 0 and 0 across the pilot | A6, A9, A17 |
| G4 | Visible status and faster decisions | Share of pilot reports with status and history in FieldLog; median time from submitted to decision | 100%; 1 working day or less [NEW ASSUMPTION] (NA10) | R1, A17 |
| G5 | Replace the old method | Share of reports also sent by email, Word or WhatsApp in pilot week 6 | 20% or less [NEW ASSUMPTION] (NA10) | A17 |

### 3.2 Non-goals

| Non-goal | Reason |
|---|---|
| HSE incident and corrective-action module | Not part of the capture-to-approval chain. Roadmap V2. |
| Environmental sampling and lab results | Different data model and users. Roadmap V3. |
| Progress dashboards across sites | Needs reliable V1 data first. Roadmap V2. |
| Action tracking and issue owners | R1 raised unclear owners, but one respondent is too little to size it. Roadmap V2. |
| Procedures and training library | Not linked to the V1 problem. Roadmap V3. |
| Public website | One marketing page at / is in V1 for sign-up and search engines; nothing else public. [v2.3] |
| System integrations | Export to PDF and Word covers existing email channels (R1, R2, R3). Roadmap V3. |
| Native iOS and Android apps | V1 is a PWA. Revisit if iOS offline limits block the pilot (RK-02). |
| AI photo captions and AI beyond the report summary suggestion | AI photo captions stay out of V1. The report summary suggestion is a V1 Should (FR-58), off by default and switched on per organisation (A18, section 6 Part B). |
| Chat or messaging | FieldLog is not a chatbot. Review comments cover feedback. |
| A user in more than one organisation | Each sign-up creates its own organisation (FR-61); one user belongs to one organisation (A3). [v2.3] |
| Live payments, refunds and invoices | V1 takes payment in the provider's test mode only (FR-64). The pilot organisation runs free (A15). [v2.3] |
| Single sign-on and multi-factor sign-in | Email and password is enough for one pilot organisation (A3, A4). Roadmap V2. |

## 4. User personas

### 4.1 Field supervisor (researched)

| Item | Detail | Evidence |
|---|---|---|
| Role | Supervises remediation, cleanup or inspection work and writes the daily report | R1, R2, R3 |
| Experience | 1 to 3 years (R1, R3) and over 6 years (R2) | R1, R2, R3 |
| Goals | Record activity once. Get location and time added automatically. Submit the report before leaving site or soon after. Know the report status. | R1, R3 |
| Frustrations | Re-typing the same information. Sorting photos. Writing up notes. Poor signal. Slow approvals. Not knowing the latest version. | R1, R2, R3 |
| Devices | Phone on site, often a personal phone, with limited battery and storage. Laptop for Word and email today. Device ownership for the pilot (company or personal phone) is agreed in the pilot agreement (Q15). [v2.1] | R1, R3 |
| Context | Outdoors, often gloved or in a hurry, with poor or no signal, travelling between sites | R1, R2, R3 |
| Must-haves | No re-typing, automatic location and time, report status, quick and simple on a phone | R1, R2, R3 |

### 4.2 Reviewer (hypothesis, not researched)

| Item | Detail | Evidence |
|---|---|---|
| Role | One reviewer per project, usually the project manager | A1 |
| Goals | See complete, consistent reports. Approve or return them quickly. Know which version is approved. | A1, R1, R3 |
| Frustrations (assumed from supervisor answers) | Missing information, conflicting records, hard-to-find old reports | R1, R3 |
| Devices | Mostly desktop browser | Prompt section 1 |
| Context | Office or site cabin, reviews several reports a day | A1 |
| Open risk | No reviewer research. Phase 0 interviews reviewers (Q1). | A1 |

### 4.3 Organisation admin (operational note)

One admin at the pilot organisation creates projects and sites, invites users, assigns supervisors to sites and one reviewer to each project, manages pick-lists and sets the retention period (A2, A8). Desktop only. The admin can also hold a supervisor or reviewer membership, but never approves their own report (FR-40).

## 5. Functional requirements

### 5.1 Access

| ID | Requirement | Priority | Evidence or assumption ID |
|---|---|---|---|
| FR-01 | Users sign in with email and password. Invites are sent by email and the user sets a password. | Must | A2, NA2 |
| FR-02 | A supervisor sees only projects and sites assigned to them. A reviewer sees only their projects. Every server query is scoped by organisationId and membership. | Must | A1, A2, A3 |
| FR-03 | Roles are set per project: Supervisor or Reviewer. Admin is set per organisation. Permissions are checked on the server for every request. | Must | A1, A2 |
| FR-04 | When a session expires, capture continues offline and no local data is deleted. Upload resumes after the user signs in again. Local data is kept for at least 14 days. | Must | A6 |
| FR-05 | Sign-out is blocked while the signed-in user has unsynced entries. The dialog shows the count and says they will upload the next time that user signs in on this phone. The user can sync now or confirm sign-out; confirming keeps the local data and writes a SIGN_OUT_WITH_UNSYNCED audit event when that user next syncs. [v2.1] | Must | A6, A10 |
| FR-06 | Password reset from the sign-in page (?mode=reset). A single-use emailed link valid for 60 minutes; only its SHA-256 is stored (EmailToken). The page says the same thing whether or not the email exists. A successful reset revokes every session of that user. [v2.3] | Must | A2, NA3 |
| FR-07 | After 10 failed sign-ins the account locks for 15 minutes. The message never says whether the email or the password was wrong. [v2.3] | Must | NA3 |
| FR-08 | Single sign-on and multi-factor sign-in. | Won't | A3, A4 |

### 5.1a Sign-up and subscription [v2.3]

| ID | Requirement | Priority | Source |
|---|---|---|---|
| FR-61 | Organisation sign-up on the sign-in page (?mode=sign-up): name, email, password, organisation name. It creates the Organisation, its admin User and a Subscription. Sign-up never joins an existing organisation; supervisors and reviewers join by invite (FR-52). The password is checked against a breached-password range service by sending only the first 5 characters of its SHA-1 hash, and rejected if found. Limit: 5 per hour per IP. | Must | A15, NA28 |
| FR-62 | Email verification. After sign-up a 6-digit code from a cryptographic random function is emailed. It is valid for 10 minutes and allows 3 tries, and only its SHA-256 is stored. Gating: SOFT: signs in with a banner, cannot pay or invite until the email is confirmed. Accepting an invite (FR-52) marks that user's email verified. | Must | NA29 |
| FR-63 | Subscription. One per organisation, ₦7,300 per active supervisor per month in NGN. Start: a 14-day free trial. After currentPeriodEnd it is PAST_DUE for 14 days, then EXPIRED. EXPIRED blocks: starting a Visit online, submit, approve, invites. It never rejects a sync batch, deletes local or server data, or blocks FR-57. The pilot organisation's subscription is set ACTIVE by the seed script and pays nothing (A15). | Must | A15, NA30 |
| FR-64 | Checkout and payment attempts. The admin pays on /admin/billing through Flutterwave hosted checkout in test mode; card details never reach FieldLog. A PaymentAttempt row is written before the redirect. A webhook is accepted only after its signature is checked and the transaction is fetched from the provider; then one Payment row is written and the subscription period moves on. A job checks attempts still INITIATED after 10 minutes with the provider and marks them SUCCEEDED, FAILED or ABANDONED. | Must | NA31 |

### 5.2 Capture

| ID | Requirement | Priority | Evidence or assumption ID |
|---|---|---|---|
| FR-09 | The supervisor picks a project and site. The last 5 sites used are shown first and stored on the device. | Must | R2, A2 |
| FR-10 | The supervisor takes a photo with the camera or uploads one from the gallery, through the browser. | Must | R1, R2, R3 |
| FR-11 | Location and time are read from the original photo's EXIF data before compression. | Must | A9, R1 |
| FR-11a | Each entry stores occurredAt. For gallery entries it is the first photo's EXIF DateTimeOriginal, read as site local time unless OffsetTimeOriginal is present; otherwise it is the corrected save time. The Visit and the report order use occurredAt. An entry is flagged "Added from gallery later" when its save time is more than 2 hours after occurredAt. [v2.1] | Must | A9, A14, NA23 |
| FR-12 | Location is resolved per photo source. CAMERA: browser location at capture (accuracy 100 m or better), then photo EXIF location, then manual map pin, then none. GALLERY: photo EXIF location, then manual map pin, then browser location only if the user taps "I am at this place now", then none. The source is stored. An entry is flagged "No location" when the source is NONE and "Outside site" when its location is more than the site radius plus 500 m from the site centre. [v2.1] | Must | A13, R1, R2, NA23 |
| FR-13 | Each entry stores device time and server time. A device clock offset over 10 minutes flags the entry. | Must | A14, NA4 |
| FR-14 | Each entry has a structured note: activity type (pick-list, required), work status (pick-list, required), quantity and unit (optional), free text up to 500 characters (optional). The last activity type and status used at that site are preselected. | Must | R1, R2, R3, NA8 |
| FR-15 | An entry can hold up to 10 photos. | Should | R2, R3, NA8 |
| FR-16 | An entry can be saved with no photo (note only). | Should | R2 |
| FR-17 | Before its report is submitted, an entry can be edited or deleted. Each change creates a new EntryVersion with an audit event. After submission, an entry is read-only in that revision; a change creates a new version used only in the next revision. Deletes are soft deletes. | Must | A10 |
| FR-18 | The app warns when estimated free storage for the app falls below 200 MB. | Should | R1 |
| FR-19 | Voice notes and in-app dictation. Phone keyboard dictation already works in text fields. | Won't | A4 |

### 5.3 Offline and sync

| ID | Requirement | Priority | Evidence or assumption ID |
|---|---|---|---|
| FR-20 | After first sign-in, the app shell, assigned projects, sites and pick-lists load with no signal. All capture steps work offline. | Must | R1, R2, A6 |
| FR-21 | An entry and its photos are written to IndexedDB in one transaction before the app shows "Saved on this phone". | Must | A6, R2 |
| FR-22 | Sync starts automatically on app open, on regaining connection, on returning to the app, and every 60 seconds while open and online. Failed requests retry with backoff from 5 seconds to 15 minutes. | Must | R2, A12 |
| FR-23 | A sync indicator shows the count of unsynced entries and photos and the time of the last successful sync. | Must | R1, R2 |
| FR-24 | Sync uploads an add-only log of operations. Each operation has a client-generated UUID and one type: CREATE_ENTRY, ADD_VERSION, DELETE_ENTRY, ADD_PHOTO or REMOVE_PHOTO. A repeated operation is acknowledged, not applied twice. Photos carry a SHA-256 checksum that the server verifies. Each entry carries deviceId and deviceSeq, a gap-free counter per device, and every sync batch reports the highest deviceSeq issued. Operations on an entry in a submitted or approved revision are rejected, except ADD_VERSION, which applies to the next revision (FR-17, FR-29a). [v2.1] | Must | A9, A12 |
| FR-25 | The server wins on project, site, membership and pick-list data. Each sync pulls changes since the last cursor. | Must | A12 |
| FR-26 | A "Sync now" button and a per-item error with a retry action. | Should | R1 |
| FR-27 | The app requests persistent storage on every platform. On iOS, if FieldLog is not running as an installed home-screen app, it shows a full-screen install guide and does not allow offline capture until it is installed. [v2.1] | Must | A6, A7, NA5 |
| FR-28 | Unsynced data is kept for at least 14 days. FieldLog never deletes unsynced data itself. On day 10 offline the app shows a daily warning. [v2.1] | Must | A6 |

### 5.4 Report generation

| ID | Requirement | Priority | Evidence or assumption ID |
|---|---|---|---|
| FR-29 | A draft daily report is created automatically for each Visit: one supervisor, one site, one local date in the site's time zone, taken from each entry's occurredAt. It lists every non-deleted entry in the Visit with no re-typing. | Must | R1, R3, A11, NA19 |
| FR-29a | An entry that reaches a Visit whose report is Submitted or Approved is never dropped. If Submitted, the review view shows "N entries added after submission" and the entries go into the next revision. If Approved, the approved revision stays locked and the server creates the next revision as a Draft containing the late entries; the approved revision stays the latest approved version until the new revision is approved. The capture screen warns: "Today's report for this site is already submitted. This entry will start a new revision." [v2.1] | Must | A10, R1 |
| FR-30 | The draft uses the standard daily site report template (section 6, step P12) unless the organisation supplies its own at setup. | Must | A11 |
| FR-31 | Before submission the supervisor can exclude entries, reorder them, pick the weather, and add a summary of up to 2,000 characters. Excluded entries are listed by count and time in the review view, marked "Excluded by supervisor", and are not printed on exports. [v2.1] | Should | R1, R3, NA8 |
| FR-32 | Before submission the app runs a completeness check. It blocks submission if any entry in the Visit is unsynced, lacks a required field, or has a photo in PENDING_UPLOAD or UPLOADED. A photo that is FAILED after all retries does not block: the supervisor either removes it with a reason (written as an audit event) or submits with a "Photo failed to upload" flag shown to the reviewer. It warns, without blocking, on flagged location or clock entries. [v2.1] | Must | R1, A13, A14 |
| FR-32a | On submit, an optional field asks "Minutes spent on this report?". The answer is stored on the revision. [v2.1] | Should | A16, NA22 |
| FR-33 | Every report write carries the report version. A mismatch returns a conflict and the app reloads the latest data without losing the user's unsaved text. | Must | A12 |
| FR-58 | On a Draft report, the supervisor can request an AI-generated summary of up to 150 words from the revision's entries. The suggestion is shown beside the summary field with Accept, Edit and Reject. Nothing is saved without Accept. Accepted text stores aiAssisted true, the model id and the prompt version, with an audit event. The suggestion never changes entry content, quantities, times or statuses. Online only. | Should | A18, NA17, NA24 | [v2.2] |
| FR-34 | The supervisor can preview the draft offline from local data. | Should | R2 |
| FR-35 | A template builder for organisations. | Won't | A4, A11 |

### 5.5 Review and approval

| ID | Requirement | Priority | Evidence or assumption ID |
|---|---|---|---|
| FR-36 | Submitting freezes the revision: the snapshot and its SHA-256 are stored and the status becomes Submitted. | Must | A10, R1 |
| FR-37 | The project reviewer approves or requests changes. A comment of at least 10 characters is required to request changes. | Must | A1, R1 |
| FR-38 | When changes are requested, the supervisor edits entries and the summary in a new revision and resubmits. All revisions and reviews remain visible. | Must | A10 |
| FR-39 | An approved revision is locked and labelled "Approved, latest approved version". Exports carry the revision number, approval date, reviewer and content checksum. | Must | R1, R3 |
| FR-40 | A user cannot review a report they created. | Must | A1 |
| FR-41 | Every report list and page shows one of four statuses: Draft, Submitted, Changes requested, Approved. The status is that of the newest revision. When an approved revision exists, "Latest approved: revision N" is shown beside it. [v2.1] | Must | R1 |
| FR-42 | An approved revision can be exported to PDF. [v2.1] | Must | R1, R2, R3 |
| FR-42a | An approved revision can be exported to Word (.docx), delivered by pilot week 2 if requested. [v2.1] | Should | R1, R2, R3 |
| FR-43 | Email notifications: to the reviewer on submission, to the supervisor on a decision. | Should | R1, NA14 |
| FR-44 | An admin can reopen an approved report. This creates a new revision that needs approval; the previous approved revision stays the latest approved version until then. | Could | A10 |
| FR-45 | Reviewer comments attached to a single entry. | Could | R1 |

### 5.6 Search and history

| ID | Requirement | Priority | Evidence or assumption ID |
|---|---|---|---|
| FR-46 | Users search entries and reports by project, site and date range, within their own access. Results open the entry or report. | Must | R3, A2 |
| FR-59 | A supervisor can run a semantic (vector) search over their own reports and the text of entries linked to their photos, scoped by organisationId and membership. Results open the report or photo. Only report text, summaries, entry notes and pick-list labels are embedded; image pixels, GPS, user names and email addresses are never sent to the AI provider. Online only. | Should | R3, A2, NA25 | [v2.2] |
| FR-47 | Filter results by report status and supervisor. | Should | R1 |
| FR-48 | Each entry and report shows its version and audit history. | Should | A10, R1 |
| FR-49 | Free-text search on note text. | Could | R3 |
| FR-50 | Map view of entries. | Won't | Roadmap |

### 5.7 Admin

| ID | Requirement | Priority | Evidence or assumption ID |
|---|---|---|---|
| FR-51 | The admin creates, edits and archives projects (code, name, client) and sites (code, name, time zone, optional centre point and radius used as the default map pin). | Must | A2 |
| FR-52 | The admin invites users, assigns supervisors to projects and sites, and assigns exactly one reviewer per project. A user cannot hold both the Supervisor and Reviewer roles on the same project. Each project may name one backup reviewer, who can decide any report the main reviewer cannot (their own report, or a reviewer who is absent). [v2.1] | Must | A1, A2 |
| FR-53 | The admin manages pick-lists: activity types, work statuses (with an "issue" marker), units and weather. | Should | A11, R1 |
| FR-54 | The admin deactivates a user. Sessions are revoked. Entries captured before deactivation are still accepted at sync and flagged for the reviewer. [v2.1] | Must | A6, A8, NA12 |
| FR-55 | The admin sees the retention period, default 7 years. Changing it writes an audit event. Retention deletion is not built in V1: no record reaches the retention period during the pilot. It is designed in V2 with a separate database role. [v2.1] | Must | A8 |
| FR-56 | The admin exports the audit log to CSV. | Could | A10 |
| FR-57 | When a deactivated user's device next contacts the server, the server returns 410 Account closed. The app uploads entries captured before deactivation (FR-54), then deletes all local FieldLog data and shows "This account is closed." [v2.1] | Must | A6, A8, NA12 |

**Count:** 63 requirements. 39 Must, 16 Should, 4 Could, 4 Won't. [v2.2]

### 5.8 User stories and acceptance criteria (every Must)

**Access**

- **US-01 (FR-01).** As a supervisor, I want to sign in with my email and password so that I can reach my projects.
  Given an active user with a set password, when they enter the correct email and password, then a database session is created, a SIGN_IN audit event is written and the user lands on their project list. Given a wrong password, when they submit, then they see "Email or password is incorrect" and no session is created.
- **US-02 (FR-02).** As a supervisor, I want to see only my assigned projects and sites so that I pick the right one quickly.
  Given a supervisor assigned to site SITE-03 only, when they open the project list or call any API for SITE-04, then SITE-04 is not listed and the API returns 404.
- **US-03 (FR-03).** As an admin, I want roles set per project so that people only do what their role allows.
  Given a user who is a Supervisor on project P1 and has no role on P2, when they try to approve a P1 report or open a P2 report, then the server returns 403 and writes no change.
- **US-04 (FR-04).** As a supervisor, I want my offline work kept when my session expires so that I never lose a day's records.
  Given 12 unsynced entries and an expired session, when the device regains signal, then the entries stay on the device, capture still works, and the app asks the user to sign in. When they sign in, then the 12 entries upload.
- **US-05 (FR-05).** As a supervisor, I want to be stopped from signing out with unsynced work so that I do not lose it.
  Given 3 unsynced entries, when the user taps Sign out, then a dialog says "3 entries are not uploaded yet. They will upload the next time you sign in on this phone." with "Sync now" and "Sign out anyway". When they choose "Sign out anyway", then the session ends, the 3 entries stay on the device and are hidden from any other user who signs in, and a SIGN_OUT_WITH_UNSYNCED event is sent when that user next syncs. [v2.1]

**Capture**

- **US-06 (FR-09).** As a supervisor, I want my recent sites shown first so that I start an entry in two taps.
  Given the user used sites A, B and C today, when they open the site picker, then C, B and A are listed first, newest first, even offline.
- **US-07 (FR-10).** As a supervisor, I want to take or upload a photo in the browser so that I do not need another app.
  Given a supported browser, when the user taps "Take photo", then the device camera opens; when they tap "From gallery", then the file picker opens filtered to images. Given a non-image file, then it is rejected with a message.
- **US-08 (FR-11).** As a supervisor, I want time and location read from my photo so that I do not type them.
  Given a gallery photo with EXIF DateTimeOriginal and GPS, when it is added, then exifTakenAt, exifLat and exifLng are stored before compression and shown on the entry.
- **US-09 (FR-12).** As a reviewer, I want to know where each location came from so that I can trust it.
  Given browser location is denied and the photo has no GPS, when the user saves, then they are offered a map pin. Given they skip it, then the entry saves with locationSource NONE and a "No location" flag shown on the entry and the report.
- **US-10 (FR-13).** As a reviewer, I want entries flagged when the phone clock is wrong so that I can trust the times.
  Given a device clock 14 minutes behind the server, when its batch syncs, then each entry stores clockOffsetSec of 840, a corrected time, and a "Clock differs by 14 min" flag.
- **US-11 (FR-14).** As a supervisor, I want pick-lists with my last choices preselected so that I barely type.
  Given the last entry at this site used "Excavation" and "In progress", when the user starts a new entry there, then both are preselected and the entry saves with one tap. Given free text over 500 characters, then the field stops accepting input at 500.
- **US-12 (FR-17).** As a supervisor, I want to fix an entry before I submit so that the report is right, without rewriting history.
  Given an entry in an unsubmitted revision, when the user edits it, then EntryVersion 2 is created and the report shows version 2. Given the report was submitted, when the user opens the entry, then it is read-only until changes are requested; an edit then creates a new version used only in the new revision, and the submitted revision is unchanged. Given a delete, then deletedAt is set and the entry leaves the draft.

**Offline and sync**

- **US-13 (FR-20).** As a supervisor, I want the app to open with no signal so that I can work anywhere on site.
  Given the user signed in once and the device is in flight mode, when they open FieldLog, then the app loads within 3 seconds and shows their projects, sites and pick-lists.
- **US-14 (FR-21).** As a supervisor, I want "saved" to mean saved so that I can close the app safely.
  Given the user taps Save, when the IndexedDB transaction commits, then "Saved on this phone" appears. Given the transaction fails, then the form keeps its data and shows "Not saved. Try again."
- **US-15 (FR-22).** As a supervisor, I want sync to happen by itself so that I do not have to remember it.
  Given 5 unsynced entries and no signal, when signal returns while the app is open, then sync starts within 10 seconds without user action.
- **US-16 (FR-23).** As a supervisor, I want to see what is not uploaded so that I know when I can leave.
  Given 2 unsynced entries with 4 photos, when the user looks at the header, then it shows "2 entries, 4 photos waiting" and the last sync time. Given everything synced, then it shows "All uploaded" and the time.
- **US-17 (FR-24).** As an admin, I want repeated uploads to be harmless so that bad signal never creates duplicates.
  Given an entry upload whose response was lost, when the device sends the same entry UUID again, then the server returns the existing record and creates no second row. Given a photo whose checksum does not match the stored object, then the photo is marked FAILED and the device re-uploads it.
- **US-18 (FR-25).** As an admin, I want my project changes to reach phones so that everyone uses the same sites and lists.
  Given the admin renamed SITE-03 and archived an activity type, when a device syncs, then it shows the new name and no longer offers the archived type for new entries; existing entries keep their stored value.
- **US-19 (FR-28).** As a supervisor, I want warning before the offline limit so that I find signal in time.
  Given the oldest unsynced entry is 10 days old, when the user opens the app, then a banner says "Some work has not uploaded for 10 days. Connect to signal soon. Phones can clear stored data without warning after 14 days." and the data stays on the device. FieldLog itself never deletes it. [v2.1]

**Report generation**

- **US-20 (FR-29).** As a supervisor, I want a draft report built from my entries so that I never re-type them.
  Given 8 entries at SITE-03 on 12 November 2026 (site time), when the user opens Reports, then one Draft report for that site and date lists all 8 entries with photos, times, locations and pick-list values.
- **US-21 (FR-30).** As a reviewer, I want every report in the same layout so that I can review quickly.
  Given the organisation uses the standard template, when any report is shown or exported, then it has the sections listed in section 6, step P12, in that order.
- **US-22 (FR-32).** As a supervisor, I want to be told what is missing before I submit so that the report is not sent back.
  Given 1 entry not yet uploaded, when the user taps Submit, then submission is blocked with "1 entry still on this phone. Sync first." Given 2 entries with no location, then a warning lists them and the user can still submit. Given a photo that failed after all retries, then the user can remove it with a reason or submit with a "Photo failed to upload" flag. [v2.1]
- **US-23 (FR-33).** As a supervisor, I want my edits protected from conflicts so that I do not overwrite newer data.
  Given the report is at version 4 on the server and the device holds version 3, when the user saves the summary, then the server returns 409, the app reloads version 4 and keeps the user's typed summary in the field for them to save again.

**Review and approval**

- **US-24 (FR-36).** As a reviewer, I want a submitted report frozen so that what I review cannot change under me.
  Given a Draft report, when the supervisor submits, then the revision's snapshot and SHA-256 are stored, status is Submitted, and no entry in that revision can change.
- **US-25 (FR-37).** As a reviewer, I want to approve or send back a report so that work is checked.
  Given a Submitted report, when the reviewer taps Approve, then status becomes Approved and a Review row is stored. When they tap Request changes with a comment under 10 characters, then the button stays disabled.
- **US-26 (FR-38).** As a supervisor, I want to fix and resubmit a returned report so that it gets approved.
  Given a report in Changes requested with the comment "Add quantities to entries 3 and 5", when the supervisor edits them and resubmits, then revision 2 is Submitted, revision 1 and its review remain visible, and the reviewer sees what changed per entry.
- **US-27 (FR-39).** As a project manager, I want the approved version to be obvious so that nobody has to ask.
  Given revision 2 is approved, when anyone opens the report, then it shows "Approved, latest approved version, revision 2" and cannot be edited.
- **US-28 (FR-40).** As an organisation, I want no self-approval so that every report is checked by someone else.
  Given a user who created report X and is also its project's reviewer, when they open X, then no Approve or Request changes button is shown and the API returns 403.
- **US-29 (FR-41).** As a supervisor, I want to see each report's status so that I know what needs action.
  Given reports in all four states, when the user opens the report list, then each row shows exactly one of Draft, Submitted, Changes requested or Approved.
- **US-30 (FR-42).** As a project manager, I want a PDF export so that I can send reports through existing channels.
  Given an approved revision, when the user taps Export PDF, then a file is ready within 30 seconds for 50 photos, carries the approval stamp and checksum, and an EXPORT audit event is written. Given a report that is not approved, then the export button is not shown. [v2.1]

**Search and history**

- **US-31 (FR-46).** As a supervisor, I want to find past entries and reports by project, site and date so that I can answer questions quickly.
  Given access to SITE-03 only, when the user searches project RMD-2026-014, site SITE-03, 1 to 30 November 2026, then results show matching reports and entries within 1 second and nothing from other sites.

**Admin**

- **US-32 (FR-51).** As an admin, I want to set up projects and sites so that supervisors can start.
  Given the admin creates site SITE-03 with time zone Europe/London, when an assigned supervisor next syncs, then SITE-03 appears in their picker. Given a duplicate site code in the same project, then the form rejects it.
- **US-33 (FR-52).** As an admin, I want to assign people so that each project has supervisors and one reviewer.
  Given project P1 has reviewer A, when the admin assigns reviewer B, then the form asks to replace A, only B can review new submissions, and every report in Submitted moves to B's queue with an ASSIGN audit event. Given a user who is a Supervisor on P1, then the form refuses to also make them Reviewer on P1. Given an invited user, then they receive an email with a link valid for 7 days [NEW ASSUMPTION] (NA3). [v2.1]
- **US-34 (FR-55).** As an admin, I want to see and set the retention period so that we meet our records policy.
  Given a new organisation, when the admin opens settings, then retention shows 7 years. When they change it to 10, then an UPDATE audit event records the old and new values.

**Added in v2.1 (Musts that are new or promoted)**

- **US-35 (FR-11a).** As a reviewer, I want a photo's real time and place used so that a Tuesday photo added on Wednesday stays on Tuesday's report.
  Given a gallery photo with EXIF DateTimeOriginal of Tuesday 15:10 and GPS inside SITE-03, saved on Wednesday 08:00, when the entry syncs, then occurredAt is Tuesday 15:10 site time, the entry joins Tuesday's Visit, locationSource is EXIF, and the entry shows "Added from gallery later". Given the same photo with browser location now at the office, then the office location is not used unless the user taps "I am at this place now".
- **US-36 (FR-27).** As a supervisor on an iPhone, I want to be told to install FieldLog so that my offline work is not cleared by Safari.
  Given an iOS user in a normal Safari tab, when they open Capture, then a full-screen install guide shows and offline capture is not available. Given the app runs from the home screen, then capture works offline and storage persistence is requested.
- **US-37 (FR-29a).** As a supervisor, I want a late photo to end up on a report so that no evidence is lost.
  Given revision 1 is Approved and a new entry for the same Visit syncs, when the server stores it, then revision 2 is created as a Draft containing it, revision 1 stays the latest approved version, and the report shows "Draft" with "Latest approved: revision 1". Given the report is Submitted, then the reviewer sees "1 entry added after submission".
- **US-38 (FR-54).** As an admin, I want to deactivate a leaver so that they lose access at once.
  Given an active supervisor, when the admin deactivates them, then their sessions are revoked, a DEACTIVATE audit event is written, and entries they captured earlier are still accepted at sync and flagged for the reviewer.
- **US-39 (FR-57).** As an organisation, I want a leaver's data removed from their phone so that site data does not stay on a personal device.
  Given a deactivated user whose phone holds 2 unsynced entries, when the app next reaches the server, then it receives 410 Account closed, uploads the 2 entries, deletes all local FieldLog data, and shows "This account is closed."

**Added in v2.2 (Shoulds)**

- **US-40 (FR-58).** As a supervisor, I want a suggested report summary so that I write less.
  Given a Draft report with entries, when the supervisor taps "Suggest summary", then a suggestion of 150 words or fewer is shown with Accept, Edit and Reject and nothing is saved. Given Accept, then the summary field contains the suggestion, aiAssisted is true, the model id and prompt version are stored, and an AI_SUMMARY_ACCEPTED audit event is written. Given Edit, then the edited text is saved with aiAssisted true. Given Reject, then no summary text is saved. Given the provider fails, then the field stays editable and the report can be saved and submitted normally. [v2.2]
- **US-41 (FR-59).** As a supervisor, I want to search by meaning so that I can find records when I do not remember the exact words.
  Given access to SITE-03 only, when the supervisor searches "sediment near the outfall", then results show matching reports and photos from SITE-03 within 1 second and nothing from other organisations, projects or sites. Given no relevant result, then an empty state is shown and the user can use FR-46 filters. Given the AI provider is unavailable, then semantic search falls back to FR-46 and never blocks capture, sync or submit. Given a reviewer or admin calls the API, then 403. [v2.2]

- **US-43 (FR-61, Must).** As the admin of a new organisation, I want to sign up and create my organisation so that I can start using FieldLog without asking anyone. Accept: a new Organisation, admin User and Subscription exist; signing up with an email already in use shows the same message as success and sends no second account; a breached password is refused. [v2.3]

- **US-44 (FR-62, Must).** As a new admin, I want to confirm my email with a code so that FieldLog knows the address is mine. Accept: a wrong code counts an attempt; an expired or used code is refused with one generic message; the code is never stored or logged in plain text. [v2.3]

- **US-45 (FR-63, Must).** As an admin, I want to see when my subscription ends so that my team is not cut off by surprise. Accept: an expired organisation can still sync every captured entry; the blocked actions show why. [v2.3]

- **US-46 (FR-64, Must).** As an admin, I want to pay for my seats so that the subscription continues. Accept: a cancelled checkout leaves a PaymentAttempt that becomes ABANDONED; sending the same webhook twice creates one Payment. [v2.3]

- **US-47 (FR-06, Must).** As any user, I want to reset a forgotten password so that I can get back in. Accept: after a reset, every other session of that user is signed out. [v2.3]


## 6. AI processing pipeline

### Part A. V1 processing pipeline (no AI)

V1 uses fixed rules only. No language model, image recognition or other AI service runs in V1 (A18).

| Step | Input | Processing | Output | Runs on | On failure |
|---|---|---|---|---|---|
| P1 Capture | Camera or gallery image via file input | Accept JPEG, HEIC (where the browser decodes it) and PNG up to 25 MB | Original image in memory | Device | Unsupported or unreadable file: message, nothing saved |
| P2 Read time and location | Original image | Read EXIF DateTimeOriginal, GPS and orientation with exifr before any change (A9) [NEW ASSUMPTION] (NA7) | exifTakenAt, exifLat, exifLng | Device | Missing EXIF: fields left empty, continue to P3 |
| P3 Resolve location | Photo source, browser location request (10 second timeout, high accuracy), EXIF GPS | CAMERA: use browser location if accuracy is 100 m or better, else EXIF GPS, else offer map pin, else NONE. GALLERY: EXIF GPS, else offer map pin, else browser location only if the user taps "I am at this place now", else NONE. Flag "No location" for NONE and "Outside site" when more than the site radius plus 500 m from the site centre (A13, NA23) [v2.1] | lat, lng, accuracyMetres, locationSource, locationFlagged | Device | Permission denied or timeout: fall through the chain, never block saving |
| P4 Record time | Device clock, EXIF time | Store deviceCapturedAt. Set occurredAt: for gallery entries the first photo's EXIF DateTimeOriginal read as site local time unless OffsetTimeOriginal is present, else deviceCapturedAt. Clock offset is set at sync (P8) (A14) [NEW ASSUMPTION] (NA4) [v2.1] | deviceCapturedAt, occurredAt | Device | None |
| P5 Compress | Original image | Apply orientation, resize long edge to 1,600 px, encode JPEG at quality 0.8, step down by 0.1 to 0.5 until 450 KB or less; EXIF is not copied into the output (A9) [NEW ASSUMPTION] (NA6) | Compressed JPEG near 400 KB | Device | Out of memory on low-end phone: retry at 1,280 px; if it still fails, keep entry, mark photo FAILED with a retry |
| P6 Checksum | Compressed JPEG | SHA-256 with Web Crypto | sha256 (64 hex) | Device | Web Crypto needs HTTPS. If hashing fails, the photo is not queued and the user is told |
| P7 Save locally | Entry form, photo blobs, metadata | One Dexie transaction writes entry, photos and an outbox row | Queued entry | Device | Transaction fails: form keeps data, "Not saved. Try again." (FR-21) |
| P8 Sync entries | Outbox of operations, up to 25 per batch | POST /api/sync/batches with batch UUID and device clock. Server computes clockOffsetSec, applies operations not yet applied, ignores repeats, sets createdById from the session user, and assigns the Visit from occurredAt in the site time zone. An entry whose payload userId differs from the session user is rejected with reason "wrong user". An entry that reaches a Visit with a Submitted or Approved report follows FR-29a [v2.1] | SyncBatch, SyncOperation, Entry, EntryVersion rows; per-item ack | Server | Network error: retry with backoff. Item rejected (for example site no longer assigned, or wrong user): kept on the device, shown with reason, admin alerted |
| P9 Upload photos | Acked entry's photos | Request a presigned PUT URL (15 minute expiry) with the SHA-256 as x-amz-checksum-sha256; PUT directly to object storage (where the provider supports the checksum header, it carries the digest in base64) [v2.1]; POST complete | Object in storage, Photo status UPLOADED | Device and server | Storage rejects checksum or network fails: retry; local copy kept until P10 confirms |
| P10 Verify and thumbnail | Photo id | pg-boss job photo.verify: download the object, compute SHA-256 and byte size on the server, compare with Photo.sha256 and byteSize, then create a 320 px thumbnail with sharp from the same bytes [NEW ASSUMPTION] (NA7) [v2.1] | Status VERIFIED, thumbnailKey | Job | Mismatch: status FAILED, device told on next sync to re-upload. 3 failed attempts: alert |
| P11 Report draft | Visit's non-deleted entries | Create Report and revision 1 on first entry; add a ReportEntry per current EntryVersion ordered by occurredAt. Late entries follow FR-29a [v2.1] | Draft report | Server | Database error: request fails, retried on next view; no partial rows (one transaction) |
| P12 Report assembly | Revision, entries, photos, pick-lists | Fill the standard template in this order: header (organisation, project code and name, site code and name, date, supervisor, reference, revision, status); weather; work summary (count of entries and total quantity per activity type and unit); entry log (time, activity, status, quantity, note, location and source, flags, thumbnails); issues and observations (entries whose status is marked as issue); flags (location and clock); supervisor summary; review block (reviewer, decision, date, comments); footer (approval stamp, content SHA-256) (A11) | Rendered report view and JSON snapshot | Server | Missing photo thumbnail: show placeholder "Photo processing"; submission is blocked while a photo is PENDING_UPLOAD or UPLOADED (FR-32). A photo FAILED after all retries does not block: the supervisor removes it with a reason or submits with a "Photo failed to upload" flag shown to the reviewer [v2.1] |
| P13 Submit and freeze | Revision | Completeness check (FR-32), write snapshot JSON and its SHA-256, set status Submitted, queue email | Frozen revision | Server | Check fails: list of blocking items. Version mismatch: 409 (FR-33) |
| P14 Export | Approved revision snapshot | pg-boss job report.export: PDF with @react-pdf/renderer and, for FR-42a, Word with docx, from the frozen snapshot only; upload to storage with checksum; signed download link valid 15 minutes [NEW ASSUMPTION] (NA7) | ReportExport READY | Job | Job fails: 3 retries at 1, 5 and 15 minutes, then FAILED with a "Try again" button and an alert |

### Part B. AI design (V1 Should: report summary; V2: photo captions)

**FR-58 (report summary) is a V1 Should and ships only if time allows.** Photo captions stay V2. Nothing is on by default: the organisation admin switches each feature on, feature flags stay off until the accuracy gate passes, and a person must accept every suggestion. [v2.2]

**Schema status.** The V1 schema has no AI fields. The proposed change adds nullable columns (caption, aiAssisted, aiModelId, aiPromptVersion on Photo and ReportRevision) and vector storage. It is not applied until Rox approves Q19. [v2.2]

| Item | Photo caption suggestion (V2) | Daily summary suggestion (FR-58, V1 Should) |
|---|---|---|
| V1 status | Not built | Should; dropped first if the build slips |
| Purpose | Suggest a one-line caption for a photo | Suggest the report summary paragraph |
| Model input | Compressed photo with location removed, activity type, work status, site name | Text fields of the revision's entries (time, activity, status, quantity, unit, note). No photos, no names of people. |
| Model output | Caption up to 120 characters, plus model id and prompt version | Summary up to 150 words, each sentence linked to the entry ids it uses |
| Human step | Shown greyed out with Accept, Edit and Reject. Never saved without Accept. | Shown beside the empty summary field with Accept, Edit and Reject. Sentences without entry links are not shown. |
| Record | Accepted text is stored with aiAssisted true, model id, prompt version and an audit event | Same |
| Accuracy gate | 200 pilot photos labelled by 2 supervisors. Release if at least 85% are rated acceptable and none states a wrong site, a hazard not present, or a quantity [NEW ASSUMPTION] (NA17) | 50 approved pilot reports. Release if no more than 2% of sentences contain a fact not in the entries and none changes a quantity, time or status [NEW ASSUMPTION] (NA17) |
| Ongoing check | Monthly sample of 50 suggestions; switch off if the rate drops below the gate | Same, plus acceptance rate per supervisor |

**Data privacy rules.**

1. Off by default. The organisation admin switches each feature on.
2. Processing stays in the organisation's region (A5). The provider must not train on or keep customer data beyond 30 days.
3. Send the minimum: for FR-58 and FR-59, no GPS, no user names, no email addresses and no image pixels.
4. A data protection impact assessment is complete before release (Q9).

**Cost per report.** Cost per report = (input tokens x input price) + (output tokens x output price) + (photos x per-image price) + (embedding tokens x embedding price). Measure it on the accuracy test set. Release only if the measured cost is £0.05 per report or less [NEW ASSUMPTION] (NA17). Embedding cost for FR-59 is included in the same measurement. Prices are not fixed here because they change; the test uses the provider's prices at that date.

**Vector search design (FR-59, V1 Should).**

- **Indexed text.** Report summaries, section headings, entry notes, activity type, work status and pick-list labels. No image pixels, GPS, user names or email addresses.
- **Embedding.** Gemini text embedding model on the free tier, with the dimension fixed at implementation. One embedding per report revision and per current entry version; re-embed on change and remove on soft delete.
- **Storage and search.** PostgreSQL with the pgvector extension, cosine distance and an approximate nearest-neighbour index. Every query filters by organisationId and membership before returning rows. The schema and extension change is part of Q19 and is not applied until Rox approves.
- **Results.** A report or photo that belongs to a matching entry. Results open the report or photo, and the user can still use the FR-46 filters.
- **Failure and fallback.** Provider or index failure hides semantic search and uses FR-46. It never blocks capture, sync, submission, review or export.
- **Gate (NA25).** On a 50-query test set across at least 2 sites, at least 80% return a relevant report or photo in the top 3, 0 results fall outside the user's access, and p95 latency is 1 second or less.

## 7. Technical requirements

### 7.1 Architecture (described in text)

**Implementation language:** TypeScript.

1. **Browser (phone or desktop).** Next.js client components. Serwist service worker caches the app shell and static assets. Dexie (IndexedDB) holds reference data, entries, photo blobs and the outbox. A sync module runs in the page.
2. **Next.js app server.** App Router. Field screens (Today, Capture, local Entry view, Visit preview) are client components that read only from Dexie, served from static routes precached by Serwist, with ids passed as query parameters. Server components are used only for online screens: review, reports list, search and admin. Server actions serve admin and review forms, and route handlers under /api serve sync, uploads and exports. Auth.js manages sessions. Prisma talks to PostgreSQL. [v2.1]
3. **PostgreSQL.** All relational data and the pg-boss job tables. One database, one region.
4. **Worker.** A separate long-running Node process with the same codebase, running pg-boss jobs: photo.verify, report.export, email.send.
5. **Object storage (S3-compatible).** Private bucket for photos, thumbnails and exports. The browser uploads with presigned PUT URLs and downloads with presigned GET URLs.
6. **Email provider.** Transactional email for invites, resets and notifications, in the same region [NEW ASSUMPTION] (NA14).

**AI and vector search (FR-58, FR-59, Should).** Gemini API on the free tier for report-summary suggestions and text embeddings. PostgreSQL with the pgvector extension stores and searches embeddings. Both are online-only and never block Must flows. The schema, extension and index changes need Rox's approval (Q19). [v2.2]

Data flow: device saves locally, sync posts entries to the app server, photos go from device straight to object storage, the worker verifies photos and builds exports, reviewers read reports from the app server.

### 7.2 Next.js route and API structure

| Route | Purpose | Roles |
|---|---|---|
| / | Marketing page [v2.3] | Public |
| /sign-in?mode=sign-in|sign-up|reset, /invite/[token], /reset/[token] | Access, sign-up, reset request [v2.3] | Public |
| /(app)/today | Recent sites, sync status, today's entries | Supervisor |
| /(app)/capture?siteId= | New entry form | Supervisor |
| /(app)/entry?id= | Entry view, edit and history (client-rendered from Dexie; online history from the server) | Supervisor, Reviewer |
| /(app)/visit?id= | Visit preview from local data, works offline | Supervisor |
| /(app)/reports | Report list with status filter | All |
| /(app)/reports/[reportId] | Report, revisions, submit | Supervisor, Reviewer |
| /(app)/review | Queue of submitted reports | Reviewer |
| /(app)/search | Search by project, site and date | All |
| /(admin)/admin/projects, /admin/sites, /admin/users, /admin/pick-lists, /admin/settings | Setup | Admin |
| /(admin)/admin/billing | Subscription, seats, pay, payment history [v2.3] | Admin |

| API route handler | Method | Purpose |
|---|---|---|
| /api/sync/bootstrap | GET | Reference data for an assigned user and a sync cursor |
| /api/sync/pull?cursor= | GET | Reference data changed since cursor (server wins) |
| /api/sync/batches | POST | Idempotent batch of up to 25 operations (create entry, add version, delete entry, add photo, remove photo) |
| /api/photos/[photoId]/upload-url | POST | Presigned PUT URL with checksum |
| /api/photos/[photoId]/complete | POST | Mark UPLOADED, queue photo.verify |
| /api/reports/[reportId] | GET, PATCH | Read; edit draft with If-Match version |
| /api/reports/[reportId]/submit | POST | Completeness check and freeze |
| /api/reports/[reportId]/reviews | POST | Approve or request changes |
| /api/reports/[reportId]/exports | POST, GET | Queue export; get status and download link |
| /api/reports/[reportId]/summary-suggestion | POST | Generate an AI summary suggestion for a Draft revision (FR-58) |
| /api/search | GET | Filtered or semantic search (FR-46, FR-59) |
| /api/billing/checkout | POST | Writes a PaymentAttempt, returns the provider's hosted checkout URL [v2.3] |
| /api/billing/webhook | POST | Provider webhook; signature checked, transaction re-fetched (FR-64) [v2.3] |
| /api/health | GET | Liveness for monitoring |

Sync and upload use route handlers because the sync module calls them directly and needs explicit status codes. Admin and review forms use server actions.

### 7.3 Offline and sync design

- **Local tables (Dexie).** reference (projects, sites, pick-lists, memberships), entries, entryVersions, photos (blob plus metadata), outbox, meta (cursor, deviceId, last sync).
- **Ids.** UUIDs created on the device for entries, entry versions, photos and batches, so retries are safe (A12).
- **Per-user rows.** Every local row carries userId. The app reads, shows and syncs only the signed-in user's rows. Another user's unsynced rows stay on the device, hidden, until that user signs in on it again. [v2.1]
- **Operation log.** Edits, deletes and photo removals are queued as typed operations with their own UUIDs, so replays are harmless (FR-24). [v2.1]
- **Order.** Entries sync before their photos. Photos upload one at a time on slow connections, three at a time otherwise.
- **Triggers.** App open, online event, visibility change, 60 second timer, "Sync now", and Background Sync where the browser supports it (Chrome, Edge). Safari has no Background Sync, so iOS syncs only while the app is open (RK-02).
- **Conflicts.** Entries are add-only per user, so two devices never edit the same row. Project, site and pick-list data: server wins. Reports: version check, 409 on mismatch (A12).
- **AI and semantic search.** Online only. If the device is offline or the provider is unavailable, the summary control shows "Available online" and semantic search falls back to FR-46. Neither blocks capture, sync or submission. [v2.2]
- **Local clean-up.** An entry leaves the outbox only after the server acks it and its photos are VERIFIED. Synced photos stay on the device for 7 days, then are removed when storage is low [NEW ASSUMPTION] (NA13).
- **Session and offline.** The service worker never clears Dexie on 401. A 401 pauses sync and asks for sign-in (A6).
- **iOS.** Safari can clear storage for sites not used for 7 days unless the PWA is installed to the home screen, so iOS supervisors install it [NEW ASSUMPTION] (NA5). The app calls navigator.storage.persist() on every platform.
- **Clock.** Each batch carries the device clock. The server stores clockOffsetSec = server time minus device time and flags entries where the absolute value is over 600 seconds (A14) [NEW ASSUMPTION] (NA4).

### 7.4 Auth and roles

- **Sign-in.** Auth.js with email and password and database sessions. Auth.js runs with a custom adapter that hashes session tokens with SHA-256 on every read and write and sets organisationId from the user. The adapter is proven in Phase 1 week 1 (sign in, read session, revoke, expire). If it is not working by the end of week 1, Auth.js is replaced with a first-party session module on the same Session table [NEW ASSUMPTION] (NA2). Passwords use argon2id [NEW ASSUMPTION] (NA3). [v2.1]
- **Session.** HttpOnly, Secure, SameSite=Lax cookie. 30-day sliding expiry [NEW ASSUMPTION] (NA2). Revoked on sign-out, deactivation or password reset.
- **Roles.**

| Action | Supervisor | Reviewer | Admin |
|---|---|---|---|
| Capture and edit own entries | Yes, assigned sites | No | No, unless also a supervisor |
| Submit own reports | Yes | No | No |
| Approve or request changes | No | Yes, own projects, not own reports | No, unless also the reviewer |
| Search | Assigned sites | Own projects | Whole organisation |
| Export approved reports | Own reports | Own projects | Whole organisation |
| Manage projects, sites, users, pick-lists, settings | No | No | Yes |

- **Enforcement.** One Prisma client extension adds organisationId and membership filters to every tenant query. Integration tests cover each role against each API route.
- **Sign-up and verification [v2.3].** Only a new organisation's admin signs up (FR-61). Email verification by 6-digit code (FR-62). Gating: SOFT: signs in with a banner, cannot pay or invite until the email is confirmed.
- **Reset [v2.3].** Reset revokes every session of the user (FR-06). Email is sent by Gmail SMTP, for testing only in the app's region (NA14).

### 7.5 Storage

| Data | Store | Rule |
|---|---|---|
| Relational data | PostgreSQL | Encrypted at rest by the host. Daily backups kept 35 days, point-in-time recovery for 7 days [NEW ASSUMPTION] (NA16) |
| Photos | Object storage, private | Key org/{orgId}/photos/{yyyy}/{mm}/{photoId}.jpg, about 400 KB each (A9) |
| Thumbnails | Object storage, private | 320 px, about 30 KB |
| Exports | Object storage, private | Key org/{orgId}/exports/{reportId}/r{revision}.{pdf or docx} |
| Embeddings | PostgreSQL with pgvector | Report revision and entry text only; no image embeddings. Pending schema approval (Q19). [v2.2] |
| Retention | All | Default 7 years, set by the organisation (A8). Soft deletes kept for the retention period (A10) |

### 7.6 Background jobs (pg-boss)

| Job | Trigger | Retries | Alert when |
|---|---|---|---|
| photo.verify | Photo complete | 3, backoff 1, 5, 15 minutes | 3 failures, or queue age over 15 minutes |
| report.export | Export request | 3, backoff 1, 5, 15 minutes | Any FAILED export |
| email.send | Submit, decision, invite, reset | 5, backoff up to 1 hour | 5 failures |
| billing.attempt-check [v2.3] | Every 10 minutes | 3, backoff 1, 5, 15 minutes | Any attempt still INITIATED after 24 hours |
| billing.expiry [v2.3] | Daily | 3, backoff 1, 5, 15 minutes | Job did not finish in 24 hours |

Every job logs one start line and one finish line with counts, so a stopped job can be told apart from a job with nothing to do. [v2.3]

### 7.7 Security

- TLS everywhere. HSTS with a 1-year max age.
- Content Security Policy with no inline scripts except Next.js nonces. img-src allows self, blob:, data: and the storage domain. connect-src allows self and the storage domain. [v2.1]
- Presigned URLs expire in 15 minutes. The bucket is private.
- Rate limits: sign-in 10 per 15 minutes per account and 50 per 15 minutes per IP; sign-up 5 per hour per IP; reset 3 per hour per email; sync 120 requests per minute per user. Counts are kept in PostgreSQL (RateLimitCounter) so they survive a restart. Over the limit: 429 with Retry-After. [v2.3]
- Payment webhooks: verify the signature, then fetch the transaction from the provider before writing a Payment. Never log card data, webhook bodies or provider secrets. [v2.3]
- Sign-in, sign-up and reset errors never reveal whether an email has an account. [v2.3]
- Server-side validation of every input with a shared schema (Zod) [NEW ASSUMPTION] (NA7).
- AuditEvent is append-only: the app database role has no UPDATE or DELETE on it.
- **AI and vector search privacy.** FR-58 and FR-59 send no GPS, user names, email addresses or image pixels. Gemini free tier must meet no-training, 30-day retention and region rules; if it does not, use a compliant paid tier or do not ship. Accepted summaries store the model id and prompt version. Semantic search queries are scoped by organisationId and membership and covered by tenant-isolation tests. [v2.2]
- Location data about employees is personal data. A data protection impact assessment is needed before the pilot (Q9).
- Processors added in v2.3: Flutterwave (payment; receives the admin's name and email, the organisation name and the amount) and Gmail SMTP, for testing only (codes, invites, resets). Both are covered by the DPIA (Q9). [v2.3]
- Dependency scanning in CI. No secrets in the repository.

### 7.8 Performance budgets

| Budget | Target | Test |
|---|---|---|
| JavaScript on /capture | 170 KB gzipped or less | Build report in CI |
| App open offline, repeat visit | 3 s or less | Low-end Android (2 GB RAM), flight mode |
| First load on slow 3G | 8 s or less to interactive | Chrome DevTools Slow 3G profile |
| Save entry with one photo | 2 s or less at p95 from tap to "Saved on this phone" | Low-end Android, 12 MP photo |
| Photo compression | 3 s or less at p95 per 12 MP photo | Low-end Android |
| Photo upload | 12 s or less per 400 KB photo | Slow 3G profile |
| Report page | 2 s or less at p95, 50 entries | Server timing, desktop |
| Search | 1 s or less at p95 | 1 year of pilot-scale data |
| Semantic search (FR-59) | 1 s or less at p95 | 50-query set, pilot-scale data |
| AI summary suggestion (FR-58) | 5 s or less at p95, 50 entries | Server timing, Gemini free tier |
| Export | 30 s or less at p95, 50 photos | Worker timing |

### 7.9 Browser support

Latest two versions of Chrome (Android, desktop), Safari (iOS, macOS), Edge and Firefox (A7). Must work on low-end Android phones and slow 3G (A7). Firefox desktop does not support installing a PWA; it still works as a website with offline capture after first load. A browser that blocks IndexedDB, for example some private modes, gets a clear message that offline capture is not available.

### 7.10 Hosting and region

One managed host running the Next.js app, the worker process, PostgreSQL and S3-compatible storage, all in one UK or EU region agreed with the pilot organisation (A5). Staging and production are separate with separate databases and buckets. The host must run a persistent Node process for the pg-boss worker and keep long-lived PostgreSQL connections. Serverless-only platforms do not meet this. [v2.1]

### 7.11 Logging and monitoring

- Structured JSON logs with requestId, userId, organisationId and route. No photo content, passwords or tokens in logs. Logs kept 30 days.
- Error tracking with a Sentry-compatible service in the same region [NEW ASSUMPTION] (NA15). Client errors include app version and deviceId.
- Metrics: sync success rate, entries waiting on the server side, photo.verify failures, job queue age, export time, 5xx rate.
- Alerts to the developers: 5xx rate over 1% for 5 minutes, job queue age over 15 minutes, any checksum mismatch, any rejected sync item, health check failing for 2 minutes.

### 7.12 Non-functional requirements

| ID | Category | Requirement | Measurable target |
|---|---|---|---|
| NFR-01 | Data integrity | No captured entry is lost between device and server | 0 gaps between deviceSeq values issued and entries stored, checked weekly per device; any gap investigated within 1 working day [v2.1] |
| NFR-02 | Data integrity | Stored photos match their device checksum | 100% of VERIFIED photos |
| NFR-03 | Offline | Capture works with no signal | 100% of capture flows pass in flight-mode tests on each supported browser, including opening an entry created offline and previewing its Visit [v2.1] |
| NFR-04 | Offline | Unsynced data survives on the device | 14 days with no data loss, tested on Android Chrome and installed iOS PWA (A6) |
| NFR-05 | Performance | Save entry with photo | 2 s or less at p95 on low-end Android |
| NFR-06 | Performance | App size on capture route | 170 KB gzipped JavaScript or less |
| NFR-07 | Performance | Photo upload on slow 3G | 12 s or less per photo |
| NFR-08 | Performance | Search response | 1 s or less at p95 |
| NFR-09 | Performance | Export generation | 30 s or less at p95 for 50 photos |
| NFR-10 | Availability | App server and API uptime in pilot working hours (06:00 to 20:00) | 99.5% per month |
| NFR-11 | Recovery | Database recovery | Recovery point 24 hours or better, recovery time 4 hours or better |
| NFR-12 | Security | Tenant isolation | 0 cross-site or cross-project reads in role tests for every API route |
| NFR-13 | Security | Sign-in protection | Lockout after 10 failures; argon2id hashes |
| NFR-14 | Privacy and region | All data stored and processed in the agreed region | 100% of services in one UK or EU region (A5) |
| NFR-15 | Retention | Retention default | 7 years, configurable by organisation (A8) |
| NFR-16 | Auditability | Every create, change, submit, decision, export and sign-out with unsynced work is logged | 100% of these actions have an AuditEvent |
| NFR-17 | Usability | One-handed capture | A new entry with remembered pick-lists needs 4 taps or fewer after the photo |
| NFR-18 | Accessibility | Web accessibility | WCAG 2.2 AA on all screens; touch targets 44 x 44 px or larger |
| NFR-19 | Compatibility | Browser support | All Must flows pass on the latest two versions of Chrome, Safari, Edge and Firefox (A7) |
| NFR-20 | Battery | Low battery use while open | No background timers when the app is hidden; GPS requested once per entry only |
| NFR-21 | AI quality and privacy | AI report summary (FR-58) | No more than 2% of accepted-summary sentences contain a fact not in the entries; 0 change a quantity, time or status; 100% store model id and prompt version; 0 GPS, names, emails or image pixels sent |
| NFR-22 | Search quality and isolation | Semantic search (FR-59) | 0 cross-tenant results; 1 s or less at p95; at least 80% top-3 relevance on the 50-query set |
| NFR-23 | Resilience | AI or provider failure | Provider failure never blocks a Must flow; 100% fall back to FR-46 or a manual summary |

### 7.14 Payments [v2.3]

- Provider: Flutterwave, hosted checkout, **test mode only**. Live keys are not used in V1.
- Amounts are integers in minor units of NGN. Never a float.
- Order of writes: PaymentAttempt (INITIATED) → redirect → webhook → signature check → fetch transaction from provider → Payment row and Subscription period in one transaction → attempt SUCCEEDED.
- Idempotency: Payment.providerReference and PaymentAttempt.txRef are unique.
- What the provider receives: the admin's name and email, the organisation name, the amount. Never GPS, photos or field data.

## 8. Business model

| Item | V1 position | Source |
|---|---|---|
| Buyer | The employing organisation | A15 |
| Users | Field supervisors (primary), reviewers (secondary), one admin | A1, A2 |
| Price | ₦7,300 per active supervisor per month in NGN, paid in test mode in V1. Why this number: about one fifth of the supervisor time FieldLog saves each month [v2.3] | A15, FR-63 |
| Value per supervisor per month | (Median reporting minutes saved per report x reports per supervisor per month / 60) x loaded hourly cost of a supervisor, plus the same for reviewer minutes. The pilot organisation supplies the loaded hourly costs in Phase 0 [NEW ASSUMPTION] (NA21). [v2.1] | A15, A16 |
| Pilot scale | Up to 10 supervisors, 2 reviewers, 1 admin, 1 or 2 sites [NEW ASSUMPTION] (NA1) | A3 |
| What the pilot proves | Time and effort saved (A16, NA22), value per supervisor per month, how often the old method continues alongside FieldLog, and data integrity (A17) | A16, A17 |
| What the pilot does not prove | Willingness to pay, or adoption without a mandate | A15, A17 |

**Costs at pilot scale.** All figures are estimates to check in Phase 0, not quotes.

| Cost | Estimate | Basis |
|---|---|---|
| Managed hosting: app, worker, PostgreSQL, storage | £50 to £150 per month [NEW ASSUMPTION] (NA11) | Small instances in one region (A5) |
| Photo and export storage | About 2.4 GB of photos and about 5 GB of exports over 6 weeks | Photos: 10 supervisors x 20 photos a day x 400 KB x 30 working days. Exports: about 16 MB per approved report across PDF and Word, about 300 reports (NA1, A9) [v2.1] |
| Email and error tracking | Free or low tiers at pilot volume [NEW ASSUMPTION] (NA14, NA15) | Low volume |
| Team | Two full-stack developers, one part-time designer, Rox. Cost for 13 weeks (Phase 0 and Phase 1): not set, open question Q17 | A4 |

**What V2 discovery must prove.**

1. The organisation would pay a per-supervisor monthly fee, and at what level (A15).
2. Supervisors keep using FieldLog when it is not mandated (A17).
3. Reviewers find reports complete and faster to approve (A1, Q1).
4. A second organisation has the same problem and report format (A3, A11).
5. Which V2 module matters most: HSE, action tracking or dashboards.

## 9. Risks

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| RK-01 | Adoption: supervisors keep using notebooks, WhatsApp and Word alongside FieldLog | M | H | Measure dual-running weekly (G5). Short on-site training in pilot week 1. Fix the top 3 friction points each fortnight. | Rox |
| RK-02 | iOS offline limits: Safari has no Background Sync and may clear storage for non-installed sites | H | H | Block offline capture on iOS until FieldLog is installed to the home screen (FR-27, NA5). Sync whenever the app is open. Test 14 days offline on iOS in Phase 1. Native app considered in V2 if this fails. | Tech lead |
| RK-03 | Data loss on device before sync (storage cleared, phone lost) | M | H | Persistent storage request, sync on open, offline-age warning at day 10, sign-out guard, weekly reconciliation (NFR-01). | Tech lead |
| RK-04 | Location accuracy: poor GPS, denied permission, or gallery uploads without GPS (iOS can remove location from shared photos) | H | M | Fallback chain and flags (A13). Report shows location source. Track share of entries with automatic location. | Tech lead |
| RK-05 | Small sample: three supervisors and no reviewers | H | M | Phase 0 interviews with at least 5 supervisors and 2 reviewers. Treat requirements as hypotheses. | Rox |
| RK-06 | Team capacity: 39 Musts for two developers in 10 weeks | M | H | Cut line in section 13. Weekly burn-down. Use library defaults for UI. | Rox |
| RK-07 | Pilot mandate hides real value | H | M | Judge on time saved, dual-running and integrity, not usage (A17). Interview users in week 6. | Rox |
| RK-08 | Baseline is unreliable or not collected | M | H | Simple baseline log sheet, daily check in the baseline week, start pilot only with 5 or more baseline reports per supervisor. | Rox |
| RK-09 | Low-end phones run out of memory during compression | M | M | Fallback size (P5). Test on a 2 GB RAM device. | Tech lead |
| RK-10 | Personal data concerns over location tracking | M | H | Location only at capture, never in the background. DPIA before pilot (Q9). | Rox |
| RK-11 | Reviewer workflow does not match how approvals happen today | M | M | Reviewer interviews in Phase 0 (Q1). Keep the flow simple. | Rox |
| RK-12 | Supervisors refuse a mandated app on personal phones | M | H | Agree device ownership in the pilot agreement (Q15); offer company phones for refusals | Rox |
| RK-13 | Reviewer absent or overloaded, so decisions exceed 1 working day | M | M | Backup reviewer per project (FR-52); weekly check of queue age | Rox |

## 10. Prisma data model

The schema below passes `prisma validate` (Prisma 5.22). Version 2.3 adds, with no change to any existing model or field: Subscription, Payment, PaymentAttempt, EmailToken and RateLimitCounter, three enums, User.emailVerifiedAt and seven AuditAction values (Q34). [v2.3]

```prisma
// FieldLog V1 data model. PostgreSQL via Prisma.
// Conventions: UUID keys (entries and photos use client-generated UUIDs),
// organisationId on every tenant table (A3), audit fields on every mutable table,
// soft deletes via deletedAt (A10), optimistic concurrency via version (A12).

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [vector]
}

// ---------- Enums ----------

enum Role {
  ADMIN
  REVIEWER
  BACKUP_REVIEWER
  SUPERVISOR
}

enum UserStatus {
  INVITED
  ACTIVE
  DEACTIVATED
}

enum LocationSource {
  BROWSER
  EXIF
  MANUAL_PIN
  NONE
}

enum PhotoSource {
  CAMERA
  GALLERY
}

enum PhotoStatus {
  PENDING_UPLOAD
  UPLOADED
  VERIFIED
  FAILED
}

enum ReportStatus {
  DRAFT
  SUBMITTED
  CHANGES_REQUESTED
  APPROVED
}

enum ReviewDecision {
  APPROVED
  CHANGES_REQUESTED
}

enum PickListKind {
  ACTIVITY_TYPE
  WORK_STATUS
  UNIT
  WEATHER
}

enum SyncBatchStatus {
  RECEIVED
  PARTIAL
  COMPLETE
  REJECTED
}

enum SyncOperationType {
  CREATE_ENTRY
  ADD_VERSION
  DELETE_ENTRY
  ADD_PHOTO
  REMOVE_PHOTO
}

enum SyncOperationResult {
  APPLIED
  DUPLICATE
  REJECTED
}

enum ExportFormat {
  PDF
  DOCX
}

enum ExportStatus {
  QUEUED
  RUNNING
  READY
  FAILED
}

enum AuditAction {
  AI_ACCEPT
  AI_REJECT
  AI_SETTING_CHANGE
  CREATE
  UPDATE
  SOFT_DELETE
  RESTORE
  SUBMIT
  APPROVE
  REQUEST_CHANGES
  EXPORT
  SIGN_IN
  SIGN_OUT
  SIGN_OUT_WITH_UNSYNCED
  ASSIGN
  UNASSIGN
  DEACTIVATE
  SYNC
  SIGN_UP
  EMAIL_VERIFIED
  PASSWORD_RESET
  LOCKOUT
  PAYMENT_ATTEMPT
  PAYMENT_RECEIVED
  SUBSCRIPTION_CHANGE
}

enum AiFeature {
  PHOTO_CAPTION
  REPORT_SUMMARY
}

enum AiSuggestionOutcome {
  SHOWN
  ACCEPTED
  EDITED
  REJECTED
  DISCARDED
}

// ---------- Tenancy and access ----------

model Organisation {
  id                String    @id @default(uuid()) @db.Uuid
  name              String
  slug              String    @unique
  dataRegion        String // "uk" or "eu" (A5)
  retentionYears    Int       @default(7) // A8
  reportTemplateKey String    @default("standard-daily-v1") // A11
  timeZone          String    @default("Europe/London")
  aiCaptionsEnabled Boolean   @default(false) // Part B rule 1: off by default, admin switches on
  aiSummaryEnabled  Boolean   @default(false)
  aiSearchEnabled   Boolean   @default(false)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  createdById       String?   @db.Uuid // no FK: the organisation exists before its first user
  deletedAt         DateTime?
  version           Int       @default(1)

  users           User[]
  sessions        Session[]
  subscription    Subscription?
  payments        Payment[]
  paymentAttempts PaymentAttempt[]
  emailTokens     EmailToken[]
  memberships     Membership[]
  siteAssignments SiteAssignment[]
  projects        Project[]
  sites           Site[]
  pickListOptions PickListOption[]
  visits          Visit[]
  entries         Entry[]
  entryVersions   EntryVersion[]
  photos          Photo[]
  reports         Report[]
  reportRevisions ReportRevision[]
  reportEntries   ReportEntry[]
  reviews         Review[]
  reportExports   ReportExport[]
  aiSuggestions   AiSuggestion[]
  entryEmbeddings EntryEmbedding[]
  syncBatches     SyncBatch[]
  syncOperations  SyncOperation[]
  auditEvents     AuditEvent[]
}

model User {
  id             String     @id @default(uuid()) @db.Uuid
  organisationId String     @db.Uuid
  email          String     @unique
  name           String
  shortCode      String // 2 to 6 characters, set by the admin at invite; used in report references
  passwordHash   String? // argon2id; null until the invite is accepted
  status         UserStatus @default(INVITED)
  isOrgAdmin     Boolean    @default(false)
  lastSignInAt   DateTime?
  emailVerifiedAt DateTime? // set by the 6-digit code or by accepting an invite (FR-62)
  failedSignIns  Int        @default(0)
  lockedUntil    DateTime?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  createdById    String?    @db.Uuid
  deletedAt      DateTime?
  version        Int        @default(1)

  organisation Organisation @relation(fields: [organisationId], references: [id])
  createdBy    User?        @relation("UserCreatedBy", fields: [createdById], references: [id])
  usersCreated User[]       @relation("UserCreatedBy")

  sessions               Session[]        @relation("SessionUser")
  emailTokens            EmailToken[]     @relation("EmailTokenUser")
  subscriptionsCreated   Subscription[]   @relation("SubscriptionCreatedBy")
  paymentAttemptsCreated PaymentAttempt[] @relation("PaymentAttemptCreatedBy")
  memberships            Membership[]     @relation("MembershipUser")
  membershipsCreated     Membership[]     @relation("MembershipCreatedBy")
  siteAssignmentsCreated SiteAssignment[] @relation("SiteAssignmentCreatedBy")
  projectsCreated        Project[]        @relation("ProjectCreatedBy")
  sitesCreated           Site[]           @relation("SiteCreatedBy")
  pickListOptionsCreated PickListOption[] @relation("PickListOptionCreatedBy")
  visitsCreated          Visit[]          @relation("VisitCreatedBy")
  entriesCreated         Entry[]          @relation("EntryCreatedBy")
  entriesDeleted         Entry[]          @relation("EntryDeletedBy")
  entryVersionsCreated   EntryVersion[]   @relation("EntryVersionCreatedBy")
  photosCreated          Photo[]          @relation("PhotoCreatedBy")
  reportsCreated         Report[]         @relation("ReportCreatedBy")
  reportRevisionsCreated ReportRevision[] @relation("ReportRevisionCreatedBy")
  reportEntriesCreated   ReportEntry[]    @relation("ReportEntryCreatedBy")
  aiSuggestionsDecided   AiSuggestion[]   @relation("AiSuggestionDecidedBy")
  reviewsCreated         Review[]         @relation("ReviewCreatedBy")
  reportExportsCreated   ReportExport[]   @relation("ReportExportCreatedBy")
  syncBatchesCreated     SyncBatch[]      @relation("SyncBatchCreatedBy")
  syncOperationsCreated  SyncOperation[]  @relation("SyncOperationCreatedBy")
  auditEvents            AuditEvent[]     @relation("AuditEventActor")

  @@unique([organisationId, shortCode])
  @@index([organisationId, status])
}

// Auth.js database session (see section 7, Auth and roles).
model Session {
  id             String    @id @default(uuid()) @db.Uuid
  organisationId String    @db.Uuid
  sessionToken   String    @unique // stored as SHA-256 of the cookie value
  userId         String    @db.Uuid
  expires        DateTime
  deviceId       String? // client-generated, ties a session to a SyncBatch stream
  userAgent      String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  createdById    String?   @db.Uuid
  revokedAt      DateTime?

  organisation Organisation @relation(fields: [organisationId], references: [id])
  user         User         @relation("SessionUser", fields: [userId], references: [id], onDelete: Cascade)

  @@index([organisationId, userId])
}

// One row per user per project role. Org admins use User.isOrgAdmin.
// The app blocks one user holding SUPERVISOR and REVIEWER or BACKUP_REVIEWER on the same project (FR-52).
model Membership {
  id             String    @id @default(uuid()) @db.Uuid
  organisationId String    @db.Uuid
  userId         String    @db.Uuid
  projectId      String    @db.Uuid
  role           Role
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  createdById    String    @db.Uuid
  deletedAt      DateTime?
  version        Int       @default(1)

  organisation    Organisation     @relation(fields: [organisationId], references: [id])
  user            User             @relation("MembershipUser", fields: [userId], references: [id])
  project         Project          @relation(fields: [projectId], references: [id])
  createdBy       User             @relation("MembershipCreatedBy", fields: [createdById], references: [id])
  siteAssignments SiteAssignment[]

  @@unique([userId, projectId, role])
  @@index([organisationId, projectId, role])
}

// Which sites a supervisor membership can see (A1, A2).
model SiteAssignment {
  id             String    @id @default(uuid()) @db.Uuid
  organisationId String    @db.Uuid
  membershipId   String    @db.Uuid
  siteId         String    @db.Uuid
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  createdById    String    @db.Uuid
  deletedAt      DateTime?

  organisation Organisation @relation(fields: [organisationId], references: [id])
  membership   Membership   @relation(fields: [membershipId], references: [id])
  site         Site         @relation(fields: [siteId], references: [id])
  createdBy    User         @relation("SiteAssignmentCreatedBy", fields: [createdById], references: [id])

  @@unique([membershipId, siteId])
  @@index([organisationId, siteId])
}

// ---------- Projects, sites and pick-lists ----------

model Project {
  id             String    @id @default(uuid()) @db.Uuid
  organisationId String    @db.Uuid
  code           String // e.g. "RMD-2026-014"
  name           String
  clientName     String?
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  createdById    String    @db.Uuid
  deletedAt      DateTime?
  version        Int       @default(1)

  organisation Organisation @relation(fields: [organisationId], references: [id])
  createdBy    User         @relation("ProjectCreatedBy", fields: [createdById], references: [id])
  memberships  Membership[]
  sites        Site[]
  visits       Visit[]
  entries      Entry[]
  reports      Report[]

  @@unique([organisationId, code])
  @@index([organisationId, isActive])
}

model Site {
  id             String    @id @default(uuid()) @db.Uuid
  organisationId String    @db.Uuid
  projectId      String    @db.Uuid
  code           String // e.g. "SITE-03"
  name           String
  timeZone       String    @default("Europe/London") // defines the Visit date
  centreLat      Decimal?  @db.Decimal(9, 6)
  centreLng      Decimal?  @db.Decimal(9, 6)
  radiusMetres   Int?
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  createdById    String    @db.Uuid
  deletedAt      DateTime?
  version        Int       @default(1)

  organisation    Organisation     @relation(fields: [organisationId], references: [id])
  project         Project          @relation(fields: [projectId], references: [id])
  createdBy       User             @relation("SiteCreatedBy", fields: [createdById], references: [id])
  siteAssignments SiteAssignment[]
  visits          Visit[]
  entries         Entry[]
  reports         Report[]

  @@unique([projectId, code])
  @@index([organisationId, projectId])
}

model PickListOption {
  id             String       @id @default(uuid()) @db.Uuid
  organisationId String       @db.Uuid
  kind           PickListKind
  label          String // e.g. "Excavation", "Completed", "m3"
  sortOrder      Int          @default(0)
  isIssue        Boolean      @default(false) // WORK_STATUS values that put an entry in "Issues and observations"
  isActive       Boolean      @default(true)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  createdById    String       @db.Uuid
  deletedAt      DateTime?
  version        Int          @default(1)

  organisation       Organisation     @relation(fields: [organisationId], references: [id])
  createdBy          User             @relation("PickListOptionCreatedBy", fields: [createdById], references: [id])
  activityVersions   EntryVersion[]   @relation("EntryVersionActivity")
  workStatusVersions EntryVersion[]   @relation("EntryVersionWorkStatus")
  unitVersions       EntryVersion[]   @relation("EntryVersionUnit")
  weatherReports     ReportRevision[]

  @@unique([organisationId, kind, label])
  @@index([organisationId, kind, isActive])
}

// ---------- Capture ----------

// One supervisor, one site, one local date in the site's time zone.
model Visit {
  id             String    @id @default(uuid()) @db.Uuid
  organisationId String    @db.Uuid
  projectId      String    @db.Uuid
  siteId         String    @db.Uuid
  visitDate      DateTime  @db.Date
  firstEntryAt   DateTime? // occurredAt of the first entry
  lastEntryAt    DateTime? // occurredAt of the last entry: the north-star start event for A16
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  createdById    String    @db.Uuid // the supervisor
  deletedAt      DateTime?
  version        Int       @default(1)

  organisation Organisation @relation(fields: [organisationId], references: [id])
  project      Project      @relation(fields: [projectId], references: [id])
  site         Site         @relation(fields: [siteId], references: [id])
  createdBy    User         @relation("VisitCreatedBy", fields: [createdById], references: [id])
  entries      Entry[]
  report       Report?

  @@unique([siteId, createdById, visitDate])
  @@index([organisationId, projectId, siteId, visitDate])
}

model Entry {
  id                 String         @id @db.Uuid // client-generated UUID, idempotency key (A12)
  organisationId     String         @db.Uuid
  projectId          String         @db.Uuid
  siteId             String         @db.Uuid
  visitId            String         @db.Uuid
  syncBatchId        String?        @db.Uuid
  deviceCapturedAt   DateTime // device clock at capture (A14)
  occurredAt         DateTime // EXIF time for gallery entries, else corrected save time; sets Visit and order (FR-11a)
  occurredAtFromExif Boolean        @default(false)
  deviceId           String // client-generated device id
  deviceSeq          Int // gap-free counter per device (FR-24)
  clockOffsetSec     Int            @default(0) // server minus device clock at sync
  correctedAt        DateTime // deviceCapturedAt + clockOffsetSec
  serverReceivedAt   DateTime       @default(now())
  clockFlagged       Boolean        @default(false) // abs(offset) > 600 s (A14)
  lat                Decimal?       @db.Decimal(9, 6)
  lng                Decimal?       @db.Decimal(9, 6)
  accuracyMetres     Int?
  locationSource     LocationSource @default(NONE)
  locationFlagged    Boolean        @default(true) // set with locationSource: true for NONE or outside site (A13)
  outsideSite        Boolean        @default(false) // location more than site radius + 500 m (FR-12)
  addedLate          Boolean        @default(false) // saved more than 2 hours after occurredAt (FR-11a)
  currentVersionNo   Int            @default(1)
  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt
  createdById        String         @db.Uuid
  deletedAt          DateTime?
  deletedById        String?        @db.Uuid
  version            Int            @default(1)

  organisation Organisation    @relation(fields: [organisationId], references: [id])
  project      Project         @relation(fields: [projectId], references: [id])
  site         Site            @relation(fields: [siteId], references: [id])
  visit        Visit           @relation(fields: [visitId], references: [id])
  syncBatch    SyncBatch?      @relation(fields: [syncBatchId], references: [id])
  createdBy    User            @relation("EntryCreatedBy", fields: [createdById], references: [id])
  deletedBy    User?           @relation("EntryDeletedBy", fields: [deletedById], references: [id])
  versions     EntryVersion[]
  photos       Photo[]
  operations   SyncOperation[]

  @@unique([deviceId, deviceSeq])
  @@index([organisationId, projectId, siteId, correctedAt])
  @@index([organisationId, createdById, correctedAt])
  @@index([visitId])
}

// Immutable content of an entry. A change writes a new row (A10).
model EntryVersion {
  id             String   @id @default(uuid()) @db.Uuid
  organisationId String   @db.Uuid
  entryId        String   @db.Uuid
  versionNo      Int
  activityTypeId String   @db.Uuid
  workStatusId   String   @db.Uuid
  quantity       Decimal? @db.Decimal(12, 3)
  unitId         String?  @db.Uuid
  noteText       String?  @db.VarChar(500)
  changeReason   String?  @db.VarChar(200) // required from versionNo 2
  createdAt      DateTime @default(now())
  createdById    String   @db.Uuid

  organisation  Organisation     @relation(fields: [organisationId], references: [id])
  entry         Entry            @relation(fields: [entryId], references: [id])
  activityType  PickListOption   @relation("EntryVersionActivity", fields: [activityTypeId], references: [id])
  workStatus    PickListOption   @relation("EntryVersionWorkStatus", fields: [workStatusId], references: [id])
  unit          PickListOption?  @relation("EntryVersionUnit", fields: [unitId], references: [id])
  createdBy     User             @relation("EntryVersionCreatedBy", fields: [createdById], references: [id])
  reportEntries ReportEntry[]
  embeddings    EntryEmbedding[]

  @@unique([entryId, versionNo])
  @@index([organisationId, entryId])
}

model Photo {
  id               String      @id @db.Uuid // client-generated UUID
  organisationId   String      @db.Uuid
  entryId          String      @db.Uuid
  syncBatchId      String?     @db.Uuid
  source           PhotoSource
  storageKey       String      @unique // org/{orgId}/photos/{yyyy}/{mm}/{photoId}.jpg
  thumbnailKey     String?
  sha256           String      @db.Char(64) // of the compressed file, computed on device
  byteSize         Int
  widthPx          Int
  heightPx         Int
  mimeType         String      @default("image/jpeg")
  exifTakenAt      DateTime? // read from the original before compression (A9)
  exifLat          Decimal?    @db.Decimal(9, 6)
  exifLng          Decimal?    @db.Decimal(9, 6)
  originalByteSize Int?
  status           PhotoStatus @default(PENDING_UPLOAD)
  verifiedAt       DateTime?
  failureReason    String?
  removedReason    String?     @db.VarChar(200) // set when the supervisor removes a failed photo (FR-32)
  sortOrder        Int         @default(0)
  caption          String?     @db.VarChar(120) // accepted or typed caption
  aiAssisted       Boolean     @default(false) // true only when an AI caption was accepted (with or without edit)
  aiModelId        String?     @db.VarChar(100)
  aiPromptVersion  String?     @db.VarChar(40)
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
  createdById      String      @db.Uuid
  deletedAt        DateTime?
  version          Int         @default(1)

  organisation  Organisation   @relation(fields: [organisationId], references: [id])
  entry         Entry          @relation(fields: [entryId], references: [id])
  syncBatch     SyncBatch?     @relation(fields: [syncBatchId], references: [id])
  createdBy     User           @relation("PhotoCreatedBy", fields: [createdById], references: [id])
  aiSuggestions AiSuggestion[]

  @@index([organisationId, entryId])
  @@index([organisationId, status])
}

// ---------- Reports and review ----------

// One report per Visit. Content lives in revisions.
model Report {
  id                 String       @id @default(uuid()) @db.Uuid
  organisationId     String       @db.Uuid
  projectId          String       @db.Uuid
  siteId             String       @db.Uuid
  visitId            String       @unique @db.Uuid
  reportDate         DateTime     @db.Date
  reference          String // project code / site code / date / supervisor shortCode, e.g. "RMD-2026-014/SITE-03/2026-11-12/JS"
  status             ReportStatus @default(DRAFT)
  currentRevisionNo  Int          @default(1)
  approvedRevisionNo Int? // the latest approved, locked revision
  submittedAt        DateTime? // latest submission
  approvedAt         DateTime?
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt
  createdById        String       @db.Uuid // the supervisor
  deletedAt          DateTime?
  version            Int          @default(1) // checked on every write (A12)

  organisation Organisation     @relation(fields: [organisationId], references: [id])
  project      Project          @relation(fields: [projectId], references: [id])
  site         Site             @relation(fields: [siteId], references: [id])
  visit        Visit            @relation(fields: [visitId], references: [id])
  createdBy    User             @relation("ReportCreatedBy", fields: [createdById], references: [id])
  revisions    ReportRevision[]

  @@unique([organisationId, reference])
  @@index([organisationId, projectId, siteId, reportDate])
  @@index([organisationId, status, submittedAt])
}

// A revision is editable until submittedAt is set, then frozen.
model ReportRevision {
  id              String    @id @default(uuid()) @db.Uuid
  organisationId  String    @db.Uuid
  reportId        String    @db.Uuid
  revisionNo      Int
  summaryText     String?   @db.VarChar(2000)
  aiAssisted      Boolean   @default(false) // summary came from an accepted AI suggestion
  aiModelId       String?   @db.VarChar(100)
  aiPromptVersion String?   @db.VarChar(40)
  aiSourceMap     Json? // [{ sentence, entryVersionIds[] }] for the accepted summary
  weatherId       String?   @db.Uuid
  minutesSpent    Int? // optional self-reported minutes on this report (FR-32a)
  submittedAt     DateTime?
  snapshot        Json? // full rendered content frozen at submission
  contentSha256   String?   @db.Char(64) // of snapshot, printed on exports
  isLocked        Boolean   @default(false) // true once approved
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  createdById     String    @db.Uuid
  deletedAt       DateTime?
  version         Int       @default(1)

  organisation  Organisation    @relation(fields: [organisationId], references: [id])
  report        Report          @relation(fields: [reportId], references: [id])
  weather       PickListOption? @relation(fields: [weatherId], references: [id])
  createdBy     User            @relation("ReportRevisionCreatedBy", fields: [createdById], references: [id])
  entries       ReportEntry[]
  reviews       Review[]
  exports       ReportExport[]
  aiSuggestions AiSuggestion[]

  @@unique([reportId, revisionNo])
  @@index([organisationId, reportId])
}

// Links a revision to the exact EntryVersion it shows.
model ReportEntry {
  id               String    @id @default(uuid()) @db.Uuid
  organisationId   String    @db.Uuid
  reportRevisionId String    @db.Uuid
  entryVersionId   String    @db.Uuid
  position         Int
  included         Boolean   @default(true)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  createdById      String    @db.Uuid
  deletedAt        DateTime?

  organisation   Organisation   @relation(fields: [organisationId], references: [id])
  reportRevision ReportRevision @relation(fields: [reportRevisionId], references: [id])
  entryVersion   EntryVersion   @relation(fields: [entryVersionId], references: [id])
  createdBy      User           @relation("ReportEntryCreatedBy", fields: [createdById], references: [id])

  @@unique([reportRevisionId, entryVersionId])
  @@index([organisationId, entryVersionId])
}

model Review {
  id               String         @id @default(uuid()) @db.Uuid
  organisationId   String         @db.Uuid
  reportRevisionId String         @db.Uuid
  decision         ReviewDecision
  comment          String?        @db.VarChar(2000) // required for CHANGES_REQUESTED
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  createdById      String         @db.Uuid // the reviewer; never the report author (FR-40)
  deletedAt        DateTime?

  organisation   Organisation   @relation(fields: [organisationId], references: [id])
  reportRevision ReportRevision @relation(fields: [reportRevisionId], references: [id])
  createdBy      User           @relation("ReviewCreatedBy", fields: [createdById], references: [id])

  @@unique([reportRevisionId]) // one decision per submitted revision
  @@index([organisationId, createdById, createdAt])
}

model ReportExport {
  id               String       @id @default(uuid()) @db.Uuid
  organisationId   String       @db.Uuid
  reportRevisionId String       @db.Uuid
  format           ExportFormat
  status           ExportStatus @default(QUEUED)
  storageKey       String?
  sha256           String?      @db.Char(64)
  byteSize         Int?
  jobId            String? // pg-boss job id
  failureReason    String?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt
  createdById      String       @db.Uuid
  deletedAt        DateTime?

  organisation   Organisation   @relation(fields: [organisationId], references: [id])
  reportRevision ReportRevision @relation(fields: [reportRevisionId], references: [id])
  createdBy      User           @relation("ReportExportCreatedBy", fields: [createdById], references: [id])

  @@unique([reportRevisionId, format])
  @@index([organisationId, status])
}

// ---------- Sync and audit ----------

model SyncBatch {
  id               String          @id @db.Uuid // client-generated, makes retries idempotent
  organisationId   String          @db.Uuid
  deviceId         String
  clientAppVersion String
  deviceClockAt    DateTime // device clock when the batch was sent
  serverClockAt    DateTime        @default(now())
  clockOffsetSec   Int // serverClockAt minus deviceClockAt
  status           SyncBatchStatus @default(RECEIVED)
  entryCount       Int             @default(0)
  photoCount       Int             @default(0)
  rejectedCount    Int             @default(0)
  errorDetail      Json?
  completedAt      DateTime?
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
  createdById      String          @db.Uuid
  deletedAt        DateTime?

  organisation Organisation    @relation(fields: [organisationId], references: [id])
  createdBy    User            @relation("SyncBatchCreatedBy", fields: [createdById], references: [id])
  entries      Entry[]
  photos       Photo[]
  operations   SyncOperation[]

  @@index([organisationId, createdById, createdAt])
  @@index([organisationId, status])
}

// One row per operation received, so repeated operations are detected (FR-24).
model SyncOperation {
  id             String              @id @db.Uuid // client-generated operation UUID
  organisationId String              @db.Uuid
  syncBatchId    String              @db.Uuid
  type           SyncOperationType
  entryId        String?             @db.Uuid
  photoId        String?             @db.Uuid
  result         SyncOperationResult
  rejectReason   String? // e.g. "wrong user", "revision frozen"
  appliedAt      DateTime            @default(now())
  createdAt      DateTime            @default(now())
  createdById    String              @db.Uuid

  organisation Organisation @relation(fields: [organisationId], references: [id])
  syncBatch    SyncBatch    @relation(fields: [syncBatchId], references: [id])
  entry        Entry?       @relation(fields: [entryId], references: [id])
  createdBy    User         @relation("SyncOperationCreatedBy", fields: [createdById], references: [id])

  @@index([organisationId, syncBatchId])
  @@index([organisationId, entryId])
}

// Append-only. No update or delete grants for the app role.
model AuditEvent {
  id             String      @id @default(uuid()) @db.Uuid
  organisationId String      @db.Uuid
  action         AuditAction
  entityType     String // "Entry", "Report", "User", ...
  entityId       String      @db.Uuid
  before         Json?
  after          Json?
  ipAddress      String?
  requestId      String?
  createdAt      DateTime    @default(now())
  createdById    String?     @db.Uuid // null for system jobs

  organisation Organisation @relation(fields: [organisationId], references: [id])
  createdBy    User?        @relation("AuditEventActor", fields: [createdById], references: [id])

  @@index([organisationId, entityType, entityId, createdAt])
  @@index([organisationId, createdById, createdAt])
}

// ---------- V2 AI (Part B; flags off until the accuracy gate passes) ----------

// Every suggestion shown, so the monthly sample and acceptance rate (Part B) can be measured.
model AiSuggestion {
  id               String              @id @default(uuid()) @db.Uuid
  organisationId   String              @db.Uuid
  feature          AiFeature
  photoId          String?             @db.Uuid // set for PHOTO_CAPTION
  reportRevisionId String?             @db.Uuid // set for REPORT_SUMMARY
  modelId          String              @db.VarChar(100)
  promptVersion    String              @db.VarChar(40)
  suggestedText    String              @db.VarChar(2000)
  sourceMap        Json? // summary only: sentence to entryVersionIds
  outcome          AiSuggestionOutcome @default(SHOWN)
  finalText        String?             @db.VarChar(2000) // what the person saved, if accepted or edited
  decidedById      String?             @db.Uuid
  decidedAt        DateTime?
  inputTokens      Int?
  outputTokens     Int?
  costMicroGbp     Int? // cost in millionths of a pound, for the 0.05 GBP gate
  latencyMs        Int?
  createdAt        DateTime            @default(now())

  organisation   Organisation    @relation(fields: [organisationId], references: [id])
  photo          Photo?          @relation(fields: [photoId], references: [id])
  reportRevision ReportRevision? @relation(fields: [reportRevisionId], references: [id])
  decidedBy      User?           @relation("AiSuggestionDecidedBy", fields: [decidedById], references: [id])

  @@index([organisationId, feature, createdAt])
  @@index([photoId])
  @@index([reportRevisionId])
}

// One vector per EntryVersion per embedding model. Kept out of EntryVersion so
// Prisma reads of core tables never touch the Unsupported column, and so a model
// change is a new row set, not an ALTER of a core table.
model EntryEmbedding {
  id             String                     @id @default(uuid()) @db.Uuid
  organisationId String                     @db.Uuid
  entryVersionId String                     @db.Uuid
  modelId        String                     @db.VarChar(100) // e.g. "gemini-embedding-001@768"
  contentSha256  String                     @db.Char(64) // of the exact text embedded; skip re-embed if unchanged
  embedding      Unsupported("vector(768)")
  createdAt      DateTime                   @default(now())

  organisation Organisation @relation(fields: [organisationId], references: [id])
  entryVersion EntryVersion @relation(fields: [entryVersionId], references: [id], onDelete: Cascade)
  // HNSW index is created in raw SQL in the migration (Prisma 5 cannot declare it).

  @@unique([entryVersionId, modelId])
  @@index([organisationId, modelId])
}

// ---------- Billing and account additions [v2.3, Q34] ----------

enum SubscriptionStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  EXPIRED
  CANCELLED
}

enum PaymentAttemptStatus {
  INITIATED
  PENDING
  SUCCEEDED
  FAILED
  ABANDONED
}

enum EmailTokenPurpose {
  VERIFY_EMAIL
  RESET_PASSWORD
  INVITE
}

// One per organisation. currentPeriodEnd is when it expires (FR-63).
model Subscription {
  id                 String             @id @default(uuid()) @db.Uuid
  organisationId     String             @unique @db.Uuid
  status             SubscriptionStatus
  seatCount          Int // active supervisors paid for (PRD 8)
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  graceEndsAt        DateTime?
  provider           String // payment provider key, e.g. "flutterwave"
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt
  createdById        String?            @db.Uuid
  version            Int                @default(1)

  organisation Organisation     @relation(fields: [organisationId], references: [id])
  createdBy    User?            @relation("SubscriptionCreatedBy", fields: [createdById], references: [id])
  payments     Payment[]
  attempts     PaymentAttempt[]

  @@index([status, currentPeriodEnd])
}

// Money that really arrived. Append-only: no updatedAt, no deletedAt (FR-64).
model Payment {
  id                String   @id @default(uuid()) @db.Uuid
  organisationId    String   @db.Uuid
  subscriptionId    String   @db.Uuid
  attemptId         String   @unique @db.Uuid
  amountMinor       Int // minor units (pence, kobo), never a float
  currency          String // ISO 4217
  providerReference String   @unique // a repeated webhook cannot pay twice
  periodStart       DateTime
  periodEnd         DateTime
  paidAt            DateTime
  createdAt         DateTime @default(now())

  organisation Organisation   @relation(fields: [organisationId], references: [id])
  subscription Subscription   @relation(fields: [subscriptionId], references: [id])
  attempt      PaymentAttempt @relation(fields: [attemptId], references: [id])

  @@index([organisationId, paidAt])
}

// Every payment try, written before the redirect to the provider (FR-64).
model PaymentAttempt {
  id                String               @id @default(uuid()) @db.Uuid
  organisationId    String               @db.Uuid
  subscriptionId    String               @db.Uuid
  createdById       String               @db.Uuid
  txRef             String               @unique // our reference, sent to the provider
  amountMinor       Int
  currency          String
  seatCount         Int
  status            PaymentAttemptStatus @default(INITIATED)
  failureReason     String? // provider code or message, never card data
  providerReference String?
  startedAt         DateTime             @default(now())
  lastEventAt       DateTime?
  version           Int                  @default(1)

  organisation Organisation @relation(fields: [organisationId], references: [id])
  subscription Subscription @relation(fields: [subscriptionId], references: [id])
  createdBy    User         @relation("PaymentAttemptCreatedBy", fields: [createdById], references: [id])
  payment      Payment?

  @@index([status, startedAt])
  @@index([organisationId, startedAt])
}

// Email verification codes, reset links and invite links. Only the SHA-256 is stored.
model EmailToken {
  id             String            @id @default(uuid()) @db.Uuid
  organisationId String            @db.Uuid
  userId         String            @db.Uuid
  purpose        EmailTokenPurpose
  tokenHash      String            @unique
  expiresAt      DateTime
  attempts       Int               @default(0)
  usedAt         DateTime?
  createdAt      DateTime          @default(now())

  organisation Organisation @relation(fields: [organisationId], references: [id])
  user         User         @relation("EmailTokenUser", fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, purpose])
}

// Rate-limit counts in PostgreSQL so they survive a restart (decision 8). Not tenant data.
model RateLimitCounter {
  key        String   @id // e.g. "sign-in:account:<userId>" or "sign-up:ip:<sha256 of ip>"
  count      Int
  windowEnds DateTime

  @@index([windowEnds])
}
```

### 10.1 Notes on each model

| Model | Note |
|---|---|
| Organisation | Tenant root. Holds data region, retention (default 7 years) and report template key (A3, A5, A8, A11). |
| User | One organisation per user. isOrgAdmin marks the admin (A2). Lockout fields support FR-07. shortCode (admin-set, unique per organisation) goes into report references so two supervisors with the same initials never collide. |
| Session | Auth.js database session. Stores a hash of the cookie token and the deviceId. |
| Membership | A user's role on one project: Supervisor, Reviewer or Backup reviewer. The app enforces exactly one active Reviewer per project, at most one Backup reviewer, and no user holding Supervisor and a review role on the same project (A1, FR-52). |
| SiteAssignment | Which sites a supervisor membership can see (FR-02). |
| Project | A client job, unique code per organisation. |
| Site | A location within a project. timeZone sets the Visit date. Centre and radius set the default map pin. |
| PickListOption | Activity types, work statuses, units and weather. isIssue routes entries to "Issues and observations". |
| Visit | One supervisor at one site on one local date. lastEntryAt is the occurredAt of the last entry, the start event for the main metric (A16, NA9). |
| Entry | A capture event. Client UUID makes sync idempotent. Holds occurredAt (sets Visit and order), location source, clock offset, deviceId and deviceSeq (gap detection), and the flags for no location, outside site, clock and added-late (A12, A13, A14). Soft delete with deletedById, set by a DELETE_ENTRY operation. |
| EntryVersion | Immutable content of an entry. Any change adds a version with a reason (A10). No update or delete columns. |
| Photo | One compressed image. EXIF time and location read before compression, SHA-256 from the device, status through verification (A9). |
| Report | One per Visit. Holds status, current revision, latest approved revision and the version used for conflict checks (A12). |
| ReportRevision | A frozen snapshot after submission, with its checksum. isLocked once approved (A10). |
| ReportEntry | Links a revision to the exact EntryVersion it shows, with order and include flag. |
| Review | One decision per submitted revision. The app blocks self-review (FR-40). |
| ReportExport | PDF or Word file for an approved revision, built by a job. |
| SyncBatch | One upload batch from a device. Stores the clock offset and per-batch counts. |
| SyncOperation | One row per operation received: create entry, add version, delete entry, add photo, remove photo. Detects repeats and records rejections (FR-24). |
| AuditEvent | Append-only log of every significant action, with before and after values. No update columns. |

## 11. Success metrics

### 11.1 North-star metric

**Median time from the supervisor's last site photo of the day to the report being submitted** (A16). The start and end events are the same in baseline and pilot. In the pilot the start is occurredAt of the last entry in the Visit and the end is the first submission time [NEW ASSUMPTION] (NA9). **Co-primary: median minutes of supervisor reporting effort per daily report**, self-reported with the same question in both periods [NEW ASSUMPTION] (NA22). [v2.1]

### 11.2 Baseline method

In the baseline week, before any supervisor sees FieldLog, each pilot supervisor logs, for each daily report, the time of their last site photo (read from the phone gallery), the time the report was sent, and the minutes they spent on the report. Rox collects the log daily. [v2.1] The baseline is the median across all baseline reports [NEW ASSUMPTION] (NA9). The baseline is the median across all baseline reports for each measure. The pilot starts only with at least 5 baseline reports per supervisor (RK-08).

### 11.3 Leading metrics (weekly)

| Metric | Target | Source |
|---|---|---|
| Entries with automatic location (browser or EXIF) | 95% or more [NEW ASSUMPTION] (NA10) | A13 |
| Sync success rate per batch | 99% or more | A12 |
| Reports submitted with no blocking items on first try | 80% or more [NEW ASSUMPTION] (NA10) | R1 |
| Entries flagged for clock difference | Under 2% [NEW ASSUMPTION] (NA10) | A14 |
| Median submitted-to-decision time | 1 working day or less (NA10) | R1 |

### 11.4 Lagging metrics (end of pilot)

| Metric | Target | Source |
|---|---|---|
| North-star: median last site photo to submitted | 50% shorter than baseline | A16 |
| Co-primary: median reporting effort per daily report (minutes) | 50% lower than baseline | A16, NA22 |
| Dual-running: reports also sent by the old method in week 6 | 20% or less (NA10) | A17 |
| Lost entries and checksum failures | 0 | A6, A9 |
| First-pass approval rate | Reported, no target in V1 | R1 |
| Supervisor and reviewer interview findings | 5 supervisors and 2 reviewers interviewed in week 6 | A1 |

### 11.5 Reading the metrics under the pilot mandate

Management requires FieldLog for daily reports in the pilot (A17). Sign-ins, entries and reports per user therefore measure compliance, not value, and are not used for the go/no-go decision. Value is judged on three signals only: the north-star time saving, the dual-running rate, and data integrity (A17). A falling dual-running rate across the six weeks is a stronger sign of value than any usage count.

## 12. Assumptions

### 12.1 Decided assumptions (decided by Rox, not yet validated)

| ID | Assumption | Risk if wrong | Validated by and when |
|---|---|---|---|
| A1 | Primary user is the field supervisor. One reviewer per project, usually the project manager. Reviewer not yet researched. | The review flow may not match real approvals. | Not yet |
| A2 | An organisation admin sets up projects, sites and users. | Setup stalls if no one owns it. | Not yet |
| A3 | One organisation for the pilot. Every table carries organisationId. | Low; multi-tenant work moves earlier. | Not yet |
| A4 | Two full-stack developers, one part-time designer, Rox as PM. One of the two developers is named tech lead before Phase 1. | Timeline and cut line change. | Not yet |
| A5 | One managed host, all data in one UK or EU region. | Hosting choice and contracts change. | Not yet |
| A6 | Offline up to 14 days. Session expiry never deletes unsynced data. Sign-out blocked unless confirmed. | Longer periods need stronger device storage guarantees. | Not yet |
| A7 | Latest two versions of Chrome, Safari, Edge, Firefox. Low-end Android and slow 3G. | Older devices fail. | Not yet |
| A8 | Organisation owns data and sets retention. Default 7 years. | Legal requirements may differ. | Not yet |
| A9 | Photos in S3-compatible storage at about 400 KB. Location and time read before compression. | Some uses may need full-resolution originals. | Not yet |
| A10 | Entries immutable after submission; changes create versions with audit events; soft deletes. | Users may expect free editing. | Not yet |
| A11 | Standard daily site report unless the organisation supplies one. | Template rework before the pilot. | Not yet |
| A12 | Entries add-only per user. Server wins on project and site data. Report edits use version checks. | Shared editing would need a different model. | Not yet |
| A13 | Location is resolved per photo source. CAMERA: browser, EXIF, map pin, flag. GALLERY: EXIF, map pin, browser only if the user confirms they are there now, flag. | Accuracy is lower than expected. | Not yet |
| A14 | Store device and server time. Flag differences over 10 minutes. | Flags are noisy. | Not yet |
| A15 | Buyer is the employer. Fee per active supervisor per month. Pilot tests value only. | Pricing is unknown after the pilot. | Not yet |
| A16 | Main metric: median time from the supervisor's last site photo of the day to submitted report, with reporting effort as co-primary (NA22). Baseline in the week before the pilot. Target 50% shorter on both. | The baseline is unreliable. | Not yet |
| A17 | Management mandates FieldLog in the pilot. Value judged on time saved, dual-running and integrity. | Usage looks better than real value. | Not yet |
| A18 | AI report summaries (FR-58) and semantic search (FR-59) are V1 Shoulds, off by default and dropped first if the build slips. Photo captions and other AI remain V2. A person accepts every suggestion, and the gates in NA17 and NA24 apply. | AI quality or privacy fails; the features are cut. | Not yet |

### 12.2 New assumptions

| ID | New assumption | Where used | Risk if wrong |
|---|---|---|---|
| NA1 | Pilot scale: up to 10 supervisors, 2 reviewers, 1 admin, 1 or 2 sites. | 8, 9 | Cost and load estimates change. |
| NA2 | Auth.js runs with a custom adapter that hashes session tokens with SHA-256 on every read and write and sets organisationId from the user. It is proven in Phase 1 week 1; if not working by the end of week 1, Auth.js is replaced with a first-party session module on the same Session table. Sessions last 30 days, sliding. | FR-01, 7.4 | Extra auth work, or a forced move to JWT sessions. |
| NA3 | Passwords use argon2id. Reset links last 60 minutes, invite links 7 days. Lockout after 10 failures for 15 minutes. | FR-06, FR-07, FR-52, 7.4 | Weaker security or support load. |
| NA4 | The 10-minute clock check compares device clock with server clock at sync, not capture time with receive time, because offline entries always arrive late. | FR-13, 7.3 | Every offline entry is flagged, or real clock errors are missed. |
| NA5 | On iOS, FieldLog blocks offline capture until it is installed to the home screen (FR-27), because Safari can clear storage for non-installed sites after 7 days without use. | FR-27, 7.3 | Data loss on iOS (RK-02). |
| NA6 | Compression runs on the device, to 1,600 px long edge and 450 KB or less. The original is not uploaded. | P5 | Originals are needed for evidence disputes. |
| NA7 | Library choices: exifr, browser canvas, sharp, @react-pdf/renderer, docx, Zod. | P2, P10, P14, 7.7 | Swap a library; small rework. |
| NA8 | Limits: 10 photos per entry, 500 characters per note, 2,000 characters per summary. | FR-14, FR-15, FR-31 | Limits block real use. |
| NA9 | The start event is the supervisor's last site photo of the day in both periods (occurredAt of the last entry in the pilot, the phone gallery in the baseline log). The end event is the first submission in the pilot and the sent time in the baseline. | 11.1, 11.2 | Supervisors mis-log the baseline, so the baseline and pilot differ. |
| NA10 | Proposed targets: 80% no re-typing, 1 working day to decision, 20% dual-running, 95% automatic location, 80% first-try submissions, under 2% clock flags. | 3.1, 11 | Targets too easy or too hard. |
| NA11 | Hosting costs £50 to £150 per month at pilot scale. | 8 | Budget overrun. |
| NA12 | Entries captured before a user was deactivated are still accepted and flagged. | FR-54 | Legitimate records lost, or unwanted data accepted. |
| NA13 | Synced photos stay on the device 7 days, then are removed when storage is low. | 7.3 | Storage fills on low-end phones. |
| NA14 | A transactional email provider in the same region.  Chosen: Gmail SMTP, for testing only. [v2.3]| FR-43, 7.1 | Notifications fail or data leaves the region. |
| NA15 | A Sentry-compatible error tracking service in the same region. | 7.11 | Errors unseen, or data leaves the region. |
| NA16 | Daily backups kept 35 days, point-in-time recovery for 7 days. | 7.5 | Recovery target missed. |
| NA17 | AI gates: 2% or fewer unsupported summary sentences, 0 changes to a quantity, time or status, £0.05 or less per report. The 85% caption gate applies only if photo captions return in V2. | 6 Part B, NFR-21 | AI released too early or never. |
| NA18 | Withdrawn in v2.1. Retention deletion is not built in V1 (FR-55). | None | None |
| NA19 | A Visit is one supervisor, one site, one local date in the site's time zone. One report per Visit. | FR-29 | Shifts across midnight or shared reports break the model. |
| NA20 | Phase 0 sizing: at least 5 supervisors report minutes per daily report, reports per week and channel. V1 continues only if the median is 30 minutes or more. | 2, 13 | The threshold is too high or too low. |
| NA21 | The pilot organisation supplies the loaded hourly cost of a supervisor and a reviewer in Phase 0. | 8 | The value per supervisor cannot be computed. |
| NA22 | Reporting effort is self-reported minutes, asked as the same question in the baseline log and on submit (FR-32a). | G1, 11 | Self-report is noisy, though its bias is the same in both periods. |
| NA23 | Back-fill thresholds: a save more than 2 hours after the photo time, and a location more than the site radius plus 500 m from the site centre. | G2, FR-11a, FR-12 | Too many or too few entries are flagged. |
| NA24 | FR-58 uses Gemini on the free tier. The tier must meet the no-training, 30-day retention and region rules; if it does not, use a compliant paid Gemini tier or do not ship. Summary length is 150 words or fewer. | FR-58, 6 Part B, 7.7 | Privacy breach, or the feature is cut. |
| NA25 | FR-59 embeds report and entry text only, not image pixels. On a 50-query test set across at least 2 sites: 80% top-3 relevance, 0 cross-tenant results, 1 s p95. | FR-59, 6 Part B, NFR-22 | Search is noisy or leaks data; the feature is cut. |
| NA26 | FR-58 and FR-59 are online-only and are the first Shoulds dropped if the build slips. | FR-58, FR-59, 7.3, 13 | Schedule pressure pushes a Must out. |
| NA28 | Sign-up limit 5 per hour per IP; reset limit 3 per hour per email. | FR-61, FR-06, 7.7 | Spam sign-ups or locked-out real users. [v2.3] |
| NA29 | Code expiry 10 minutes, 3 tries. | FR-62 | Codes guessed, or real users time out. [v2.3] |
| NA30 | Grace period 14 days. Why: a supervisor can be out of signal for up to 14 days, so a lapsed payment must never stop their entries reaching the server | FR-63 | Supervisors cut off, or unpaid use. [v2.3] |
| NA31 | Attempt timeout 10 minutes. | FR-64 | Abandoned payments counted late or too early. [v2.3] |
| NA32 | Retrieval chunk: one entry version is one chunk. | FR-59, 7.13 | Search misses parts of long text. [v2.3] |

## 13. Phased roadmap

Durations assume two full-stack developers and one part-time designer (A4).

| Phase | Duration | Work | Exit criteria |
|---|---|---|---|
| Phase 0 Discovery | 2 weeks, plus an iOS spike lead-in week before it | Interview 5 or more supervisors and 2 reviewers. Size the problem: median minutes per daily report, reports per week and channel with at least 5 supervisors (NA20). Get the pilot organisation's report format (A11). Confirm region and host (A5). Agree device ownership (Q15). DPIA started (Q9). Clickable prototype of capture and review tested with 3 supervisors. iOS 14-day offline spike, started on a test iPhone 1 week before Phase 0 and read in Phase 0 week 2. | Report template agreed. Median current reporting effort is 30 minutes or more per daily report; if lower, Rox re-scopes V1 before Phase 1. Region and host signed off. A pilot agreement is signed naming the sponsor, the 1 or 2 sites, the supervisors and reviewers, device ownership, the mandate for daily reports and the data processing terms. Reviewer flow confirmed or changed by Rox and written into FR-36 to FR-45 before Phase 1 week 1. iOS spike passes or a mitigation is agreed. |
| Phase 1 Build | 10 weeks | Two parallel tracks from week 1. Track A (developer A): auth and custom adapter (week 1), roles, admin, reports, submit, review, PDF export, search. Track B (developer B): local store with per-user rows, client-rendered field screens, capture with per-source location, sync operation log, photo pipeline, weeks 1 to 7. Integration and late-entry handling weeks 6 to 8. Week 9: notifications and Should items, including FR-58 and FR-59 only if Q19 is approved. Week 10: hardening, NFR tests, pilot onboarding. [v2.2] Sign-up, verification, reset and lockout (FR-61, FR-62, FR-06, FR-07) follow the week-1 auth proof; billing (FR-63, FR-64) follows them. [v2.3] | All Musts pass acceptance criteria. NFR-01 to NFR-05 and NFR-12 pass. 14-day offline test passes on Android and iOS. Auth adapter proven by the end of week 1. |
| Baseline week | 1 week, during Phase 1 week 8, before any supervisor sees FieldLog | Pilot supervisors log reports the old way: last site photo time, sent time and minutes spent (11.2). | 5 or more baseline reports per supervisor. |
| Phase 2 Pilot | 6 weeks | One or two sites, mandated use (A17). Weekly metrics review. Fixes every fortnight. Interviews in week 6. | 6 weeks of data. No unresolved data-loss incident. |
| Phase 3 Go/no-go | 1 week | Rox presents the metrics and the value per supervisor per month (section 8) to the pilot organisation. | Go if: north-star and reporting effort are each at least 50% lower than baseline (A16, NA22), 0 lost entries, dual-running 20% or less in week 6 (NA10). Partial go if the weaker of the two measures is 25% to 50% lower: one more 4-week iteration. No-go otherwise. |

**Cut line if the build slips.** Drop in this order and keep every Must:

1. All Could items (FR-44, FR-45, FR-49, FR-56).
2. Should items in this order: FR-58, FR-59, FR-34, FR-48, FR-47, FR-53 (seed pick-lists by script), FR-31, FR-18, FR-15, FR-16, FR-26, FR-32a, FR-43, FR-06, FR-07. FR-42a (Word export) ships in pilot week 2 if requested. FR-27 and FR-54 are Musts and stay. [v2.2]
3. If Musts are still at risk after week 8, Rox decides whether to move the pilot by up to 2 weeks.

**Later themes.**

| Release | Themes |
|---|---|
| V2 | HSE incident and corrective actions; action tracking with owners (R1); cross-site progress dashboards; AI photo captions if they pass the gate (A18, section 6 Part B); single sign-on; multiple organisations and billing (A3, A15); native app if iOS limits block use (RK-02). |
| V3 | Environmental sampling and lab results; procedures and training library; integrations with document management and project systems; public website. |

## 14. Open questions

| ID | Question | Why it matters | Owner | Needed by | Default if not answered by then |
|---|---|---|---|---|---|
| Q1 | How do reviewers approve reports today, and what do they check? | The reviewer role is unresearched (A1). | Rox | Phase 0 | Build FR-36 to FR-45 as written |
| Q2 | Does the pilot organisation have its own daily report format? | Sets the template (A11). | Rox | Phase 0 | Standard template (P12) |
| Q3 | Which managed host and which region (UK or EU)? The host must run a persistent Node process (7.10). | Hosting, contracts, cost (A5). | Tech lead | Phase 0 | A UK-region host that meets 7.10 |
| Q4 | What share of pilot supervisors use iOS? | Sizes RK-02 and the install step. | Rox | Phase 0 | Assume half use iOS |
| Q5 | Do supervisors share phones or use more than one device? | Per-user local rows and the sign-out guard (A12, A6, 7.3). | Rox | Phase 0 | One phone per user, with per-user local rows |
| Q6 | Are full-resolution originals needed for evidence or disputes? | Storage size and A9. | Rox | Phase 0 | No originals (NA6) |
| Q7 | Do any shifts cross midnight, or do two supervisors write one report? | The Visit model (NA19). | Rox | Phase 0 | A Visit ends at local midnight (NA19) |
| Q8 | What pick-list values do supervisors use (activities, statuses, units)? | Fast capture (FR-14). | Designer | Phase 0 | Seed lists from the three survey answers |
| Q9 | Who signs off the DPIA for location data? | Legal basis for the pilot (RK-10). | Rox | Phase 0 | None: the pilot does not start without sign-off |
| Q10 | Is 7-year retention right for this organisation and its regulators? | Retention setting (A8). | Rox | Phase 1 | 7 years |
| Q11 | Who in the organisation is the admin, and how much time do they have? | Setup and support (A2). | Rox | Phase 1 | None: open |
| Q12 | Can the organisation provide one low-end Android test phone? | Performance budgets (A7). | Rox | Phase 1 | The team buys one 2 GB RAM Android phone |
| Q13 | What price per supervisor per month would the buyer consider? | V2 business case (A15). | Rox | Phase 3 | None: asked at Phase 3  Answered 26 October 2026: ₦7,300 per supervisor per month (FR-63). [v2.3]|
| Q14 | Would supervisors keep using FieldLog without the mandate? | True adoption (A17). | Rox | Phase 3 | None: asked at Phase 3 |
| Q15 [v2.1] | Will pilot supervisors use company or personal phones, and does location capture on personal phones need staff-representative or works-council approval? | Personal-phone refusal (RK-12) and data left on phones (FR-57). | Rox | Phase 0 | None: the pilot does not start until agreed |
| Q16 [v2.1] | Who at the pilot organisation sponsors the mandate, and will they sign the pilot agreement by the end of Phase 0? | A17 is a decision, not an agreement. | Rox | Phase 0 | None: Phase 0 does not exit without it |
| Q17 [v2.1] | What is the budget for Phase 0 and Phase 1, and the latest acceptable pilot start date? | Section 8 team cost and the 20-week plan. **Open: not answered in v2.1.** | Rox | Before Phase 0 | None: open |
| Q18 [v2.2] | Does the Gemini free tier meet the no-training, 30-day retention and region rules? If not, is a compliant paid Gemini tier approved? | Privacy gate for FR-58 and FR-59 (NFR-21, 7.7). | Rox | Phase 1 week 9 | Do not ship FR-58 or FR-59 |
| Q19 [v2.2] | Approve the AI columns, embedding storage, pgvector extension and index? | The schema is fixed; FR-58 and FR-59 cannot ship without this (6 Part B, 7.5). | Rox | Phase 1 week 8 | Do not build FR-58 or FR-59 |
| Q34 [v2.3] | Approve the v2.3 schema additions (section 10). | Agent may not change the schema without approval. | Rox | Before build | Answered 26 October 2026: approved |

## Why this V1 first

Every surveyed supervisor loses a few hours to manual reporting (R1, R2, R3), and the cause is one broken chain: evidence is captured in one place, retyped in another and approved somewhere else, often with no signal. V1 fixes only that chain, from offline capture with automatic location and time to a draft report, review, a locked approved version and export, because each later module (HSE, actions, dashboards, photo captions and other AI) needs trusted, structured field records that do not exist today. [v2.2] It is scoped for two developers in a 10-week build (A4), with a cut line because the timeline is a known risk (RK-06). From the start of Phase 0 to the go/no-go decision takes about 20 weeks: 1 week of iOS spike lead-in, 2 of discovery, 10 of build, 6 of mandated pilot and 1 of decision (A16, A17). [v2.1]

## 15. Review fixes applied in v2.1

All 29 lapses from the live review of v2.0 are applied. Severity is the review's ranking.

| # | Severity | Fix | Where applied |
|---|---|---|---|
| L1 | Critical | Location and time resolved per photo source; occurredAt sets Visit and order | FR-11a, FR-12, P3, P4, P8, P11, A13, NA23, Entry model |
| L2 | Critical | Late entries open the next revision instead of being dropped | FR-29a, FR-41, P8, P11, US-37 |
| L3 | Critical | Sync is an add-only log of typed operations including deletes | FR-24, 7.2, 7.3, SyncOperation model |
| L4 | Critical | Per-user local rows; createdById from the session | FR-05, 7.3, P8, US-05 |
| L5 | Critical | Field screens are client components on precached routes | 7.1, 7.2, NFR-03 |
| L6 | High | Same start and end events in baseline and pilot; reporting effort as co-primary (choice C1) | G1, 11.1, 11.2, 11.4, A16, NA9, NA22, FR-32a, Phase 3 |
| L7 | High | G2 measures back-filling and can fail | G2, NA23 |
| L8 | High | deviceSeq gap detection for lost entries | G3, FR-24, NFR-01 |
| L9 | High | Problem sized in Phase 0 with a 30-minute stop rule | 1, 2, NA20, Phase 0 |
| L10 | High | Custom Auth.js adapter with week-1 proof and fallback | 7.4, NA2, Phase 1 |
| L11 | High | Pilot agreement required; assumptions relabelled as decided, not validated | 1, 12.1, Phase 0, Q16 |
| L12 | High | Device ownership agreed; leaver's phone wiped; FR-54 is a Must | 4.1, FR-54, FR-57, Q15, RK-12 |
| L13 | High | iOS install enforced; FR-27 is a Must and off the cut line | FR-27, NA5, RK-02, cut line |
| L14 | High | A FAILED photo no longer blocks submission forever | FR-32, P12, US-22 |
| L15 | High | iOS spike lead-in, two build tracks, baseline in week 8, Word to Should (choice C2) | 13, FR-42, FR-42a |
| L16 | Medium | No dual Supervisor and Reviewer role; backup reviewer; queue moves on reassignment | FR-52, US-33, Role enum, RK-13 |
| L17 | Medium | Value per supervisor per month, storage and team cost lines (choice C3 leaves cost open) | 8, NA21, Phase 3 |
| L18 | Medium | Banner text no longer implies deletion | FR-28, US-19 |
| L19 | Medium | shortCode in report references | User model, Report.reference |
| L20 | Medium | Server hashes the downloaded bytes; base64 header note | P9, P10 |
| L21 | Medium | Host must run a persistent worker process | 7.10, Q3 |
| L22 | Medium | New risks RK-12 and RK-13; tech lead named | 9, A4 |
| L23 | Low | CSP allows blob: images and storage connections | 7.7 |
| L24 | Low | Retention deletion job cut | P15 removed, 7.6, FR-55, NA18 |
| L25 | Low | Schema matches its comments | Section 10 |
| L26 | Low | Defaults for open questions; Q15 to Q17 added | 14 |
| L27 | Low | Closing timeline states about 20 weeks | Why this V1 first |
| L28 | Low | Part B states the schema has no AI fields | 6 Part B |
| L29 | Low | Excluded entries visible to the reviewer | FR-31 |

## 15.1 Changes applied in v2.2

These are Rox's scope decisions, added as Shoulds. No schema change is applied.

| # | Change | Where applied |
|---|---|---|
| V2.2-1 | AI report summary suggestion, accept/edit/reject, online only | FR-58, US-40, 6 Part B, 7.2, 7.8, NFR-21, NA24 |
| V2.2-2 | Supervisor semantic search over report and entry text, not image pixels | FR-59, US-41, 6 Part B, 7.2, 7.3, 7.5, 7.8, NFR-22, NA25 |
| V2.2-3 | AI is now a V1 Should; photo captions stay V2 | 3.2, A18, NA17, 13 |
| V2.2-4 | Gemini free tier must meet the privacy rules or use a compliant paid tier | 7.1, 7.7, Q18, NA24 |
| V2.2-5 | Both features are dropped first if the build slips | 13, NA26 |
| V2.2-6 | Schema, pgvector extension and index await Rox's approval | 6 Part B, 7.1, 7.5, Q19 |
| V2.2-7 | TypeScript named as the implementation language | 7.1 |

## 17. Changes in v2.3

| # | Change | Where applied |
|---|---|---|
| D-1 | Organisation sign-up, email verification, subscription, checkout (FR-61 to FR-64), stories US-43 to US-47 | 5.1a, 5.8 |
| D-2 | FR-06 and FR-07 from Should to Must | 5.1 |
| D-3 | Non-goals: marketing page in, test-mode payments in, live payments out | 3.2 |
| D-4 | Routes, jobs, rate limits, webhook rule, section 7.14 | 7.2, 7.4, 7.6, 7.7, 7.14 |
| D-5 | Schema additions (Q34) | 10 |
| D-6 | Price, processors, NA28 to NA32, roadmap, Q13 and Q34 | 7.7, 8, 12, 13, 14 |
