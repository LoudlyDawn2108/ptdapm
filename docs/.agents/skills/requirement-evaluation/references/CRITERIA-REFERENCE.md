# Requirement Quality Criteria — Full Reference

This document contains the complete definition, violation examples, and corrected rewrites for all 13 requirement quality criteria. Use this when you need the detailed rationale behind a verdict.

## Contents

- [Individual Criteria (1–10)](#individual-criteria)
  - [1. Unambiguous](#1-unambiguous)
  - [2. Testable (Verifiable)](#2-testable-verifiable)
  - [3. Clear (Concise, Terse, Simple, Precise)](#3-clear)
  - [4. Correct](#4-correct)
  - [5. Understandable](#5-understandable)
  - [6. Feasible (Realistic, Possible)](#6-feasible)
  - [7. Independent](#7-independent)
  - [8. Atomic](#8-atomic)
  - [9. Necessary](#9-necessary)
  - [10. Implementation-free (Abstract)](#10-implementation-free)
- [Set-Level Criteria (11–13)](#set-level-criteria)
  - [11. Consistent](#11-consistent)
  - [12. Nonredundant](#12-nonredundant)
  - [13. Complete](#13-complete)
- [Derived Criteria](#derived-criteria)
- [Untestable Language Blacklist — Complete Reference](#untestable-language-blacklist)

---

## Individual Criteria

### 1. Unambiguous

**Definition:** There shall be only one way to interpret the requirement.

**Common Causes of Ambiguity:**
- Undefined acronyms
- Ambiguous word placement in a sentence
- Multiple possible behavioral interpretations

**Violation Example A — Undefined acronym:**

> REQ1: The system shall be implemented using ASP.

**Problem:** "ASP" could mean "Active Server Pages" or "Application Service Provider."

**Corrected:**

> REQ1: The system shall be implemented using Active Server Pages (ASP).

**Violation Example B — Multiple interpretations of behavior:**

> REQ1: The system shall not accept passwords longer than 15 characters.

**Problem:** Three possible interpretations exist: (a) prevent the user from typing more than 15 characters, (b) silently truncate to 15, or (c) display an error.

**Corrected:**

> REQ1: The system shall not accept passwords longer than 15 characters. If the user enters more than 15 characters while choosing the password, the system shall display an error message asking the user to correct it.

**Violation Example C — Ambiguous word placement:**

> REQ1: On the "Stored Flight" screen, the user can only view one record.

**Problem:** Does "only view" mean the user cannot delete or update? Or does "only one record" mean the user cannot see multiple records?

**Corrected (rewritten from the system's perspective):**

> REQ1: On the "Stored Flight" screen, the system shall display only one flight record.

---

### 2. Testable (Verifiable)

**Definition:** A tester shall be able to verify whether the requirement is implemented correctly. The test shall either pass or fail.

**What Makes a Requirement Untestable:**

Certain words and phrases prevent a tester from designing a concrete pass/fail test.

**Vague Adjectives (flag always):** robust, safe, accurate, effective, efficient, expandable, flexible, maintainable, reliable, user-friendly, adequate.

**Vague Adverbs/Phrases (flag always):** quickly, safely, in a timely manner.

**Nonspecific Terms (flag always):** etc., and/or, TBD.

**Modifying Phrases (flag always):** as appropriate, as required, if necessary, shall be considered.

**Vague Verbs (flag always):** manage, handle.

**Passive Voice:** The subject of the sentence receives the action rather than performing it. This often causes the actor to be omitted entirely.

**Indefinite Pronouns (flag always):** few, many, most, much, several, any, anybody, anything, some, somebody, someone.

**Violation Example A — Nonspecific "etc.":**

> REQ1: The search facility should allow the user to find a reservation based on Last Name, Date, etc.

**Problem:** "etc." is untestable — all search criteria must be explicitly listed. A developer cannot guess what the user means.

**Corrected:**

> REQ1: The search facility shall allow the user to find a reservation based on Last Name, First Name, Reservation Date, and Confirmation Number.

**Violation Example B — Passive voice (actor omitted):**

> REQ1: The airport code shall be entered.

**Problem:** Who enters the code — the system or the user?

**Corrected:**

> REQ1: The user shall enter the airport code.

**Violation Example C — Indefinite pronoun:**

> REQ1: The system shall resist concurrent usage by many users.

**Problem:** "Many" is unmeasurable. Is it 10, 100, or 1,000?

**Corrected:**

> REQ1: The system shall support concurrent usage by at least 500 simultaneous users.

---

### 3. Clear

**Definition:** Requirements shall be stated concisely, simply, and precisely. No unnecessary verbiage or background information.

**Violation Example:**

> REQ1: Sometimes the user will enter Airport Code, which the system will understand, but sometimes the closest city may replace it, so the user does not need to know what the airport code is, and it will still be understood by the system.

**Problem:** Unnecessarily verbose and hard to parse.

**Corrected:**

> REQ1: The system shall identify the airport based on either an Airport Code or a City Name.

---

### 4. Correct

**Definition:** If a requirement contains facts, those facts shall be true.

**Violation Example:**

> REQ1: Car rental prices shall show all applicable taxes (including 6% state tax).

**Problem:** The tax rate varies by state — the 6% figure is factually incorrect as a universal rule.

**Corrected:**

> REQ1: Car rental prices shall show all applicable taxes based on the rental location's state tax rate.

---

### 5. Understandable

**Definition:** Requirements shall be grammatically correct and written in a consistent style. The standard modal verb for obligations is **"shall"** — not "will," "must," or "may."

**Rule:** Use "shall" to indicate a mandatory system behavior. Reserve "should" only for recommendations, not requirements. Avoid "will" (future tense ambiguity) and "may" (implies optionality).

---

### 6. Feasible

**Definition:** The requirement shall be achievable within existing constraints: time, money, available resources, and current technology.

**Violation Example:**

> REQ1: The system shall have a natural language interface that will understand commands given in English language.

**Problem:** Building a full natural-language understanding interface may not be feasible within a short development timeframe.

**Corrected (scoped down):**

> REQ1: The system shall accept structured text commands using a predefined set of keywords listed in the User Command Reference.

---

### 7. Independent

**Definition:** To understand the requirement, there shall be no need to read any other requirement.

**Violation Example:**

> REQ1: The list of available flights shall include flight numbers, departure time, and arrival time for every leg of a flight.
>
> REQ2: It should be sorted by price.

**Problem:** "It" in REQ2 refers to REQ1. If requirements are reordered, REQ2 becomes incomprehensible.

**Corrected:**

> REQ2: The list of available flights shall be sorted by price in ascending order.

---

### 8. Atomic

**Definition:** The requirement shall contain a single traceable element — one capability, one constraint, or one behavior.

**Violation Example:**

> REQ1: The system shall provide the opportunity to book the flight, purchase a ticket, reserve a hotel room, reserve a car, and provide information about attractions.

**Problem:** This bundles five distinct capabilities into one requirement. Traceability, testing, and change management become extremely difficult.

**How to detect:** Look for "and", "but", "also", or comma-separated lists of distinct capabilities.

**Corrected (split into atomic requirements):**

> REQ1: The system shall allow the user to book a flight.
>
> REQ2: The system shall allow the user to purchase a ticket.
>
> REQ3: The system shall allow the user to reserve a hotel room.
>
> REQ4: The system shall allow the user to reserve a car.
>
> REQ5: The system shall provide information about attractions at the destination.

---

### 9. Necessary

**Definition:** A requirement is necessary if and only if: (a) at least one stakeholder needs it, AND (b) removing it would affect the system.

**A requirement is unnecessary if:**
- No stakeholder requested it (e.g., a developer added it because they assumed users would want it, or because they know how to implement it).
- Removing it would not change the system in any way (e.g., it restates an obvious project constraint).

**Violation Example:**

> REQ1: All requirements specified in the Vision document shall be implemented and tested.

**Problem:** This is a meta-statement about the project process, not a system requirement. It provides no new information and removing it does not change system behavior.

---

### 10. Implementation-free

**Definition:** Requirements shall not contain unnecessary design or implementation details. They describe *what* the system does for the user, not *how* it does it internally.

**Violation Example:**

> REQ1: Content information shall be stored in a text file.

**Problem:** How information is stored is an internal design decision transparent to the user. This should be the architect's decision.

**Corrected:**

> REQ1: The system shall persist content information between user sessions.

---

## Set-Level Criteria

### 11. Consistent

**Definition:** There shall be no conflicts between requirements in the set. Conflicts may be direct, indirect, or terminological.

**Direct Conflict — Same situation, different behavior:**

> REQ1: Dates shall be displayed in the mm/dd/yyyy format.
>
> REQ2: Dates shall be displayed in the dd/mm/yyyy format.

**Resolution approach:** Analyze the conditions. If REQ1 was from a US user and REQ2 from a French user:

> REQ1: For users in the U.S., dates shall be displayed in the mm/dd/yyyy format.
>
> REQ2: For users in France, dates shall be displayed in the dd/mm/yyyy format.

Or generalize:

> REQ3: Dates shall be displayed based on the date format defined in the user's web browser locale settings.

**Direct Conflict — Irreconcilable:**

> REQ1: Payment by PayPal shall be available.
>
> REQ2: Only credit card payments shall be accepted.

**Resolution:** One requirement must be changed or removed. They cannot both be true.

**Indirect Conflict — Impossible to fulfill both:**

> REQ1: The system shall have a natural language interface.
>
> REQ2: The system shall be developed in three months.

**Problem:** A natural language interface is unlikely to be buildable in three months.

**Terminology Inconsistency:**

> REQ1: For outbound and **inbound** flights, the user shall be able to compare flight prices.
>
> REQ2: The outbound and **return** flights shall be sorted by the smallest number of stops.

**Problem:** "Inbound flights" and "return flights" refer to the same concept but use different terms. Choose one term and use it consistently throughout all requirements.

---

### 12. Nonredundant

**Definition:** Each requirement shall be expressed only once. No requirement should overlap with or be a subset of another.

**Violation Example:**

> REQ1: A calendar shall be available to help with entering the flight date.
>
> REQ2: The system shall display a pop-up calendar when entering any date.

**Problem:** REQ1 (calendar for flight dates) is a strict subset of REQ2 (calendar for any date). REQ1 is redundant.

**Resolution:** Keep only REQ2.

---

### 13. Complete

**Definition:** A requirement shall specify behavior for all conditions that can occur. No gaps in condition coverage.

**Violation Example:**

> REQ1: A destination country does not need to be displayed for flights within the U.S.
>
> REQ2: For overseas flights, the system shall display a destination country.

**Problem:** What about flights to Canada and Mexico? They are neither "within the U.S." nor "overseas."

**Corrected:**

> REQ1: For flights within the U.S., the destination country shall not be displayed.
>
> REQ2: For flights to destinations outside the U.S. (including neighboring countries and overseas), the system shall display the destination country.

---

## Derived Criteria

These criteria are automatically satisfied when their base criteria are met:

| Derived Criterion | Satisfied When |
|-------------------|----------------|
| **Modifiable** | The requirement is **Atomic** and the set is **Nonredundant**. An atomic, nonredundant requirement can be changed in one place without side effects. |
| **Traceable** | The requirement is **Atomic** and has a **unique ID**. A single traceable element with a unique identifier can be tracked through design, implementation, and testing. |

---

## Untestable Language Blacklist

Quick-reference checklist of all flagged patterns. If a requirement contains **any** of these, flag it as ⚠️ WARN or ❌ FAIL on the **Testable** criterion.

| Category | Terms to Flag |
|----------|---------------|
| Vague Adjectives | robust, safe, accurate, effective, efficient, expandable, flexible, maintainable, reliable, user-friendly, adequate |
| Vague Adverbs / Phrases | quickly, safely, in a timely manner |
| Nonspecific Terms | etc., and/or, TBD |
| Modifying Phrases | as appropriate, as required, if necessary, shall be considered |
| Vague Verbs | manage, handle |
| Passive Voice | Any sentence where the subject receives the action (look for "shall be [verb]ed" without an explicit actor) |
| Indefinite Pronouns | few, many, most, much, several, any, anybody, anything, some, somebody, someone |

**How to fix flagged terms:**
- Replace vague adjectives with measurable thresholds (e.g., "reliable" → "99.9% uptime measured monthly").
- Replace indefinite pronouns with specific numbers (e.g., "many users" → "500 concurrent users").
- Convert passive voice to active voice and name the actor (e.g., "The code shall be entered" → "The user shall enter the code").
- Replace "etc." with an exhaustive list of items.
- Replace "TBD" with the actual value, or mark the requirement as incomplete and flag it.
