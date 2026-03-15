# Use Case Specification — Knowledge Base

This reference contains the complete rules, definitions, and worked examples for creating and evaluating Use Case Specifications. The SKILL.md file summarizes these rules; this document provides full detail.

---

## 1. Use Case Fundamentals

### 1.1 What Is a Use Case

A use case is a description of a system in terms of a sequence of actions. It yields an observable result or value for the actor interacting with the system.

**Mandatory characteristics — every valid use case must satisfy ALL of these:**

1. **Initiated by an actor** — An external entity (person or system) triggers the use case
2. **Models an interaction** — Between an actor and the system
3. **Describes a sequence of actions** — A series of steps, not a single action
4. **Captures functional requirements** — Describes what the system does
5. **Provides value to an actor** — A meaningful, observable outcome
6. **Represents a complete flow of events** — Not a fragment of a larger process

**Purpose of use cases:**

- Facilitate agreement between developers, customers, and users about system behavior
- Serve as a contract between developers and customers
- Provide a basis for use case realizations (design)
- Support derivation of user documentation
- Aid in planning the technical content of development iterations
- Help system developers understand the system's purpose

### 1.2 Use Cases in the Requirements Pyramid

Use cases sit in the middle of the requirements pyramid:

```
Stakeholder Requests (STRQ)
    └── Features (FEAT)
            └── Use Cases (UC)    ← this level
                    └── Scenarios (SCEN)
```

Features are one level above use cases. Scenarios are one level below — they are specific paths through a use case.

### 1.3 Scenarios

A scenario is an instance of a use case — one specific path through the flow of events. Scenarios are used for:

- Analysis and design
- Deriving test cases
- Producing sequence diagrams, communication diagrams, and class diagrams

---

## 2. Actors

### 2.1 What Is an Actor

An actor is someone or something that interacts with the system. It may be a person or another system.

**Common actor categories:**

- Users of the system
- Administrators
- Management
- People providing information for the system
- External systems providing data
- External systems that are notified
- Timer/System Clock (for scheduled use cases)

### 2.2 Actor Identification Rules

1. **All stakeholders are actor candidates** — Review every stakeholder to determine if they interact with the system
2. **Actor = Role, not person** — One actor represents all people with the same role (e.g., "Traveler" covers all travelers, not specific individuals)
3. **Merge actors with identical functionality** — If two stakeholders access the same system functions, combine them into one actor
4. **Create a generic "User" actor** — For common use cases (Register, Log In) applicable to all people accessing the system. Other actors can inherit from User
5. **Developer is NOT an actor** — After the system is created, developers do not interact with it (unless they have an admin or support role)
6. **Non-initiating actors exist** — An external system that receives information (but never initiates a use case) is still an actor; it just has no initiating arrow
7. **Timer actor** — For schedule-triggered use cases (nightly batch, periodic jobs), represent the trigger as a Timer actor (also called System Clock or Time)
8. **Defer grouping decisions** — When unsure whether similar roles (e.g., Hotel Provider, Car Provider, Airline Rep) should be one actor or three, decide later based on how their use cases differ

### 2.3 Actor Generalization

When a set of actors initiate the same use cases, use generalization:

- Create a parent actor with the shared use cases
- Child actors inherit all parent use cases and may have additional ones
- Example: "User" is the parent of "Traveler", "Administrator", etc. — all inherit "Log In"

---

## 3. Use Case Identification

### 3.1 Discovery Questions

Use these questions to find use cases:

1. What functionality does each actor expect from the system?
2. Do actors need to be informed about events occurring in the system?
3. What information do actors need to supply to the system?
4. What information do actors need to receive from the system?
5. About what events outside the system does the system need to be notified?

### 3.2 Use Case Creation Guidelines

- Each use case **shall** interact with at least one actor
- Each use case **shall** be initiated by an actor
- Use case names **shall** be meaningful — use descriptive names like "Search Reservation" and "Search Traveler", never "Search 1" and "Search 2"
- Never have two use cases with the same name
- Names must be understood by the development team, customers, AND users
- Use cases **shall** describe functionality, not implementation — "Create Session Bean" is NOT a valid use case
- It **shall** be clear who initiates the use case

### 3.3 Use Case Sizing

**Too small:**

- "Submit credit card information" — This is just one step in "Purchase a Ticket". It does not represent a complete flow and provides no standalone value
- A use case with only 1-2 steps is probably a step within a larger use case

**Too large:**

- "Maintain administrative tasks" — Too generic. Split into meaningful units like "Run Report" and "Update User Information"

**Right size:**

- Represents a complete, meaningful flow from trigger to observable result
- Has multiple steps involving actor-system interaction
- Provides standalone value to the actor

---

## 4. Use Case Model Structuring

### 4.1 Purpose

Structuring removes redundancy and makes use cases easier to understand and maintain. The process:

1. Analyze use cases for parts with similar steps
2. Apply relationship types: Include, Extend, Generalization

### 4.2 Include Relationship

**When to use:** A significant part of the flow is used in more than one use case.

**Rules:**

- Extract the shared flow as a separate use case
- Connect with an `<<include>>` dependency (dashed arrow from base to included)
- The included use case must be **self-contained** — it cannot make any assumptions about which use case is including it
- The use case instance will contain the base use case as well as the included one

**Diagram notation:** Dashed arrow with `<<include>>` stereotype, pointing FROM the base use case TO the included use case.

**Example:** The "Log In" functionality used in "Book a Flight", "Change Reservation", and "Run Report" can be extracted as an included use case.

### 4.3 Extend Relationship

**When to use:** Some part of the use case is optional or conditional.

**Rules:**

- Extract the optional/conditional part as a separate extending use case
- Reading the extending use case shall NOT be necessary to understand the base use case
- The base use case must define an **extension point** specifying where the extension can be invoked

**Diagram notation:** Dashed arrow with `<<extend>>` stereotype, pointing FROM the extending use case TO the base use case.

### 4.4 Generalization Relationship (Use Cases)

**When to use:** Two or more use cases are similar.

**Rules:**

- Extract similarities into a base (parent) use case
- Derived (child) use cases can add behavior and modify parent behavior
- The parent use case does not need to know what children specialize it

**Caution:** This technique can be hard for stakeholders to understand. Use sparingly.

**Diagram notation:** Solid arrow with hollow triangle, pointing from child to parent.

### 4.5 Decision Rules for Splitting and Merging

**Split a use case when:**

- An alternative flow has its own alternative flow (nested alternatives) — the structure is becoming too complex. Extract the nested portion via Extend.

**Do NOT split when:**

- The use case has many steps that are always performed together in the same sequence

**Merge use cases when:**

- Two use cases are always activated in the same sequence (e.g., "Book a Flight" and "Purchase a Ticket" merged because purchasing always follows booking)

---

## 5. The Use Case Specification Document

### 5.1 Brief Description

- Clearly explain the use case's purpose
- Mention ALL actors who interact with the use case (initiating and participating)

### 5.2 Basic Flow

The basic flow contains the **most popular sequence of actions** — the steps that happen when everything goes correctly (the "happy path").

**Naming convention:**

- Prefix every step with **B**: B1, B2, B3, ...
- Alternate between actor actions and system responses
- Specify data the actor provides and data the system displays
- End with an observable result that provides value

**Worked Example — Book a Flight:**

- B1. Traveler enters the site's URL.
- B2. System displays the home page.
- B3. Traveler enters the following: Departure airport, date, time; Arrival airport, date, time; Number of traveling adults and children. Traveler selects 'Search flights.'
- B4. System displays outbound flights sorted by price.
- B5. Traveler selects a flight.
- B6. System displays return flights.
- B7. Traveler selects a return flight.
- B8. System displays details of the flight.
- B9. Traveler confirms the flight.
- B10. User provides a userid and password to proceed with buying a ticket.
- B11. Traveler provides passenger information.
- B12. System displays available seats.
- B13. Traveler selects seats.
- B14. Traveler provides credit card information and billing address.
- B15. System provides a confirmation number.

### 5.3 Alternative Flows

Alternative flows represent variations of the basic flow, including less usual cases and error conditions.

**Discovery questions for each basic flow step:**

1. What **other action** can be taken at this step?
2. What **errors** can occur (wrong data, missing data, connection problems)?
3. Is there a **behavior that can happen at any time** (exit, print, help)?
4. Will any **conditions** (specific data combinations) significantly change the flow?

**Naming convention:**

- Name flows as **A1, A2, A3, ...**
- Name steps as **A1.1, A1.2, A1.3, ...**
- Each flow starts with "In step BX" or "After step BX" to anchor to its branching point
- Each flow ends with "The flow returns to step BX of the basic flow" or "The use case ends"

**Critical Rule — Unique Sequence Requirement:**

Alternative flows MUST have unique sequences of actions. They CANNOT differ from the basic flow only in data.

**Valid alternative flow example:**

> A1. Comparison of flights from nearby airports
> - A1.1. In step B3 the Traveler selects the option 'Compare surrounding airports.'
> - A1.2. The system shows a list of airports within 100 miles of the departure and destination airports.
> - A1.3. The Traveler selects which airports shall be considered.
> - A1.4. The flow returns to step B4 of the basic flow.

This is valid because step A1.2 (system shows airport list) and A1.3 (traveler selects airports) are unique actions that do not exist in the basic flow.

**Invalid alternative flow example (data-only variation):**

> A1. Comparison of flights from nearby airports
> - A1.1. In step B3 the Traveler selects the option 'Compare surrounding airports.'
> - A1.2. The system displays outbound flights that include flights from airports within 100 miles.
> - A1.3. Flow returns to step B5 of the basic flow.

This is INVALID because the sequence of steps is the same as in the basic flow — the only difference is the data (additional flights displayed). This should be a **test case**, not an alternative flow.

**Alternative flows of alternative flows:**

An alternative flow can branch from another alternative flow, not just from the basic flow. Example:

> A7. New user ID is not available
> - A7.1. After step A6.3 of alternative flow A6, the system returns a message that the supplied e-mail ID is already taken.
> - A7.2. The Traveler provides a new e-mail address.
> - A7.3. The flow returns to step A6.4.

When this pattern occurs (alternative of alternative), consider extracting both flows into a separate use case to reduce complexity.

**Complete worked example — Alternative flows for Book a Flight:**

| Flow ID | Title | Branches From | Returns To / Ends |
|---------|-------|--------------|-------------------|
| A1 | Comparison of flights from nearby airports | B3 | Returns to B4 |
| A2 | Sorting the flights | B4 | Returns to B5 |
| A3 | Saving the itinerary | B8 | Use case ends |
| A4 | Going back to return flight selection | B8 | Returns to B6 |
| A5 | Going back to outbound flight selection | B8 | Returns to B4 |
| A6 | New user | B9 | Returns to B11 |
| A7 | New user ID is not available | A6.3 | Returns to A6.4 |
| A8 | Wrong password | B10 | Returns to B11 |

### 5.4 Special Requirements

Contains requirements related to this use case that are NOT covered by the flows. Usually nonfunctional requirements. However, if a requirement is generic and applies to many use cases, it belongs in a Supplementary Specification instead.

### 5.5 Preconditions

A precondition is the **system's state** before the use case can start.

- Must describe system state, not actor actions
- Example: "Administrator must be logged into the system" (for use case "Search Reservation")

### 5.6 Postconditions

A postcondition is the **system's state** after the use case ends.

- Unless specifically mentioned otherwise, a postcondition is valid for **any alternative flow**, not just the basic flow
- If different flows produce different end states, explicitly scope each postcondition

### 5.7 Extension Points

An extension point is a named place from which an extending use case can be invoked.

**Format:**

- **Name:** [Extension name]
- **Location:** After step BX of the basic flow

**Example:**

- **Name:** Process refund
- **Location:** After step B5 of the basic flow

### 5.8 Context Diagram (Optional)

Shows the relationships of this use case to actors and other use cases. All use cases having Include, Extend, or Generalization relationships with the given use case should be shown.

### 5.9 Activity Diagram (Optional)

Graphically represents all flows in the use case:

- Boxes with rounded corners = activity states
- Arrows = transitions
- Diamonds = branches (decision points)
- One diagram contains basic flow AND all alternative flows
- Best practice: Represent basic flow as a straight line, alternative flows as loops or branches
- Steps without branches between them may be combined

### 5.10 State Machine Diagrams (Optional)

For objects that act differently depending on their state:

- Rounded rectangles = states
- Arrows = transitions triggered by events
- Dark circles = initial and final states

---

## 6. Scenario Methodology

### 6.1 What Is a Scenario

A scenario is an instance of a use case — one specific path through the flow of events. Identifying all valid scenarios is important for:

- Analysis and design
- Deriving test cases

### 6.2 Finding All Scenarios

To find scenarios, identify all paths through the use case graph where the basic flow is the main path and alternative flows are branches.

**Scenario types:**

1. **Basic flow scenario:** The basic flow alone (always Scenario 1)
2. **Single alternative flow scenarios:** One per alternative flow
3. **Combination scenarios:** Combinations of compatible alternative flows

There are more scenarios than alternative flows because combinations add scenarios.

### 6.3 Describing Scenarios

**Preferred format:** List the sequence of alternative flows.

- `SC5: A3, A4` — Do alternative flow A3, then A4
- The basic flow B is implicit (almost all scenarios start with B), so omit it

**Verbose format (NOT recommended):** Listing every step.

- `SC5: B1, B2, A3.1, A3.2, A3.3, A4.1, A4.4, A4.3` — More difficult and unnecessarily detailed

### 6.4 Handling Infinite Loops

When alternative flows go backward (return to earlier steps), they create loops that theoretically generate infinite scenarios.

**Reasonable approach:**

1. Do the basic flow once
2. Do the loop once
3. Do the loop a second time
4. If the program works for both iterations of the loop, assume it works for many

### 6.5 Selecting Reasonable Scenarios

For use cases with many alternative flows, the total number of possible combinations can be in the thousands. Select a reasonable subset:

1. **Always include:** The basic flow scenario
2. **Always include:** One scenario per alternative flow
3. **Add combinations** where flows are:
   - Adjacent in the activity diagram (may be related)
   - Immediately sequential (one branches where the other returns)
4. **Skip combinations** where flows are:
   - Far apart in the activity diagram
   - Independent (no influence on each other)

### 6.6 Worked Example — Scenarios for Book a Flight

**Flows available:**

| Flow ID | Name | Type |
|---------|------|------|
| B | Basic flow | Forward |
| A1 | Comparison of flights from nearby airports | Backward (returns to B4) |
| A2 | Sorting the flights | Backward (returns to B5) |
| A3 | Saving the itinerary and exiting | Forward (ends) |
| A4 | Going back to return flight selection | Backward (returns to B6) |
| A5 | Going back to outbound flight selection | Backward (returns to B4) |
| A6 | New user | Forward (returns to B11) |
| A7 | New user ID is not available | Forward (returns to A6.4) |
| A8 | Wrong password | Forward (returns to B11) |

Five flows go backward (create loops), three go forward. Full combinatorial coverage would produce thousands of scenarios.

**Selected scenarios (22):**

| Number | Sequence of Flows | Description |
|--------|------------------|-------------|
| Scenario 1 | B | Basic flow only |
| Scenario 2 | A1 | Nearby airports |
| Scenario 3 | A2 | Sorting |
| Scenario 4 | A3 | Saving and exiting |
| Scenario 5 | A4 | Back to return flight selection |
| Scenario 6 | A5 | Back to outbound flight selection |
| Scenario 7 | A6 | New user |
| Scenario 8 | A6, A7 | User ID not available |
| Scenario 9 | A8 | Wrong password |
| Scenario 10 | A1, A2 | Nearby airport, then sorting |
| Scenario 11 | A1, A5 | Back to outbound with nearby airports |
| Scenario 12 | A1, A4 | Back to return with nearby airports |
| Scenario 13 | A2, A2 | Changing sorting sequence twice |
| Scenario 14 | A4, A3 | Back to return flight, then save |
| Scenario 15 | A4, A5 | Back to return flight, then back to beginning |
| Scenario 16 | A5, A4 | Change outbound flight, then change return flight |
| Scenario 17 | A5, A3 | Change outbound flight, then save |
| Scenario 18 | A4, A4 | Change return flight twice |
| Scenario 19 | A5, A5, A4 | Change outbound flight twice, then return flight once |
| Scenario 20 | A5, A5, A3 | Change outbound flight twice, then save |
| Scenario 21 | A6, A7, A7 | Unavailable ID twice |
| Scenario 22 | A8, A8 | Wrong password twice |

**Rationale for selections:**

- Scenarios 1-9: Basic coverage — one per flow
- Scenario 8: A7 only makes sense after A6 (it branches from A6.3), so they are combined
- Scenarios 10-12: A1 combined with adjacent flows (A2, A4, A5 are nearby in the flow)
- Scenarios 13, 18, 21, 22: Loop testing — repeating the same loop twice
- Scenarios 14-17: Combinations of backward flows that occur in sequence
- Scenarios 19-20: Triple combinations for loops close together
- NOT included: A1 + A8 — too far apart in the diagram, no mutual influence

---

## 7. Structuring Decisions Quick Reference

| Situation | Action | Relationship |
|-----------|--------|-------------|
| Same flow appears in multiple use cases | Extract as separate use case | Include |
| Part of use case is optional/conditional | Extract as separate use case | Extend |
| Alternative flow has its own alternative flow | Extract nested portion | Extend |
| Two similar use cases share common behavior | Extract parent use case | Generalization |
| Two use cases always occur in sequence | Merge into one | (Merge) |
| Use case has only 1-2 steps | Probably a step, not a use case | (Absorb into parent) |
| Use case is too generic | Split into meaningful units | (Split) |
