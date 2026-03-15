# Supplementary Specification — Output Template

Use this exact structure when drafting a Supplementary Specification. Remove sections that are not applicable, but document the exclusion reason.

---

```markdown
# Supplementary Specification: [Project Name]

**Version:** [X.Y]
**Date:** [YYYY-MM-DD]
**Author:** [Name]
**Status:** [Draft | Under Review | Approved]

---

## 1. Introduction

### 1.1 Purpose
[Describe the purpose of this document and what it covers.]

### 1.2 Scope
[Describe the scope of the system and which requirements are included here vs. in Use Case Specifications.]

### 1.3 Definitions, Acronyms, and Abbreviations
[List key terms. Include FURPS+ definition.]

### 1.4 References
[List referenced documents: Vision Document, Use Case Specifications, standards, regulations.]

### 1.5 Overview
[Brief overview of the document structure.]

---

## 2. Functionality

[Generic functional requirements not tied to any specific use case.]

### SUPL[ID]: [Requirement Title]
**Requirement:** [The system shall...]
**Importance:** [Mandatory | Desirable | Nice to have]

| Attribute | Value |
|---|---|
| Priority | [High / Medium / Low] |
| Status | [Proposed / Approved / Incorporated / Validated] |
| Difficulty | [High / Medium / Low] |
| Stability | [High / Medium / Low] |
| Risk | [High / Medium / Low] |
| Origin | [Feature ID(s) or "Analyst identification"] |

[Repeat for each functional requirement.]

---

## 3. Usability

### 3.1 Accessibility

### SUPL[ID]: [Requirement Title]
**Requirement:** [The system shall...]
**Importance:** [Mandatory | Desirable | Nice to have]

| Attribute | Value |
|---|---|
| Priority | [High / Medium / Low] |
| Status | [Proposed / Approved / Incorporated / Validated] |
| Difficulty | [High / Medium / Low] |
| Stability | [High / Medium / Low] |
| Risk | [High / Medium / Low] |
| Origin | [Feature ID(s)] |

### 3.2 Aesthetics
[Requirements about look and feel.]

### 3.3 UI Consistency
[Requirements about interface consistency.]

### 3.4 Ergonomics
[Requirements about reducing unnecessary interaction friction.]

### 3.5 Ease of Use
[Requirements about learning curve and usage efficiency.]

---

## 4. Reliability

### 4.1 Availability

### SUPL[ID]: [Requirement Title]
**Requirement:** [The system shall...]
**Importance:** [Mandatory | Desirable | Nice to have]
**Satisfaction Shape:** [Sharp | Medium | Linear]

| Attribute | Value |
|---|---|
| Priority | [High / Medium / Low] |
| Status | [Proposed / Approved / Incorporated / Validated] |
| Difficulty | [High / Medium / Low] |
| Stability | [High / Medium / Low] |
| Risk | [High / Medium / Low] |
| Origin | [Feature ID(s)] |

### 4.2 Robustness
### 4.3 Accuracy
### 4.4 Recoverability
### 4.5 Fault Tolerance
### 4.6 Safety
### 4.7 Security
### 4.8 Correctness

---

## 5. Performance

### 5.1 Throughput

### SUPL[ID]: [Requirement Title]
**Requirement:** [The system shall...]
**Importance:** [Mandatory | Desirable | Nice to have]
**Satisfaction Shape:** [Sharp | Medium | Linear]

| Attribute | Value |
|---|---|
| Priority | [High / Medium / Low] |
| Status | [Proposed / Approved / Incorporated / Validated] |
| Difficulty | [High / Medium / Low] |
| Stability | [High / Medium / Low] |
| Risk | [High / Medium / Low] |
| Origin | [Feature ID(s)] |

### 5.2 Response Time
### 5.3 Recovery Time
### 5.4 Startup/Shutdown Time
### 5.5 Capacity
### 5.6 Utilization of Resources

#### Performance Scaling Table (if applicable)

| Number of Simultaneous Users | Maximum Transaction Time (seconds) |
|---|---|
| 1 to [N1] | [T1] |
| [N1+1] to [N2] | [T2] |
| [N2+1] to [N3] | [T3] |
| More than [N3] | [T4] |

---

## 6. Supportability

### 6.1 Testability
### 6.2 Adaptability
### 6.3 Maintainability
### 6.4 Compatibility
### 6.5 Configurability
### 6.6 Upgradeability
### 6.7 Installability
### 6.8 Scalability
### 6.9 Portability
### 6.10 Reusability
### 6.11 Interoperability
### 6.12 Compliance
### 6.13 Replaceability
### 6.14 Changeability
### 6.15 Analyzability
### 6.16 Localizability

[Use the same requirement format as above for each requirement.]

---

## 7. Design Constraints

### SUPL[ID]: [Requirement Title]
**Requirement:** [The system shall...]

| Attribute | Value |
|---|---|
| Priority | [High / Medium / Low] |
| Status | [Proposed / Approved / Incorporated / Validated] |
| Difficulty | [High / Medium / Low] |
| Stability | [High / Medium / Low] |
| Risk | [High / Medium / Low] |
| Origin | [Feature ID(s)] |
| Importance | [Mandatory / Desirable / Nice to have] |

---

## 8. Implementation Requirements
[Languages, OS versions, databases, third-party components, resource limits, coding standards.]

---

## 9. Interface Requirements
### 9.1 User Interfaces
### 9.2 Hardware Interfaces
### 9.3 Software Interfaces
### 9.4 Communications Interfaces

---

## 10. Physical Requirements
[Hardware deployment constraints. State "Not applicable" for web-based applications.]

---

## 11. Documentation Requirements
[Printed docs, digital docs, online help.]

---

## 12. Licensing and Legal Requirements
[Legal, regulatory, licensing, copyright, privacy requirements.]

---

## Appendix A: Traceability Matrix

| Feature ID | Feature Description | SUPL Requirement ID(s) | Notes |
|---|---|---|---|
| FEAT[X] | [Description] | SUPL[Y], SUPL[Z] | |
| FEAT[X] | [Description] | — | Promoted to Use Case UC[N] |
| FEAT[X] | [Description] | — | Excluded: process requirement |
| — | — | SUPL[Y] | Analyst-identified gap |

## Appendix B: Excluded Categories

| Category | Reason for Exclusion |
|---|---|
| [Category Name] | [Reason — e.g., "Not applicable to web-based application"] |
```
