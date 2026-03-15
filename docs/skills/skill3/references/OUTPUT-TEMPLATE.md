# Stakeholder Requests Document — Output Template

Use this exact Markdown structure when generating a Stakeholder Requests Document. Replace all `[bracketed]` placeholders with project-specific content. Mark sections with insufficient data as `[INCOMPLETE — needs follow-up]`. Tag assumptions with `[ASSUMPTION]`.

---

```markdown
# Stakeholder Requests Document

**Project:** [Project Name]
**Stakeholder:** [Stakeholder Name]
**Role:** [Job Title / Stakeholder Category]
**Company:** [Company / Organization]
**Elicitation Method:** [Interview / Workshop / Questionnaire / etc.]
**Date:** [Date of elicitation session]
**Analyst:** [Name of the system analyst conducting the session]

---

## 1. Introduction

**Purpose:** This document captures the raw requirements and needs expressed by [Stakeholder Name] ([stakeholder category: Customer / User / Operations / etc.]) for the [Project Name] project.

**Scope:** [Brief description of what this elicitation session covers — e.g., "This interview covers the full scope of the stakeholder's needs for the online travel agency system."]

**Context:** [Brief project context — what system is being built and why this stakeholder is being consulted.]

---

## 2. Establish Stakeholder Profile

| Field | Response |
|-------|----------|
| **Name** | [Full name] |
| **Company / Industry** | [Company name, industry sector] |
| **Job Title** | [Title] |
| **Stakeholder Category** | [Customer / User / Development Team / Operations & Support / Executive / Third-Party Partner / Regulator / Domain Expert] |
| **Key Responsibilities** | [What are your key responsibilities?] |
| **Deliverables** | [What deliverables do you produce? For whom?] |
| **Success Metrics** | [How is success measured?] |
| **Problems Interfering with Success** | [Which problems interfere with your success?] |
| **Relevant Trends** | [Which, if any, trends make your job easier or harder?] |

---

## 3. Assess the Problem

[For each problem identified, use the following sub-structure:]

### Problem 1: [Problem Name / Short Description]

| Question | Response |
|----------|----------|
| **What is the problem?** | [Description] |
| **Why does this problem exist?** | [Root cause] |
| **How do you solve it now?** | [Current workaround or solution] |
| **How would you like to solve it?** | [Desired solution in stakeholder's words] |

### Problem 2: [Problem Name / Short Description]

| Question | Response |
|----------|----------|
| **What is the problem?** | [Description] |
| **Why does this problem exist?** | [Root cause] |
| **How do you solve it now?** | [Current workaround or solution] |
| **How would you like to solve it?** | [Desired solution in stakeholder's words] |

[Repeat for each problem. If no additional problems, state: "No additional problems identified."]

---

## 4. Understand the User Environment

| Question | Response |
|----------|----------|
| **Who are the users?** | [Description of user types] |
| **What is their educational background?** | [Response] |
| **What is their computer background?** | [Response] |
| **Are the users experienced with this type of application?** | [Yes / No / Mixed — details] |
| **Which platforms are in use? Plans for future platforms?** | [Response] |
| **Which additional applications need to interface with this system?** | [Response] |
| **Expectations for usability?** | [Response] |
| **Expectations for training time?** | [Response] |
| **What kinds of documentation are needed (hard-copy and online)?** | [Response] |

---

## 5. Recap for Understanding

**Analyst's restatement of the problems:**

> You have told me that [restate all problems described by the stakeholder in your own words, as a numbered or bulleted list].

**Confirmation question:** Does this represent the problems you are having with your existing solution?

**Stakeholder response:** [Yes / No / Corrections]

**Additional problems mentioned:** [Any new problems raised during the recap, or "None."]

---

## 6. Analyst's Inputs on Stakeholder's Problem

**Analyst's suggested problems or concerns:**

[List any needs or additional problems you think should concern the stakeholder but were not mentioned.]

### Suggested Problem 1: [Description]

| Question | Response |
|----------|----------|
| **Is this a real problem?** | [Yes / No] |
| **What are the reasons for this problem?** | [Response] |
| **How do you currently solve the problem?** | [Response] |
| **How would you like to solve the problem?** | [Response] |
| **How would you rank solving this problem compared to others mentioned?** | [Response] |

[Repeat for each suggested problem. If no analyst suggestions, state: "No additional problems suggested by the analyst."]

---

## 7. Assess Your Solution

**Proposed solution summary:**

> What if you could [summarize the key capabilities of the proposed solution]?

**Stakeholder's ranking of proposed capabilities:**

| Capability | Importance Ranking |
|------------|-------------------|
| [Capability 1] | [High / Medium / Low or numeric rank] |
| [Capability 2] | [High / Medium / Low or numeric rank] |
| [Capability 3] | [High / Medium / Low or numeric rank] |

---

## 8. Assess the Opportunity

| Question | Response |
|----------|----------|
| **Who needs this application in your organization?** | [Response] |
| **How many users of each type would use the application?** | [Response — be specific with numbers] |
| **How would you value a successful solution? What is the measure of success?** | [Response] |

---

## 9. Assess Reliability, Performance, and Support Needs

| Question | Response |
|----------|----------|
| **Expectations for reliability?** | [Response] |
| **Expectations for performance?** | [Response] |
| **Who will support the product?** | [Response] |
| **Special needs for support, maintenance, and service access?** | [Response] |
| **Security requirements?** | [Response — authentication, authorization, data protection] |
| **Installation and configuration requirements?** | [Response] |
| **Special licensing requirements?** | [Response, or "None."] |
| **How will the software be distributed?** | [Response] |
| **Labeling and packaging requirements?** | [Response, or "None."] |
| **Regulatory or environmental requirements/standards?** | [Response, or "None."] |
| **Any other requirements?** | [Response] |

---

## 10. Wrap-Up

| Question | Response |
|----------|----------|
| **Are there any other questions I should ask you?** | [Response — capture any last-minute requirements here] |
| **If I need to ask follow-up questions, may I contact you?** | [Yes / No — include preferred contact method] |
| **Would you be willing to participate in a requirements review?** | [Yes / No] |

**Additional requirements mentioned during wrap-up:**

- [Any requirements the stakeholder added at this stage]

---

## 11. Analyst's Summary

**Consolidated list of all requirements gathered from this stakeholder:**

[List every requirement identified across all sections above. Write each as a single, atomic statement using the "shall" keyword. Group by topic if helpful. Note the source section.]

### Functional Requirements

- STRQ-001: The system shall [requirement text]. *(Source: Section [#])*
- STRQ-002: The system shall [requirement text]. *(Source: Section [#])*
- STRQ-003: The user shall [requirement text]. *(Source: Section [#])*

### Nonfunctional Requirements

- STRQ-NF-001: The system shall [reliability/performance/security requirement]. *(Source: Section 9)*
- STRQ-NF-002: The system shall [requirement text]. *(Source: Section 9)*

### Constraints

- STRQ-C-001: [Constraint — e.g., timeline, platform, licensing]. *(Source: Section [#])*

### Noted Contradictions or Concerns

- [Any contradictions with other stakeholders' requirements — flag for resolution]
- [Any potentially out-of-scope requests — flag for scoping decision]

### Open Items

- [Questions that remain unanswered — need follow-up]
- [Sections marked as incomplete]

---

## Elicitation Metadata

| Field | Value |
|-------|-------|
| **Elicitation technique(s) used** | [Interview / Workshop / Questionnaire / etc.] |
| **Reason for technique selection** | [Why this technique was chosen for this stakeholder] |
| **Session duration** | [Approximate duration] |
| **Follow-up needed?** | [Yes / No — if yes, on what topics] |
| **Next steps** | [What happens next with these requirements] |
```
