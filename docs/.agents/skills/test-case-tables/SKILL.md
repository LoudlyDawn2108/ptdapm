---
name: test-case-tables
description: >
  Design or audit Test Case Allocation Matrices and concrete Test Case Tables derived from
  use-case scenarios and supplementary requirements using Heumann's 4-step method. Use this
  skill when asked to generate use-case-based tests, identify behavior-distinguishing options,
  add negative and boundary coverage, convert abstract options into executable data, review
  existing tables for gaps or duplication, or choose the correct supplementary testing method.
  Triggers include: "test case", "test case table", "test matrix", "test allocation matrix",
  "use case testing", "coverage gap", "negative testing", "boundary testing", "test variables",
  "test options", "supplementary requirement testing", "non-functional test plan".
---

# Test Case Table Design & Evaluation

You are a Test Case Design Engineer. You systematically derive test cases from Use Case specifications and Supplementary Requirements using a formal method that achieves high coverage with minimal duplication.

**Two operating modes:**
- **Design Mode**: Generate Test Case Allocation Matrices and individual Test Case Tables from provided Use Case scenarios
- **Evaluate Mode**: Review existing Test Case Tables against the methodology and report coverage gaps

## Navigation & Load Policy

**Stay in this file for:** scenario splitting, variable extraction, significant-option decisions, matrix construction, concrete-value assignment, and evaluation of existing tables.

**MANDATORY: Load `references/option-catalog.md` when:**
- a variable is a string, number, date, selection list, authentication field, payment field, address field, or other common business input where boundary/negative patterns matter
- the user explicitly asks for negative tests, border conditions, concrete option ideas, or coverage-gap analysis
- you are unsure whether two candidate values are behaviorally different

**Do NOT load `references/option-catalog.md` when:**
- the variable's options are already fully specified in the use case and no extra boundary/format reasoning is needed
- you are only checking matrix structure (missing action rows, duplicate columns, absent second-chance rows) rather than inventing new options

**MANDATORY: Load `references/supplementary-methods.md` when:**
- any requirement is non-functional, cross-cutting UI, environment, security/access, operational, architectural, performance, reliability, or explicitly called a supplementary requirement

**Do NOT load `references/supplementary-methods.md` when:**
- the task is purely functional scenario derivation from a single use case path

---

## Expert Operating Rules

- **Scenario first, matrix second.** One matrix covers one executable scenario path. If two alternative flows are mutually exclusive or branch at different points, split them into separate matrices instead of forcing impossible columns.
- **Behavioral economy.** Add a new option only when it changes behavior, message, UI, rule outcome, or boundary status. Mere data variety belongs in concrete values later, not as a new matrix option.
- **Cheapest falsification wins.** For supplementary requirements, choose the lowest-cost method that could disprove the claim. Escalate to white-box or automation only when black-box evidence is insufficient.
- **Assume locally, ask only when ambiguity changes coverage.** Do not stop after every step for confirmation. Proceed with explicit assumptions unless missing/ambiguous source text would materially change variables, options, or expected results.
- **Control matrix growth.** If columns start expanding beyond the expected minimum, first check for hidden scenario splits, duplicated behavior categories, or invalid options that can share a column through second-chance rows.

---

## Core Methodology: The 4-Step Method

Functional test cases are derived from Use Case **scenarios** — each scenario is one complete path through a use case (basic flow, or basic flow + one alternative/exception flow). Each scenario produces one Test Case Allocation Matrix.

### Step 1: Identify Variables for Each Use Case Step

Extract every input variable from every step where the user provides data or makes a selection.

**What counts as a variable:**
- Text fields (user ID, password, name, address, email)
- Selections (choosing a flight, selecting a seat type, picking a country)
- Dates, numbers, quantities
- Any user-driven choice that could affect system behavior

**Critical rule — dynamic variable count:** The number of variables may depend on values entered in previous steps. If step B3 sets "Number of passengers = 3", then step B11 (passenger information) will contain three sets of name/sex/date-of-birth variables — one per passenger. Account for this when listing variables.

**Include a system-populated field as a test variable only if keeping the default vs overriding it could change coverage.** Purely hidden/system-internal values are not matrix rows.

Present variables in this format before proceeding:
```
- [Step ID]. [Step description]:
  - [Variable 1]
  - [Variable 2]
  ...
```

### Step 2: Identify Significantly Different Options

For each variable, identify options that are "significantly different" — meaning they may trigger **different system behavior**. Two values causing identical system reactions are NOT significantly different (e.g., "Alexandria" and "JohnGordon" are both valid 6-10 char user IDs — identical system behavior — NOT significantly different).

**The 7 Criteria — an option IS significantly different if it:**

1. **Triggers a different process flow** (usually an alternative flow)
   - Invalid password → triggers Alternative Flow 2

2. **Triggers a different error message**
   - Email too long → "Email should have no more than 50 characters"
   - Email missing @ → "Invalid email address"
   - These are TWO different options because they produce different messages

3. **Causes a different UI appearance**
   - Payment = "Credit Card" shows card number fields; Payment = "PayPal" shows email field

4. **Causes different selections in dependent fields**
   - Country = "U.S." → State dropdown shows states; Country = "Canada" → shows provinces; Country = other → field dimmed
   - This yields exactly THREE options, not one per country

5. **Is an input to a business rule**
   - "If order placed after 6 PM + Overnight Shipment → show delay warning"
   - Creates two options: before 6 PM + overnight, after 6 PM + overnight

6. **Is a border condition**
   - "Password must be at least 6 characters" → test 5 chars (just below boundary) AND 6 chars (at boundary)
   - ALWAYS test the value immediately below and at the boundary

7. **Tests format ambiguity** (when input format is not enforced)
   - Phone as free-form text → test (973) 123-4567, 973-123-4567, 973 123 4567, 9731234567

**Before identifying options, ask yourself:**
- What valid inputs exist? Are there meaningfully different valid categories?
- What invalid inputs might a user enter? What errors would each trigger?
- Where are the exact boundary values for length/range constraints?
- Do any business rules create option splits based on this variable?
- Does the variable have a default value? (Test keeping vs. overriding default)
- Do locale/country differences affect valid formats?

**Mandatory trigger**: Load [`references/option-catalog.md`](references/option-catalog.md) whenever boundary, negative, format, default-value, or dependent-field patterns are not fully explicit in the source requirements.

**Do not explode the matrix:** If none of the 7 criteria separates two candidate values, keep one representative option and push the rest into concrete-value assignment later.

### Step 3: Build the Test Case Allocation Matrix

The matrix combines all variables and their options into a minimal set of test cases.

**Matrix structure:**

| Step | Variable | T1 | T2 | T3 | ... | Tn |
|------|----------|----|----|----|----|-----|

- **Rows**: One per variable, ordered by step sequence
- **Columns**: T1 through Tn = individual test cases
- **Column count**: Start with the largest number of significantly different options for any single variable. Typically 5–7 test cases cover a scenario.

**The 8 Construction Rules (follow precisely):**

1. **Fill row by row, left to right.** Place the most common valid option in T1. Enter one significantly different option per cell.

2. **Second-chance rows for invalid options.** When an option is invalid (will trigger an error and stop the flow), add a sub-row directly beneath. In the sub-row, enter a valid replacement so the test case can continue. Choose replacements that cover a reasonable mix of valid options and popular choices.

3. **Cross-row consistency.** When filling a row, ensure no option contradicts values already entered in the same column. If T3 has "Departure date = past date" (invalid, retried with valid date), the Return Date for T3 must reference the retried valid date.

4. **Filler strategy.** If a variable has fewer options than columns, fill remaining cells with the most popular valid options or slightly unusual-but-valid variations to add diversity.

5. **Overflow strategy.** If a variable has more options than columns, check if some invalid options can share a column via the second-chance row. Only add a new column as a last resort.

6. **Dependent rows.** Rows that only apply to certain test cases (e.g., "2nd passenger name" only when passengers > 1) are left blank in inapplicable columns.

7. **Unknown-at-design-time cells.** Mark cells that cannot be determined until test execution as "TBD at test time" (e.g., "seats for leg 2" when we don't know the selected flight's stopovers).

8. **Action rows.** Insert rows for user actions that trigger system responses (Search, Login, Submit). These are navigation markers, not input variables — enter the action name and expected system response.

### Matrix Pressure Decision Rules

If the matrix is getting too wide, use this order of checks before adding columns:

1. **Hidden scenario split?** If columns require mutually exclusive flow branches, split the scenario.
2. **Same behavior disguised as many values?** Collapse equivalent values into one option.
3. **Can invalid options share a column?** Use second-chance rows before creating a new test case.
4. **Can dependent rows stay blank?** Do not force values into rows that do not apply.
5. **Still too many distinct behaviors?** Add columns — but only after the first four checks fail.

### Step 4: Assign Concrete Values & Split

Transform the allocation matrix into individual test case tables:

1. **Replace abstract options with concrete values**: "Valid airport code" → "EWR"; "Maximum length name" → "Georgiamistopolis"; "Valid future date" → "2025-04-15"
2. **Add Expected Result column**: For input rows → "Accept" or "Reject: [expected error message]". For action rows → describe expected screen/response
3. **Add execution columns**: Actual Result, Pass/Fail, Comments — left blank for testers
4. **One table per test case** from the allocation matrix

---

## Supplementary Requirements: 8 Testing Methods

Non-functional/supplementary requirements require different testing approaches. Select the method matching the requirement's nature:

| # | Method | When to Use | Example |
|---|--------|-------------|---------|
| 1 | **Different Environments** | Platform/browser/OS compatibility | "Shall work in Chrome and Firefox" |
| 2 | **Additional Checks on All Use Cases** | UI behavior applying to every screen | "Mandatory fields marked with star" |
| 3 | **Modify Specific Use Cases** | Security/access tied to specific flows | "Password required for admin screens" |
| 4 | **Perform the Exercise** | Time-based or procedural requirements | "User shall learn system in 1 hour" |
| 5 | **Checklist** | Binary yes/no verification | "System shall use Oracle database" |
| 6 | **Analysis** | Architecture/design review (often mental) | "No client installation required" |
| 7 | **White-Box Testing** | Requires knowledge of code/data internals | "Search must not miss any direct flight" |
| 8 | **Automated Testing** | Performance, reliability, load | "Response time < 2 seconds" |

**MANDATORY**: Load [`references/supplementary-methods.md`](references/supplementary-methods.md) for detailed procedures, decision guidance, and examples for each method.

---

## Anti-Patterns — NEVER Do

- **NEVER test only valid inputs.** Production defects cluster around validation and recovery logic; a matrix with no invalid/boundary coverage proves only the happy path.
- **NEVER create a dead-end test case.** If an invalid option halts the flow without a second-chance row, the rest of that column stops covering downstream screens and wastes a test slot.
- **NEVER confuse different values with significantly different options.** "Alexandria" and "JohnGordon" are data variety, not behavior variety. Treating them as separate options bloats the matrix without increasing coverage.
- **NEVER mix mutually exclusive branches in one matrix.** Impossible columns look comprehensive on paper but cannot be executed consistently.
- **NEVER ignore cross-row dependencies.** Once a value is retried or changes a downstream rule, every later cell in that column must align to the updated state or the test becomes logically invalid.
- **NEVER duplicate coverage.** Repeating the same invalid email or same edge combination in multiple columns consumes space that should cover a missing behavior class.
- **NEVER skip border conditions when a bound exists.** Off-by-one failures often survive broad valid/invalid sampling; you need the exact edge and just-outside values.
- **NEVER force supplementary requirements into the use-case matrix.** Cross-cutting, architectural, operational, or performance claims are not just more functional rows; using the wrong method gives false evidence.
- **NEVER omit action rows.** Without the trigger action and expected transition, testers cannot tell when a screen change or validation message should happen.
- **NEVER build tables ad hoc before a matrix.** The matrix is the de-duplication mechanism; skipping it usually produces redundant cases and hidden gaps.
- **NEVER leave a user-input variable with only one tested option unless the requirement truly allows only one value.** One-option rows usually mean you failed to look for boundaries, invalid formats, defaults, or dependent-rule splits.
- **NEVER pause for user confirmation after every phase.** That slows execution and adds no value unless the ambiguity would change the resulting coverage.

---

## Design Mode Workflow

When the user provides Use Case content and asks to generate test cases:

1. **Parse input**: Identify use case name, scenario path (basic flow + alternative flows), and all steps with user input or selections.
2. **Step 1 — List variables**: Extract all variables per step. Present assumptions clearly; ask for confirmation only if missing or ambiguous source text would change coverage.
3. **Step 2 — Identify options**: For each variable, apply the 7 criteria. Load `references/option-catalog.md` for complex variables.
4. **Step 3 — Build matrix**: Construct the Test Case Allocation Matrix applying all 8 construction rules.
5. **Step 4 — Assign values**: Replace abstractions with concrete values. Generate individual test case tables.
6. **Supplementary requirements** (if provided): Classify each by testing method. Load `references/supplementary-methods.md`. Generate test plan.
7. **Deliver**: Allocation Matrix + Individual Test Case Tables + Supplementary Test Plan (if applicable).

## Evaluate Mode Workflow

When the user provides existing test case tables for review:

1. **Structural check**: Does each table have Step, Variable, Value, Expected Result columns?
2. **Variable coverage**: Compare variables against use case steps. Flag missing variables.
3. **Option coverage**: For each variable, check significantly different options against the 7 criteria. Flag missing options — especially border conditions and invalid inputs.
4. **Matrix quality**:
   - Are second-chance rows present for invalid options?
   - Are cross-row dependencies consistent?
   - Are there duplicate test combinations?
   - Are action rows present between input groups?
5. **Supplementary coverage** (if applicable): Verify correct method selection and adequate coverage.
6. **Produce evaluation report** using the template below.

---

## Output Templates

### Test Case Allocation Matrix

```markdown
## Test Case Allocation Matrix: [Use Case Name] — [Scenario Name]

| Step | Variable | T1 | T2 | T3 | T4 | T5 | T6 |
|------|----------|----|----|----|----|----|----|
| [ID] | [Variable] | [Option] | [Option] | [Option] | [Option] | [Option] | [Option] |
|  |  |  |  | [2nd-chance valid replacement] |  | [2nd-chance] |  |
| [ID] | [Next variable] | ... | ... | ... | ... | ... | ... |
| [ID] | **[Action]** | — | — | — | — | — | — |
```

### Individual Test Case Table

```markdown
## Test Case [TC-ID]: [Use Case Name] — [Scenario Name]

| Step | Variable | Value | Expected Result | Actual Result | Pass/Fail | Comments |
|------|----------|-------|-----------------|---------------|-----------|----------|
| [ID] | [Variable] | [Concrete value] | Accept / Reject: [error] |  |  |  |
| [ID] | **[Action]** | [Action name] | [Expected screen/response] |  |  |  |
```

### Supplementary Requirements Test Plan

```markdown
## Supplementary Requirements Test Plan

| Req ID | Requirement | Testing Method | Test Procedure | Expected Outcome |
|--------|-------------|----------------|----------------|------------------|
| [ID] | [Text] | [1 of 8 methods] | [Steps] | [Pass criteria] |
```

### Evaluation Report (Evaluate Mode)

```markdown
## Test Case Evaluation Report: [Document Name]

### Summary
- **Variables Covered**: X / Y (Z%)
- **Option Coverage**: [Adequate / Gaps Found]
- **Matrix Quality**: [Assessment]
- **Supplementary Coverage**: [Assessment or N/A]

### Missing Variables
| Step | Missing Variable | Why It Matters |
|------|-----------------|----------------|

### Missing Options
| Variable | Missing Option | Which of 7 Criteria |
|----------|---------------|---------------------|

### Structural Issues
- [Issue description]

### Recommendations
1. [Specific recommendation]
2. [Specific recommendation]
```
