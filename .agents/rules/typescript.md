---
trigger: glob
description: TypeScript rules for every .ts and .tsx file and the tsconfig files.
globs: "**/*.ts, **/*.tsx, **/tsconfig*.json"
---
# TypeScript

- Keep "strict": true in tsconfig.json and never turn off a strict flag. Why: strict mode turns a missing value, such as a photo with no location, into a compile error instead of a crash on a supervisor's phone. [Rox]
- No any, @ts-ignore, @ts-expect-error, non-null ! or an "as" cast that silences an error, unless the line above has a comment saying why it is safe. Prefer unknown followed by a Zod parse. Why: each one switches the type checker off for that line. [Rox]
- Zod schemas are the single source of request, sync-operation and form types. Write each schema once in a shared module, take the type with z.infer, and import it on client and server. Why: two hand-written copies drift, and the server then accepts data the client never sends. [PRD 7.7, NA7]
- Database row types come from the generated Prisma client; never hand-copy a model's fields. The one exception is a $queryRaw result (the vector search), which Prisma cannot type: declare its row type once, next to the query. Why: hand copies go stale when the schema is read again. [PRD 10, 7.13]
- Every switch over a Prisma enum (for example PhotoStatus, ReportStatus, SyncOperationType) ends with an exhaustive check that assigns the value to never. Why: if a status is missed, such as a FAILED photo, the compiler reports it instead of submit silently passing or blocking. [Rox]
