---
name: oo-design-from-use-cases
description: >
  Design or audit BCE-based object-oriented class diagrams and sequence diagrams
  from use case scenarios. Use this skill when converting scenarios, user
  stories, or analysis flows into UML/Mermaid designs, checking
  Boundary-Controller-Entity responsibility splits, tracing sequence messages
  back to class operations, or reviewing OO design documents for BCE
  compliance. Triggers include "use case to class diagram", "sequence diagram
  from scenario", "BCE pattern", "boundary controller entity", "robustness
  analysis", "interaction diagram", and "OO design review".
---

# Object-Oriented Design from Use Case Scenarios

Treat the class diagram and sequence diagram as two synchronized views of the same design. Every message must justify a class operation, and every new operation must appear in the interaction flow that needs it.

## Route the task correctly

| Situation | Action |
|---|---|
| User gives a scenario or use case and wants diagrams | Follow the design workflow below |
| User gives existing diagrams and wants critique | Run the evaluation workflow first, then correct only failing parts |
| User wants a concrete end-to-end example for a multi-step transaction | **MANDATORY - read** [`references/design-walkthrough.md`](references/design-walkthrough.md) |
| User only needs a quick BCE sanity check or already provided enough context | **Do NOT load** the walkthrough |

## Think like a BCE designer first

Before naming classes, answer these four questions:

1. **What UI surface receives the actor's request?** That is your boundary candidate.
2. **What reusable business responsibility is being invoked?** That is your controller candidate.
3. **What information must persist or travel through the flow?** Those are your entity candidates.
4. **What information is missing from the scenario?** Add an explicit convention instead of hiding the gap.

The quality bar is not "draw a plausible diagram." It is "make responsibility, reuse, and traceability obvious."

## Core rules that are rigid

### 1) BCE message chain is mandatory

```text
Actor → Boundary → Controller → Entity
```

- Actors do **not** talk directly to controllers or entities.
- Boundary classes own user-facing actions.
- Controller classes own business decisions and orchestration.
- Entity classes own persistent domain state.

### 2) Keep stereotypes pure

| Stereotype | What it should mostly contain | Naming cues |
|---|---|---|
| **Boundary** | Many operations, few attributes | `Form`, `View`, `Page`, `Screen` |
| **Controller** | Many operations, few attributes | `Controller`, `System`, `Selector`, `Processor` |
| **Entity** | Many attributes, few operations | Domain nouns like `Flight`, `Passenger`, `Payment` |

If a class mixes UI handling, business logic, and stored data, the design is already drifting.

### 3) Boundary and controller operations serve different goals

- **Boundary operations** reflect the user-facing action: `getOutboundFlights`, `selectSeat`, `submitPayment`.
- **Controller operations** should be generic enough to reuse across UI contexts: `getFlights`, `getFlightDetails`.
- Reusing the **same** operation name on boundary and controller is fine when the responsibility is still clear.

### 4) Derive arguments from observable input, not wishful thinking

- Map one UI control to one typed argument.
- If the scenario omits required information, make the assumption explicit:
  - sentinel value, or
  - Boolean flag.
- Document the convention in the output instead of burying it in your reasoning.

### 5) Split controllers by change reason

Create a new controller when adding an operation would blur the class's reason to exist.

Good splits:
- Authentication → `LoginController`
- Search / lookup → `FlightSelector`
- Booking transaction → `BookingSystem`
- Payment integration → `PaymentProcessor`

Prefer names that stay valid when the feature grows. `AirportController` ages better than `AirportCodeResolver`.

### 6) Model what comes back from the controller

- When the controller returns data to a boundary, add a **reflexive display operation** on the boundary.
- When multiple domain objects are returned as a set, prefer a wrapper entity such as `ListOfFlights`.
- Every entity should have an explicit unique identifier attribute unless the user clearly frames it as a pure value object.
- Always show multiplicity on both ends of associations/aggregations.

### 7) Sequence readability beats signature dumping

- Keep full typed signatures in the class diagram.
- In the sequence diagram, use `(...)` when full argument lists make the interaction unreadable.
- Number messages sequentially for the scenario being explained.

## Design workflow

Use this order because it keeps the class diagram and sequence diagram consistent.

### Step 1 — Break the scenario into designable exchanges

- Pair a user action with its direct system response.
- Skip steps outside application scope (browser navigation, network plumbing, etc.).
- If a step is standalone rather than a response, design it alone.
- If adjacent steps are logically unrelated, split them even if the text lists them consecutively.

### Step 2 — Choose the boundary

- Reuse a boundary only when the same UI surface owns the interaction.
- If the interaction clearly moves to a different screen, create a new boundary.

### Step 3 — Name the boundary operation and its arguments

- Use the user's language, not system-internal jargon.
- Boundary arguments should mirror what the actor actually provided.
- If the UI would need hidden state, show how that state is obtained or stored.

### Step 4 — Choose the controller operation and owner

- Ask: "Can an existing controller own this without becoming a god object?"
- If yes, reuse it.
- If no, create a focused controller with a reusable name.

### Step 5 — Add entities, wrappers, and relationships

- Add only entities required to carry state or justify messages.
- Introduce wrapper entities for multi-item returns.
- Add multiplicity immediately so you do not forget it later.

### Step 6 — Add the display/self-call

Whenever a controller returns data that the user must see, add the boundary self-call that renders it.

### Step 7 — Update both diagrams together

For every new message:
- add/update the operation in the class diagram,
- add/update the sequence message,
- record any new assumption or naming rationale.

## Evaluation workflow

When reviewing an existing design, inspect in this order:

1. **Entry-point traceability** — does every actor message enter through a boundary?
2. **Stereotype purity** — are boundary/controller/entity responsibilities mixed?
3. **Operation consistency** — does every sequence message correspond to a class operation with compatible types?
4. **Data modeling quality** — are IDs, wrappers, multiplicities, and return objects explicit?
5. **Controller scope** — are controllers too broad or named after one UI context?
6. **Display completeness** — when data comes back, is there a boundary operation that renders it?
7. **Scenario decomposition** — were unrelated steps forced into one operation, or direct-response pairs split without reason?

If a design fails a check, name the violated rule and provide the smallest correction that restores BCE clarity.

## Freedom calibration

Be strict about these:
- actor → boundary → controller → entity flow,
- clear stereotypes,
- typed operation signatures,
- explicit IDs / multiplicities / wrappers,
- one rationale for each non-obvious assumption.

Stay flexible about these:
- exact class names,
- how many controllers the design needs,
- whether a helper entity or wrapper is introduced,
- whether one boundary or several boundaries best reflects the UI.

The goal is disciplined design, not textbook mimicry.

## NEVER do these things

- **NEVER** let an actor call a controller or entity directly; that hides the UI contract and breaks BCE traceability.
- **NEVER** keep a monolithic controller for unrelated responsibilities; it becomes a god object and makes reuse impossible to reason about.
- **NEVER** name controller operations after a specific screen when the underlying business service is reusable; UI-specific names lock the design to one path.
- **NEVER** leave operation arguments vague or untyped; missing inputs are where incorrect assumptions get smuggled in.
- **NEVER** create an entity without a clear identifier unless you are deliberately modeling a pure value object; later references and associations will become ambiguous.
- **NEVER** skip the reflexive display operation after a controller returns data; otherwise the sequence diagram explains processing but not what the user actually sees.
- **NEVER** force two unrelated scenario steps into one operation just because they are adjacent in the prose; that destroys reuse and testability.
- **NEVER** over-model placeholder classes that carry no state and justify no message; diagram bulk is not design quality.
- **NEVER** dump full argument lists into every sequence message when `(...)` would preserve readability; signature detail belongs in the class diagram.
- **NEVER** blur stereotypes by letting one class act as UI, coordinator, and database record at the same time.

## Response contract

### For design tasks

Produce:

1. **Scenario reference** — which steps were designed, skipped, or split.
2. **Class diagram** — Mermaid `classDiagram` with stereotypes implied by naming/rationale, typed operations, IDs, multiplicities, and wrappers.
3. **Sequence diagram** — Mermaid `sequenceDiagram` with numbered messages.
4. **Design decisions** — only the non-obvious ones: controller splits, missing-info conventions, wrapper choices, or naming trade-offs.
5. **Class inventory** — each class, stereotype, and one-line rationale.

### For evaluation tasks

Produce:

1. **Summary table** with pass / warn / fail for BCE flow, stereotypes, operations, relationships, and diagram consistency.
2. **Detailed findings** with severity, exact location, violated rule, and concrete correction.
3. **Corrected Mermaid snippets** only for the portions that need repair.

## Worked example reference

Use [`references/design-walkthrough.md`](references/design-walkthrough.md) only when you need a full transaction example that demonstrates controller splitting, missing-information conventions, standalone steps, and synchronized class/sequence updates.

Do **not** load it for simple diagram reviews, quick BCE checks, or tasks where the scenario is already small enough to derive directly from the rules above.
