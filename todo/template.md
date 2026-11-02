# WORK-ITEM-###: [Work Item Title]

| Metadata | Value |
| :--- | :--- |
| **Work Item ID** | `WORK-ITEM-###` |
| **Status** | `BACKLOG` | <!-- Options: BACKLOG | PLANNED | READY | IN_PROGRESS | IN_REVIEW | DONE | BLOCKED | CANCELLED -->
| **Priority** | `P2 - Medium` | <!-- Options: P0 - Blocker | P1 - High | P2 - Medium | P3 - Low -->
| **Domain / Component** | `CLI` | <!-- Options: CLI | MCP | REST API | Static UI | Work Items | Wiki | OpenAPI | SDK/API | Core -->
| **Autonomy Tier** | `propose` | <!-- Options: observe | propose | change-with-review | scoped-automation -->
| **Author** | @username |
| **Assignee** | Unassigned |
| **Target Milestone** | `v0.1.0` |
| **Related Topic(s)** | [`TOPIC-###`](../topics/TOPIC-###_slug.md) |
| **Target Build-Doc(s)** | [`build-docs/...`](../build-docs/README.md) |
| **Runtime Directory** | — | <!-- Set to .tosh/work_items/{timestamp}_{slug}/ when the intent package is seeded -->
| **Created Date** | YYYY-MM-DD |
| **Active Date** | — | <!-- Stamped on first activation (transition out of BACKLOG to PLANNED or later); never changed afterward -->
| **Last Updated** | YYYY-MM-DD |

> A work item is the parent of all intent-driven SDLC documents. This file holds the intent. The runtime intent
> package (`00_intent_spec.html` through `07_review_findings.html`, sub-intents, and intent units) is seeded from it.

---

## 1. Declared Intent

State the intent in the originator's own words. Describe the outcome, not the steps.

- **Desired outcome**: [What the system must achieve.]
- **Affected users and systems**: [Who and what the intent touches.]
- **Motivation**: [Why this matters now.]

---

## 2. Context & Background

### 2.1 Problem Description
What problem or deficiency does this intent address?

### 2.2 Background & Motivation
Link to originating design topics from [`topics/`](../topics/README.md) or canonical definitions from [`build-docs/`](../build-docs/README.md).

---

## 3. System Invariants

Conditions that must hold before, during, and after convergence. Each command exits with code `0` when the invariant holds.

| ID | Class | Description | Command | Enforcement |
| :--- | :--- | :--- | :--- | :--- |
| `INV-001` | `must-preserve` | [What must stay true.] | `[shell command]` | `ci-gate` |

<!-- Class: must-preserve | do-not-touch | performance-budget | security-boundary -->
<!-- Enforcement: advisory | build-gate | ci-gate | human-gate -->

---

## 4. Boundary Envelope

### In Scope
- [ ] Capability 1.
- [ ] Capability 2.

### Out of Scope
- Excluded capability 1 (for example, deferred to `WORK-ITEM-###`).

### Constraints
- Constraint that binds the solution (for example, reuse the existing authentication method).

---

## 5. Evidence Requirements

> [!NOTE]
> Each requirement is an observable outcome with a command that returns pass or fail. The intent settles only when every requirement passes.

| ID | Observable Outcome | Verification Command |
| :--- | :--- | :--- |
| `EV-001` | [What a reviewer can observe.] | `[shell command]` |
| `EV-002` | [Edge cases, error handling, and validation boundaries.] | `[shell command]` |

---

## 6. Technical Approach & Design References

### 6.1 Architecture & References
- **Specifications**: Refer to [`build-docs/...`](../build-docs/README.md) for target contracts and schemas.
- **Affected Packages / Files**: Target paths, modules, or directories. These seed the Target Scope of the intent units.
- **Data Models / Schemas**: XHTML tags, JSON structures, or CLI commands affected.

### 6.2 Token Optimization & Performance
How does this intent keep token use low and local parsing fast?

---

## 7. Candidate Sub-Intents

Verifiable milestones that seed `02_intent_decomposition.html`. List dependencies between them.

- [ ] **SI-1**: [Milestone name]
  - Depends on: none
- [ ] **SI-2**: [Milestone name]
  - Depends on: SI-1

---

## 8. Definition of Done (DoD)

- [ ] Every invariant holds (`INV-001`, ...).
- [ ] Every evidence requirement passes (`EV-001`, ...).
- [ ] Documentation is updated to reflect the changes.
- [ ] Pull request is reviewed, approved, and merged.
- [ ] Status in this file is `DONE` and reflected in [`backlog.md`](backlog.md).

---

## 9. Dependencies & Blockers

- **Prerequisites**: Depends on [`WORK-ITEM-###`](WORK-ITEM-###_slug.md).
- **Enables**: Prerequisite for [`WORK-ITEM-###`](WORK-ITEM-###_slug.md).
- **External Dependencies**: Third-party packages, tooling, or upstream topics.

---

## 10. Open Questions

| Question | Status | Owner | Resolution |
| :--- | :--- | :--- | :--- |
| [Question] | `open` | @owner | — |

---

## 11. Activity Log & Notes

- **YYYY-MM-DD** (@author): Work item created and placed into backlog.
