---
trigger: model_decision
description: Use when writing or changing the service worker, the Dexie local store, the outbox, deviceSeq, sync triggers or backoff, conflict handling, the api/sync routes, or what happens on a 401 or 410.
---
# Offline and sync

AGENTS.md already holds: the five operation types and repeat handling, the 60-second timer, batches of 25, 14 days offline, what may be deleted locally and when (including on a 401), and the clock-flag threshold. This file holds only what it leaves out.

## Local store
- Dexie tables are exactly: reference (projects, sites, pick-lists, memberships), entries, entryVersions, photos (blob plus metadata), outbox, meta (cursor, deviceId, last sync). Ask Rox before adding a table. Why: the 14-day test and the sync code must cover every table that holds user data. [PRD 7.3]
- Every local row carries userId. Read, show and sync only the signed-in user's rows, and leave other users' rows untouched and hidden. Why: phones may be shared (Q5), and uploading or deleting another user's rows loses or misattributes their work. [PRD 7.3]
- Create the ids of entries, entry versions, photos, operations and batches on the device with crypto.randomUUID(). Why: a retried request must carry the same id, or the server stores a duplicate. [PRD 7.3, A12]
- Create deviceId once per install and keep it in meta. deviceSeq is a gap-free counter per device: increase it inside the same Dexie transaction that saves the entry, never reuse or skip a number, and send the highest issued value with every batch. Why: the server finds lost entries by looking for gaps (NFR-01), so a number burned by a failed save looks like a lost entry. [FR-24, NFR-01]
- Call navigator.storage.persist() at app start on every platform and record the result in meta; a refusal is not an error. Why: without it the browser may clear storage when space runs low. [FR-27, PRD 7.3]
- If IndexedDB cannot be opened (some private browsing modes), show the message that offline capture is not available and do not offer capture. Why: an entry "saved" with nowhere to store it is lost. [PRD 7.9]

## Sending
- An entry's operations are sent and acknowledged before its photos upload. Why: the photo upload URL needs the server's Photo row. [PRD 7.3, P9]
- Photos upload three at a time, or one at a time on a slow connection. "Slow" is not set in the PRD: ask Rox for the test. Until Rox answers, upload one at a time. Why: one at a time is always correct, only slower. [PRD 7.3]
- Retry a failed request with backoff from 5 seconds up to 15 minutes. Doubling each time is a proposal; the PRD sets only the two ends. Why: phones on site go in and out of signal, and fast retries drain the battery. [FR-22]
- Besides the 60-second timer, start a sync on app open, on the online event, when the page becomes visible, and through Background Sync where the browser has it (Chrome, Edge). Do not build a workaround for Safari, which has none. Why: these are the moments signal is most likely back. [FR-22, PRD 7.3, RK-02]
- When the page becomes hidden, stop the 60-second timer and every other interval, and start them again when it is visible. Why: NFR-20 allows no background timers while the app is hidden. [NFR-20]
- Run only one sync at a time per device, for example with navigator.locks. Why: repeats are harmless, but two tabs sending the same photos waste a slow connection. [Proposal, not in the PRD]
- Do not build the "Sync now" button, the per-item retry button (FR-26) or the low-storage warning (FR-18). Why: they are Shoulds Rox has not named. [AGENTS.md Scope]

## Server
- Set createdById from the session user, never from the payload. Reject an entry whose payload userId differs from the session user, with the reason "wrong user". Why: otherwise one user can file entries as another. [P8]
- Store clockOffsetSec as server time minus device time, taken from the device clock in the batch, and correctedAt as deviceCapturedAt plus clockOffsetSec. Why: a reversed sign moves every entry the wrong way in time. [PRD 7.3, PRD 10]
- Acknowledge each operation separately. A rejected item stays on the device with its reason and does not stop the rest of the batch. Why: one bad item must never hold back a day of good entries. [P8]
- Project, site, membership and pick-list data: the server wins, so a pull overwrites the local rows. Save the new cursor only in the same Dexie transaction that writes the pulled rows. Why: a cursor saved before a failed write skips those changes for good. [FR-25, PRD 7.3]
- Remove an operation from the outbox only after the server acknowledges it; an entry leaves only after that and once all its photos are VERIFIED. Why: until then the device copy is the only copy. [PRD 7.3]

## 401 and 410
- On a 401, pause sync, keep everything, ask the user to sign in, and resume afterwards. Why: an expired session must never cost a supervisor their day's work. [PRD 7.3, FR-04]
- Do not build the 410 "Account closed" flow yet. FR-57 says the device uploads its remaining entries first, but FR-54 revokes the user's sessions, so the device has no session to upload with. Ask Rox how that upload is authenticated. Why: guessing either loses the entries or opens an upload route with no sign-in. [FR-54, FR-57]
