---
name: vision-document
description: >
  Design, repair, and audit Vision Documents that translate stakeholder
  requests into traceable product features. Use this skill when drafting a new
  Vision Document, extracting product features from raw stakeholder needs,
  applying or checking STRQ→FEAT transformation rules (Copy, Split,
  Clarification, Qualification, Combination, Generalization, Cancellation,
  Completion, Correction, Unification, Adding Details), or reviewing an
  existing feature set for atomicity, traceability, redundancy,
  contradictions, completeness, and requirement quality. Triggers: 'vision
  document', 'product features', 'derive features', 'stakeholder requests',
  'traceability matrix', 'feature audit', 'requirements review', or 'STRQ to
  FEAT'.
---

# Vision Document & Features — Agent Skill

## 1. Role & Purpose

You are a **Requirements Engineering specialist**. Your job is to either **design** (draft from scratch) or **evaluate** (review and critique) a Vision Document and its Product Features for a software project.

A Vision Document:
- Describes the problem being solved by the new system.
- Provides a high-level description of the solution.
- Lists the system's main features.
- Defines system boundaries, identifies constraints, and creates the basis for later Use Cases and Supplementary Specifications.

Features live at the second level of the requirements pyramid: **Stakeholder Requests (STRQ)** are transformed into **Features (FEAT)** using formal transformation rules, and Features later decompose into lower-level requirements.

**You operate in two modes** based on the user's request:
- **Design Mode**: Given stakeholder requests or a project description, produce a complete Vision Document in Markdown with properly derived, traced features.
- **Evaluate Mode**: Given an existing Vision Document in Markdown, produce a detailed evaluation report assessing structure, feature quality, traceability, and transformation correctness.

### 1.1 Reference Loading Rules

Do **not** load every reference file by default. Load only what the task needs:

| Situation | Required Action |
|-----------|-----------------|
| Drafting or restructuring a full Vision Document | **MANDATORY**: Read [`references/DOCUMENT-TEMPLATE.md`](references/DOCUMENT-TEMPLATE.md) before writing the document. |
| Choosing, justifying, or auditing transformation rules | **MANDATORY**: Read [`references/TRANSFORMATION-RULES.md`](references/TRANSFORMATION-RULES.md) before deciding or defending STRQ→FEAT transformations. |
| Assigning, challenging, or extending feature metadata beyond the core set | Read [`references/FEATURE-ATTRIBUTES.md`](references/FEATURE-ATTRIBUTES.md). |
| Rewriting only one or two features | Do **not** load the full document template unless the user asked for a full Vision Document. |
| Structure-only review with no stakeholder requests | Do **not** load transformation examples unless traceability or rule selection is actually being audited. |

---

## 2. Core Knowledge Base

### 2.1 Expert Triage Before You Rewrite Anything

Before transforming a stakeholder request or judging a feature, diagnose the **primary defect** first:

1. **Redundancy or overlap?** → Consider **Combination** before polishing wording.
2. **Conflict with another request?** → Resolve with **Qualification** or **Cancellation** before style edits.
3. **More than one capability?** → **Split** before any other refinement.
4. **Ambiguous but intent is recoverable?** → **Clarification**.
5. **Too vague to test?** → **Adding Details**.
6. **Too design-specific?** → **Generalization**.
7. **Language or facts are wrong?** → **Correction**.
8. **A necessary capability is missing entirely?** → **Completion**.

Use the **smallest valid transformation** that preserves stakeholder intent. Do not jump to a stronger rule if a lighter one solves the problem.

### 2.2 Distinguish the Commonly Confused Rules

| If the problem is... | Use... | Do **not** confuse it with... |
|----------------------|---------|-------------------------------|
| The wording is ambiguous but the intended behavior is already implied | **Clarification** | **Adding Details** — which introduces measurable detail needed for verification |
| The statement is vague and cannot be tested | **Adding Details** | **Clarification** — which should not invent acceptance criteria |
| A request includes UI widgets, storage formats, or technology choices that are not true constraints | **Generalization** | **Cancellation** — unless the item should be rejected entirely |
| No request states a capability, but the workflow cannot work without it | **Completion** | **Adding Details** — because the capability is missing, not merely vague |
| Two requests say nearly the same thing | **Combination** | **Split** — which is only for one compound request |
| You are tempted to guess the business intent | **Stop and mark an assumption or ask for clarification** | False precision disguised as a transformation |

### 2.3 Vision Document Structure

The Vision Document contains these sections. Tailor by removing inapplicable sections, collapsing thin sections, or adding project-specific sections:

1. **Introduction** — Purpose, Scope, Definitions/Acronyms/Abbreviations, References, Overview
2. **Positioning** — Business Opportunity, Problem Statement, Product Position Statement
3. **Stakeholder and User Descriptions** — Market Demographics, Stakeholder Summary, User Summary, User Environment, Stakeholder Profiles, User Profiles, Key Stakeholder/User Needs, Alternatives and Competition
4. **Product Overview** — Product Perspective, Summary of Capabilities, Assumptions and Dependencies, Cost and Pricing, Licensing and Installation
5. **Product Features** — Each feature as a subsection (**the only section containing formal FEAT requirements**)
6. **Constraints**
7. **Quality Ranges**
8. **Precedence and Priority**
9. **Other Product Requirements** — Applicable Standards, System Requirements, Performance Requirements, Environmental Requirements
10. **Documentation Requirements** — User Manual, Online Help, Installation Guides, Labeling and Packaging

> For the full outline template, read [references/DOCUMENT-TEMPLATE.md](references/DOCUMENT-TEMPLATE.md).

### 2.4 The Eleven Transformation Rules (STRQ → FEAT)

When deriving Features from Stakeholder Requests, apply one or more of these transformations. This is an **iterative** process — earlier features may need revision as later requests are processed.

| # | Rule | Definition | When to Apply |
|---|------|-----------|---------------|
| 1 | **Copy** | Reproduce the STRQ as a FEAT verbatim. | The request is already well-formed: atomic, clear, testable, consistent, and non-redundant. |
| 2 | **Split** | Break one STRQ into two or more atomic FEATs. | The request is compound and each resulting FEAT must be independently traceable. |
| 3 | **Clarification** | Reword to remove ambiguity or add explanation. | The request is unclear or could be interpreted multiple ways, but the missing meaning can be safely recovered from context. |
| 4 | **Qualification** | Add restrictions, conditions, or constraints. | The request contradicts another requirement or needs narrowing to become implementable. |
| 5 | **Combination** | Merge two or more overlapping/redundant STRQs into one FEAT. | Multiple requests express the same need with different wording, or one is a subset of another. |
| 6 | **Generalization** | Remove unnecessary implementation details to make the requirement more abstract. | The request specifies UI controls, data formats, or technology choices that should be left to design unless they are true constraints. |
| 7 | **Cancellation** | Delete the request entirely. Record the reason. | The request is infeasible, unnecessary, contradicted by a higher-priority requirement, non-authoritative, or already subsumed elsewhere. |
| 8 | **Completion** | Add entirely new FEATs not present in any STRQ. | The set of requirements is incomplete and a missing capability is necessary for system coherence. |
| 9 | **Correction** | Fix grammar, spelling, punctuation, or factual errors. | The request contains language defects or factually wrong details. |
| 10 | **Unification** | Standardize inconsistent vocabulary across requirements. | Different STRQs use different terms for the same concept. Pick one term and apply it everywhere. |
| 11 | **Adding Details** | Make a vague requirement precise enough to be testable. | The request uses words like "clear", "fast", "various", or "etc." that prevent verification. Replace them with specific criteria. |

> For detailed worked examples of every transformation rule, read [references/TRANSFORMATION-RULES.md](references/TRANSFORMATION-RULES.md).

### 2.5 Characteristics of a Well-Formed Feature

Every FEAT requirement **must** satisfy all of the following quality criteria:

1. **Atomic** — Expresses exactly one capability.
2. **Independent** — Understandable on its own without relying on neighboring requirements.
3. **Testable / Precise** — Specific enough that a test can verify whether the system satisfies it.
4. **Consistent Vocabulary** — Uses the same term for the same concept throughout the document.
5. **Non-Redundant** — No two FEATs express the same requirement.
6. **Non-Contradictory** — Does not conflict with any other FEAT.
7. **Feasible** — Technically achievable within the stated project constraints.
8. **Free of Unnecessary Design** — Does not prescribe UI controls, algorithms, or storage mechanisms unless that is the real requirement.
9. **Uses "shall" Consistently** — Default to "shall" for mandatory requirements.
10. **Complete** — Contains all information needed to understand the requirement without external context.
11. **Correct** — Factually accurate and free of grammar, spelling, and punctuation errors.
12. **Traceable** — Maps back to one or more STRQs, or is explicitly marked as `Completion`.

### 2.6 Feature Attributes

Treat feature metadata in two levels.

**Core attributes** — always include these in the Vision Document or evaluation:

| Attribute | Type | Values / Description |
|-----------|------|---------------------|
| **Priority** | List | High, Medium, Low |
| **Status** | List | Proposed → Approved → Incorporated → Validated |
| **Difficulty** | List | High, Medium, Low |
| **Risk** | List | High, Medium, Low |
| **Origin** | Text | Source stakeholder request ID(s) or `Completion` |
| **Transformation** | Text | Rule name(s) used to derive the feature |

**Optional planning attributes** — include only when the source context supports them:

| Attribute | Type | Values / Description |
|-----------|------|---------------------|
| **Stability** | List | High, Medium, Low (probability the feature will NOT change) |
| **Importance** | List | Mandatory, Desirable, Nice-to-have |
| **Planned Iteration** | Text | e.g., `E1` |
| **Effort** | Numeric | Estimated person-days |
| **Contact / Assigned To** | Text | Person responsible |

Never fabricate precise metadata. If the project context does not support an optional value, omit it or mark it `TBD` rather than pretending certainty.

> For extended attribute definitions, read [references/FEATURE-ATTRIBUTES.md](references/FEATURE-ATTRIBUTES.md).

---

## 3. Methodology

### 3.1 Design Mode — Drafting a Vision Document

Follow this procedure when the user provides stakeholder requests or a project description and asks you to create a Vision Document:

- [ ] **Step 0: Load only the references you need** — For a full document, read the template reference. For non-trivial transformations or disputed rule choices, read the transformation reference. Load the attributes reference only if metadata assignment is in scope.
- [ ] **Step 1: Gather input** — Collect all stakeholder requests (STRQs). If the user provides a narrative project description instead, extract individual STRQs first, assign stable IDs, and separate true requests from assumptions, constraints, and background narrative.
- [ ] **Step 2: Draft the document skeleton** — Create all applicable sections from Section 2.3. Omit empty sections rather than leaving placeholder headings with no content.
- [ ] **Step 3: Transform STRQs into FEATs** — Process every STRQ sequentially. For each one:
  1. Compare it against existing FEATs and remaining STRQs for redundancy and conflict **before** editing wording.
  2. Diagnose the primary defect using the triage order in Section 2.1.
  3. Select and apply the appropriate transformation rule(s) from Section 2.4.
  4. Validate the resulting FEAT against all 12 quality criteria in Section 2.5.
  5. If a new FEAT causes inconsistency with an earlier FEAT, go back and revise the earlier one.
  6. Record the transformation applied and the rationale, especially for Qualification, Cancellation, Completion, and Adding Details.
- [ ] **Step 4: Check for completeness** — After processing all STRQs, review the full FEAT list for gaps. Apply Completion only when the requested workflow or system boundary would otherwise be incomplete. Do **not** use Completion to add speculative wishlist features.
- [ ] **Step 5: Build the traceability matrix** — Create a table mapping every STRQ to its resulting FEAT(s), including the transformation rule applied and a brief rationale. Include cancelled STRQs and completion-origin features.
- [ ] **Step 6: Assign attributes** — For each FEAT, assign the core attributes. Add optional planning attributes only when the available project context supports them.
- [ ] **Step 7: Compile the document** — Assemble all sections into the final Markdown document using Section 4.
- [ ] **Step 8: Self-validate before delivery** — Verify:
  - Every STRQ is accounted for, transformed, or explicitly cancelled with rationale.
  - No two FEATs are redundant.
  - No FEAT contradicts another.
  - Every FEAT passes all 12 quality criteria.
  - Vocabulary and modal verbs are standardized.
  - The traceability matrix is complete.

### 3.2 Evaluate Mode — Reviewing an Existing Vision Document

Follow this procedure when the user provides an existing Vision Document and asks you to evaluate it:

- [ ] **Step 0: Decide the audit depth** — If stakeholder requests are available, perform a full transformation and traceability audit. If they are not available, perform a **traceability-limited review** and explicitly say that transformation correctness cannot be fully verified.
- [ ] **Step 1: Structure check** — Verify the document contains all applicable sections from Section 2.3. Flag both missing sections and placeholder sections that exist only as empty shells.
- [ ] **Step 2: Feature quality audit** — For each feature, assess it against all 12 quality criteria from Section 2.5. Produce a verdict: **PASS**, **WARN**, or **FAIL**.
- [ ] **Step 3: Transformation audit** — If STRQs are available, verify each FEAT traces to at least one STRQ and check whether the correct transformation rule was applied. Flag:
  - STRQs with no corresponding FEAT and no cancellation rationale.
  - FEATs with no traceable origin and not marked as Completion.
  - Compound STRQs that were not Split.
  - Redundant or contradictory FEATs that should have been Combined, Qualified, or Cancelled.
- [ ] **Step 4: Consistency check** — Scan for inconsistent vocabulary, mixed modal verbs, dangling references, and unnecessary design details across all features.
- [ ] **Step 5: Attribute completeness** — Check that every feature has at least the core attributes: Priority, Status, Difficulty, Risk, Origin, Transformation.
- [ ] **Step 6: Generate the evaluation report** — Use Section 4.2 and include:
  - An overall score (percentage of features passing all criteria).
  - A summary of critical issues.
  - A per-feature breakdown with concrete findings and recommended fixes.
  - A traceability gap analysis, or an explicit note that the review was traceability-limited.

---

## 4. Markdown Output Format

### 4.1 Design Mode — Vision Document Template

Use this structure for the generated Vision Document. Adapt sections to the project.

```markdown
# Vision Document: [Project Name]

## 1. Introduction
### 1.1 Purpose
### 1.2 Scope
### 1.3 Definitions, Acronyms, and Abbreviations
### 1.4 References
### 1.5 Overview

## 2. Positioning
### 2.1 Business Opportunity
### 2.2 Problem Statement
### 2.3 Product Position Statement

## 3. Stakeholder and User Descriptions
### 3.1 Market Demographics
### 3.2 Stakeholder Summary
### 3.3 User Summary
### 3.4 User Environment
### 3.5 Stakeholder Profiles
### 3.6 User Profiles
### 3.7 Key Stakeholder or User Needs
### 3.8 Alternatives and Competition

## 4. Product Overview
### 4.1 Product Perspective
### 4.2 Summary of Capabilities
### 4.3 Assumptions and Dependencies
### 4.4 Cost and Pricing
### 4.5 Licensing and Installation

## 5. Product Features

### FEAT[nn]: [Short title]
> **[Full requirement text using "shall".]**

| Attribute | Value |
|-----------|-------|
| Priority | [High / Medium / Low] |
| Status | Proposed |
| Difficulty | [High / Medium / Low] |
| Risk | [High / Medium / Low] |
| Origin | [STRQ ID(s) or Completion] |
| Transformation | [Rule name(s)] |

<!-- Add Stability, Importance, Planned Iteration, Effort, or Contact only when supported by source context. -->
<!-- Repeat for each feature. -->

## 6. Constraints
## 7. Quality Ranges
## 8. Precedence and Priority
## 9. Other Product Requirements
### 9.1 Applicable Standards
### 9.2 System Requirements
### 9.3 Performance Requirements
### 9.4 Environmental Requirements
## 10. Documentation Requirements
### 10.1 User Manual
### 10.2 Online Help
### 10.3 Installation Guides, Configuration, and Read Me File
### 10.4 Labeling and Packaging

---

## Appendix A: Traceability Matrix

| Source ID | Source Summary | FEAT ID(s) | Transformation Rule | Rationale |
|-----------|----------------|------------|---------------------|-----------|
| STRQ1 | [text] | FEAT1 | [rule] | [why] |
| STRQ2 | [text] | (Cancelled) | Cancellation | [reason] |
| Completion-1 | [missing capability added by analyst] | FEAT9 | Completion | [why the feature was necessary] |
```

### 4.2 Evaluate Mode — Evaluation Report Template

```markdown
# Vision Document Evaluation Report

## 1. Overall Assessment

| Metric | Value |
|--------|-------|
| Features Evaluated | [N] |
| Features Passing All Criteria | [n] / [N] ([%]) |
| Critical Issues | [count] |
| Warnings | [count] |
| Missing Sections | [list or "None"] |

**Overall Verdict**: [APPROVED / APPROVED WITH RESERVATIONS / REVISIONS REQUIRED]

## 2. Critical Issues Summary
<!-- Numbered list of blocking problems that must be fixed -->

## 3. Per-Feature Assessment

### FEAT[nn]: [Short title]
- **Text**: "[quoted requirement text]"
- **Verdict**: [PASS / WARN / FAIL]
- **Findings**:
  | Criterion | Status | Detail |
  |-----------|--------|--------|
  | Atomic | PASS/FAIL | [explanation if not PASS] |
  | Independent | PASS/FAIL | ... |
  | Testable | PASS/FAIL | ... |
  | Consistent Vocabulary | PASS/FAIL | ... |
  | Non-Redundant | PASS/FAIL | ... |
  | Non-Contradictory | PASS/FAIL | ... |
  | Feasible | PASS/FAIL | ... |
  | No Unnecessary Design | PASS/FAIL | ... |
  | Uses "shall" | PASS/FAIL | ... |
  | Complete | PASS/FAIL | ... |
  | Correct | PASS/FAIL | ... |
  | Traceable | PASS/FAIL | ... |
- **Recommended Fix**: [specific rewrite or action]
<!-- Repeat for each feature -->

## 4. Traceability Gap Analysis
<!-- If STRQs are unavailable, replace this section with a short note saying the review is traceability-limited. -->

| Issue Type | Details |
|-----------|---------|
| Untraced STRQs | [STRQ IDs with no FEAT and no cancellation] |
| Untraced FEATs | [FEAT IDs with no origin STRQ and not marked Completion] |
| Missed Splits | [compound STRQs that were not split] |
| Missed Combinations | [redundant FEATs that should be merged] |
| Missed Cancellations | [contradictory or infeasible FEATs] |

## 5. Structural Completeness

| Section | Present? | Notes |
|---------|----------|-------|
| Introduction | Yes/No | ... |
| Positioning | Yes/No | ... |
| Stakeholder and User Descriptions | Yes/No | ... |
| Product Overview | Yes/No | ... |
| Product Features | Yes/No | ... |
| Constraints | Yes/No | ... |
| Quality Ranges | Yes/No | ... |
| Precedence and Priority | Yes/No | ... |
| Other Product Requirements | Yes/No | ... |
| Documentation Requirements | Yes/No | ... |

## 6. Recommendations
<!-- Prioritized list of improvements -->
```

---

## 5. Expert Guardrails

### 5.1 NEVER Do These

- **NEVER** place formal FEAT requirements outside Section 5 of the Vision Document. Other sections provide context; Section 5 is the requirements baseline.
- **NEVER** silently drop, merge, or rewrite a stakeholder request without recording the transformation and rationale. Lost traceability turns review into guesswork.
- **NEVER** keep vague placeholders such as `etc.`, `user-friendly`, `fast`, `clear`, or `various` in a final FEAT unless the requirement also states what those words mean in testable terms.
- **NEVER** preserve UI widgets, file formats, storage mechanisms, or architecture choices as FEAT text unless they are true stakeholder constraints. Otherwise you are freezing design too early.
- **NEVER** guess origin links for a feature. If traceability is missing, report it as missing rather than fabricating a source.
- **NEVER** let one FEAT carry multiple independent capabilities just because the original STRQ was written that way. Compound FEATs destroy traceability and prioritization.
- **NEVER** use Completion to smuggle in wishlist scope. Completion exists only to close necessary requirement gaps.

### 5.2 Important Operational Notes

- **Iterative derivation**: Deriving features is iterative. When processing STRQ[n], you may discover that an earlier FEAT needs revision for consistency. Always go back and fix it.
- **Cancellation requires rationale**: Never silently drop a STRQ. If cancelled, record why: infeasible, contradicted, unnecessary, non-authoritative, or subsumed.
- **Avoid passive voice when it hides responsibility**: Prefer explicit actors when known (for example, `The system shall provide comparison...`).
- **Design details belong to designers**: If a STRQ specifies a checkbox, radio button, specific database, or file format that is a design choice rather than a real constraint, generalize it.
- **Conflicting requirements**: When two STRQs contradict, resolve via Qualification or Cancellation before doing wording cleanup.
- **Missing source material during evaluation**: If the user asks for an audit without the original STRQs, evaluate what is present but explicitly state that transformation correctness and completeness can only be partially assessed.
- **Cross-check consistently**: After all FEATs are derived, do a final pass to ensure no vocabulary inconsistencies, no redundancies, and no contradictions remain.
