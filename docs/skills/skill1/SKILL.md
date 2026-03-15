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

- **Evaluate Mode**: Scan a document containing requirements and produce a structured quality report with per-requirement verdicts, set-level analysis, and suggested rewrites.
- **Draft/Improve Mode**: Write or rewrite requirements so they satisfy all quality criteria. Present each draft with a per-criterion compliance note.

## 2. Core Knowledge Base

### 2.1 The 13 Quality Criteria

Every requirement must satisfy **10 individual criteria**. The full set must also satisfy **3 set-level criteria**.

#### Individual Criteria (per requirement)

| # | Criterion | One-Line Test | Key Red Flags |
|---|-----------|--------------|---------------|
| 1 | **Unambiguous** | Exactly one valid interpretation exists | Undefined acronyms; ambiguous word placement; multiple behavioral readings |
| 2 | **Testable** | A tester can write a concrete pass/fail test | Any term on the Untestable Language Blacklist (§2.2) |
| 3 | **Clear** | No word can be removed without losing meaning | Long convoluted sentences; embedded background info; subordinate clauses |
| 4 | **Correct** | All stated facts are verifiably true | Wrong figures, outdated regulations, false assumptions |
| 5 | **Understandable** | Grammatically correct; uses **"shall"** for obligations | Grammar errors; inconsistent modal verbs ("will"/"must"/"may" instead of "shall") |
| 6 | **Feasible** | Achievable within time, money, resources, technology | Requires unavailable technology; scope unrealistic for timeline |
| 7 | **Independent** | Fully understood without reading any other requirement | Pronouns referring to other requirements ("it", "this", "the above") |
| 8 | **Atomic** | Contains exactly one traceable element | "and"/"but"/"also" joining **distinct capabilities** (see §2.4 thinking framework) |
| 9 | **Necessary** | At least one stakeholder needs it AND removing it changes the system | Gold-plating; restates obvious constraints; no stakeholder requested it |
| 10 | **Implementation-free** | Describes *what*, not *how* | Technology names, DB vendors, file formats, internal architecture |

#### Set-Level Criteria (across the full collection)

| # | Criterion | One-Line Test | Key Red Flags |
|---|-----------|--------------|---------------|
| 11 | **Consistent** | No conflicts between any pair of requirements | Direct conflicts (same situation, different behavior); indirect conflicts (impossible to satisfy both); terminology inconsistency (different terms for same concept) |
| 12 | **Nonredundant** | Each requirement expressed exactly once | One requirement is a subset of another; same capability in different words |
| 13 | **Complete** | All conditions specified; no behavioral gaps | Missing edge cases; undefined boundary conditions |

**Derived criteria** (automatically satisfied when base criteria are met):
- **Modifiable** = Atomic + Nonredundant
- **Traceable** = Atomic + unique ID

### 2.2 Untestable Language Blacklist

Flag **any** of the following — they make a requirement untestable:

| Category | Flagged Terms |
|----------|--------------|
| **Vague Adjectives** | robust, safe, accurate, effective, efficient, expandable, flexible, maintainable, reliable, user-friendly, adequate |
| **Vague Adverbs** | quickly, safely, in a timely manner |
| **Nonspecific Terms** | etc., and/or, TBD |
| **Modifying Phrases** | as appropriate, as required, if necessary, shall be considered |
| **Vague Verbs** | manage, handle |
| **Passive Voice** | Subject receives action instead of performing it (e.g., "The code shall be entered" — by whom?) |
| **Indefinite Pronouns** | few, many, most, much, several, any, anybody, anything, some, somebody, someone |

### 2.3 Conflict Classification

- **Direct Conflict**: Two requirements specify different behavior for the same situation. *Example: REQ1 says mm/dd/yyyy; REQ2 says dd/mm/yyyy.*
- **Indirect Conflict**: Different functionality, but impossible to fulfill both simultaneously. *Example: REQ1 demands natural language interface; REQ2 demands 3-month delivery.*
- **Terminology Inconsistency**: Same concept, different terms across requirements. *Example: "inbound flights" vs. "return flights."*

### 2.4 Expert Thinking Frameworks

**Before assigning any verdict, apply the relevant decision heuristic:**

**Atomic — The "Single Test" Heuristic:**
> Ask: "Can I write ONE test that covers everything in this requirement?" If yes → it's atomic even if it contains "and." The word "and" connecting *aspects of the same capability* (e.g., "display departure time and arrival time") is NOT an atomicity violation. Only flag "and" when it joins *independently testable, distinct capabilities* (e.g., "book a flight and reserve a hotel").

**Testable — The "Write the Test" Heuristic:**
> Ask: "Can I write a specific test case with concrete inputs and an unambiguous expected result?" If the answer requires guessing thresholds, interpreting subjective terms, or defining "enough" — it's untestable. But a requirement like "shall respond within 2 seconds" IS testable even though it contains a qualitative concept (speed) because it has a measurable threshold.

**Implementation-free — The "User-Visible" Heuristic:**
> Ask: "Would an end-user care about this detail?" If the detail is invisible to the user (database choice, file format, internal algorithm), it's implementation. If the user directly experiences it (response time, data they see, actions they perform), it's behavior. Exception: integration requirements that specify protocols (REST API, OAuth) are acceptable when the interface IS the requirement.

**Feasible — The "Evidence Required" Heuristic:**
> Ask: "Do I have concrete evidence this is infeasible, or am I guessing?" Only flag Feasible as FAIL if you can articulate a specific constraint that makes it impossible. If you merely suspect difficulty, use WARN with your reasoning. Do NOT flag feasibility based on general difficulty — software is hard; that's not a violation.

**Correct — The "Verifiable Fact" Heuristic:**
> Ask: "Does this requirement state a fact I can verify as false?" Only flag if you can point to a specific factual error. If you're unsure whether a number is correct, use WARN. NEVER flag Correct based on suspicion.

### 2.5 Evaluation Anti-Patterns (NEVER Do These)

These are mistakes the **evaluator** (you) must avoid:

- **NEVER** flag "and" as an atomicity violation when it connects aspects of a single concept (e.g., "first name and last name", "departure and arrival time").
- **NEVER** mark a requirement as ❌ FAIL on **Correct** without citing a specific verifiable factual error.
- **NEVER** flag **Feasible** as ❌ FAIL based on general difficulty or your assumption about project constraints you don't know.
- **NEVER** flag **Implementation-free** for requirements that specify user-facing technology choices that ARE the requirement (e.g., "mobile app", "web interface").
- **NEVER** penalize a requirement on **Understandable** solely for using "must" or "will" if the document consistently uses that convention. Note it as ⚠️ WARN and suggest "shall" — don't FAIL it.
- **NEVER** flag **Necessary** without considering context. If you lack stakeholder information, mark as ✅ PASS with a note: "Cannot assess necessity without stakeholder context."
- **NEVER** invent requirements that "should exist" during completeness analysis unless there is a clear logical gap in condition coverage evidenced by the existing requirements.
- **NEVER** produce verdicts without explanations. Every ⚠️ WARN and ❌ FAIL MUST have a specific finding.

## 3. Step-by-Step Methodology

### Mode 1: Evaluate Existing Requirements

**Step 1 — Parse & Index**
- Identify every requirement statement (look for "REQ", "FR-", "NFR-", "SR-", numbered items with "shall/should/will/must", or similar ID patterns).
- If a requirement lacks an ID, assign a sequential one (REQ-001, REQ-002, ...).
- List each requirement with its ID and full text.

**Step 2 — Load Reference Material**
- **MANDATORY**: Load `references/CRITERIA-REFERENCE.md` for full violation examples and corrected rewrites. Use it to calibrate your verdicts — compare the requirement under evaluation to the reference examples before deciding.
- **Do NOT load** the reference file only if evaluating a single, obviously passing requirement.

**Step 3 — Individual Criterion Scan**

For each requirement, apply all 10 individual criteria. **For each criterion:**

1. Apply the criterion definition from §2.1.
2. Apply the thinking framework from §2.4 (if one exists for this criterion).
3. Check against the anti-patterns in §2.5.
4. Assign verdict using the WARN vs FAIL boundaries in §3.3.
5. If not PASS, write a specific explanation and provide a suggested rewrite.

Criteria evaluation order: Unambiguous → Testable → Clear → Correct → Understandable → Feasible → Independent → Atomic → Necessary → Implementation-free.

**Step 4 — Set-Level Analysis**
Across the full collection:

1. **Consistency**: Compare requirement pairs for direct conflicts, indirect conflicts, and terminology inconsistencies.
2. **Nonredundancy**: Identify requirements that overlap or where one is a strict subset of another.
3. **Completeness**: Identify gaps — missing conditions, undefined edge cases, boundary conditions not covered. Only flag gaps with clear evidence from existing requirements (see §2.5).

**Step 5 — Generate Report**
Produce the evaluation report in the exact Markdown format specified in Section 4.

### Mode 2: Draft or Improve Requirements

**Step 1 — Understand Context**
Determine: the system/project name, stakeholder type, and the capability or constraint being described. Ask the user if any are missing.

**Step 2 — Draft Requirement**
Write using: active voice, the "shall" keyword, specific measurable language, one atomic capability per requirement. Apply §2.4 thinking frameworks during drafting.

**Step 3 — Self-Check**
Run all 10 individual criteria on your draft. Check against §2.5 anti-patterns. Fix any violations before presenting.

**Step 4 — Present with Rationale**
For each drafted requirement, show:
- The final requirement text
- A per-criterion compliance note (one line each, e.g., "Atomic: ✅ — single capability: user login")
- If multiple requirements were drafted, run set-level checks (Consistent, Nonredundant, Complete) across the set

### 3.1 Edge Case Handling

| Situation | Action |
|-----------|--------|
| **Document has no identifiable requirements** | Report: "No requirement statements found. Expected patterns: 'shall', 'REQ-', 'FR-', numbered items with obligation verbs." Ask user to clarify the document format. |
| **Mixed format** (some requirements + prose/narrative) | Extract only the requirement statements. Note which sections were skipped and why. |
| **Single requirement** (not a set) | Evaluate individual criteria only. Skip set-level analysis. Note: "Set-level analysis requires 2+ requirements." |
| **Non-English requirements** | Evaluate if you can reliably understand the language. If uncertain, state limitations upfront. |
| **Requirements reference external documents you don't have** | Mark **Independent** as ⚠️ WARN. Note: "References external document [name] — cannot verify independence without it." |

### 3.2 WARN vs FAIL Decision Boundaries

| Verdict | Use When | Example |
|---------|----------|---------|
| **❌ FAIL** | Clear violation. A reasonable RE expert would agree this breaks the criterion. The requirement MUST be rewritten. | "The system shall be user-friendly" → Testable ❌ (vague adjective, no measurable threshold) |
| **⚠️ WARN** | Borderline concern. Not a clear violation, but a reasonable expert would flag it for review. The requirement COULD be improved but isn't broken. | "The system shall respond quickly to search queries" → Testable ⚠️ ("quickly" is vague but the intent is clear — needs a threshold) |
| **✅ PASS** | Criterion is clearly satisfied. No reasonable expert would flag this. | "The system shall return search results within 3 seconds" → Testable ✅ |

**Rule of thumb**: If you hesitate between WARN and FAIL, ask: "Would this requirement cause a real problem in development or testing?" If yes → FAIL. If "it depends on context" → WARN.

## 4. Markdown Output Format

### 4.1 Evaluation Report Template

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

**Suggested rewrite:** [improved requirement, only if any criterion ❌ FAIL]

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

### 4.2 Scoring Rules

- **Individual compliance %** = (requirements with zero ❌ FAIL) / (total requirements) × 100
- **Overall quality**:
  - **High**: ≥ 80% individual compliance AND no set-level issues
  - **Medium**: 50–79% individual compliance OR 1–2 set-level issues
  - **Low**: < 50% individual compliance OR 3+ set-level issues

## 5. Worked Example

**Input requirement:**

> REQ-042: The system shall handle user data efficiently and store it in a MySQL database.

**Expected evaluation:**

| Criterion | Verdict | Finding |
|-----------|---------|---------|
| Unambiguous | ⚠️ WARN | "user data" is broad — could mean profile, activity logs, preferences. Clarify scope. |
| Testable | ❌ FAIL | "handle" (vague verb, blacklist §2.2) and "efficiently" (vague adjective, blacklist §2.2) — no measurable threshold. |
| Clear | ⚠️ WARN | "handle user data efficiently" is vague but not excessively verbose. |
| Correct | ✅ PASS | No verifiable factual errors. |
| Understandable | ✅ PASS | Grammatically correct, uses "shall." |
| Feasible | ✅ PASS | MySQL storage is technically feasible. |
| Independent | ✅ PASS | Self-contained. |
| Atomic | ❌ FAIL | Joins two distinct capabilities: (1) handling user data and (2) storing it in MySQL. These require separate tests. (§2.4: "handle data" and "store in MySQL" are independently testable.) |
| Necessary | ✅ PASS | Data handling is a core system need (assuming stakeholder context). |
| Implementation-free | ❌ FAIL | "MySQL database" specifies implementation technology. The user doesn't care which database is used internally. (§2.4: "Would an end-user care?" — No.) |

**Suggested rewrite:**

> REQ-042a: The system shall persist user profile data between sessions.
>
> REQ-042b: The system shall retrieve user profile data within 2 seconds of login.

*Rationale: Split into atomic requirements, removed implementation detail (MySQL), replaced vague "handle efficiently" with specific measurable behavior.*
