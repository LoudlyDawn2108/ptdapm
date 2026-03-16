# Option Identification Catalog

Exhaustive patterns for identifying significantly different options across common variable types. Use the 7 criteria from the main SKILL.md as your decision framework. This catalog provides concrete examples.

## How to Use This Catalog

- Use this file **after** you know the scenario and variables. It is a pattern library, not a substitute for scenario analysis.
- Select only categories that create different behavior, different messages, different downstream data, or a true boundary.
- If a requirement already states an exact rule (for example, "ZIP must be 5 digits"), prefer the requirement-specific rule over generic examples here.
- Push mere data variety to Step 4 concrete values. Do **not** paste every example in this catalog into the allocation matrix.

### Fast Decision Tree

1. **Is there an explicit bound or format rule?** Keep the valid edge, just-outside edge, and relevant format failures.
2. **Does the value change UI, workflow, or another field's valid choices?** Keep one option per behavior category.
3. **Is the field free-text with weak or no format enforcement?** Keep baseline valid, blank/required failure, and at least one unusual-but-legitimate real-world format.
4. **Still unsure whether two options differ?** If expected system behavior is identical, collapse them into one option.

---

## String Fields (Names, Addresses, Free-Text)

For any text input field with a length constraint, ALWAYS test these categories:

| Option Category | Example (for "Last Name", max 30 chars) | Why It's Different |
|----------------|----------------------------------------|-------------------|
| Regular valid value | "Smith" | Baseline happy path |
| Maximum allowed length | "Georgiamistopoulosdakisenberg" (30 chars) | Border condition — system must accept exactly at limit |
| One character longer than max | 31-character string | Border condition — system must reject or truncate |
| Single character | "X" | Minimum valid (unless min length specified) |
| Blank / empty | "" | Tests mandatory field validation |
| Contains apostrophe | "D'Artagnan" | Special character that may break SQL or parsing |
| Contains space | "De La Cruz" | Multi-word names that may be incorrectly rejected |
| Contains hyphen | "Smith-Jones" | Common format that may be mishandled |
| Contains diacritics | "García", "Müller" | International characters that may cause encoding issues |

**Thinking prompt**: "What unusual-but-legitimate values could a real user enter that might expose parsing, storage, or display flaws?"

**Do not split unnecessarily**: Multiple ordinary valid names are not separate options unless they exercise a distinct rule (for example, max length, punctuation, or non-ASCII handling).

---

## Numeric Fields (Quantities, Counts)

| Option Category | Example (for "Number of travelers") | Why It's Different |
|----------------|--------------------------------------|-------------------|
| Regular valid number | 2 | Baseline |
| Zero | 0 | May be invalid or trigger special handling |
| One | 1 | Minimum meaningful value — different UI/logic path |
| Maximum allowed | System max (e.g., 9) | Border condition at upper limit |
| Negative number | -1 | Should be rejected; tests input validation |
| Decimal | 1.5 | Should be rejected for integer fields |
| Maximum digits that fit in field | 99999999... (fill the field) | Tests field length vs. logical constraints |

**For quantity fields with dependencies** (e.g., adults + children):

| Combination | Why It's Different |
|------------|-------------------|
| Adults=1, Children=0 | Solo adult traveler — simplest case |
| Adults=2, Children=1 | Multiple passengers with mixed types |
| Adults=0, Children=0 | Invalid — no passengers (must be rejected) |
| Adults=0, Children=1 | Child without adult — may trigger special business rules |
| Adults=1, Children=max | Tests maximum party size boundary |
| Adults=max, Children=0 | Tests maximum with only one type |

**Heuristic**: For repeated subforms driven by a count, prefer testing **1, 2, and maximum meaningful count** unless business rules distinguish every intermediate count.

---

## Date Fields

| Option Category | Example | Why It's Different |
|----------------|---------|-------------------|
| Valid future date (manual entry) | "2025-04-15" | Baseline |
| Valid future date (from calendar picker) | Same date via calendar UI | Tests alternate input method |
| Date in the past | "2020-01-15" | Must be rejected for future-only fields |
| Today's date | Current date | Border condition — may or may not be valid |
| Invalid date | "February 30" or "2025-02-30" | Tests date validation logic |
| Date not set / blank | Empty | Tests mandatory field handling |
| Far future date | Over one year from now | May exceed business rule limits |

**For date pairs** (e.g., departure + return):

| Combination | Why It's Different |
|------------|-------------------|
| Return date one week after departure | Regular valid case |
| Return date = departure date | Border condition — valid only if times allow |
| Return date before departure date | Error — must be rejected |
| Return date over one year after departure | May exceed booking window |
| One date set, other blank | Tests individual field validation |

**Watch for derived dependencies**: If one date is retried after an error, all later date reasoning in that test column must use the retried value, not the original invalid one.

---

## Selection Fields (Dropdowns, Radio Buttons, Lists)

| Option Category | When to Test |
|----------------|-------------|
| One option per distinct system behavior | If selecting "U.S." vs "Canada" vs "Other" triggers different field populations, test all three categories — NOT every country |
| Most popular option | Baseline (e.g., most common credit card type) |
| Least common option | May reveal untested code paths |
| First item in list | May be accidentally selected as default |
| Last item in list | May be cut off in UI |

**For complex selection lists** (e.g., flight selection):

| Option Category | Example | Why It's Different |
|----------------|---------|-------------------|
| Direct / simplest option | Direct flight | Baseline |
| One intermediate step | Flight with 1 stopover | Tests multi-leg handling |
| Maximum intermediate steps | Flight with max stopovers | Tests UI and logic limits |
| Cheapest option | Lowest fare | May have restrictions |
| Option crossing midnight | Flight arriving next day | Tests date boundary in booking |
| Option crossing date line | Flight arriving 2 days later | Tests multi-day handling |

**Do not create one option per list item.** Group by distinct behavior class, not catalog size.

---

## Authentication Fields (User ID, Password)

| Option Category | Example | Why It's Different |
|----------------|---------|-------------------|
| Valid credentials | Correct user ID + correct password | Baseline |
| Invalid characters in user ID | "user@#!" | Tests character validation |
| Non-existing user ID | "zzznonexistent" | Different error than invalid format |
| Blank user ID | "" | Tests mandatory field |
| Correct user ID + wrong password | "user1" / "wrongpass" | Different error than wrong user ID |
| Wrong user ID + valid password | Tests which error appears first |
| Blank password | "" | Tests mandatory field |
| User ID at max length | Fill to maximum allowed characters | Border condition |
| Password at min length boundary | 5 chars if min=6 (reject), 6 chars (accept) | Border condition — MUST test both sides |

---

## Payment Fields (Credit Card, Billing)

### Credit Card Number
| Option Category | Why It's Different |
|----------------|-------------------|
| Valid number matching selected card type | Baseline acceptance |
| Invalid number for selected type (wrong prefix/length) | Type-specific validation error |
| Invalid number for any card type | Generic validation error |
| Contains letters | Format validation error |
| Contains special characters | Format validation error |
| Blank | Mandatory field validation |

### Expiration Date
| Option Category | Why It's Different |
|----------------|-------------------|
| Valid future date | Baseline |
| Date in the past | Expired card rejection |
| Correct format but wrong date for this card | Card verification failure |
| Invalid date format | Format validation error |

### Name on Card
| Option Category | Why It's Different |
|----------------|-------------------|
| Accept pre-populated default (passenger name) | Tests default value handling |
| Override with different valid name | Tests edit capability |
| Valid name but not actual cardholder | Tests card verification depth |
| Blank | Mandatory field validation |
| Maximum length | Border condition |

---

## Address Fields (Address, City, State, Zip, Country)

| Field | Key Options to Test |
|-------|-------------------|
| **Address** | Valid address; Maximum string length; Blank; Valid format but not matching card billing address |
| **City** | Valid city; Maximum string length; Blank |
| **State** | Correct state for country; No state selected; State from wrong country |
| **Zip Code** | Valid format; String with invalid characters; Too few digits (e.g., 4 digits for US); Too many digits (e.g., 6 for US); Blank |
| **Country** | Domestic (U.S.); Valid foreign country; Non-existing country at max length; Blank |

**Country-dependent testing**: When country selection affects other fields (state dropdown, zip format, phone format), you need separate options for each country category that triggers different behavior — NOT one option per country.

---

## Combined / Dependent Options

Some significantly different options are **combinations** of multiple values, not single-variable choices. Identify these when:

- Business rules reference multiple fields together
- Validation depends on relationships between fields
- One field's valid range changes based on another field's value

**Examples:**
- Departure date + Return date → "return before departure" is an invalid combination
- Number of adults + Number of children → "0 adults, 0 children" is invalid
- Credit card type + Credit card number → valid number must match selected type
- Country + State → state options depend on country selection

**Rule**: When you find a business rule or validation involving 2+ variables, list the meaningfully different combinations as options in the matrix, not just individual variable values.

**Practical shortcut**: Put the combination in the row where the rule becomes observable, then make dependent rows consistent with that combination instead of duplicating the same rule in multiple places.

---

## The "Default vs. Changed" Pattern

Whenever a field is pre-populated with a default value, this creates two significantly different options:
1. **Keep the default** — tests that the system correctly processes auto-populated data
2. **Override with a different valid value** — tests that user edits are properly saved

This applies to: cardholder name (pre-filled from passenger), billing address (pre-filled from profile), dates (pre-filled as today), and any other auto-populated field.

---

## Common Misuses — NEVER

- **NEVER treat this catalog as a checklist to exhaust completely.** It exists to sharpen judgment, not to force every field into a dozen options.
- **NEVER invent invalid values that the UI physically cannot enter unless bypass testing is explicitly in scope.** Otherwise you create tests the real user path cannot execute.
- **NEVER add both a generic invalid bucket and a specific invalid bucket when they cause the same message.** Keep the most diagnostic representative.
