The RMP sets the rules for the whole project.
*   **Reference Material:** **Chapter 3 ("Establishing a Requirements Management Plan")** and **Appendix A ("Sample Requirements Management Plan")**.
*   **What the AI should extract:** The specific questions an RMP must answer (e.g., What requirement types will be tracked? What are their attributes? Between which requirements do we need to implement traceability?). It should also extract the exact Markdown document structure from Appendix A: 1. Introduction, 2. Tools/Environment, 3. Documents and Requirement Types (Traceability, Attributes, Reports).
*   **Skill Purpose:** To generate the foundational Markdown RMP for your project and judge if all requirement attributes (Priority, Risk, Status, etc.) and traceability paths are properly defined.

## CHAPTER 3

## Establishing a Requirements Management Plan

To manage requirements, you must begin with a plan. This chapter addresses the issue of when to create a Requirements Management Plan (RMP) and the questions that must be answered to develop one. It finishes with a look at a sample RMP.

The RMP describes the approach to managing requirements in the project. This document specifies how requirements are created, organized, modified, and traced during the project lifecycle. It also describes all requirement types and their attributes used in the project.

The main part of this chapter describes what decisions should be made and what factors influence these decisions.

## 3.1 When the RMP Is Created

The RMP can be created from a template included in RequisitePro. However, to create a project in  RequisitePro,  we  need  to  make  the  decisions  captured  in  the  RMP.  We  can  resolve  this chicken-and-egg problem in the following ways:

- Approach 1
1. All the decisions regarding required document and requirement types are made, but they are not formally documented in an RMP.
2. A RequisitePro project is created.
3. An RMP is created from a RequisitePro template.
- Approach 2
1. An RMP is created in Microsoft Word. It still contains all the paragraphs that the RequisitePro template contains, but it is created outside the tool.
2. A RequisitePro Project is created based on the RMP.
3. The Microsoft Word document with the RMP is imported into RequisitePro.

For our sample project, we will use the second approach to illustrate how we can bring existing documents into the RequisitePro environment. Chapter 4, 'Setting up the Project,' discusses how to import a Microsoft Word document with RMP into RequisitePro.

## 3.2 Decisions That May Be Documented in an RMP

Chapter 1, 'Requirements Management,' lists decisions that should be made while developing an RMP. In the following sections, we will discuss each decision and the factors that influence it.

## Will an RM Tool Be Used?

Using a requirements management (RM) tool significantly facilitates the creation and maintenance of requirements. Usually tools provide traceability tracking. Various reports can easily be produced. However, most often it costs money to buy a tool, and it takes time to learn it. Usually this expense is worth the benefits.

In some cases it does not cost additional money to have a tool. One option may be to use a free tool (such as Tracer). Some companies may already have a tool because it was included in the  package  that  was  bought  for  another  purpose.  For  example,  some  companies  purchase  a Rational Suite Enterprise because of Rational Rose (for design) and Rational Robot (for testing). RequisitePro is already in the suite, so no additional license is required to use it for RM.

Many tools support the RM process. It should be decided early in the project if a tool will be used and which tool is selected. After this decision is made for the first project, the same tool is usually  used  for  subsequent  projects.  Comparisons  of  many  RM  tools  can  be  found  on  the International Council on Systems Engineering website (www.paper-review.com/tools/rms/read. php).  For  this  book  we  have  chosen  RequisitePro,  one  of  the  most  popular,  powerful,  userfriendly, and reasonably priced requirements management tools. If because of budget constraints there is no possibility to buy a tool, Microsoft Word and Microsoft Excel can be used to track the requirements. Not having a tool should not be an excuse for neglecting proper formulation of the requirements and implementing traceability.

The remainder of this chapter assumes that RequisitePro was selected.

## What Requirement Types Will Be Tracked in the Project?

Simple projects may require only one or two requirement types. A complex software project requires many levels of requirements. The requirements pyramid presented in Figure 1.1 (and shown in Figure 3.1) represents a typical set of requirements for a big corporate project. However, this pyramid may be tailored for the purposes of a specific project. The following list discusses the applicability of each requirement type:

- Needs and stakeholder requests: In our project we treat needs and stakeholder requests as synonyms. However, we may split these two types of requirements in various ways. One approach is to treat needs as very high-level requirements, while having very granular stakeholder requests.

- Features: Usually features are one of the main requirements in the project, but if the user can express all requirements in the form of use cases (UC), features may not be necessary.
- Use cases: If no users are permanently interacting with the system, UCs may not be needed. An  example  may  be  some  batch  programs,  where  a  user  only  initiates  the processing.
- Supplementary requirements: Every project has some nonfunctional requirements that should be placed in the Supplementary Specification. However, since there usually is no big  difference  between  supplementary  requirements  and  nonfunctional  features,  we may store these requirements on a features level.
- Scenarios:  Scenarios  are  used  to  identify  valid use  case  paths.  This  is  a  very  useful requirement  type.  Scenarios  facilitate  transition  between  UCs  and  test  cases.  During design, we create sequence diagrams from scenarios, not from the whole UC. They are also critical for the project manager because we implement UCs by scenario. We usually do not build an entire UC in a particular iteration, but rather a set of scenarios from many UCs, gradually fleshing out the fully implemented UCs by the end of Construction. Most often we start with a scenario containing a basic flow and subsequently add scenarios with alternative flows. Because scenarios are not defined in RequisitePro as a standard requirement type, we need to create them ourselves. Unfortunately, quite often, to save maintenance time, they are not explicitly created in RequisitePro.
- Test cases: It is a good practice to keep track of test cases. Unfortunately, many projects do not do this. A simplified approach to testing is directly using UCs and deciding ad hoc what values will be used for testing. This approach saves a lot of time, but it does not guarantee full test coverage.
- Problems: Requirement type 'problems' are used to capture main problems with existing solutions, which a new system is supposed to fix. These requirements are at the top of the pyramid, one level above needs. Our sample project does not use this requirement type.

Our sample project has the requirement types shown in Figure 3.1.

## What Are the Attributes of These Requirements?

Requirement attributes play an important role in managing the project. Together with views, they provide a powerful analysis tool. Based on the attribute values, you can filter and sort the requirements using queries. The results of queries are displayed in views. Some popular attributes and their values are described in Section 3.4, 'Requirements Attributes,' of the Appendix, 'Sample Requirements Management Plan.'

Figure 3.1 The requirements pyramid.

Basic requirements come in RequisitePro with a predefined set of attributes. This set may change depending on which version of the tool you use. Table 3.1 presents the attributes and values included in the UC template in version 2003.6.13 for the following requirement types:

- Features (FEAT)
- Supplementary requirements (SUPL)
- Use cases (UC)
- Stakeholder requests (STRQ)

Table 3.1 Default Attributes and Value Sets for Requirements FEAT, SUPL, UC, and STRQ

| Attribute   | Values                                                                                                                                              | FEAT   | SUPL   | 1UC   | STRQ   |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------|--------|-------|--------|
| Priority    | High Medium Low                                                                                                                                     | ✓      | ✓      | ✓     |        |
| Type        | Functional Usability Reliability Performance Supportability Design Constraint Implementation Requirement Physical Requirement Interface Requirement | ✓      |        |       |        |

| Attribute            | Values                                                                                      | FEAT   | SUPL   | 1UC   | STRQ   |
|----------------------|---------------------------------------------------------------------------------------------|--------|--------|-------|--------|
| Status               | Proposed Approved Incorporated Validated                                                    | ✓      | ✓      | ✓     |        |
| Difficulty           | High Medium Low                                                                             | ✓      | ✓      | ✓     |        |
| Stability            | High Medium Low                                                                             | ✓      | ✓      | ✓     |        |
| Risk                 | Schedule-High Schedule-Medium Schedule-Low Technology-High Technology-Medium Technology-Low | ✓      | ✓      | ✓     |        |
| Planned Iteration    | Integer                                                                                     | ✓      |        | ✓     |        |
| Actual Iteration     | Integer                                                                                     | ✓      |        | ✓     |        |
| Origin               | Help Desk Partners Competition Large Customers End Users                                    | ✓      |        |       | ✓      |
| Contact Name         | Text                                                                                        | ✓      | ✓      | ✓     |        |
| Enhancement Request  |                                                                                             | ✓      | ✓      | ✓     |        |
| Defect               |                                                                                             | ✓      | ✓      | ✓     |        |
| Obsolete             | True False                                                                                  | ✓      | ✓      | ✓     |        |
| Affects Architecture | True False                                                                                  |        |        | ✓     |        |
| Stakeholder Priority | High Medium Low                                                                             |        |        |       | ✓      |

As you can see, FEAT, SUPL, and UC have  many attributes in common. STRQ by default has only two attributes-Origin and Stakeholder Priority.

When you create a project, you may need to tune attributes and their values to better fit your needs.

Because some attribute values are quite vague, it is useful to clarify in RMP what particular values mean. Here are some examples:

- Priority-High:  Must  be  implemented  no  later  than  in  the  first  iteration  of  the Construction phase.
- Priority-Medium: Must be implemented no later than by the end of Construction.
- Priority-Low: May be implemented if time permits.
- Risk-Technology High: Using a new technology with which the team does not have any experience.
- Risk-Technology Low: Using a well-known technology with which the team has a lot of experience.

## Where Will the Requirements Be Created-in the Database Only or in the Documents?

For tracking requirements attributes and traceability, it is not necessary to have them in documents. They may just reside in the database. However, also having them in documents offers some advantages:

- Easier access to the requirements by team members who do not have access to RequisitePro
- Opportunity to visually group and organize the requirements
- Presenting them in a more readable form
- Easy to add comments and explanations

An alternative to managing requirements in documents is the use of reports. For example, Use Case Specification SoDA templates can be created so that when use cases need to be communicated, a report can be generated, with an organization scheme similar to that of the corresponding Use Case Specification RequisitePro template.

The following requirement types are usually stored in corresponding documents, not just in the database:

- Because  of  their  descriptive  nature,  use  cases  should  be  associated  with  the  documents-one document per use case.
- Features are included in the Vision document.
- Supplementary requirements are captured in the Supplementary Specification.

Requirements of the type 'stakeholder needs' are usually included in Stakeholder Requests documents, but there are three main approaches to handling needs. Requirements of this type may be as follows:

- In the Stakeholder Requests documents

Pros:

All needs are associated with a specific stakeholder.

There is a place to insert additional comments and to include all stakeholders' answers.

It is easy to give the whole document to the shareholders for feedback.

Cons: It increases the number of documents that need to be maintained.

- In the database only

Pros: It decreases the number of documents.

Cons: This is a less readable form, especially if we want feedback from a stakeholder.

- In the Vision document

Pros: It decreases the number of documents.

Cons: domain (STRQ) as well as from the solution domain (FEAT).

The Vision becomes a document that contains requirements from a problem

## Between Which Requirements Do We Need to Implement Traceability?

Depending on which requirement types we select, the traceability tree may look different. Figure 3.2 shows the traceability for requirement types selected for the sample project.

## What Documents Are Required?

Quite early in the process we need to decide what documents are required in the project. Each document should have a purpose. For example, it may be used for communication between team members or to obtain sign-off from the customers.

The Vision document, Use Cases, and Supplementary Specification are usually main documents that exist in a majority of projects. The main reason for this is that these documents contain important requirement types-FEAT, UC, and SUPL. These documents may also be used as a contract between the development team and the customers.

Stakeholder Requests documents are used in 50% of the projects. A document type called Glossary is provided in almost all project templates. Regardless of that fact, in many projects it is not developed further. The Requirements Management Plan is a very useful document, but it does not change much from project to project. You may decide to have one master RMP for all corporate projects and just document some small changes and exceptions specific to a given project.

Chapter 12, 'Documentation,' contains a more detailed discussion of possible documents that may need to be created.

Figure 3.2 Traceability between requirement types used in a sample project.

## Which Requirements and Documents Will Be Used as a Contract with Customers?

Usually UCs and Supplementary Specification are used as a contract, but we also may decide to include the Vision document. It does not make sense to sign off on stakeholder requests because these requirements are usually expressed in users' words. In this instance we take responsibility in  case  the  requirement was misinterpreted while STRQ requirements are being translated to FEAT, UC, or SUPL.

## If Part of the Project Is Outsourced, What Requirements and Documents Will Be Used as a Contract with a Vendor?

It depends on the level of the vendor's involvement. If design and development are outsourced, we may use supplementary requirements and use cases. If the vendor is also involved in analysis, it may be features. If only the coding part is outsourced, we may use the Rational Rose Model to agree on the scope of the work.

## Will We Follow the Rational Unified Process or Some Other Methodology?

The Rational Unified Process (RUP) is an iterative software development process that is becoming more and more popular.

Some of the advantages of using RUP include the following:

- Iterative approach addresses all risks early in the process
- Availability of standard document templates
- Integration with IBM RequisitePro and other Rational tools

RUP  can  be  applied  to  a  one-week  project  as  well  as  to  complex  multiyear  projects [KRO03]. RUP can be tailored to specific project needs. The requirements management approach presented in this book is in sync with RUP. However, it can also be used in projects where RUP is not used.

## Does the Customer Need Any Specific Documents to Comply with His Development Process?

Some companies create a Software Development Lifecycle in-house. They may require some documents specific to that organization. We may need to incorporate these documents into the process.

## How Will Change Management Be Implemented?

Some automated tool may be used. It makes sense to use ClearQuest because it is part of the Rational Suite, and it provides some integration with RequisitePro. We also need to detail the process. Do we have a central person through whom change requests are submitted, or do we have a group of authorized testers, business analysts, and users who may submit requests directly to the tool?

## Will the Whole System Be Stored in One RequisitePro Project or Spread Among Many Projects?

It is much easier to maintain the requirements model if it is stored in one project. The exception may be for very large systems that are split into almost independent subsystems maintained by different teams.

## What Process Will Guarantee That All Requirements Were Implemented and Tested?

Implementing traceability helps achieve this goal. RM may specify when and how we check to see if appropriate requirements are correctly traced from and traced to. One approach is to run reports at the end of each iteration.

## Which Requirements or Views Do We Need to Generate Reports?

They are project-specific. However, usually we need the following views:

- Attribute Matrix: Stakeholder Requests
- Attribute Matrix: Features

- Attribute Matrix: Supplementary Requirements
- Attribute Matrix: Test Cases
- Traceability Matrix: Stakeholder Requests to Features
- Traceability Matrix: Features to Use Cases
- Traceability Matrix: Features to Supplementary Requirements
- Traceability Matrix: Supplementary Requirements to Test Cases
- Traceability Tree: Use Cases to Scenarios and Test Cases

## 3.3 Sample Requirements Management Plan

This book provides a sample RMP that is based on a template included in a previous version of RequisitePro. The sample plan is in the Appendix. Read through it, and use it to make the points described in this chapter more concrete.

## 3.4 Summary

We have presented examples of topics that may be discussed in the Requirements Management Plan. Depending on the project, some of them are required, and others are not applicable. Here is the most important information that we need to specify in the RMP:

- Which types of documents we store requirements in
- Which types of requirements go in each document
- Which attributes we want to associate with each requirement
- What values are available for each attribute and what they mean

After you create RMP for one project, the document can be used as a template for future projects because many of the decisions will still be valid.

One of the main purposes of RMP is to make all decisions that are necessary to proceed with the creation of the RequisitePro project. This task is described in Chapter 4.

## APPENDIX A

## Sample Requirements Management Plan

## 1 Introduction

## 1.1 Purpose

This document describes the guidelines used by the project to establish the requirement documents,  requirement  types,  and  requirement  attributes.  It  also  describes traceability between various requirement types that will be maintained during the project lifecycle. It serves as the configuration document for the RequisitePro tool. The objective of requirements traceability is to reduce the number of defects found late in the development cycle. Ensuring that all product requirements are captured in the software requirements, design, and test cases improves the product's quality.

## 1.2 Scope

This plan pertains to all phases of the project.

## 1.3 Overview

Paragraph 2 describes tools that will be used for requirements management.

Paragraph 3.1 describes traceability items and defines how they are to be named, marked, and numbered.

Paragraph 3.2 describes requirement types used as traceability items.

Paragraph 3.3 describes traceability-which requirement elements trace to another type of requirement.

Paragraph 3.4 describes suggested attributes for each type of requirement.

## 2 Tools, Environment, and Infrastructure

RequisitePro will be used to manage requirements. Requirement attributes and traceability will  be  stored  in  a  RequisitePro  database.  Team  members  who  do  not  have  access  to RequisitePro will use Microsoft Word. Some diagrams will be created in Rational Rose and incorporated into RequisitePro documents.

## 3 Documents and Requirement Types

## 3.1 Documents

The following documents will be created in the project.

| Document Type                      | Description                                           | Default Requirement Type          |
|------------------------------------|-------------------------------------------------------|-----------------------------------|
| Stakeholder Requests (STR)         | Key requests from stakeholders.                       | Stakeholder Request (STRQ)        |
| Vision (VIS)                       | Overall system description and specific requirements. | Feature (FEAT)                    |
| Use Case Specification (UCS)       | Use case description.                                 | Use Case (UC)                     |
| Glossary (GLS)                     | Use to capture common vocabulary.                     | Glossary Item (TERM)              |
| Supplementary Specification (SS)   | Nonfunctional specifications.                         | Supplementary Requirements (SUPL) |
| Requirements Management Plan (RMP) | This document.                                        | No requirements                   |

## 3.2 Requirement Types

This paragraph describes traceability items and defines how they are to be named, marked, and numbered. A traceability item is any project element that needs to be explicitly traced from another textual or model item to keep track of the dependencies between them. In RequisitePro, traceability items are represented by an instance of a RequisitePro requirement type. The following table describes all the requirement types used in the project.

| Traceability Item (Requirement Type)   | Artifact (Document Type)         | Description                                                             |
|----------------------------------------|----------------------------------|-------------------------------------------------------------------------|
| Stakeholder Request (STRQ)             | Vision (STR)                     | Key stakeholder and user needs. They describe high-level requirements.  |
| Feature (FEAT)                         | Vision (VIS)                     | The system's conditions and capabilities.                               |
| Use Case (UC)                          | Use Case (UC) documents          | Use cases capturing all the system's functional requirements.           |
| Supplementary Requirement (SUPL)       | Supplementary Specification (SS) | Nonfunctional requirements that are not captured in the use case model. |

## 3.3 Traceability

Figure A.1 shows the traceability structure used in the project.

Figure A.1 Traceability diagram.

- Stakeholder Requests (STRQ) will be traced to Features (FEAT) defined in the Vision document and Supplementary Requirements defined in the Supplementary Specification. There may be a many-to-many relationship between STRQ and FEAT, but usually it is one Stakeholder Request to many Features. Every approved Request must trace to at least one Feature or Supplementary Requirement.
- Feature Requirements (FEAT) (defined in the Vision document) will be traced to either a Use Case or Supplementary Requirement. Every approved feature must trace to at least one Use Case or Supplementary Requirement. There may be many-to-many relationships between Features and Use Cases and Supplementary Requirements.

- Use Case Requirements (UC) defined in the Use Case Specifications will be traced back to Features.
- Supplementary Requirements (SUPL) will be traced back to Features.

## 3.4 Requirements Attributes

## 3.4.1 Attributes for FEAT

## Status

Tracks the progress  of  the  requirement development from initial  drafting  through  final validation.

| Attribute Value   | Description                                                                                |
|-------------------|--------------------------------------------------------------------------------------------|
| Proposed          | Describes features that are under discussion, but have not yet been reviewed and accepted. |
| Approved          | Features approved for further design and implementation.                                   |
| Realized          | The feature is incorporated into the design. Rational Rose diagrams reflect this feature.  |
| Incorporated      | The feature is incorporated into the product.                                              |
| Validated         | The feature is tested and checked to see that it works correctly.                          |

## Priority

Determines the requirement's priority  to assign appropriate development resources.

| Attribute Value   | Description                                                                                                                 |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------|
| High              | High priority.                                                                                                              |
| Medium            | Medium priority.                                                                                                            |
| Low               | Low priority. Implementation of this feature is less critical and may be rescheduled for subsequent iterations or releases. |

## Benefit

Benefit and importance of the requirement to the end users and customers.

| Attribute Value   | Description                                                                                                                                                                                                                    |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Critical          | Essential features. Failure to implement them means that the system will not meet customer needs. All critical features must be implemented in the release, or the schedule will slip.                                         |
| Important         | Features important to the system's effectiveness and efficiency for most applica- tions. The functionality cannot easily be provided in some other way.                                                                        |
| Useful            | Features that will be used less frequently, or for reasonably efficient workarounds that can be achieved. No significant revenue or customer satisfaction impact can be expected if such an item is not included in a release. |

## Effort

Set by the development team. Should be expressed in the total number of persons working times the amount of days it will take.

## Risk

The probability that implementing the requirement will cause undesirable events, such as effort overruns, design flaws, a high number of defects, poor quality, and poor performance. It is enough to categorize the technical risks of each use case as high, medium, or low.

| Attribute Value   | Description                                                                                  |
|-------------------|----------------------------------------------------------------------------------------------|
| High              | The impact of the risk combined with the probability of the risk occurring is high.          |
| Medium            | The impact of the risk is less severe, and the probability of the risk occurring is smaller. |
| Low               | The impact of the risk is minimal, and the probability of the risk occurring is low.         |

## Stability

Probability that the feature will change or that the team's understanding of the feature will change. Used to help establish development priorities and determine items for which additional elicitation is required.

## Target Release

A target release may be expressed as the name of an iteration, in which the feature will be incorporated into the product.

## Assigned To

Features may be assigned to the people responsible for further elicitation, writing the software requirements and implementation.

## Reason

This text field is used to track the source of the requested feature. Requirements exist for specific reasons. This field records an explanation or a reference to an explanation.

## 3.4.2 Attributes for STRQ

The same as for FEAT, except for Target Release:

 - Status
 - Priority
 - Benefit
 - Effort
 - Risk
 - Stability
 - Reason

## 3.4.3 Attributes for UC

The same as for FEAT. In addition, there is an Actor attribute.

## Actor

Describes which actor initiates this use case.

Other attributes are the same as for FEAT:
 - Status
 - Priority
 - Benefit
 - Effort
 - Risk
 - Stability
 - Target Release
 - Reason

## 3.4.4 Attributes for SUPL

The same as for FEAT:
 - Status
 - Priority
 - Benefit
 - Effort
 - Risk
 - Stability
 - Target Release
 - Reason

## 3.5 Reports and Measures

The views will be created to provide the following reports:

Attribute Matrices showing all requirements of the specific type:

- All Stakeholder Requests
- All Features
- All Supplementary Requirements
- All Use Cases

Traceability Matrices:

- Traceability of STRQ to FEAT
- Traceability of FEAT to US
- Traceability of FEAT to SUPL
- All STRQ not traced to FEAT
- All FEAT not traced to US or SUPL
- All FEAT not traced from STRQ
- All UC not traced from FEAT
- All SUPL not traced from FEAT

Traceability Trees:

- Traceability Tree traced from STRQ
- Traceability Tree traced to UC
- Traceability Tree traced to SUPL