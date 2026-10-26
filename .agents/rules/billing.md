---
trigger: model_decision
description: Use when writing or changing the subscription, checkout, payment webhook, payment attempts, the billing jobs or the admin billing page.
---
# Billing

AGENTS.md holds the provider, test mode only, and that expiry never blocks sync. This file holds only what it leaves out.

- Write the PaymentAttempt row (INITIATED) before redirecting to the provider. Why: an attempt that dies on a bad network otherwise leaves no record, and FR-64 needs every attempt. [FR-64]
- Accept a webhook only after its signature is valid AND the transaction fetched from the provider's API matches txRef, amount and currency. Then write Payment, move the Subscription period and mark the attempt SUCCEEDED in one transaction. Why: anyone can POST to a public URL. [FR-64, PRD 7.14]
- Money is an integer in minor units. Never a float, never a string sum. Why: 0.1 + 0.2 is not 0.3 in floating point. [PRD 7.14]
- Payment rows are append-only: never update or delete one. Why: payment records are the evidence for tax and disputes. [PRD 7.14]
- Use test keys only. If a key's name or value looks live, stop and tell Rox the variable name. Never print the value. [AGENTS.md Stack]
- billing.attempt-check and billing.expiry log one start line and one finish line with counts. Running either twice on the same data changes nothing the second time. Why: a stopped job looks like a job with nothing to do unless the counts are logged. [PRD 7.6]
- Expiry changes Subscription.status only. It never touches entries, photos, reports, sessions or the sync routes. [FR-63]
