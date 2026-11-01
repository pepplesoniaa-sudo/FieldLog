---
trigger: model_decision
description: Use when writing or changing any AI report summary suggestion, Gemini or Vertex AI call, embedding, meaning search, the AI switches, the api/ai or api/search routes, or the entry.embed job.
---
# AI features (FR-58, FR-59)

AGENTS.md already holds: Vertex AI at a regional endpoint and never the free tier, the paid API key route or a global endpoint; caching, grounding, file storage and stored sessions off; never send GPS, user names, emails or image pixels; raw SQL for the vector column; the 2 s meaning-search budget; that every suggestion needs a person; switches off until Q31 and the DPIA; and the list of open AI questions. AI photo captions remain strictly out of V1 (Roadmap V2). This file holds only what it leaves out.

## Before any call
- Read the organisation's switch for that feature from the database, on the server, immediately before every model call: summary, query embedding, and each entry.embed job, including backfill. If it is off, make no call. Why: NFR-22 allows zero requests while a switch is off, and a switch can be turned off in the middle of a backfill. [NFR-22, FR-58, FR-59]
- The Gemini model for summaries, the Google client package and the environment variable names are not set (Q33). Build the provider behind one interface with a fake provider, and do not write the real call until Rox names all three. Why: guessing a model or package breaks the region and package rules. [PRD 7.13, Q33, AGENTS.md Stack]
- Tests use the fake provider only; no test calls Google. Why: a test call sends data out and costs money. [PRD 6 Part B rule 1]

## Daily report summaries (FR-58)
- Summary: asked for by the supervisor for a Draft revision. Input is the text fields of its entries only (time, activity, status, quantity, unit, note). Output is 150 words or fewer, and each sentence carries the entryVersionIds it came from. [FR-58]
- Do not show a sentence that has no ids, or ids that are not in that revision. Why: a sentence with no source may be invented. [FR-58, PRD 6 Part B]
- What to do with output over the length limit is not set in the PRD: ask Rox. Do not truncate silently. [FR-58]
- Store every suggestion shown in AiSuggestion with outcome SHOWN, then ACCEPTED, EDITED, REJECTED or DISCARDED, with finalText, decidedById, decidedAt, tokens, costMicroGbp and latencyMs. Store promptVersion, never the prompt text. Why: Part B measures acceptance and cost from these rows (Q30 default). [FR-58, PRD 10]
- Accept or Edit saves the text and sets aiAssisted, aiModelId, aiPromptVersion and aiSourceMap, and writes AI_ACCEPT. Reject saves nothing to the field, keeps the AiSuggestion row as REJECTED and writes AI_REJECT. [FR-58, US-40]
- Accept only while the revision is Draft; the server checks this. If the provider fails, leave the field as it was and show a message. [FR-58, NA25]
- Leave costMicroGbp empty until Rox gives a price table. Why: the PRD fixes no prices. [PRD 6 Part B]

## Embeddings and meaning search (FR-59)
- Model gemini-embedding-001. Ask for 768 output dimensions explicitly, because the model's default size is larger and will not fit the vector(768) column. Normalise each vector before saving, and store modelId as "gemini-embedding-001@768". [PRD 7.13, Q28, PRD 10]
- The task types for entries and for search text are not set in the PRD: ask Rox. [PRD 7.13]
- Text embedded: note text plus activity, status and unit labels; entries only. One EntryVersion = one chunk (NA32). Store the SHA-256 of the exact text in EntryEmbedding.contentSha256 and skip re-embedding when it has not changed. [PRD 7.13, NA32, Q21, Q23]
- entry.embed runs for each new EntryVersion after sync, and as a backfill when search is switched on. Retries: 3, at 1, 5 and 15 minutes. Alert after 3 failures or when the queue is older than 1 hour. [PRD 7.6, FR-59]
- The search SQL filters by organisation, modelId, current version, not deleted and the user's site access (the FR-46 rules) in the same statement as ORDER BY distance. Use the cosine operator <=>. Why: raw SQL bypasses the tenant extension, filtering afterwards leaks rows or returns too few, and only <=> uses the cosine index. [PRD 7.13, FR-59]
- Run SET LOCAL hnsw.ef_search = 40 and SET LOCAL hnsw.iterative_scan = relaxed_order in the same transaction as the search query. Why: a plain SET leaks to the next user of that pooled connection, and SET LOCAL outside a transaction does nothing. [PRD 7.13]
- relaxed_order can return rows slightly out of order, so sort again by distance in an outer query. It needs pgvector 0.8.0 or later (Q25). [PRD 7.13, Q25]
- The 2 s budget includes embedding the query. Filtered search without meaning ranking keeps its 1 s budget. If the switch is off or the provider fails, return FR-46 filtered results and say so. [NFR-21, NFR-08, FR-59]
- Turning any switch on or off writes AI_SETTING_CHANGE. How Rox records that the gate and DPIA are done, so a switch may be turned on, is not set: ask Rox. [PRD 6 Part B]
