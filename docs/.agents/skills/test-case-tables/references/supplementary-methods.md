# Supplementary Requirements: 8 Testing Methods

Detailed procedures for testing non-functional and supplementary requirements. Each method addresses a different category of requirement. Select the method matching the requirement's nature using the decision table in the main SKILL.md.

## How to Choose Efficiently

- Choose the **cheapest method that can disprove the claim**. Do not jump to automation or white-box when inspection or a checklist is enough.
- Split multi-claim requirements into separately verifiable parts. Example: "Works in Chrome and responds within 2 seconds" requires **Method 1 + Method 8**, not one blended test.
- Use **Method 3** only when the supplementary requirement actually changes user steps, permissions, or scenario structure.
- If one requirement mixes a cross-cutting UI rule with a specific flow rule, test the UI portion with **Method 2** and the flow-specific portion with **Method 3**.

---

## Method 1: Executing Selected Test Cases in Different Environments

**Use when**: A requirement specifies platform, browser, OS, or configuration compatibility.

**Examples of triggering requirements:**
- "The web interface shall run in Chrome (v100+) and Firefox (v90+)"
- "The system shall run on Windows 11 and Ubuntu 22.04"
- "Dates shall display according to the browser's locale settings"

**Procedure:**
1. Select a comprehensive functional test case (preferably the longest basic flow) that exercises the most screens and features.
2. Execute that same test case once per required environment (e.g., once in Chrome, once in Firefox).
3. For locale/configuration requirements, the procedure is:
   - Check current browser/system settings
   - Run the full test case under those settings
   - Change the settings (e.g., to French date format)
   - Run the full test case again under the new settings
4. Create one entry per environment combination in the test plan.

**Output format:**

| Environment | Test Case Used | Configuration Notes | Result |
|-------------|---------------|---------------------|--------|
| Chrome v120 / Windows 11 | TC-01: Basic Flow | Default locale | |
| Firefox v115 / Windows 11 | TC-01: Basic Flow | Default locale | |
| Chrome v120 / Ubuntu 22.04 | TC-01: Basic Flow | French date format | |

**Key principle**: You do not need to re-run ALL test cases in every environment. Select one to three representative test cases that cover the most critical paths.

---

## Method 2: Adding an Additional Check to All Use Cases

**Use when**: A requirement describes UI behavior or appearance that applies to every screen in the application.

**Examples of triggering requirements:**
- "On each page a Next button shall suggest a default flow"
- "Mandatory fields shall be indicated by a star next to the field"
- "A pop-up calendar shall appear when any date is entered"
- "Multiple entry fields on one page shall be vertically aligned"
- "Focus shall be on the first entry field when a dialog opens"
- "Every invalid input shall produce a meaningful error message explaining expected format"
- "Currency amounts shall display with two decimal places"
- "Online help shall be available from the menu on every page"
- "Pages gathering personal data shall link to the privacy policy"

**Procedure:**
1. Identify all functional test cases already created (from the 4-step method).
2. For each test case, whenever a new screen or dialog box appears for the first time, insert a checklist verification step.
3. The checklist has two categories:

**One check per page:**
- Is there a Next button suggesting default navigation?
- If the page has multiple entry fields, are they vertically aligned?
- Is help available from the menu?
- Is there a privacy policy link (on personal data pages)?

**Check per specific control type:**
- Do ALL mandatory fields have a star indicator?
- Is a pop-up calendar available for EVERY date field?
- Do ALL currency fields display two decimal places?
- Does focus land on the first entry field?

4. Add these checks as additional rows in existing test case tables — do NOT create separate test cases for them.

**Key principle**: Because functional test cases already visit every screen, adding checks to them guarantees the supplementary requirement is verified in all applicable locations without creating separate tests.

**Failure mode to watch**: If existing functional cases do **not** visit all relevant screens, extend the functional suite first; Method 2 cannot prove coverage of pages you never open.

---

## Method 3: Checking and Modifying Specific Use Cases

**Use when**: A supplementary requirement is associated with specific use cases, typically security or access-control features.

**Examples of triggering requirements:**
- "A password shall be required to access administrator screens"
- "Hotel providers shall log in using IDs and passwords to submit offers"
- "Users shall create IDs and passwords during ticket purchase"

**Procedure:**
1. Identify which use case(s) the requirement affects.
2. Add the necessary steps to those specific use cases (e.g., add login steps before accessing admin functionality).
3. Propagate the changes through all scenarios derived from the modified use case.
4. Update all test cases derived from those scenarios to include the new steps.

**Key principle**: The supplementary requirement effectively modifies the use case itself. Once modified, the standard 4-step method applies to the updated use case — generating new test variables and options for the added steps. If the login procedure is complex, consider extracting it as a separate included use case.

**Boundary rule**: If the requirement merely says a screen should display an access warning or banner everywhere, that is Method 2, not Method 3. Use Method 3 only when scenario steps actually change.

---

## Method 4: Performing the Exercise

**Use when**: The requirement describes a task that must be performed and measured, typically involving time or procedure.

**Examples of triggering requirements:**
- "An error log shall be accessible to the administrator remotely over the Internet"
- "A service provider shall learn to use the system in one hour"
- "Average hotel room booking time shall not exceed ten minutes"
- "Redundant system shall resume operations within 30 seconds after failure"
- "System shall be operational within one minute of starting up"
- "Deployment on a new application server version shall take no longer than one day"

**Procedure:**
1. **Simple procedural tests** (accessibility, feature existence): Have a tester perform the described task and verify success. One execution is sufficient unless problems are found.
2. **Time-based requirements (learning/task duration)**: Have THREE independent testers perform the task and compare timings. Average must meet the requirement.
3. **Reliability/recovery time requirements**: Repeat the test multiple times to check timing consistency. If the first test passes comfortably, one execution may suffice. If close to the limit, analyze the cause and retest.
4. **Long-duration tests**: For deployment or setup time requirements, one test is sufficient if it passes comfortably. If it exceeds the limit, analyze root cause and retest after fixes.
5. **Click-count/accessibility requirements** (e.g., "Booking shall be available from the home page", "Car rental available within one click"): Count the actual clicks/steps needed and verify against the requirement.

**Interpretation rule**: If a timing result barely passes, do not treat it as stable evidence. Record variance and recommend repeat runs or automation if the margin is thin.

**Output format:**

| Requirement | Test Type | Testers | Attempts | Measured Result | Pass/Fail |
|-------------|-----------|---------|----------|-----------------|-----------|
| "Learn in 1 hour" | Time-based | 3 independent | 1 each | 45min, 52min, 38min (avg: 45min) | Pass |
| "Resume in 30 sec" | Recovery | 1 | 3 repeats | 12s, 15s, 11s | Pass |

---

## Method 5: Checklist

**Use when**: The requirement is binary — either it is fulfilled or it is not. No complex testing is needed.

**Examples of triggering requirements:**
- "The system shall use an Oracle database"
- "All system errors shall be recorded and available to the administrator"
- "All transactions shall be recorded and available to the administrator"
- "The system shall use J2EE architecture"
- "If an application server is required, WebSphere shall be used"
- "Administrator's Guide shall be available as a PDF"
- "Separate tabs shall be available for each main functionality area"

**Procedure:**
1. For each requirement, create a single yes/no checklist entry.
2. Verify by inspection (looking at the system configuration, documentation, or architecture).
3. Mark as fulfilled or not fulfilled.

**Use this instead of over-testing** when the requirement is a static fact. Running functional scripts will not produce better evidence for "uses Oracle" than direct inspection.

**Output format:**

| Req ID | Requirement | Fulfilled (Y/N) | Verified By | Date | Notes |
|--------|-------------|-----------------|-------------|------|-------|
| SR-01 | System uses Oracle database | Y | [Name] | [Date] | Oracle 19c confirmed |
| SR-02 | Admin guide available as PDF | N | [Name] | [Date] | Only available as HTML |

---

## Method 6: Analysis

**Use when**: The requirement can be verified through reasoning, architecture review, or mental exercise rather than physical testing. Often involves a system architect.

**Examples of triggering requirements:**
- "No technical skills (except browser usage) shall be required"
- "System shall be available 24/7"
- "No client workstation installation required; all upgrades on server"
- "System shall automatically book tickets without human intervention"
- "Adding a UI in a different language shall not require rewriting application logic"
- "Main functionality shall be encapsulated in reusable components"

**Procedure:**
1. For each requirement, formulate specific analytical questions:
   - "Is there anything preventing the application from running continuously?"
   - "Is there scheduled maintenance that causes unavailability?"
   - "Does the architecture support the stated requirement?"
2. Involve a system architect for architecture-related requirements.
3. Document the analysis reasoning and conclusion.
4. For component reusability claims, a simple test client demo may supplement the analysis.

**Red flag**: Analysis must still cite concrete evidence (deployment docs, architecture diagrams, design decisions). Pure opinion is not a passing result.

**Output format:**

| Req ID | Requirement | Analysis Questions | Conclusion | Analyst | Evidence |
|--------|-------------|-------------------|------------|---------|----------|
| SR-10 | 24/7 availability | Scheduled maintenance? Failover? | Partially met — 15min weekly maintenance window | [Architect] | Deployment docs |

---

## Method 7: White-Box Testing

**Use when**: Testing requires knowledge of application code, database internals, or specific algorithms.

**Examples of triggering requirements:**
- "When returning a list of flights, the system cannot miss any direct flight or any flight with only one stopover"
- "The flight list shall include the flight calculated from Dijkstra's Shortest Path algorithm"

**Procedure:**
1. Access the underlying data directly (e.g., query the database), bypassing the application.
2. Perform the same operation through the application.
3. Compare results — the application's output must match or include the directly-obtained results.
4. For algorithm-specific requirements, verify the algorithm was applied correctly by independently computing the expected result and comparing.

**Use white-box only when completeness cannot be shown black-box.** Needing confidence is not enough; you need internal evidence that user-visible testing cannot provide.

**Output format:**

| Req ID | Requirement | Direct Query Result | Application Result | Match? | Discrepancies |
|--------|-------------|--------------------|--------------------|--------|---------------|
| SR-15 | No direct flights missed | 47 direct flights in DB | 47 direct flights shown | Yes | None |

---

## Method 8: Automated Testing

**Use when**: Performance, reliability, load, or stress requirements that cannot be verified manually.

**Examples of triggering requirements:**
- "Average response time shall be less than 2 seconds"
- "System shall accommodate 1,000 booked flights per minute"
- "System shall accommodate 5,000 concurrent users"
- "Mean time between failures shall exceed 20 hours"
- "System may be unavailable no more than 1 minute per 24 hours"

**Procedure:**
1. **Select test cases**: Choose 1–3 functional test cases representing the most popular scenarios and the longest/most resource-intensive operations.
2. **Parameterize**: Key parameters are **number of concurrent users** and **number of iterations** (sequential repetitions per user).
3. **Scaling runs**: Execute the same script with increasing user counts (e.g., 1, 10, 100, 1000) to analyze performance degradation.
4. **Reliability runs**: For MTBF (mean time between failures) and uptime requirements, run at least one continuous session of 48+ hours.
5. **Record metrics**: Response time (mean, std deviation, min, max, percentiles at 50th/70th/80th/90th/95th), throughput, error rate.

**Questions automated testing should answer:**
- What is the response time under normal load?
- How many concurrent users before performance becomes unacceptable?
- How does the system behave at maximum expected user count?
- Beyond maximum users — does performance degrade gracefully or does the system crash?
- How do performance and reliability depend on system resources (memory, disk)?
- Does performance vary by time of day?

**Output format:**

| Operation | Users | Iterations | Mean (s) | Std Dev | Min (s) | 50th % | 90th % | 95th % | Max (s) | Pass? |
|-----------|-------|------------|----------|---------|---------|--------|--------|--------|---------|-------|
| Search flights | 5 | 5 | 5.88 | 0.69 | 5.11 | 5.92 | 6.66 | 6.84 | 7.02 | Yes |
| Purchase ticket | 5 | 5 | 4.57 | 0.55 | 4.05 | 4.23 | 5.25 | 5.25 | 5.26 | Yes |

**Key principle**: Automated testing is also valuable for functional regression testing — create scripts for many scenarios and re-run after each release.

**Do not overclaim**: A short performance run cannot prove availability or MTBF claims; long-duration evidence is required for reliability statements.

---

## Decision Tree: Choosing the Right Method

```
Is the requirement about platform/browser/OS compatibility?
  → YES → Method 1: Different Environments

Is it a UI behavior applying to ALL screens?
  → YES → Method 2: Additional Checks on All Use Cases

Is it security/access tied to specific use cases?
  → YES → Method 3: Modify Specific Use Cases

Does it involve performing a timed task or physical exercise?
  → YES → Method 4: Perform the Exercise

Is it a simple yes/no fact about the system?
  → YES → Method 5: Checklist

Can it be verified by reasoning about architecture/design?
  → YES → Method 6: Analysis

Does verification require access to code or database internals?
  → YES → Method 7: White-Box Testing

Is it about performance, load, reliability, or stress?
  → YES → Method 8: Automated Testing
```

If a requirement doesn't clearly fit one method, it may need a combination. Start with the simplest applicable method.

---

## Common Misclassifications — NEVER

- **NEVER choose Method 8 for a binary architecture fact.** Load tools do not prove "uses Oracle" better than inspection.
- **NEVER choose Method 3 unless the requirement changes scenario steps or permissions.** Otherwise you are rewriting use cases for a rule that should have been a page-level check.
- **NEVER choose Method 7 just because database access exists.** Use it only when internal comparison is necessary to prove completeness or algorithm correctness.
- **NEVER use one tester for learnability claims.** A single person's speed measures that person, not the requirement.
- **NEVER claim Method 2 covers the whole UI if your functional suite misses pages.** Coverage depends on visited screens, not intention.
