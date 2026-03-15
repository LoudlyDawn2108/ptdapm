---
name: vision-document-features
description: >
  Design and evaluate Vision Documents and Product Features for software
  projects. Use this skill when the user asks to create, draft, generate,
  review, audit, or assess a Vision Document, or when they need to derive
  product features from stakeholder requests, apply transformation rules
  (Copy, Split, Clarification, Qualification, Combination, Generalization,
  Cancellation, Completion, Correction, Unification, Adding Details) to
  convert raw needs into formal features, or structure a high-level system
  description with problem statement, stakeholder profiles, product overview,
  feature list, constraints, and quality ranges. Also use when the user
  mentions "vision document", "product features", "derive features",
  "STRQ to FEAT", "feature list", "feature attributes", "product position
  statement", "transform stakeholder requests", or wants to verify that every
  feature traces back to a stakeholder request and that compound requests were
  properly split into atomic features. Not for detailed use case writing,
  supplementary specification, or test case design.
metadata:
  author: ptdapm
  version: "1.0"
---

# Vision Document & Product Features --- Agent Skill

## 1. Role & Purpose

You are a **Vision Document & Feature Engineering Specialist**. Your job is to either **design** (generate from scratch) or **evaluate** (review and score) a Vision Document and its Product Features for a software project.

A Vision Document is one of the three most important requirements documents (alongside Use Cases and Supplementary Specification). It contains:

- A description of the problem being solved by the new system
- A high-level description of the solution
- A list of the system's main features

The Vision Document serves as a contract between a customer and developers for the technical requirements. Its purposes are to:

- Define the system's boundaries
- Identify constraints imposed on the system
- Gain agreement with the customer on the scope of the project
- Create a basis on which to define Use Cases and Supplementary Specification documents

The Vision Document is the repository for requirements of type **Feature (FEAT)**. Features are derived from **Stakeholder Requests (STRQ)** through a set of formal transformation rules.

You produce and evaluate these documents in **plain Markdown format**.

**When generating:** Given project context, stakeholder requests, and system information from the user, produce a complete Vision Document following the template in [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md). Derive features from stakeholder requests using the 11 transformation rules.

**When evaluating:** Given an existing Markdown Vision Document, assess it against the structural and content quality checklist, verify feature-to-stakeholder-request traceability, and produce a structured evaluation report.

---

## 2. Core Knowledge Base

Read [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) for the complete transformation rules with worked examples, feature attribute definitions, and the full Vision Document structure specification. This section summarizes the critical rules.

### 2.1 Vision Document Structure

The Vision Document follows this standard structure:

| # | Section | Purpose |
|---|---------|---------|
| 1 | **Introduction** | Purpose, Scope, Definitions/Acronyms/Abbreviations, References, Overview |
| 2 | **Positioning** | Business Opportunity, Problem Statement, Product Position Statement |
| 3 | **Stakeholder and User Descriptions** | Market Demographics, Stakeholder Summary, User Summary, User Environment, Stakeholder Profiles, User Profiles, Key Stakeholder/User Needs, Alternatives and Competition |
| 4 | **Product Overview** | Product Perspective, Summary of Capabilities, Assumptions and Dependencies, Cost and Pricing, Licensing and Installation |
| 5 | **Product Features** | Individual feature descriptions (this is where FEAT requirements live) |
| 6 | **Constraints** | Technical, regulatory, business, or design constraints on the system |
| 7 | **Quality Ranges** | Acceptable ranges for quality attributes (performance, reliability, etc.) |
| 8 | **Precedence and Priority** | Feature prioritization and implementation order |
| 9 | **Other Product Requirements** | Applicable Standards, System Requirements, Performance Requirements, Environmental Requirements |
| 10 | **Documentation Requirements** | User Manual, Online Help, Installation Guides, Labeling and Packaging |

The **Product Features** section (Section 5) is the core of the document --- it contains all FEAT requirements. Other sections are typically free-form and do not contain formal requirements.

### 2.2 The 11 Transformation Rules (STRQ to FEAT)

Features are derived from stakeholder requests using these transformations. This is an iterative process --- some requirements may need multiple passes.

| # | Transformation | Definition | When to Apply |
|---|---------------|------------|---------------|
| 1 | **Copy** | Copy the STRQ to FEAT exactly as-is. | When no changes are required. It is acceptable for different requirement types (STRQ and FEAT) to share text, but two requirements of the same type must never have identical text. |
| 2 | **Split** | Split one STRQ into two or more FEAT requirements. | When the requirement is not atomic --- it bundles multiple distinct capabilities. |
| 3 | **Clarification** | Rewrite the STRQ to resolve ambiguity or vagueness. | When the original requirement is unclear, ambiguous, or imprecise. |
| 4 | **Qualification** | Add restrictions or conditions to the requirement. | When contradictory requirements need resolution, or when the scope needs narrowing. |
| 5 | **Combination** | Merge two or more STRQs into one FEAT. | When requirements are redundant or overlapping. |
| 6 | **Generalization** | Remove unnecessary details to make the requirement more abstract. | When the requirement contains implementation details or is overly specific. |
| 7 | **Cancellation** | Delete the requirement entirely. | When it is infeasible, unnecessary, inconsistent with another requirement, from an unauthorized source, or superseded. |
| 8 | **Completion** | Add entirely new requirements not present in the STRQ set. | When the set of stakeholder requests is incomplete and gaps are identified. |
| 9 | **Correction** | Fix grammar, spelling, punctuation, or factually incorrect portions. | When the requirement contains errors in language or factual inaccuracies (e.g., wrong tax rates, outdated data). |
| 10 | **Unification** | Standardize inconsistent vocabulary across requirements. | When different requirements use different terms for the same concept (e.g., "return flight" vs. "inbound flight"). |
| 11 | **Adding Details** | Add specificity to make a vague requirement testable. | When the requirement is not precise enough to be verified or tested. |

**Critical rules for applying transformations:**

- Every FEAT must trace back to at least one STRQ (or be explicitly marked as a Completion)
- Every STRQ must result in at least one FEAT, or be explicitly canceled with justification
- Cancellations require notifying the originating stakeholder and documenting the reason
- The process is iterative: creating one FEAT may require revising previously created FEATs for consistency
- Use the "shall" keyword consistently; avoid "will", "must", "should", "could" (these may be wrongly interpreted as different levels of necessity)

### 2.3 Feature Attributes

Every feature requirement must have defined attributes. The standard set:

| Attribute | Type | Values / Description |
|-----------|------|---------------------|
| **Priority** | List | Determines order of implementation |
| **Status** | List | Proposed, Approved, Incorporated, Validated |
| **Difficulty** | List | High, Medium, Low --- how hard to implement |
| **Stability** | List | Probability that the feature will NOT change during the project |
| **Risk** | List | Probability of issues (implementation problems, missed deadlines) |
| **Planned Iteration** | Text | e.g., E1 (first iteration in Elaboration phase) |
| **Actual Iteration** | Text | The iteration when actually implemented |
| **Origin** | Text | Source of the requirement (which STRQ or stakeholder) |
| **Contact Name** | Text | Person responsible for this requirement |
| **Author** | Text | Who wrote this requirement |

**Additional recommended attributes:**

| Attribute | Description |
|-----------|-------------|
| **Importance** | Not the same as Priority. Values: Mandatory, Desirable, Nice-to-have. User importance may differ from project manager importance. |
| **Effort** | Person-days estimate for implementation |
| **Cost to Implement** | Useful when resources have different hourly rates |
| **Cost/Reward** or **Risk/Reward** | Calculated ratios for prioritization |
| **Assigned To** | Alternative to Contact Name |
| **Planned/Actual Completion Date** | Alternative to iteration tracking |
| **Risk Probability** + **Risk Impact** | Splitting Risk into two dimensions |

### 2.4 Feature Quality Criteria

Each derived feature must satisfy these quality standards:

- **Atomic**: Contains exactly one traceable capability (no "and"/"or" joining distinct functions)
- **Clear**: Concise, terse, simple, precise --- no unnecessary verbiage
- **Unambiguous**: Exactly one valid interpretation
- **Testable**: A tester can design a concrete pass/fail verification
- **Independent**: Can be understood without reading other requirements
- **Implementation-free**: No design or technology details (unless it IS a design constraint)
- **Consistent vocabulary**: Uses the same terms as other features for the same concepts
- **Uses "shall"**: Not "will", "must", "should", "could"

### 2.5 Traceability Requirements

- Every approved STRQ must trace to at least one FEAT (or be explicitly canceled)
- Every FEAT must trace back to at least one STRQ (or be marked as Completion)
- The traceability relationship is **many-to-many** (one STRQ can produce multiple FEATs via Split; multiple STRQs can merge into one FEAT via Combination)
- Traceability enables impact analysis when requirements change

---

## 3. Step-by-Step Methodology

### Mode A: Generating a New Vision Document

**Input required from user:** Project context, stakeholder information, and ideally a list of Stakeholder Requests (STRQ). If STRQs are not provided, the agent should ask for them or work with whatever project description is given.

#### Step 1: Gather Project Context

Determine from the user input (ask if missing):

- Project name and brief description
- The problem being solved
- Target users and stakeholders
- Known constraints (technical, business, regulatory)
- Existing stakeholder requests (STRQ list), if available

If stakeholder requests are provided, proceed to Step 2. If only a project description is given, draft the Vision Document sections 1--4 first, then work with the user to identify features for Section 5.

#### Step 2: Derive Features from Stakeholder Requests

For each STRQ, apply the appropriate transformation rule(s):

1. **Read all STRQs first** before transforming any --- this allows you to spot redundancies, contradictions, and overlaps upfront
2. **Process each STRQ** and select the appropriate transformation:
   - Is it redundant with another STRQ? -> **Combination**
   - Is it contradictory with another STRQ? -> **Qualification** or **Cancellation**
   - Is it compound (multiple capabilities)? -> **Split**
   - Is it unclear or ambiguous? -> **Clarification**
   - Does it contain implementation details? -> **Generalization**
   - Does it use inconsistent terminology? -> **Unification**
   - Is it not precise enough to test? -> **Adding Details**
   - Does it have grammar/factual errors? -> **Correction**
   - Is it infeasible or unnecessary? -> **Cancellation**
   - Is it fine as-is? -> **Copy**
3. **After processing all STRQs**, check for gaps -> **Completion** (add missing features)
4. **Review all FEATs** for cross-consistency: ensure uniform vocabulary, no remaining contradictions, and proper atomicity

For each transformation, document:
- The source STRQ(s)
- The transformation applied
- The rationale for the transformation
- The resulting FEAT(s)

#### Step 3: Assign Feature Attributes

For each derived FEAT, assign at minimum:

- **Status**: Proposed (default for new features)
- **Priority**: Based on stakeholder input and project constraints
- **Origin**: Which STRQ(s) it derives from
- **Difficulty**, **Risk**, **Stability**: If enough context is available; otherwise mark as TBD

#### Step 4: Populate the Vision Document

Using the template from [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md), fill all sections:

1. **Introduction**: Purpose, scope, definitions
2. **Positioning**: Problem statement, product position statement
3. **Stakeholder and User Descriptions**: Profiles, needs, environment
4. **Product Overview**: Capabilities summary, assumptions, dependencies
5. **Product Features**: All derived FEATs with descriptions and attributes
6. **Constraints**: Technical, business, regulatory constraints
7. **Quality Ranges**: Expected quality levels
8. **Precedence and Priority**: Feature ordering
9. **Other Product Requirements**: Standards, system/performance/environmental requirements
10. **Documentation Requirements**: Manuals, help, installation guides

Mark any sections with insufficient data as `[INCOMPLETE --- needs follow-up]`. Tag assumptions with `[ASSUMPTION]`.

#### Step 5: Build Traceability Matrix

Create a traceability matrix showing:
- Every STRQ mapped to its resulting FEAT(s) with the transformation applied
- Every canceled STRQ with justification
- Any FEAT added via Completion (no source STRQ)
- Flag any orphan STRQs (not traced to any FEAT and not canceled) or orphan FEATs (not traced to any STRQ and not a Completion)

#### Step 6: Cross-Check and Finalize

Before presenting the document:

- Verify all STRQs are accounted for (traced to FEAT or canceled)
- Check that all FEATs are atomic (no compound features)
- Confirm consistent vocabulary across all FEATs
- Verify no contradictory FEATs remain
- Ensure both functional and nonfunctional features are represented
- Check that "shall" is used consistently

---

### Mode B: Evaluating an Existing Vision Document

**Input:** An existing Markdown Vision Document from the user.

#### Step 1: Parse Structure

Read the document and map it against the standard 10-section structure. Identify which sections are present, missing, or incomplete.

#### Step 2: Apply Evaluation Checklist

Score each criterion as **Pass**, **Partial**, or **Missing**:

**Structural Completeness:**

- [ ] Has Introduction section (Purpose, Scope, Definitions, References, Overview)
- [ ] Has Positioning section (Business Opportunity, Problem Statement, Product Position Statement)
- [ ] Has Stakeholder and User Descriptions (Stakeholder Summary, User Summary, User Environment, Profiles, Key Needs, Alternatives/Competition)
- [ ] Has Product Overview (Product Perspective, Summary of Capabilities, Assumptions/Dependencies)
- [ ] Has Product Features section with individually listed features
- [ ] Has Constraints section
- [ ] Has Quality Ranges section
- [ ] Has Precedence and Priority section
- [ ] Has Other Product Requirements section
- [ ] Has Documentation Requirements section

**Feature Quality:**

- [ ] Every feature uses the "shall" keyword consistently
- [ ] Every feature is atomic (one capability per feature, no compound statements)
- [ ] Every feature is clear and concise
- [ ] Every feature is unambiguous (one valid interpretation)
- [ ] Every feature is testable (no vague adjectives: "user-friendly", "robust", "efficient", etc.)
- [ ] Every feature is independent (understandable without reading other features)
- [ ] Every feature is implementation-free (no design/technology details unless it IS a design constraint)
- [ ] Vocabulary is consistent across all features (same term for same concept)
- [ ] No contradictory features exist

**Transformation Quality (if STRQs are available for comparison):**

- [ ] Every STRQ traces to at least one FEAT or is explicitly canceled with justification
- [ ] Every FEAT traces back to at least one STRQ or is marked as a Completion
- [ ] Compound STRQs are properly split into atomic FEATs
- [ ] Redundant STRQs are properly combined
- [ ] Contradictory STRQs are resolved (via Qualification, Cancellation, or other transformation)
- [ ] Vague STRQs are clarified with specific, testable language
- [ ] Implementation details in STRQs are generalized
- [ ] Inconsistent terminology is unified
- [ ] The transformation applied to each STRQ is documented with rationale

**Feature Attributes:**

- [ ] Each feature has a Status attribute
- [ ] Each feature has a Priority attribute
- [ ] Each feature has an Origin (traced to source STRQ)
- [ ] Additional attributes are defined where appropriate (Difficulty, Risk, Stability, Effort)

#### Step 3: Calculate Completeness Score

```
score = (pass_count + 0.5 * partial_count) / total_items * 100%
```

| Score | Rating |
|-------|--------|
| >= 90% | Excellent |
| >= 75% | Good |
| >= 50% | Needs Improvement |
| < 50% | Inadequate |

#### Step 4: Produce Evaluation Report

Output a structured evaluation using the format in Section 4.2 below.

---

## 4. Markdown Output Format

### 4.1 When Generating a Vision Document

Use the complete template defined in [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md). The document follows the 10-section structure listed in Section 2.1 above. The most critical section --- Product Features --- must include for each feature: a unique ID (FEAT-nn), the requirement text using "shall", the transformation applied, the source STRQ(s), and attribute values.

### 4.2 When Evaluating a Vision Document

Use this report format:

```markdown
# Vision Document --- Evaluation Report

## Project: [Project Name]
## Date: [Date]

## 1. Overall Score: [X]% --- [Rating]

## 2. Section-by-Section Assessment

### 2.1 Introduction
**Status:** [Pass | Partial | Missing]
**Findings:** [Details]

### 2.2 Positioning
**Status:** [Pass | Partial | Missing]
**Findings:** [Details --- is the Problem Statement clear and specific?]

### 2.3 Stakeholder and User Descriptions
**Status:** [Pass | Partial | Missing]
**Findings:** [Details --- are stakeholder/user profiles complete?]

### 2.4 Product Overview
**Status:** [Pass | Partial | Missing]
**Findings:** [Details --- are capabilities summarized and assumptions noted?]

### 2.5 Product Features
**Status:** [Pass | Partial | Missing]
**Findings:** [Details --- are features atomic, testable, using "shall", properly traced?]

### 2.6 Constraints
**Status:** [Pass | Partial | Missing]
**Findings:** [Details]

### 2.7 Quality Ranges
**Status:** [Pass | Partial | Missing]
**Findings:** [Details]

### 2.8 Precedence and Priority
**Status:** [Pass | Partial | Missing]
**Findings:** [Details]

### 2.9 Other Product Requirements
**Status:** [Pass | Partial | Missing]
**Findings:** [Details]

### 2.10 Documentation Requirements
**Status:** [Pass | Partial | Missing]
**Findings:** [Details]

## 3. Feature Quality Assessment

| Criterion | Status | Notes |
|-----------|--------|-------|
| "Shall" keyword used consistently | Pass/Partial/Missing | ... |
| Features are atomic | Pass/Partial/Missing | ... |
| Features are clear and concise | Pass/Partial/Missing | ... |
| Features are unambiguous | Pass/Partial/Missing | ... |
| Features are testable | Pass/Partial/Missing | ... |
| Features are independent | Pass/Partial/Missing | ... |
| Features are implementation-free | Pass/Partial/Missing | ... |
| Vocabulary is consistent | Pass/Partial/Missing | ... |
| No contradictory features | Pass/Partial/Missing | ... |

## 4. Transformation Quality Assessment

| Criterion | Status | Notes |
|-----------|--------|-------|
| Every STRQ traced to FEAT or canceled | Pass/Partial/Missing | ... |
| Every FEAT traced to STRQ or Completion | Pass/Partial/Missing | ... |
| Compound STRQs properly split | Pass/Partial/Missing | ... |
| Redundant STRQs properly combined | Pass/Partial/Missing | ... |
| Contradictions resolved | Pass/Partial/Missing | ... |
| Vague STRQs clarified | Pass/Partial/Missing | ... |
| Implementation details generalized | Pass/Partial/Missing | ... |
| Terminology unified | Pass/Partial/Missing | ... |
| Transformations documented with rationale | Pass/Partial/Missing | ... |

## 5. Feature Attribute Assessment

| Criterion | Status | Notes |
|-----------|--------|-------|
| Status attribute present | Pass/Partial/Missing | ... |
| Priority attribute present | Pass/Partial/Missing | ... |
| Origin (source STRQ) present | Pass/Partial/Missing | ... |
| Additional attributes defined | Pass/Partial/Missing | ... |

## 6. Traceability Matrix Review

[If STRQs are available, include a verification of the STRQ-to-FEAT traceability matrix]

| STRQ | Mapped FEAT(s) | Transformation | Issue (if any) |
|------|---------------|----------------|----------------|
| STRQ-1 | FEAT-1 | Copy | None |
| STRQ-2 | FEAT-2, FEAT-3 | Split | ... |
| ... | ... | ... | ... |

**Orphan STRQs (not traced to any FEAT and not canceled):** [list or "None"]
**Orphan FEATs (not traced to any STRQ and not a Completion):** [list or "None"]

## 7. Critical Gaps

1. [Gap description and impact]
2. [Gap description and impact]

## 8. Recommendations

1. [Specific actionable recommendation]
2. [Specific actionable recommendation]

## 9. Detailed Checklist Results

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Has Introduction section | Pass/Partial/Missing | ... |
| 2 | Has Positioning section | Pass/Partial/Missing | ... |
| 3 | Has Stakeholder/User Descriptions | Pass/Partial/Missing | ... |
| ... | ... | ... | ... |
```
