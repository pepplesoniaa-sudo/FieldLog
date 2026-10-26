---
trigger: model_decision
description: Use when writing or changing photo capture or gallery pick, EXIF reading, browser location, compression, checksums, presigned photo upload, the photo complete route or the photo.verify job.
---
# Photo pipeline

AGENTS.md already holds: the 25 MB input limit, 1,600 px and 450 KB output, 10 photos per entry, the location chains for camera and gallery, the flags, 15-minute presigned URLs, and that the server recomputes SHA-256. This file holds only what it leaves out.

## On the device
- Every entry needs at least one photo. Why: note-only entries are FR-16, a Should Rox has not named. [FR-16, AGENTS.md Scope]
- Accept JPEG, PNG, and HEIC only where the browser can decode it. If a file cannot be decoded, show a message and save nothing for that photo. Do not add a HEIC library without Rox. Why: a photo that cannot be read cannot be compressed or checked. [P1]
- Read DateTimeOriginal, OffsetTimeOriginal, GPS and Orientation with exifr from the original file, before any canvas step. If EXIF is missing, leave those fields empty and go on. Why: the canvas output has no EXIF, so reading after compression loses the time and place. [P2, FR-11]
- Ask for browser location once per entry with getCurrentPosition, enableHighAccuracy true and a 10-second timeout; never use watchPosition. On a refusal or timeout, fall through the chain and save anyway. Why: battery (NFR-20), and a missing location must never stop a save. [P3, NFR-20]
- For a camera photo, start the location request when the camera opens, not after the shot. Why: a 10-second wait after the shot would break the 2-second save budget. [Proposal, not in the PRD]
- Apply the EXIF orientation exactly once. Current browsers already rotate the image when they decode it, so check before rotating by hand, and test with a portrait photo whose EXIF orientation is 6. Why: rotating twice saves the photo sideways. [P5]
- Compress as JPEG at quality 0.8, then 0.7, 0.6 and 0.5, and keep the first result that meets the AGENTS.md size limit. What to do when 0.5 is still too big is not set in the PRD: ask Rox. Why: guessing either drops a photo or breaks the limit. [P5]
- On an out-of-memory error, retry once at 1,280 px long edge. If that also fails, keep the entry and mark the photo FAILED with a retry action. Why: low-end phones run out of memory on 12 MP photos, and the entry must survive. [P5]
- Never copy EXIF into the compressed file. Why: it removes GPS from the file sent to storage and to the AI provider. [P5, PRD 7.13]
- Compute SHA-256 with crypto.subtle.digest over the exact bytes that will be uploaded, and store it as 64 lowercase hex characters with the byte size. If hashing fails, do not queue the photo, and tell the user. Why: P10 compares both values. [P6, P10]
- Web Crypto works only in a secure context. http://localhost is fine, but a phone loading the dev server at http://192.168.x.x is not: test on a phone over HTTPS. Why: otherwise hashing fails on the phone only and looks like a bug. [P6]

## Upload
- The x-amz-checksum-sha256 header always carries the base64 of the 32 raw digest bytes, never the 64-character hex string. Convert hex to bytes, then to base64. Why: storage rejects every upload whose header is hex. [P9, S3 API]
- Request the presigned PUT URL per photo with its checksum, and send exactly the headers the server signed. Why: any header that differs from the signed one fails with 403. [P9]
- The storage provider is not chosen (Q3). If it ignores the checksum header, keep the header and keep photo.verify. Why: P10 still catches a damaged file. [P9, P10]

## Server
- photo.verify downloads the object once, computes SHA-256 and byte size, compares both with the Photo row, and makes the 320 px thumbnail with sharp from those same bytes. On a mismatch, set FAILED so the device re-uploads on its next sync. Why: a thumbnail from a second download could come from different bytes than the ones checked. [P10]
- photo.verify retries 3 times at 1, 5 and 15 minutes, and alerts after 3 failures or when the queue is older than 15 minutes. [PRD 7.6]
- Photo key: org/{orgId}/photos/{yyyy}/{mm}/{photoId}.jpg. Whether yyyy/mm comes from occurredAt or the upload date is not set: ask Rox. The thumbnail key is not set in the PRD: ask Rox. Why: keys are permanent once objects exist. [PRD 7.5]
- Budgets: compression 3 s or less at p95 per 12 MP photo on a low-end Android phone; upload 12 s or less per 400 KB photo on Slow 3G. [PRD 7.8, NFR-07]
