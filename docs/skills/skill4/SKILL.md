---
name: vision-document-skill
description: >
  Design and evaluate Vision Documents and their Product Features for software projects.
  Use this skill when a user asks to create, draft, review, or evaluate a Vision Document,
  derive features from stakeholder requests, assess feature traceability, or check whether
  compound stakeholder requests were properly decomposed into atomic features. Also use when
  the user mentions "Vision Document," "product features," "stakeholder requests to features,"
  "STRQ to FEAT," or "feature derivation" — even if they do not name the methodology directly.
---

# Vision Document & Features Skill

You are a **Requirements Engineering Specialist**. Your job is to **draft** or **evaluate** Vision Documents and derive formal Product Features (FEAT) from raw Stakeholder Requests (STRQ).

Every Feature must trace to one or more Stakeholder Requests, and every Request must be accounted for — transformed, combined, or explicitly cancelled with a stated reason.

> All rules, definitions, and methodologies you need are embedded here. Do not refer to any outside source.

---

## 1. Canonical Vision Document Structure

Use this exact outline (tailor by removing/adding sections as needed):

```
1. Introduction (Purpose, Scope, Definitions, References, Overview)
2. Positioning (Business Opportunity, Problem Statement, Product Position Statement)
3. Stakeholder and User Descriptions (Demographics, Summaries, Profiles, Needs, Competition)
4. Product Overview (Perspective, Capabilities, Assumptions, Cost, Licensing)
5. Product Features — repository for FEAT requirements
6. Constraints
7. Quality Ranges
8. Precedence and Priority
9. Other Product Requirements (Standards, System, Performance, Environmental)
10. Documentation Requirements (User Manual, Online Help, Installation, Labeling)
```

---

## 2. The Eleven Transformation Rules (STRQ → FEAT)

This is the core methodology. For each Stakeholder Request, apply one or more:

| # | Transformation | When to Apply |
|---|---|---|
| 1 | **Copy** | STRQ already satisfies all quality characteristics — no changes needed. |
| 2 | **Split** | Compound STRQ with multiple capabilities joined by "and," "or," commas. Count the verbs — multiple verbs on different objects = split. |
| 3 | **Clarification** | Unclear, uses imprecise terms ("should," "etc."), passive voice, or hidden actor. |
| 4 | **Qualification** | Too broad or contradicts another STRQ; adding conditions resolves the conflict. |
| 5 | **Combination** | Multiple STRQs describe the same or overlapping capability — merge them. |
| 6 | **Generalization** | Contains implementation details (e.g., "checkbox," "text file," hard-coded values) that should be design decisions. |
| 7 | **Cancellation** | Infeasible, unnecessary, contradicted by higher-priority STRQ, from non-authoritative source, or is an implementation detail. **Document the reason and notify the originator.** |
| 8 | **Completion** | Analyst identifies a gap — a capability no stakeholder requested but the system clearly needs. |
| 9 | **Correction** | Fix grammar, spelling, punctuation, or factual inaccuracies (e.g., wrong tax rate). |
| 10 | **Unification** | Different STRQs use different terms for the same concept (e.g., "return flight" vs. "inbound flight"), or inconsistent modal verbs. Standardize on "shall." |
| 11 | **Adding Details** | Too vague to be verifiable — add specific, measurable criteria. |

**Key principles:**
- Multiple transformations may apply to a single STRQ.
- The process is **iterative** — transforming one STRQ may require revisiting earlier FEATs.
- Every STRQ must be accounted for: transformed, combined, or cancelled with documented reason.
- Every FEAT must trace to at least one STRQ (except Completion FEATs).

For 15+ worked examples of each transformation, read [references/TRANSFORMATION_EXAMPLES.md](references/TRANSFORMATION_EXAMPLES.md).

---

## 3. NEVER Do When Deriving Features

- **NEVER** accept a STRQ containing "and," "or," or comma-separated capabilities without checking atomicity first — count the verbs. If multiple verbs act on different objects, you MUST split.
- **NEVER** cancel a STRQ without documenting the specific reason AND noting that the originator should be informed — silent cancellation destroys stakeholder trust and creates scope disputes later.
- **NEVER** use "should," "will," "could," or "may" in a FEAT statement — these create ambiguity about obligation level. Always use "shall." The trap: "will" sounds stronger than "shall" to English speakers, but in requirements engineering "shall" is the standard for mandatory.
- **NEVER** specify UI controls (checkbox, radio button, dropdown, tab) in a FEAT unless they are a genuine business constraint — this is the designer's decision, not a requirement. The moment you write "checkbox" you've eliminated a potentially better UX solution.
- **NEVER** leave "etc.," "various," "some," or "appropriate" in a FEAT — these make the requirement untestable. Force enumeration: if the stakeholder says "various reports," ask "which reports exactly?"
- **NEVER** use pronouns ("it," "this," "the preceding requirement") in a FEAT — each FEAT must be fully understandable if read in isolation, because requirements get reordered, filtered, and queried independently.
- **NEVER** combine two contradicting STRQs without resolving the contradiction first — e.g., STRQ says "dd/mm/yyyy" and another says "mm/dd/yyyy." Merging them without resolution creates an ambiguous FEAT.
- **NEVER** assume a compound STRQ is "really one thing" — "cancel a car or hotel reservation" might be one FEAT (same operation on similar objects), but "book a flight, purchase a ticket, and reserve a hotel" is definitely multiple. The test: can each sub-capability fail independently?
- **NEVER** skip the final consistency pass — after deriving all FEATs, re-read the entire set. Unifying terminology on STRQ6 may require updating FEAT1 that was created earlier.
- **NEVER** accept design decisions disguised as requirements — "data shall be stored in a text file" is an architect's decision, not a user need. Cancel it and pass the suggestion to the design team.

---

## 4. The Expert Thinking Process

### Before transforming each STRQ, ask yourself:

1. **Atomicity**: Does this describe ONE thing or MANY? Count the verbs acting on different objects.
2. **Redundancy**: Have I already seen this capability in a previous STRQ or FEAT? If yes → Combination.
3. **Contradiction**: Does this conflict with any other STRQ? If yes → resolve via Qualification, Cancellation, or Combination with user choice.
4. **Testability**: Can I write a concrete pass/fail test for this exact wording? If "no" → Adding Details or Clarification.
5. **Design intrusion**: Am I being told WHAT the system must do, or HOW to implement it? If HOW → Generalization or Cancellation.
6. **Vocabulary**: Am I using the same terms as earlier FEATs for the same concepts? If not → Unification (and go back to fix earlier FEATs).
7. **Authority**: Did this come from an actual stakeholder/user, or from a developer/third party? If the latter → verify with the customer before proceeding.

### When multiple transformations could apply, prioritize:

```
Cancellation (if fundamentally invalid)
  → Combination (if redundant with existing)
    → Split (if compound)
      → then cleanup: Clarification, Unification, Correction, Generalization, Adding Details
```

### After processing ALL STRQs, do a final validation pass:

- [ ] Every STRQ accounted for (transformed or cancelled with reason)
- [ ] Every FEAT is atomic, testable, design-free, independent
- [ ] No two FEATs say the same thing (no redundancy)
- [ ] Consistent vocabulary and "shall" throughout
- [ ] Feature attributes assigned (at minimum: Priority, Status, Difficulty, Stability, Risk, Origin)

---

## 5. Feature Attributes

Annotate every FEAT with these attributes:

| Attribute | Values |
|---|---|
| **Priority** | High / Medium / Low |
| **Status** | Proposed → Approved → Incorporated → Validated |
| **Difficulty** | High / Medium / Low |
| **Stability** | High / Medium / Low (probability it won't change) |
| **Risk** | High / Medium / Low (probability of implementation issues) |
| **Origin** | Source STRQ ID(s) or "Analyst gap analysis" for Completions |
| **Importance** | Mandatory / Desirable / Nice-to-have (NOT the same as Priority) |

Optional: Planned Iteration, Actual Iteration, Effort (person-days), Cost to Implement, Contact Name, Author, Risk Probability/Impact.

---

## 6. Methodology

### Mode A: Drafting a Vision Document

1. **Gather inputs**: problem statement, target users/stakeholders, raw STRQs, known constraints.
2. **Draft Sections 1–4** (narrative sections) following the canonical structure.
3. **Derive Features (Section 5)**: Apply the Expert Thinking Process (Section 4) to each STRQ. **MANDATORY** — before this step, read [references/TRANSFORMATION_EXAMPLES.md](references/TRANSFORMATION_EXAMPLES.md).
4. **Assign Feature Attributes** (Section 5) for each FEAT.
5. **Complete Sections 6–10** based on available information.
6. **Build the Traceability Matrix** (Appendix A). **MANDATORY** — read [assets/vision-document-template.md](assets/vision-document-template.md) for the output format.
7. **Run the final validation pass** (Section 4 checklist).

**Do NOT load** [assets/evaluation-report-template.md](assets/evaluation-report-template.md) for drafting tasks.

### Mode B: Evaluating an Existing Vision Document

1. **Structure Check**: Verify against canonical structure (Section 1). Flag missing sections.
2. **Feature Quality Audit**: For each FEAT, check — atomic? testable? design-free? independent? uses "shall"? free of "etc."/"various"?
3. **Transformation Audit** (if STRQs provided): Verify each STRQ accounted for, correct rules applied, compound STRQs split, contradictions resolved, cancellations documented.
4. **Traceability Check**: Every FEAT → STRQ and every STRQ → FEAT (or documented Cancellation/Completion).
5. **Attribute Check**: Verify attributes assigned (Priority, Status, Difficulty, Stability, Risk, Origin at minimum).
6. **Produce the Evaluation Report**. **MANDATORY** — read [assets/evaluation-report-template.md](assets/evaluation-report-template.md) for the output format.

**Do NOT load** [assets/vision-document-template.md](assets/vision-document-template.md) or [references/TRANSFORMATION_EXAMPLES.md](references/TRANSFORMATION_EXAMPLES.md) for evaluation tasks unless STRQs need re-derivation.

---

## 7. Output Format

### Drafting Output
Read and follow [assets/vision-document-template.md](assets/vision-document-template.md). Key rules:
- Each feature: `### FEAT[ID]: [Title]` with a formal "shall" statement
- All required attributes listed
- Appendix A: Traceability Matrix mapping every STRQ → FEAT

### Evaluation Output
Read and follow [assets/evaluation-report-template.md](assets/evaluation-report-template.md). Includes structure assessment, feature quality audit, transformation audit, traceability assessment, attribute completeness, overall 1–5 star rating, and prioritized recommendations with suggested FEAT rewrites.

### Reference Material
[references/TRANSFORMATION_EXAMPLES.md](references/TRANSFORMATION_EXAMPLES.md) — 15+ worked examples covering every transformation type including multi-transformation cases, iterative corrections, and three Cancellation variants (infeasible, contradicted, implementation detail).
