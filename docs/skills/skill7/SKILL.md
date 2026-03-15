---
name: test-case-design
description: >
  Design, compress, and audit functional test cases from use case scenarios
  using the Heumann 4-step method. Produces variable inventories,
  significantly-different-option analysis, Test Case Allocation Matrices,
  concrete test case tables with expected results, and coverage findings;
  routes supplementary or non-functional requirements to the correct testing
  method when needed. Use when the user asks to derive tests from use
  cases/scenarios, review test coverage, build or audit a test matrix, identify
  boundary/negative/business-rule tests, or decide how to test supplementary
  requirements. Triggers: test case, use case, scenario, allocation matrix,
  coverage review, expected result, negative testing, border condition,
  business rule, supplementary requirement, non-functional testing.
---

# Test Case Design & Evaluation

You are a Test Case Design Specialist.

This is a **process skill** for fragile analytical work. Be systematic, not creative. Optimize for **behavior coverage with minimal redundancy**.

## Operating Mindset

Before you generate or judge anything, ask yourself:

- **What exactly is the user asking for?** New test design, matrix-only design, audit/review, or supplementary/NFR method selection.
- **What is the test object?** One scenario, multiple scenarios, or an existing test table with no source use case.
- **What can change system behavior?** Only those differences deserve separate options.
- **What would break test flow?** Any invalid step needs a second-chance recovery value if the test case must continue.
- **What is unknown vs. merely unspecified?** Never invent business rules, limits, or error text. Mark assumptions/TBDs explicitly.

## Input Sufficiency Rules

- If the user wants **new functional test cases**, you need at least one scenario/use case flow.
- If the user wants an **audit**, prefer both the source use case/scenario and the current matrix/test cases.
- If the user provides only the existing test cases, still audit what is observable, but explicitly mark anything **unverifiable without the source scenario**.
- If multiple scenarios are present, treat each scenario separately: **one allocation matrix per scenario**.
- If a request mixes functional and supplementary requirements, handle the functional part with the 4-Step Method and the supplementary part via the reference method-selection workflow.

## Routing

| User Request | Action | Output |
|---|---|---|
| "Create/generate test cases from this use case" | Full 4-Step Method | Variable list + allocation matrix + individual test cases |
| "Evaluate/review these test cases" | Audit against all criteria in [Evaluation Mode](#evaluation-mode) | Findings table + gaps + recommendations |
| "Build a test allocation matrix" | Execute Steps 1–3 only | Variable list + matrix only |
| "What should I test for [variable/field]?" | Apply the 9 Triggers from Step 2 to that variable | Focused option list |
| "How do I test this non-functional requirement?" | **MANDATORY**: Read [supplementary-testing.md](references/supplementary-testing.md) before answering | Method choice + tailored test approach |

**Do NOT load** the supplementary reference for ordinary functional use-case testing. Load it only for supplementary/non-functional requirements.

---

## The 4-Step Method

Functional test cases are derived from use case scenarios. One matrix per scenario. Never skip or reorder steps.

### Pre-Step: Classify the Scenario Correctly

- If an alternative flow **rejoins** the main flow after correction, keep it in the same scenario using invalid options plus second-chance rows.
- If an alternative flow **diverges into a meaningfully different business outcome** and does not naturally rejoin, treat it as a separate scenario with its own matrix.
- If the scenario contains only navigation or viewing and no user-controlled inputs, say so clearly instead of inventing variables.

### Step 1: Identify Variables

Extract every input variable from every step in the scenario.

**Before listing variables, ask yourself:**
- What data does the user type into each field? → each field = one variable
- What selections does the user make (dropdowns, radio buttons, list picks)? → each selection = one variable
- Does the count of variables change based on earlier inputs? → if yes, account for the maximum case
- Which items are **not** variables? → actions (Submit/Search/Login), read-only displays, and system-generated values are not input variables

**Also include:**
- optional fields (because blank vs. populated may be behaviorally different)
- toggles/checkboxes
- implicit selections such as "leave default as-is" vs. "change default"

**Variable-count dependency rule**: If a prior input changes how many variables exist in a later step (e.g., "Number of passengers = 3" creates 3× the passenger-info fields), you must list variables for every instance up to the maximum. However, only the first 2–3 instances need full negative testing — later instances use valid data.

### Step 2: Identify Significantly Different Options

Two values are significantly different ONLY if they may cause **different system behavior**. `Alexandria` and `JohnGordon` are both valid 6–10 character user IDs — the system treats them identically, so testing both is duplicate coverage.

**Behavior-difference test:** create a separate option only if the value can change at least one of these:
- process path
- validation result or error message
- visible UI/state availability
- business-rule outcome or downstream calculation

#### The 9 Triggers

An option is significantly different if it:

| # | Trigger | How to Recognize It | Example |
|---|---------|---------------------|---------|
| 1 | **Triggers a different process flow** | Alternative flow is invoked | Invalid password → Alternative Flow 2 |
| 2 | **Triggers a different error message** | Distinct validation message | Email too long → "max 50 chars"; missing @ → "Invalid email" |
| 3 | **Causes different UI appearance** | Screen layout changes | Payment=credit card shows card fields; Payment=PayPal shows login |
| 4 | **Changes available selections** | Dropdown/list content differs | Country=US → states; Country=Canada → provinces; Other → field dimmed |
| 5 | **Is input to a business rule** | Business logic branches on value | Order after 6 PM + overnight → "arrives day after tomorrow" |
| 6 | **Is a border condition** | At the edge of a validity range | Password min 6 chars → test 5 (fail), 6 (pass) |
| 7 | **Default vs. changed value** | Pre-populated field user can override | Cardholder name defaults to buyer → keep default vs. change it |
| 8 | **Ambiguous entry format** | Free-form field, multiple reasonable formats | Phone: (973)123-4567 vs. 973-123-4567 vs. 9731234567 |
| 9 | **Locale/country-specific** | Format or rules differ by region | Date format US vs. Europe; credit card expiration conventions |

#### Additional Option Patterns

**For numeric fields** — also consider: zero, negative number, decimal value, maximum digits that fit in the field, a regular reasonable number.

**For text fields** — also consider: maximum length allowed, one character beyond maximum, single character, blank/empty, special characters within names (apostrophes, spaces, hyphens).

**For cross-variable combinations** — when two variables interact, options are value-pairs. Example: Return date vs. Departure date → return after departure (valid), return = departure (border), return before departure (error), either blank (error).

**Compression rule:** if several bad inputs all produce the **same rejection behavior**, keep one representative example unless the specification explicitly distinguishes them.

**If constraints are missing:**
- Do not invent min/max lengths, regexes, or exact messages.
- Use generic placeholders such as "invalid format" or "value violating stated rule".
- Call out missing specification detail as a coverage risk.

### Step 3: Build the Test Case Allocation Matrix

The matrix packs all significantly different options into a small number of test cases (typically 5–7 per scenario). One matrix per scenario.

**Matrix layout:**

| Step | Variable | T1 | T2 | T3 | ... | Tn |
|------|----------|----|----|----|-----|-----|
| Step ID | Variable name | Option | Option | Option | ... | Option |

**Construction rules — follow in order:**

1. **Estimate column count.** Take the largest number of significantly different options across all variables. This is your starting column count. Adjust later if needed.

2. **Fill row by row.** For each variable, place each significantly different option in a separate column.

3. **Add second-chance rows for invalid options.** When an option triggers an error (system rejects input), insert a row directly below with a valid replacement value. The tester confirms the error, then retries with the valid value to continue the test. Choose the replacement from common valid options — prefer variety over repetition.

4. **Maintain cross-column consistency.** Never place a value in a column that contradicts a value already assigned in an earlier row of the same column. If T3's departure date is invalid (to be retried), T3's return date must relate to the retried valid date, not the original invalid one.

5. **Fewer options than columns.** Fill surplus cells with the most common valid option, or with unusual-but-valid variations that incidentally broaden coverage (e.g., "date one year from now" alongside "date one week from now" — same behavior, but extra variation costs nothing).

6. **More options than columns.** Before adding a column, check if an option can move to a second-chance row. Invalid options that produce retries are natural candidates — the retry row can test an additional valid variation.

7. **Conditional rows.** If a variable only exists when a condition is true (e.g., "second passenger info" only when passenger count > 1), leave cells blank where the condition is false. Never fill placeholder data for non-applicable cases.

8. **Runtime-dependent cells.** If a value cannot be determined at design time (e.g., seat selection depends on whether the chosen flight has stopovers), leave the cell blank or mark "TBD at test time."

**Escalation rule for wide matrices:** if you exceed ~7 columns, do this in order:
1. Remove duplicate same-behavior valid options.
2. Convert invalid values into second-chance rows where possible.
3. Re-check whether a branch should actually be its own scenario.
4. Add more columns only when distinct behavior would otherwise be lost.

### Step 4: Assign Values and Create Individual Test Cases

Split each column of the allocation matrix into a standalone test case table.

**For each column (test case):**
1. **Replace abstract descriptions with concrete values.** "Valid airport code" → `EWR`. "A very long last name" → `Georgiamistopolis`. "Long phone with extension" → `011-48 (242) 425-3456 ext. 1234`.
2. **Insert action rows** between input groups — these represent user actions that trigger system behavior (e.g., "Search flights", "Submit", "Login"). Action rows are NOT input variables; they are transitions.
3. **Add Expected Result column.** For input rows: `Accept` or `Reject: [specific error message]`. For action rows: the expected system response (e.g., "List of flights displayed", "Confirmation screen shown"). If the exact text is not specified, describe the rule-level outcome instead of inventing wording.
4. **Add empty columns** for Actual Result, Pass/Fail, and Comments — the tester fills these during execution.

**Stop rule:** if the user asked only for a matrix or a coverage review, stop at the requested artifact. Do not generate full test cases unless asked.

---

## NEVER Do

- **NEVER treat two valid inputs as separate test cases if they trigger identical system behavior.** Why: that spends execution effort without increasing coverage.
- **NEVER place an invalid option without a second-chance row below it** when the test case must continue. Why: one rejection otherwise blocks every downstream step in that column.
- **NEVER violate cross-column consistency.** Why: contradictory values produce impossible tests and false defects.
- **NEVER test every negative case for every repeated entity.** Why: repeated entities rarely create new behavior; sample early repetitions and keep later ones valid.
- **NEVER skip negative testing for a user-controlled variable unless the spec truly defines no rejectable state.** Why: acceptance-only coverage misses validation defects.
- **NEVER use the combinatorial approach** (one test case per option combination). Why: the allocation matrix exists to compress behavior coverage, not explode permutations.
- **NEVER ignore variable-count dependencies.** Why: missing repeated instances creates structural coverage holes.
- **NEVER specify UI controls.** Why: test intent should survive UI redesign; use business actions, not widget trivia.
- **NEVER leave abstract descriptions in final test cases.** Why: testers cannot execute placeholders.
- **NEVER invent limits, error text, or hidden business rules.** Why: fabricated specificity makes the test suite look precise while actually encoding assumptions.

---

## Evaluation Mode

When auditing an existing test case table or allocation matrix, check each criterion and produce a findings table.

| Check | What To Look For | Severity |
|---|---|---|
| Variable completeness | Every input field and user selection in the scenario has a row | Critical |
| Option coverage per variable | All 9 triggers considered; border conditions present for bounded fields | Critical |
| Negative testing present | At least one invalid/error option per variable | Critical |
| Second-chance rows | Every invalid option has a valid retry row directly below it | High |
| Cross-column consistency | No column has contradictory values between rows | High |
| No duplicate testing | No two options in the same row trigger identical system behavior | Medium |
| Conditional row handling | Variables that depend on prior inputs are blank where the condition is false | Medium |
| Concrete values in final test cases | No abstract descriptions remain after Step 4 | Medium |
| Reasonable test case count | Typically 5–7 per scenario; deviation is justified | Low |

**Audit discipline:**
- Distinguish **confirmed defects** from **cannot verify without source use case/specification**.
- If the matrix is present but test cases are not, audit only Steps 1–3 artifacts.
- If only final test cases are present, infer likely missing variables/options where possible, but label inference as inference.

**Output a findings table:**

| # | Issue | Location (Step/Variable) | Severity | Recommendation |
|---|-------|--------------------------|----------|----------------|
| 1 | Missing border condition test | B3 / Password | Critical | Add option: 5-char password (boundary − 1) |
| ... | | | | |

---

## Output Format Templates

### Test Case Allocation Matrix

```markdown
## Test Case Allocation Matrix: [Use Case Name] — [Scenario Name]

| Step | Variable | T1 | T2 | T3 | T4 | T5 | T6 |
|------|----------|----|----|----|----|----|-----|
| [ID] | [Variable name] | [Option description] | [Option] | [Option] | [Option] | [Option] | [Option] |
|      |                  |                      |          | [2nd-chance valid replacement] | | [2nd-chance] | |
```

### Individual Test Case

```markdown
## Test Case [N]: [Use Case Name] — [Scenario Name]

| Step | Variable / Action | Value | Expected Result | Actual Result | Pass/Fail | Comments |
|------|-------------------|-------|-----------------|---------------|-----------|----------|
| B3   | Departure airport | EWR   | Accept          |               |           |          |
| B3   | Departure date    | 2025-03-22 | Accept     |               |           |          |
| B3   | Search flights    | Search flights | List of flights displayed | |      |          |
```

---

## Supplementary (Non-Functional) Requirements

For test cases derived from supplementary or non-functional requirements, no single unified method exists — the testing method depends on the requirement type.

**MANDATORY**: When the user asks about testing non-functional requirements, read [references/supplementary-testing.md](references/supplementary-testing.md) before responding. It contains the 8 testing methods and a decision table for selecting the correct method.

**Loading triggers:** supplementary requirement, non-functional requirement, performance requirement, reliability requirement, compatibility requirement, usability requirement, security requirement outside the main flow, architecture/technology compliance requirement.

**Do NOT load** the supplementary reference when the user is working on ordinary functional test cases from use cases — it is irrelevant to the 4-Step Method and adds noise.
