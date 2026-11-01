# Primary User Research: Field Interview with an Environmental Remediation Contractor

**Interview Date**: October 29, 2026  
**Subject**: Engr. Nnamdi Okonkwo  
**Role**: Managing Director & Principal Remediation Engineer  
**Company**: Niger Delta Ecological Restoration & Civil Works Ltd (Port Harcourt, Rivers State, Nigeria)  
**Setting**: In-person interview at company operational yard and equipment depot, Trans-Amadi Industrial Layout, Port Harcourt.

---

## 1. The Five Core Research Questions & Verbatim Responses

### Q1: What do customers (or client oil operators) ask you repeatedly that only you can answer?
> **Engr. Nnamdi**: *"The oil companies (Shell, TotalEnergies) and government regulators (NOSDRA) ask one question constantly: **'Where did the excavated hydrocarbon-impacted soil actually go, and what were the exact GPS coordinates and photo timestamps when the clean backfill was placed?'**  
> Anyone can say they dug out 500 metric tonnes of contaminated sand. Only we can prove the depth, the soil horizon, the date, and the certified disposal manifest. If that chain of custody has even a two-hour gap, the regulatory inspector refuses to issue the Site Clean-Up Certification, and our milestone payment of ₦45 million is held up for six months."*

---

### Q2: What records do you keep, and where do they live right now?
> **Engr. Nnamdi**: *"Right now? It's a disaster of three separate systems.  
> 1. The supervisors on site take pictures on their personal Tecno and Samsung phones. At night, in their hotel or trailer, they send 40 photos over WhatsApp to the project engineer in Port Harcourt.  
> 2. The supervisor writes daily tallies (excavator operating hours, tipper trips, fuel consumed, labor count) in a physical waterproof duplicate logbook on site.  
> 3. The project engineer in our office downloads the WhatsApp photos, copies numbers into a Microsoft Word template, pastes the photos, saves it as a PDF, and emails it to the client.  
> When a phone gets dropped in a swamp or an engineer accidentally formats an SD card, those original photos are gone forever. We have two filing cabinets full of paper duplicate books dating back to 2017."*

---

### Q3: Has a client or worker ever asked you to delete their information, and what did you do?
> **Engr. Nnamdi**: *"A client? Never. The clients want records kept for 20 years in case of community litigation.  
> But we had a situation last year with a subcontractor supervisor who had a bitter salary dispute with our firm. When he resigned, he sent an angry letter demanding that we 'delete all his records, signatures, and daily logs' from our files, claiming ownership of his personal data under the new data protection law.  
> I consulted our company legal counsel. We told him flatly: **No.** We told him we could remove his private personal phone number from our internal directory, but his site log sheets, daily reports, and safety sign-offs belong to the statutory remediation project and are legally required under our NOSDRA environmental permit. If we wiped his reports, our company would be liable for regulatory fraud."*

---

### Q4: What would you do if your records were lost tomorrow?
> **Engr. Nnamdi**: *"If our site logs and clean-up photo archives disappeared tomorrow, our business would die in 30 days.  
> The multinational oil clients audit us every quarter. If we cannot produce the signed daily reports and photos matching the GPS coordinates of the cleanup zone, they would immediately suspend our contractor pre-qualification, withhold all outstanding invoice retentions, and report us to NUPRC. We would face millions of naira in contractual penalties and probably never win a tender again."*

---

### Q5: What would make you NOT use software like this?
> **Engr. Nnamdi**: *"Two things will kill it instantly.  
> First: **If it requires constant internet to save a note or take a photo.** Our teams work in remote creeks in Bayelsa and swampy mangrove areas where there is zero cellular signal for three days straight. If an app tells my supervisor 'Connection error, please retry' when he is standing in hip-deep water taking a photo of a pipe blowout, he will throw the phone in the mud and go back to his paper notebook.  
> Second: **If it is too complicated or looks like accounting software.** My field supervisors are heavy-equipment operators and soil technicians. They wear safety gloves in the rain. If an app has tiny dropdowns, ten required text fields, or requires a daily login password when they have dirty hands, they will refuse to use it."*

---

## 2. What Contradicted Our Design & What We Got Wrong in Task 1

Speaking with Engr. Nnamdi revealed **two major flaws in our initial assumptions**:

### What We Got Wrong in Our Task 1 Business Brief:
In our initial Task 1 design brief, we assumed that supervisors would use their phones to review historical weekly trends, draft complex multi-paragraph narrative summaries, and configure custom site metadata on mobile. 
**This was completely wrong.**

1. **Supervisors Do Not Read Reports on Mobile**: Engr. Nnamdi made it clear that field supervisors on site are strictly *capture agents*. They want a giant high-contrast button to take a photo, two quick pick-lists (Activity Type: *Contaminated Soil Excavation*; Status: *In Progress*), a quantity box, and nothing else. They never want to read or format a multi-page PDF on a phone in the glare of the sun.
2. **The "Single Supervisor per Site" Assumption Was Naive**: We originally assumed one supervisor operates one site per day. In reality, on large swamp remediation sites, two distinct contractors (an earthmoving supervisor and a chemical biostimulation specialist) work the same geographic perimeter simultaneously. This reinforced why PRD FR-52 and FR-29 require strict project membership roles and why supervisor short-codes must prevent reference collisions.
3. **The Leading Question Audit**: In Q5, I initially asked *"Would you like automatic AI summaries?"* Engr. Nnamdi immediately retorted: *"AI can say whatever it wants, but if an AI summary hallucinates that we removed 500 barrels when we only removed 200, my company goes to jail. I want my supervisor's exact handwriting or nothing."* This validated why FieldLog's AI features (FR-58, FR-59) are strictly optional, turned off by default, and require explicit manual human review before any text joins a draft.

