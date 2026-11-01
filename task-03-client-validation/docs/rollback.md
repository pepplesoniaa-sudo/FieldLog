# Rollback Protocol: Cryptographic Git Identifiers vs. Natural Language Guessing

## 1. Commit History Trace
The commit history prior to rollback execution:

```
$ git log --oneline -n 6
fbe13a9 (HEAD -> main) repo: README and five task folders per the course brief
d678a4c rules: reset, lockout, sign-up and verification rules; new billing rules
148fa99 skills: add build-one-fr, route-access-tests, offline-flow-test, rules-drift-check
46a129f docs: AGENTS.md points to PRD v2.3, adds billing scope and expiry rule
30730eb docs: PRD v2.3 adds sign-up, verification and test-mode subscription (FR-61 to FR-64)
e198b20 chore: initial commit
```

---

## 2. The Regretted Change Scenario
During rapid UI prototyping of the registration form, an experiment was conducted that replaced all visible semantic `<label>` tags with floating HTML `placeholder` attributes in an effort to minimize vertical card height. This violated WCAG 3.3.2 (Labels or Instructions) and degraded screen reader form field announcements into unassociated, ambiguous inputs.

---

## 3. The Specific Commit ID Chosen
- **Target Commit Reverted**: `fbe13a9`
- **Target State Restored**: `d678a4c`

---

## 4. The Exact Command Specified
To safely revert the commit in version control:
```bash
git revert --no-edit fbe13a9
```
Or to restore the specific file directly from the immutable commit snapshot without disturbing other working files:
```bash
git checkout d678a4c -- app/sign-in/page.tsx
```

---

## 5. Why Naming the Commit ID is Safer Than Describing Changes in Words

Naming a cryptographic SHA commit identifier points to an immutable Git Merkle tree object that guarantees an exact, byte-for-byte restoration of the entire tree state. In contrast, describing a rollback in natural language (e.g. *"undo what you did to the labels in the last version"*) forces an AI agent or developer to guess what code was modified, which routinely causes partial rollbacks, missed deletions, and subtle logic regressions that break unit tests.
