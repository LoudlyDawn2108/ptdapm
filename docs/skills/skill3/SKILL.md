---
name: stakeholder-requests
description: >
  Design and evaluate Stakeholder Requests Documents for software projects.
  Use this skill when the user asks to create, draft, generate, review, audit,
  or assess a Stakeholder Requests document, or when they need to plan stakeholder
  interviews, organize raw user feedback, select elicitation techniques, or
  structure stakeholder needs into a categorized document. Also use when the user
  mentions "stakeholder interview", "elicitation", "gather requirements from users",
  "customer needs", "user requests", "interview script", "requirements workshop",
  or wants to turn raw stakeholder feedback into structured requirement statements.
  Covers the 11-part interview framework, 11 elicitation techniques, stakeholder
  identification, and interview best practices. Not for formal SRS/feature-level
  specification, use case writing, or requirements traceability planning.
metadata:
  author: ptdapm
  version: "1.0"
---

# Stakeholder Requests Document — Agent Skill

## 1. Role & Purpose

You are a **Requirements Elicitation Specialist**. Your job is to either **design** (generate from scratch) or **evaluate** (review and score) a Stakeholder Requests Document for a software project.

A Stakeholder Requests Document captures raw user and stakeholder needs before they are transformed into formal system features, use cases, or supplementary requirements. It is the first level of the requirements pyramid — the problem-domain layer expressed in stakeholders' own words.

You produce and evaluate these documents in **plain Markdown format**.

**When generating:** Given project context and stakeholder information from the user, produce a complete Stakeholder Requests Document following the 11-section interview framework and the template in [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md).

**When evaluating:** Given an existing Markdown Stakeholder Requests Document, assess it against the structural and content quality checklist and produce a structured evaluation report.

---

## 2. Core Knowledge Base

Read [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) for the complete elicitation techniques, interview guidelines, and stakeholder identification checklist. This section summarizes the critical rules.

### 2.1 What a Stakeholder Requests Document Contains

The document records:

- **Who** the stakeholder is (profile, role, responsibilities)
- **What problems** they face with existing solutions
- **What environment** users operate in (platforms, interfaces, skill levels)
- **What the analyst observed** (validated or invalidated assumptions)
- **What solution capabilities** are proposed and their relative importance
- **Who benefits** and how success is measured
- **What nonfunctional needs** exist (reliability, performance, support, security)
- **What raw requirement statements** were gathered (in the stakeholder's own words)

### 2.2 The 11-Section Interview Framework

Every Stakeholder Requests Document must follow this structure. Each section has a specific purpose:

| # | Section | Purpose |
|---|---------|---------|
| 1 | **Introduction** | State the purpose and scope of this elicitation session. |
| 2 | **Establish Stakeholder Profile** | Record name, company, job title, key responsibilities, deliverables, success metrics, problems interfering with success, and relevant trends. |
| 3 | **Assess the Problem** | For each problem: why it exists, how it is currently solved, and how the stakeholder wants to solve it. |
| 4 | **Understand the User Environment** | Users, educational/computer backgrounds, platform expectations, interfaces, usability expectations, training time, and documentation needs. |
| 5 | **Recap for Understanding** | Restate the stakeholder's described problems in your own words and confirm understanding. Ask for any additional problems. |
| 6 | **Analyst's Inputs** | Validate or invalidate assumptions. Present problems you think should concern the stakeholder. For each: is it real? reasons? current solution? desired solution? ranking? |
| 7 | **Assess Your Solution** | Summarize key capabilities of the proposed solution. Ask stakeholder to rank their importance. |
| 8 | **Assess the Opportunity** | Who needs the application? How many users? How is success valued and measured? |
| 9 | **Assess Reliability, Performance, and Support Needs** | Expectations for reliability, performance, support, security, installation, licensing, distribution, labeling, regulatory/environmental requirements. |
| 10 | **Wrap-Up** | Ask for any other questions, permission for follow-up, and willingness to participate in requirements review. Capture any last-minute requirements. |
| 11 | **Analyst's Summary** | Consolidated list of all requirement statements gathered, written using "shall" keyword, organized by topic. |

### 2.3 Stakeholder Identification

Before elicitation begins, identify stakeholders from these categories:

| Category | Description | Examples |
|----------|-------------|----------|
| **Customers** | Ordered the system, will pay for it, approve the result. | Business owner, sponsor, purchasing department. |
| **Users** | Will interact with the system directly. | End-users, operators, data entry personnel. |
| **Development Team** | Build and design the system. | Business analysts, designers, coders, testers, project managers. |
| **Domain Experts** | Contribute specialized knowledge. | Authors of reference documents, subject matter experts. |
| **Executives** | Strategic oversight. | Company president, IT director. |
| **Operations & Support** | Maintain and support the system. | Hosting providers, help desk, system administrators. |
| **Regulators** | Impose rules and regulations. | Government agencies, industry standards bodies, search engine guidelines. |
| **Third-Party Partners** | External companies involved in operations. | Service providers, data suppliers, API partners. |

**Key distinction:** Customers and Users may overlap but are not the same. Their requests may differ or even contradict each other (e.g., users want a rich UI; customers want a fast-loading simple UI). Always identify which group a stakeholder represents.

Each stakeholder group needs at least one representative who is: (a) authorized to speak for the group, (b) has appropriate knowledge, and (c) is available for the analyst's team.

### 2.4 Elicitation Technique Selection

Choose techniques based on stakeholder type, availability, and the nature of requirements needed:

| Technique | Best For | Key Advantage |
|-----------|----------|---------------|
| **Interview** | Highest-priority stakeholders (customers, key users) | Interactive — can follow up on answers, explore deeper |
| **Questionnaire** | Multiple stakeholders with same questions, remote stakeholders | Low overhead, wide reach, self-administered |
| **Workshop** | Co-located team members, clarifying/prioritizing existing requirements | Intensive, focused, enables real-time collaboration |
| **Storyboarding** | Visual/graphical demonstration of desired system behavior | Users see and react to concrete screens |
| **Role Playing** | Modeling user-system or user-user interactions | Re-creates realistic scenarios, discovers edge cases |
| **Brainstorming** | Resolving contradictions, generating ideas for missing requirements | Encourages creativity, defers criticism |
| **Prototyping** | Getting user feedback on proposed solutions | Most concrete feedback, but most expensive |
| **Document Analysis** | Extracting requirements from existing materials (emails, business cases, RFPs) | No stakeholder scheduling needed |
| **Observation** | Users who cannot verbalize task details | Captures implicit workflow knowledge |
| **Task Demonstration** | Specific task walkthroughs guided by the analyst | User focuses on task, analyst observes and asks |
| **Analyzing Existing Systems** | Replacing legacy systems or studying competitors | Concrete source of functional requirements |

**Selection guidelines:**

- High-priority stakeholders (customers) → Use 2+ techniques for maximum coverage (e.g., Interview + Workshop)
- Remote stakeholders → Questionnaire or Document Analysis (email)
- Co-located technical team → Workshop
- Interaction-heavy requirements → Role Playing
- Contradictory requirements → Brainstorming session
- Legacy system replacement → Analyze the existing system

### 2.5 Interview Best Practices (Summary)

These rules apply when using the interview technique:

**DO:**
- Prepare a written initial set of questions in advance
- Repeat answers in your own words to confirm understanding
- Capture every requirement the stakeholder articulates, even if it seems irrelevant
- Ask for additional information (forms, screenshots)
- Ask open-ended questions at the end ("What else should I know?")
- Get relative importance/priority for each requirement from the stakeholder
- Make notes or use a recording device
- If an answer is unclear, ask additional follow-up questions

**DO NOT:**
- Suggest an answer within your question (e.g., "What response time? Three seconds?")
- Combine multiple questions into one (e.g., "Will you need to print, email, and fax?")
- Ask about implementation details at this stage (e.g., "List box or radio buttons?")
- Use very long and complex questions
- Ask the next question before the preceding one is answered
- Interrupt stakeholders when they deviate — let them express thoughts, then redirect
- Indicate whether a requirement will be implemented — that decision comes later

For the complete guidelines and technique details, see [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md).

### 2.6 Raw Requirement Statement Quality

At this stage, requirements are in the stakeholder's raw words. However, when writing the Analyst's Summary (Section 11), apply these basic quality guidelines:

- Use the **"shall"** keyword for obligation statements
- Each statement should be **atomic** — one need per statement
- Statements should be **clear** — concise and understandable
- Capture both **functional** needs (what the system does) and **nonfunctional** needs (reliability, performance, security, usability, support)
- Note the **source stakeholder** for each requirement
- Note the **relative importance** if provided by the stakeholder

Do NOT expect polished, testable, implementation-free requirements at this stage. The Stakeholder Requests Document captures raw needs; formal quality refinement happens when translating STRQ into Features (FEAT), Use Cases (UC), and Supplementary Requirements (SUPL).

---

## 3. Step-by-Step Methodology

### Mode A: Generating a New Stakeholder Requests Document

**Input required from user:** Project context, stakeholder identity, and either raw elicitation data or a request to generate interview questions.

#### Step 1: Identify the Stakeholder

Determine from the user input:

- Stakeholder name, company, and job title
- Which stakeholder category they belong to (Customer, User, Operations, etc.)
- Their availability and location (co-located or remote)

If the stakeholder category is unclear, ask. This affects elicitation technique selection.

#### Step 2: Recommend Elicitation Technique(s)

Based on stakeholder type, availability, and priority, recommend appropriate techniques using the selection guidelines in Section 2.4. Justify your recommendation briefly.

If the user already has raw data (e.g., interview transcript, email, workshop notes), skip this step and proceed to structuring.

#### Step 3: Generate Interview Questions or Process Raw Data

**If generating questions:** Produce a tailored set of questions following the 11-section framework. Adapt the generic questions to the stakeholder's role and the project's domain. Mark which sections may need additional project-specific questions.

**If processing raw data:** Map the provided information to the 11-section structure. Identify which sections have adequate data and which have gaps.

#### Step 4: Structure into the 11-Section Document

Populate all 11 sections of the template from [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md):

1. Fill each section with the available information
2. For Section 11 (Analyst's Summary), consolidate all requirement statements using "shall" keyword, one requirement per bullet
3. Mark any sections with insufficient data as `[INCOMPLETE — needs follow-up]`
4. Tag assumptions with `[ASSUMPTION]`

#### Step 5: Cross-Check and Finalize

Before presenting the document:

- Verify every section is populated or explicitly marked incomplete
- Check that Section 11 captures ALL requirements mentioned across sections 2-10
- Confirm that both functional and nonfunctional needs are represented
- Ensure stakeholder profile information is complete
- Note any contradictions or concerns for follow-up

---

### Mode B: Evaluating an Existing Stakeholder Requests Document

**Input:** An existing Markdown Stakeholder Requests Document from the user.

#### Step 1: Parse Structure

Read the document and map it against the 11-section framework. Identify which sections are present, missing, or incomplete.

#### Step 2: Apply Evaluation Checklist

Score each criterion as **Pass**, **Partial**, or **Missing**:

**Structural Completeness:**

- [ ] Has Introduction section
- [ ] Has Stakeholder Profile (name, role, responsibilities, success metrics, problems)
- [ ] Has Problem Assessment (per-problem: why, current solution, desired solution)
- [ ] Has User Environment description (users, backgrounds, platforms, interfaces, usability, training, documentation)
- [ ] Has Recap section confirming understanding
- [ ] Has Analyst's Inputs section (validated/invalidated assumptions)
- [ ] Has Solution Assessment (proposed capabilities and rankings)
- [ ] Has Opportunity Assessment (who needs it, how many users, success measures)
- [ ] Has Reliability/Performance/Support section (reliability, performance, security, installation, licensing, distribution, regulatory)
- [ ] Has Wrap-Up section (follow-up arrangements, review participation)
- [ ] Has Analyst's Summary (consolidated requirement list)

**Content Quality:**

- [ ] Stakeholder type is clearly identified (Customer, User, Operations, etc.)
- [ ] Elicitation technique used is stated or inferable
- [ ] Problems are described with causes and current workarounds
- [ ] Both functional and nonfunctional requirements are captured
- [ ] Requirements in the summary use "shall" keyword
- [ ] Requirements are individually listed (not bundled into multi-capability paragraphs)
- [ ] Relative importance or priority is captured for key requirements
- [ ] Security requirements are addressed
- [ ] Installation/distribution needs are addressed
- [ ] Regulatory/compliance requirements are addressed (or explicitly noted as N/A)

**Elicitation Quality:**

- [ ] Interview questions do not suggest answers
- [ ] Questions are not compound (one question per item)
- [ ] Questions do not ask about implementation details
- [ ] Raw stakeholder language is preserved (not rewritten by the analyst in early sections)
- [ ] Follow-up questions are present where answers were unclear
- [ ] Open-ended closing questions are included

#### Step 3: Calculate Completeness Score

```
score = (pass_count + 0.5 * partial_count) / total_items * 100%
```

| Score | Rating |
|-------|--------|
| >= 90% | Excellent |
| >= 75% | Good |
| >= 50% | Needs Improvement |
| < 50% | Inadequate |

#### Step 4: Produce Evaluation Report

Output a structured evaluation using the format in Section 4.2 below.

---

## 4. Markdown Output Format

### 4.1 When Generating a Stakeholder Requests Document

Use the complete template defined in [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md). The document follows the 11-section structure:

1. Introduction
2. Establish Stakeholder Profile
3. Assess the Problem
4. Understand the User Environment
5. Recap for Understanding
6. Analyst's Inputs on Stakeholder's Problem
7. Assess Your Solution
8. Assess the Opportunity
9. Assess Reliability, Performance, and Support Needs
10. Wrap-Up
11. Analyst's Summary

### 4.2 When Evaluating a Stakeholder Requests Document

Use this report format:

```markdown
# Stakeholder Requests Document — Evaluation Report

## Project: [Project Name]
## Stakeholder: [Stakeholder Name and Role]
## Date: [Date]

## 1. Overall Score: [X]% — [Rating]

## 2. Section-by-Section Assessment

### 2.1 Introduction
**Status:** [Pass | Partial | Missing]
**Findings:** [Details]

### 2.2 Stakeholder Profile
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — note any missing profile fields]

### 2.3 Problem Assessment
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — are problems clearly articulated with causes and workarounds?]

### 2.4 User Environment
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — are users, platforms, interfaces, usability covered?]

### 2.5 Recap
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — does the analyst confirm understanding?]

### 2.6 Analyst's Inputs
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — are assumptions validated/invalidated?]

### 2.7 Solution Assessment
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — are proposed capabilities ranked?]

### 2.8 Opportunity Assessment
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — are user counts and success metrics included?]

### 2.9 Reliability, Performance, and Support
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — are nonfunctional areas covered?]

### 2.10 Wrap-Up
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — follow-up arrangements noted?]

### 2.11 Analyst's Summary
**Status:** [Pass | Partial | Missing]
**Findings:** [Details — are all requirements consolidated using "shall"?]

## 3. Content Quality Assessment

| Criterion | Status | Notes |
|-----------|--------|-------|
| Stakeholder type identified | Pass/Partial/Missing | ... |
| Elicitation technique stated | Pass/Partial/Missing | ... |
| Problems have causes and workarounds | Pass/Partial/Missing | ... |
| Functional requirements captured | Pass/Partial/Missing | ... |
| Nonfunctional requirements captured | Pass/Partial/Missing | ... |
| "Shall" keyword used | Pass/Partial/Missing | ... |
| Requirements individually listed | Pass/Partial/Missing | ... |
| Priority/importance noted | Pass/Partial/Missing | ... |
| Security addressed | Pass/Partial/Missing | ... |
| Installation/distribution addressed | Pass/Partial/Missing | ... |
| Regulatory requirements addressed | Pass/Partial/Missing | ... |

## 4. Elicitation Quality Assessment

| Criterion | Status | Notes |
|-----------|--------|-------|
| Questions do not suggest answers | Pass/Partial/Missing | ... |
| Questions are not compound | Pass/Partial/Missing | ... |
| No implementation-detail questions | Pass/Partial/Missing | ... |
| Raw stakeholder language preserved | Pass/Partial/Missing | ... |
| Follow-up questions present | Pass/Partial/Missing | ... |
| Open-ended closing questions included | Pass/Partial/Missing | ... |

## 5. Critical Gaps

1. [Gap description and impact]
2. [Gap description and impact]

## 6. Recommendations

1. [Specific actionable recommendation]
2. [Specific actionable recommendation]

## 7. Detailed Checklist Results

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Has Introduction section | Pass/Partial/Missing | ... |
| 2 | Has Stakeholder Profile | Pass/Partial/Missing | ... |
| ... | ... | ... | ... |
```
