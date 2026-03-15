# Requirements Management Plan — Complete Knowledge Base

This reference contains all requirement types, attributes, value definitions, traceability rules, and report specifications needed to design or evaluate an RMP.

---

## 1. Requirement Types — Full Definitions

### 1.1 Standard Requirement Types

| Type | Abbreviation | Level | Description |
|------|-------------|-------|-------------|
| Stakeholder Request | STRQ | Problem domain (highest) | Key stakeholder and user needs. High-level requirements expressed in the stakeholders' own words. Needs and stakeholder requests may be treated as synonyms, or split into high-level needs vs. granular stakeholder requests. |
| Feature | FEAT | Solution domain | The system's conditions and capabilities. Translates stakeholder needs into concrete system features. Included in the Vision document. |
| Use Case | UC | Solution domain | Captures all the system's functional requirements as actor-system interaction sequences. Each UC should have its own specification document. Not needed for batch-only systems with no permanent user interaction. |
| Supplementary Requirement | SUPL | Solution domain | Nonfunctional requirements that are not captured in the use case model (e.g., performance, security, compliance). Since there is usually no big difference between supplementary requirements and nonfunctional features, they may sometimes be stored at the features level instead. |
| Glossary Item | TERM | Supporting | Common vocabulary terms for the project domain. |
| Scenario | SCEN | Detail level | Valid use case paths — both basic flow and alternative flows. Facilitates transition between UCs and test cases. During design, sequence diagrams are created from scenarios, not from the whole UC. Critical for project management because UCs are implemented scenario by scenario across iterations, gradually building up complete UCs by the end of Construction. |
| Test Case | TC | Verification | Verification items traced from requirements to ensure full test coverage. A simplified approach is using UCs directly for testing, but this does not guarantee full coverage. |
| Problem | PROB | Highest level | Main problems with existing solutions that a new system is supposed to fix. One level above stakeholder needs. Used only in some projects. |

### 1.2 Selecting Requirement Types by Project Scale

| Project Scale | Recommended Types | Notes |
|--------------|-------------------|-------|
| Small / Simple | STRQ, FEAT | May only need one or two types. If users can express all requirements as UCs, FEAT may not be needed. |
| Medium / Typical | STRQ, FEAT, UC, SUPL | The standard set for most corporate projects. |
| Large / Complex | STRQ, FEAT, UC, SUPL, SCEN, TC | Full pyramid. SCEN is very useful for iterative implementation. TC ensures formal test coverage. |
| With legacy migration | Add PROB | To capture problems with existing solutions. |

---

## 2. Document Types — Full Definitions

| Document Type | Abbreviation | Default Requirement Type | Description | Notes |
|--------------|-------------|------------------------|-------------|-------|
| Stakeholder Requests | STR | Stakeholder Request (STRQ) | Key requests from stakeholders. | Three approaches: (a) in STR documents — easiest for stakeholder feedback but more documents to maintain, (b) in database/tool only — fewer documents but less readable, (c) in the Vision document — fewer documents but mixes problem-domain (STRQ) and solution-domain (FEAT) requirements. |
| Vision | VIS | Feature (FEAT) | Overall system description and specific feature requirements. | One of the main project documents. Often used as part of the customer contract. |
| Use Case Specification | UCS | Use Case (UC) | Use case description — one document per use case. | Descriptive nature of UCs requires document form. Main contract document with customers. |
| Glossary | GLS | Glossary Item (TERM) | Common vocabulary for the project. | Provided in almost all project templates, but often not developed further. |
| Supplementary Specification | SS | Supplementary Requirement (SUPL) | Nonfunctional specifications. | Usually used as a contract with customers alongside UCs. |
| Requirements Management Plan | RMP | (none) | This document. Describes the RM approach for the project. | Does not change much between projects — can create a master RMP for all corporate projects with project-specific exceptions. |

### Customer Contract Considerations

- **Typical contract documents**: Use Case Specifications (UCS) and Supplementary Specification (SS). The Vision document may also be included.
- **Not typically signed off**: Stakeholder Requests — these are in the user's own words, and the team takes responsibility for correct interpretation when translating STRQ to FEAT, UC, or SUPL.
- **Outsourcing contracts**: Scope depends on the vendor's involvement level:
  - Design + development outsourced → Supplementary Requirements and Use Cases
  - Analysis also outsourced → Features
  - Only coding outsourced → Design models may suffice

---

## 3. Traceability — Full Specification

### 3.1 Standard Traceability Structure

```
STRQ ──→ FEAT ──→ UC
  │         │
  │         └──→ SUPL
  └──→ SUPL
```

If Scenarios and Test Cases are used, the chain extends:

```
STRQ ──→ FEAT ──→ UC ──→ SCEN ──→ TC
  │         │
  │         └──→ SUPL ──→ TC
  └──→ SUPL
```

### 3.2 Traceability Path Details

| From | To | Cardinality | Constraint |
|------|----|-------------|-----------|
| STRQ | FEAT | Many-to-many (typically 1 STRQ → many FEAT) | Every **approved** STRQ must trace to at least one FEAT or SUPL. |
| STRQ | SUPL | Many-to-many | Part of the STRQ coverage constraint above. |
| FEAT | UC | Many-to-many | Every **approved** FEAT must trace to at least one UC or SUPL. |
| FEAT | SUPL | Many-to-many | Part of the FEAT coverage constraint above. |
| UC | FEAT | Trace-back | UC traces back to the Features it realizes. |
| SUPL | FEAT | Trace-back | SUPL traces back to the Features it supports. |

### 3.3 Traceability Verification

The following checks ensure traceability coverage — run these at the end of each iteration:

**Forward-trace gaps (requirements without downstream coverage):**
- All STRQ not traced to any FEAT
- All FEAT not traced to any UC or SUPL

**Back-trace gaps (requirements without upstream justification):**
- All FEAT not traced from any STRQ
- All UC not traced from any FEAT
- All SUPL not traced from any FEAT

---

## 4. Requirement Attributes — Complete Definitions

### 4.1 Primary Attribute Set (Recommended)

This is the recommended attribute set based on the sample RMP. Projects may customize.

#### Attributes for FEAT (Features)

| Attribute | Type | Allowed Values | Description |
|-----------|------|---------------|-------------|
| **Status** | Enumeration | Proposed, Approved, Realized, Incorporated, Validated | Tracks the lifecycle progression of the requirement. See value definitions below. |
| **Priority** | Enumeration | High, Medium, Low | Determines resource allocation for development. See value definitions below. |
| **Benefit** | Enumeration | Critical, Important, Useful | Importance of the requirement to end users and customers. See value definitions below. |
| **Effort** | Numeric | Person-days | Set by the development team. Total persons × days needed. |
| **Risk** | Enumeration | High, Medium, Low | Probability that implementation will cause undesirable events (overruns, defects, poor quality). See value definitions below. |
| **Stability** | Enumeration | High, Medium, Low | Probability that the requirement or the team's understanding of it will change. Used to set priorities and identify items needing more elicitation. |
| **Target Release** | Text | Iteration name or number | The iteration in which the feature will be incorporated into the product. |
| **Assigned To** | Text | Person name | Person responsible for further elicitation, writing software requirements, and implementation. |
| **Reason** | Text | Free text | Tracks the source of the requested feature — an explanation or reference to an explanation. |

#### Attributes for STRQ (Stakeholder Requests)

Same as FEAT **except** no Target Release and no Assigned To:

| Attribute | Type | Allowed Values |
|-----------|------|---------------|
| Status | Enumeration | Proposed, Approved, Realized, Incorporated, Validated |
| Priority | Enumeration | High, Medium, Low |
| Benefit | Enumeration | Critical, Important, Useful |
| Effort | Numeric | Person-days |
| Risk | Enumeration | High, Medium, Low |
| Stability | Enumeration | High, Medium, Low |
| Reason | Text | Free text |

#### Attributes for UC (Use Cases)

Same as FEAT **plus** Actor:

| Attribute | Type | Allowed Values |
|-----------|------|---------------|
| Status | Enumeration | Proposed, Approved, Realized, Incorporated, Validated |
| Priority | Enumeration | High, Medium, Low |
| Benefit | Enumeration | Critical, Important, Useful |
| Effort | Numeric | Person-days |
| Risk | Enumeration | High, Medium, Low |
| Stability | Enumeration | High, Medium, Low |
| Target Release | Text | Iteration name or number |
| Reason | Text | Free text |
| **Actor** | Text | Actor name | Describes which actor initiates this use case. |

#### Attributes for SUPL (Supplementary Requirements)

Same as FEAT (without Assigned To in the standard set):

| Attribute | Type | Allowed Values |
|-----------|------|---------------|
| Status | Enumeration | Proposed, Approved, Realized, Incorporated, Validated |
| Priority | Enumeration | High, Medium, Low |
| Benefit | Enumeration | Critical, Important, Useful |
| Effort | Numeric | Person-days |
| Risk | Enumeration | High, Medium, Low |
| Stability | Enumeration | High, Medium, Low |
| Target Release | Text | Iteration name or number |
| Reason | Text | Free text |

### 4.2 Extended Attributes (Optional)

These additional attributes are available from the default requirement tool configuration. Projects may add them as needed:

| Attribute | Allowed Values | Applicable To | Description |
|-----------|---------------|---------------|-------------|
| Type (FURPS+) | Functional, Usability, Reliability, Performance, Supportability, Design Constraint, Implementation Requirement, Physical Requirement, Interface Requirement | FEAT | Classifies the feature by FURPS+ category. |
| Difficulty | High, Medium, Low | FEAT, SUPL, UC | How difficult the requirement is to implement. |
| Planned Iteration | Integer | FEAT, UC | The iteration in which the requirement is planned to be implemented. |
| Actual Iteration | Integer | FEAT, UC | The iteration in which the requirement was actually implemented. |
| Origin | Help Desk, Partners, Competition, Large Customers, End Users | FEAT, STRQ | Source of the requirement. |
| Contact Name | Text | FEAT, SUPL, UC | Person to contact for clarification. |
| Obsolete | True, False | FEAT, SUPL, UC | Whether the requirement is no longer relevant. |
| Affects Architecture | True, False | UC | Whether this use case significantly impacts the system architecture. |
| Stakeholder Priority | High, Medium, Low | STRQ | Priority as expressed by the stakeholder (may differ from project priority). |

---

## 5. Attribute Value Definitions

### 5.1 Status Values

| Value | Definition |
|-------|-----------|
| **Proposed** | The requirement is under discussion but has not yet been reviewed and accepted by the project team. |
| **Approved** | The requirement has been reviewed and approved for further design and implementation. |
| **Realized** | The requirement is incorporated into the design. Design artifacts (diagrams, models) reflect this requirement. |
| **Incorporated** | The requirement is incorporated into the product — it has been implemented in code. |
| **Validated** | The requirement has been tested and verified to work correctly. |

### 5.2 Priority Values

| Value | Definition |
|-------|-----------|
| **High** | Must be implemented no later than in the first iteration of the Construction phase. |
| **Medium** | Must be implemented no later than by the end of the Construction phase. |
| **Low** | May be implemented if time permits. Less critical and may be rescheduled for subsequent iterations or releases. |

### 5.3 Benefit Values

| Value | Definition |
|-------|-----------|
| **Critical** | Essential features. Failure to implement them means the system will not meet customer needs. All Critical features must be implemented in the release, or the schedule will slip. |
| **Important** | Features important to the system's effectiveness and efficiency for most applications. The functionality cannot easily be provided in some other way. |
| **Useful** | Features that will be used less frequently, or for which reasonably efficient workarounds can be achieved. No significant revenue or customer satisfaction impact if not included in a release. |

### 5.4 Risk Values

| Value | Definition |
|-------|-----------|
| **High** | The impact of the risk combined with the probability of the risk occurring is high. |
| **Medium** | The impact of the risk is less severe, and the probability of the risk occurring is smaller. |
| **Low** | The impact of the risk is minimal, and the probability of the risk occurring is low. |

**Risk sub-categories (optional, for more granular tracking):**

| Sub-Category | Example |
|-------------|---------|
| Technology-High | Using a new technology with which the team does not have any experience. |
| Technology-Low | Using a well-known technology with which the team has a lot of experience. |
| Schedule-High | High likelihood of schedule overrun due to the complexity or dependencies. |
| Schedule-Low | Low likelihood of schedule overrun. |

### 5.5 Stability Values

| Value | Definition |
|-------|-----------|
| **High** | Low probability that the requirement will change or that the team's understanding will change. |
| **Medium** | Moderate probability of change. |
| **Low** | High probability that the requirement will change or that the team's understanding of it will change. Items with Low stability should be prioritized for additional elicitation. |

---

## 6. Reports and Views — Full Specification

### 6.1 Attribute Matrices

One per requirement type — shows all requirements of that type with their attribute values:

- All Stakeholder Requests (STRQ)
- All Features (FEAT)
- All Supplementary Requirements (SUPL)
- All Use Cases (UC)

### 6.2 Traceability Matrices

Shows which requirements trace to which across types:

- STRQ to FEAT
- FEAT to UC
- FEAT to SUPL

### 6.3 Gap Reports (Untraceable Requirements)

These are the critical coverage reports — identify requirements without proper traceability:

- All STRQ not traced to FEAT (stakeholder needs without corresponding features)
- All FEAT not traced to UC or SUPL (features without implementation requirements)
- All FEAT not traced from STRQ (features without stakeholder justification)
- All UC not traced from FEAT (use cases without feature justification)
- All SUPL not traced from FEAT (supplementary requirements without feature justification)

### 6.4 Traceability Trees

Hierarchical views showing the full trace chain:

- Traceability Tree traced from STRQ (top-down: needs → features → implementation)
- Traceability Tree traced to UC (bottom-up: use cases → features → needs)
- Traceability Tree traced to SUPL (bottom-up: supplementary reqs → features → needs)
