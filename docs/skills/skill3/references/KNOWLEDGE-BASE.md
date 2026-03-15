# Stakeholder Requests — Complete Knowledge Base

This reference contains the full specification of elicitation techniques, interview guidelines, stakeholder identification procedures, and supporting methodologies needed to design or evaluate a Stakeholder Requests Document.

---

## 1. Stakeholder Identification — Full Checklist

Before any elicitation activity begins, systematically identify stakeholders from every category below. For each category, name specific individuals who will contribute requirements and confirm they are authorized, knowledgeable, and available.

### 1.1 Stakeholder Categories

| # | Category | Description | What to Look For |
|---|----------|-------------|-----------------|
| 1 | **Customers** | Requested the development, will approve the result, and usually fund the project. | Business owners, sponsors, purchasing departments, project commissioners. |
| 2 | **Users** | People who will directly use the system. | End-users in different roles, geographic locations, or departments. Consider users from different countries who may have different conventions (date formats, languages, etc.). |
| 3 | **Development Participants** | Anyone involved in building the system. | Business analysts, designers, coders, testers, project managers, deployment managers, use case designers, graphics designers. |
| 4 | **Knowledge Contributors** | Anyone contributing specialized knowledge. | Domain experts, authors of documents used for elicitation, owners of referenced websites or data sources. |
| 5 | **Executives** | Strategic decision-makers. | Company president, IT director, department heads. May overlap with Customers. |
| 6 | **Operations, Maintenance, and Support** | People who will keep the system running after deployment. | Website hosting company, help desk, system administrators, customer service representatives. |
| 7 | **Regulators** | Entities imposing rules and regulations. | Government agencies, industry standards bodies, search engine content guidelines, data privacy regulations (GDPR, etc.), state taxation rules. |
| 8 | **Third-Party Partners** | External companies involved in operations. | Service providers (hotel providers, car rental agents, airline representatives), payment processors, API providers, data suppliers. |

### 1.2 Key Distinctions

**Customers vs. Users:** These two groups may overlap but are not identical. Their requests may differ or contradict each other.

- **Example of contradiction:** Users of a call center application (call takers) prefer a sophisticated user interface even if it loads slowly. The customer (call center director) wants a simple UI that loads immediately to maximize calls per minute.
- **Resolution:** Always record which group the stakeholder represents. Flag contradictions for resolution during requirements analysis.

**Representative Selection:** Each stakeholder group needs at least one representative who meets ALL three criteria:

1. **Authorized** to speak for and represent the group
2. **Has appropriate knowledge** of the group's needs
3. **Is available** for the analyst's team within the project timeline

---

## 2. Elicitation Techniques — Full Specification

### 2.1 Interviews

**Definition:** Individual dialog between the analyst and a stakeholder.

**When to use:**

- Highest-priority stakeholders (customers who fund the project)
- When interactive follow-up is needed
- When gathering usability, reliability, performance, and supportability requirements (stakeholders rarely state nonfunctional requirements unless explicitly asked)
- When you need to explore topics in depth based on answers received

**How to conduct:**

The analyst prepares an initial set of questions in advance, using the 11-section interview framework. During the interview, new questions may be invented based on answers received.

**Interview Guidelines — Complete List:**

**DO:**

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

**DO NOT:**

1. **Do not suggest an answer within your question.** Bad: "What response time do you expect? Three seconds?" Good: "What response time do you expect?"
2. **Do not combine multiple questions into one.** Bad: "Will you need to print, email, and fax the report?" (The user may need to print and email but not fax.) Good: Ask each separately.
3. **Do not ask about implementation details at this stage.** Bad: "Do you prefer list box or radio buttons to select the method of payment?" Good: "How would you like to select the method of payment?"
4. **Do not use very long and complex questions.** Keep questions short and focused.
5. **Do not ask the next question before the preceding one has been answered.** Wait for a complete response.

### 2.2 Questionnaires

**Definition:** A structured set of questions sent to a larger set of stakeholders for self-administered completion.

**When to use:**

- Same questions apply to multiple stakeholders
- Stakeholders are in different locations or unavailable to meet in person
- You want low overhead and wide reach
- You do not expect to need ad hoc follow-up questions

**Advantages:** Can be emailed and self-administered. Reaches a wider range of stakeholders than interviews or workshops.

**Limitations:** Noninteractive — you cannot clarify misunderstandings or explore unexpected answers. Questions must be clear and straightforward because there is no opportunity to clarify issues during completion. If follow-up is needed, you must use another elicitation technique.

**Design guidelines:**

- Questions should be clear, unambiguous, and self-explanatory
- Avoid compound questions (one question per item)
- Include both closed-ended (specific data) and open-ended (additional requirements) questions
- Always include a final open-ended question: "Do you have any other requirements?"

**Example questionnaire structure for service providers:**

1. What information do you need from the client?
2. What information do you want to display to the client?
3. Do you require payment with a reservation?
4. If you require payment, what kinds of payments do you accept?
5. Do you have any other requirements?

### 2.3 Workshops

**Definition:** A selected group of stakeholders meets the project team for an intensive, focused period. A system analyst acts as facilitator.

**When to use:**

- Stakeholders are co-located or can gather in one place
- You need to clarify, review, or prioritize existing requirements
- You want to combine multiple elicitation techniques (brainstorming, storyboarding, role playing) in one session
- The goal is either gathering new requirements OR reviewing/clarifying/prioritizing existing ones

**Facilitator responsibilities:**

**Before the workshop:**

1. Invite attendees
2. Distribute the agenda and preliminary material so participants can prepare
3. Arrange the conference room and required equipment (projector, whiteboard, etc.)

**During the workshop:**

1. Assign someone to take notes
2. Lead the discussion and keep it on track
3. Encourage all stakeholders to contribute
4. Summarize the session

**After the workshop:**

1. Analyze the findings and document information in a presentable format
2. Distribute results among participants
3. If needed, schedule follow-up sessions

**Key advantage:** Workshops do not usually require preparation of formal documents such as questionnaires or interview scripts. They are informal and collaborative.

### 2.4 Storyboarding

**Definition:** Using a visual or graphical tool to illustrate the system's desired behavior, typically as a sequence of screens displayed to the user.

**When to use:**

- Users need to see concrete UI representations to provide feedback
- During workshops as a complementary technique
- When discussing user-facing workflows

**Process:**

1. Facilitator shows an initial storyboard to the group
2. Participants provide comments and feedback
3. Storyboard is updated based on comments
4. Updated storyboard is presented again
5. Repeat — this is an iterative process

**Key requirement:** The tool used must allow quick real-time changes during the workshop. Paper, whiteboards, presentation software, and GUI builders all work.

### 2.5 Role Playing

**Definition:** Members of a group are assigned roles related to the system being built. Most often, roles represent users or other actors interacting with the system. The team walks through various scenarios.

**When to use:**

- Requirements driven by user-user or user-system dialog
- Customer service scenarios
- Discovering edge cases in interaction workflows

**Process:**

1. Assign roles to participants (user, customer service representative, system, etc.)
2. Walk through realistic scenarios
3. Document the interactions and derive requirements from them

**Example output:** From a role-playing session modeling user-CSR interaction, the following requirements were derived:

- The search facility shall allow the CSR to find a reservation based on last name, destination city, and date.
- The CSR shall be able to change reservation details or cancel a reservation.

### 2.6 Brainstorming Sessions

**Definition:** Short, intensive sessions where participants generate ideas freely. Used to generate new requirements or resolve problems such as contradictory requirements.

**When to use:**

- A significant part of requirements is missing
- Requirements are contradictory and need resolution
- Creative solutions are needed

**Rules (critical — these define brainstorming):**

1. The facilitator announces the purpose of the session
2. Every participant can contribute ideas freely
3. **Ideas cannot be criticized during the session** — this encourages creativity and discourages reticence
4. All ideas, even unusual ones, are welcomed
5. After all ideas are documented, mutations and combinations may be generated
6. **Only after all ideas are documented** does the team analyze and critique each idea, one by one

**Example — Resolving contradictory requirements:**

- REQ1 (US user): Dates shall be in mm/dd/yyyy format
- REQ2 (French user): Dates shall be in dd/mm/yyyy format

Brainstorming generated four ideas. After analysis: "Use the date format stored in the web browser settings" was accepted as the best solution because it is flexible and automatic.

### 2.7 Affinity Diagrams

**Definition:** A method for grouping and organizing a large number of ideas, used in conjunction with brainstorming or workshops. Invented by Jiro Kawakita.

**When to use:**

- Large number of ideas generated
- Relationships between items are not obvious
- Issues are complex
- Group consensus is necessary

**Process:**

1. **Create cards:** Each idea is written on a card or sticky note. Place randomly on a large surface.
2. **Sort the cards:** Participants silently look for related items and place them together. No communication during sorting. If an item belongs to multiple groups, duplicate it. This step may take considerable time.
3. **Discuss the model:** After sorting, the group discusses the classification, patterns, and reasoning.
4. **Create headings:** A title is created for each group.
5. **Structure the model:** Groups may be combined into supergroups or split into subgroups as needed.

### 2.8 Prototyping

**Definition:** Developing a simplified version of the system to get feedback from users and customers.

**When to use:**

- Stakeholders need to interact with something concrete to provide meaningful feedback
- Requirements are unclear and need to be discovered through interaction

**Characteristics:**

- One of the most expensive elicitation methods because it requires building a prototype
- Much functionality is often hardcoded (like a sophisticated storyboard)
- The prototype may be abandoned, or it may evolve into the actual system

### 2.9 Analyzing Existing Documents

**Definition:** Extracting requirements from documents that already exist.

**Sources of requirements:**

- Business case
- Statement of work
- Request for proposal (RFP)
- Business rules
- Notes from meetings
- Corporate guidelines
- Letters
- Emails

**Technique:** Read the document and highlight sentences that form requirements. For electronic documents, relevant portions can be extracted and placed directly into the Stakeholder Requests Document.

**When to use:**

- Stakeholders are remote and send information via email or written documents
- Formal documents already contain implicit requirements
- You want to minimize stakeholder overhead (e.g., a stakeholder doing a favor by sending requirements via email)

### 2.10 Observation and Task Demonstration

**Observation:** The user performs regular tasks while the system analyst watches without interfering. The analyst takes notes.

**Task Demonstration:** The analyst asks the user to perform a specific task, and the user supports the demonstration with explanations.

**When to use:**

- Users cannot express in words the details about their tasks
- It is easier to show the analyst how a task is performed than to describe it
- You want to capture implicit workflow knowledge

**Key advantage:** The user can concentrate on the task while the analyst takes notes and makes observations.

### 2.11 Analyzing Existing Systems

**Definition:** Gathering requirements from systems being replaced or from competing systems.

**Two main sources:**

1. **Legacy system being replaced:** Often the requirement is "the new system shall provide all the functionality of the old system" — but this is too vague. Encourage specific requirements. When documentation is unavailable, experiment with the existing system to extract functionality. Existing screens can be used in storyboards.

2. **Competitor systems:** If similar products exist and are accessible, analyze them to learn from their successes and mistakes.

### 2.12 Use Cases as Elicitation Input

Stakeholders may express needs in use case format (actor-system interaction sequences). When stakeholders provide use cases:

1. The analyst must review them for quality
2. Check that each step has the attributes of a good requirement
3. The format may be reused but content must be validated

---

## 3. Technique-to-Stakeholder Matching Guide

This table provides guidance on matching techniques to stakeholder types:

| Stakeholder Type | Recommended Technique(s) | Reasoning |
|-----------------|-------------------------|-----------|
| Customer (highest priority, funds project) | Interview + Workshop | Highest priority warrants multiple techniques for maximum coverage. Interview framework captures structured needs; workshop clarifies and fills gaps. |
| Co-located User (available in person) | Workshop + Storyboarding | Workshop enables detailed discussion; storyboarding provides visual feedback during the same session. |
| Remote User (different location/country) | Document Analysis (email) or Questionnaire | Minimizes overhead for remote stakeholders. Email is lowest-overhead when the stakeholder is doing a favor. |
| Customer Service Representative | Role Playing | CSR functionality is driven by dialog with users, making role playing ideal to re-create possible interactions. |
| Co-located Technical Team (admin, developer, content manager) | Workshop | Easy to gather in same place, informal format works well, no formal preparation documents needed. |
| External Service Providers (multiple, same questions) | Questionnaire | Same questions apply to all providers, they are in different locations, and cannot meet in person. |
| Legacy System Users | Observation + Analyzing Existing System | Watch how users interact with the current system, then extract functionality requirements. |

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

When a stakeholder mentions requirements that seem outside the project scope:

1. **Capture it anyway** — the skill explicitly requires capturing every requirement, even seemingly irrelevant ones
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
