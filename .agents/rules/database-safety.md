---
trigger: always_on
description: Applies to any terminal command or file that could touch a database, the Prisma schema or migrations.
---
# Database safety rules

- Never run prisma migrate reset, prisma db seed, prisma studio, psql, or any raw SQL script against any database [PRD 7.1, 7.5, 10].
- Never edit an existing migration file in prisma/migrations/ [PRD 10].
- Never print, echo, or log the value of DATABASE_URL or any database connection string [PRD 7.7].
