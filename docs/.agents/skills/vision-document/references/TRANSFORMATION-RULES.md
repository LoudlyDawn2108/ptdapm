# Transformation Rules — Detailed Reference with Worked Examples

This document provides comprehensive worked examples for each of the eleven transformation rules used to derive Features (FEAT) from Stakeholder Requests (STRQ). Use it when you must justify rule selection, explain why one rule is better than another, or audit an existing transformation trail.

## Quick Rule Selection Heuristics

Use these shortcuts before reading the full worked examples:

| Symptom in the stakeholder request | Most likely rule |
|------------------------------------|------------------|
| Already atomic, precise, and consistent | Copy |
| Contains multiple distinct capabilities | Split |
| Ambiguous but meaning can be recovered | Clarification |
| Conflicts with another request or needs a limiting condition | Qualification |
| Duplicates or subsumes another request | Combination |
| Prescribes implementation choices too early | Generalization |
| Should not survive into the baseline at all | Cancellation |
| A necessary capability is missing from the request set | Completion |
| Grammar, spelling, punctuation, or factual detail is wrong | Correction |
| Same concept uses inconsistent terms | Unification |
| Too vague to test | Adding Details |

## Guardrails Before Applying Any Rule

- Use the **smallest sufficient transformation**. Do not over-edit a request that only needs one targeted repair.
- Do not invent business intent. If the needed meaning cannot be recovered with confidence, flag the gap instead of guessing.
- When multiple rules apply, preserve the order: resolve compound structure and conflicts first, then refine wording.
- Every Cancellation and Completion decision needs explicit rationale because both alter the scope baseline.

---

## Rule 1: Copy

**Definition**: Reproduce the STRQ as a FEAT verbatim when no changes are needed.

**Conditions**: The request is already atomic, clear, testable, consistent, non-redundant, and uses correct vocabulary.

**Examples**:

| STRQ | FEAT | Rationale |
|------|------|-----------|
| STRQ17: "The list of available flights shall include flight numbers, departure time, and arrival time for every leg of the flight." | FEAT14: (identical text) | Requirement is already well-formed, atomic, and testable. |
| STRQ23: "The user shall be able to purchase a ticket online, without the necessity of calling the travel agent." | FEAT22: (identical text) | No quality issues found. |
| STRQ25: "The pages where service providers can submit their offers shall be password-protected. Hotel providers, car providers, and airline representatives shall use assigned user IDs and passwords to access these pages." | FEAT26: (identical text) | Acceptable as-is; the two sentences describe a single security feature. |
| STRQ28: "Users shall pick IDs and passwords while buying an airline ticket." | FEAT29: (identical text) | No changes needed. |
| STRQ38: "While booking a hotel room, the customer shall provide the following information: town, stay dates, number of adults, number of children, room preferences." | FEAT37: (identical text) | Well-formed requirement. |

---

## Rule 2: Split

**Definition**: Break one compound STRQ into two or more atomic FEATs. Each resulting feature must express exactly one capability.

**Conditions**: The request contains "and"/"or" joining functionally distinct capabilities, making traceability difficult.

**Examples**:

| STRQ | FEATs | Rationale |
|------|-------|-----------|
| STRQ22: "The system shall provide the opportunity to book the flight, purchase a ticket, reserve a hotel room, reserve a car, and provide information about attractions." | FEAT17: "The system shall provide an opportunity to book the flight." FEAT18: "The system shall provide an opportunity to purchase an airplane ticket." FEAT19: "The system shall provide an opportunity to reserve a hotel room." FEAT20: "The system shall provide an opportunity to reserve a car." FEAT21: "The system shall provide information about attractions in specific places." | Five distinct capabilities combined into one STRQ. Split into five atomic features for independent tracking. |
| STRQ30: "The customer service representative shall be able to change reservation details or cancel a reservation." | FEAT31: "The customer service representative shall be able to change reservation details." FEAT32: "The customer service representative shall be able to cancel a reservation." | Two distinct operations (change vs. cancel) must be tracked separately. |

**Counter-example (no split needed)**:
STRQ5: "The user shall be able to cancel a car or hotel reservation." — The analyst decided that canceling car and hotel reservations is functionally the same capability, so no split was needed. Atomicity is a judgment call by the system analyst.

---

## Rule 3: Clarification

**Definition**: Reword the requirement to remove ambiguity, add missing context, or explain unclear terms.

**Conditions**: The request is unclear, could be misinterpreted, or lacks essential context (who, what, when, where).

**Examples**:

| STRQ | FEAT | What was clarified |
|------|------|--------------------|
| STRQ4: "The capability to cancel a ticket purchase should be available." | FEAT4: "The user shall be able to cancel a ticket purchase any time before final confirmation of the purchase." | Clarified WHO (the user), WHEN (before final confirmation), and standardized "should" → "shall". |
| STRQ12: "Sometimes a user will enter an airport code, which the system will understand, but sometimes the closest city may replace it, so the user does not need to know the airport code, and it will still be understood by the system." | FEAT10: "The system shall identify the airport based on either an airport code or a city name." | Replaced a complicated, unclear sentence with a simple, clear one. |
| STRQ3: "On data entry screens, the system shall indicate which fields are mandatory." | FEAT3: "On data entry screens the system shall indicate which fields are mandatory by placing a star next to the field." | Added a specific mechanism. **Caution:** if the star indicator is not explicitly required by stakeholders, prefer a more general clarification such as `The system shall clearly indicate mandatory fields on data entry screens.` |
| STRQ14: "If the user purchased a ticket once, there shall not be a need to repeat the same information, such as address or credit card number." | FEAT13: "If the user purchased a ticket once, there shall not be a need to repeat the same information (such as address or credit card number) during future transactions." | Added "during future transactions" to make the scope explicit. |

---

## Rule 4: Qualification

**Definition**: Add restrictions or conditions to the requirement to resolve conflicts or narrow scope.

**Conditions**: The requirement contradicts another, or needs conditions to be implementable.

**Examples**:

| STRQ | FEAT | What was qualified |
|------|------|--------------------|
| STRQ6: "The outbound and return flights shall be sorted by the smallest number of stops." (conflicts with STRQ18: "It shall be sorted by price.") | FEAT6: "The user shall be able to choose if the flights shall be selected by the smallest number of stops or by price." | Both sort criteria are valid; resolved by giving the user a choice. |
| STRQ27: "The system shall be developed in three months." | FEAT28: "The system shall be developed three months from the date when the customer signs off on the Use Cases and Supplementary Specification." | Added a starting-point condition to make the timeline testable. |

---

## Rule 5: Combination

**Definition**: Merge two or more overlapping or redundant STRQs into a single FEAT.

**Conditions**: Multiple requests express the same need differently, or one is a strict subset of another.

**Examples**:

| STRQs | FEAT | Rationale |
|-------|------|-----------|
| STRQ1: "The user shall be able to compare flight prices from other, nearby airports." + STRQ11: "For outbound and inbound flights, users shall be able to compare flight prices from other, nearby airports." | FEAT1: "The user shall be able to compare flight prices from other, nearby airports (for outbound and return flights)." | STRQ11 adds the outbound/inbound detail to the same capability as STRQ1. Combined and vocabulary unified ("inbound" → "return"). |
| STRQ9: "The system shall display a pop-up calendar when any date is entered." + STRQ21: "A calendar shall be available to help with entering the flight date." | FEAT8: "The system shall display a pop-up calendar when any date is entered, such as a flight date, hotel stay date, or car rental date." | STRQ9 is more generic (any date) and subsumes STRQ21 (flight date only). Combined into the more general version with explicit examples. |
| STRQ29: "The search facility shall allow a customer service representative to find a reservation based on: Last Name, Destination City, Date, etc." + STRQ35: "The search facility shall allow a customer service representative to find a reservation based on: Last Name, Date." | FEAT30: "The search facility shall allow a customer service representative to find a reservation based on the following: Last Name, Destination City, Date." | STRQ35 is a subset of STRQ29. Combined into the more complete version and removed "etc." |

---

## Rule 6: Generalization

**Definition**: Remove unnecessary implementation or design details, making the requirement more abstract.

**Conditions**: The request specifies UI controls (checkbox, radio button), technology choices, or storage mechanisms that should be left to designers or architects.

**Examples**:

| STRQ | FEAT | What was generalized |
|------|------|--------------------|
| STRQ10: "The user shall indicate if he needs a one-way or return ticket by checking the checkbox." | FEAT9: "The user shall have the opportunity to indicate if he needs a one-way or return ticket." | Removed "by checking the checkbox" — the choice of UI control (checkbox vs. radio button) is a design decision. A radio button may actually be more appropriate since options are mutually exclusive. |
| STRQ32: "Content information shall be stored in a text file." | (Cancelled) | Storage format is a design/architecture decision, not a user requirement. Passed as a suggestion to the designer but cancelled as a requirement. |

---

## Rule 7: Cancellation

**Definition**: Delete the requirement entirely. Always record the specific reason.

**Conditions**: The requirement is (a) infeasible, (b) unnecessary, (c) contradicted by a higher-priority requirement, (d) from a non-authoritative source and rejected by the customer, or (e) already subsumed by another FEAT.

**Examples**:

| STRQ | Reason for Cancellation |
|------|------------------------|
| STRQ8: "The system shall have a natural-language interface." | **Infeasible** — Contradicts STRQ27 (three-month timeline). A natural-language interface would exceed the development time constraint. The originating user was notified. |
| STRQ15: "Payment by PayPal shall be available." | **Contradicted** — Conflicts with STRQ41, which states the vendor cannot provide PayPal. The higher-priority business constraint takes precedence. |
| STRQ11: "For outbound and inbound flights, users shall be able to compare flight prices from other, nearby airports." | **Subsumed** — Already incorporated into FEAT1 via Combination with STRQ1. |
| STRQ21: "A calendar shall be available to help with entering the flight date." | **Subsumed** — Already incorporated into FEAT8 via Combination with STRQ9. |
| STRQ32: "Content information shall be stored in a text file." | **Unnecessary design** — Storage format is a designer/architect decision, not a user-facing requirement. |
| STRQ34: "The system may display a map of to the airport." | **Unnecessary** — Originated from a developer (not customer/user). Customer confirmed this feature is not needed. |
| STRQ35: "The search facility shall allow a customer service representative to find a reservation based on: Last Name, Date." | **Subsumed** — Subset of STRQ29, already incorporated into FEAT30. |

---

## Rule 8: Completion

**Definition**: Add entirely new FEATs that were not present in any STRQ but are needed for system coherence.

**Conditions**: A gap exists in the requirements set — a capability is logically implied or necessary but was never explicitly requested.

**Application**: After processing all STRQs, review the full FEAT list. Ask: "Is there a missing capability that the system clearly needs but nobody requested?" If yes, create a new FEAT with Origin marked as `Completion` (or a numbered completion ID) and document why it was added.

**Guardrail**: Completion is for necessary coherence, not for adding interesting extras. If the system can still satisfy the agreed scope without the new feature, it probably is **not** a Completion case.

---

## Rule 9: Correction

**Definition**: Fix grammar, spelling, punctuation, or factual inaccuracies in the requirement text.

**Conditions**: The request contains language errors or states something factually wrong.

**Examples**:

| STRQ | FEAT | What was corrected |
|------|------|--------------------|
| STRQ20: "Car rental prices shall show all applicable taxes (including 6% state tax)." | FEAT16: "Car rental prices shall show all applicable taxes." | The 6% figure was incorrect (tax varies by state). Removed the factually wrong detail. |
| STRQ19: "Comparison of car rental prices from different companies shall be provided." | FEAT15: "The system shall provide comparison of car rental prices from different companies." | Removed passive voice; reworded for clarity. |

---

## Rule 10: Unification

**Definition**: Standardize vocabulary so the same concept is referred to by the same term throughout all requirements.

**Conditions**: Different STRQs use different words for the same concept (e.g., "return flight" vs. "inbound flight", "will" vs. "shall").

**Examples**:

| Inconsistency | Resolution |
|--------------|------------|
| STRQ6 uses "return flight"; STRQ11 uses "inbound flight" | Standardized to "return flight" across all FEATs (FEAT1 and FEAT6 updated). |
| STRQ7 uses "will" ("The user will be able to select seats.") | Changed to "shall" for consistency: FEAT7 "While purchasing an airplane ticket, the user shall be able to select seats." |
| STRQ4 uses "should" ("The capability to cancel a ticket purchase should be available.") | Changed to "shall" for consistency in FEAT4. |

---

## Rule 11: Adding Details

**Definition**: Make a vague requirement precise enough to be testable by adding specific, measurable criteria.

**Conditions**: The requirement uses vague qualifiers ("clear", "fast", "user-friendly", "various") or "etc." that prevent verification.

**Examples**:

| STRQ | FEAT | What details were added |
|------|------|------------------------|
| STRQ13: "The system shall have clear navigation." | FEAT11: "Separate tabs shall be available for the main functionality." + FEAT12: "On each page a Next button shall suggest a default flow." | "Clear navigation" is untestable. Replaced with two concrete, testable features. |
| STRQ37: "Various reports shall be available." | FEAT36: "The following reports shall be available to the administrator: A list of all airline tickets purchased in the given time period. A list of all car reservations in the given time period. A list of all hotel room reservations in the given time period." | "Various reports" is untestable. Replaced with an explicit list of required reports after stakeholder interviews. |
| STRQ36: "All activity on the site shall be logged." | FEAT35: "All transactions and errors shall be recorded and made available to the administrator." | Added specifics about what is logged (transactions and errors) and who can access the logs. |
| STRQ40: "The user shall be offered flight and hotel deals." | FEAT39: "The user shall be offered package deals consisting of flight and hotel stay." | Added "package deals" to clarify the concept. |
| STRQ24: "The system shall follow implementation guidelines set up in the chain of our travel agencies." | FEAT23: "The system shall use J2EE architecture." + FEAT24: "If the architecture requires an application server, IBM WebSphere shall be used." + FEAT25: "If the system requires a database, Oracle shall be used." | Vague "implementation guidelines" replaced with explicit, testable technology constraints after consultation. |
| STRQ29: "...based on: Last Name, Destination City, Date, etc." | FEAT30: "...based on the following: Last Name, Destination City, Date." | Removed "etc." after confirming no additional criteria were needed. |
| STRQ39: "...offered discounts, available methods of payment, etc." | FEAT38: "...offered discounts, and available methods of payment." | Removed "etc." to make the list exhaustive and testable. |
