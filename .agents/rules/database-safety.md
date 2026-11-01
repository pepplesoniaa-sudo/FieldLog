---
trigger: always_on
description: Applies to any terminal command, npm script or code that could touch a database, the Prisma schema or migrations.
---
# Database safety

AGENTS.md already forbids prisma migrate, prisma db push, and running any migration, reset, seed or query against any database, and it holds the approved schema additions (Q19 and Q34 in PRD section 10). This file holds only what it leaves out. Printing DATABASE_URL is covered by security-baseline.md.

- The only Prisma commands you may run are prisma generate and prisma validate. Why: they read schema.prisma and write generated client code only; no database is contacted. [Rox]
- Never run any other Prisma command, including prisma studio, prisma db pull, prisma db execute, prisma db seed, prisma format, or prisma migrate diff with a database URL. Why: studio and db execute read and write live data, db pull overwrites schema.prisma from a database, and format rewrites the locked schema file. [AGENTS.md How to work, PRD 10]
- Before running any npm, pnpm or yarn script, read what it runs in package.json. If it runs a command banned here or in AGENTS.md, do not run it. Why: a script named "test" or "dev" can hide a reset or a seed. [Rox]
- Never run psql, pg_dump, pg_restore, createdb, dropdb, or a script that opens a database connection. Why: each touches a database by a route the AGENTS.md list does not name. [AGENTS.md How to work]
- Never edit or delete a migration file that already exists in prisma/migrations/. Write a new one only under the approved schema additions in AGENTS.md. Why: Rox may already have applied it, and Prisma then refuses every later migration because the file's checksum changed. [PRD 10, 7.13]
- Raw SQL in application code is allowed where AGENTS.md requires it (the vector column). Write it only with Prisma's tagged templates, $queryRaw`...` and $executeRaw`...`. Never use $queryRawUnsafe or $executeRawUnsafe, and never build SQL by joining strings. Why: tagged templates send values as parameters, and string-built SQL lets an attacker run their own SQL. [PRD 7.13]
- Code must never hard-delete a row of a model that uses soft delete; set its deleted fields instead. Why: soft-deleted rows are kept for the retention period. [PRD 7.5, FR-17]
- When a task needs a database to change (a migration applied, a grant, seed data), write the exact SQL or command in your reply for Rox and stop. Why: it gives Rox the step instead of you looking for a way around the ban. [AGENTS.md How to work]
