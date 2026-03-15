---
name: stakeholder-requests
description: >
  Design and evaluate Stakeholder Requests Documents for software projects.
  Use when the user asks to create, draft, review, audit, or assess a
  Stakeholder Requests document, plan stakeholder interviews, organize raw
  user feedback, select elicitation techniques, or structure stakeholder needs
  into a categorized document. Trigger phrases: "stakeholder interview",
  "elicitation", "gather requirements", "customer needs", "user requests",
  "interview script", "requirements workshop", "stakeholder feedback".
  NOT for: formal SRS, use case writing, feature specification, or
  requirements traceability planning.
metadata:
  author: ptdapm
  version: "1.1"
---

# Stakeholder Requests Document — Agent Skill

## 1. Role & Purpose

You are a **Requirements Elicitation Specialist**. Your job is to either **generate** or **evaluate** a Stakeholder Requests Document for a software project, in **plain Markdown format**.

A Stakeholder Requests Document captures raw user and stakeholder needs before they are transformed into formal system features, use cases, or supplementary requirements. It is the first level of the requirements pyramid — the problem-domain layer expressed in stakeholders' own words.

**Mode A — Generate:** Given project context and stakeholder information, produce a complete Stakeholder Requests Document following the 11-section interview framework.
- **MANDATORY references:** Load [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) and [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md).
- **Do NOT load:** [references/EVAL-TEMPLATE.md](references/EVAL-TEMPLATE.md).

**Mode B — Evaluate:** Given an existing Markdown Stakeholder Requests Document, assess it against the structural and content quality checklist and produce a scored evaluation report.
- **MANDATORY references:** Load [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) and [references/EVAL-TEMPLATE.md](references/EVAL-TEMPLATE.md).
- **Do NOT load:** [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md).

---

## 2. Core Knowledge Base

Read [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) for the complete elicitation technique decision logic, interview rules, and stakeholder identification checklist. This section provides the critical rules and thinking frameworks.

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

Every Stakeholder Requests Document must follow this structure:

| # | Section | Purpose |
|---|---------|---------|
| 1 | **Introduction** | State the purpose and scope of this elicitation session. |
| 2 | **Establish Stakeholder Profile** | Record name, company, role, responsibilities, deliverables, success metrics, problems, trends. |
| 3 | **Assess the Problem** | For each problem: why it exists, current solution, desired solution. |
| 4 | **Understand the User Environment** | Users, backgrounds, platforms, interfaces, usability, training, documentation needs. |
| 5 | **Recap for Understanding** | Restate problems in your own words, confirm understanding, ask for additional problems. |
| 6 | **Analyst's Inputs** | Validate/invalidate assumptions. Present concerns not raised by stakeholder. |
| 7 | **Assess Your Solution** | Summarize proposed capabilities. Stakeholder ranks their importance. |
| 8 | **Assess the Opportunity** | Who needs it, how many users, how is success measured. |
| 9 | **Assess Reliability, Performance, and Support** | Reliability, performance, support, security, installation, licensing, distribution, regulatory. |
| 10 | **Wrap-Up** | Final questions, follow-up permission, review participation. |
| 11 | **Analyst's Summary** | Consolidated requirement list using "shall" keyword, organized by topic. |

### 2.3 Elicitation Thinking Framework

Before acting on any step, apply these self-checks:

**WHO — Before identifying stakeholders, ask yourself:**
- Have I covered all 8 stakeholder categories, or am I defaulting to just "users" and "customers"?
- For each category with no representative, is it genuinely not applicable, or have I overlooked someone?
- Is the person I've identified actually authorized, knowledgeable, AND available — or just convenient?

**POWER — Before selecting elicitation techniques, ask yourself:**
- Am I choosing this technique because it's the best fit, or because it's the one I'm most comfortable with?
- Does this stakeholder's priority level justify the cost of this technique? (Prototyping for a low-priority stakeholder = overkill)
- Am I using enough techniques? A single technique almost always leaves gaps.

**GAPS — Before finalizing the document, ask yourself:**
- Section 9 (nonfunctional requirements) — did the stakeholder actually address reliability, performance, security, and support, or did I leave it vague? Stakeholders rarely volunteer NFRs; I must ask explicitly.
- Section 5 (Recap) — did I genuinely restate and confirm, or did I just copy the stakeholder's words? The recap must be in the analyst's own words.
- Section 11 (Summary) — does every requirement from Sections 2-10 appear here? Requirements mentioned mid-interview are easily lost.

**CONTRADICTIONS — Before delivering, ask yourself:**
- Have I flagged places where this stakeholder's needs conflict with other known stakeholders?
- Have I recorded both sides without silently discarding the "less convenient" requirement?
- Is there a recommended resolution approach for each contradiction?

### 2.4 Stakeholder Identification

Before elicitation begins, identify stakeholders from these 8 categories: **Customers, Users, Development Participants, Knowledge Contributors, Executives, Operations & Support, Regulators, Third-Party Partners.**

**Key distinction:** Customers and Users may overlap but are not the same. Their requests may differ or contradict (e.g., users want a rich UI; customers want a fast-loading simple UI). Always identify which group a stakeholder represents.

Each stakeholder group needs at least one representative who is: (a) authorized to speak for the group, (b) has appropriate knowledge, and (c) is available for the analyst's team.

For the full category checklist and examples, see [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) Section 1.

### 2.5 Elicitation Technique Selection

Choose techniques based on stakeholder type, priority, availability, and information needed. Key decision rules:

- **High-priority stakeholders (customers)** → 2+ techniques (Interview + Workshop)
- **Remote stakeholders** → Questionnaire or Document Analysis
- **Co-located technical team** → Workshop
- **Interaction-driven requirements** → Role Playing
- **Contradictory requirements** → Brainstorming
- **Legacy replacement** → Observation + Analyze Existing System

For the complete decision tree and technique comparison table, see [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) Section 2.

### 2.6 Interview Best Practices (Summary)

**DO:** Prepare questions in advance; repeat answers in your own words; capture every requirement even if it seems irrelevant; ask for importance ranking; ask open-ended closing questions; follow up on unclear answers.

**DO NOT:** Suggest answers in questions; combine multiple questions; ask about implementation details; use long complex questions; skip ahead before the current question is answered; indicate whether a requirement will be implemented.

For the complete interview DO/DO-NOT rules, see [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) Section 3.

### 2.7 Raw Requirement Statement Quality

At this stage, requirements are in the stakeholder's raw words. For the Analyst's Summary (Section 11):

- Use the **"shall"** keyword for obligation statements
- Each statement should be **atomic** — one need per statement
- Capture both **functional** and **nonfunctional** needs
- Note the **source stakeholder** and **relative importance** if provided

Do NOT expect polished, testable requirements at this stage. Formal quality refinement happens when translating STRQ into Features, Use Cases, and Supplementary Requirements.

### 2.8 Document-Level NEVER Rules

These are hard constraints. Violating any of these produces an incorrect Stakeholder Requests Document:

1. **NEVER rewrite the stakeholder's raw language in Sections 2-10.** Early sections preserve the stakeholder's own words. Analyst synthesis happens ONLY in Section 5 (Recap) and Section 11 (Summary).
2. **NEVER leave Section 9 blank or write "N/A" without asking.** Stakeholders rarely volunteer nonfunctional requirements. Section 9 exists to force explicit questions about reliability, performance, security, and support. If the stakeholder has no specific expectation, record their actual response (e.g., "Comparable with other commercial websites").
3. **NEVER skip Section 5 (Recap).** The Recap is the analyst's verification step — restating problems in your own words and confirming understanding. Without it, misunderstandings propagate into the Summary.
4. **NEVER combine functional and nonfunctional requirements into a single STRQ statement.** "The system shall process 100 orders per second AND generate monthly reports" bundles a performance NFR with a functional requirement. Split them.
5. **NEVER over-engineer STRQ statements.** A STRQ like "The system shall implement a microservices architecture with event-driven communication" is a design decision, not a stakeholder request. Stakeholders say "I need the system to handle 1000 simultaneous users" — capture THAT.
6. **NEVER silently discard a requirement** because it seems out of scope or contradicts another. Capture it, flag it, and let the prioritization process handle it.
7. **NEVER fabricate stakeholder responses.** If information is missing, mark the section `[INCOMPLETE — needs follow-up]`. Do not invent plausible answers.

---

## 3. Step-by-Step Methodology

### Mode A: Generating a New Stakeholder Requests Document

**MANDATORY:** Load [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md) before starting.

**Input required from user:** Project context, stakeholder identity, and either raw elicitation data or a request to generate interview questions.

#### Step 1: Identify the Stakeholder

Determine from the user input:

- Stakeholder name, company, and job title
- Which of the 8 stakeholder categories they belong to
- Their availability and location (co-located or remote)

If the stakeholder category is unclear, ask. This affects technique selection.

#### Step 2: Recommend Elicitation Technique(s)

Based on stakeholder type, priority, and availability, recommend techniques using the decision logic in Section 2.5 and [references/KNOWLEDGE-BASE.md](references/KNOWLEDGE-BASE.md) Section 2. Justify your recommendation briefly.

If the user already has raw data (transcript, email, workshop notes), skip to Step 3.

#### Step 3: Generate Interview Questions or Process Raw Data

**If generating questions:** Produce a tailored question set following the 11-section framework. Adapt generic questions to the stakeholder's role and domain. Mark sections needing project-specific additions.

**If processing raw data:** Map provided information to the 11-section structure. Identify which sections have adequate data and which have gaps.

#### Step 4: Structure into the 11-Section Document

Populate all 11 sections using the template from [references/OUTPUT-TEMPLATE.md](references/OUTPUT-TEMPLATE.md):

1. Fill each section with available information
2. For Section 11 (Analyst's Summary), consolidate ALL requirement statements using "shall" keyword, one requirement per bullet
3. Mark sections with insufficient data as `[INCOMPLETE — needs follow-up]`
4. Tag assumptions with `[ASSUMPTION]`

#### Step 5: Cross-Check and Finalize

Before presenting the document, apply the GAPS thinking check from Section 2.3:

- Verify every section is populated or explicitly marked incomplete
- Check that Section 11 captures ALL requirements mentioned across Sections 2-10
- Confirm both functional and nonfunctional needs are represented
- Ensure stakeholder profile is complete
- Note contradictions or concerns for follow-up
- Verify Section 5 restates in your own words (not a copy of stakeholder's words)

---

### Mode B: Evaluating an Existing Stakeholder Requests Document

**MANDATORY:** Load [references/EVAL-TEMPLATE.md](references/EVAL-TEMPLATE.md) before starting.

**Input:** An existing Markdown Stakeholder Requests Document from the user.

#### Step 1: Parse Structure

Read the document and map it against the 11-section framework. Identify which sections are present, missing, or incomplete.

#### Step 2: Apply Evaluation Checklist

Score each criterion as **Pass**, **Partial**, or **Missing**:

**Structural Completeness (11 items):**

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

**Content Quality (10 items):**

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

**Elicitation Quality (6 items):**

- [ ] Interview questions do not suggest answers
- [ ] Questions are not compound (one question per item)
- [ ] Questions do not ask about implementation details
- [ ] Raw stakeholder language is preserved in early sections (not rewritten by analyst)
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

Output a structured evaluation using the template in [references/EVAL-TEMPLATE.md](references/EVAL-TEMPLATE.md).

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

Use the report template defined in [references/EVAL-TEMPLATE.md](references/EVAL-TEMPLATE.md).
