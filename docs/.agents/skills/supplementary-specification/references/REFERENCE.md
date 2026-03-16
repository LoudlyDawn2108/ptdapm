# Supplementary Specification Reference

This reference is the **complete self-contained knowledge base** for drafting,
repairing, and evaluating Supplementary Specification documents.

Read this file completely for any non-trivial DESIGN or EVALUATE task.

---

## 1. Core classification rules

### 1.1 What a Supplementary Specification is for

A Supplementary Specification captures requirements that are:

- system-wide
- cross-cutting across multiple use cases
- too general for one use case but still product requirements
- quality attributes, constraints, interfaces, legal obligations, or generic
  functions

It does **not** capture:

- detailed interaction flows that should be separate use cases
- one-use-case-only special requirements
- project-plan, staffing, schedule, contract, or methodology constraints

### 1.2 Primary-home rule

Each requirement gets **one primary home**.

If a requirement touches multiple concerns, classify it by the **main reason the
stakeholder cares about it**.

Examples:

- `Backups shall be encrypted with AES-256.` → **Reliability / Security** if the
  primary concern is unauthorized access.
- `Nightly backups shall complete within 20 minutes.` → **Performance / Throughput**
  or **Performance / Recovery Time**, depending on context.
- `The system shall use PostgreSQL 16.` → **Implementation Requirements**, not
  Performance.
- `The system shall provide an export-to-CSV function on all reporting screens.`
  → **Functionality**, not Documentation.

### 1.3 Use-case boundary rule

Use this test:

- If the requirement applies to **many** use cases or to the whole system, keep
  it in the Supplementary Specification.
- If it applies to **exactly one** use case action or scenario, put it in that
  Use Case Specification's **Special Requirements** section.
- If it requires a multi-step interaction narrative, make it a **use case**.

Examples:

- `All authenticated sessions shall expire after 15 minutes of inactivity.` →
  Supplementary Specification.
- `During Checkout, payment authorization shall complete within 3 seconds.` →
  likely the Checkout use case's Special Requirements section.
- `Administrators shall be able to define report filters, schedule report runs,
  and download generated reports.` → probably a new use case, not one bullet in
  a Supplementary Specification.

### 1.4 Constraint vs quality vs interface

| Type | Use when the statement is mainly about... | Typical phrasing |
|---|---|---|
| **Quality attribute** | How well the system behaves | `shall respond within...`, `shall be available...` |
| **Constraint** | A mandated design or implementation choice | `shall use...`, `shall run on...` |
| **Interface requirement** | What must connect, exchange data, or conform | `shall expose... API`, `shall support... protocol` |
| **Documentation requirement** | Manuals, help, guides, knowledge artifacts | `shall provide... guide` |
| **Legal requirement** | Law, regulation, licensing, privacy, copyright | `shall retain consent records for...` |

---

## 2. Full FURPS+ taxonomy

Use the following tables to classify, elicit, and assess completeness.

### 2.1 Functionality

Generic functional requirements that are **not** a full use case and are not
limited to one use case.

| Subcategory | Use when the requirement is about... | Ask yourself | Typical measures / evidence | Example |
|---|---|---|---|---|
| Generic functions | cross-cutting features available in many places | Is this a system capability rather than a flow? | presence of capability; scope of availability | `Contextual help shall be available from every primary workflow screen.` |
| Search / retrieval | generic search or lookup behavior used across modules | Is search global or reusable across multiple use cases? | supported filters, max results, response targets | `Users shall be able to search orders by order ID, customer ID, and date range.` |
| Reports / exports | system-wide report generation or export ability | Is this a reusable product feature rather than a dedicated reporting workflow? | list of report types; available formats | `Administrators shall be able to export audit logs to CSV and PDF.` |
| Notifications | reusable notification mechanisms | Is this notification behavior shared across scenarios? | channels, time windows, delivery success rate | `The system shall send booking confirmations by email within 1 minute of purchase.` |
| Online help | built-in help not covered as external documentation | Is the help function embedded into the product? | placement, availability, coverage | `Field-level help shall be available for every mandatory form field.` |

**Escalate to a use case** when the functionality needs a long flow, rich rules,
or separate actor goals.

### 2.2 Usability

| Subcategory | Use when the requirement is about... | Ask yourself | Typical measures / evidence | Example |
|---|---|---|---|---|
| Accessibility | access to functions, disabilities support, inclusive access | Can target users reach and operate the capability? | WCAG level, keyboard operability, screen-reader compatibility | `All public web pages shall conform to WCAG 2.2 AA.` |
| Aesthetics | visual presentation and look-and-feel rules | Is the concern visual coherence rather than function? | style-guide conformance, spacing/alignment rules | `All multi-field forms shall align labels and inputs to a single grid.` |
| UI consistency | consistency within the UI or with a named standard | Does sameness reduce learning cost and error risk? | style guide usage; named standard conformance | `Primary actions shall appear in the lower-right area of modal dialogs across all modules.` |
| Ergonomics | minimizing awkward interaction effort | Does the UI reduce clicks, re-entry, and cursor travel? | click count, focus behavior, tab order | `When a modal opens, focus shall move to the first editable field.` |
| Ease of use | learnability and operational simplicity | How quickly can target users become effective? | training time, task completion time, error rate | `A customer-service agent shall learn the case-update workflow in no more than 2 hours of training.` |

**Common confusion**:

- `Screen shall load in 1 second` is **Performance**, not Usability.
- `System shall support keyboard-only navigation` is usually **Usability / Accessibility**.

### 2.3 Reliability

| Subcategory | Use when the requirement is about... | Ask yourself | Typical measures / evidence | Example |
|---|---|---|---|---|
| Availability | percentage of time the service is up | What uptime is required, and during what service window? | uptime %, allowed downtime, MTBF | `The production service shall be available 99.95% of each calendar month excluding approved maintenance windows.` |
| Robustness | resistance to invalid input and hostile conditions | How gracefully does the system react to bad input or depleted resources? | handled error classes; safe degradation rules | `For invalid date input, the system shall reject the request and display the expected format.` |
| Accuracy | precision of calculations and stored values | What numerical or data precision is required? | decimal places, tolerance, reconciliation rate | `Tax amounts shall be calculated to two decimal places using bankers rounding.` |
| Recoverability | restoration quality after failure | After failure, what state or user work must be preserved? | restored session state, data-loss tolerance | `After application restart, unsubmitted draft forms less than 15 minutes old shall be recoverable.` |
| Fault tolerance | continued function despite partial failures | Which component failures should not stop the service? | failover behavior, retry policy, degraded mode | `If the email provider is unavailable, messages shall be queued and retried every 5 minutes for 1 hour.` |
| Safety | protection from harm to people, assets, environment, or adjacent systems | Could the system create harmful states? | interlocks, warnings, blocked actions | `The dispensing controller shall block commands that exceed the configured dosage limit.` |
| Security | confidentiality, integrity, authentication, authorization, auditability | Who must be prevented from doing what? | MFA, password rules, encryption, audit trail, timeout | `Administrative access shall require MFA and shall be logged with user ID, timestamp, and source IP.` |
| Correctness | completeness and defect-free behavior | What output must never be wrong or incomplete? | defect thresholds, inclusion/exclusion rules | `Search results for active invoices shall include all invoices with status Active and none with status Archived.` |

**Important distinctions**:

- `Resume operations within 30 seconds` → **Performance / Recovery Time**.
- `Restore the user's unfinished work after restart` → **Reliability / Recoverability**.
- `Encrypt data at rest` → usually **Reliability / Security**.

### 2.4 Performance

| Subcategory | Use when the requirement is about... | Ask yourself | Typical measures / evidence | Example |
|---|---|---|---|---|
| Throughput | work accomplished per time unit | How many transactions, jobs, or events per minute/hour? | txn/min, requests/sec, records/hour | `The ingestion pipeline shall process 50,000 sensor messages per minute.` |
| Response time | latency from request to result | How fast must the user or caller get a result? Under what load? | average, percentile, max latency | `The API shall return product search results within 1.5 seconds for 95% of requests under up to 2,000 concurrent users.` |
| Recovery time | time to resume service after failure | How fast must operations resume after an outage? | RTO, repair time, failover time | `A standby node shall restore service within 60 seconds after primary node failure.` |
| Startup / shutdown time | boot and stop duration | How quickly must the system become available or stop safely? | warm start time, shutdown completion time | `The web application shall become operational within 3 minutes after deployment restart.` |
| Capacity | maximum simultaneous load or volume at one moment | How many concurrent users, sessions, devices, or jobs must it hold? | concurrent users, open sessions, queue depth | `The system shall support 8,000 concurrent authenticated sessions.` |
| Resource utilization | consumption of memory, CPU, disk, bandwidth, or storage | Are there resource ceilings or retention limits? | max RAM, CPU %, disk growth | `During normal operation, each application pod shall use no more than 1.5 GB of RAM.` |

**Common confusion**:

- `Support 10,000 users next year` may be **Supportability / Scalability** if it
  is about growth over time rather than immediate concurrent capacity.
- `Database must be PostgreSQL 16` is an **Implementation Requirement**, not Performance.

### 2.5 Supportability

| Subcategory | Use when the requirement is about... | Ask yourself | Typical measures / evidence | Example |
|---|---|---|---|---|
| Testability | ability to test the system efficiently | Can automation or observation verify behavior? | test hooks, stable selectors, simulators | `All UI controls shall expose stable automation identifiers for regression testing.` |
| Adaptability | moving to a new runtime or environment with limited effort | How easily can the system be retargeted? | deployment effort, environment changes needed | `Deploying the service to a new Kubernetes cluster shall require environment-variable changes only.` |
| Maintainability | diagnosing and fixing issues | How quickly can operators identify and repair faults? | log detail, diagnostic access, MTTR support | `All server-side errors shall include a correlation ID and be queryable for 90 days.` |
| Compatibility | coexistence with prior versions or neighboring systems | What must remain backward compatible? | data compatibility, API version support | `Version 2 of the API shall accept payloads produced by Version 1 clients for at least 12 months.` |
| Configurability | changing behavior without code changes | What parameters must admins tune? | list of configurable items, update method | `Administrators shall be able to configure session timeout between 5 and 60 minutes without code deployment.` |
| Upgradeability | introducing new releases or features with low disruption | How hard is it to upgrade? | user workstation impact, downtime during upgrade | `Routine server upgrades shall not require client-side software installation.` |
| Installability | ease and repeatability of installation | How much work is needed for a first install? | install time, number of manual steps | `A fresh non-production installation shall be completable in under 45 minutes using documented steps.` |
| Scalability | growth over time in volume, users, geographies, or modules | What future growth must be absorbed? | growth factor, expansion timeframe | `The platform shall scale from 2,000 to 20,000 daily active users without architectural redesign.` |
| Portability | moving to different technology platforms | Could the system move to another OS, cloud, DB, or runtime? | code changes required, supported targets | `The service shall run on both Ubuntu LTS and Red Hat Enterprise Linux without code modification.` |
| Reusability | reusing components elsewhere | What product capabilities should be encapsulated for reuse? | package boundaries, reusable services | `Invoice calculation logic shall be exposed as a reusable service callable by both the web UI and partner API.` |
| Interoperability | cooperating with external systems to complete work | Which systems must exchange meaningful data or actions? | supported protocols, message schemas, sync success | `The system shall synchronize shipment status with the warehouse system via REST JSON.` |
| Compliance | conformance to formal standards or regulations | Which named standards or regulations apply? | explicit standard/version conformance | `Electronic signatures shall conform to eIDAS qualified-signature requirements.` |
| Replaceability | swapping components with bounded effort | Which subsystem may need future replacement? | max affected interfaces, migration effort | `The payment provider integration shall be isolated behind one adapter interface so that provider replacement changes no more than that adapter and its tests.` |
| Changeability | modifying behavior or rules safely | What business rules change often? | files or modules touched, lead time for change | `Tax rate rules shall be updateable through configuration data without recompiling the application.` |
| Analyzability | understanding system state and diagnosing behavior | Can engineers explain what happened and why? | observability, tracing, auditability | `Each asynchronous job shall emit lifecycle events with correlation IDs and terminal status.` |
| Localizability | language and locale support | Which locales must be supported, and how easily can new ones be added? | supported locales, translation mechanism | `The customer portal shall support English, French, and Spanish at launch, and new locales shall be addable through resource bundles only.` |

**Common confusions**:

- `Works with external system X` → **Interoperability** or **Interface**, not Compatibility unless the focus is version coexistence.
- `Must support German and Japanese` → **Localizability**, not Usability.

### 2.6 Design Constraints

Mandated architectural or design choices.

| Use when the requirement mandates... | Ask yourself | Example |
|---|---|---|
| architecture pattern, decomposition style, deployment topology, approved design pattern | Is the stakeholder explicitly constraining the design rather than just expressing a quality target? | `The platform shall use a multi-tenant architecture with tenant-level data isolation.` |

Do **not** classify a statement here if it merely describes a preferred solution
invented by the author rather than a real constraint.

### 2.7 Implementation Requirements

Technology or build constraints.

| Use when the requirement mandates... | Ask yourself | Example |
|---|---|---|
| programming language, framework, DB, browser support, operating system, third-party component, coding standard, resource limit tied to implementation | Is this telling the builders what they must build with or run on? | `The web application shall support Chrome 122+, Firefox ESR, Safari 17+, and Edge 122+.` |

### 2.8 Interface Requirements

| Subcategory | Use when the requirement is about... | Example |
|---|---|---|
| User interfaces | screens, forms, widgets, display devices, input methods | `The kiosk UI shall display text at a minimum of 4.5:1 contrast ratio.` |
| Hardware interfaces | sensors, printers, scanners, controllers, ports | `The terminal shall communicate with the barcode scanner over USB HID.` |
| Software interfaces | APIs, files, DB interfaces, partner systems | `The system shall expose a REST API for order status retrieval.` |
| Communications interfaces | protocols, message formats, network connectivity | `Outbound device telemetry shall use MQTT over TLS 1.3.` |

Use **Interface Requirements** when the contract itself matters. Use
**Interoperability** when the higher-level cooperation outcome matters.

### 2.9 Physical Requirements

Physical properties of hardware or deployed equipment.

| Use when the requirement is about... | Example |
|---|---|
| size, weight, shape, enclosure, power, environmental tolerance | `The handheld scanner shall weigh no more than 300 grams including battery.` |

For pure web or SaaS systems, state the section as not applicable rather than
leaving it out silently.

### 2.10 Documentation Requirements

Required knowledge artifacts delivered with the system.

| Use when the requirement is about... | Example |
|---|---|
| admin guide, user guide, training manual, release notes, operational runbook, online help artifact | `An Administrator Guide covering backup, restore, and user provisioning shall be delivered in searchable PDF and HTML formats.` |

### 2.11 Licensing & Legal

Legal, regulatory, licensing, privacy, consent, copyright, and record-retention
requirements.

| Use when the requirement is about... | Ask yourself | Example |
|---|---|---|
| law or license obligations that bind the product | What named law, policy, retention period, or license condition applies? | `The system shall record user consent history for 7 years and make it exportable on request.` |

---

## 3. Requirement attribute guidance

### 3.1 Importance

| Value | Use when... | Interpretation |
|---|---|---|
| Mandatory | product acceptance, legal compliance, operational viability, or launch depends on it | missing it means the system is unacceptable or unusable |
| Desirable | materially improves business value or user effectiveness | missing it hurts value but the system still functions |
| Nice to have | beneficial but low impact | missing it does not threaten acceptance |

### 3.2 Satisfaction shape

| Value | Use when... | Example |
|---|---|---|
| Sharp | there is a hard cliff; near-miss still fails | `Emergency stop shall activate within 50 ms.` |
| Medium | small misses are tolerable; large misses are not | `The system shall support 5,000 concurrent users.` |
| Linear | better is continuously better | `Reports should render in 20 seconds or less.` |

**Independence rule**: Importance and satisfaction shape are independent.

- Mandatory + Medium is common.
- Desirable + Sharp is possible.
- Nice to have + Linear is common.

### 3.3 Optional attributes worth using in evaluations

| Attribute | Useful values | Why it helps |
|---|---|---|
| Status | Proposed / Approved / Implemented / Validated | shows lifecycle maturity |
| Difficulty | Low / Medium / High | helps planning and negotiation |
| Stability | Low / Medium / High | signals likely churn |
| Risk | Low / Medium / High | highlights impact if unmet |

---

## 4. Requirement writing and rewrite patterns

### 4.1 Canonical patterns

| Need type | Pattern |
|---|---|
| Response time | `The system shall [return/display/complete] [result] within [time] for [percentile or average] of requests under [load condition].` |
| Availability | `The [service] shall be available [percentage] of [measurement window], excluding [maintenance rule].` |
| Capacity | `The system shall support [N] concurrent [users/sessions/devices/jobs].` |
| Throughput | `The system shall process [N] [transactions/messages/jobs] per [time unit].` |
| Recoverability | `After [failure event], the system shall restore [state/data] within [condition or loss limit].` |
| Security | `The system shall require [control] for [actor/resource] and shall record [audit data].` |
| Compatibility | `Version [X] shall accept/work with [prior version/system] for [time window or scope].` |
| Compliance | `The system shall conform to [named standard/regulation/version] for [scope].` |
| Localizability | `The application shall support [locales] and shall externalize translatable content in [mechanism].` |
| Documentation | `The supplier shall provide [document] covering [topics] in [format].` |

### 4.2 Rewrite bad statements into good ones

| Weak wording | Why it fails | Better pattern |
|---|---|---|
| `The system shall be fast.` | no metric, no condition | `The system shall return search results within 2 seconds for 95% of requests under up to 1,000 concurrent users.` |
| `The system shall be user-friendly.` | subjective | `A first-time claims processor shall complete claim creation after no more than 2 hours of training.` |
| `The system shall support modern browsers.` | no named targets or versions | `The system shall support the latest two stable releases of Chrome, Edge, Firefox, and Safari.` |
| `The system shall be secure.` | too broad | split into authentication, authorization, encryption, audit, retention requirements |
| `Use Kafka.` | solution without reason | either write a real Design/Implementation constraint or restate the required messaging outcome |
| `The system shall process orders quickly and accurately.` | compound | split into separate performance and correctness requirements |

### 4.3 Conditions you often need but authors forget

Add conditions for:

- concurrent users or message volume
- data size or payload size
- environment: production, staging, mobile, kiosk, offline
- actor role or user segment
- service window or maintenance window
- failure trigger or degraded mode
- locale, geography, or regulatory jurisdiction

---

## 5. Feature-to-requirement transformation rules

### 5.1 Direct transfer

If the source statement is already precise, testable, and correctly scoped,
carry it over with a `SUPL-###` ID and attributes.

### 5.2 Split generic statements

If one feature bundles several concerns, split it.

Example:

- Source: `The system must be reliable.`
- Derived:
  - `The production service shall be available 99.95% of each calendar month.`
  - `A standby node shall restore service within 60 seconds after primary node failure.`
  - `All failed payment attempts shall be logged with correlation IDs.`

### 5.3 Add versions and named targets

Transform vague compatibility wording into versioned scope.

- Weak: `Support Chrome and Firefox.`
- Better: `Support the latest two stable releases of Chrome and Firefox.`

### 5.4 Remove empty conditions once the decision is made

- Weak: `If the system requires a database, it shall use PostgreSQL.`
- Better: `The system shall use PostgreSQL 16.`

### 5.5 Escalate to a use case when needed

Escalate if the requirement needs:

- a multi-step interaction flow
- alternate paths or business-rule branching
- actor goals and triggers
- detailed inputs, outputs, and UI flow

### 5.6 Reject project-process requirements

Exclude statements like:

- `The project shall be delivered in 4 months.`
- `The team shall use Scrum.`
- `Three developers shall be assigned full-time.`

These belong in contract, SOW, or project planning artifacts.

---

## 6. Completeness and elicitation checklist

Walk every row. Mark each as **Present**, **N/A with reason**, or **Missing**.

| Category | Subcategory | Elicitation prompts |
|---|---|---|
| Functionality | Generic functions | What cross-cutting functions exist everywhere: search, export, help, notifications, print? |
| Usability | Accessibility | Any accessibility standard, assistive tech, keyboard-only, contrast, captions? |
| Usability | Aesthetics | Any style-guide, layout, branding, alignment, spacing rules? |
| Usability | UI consistency | Must the UI follow an existing design system or standard pattern? |
| Usability | Ergonomics | Any limits on clicks, tab order, defaults, focus, repetitive entry? |
| Usability | Ease of use | Training time, task time, onboarding expectations? |
| Reliability | Availability | Required uptime, planned downtime, maintenance windows? |
| Reliability | Robustness | Invalid input, resource exhaustion, bad file uploads, network interruptions? |
| Reliability | Accuracy | Precision, rounding, reconciliation, completeness rules? |
| Reliability | Recoverability | What user work or state must survive restart/failure? |
| Reliability | Fault tolerance | Which partial failures must not take down the service? |
| Reliability | Safety | Could misuse or malfunction harm people, devices, or data? |
| Reliability | Security | AuthN, AuthZ, MFA, encryption, session timeout, audit logs, secrets handling? |
| Reliability | Correctness | What results must never be missing, duplicated, or invalid? |
| Performance | Throughput | Transactions/messages/jobs per time unit? |
| Performance | Response time | Latency targets under what load and percentile? |
| Performance | Recovery time | RTO, repair time, failover time? |
| Performance | Startup / shutdown time | How fast must the system start or stop safely? |
| Performance | Capacity | Max concurrent users, sessions, devices, records-in-memory? |
| Performance | Resource utilization | CPU, RAM, disk, bandwidth, storage growth limits? |
| Supportability | Testability | Stable test hooks, mock interfaces, automation support? |
| Supportability | Adaptability | New region, cluster, or hosting environment effort? |
| Supportability | Maintainability | Logging, diagnostics, observability, remote support needs? |
| Supportability | Compatibility | Backward compatibility with prior versions or data? |
| Supportability | Configurability | What must admins change without code? |
| Supportability | Upgradeability | Upgrade path, downtime, workstation impact? |
| Supportability | Installability | Initial setup effort and automation? |
| Supportability | Scalability | Growth over months/years without redesign? |
| Supportability | Portability | Need to move across clouds, OSs, DBs, or runtimes? |
| Supportability | Reusability | Any component intended for reuse elsewhere? |
| Supportability | Interoperability | Which external systems must cooperate semantically? |
| Supportability | Compliance | Any named standards, frameworks, or policies? |
| Supportability | Replaceability | Any vendor or subsystem expected to be swappable later? |
| Supportability | Changeability | Any rules expected to change frequently? |
| Supportability | Analyzability | Need tracing, event histories, explainability, diagnostics? |
| Supportability | Localizability | Which locales now and later? |
| Plus | Design Constraints | Any mandated architecture or design pattern? |
| Plus | Implementation Requirements | Any platform, language, browser, DB, or framework mandates? |
| Plus | Interface Requirements | Any required UI, hardware, API, or protocol contracts? |
| Plus | Physical Requirements | Any hardware size, enclosure, power, weight, environment constraints? |
| Plus | Documentation Requirements | Any manuals, training, or help deliverables? |
| Plus | Licensing & Legal | Any law, regulation, privacy, retention, or licensing obligation? |

---

## 7. Evaluation checklist

### 7.1 Requirement-level checklist

For each requirement ask:

1. Is the **allocation** correct?
2. Is the **category/subcategory** correct?
3. Is the statement **atomic**?
4. Is it **measurable**?
5. Are **conditions and thresholds** explicit?
6. Is a **verification method** obvious?
7. Does it have **importance** and **satisfaction shape**?
8. Is it **traceable** to a feature, concern, or regulation?
9. Is it free of **duplicates** and **equivalent restatements**?
10. Does it avoid sneaking in an unjustified implementation decision?

### 7.2 Document-level checklist

Check for:

- missing categories with no rationale
- inconsistent terminology across sections
- contradictory thresholds
- overlapping requirements that can drift apart
- untraced sources or orphan requirements
- no distinction between product requirements and project-process items

### 7.3 Severity guide

| Severity | Use when... |
|---|---|
| Critical | the requirement is untestable in a safety/security/legal/availability area, badly misallocated, or the document cannot function as a real specification |
| Major | the requirement is fixable but materially weak: missing threshold, wrong category, missing conditions, or important category omitted |
| Minor | wording, formatting, attribute gaps, or low-risk clarity issues |

---

## 8. Common anti-patterns and repairs

| Anti-pattern | Why it is harmful | Repair move |
|---|---|---|
| Vague adjective (`fast`, `secure`, `easy`) | creates false agreement; not testable | rewrite with metric, condition, and threshold |
| Equivalent duplicates | two numbers describe the same obligation in different words | keep one authoritative form |
| Compound requirement | cannot be independently verified or prioritized | split into separate IDs |
| Hidden local use-case requirement | weakens use-case traceability | move it to the relevant Use Case Specification |
| Unmotivated category omission | impossible to tell whether omitted or forgotten | mark as `N/A because ...` or add requirement |
| Design solution posing as need | limits solution space without stakeholder intent | move to constraint section or restate as need |
| Missing conditions | number is meaningless without operating context | add load, actor, environment, or failure condition |
| Unnamed standard or version | testers cannot determine scope | cite exact standard, regulation, protocol, or version |
| Outdated compatibility example copied blindly | produces stale, low-value requirements | use current project-specific targets |
| Process requirement mixed into product spec | confuses governance and acceptance criteria | move to project artifacts |

---

## 9. Mini examples

### 9.1 DESIGN example

Source concern:

- `Customers complain that order lookup is slow during peak periods.`

Derived requirement:

| ID | Category | Subcategory | Requirement | Importance | Satisfaction Shape | Verification | Source |
|---|---|---|---|---|---|---|---|
| SUPL-014 | Performance | Response time | `The system shall return order search results within 2 seconds for 95% of requests under up to 1,500 concurrent users.` | Mandatory | Medium | Test | STKH-OPS-03 |

Why this is good:

- category is correct
- threshold and operating load are explicit
- test method is obvious
- traceability is preserved

### 9.2 EVALUATE example

Weak requirement:

- `The system shall be secure and highly available.`

Evaluation:

- **Severity**: Critical
- **Problems**: vague adjectives; compound requirement; no threshold; no scope
- **Repair**:
  - `Administrative access shall require MFA and shall be logged with user ID, timestamp, and source IP.`
  - `The production service shall be available 99.95% of each calendar month excluding approved maintenance windows.`

---

## 10. Full end-to-end DESIGN walkthrough

This section shows a complete DESIGN-mode workflow from raw input to finished
requirements table. Use it as a calibration reference.

### 10.1 Scenario

**Product**: MediTrack — a cloud-based patient appointment scheduling system for
mid-size clinics.

**Raw inputs from stakeholders**:

1. `The system must be fast.`
2. `We need to comply with HIPAA.`
3. `The system should work on Chrome and Safari.`
4. `Doctors should be able to see their schedule for the day on the dashboard.`
5. `The system must handle 500 users at the same time during morning rush.`
6. `We want the system to be easy to use.`
7. `The project must be delivered using Agile methodology.`

### 10.2 Step 1 — Triage

| # | Raw input | Triage decision | Reason |
|---|---|---|---|
| 1 | `The system must be fast.` | **Supplementary — rewrite needed** | System-wide quality; vague, needs metric |
| 2 | `We need to comply with HIPAA.` | **Supplementary — rewrite needed** | Cross-cutting legal obligation; needs specific scope |
| 3 | `The system should work on Chrome and Safari.` | **Supplementary — rewrite needed** | Cross-cutting implementation constraint; needs versions |
| 4 | `Doctors should be able to see their schedule for the day on the dashboard.` | **Escalate to use case** | This is a specific actor goal with a UI flow — belongs in a Use Case Specification |
| 5 | `The system must handle 500 users at the same time during morning rush.` | **Supplementary — minor rewrite** | System-wide capacity; already has a number but needs precision |
| 6 | `We want the system to be easy to use.` | **Supplementary — rewrite needed** | Cross-cutting usability; vague, needs measurable criteria |
| 7 | `The project must be delivered using Agile methodology.` | **Reject — project process** | This is a project-management constraint, not a product requirement |

Accepted: items 1, 2, 3, 5, 6. Escalated: item 4. Rejected: item 7.

### 10.3 Step 2 — Classify and rewrite

| ID | Source | FURPS+ Category | Subcategory | Rewritten Requirement | Importance | Sat. Shape | Verification | Trace |
|---|---|---|---|---|---|---|---|---|
| SUPL-001 | #1 | Performance | Response time | The system shall display appointment search results within 2 seconds for 95% of requests under up to 500 concurrent users. | Mandatory | Medium | Test | STKH-CLINIC-01 |
| SUPL-002 | #2 | Licensing & Legal | — | The system shall comply with HIPAA Privacy Rule (45 CFR Part 164) for all patient data at rest and in transit, and shall maintain audit logs of all access to protected health information for 6 years. | Mandatory | Sharp | Inspection | REG-HIPAA |
| SUPL-003 | #2 | Reliability | Security | The system shall encrypt all patient data at rest using AES-256 and in transit using TLS 1.2 or higher. | Mandatory | Sharp | Inspection | REG-HIPAA |
| SUPL-004 | #3 | Implementation Requirements | — | The web application shall support the latest two stable releases of Chrome and Safari on desktop and mobile. | Mandatory | Medium | Test | STKH-IT-02 |
| SUPL-005 | #5 | Performance | Capacity | The system shall support 500 concurrent authenticated sessions during peak morning hours (07:00–10:00 local clinic time). | Mandatory | Medium | Test | STKH-CLINIC-03 |
| SUPL-006 | #6 | Usability | Ease of use | A newly hired receptionist shall be able to book, reschedule, and cancel a patient appointment after no more than 1 hour of guided training. | Desirable | Linear | Demonstration | STKH-CLINIC-04 |

**Key decisions explained**:

- **#2 was split** into two requirements: one legal (SUPL-002) and one security
  (SUPL-003). HIPAA compliance is a legal obligation; encryption is a security
  mechanism derived from it. They have different verification methods and
  different stakeholders care about them independently.
- **#4 was escalated** because "see their schedule on the dashboard" implies a
  specific actor (Doctor), a specific screen, and likely alternate flows
  (e.g., filter by date, view patient details). That is a use case, not a
  one-line supplementary requirement.
- **#7 was rejected** because "use Agile" is a project-process constraint. It
  tells the team how to work, not what the product must do.

### 10.4 Step 3 — Completeness sweep (excerpt)

After writing the accepted requirements, walk every FURPS+ category:

| Category | Subcategory | Status | Comment |
|---|---|---|---|
| Functionality | Generic functions | **Missing** | No cross-cutting search, notification, or help requirements elicited yet. Follow up with stakeholders. |
| Usability | Accessibility | **Missing** | Clinic systems often need accessibility. Ask about WCAG compliance. |
| Usability | Ease of use | Present | SUPL-006 |
| Reliability | Availability | **Missing** | Healthcare system likely needs uptime commitment. Ask. |
| Reliability | Security | Present | SUPL-003 |
| Performance | Response time | Present | SUPL-001 |
| Performance | Capacity | Present | SUPL-005 |
| Supportability | Maintainability | **Missing** | Need logging and diagnostic requirements for a healthcare system. |
| Implementation Requirements | — | Present | SUPL-004 |
| Physical Requirements | — | N/A | Cloud-based SaaS; no hardware constraints. |
| Documentation Requirements | — | **Missing** | Ask whether admin guide or training materials are required deliverables. |
| Licensing & Legal | — | Present | SUPL-002 |

The sweep exposed 5 missing areas. In a real engagement, these become follow-up
questions to stakeholders before finalizing the document.

### 10.5 Lessons from this walkthrough

1. **Most raw inputs need rewriting.** Only 0 of 7 were usable as-is.
2. **Splitting is common.** One vague statement ("comply with HIPAA") can yield
   2+ well-classified requirements.
3. **Triage eliminates noise early.** Rejecting the Agile requirement and
   escalating the dashboard feature kept the Supplementary Specification focused.
4. **The completeness sweep catches gaps.** Without it, Availability,
   Accessibility, and Documentation would have been silently missing.
5. **Traceability matters even in early drafts.** Every SUPL ID traces back to a
   source, making it auditable from day one.

---

## 11. Final reminder

The goal is not to produce a long document. The goal is to produce a
**complete, measurable, correctly classified, and reviewable** document.

Every section should earn its place by helping another engineer, tester,
auditor, or stakeholder decide whether the product is acceptable.
