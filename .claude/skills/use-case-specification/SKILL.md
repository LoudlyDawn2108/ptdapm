---
name: use-case-specification
description: >
  Draft, evaluate, or repair software Use Case Specification documents in Markdown.
  Use when asked to create, review, score, or fix use cases, actors, basic flows,
  alternative flows, preconditions, postconditions, extension points, scenarios,
  or include/extend/generalization structure. Keywords: "use case", "basic flow",
  "alternative flow", "actor", "scenario", "precondition", "postcondition",
  "extension point", "include", "extend", "functional requirement",
  "flow of events", "use case model".
---

# Use Case Specification Agent

Process-pattern skill for requirements engineering. Freedom level: **medium-low**.
Prefer consistency and evidence over creativity.

## Load Strategy

Use `SKILL.md` alone for simple drafting or light review.

**MUST load** [`references/REFERENCE.md`](references/REFERENCE.md) when you need to:
- enumerate scenarios
- evaluate an existing Use Case Specification end-to-end
- decide whether something should be **inline**, **include**, **extend**, or **generalization**
- judge whether a candidate flow is too small, too large, duplicate, or only a data variation
- repair a flawed specification instead of drafting from scratch

**Do NOT load** the reference only to format a short, straightforward single-flow use case.

## Core Mindset

Before writing, ask yourself:
1. **What actor goal ends here?** One use case should deliver one observable actor-valued result.
2. **Is this behavior really step-different?** If only the data changes, it is usually a test variation, not an alternative flow.
3. **Is the boundary right-sized?** Tiny fragments should merge upward; nested alternatives should split outward.
4. **What is durable system state?** Preconditions/postconditions describe state, not UI narration.
5. **What is evidence vs. assumption?** Do not invent business rules, permissions, or failure behavior silently.

## When NOT to Use a Use Case Specification

Do not force this format when the request is primarily:
- a backlog/user-story decomposition task
- a data schema or API contract task
- a pure business-rules catalog with little interaction flow

If interaction flow is not the core artifact, say so and use a lighter structure.

## Mode Detection

| User Intent | Mode | Action |
|---|---|---|
| Draft / create / write | **Draft** | Produce a new specification from available facts and explicit assumptions |
| Evaluate / review / judge / score | **Evaluate** | Inspect against the checklist and report Pass / Warn / Fail |
| Fix / improve / repair | **Repair** | Evaluate first, then rewrite the broken sections or the whole specification |
| Ambiguous | **Ask** | Ask whether to draft, evaluate, or repair |

## Boundary and Structure Decisions

Use this decision table before drafting or repairing:

| Signal | Interpretation | Action |
|---|---|---|
| Only 1-2 steps or no standalone actor value | Too small | Merge into a larger use case |
| Same steps, different input/output data | Not a true alternative | Move to test cases or notes |
| Optional/conditional chunk that can be understood separately | Extension behavior | Consider **Extend** |
| Mandatory chunk repeated across multiple use cases | Shared required behavior | Extract **Include** |
| Similar peer use cases with same skeleton but meaningful specialization | Shared abstraction | Consider **Generalization** sparingly |
| Alternative flow contains its own alternative logic | Too large / nested | Extract a separate use case instead of nesting |

## Draft Workflow

### Phase 1 — Capture only the facts that matter

Collect or infer, in this order:
- system name
- initiating actor
- supporting actors / external systems
- trigger
- actor-valued success result
- business rules only when they change the flow

If a missing fact blocks correctness, ask a **targeted** question. Otherwise proceed with labeled assumptions.

### Phase 2 — Draft the Basic Flow

Write the most common success path.

**Mandatory conventions**
- Basic flow label: **B**
- Basic flow steps: **B1, B2, B3, ...**
- Each step names the performer: actor or system
- Prefer actor action → system response rhythm
- Do **not** invent fake UI steps just to force alternation

A good basic flow ends with an observable result for the initiating actor, not an internal implementation action.

### Phase 3 — Discover Alternative Flows

For each basic flow step, ask:
1. What other actor choice meaningfully changes the steps?
2. What failure condition changes the steps?
3. What optional behavior is valuable enough to model?
4. What can happen at any time (cancel, help, retry, back)?

**Mandatory conventions**
- Alternative flows: **A1, A2, A3, ...**
- Steps within alternative flow N: **A{N}.1, A{N}.2, ...**
- First step states branch point: `In step B{X}...` or `After step B{X}...`
- Last step states return point or termination

**Unique Action Sequence Test**
- Keep the flow only if it **adds, removes, reorders, or replaces** steps.
- If the step sequence is unchanged and only the data differs, it is **not** a valid alternative flow.

### Phase 4 — Complete the Remaining Sections

- **Brief Description**: 1-3 sentences with purpose + every interacting actor
- **Special Requirements**: only use-case-specific non-functional constraints
- **Preconditions**: state that must already be true before B1
- **Postconditions**: durable state after the use case ends; applies to all flows unless explicitly scoped
- **Extension Points**: only when an extending use case can attach at a named location

### Phase 5 — Enumerate Scenarios

**MANDATORY:** load [`references/REFERENCE.md`](references/REFERENCE.md) before performing scenario enumeration.

Minimum scenario set:
- one scenario for basic flow alone
- one scenario per alternative flow
- extra scenarios only for reasonable adjacent / influencing combinations
- for backward loops, show one pass and two passes

Do **not** generate the full Cartesian product of alternatives.

### Phase 6 — Structural Quality Check

Do not deliver until these are true:
- [ ] One initiating actor and one actor-valued goal
- [ ] Basic flow is the normal success path
- [ ] Every alternative passes the Unique Action Sequence Test
- [ ] Every alternative has explicit branch and return/termination
- [ ] Numbering is consistent (`B1`, `A2.3`, etc.)
- [ ] Preconditions are true before B1, not actions inside the flow
- [ ] Postconditions describe durable state, not only screen text
- [ ] Repeated mandatory chunks are extracted via **Include** when needed
- [ ] Optional/conditional chunks are modeled via **Extend** when needed

## Evaluation / Repair Workflow

**MANDATORY:** load [`references/REFERENCE.md`](references/REFERENCE.md) before evaluating or repairing.

Evaluate each criterion as **Pass**, **Warn**, or **Fail**:
1. Actor validity
2. Use case granularity
3. Meaningful name
4. Brief description quality
5. Basic flow completeness
6. Alternative flow uniqueness
7. Flow naming convention
8. Branch and return points
9. Preconditions and postconditions
10. Scenario coverage
11. Redundancy / extraction opportunities
12. Structural relationships

Use this severity guide when reporting issues:
- **High**: invalid use case boundary, missing initiating actor, data-only alternative flows, missing branch/return points, contradictory or mis-scoped postconditions
- **Medium**: weak naming, incomplete brief description, missing scenarios, unextracted repeated logic
- **Low**: wording, formatting, or minor consistency issues

If in **Repair** mode, rewrite the broken sections instead of only criticizing them.

## NEVER Do

- **NEVER** model a data-only variation as an alternative flow; it bloats scenarios and hides the real behavioral differences.
- **NEVER** force actor/system alternation by inventing UI chatter; that shifts the spec toward implementation detail instead of externally visible behavior.
- **NEVER** treat a login performed inside the flow as a precondition; if it happens during the interaction, it belongs in the flow or an included use case.
- **NEVER** write postconditions as if only the happy path matters; state-based outcomes must cover all valid endings unless explicitly scoped.
- **NEVER** leave an alternative flow without a branch point and return point; unanchored alternatives are not testable.
- **NEVER** keep an alternative-of-an-alternative inside one document; extract it because nested branching destroys readability and usually signals a missing use case.
- **NEVER** inline repeated mandatory behavior across multiple use cases; extract **Include** so maintenance changes happen once.
- **NEVER** use vague names such as `Process 1`, `Manage Data`, or implementation names such as `Create Session Bean`; stakeholders must recognize the goal immediately.
- **NEVER** silently assume permissions, payment rules, retries, or validation behavior that the source material does not establish.
- **NEVER** enumerate every theoretical scenario combination; combine only nearby or influencing flows and handle loops with one-pass and two-pass coverage.

## Output Templates

### Draft Template

```markdown
# Use Case Specification: [Use Case Name]

## 1. Brief Description
[1-3 sentences: purpose + all interacting actors]

## 2. Basic Flow (B)
- **B1.** [Actor] [action].
- **B2.** System [response].
- **B3.** ...

## 3. Alternative Flows
### A1. [Descriptive Name]
- **A1.1.** In step B{X}, ...
- **A1.2.** ...
- **A1.3.** The flow returns to step B{Y}. / The use case ends.

## 4. Special Requirements
- [Use-case-specific non-functional requirement] / None identified.

## 5. Preconditions
- [...]

## 6. Postconditions
- [...]

## 7. Extension Points
| Name | Location |
|---|---|
| [Extension name] | After step B{X} of the basic flow |

## 8. Scenarios
| Scenario | Flow Sequence | Description |
|---|---|---|
| SC1 | B | Basic flow |
```

### Evaluation Template

```markdown
# Use Case Evaluation Report: [Use Case Name]

## Summary
| Criterion | Result |
|---|---|
| Actor Validity | Pass / Warn / Fail |
| Use Case Granularity | Pass / Warn / Fail |
| Meaningful Name | Pass / Warn / Fail |
| Brief Description | Pass / Warn / Fail |
| Basic Flow Completeness | Pass / Warn / Fail |
| Alternative Flow Uniqueness | Pass / Warn / Fail |
| Flow Naming Convention | Pass / Warn / Fail |
| Branch & Return Points | Pass / Warn / Fail |
| Preconditions / Postconditions | Pass / Warn / Fail |
| Scenario Coverage | Pass / Warn / Fail |
| Redundancy Check | Pass / Warn / Fail |
| Structural Relationships | Pass / Warn / Fail |

## Issues Found
| # | Severity | Location | Issue | Recommendation |
|---|---|---|---|---|
| 1 | High / Medium / Low | [Section] | [Problem] | [Concrete fix] |
```
