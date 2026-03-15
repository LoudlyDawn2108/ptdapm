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

When classifying features by type, use the FURPS+ taxonomy:

| Category | Description |
|----------|-------------|
| **Functional** | Core feature capabilities and behaviors |
| **Usability** | Human factors, aesthetics, consistency, documentation |
| **Reliability** | Frequency/severity of failure, recoverability, predictability |
| **Performance** | Speed, efficiency, resource consumption, throughput, response time |
| **Supportability** | Testability, extensibility, adaptability, maintainability, compatibility |
| **Design Constraint** | Mandated design decisions (e.g., required platform, architectural patterns) |
| **Implementation Requirement** | Coding standards, languages, resource limits |
| **Physical Requirement** | Hardware constraints (shape, size, weight) |
| **Interface Requirement** | External system interfaces the product must support |

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

#### Step 2: Select Requirement Types

Based on project scale and context:

- **Always include**: STRQ, FEAT
- Include **UC** if users interact with the system (not batch-only processing)
- Include **SUPL** if nonfunctional requirements exist (almost always yes)
- Include **SCEN** if iterative development with scenario-based implementation
- Include **TC** if formal test tracking is needed
- Include **TERM** if the domain has specialized vocabulary

#### Step 3: Map Documents to Requirement Types

For each selected requirement type, assign the corresponding document type using the standard mapping from Section 2.3. Decide for each type whether requirements live in documents, a tool/database, or both. Consider:

- Requirements with descriptive nature (UC) should be in documents — one document per use case
- Features (FEAT) belong in the Vision document
- Supplementary requirements (SUPL) belong in the Supplementary Specification
- Stakeholder requests (STRQ) may be in dedicated STR documents, in the Vision document, or tool-only

#### Step 4: Define Traceability Structure

Based on selected requirement types, define traceability paths following Section 2.4 rules:

- Map every top-down trace path (STRQ→FEAT, FEAT→UC, FEAT→SUPL, STRQ→SUPL)
- Define trace-back paths (UC→FEAT, SUPL→FEAT)
- State the relationship cardinality for each path
- Define mandatory constraints (every approved STRQ must trace to at least one FEAT or SUPL; every approved FEAT must trace to at least one UC or SUPL)

#### Step 5: Define Attributes Per Requirement Type

Read [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) for the complete per-type attribute mapping. At minimum define:

- **FEAT**: Status, Priority, Benefit, Effort, Risk, Stability, Target Release, Assigned To, Reason
- **STRQ**: Status, Priority, Benefit, Effort, Risk, Stability, Reason
- **UC**: Status, Priority, Benefit, Effort, Risk, Stability, Target Release, Reason, Actor
- **SUPL**: Status, Priority, Benefit, Effort, Risk, Stability, Target Release, Reason

For each attribute, provide: (1) the allowed values, and (2) a clear description of what each value means in this project's context. Clarify vague terms explicitly.

#### Step 6: Define Reports and Views

Specify the minimum set:

- **Attribute Matrices**: One per requirement type (all requirements with their attributes)
- **Traceability Matrices**: One per traceability path (which requirements trace to which)
- **Gap Reports**: Untraceable requirements (e.g., all STRQ not traced to any FEAT, all FEAT not traced to any UC or SUPL)
- **Traceability Trees**: Hierarchical views from top-level requirements down

#### Step 7: Assemble the RMP Document

Use the template in [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md) to produce the final Markdown document. Populate every section. Mark assumptions clearly with `[ASSUMPTION]` tags.

---

### Mode B: Evaluating an Existing RMP

**Input:** An existing Markdown RMP document from the user.

#### Step 1: Parse Structure

Read the document and identify which standard sections are present and which are missing.

#### Step 2: Apply Evaluation Checklist

Score each criterion as ✅ Pass, ⚠️ Partial, or ❌ Missing:

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
