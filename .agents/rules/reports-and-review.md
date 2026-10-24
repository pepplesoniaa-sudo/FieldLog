---
trigger: model_decision
description: Use when writing or changing draft report creation, the report template fields, submit and freeze, review decisions, If-Match conflicts, or report exports.
---
# Reports and review rules

- Draft report and revision 1 are created on the server in a single database transaction upon arrival of the first entry, adding a ReportEntry for each current EntryVersion ordered by occurredAt [P11].
- Standard template section fields assembled from revision, entries, photos, and pick-lists are [P12]:
  - Header: organisation, project code and name, site code and name, date, supervisor, reference, revision, status [P12].
  - Weather: weather [P12, FR-30].
  - Work summary: count of entries and total quantity per activity type and unit [P12].
  - Entry log: time, activity, status, quantity, note, location and source, flags, thumbnails [P12].
  - Issues and observations: entries whose status is marked as issue [P12].
  - Flags: location and clock flags [P12].
  - Supervisor summary: supervisor summary [P12].
  - Review block: reviewer, decision, date, comments [P12].
  - Footer: approval stamp, content SHA-256 [P12].
- Submitting a report performs the completeness check, writes an immutable JSON snapshot and its SHA-256 hash, transitions status to Submitted, and queues email notification [P13, FR-36].
- Editing a draft report requires sending the revision version in the If-Match header and returns HTTP 409 Conflict on version mismatch [PRD 7.2, 7.3, P13, FR-33].
- Report exports are generated strictly from the frozen revision snapshot, never from live mutable database records [P14].
- Export generation produces PDF format using @react-pdf/renderer; Word (.docx) export is built with docx only if Rox explicitly requests FR-42a [P14, FR-42, FR-42a, NA7].
- The report.export pg-boss job runs with 3 retries at 1, 5, and 15 minutes backoff, marking status FAILED with a user retry button and triggering a developer alert on final failure [P14, PRD 7.6].
- Export signed download links expire after 15 minutes [P14, NA7].
- Export object storage key format is org/{orgId}/exports/{reportId}/r{revision}.{pdf or docx} [PRD 7.5].
- Performance budget for rendering the report page is 2 seconds or less at p95 for 50 entries based on server timing [PRD 7.8].
- Performance budget for generating report exports is 30 seconds or less at p95 for 50 photos based on worker timing [PRD 7.8, NFR-09].
