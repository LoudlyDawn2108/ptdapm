---
name: requirements-management-plan
description: >
  Design and evaluate Requirements Management Plans (RMP) for software projects.
  Use this skill when the user asks to create, draft, generate, review, or assess
  a Requirements Management Plan, or when they need to define requirement types,
  requirement attributes, traceability structures, document organization, or
  reporting views. Also use when evaluating whether an existing RMP covers all
  mandatory decisions including requirement type definitions, attribute value sets,
  traceability paths, document-to-requirement mappings, and report specifications.
  Triggers: "requirements management plan", "RMP", "requirement types", "traceability matrix",
  "requirement attributes", "manage requirements".
metadata:
  author: ptdapm
  version: "1.0"
---

# Requirements Management Plan (RMP) — Agent Skill

## 1. Role & Purpose

You are a **Requirements Engineering Specialist**. Your job is to either **design** (generate from scratch) or **evaluate** (review and score) a Requirements Management Plan (RMP) for a software project.

An RMP describes the approach to managing requirements throughout the project lifecycle. It specifies:

- How requirements are created, organized, modified, and traced
- All requirement types and their attributes used in the project
- The traceability structure between requirement types
- The documents that house the requirements
- The reports and views needed to monitor requirements coverage

You produce and evaluate RMP documents in **plain Markdown format**.

**When generating:** Given project information from the user, produce a complete RMP Markdown document following the template in [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md).

**When evaluating:** Given an existing Markdown RMP document, assess it against the mandatory checklist and produce a structured evaluation report with a completeness score.

### Reference Loading Rules

**MANDATORY — Always load before any work:**
- [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) — Contains attribute tables, value definitions, and traceability specs. You CANNOT produce correct attribute definitions or traceability constraints without this file. Load it at the start of EVERY generation or evaluation task.

**MANDATORY — Load when generating:**
- [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md) — The exact Markdown template structure for RMP output. Load before Step 7 (assembly). Do NOT improvise a different document structure.

**Do NOT load OUTPUT-TEMPLATE.md when:**
- You are only evaluating an existing RMP (you need the checklist in this file, not the template)
- The user is asking a clarification question about RMP concepts (answer from SKILL.md knowledge directly)

---

## 2. Core Knowledge Base

Read [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) for the complete attribute tables, value definitions, and traceability specifications. This section summarizes the critical rules.

### 2.1 Mandatory Decisions an RMP Must Document

Every RMP must address these decisions:

1. **Requirement Types**: Which types will be tracked? (e.g., STRQ, FEAT, UC, SUPL, SCEN, TC)
2. **Requirement Attributes**: What attributes does each type have? What are the allowed values and their meanings?
3. **Requirement Storage**: Where are requirements stored — in documents, in a tool/database, or both?
4. **Traceability**: Between which requirement types is traceability maintained? What are the constraints?
5. **Documents**: What document types exist? Which requirement types go in which documents?
6. **Customer Contract**: Which requirements and documents serve as a contract with customers?
7. **Vendor Contract**: If outsourced, which requirements serve as a contract with vendors?
8. **Methodology**: What development methodology is followed?
9. **Change Management**: How are change requests submitted, tracked, and approved?
10. **Verification Process**: What process ensures all requirements are implemented and tested?
11. **Reports and Views**: What attribute matrices, traceability matrices, and traceability trees are needed?
12. **Customer-Specific Documents**: Does the customer's process require specific documents?

The most important information in an RMP:

- Which types of documents store requirements
- Which types of requirements go in each document
- Which attributes are associated with each requirement type
- What values are available for each attribute and what they mean

### 2.2 Standard Requirement Types

| Type | Abbr | Description |
|------|------|-------------|
| Stakeholder Request | STRQ | Key stakeholder and user needs. High-level requirements from the problem domain. |
| Feature | FEAT | The system's conditions and capabilities from the solution domain. |
| Use Case | UC | Functional requirements captured as actor-system interactions. |
| Supplementary Requirement | SUPL | Nonfunctional requirements not captured in use cases. |
| Glossary Item | TERM | Common vocabulary terms for the project. |
| Scenario | SCEN | Valid use case paths (basic and alternative flows). Bridges UCs to test cases and design. |
| Test Case | TC | Verification items traced from requirements to ensure test coverage. |

Not all types are needed for every project:

- **Minimal projects**: STRQ + FEAT (or UC) may suffice
- **Typical projects**: STRQ, FEAT, UC, SUPL
- **Complex projects**: All types including SCEN and TC

### 2.3 Standard Document Types

| Document | Abbr | Default Req Type | Purpose |
|----------|------|-----------------|---------|
| Stakeholder Requests | STR | STRQ | Captures key requests from stakeholders |
| Vision | VIS | FEAT | Overall system description and feature requirements |
| Use Case Specification | UCS | UC | One document per use case description |
| Glossary | GLS | TERM | Common vocabulary for the project |
| Supplementary Specification | SS | SUPL | Nonfunctional specifications |
| Requirements Management Plan | RMP | (none) | This document — the RM configuration |

### 2.4 Traceability Rules

The standard traceability chain flows top-down from stakeholder needs to solution requirements:

```
STRQ ──→ FEAT ──→ UC
  │         │
  │         └──→ SUPL
  └──→ SUPL
```

**Mandatory traceability constraints:**

- Every **approved** STRQ must trace to at least one FEAT or SUPL.
- Every **approved** FEAT must trace to at least one UC or SUPL.
- Relationships are **many-to-many** (typically one STRQ to many FEAT).
- UC and SUPL trace **back** to FEAT (bidirectional traceability).

### 2.5 FURPS+ Feature Type Classification

When classifying FEAT requirements by type, use the **FURPS+** taxonomy. The base categories (Functional, Usability, Reliability, Performance, Supportability) follow standard definitions. The **"+" extensions** specific to this methodology are:

- **Design Constraint** — Mandated design decisions (e.g., required platform, architectural patterns)
- **Implementation Requirement** — Coding standards, languages, resource limits
- **Physical Requirement** — Hardware constraints (shape, size, weight)
- **Interface Requirement** — External system interfaces the product must support

> The FURPS+ Type attribute is optional — apply it to FEAT when the project needs to categorize features beyond simple functional/nonfunctional splits. See KNOWLEDGE-BASE.md Section 4.2 for the full extended attributes table.

### 2.6 Key Attribute Definitions (Summary)

Each requirement type must define its attributes with explicit value sets. The most critical:

- **Status**: Lifecycle progression — Proposed → Approved → Realized → Incorporated → Validated
- **Priority**: Resource allocation — High (first Construction iteration) | Medium (by end of Construction) | Low (if time permits)
- **Benefit**: Value to end users — Critical (essential, blocks release) | Important (significant value) | Useful (nice-to-have, workarounds exist)
- **Risk**: Probability × impact — High | Medium | Low
- **Stability**: Likelihood of change — High (stable) | Medium | Low (volatile, needs more elicitation)
- **Effort**: Person-days estimate (set by development team)
- **Target Release**: Iteration in which the requirement will be incorporated
- **Reason**: Text explanation of the requirement's source or justification

See [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) for the full attribute-to-requirement-type mapping and complete value definitions.

### 2.7 Common RMP Failures — NEVER Do These

These are the most frequent mistakes that produce unusable RMPs. Treat each as a hard constraint.

**NEVER list:**

1. **NEVER define an attribute without its allowed values and their meanings.** Writing `Priority: High / Medium / Low` without explaining what each level means in schedule terms renders the attribute useless — every stakeholder interprets it differently.
2. **NEVER create a requirement type that appears in no document and no traceability path.** An orphan type wastes effort and confuses users. Every type must trace to or from at least one other type, and must be stored in at least one document.
3. **NEVER omit the traceability coverage constraints.** Defining paths (STRQ→FEAT) without stating "every approved STRQ must trace to at least one FEAT or SUPL" makes traceability unenforceable. Paths without constraints are decoration.
4. **NEVER mix problem-domain and solution-domain types in one document without explicit justification.** Putting STRQ and FEAT in the same Vision document conflates the user's language with the team's solution language. If you do this, state why and how you will keep them distinguishable.
5. **NEVER use tool-specific jargon in a Markdown RMP.** References to "RequisitePro projects," "views," or "database schemas" are meaningless when the RMP is a plain document. Describe the logical concepts, not the tool mechanics.
6. **NEVER skip the Reports section.** An RMP without defined reports and gap analyses has no verification mechanism. If you can't check coverage, you can't enforce traceability.
7. **NEVER define traceability as unidirectional only.** Every forward trace (STRQ→FEAT) implies a back-trace (FEAT←STRQ). Omitting back-traces makes it impossible to answer "why does this feature exist?"
8. **NEVER leave "Stability: Low" requirements unaddressed.** Low-stability items are volatile and must be flagged for additional elicitation. An RMP that defines Stability but doesn't prescribe what to do with Low-stability items is incomplete.

**Anti-patterns in evaluation mode:**

- Scoring a section as "Pass" when attribute values are listed but not defined → must be "Partial"
- Scoring traceability as "Pass" when paths exist but constraints are missing → must be "Partial"
- Ignoring internal consistency (e.g., a type referenced in traceability but not defined in the types section) → always flag as a Critical Gap

---

## 3. Step-by-Step Methodology

### Mode A: Generating a New RMP

**Input required from user:** Project name, brief description, stakeholder context, development methodology, and any known constraints.

#### Step 1: Gather Project Context

Ask the user for any missing critical information:

- Project name and brief description
- Known stakeholders and their roles
- Development methodology (iterative, agile, waterfall, etc.)
- Project scale (small / medium / large / enterprise)
- Compliance or customer-specific document requirements
- Whether parts of the project are outsourced

If information is incomplete, proceed with reasonable defaults for a typical project and note assumptions explicitly in the generated RMP.

> **Ask yourself before proceeding:** Do I have enough context to distinguish this project from a generic template? If every field would be a default, push back and ask the user for at least project scale and methodology — these two decisions cascade into every subsequent step.

#### Step 2: Select Requirement Types

Based on project scale and context:

- **Always include**: STRQ, FEAT
- Include **UC** if users interact with the system (not batch-only processing)
- Include **SUPL** if nonfunctional requirements exist (almost always yes)
- Include **SCEN** if iterative development with scenario-based implementation
- Include **TC** if formal test tracking is needed
- Include **TERM** if the domain has specialized vocabulary

> **Ask yourself:** Am I including a type because the project needs it, or because "more is better"? Each type you add creates traceability obligations, attribute definitions, and report requirements. A small project with STRQ+FEAT+UC+SUPL+SCEN+TC is over-engineered. Justify each inclusion.

**⛔ Verification gate:** Every type you selected must appear in at least one document (Step 3) and at least one traceability path (Step 4). If a type fails this check, remove it or justify why it's standalone.

#### Step 3: Map Documents to Requirement Types

For each selected requirement type, assign the corresponding document type using the standard mapping from Section 2.3. Decide for each type whether requirements live in documents, a tool/database, or both. Consider:

- Requirements with descriptive nature (UC) should be in documents — one document per use case
- Features (FEAT) belong in the Vision document
- Supplementary requirements (SUPL) belong in the Supplementary Specification
- Stakeholder requests (STRQ) may be in dedicated STR documents, in the Vision document, or tool-only

> **Ask yourself:** For STRQ storage, which of the three approaches fits this project? (a) Dedicated STR documents — best for stakeholder review but more documents to maintain; (b) Tool/database only — fewer documents but harder to get stakeholder feedback; (c) In the Vision document — simpler but mixes problem-domain and solution-domain language. Pick one and state the rationale.

#### Step 4: Define Traceability Structure

Based on selected requirement types, define traceability paths following Section 2.4 rules:

- Map every top-down trace path (STRQ→FEAT, FEAT→UC, FEAT→SUPL, STRQ→SUPL)
- Define trace-back paths (UC→FEAT, SUPL→FEAT)
- State the relationship cardinality for each path
- Define mandatory constraints (every approved STRQ must trace to at least one FEAT or SUPL; every approved FEAT must trace to at least one UC or SUPL)

> **Ask yourself:** Have I defined both the path AND the constraint for every trace? A path without a constraint (e.g., "STRQ→FEAT" without "every approved STRQ must...") is unenforceable. Also check: is every selected requirement type reachable in the trace graph? An unreachable type is an orphan — remove it or add a trace path.

**⛔ Verification gate:** Cross-check the traceability diagram against the types from Step 2. Every type must appear at least once. If SCEN or TC are selected, extend the chain: UC→SCEN→TC and SUPL→TC.

#### Step 5: Define Attributes Per Requirement Type

Read [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) for the complete per-type attribute mapping. At minimum define:

- **FEAT**: Status, Priority, Benefit, Effort, Risk, Stability, Target Release, Assigned To, Reason
- **STRQ**: Status, Priority, Benefit, Effort, Risk, Stability, Reason
- **UC**: Status, Priority, Benefit, Effort, Risk, Stability, Target Release, Reason, Actor
- **SUPL**: Status, Priority, Benefit, Effort, Risk, Stability, Target Release, Reason

For each attribute, provide: (1) the allowed values, and (2) a clear description of what each value means in this project's context. Clarify vague terms explicitly.

> **Ask yourself for EVERY enumeration attribute:** If I handed this value definition to two different project managers, would they assign the same value to the same requirement? If not, the definition is too vague. "High Priority" must mean something concrete like "must be implemented in the first Construction iteration," not just "very important."

**⛔ Verification gate:** Scan every attribute table. If any enumeration attribute has values listed without descriptions, STOP — go back and add descriptions. This is the #1 cause of unusable RMPs (see NEVER rule #1).

#### Step 6: Define Reports and Views

Specify the minimum set:

- **Attribute Matrices**: One per requirement type (all requirements with their attributes)
- **Traceability Matrices**: One per traceability path (which requirements trace to which)
- **Gap Reports**: Untraceable requirements (e.g., all STRQ not traced to any FEAT, all FEAT not traced to any UC or SUPL)
- **Traceability Trees**: Hierarchical views from top-level requirements down

#### Step 7: Assemble the RMP Document

Use the template in [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md) to produce the final Markdown document. Populate every section. Mark assumptions clearly with `[ASSUMPTION]` tags.

**⛔ Final verification gate — run these checks before delivering:**

1. **No orphan types**: Every requirement type appears in at least one document AND at least one traceability path.
2. **No undefined values**: Every enumeration attribute has value descriptions, not just value names.
3. **No path without constraint**: Every traceability path has a mandatory coverage constraint stated.
4. **No missing reports**: Every traceability path has a corresponding traceability matrix AND gap report.
5. **Internal consistency**: Types referenced in traceability match types defined in the types section — no mismatches.

---

### Mode B: Evaluating an Existing RMP

**Input:** An existing Markdown RMP document from the user.

#### Step 1: Parse Structure

Read the document and identify which standard sections are present and which are missing.

#### Step 2: Apply Evaluation Checklist

Score each criterion as ✅ Pass, ⚠️ Partial, or ❌ Missing using these definitions:

- **✅ Pass**: The criterion is fully satisfied — the information is present, complete, specific, and internally consistent.
- **⚠️ Partial**: The criterion is addressed but incomplete or vague. Examples: attribute values listed without descriptions; traceability paths defined without coverage constraints; section exists but lacks detail.
- **❌ Missing**: The criterion is entirely absent or so inadequate it provides no usable information.

> **Ask yourself for each criterion:** Would a new team member joining this project be able to follow this section without asking clarifying questions? If yes → Pass. If they'd need to ask "what does this value mean?" or "is this traced?" → Partial. If the section doesn't exist → Missing.

**Structural Completeness:**

- [ ] Has Introduction section (Purpose, Scope, Overview)
- [ ] Has Tools/Environment/Infrastructure section
- [ ] Has Documents section listing all document types with descriptions
- [ ] Has Requirement Types section with abbreviations and descriptions
- [ ] Has Traceability section with structure definition
- [ ] Has Attributes section with per-type attribute definitions
- [ ] Has Reports/Views section

**Requirement Types:**

- [ ] All requirement types are named with standard abbreviations
- [ ] Each type has a clear description
- [ ] Types are appropriate for the stated project scope
- [ ] Document-to-requirement-type mappings are defined

**Traceability:**

- [ ] All traceability paths between requirement types are explicitly defined
- [ ] Cardinality of relationships is stated (one-to-many, many-to-many)
- [ ] Mandatory trace constraints are defined (e.g., every approved STRQ must trace to FEAT)
- [ ] Trace-back relationships are defined
- [ ] Gap detection strategy is described (identifying untraceable requirements)

**Attributes:**

- [ ] Each requirement type has its attributes listed
- [ ] Every attribute has a defined set of allowed values
- [ ] Each attribute value has a clear, unambiguous description
- [ ] Critical attributes are present: Status, Priority, Risk (at minimum)
- [ ] Vague attribute values are clarified with project-specific meaning (e.g., what "High Priority" means in schedule terms)

**Reports and Views:**

- [ ] Attribute matrices are specified
- [ ] Traceability matrices are specified
- [ ] Gap/coverage reports are specified
- [ ] Traceability trees are specified

**Consistency:**

- [ ] All requirement types referenced in traceability are defined in the types section
- [ ] All document types reference valid requirement types
- [ ] Attribute definitions are consistent across similar requirement types
- [ ] No orphan types (defined but never referenced in traceability or documents)

#### Step 3: Calculate Completeness Score

Count total checklist items and compute:

```
score = (pass_count + 0.5 × partial_count) / total_items × 100%
```

Rating scale:

| Score | Rating |
|-------|--------|
| ≥ 90% | Excellent |
| ≥ 75% | Good |
| ≥ 50% | Needs Improvement |
| < 50% | Inadequate |

#### Step 4: Produce Evaluation Report

Output a structured evaluation with:

1. **Summary Score**: Overall percentage and rating
2. **Section-by-Section Assessment**: For each section, state Pass/Partial/Missing with specific findings
3. **Critical Gaps**: The most important missing elements that must be addressed
4. **Recommendations**: Specific, actionable suggestions to improve the RMP

### Edge Cases and Practical Guidance

**Edge case: User provides almost no project context.**
Default to a "medium/typical" project (STRQ, FEAT, UC, SUPL) with iterative methodology. Tag every decision with `[ASSUMPTION]`. In the introduction, add: "This RMP is based on assumed project characteristics. Review and customize before use."

**Edge case: User wants requirement types not in the standard set.**
Custom types are allowed. For each custom type: (1) define it with an abbreviation, (2) assign it to a document, (3) place it in the traceability graph, (4) define its attributes. If it doesn't fit the trace graph, explain why it's standalone.

**Edge case: User says "we don't need traceability."**
Push back. Traceability is the core value of an RMP — without it, the document is just a glossary. Explain: "Traceability is what makes an RMP actionable. Without it, there's no way to verify that all stakeholder needs are addressed in the implementation. At minimum, define STRQ→FEAT traceability."

**Edge case: Evaluating an RMP that uses completely different terminology.**
Map the document's terms to standard types before evaluating. If the RMP says "Business Requirement" instead of STRQ, or "User Story" instead of UC, that's fine — evaluate the substance, not the labels. Note the mapping in your report.

**Worked example — good vs. bad Priority definition:**

❌ Bad: `Priority: High / Medium / Low` (no definitions — unusable)

✅ Good:
> | Value | Description |
> |-------|-------------|
> | High | Must be implemented in the first Construction iteration. Blocks other work if delayed. |
> | Medium | Must be implemented by the end of Construction. Can be rescheduled within Construction. |
> | Low | Implemented if time permits. May be deferred to next release without impact. |

The difference: the good version ties priority to **schedule commitments**, not subjective importance.

---

## 4. Markdown Output Format

### When Generating an RMP

Use the complete template defined in [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md). The template follows this structure:

1. Introduction (Purpose, Scope, Overview)
2. Tools, Environment, and Infrastructure
3. Documents and Requirement Types
   - 3.1 Documents (table of document types)
   - 3.2 Requirement Types (table of requirement types)
   - 3.3 Traceability (structure definition with constraints)
   - 3.4 Requirements Attributes (per-type attribute tables with value definitions)
   - 3.5 Reports and Measures (attribute matrices, traceability matrices, gap reports, trees)

### When Evaluating an RMP

Use this report format:

```markdown
# RMP Evaluation Report

## Project: [Project Name]
## Date: [Date]

## 1. Overall Score: [X]% — [Rating]

## 2. Section-by-Section Assessment

### 2.1 Introduction
**Status:** [✅ Pass | ⚠️ Partial | ❌ Missing]
**Findings:** [Details]

### 2.2 Tools, Environment, and Infrastructure
**Status:** [✅ Pass | ⚠️ Partial | ❌ Missing]
**Findings:** [Details]

### 2.3 Documents
**Status:** [✅ Pass | ⚠️ Partial | ❌ Missing]
**Findings:** [Details]

### 2.4 Requirement Types
**Status:** [✅ Pass | ⚠️ Partial | ❌ Missing]
**Findings:** [Details]

### 2.5 Traceability
**Status:** [✅ Pass | ⚠️ Partial | ❌ Missing]
**Findings:** [Details]

### 2.6 Attributes
**Status:** [✅ Pass | ⚠️ Partial | ❌ Missing]
**Findings:** [Details]

### 2.7 Reports and Views
**Status:** [✅ Pass | ⚠️ Partial | ❌ Missing]
**Findings:** [Details]

## 3. Critical Gaps

1. [Gap description and impact]
2. [Gap description and impact]

## 4. Recommendations

1. [Specific actionable recommendation]
2. [Specific actionable recommendation]

## 5. Detailed Checklist Results

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Has Introduction section (Purpose, Scope, Overview) | ✅/⚠️/❌ | ... |
| 2 | Has Tools/Environment section | ✅/⚠️/❌ | ... |
| ... | ... | ... | ... |
```
