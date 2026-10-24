---
trigger: model_decision
description: Use when writing or changing any AI suggestion, Gemini or Vertex AI call, embedding, meaning search, the api/ai or api/search routes, or the entry.embed job.
---
# AI features rules

- Before initiating any external model call, verify the organisation-level AI feature switch on the server; all AI features are off by default [PRD 6 Part B, FR-58].
- Photo caption suggestions (V2) are limited to 120 characters, and daily report summary suggestions (FR-58) are limited to 150 words [PRD 6 Part B, FR-58, NA24].
- Summary suggestions require each sentence to link to the entry ids it uses; sentences without entry links must not be shown [PRD 6 Part B].
- Summary suggestion review actions and persistence [PRD 6 Part B, FR-58, US-40]:
  - Accept: stores the summary text with aiAssisted true, model id, prompt version, and writes an AI_SUMMARY_ACCEPTED audit event [PRD 6 Part B, US-40].
  - Edit: stores the edited text with aiAssisted true, model id, prompt version, and writes an audit event [PRD 6 Part B, US-40].
  - Reject: saves no summary text and stores nothing [PRD 6 Part B, US-40].
- Text embeddings use the Gemini text embedding model on the free tier, with the dimension fixed at implementation [PRD 6 Part B]; specific embedding model name: Not set in the PRD: ask Rox; embedding dimensions: Not set in the PRD: ask Rox; embedding normalising: Not set in the PRD: ask Rox.
- Vector search queries in PostgreSQL with pgvector must apply organisationId and membership filters in the same SQL statement as cosine distance ordering before returning rows [PRD 6 Part B, 7.7, NFR-22].
- Vector index search query configuration: hnsw.ef_search setting: Not set in the PRD: ask Rox; iterative_scan setting: Not set in the PRD: ask Rox [PRD 6 Part B, 7.5].
- Background embedding job execution: entry.embed retries: Not set in the PRD: ask Rox [PRD 7.6].
- Performance budget for semantic meaning search is 1 second or less at p95 across pilot-scale data [PRD 7.8, NFR-22].
- Until Rox answers Q31 and the DPIA is signed, build and test with every AI switch off and never turn one on. [PRD 6 Part B, Q9]
- Open AI questions: Q20, Q21, Q22, Q24, Q25, Q29, Q31, Q32, Q33. [PRD 14]
