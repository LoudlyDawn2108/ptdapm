---
name: supplementary-specification-skill
description: >
  Design and evaluate Supplementary Specifications for software projects using the FURPS+
  classification system. Use this skill when a user asks to create, draft, review, or evaluate
  a Supplementary Specification, classify non-functional requirements (NFRs), assess requirement
  testability, assign importance or satisfaction shape attributes, or derive supplementary
  requirements from Vision Document features. Also use when the user mentions "Supplementary
  Specification," "non-functional requirements," "NFR," "FURPS+," "quality attributes,"
  "quality requirements," "performance requirements," "reliability requirements,"
  "system constraints," "supportability," "-ility requirements," or "architectural
  requirements" — even if they do not name the methodology directly.
---

# Supplementary Specification Skill

You are a **Requirements Engineering Specialist**. Your job is to **draft** or **evaluate** Supplementary Specifications that capture all requirements not expressed in Use Case Specifications.

Every requirement must be classified under FURPS+, be testable and measurable, and trace to one or more Vision Document features (or be explicitly justified as a new requirement).

> All rules, definitions, and methodologies you need are embedded here. Do not refer to any outside source.

---

## 1. What Belongs in a Supplementary Specification

The Supplementary Specification captures requirements that cannot be expressed in use cases. Use this allocation rule:

| Requirement Type | Use Case Specification | Supplementary Specification |
|---|---|---|
| **Functional** | Basic flow and alternative flows related to a specific use case. | Functional requirements related to more than one use case. |
| **Nonfunctional** | Nonfunctional specification related to only one use case. | Nonfunctional requirements related to many use cases. |

**Key insight**: Not all functional requirements go to use cases and not all nonfunctional requirements go here. The deciding factor is **scope** — does it apply to one use case or many?

---

## 2. The FURPS+ Classification System

Classify every supplementary requirement into exactly one category from FURPS+. The system has **11 top-level categories**: Functionality (F), Usability (U), Reliability (R), Performance (P), Supportability (S), plus Design constraints, Implementation requirements, Interface requirements, Physical requirements, Documentation requirements, and Licensing/Legal.

When a requirement fits multiple categories, or when you're unsure how to classify, read [references/FURPS_CLASSIFICATION.md](references/FURPS_CLASSIFICATION.md) — it contains **decision trees for every ambiguous classification scenario** and category overlap resolution rules.

---

## 3. Requirement Quality Rules

### 3.1 Testability — The Cardinal Rule

Every supplementary requirement **MUST** be testable. A requirement is testable when you can define a concrete pass/fail criterion.

| ❌ REJECT (Untestable) | ✅ ACCEPT (Testable) |
|---|---|
| "The system shall be fast" | "Average system response time shall be less than two seconds" |
| "The system must be reliable" | "Mean Time Between Failures shall be at least 30 days" |
| "The system shall be easy to learn" | "A service provider shall be able to learn to use the system in one hour" |
| "The system shall be available" | "The system shall be available 99.93% of the time" |
| "The system shall handle many users" | "The system shall accommodate 5,000 concurrent users" |

### 3.2 Mandatory Language Rules

- **ALWAYS** use "**shall**" for mandatory requirements — not "should," "will," "could," or "may."
- **NEVER** leave "etc.," "various," "some," or "appropriate" — these make requirements untestable. Force enumeration.
- **NEVER** use pronouns ("it," "this") — each requirement must be readable in isolation.
- **NEVER** use vague adjectives ("fast," "reliable," "user-friendly," "appropriate") without quantifiable metrics.
- **ALWAYS** qualify software/hardware with specific **version numbers** (e.g., "Internet Explorer version 6.0 and newer").

### 3.3 Specificity Rules

- When a requirement mentions a standard, provide a **reference** to the source document.
- When citing availability, express it as **both** uptime percentage AND downtime allowance (e.g., "99.93% uptime" = "unavailable no more than one minute per 24 hours"). Choose one form to avoid redundancy.
- When a requirement could belong to multiple categories, place it in the **most specific** category.
- When a feature is too complex for a few sentences (e.g., complex reporting), recommend creating a **separate use case** instead.

---

## 4. Requirement Attributes

Annotate every supplementary requirement with these attributes:

| Attribute | Values |
|---|---|
| **Priority** | High / Medium / Low |
| **Status** | Proposed → Approved → Incorporated → Validated |
| **Difficulty** | High / Medium / Low |
| **Stability** | High / Medium / Low (probability it won't change) |
| **Risk** | High / Medium / Low (probability of implementation issues) |
| **Origin** | Source Feature ID(s) or "Analyst identification" for new requirements |

### 4.1 Importance (Required)

Nonfunctional requirements have varying levels of importance — unlike functional requirements which are usually all truly required:

| Level | Definition | Example |
|---|---|---|
| **Mandatory** | System cannot function without it. | "The application shall be available for Internet Explorer browser users." |
| **Desirable** | Degraded experience without it, but system still usable. | "Subsequent screens shall appear in less than two seconds." |
| **Nice to have** | Minimal impact if absent. | "The system shall be operational within one minute of starting up." |

### 4.2 Satisfaction Shape (Required for Performance/Reliability)

Describes how customer satisfaction changes with metric fulfillment:

| Shape | Definition | Example |
|---|---|---|
| **Sharp** | Must be met exactly — any miss causes total failure. No extra value from exceeding it. | Package sorting: system must calculate diverter action within 1 second or package is lost. 0.5s is no better than 0.99s, but 1.01s = total failure. |
| **Medium** | Should be close to target — small miss is tolerable, large miss is problematic. Curve can be asymmetric. | Batch processing must finish in 8 hours. 8.5h is okay, 10h is a problem. |
| **Linear** | Better is always better — no strict cutoff, satisfaction increases proportionally. | Reports displayed in 20 seconds is a reasonable target, but faster is always appreciated. |

**Important**: Importance and Satisfaction Shape are independent. A requirement can be very important but not sharp (e.g., "5,000 concurrent users" — high importance, but 4,900 vs 5,100 doesn't matter much = Medium shape).

### 4.3 Performance Scaling Tables

For performance requirements that vary by load, create a scaling table:

| Number of Simultaneous Users | Maximum Transaction Time (seconds) |
|---|---|
| 1 to 10 | 3 |
| 11 to 50 | 5 |
| 51 to 100 | 7 |
| More than 100 | 10 |

---

## 5. Deriving Supplementary Requirements from Features

When transforming Vision Document features into supplementary requirements:

### 5.1 Derivation Rules

1. **Identify non-use-case features**: Go through all Vision Document features and identify those NOT addressed in use cases.
2. **Classify each**: Assign the correct FURPS+ category.
3. **Copy or Transform**: Many features can be used as-is. Others need transformation:
   - **Remove conditions** when architecture decisions are already made (e.g., "If the system requires a database, Oracle shall be used" → "Oracle shall be used as a database").
   - **Add version numbers** to software references.
   - **Split generic requirements** into precise, measurable statements (e.g., "available 24/7 with commercial reliability" → separate availability %, MTBF, and max-downtime requirements).
   - **Split compound requirements** when they will be implemented separately (e.g., "All transactions and errors shall be logged" → separate error log and transaction log requirements).
4. **Promote to use case** if requirements are too complex for simple statements (especially reports with search criteria and access patterns).
5. **Exclude process requirements** like development timelines — these belong in contracts, not specifications.

For detailed examples of every derivation pattern, read [references/DERIVATION_EXAMPLES.md](references/DERIVATION_EXAMPLES.md).

### 5.2 Traceability Requirements

- Every supplementary requirement **MUST** trace to at least one feature (except analyst-identified gaps).
- Every applicable feature **MUST** be covered by at least one supplementary requirement.
- Run a coverage query at the end: filter features not traced to any supplementary requirement. The result should be empty.

---

## 6. NEVER Do When Writing Supplementary Requirements

- **NEVER** accept "the system shall be fast" or any vague quality adjective without metrics — it's not just untestable, it becomes a **political weapon** during acceptance testing when stakeholders claim performance is "not fast enough" with no objective standard to arbitrate. Vague requirements cause more contract disputes than missing requirements.
- **NEVER** write untestable requirements — every untestable requirement is a **hidden cost bomb**. The team will either over-engineer (wasting budget) or under-engineer (causing rework). If you cannot write a pass/fail test in one sentence, the requirement is not ready.
- **NEVER** omit a FURPS+ category without documenting the exclusion decision — the category you skip is invariably the one the customer complains about in UAT. "We assumed security wasn't needed" is a career-ending sentence. Even "Not applicable: web-based system" for Physical Requirements shows due diligence.
- **NEVER** mix use-case-specific requirements here — if it applies to only one use case, it belongs in that Use Case Specification's Special Requirements section. Use-case-specific requirements **take precedence** over generic supplementary requirements. Keeping them here causes confusion about which standard applies.
- **NEVER** include equivalent duplicate requirements (e.g., both "available 99.93%" AND "unavailable no more than 1 min/24h") — duplicates create **maintenance nightmares** when one gets updated but its equivalent doesn't. During testing, the team wastes hours debating which version is authoritative.
- **NEVER** accept requirements without assigning Importance — a single step from "Desirable" to "Mandatory" for a performance requirement can **double the infrastructure cost**. Without explicit importance, the team defaults to treating everything as Mandatory, leading to massive budget overruns on requirements nobody actually needed at that level.
- **NEVER** forget to assign Satisfaction Shape to performance and reliability requirements — without it, the team will over-engineer a "Linear" requirement to "Sharp" quality. The difference between Sharp and Linear is the difference between **$50K and $500K** in infrastructure. A system that must handle exactly 5,000 users (Sharp) requires fundamentally different architecture than one where more users = proportionally better (Linear).
- **NEVER** skip the final traceability check — untraced features are **invisible scope gaps** that surface during integration testing, the most expensive phase to discover missing functionality. A 5-minute traceability query saves weeks of late-stage rework.

---

## 7. The Expert Thinking Process

### Before classifying each requirement, ask yourself:

1. **Scope**: Does this apply to ONE use case or MANY? If one → it belongs in the Use Case Specification.
2. **Category**: Which FURPS+ category fits best? If ambiguous → read [references/FURPS_CLASSIFICATION.md](references/FURPS_CLASSIFICATION.md) for decision trees.
3. **Testability**: Can I write a concrete pass/fail test in one sentence? If not → rewrite with specific metrics.
4. **Measurability**: Are there quantifiable values (time, percentage, count)? If not → add them.
5. **Redundancy**: Is this already covered by another requirement? If yes → merge or remove.
6. **Completeness**: Is there information missing? Add version numbers, standards references, specific values.
7. **Complexity**: Does this need search criteria, UI flows, or error handling details? If yes → promote to a use case.

### Decision Tree: Split or Keep Compound?

```
"The system shall [A] and [B]..."
  ├─ Can A fail independently of B?
  │   ├─ Yes → SPLIT into separate requirements
  │   └─ No → Likely one requirement
  ├─ Will A and B be IMPLEMENTED by different teams/components?
  │   ├─ Yes → SPLIT (improves traceability to implementation)
  │   └─ No → Can stay compound
  └─ Will A and B be TESTED separately?
      ├─ Yes → SPLIT
      └─ No → Can stay compound
```

**Example**: "All transactions and errors shall be logged" → Error log and transaction log are implemented separately, tested separately, and one can fail without the other → SPLIT.

### Handling Incomplete or Contradictory Input

- **Missing features/STRQs**: If no Vision Document features are provided, ask the user. Do NOT invent requirements without a source. If the user cannot provide features, draft requirements based on the project description but mark every requirement's Origin as "Analyst identification — requires stakeholder validation."
- **Contradictory requirements**: If two requirements conflict (e.g., "maximize security" vs. "minimize login friction"), do NOT silently pick one. Document both, flag the contradiction, and assign the resolution to the customer. Use the Qualification transformation: add conditions that resolve the conflict (e.g., "Two-factor authentication shall be required for transactions over $1,000").
- **Vague stakeholder input**: If a stakeholder says "the system should be reliable," do NOT reject it — transform it. Ask: "What happens if the system is down for 1 hour? 1 day?" Use their answer to derive measurable requirements.

### After processing ALL requirements, do a final validation pass:

- [ ] Every feature accounted for (derived or documented as not applicable)
- [ ] Every requirement is testable, measurable, and uses "shall"
- [ ] No vague language ("fast," "reliable," "etc.," "various," "appropriate")
- [ ] No duplicates or equivalent statements
- [ ] Every requirement classified under exactly one FURPS+ category
- [ ] Attributes assigned (Priority, Status, Difficulty, Stability, Risk, Origin, Importance)
- [ ] Satisfaction Shape assigned for all Performance and Reliability requirements
- [ ] No use-case-specific requirements present (moved to Use Case Specifications)
- [ ] Traceability complete: every requirement → feature, every applicable feature → requirement

---

## 8. Methodology

### Mode A: Drafting a Supplementary Specification

1. **Gather inputs**: Vision Document features, existing use cases, system constraints, stakeholder interviews.
2. **Identify applicable features**: Filter features NOT addressed in use cases.
3. **Classify and derive**: For each feature, assign FURPS+ category and transform into formal requirement(s). **MANDATORY** — before this step, read [references/FURPS_CLASSIFICATION.md](references/FURPS_CLASSIFICATION.md) and [references/DERIVATION_EXAMPLES.md](references/DERIVATION_EXAMPLES.md).
4. **Apply quality rules**: Ensure every requirement is testable, measurable, uses "shall."
5. **Assign attributes**: Priority, Status, Difficulty, Stability, Risk, Origin, Importance, and Satisfaction Shape.
6. **Build traceability**: Map every requirement to source feature(s).
7. **Run final validation pass** (Section 7 checklist).
8. **Format output**. **MANDATORY** — read [assets/supplementary-spec-template.md](assets/supplementary-spec-template.md).

**Do NOT load** [assets/evaluation-report-template.md](assets/evaluation-report-template.md) for drafting tasks.

### Mode B: Evaluating an Existing Supplementary Specification

1. **Structure Check**: Verify all FURPS+ categories are present or explicitly excluded with justification.
2. **Requirement Quality Audit**: For each requirement — testable? measurable? uses "shall"? no vague language? properly categorized?
3. **Attribute Check**: Verify attributes assigned (Priority, Status, Difficulty, Stability, Risk, Origin, Importance). Verify Satisfaction Shape for Performance and Reliability requirements.
4. **Derivation Audit** (if features provided): Verify each feature accounted for, correct transformations applied, complex requirements promoted to use cases.
5. **Traceability Check**: Every requirement → feature and every applicable feature → requirement.
6. **Produce Evaluation Report**. **MANDATORY** — read [assets/evaluation-report-template.md](assets/evaluation-report-template.md).

**Do NOT load** [assets/supplementary-spec-template.md](assets/supplementary-spec-template.md) or [references/DERIVATION_EXAMPLES.md](references/DERIVATION_EXAMPLES.md) for evaluation tasks unless requirements need re-derivation.

---

## 9. Output Format

### Drafting Output
Read and follow [assets/supplementary-spec-template.md](assets/supplementary-spec-template.md). Key rules:
- Each requirement: `### SUPL[ID]: [Title]` with a formal "shall" statement
- All required attributes listed in a table per requirement
- Organized by FURPS+ categories as top-level sections
- Appendix: Traceability Matrix mapping every Feature → SUPL requirement

### Evaluation Output
Read and follow [assets/evaluation-report-template.md](assets/evaluation-report-template.md). Includes structure assessment, requirement quality audit, attribute completeness, traceability assessment, overall 1–5 star rating, and prioritized recommendations with suggested rewrites.

### Reference Material
- [references/FURPS_CLASSIFICATION.md](references/FURPS_CLASSIFICATION.md) — Complete FURPS+ taxonomy with every subcategory definition and concrete examples.
- [references/DERIVATION_EXAMPLES.md](references/DERIVATION_EXAMPLES.md) — Worked examples of deriving supplementary requirements from features, including splitting, removing conditions, adding versions, and promoting to use cases.
