# RMP Output Template

Use this exact Markdown structure when generating a Requirements Management Plan. Replace all `[bracketed]` placeholders with project-specific content. Remove any sections that are explicitly not applicable and note the reason.

---

```markdown
# Requirements Management Plan

## 1. Introduction

### 1.1 Purpose

This document describes the guidelines used by the [Project Name] project to establish the requirement documents, requirement types, and requirement attributes. It also describes traceability between various requirement types that will be maintained during the project lifecycle.

The objective of requirements traceability is to reduce the number of defects found late in the development cycle. Ensuring that all product requirements are captured in the software requirements, design, and test cases improves the product's quality.

### 1.2 Scope

This plan pertains to all phases of the [Project Name] project.

[If the scope is limited to specific subsystems or phases, state that here.]

### 1.3 Overview

- Section 2 describes tools and infrastructure used for requirements management.
- Section 3.1 describes the project documents and their purposes.
- Section 3.2 describes the requirement types used as traceability items.
- Section 3.3 describes the traceability structure between requirement types.
- Section 3.4 describes the attributes for each requirement type.
- Section 3.5 describes the reports and views used to monitor requirements.

---

## 2. Tools, Environment, and Infrastructure

[Describe the tools, platforms, and infrastructure used to manage requirements. Examples:]

- **Requirements Management Tool**: [Tool name, or "Plain Markdown documents and spreadsheets" if no dedicated tool]
- **Document Storage**: [Where documents are stored — e.g., Git repository, shared drive, wiki]
- **Change Management**: [How change requests are submitted and tracked — e.g., issue tracker, dedicated tool, central coordinator]
- **Access**: [How team members without tool access will interact with requirements — e.g., exported Markdown documents, read-only views]

---

## 3. Documents and Requirement Types

### 3.1 Documents

The following documents will be created in the project:

| Document Type | Abbreviation | Description | Default Requirement Type |
|--------------|-------------|-------------|------------------------|
| [Document name] | [Abbr] | [What this document contains and its purpose] | [Requirement type abbreviation] |
| Stakeholder Requests | STR | Key requests from stakeholders. | STRQ |
| Vision | VIS | Overall system description and specific feature requirements. | FEAT |
| Use Case Specification | UCS | Use case description (one per use case). | UC |
| Supplementary Specification | SS | Nonfunctional specifications. | SUPL |
| Glossary | GLS | Common vocabulary for the project. | TERM |
| Requirements Management Plan | RMP | This document. | (none) |

[Add or remove rows based on the project's needs. Note any decisions about where STRQ are stored — in dedicated STR documents, in the Vision, or in the tool only.]

### 3.2 Requirement Types

The following requirement types are used in the project:

| Requirement Type | Abbreviation | Artifact (Document Type) | Description |
|-----------------|-------------|------------------------|-------------|
| Stakeholder Request | STRQ | Stakeholder Requests (STR) | Key stakeholder and user needs. High-level requirements from the problem domain. |
| Feature | FEAT | Vision (VIS) | The system's conditions and capabilities from the solution domain. |
| Use Case | UC | Use Case Specification (UCS) | Functional requirements captured as actor-system interactions. |
| Supplementary Requirement | SUPL | Supplementary Specification (SS) | Nonfunctional requirements not captured in the use case model. |
| [Additional types as needed] | [Abbr] | [Document] | [Description] |

### 3.3 Traceability

The following traceability structure is used in the project:

```
STRQ ──→ FEAT ──→ UC
  │         │
  │         └──→ SUPL
  └──→ SUPL
```

[Modify the diagram if the project uses additional types like SCEN or TC.]

**Traceability rules:**

- **STRQ → FEAT**: Stakeholder Requests trace to Features defined in the Vision document. There may be a many-to-many relationship, but typically one STRQ traces to many FEAT. **Every approved STRQ must trace to at least one FEAT or SUPL.**
- **STRQ → SUPL**: Stakeholder Requests may also trace directly to Supplementary Requirements.
- **FEAT → UC**: Features trace to Use Cases. There may be many-to-many relationships. **Every approved FEAT must trace to at least one UC or SUPL.**
- **FEAT → SUPL**: Features trace to Supplementary Requirements.
- **UC → FEAT**: Use Cases trace back to the Features they realize.
- **SUPL → FEAT**: Supplementary Requirements trace back to the Features they support.

### 3.4 Requirements Attributes

#### 3.4.1 Attributes for FEAT (Features)

**Status** — Tracks the lifecycle progression of the requirement:

| Value | Description |
|-------|-------------|
| Proposed | Feature is under discussion, not yet reviewed and accepted. |
| Approved | Feature is approved for further design and implementation. |
| Realized | Feature is incorporated into the design. Design artifacts reflect this feature. |
| Incorporated | Feature is incorporated into the product (implemented). |
| Validated | Feature is tested and verified to work correctly. |

**Priority** — Determines resource allocation for development:

| Value | Description |
|-------|-------------|
| High | [Define what High means for this project — e.g., "Must be implemented in the first Construction iteration."] |
| Medium | [e.g., "Must be implemented by the end of Construction."] |
| Low | [e.g., "May be implemented if time permits. May be rescheduled to a subsequent release."] |

**Benefit** — Importance of the requirement to end users and customers:

| Value | Description |
|-------|-------------|
| Critical | Essential feature. Failure to implement means the system will not meet customer needs. Must be in the release or schedule slips. |
| Important | Important for the system's effectiveness and efficiency. Cannot easily be provided another way. |
| Useful | Used less frequently or workarounds exist. No significant impact if excluded from a release. |

**Effort** — Estimated work in person-days. Set by the development team.

**Risk** — Probability that implementation will cause undesirable events:

| Value | Description |
|-------|-------------|
| High | High impact combined with high probability of occurring. |
| Medium | Less severe impact, smaller probability. |
| Low | Minimal impact, low probability. |

**Stability** — Probability that the requirement will change:

| Value | Description |
|-------|-------------|
| High | Low probability of change. |
| Medium | Moderate probability of change. |
| Low | High probability of change — needs additional elicitation. |

**Target Release** — The iteration or release in which the feature will be incorporated.

**Assigned To** — Person responsible for elicitation, specification, and implementation.

**Reason** — Text field tracking the source or justification of the requirement.

#### 3.4.2 Attributes for STRQ (Stakeholder Requests)

Same as FEAT, except no Target Release and no Assigned To:

- Status (Proposed / Approved / Realized / Incorporated / Validated)
- Priority (High / Medium / Low)
- Benefit (Critical / Important / Useful)
- Effort (Person-days)
- Risk (High / Medium / Low)
- Stability (High / Medium / Low)
- Reason (Free text)

#### 3.4.3 Attributes for UC (Use Cases)

Same as FEAT, plus the Actor attribute:

- Status (Proposed / Approved / Realized / Incorporated / Validated)
- Priority (High / Medium / Low)
- Benefit (Critical / Important / Useful)
- Effort (Person-days)
- Risk (High / Medium / Low)
- Stability (High / Medium / Low)
- Target Release (Iteration name or number)
- Reason (Free text)
- **Actor** — Describes which actor initiates this use case.

#### 3.4.4 Attributes for SUPL (Supplementary Requirements)

Same as FEAT:

- Status (Proposed / Approved / Realized / Incorporated / Validated)
- Priority (High / Medium / Low)
- Benefit (Critical / Important / Useful)
- Effort (Person-days)
- Risk (High / Medium / Low)
- Stability (High / Medium / Low)
- Target Release (Iteration name or number)
- Reason (Free text)

[Add additional attribute sections for any other requirement types used in the project, such as SCEN or TC.]

### 3.5 Reports and Measures

The following reports will be generated to monitor requirements coverage:

**Attribute Matrices** (all requirements of a specific type with their attributes):

- All Stakeholder Requests (STRQ)
- All Features (FEAT)
- All Supplementary Requirements (SUPL)
- All Use Cases (UC)

**Traceability Matrices** (which requirements trace to which):

- STRQ to FEAT
- FEAT to UC
- FEAT to SUPL

**Gap Reports** (requirements without proper traceability):

- All STRQ not traced to FEAT
- All FEAT not traced to UC or SUPL
- All FEAT not traced from STRQ
- All UC not traced from FEAT
- All SUPL not traced from FEAT

**Traceability Trees** (hierarchical views):

- Traceability Tree traced from STRQ
- Traceability Tree traced to UC
- Traceability Tree traced to SUPL
```
