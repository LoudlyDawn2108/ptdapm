# Use Case Specification — Reference

Load this file **only** when you need deeper judgment than the main skill body provides.

**MUST load** this reference when you:
- enumerate scenarios
- evaluate or repair an existing specification
- decide between inline flow steps vs **Include** vs **Extend** vs **Generalization**
- judge boundary problems: too small, too large, duplicate, nested, or data-only variations

**Do NOT load** this reference just to format a simple basic flow with no structural ambiguity.

---

## 1. Fast Triage: Is This Even a Valid Use Case?

A candidate use case is valid only if all are true:
1. **Initiated by an external actor**.
2. **Describes interaction** between actor and system.
3. **Contains a sequence of actions**, not a single operation.
4. **Captures functional behavior**, not implementation internals.
5. **Ends in observable actor value**.
6. **Represents a complete interaction goal**, not a fragment.

If any item fails, do **not** polish the document yet. Fix the boundary first.

### Boundary Decision Table

| Signal | Likely Problem | Corrective Action |
|---|---|---|
| Only 1-2 steps | Fragment, not a use case | Merge into its parent use case |
| Outcome is internal only (e.g. "session bean created") | Implementation artifact | Rename/reframe around actor value |
| Same steps, different data | Test variation, not an alternative | Remove from alternative flows |
| Repeated mandatory chunk across multiple use cases | Duplicated behavior | Extract **Include** |
| Optional or conditional chunk that base flow can live without | Extension behavior | Extract or model with **Extend** |
| Alternative flow has its own alternative flow | Oversized / nested structure | Extract a separate use case |

---

## 2. Actor Identification Rules

### What counts as an actor

- Human **role** using the system
- External system that sends data to or receives data from the system
- Scheduled/time trigger such as `Timer` or `System Clock`

### What does **not** count as an actor

- A named person when role is what matters
- An internal module, service class, screen, database, or queue inside the system boundary
- A stakeholder who never directly interacts with the system behavior being modeled

### Actor design heuristics

| Situation | Rule |
|---|---|
| Two user groups have identical permissions and behavior | Merge into one actor |
| Multiple people share the same role | One actor represents all of them |
| External system never initiates but still exchanges data | Keep as supporting actor |
| Similar provider systems behave differently in the flow | Keep separate actors |
| Similar provider systems behave the same | Consolidate into a generic actor |

### Non-obvious check

If the document lists many actors but only one actually changes the flow, the others may belong in the brief description or supporting notes rather than in step-by-step logic.

---

## 3. Naming and Granularity

### Naming rules

- Use domain language stakeholders recognize.
- Name the **goal**, not the mechanism.
- Names must distinguish peer use cases clearly.

| Weak Name | Better Name | Why |
|---|---|---|
| Process Payment Data | Pay Invoice | Actor goal is visible |
| Create Session Bean | Log In | Functional outcome, not implementation |
| Manage Reservations | Cancel Reservation / Change Reservation / View Reservation | Splits vague umbrella behavior |

### Granularity rules

| Problem | Signal | Fix |
|---|---|---|
| Too small | Only one tiny interaction; no standalone value | Merge upward |
| Too large | Many branches, nested exceptions, hard-to-follow numbering | Split into related use cases |
| Too generic | Name hides multiple goals | Separate by actor-valued outcome |

### Expert boundary heuristic

If two chunks are **always** performed together and stakeholders think of them as one goal, keep them together.

If one chunk is reusable across several goals, extract it.

If one chunk is optional/conditional and the base story still makes sense without it, make it an extension.

---

## 4. Inline vs Include vs Extend vs Generalization

This is where many use case specs fail.

| If the behavior is... | Keep Inline | Include | Extend | Generalization |
|---|---|---|---|---|
| Mandatory for one use case only | Yes | No | No | No |
| Mandatory and repeated across many use cases | No | Yes | No | No |
| Optional / conditional / exceptional | Sometimes | No | Yes | No |
| Shared abstract skeleton with meaningful specialized variants | No | No | No | Sometimes |

### Include

Use when a substantial sequence appears in more than one use case and is always required where invoked.

**Good signs**
- The chunk is copied across use cases.
- A rule change would otherwise require edits in multiple documents.
- The included use case can stand alone conceptually.

**Bad signs**
- You are extracting just to reduce document length, but the chunk is used once.
- The included fragment only makes sense in one base use case.

### Extend

Use when behavior is optional, conditional, or exceptional and the base use case still makes sense on its own.

**Good signs**
- Refund only occurs in some deletion cases.
- MFA challenge occurs only under risk conditions.
- Help/cancel/retry behavior is conditional.

**Bad signs**
- Without the extension, the base use case becomes incomplete.
- The extension is really a mandatory shared subtask.

### Generalization

Use sparingly when several use cases share the same structure but differ in meaningful ways.

**Warning:** Stakeholders often understand include/extend more easily than use case generalization. Prefer simpler structure unless the abstraction clearly earns its keep.

---

## 5. Flow Writing Rules

### Numbering

| Element | Format | Example |
|---|---|---|
| Basic flow | `B` | B |
| Basic flow step | `B{N}` | B1, B2 |
| Alternative flow | `A{N}` | A1, A2 |
| Alternative step | `A{N}.{M}` | A1.1, A1.2 |

### Step-writing guidance

1. Each step names the performer: actor or system.
2. Prefer actor action → system response rhythm.
3. Use indented bullets only for stable detail lists, not hidden sub-flows.
4. Basic flow should read as the **most common success path**.
5. Final basic step should expose the actor-valued result.

### Branch and return rules

Alternative flow first step must anchor to the basic flow:
- `In step B{X}, ...` when it replaces that step
- `After step B{X}, ...` when it inserts after that step

Alternative flow last step must say one of:
- `The flow returns to step B{Y} of the basic flow.`
- `The use case ends.`

If a document makes an alternative return into another alternative, treat that as a sign the structure may need extraction or redesign.

---

## 6. The Unique Action Sequence Test

This is the highest-value quality test.

> An alternative flow is valid only when the **sequence of actions** changes, not merely the data values.

### Ask these questions

1. Is any step added?
2. Is any step removed?
3. Is any step reordered?
4. Is a basic step replaced by materially different behavior?

If all answers are **no**, it is probably just a test variation.

### Valid vs invalid examples

**Valid alternative**
- A1.1. In step B3, Traveler chooses `Compare surrounding airports`.
- A1.2. System displays nearby airports.
- A1.3. Traveler selects which airports to include.
- A1.4. The flow returns to step B4.

Why valid: an extra decision step exists.

**Invalid alternative**
- A1.1. In step B3, Traveler chooses `Compare surrounding airports`.
- A1.2. System displays flights including nearby airports.
- A1.3. The flow returns to step B5.

Why invalid: the same interaction pattern occurs; only the search data changed.

### Practical consequence

Data-only alternatives create fake complexity:
- they inflate scenario counts
- they obscure true behavioral branches
- they turn the use case spec into a disguised test matrix

---

## 7. Section-by-Section Rules

### Brief Description
- 1-3 sentences.
- State the purpose.
- Mention every interacting actor.

### Basic Flow
- Most common success path.
- Numbered `B1`, `B2`, ...
- Ends in observable value.

### Alternative Flows
- Less common success paths, optional paths, or failure/exception paths.
- Every alternative must pass the Unique Action Sequence Test.
- Ask of every basic step:
  1. What other actor choice changes the flow?
  2. What failure changes the flow?
  3. What optional behavior matters enough to model?
  4. What can happen at any time?

### Special Requirements
- Only use-case-specific non-functional constraints.
- Cross-cutting requirements belong elsewhere.

### Preconditions
- State true **before** B1.
- Should describe system or access state, not actions taken during the use case.

### Postconditions
- State what is true after the use case ends.
- Unless explicitly scoped, they apply to **all** valid endings.

### Extension Points
- Name + location.
- Only include them if an extending use case actually exists or is intentionally planned.

---

## 8. Scenario Enumeration

### Minimum set

1. One scenario for the basic flow alone: `SC1: B`
2. One scenario per alternative flow
3. Additional scenarios only for **reasonable** combinations

### Combination heuristics

| Combination Type | Include? | Why |
|---|---|---|
| Adjacent or nearby flows | Yes | They can interact |
| Parent flow with closely related follow-up flow | Yes | Combined path matters |
| Distant flows with no interaction | Usually no | Little added learning |
| Looping flow once | Yes | Minimum loop coverage |
| Looping flow twice | Yes | Confirms repeat behavior |
| Full Cartesian product of all alternatives | No | Explosion without insight |

### Enumeration algorithm

1. List all flows: `B, A1, A2, ...`
2. Add basic-only scenario.
3. Add one scenario for each single alternative.
4. Add pairings only where flows are adjacent, dependent, or likely to interfere.
5. For backward loops, add one-pass and two-pass cases.
6. Stop when new scenarios no longer reveal distinct behavior.

### Expert rule

Scenario enumeration is about **behavioral coverage**, not mathematical completeness.

---

## 9. Common Failure Patterns and Repairs

| Failure Pattern | Why It Is Wrong | Repair |
|---|---|---|
| Preconditions say "User logs in" | That is an interaction, not prior state | Move it into the flow or an included use case |
| Postconditions only describe happy path | Leaves exception endings undefined | Rewrite as state outcomes for all valid endings or scope explicitly |
| Alternative flow has no branch point | Testers cannot locate where it diverges | Anchor first step to `B{X}` |
| Alternative flow has no return point | Path is incomplete | Add return to `B{Y}` or end the use case |
| Many repeated validation chunks | Maintenance hotspot | Extract shared mandatory behavior |
| Use case named after UI or code | Stakeholders cannot validate it | Rename around actor goal |
| Too many actors listed in steps | Noise hides real interaction | Keep only flow-relevant actors in steps |

---

## 10. Evaluation Criteria

When evaluating, score each as **Pass**, **Warn**, or **Fail**.

### 1. Actor Validity
- Actors are roles, systems, or timers outside the boundary.
- At least one actor initiates.
- No duplicate actors with identical behavior.

### 2. Use Case Granularity
- Basic flow has at least 3 meaningful steps.
- No nested alternative-of-alternative structure.
- Outcome provides standalone actor value.

### 3. Meaningful Name
- Domain-specific and stakeholder-readable.
- Functional, not implementation-centered.
- Unique in the model.

### 4. Brief Description Quality
- Purpose is clear.
- All interacting actors are mentioned.

### 5. Basic Flow Completeness
- Represents the normal success path.
- Steps are numbered correctly.
- Each step identifies the performer.
- Ends with observable result.

### 6. Alternative Flow Uniqueness
- Apply the Unique Action Sequence Test to each alternative.
- Fail any data-only alternative.

### 7. Flow Naming Convention
- `B`, `B1`, `B2`, ...
- `A1`, `A2`, ... and `A1.1`, `A1.2`, ...
- No mixed numbering schemes.

### 8. Branch and Return Points
- Every alternative starts with a branch anchor.
- Every alternative ends with return or termination.

### 9. Preconditions and Postconditions
- Preconditions are true before start.
- Postconditions express durable end state.
- Scope is explicit if not universal.

### 10. Scenario Coverage
- Basic-only scenario present.
- One scenario per alternative.
- Reasonable combinations present.
- Loop coverage shown once and twice where needed.

### 11. Redundancy
- Repeated mandatory behavior extracted where appropriate.
- Optional behavior not embedded as duplicated inline logic.

### 12. Structural Relationships
- **Include** for shared mandatory behavior.
- **Extend** for optional/conditional behavior.
- **Generalization** only when abstraction meaningfully helps.

---

## 11. High-Value NEVER List

- **NEVER** accept a data-only alternative flow; that is a testing concern, not a use case branch.
- **NEVER** treat internal components as actors; use cases model external interaction with the system boundary.
- **NEVER** move in-flow actions into preconditions just to shorten the basic flow; that hides required behavior.
- **NEVER** leave postconditions ambiguous across endings; downstream design and testing depend on stable end-state claims.
- **NEVER** split a cohesive goal into micro-use-cases just because the UI has multiple screens.
- **NEVER** use **Extend** for mandatory shared behavior; that makes the base use case misleadingly incomplete.
- **NEVER** use **Include** for behavior that is optional or exceptional; that overstates how often it happens.
- **NEVER** keep repairing numbering in a structurally broken document without first fixing the boundary and branching logic.
