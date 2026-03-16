# Vision Document — Full Structural Template

Use this template as the definitive structure for a Vision Document. Remove sections that do not apply to the project, collapse thin sections when that improves readability, and do not leave empty placeholder headings in the final document. The **Product Features** section (Section 5) is the ONLY section that contains formal requirements of type FEAT.

---

```markdown
# Vision Document: [Project Name]

## 1. Introduction

### 1.1 Purpose
[Describe the purpose of this Vision Document and its intended audience.]

### 1.2 Scope
[Briefly describe the scope of the system defined in this document, including the names of the system and anything affected by it.]

### 1.3 Definitions, Acronyms, and Abbreviations
[Define all terms, acronyms, and abbreviations required to properly interpret this document.]

| Term | Definition |
|------|-----------|
| STRQ | Stakeholder Request |
| FEAT | Feature (a formally derived requirement) |

### 1.4 References
[List all documents and other materials referenced in this document.]

### 1.5 Overview
[Describe what the rest of this document contains and how it is organized.]

---

## 2. Positioning

### 2.1 Business Opportunity
[Briefly describe the business opportunity being addressed by this project.]

### 2.2 Problem Statement

| Element | Description |
|---------|------------|
| **The problem of** | [describe the problem] |
| **affects** | [the stakeholders affected] |
| **the impact of which is** | [what is the impact of the problem] |
| **a successful solution would** | [list key benefits of a solution] |

### 2.3 Product Position Statement

| Element | Description |
|---------|------------|
| **For** | [target customer/user] |
| **Who** | [statement of the need or opportunity] |
| **The [product name]** | [is a / provides] |
| **That** | [statement of key benefit; compelling reason to use] |
| **Unlike** | [primary competitive alternative] |
| **Our product** | [statement of primary differentiation] |

---

## 3. Stakeholder and User Descriptions

### 3.1 Market Demographics
[Describe the market demographics relevant to the product.]

### 3.2 Stakeholder Summary

| Name | Description | Responsibilities |
|------|------------|-----------------|
| [Stakeholder name] | [Brief description] | [Key responsibilities relative to this system] |

### 3.3 User Summary

| Name | Description | Stakeholder |
|------|------------|-------------|
| [User type] | [Brief description] | [Representing stakeholder] |

### 3.4 User Environment
[Describe the working environment of the target users: number of people, hours, platform, existing systems, etc.]

### 3.5 Stakeholder Profiles
[For each stakeholder, provide a profile including: type, responsibilities, success criteria, involvement level.]

### 3.6 User Profiles
[For each user type, provide a profile including: type, responsibilities, success criteria, experience level.]

### 3.7 Key Stakeholder or User Needs

| Need | Priority | Concerns | Current Solution | Proposed Solution |
|------|----------|----------|-----------------|-------------------|
| [Need description] | [High / Medium / Low] | [Stakeholder concerns] | [How they solve it now] | [How the system will address it] |

### 3.8 Alternatives and Competition
[Identify known alternatives and competitors. For each, describe strengths and weaknesses.]

#### 3.8.1 [Competitor A]
[Description, strengths, weaknesses]

#### 3.8.2 [Competitor B]
[Description, strengths, weaknesses]

---

## 4. Product Overview

### 4.1 Product Perspective
[Describe the context and origin of the product. Is it a replacement, new product, or next generation? Describe its relationship to other products.]

### 4.2 Summary of Capabilities

| Customer Benefit | Supporting Feature(s) |
|-----------------|----------------------|
| [Benefit description] | [Feature(s) that enable it] |

### 4.3 Assumptions and Dependencies
[List all assumptions and external dependencies that could affect the project.]

### 4.4 Cost and Pricing
[Describe relevant cost and pricing constraints or targets.]

### 4.5 Licensing and Installation
[Describe any licensing or installation requirements.]

---

## 5. Product Features

<!-- This is the ONLY section containing formal FEAT requirements. -->
<!-- Each feature is a subsection with its full text and attribute table. -->

### FEAT1: [Short descriptive title]
> **[Full requirement text. Must use "shall" for mandatory requirements.]**

| Attribute | Value |
|-----------|-------|
| Priority | [High / Medium / Low] |
| Status | [Proposed / Approved / Incorporated / Validated] |
| Difficulty | [High / Medium / Low] |
| Risk | [High / Medium / Low] |
| Origin | [STRQ ID(s) or "Completion"] |
| Transformation | [Rule name(s) applied] |

<!-- Add optional attributes only when supported by source context: -->
<!-- Stability, Importance, Planned Iteration, Effort, Contact / Assigned To -->

### FEAT2: [Short descriptive title]
> **[Full requirement text.]**

| Attribute | Value |
|-----------|-------|
| ... | ... |

<!-- Continue for all features -->

---

## 6. Constraints
[List any design, implementation, or business constraints imposed on the system.]

---

## 7. Quality Ranges
[Define acceptable quality ranges for performance, robustness, fault tolerance, usability, and similar quality attributes.]

---

## 8. Precedence and Priority
[Define the priority order of features. Indicate which features are critical for the first release vs. later releases.]

---

## 9. Other Product Requirements

### 9.1 Applicable Standards
[List any applicable standards (industry, regulatory, compliance).]

### 9.2 System Requirements
[Describe system requirements such as supported operating systems, browsers, hardware.]

### 9.3 Performance Requirements
[Describe specific performance requirements: response time, throughput, capacity.]

### 9.4 Environmental Requirements
[Describe environmental requirements: deployment, hosting, infrastructure.]

---

## 10. Documentation Requirements

### 10.1 User Manual
[Describe user manual requirements.]

### 10.2 Online Help
[Describe online help requirements.]

### 10.3 Installation Guides, Configuration, and Read Me File
[Describe installation documentation requirements.]

### 10.4 Labeling and Packaging
[Describe any labeling or packaging requirements.]

---

## Appendix A: Traceability Matrix

<!-- Include every original STRQ, every cancelled STRQ, and every Completion-origin feature. -->

| Source ID | Source Summary | FEAT ID(s) | Transformation Rule | Rationale |
|-----------|----------------|------------|---------------------|-----------|
| STRQ1 | [Brief summary] | FEAT1 | [Rule(s)] | [Brief explanation] |
| STRQ2 | [Brief summary] | FEAT2 | [Rule(s)] | [Brief explanation] |
| ... | ... | ... | ... | ... |
| STRQ[n] | [Brief summary] | (Cancelled) | Cancellation | [Reason] |
| Completion-1 | [Missing capability added by analyst] | FEAT[n] | Completion | [Why the feature was necessary] |
```
