# Feature Attributes — Detailed Reference

Attributes describe properties of requirements. They help organize and analyze the requirements in the project. Use attributes to decide which requirements to implement in each iteration, phase, or release.

Do **not** invent attribute values that the source material does not support. When information is unavailable, either omit optional attributes or mark them `TBD`.

---

## Core Feature Attributes

These are the minimum attributes expected in a Vision Document or formal audit:

| Attribute | Type | Values | Description |
|-----------|------|--------|-------------|
| **Priority** | List | High, Medium, Low | Determines the order of implementation. A feature with High priority should be implemented before Medium or Low. |
| **Status** | List | Proposed, Approved, Incorporated, Validated | Tracks the lifecycle of the requirement: Proposed (drafted) → Approved (accepted by stakeholders) → Incorporated (implemented in the system) → Validated (verified through testing). |
| **Difficulty** | List | High, Medium, Low | How difficult it is to implement this requirement from a technical perspective. |
| **Risk** | List | High, Medium, Low | The probability of issues related to this requirement — problems with implementation, missing deadlines, technical unknowns, or dependency failures. |
| **Origin** | Text | STRQ ID(s) or "Completion" | The source stakeholder request(s) from which this feature was derived. If the feature was added via the Completion rule, record `Completion` or a more specific completion ID such as `Completion-1`. |
| **Transformation** | Text | Rule name(s) | The transformation rule(s) applied when deriving this feature from stakeholder request(s). |

## Optional Planning Attributes

Add these only when they are useful and supported by project context:

| Attribute | Type | Values | Description |
|-----------|------|--------|-------------|
| **Stability** | List | High, Medium, Low | The probability that the feature will NOT change during the project. High stability means the requirement is well-understood and unlikely to be revised. |
| **Planned Iteration** | Text | e.g., "E1", "C2" | The iteration in which this feature is scheduled for implementation. Uses phase abbreviation + iteration number (e.g., E1 = first iteration of Elaboration phase). |
| **Actual Iteration** | Text | e.g., "E1", "C2" | The iteration in which this feature was actually implemented. |
| **Contact Name** | Text | Person's name | The person responsible for or most knowledgeable about this requirement. |
| **Author** | Text | Person's name | The person who wrote this requirement. |
| **Location** | Text | Document name/section | Which document and section this requirement resides in. |

---

## Recommended Additional Attributes

These attributes are commonly added to improve requirements management:

| Attribute | Type | Values | Description |
|-----------|------|--------|-------------|
| **Importance** | List | Mandatory, Desirable, Nice-to-have | How important this feature is to stakeholders. Distinct from Priority (which is about implementation order). In case of delays, Mandatory features must be delivered; Nice-to-have features may be dropped. Note: Importance according to the user may differ from Importance according to the project manager. |
| **Effort** | Numeric (person-days) | e.g., 5, 10, 20 | Estimated time required to implement the requirement. More granular than Difficulty. |
| **Cost to Implement** | Numeric (currency) | e.g., $5,000 | Useful when resources have different hourly rates. Enables cost/reward ratio calculations. |
| **Cost/Reward Ratio** | Numeric | Calculated | Ratio of implementation cost to business value. Lower is better. |
| **Risk/Reward Ratio** | Numeric | Calculated | Ratio of risk to business value. Lower is better. |
| **Assigned To** | Text | Person's name | Alternative to Contact Name — the person assigned to implement this requirement. |
| **Planned Completion Date** | Date | e.g., "2024-03-15" | Alternative to Planned Iteration — use when calendar dates are preferred. |
| **Actual Completion Date** | Date | e.g., "2024-03-20" | Alternative to Actual Iteration. |
| **Risk Probability** | List | High, Medium, Low | Splits the Risk attribute: what is the probability of problems occurring? |
| **Risk Impact** | List | High, Medium, Low | Splits the Risk attribute: if a problem occurs, how severe is the impact? |
| **Enhancement Request** | Text | Reference ID | Links to external enhancement request tracking. |
| **Defect** | Text | Reference ID | Links to external defect tracking. |
| **Transformation** | Text | Rule name(s) | Re-list here only if your process treats transformation metadata as part of an extended planning schema as well as the core audit set. |

---

## Using Attributes for Iteration Planning

Attributes can drive implementation prioritization. Example rules:

- **Elaboration phase**: Implement all requirements with High Risk AND High or Medium Importance, PLUS all requirements with High Importance AND High or Medium Difficulty.
- **Construction phase**: Implement remaining requirements ordered by Priority.
- **Scope management**: If behind schedule, consider dropping features with Importance = "Nice-to-have" first, then "Desirable".

These rules should be tailored to each project's specific needs and methodology.

---

## Minimum Attribute Set

At minimum, every Feature should have these attributes assigned:

1. **Priority** — Required for planning
2. **Status** — Required for tracking
3. **Difficulty** — Required for estimation
4. **Risk** — Required for risk management
5. **Origin** — Required for traceability
6. **Transformation** — Required for audit trail

## Practical Attribute Rules

- If you know only relative implementation order, assign **Priority** and leave **Planned Iteration** unset.
- If you know the feature matters but do not know actual sequencing, use **Importance** without pretending to know **Priority**.
- If a feature was introduced through Completion, make that explicit in both **Origin** and the traceability matrix.
- If stakeholders disagree on an attribute value, record the current best-known value and note the disagreement in surrounding analysis rather than hiding uncertainty.
