# Use Case Specification — Output Template

Use this exact Markdown structure when generating a Use Case Specification document. Replace all `[bracketed]` placeholders with project-specific content. Mark assumptions with `[ASSUMPTION]`. Mark sections with insufficient data as `[INCOMPLETE — needs follow-up]`.

---

```markdown
# Use Case Specification: [Use Case Name]

**Project:** [Project Name]
**Use Case ID:** [UC-XXX]
**Version:** [1.0]
**Date:** [Date]
**Author:** [Author Name]

---

## 1. Brief Description

[Clearly explain the purpose of this use case. State what the actor achieves by completing this use case. Mention ALL actors who interact with it — both the initiating actor and any participating actors.]

[Example: This use case describes the process by which a Traveler searches for available flights, selects outbound and return flights, provides passenger and payment information, and receives a booking confirmation. The Traveler initiates this use case. The Airline Reservation System receives the booking information.]

---

## 2. Basic Flow (B)

The basic flow describes the most common sequence of actions — the path where everything goes correctly.

- **B1.** [Actor] [action — what the actor does].
- **B2.** System [response — what the system does in response].
- **B3.** [Actor] [action with details of data provided]:
  - [Data item 1]
  - [Data item 2]
  - [Data item 3]
  [Actor] selects '[action button/option name].'
- **B4.** System [displays/processes/validates — specify what data is shown or what happens].
- **B5.** [Actor] [selects/confirms/provides — next actor action].
- **B6.** System [response].

[Continue numbering B7, B8, B9, ... until the use case reaches its conclusion.]

- **B[N].** System [provides the observable result — confirmation number, success message, output data, etc.].

---

## 3. Alternative Flows

[For each alternative flow, use the following structure. Number flows as A1, A2, A3, ... and steps as A1.1, A1.2, etc.]

### A1. [Descriptive Title of Alternative Flow]

- **A1.1.** [In step BX / After step BX] the [Actor] [describes what triggers this alternative — a different selection, an error condition, a special case].
- **A1.2.** System [unique action that does NOT exist in the basic flow — this is what makes this a valid alternative flow].
- **A1.3.** [Actor] [response to the system's alternative action].
- **A1.4.** The flow returns to step B[X] of the basic flow.

[OR, if the alternative flow terminates the use case:]

- **A1.[N].** The use case ends.

### A2. [Descriptive Title of Alternative Flow]

- **A2.1.** [After step BX] the [Actor] [trigger action].
- **A2.2.** System [response].
- **A2.3.** The flow returns to step B[X] of the basic flow.

### A3. [Error Condition Title]

- **A3.1.** [After step BX] of the basic flow, the system [detects error — e.g., returns an error message saying the password is wrong].
- **A3.2.** The [Actor] [corrective action — e.g., supplies the correct credentials].
- **A3.3.** The flow returns to step B[X] of the basic flow.

[Continue with A4, A5, A6, ... as needed.]

[If an alternative flow branches from another alternative flow:]

### A[N]. [Title]

- **A[N].1.** After step A[M].[X] of alternative flow A[M], the system [action].
- **A[N].2.** The [Actor] [response].
- **A[N].3.** The flow returns to step A[M].[X].

---

## 4. Special Requirements

[List nonfunctional requirements that are specific to THIS use case. If a requirement is generic (applies to many use cases), it belongs in the Supplementary Specification, not here.]

- SR1: [Specific nonfunctional requirement — e.g., "The flight search results in step B4 shall be displayed within 3 seconds."]
- SR2: [Specific nonfunctional requirement — e.g., "Credit card information in step B14 shall be transmitted using TLS 1.2 or higher encryption."]

[If none: "No special requirements specific to this use case. See the Supplementary Specification for system-wide nonfunctional requirements."]

---

## 5. Preconditions

[State the system's required state BEFORE this use case can begin. Describe system state, NOT actor actions.]

- PRE1: [System state — e.g., "The system is operational and accessible via the internet."]
- PRE2: [System state — e.g., "The flight database is available and up to date."]

---

## 6. Postconditions

[State the system's state AFTER the use case ends. Unless otherwise noted, postconditions apply to ALL flows (basic and alternative), not just the basic flow.]

- POST1: [System state — e.g., "A booking record is created in the system with a unique confirmation number."]
- POST2: [System state — e.g., "The selected seats are marked as reserved in the airline system."]

[If different flows produce different end states, explicitly scope each:]

- POST3: [Only for basic flow and flows A1, A2, A6, A7, A8] [postcondition]
- POST4: [Only for flow A3 — Saving itinerary] The itinerary is saved but no booking is created.

---

## 7. Extension Points

[List named locations where extending use cases can be invoked. If none, state "None."]

| Name | Location | Extending Use Case |
|------|----------|--------------------|
| [Extension name] | After step B[X] of the basic flow | [Name of extending use case] |
| [Extension name] | After step A[N].[X] of alternative flow A[N] | [Name of extending use case] |

[Example:]

| Name | Location | Extending Use Case |
|------|----------|--------------------|
| Process refund | After step B5 of the basic flow | Refund Processing |

[If none: "No extension points defined for this use case."]

---

## 8. Scenarios

[List all identified scenarios. Each scenario is a specific path through the use case.]

### 8.1 Flow Summary

| Flow ID | Name | Direction | Branches From | Returns To / Ends |
|---------|------|-----------|--------------|-------------------|
| B | Basic flow | Forward | — | Completes |
| A1 | [Title] | [Forward/Backward] | B[X] | Returns to B[X] / Ends |
| A2 | [Title] | [Forward/Backward] | B[X] | Returns to B[X] / Ends |

### 8.2 Selected Scenarios

[Select reasonable scenarios: basic flow, one per alternative flow, and meaningful combinations of adjacent/related flows.]

| Scenario | Sequence of Flows | Description |
|----------|------------------|-------------|
| SC1 | B | Basic flow — happy path |
| SC2 | A1 | [Brief description] |
| SC3 | A2 | [Brief description] |
| SC4 | A1, A2 | [Combination description — why these are related] |
| SC5 | A[N], A[N] | [Loop test — same flow repeated twice] |

[For backward-going flows (loops), include scenarios that repeat the loop once and twice.]

### 8.3 Scenario Selection Rationale

[Briefly explain why the selected scenarios provide adequate coverage:]

- **Basic coverage:** SC1 through SC[X] cover the basic flow and each alternative flow individually.
- **Combinations:** SC[X] through SC[Y] cover adjacent flows that may interact.
- **Loop testing:** SC[X] through SC[Y] test backward flows with one and two iterations.
- **Excluded combinations:** [Explain which combinations were excluded and why — e.g., "A1 + A8 were not combined because they are independent and far apart in the flow."]
```
