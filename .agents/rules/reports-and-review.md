---
trigger: model_decision
description: Use when writing or changing draft report creation, the report template, submit and freeze, the snapshot checksum, report edits and 409 conflicts, review decisions, late entries, or report exports.
---
# Reports and review

AGENTS.md already holds: what a Visit is, the four statuses, the order of the template sections, the completeness check, late entries, the 10-character comment, who may review, that Word is built only when Rox asks, and 15-minute presigned links. This file holds only what it leaves out.

## Draft
- Create the Report and revision 1 when a Visit's first entry syncs, together with one ReportEntry per current EntryVersion ordered by occurredAt, in one database transaction. On an error, write nothing; the next view retries. Why: a half-made report has entries missing with no sign of it. [P11]
- Two batches can create the same Visit's report at the same moment. Rely on the unique visitId on Report: on a unique-constraint error, read the existing report and carry on. Never check first and then insert. Why: check-then-insert lets both requests through and makes two reports. [P11, PRD 10]

## Template (P12 fields, in the AGENTS.md section order)
- Header: organisation, project code and name, site code and name, date, supervisor, reference, revision, status.
- Weather: the revision's weather pick-list value. Work summary: count of entries, and total quantity per activity type and unit.
- Entry log: time, activity, status, quantity, note, location and its source, flags, thumbnails. A missing thumbnail shows "Photo processing".
- Issues and observations: entries whose work status carries the issue marker. Flags: location and clock flags, plus "Photo failed to upload".
- Supervisor summary: the revision's summary text. Review block: reviewer, decision, date, comments. Footer: approval stamp and content SHA-256.
- Do not build the weather picker, the summary input, excluding or reordering entries (all FR-31), the minutes question (FR-32a) or the email on submit or decision (FR-43) until Rox names them. Show the weather and summary sections empty. Why: they are Shoulds Rox has not named. FR-38, a Must, says the supervisor edits "the summary", so ask Rox whether the summary input is in the MVP. [FR-31, FR-32a, FR-38, FR-43]

## Submit and freeze
- Submit runs the completeness check, then in one transaction writes the snapshot, its SHA-256 and submittedAt, and sets the status to Submitted. Why: a snapshot without its hash, or a status without its snapshot, cannot be trusted. [P13, FR-36]
- The snapshot holds everything an export prints. Why: exports are built from the snapshot only. [P14]
- The snapshot column is jsonb, and PostgreSQL reorders keys in jsonb. Compute contentSha256 over a canonical form (keys sorted, no spaces, UTF-8) so it can be recomputed from the stored value. Add a test that reads the snapshot back, re-hashes it and gets the same value. Why: hashing JSON.stringify of the original object gives a value that never matches again. [FR-36, PRD 10]
- Reject at the server any write to a Submitted revision or a locked (approved) one, including an AI accept. Why: the frozen revision is the record the reviewer approved. [FR-36, FR-39, NA25]

## Edits and conflicts
- Every report write carries the revision version (If-Match on PATCH /api/reports/[reportId], a version field in server-action input). Update with WHERE version = expected and increase it; if no row changes, return 409. Why: a read followed by a separate write lets two editors overwrite each other. [FR-33, PRD 7.2]
- On a 409 the client reloads the latest data and keeps the user's unsaved text in the field. Why: FR-33 says no typed text is lost. [FR-33]

## Review
- Put the decision logic (role, not own report, backup reviewer case, comment length) in one server function, called by both the review server action and POST /api/reports/[reportId]/reviews. Why: AGENTS.md says review forms use server actions, while PRD 7.2 also lists the route, and two copies of the checks drift. [PRD 7.2, AGENTS.md Route map]
- Use these texts exactly: in the review view "N entries added after submission", and on the capture screen "Today's report for this site is already submitted. This entry will start a new revision." [FR-29a]

## Export
- Only an approved revision can be exported. report.export builds the PDF with @react-pdf/renderer from the snapshot only, and prints the revision number, approval date, reviewer and content SHA-256. Why: an export from live rows can differ from what was approved. [FR-39, FR-42, P14]
- Upload to org/{orgId}/exports/{reportId}/r{revision}.pdf with a checksum, then set ReportExport to READY. Who may export follows the role table in auth-and-access.md. [PRD 7.5, PRD 7.4]
- report.export retries 3 times at 1, 5 and 15 minutes, then sets FAILED with a "Try again" button and an alert. [PRD 7.6, P14]
- Whether the PDF embeds thumbnails or the full 400 KB photos is not set in the PRD: ask Rox. Why: 50 full photos make a file near 20 MB. [P14]
- Budgets: report page 2 s or less at p95 with 50 entries; export 30 s or less at p95 with 50 photos. [PRD 7.8, NFR-09]
