# Worked Examples of Transformation Rules (STRQ → FEAT)

These examples illustrate how the eleven transformation rules are applied in practice. Use these as reference patterns when deriving features from stakeholder requests.

---

## Example: Combination
> **STRQ1:** The user shall be able to compare flight prices from other, nearby airports.
> **STRQ11:** For outbound and inbound flights, users shall be able to compare flight prices from other, nearby airports.

These are redundant. **Combine** into:
> **FEAT1:** The user shall be able to compare flight prices from other, nearby airports (for outbound and return flights).

---

## Example: Unification + Qualification (resolving contradictions)
> **STRQ2:** Dates shall be displayed in the dd/mm/yyyy format.
> **STRQ16:** Dates shall be displayed in the mm/dd/yyyy format.

These contradict each other (different locale preferences). **Unify and qualify**:
> **FEAT2:** Dates shall be displayed according to the format stored in web browser settings.

---

## Example: Clarification
> **STRQ3:** On data entry screens, the system shall indicate which fields are mandatory.

Add explanation for how:
> **FEAT3:** On data entry screens, the system shall indicate which fields are mandatory by placing a star next to the field.

---

## Example: Clarification + Unification
> **STRQ4:** The capability to cancel a ticket purchase should be available.

Change "should" to "shall" (Unification). Clarify who and when (Clarification):
> **FEAT4:** The user shall be able to cancel a ticket purchase any time before final confirmation of the purchase.

---

## Example: Copy (no change needed)
> **STRQ5:** The user shall be able to cancel a car or hotel reservation.

The analyst judged this sufficiently atomic:
> **FEAT5:** The user shall be able to cancel a car or hotel reservation.

---

## Example: Combination + Qualification (resolving contradiction)
> **STRQ6:** The outbound and return flights shall be sorted by the smallest number of stops.
> **STRQ18:** It shall be sorted by price.

These contradict. **Combine and qualify** with user choice:
> **FEAT6:** The user shall be able to choose if the flights shall be selected by the smallest number of stops or by price.

---

## Example: Cancellation (infeasible)
> **STRQ8:** The system shall have a natural-language interface.

Infeasible given the three-month development constraint (STRQ27). **Cancel** with reason documented.

---

## Example: Generalization (remove design details)
> **STRQ10:** The user shall indicate if he needs a one-way or return ticket by checking the checkbox.

"Checkbox" is an implementation detail. **Generalize**:
> **FEAT9:** The user shall have the opportunity to indicate if he needs a one-way or return ticket.

---

## Example: Clarification (simplify unclear wording)
> **STRQ12:** Sometimes a user will enter an airport code, which the system will understand, but sometimes the closest city may replace it, so the user does not need to know the airport code, and it will still be understood by the system.

Overly complicated sentence. **Clarify**:
> **FEAT10:** The system shall identify the airport based on either an airport code or a city name.

---

## Example: Adding Details (make testable)
> **STRQ13:** The system shall have clear navigation.

Too vague to test. **Add details** by splitting into concrete, testable features:
> **FEAT11:** Separate tabs shall be available for the main functionality.
> **FEAT12:** On each page a Next button shall suggest a default flow.

---

## Example: Split (compound → atomic)
> **STRQ22:** The system shall provide the opportunity to book the flight, purchase a ticket, reserve a hotel room, reserve a car, and provide information about attractions.

Five capabilities in one. **Split** into five atomic FEATs:
> **FEAT17:** The system shall provide an opportunity to book the flight.
> **FEAT18:** The system shall provide an opportunity to purchase an airplane ticket.
> **FEAT19:** The system shall provide an opportunity to reserve a hotel room.
> **FEAT20:** The system shall provide an opportunity to reserve a car.
> **FEAT21:** The system shall provide information about attractions in specific places.

---

## Example: Correction (remove factual error)
> **STRQ20:** Car rental prices shall show all applicable taxes (including 6% state tax).

The 6% figure is incorrect (varies by state). **Correct** by removing the inaccurate detail:
> **FEAT16:** Car rental prices shall show all applicable taxes.

---

## Example: Cancellation (contradicted by higher-priority requirement)
> **STRQ15:** Payment by PayPal shall be available.
> **STRQ41:** Only credit card payments shall be accepted. No checks, no PayPal.

STRQ15 is contradicted by STRQ41 (vendor constraint). **Cancel** STRQ15 with reason documented.

---

## Example: Cancellation (unnecessary / non-authoritative)
> **STRQ34:** The system may display a map of to the airport.

Came from a developer, not a customer or user. After checking with the customer, confirmed unnecessary. **Cancel** with reason documented.

---

## Example: Cancellation (implementation detail)
> **STRQ32:** Content information shall be stored in a text file.

Storage format is a design decision, not a user requirement. **Cancel**; pass suggestion to designer.

---

## Example: Completion (gap analysis)
When no STRQ addresses a needed capability, the analyst adds a FEAT with origin documented as "Analyst gap analysis":
> **FEAT[N]:** [The missing capability, written as a proper "shall" statement.]
