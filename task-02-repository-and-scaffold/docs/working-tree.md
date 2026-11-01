# The Working Tree and Branching Architecture

## 1. The Git Pipeline: From Machine to Production
The software delivery pipeline flows across five physical and conceptual states:
1. **Working Directory (Local Workspace)**: Uncommitted edits on the physical disk. High volatility; can be wiped or corrupted without warning.
2. **Staging Area (The Index)**: Deliberate selection of file chunks (`git add`) staged for snapshotting.
3. **Local Git Store (.git Warehouse)**: Permanent immutable commits stored locally on your machine.
4. **Remote Repository (GitHub)**: The shared team synchronization warehouse.
5. **Production Deployment**: Automated CI/CD pipeline triggered from protected branches serving real users.

---

## 2. What Breaks When a Repository Has Only One Branch
When a team commits directly to a single `main` branch:
* **All Work in Progress is Publicly Exposed**: An unverified half-finished feature immediately contaminates production builds.
* **No Rollback Isolation**: Reverting a broken feature requires ripping commits out of main, which rewrites shared history or introduces messy revert commits that collide with other ongoing work.
* **Review is Impossible**: Pull requests cannot exist without feature branches, eliminating peer review and automated CI validation gates.

---

## 3. Why Single-Branch Fragility Explodes Post-Deployment
* **Pre-Deployment**: With zero live users, breaking the main branch only costs developer inconvenience. You can reset or fix forward at leisure.
* **Post-Deployment**: The main branch directly drives production deployments. A single broken commit pushed to main triggers automated CI/CD and deploys broken code to hundreds of field supervisors on active remediation sites. A hotfix cannot be cleanly isolated and deployed because main already contains unverified in-progress commits from other team members. Trunk protection and ephemeral feature branches are mandatory the instant real users depend on the system.
