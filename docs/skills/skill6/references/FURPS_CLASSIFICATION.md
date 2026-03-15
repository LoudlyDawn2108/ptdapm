# FURPS+ Classification — Expert Reference

This reference covers **only** the non-obvious classification decisions. For basic definitions (what "availability" or "security" means), use your general knowledge. This file exists to resolve ambiguity and prevent misclassification.

---

## Quick Taxonomy (Activation Memory)

| Category | Subcategories |
|---|---|
| **Functionality** | Generic cross-cutting functions (help, printing, reports) |
| **Usability** | Accessibility, Aesthetics, UI consistency, Ergonomics, Ease of use |
| **Reliability** | Availability, Robustness, Accuracy, Recoverability, Fault tolerance, Safety, Security, Correctness |
| **Performance** | Throughput, Response time, Recovery time, Startup/shutdown time, Capacity, Utilization of resources |
| **Supportability** | Testability, Adaptability, Maintainability, Compatibility, Configurability, Upgradeability, Installability, Scalability, Portability, Reusability, Interoperability, Compliance, Replaceability, Changeability, Analyzability, Auditability, Localizability |
| **Design constraints** | Architecture-level mandates |
| **Implementation** | Languages, OS, databases, components, resource limits, coding standards |
| **Interface** | User, hardware, software, communications interfaces |
| **Physical** | Device shape/size/weight (N/A for web apps) |
| **Documentation** | Printed, digital, online help |
| **Licensing/Legal** | Regulatory, copyright, privacy, compliance |

---

## Ambiguous Classification — Decision Trees

These are the cases where experienced analysts disagree. Use these trees to resolve:

### Tree 1: Recovery — Reliability or Performance?

```
"The system shall recover from failure..."
  ├─ Focuses on ELEGANCE of recovery (no data loss, no side effects)?
  │   └─ → Reliability / Recoverability
  ├─ Focuses on TIME of recovery (30 seconds, 1 hour)?
  │   └─ → Performance / Recovery Time
  └─ Covers BOTH elegance AND time?
      └─ → Acceptable to combine in either. Pick one and be consistent.
```

**Example of the trap**: "System shall recover within 30 seconds without data loss" — this is TWO requirements. Split: "No committed transaction data shall be lost during recovery" (Reliability/Recoverability) + "Redundant system shall resume within 30 seconds" (Performance/Recovery Time).

### Tree 2: Error Logging — Supportability or Usability?

```
"Error/transaction logs shall be available to the administrator..."
  ├─ Primary purpose: help DEVELOPERS find and fix bugs?
  │   └─ → Supportability / Maintainability
  ├─ Primary purpose: help ADMIN monitor system health?
  │   └─ → Supportability / Maintainability (admin is maintaining)
  └─ Primary purpose: help BUSINESS USERS audit operations?
      └─ → Supportability / Auditability
```

**Expert note**: Even though "admin screens" feel like Usability, log access is fundamentally about maintaining/auditing the system. Usability is for END-USER interactions.

### Tree 3: Resource Limits — Performance or Implementation?

```
"The system shall use no more than X memory / disk / storage..."
  ├─ Constraint comes from HARDWARE the system runs on?
  │   └─ → Implementation Requirements
  ├─ Constraint comes from SCALABILITY needs?
  │   └─ → Performance / Utilization of Resources
  └─ Constraint comes from COST decisions?
      └─ → Implementation Requirements (cost = implementation decision)
```

### Tree 4: Standards Compliance — Supportability or Implementation?

```
"The system shall comply with [Standard X]..."
  ├─ Industry/regulatory standard (GDPR, HIPAA, PCI-DSS)?
  │   └─ → Licensing and Legal Requirements
  ├─ Technical standard (REST API, OAuth 2.0, WCAG)?
  │   └─ → Supportability / Compliance
  ├─ Coding standard (naming conventions, style guide)?
  │   └─ → Implementation Requirements
  └─ UI standard (IBM CUA, Material Design)?
      └─ → Usability / UI Consistency
```

### Tree 5: Requirement Scope — Supplementary or Use Case?

```
Does this requirement apply to ONE use case or MANY?
  ├─ ONE specific use case (e.g., "flight search shall return in 10s")
  │   └─ → Use Case Specification (Special Requirements section)
  │       NOTE: This takes PRECEDENCE over generic Supplementary Spec
  ├─ MANY use cases or SYSTEM-WIDE (e.g., "average response < 2s")
  │   └─ → Supplementary Specification
  └─ UNCLEAR
      ├─ Can you name the specific use case it applies to?
      │   ├─ Yes → Use Case Specification
      │   └─ No → Supplementary Specification
      └─ Will this be tested once (system-wide) or per-use-case?
          ├─ Once → Supplementary Specification
          └─ Per-use-case → Use Case Specification
```

---

## Category Placement Rules (Overlaps)

When a requirement could fit in multiple categories:

1. **Documentation + Functionality**: Online help can go in either. **Pick one location and be consistent for the entire document.** Don't split help requirements across both sections.
2. **Implementation + Design Constraints**: Implementation constraints can be described in Design Constraints if you don't have a separate Implementation section. But if BOTH sections exist, use this test: "Does it constrain WHAT we build (architecture = Design) or HOW we build it (tools/languages = Implementation)?"
3. **Licensing + Legal**: Always combine into one section. Splitting creates confusion.
4. **Configurability + Upgradeability**: Both sometimes called "flexibility." If the change requires a new release → Upgradeability. If the change can be done without a release → Configurability.
5. **Installability + Upgradeability**: New installation → Installability. Updating existing installation → Upgradeability.

---

## The "Promote to Use Case" Decision

```
Is this requirement too complex for 1-3 simple "shall" statements?
  ├─ Does it need to describe:
  │   ├─ WHERE in the UI the feature is accessed?
  │   ├─ WHAT search/filter attributes are available?
  │   ├─ HOW the user interacts with multiple steps?
  │   └─ WHAT happens on error conditions?
  │
  ├─ If YES to 2+ of the above → Create a separate Use Case
  └─ If NO or only 1 → Keep as supplementary requirement
```

**Classic example**: "Reports shall be available to the administrator" sounds simple, but reports need: access point, search parameters, output format, sorting, pagination → This is a use case, not a supplementary requirement.

---

## Critical Rule

> A category should be excluded ONLY as a planned decision by the customer and analyst, NOT because its importance was not analyzed. Every category should be explicitly discussed — even if the answer is "Not applicable to this project."
