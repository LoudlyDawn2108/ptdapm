# Derivation Examples: Features → Supplementary Requirements

This reference provides worked examples of transforming Vision Document features into supplementary requirements. Study these patterns before deriving requirements.

---

## Pattern 1: Direct Copy (No Changes Needed)

When a feature is already a well-formed supplementary requirement:

**Feature:** "Dates shall be displayed according to the format stored in web browser settings."
**SUPL Requirement:** "Dates shall be displayed according to the format stored in web browser settings."
**Category:** Usability → Accessibility
**Rationale:** The feature is already testable, specific, and uses "shall." Copy as-is.

**Feature:** "On data entry screens, the system shall indicate which fields are mandatory by placing a star next to the field."
**SUPL Requirement:** "On data entry screens, the system shall indicate which fields are mandatory by placing a star next to the field."
**Category:** Usability → Accessibility

**Feature:** "The system shall display a pop-up calendar when any date is entered, such as a flight date, hotel stay date, or car rental date."
**SUPL Requirement:** Same as feature.
**Category:** Usability → Ease of Use

**Feature:** "Separate tabs shall be available for the main functionality."
**SUPL Requirement:** Same as feature.
**Category:** Usability → Accessibility

**Feature:** "On each page a Next button shall suggest a default flow."
**SUPL Requirement:** Same as feature.
**Category:** Usability → Ergonomics

---

## Pattern 2: Direct Copy with Category Assignment

**Feature:** "The system shall use J2EE architecture."
**SUPL Requirement:** "The system shall use J2EE architecture."
**Category:** Design Constraints
**Rationale:** Already well-formed. Simply classify it correctly.

---

## Pattern 3: Removing Conditions (Architecture Decided)

When a feature has a conditional ("If...") but the architecture decision has already been made:

**Feature:** "If the architecture requires an application server, IBM WebSphere shall be used."
**SUPL Requirement:** "IBM WebSphere shall be used as an application server."
**Category:** Implementation Requirements
**Rationale:** The system architect has confirmed an application server is required. Remove the condition to make the requirement unconditional.

**Feature:** "If the system requires a database, Oracle shall be used."
**SUPL Requirement:** "Oracle shall be used as a database."
**Category:** Implementation Requirements

---

## Pattern 4: Adding Version Numbers

When features reference software without specifying versions:

**Feature:** "The system shall be fully tested on the following browsers: Internet Explorer and Netscape."
**SUPL Requirement:** "The system shall be fully tested on the following browsers: Internet Explorer (version 6.0 and newer) and Netscape (version 6 and newer)."
**Category:** Implementation Requirements
**Rationale:** Software references MUST include version numbers to be testable.

---

## Pattern 5: Splitting Generic Requirements into Measurable Statements

When a feature is too generic and needs to be decomposed into precise, measurable requirements:

**Feature:** "The system must be available 24 hours a day, with a degree of reliability appropriate to commercial applications."

**SUPL Requirements (split into multiple):**
1. "The system shall be available 24 hours a day, 7 days a week." → Reliability/Availability
2. "The average time between failures shall be at least 20 hours." → Reliability/Availability
3. "The system shall be available 99.93% of the time." → Reliability/Availability

**Rationale:** "A degree of reliability appropriate to commercial applications" is untestable. Split into specific, measurable metrics. Note: "unavailable no more than one minute per 24 hours" is equivalent to "99.93% availability" — include only ONE to avoid redundancy.

---

## Pattern 6: Splitting by Implementation Separation

When a feature covers capabilities that will be implemented separately:

**Feature:** "All transactions and errors shall be recorded and made available to the administrator."

**SUPL Requirements (split into two):**
1. "All system errors shall be recorded and made available to the administrator." → Supportability/Maintainability
2. "All transactions (ticket purchase, making a reservation, updating a reservation, and canceling a reservation) shall be recorded and made available to the administrator." → Supportability/Maintainability

**Rationale:** Error log and transaction log will be implemented separately. Splitting improves traceability to implementation. Note: this could also be treated as a Usability requirement (for the administrator).

---

## Pattern 7: Security Requirements (Direct Copy)

**Feature:** "The pages where service providers can submit their offers shall be password-protected. Hotel providers, car providers, and airline representatives shall use assigned user IDs and passwords to access these pages."
**SUPL Requirement:** Same as feature.
**Category:** Reliability/Security

**Feature:** "Users shall pick IDs and passwords while buying an airline ticket."
**SUPL Requirement:** Same as feature.
**Category:** Reliability/Security

---

## Pattern 8: Promoting to Use Case (Too Complex)

When a requirement cannot be adequately expressed in a few sentences:

**Feature:** "The following reports shall be available to the administrator: A list of all airline tickets purchased in the given time period. A list of all car reservations in the given time period. A list of all hotel room reservations in the given time period."

**Decision:** Do NOT include in Supplementary Specification. Create a **separate use case** instead.

**Rationale:** This requirement needs elaboration on:
- From where the reports shall be available
- What search attributes shall be available
- How to select available reports

These details make it too complex for a few supplementary requirement statements.

---

## Pattern 9: Excluding Process Requirements

Requirements about HOW the system is produced (not what it does):

**Feature:** "The system shall be developed three months from the date when the customer signs off on the Use Cases and Supplementary Specification."

**Decision:** Exclude from Supplementary Specification. Place in contract or statement of work.

**Rationale:** This describes development process constraints, not system requirements. However, if the team decides to include such requirements, create a separate "Development Process Requirements" section.

**Other examples of process requirements (usually excluded):**
- "Development shall be done at the customer's premises."
- "The testing team shall include at least two manual testers."
- "The system shall be developed using RUP."

---

## Summary of Derivation Actions

| Action | When to Apply |
|---|---|
| **Direct Copy** | Feature is already well-formed, testable, uses "shall" |
| **Remove Conditions** | Architecture/design decisions already made |
| **Add Versions** | Software/hardware referenced without version numbers |
| **Split (Measurable)** | Generic requirement needs decomposition into specific metrics |
| **Split (Implementation)** | Compound feature will be implemented as separate components |
| **Promote to UC** | Requirement too complex for simple statements |
| **Exclude** | Process/development constraint, not a system requirement |

---

## Checklist After Derivation

- [ ] Every applicable feature has been reviewed
- [ ] Each derived requirement is assigned to exactly one FURPS+ category
- [ ] All requirements use "shall" and include measurable criteria
- [ ] No duplicate or equivalent requirements exist
- [ ] Complex features promoted to use cases (not forced into simple statements)
- [ ] Process requirements excluded (or placed in separate section with justification)
- [ ] Version numbers added to all software/hardware references
- [ ] Traceability matrix updated: Feature ID → SUPL ID(s)
