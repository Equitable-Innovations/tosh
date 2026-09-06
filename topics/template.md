# TOPIC-###: [Topic Title]

| Metadata | Value |
| :--- | :--- |
| **Topic ID** | `TOPIC-###` |
| **Status** | `PROPOSED` | <!-- Options: PROPOSED | IN_DISCUSSION | DECIDED | GRADUATED | DEFERRED | REJECTED -->
| **Facilitator** | @username |
| **Participants** | @username1, @username2 |
| **Created Date** | YYYY-MM-DD |
| **Last Updated** | YYYY-MM-DD |
| **Target Build-Docs** | `build-docs/...` |
| **Impacted Domains** | `CLI` \| `MCP` \| `REST API` \| `Static UI` \| `Work Items` \| `Wiki` \| `OpenAPI` \| `SDK/API` |

---

## 1. Problem Statement & Context

### 1.1 Problem Description
What specific problem, feature set, or architectural gap are we addressing?

### 1.2 Context & Trigger
Why are we discussing this now during the product ideation stage? What background or constraints are relevant?

---

## 2. Goals & Non-Goals

### Goals
- [ ] Goal 1: ...
- [ ] Goal 2: ...

### Non-Goals
- Deliberately out of scope item 1.
- Deliberately out of scope item 2.

---

## 3. Token Optimization & Performance Impact
*`tosh` prioritizes minimizing LLM token consumption and maximizing development velocity through local processing.*

- **Context Window & Token Economics**: How does this design impact input/output tokens? Does it avoid loading unneeded documentation?
- **Speed & Latency**: Does this enable local parsing (e.g. XPath / XHTML queries) or fast offline command execution?

---

## 4. Proposed Options & Trade-Off Analysis

### Option A: [Option Name]
- **Summary**: Concise description of this approach.
- **Pros**:
  - Point 1
  - Point 2
- **Cons**:
  - Point 1
  - Point 2
- **Token / Latency Overhead**: Analysis of costs.
- **Complexity**: Low / Medium / High.

### Option B: [Option Name]
- **Summary**: Concise description of this approach.
- **Pros**:
  - Point 1
  - Point 2
- **Cons**:
  - Point 1
  - Point 2
- **Token / Latency Overhead**: Analysis of costs.
- **Complexity**: Low / Medium / High.

---

## 5. Open Questions & Spikes

- [ ] **Q1**: Description of question / unknown. *(Owner: @user)*
- [ ] **Q2**: Description of question / spike task. *(Owner: @user)*

---

## 6. Discussion Log & Meeting Notes

- **YYYY-MM-DD** (@user): Initial topic proposal created.
- **YYYY-MM-DD** (@user1, @user2): Notes on architectural review, trade-off feedback, or team debate.

---

## 7. Decision & Rationale
*(Complete when updating status to `DECIDED`)*

- **Decision**: Selected approach (e.g., Option A, Option B, or Hybrid).
- **Core Rationale**: Why was this chosen over the alternatives?
- **Accepted Trade-offs**: What limitations or additional complexities did we consciously accept?
- **Decision Date**: YYYY-MM-DD
- **Sign-off**: @stakeholder1, @stakeholder2

---

## 8. Build-Docs Conversion Plan
*(Complete during transition from `DECIDED` to `GRADUATED`)*

### 8.1 Target Build-Docs Destinations
- [ ] Destination: `build-docs/...` (e.g. `build-docs/cli/README.md`)

### 8.2 Specification Authoring Checklist
- [ ] Drafted normative, prescriptive technical specifications.
- [ ] Verified compliance with [`build-docs/README.md`](../build-docs/README.md) rules:
  - [ ] Content represents the **current state** of the design.
  - [ ] Content is **strictly void** of references to past decisions, debate, or rejected alternatives (those remain here in this topic).
- [ ] Added entry to the `## Revisions` table in the target build-doc referencing this `TOPIC-###`.
- [ ] Updated status in this topic to `GRADUATED`.
- [ ] Updated Topic Registry table in [`topic-registry.md`](topic-registry.md).
