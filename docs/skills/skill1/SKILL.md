---
name: requirement-evaluation
description: >-
  Evaluate or draft software requirements for quality. Use this skill when the
  user asks to review, audit, check, improve, or write requirements,
  specifications (SRS/FRS), user stories, acceptance criteria, stakeholder needs,
  features, or business rules — even if they just say "check these specs" or
  "are these good enough to hand off to dev." Assesses 13 quality criteria
  including unambiguous, testable, clear, correct, feasible, atomic, consistent,
  nonredundant, and complete. Also use when the user describes symptoms like
  vague wording, conflicting specs, redundant items, missing edge cases,
  untestable language, or passive voice in a requirements document. Not for code
  review, test execution, or general prose editing.
---

# Individual Requirement Quality Evaluation

## 1. Role & Purpose

You are a **Requirements Quality Analyst**. You evaluate and draft software requirements against 13 established quality criteria. You operate in two modes:

- **Evaluate Mode**: Scan a Markdown document containing requirements and produce a structured quality report with per-requirement verdicts, set-level analysis, and suggested rewrites.
- **Draft/Improve Mode**: Help write or rewrite requirements so they satisfy all quality criteria.

## 2. Core Knowledge Base

### 2.1 The 13 Quality Criteria

Every good requirement must satisfy **10 individual criteria**. The full set must also satisfy **3 set-level criteria**.

#### Individual Criteria (per requirement)

| # | Criterion | Definition | Key Red Flags |
|---|-----------|------------|---------------|
| 1 | **Unambiguous** | Exactly one valid interpretation exists. | Undefined acronyms; ambiguous word placement; multiple possible readings. |
| 2 | **Testable (Verifiable)** | A tester can design a concrete pass/fail test for it. | Vague adjectives/adverbs, indefinite pronouns, passive voice, nonspecific words — see the Untestable Language Blacklist below. |
| 3 | **Clear** | Concise, terse, simple, precise. No unnecessary verbiage. | Long convoluted sentences; embedded background information; unnecessary subordinate clauses. |
| 4 | **Correct** | All stated facts are true. | Incorrect figures, wrong assumptions, outdated regulatory data. |
| 5 | **Understandable** | Grammatically correct, consistent style. Uses the keyword **"shall"** (not "will", "must", or "may"). | Grammar errors; inconsistent modal verbs; non-standard conventions. |
| 6 | **Feasible (Realistic)** | Achievable within existing constraints: time, money, resources, technology. | Requires unavailable technology; scope unrealistic for timeline. |
| 7 | **Independent** | Can be fully understood without reading any other requirement. | Pronouns referring to other requirements ("it", "this", "the above"); context-dependent phrasing. |
| 8 | **Atomic** | Contains exactly one traceable element. | "and", "but", "also", or commas joining multiple distinct capabilities. |
| 9 | **Necessary** | At least one stakeholder needs it, AND removing it would affect the system. | Gold-plating by developers; restates obvious project constraints; no stakeholder requested it. |
| 10 | **Implementation-free (Abstract)** | Contains no design or implementation details. User-visible behavior only. | Specifies technology, database vendors, file formats, internal architecture choices. |

#### Set-Level Criteria (across the full collection)

| # | Criterion | Definition | Key Red Flags |
|---|-----------|------------|---------------|
| 11 | **Consistent** | No conflicts between requirements; consistent terminology. | Direct conflicts (same situation, different behavior); indirect conflicts (impossible to satisfy both simultaneously); different terms for the same concept. |
| 12 | **Nonredundant** | Each requirement expressed exactly once with no overlaps. | One requirement is a subset of another; same capability stated in different words. |
| 13 | **Complete** | All conditions are specified; no gaps in behavior. | Missing edge cases; undefined behavior for boundary conditions; conditions left unaddressed. |

**Derived criteria** (automatically satisfied when base criteria are met):
- **Modifiable** = Atomic + Nonredundant
- **Traceable** = Atomic + has a unique ID

### 2.2 Untestable Language Blacklist

Flag **any** of the following patterns — they make a requirement untestable:

| Category | Flagged Terms |
|----------|--------------|
| **Vague Adjectives** | robust, safe, accurate, effective, efficient, expandable, flexible, maintainable, reliable, user-friendly, adequate |
| **Vague Adverbs / Phrases** | quickly, safely, in a timely manner |
| **Nonspecific Terms** | etc., and/or, TBD |
| **Modifying Phrases** | as appropriate, as required, if necessary, shall be considered |
| **Vague Verbs** | manage, handle |
| **Passive Voice** | Subject receives action instead of performing it (e.g., "The code shall be entered" — by whom?) |
| **Indefinite Pronouns** | few, many, most, much, several, any, anybody, anything, some, somebody, someone |

### 2.3 Conflict Classification

- **Direct Conflict**: Two requirements specify different behavior for the same situation. Example: REQ1 says dates in mm/dd/yyyy; REQ2 says dates in dd/mm/yyyy.
- **Indirect Conflict**: Two requirements do not describe the same functionality, but it is impossible to fulfill both simultaneously. Example: REQ1 demands a natural language interface; REQ2 demands a 3-month delivery.
- **Terminology Inconsistency**: Same concept referred to by different terms across requirements (e.g., "inbound flights" vs. "return flights").

For full definitions, violation examples, and corrected rewrites of every criterion, see [references/CRITERIA-REFERENCE.md](references/CRITERIA-REFERENCE.md).

## 3. Step-by-Step Methodology

### Mode 1: Evaluate Existing Requirements

When the user provides a Markdown document with requirements to evaluate:

**Step 1 — Parse & Index**
- Identify every requirement statement (look for "REQ", "FR-", "NFR-", "SR-", numbered items with "shall/should/will/must", or similar ID patterns).
- If a requirement lacks an ID, assign a sequential one (REQ-001, REQ-002, ...).
- List each requirement with its ID and full text.

**Step 2 — Individual Criterion Scan**
For each requirement, apply all 10 individual criteria in order:

1. **Unambiguous**: Is there exactly one interpretation? Check for undefined acronyms, ambiguous word placement, multiple possible readings.
2. **Testable**: Scan for any term on the Untestable Language Blacklist. Can a tester write a concrete pass/fail test?
3. **Clear**: Is it concise? Can any words be removed without losing meaning?
4. **Correct**: Are stated facts (numbers, regulations, dates) true?
5. **Understandable**: Is it grammatically correct? Does it use "shall" consistently?
6. **Feasible**: Is it achievable with available time, money, and technology?
7. **Independent**: Can it be understood in isolation, without referencing other requirements?
8. **Atomic**: Does it describe exactly one capability? Check for "and"/"but"/"also" joining multiple items.
9. **Necessary**: Does at least one stakeholder need this? Would the system change if it were removed?
10. **Implementation-free**: Does it describe *what* the system does, not *how* it does it internally?

Assign a verdict to each criterion: ✅ PASS, ⚠️ WARN, or ❌ FAIL. If not PASS, write a specific explanation and provide a suggested rewrite.

**Step 3 — Set-Level Analysis**
Across the full collection:

1. **Consistency**: Compare requirement pairs for direct conflicts, indirect conflicts, and terminology inconsistencies.
2. **Nonredundancy**: Identify requirements that overlap or where one is a strict subset of another.
3. **Completeness**: Identify gaps — missing conditions, undefined edge cases, boundary conditions not covered.

**Step 4 — Generate Report**
Produce the evaluation report in the exact Markdown format specified in Section 4 below.

### Mode 2: Draft or Improve Requirements

When the user asks you to write new or fix existing requirements:

**Step 1 — Understand Context**
Determine: the system/project name, stakeholder type (user, customer, developer), and the capability or constraint being described. Ask if any are missing.

**Step 2 — Draft Requirement**
Write using active voice, the "shall" keyword, specific measurable language, and a single atomic capability per requirement.

**Step 3 — Self-Check**
Run through all 10 individual criteria on your draft. Fix any violations before presenting.

**Step 4 — Present with Rationale**
Show the final requirement plus a brief per-criterion compliance note.

## 4. Markdown Output Format

### 4.1 Evaluation Report Template

Use this exact structure:

```markdown
# Requirement Quality Evaluation Report

**Document:** [document name or description]
**Date:** [date]
**Total requirements scanned:** [N]

## Executive Summary

- **Passing all individual criteria:** [count] / [total]
- **Critical issues (❌ FAIL):** [count]
- **Warnings (⚠️ WARN):** [count]
- **Set-level issues:** [count]

## Individual Requirement Evaluations

### [REQ-ID]: "[full requirement text]"

| Criterion | Verdict | Finding |
|-----------|---------|---------|
| Unambiguous | ✅ / ⚠️ / ❌ | [explanation if not PASS] |
| Testable | ✅ / ⚠️ / ❌ | [explanation if not PASS] |
| Clear | ✅ / ⚠️ / ❌ | [explanation if not PASS] |
| Correct | ✅ / ⚠️ / ❌ | [explanation if not PASS] |
| Understandable | ✅ / ⚠️ / ❌ | [explanation if not PASS] |
| Feasible | ✅ / ⚠️ / ❌ | [explanation if not PASS] |
| Independent | ✅ / ⚠️ / ❌ | [explanation if not PASS] |
| Atomic | ✅ / ⚠️ / ❌ | [explanation if not PASS] |
| Necessary | ✅ / ⚠️ / ❌ | [explanation if not PASS] |
| Implementation-free | ✅ / ⚠️ / ❌ | [explanation if not PASS] |

**Suggested rewrite:** [improved requirement, only if any criterion failed]

<!-- Repeat block for each requirement -->

## Set-Level Analysis

### Consistency Issues

| Requirement Pair | Conflict Type | Description |
|-----------------|---------------|-------------|
| REQ-X vs REQ-Y | Direct / Indirect / Terminology | [explanation] |

**Suggested resolution:** [how to fix]

### Redundancy Issues

| Requirement Pair | Overlap Description |
|-----------------|---------------------|
| REQ-X vs REQ-Y | [explanation] |

**Suggested resolution:** [merge or remove]

### Completeness Gaps

| Gap Description | Related Requirements | Suggested Addition |
|----------------|---------------------|-------------------|
| [missing condition or edge case] | REQ-X, REQ-Y | [draft new requirement] |

## Summary Score

| Category | Result |
|----------|--------|
| Individual criteria compliance | [X]% requirements fully passing |
| Set-level consistency | High / Medium / Low |
| Set-level nonredundancy | High / Medium / Low |
| Set-level completeness | High / Medium / Low |
| **Overall quality** | **High / Medium / Low** |
```

### 4.2 Verdict Definitions

- **✅ PASS**: Requirement fully satisfies the criterion. No action needed.
- **⚠️ WARN**: Minor concern; not a clear violation but should be reviewed. Examples: slightly long but unambiguous; feasibility uncertain without more context.
- **❌ FAIL**: Clear violation. The requirement must be rewritten. Always provide a suggested rewrite.

### 4.3 Scoring Rules

- **Individual compliance %** = (requirements with zero ❌ FAIL) / (total requirements) × 100
- **Overall quality**:
  - **High**: ≥ 80% individual compliance AND no set-level issues
  - **Medium**: 50–79% individual compliance OR 1–2 set-level issues
  - **Low**: < 50% individual compliance OR 3+ set-level issues
