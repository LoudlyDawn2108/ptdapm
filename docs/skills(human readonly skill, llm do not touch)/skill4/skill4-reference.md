The Vision Document translates raw stakeholder needs into testable system features. 
*   **Reference Material:** **Chapter 6 ("Developing a Vision Document")**.
*   **What the AI should extract:** The Vision document outline (Introduction, Positioning, Stakeholder/User Descriptions, Product Overview, Product Features, Constraints, Quality Ranges, etc.). Most importantly, it must extract the **transformation rules** (Copy, Split, Clarification, Qualification, Combination, Generalization, Cancellation, Completion, Correction, Unification, Adding details) used to convert raw stakeholder requests into formal, non-redundant features.
*   **Skill Purpose:** To evaluate your Vision document to ensure every Feature traces back to a Stakeholder Request, and to judge whether compound requests were properly "split" into atomic features.

## CHAPTER 6

## Developing a Vision Document

The Vision document is one of the three most important documents created in RequisitePro (the other two are the Use Cases and Supplementary Specification documents). The Vision document contains the following:

- A description of the problem being solved by the new system
- A high-level description of the solution
- A list of the system's main features

The Vision document may serve as a contract between a customer and developers for the technical requirements. The purpose of the Vision document is to

- Define the system's boundaries
- Identify constraints imposed on the system
- Gain agreement with the customer on the scope of the project
- Create a basis on which to define Use Cases and Supplementary Specification documents

The Vision is a repository for the requirements of type Feature , as shown in Figure 6.1. This chapter shows some examples of deriving features from needs and discusses attributes of features.

Figure 6.1 Features are on the second level of the pyramid.

## 6.1 The Structure of the Vision Document

Here are  the  contents  of  the  Vision  document  as  suggested  by  the  RequisitePro  template [RUP04]:

10. Introduction
2. 1.1 Purpose
3. 1.2 Scope
4. 1.3 Definitions, Acronyms, and Abbreviations
5. 1.4 References
6. 1.5 Overview
2. Positioning
8. 2.1 Business Opportunity
9. 2.2 Problem Statement
10. 2.3 Product Position Statement
3. Stakeholder and User Descriptions
12. 3.1 Market Demographics
13. 3.2 Stakeholder Summary
14. 3.3 User Summary
15. 3.4 User Environment

- 3.5 Stakeholder Profiles
- 3.6 User Profiles
- 3.7 Key Stakeholder or User Needs
- 3.8 Alternatives and Competition
- 3.8.1 &lt;aCompetitor&gt;
- 3.8.2 &lt;anotherCompetitor&gt;
4. Product Overview
- 4.1 Product Perspective
- 4.2 Summary of Capabilities
- 4.3 Assumptions and Dependencies
- 4.4 Cost and Pricing
- 4.5 Licensing and Installation
5. Product Features
- 5.1 &lt;aFeature&gt;
- 5.2 &lt;anotherFeature&gt;
6. Constraints
7. Quality Ranges
8. Precedence and Priority
9. Other Product Requirements
- 9.1 Applicable Standards
- 9.2 System Requirements
- 9.3 Performance Requirements
- 9.4 Environmental Requirements
10. Documentation Requirements
- 10.1 User Manual
- 10.2 Online Help
- 10.3 Installation Guides, Configuration, and Read Me File
- 10.4 Labeling and Packaging

You can tailor this table of contents to suit your project by removing entries that do not apply or by adding project-specific sections.

The Vision document is a repository for requirements of type Feature. They are listed in the section  'Product  Features.'  Other  sections  are  usually  free-form  and  do  not  contain  any requirements.

## 6.2 Deriving Features from Stakeholder Needs

Features are derived from stakeholder requests. It is important to keep track of which feature was derived from which request, so when the stakeholder requests are stored in RequisitePro, they could be traced to the features implementing them.

Requests  gathered  from  stakeholders  do  not  necessarily  have  the  attributes  of  a  good requirement, as discussed in section 1.4, 'Characteristics of a Good Requirement,' in Chapter 1, 'Requirements  Management.'  Deriving  features  from  stakeholder  requests  gives  you  a  good opportunity to fix that. One approach is to go through all STRQ requirements and apply appropriate transformation to create one or more FEAT requirements.

The following transformations may be applied:

- Copy: If no changes are required, STRQ can be copied to FEAT exactly as is. It is okay to have different types of requirements with the same text. However, avoid requirements of the same type having the same text. In this case, requirements are redundant.
- Split: If the requirement is not atomic, we can split it into two or more requirements.
- Clarification: Clarification, or explanation, may be applied when the original requirement is unclear or ambiguous.
- Qualification:  We  achieve  qualification  by  adding  restrictions  or  conditions  to  the requirement. It may help to resolve contradictory requirements.
- Combination: Redundant or overlapping requirements may be combined into one.
- Generalization:  If  the  requirement  is  not  abstract,  and  it  includes  some  unnecessary details, we may apply generalization.
- Cancellation: Sometimes the requirement needs to be deleted. This may happen when the requirement is infeasible, unnecessary, or inconsistent with another requirement.
- Completion: If the set of requirements is incomplete, we may need to add requirements at this stage.
- Correction:  Correction  may  mean  either  rewording  the  requirement  to  fix  grammar, spelling, or punctuation, or changing a portion of the requirement that is untrue.
- Unification: Requirements that use inconsistent vocabulary can be unified.
- Adding details: If the requirement is not precise enough, we may add details. This technique is often used to make testable requirements from untestable ones.

Chapter 5, 'Requirements Elicitation,' described requirements of the stakeholder request type. Let's analyze all the stakeholder requests gathered in Chapter 5 (one by one) and create features from them.

## STRQ1 The user shall be able to compare flight prices from other, nearby airports.

This requirement is redundant with STRQ11. They can be combined into one requirement:

FEAT1 The user shall be able to compare flight prices from other, nearby airports (for outbound and inbound flights).

## STRQ2 Dates shall be displayed in the dd/mm/yyyy format.

This requirement is inconsistent with STRQ 16, which requests the mm/dd/yyyy format. Requirement STRQ2 came from the user in France, and STRQ16 was supplied by the user in the U.S. The section 'Brainstorming Sessions' in 5.2, 'Techniques of Requirements Elicitation,' Chapter 5, discusses how this issue was resolved. The requirements STRQ2 and STRQ16 were replaced by the following:

FEAT2 Dates  shall  be  displayed  according  to  the  format  stored  in  web  browser settings.

## STRQ3 On data entry screens, the system shall indicate which fields are mandatory.

At some point the decision will be made as to how mandatory fields will be indicated as required fields. This decision can be made when creating a feature requirement, or slightly later, when supplementary requirements are derived from features. Let's assume we want to do this now, so we apply explanation to create a FEAT:

FEAT3 On data entry screens the system shall indicate which fields are mandatory by placing a star next to the field.

## STRQ4 The capability to cancel a ticket purchase should be available.

For  consistency  it  is  better  to  use  standard  constructs  in  requirements,  such  as  'shall' instead of 'should.' Using different words such as 'shall,' 'will,' 'should,' and 'could' may be wrongly interpreted as different levels of necessity. (For example, 'will' might sound stronger than 'shall,' and 'shall' might sound stronger than 'should.')

Clarification is needed as to who shall be able to cancel ticket purchases (user, customer service representative, or administrator) and at what stage of the process this is required:

FEAT4 The user shall be able to cancel a ticket purchase any time before final confirmation of the purchase.

## STRQ5 The user shall be able to cancel a car or hotel reservation.

It is up to the system analyst to decide whether a specific requirement is atomic. In this case he decided that canceling a car or hotel room reservation can be considered the same requirement, so there is no need to split them:

FEAT5 The user shall be able to cancel a car or hotel reservation.

## STRQ6 The outbound and return flights shall be sorted by the smallest number of stops.

This terminology is inconsistent with STRQ11. The same concept is called 'return flight' in STRQ6 and 'inbound flight' in STRQ11. Let's assume that after consulting with authorities, we have decided to use the term 'return flight.' However, we already merged STRQ11 with STRQ1 in FEAT1. We need to go back to FEAT1 and change it for consistency:

FEAT1 The user shall be able to compare flight prices from other, nearby airports (for outbound and return flights).

Because we have changed FEAT1 to be consistent with STRQ6, we can rewrite STRQ6 into FEAT6:

FEAT6 The outbound and return flights shall be sorted by the smallest number of stops.

However,  this  contradicts  STRQ18,  which  requests  that  flights  be  sorted  by  price.  We  may accommodate both requirements in one feature:

FEAT6 The user shall be able to choose if the flights shall be selected by the smallest number of stops or by price.

As you can see, deriving features is an iterative process, and some requirements need to be changed a few times until they are consistent and nonredundant.

## STRQ7 The user will be able to select seats.

For unification, we change 'will' to 'shall.'

For the requirement to be completely stand-alone, we need to add some explanation:

FEAT7 While purchasing an airplane ticket, the user shall be able to select seats.

## STRQ8 The system shall have a natural-language interface.

At first glance this requirement is okay. However, after analyzing the scope of the system and time constraints, it was obvious that this requirement is unrealistic (infeasible). It is contradictory with STRQ27, which asks that the system be developed in three months. Implementing a natural-language interface would take more than three months. This requirement is canceled, and the user who provided this requirement is notified of the cancellation.

## STRQ9 The system shall display a pop-up calendar when any date is entered.

This  request  overlaps  with  STRQ21,  which  asks  for  a  calendar  when  the  flight  date  is entered. Because STRQ9 is more generic (it mentions any date; that includes a hotel stay date or a car rental date), we will rewrite STRQ9 and cancel STRQ21. As a clarification, we may explicitly list all the dates:

FEAT8 The system shall display a pop-up calendar when any date is entered, such as a flight date, hotel stay date, or car rental date).

## STRQ10 The user shall indicate if he needs a one-way or return ticket by checking the checkbox.

This requirement contains unnecessary design. Details, such as whether to use a checkbox or radio button, should be left to the screen designer. In this case, a radio button may be more appropriate because options are exclusive. But at this stage such analysis and specific detail do not need to be done or included in the requirement:

FEAT9 The user shall have the opportunity to indicate if he needs a one-way or return ticket.

## STRQ11 For outbound and inbound flights, users shall be able to compare flight prices from other, nearby airports.

This request was combined into FEAT1, so it may be canceled.

## STRQ12 Sometimes a user will enter an airport code, which the system will understand, but sometimes the closest city may replace it, so the user does not need to know the airport code, and it will still be understood by the system.

This sentence is complicated and unclear. We may replace it with a simpler one:

FEAT10 The system shall identify the airport based on either an airport code or a city name.

## STRQ13 The system shall have clear navigation.

This requirement is vague and is not precise enough to be testable. Two more concrete features were derived from it:

FEAT11 Separate tabs shall be available for the main functionality.

FEAT12 On each page a Next button shall suggest a default flow.

## STRQ14 If the user purchased a ticket once, there shall not be a need to repeat the same information, such as address or credit card number.

In this request we clarify by adding 'during future transactions':

FEAT13 If the user purchased a ticket once, there shall not be a need to repeat the same information (such as address or credit card number) during future transactions.

## STRQ15 Payment by PayPal shall be available.

This requirement is contradictory with STRQ41, which states that PayPal cannot be available. In this case, because for some reason the vendor cannot provide this service, we need to cancel the user's requirement.

## STRQ16 Dates shall be displayed in the mm/dd/yyyy format.

This requirement was already incorporated into FEAT2.

## STRQ17 The list of available flights shall include flight numbers, departure time, and arrival time for every leg of the flight.

There's nothing wrong with this one, so we just rewrite it:

FEAT14 The list of available flights shall include flight numbers, departure time, and arrival time for every leg of the flight.

## STRQ18 It shall be sorted by price.

The word 'It' refers to the preceding requirement. However, if the order of the requirements changes, this requirement will not be understandable.

To be independent, the requirement would need to be worded as follows:

The list of available flights shall be sorted by price.

However, we have already incorporated this requirement into FEAT6.

## STRQ19 Comparison of car rental prices from different companies shall be provided.

This requirement is okay. We just need to remove the passive voice:

FEAT15 The  system  shall  provide  comparison  of  car  rental  prices  from  different companies.

## STRQ20 Car rental prices shall show all applicable taxes (including 6% state tax).

The tax varies by state, so the provided 6% figure is incorrect. We can remove the words in parentheses, leaving the tax calculation to the designers:

FEAT16 Car rental prices shall show all applicable taxes.

## STRQ21 A calendar shall be available to help with entering the flight date.

This requirement was incorporated into FEAT8.

## STRQ22 The system shall provide the opportunity to book the flight, purchase a ticket, reserve a hotel room, reserve a car, and provide information about attractions.

This requirement is a combination of five atomic requirements, which makes traceability very difficult. This compound requirement will be split into five atomic ones:

FEAT17 The system shall provide an opportunity to book the flight.

FEAT18 The system shall provide an opportunity to purchase an airplane ticket.

FEAT19 The system shall provide an opportunity to reserve a hotel room.

FEAT20 The system shall provide an opportunity to reserve a car.

FEAT21 The system shall provide information about attractions in specific places.

## STRQ23 The user shall be able to purchase a ticket online, without the necessity of calling the travel agent.

Nothing is wrong here, so we can copy the requirement:

FEAT22 The user shall be able to purchase a ticket online, without the necessity of calling the travel agent.

## STRQ24 The system shall follow implementation guidelines set up in the chain of our travel agencies.

This requirement is unclear, unless another document is attached, describing implementation guidelines. Or all the guidelines can be explicitly listed. For example:

FEAT23 The system shall use J2EE architecture.

FEAT24 If the architecture requires an application server, IBM WebSphere shall be used.

FEAT25 If the system requires a database, Oracle shall be used.

## STRQ25 The pages where service providers can submit their offers shall be passwordprotected.  Hotel  providers,  car  providers,  and  airline  representatives  shall  use  assigned user IDs and passwords to access these pages.

Nothing is wrong here, so we can copy the requirement:

FEAT26 The pages where service providers can submit their offers shall be passwordprotected. Hotel providers, car providers, and airline representatives shall use assigned user IDs and passwords to access these pages.

## STRQ26 The system must be available 24 hours a day, with a degree of reliability appropriate to commercial applications.

This requirement is not precise enough to be tested. At some point we need to replace it with detailed requirements regarding reliability. We can do this now, while creating features, or we may wait until we create the Supplementary Specification. It is okay to make final decisions on nonfunctional requirements while deriving supplementary requirements from features. For now, we keep the requirement as is:

FEAT27 The system must be available 24 hours a day, with a degree of reliability appropriate to commercial applications.

## STRQ27 The system shall be developed in three months.

We may add an explanation about when this time calculation begins:

FEAT28 The system shall be developed three months from the date when the customer signs off on the Use Cases and Supplementary Specification.

## STRQ28 Users shall pick IDs and passwords while buying an airline ticket.

We can copy this requirement because there is nothing to fix:

FEAT29 Users shall pick IDs and passwords while buying an airline ticket.

## STRQ29 The search facility shall allow a customer service representative to find a reservation based on: Last Name, Destination City, Date, etc.

The 'etc.' is not precise enough. After confirming with the originator of this requirement that no other search criteria are required, the 'etc.' was removed.

FEAT30 The search facility shall allow a customer service representative to find a reservation based on the following: Last Name, Destination City, Date.

## STRQ30 The customer service representative shall be able to change reservation details or cancel a reservation.

Because this requirement is not atomic, we can split it into two:

FEAT31 The  customer  service  representative  shall  be  able  to  change  reservation details.

FEAT32 The customer service representative shall be able to cancel a reservation.

## STRQ31 While submitting the content information, the Content Manager shall be able to submit plain text without HTML tags.

This requirement is okay, so we just copy it:

FEAT33 While submitting the content information, the Content Manager shall be able to submit plain text without HTML tags.

## STRQ32 Content information shall be stored in a text file.

How the information is stored shall be transparent to the user, and it shall be the designer's or  architect's  decision.  This  requirement  can  be  canceled.  This  suggestion,  however,  may  be passed to the designer for consideration.

## STRQ33 The  system  shall  be  fully  tested  under  specific  versions  of  the  most  popular browsers only.

After conveying to the customer that it is unrealistic to test the system on all available browsers, the customer agreed to limit the testing requirement to Internet Explorer and Netscape browsers:

FEAT34 The system shall be fully tested on the following browsers: Internet Explorer and Netscape.

## STRQ34 The system may display a map of to the airport.

This requirement came from a developer, who is neither a customer nor a user. After checking with the customer, it was confirmed that this requirement is unnecessary, so it was canceled.

## STRQ35 The search facility shall allow a customer service representative to find a reservation based on: Last Name, Date.

Because STRQ35 is a subset of STRQ29, which was incorporated into FEAT30, we can cancel STRQ35.

## STRQ36 All activity on the site shall be logged.

We add some details and explanation:

FEAT35 All  transactions  and  errors  shall  be  recorded  and  made  available  to  the administrator.

## STRQ37 Various reports shall be available.

This requirement is imprecise. After additional interviews, details were added:

FEAT36

The following reports shall be available to the administrator:

A list of all airline tickets purchased in the given time period. A list of all car reservations in the given time period. A list of all hotel room reservations in the given time period.

STRQ38 While booking a hotel room, the customer shall provide the following information: town, stay dates, number of adults, number of children, room preferences.

This requirement is okay, so we just copy it:

FEAT37 While booking a hotel room, the customer shall provide the following information: town, stay dates, number of adults, number of children, room preferences.

STRQ39 When providing the information about a hotel, the following information shall be displayed: address, phone, fax, e-mail, offered discounts, available methods of payment, etc.

The 'etc.' was removed:

FEAT38 When providing  the  information  about  a  hotel,  the  following  information shall be displayed: address, phone, fax, e-mail, offered discounts, and available methods of payment.

## STRQ40 The user shall be offered flight and hotel deals.

Some explanation is added:

FEAT39 The user shall be offered package deals consisting of flight and hotel stay.

## STRQ41 Only credit card payments shall be accepted. No checks, no PayPal.

Some rewording for clarification was applied:

FEAT40 While  paying  for  the  airplane  ticket,  only  credit  card  payments  shall  be accepted. Checks and PayPal shall not be accepted.

## 6.3 Attributes of Features

Attributes describe properties of requirements. They help organize and analyze the requirements in the project. We can create rules to decide, based on the attributes, which requirements to implement in the next iteration, phase, or release. For example, you may decide that in Elaboration you

want to implement all requirements that have high Risk and high or medium Importance and all requirements that have high Importance and high or medium Difficulty.

Attributes can be either list-type (identified by the sets of predefined descriptive values such as High, Medium, and Low) or entry-type (text, time, date, numeric integer, numeric real).

The default attributes of features are as follows:

- Priority (usually used to determine order of implementation)
- Status (tracks the progress of requirement development-Proposed, Approved, Incorporated, and Validated)
- Difficulty (how difficult is implementing this requirement-the default values are High, Medium, and Low)
- Stability (the probability that the feature will not change during the project)
- Risk (the probability of issues related to this requirement-problems with implementation, missing deadlines, and so on)
- Planned iteration (for example, E1-the first iteration in the Elaboration phase)
- Actual iteration
- Origin (source of the requirement)
- Contact Name (usually the person responsible for this requirement)
- Enhancement Request
- Defect
- Author
- Location (in which document it resides)

This list may vary depending on the version of RequisitePro.

Very often we need to add attributes. Some examples follow.

We may want to have an attribute Importance , because it is not the same as Priority . It may help to manage the scope in case of delays. Values that can be used include Mandatory, Desirable, and Nice to have. In extreme situations multiple attributes may store these values, because Importance according to the user may not be the same as Importance according to the project manager .

Besides Difficulty , we may have an attribute called Effort . It is expressed in person-days and can provide a detailed estimate of how much time is required to implement the requirement.

To have a better cost estimate, we may add an attribute Cost to implement . It is useful if various resources come at significantly different prices (such as different hourly rates of consultants involved in the project). We may use this attribute to calculate cost/reward ratio, which we can store in the attributes Cost/reward or Risk/reward .

Instead of Contact Name , an attribute Assigned To is sometimes used.

Instead of Planned iteration and Actual iteration ,  we may have Planned completion date and Actual completion date .

Risk may be split into two separate attributes: Risk probability (what is the probability of problems) and Risk impact (if a problem occurs, how severe the impact is).

Described attributes may be used not only for features, but also for other requirements (such as use cases and supplementary requirements).

Adding a new attribute is so easy that you should not hesitate to do so if a custom attribute will help manage requirements of the particular type.

## 6.4 Summary

This chapter discussed how to derive features from stakeholder requests and how to present them in a Vision document. The structure of this document was presented. This chapter also introduced the concept of traceability and discussed how you can present it using RequisitePro views.