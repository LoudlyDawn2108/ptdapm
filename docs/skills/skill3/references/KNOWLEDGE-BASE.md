# Stakeholder Requests — Complete Knowledge Base

This reference contains stakeholder identification procedures, elicitation technique decision logic, interview rules, and supporting methodologies for the Stakeholder Requests Document.

---

## 1. Stakeholder Identification — Full Checklist

Before any elicitation activity begins, systematically identify stakeholders from every category below. For each category, name specific individuals who will contribute requirements and confirm they are authorized, knowledgeable, and available.

### 1.1 Stakeholder Categories

| # | Category | What to Look For |
|---|----------|-----------------|
| 1 | **Customers** | Business owners, sponsors, purchasing departments — whoever ordered, funds, and will approve the system. |
| 2 | **Users** | End-users in different roles, locations, departments. Consider different countries (date formats, languages, conventions). |
| 3 | **Development Participants** | Business analysts, designers, coders, testers, project managers, deployment managers. |
| 4 | **Knowledge Contributors** | Domain experts, authors of reference documents, owners of data sources. |
| 5 | **Executives** | Company president, IT director, department heads. May overlap with Customers. |
| 6 | **Operations & Support** | Hosting providers, help desk, system administrators, customer service reps. |
| 7 | **Regulators** | Government agencies, industry standards bodies, privacy regulations (GDPR), taxation rules. |
| 8 | **Third-Party Partners** | Service providers, payment processors, API partners, data suppliers. |

### 1.2 Key Distinctions

**Customers vs. Users:** These two groups may overlap but are not identical. Their requests may differ or contradict each other.

- **Example of contradiction:** Users of a call center app (call takers) prefer a sophisticated UI even if it loads slowly. The customer (call center director) wants a simple UI that loads immediately to maximize calls per minute.
- **Resolution:** Always record which group the stakeholder represents. Flag contradictions for resolution during requirements analysis.

**Representative Selection:** Each stakeholder group needs at least one representative who meets ALL three criteria:

1. **Authorized** to speak for and represent the group
2. **Has appropriate knowledge** of the group's needs
3. **Is available** for the analyst's team within the project timeline

---

## 2. Elicitation Technique Decision Logic

Use this section to **select** techniques — not to learn what they are. The decision is driven by stakeholder type, availability, and the nature of information needed.

### 2.1 Selection Decision Tree

```
START → Who is the stakeholder?
│
├─ Highest-priority (Customer/Sponsor who funds the project)
│  → Interview (structured, 11-section framework) + Workshop for follow-up
│  → Use 2+ techniques for maximum coverage
│
├─ Co-located User (available in person)
│  → Workshop + Storyboarding (visual feedback during session)
│  → Add Role Playing if requirements are interaction/dialog-driven
│
├─ Remote User or Stakeholder (different location/country)
│  → Questionnaire (same questions, multiple respondents, self-administered)
│  → OR Document Analysis (email) — lowest overhead for reluctant stakeholders
│
├─ Customer Service Representative
│  → Role Playing — CSR functionality is driven by user dialog
│
├─ Co-located Technical Team (admin, dev, content manager)
│  → Workshop — informal, no preparation documents needed
│
├─ External Service Providers (multiple, same questions)
│  → Questionnaire — same questions, different locations, cannot meet
│
├─ Legacy System Users
│  → Observation + Analyzing Existing System
│
└─ Requirements are contradictory or a significant portion is missing
   → Brainstorming Session — defer criticism, generate ideas, then analyze
```

### 2.2 Technique Quick Reference

| Technique | Key Advantage | Key Limitation | Typical Pitfall |
|-----------|---------------|----------------|-----------------|
| **Interview** | Interactive follow-up, depth | Time-intensive, one stakeholder at a time | Asking leading questions, combining questions |
| **Questionnaire** | Wide reach, low overhead | Cannot clarify misunderstandings in real-time | Ambiguous questions produce useless answers |
| **Workshop** | Real-time collaboration, intensive | Requires co-location | Dominant personalities suppress quieter stakeholders |
| **Storyboarding** | Users react to concrete screens | Requires tool that allows quick real-time changes | Users fixate on UI details instead of requirements |
| **Role Playing** | Discovers interaction edge cases | Requires buy-in from participants | Scenarios stay on happy path, miss error cases |
| **Brainstorming** | Generates creative solutions | Unstructured if poorly facilitated | Criticizing ideas during generation kills creativity |
| **Prototyping** | Most concrete feedback | Most expensive technique | Prototype mistaken for final product |
| **Document Analysis** | No stakeholder scheduling needed | May contain outdated or incorrect requirements | Accepting document content without stakeholder validation |
| **Observation** | Captures implicit workflow knowledge | Time-consuming, observer effect | Analyst imposes interpretations on observed behavior |
| **Task Demonstration** | User focuses on task, analyst observes | Limited to observable tasks | Not asking "why" — only capturing "what" |
| **Analyzing Existing Systems** | Concrete functional requirements source | "New system shall do everything old system does" is too vague | Copying flaws from legacy/competitor systems |

### 2.3 Combining Techniques

No single technique is sufficient for a complex project. Combine based on these rules:

- **Minimum:** Every project should use at least **Interview + one other technique**
- **Customer (sponsor):** Interview → Workshop for clarification → Brainstorming for contradictions
- **User-facing features:** Storyboarding or Prototyping during Workshop
- **Process-heavy features:** Role Playing + Observation
- **Large stakeholder pool:** Questionnaire to triage, then Interview/Workshop for top-priority respondents

---

## 3. Interview Technique — Complete Rules

The interview is the primary elicitation technique. These rules are domain-specific and must be followed exactly.

### 3.1 Conducting the Interview

The analyst prepares an initial set of questions in advance using the 11-section framework. During the interview, new questions may be invented based on answers received.

### 3.2 Interview DO Rules

1. Understand which stakeholder group the interviewee represents before the interview begins.
2. Prepare a written initial set of questions before the interview.
3. Repeat the stakeholder's answers in your own words to confirm understanding.
4. If an answer is unclear, ask additional follow-up questions even if they are not in the script.
5. When stakeholders deviate from the topic to express other thoughts, do not interrupt them. Let them finish. Then, if the original question was not answered, ask it again.
6. Capture every requirement the stakeholder articulates, even if it seems irrelevant at the moment.
7. Ask stakeholders for additional information such as forms, screenshots, and reference documents.
8. When speaking to customers, do NOT indicate whether a requirement will be implemented — that decision comes later.
9. At the end, ask open-ended questions such as "What else should I know?"
10. For each requirement, get its relative importance from the stakeholder.
11. Make notes or use a recording device.

### 3.3 Interview DO-NOT Rules

1. **Do not suggest an answer within your question.** Bad: "What response time do you expect? Three seconds?" Good: "What response time do you expect?"
2. **Do not combine multiple questions into one.** Bad: "Will you need to print, email, and fax the report?" (The user may need to print and email but not fax.) Good: Ask each separately.
3. **Do not ask about implementation details at this stage.** Bad: "Do you prefer list box or radio buttons to select the method of payment?" Good: "How would you like to select the method of payment?"
4. **Do not use very long and complex questions.** Keep questions short and focused.
5. **Do not ask the next question before the preceding one has been answered.** Wait for a complete response.

### 3.4 Questionnaire Design Rules

When creating questionnaires (not interviews):

- Questions must be clear, unambiguous, and self-explanatory (no interviewer present to clarify)
- One question per item — never compound
- Mix closed-ended (specific data) and open-ended (additional requirements) questions
- Always include a final question: "Do you have any other requirements?"

**Example for service providers:**

1. What information do you need from the client?
2. What information do you want to display to the client?
3. Do you require payment with a reservation?
4. If you require payment, what kinds of payments do you accept?
5. Do you have any other requirements?

### 3.5 Workshop Facilitation Checklist

**Before:** Invite attendees, distribute agenda + preliminary material, arrange room + equipment.
**During:** Assign note-taker, lead discussion, encourage all to contribute, summarize.
**After:** Document findings, distribute results, schedule follow-ups if needed.

### 3.6 Brainstorming Rules (Critical)

These rules define brainstorming — violating them breaks the technique:

1. Facilitator announces the purpose
2. Every participant contributes freely
3. **Ideas CANNOT be criticized during generation** — this is the core rule
4. All ideas, even unusual ones, are welcomed
5. After all ideas are documented, mutations and combinations may be generated
6. **Only after all ideas are documented** does the team analyze and critique each idea

---

## 4. Handling Special Situations

### 4.1 Contradictory Requirements

When two stakeholders provide conflicting requirements:

1. **Record both requirements** with their source stakeholders
2. **Flag the contradiction** explicitly in the document
3. **Recommend a resolution approach:** brainstorming session, stakeholder negotiation, or technical analysis
4. **Do not silently discard** either requirement

**Example:** US user wants mm/dd/yyyy dates; French user wants dd/mm/yyyy dates. Resolution: Use browser locale settings to determine format automatically.

### 4.2 Incomplete Information

When a stakeholder cannot answer a question:

1. Record the question and note it as unanswered
2. Mark the section as `[INCOMPLETE — needs follow-up]`
3. In the Wrap-Up section, note that follow-up is needed on specific topics
4. Do NOT fabricate answers

### 4.3 Out-of-Scope Requests

When a stakeholder mentions requirements outside the project scope:

1. **Capture it anyway** — capture every requirement, even seemingly irrelevant ones
2. Note it as potentially out-of-scope in the Analyst's Summary
3. Let the prioritization and scoping process handle it later

### 4.4 Nonfunctional Requirements

Stakeholders rarely volunteer nonfunctional requirements unless explicitly asked. Section 9 of the interview framework exists specifically to elicit:

- **Reliability** expectations
- **Performance** expectations
- **Support** needs (who supports it, maintenance access)
- **Security** requirements (authentication, authorization, data protection)
- **Installation and configuration** requirements
- **Licensing** requirements
- **Distribution** method
- **Labeling and packaging** requirements
- **Regulatory and environmental** standards

If the stakeholder has no specific expectation, record their response (e.g., "Comparable with other commercial websites") rather than leaving the section blank.

### 4.5 Use Cases as Elicitation Input

Stakeholders may express needs in use case format (actor-system interaction sequences). When this happens:

1. Review them for quality
2. Check that each step has the attributes of a good requirement
3. The format may be reused but content must be validated
