This captures all non-functional requirements (like performance, security, and usability) and generic functional requirements not tied to a single Use Case.
*   **Reference Material:** **Chapter 8 ("Supplementary Specification"), specifically Sections 8.2 and 8.4**.
*   **What the AI should extract:** The **FURPS+ classification system** (Functionality, Usability, Reliability, Performance, Supportability, Design constraints, Implementation, Interface, Physical, Documentation, Licensing/Legal). It should also extract evaluation metrics like "Importance" (Mandatory, Desirable, Nice to have) and "Satisfaction Shape" (Sharp, Medium, Linear) to judge the feasibility and priority of the requirements.
*   **Skill Purpose:** To evaluate your non-functional requirements to ensure they are testable (e.g., rejecting "The system shall be fast" and requiring "Average system response time should be less than two seconds").

## CHAPTER 8

## Supplementary Specification

The Supplementary Specification captures all requirements that cannot be expressed in use cases. This does not mean, however, that all functional requirements are in use cases and that all nonfunctional requirements are in the Supplementary Specification. The Use Case Specification also contains  nonfunctional  requirements  if  they  apply  to  only  one  use  case.  The  Supplementary Specification contains all generic functional requirements that are not associated with any specific use case. Table 8.1 illustrates what type of requirement is found in which document.

Table 8.1 Allocation of Software Requirements Between the Use Case Specification and Supplementary Specification

| Requirement Type   | Use Case Specification                                           | Supplementary Specification                                |
|--------------------|------------------------------------------------------------------|------------------------------------------------------------|
| Functional         | Basic flow and alternative flows related to a specific use case. | Functional requirements related to more than one use case. |
| Nonfunctional      | Nonfunctional specification related to only one use case.        | Nonfunctional requirements related to many use cases.      |

A common impression is that functional requirements are only in the Use Case Specification and that nonfunctional requirements are in the Supplementary Specification. This may be because

- Nonfunctional requirements usually apply to the system as a whole and not to any specific use case (so they are in the Supplementary Specification).
- Functional requirements are most often related to a specific flow of events (so they are in the Use Case Specification).

Supplementary requirements are also called architectural requirements [EEL01] or quality factors [LAU02]. These concepts are not completely synonymous with supplementary requirements, but they mean almost the same thing in the context of the software development process.

Recently the name of the artifact was changed in Rational Unified Process (RUP) from 'Supplementary Specification' to the plural 'Supplementary Specifications' to reflect the fact that we may use more than one document to capture supplementary requirements.

In the requirements pyramid, supplementary requirements are on the same level as use cases, as shown in Figure 8.1.

Figure 8.1 The location of supplementary requirements in the requirements pyramid.

## 8.1 Eliciting Supplementary Requirements

Gathering supplementary requirements is quite a challenging task because of the following:

- Customers often forget about these requirements and do not provide them unless asked.
- Customers are usually unaware of the cost of improving specific metrics.
- Nontechnical users often have trouble understanding the implications of some technical requirements.
- Some requirements are difficult to measure, such as 'The system must be easy to learn.'

The following approach suggested by Peter Eeles [EEL01] addresses these problems:

1. Create a list of all categories of supplementary requirements.
2. For each category, create one or more questions.

3. Explain to the customer the impact and cost of each decision.
4. Capture the customer's response to each question.
5. Assign priority or weight to each requirement.

In step 3, while explaining the impact, we need to mention the cost (a longer development time equals greater development cost).

Section 8.2 presents a sample checklist of requirements.

Most often these types of requirements are gathered using interviews and questionnaires. Usually they do not change too much while being transformed from needs to features to supplementary requirements. Eeles suggests that you create a new type of requirement, Supplementary Stakeholder's Request (SSTRQ), and distinguish this type of requirement from those already at the stakeholder requests level (the top level, called needs in Figure 8.1).

## 8.2 Classification of Supplementary Requirements

Many attempts have been made to classify supplementary requirements. One of the first classifications  was  published  by  McCall and  Matsumoto [MCC80].  It  is  shown  in  Table  8.2.  The International Organization for Standardization uses the classification shown in Table 8.3 [ISO91].

Table 8.2 Classification Proposed by McCall and Matsumoto

| Category   | Subcategory      |
|------------|------------------|
| Operation  | Integrity        |
|            | Correctness      |
|            | Reliability      |
|            | Usability        |
|            | Efficiency       |
| Revision   | Maintainability  |
|            | Testability      |
|            | Flexibility      |
| Transition | Portability      |
|            | Interoperability |
|            | Reusability      |

Table 8.3 Classification Used by ISO

| Category        | Subcategory      |
|-----------------|------------------|
| Functionality   | Accuracy         |
|                 | Security         |
|                 | Interoperability |
|                 | Suitability      |
|                 | Compliance       |
| Reliability     | Maturity         |
|                 | Fault tolerance  |
|                 | Recoverability   |
| Usability       | Usability        |
| Efficiency      | Efficiency       |
| Maintainability | Testability      |
|                 | Changeability    |
|                 | Analyzability    |
|                 | Stability        |
| Portability     | Adaptability     |
|                 | Conformance      |
|                 | Replaceability   |

This book follows the classification proposed by Robert Grady [GRA92] and adapted by Rational Software. This classification is called FURPS+, which stands for Functionality, Usability, Reliability, Performance, and Supportability. The + is a placeholder for the various types of constraints: Design, Implementation, Interface, and Physical. The Software Specifications template found in the RUP [RUP04] also contains the following separate sections:

- Online User Documentation and Help System Requirements
- Purchased Components
- Licensing Requirements
- Legal, Copyright, and Other Notices
- Applicable Standards

There is some flexibility in placing these requirements:

- Online User Documentation and Help System Requirements can be included in Functionality Requirements.
- Purchased Components can be described in Implementation Constraints.
- Licensing Requirements can be combined with Legal and Copyright requirements.
- Applicable Standards can be described in Implementation Constraints or the Compliance section.

The RUP template does not list Implementation and Physical requirements as separate sections because they may be described in the Design Constraints section.

The classification proposed in this chapter is an attempt to cover many types of requirements (gathered from various classifications) and present them consistently with the FURPS+ structure (see Table 8.4). This classification includes five categories covered by FURPS, four categories covered by +, and two categories from the RUP template.

Table 8.4 Categories of Supplemental Requirements

| Category      | Subcategory              |
|---------------|--------------------------|
| Functionality |                          |
| Usability     | Accessibility            |
|               | Aesthetics               |
|               | UI consistency           |
|               | Ergonomics               |
|               | Ease of use              |
| Reliability   | Availability             |
|               | Robustness               |
|               | Accuracy                 |
|               | Recoverability           |
|               | Fault tolerance          |
|               | Safety                   |
|               | Security                 |
|               | Correctness              |
| Performance   | Throughput               |
|               | Response time            |
|               | Recovery time            |
|               | Startup/shutdown time    |
|               | Capacity                 |
|               | Utilization of resources |

| Category                         | Subcategory      |
|----------------------------------|------------------|
| Supportability                   | Testability      |
| Supportability                   | Adaptability     |
| Supportability                   | Maintainability  |
| Supportability                   | Compatibility    |
| Supportability                   | Configurability  |
| Supportability                   | Upgradeability   |
| Supportability                   | Installability   |
| Supportability                   | Scalability      |
| Supportability                   | Portability      |
| Supportability                   | Reusability      |
| Supportability                   | Interoperability |
| Supportability                   | Compliance       |
| Supportability                   | Replaceability   |
| Supportability                   | Changeability    |
| Supportability                   | Analyzability    |
| Supportability                   | Localizability   |
| Design constraints               |                  |
| Implementation requirements      |                  |
| Interface requirements           |                  |
| Physical requirements            |                  |
| Documentation requirements       |                  |
| Licensing and legal requirements |                  |

The following sections describe each category. None of them is obligatory. Many of them can be omitted if they are not applicable. However, a requirement should be excluded as the result of a planned decision of a customer and a system analyst, not because its importance was not analyzed.

## Functionality

This section contains functional requirements that were not captured in any of the use cases. It usually includes some generic functions available from many places in the system. Examples include printing, online help, and reports.

Example: Online help shall be available from the menu on every page.

However, if the functionality is more complicated and cannot easily be expressed in a few sentences, we may need to create additional use cases to describe it.

## Usability

The concept of usability is multifaceted. This section defines usability requirements in several areas:

## · Accessibility

Ease of access to and use of specific functionality.

Example: Booking an airplane ticket functionality shall be available from the home page.

Example: Renting a car functionality shall be available after no more than one click from the home page.

## · Aesthetics

Aesthetics of the user interface and description of 'look and feel.'

Example: Multiple entry fields on one page shall be vertically aligned.

## · UI consistency

Consistency of the user interface, both within the system and with other systems.

Example:  User  interface  shall  be  consistent  with  IBM  CUA  standard. [CUA91a] [CUA91b]

To avoid ambiguity, when we mention a standard, it is worth providing a reference to a source where this standard is described.

## · Ergonomics

Ergonomic aspects of the user interface (avoiding unnecessary clicks, avoiding uncomfortable movements with the mouse, and so on).

Example: When a dialog box is opened, the focus shall be on the first entry field in the dialog box.

## · Ease of use

Ease of learning and using the system.

Example: No technical skills (except for using the browser) shall be required to use the system.

Example: Service provider shall be able to learn to use the system in one hour.

Example: Average time of booking a hotel room shall be no longer than ten minutes.

If you do not want to create this special section, these requirements can also be inserted in the Accessibility section.

## Reliability

This section covers the various aspects of system dependability:

## · Availability

Percentage of time the system is available, mean time between errors.

Example: Mean Time Between Failures (MTBF) shall be at least 30 days. Example: System shall be available 99.93% of the time.

## · Robustness

Capability of the system to resist external disturbance, such as invalid input or shortage of resources.

Example: For every invalid input from the user, the system shall display a meaningful error message explaining what format of input is expected.

## · Accuracy

Preciseness with which the system calculates values.

Example:  Currency  amounts  shall  be  calculated  and  stored  with  accuracy  of  two decimal places.

## · Recoverability

How elegantly the system recovers from a failure. In this section we are concerned about elegance and lack of side effects, while time of recovery is described in the Performance section. However, it is also okay to combine both aspects of recovery in one place.

## · Fault tolerance

Sensitivity of the system to failure of some of its parts.

## · Safety

Any threats to users, data, system components, or interoperating systems presented by use of the system.

## · Security

Level of protection regarding access to specific parts of the system.

Example: Password shall be required to access administrator screens.

## · Correctness

How error- or defect-free the system shall be.

Example: When returning a list of flights, the system cannot miss any direct flight or any flight with only one stopover.

Example: After releasing to production, the system shall have zero critical defects, zero significant defects, and no more than 20 minor defects.

Ideally the system shall not have any defects. This goal, however, is often unrealistic within the available time constraints.

## Performance

This section covers the various indicators of system performance.

## · Throughput

The rate at which the system performs its tasks. This can be expressed, for example, in the number of transactions per minute.

Example: The system shall accommodate 1,000 booked flights per minute.

## · Response time

How fast the system responds to events.

Example: Average system response time should be less than two seconds.

Example: Average time of returning a list of flights shall not be greater than ten seconds.

The second requirement is related to one specific system response when the user searches matching flights in the use case Book a flight . In this situation it is better to insert it into the Special Requirements section in the Use Case Specification. Requirements in this section take precedence over generic requirements from the Supplementary Specification.

## · Recovery time

How fast the system recovers from failure. It is important to distinguish between the time  when  the  system  becomes  operational  from  the  user's  point  of  view  (usually because a redundant system resumes operations) and the time when the problem is actually fixed. Although switching to a redundant system is usually done automatically, fixing the original problem quite often requires human intervention.

Example: In case of a system failure, a redundant system shall resume operations within 30 seconds.

Example: Average repair time shall be less than one hour.

## · Startup/shutdown time

The length of time it takes to start up and shut down.

Example: The system shall be operational within one minute of starting up.

## · Capacity

The number of users that the system can accommodate.

Example: The system shall accommodate 5,000 concurrent users.

## · Utilization of resources

Utilization of memory, disk space, database storage, and so on.

Example: The system shall store in the database no more than one million transactions. If the database grows over this limit, old transactions shall be backed up and deleted from the operational database.

These requirements may also be described under Implementation Requirements.

## Supportability

Supportability is concerned with numerous aspects of sustaining and modifying the system.

## · Testability

How easy it is to test the system. Is integration with any testing tools required?

Example: The user interface shall not contain any components that would prevent automated testing using IBM Rational Robot and IBM Rational Functional Tester.

## · Adaptability

How easily the system adapts to new environments.

Example: Deployment time on a new version of WebSphere Application Server shall be no longer than one day.

## · Maintainability

How easy it is to locate and repair errors.

Example: An error log containing information about all critical errors shall be accessible to the system administrator over the Internet so that it can be checked remotely at any time.

## · Compatibility

The system's degree of compatibility with previous versions of the system, with the system it is replacing, and with interfaces.

Example: After the system is in production, subsequent versions of the system shall be backward-compatible. All transactions entered in previous versions shall be available in the new version.

## · Configurability

How configurable the system is after it is installed. What features shall be configurable?

## · Upgradeability

How easy it is to expand the system with new features.

Example:  No  installation  on  the  client's  workstation  shall  be  required.  All  system upgrades and new releases should be done on the server.

Configurability and upgradeability are sometimes called flexibility.

## · Installability

Ease of system installation.

Example: Installing a new version of the system shall not require any installation on users'workstations.

## · Scalability

How easy the system scales data volume or users.

What volume of users the system shall support over time.

Example: After six months of operation, the system shall be able to accommodate an additional 5,000 users.

## · Portability

How easy it is to move to another software or hardware platform.

Example: Changing the system database in the future shall not require rewriting application logic.

## · Reusability

How easy it is to reuse parts in other systems.

Example: The system's main functionality (booking the flight, purchasing an airplane ticket, reserving a hotel room, reserving a car) shall be encapsulated in components that can be reused in a client/server (non-Internet) application.

## · Interoperability

How easy it is to cooperate with other systems.

Interoperability  is  the  ability  of  products,  systems,  or  business  processes  to  work together to accomplish a common task.

Example: The system shall automatically  book  a  ticket  with  the Airline  Reservation System without the necessity of human intervention.

## · Compliance

How well the system meets standards and regulations.

Ex: Gathering personal information of a person purchasing airplane tickets shall be in compliance with the Patriot Act.

- Replaceability

How easy it is to replace system components.

- Changeability

How easy it is to change the system's functionality.

- Analyzability

How easy it is to analyze the system.

- Auditability

How easy it is to audit the system's operation.

## · Localizability

The languages the system supports. How easy it is to expand the system with a new language.

Example: The application shall be available in English, French, and Spanish.

## Design Constraints

Requirements related to the system's design and architecture.

Example: The system shall be based on J2EE architecture.

## Implementation Requirements

Examples of implementation requirements include the following:

- Computer languages used to develop the system
- Operating systems and their versions
- Databases being used
- Third-party components
- Resource limits: memory, disk space
- Coding standards

## Interface Requirements

This section describes various interfaces:

- User interfaces
- Hardware interfaces
- Software interfaces
- Communications interfaces

## Physical Requirements

Physical requirements are usually related only to hardware on which the system is deployed. It can specify, for example, the device's shape, size, or weight. It is not applicable to web-based applications.

## Documentation Requirements

Requirements related to the documentation may contain

- Printed documentation
- Documentation available on CD
- Documents available online
- Online Help

Example: The Administrator's Guide shall be available as a PDF document.

The online portion of these requirements (including Help) is sometimes provided in the Functionality section of the Supplementary Specification.

## Licensing and Legal Requirements

This section contains legal, regulatory, and licensing requirements.

Example: On the pages that gather the user's personal data, there shall be a link to a page describing the privacy policy.

## 8.3 Deriving Supplementary Requirements from Features

Many features that were defined in the Vision document become supplementary requirements. Including them in the Supplementary Specification provides an opportunity to add more details and organize the requirements by inserting them in the appropriate section. One approach is to go through all the features, identify which ones were not addressed in use cases, and translate them into supplementary requirements. Quite often no changes are necessary, and we can use the same wording as in features.

Out of all the features derived in Chapter 6, 'Developing a Vision Document,' fifteen are nonfunctional requirements that were not reflected in any of the use cases. Let's analyze each of them and use them as a basis for creating supplementary requirements:

FEAT2 Dates  shall  be  displayed  according  to  the  format  stored  in  web  browser settings.

FEAT3 On data entry screens, the system shall indicate which fields are mandatory by placing a star next to the field.

FEAT8 The system shall display a pop-up calendar when any date is entered, such as a flight date, hotel stay date, or car rental date.

FEAT11 Separate tabs shall be available for the main functionality.

FEAT12 On each page a Next button shall suggest a default flow.

All  of  these  features  are  usability  requirements  and  can  be  moved  to  supplementary requirements without any changes. By default, RequisitePro adds the SUPL prefix to all supplementary requirements, along with a consecutive number. In this chapter we will prefix requirements with SUPL without a number.

Let's continue going through all the features.

FEAT23 The system shall use J2EE architecture.

This requirement is a design constraint. It can be rewritten as is.

The next two requirements are implementation constraints:

FEAT24 If the architecture requires an application server, IBM WebSphere shall be used.

FEAT25 If the system requires a database, Oracle shall be used.

If we do not have a separate section for implementation requirements, these two requirements will be in design constraints. At this stage of the project, quite often the system architect has already made basic architecture decisions, and we know that an application server and relational database are required, so we can remove conditions from these statements:

SUPL IBM WebSphere shall be used as an application server.

SUPL Oracle shall be used as a database.

The next feature specifies on which browser the application shall work:

FEAT34 The system shall be fully tested on the following browsers: Internet Explorer and Netscape.

This requirement shall be qualified by versions of the software:

SUPL The system shall be fully tested on the following browsers: Internet Explorer (version 6.0 and newer) and Netscape (version 6 and newer).

Next is a reliability/availability requirement:

FEAT27 The system must be available 24 hours a day, with a degree of reliability appropriate to commercial applications.

Because this is too generic, while transforming it into supplementary requirements we can split it into more precise statements:

SUPL The system shall be available 24 hours a day, 7 days a week.

SUPL The average time between failures shall be at least 20 hours.

- SUPL The system may be unavailable no more than one minute per 24 hours.
- SUPL The system shall be available 99.93% of the time.

The last two requirements are equivalent. They express the same measurement in a different way. It is enough to include only one of them.

Next is a supportability/maintainability requirement, but it can also be treated as a usability requirement:

FEAT35 All  transactions  and  errors  shall  be  recorded  and  made  available  to  the administrator.

Because the error log and transaction log probably will be implemented separately, for traceability purposes it is better to split this requirement into two:

SUPL All system errors shall be recorded and made available to the administrator.

SUPL All transactions (ticket purchase, making a reservation, updating a reservation, and canceling a reservation) shall be recorded and made available to the administrator.

The next two are reliability/security requirements:

FEAT26 The pages where service providers can submit their offers shall be passwordprotected. Hotel providers, car providers, and airline representatives shall use assigned user IDs and passwords to access these pages.

FEAT29 Users shall pick IDs and passwords while buying an airline ticket.

The next requirement is quite complex:

FEAT36 The following reports shall be available to the administrator:

A list of all airline tickets purchased in the given time period.

A list of all car reservations in the given time period.

A list of all hotel room reservations in the given time period.

This requirement requires some explanation. For example, the following aspects of the requirement need elaboration:

- From where the reports shall be available
- What search attributes shall be available
- How to select available reports

In this situation it is better to create a separate use case rather than to include the requirement in the Supplementary Specification.

The next requirement does not describe the system itself, but the way in which the system is produced:

FEAT28 The system shall be developed three months from the date when the customer signs off on the Use Cases and Supplementary Specification.

The best place to have this type of restriction is in a contract or statement of work, not in system requirements documents. However, if we want to include it in the Supplementary Specification,  we can create a separate section called Development Process Requirements. Here are some other requirements that may fall into the same category:

Example: Development shall be done at the customer's premises.

Example: The testing team shall include at least two manual testers and two testers proficient in Rational Robot.

Example: The system shall be developed using the RUP.

## 8.4 Attributes of Supplementary Requirements

The default attributes of supplementary requirements are

- Priority
- Status
- Difficulty
- Stability
- Risk
- Contact Name

This list may vary slightly depending on the version of RequisitePro.

Some requirements (especially performance-related) may vary, depending on the number of users. In this case we can use a method suggested by Mark Lines: create a table with performance requirements by number of simultaneous users to show acceptable degradation. Table 8.5 shows an example. You may need a separate table for each relevant use case transaction.

Table 8.5 Differentiating Requirements Depending on the Number of Concurrent Users

| Number of Simultaneous Users   |   Maximum Transaction Time (in Seconds) |
|--------------------------------|-----------------------------------------|
| 1 to 10                        |                                       3 |
| 11 to 50                       |                                       5 |
| 51 to 100                      |                                       7 |
| More than 100                  |                                      10 |

This  section  discusses  two  other  attributes  that  may  be  useful  for  supplementary requirements.

- Author
- Location
- Enhancement Request
- Defect
- Obsolete

## Importance

Whereas all  functional  requirements  are  usually  truly  required  in  the  system,  nonfunctional requirements may have different levels of importance. For example, some of them are mandatory:

The application shall be available for Internet Explorer browser users.

If Internet Explorer is not supported, the majority of Internet users will not be able to use the application.

Some requirements are desirable:

Subsequent screens shall appear in less than two seconds.

If it is not two seconds but four seconds, users will be less happy, but they will still be able to use the application.

Some requirements are not so important:

The system shall be operational within one minute of starting up.

The system is restarted only once in a few days, and the system administrator is the only person who waits during this time, so even if it lasts five or ten minutes, this is not a big deal.

Understanding the levels of importance will help you correctly allocate the resources to design and implement appropriate solutions with a reasonable cost.

To store the levels of importance, we may create a new attribute called Importance having three possible values:

- Mandatory
- Desirable
- Nice to have

If you do not want to create a new attribute, you may use Priority to store these values (however, priority and importance are not exactly synonyms).

## Satisfaction Shape

Another attribute that is applicable to supplementary requirements is satisfaction shape . This attribute describes how customers' satisfaction changes with the fulfillment of required metrics.

Satisfaction shape may have the following values:

- Sharp: The metrics used in the requirement shall be fulfilled exactly as described. The measurement cannot be even slightly worse.
- Medium: The value of measurement shall be quite close to expected values. However, a small discrepancy is okay.
- Linear: The better  the  result,  the  better  the  satisfaction;  however,  there  are  no  strict expected values.

Let's analyze some examples.

## Sharp Satisfaction Shape

Imagine a real-time system for sorting packages. Packages are moving on the conveyor belt. The system scans an address label on the package and, based on the destination, instructs the diverter to divert to an appropriate belt. The requirement is that the system shall calculate the diverter's proper action within one second. If it fails, the package moves past the diverter.

In this case the response time shall be less than one second, otherwise the whole system will not work. However, it does not matter if this is done in 0.99 seconds or 0.5 seconds. There is no additional value in having a shorter response time.

Figure 8.2 shows the satisfaction shape for this requirement. For all values less than one second the satisfaction is one, and for all values greater than one second the satisfaction is zero.

Figure 8.2 Sharp satisfaction shape.

## Medium Satisfaction Shape

Let's assume that in some systems the batch files and process transactions from the previous day are run at midnight. At 8 a.m. a person comes to the office who is supposed to analyze results from night batches. This means that the batch processing shall be done in eight hours. If it is done in 8.5 hours, this is not a big deal, but nine or ten hours is a problem. The satisfaction shape may look like Figure 8.3.

Whether  the  value  of  the  satisfaction  line  is  decreasing  or  increasing  depends  on  the requirement. For example, for the requirement 'The system shall accommodate 5,000 concurrent users,' the higher the satisfaction values are, the greater the number of users on the horizontal axis, as shown in Figure 8.4.

Figure 8.3 Medium satisfaction shape for the processing time requirement.

Figure 8.4 Medium satisfaction shape for the number of concurrent users requirement.

The line does not need to be symmetric.

## Linear Satisfaction Shape

The reports shall be displayed in 20 seconds or less. Twenty seconds is just a reasonable figure providing a good expectation per cost ratio (see Figure 8.5).

Importance does not necessarily go with the satisfaction shape. For example, the number of concurrent users is very important, but it is not sharp. There is no big difference between 4,900 and 5,100 users.

Figure 8.5 Linear satisfaction shape.

## 8.6 Traceability to Supplementary Requirements

Most supplementary requirements are traced from features. Depending on the project guidelines, we may also allow them to be traced  directly  from  stakeholder  requests. We  can  also  allow requirements to be added directly on the supplementary requirements level. However, these decisions should be made while developing the Requirements Management Plan; they should not be made ad hoc while finalizing the Supplementary Specification.

## Setting the Type Attribute for Features

To facilitate setting traceability from features to supplementary requirements, it is worth setting values of the Type attribute for features. Depending on the version of RequisitePro that you use, this  attribute  may  already  be  defined.  In  version  2003.06.13  this  attribute  has  the  following values:

- Functional (non-use case)
- Usability
- Reliability
- Performance
- Supportability
- Design Constraint
- Implementation Reqt
- Physical Reqt
- Interface Reqt

You can use these predefined values, or you can change to a set that better fits your needs. For example, if you want less granularity, you may use only four values:

- Functional: UC specific
- Functional: Generic
- Non-functional: UC specific
- Non-functional: Generic

To handle these four options, you can either set a type of attribute to List (Single Value) and enter them as listed here, or set a type of attribute to List (Multiple Value) and specify the following options (see Figure 8.16):

- Functional
- Non-functional
- UC specific
- Generic

Figure 8.16 An attribute with a multiple-value list.

For multiple-value lists you can enter more than one value, such as Functional and UC specific . However, be sure that you enter a valid combination of attribute values. For example, you would not enter UC specific with Generic .

If you did not set the Type attribute while entering features, you can do so now. The fastest way to set attributes of multiple requirements is from a view. First, check if the required attribute is in the view. If the attribute Type does not show up in the spreadsheet, you need to add it to the view by following these steps:

1. Right-click the title row of the view and select Displayed Attributes.
2. In the left window, select the attributes that you want to see in the view, as shown in Figure 8.17.

Figure 8.17 Setting which attribute shall appear in the view.

3. In the right window you can set the order in which the attributes will appear.

To set attributes of multiple requirements, follow these steps:

1. Double-click the All Features view in the Features and Vision package.
2. Double-click a cell at the intersection of the column Type and row with a requirement that you want to update.
3. Select an appropriate value from the list box, as shown in Figure 8.18.

Figure 8.18 Setting attribute values from the view.

## Setting Traceability

If the view with the Traceability Matrix from FEAT to SUPL is not set up already, you can create it by following these steps:

1. Right-click the Supplementary Requirements package and select New &gt; View.
2. Fill in the fields of the View Properties dialog box, as shown in Figure 8.19. View Type should be Traceability Matrix, Row Requirement Type should be SUPL, and Column Requirement Type should be FEAT.

Figure 8.19 View Properties dialog box for the Traceability Matrix.

This view can also be set with FEAT requirements in rows and SUPL in columns.

Because in this matrix we do not need to include the features that were already taken care of in use cases, we can query only features that are not use case specific:

1. Click the Query button next to FEAT.
2. In the Select Attribute dialog box, shown in Figure 8.20, select Type as the attribute's name.
3. Click OK in the Select Attribute dialog box.
4. In the Query Requirements dialog box, shown in Figure 8.21, select in the left window applicable values.

Figure 8.20 Selecting the attribute on which we want to filter.

5. Click OK in the Query Requirements dialog box.
6. Click OK in the Query Column Requirements dialog box, as shown in Figure 8.22.
7. Click OK in the View Properties dialog box (refer to Figure 8.19).

Figure 8.21 Selecting values of the attribute which we want to filter.

Figure 8.22 Adding query criteria on the Query Column Requirements dialog box.

The view displays only features having one of the selected values of the attribute Type . To set the traceability, follow these steps:

1. Right-click the intersection of the related feature and supplementary requirement.
2. Select Trace From (or Trace To, depending on what you have in the rows, and depending on your interpretation of trace to and trace from ).

After setting traceability, you can analyze it either on the Traceability Matrix (see Figure 8.23) or on the Traceability Tree (see Figure 8.24). The Traceability Tree lets you see the path all the way from stakeholder requests.

## Querying Requirements

After we have set all the traceability, we can check if we covered all the features related to supplementary requirements. We can do this by using the Attribute Matrix or Traceability Matrix view. We need to filter the features simultaneously on two criteria:

Filter 1: Features that have the Type attribute applicable to the supplementary requirement.

Filter 2: Features that are not traced to supplementary requirements.

Figure 8.23 Traceability Matrix from FEAT to SUPL.

Figure 8.24 Traceability Tree to SUPL.

In the view Traceability Requirements Traced From Features, the first filter is already applied to column requirements, so we only need to set a second one:

1. Select View &gt; Query Column Requirements.
2. Click the Add button in the Query Column Requirements dialog box.
3. Select Traced-to in the Select Attribute dialog box, as shown in Figure 8.25.

Figure 8.25 Selecting the attribute on which to filter.

4. Click OK in the Select Attribute dialog box.
5. Select SUPL in the left window of the Query Requirements dialog box, as shown in Figure 8.26.
6. Select the Not Traced radio button.
7. Click OK in the Query Requirements dialog box.
8. Click OK in the Query Column Requirements dialog box, which now shows both filters (see Figure 8.27).

Figure 8.26 Selecting what traceability we are interested in.

Figure 8.27 All filters applied to the requirements.

We expect to have an empty view, as shown in Figure 8.28. If any feature is shown on the view,  it  requires  careful  analysis.  This  probably  means  that  we  forgot  to  add  supplementary requirements satisfying this feature, or we made a mistake either setting traceability or setting the Type attribute.

Figure 8.28 An empty view after applying both conditions.

## 8.7 Summary

Depending on the scope, software requirements can reside either in Use Case Specifications or in Supplementary Specifications. Supplementary requirements together with use cases capture all the system's software requirements. The majority of supplementary requirements are nonfunctional. They deal with usability, reliability, performance, supportability, and design constraints.

A common way of eliciting supplementary requirements is through interviews and questionnaires using a predefined list of questions. The list organizes requirements according to a chosen classification, such as FURPS+ [GRA92].

Because  a small improvement in performance or reliability may be quite costly in terms of required resources, it is worth capturing the importance and satisfaction shape of each requirement. Analyzing these attributes may help you optimally allocate the resources and direct the efforts where they are required the most.

After capturing all requirements in RequisitePro, we should set traceability from features (and, if needed, from the stakeholder requests). Next, we can run queries that check if all applicable features are covered by supplementary requirements.