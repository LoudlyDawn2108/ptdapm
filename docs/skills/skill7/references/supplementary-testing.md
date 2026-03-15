# Testing Supplementary (Non-Functional) Requirements

Supplementary requirements vary widely in nature. No single method covers them all. Select the method based on **what kind of evidence would actually prove compliance**, then tailor the test approach.

## Before You Choose a Method

Ask these questions in order:

1. Is this really supplementary, or is it a functional rule hidden in non-functional wording?
2. Does the requirement apply to **all screens**, **specific use cases**, **the architecture**, or **runtime behavior under load/time**?
3. Can compliance be proven by direct observation, or do you need internals, analysis, repetition, or automation?
4. Is one execution enough, or does confidence require concurrency, duration, or statistics?

**Reclassification rule:** If the requirement changes user flow or business behavior for a specific use case (for example, authentication before admin actions), treat it as **Method 3** and regenerate the functional tests from the modified use case.

## Method Selection Decision Table

| Requirement Type | Method | Example Requirement |
|---|---|---|
| Must work across browsers, OS, or configurations | **1 — Different Environments** | "Shall run in Chrome and Firefox" |
| UI behavior that applies to every screen/control | **2 — Additional Check on All Use Cases** | "Mandatory fields must have a star indicator" |
| Security/login/access control tied to specific use cases | **3 — Modify Specific Use Cases** | "Password required for admin screens" |
| Task timing, learnability, or one-off verification | **4 — Perform the Exercise** | "User shall learn the system in one hour" |
| Binary yes/no architectural or configuration facts | **5 — Checklist** | "System shall use Oracle database" |
| Architecture quality or qualitative claims needing reasoning | **6 — Analysis** | "No technical skills required to use the system" |
| Correctness of algorithms or data completeness | **7 — White-Box Testing** | "Search must not miss any direct flight" |
| Performance, reliability, load, or stress requirements | **8 — Automated Testing** | "Response time under 2 seconds" |

**Fast chooser:**
- Different platform/configuration only? → **1**
- Same functional tests, but add the same extra check everywhere? → **2**
- Specific use cases must be changed? → **3**
- A human can perform and judge it directly? → **4**
- Simple yes/no fact? → **5**
- Architectural reasoning needed? → **6**
- Need internals to prove correctness? → **7**
- Need scale, repetition, duration, or concurrency? → **8**

---

## Method 1: Executing Selected Test Cases in Different Environments

**When to use:** The environment itself is the variable: browser, operating system, device type, locale configuration, feature flag, or deployment configuration.

**Procedure:**
1. Select a representative functional test case, ideally a common main-flow scenario.
2. Execute it fully in Environment A.
3. Execute the same test case in Environment B.
4. Repeat for each required environment/configuration.

**Result:** One execution record per environment. Report any behavior or presentation differences.

**Variation — different configurations in the same environment:**
If the requirement says "dates shall display according to browser locale settings":
1. Note the current locale.
2. Run the full test case.
3. Change locale.
4. Run the same test case again.
5. Verify dates display correctly under each locale.

**Do not use Method 1 alone** when the requirement is actually about response time, reliability, or load in each environment. In that case, combine Method 1 with Method 8.

---

## Method 2: Adding an Additional Check to All Use Cases

**When to use:** The requirement adds the **same check everywhere**, usually per screen or per control type.

**Procedure:**
1. Decide whether the check is **per-page** or **per-control**.
2. Add the check to each existing functional test case at the point where a new screen/control first becomes visible.

**Per-page checks** — verify once when each screen appears:
- Is there a default navigation button?
- Is help available from the menu?
- Is there a privacy policy link on personal-data pages?

**Per-control checks** — verify for every relevant control instance:
- Do all mandatory fields have a star indicator?
- Does every date field have a pop-up calendar?
- Do all currency fields display two decimal places?
- Does every invalid input show a meaningful format/error hint?

**Result:** Add checklist rows to existing functional tests at screen-transition points.

**Do not use Method 2** when the requirement changes flow only for some use cases. That belongs in Method 3.

---

## Method 3: Checking and Modifying Specific Use Cases

**When to use:** The supplementary requirement changes the flow of specific use cases, commonly for authentication, authorization, approvals, confirmations, or prerequisites.

**Procedure:**
1. Identify the affected use cases.
2. Add the needed steps to those use cases.
3. If the new steps are substantial, extract them as an included use case.
4. Regenerate scenarios and functional test cases using the 4-Step Method.

**Result:** Updated use cases drive updated scenarios, matrices, and test cases.

**Common fit:** login before admin actions, role checks, extra confirmation steps, approval chains, prerequisite setup flows.

---

## Method 4: Performing the Exercise

**When to use:** The requirement can be verified by performing a task directly, often for learnability, timing of a human task, operational access, or simple click-count constraints.

**Examples:**

**Accessibility/operational check:**
- Requirement: "Error log shall be accessible remotely."
- Test: Log in remotely and verify the error log is accessible.

**Task-timing requirement:**
- Requirement: "Average booking time shall be under 10 minutes."
- Test: Have 3 independent testers perform the task and compare timings.

**Repeated-timing requirement:**
- Requirement: "System shall be operational within 1 minute of startup."
- Test: Perform the exercise 3–5 times and verify consistency.

**Long-duration manual task:**
- Requirement: "Deployment on new server shall take no more than 1 day."
- Test: Perform once; if the result is near the threshold, investigate and repeat.

**Click-counting requirement:**
- Requirement: "Car rental shall be available within 1 click from home page."
- Test: Navigate from home page and count clicks.

**When Method 4 is not enough:** If the requirement says "average" under production-scale load, "for 5,000 users," "over 24 hours," or otherwise implies statistics or sustained execution, switch to Method 8.

---

## Method 5: Checklist

**When to use:** The requirement is a binary fact that can be verified without complex execution.

**Procedure:** Verify the fact and mark it Pass/Fail with notes.

**Examples:**
- "System shall use Oracle database." → Is Oracle used?
- "Administrator's Guide shall be available as PDF." → Does the PDF exist?
- "Separate tabs for each main function." → Are tabs present?

**Result:** Checklist table with requirement, status, and notes.

**Do not use Method 5** for claims that only look binary but actually require measurement over time, scale, or load.

---

## Method 6: Analysis

**When to use:** The requirement is best verified through architectural reasoning, design review, or documented evidence rather than execution.

**Procedure:**
1. State the requirement.
2. List the analytical questions that would confirm or refute it.
3. Review the relevant design/architecture evidence.
4. Document the reasoning and conclusion.

**Examples:**

Requirement: "System shall be available 24/7."
- Analysis questions: Is scheduled downtime required? Is there redundancy? Are there single points of failure?

Requirement: "No client-side installation required."
- Analysis: Review architecture for plugins, local binaries, or client dependencies.

Requirement: "Adding a UI in a different language shall not require rewriting business logic."
- Analysis: Check separation of presentation and business logic; verify internationalization support.

**Variation — analysis + demo:** Some claims benefit from a proof-of-concept, e.g. reusing components in a minimal non-Internet client.

**Output format:** state the requirement, the evidence reviewed, the reasoning chain, and the conclusion/risks.

---

## Method 7: White-Box Testing

**When to use:** Black-box observation is not enough; proof requires code, database, algorithm, or internal-state access.

**Procedure:**
1. Access the relevant internals directly.
2. Produce the expected result independently.
3. Compare the internal truth with the application's externally visible output.

**Examples:**

Requirement: "Search must not miss any direct flight or one-stopover flight."
- Test: Query the flight database directly, then compare with UI search results.

Requirement: "Flight list shall include flights from Dijkstra's shortest-path algorithm."
- Test: Run the algorithm independently and compare expected vs. actual results.

**Use Method 7 only** when black-box testing cannot establish correctness with confidence.

---

## Method 8: Automated Testing

**When to use:** Manual testing is impractical because the requirement depends on scale, concurrency, long duration, stress, or repeatable measurement.

**Typical fits:**
- "Average response time under 2 seconds."
- "Support 5,000 concurrent users."
- "Mean time between failures exceeds 20 hours."
- "System unavailable no more than 1 minute per 24 hours."

**Procedure:**
1. Select 1–3 representative functional test cases, preferably the most common scenario and the heaviest-processing scenario.
2. Script or record them for automated execution.
3. Run with varying parameters such as concurrent users and iteration counts.
4. For reliability testing, include at least one long-duration run (for example, 48+ hours).

**Key questions Method 8 answers:**
- What is response time under normal load?
- At what user count does performance become unacceptable?
- Does the system degrade gracefully beyond expected maximum load?
- How do memory, disk, or other resources affect results?

**Result:** Capture a performance/reliability data table per run and compare against thresholds.

| Operation | Executions | Mean (s) | Std Dev | Min | 50th | 70th | 80th | 90th | 95th | Max |
|-----------|-----------:|---------:|--------:|----:|-----:|-----:|-----:|-----:|-----:|----:|
| Search flights | 500 | 1.88 | 0.29 | 1.21 | 1.84 | 1.96 | 2.01 | 2.11 | 2.18 | 2.42 |

**Also useful for:** large-scale functional regression after releases.

---

## Anti-Patterns

- **Do NOT default every supplementary requirement to automated testing.** Why: many are better handled by analysis, checklist, or modified use cases.
- **Do NOT force the 4-Step functional matrix onto pure performance/reliability requirements.** Why: it optimizes behavioral coverage, not load evidence.
- **Do NOT treat architecture claims as UI-only tests.** Why: some can only be confirmed or refuted through design review.
- **Do NOT use a binary checklist for time-based or statistical requirements.** Why: pass/fail without measurement hides real risk.
- **Do NOT leave mixed requirements unsplit.** Why: one sentence may require multiple methods.

## Mixed-Requirement Handling

If one requirement contains multiple testable claims, split it before selecting methods.

Examples:
- "Works in Chrome and Firefox within 2 seconds" → **Method 1** for browser coverage + **Method 8** for timing.
- "Admin pages require login and must show mandatory-field stars" → **Method 3** for flow change + **Method 2** for UI-wide check.
- "No client installation and supports 5,000 users" → **Method 6** for architecture claim + **Method 8** for scale claim.

## Minimum Response Shape

When using this reference, structure the answer as:
1. **Chosen method**
2. **Why it fits**
3. **How to execute/evaluate it**
4. **Fallback or companion method** if the requirement is mixed or ambiguous
