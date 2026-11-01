# FieldLog Business Brief

## 1. The Business
**FieldLog** is a specialized Progressive Web App (PWA) built for environmental remediation, earthworks, and land restoration contractors. FieldLog eliminates manual end-of-day site re-typing by allowing field personnel to record tamper-evident photos, GPS-tagged observations, and structured daily work logs directly on active remediation sites, compiling them into audit-ready daily site reports.

## 2. Primary User Profile
The primary user is a **Field Remediation Supervisor** (ages 28–58) working outdoors on contaminated land, brownfield sites, or wetlands. 
* **Hardware**: Ruggedized Android handsets or iPhones, often operated single-handed with dusty, wet hands or work gloves.
* **Environment & Connectivity**: Harsh outdoor glare, heavy machinery noise, and zero-to-intermittent cellular reception (deep excavations, rural floodplains).
* **Technical Proficiency**: Pragmatic and non-technical. They value speed, immediate confirmation of saved entries, and high legibility over decorative visual flair.

## 3. The One Thing That Must Work
**Guaranteed zero-loss offline capture**: A supervisor must be able to photograph site progress and save structured notes with zero cellular signal. Every entry and compressed image must atomically write to local IndexedDB with immediate "Saved on this phone" proof, preserving an immutable chain of custody that syncs when connection returns.

## 4. Three Questions Only FieldLog Can Answer
1. *"What exact remediation work, equipment hours, and quantities were executed at Site X on date Y, and who supervised it?"*
2. *"Is the daily report for yesterday's shift locked and approved by the designated project reviewer, or are revisions required?"*
3. *"Which site photos carry integrity flags—such as SHA-256 checksum mismatches, missing GPS coordinates, or capture locations outside the permitted site boundary?"*

## 5. Interface Character and Aesthetic Rationale
The interface must feel **utilitarian, authoritative, rugged, and high-clarity**. It rejects delicate, low-contrast design trends in favor of industrial-grade functional hierarchy:
* **High-contrast, functional tones**: Clear visual distinction between synced (quiescent) and unsynced/flagged (urgent) states visible under direct sunlight.
* **Tactile typography**: Robust, legible sans-serif figures and labels with generous line heights and open letter-spacing for rapid scanning on vibration-heavy job sites.
* **Sober credibility**: The daily report forms a legal and regulatory record for environmental agencies; the UI must convey uncompromising engineering rigor.
