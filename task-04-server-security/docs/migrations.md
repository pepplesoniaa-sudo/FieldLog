# Database Migrations: Principles, Mechanics & Operational Governance

## 1. Why Migrations Must Be Forward-Only
In enterprise database administration, database state is an immutable linear timeline. A schema migration is not an undoable text edit; it is an irrevocable state transition executed against live relational tables containing gigabytes of customer data.

**Why forward-only**:
1. **Destructive Down Migrations**: Theoretical "down" migrations (e.g. `DROP COLUMN`) frequently destroy production data permanently. If a rollback drops a newly added column, all data written to that column since deployment is wiped.
2. **Replication and High-Availability Desynchronization**: In distributed database clusters (e.g. read-replicas, multi-region failovers), rolling back a migration can corrupt replication streams and cause primary-replica deadlocks.
3. **The Proper Industry Standard**: Rather than attempting reverse migrations, teams migrate *forward*. If a change is flawed, a new forward migration (`ALTER TABLE ...`) is authored and applied to rectify the structure cleanly while preserving historical audit trails.

---

## 2. Why You Never Edit a Migration That Has Already Run

When Prisma or any standard migration tool applies a migration, it records a SHA-256 cryptographic checksum of that migration file inside the `_prisma_migrations` metadata table in the database.

**What happens if you edit a past migration file**:
1. **Checksum Failure**: On the next migration run, the ORM compares the hash of the file in git against the recorded hash in `_prisma_migrations`. The hashes mismatch, and the migration engine halts with a fatal checksum drift error (`P3008: The migration was modified after it was applied`).
2. **Team Desynchronization**: Other developers and staging servers who already applied the original migration now hold a database in an un-reproducible state.
3. **Rule**: Once a migration file is committed to git or applied to any shared environment, it is immutable law.

---

## 3. Why We Run Migrations by Hand Rather Than Letting an AI Agent Do It

In accordance with our workspace rules (`database-safety.md`), AI agents are strictly forbidden from executing migrations, resets, seeds, or direct queries against any database:

**Why the "Propose and Stop" Rule is Non-Negotiable**:
1. **Hallucination of Data Safety**: An AI agent cannot feel the consequence of dropping a table. If an agent encounters a column type mismatch, its instinct is frequently to execute `prisma db push --force-reset` or `DROP TABLE`, obliterating live remediation site entries in milliseconds.
2. **Locks & Zero-Downtime Governance**: Adding an index or altering a column on a million-row table can lock the table for minutes, taking down the entire web application. A human engineer must inspect the generated SQL, verify whether `CONCURRENTLY` is required, and ensure the 3-step pattern is followed.

---

## 4. The Honest Cost of Running Migrations by Hand

Claiming manual execution has no downsides is dishonest. Running migrations by hand carries real operational costs:

1. **Velocity Friction**: Deployments cannot be 100% automated without human gates. CI/CD pipelines must pause and await a designated engineer to run migration scripts, introducing operational latency.
2. **Human Fallibility & Omission**: Humans forget. Under pressure during an incident or late-night release, a developer may deploy the application code before applying the migration, triggering schema drift errors in production.
3. **Environment Drift**: If a developer forgets to apply a migration to their local environment, their code works against stale schemas until tests break.

Despite these friction costs, manual verification of database DDL is overwhelmingly worth it: the cost of a delayed release is minutes; the cost of an agent dropping a production database is catastrophic bankruptcy.
