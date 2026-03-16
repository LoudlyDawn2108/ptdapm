This document captures raw user needs before they become formal system features.
*   **Reference Material:** **Chapter 5 ("Requirements Elicitation")**.
*   **What the AI should extract:** The framework for interviewing stakeholders and assessing problems. The AI should use the 11-part interview structure to format the Markdown document: 1. Introduction, 2. Establish Stakeholder Profile, 3. Assess the Problem, 4. Understand the User Environment, 5. Recap, 6. Analyst's Inputs, 7. Assess Solution, 8. Assess Opportunity, 9. Assess Reliability/Performance/Support, 10. Wrap-Up, 11. Analyst's Summary.
*   **Skill Purpose:** To help you draft questions for stakeholders and organize raw feedback into clear, categorized needs. 

## CHAPTER 5

The second part of this chapter shows you how to document requirements from the stakeholders  in  Stakeholder  Requests  documents  using  RequisitePro.  This  includes  the  following tasks:

- Adding a Stakeholder Requests document type to the project (if the project does not contain it already)
- Creating a document from the template
- Filling a document with the information
- Storing requirements in the database
- Using views with requirements

## 5.1 Identifying Stakeholders

The vast majority of project requirements come from stakeholders. The glossary in the Rational Unified Process (RUP) defines a stakeholder as 'An individual who is materially affected by the outcome of the system.' The two most important groups of stakeholders are

- Customers who requested the development. They approve the result and usually fund the project.
- Users of the system

These  two  groups  may  overlap,  but  they  do  not  need  to.  It  is  important  to  distinguish between customers and users. Their requests may be quite different and even sometimes contradictory. For example, users of a call center application (call takers) may prefer a sophisticated user interface, even though it requires a long time to load. The customer (director of the call center) may request a simple user interface that loads immediately and allows servicing of more calls per minute.

Besides customers and users, other stakeholders may include technical support, people who will maintain the system, an accounting group that processes transactions, shareholders of the company, and many others.

Each group of stakeholders needs at  least  one  representative  who  can  provide  requirements. This person should be authorized to represent the group, have appropriate knowledge, and be available for the analyst's team.

Let's go through a checklist of potential stakeholders and identify them for our project:

- Customers

Identified stakeholders: travel agency owner.

- Users

Users  who  will  contribute  requirements:  User  1  (from  the  U.S.)  and  User  2  (from France).

- Anyone  participating  in  developing  the  system  (business  analysts,  designers,  coders, testers, project managers, deployment managers, use case designers, graphics designers) Stakeholders who will contribute requirements: developer and content manager.
- Anyone contributing knowledge to the system (domain experts, authors of documents that were used for requirements elicitation, owners of the websites to which a link is provided)

No contributing stakeholders are identified in this group.

- Executives (president of the company that is represented by customers, director of the IT department of the company that designs and develops the system)

Travel agency owner was mentioned in the first group.

- People  involved  in  operation,  maintenance,  and  support  (website  hosting  company, help desk)

Identified stakeholders: customer service representative, administrator.

- Providers of rules and regulations (rules imposed by search engines regarding content of the website, government rules, state taxation rules)

No contributing stakeholders are identified in this group.

- Third-party companies involved in operations
- Identified stakeholders: hotel provider, car rental agent, airline rep.

## 5.2 Techniques of Requirements Elicitation

Stakeholders' requests may be gathered using various techniques:

- Interviews (individual dialog with a stakeholder)
- Questionnaires (a set of questions sent to a larger set of stakeholders)
- Workshops (stakeholders gather for an intensive, focused period)
- Storyboarding (using a visual/graphical tool to demonstrate system behavior)
- Role playing (each member of the group is assigned a role, usually one of the users)
- Brainstorming sessions (presenting ideas during a short, intensive session)
- Prototyping (developing a prototype to get feedback)
- Use cases (interaction between a user and a system presented as a sequence of steps)
- Analysis  of  existing  documents  (extracting  information  from  Microsoft Word  documents, e-mails, and notes)
- Observation and task demonstration (watching users perform a specific task)
- Analysis of existing systems (gathering requirements from a system being replaced or from systems built by the competition)

Table 5.1 describes requirements elicitation methods that were selected in our project to gather  requirements  from each  of  the  stakeholders  identified  in  Chapter  4,  'Setting  Up  the Project.'

Table 5.1 Stakeholders and Requirements Elicitation Methods Used to Gather Requirements from Them

| Stakeholder                     | Elicitation Method     | Reason                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|---------------------------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Travel agency owner             | Interview Workshop     | This stakeholder is a customer who ordered a system and will pay for it. It makes his or her priority the highest. Usually in this case we apply more than one method of elicitation to ensure the best coverage pos- sible. The interview script included in a template for the Stakeholder Requests document fits quite well, so it may be used as a first step to get some require- ments. Next, a workshop may be used to clarify the requirements to minimize the probability that a requirement is missing. Being a customer, the stake- holder should also contribute nonfunctional require- ments such as performance and reliability. |
| User 1                          | Workshop Storyboarding | Aworkshop provides more opportunities to get more detailed requirements. Because User 1 is available to meet with the development team, we can invite her to the workshop. Storyboarding is used during the same workshop.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| User 2                          | Document (e-mail)      | User 2 is in another country and is unavailable to meet in person. He is doing a favor providing the feedback, so we want to keep his overhead to a mini- mum. He was asked to send an e-mail summarizing his requirements.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Customer service representative | Role playing           | Functionality required by the customer service representative is driven by a dialog with users who call with various problems, so role playing is an ade- quate tool to re-create possible calls.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Administrator                   | Workshop               | All three stakeholders are members of the IT department and work in the same place. It is easy to gather them at the same time.Aworkshop usually does not require preparation of formal documents such as a questionnaire or interview script.                                                                                                                                                                                                                                                                                                                                                                                                 |
| Content manager                 | Workshop               | All three stakeholders are members of the IT department and work in the same place. It is easy to gather them at the same time.Aworkshop usually does not require preparation of formal documents such as a questionnaire or interview script.                                                                                                                                                                                                                                                                                                                                                                                                 |
| Developer                       | Workshop               | All three stakeholders are members of the IT department and work in the same place. It is easy to gather them at the same time.Aworkshop usually does not require preparation of formal documents such as a questionnaire or interview script.                                                                                                                                                                                                                                                                                                                                                                                                 |
| Hotel provider                  | Questionnaire          | The same questions apply to all three service providers, so the same questionnaire may be used. All three are from different companies in different locations across the country. They are not available to meet personally.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Car rental agent                | Questionnaire          | The same questions apply to all three service providers, so the same questionnaire may be used. All three are from different companies in different locations across the country. They are not available to meet personally.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Airline representative          | Questionnaire          | The same questions apply to all three service providers, so the same questionnaire may be used. All three are from different companies in different locations across the country. They are not available to meet personally.                                                                                                                                                                                                                                                                                                                                                                                                                   |

According to the RUP, the person responsible for the activity Elicit Stakeholder Requests is the system analyst. In RUP, system analyst (and all other roles) is a role performed by a member or members of the project team, not necessarily a function in the company. In many projects this task is performed by a business analyst or some other person.

## Interviews

One of the most common requirements elicitation methods is interviewing selected groups of stakeholders. The advantage of this approach is its interactive nature, providing the opportunity to add more or follow up on questions depending on the answers received. Interviews are a good way to gather usability, reliability, performance, and supportability requirements. Usually customers do not state these nonfunctional requirements unless explicitly asked. While interviewing, the business analyst should have an initial set of questions prepared in advance. However, during the interview, new questions may be invented. The RequisitePro template for the Stakeholder Requests document contains a sample script that may be used for the interview. This script is generic and probably will need to be tailored for each interview.

Here are some guidelines for conducting the interviews:

- While identifying stakeholders for the interview, be sure to understand which group they represent.
- Prepare a written initial set of questions.
- Repeat the answers in your own words to confirm that you understand.
- You should not suggest an answer in your question. Example: What response time do you expect? Three seconds?
- Do not combine more than one question into one. Example: Will you need to print, email, and fax the report? The user may need to print and e-mail but not fax.
- At this stage, do not ask about the implementation details. Example: Do you prefer list box or radio buttons to select the method of payment?
- Do not use very long and complex questions.
- Do not ask the next question before the preceding one has been answered.
- If an answer is unclear, ask additional questions, even if they are not in the script.
- When users deviate from the answer to ask a question, do not interrupt them. Let them express their thoughts on whatever topic they are discussing. Then, if you do not receive an answer to the initial question, ask it again.
- Capture  every  requirement  that  a  user  articulates,  even  if  it  seems  irrelevant  at  the moment.
- Ask users for additional information (such as forms and screenshots).
- When speaking to the customers, do not indicate  whether  their  requirement  will  be implemented. This will be decided later.

- At the end, ask open-ended questions such as 'What else should I know?'
- For each requirement, get its relative importance from the stakeholder.
- Make notes or use a recording device.

As an example, let's use the layout of the Stakeholder Requests document [RUP04] as a framework to interview the travel agency owner:

1. Introduction
2. Establish Stakeholder or User Profile
- Name: Mark Murphy
- Company/Industry: Incredible Travel Agency, Inc.
- Job Title: Owner
- What are your key responsibilities? Run the agency, maximize profit from sales.
- What deliverables  do  you  produce?  For  whom? Number of airplane tickets  sold, number of hotel rooms booked, and number of cars rented.
- How is success measured? Profit from sales and from referrals.
- Which problems interfere with your success? Without a website, we are limited to local clients.
- Which, if any, trends make your job easier or harder? The Internet gives us an opportunity to reach many new clients.

## 3. Assess the Problem

- For which problems do you lack good solutions? Online sales.
- What are they?

For each problem, ask the following:

- Why does this problem exist?
- How do you solve it now? Currently, customers call to make reservations.
- How would you like to solve it? We would like clients to be able to purchase tickets online, without needing to call the travel agent.

## 4. Understand the User Environment

- Who are the users? Anybody who wants to purchase an airline ticket, rent a car, or reserve a hotel room.
- What is their educational background? Mixed.
- What is their computer background? Computer-literate, capable of using the Internet.
- Are the users experienced with this type of application? Yes.
- Which platforms are in use? What are your plans for future platforms? The application will be platform-independent, and it will be available through the browser.

- Which additional applications do you use that we need to interface with? Airline Reservation System.
- What are your expectations for the product's usability? The system shall be easy to use.
- What are your expectations for training time? Learning time shall be minimal, and navigation shall be easy.
- What kinds of hard-copy and online documentation do you need? Online help for users.  Hard-copy  documentation  for  customer  service  rep,  content  manager,  and administrator.

## 5. Recap for Understanding

- You have told me... (list stakeholder-described problems in your own words)
- Does this represent the problems you are having with your existing solution?
- What, if any, other problems are you experiencing?
6. Analyst's Inputs on Stakeholder's Problem (validate or invalidate assumptions)
- What, if any, problems are associated with... (list any needs or additional problems you think should concern the stakeholder or user) No online sales For each suggested problem, ask the following:
- Is this a real problem? Yes.
- What are the reasons for this problem? Not having a website.
- How do you currently solve the problem? Phone calls.
- How would you like to solve the problem? Sales through the website.
- How would  you  rank  solving  these  problems  in  comparison  to  others  you've mentioned?

## 7. Assess Your Solution

- What if you could... (summarize the key capabilities of your proposed solution)
- How would you rank the importance of these?

## 8. Assess the Opportunity

- Who needs this application in your organization? The main benefit will be to the owners.  Administrator,  customer  service  rep,  and  content  manager  will  use  the application.
- How many of these types of users would use the application? One administrator, two customer service reps, and one content manager
- How would you value a successful solution? Measure of success: number of sales through the Internet, number of referrals to car and hotel providers.

## 9. Assess Reliability, Performance, and Support Needs

- What  are  your  expectations  for  reliability? Comparable  with  other  commercial websites.
- What are your expectations for performance? Comparable with other commercial websites.
- Will you support the product, or will others support it?
- Do  you  have  special  needs  for  support?  What  about  maintenance  and  service access?
- What are the security requirements? Hotel providers, car providers, and airline representatives shall have IDs and passwords for the pages where they can submit their offers. Users shall select a userid and password when buying a ticket.
- What  are  the  installation  and  configuration  requirements? No  installation  is required on users'machines.
- What are the special licensing requirements? None.
- How will the software be distributed? Installed on the server of the web hosting company.
- What are the labeling and packaging requirements? None.
- What, if any, regulatory or environmental requirements or standards must be supported? None.
- Can you think of any other requirements we should know about? The system shall be developed in three months.

## 10. Wrap-Up

- Are there any other questions I should ask you? I would like to add one more piece of functionality. To provide added value for our clients, the website shall provide information about tourist attractions near the destination city.
- If I need to ask follow-up questions, may I give you a call? Yes.
- Would you be willing to participate in a requirements review? Yes.

## 11. Analyst's Summary

- The system shall provide the opportunity to book a flight, purchase a ticket, reserve a hotel, and reserve a car, and it shall provide information about tourist attractions.
- The user shall be able to purchase a ticket online, without needing to call the travel agent.
- The system shall follow implementation guidelines set up in the chain of our travel agencies.
- Hotel providers, car providers, and airline representatives shall have their IDs and passwords to the pages where they can submit their offers.

- The system must be available 24 hours a day, with a level of reliability appropriate to commercial applications.
- The system shall be developed in three months.
- The users shall pick IDs and passwords when buying an airline ticket.

## Questionnaires

Questionnaires are most useful if you can ask many stakeholders the same questions and you do not expect to generate ad hoc additional questions. This approach has less overhead, and you can reach a much wider range of stakeholders than if you do direct interviews or invite them to workshops. However, because questionnaires are so structured and noninteractive, you have less control  over  the  results.  Questions  should  be  clear  and  straightforward  because  there  is  no opportunity to clarify any issues or misunderstandings, unless you follow up with the stakeholder using  some  other  elicitation  technique.  The  advantage  of  questionnaires  is  that  they  can  be e-mailed and self-administered.

In the online travel agency project, we send the following questions to three stakeholders (hotel provider, car provider, airline representative):

1. What information do you need from the client?
2. What information do you want to display to the client?
3. Do you require payment with a reservation?
4. If you require payment, what kinds of payments do you accept?
5. Do you have any other requirements?

Here are the answers received from hotel provider:

1. What information do you need from the client?

The client shall provide the following information: town, stay dates, number of adults, number of children, room preferences.

2. What information do you want to display to the client?

When providing the information about a hotel, the following info shall be displayed:

Address

Phone

Fax

E-mail

Offered discounts

Available methods of payment and so on

3. Do you require payment with a reservation?
2. No.
3. If you require payment, what kinds of payments do you accept? No need for payment.
4. 4.
5. Do you have any other requirements?

The user shall be offered flight and hotel deals.

## Workshops

During a requirements workshop, a selected group of stakeholders meets the project team. They gather for an intensive, focused period. A system analyst acts as the facilitator of the meeting.

Here are some of the facilitator's tasks:

1. Before the workshop:
- Invite attendees.
- Distribute the agenda and some preliminary material so that participants can prepare for the meeting.
- Arrange the conference room and required equipment (such as a projector).
2. During the workshop:
- Assign someone to take notes.
- Lead the discussion, and keep it on track.
- Encourage all stakeholders to contribute.
- Summarize the session.
3. After the workshop:
- Analyze the findings, and document the information in a presentable format.
- Distribute results among participants.
- If needed, schedule follow-up sessions.

The requirements workshop provides an opportunity to apply the other elicitation techniques, such as brainstorming, storyboarding, and role playing. The goal of the workshop can be either to gather new requirements or to review, clarify, and prioritize existing requirements. The results of the requirements workshops should be documented. The best place to do this is in Stakeholder Requests documents.

In our sample project, a workshop was conducted with the business analyst, User 1, project manager, developer, and two people who eventually will maintain the system: the content manager and the system administrator.

Here are sample requirements gathered during the workshop:

## User 1:

1. For outbound and inbound flights, the user shall be able to compare flight prices from other, nearby airports.
2. Sometimes the user will enter the airport  code,  which  the  system  will  understand. Other times the user will enter the closest city. Therefore, the user does not need to know the airport code; the system will understand.
3. The system shall be easy to navigate.
4. If the user has purchased a ticket before, the user shall not need to repeat the same information, such as address or credit card number.
5. Payment by PayPal shall be available.
6. Dates shall be displayed in the mm/dd/yyyy format.
7. The list of available flights shall include flight numbers, departure time, and arrival time for every leg of the flight.
8. It shall be sorted by price.
9. Comparison of car rental prices from different companies shall be provided.
10. Car rental prices shall show all applicable taxes (including 6% state tax).
11. A calendar shall be available to help with entering the flight date.

## Administrator:

1. The search facility shall allow the user to find a reservation based on the following:
- Last Name
- Date
2. All activity on the site shall be logged.
3. Various reports shall be available.

## Content manager:

1. While submitting the content information, the content manager shall be able to submit plain text without HTML tags.
2. Content information shall be stored in a text file.

## Developer:

1. The system shall be fully tested under specific versions of the most popular browsers only.
2. The system may display a map to the airport.

Storyboarding (described in the next section) was also used during the workshop.

## Storyboarding

The idea of storyboarding is to use a visual or graphical tool to illustrate the system's desired behavior. A facilitator shows an initial storyboard to the group. Then, based on comments from participants, the storyboard is changed and presented again. Updating the storyboard is an iterative process. This means that a graphical tool being used should allow quick real-time changes during the workshop. You may use software tools as well as presentation tools from an office supply store.

Here are some sample tools that may be used:

- Paper, pencil, eraser
- Easel, markers
- Dry-erase boards
- Presentation boards
- GUI builders such as Visual Basic or Visual C++
- Microsoft PowerPoint
- Microsoft Visio
- Graphics tools such as Microsoft Paint
- Word processors such as Microsoft Word

In software projects, storyboards often present a sequence of screens that eventually are displayed to the user, as shown in Figure 5.2.

Figure 5.2 A simple storyboard created with Microsoft PowerPoint.

## Role Playing

The members of a group are assigned roles related to the system being built. Most often, the roles represent users of the system or other actors interacting with the system. The team walks through various scenarios.

In the online travel agency project, the interaction between a user and customer service representative (CSR) can be modeled using role playing. Let's look at two examples.

## Dialog 1

User:

Hi.  Yesterday I made a reservation for a hotel. However, I had to cancel my trip,

so I would like to cancel my reservation.

CSR:

No problem. What is your last name?

User:

Smith.

CSR: I have 187 reservations made by people named Smith. What is your first name?

User:

John.

CSR: Still 47 matches. What is your destination city?

User:

Miami.

CSR:

Date?

User:

September 12th to September 15th.

CSR:

OK. Your reservation is canceled.

## Dialog 2

User:

Good afternoon.

CSR:

How can I help you?

User:

I reserved an airline ticket and ordered a seat next to the window. I would like to change it to the aisle.

CSR:

What is your name?

User:

Arctos Postopolis.

CSR:

OK. Your name is unique, so I do not need any other info. The flight to Los Angeles on April 5th?

User:

Yes.

CSR:

OK. The change is made.

The following requirements were formulated from the role-playing session:

- The search facility shall allow the customer service representative to find a reservation based on
- Last name
- Destination city
- Date
- The CSR shall be able to change reservation details or cancel a reservation.

## Brainstorming Sessions

During brainstorming sessions, participants gather for short but intensive sessions. At the beginning, the facilitator announces the purpose of the session. It may be generating new requirements related to some part of a system or solving a problem, such as resolving a set of contradictory requirements. Every participant can contribute ideas. The atmosphere should encourage all ideas, even crazy ones. Ideas cannot be criticized. These rules are used to encourage creativity and discourage reticence or conformity. After all ideas have been written down, the mutations and combinations of these ideas can be generated. Only after all the ideas have been documented and the team analyzes every idea, one by one, is criticism allowed.

Brainstorming is especially useful when a problem needs to be solved-either a significant part of the requirement is missing, or requirements are contradictory. Quite often requirements and design are discussed at the same time because some solutions to a problem may be discussed.

## Example

During requirements elicitation from users, two contradictory requirements were gathered:

From the user in the U.S.:

REQ1 Dates shall be displayed in the mm/dd/yyyy format.

From the user in France:

REQ2 Dates shall be displayed in the dd/mm/yyyy format.

The following team gathered to resolve this problem using a brainstorming session:

- User 1
- System analyst
- Developer
- Designer

Participants came up with various ideas:

- Idea 1: Hardcode the date to mm/dd/yyyy format, and specify the format next to each date entry field.
- Idea 2: Ask the user to register on the system. During registration, one of the questions will ask about the user's date format preference.
- Idea 3: Create a configuration file that contains the user's preference regarding the date. The program will read the configuration file from the hard drive.
- Idea 4: Use the date format that is stored in the web browser settings.

The ideas were gathered and documented. They were not criticized or discussed during the session. After all four ideas were documented, each was analyzed.

Idea 1 was rejected because it is inflexible and does not provide the correct format for nonU.S. users.

Idea 2 was rejected because some users may not want to go through the hassle of register- ing. Requiring registration may decrease the number of potential customers.

Idea 3 was rejected for technical and security reasons.

Idea 4 was accepted as the best solution.

## Using Affinity Diagrams

Affinity diagrams are not a stand-alone technique; they are used in conjunction with brainstorming sessions or requirements workshops. The goal of this method is to group and organize a large number of ideas that come, for example, from a brainstorming session. This method can also be used to group the requirements that were collected during a workshop.

Affinity diagrams were invented by Jiro Kawakita from Japan. They are especially useful when

- There are a large number of ideas.
- Relationships between the items are not obvious.
- The issues are complex.
- Group consensus is necessary.

This technique involves the following steps [TAG04]:

1. Create cards. Each idea is written on a card or sticky note. Use markers so that the text is visible from a greater distance. The cards should be randomly placed on a large working surface such as a board or table.
2. Sort the cards. Each participant looks for items that are related in some way and places these cards next to each other. Participants should not communicate during this step. If one item seems to belong to many groups, it is okay to create copies of the card and place them in many groups. This step may take several days.
3. Discuss the model. After all the cards are sorted, the group can discuss the classification, noticed patterns, and the reasons why the cards were grouped in a specific way.
4. Create headings. A title will be created for each group.
5. Structure the model. If needed, some groups may be combined into supergroups or split into subgroups.

The brainstorming example from the preceding section is not a good candidate for affinity diagrams because it generates only a small number of ideas. However, affinity diagrams may be used to group requirements that result from workshops.

## Prototyping

Prototyping is a powerful way to get feedback from users and customers. However, it is one of the most expensive methods because it requires developing the prototype-a simplified version of the system. Much of the functionality is often hardcoded, so the prototype is like a sophisticated storyboard. Sometimes work on the prototypes is abandoned, but in other projects the prototype continues to be enhanced, and eventually it becomes an actual system.

## Analyzing Existing Documents

Many requirements can be extracted from existing documents. The following are examples of documents that may be used as a source of requirements:

- Business case
- Statement of work
- Request for proposal
- Business rules
- Notes from meetings
- Corporate guidelines
- Letters
- E-mails

One technique is to read the document and use a highlighter to mark sentences that form a requirement.

For documents that are already in electronic form, you can cut and paste portions of the text into the RequisitePro Stakeholder Requests document-highlight with the mouse any sentence that represents a requirement, and store it in the database. Section 5.4 explains how to do this.

In our sample project, requirements from User 2 came via e-mail:

-----Original Message-----

From:

Claude

Sent:

Saturday, August 26, 2006 7:01 PM

To:

Julia

Subject:

Requirements

Dear Julia,

In response to your e-mail, I have compiled some requirements for your new system:

1. The user shall be able to compare flight prices from other, nearby airports.
2. Dates shall be displayed in the dd/mm/yyyy format.
3. On data entry screens, the system shall indicate which fields are mandatory.
4. It should be possible to cancel a ticket purchase.
5. The user shall be able to cancel a car or hotel reservation.

6. The outbound and return flights should be sorted by the smallest number of stops.
7. The user will be able to select a seat.
8. The system shall have a natural-language interface.
9. The system shall display a pop-up calendar when the user enters a date.
10. The user shall indicate if he or she needs a one-way or return ticket by checking the checkbox.

Best regards,

```
Claude
```

## Use Cases

Use cases  are  one  of  the  requirement  types  in  the  pyramid  from  Figure  1.1  in  Chapter  1, 'Requirements Management.' They also are a format in which stakeholders express their needs. The format of a use case created by a stakeholder is the same as that eventually used by an analyst. However, the analyst must review the use case supplied by a user. Before placing use cases on the third level of the pyramid, the analyst should do the following:

1. Check that each step of the use case has all the attributes of a good requirement, as discussed in section 1.4, 'Characteristics of a Good Requirement,' in Chapter 1.
2. Import the use case to RequisitePro.
3. Create requirements that will be stored in the database.
4. Set traceability from features.

## Observation and Task Demonstration

Sometimes users cannot express in words the details about their tasks. It may be easier to show the business analyst how this task is performed [LAU02]. The advantage of this approach is that the user can concentrate on the task, while the analyst takes notes and makes observations. The difference between observation and task demonstration is that in observation the user performs regular tasks without paying attention to the system analyst. In task demonstration the analyst may ask the user to do a specific task, and the user may support the demonstration with explanations.

## Analyzing Existing Systems

Analyzing existing systems can be a source of many valuable requirements. Two main types of systems are worthy of analysis:

- A legacy system being replaced
- Systems developed by the competition

Quite often, when a new system replaces an old system, one of the requirements is as follows:

REQ1 The new system shall provide all the functionality of the old system.

This request is vague, so we will encourage customers to give more-specific requirements. However, very often the documentation of the currently used product does not exist, so the best way to get  the  requirements  is  to  experiment  with  the  existing  system  and  extract  its  functionality. Because we already have screens that are developed, we can cut and paste them into a use case or storyboard.

If you are developing a system similar to ones that have been developed by other companies, and you have access to the final product, it is worth analyzing their work to learn from their success or their mistakes.

Because many online travel agencies are available on the Internet, for our sample project, system analysts decided to analyze similar websites:

- http://travel.yahoo.com
- www.expedia.com
- www.cheaptickets.com
- www.travelocity.com

## 5.3 Summary

Stakeholder requests can be gathered through many different elicitation techniques. We have discussed 11 of them. Which technique you choose depends on the nature of the requirements and the  type  of  stakeholder.  It  is  good  practice  to  record  results  in  RequisitePro  in  the  form  of Stakeholder  Requests  documents  and  as  requirements  stored  in  the  database.  Having  stakeholders' needs in the database lets you assign various attributes to them, such as priority or difficulty. It also lets you track the requirements and trace them to other requirement types.
