---
trigger: model_decision
description: Use when writing or changing photo capture, EXIF reading, compression, checksums, photo upload or the photo.verify job.
---
# Photo pipeline rules

- Accepted capture image formats are JPEG, HEIC (where supported by browser decoding), and PNG up to 25 MB [P1].
- Read EXIF DateTimeOriginal, GPS coordinates, and orientation using exifr before applying any changes to the image [P2, NA7].
- Browser location requests use high accuracy with a 10-second timeout, falling through the location resolution chain on timeout or permission denial without blocking saving [P3].
- JPEG compression encodes orientation at quality 0.8 and steps down by 0.1 to 0.5 until file size is within limits; on out-of-memory error on a low-end phone, retry compression resizing to 1,280 px long edge before marking the photo FAILED [P5].
- EXIF metadata is stripped and not copied into the compressed output image [P5, NA6].
- Checksum is computed on the compressed JPEG bytes as SHA-256 using Web Crypto, returning a 64-character hexadecimal digest, and requiring HTTPS [P6].
- Direct upload to object storage uses a presigned PUT request carrying the SHA-256 digest in the x-amz-checksum-sha256 header, encoded in base64 where supported by the storage provider [P9].
- The photo.verify background job runs 3 retries with backoff intervals of 1, 5, and 15 minutes, triggering an alert after 3 failures or when queue age exceeds 15 minutes [PRD 7.6, P10].
- Verified photos generate a 320 px thumbnail (approximately 30 KB) using sharp from the verified downloaded bytes [PRD 7.5, P10, NA7].
- Photo object storage key format is org/{orgId}/photos/{yyyy}/{mm}/{photoId}.jpg [PRD 7.5].
- Performance budget for photo compression is 3 seconds or less at p95 per 12 MP photo on low-end Android hardware [PRD 7.8].
- Performance budget for photo upload is 12 seconds or less per 400 KB photo on a slow 3G profile [PRD 7.8, NFR-07].
