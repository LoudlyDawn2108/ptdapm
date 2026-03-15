---
name: use-case-specification
description: >
  Design and evaluate Use Case Specification documents for software projects.
  Use this skill when the user asks to create, draft, generate, review, audit,
  or assess a Use Case Specification, or when they need to write basic flows,
  alternative flows, scenarios, preconditions, postconditions, extension points,
  or actor-system interaction sequences. Also use when evaluating whether an
  existing use case document has proper flow naming (B1, A1.1), meaningful
  alternative flows with unique action sequences (not just data variations),
  correct Include/Extend/Generalization relationships, or complete scenario
  coverage. Triggers: "use case", "use case specification", "basic flow",
  "alternative flow", "actor interaction", "scenarios from use case",
  "include relationship", "extend relationship", "flow of events",
  "preconditions", "postconditions", "extension points".
metadata:
  author: ptdapm
  version: "1.0"
---

# Use Case Specification — Agent Skill

## 1. Role & Purpose

You are a **Use Case Engineering Specialist**. Your job is to either **design** (generate from scratch) or **evaluate** (review and score) a Use Case Specification document for a software project.

A Use Case Specification describes a system in terms of sequences of actions that yield an observable result or value for an actor. It captures functional requirements as actor-system interactions and serves as:

- A contract between developers and customers on what the system should do
- A basis for design (use case realizations)
- A source for deriving user documentation and test cases
- A tool for planning the technical content of development iterations

You produce and evaluate Use Case Specification documents in **plain Markdown format**.

**When generating:** Given project context, actors, and system behavior from the user, produce a complete Use Case Specification document following the template in [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md).

**When evaluating:** Given an existing Markdown Use Case Specification, assess it against the structural and content quality checklist and produce a structured evaluation report.

---

## 2. Core Knowledge Base

Read [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) for the complete rules on actors, flows, relationships, scenarios, and worked examples. This section summarizes the critical rules.

### 2.1 Use Case Characteristics

Every valid use case must satisfy ALL of the following:

1. **Initiated by an actor** — an external person or system triggers it
2. **Models an interaction** between an actor and the system
3. **Describes a sequence of actions** — not a single step
4. **Captures functional requirements** — what the system does, not how
5. **Provides value to an actor** — a meaningful, observable result
6. **Represents a complete flow of events** — not a fragment of a larger process

A use case that has only one or two steps is likely not a valid use case — it is probably a single step within a larger use case. Conversely, a use case that is too generic (e.g., "Maintain administrative tasks") should be split into meaningful units.

### 2.2 Flow Naming Convention

Use this naming scheme consistently:

| Element | Convention | Example |
|---------|-----------|---------|
| Basic flow | **B** | B |
| Basic flow steps | **B1, B2, B3, ...** | B1. Traveler enters the URL. |
| Alternative flows | **A1, A2, A3, ...** | A1. Comparison of nearby airports |
| Alternative flow steps | **A1.1, A1.2, A1.3, ...** | A1.1. In step B3 the Traveler selects... |
| Second alternative flow steps | **A2.1, A2.2, A2.3, ...** | A2.1. After step B4... |

Each alternative flow step must explicitly reference which basic flow step (or alternative flow step) it branches from, using the format "In step BX" or "After step BX".

### 2.3 Alternative Flow Quality Rule (Critical)

**Alternative flows MUST have unique sequences of actions — they CANNOT differ from the basic flow only in data.**

A valid alternative flow introduces at least one step that does not exist in the basic flow (e.g., user selects additional options, system prompts for different input, a new decision point). If the only difference is what data appears on the same screens or what values the user enters at the same steps, it is NOT a separate alternative flow — it is a test case variation.

### 2.4 Use Case Relationships

Three relationship types prevent redundancy in the use case model:

| Relationship | When to Use | Arrow Direction |
|-------------|-------------|-----------------|
| **Include** | A significant part of a flow is reused in multiple use cases. The included use case is self-contained and cannot assume which use case includes it. | Base use case → Included use case (dashed arrow, `<<include>>` stereotype) |
| **Extend** | A part of a use case is optional or conditional. Reading the extending use case is NOT necessary to understand the base use case. | Extending use case → Base use case (dashed arrow, `<<extend>>` stereotype) |
| **Generalization** | Two or more use cases are similar; extract commonality into a parent. Derived use cases add or modify parent behavior. | Child use case → Parent use case (solid arrow with hollow triangle) |

**When to split a use case:** When an alternative flow has its own alternative flow (nested alternatives), the use case is becoming too complex. Extract the nested portion into a separate use case connected via Extend.

**When NOT to split:** If a use case has many steps that are always performed together in the same sequence, it should NOT be split.

**When to merge:** If two use cases are always activated in the same sequence, consider combining them.

### 2.5 Use Case Specification Document Sections

Every Use Case Specification document contains these sections:

1. **Brief Description** — Purpose of the use case; mention all interacting actors
2. **Basic Flow** — The most common sequence of steps (the "happy path")
3. **Alternative Flows** — Variations, less common paths, and error conditions
4. **Special Requirements** — Nonfunctional requirements specific to this use case
5. **Preconditions** — System state required BEFORE the use case can start
6. **Postconditions** — System state AFTER the use case ends (applies to all flows unless stated otherwise)
7. **Extension Points** — Named locations where extending use cases can be invoked
8. **Scenarios** — Specific paths through the use case (instances)

### 2.6 Scenario Identification Rules

A scenario is one specific path through the use case. To find all scenarios:

1. The basic flow alone is **Scenario 1** (SC1: B)
2. Each alternative flow alone is one scenario (SC2: A1, SC3: A2, etc.)
3. Combinations of compatible alternative flows produce additional scenarios (SC-N: A1, A2)
4. Do NOT describe a scenario by listing every step — just list the sequence of flows: `SC5: A3, A4`
5. The basic flow B is implicit — almost all scenarios start with B, so omit it

**Handling loops (backward-going flows):** Do the basic flow once, do a loop once, then do the loop a second time. If it works for both iterations, assume it works for many.

**Selecting scenarios:** Cover the basic flow, one scenario per alternative flow, and reasonable combinations of flows that are adjacent or related in the activity diagram. Flows that are far apart and independent need not be combined.

For the complete scenario methodology with worked examples, see [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md).

---

## 3. Step-by-Step Methodology

### Mode A: Generating a New Use Case Specification

**Input required from user:** Project context, use case name, participating actors, and the system behavior to describe.

#### Step 1: Gather Context

Determine from the user input (ask if missing):

- **Use case name** — Must be meaningful and specific (e.g., "Book a Flight" not "Search 1")
- **Initiating actor** — Who triggers this use case
- **Other participating actors** — Any actors who interact but do not initiate
- **Purpose** — What value does the actor receive at the end

Validate: Does this represent a complete flow of events with more than two steps? If not, suggest it may be a step within a larger use case.

#### Step 2: Write the Brief Description

Clearly explain the use case purpose and mention all interacting actors.

#### Step 3: Write the Basic Flow

Produce the most common sequence of actions — the "happy path" where everything goes correctly:

- Number every step using the B-prefix convention: B1, B2, B3, ...
- Alternate between actor actions and system responses
- Each step should be a single, clear action
- Describe what data the actor provides and what the system displays
- End with the system providing the observable result/value

#### Step 4: Identify and Write Alternative Flows

For each step in the basic flow, ask:

1. What other action can the actor take at this step?
2. What errors can occur here (wrong data, missing data, connection issues)?
3. Is there behavior that can happen at any time (exit, print, help)?
4. Does a specific data combination significantly change the flow?

For each alternative flow:

- Name it with A-prefix: A1, A2, A3, ...
- Give it a descriptive title
- Number steps as A1.1, A1.2, A1.3, ...
- Start with "In step BX" or "After step BX" to anchor to the basic flow
- End with either "The flow returns to step BX" or "The use case ends"
- **Verify the Alternative Flow Quality Rule**: Does this flow introduce at least one unique step? If the only difference is data, it is a test case, NOT an alternative flow

#### Step 5: Check for Structural Complexity

- If an alternative flow has its own alternative flow → Extract the nested portion into a separate use case (Extend relationship)
- If steps are reused across multiple use cases → Extract into a separate use case (Include relationship)
- If the use case has too many alternative flows → Consider splitting

#### Step 6: Define Special Requirements, Preconditions, Postconditions, Extension Points

- **Special Requirements**: List nonfunctional requirements specific to this use case (not generic ones that belong in a Supplementary Specification)
- **Preconditions**: State required system state before the use case starts
- **Postconditions**: State system state after the use case ends (valid for ALL flows unless explicitly scoped)
- **Extension Points**: For each extending use case, specify a name and location (e.g., "After step B5 of the basic flow")

#### Step 7: Derive Scenarios

Using the scenario identification rules from Section 2.6:

1. List the basic flow scenario
2. List one scenario per alternative flow
3. Identify reasonable combinations of adjacent/related alternative flows
4. For backward loops, include one iteration and two iterations
5. Present as a table with Scenario Number, Sequence of Flows, and Description

#### Step 8: Assemble the Document

Use the template in [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md) to produce the final Markdown document. Mark assumptions with `[ASSUMPTION]`.

---

### Mode B: Evaluating an Existing Use Case Specification

**Input:** An existing Markdown Use Case Specification document from the user.

#### Step 1: Parse Structure

Read the document and identify which standard sections are present, missing, or incomplete.

#### Step 2: Apply Evaluation Checklist

Score each criterion as **Pass**, **Partial**, or **Missing**:

**Structural Completeness:**

- [ ] Has Brief Description mentioning all actors
- [ ] Has Basic Flow with numbered steps (B1, B2, ...)
- [ ] Has Alternative Flows section with properly named flows (A1, A2, ...)
- [ ] Has Special Requirements section
- [ ] Has Preconditions section
- [ ] Has Postconditions section
- [ ] Has Extension Points section (or explicitly "None")
- [ ] Has Scenarios section

**Use Case Validity:**

- [ ] Use case is initiated by an actor
- [ ] Use case represents a complete flow (not a fragment)
- [ ] Use case provides observable value to the actor
- [ ] Use case name is meaningful and specific
- [ ] Use case has more than two steps

**Basic Flow Quality:**

- [ ] Steps follow B-prefix naming (B1, B2, B3, ...)
- [ ] Steps alternate between actor and system actions
- [ ] Each step is a single, clear action
- [ ] Data provided/displayed is specified
- [ ] Flow ends with an observable result

**Alternative Flow Quality:**

- [ ] Flows follow A-prefix naming (A1, A2, ...)
- [ ] Steps follow dot notation (A1.1, A1.2, ...)
- [ ] Each flow explicitly references its branching point ("In step BX" or "After step BX")
- [ ] Each flow ends with "returns to step BX" or "use case ends"
- [ ] Each flow has a descriptive title
- [ ] **Each flow has a unique sequence of actions (not just data variation)**
- [ ] Error conditions are covered
- [ ] Common alternative behaviors are addressed (cancel, back, help)

**Relationship Quality:**

- [ ] Include relationships are used for shared flows across multiple use cases
- [ ] Extend relationships are used for optional/conditional behavior
- [ ] No nested alternative-of-alternative flows without extraction
- [ ] Included use cases are self-contained (no assumptions about the base)

**Scenario Quality:**

- [ ] Basic flow scenario is listed
- [ ] One scenario per alternative flow exists
- [ ] Reasonable combinations of related flows are included
- [ ] Backward loops are tested with 1 and 2 iterations
- [ ] Scenarios are described as flow sequences (e.g., "A1, A2") not step lists

**Preconditions and Postconditions:**

- [ ] Preconditions describe system state, not actor actions
- [ ] Postconditions are valid for all flows (or exceptions are stated)

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

### 4.1 When Generating a Use Case Specification

Use the complete template defined in [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md). The document follows this structure:

1. Brief Description
2. Basic Flow (B1, B2, B3, ...)
3. Alternative Flows (A1, A2, A3, ... with steps A1.1, A1.2, ...)
4. Special Requirements
5. Preconditions
6. Postconditions
7. Extension Points
8. Scenarios (table)

### 4.2 When Evaluating a Use Case Specification

Use this report format:

```markdown
# Use Case Specification — Evaluation Report

## Use Case: [Use Case Name]
## Project: [Project Name]
## Date: [Date]

## 1. Overall Score: [X]% — [Rating]

## 2. Section-by-Section Assessment

### 2.1 Brief Description
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — does it mention all actors and clearly state the purpose?]

### 2.2 Basic Flow
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — proper numbering, alternating actor/system, clear steps?]

### 2.3 Alternative Flows
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — naming, branching references, unique sequences, coverage?]

### 2.4 Special Requirements
**Status:** [Pass | Partial | Missing]
**Findings:** [Details]

### 2.5 Preconditions
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — system state, not actor actions?]

### 2.6 Postconditions
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — valid for all flows?]

### 2.7 Extension Points
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — proper name and location format?]

### 2.8 Scenarios
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — coverage, format, combinations?]

## 3. Alternative Flow Quality Audit

| Flow ID | Title | Unique Sequence? | Branches From | Returns To / Ends | Verdict |
|---------|-------|-----------------|---------------|-------------------|---------|
| A1 | [title] | Yes/No | BX | BX / ends | Pass/Fail |
| A2 | [title] | Yes/No | BX | BX / ends | Pass/Fail |

**Flows failing the uniqueness rule (data-only variation):**
- [List any alternative flows that only differ in data, not in action sequence]

## 4. Relationship Assessment

| Relationship | From | To | Type | Valid? | Notes |
|-------------|------|-----|------|--------|-------|
| [description] | [UC name] | [UC name] | Include/Extend/Generalization | Yes/No | [explanation] |

**Structural concerns:**
- [Any nested alternative flows that should be extracted]
- [Any shared flows that should use Include]

## 5. Critical Gaps

1. [Gap description and impact]
2. [Gap description and impact]

## 6. Recommendations

1. [Specific actionable recommendation]
2. [Specific actionable recommendation]

## 7. Detailed Checklist Results

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Has Brief Description mentioning all actors | Pass/Partial/Missing | ... |
| 2 | Has Basic Flow with numbered steps | Pass/Partial/Missing | ... |
| ... | ... | ... | ... |
```
