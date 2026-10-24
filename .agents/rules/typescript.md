---
trigger: glob
description: TypeScript rules for every .ts and .tsx file.
globs: "**/*.ts, **/*.tsx"
---
# TypeScript rules

Note: TypeScript is Rox's choice and is not named in the PRD.

- Strict mode must remain enabled across all TypeScript configurations [PRD 7.1].
- Never use any, @ts-ignore, or non-null assertion ! without a one-line written comment explaining the reason [PRD 7.1].
- Zod schemas are the single source of truth for request and form types, shared between client and server [PRD 7.7, NA7].
- Prisma database types must always be imported from the generated Prisma client, never hand-copied or duplicated [PRD 7.1, 10].
