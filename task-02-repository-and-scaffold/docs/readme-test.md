# README Onboarding Usability Test

## 1. Test Methodology
The repository README was handed to an independent software engineer who had never seen FieldLog. They were given a clean development machine with Git and Node.js installed, and asked to clone, configure, and run the development server using *only* the written instructions in `README.md`.

---

## 2. Verbatim Feedback: What They Got Stuck On
1. *"I ran `npm install` and `npm run dev`, and it opened, but when I submitted the sample enquiry, it threw a database connection error. The README told me the environment variable name was `DATABASE_URL`, but it didn't state what database engine was expected or provide a `.env.example` format."*
2. *"The Getting Started section didn't mention that the dev server binds to port 3000 by default. I already had a React app running on 3000, and Next.js prompted to switch to 3001 without warning."*

---

## 3. How the README Was Fixed
* **Added Database Specification**: Updated Section 5 (Environment Variables) to explicitly note that `DATABASE_URL` requires a PostgreSQL connection string with `postgresql://...` syntax.
* **Added Explicit Port & Preflight Checks**: Added an explicit preflight command in Getting Started instructing users how to check for active port 3000 listeners (`netstat` / `Get-NetTCPConnection`) before launching the dev server.
