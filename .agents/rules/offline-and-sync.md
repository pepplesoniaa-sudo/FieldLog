---
trigger: model_decision
description: Use when writing or changing the service worker, the Dexie local store, the outbox, sync triggers, conflict handling or the api/sync routes.
---
# Offline and sync rules

- Dexie local tables are reference (projects, sites, pick-lists, memberships), entries, entryVersions, photos (blob plus metadata), outbox, and meta (cursor, deviceId, last sync) [PRD 7.3].
- Every local Dexie row carries userId, and the application reads, displays, and syncs only rows for the signed-in user, leaving other users' unsynced rows hidden on the device until they sign in [PRD 7.3].
- Repeat operations carry client-created UUIDs so replays are safely acknowledged and ignored, and an entry whose payload userId differs from the session user is rejected with reason "wrong user" [PRD 7.3, P8].
- Send order requires entries to sync before their photos, with photos uploading one at a time on slow connections and three at a time otherwise [PRD 7.3].
- Sync triggers other than the timer are app open, online event, visibility change, manual "Sync now" button, and browser Background Sync where supported (Chrome, Edge; Safari lacks Background Sync so iOS syncs only while the app is open) [PRD 7.3, RK-02].
- Reference data conflicts resolve with server wins, report edits return 409 Conflict on version mismatch, and entries are add-only per user so two devices never edit the same entry row [PRD 7.3, A12].
- An entry leaves the outbox only after the server acknowledges it and all its linked photos reach VERIFIED status [PRD 7.3].
- Synced photos are retained on the device for 7 days and are then removed when device storage is low [PRD 7.3, NA13].
- The service worker never clears Dexie storage on an HTTP 401 response; a 401 pauses sync and prompts for sign-in [PRD 7.3, A6].
- The application calls navigator.storage.persist() on every platform to request persistent local storage [PRD 7.3, NA5].
- No background timers may run while the application or page is hidden, and GPS is requested only once per entry [PRD 7.12 NFR-20].
