This is the core functional design document.
*   **Reference Material:** **Chapter 7 ("Creating Use Cases"), specifically Sections 7.4, 7.5, and 7.6**.
*   **What the AI should extract:** The standard Use Case document structure: Brief description, Basic flow, Alternative flows, Special requirements, Preconditions, Postconditions, Extension points, and Scenarios. It must also learn the rules for flow naming conventions (e.g., B1, B2 for Basic flow; A1.1, A1.2 for Alternative flows), and how to establish "Include" and "Extend" relationships to prevent redundancy.
*   **Skill Purpose:** To draft structured Use Cases in Markdown and judge existing ones to ensure alternative flows (error conditions, different paths) have unique sequences of actions and aren't just data variations.

## CHAPTER 7

## Creating Use Cases

A use case is  a description of a system in terms of a sequence of actions. It should yield an observable result or value for the actor interacting with the system. Following are some characteristics of use cases:

- They are initiated by an actor.
- They model an interaction between an actor and the system.
- They describe a sequence of actions.
- They capture functional requirements.
- They should provide some value to an actor.
- They represent a complete and meaningful flow of events.

The purpose of a use case is to facilitate agreement between developers, customers, and users about what the system should do. A use case may be used as a contract between developers and customers. It's also a basis for use case realizations, which play a major role in design. Furthermore, you can derive user documentation from use cases. Use cases may also be useful in planning the technical content of iterations and give system developers a better understanding of the system's purpose.

While creating use cases, we shall also define scenarios -specific paths through a use case. You can produce sequence diagrams, communication diagrams, and class diagrams from scenarios. They are also used as an input for test cases.

In the requirements pyramid, shown in Figure 7.1, use cases are one level below features, and scenarios are one level below use cases.

Use cases are a good way to express functional requirements of the system. The use case model contains all the use cases, actors who interact with use cases, and relationships between them. It defines interactions between the system and actors.

Figure 7.1 Use cases in the requirements pyramid.

## 7.1 Identifying Actors

An actor is someone or something that interacts with the system. It may be a person, but it also may be another system. Here are some examples:

- Users of the system
- Administrators
- Management
- People providing information for the system
- External systems providing data
- External systems that are notified

All stakeholders of the system are also candidates to be actors. Chapter 5, 'Requirements Elicitation,' identified the following stakeholders:

- Travel Agency Owner
- User 1 (from the U.S.)
- User 2 (from France)
- Developer
- Content Manager

- Customer Service Representative
- Administrator
- Hotel Provider, Car Rental Agent, Airline Representative

Let's review them and see who is also an actor:

- Travel Agency Owner may be an actor if he enacts some use cases specific to him. It depends on whether the owner has any specific privileges and if any system functionality is available only to the owner. If he has access to the same functionality as Administrator, there  is  no  need  to  create  a  separate  actor  for  Travel Agency  Owner  because  actor Administrator covers it.
- User 1 and User 2 can be combined into one actor. Because the word 'user' is too generic, let's call the person Traveler. Actor defines a role, not a specific person, so there is only one actor for all people having the same role.
- We still need an actor called User, who will comprise all people having access to the system. Use cases, such as Register or Log In, will be applicable to this actor. Many actors will inherit functionality from User.
- Developer is not an actor, because after the system is created, developers do not interact with it.
- Content Manager is an actor who provides the content through an interface.
- Customer  Service  Representative  is  an  actor  who  has  special  access  to  the  system information.
- Administrator is an actor who performs administrative tasks.
- Hotel Provider, Car Rental Agent, and Airline Representative may be considered three separate actors or one actor called Service Provider. It depends on how the use cases they perform differ. The decision may be made later in the process.

An additional actor is the Airline Reservation System. It does not initiate any use cases, but it receives the information generated during the reservation process.

Some use cases may be initiated not by a person, but according to a schedule (such as a nightly batch initiated every day at a specific hour). In this case we can show on the diagrams an actor Timer initiating these use cases. You can also call this actor System Clock, Time, or any other name that clearly indicates that the use case will start at a specific moment.

## 7.2 Identifying Use Cases

Here are some questions that can help identify use cases:

- What functionality does each actor expect from the system?
- Do actors need to be informed about the events occurring in the system?

- What information do actors need to supply to the system?
- What information do actors need to receive from the system?
- About what events outside the system does the system need to be notified?

Use cases can be identified during a requirements workshop. Here are some guidelines for creating use cases:

- Each use case shall interact with at least one actor.
- Each use case shall be initiated by an actor.
- The  names  of  use  cases  shall  be  meaningful.  Use Search  Reservation and Search Traveler rather than Search 1 and Search 2 .  Never have two use cases with the same name. Names shall be understood not only by the development team, but also by customers and users.
- Use cases shall describe functionality, not the implementation. 'Create Session Bean' is not a good use case.
- It shall be clear who initiates the use case.

Also keep in mind that use cases cannot be too small or too big. For example, Submit credit card information is not a correct use case because it does not represent a complete flow of events and does not provide any value to the actor. It is just one step in the bigger use case Purchase a ticket . If the use case has only one or two steps, it is probably not a correct use case.

As another example, the use case Maintain administrative tasks is too generic and may be split into a few meaningful use cases such as Run report or Update user information .

The following use cases were found for each of the actors in our project:

- User
- Register
- Log in

## · Traveler

- Book a flight
- Purchase a ticket
- Reserve a hotel room
- Find attractions
- Reserve a car

## · Customer Service Representative

- Log in
- Change reservation
- Delete reservation
- Search reservation

## · Administrator

- Register user
- Search for a user
- Update user information
- Log in
- Run report

## · Content Manager

- Log in
- Submit information

## · Hotel Provider

- Log in
- Submit information

## · Car Provider

- Log in
- Submit information

## · Airline Representative

- Log in
- Submit information

The Airline Reservation System does not initiate any use cases.

## 7.3 Use Case Diagrams

Use case  diagrams  represent  actors,  use  cases,  and  the  relationships  between  them. You  can design these diagrams using IBM Rational Rose, IBM Rational Software Architect, Microsoft Visio, and many other tools.

In a use case diagram, shown in Figure 7.2, actors are represented as stick figures, and use cases are represented as ovals. The solid arrow indicates a communication path between an actor and a use case.

Figure 7.2 An actor and a use case.

Use case diagrams illustrate relationships in the use case model. For small systems, the whole use case model may be presented in one diagram. For big systems, we need to split the whole system into many diagrams. There are no strict rules about how the model should be split. Here are some options for what can be grouped in one diagram:

- All use cases initiated by the same actor or group of actors
- Use cases that are usually executed in a given sentence
- Use cases related to the same type of tasks (such as administrative tasks)

Figures 7.3 through 7.5 present initial use case diagrams for the Online Travel Agency project.

Figure 7.3 Use cases initiated by actors Traveler and User.

Figure 7.4 Use cases for actors Customer Service Representative and Administrator.

Figure 7.5 A use case initiated by the Service Provider and Content Manager.

## 7.4 Structuring the Use Case Model

After the initial use case model is done, we can structure it. The main purpose of structuring the model is to remove any redundancy, making the use cases easier to understand and maintain. First, we need to analyze use cases and find any parts of the flows that contain similar steps. Then we can apply some of the three types of relationships between use cases:

- Include
- Extend
- Generalization

We can apply generalization to use cases as well as to actors.

If two use cases are always activated in the same sequence, we may consider combining them. For example, because use case Purchase an airline ticket comes after Book a flight ,  we have decided to merge them.

If the use case is too complicated, we can consider splitting it. One technique to decide when a use case should be split is to look at alternatives. When there is an alternative path for an alternative path, usually this means that the use case is becoming too complex. This is a sign that the use case is a candidate to be split into two different use cases, one extending the base use case.

However, if the use case has many steps that are always performed together in the same sequence, it should not be split into two use cases.

## Include Relationship

If a significant part of the flow is used in more than one use case, it is a good candidate to be extracted  as  a  separate  use  case  that  is  connected  with  an include relationship. The use case instance will contain a base use case as well as the included one. The included use case should be self-contained and cannot make any assumptions about which use case is including it.

To show this relationship in a use case diagram, you need to create a dependency between the two use cases (using a dashed arrow) and then assign an include stereotype to the dependency, as shown in Figure 7.6. The direction of the arrow is from the base use case to the included use case.

Figure 7.6 An include relationship between two use cases.

## Extend Relationship

If some part of the use case is optional or conditional, to make the model more clear, we can extract it as a separate use case that is connected with an extend relationship. Reading the extending use case shall not be necessary to understand the purpose of the base use case.

To show an extend relationship in a use case diagram, create a dependency between the use cases, and then assign an extend stereotype to the dependency. The arrow points to the base use case, as shown in Figure 7.7.

Figure 7.7 An extend relationship between two use cases.

## Generalization Relationship Between Use Cases

If two or more use cases are similar, we can extract similarities into the base use case. Derived use cases can add behavior and modify behavior defined in the base use case. The parent use case does not need to know what children are specializations of it. However, because this technique may be hard for stakeholders to understand, IBM Rational suggests avoiding using use case generalization.

Figure 7.8 shows how use case generalization is presented in use case diagrams.

Figure 7.8 Generalization between use cases.

## Generalization Relationship Between Actors

Generalization can be also used between actors. It is especially useful if a set of actors initiate the same use cases. Figure 7.9 shows how actor generalization is presented in use case diagrams.

Figure 7.9 Generalization between actors.

## 7.5 The Use Case Specification Document

This book uses the following format for a Use Case Specification document:

1. Brief description
2. Basic flow
3. Alternative flows
4. 3.1 Alternative flow 1
5. 3.2 Alternative flow 2
4. Special requirements
5. Preconditions
6. Postconditions
7. Extension points
8. Context diagram
9. Activity diagram
10. State machine diagrams
11. Scenarios

This  outline  contains  some  differences  compared  to  a  use  case  template  included  in RequisitePro:

- Basic flow and alternative flows are split into separate sections to avoid three levels of numbering.
- Context, activity, and state machine diagrams are added.
- Scenarios are added.

The following sections discuss all parts of a use case.

## Brief Description

The description shall clearly explain its purpose. You shall also mention all the actors who interact with the use case.

## Basic Flow

The basic  flow contains  the  most  popular  sequence  of  actions-the  steps  that  happen  when everything goes correctly. In our Online Travel Agency project, the basic flow of the use case Book a flight might look like this:

- B1. Traveler enters the site's URL.
- B2. System displays the home page.

## B3. Traveler enters the following:

- Departure airport, date, time
- Arrival airport, date, time
- Number of traveling adults and children

Traveler selects 'Search flights.'

- B4. System displays outbound flights sorted by price.
- B5. Traveler selects a flight.
- B6. System displays return flights.
- B7. Traveler selects a return flight.
- B8. System displays details of the flight.
- B9. Traveler confirms the flight.
- B10. User provides a userid and password to proceed with buying a ticket.
- B11. Traveler provides passenger information.
- B12. System displays available seats.
- B13. Traveler selects seats.
- B14. Traveler provides credit card information and billing address.
- B15. System provides a confirmation number.

## Alternative Flows

Alternative flows represent variations of the flow, including less usual cases and error conditions. The following questions can help find alternative flows:

- What other action can be taken at each step of the basic flow?
- What errors can occur in each step (wrong data, missing data, connection problems)?
- Is there a behavior that can happen at any time (such as exit, print, help)?
- Will any conditions (such as a specific combination of entered data) significantly change the flow?

In the literature you will find two words used to describe these flows. Some sources use the word alternative ,  and others use alternate .  Both words are correct, and they are used as synonyms.

This book uses the following convention to name the flows:

- Basic flow: B
- Alternative flows: A1, A2, A3,…
- Steps in a basic flow: B1, B2, B3,…

- Steps in alternative flow 1: A1.1, A1.2, A1.3,…
- Steps in alternative flow 2: A2.1, A2.2, A2.3,…

There is no universal standard for how to number the steps in a use case. Some people use sequential numbers 1, 2, 3…, and others use 2.1, 2.2, 2.3… (because it is in section 2 of the document). Some people do not number steps at all. I do not recommend this approach because that would make it difficult to refer to specific steps.

Here are the alternative flows for the use case Book a flight :

## A1. Comparison of flights from nearby airports

- A1.1. In step B3 the Traveler selects the option 'Compare surrounding airports.'
- A1.2. The system shows a list of airports within 100 miles of the departure and destination airports.
- A1.3. The Traveler selects which airports shall be considered.
- A1.4. The flow returns to step B4 of the basic flow.

## A2. Sorting the flights

- A2.1. After step B4 the Traveler changes the sorting of the flights.
- A2.2. The system presents the flights sorted by a selected criterion.
- A2.3. The flow returns to step B5 of the basic flow.

## A3. Saving the itinerary

- A3.1. After step B8 the Traveler selects an option to save the itinerary and exit.
- A3.2. The system returns to the home page.
- A3.3. The use case ends.
- A4. Going back to return flight selection
- A4.1. After step B8 the Traveler returns to return flight selection.
- A4.2. The flow returns to step B6 of the basic flow.
- A5. Going back to outbound flight selection
- A5.1. After step B8 the Traveler returns to outbound flight selection.
- A5.2. The flow returns to step B4 of the basic flow.

## A6. New user

- A6.1. After step B9 the Traveler selects the option New User.
- A6.2. The system prompts for user information.
- A6.3. The  Traveler  registers  by  providing  first  and  last  name,  address,  e-mail address, and selected password.
- A6.4. The system confirms that the e-mail address is unique and will be treated as the user ID.
- A6.5. The flow returns to step B11 of the basic flow.

- A7. New user ID is not available
- A7.1. After step A6.3 of alternative flow A6, the system returns a message that the supplied e-mail ID is already taken.
- A7.2. The Traveler provides a new e-mail address.
- A7.3. The flow returns to step A6.4.
- A8. Wrong password
- A8.1. After step B10 of the basic flow, the system returns an error message saying that the password is wrong.
- A8.2. The Traveler supplies the correct combination of e-mail and password.
- A8.3. The flow returns to step B11 of the basic flow.

The alternative flows shall have unique sequences of actions; they cannot differ just in data. For example, if alternative flow A1 had no extra step in which the Traveler selects airports, it would not be a good candidate for an alternative flow:

- A1. Comparison of flights from nearby airports
- A1.1. In step B3 the Traveler selects the option 'Compare surrounding airports.'
- A1.2. The  system  displays  outbound  flights  that  include  flights  from  airports within 100 miles of the selected departure and destination airports.
- A1.3. Flow returns to step B5 of the basic flow.

This flow should not be extracted as a separate alternative flow because the sequence of steps is the same as in the basic flow. The difference is only in the data. On the input screen an additional option is selected, and on the output screen additional flights are presented. However, this case should be considered as a separate test case while deriving test cases from this use case (see Chapter 10, 'Creating Test Cases from Supplementary Requirements').

While structuring the use case model, we may consider making two changes:

- Because the functionality of logging in may be used in other use cases, step B10 and alternative flow A8 can be extracted into a separate use case called Login .
- Because we have an alternative flow (A7) of another alternative flow (A6), the structure of the use case becomes quite complex. To avoid this, we can extract the functionality of A6 and A7 into a separate use case called Register .

## Special Requirements

The Special Requirements section contains all the requirements related to this use case that were not covered by the flows of events. Usually these are nonfunctional requirements. However, if a requirement is generic and applies to many use cases, it shall be described in a Supplementary Specification.

## Preconditions

A precondition is the system's state before the use case can start. For example, a precondition to the use case Search reservation may be Administrator must be logged into the system .

## Postconditions

A postcondition is the system's state after the use case ends. Unless it's specifically mentioned, a postcondition shall be valid for any alternative flows, not just for the basic flow.

## Extension Points

An extension point is a place from which an extending use case can be invoked. For example, the use case Delete reservation may have the following extension:

Name: Process refund

Location: After step B5 of the basic flow

## Context Diagram

A context diagram , shown in Figure 7.10, is part of a use case diagram showing the relationships of this particular use case to actors and other use cases. All use cases having include, extend, or generalization relationships with the given use case should also be shown on the context diagram.

Figure 7.10 A context diagram for the use case Book a flight.

The context diagram and the activity diagram are not necessary, but they help you visualize the use case and its position in the project.

## Activity Diagram

An activity diagram , shown in Figure 7.11, is similar to a flow chart. It can be used to graphically represent flows in the use case. Boxes with rounded corners represent activity states, arrows represent transitions, and branches are modeled as diamonds. One activity diagram should contain the basic flow and all alternative flows. Steps that do not have any branches in between may be combined.

It is good practice to represent a basic flow as a straight line, while portraying alternative flows as loops or branches.

Activity diagrams can be created easily using various modeling tools, such as Rational Rose, Rational Software Architect, Rational Data Architect, Rational Software Modeler.

Figure 7.11 An activity diagram representing the use case Book a flight. (continues)

Figure 7.11 An activity diagram representing the use case Book a flight. (continued)

## State Machine Diagrams

Sometimes we may need to describe the behavior of objects that act differently depending on their state. In this case we can use UML 2 state machine diagrams [AMB04]. In previous versions of UML, these diagrams were called state chart diagrams, and in other modeling languages, they are called state-transition diagrams or just state diagrams.

UML state machine diagrams depict the various states that an object may be in and the transitions  between  those  states.  For  example,  an  object  Flight  may  be  in  the  state  Reserved  or Booked.

The rounded rectangles represent states. The arrows represent transitions from one state to another triggered by an event. Dark circles represent initial and final states.

This section of the use case document is optional.

## Scenarios

A scenario is an instance of a use case. It describes one specific path through the flow of events. It is important to identify all valid scenarios for every use case. They will be used for analysis and design, as well as to derive test cases from the use cases. The next section discusses how to find all the scenarios.

## 7.6 Scenarios

To find all the scenarios, we need to identify all paths through the given use case. Figure 7.12 shows a hypothetical graph representing a use case with a basic flow B and alternative flows A1, A2, A3, and A4. To find all scenarios, we need to draw all possible lines through this graph.

Figure 7.12 Finding scenarios in a use case.

There is one scenario for a basic flow, one scenario for each alternative flow, and one scenario for each combination of alternative flows. There are more scenarios than alternative flows because there is one for A1, another one for A2, and one scenario that will be a combination of these two.

The easiest way to describe a scenario is to provide a sequence of alternative flows. For example, do flow A3 and then A4:
SC5: A3, A4

We do not need to add B showing the basic flow because almost all scenarios start with the basic flow anyway.

Another way to describe a scenario is to list all its steps, but this is both more difficult and unnecessarily detailed:
SC5: B1, B2, A3.1, A3.2, A3.3, A4.1, A4.4, A4.3

What should you do if you have infinite loops (loops going backwards)? Theoretically, this would generate an infinite number of scenarios. Figure 7.13 shows an infinite loop.

Figure 7.13 An infinite loop.

The reasonable approach is to do the basic flow once, do a loop once, and then do a loop a second time. If the program works for both instances of the loop, you can assume it will work for many loops.

The Book a flight use case has a basic flow and eight alternative flows, as shown in Table 7.1. Figure 7.14 was derived from the activity diagram shown in Figure 7.11. Five of the alternative flows are going backwards, and the other three are going forward. If you wanted to describe all possible alternative flow combinations, you would have a few thousand scenarios. Obviously you do not need to do all of them.

Table 7.1 Flows in the Book a Flight Use Case

| Flow ID   | Name                                       |
|-----------|--------------------------------------------|
| B         | Basic flow                                 |
| A1        | Comparison of flights from nearby airports |
| A2        | Sorting the flights                        |
| A3        | Saving the itinerary and exiting           |
| A4        | Going back to return flight selection      |
| A5        | Going back to outbound flight selection    |
| A6        | New user                                   |
| A7        | New user ID is not available               |
| A8        | Wrong password                             |

Figure 7.14 A diagram showing basic and alternative flows.

Choose which scenarios represent a reasonable subset of these eight thousand scenarios. Usually it is wise to select a basic flow, one scenario covering each alternative flow, and some reasonable combinations of alternative flows. Using the flows from Table 7.1, it probably will not make sense to add a scenario that contains both flows A1 and A8 because they are so far apart on

the diagram that they do not have any influence on each other. But it makes sense to do A1 and A2 because they are immediately after each other and may be related.

Table 7.2 illustrates the selected scenarios: one representing the basic flow, eight representing each alternative flow, and 13 reflecting some combination of the flows.

Table 7.2 Scenarios Selected for Testing in the Book a Flight Use Case

| Number      | Sequence of Flows   | Description                                            |
|-------------|---------------------|--------------------------------------------------------|
| Scenario 1  | B                   |                                                        |
| Scenario 2  | A1                  | Nearby airports                                        |
| Scenario 3  | A2                  | Sorting                                                |
| Scenario 4  | A3                  | Saving and exiting                                     |
| Scenario 5  | A4                  | Back to return flight selection                        |
| Scenario 6  | A5                  | Back to outbound flight selection                      |
| Scenario 7  | A6                  | New user                                               |
| Scenario 8  | A6,A7               | User ID not available                                  |
| Scenario 9  | A8                  | Wrong password                                         |
| Scenario 10 | A1,A2               | Nearby airport, then sorting                           |
| Scenario 11 | A1,A5               | Back to outbound flight selection with nearby airports |
| Scenario 12 | A1,A4               | Back to return flight with nearby airports             |
| Scenario 13 | A2,A2               | Changing sorting sequence twice                        |
| Scenario 14 | A4,A3               | Back to return flight, then save                       |
| Scenario 15 | A4,A5               | Back to return flight, then back to beginning          |
| Scenario 16 | A5,A4               | Change outbound flight, then change return flight      |
| Scenario 17 | A5,A3               | Change outbound flight, then save                      |
| Scenario 18 | A4,A4               | Change return flight twice                             |
| Scenario 19 | A5,A5,A4            | Change outbound flight twice, then return flight once  |
| Scenario 20 | A5,A5,A3            | Change outbound flight twice, then save                |
| Scenario 21 | A6,A7,A7            | Unavailable ID twice                                   |
| Scenario 22 | A8,A8               | Wrong password twice                                   |
