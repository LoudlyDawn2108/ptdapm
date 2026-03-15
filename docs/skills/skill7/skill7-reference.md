Test cases are derived from both Use Cases and Supplementary Requirements to ensure coverage.
*   **Reference Material:** **Chapter 9 ("Creating Test Cases from Use Cases"), Section 9.1** and **Chapter 10 ("Creating Test Cases from Supplementary Requirements")**.
*   **What the AI should extract:** The 4-step method for generating functional test cases: 1. Identify variables for each use case step, 2. Identify significantly different options for each variable (border conditions, invalid inputs, business rules), 3. Combine options into test cases (using a Test Case Allocation Matrix), 4. Assign values to variables. For non-functional testing, extract the 8 methods for testing supplementary requirements (executing in different environments, white-box testing, automated testing, checklists, etc.).
*   **Skill Purpose:** To auto-generate test case tables in Markdown based on your Use Case alternative flows, ensuring negative testing and border conditions are covered.

## CHAPTER 9

## Creating Test Cases from Use Cases

This chapter describes how to create functional test cases from use cases. In many projects the importance of this step is not recognized. Often the testers are given a printout of a Use Case Specification and then perform ad hoc manual testing. However, if we neglect formal creation of test cases, we may end up with poor coverage of a testing universe while performing many duplicate tests.

Presented here is a formal method that facilitates achieving quite good coverage using a reasonable  number  of  test  cases.  This  approach  was  introduced  by  Jim  Heumann. It requires creating scenarios. Scenarios were introduced in Chapter 7, 'Creating Use Cases.' Test cases are located in the pyramid one level below scenarios, as shown in Figure 9.1.

Because  this  chapter  introduces  a  new  document  type  that  is  not  defined  in  standard RequisitePro templates, section 9.3 shows how to create a new document type in RequisitePro. If we want to avoid any overhead related to creating and maintaining a new requirement type and a new document type, we can link the requirements to test cases in a test management tool (such as ClearQuest Test Manager). However, creating new types is so easy and quick, and I feel it is worth having everything in the RequisitePro environment.

Figure 9.1 Deriving test cases from scenarios.

## 9.1 Creating Test Cases

When we have all the scenarios derived in Chapter 7, we need to create the test cases. Four steps are involved:

1. Identify variables for each use case step.
2. Identify significantly different options for each variable.
3. Combine options to be tested into test cases.
4. Assign values to variables.

The following sections describe the details of these steps.

## Step 1: Identify Variables for Each Use Case Step

First, we need to identify all input variables in all the steps in the given scenario. For example, if in some step the user enters a user ID and password, there are two variables. One variable is the user ID , and the second is the password . The variable can also be a selection that the user can make (such as selecting a flight from a list).

Here are the variables from the Book a flight use case:

- B3. User enters flight information:
- Departure airport
- Departure date

- Arrival airport
- Return date
- Number of traveling adults
- Number of traveling children
- B5. User selects a flight.
- Outbound flight
- B7. User selects a return flight.
- Return flight
- B10. User provides user ID and password to proceed buying a ticket.
- User ID
- Password
- B11. User provides passenger information:
- First name
- Last name
- Sex
- Date of birth
- B13. User selects seats.
- Seats
- B14. User provides credit card information and billing address:
- Credit card type
- Credit card number
- Expiration date
- Name on the card
- Address
- City
- State
- Zip code
- Country

The number of variables may depend on the values entered in the previous steps. If in step B3 Number of traveling adults = 2 and Number of traveling children = 1, step B11 will contain three sets of data-one for each passenger. If in step B5 the selected flight has a stopover, in step B13 the seats need to be selected for each leg of the flight.

## Step 2: Identify Significantly Different Options for Each Variable

Options are 'significantly different' if they may trigger different system behavior.

For example, if we select a user ID , which is supposed to be six to ten characters long, the following entries are significantly different:

- Alex is too short, and we expect an error message to appear.
- Alexandria is a valid user ID.
- Alexandrena is too long, and we expect the system to prevent us from entering a user ID that long.

However, Alexandria and JohnGordon are not significantly different because both are valid user IDs that should cause the system to react in the same way.

The following guidelines describe some specific cases.

An option can be considered significantly different if

- It triggers a different process flow (usually an alternative flow).

Example: Entering an invalid password shall trigger Alternative Flow 2.

- It triggers a different error message.

Example: If an e-mail is too long, the message shall be 'E-mail should have no more than 50 characters. '

Example: If an e-mail address does not contain the @, the message shall be 'Invalid email address. '

- It causes a different appearance of the user interface.

Example: If Method of Payment is a credit card, the screen shall display fields where the user can enter credit card number, expiration date, and cardholder name.

- It causes different selections to be available in drop-down lists.

Example: The customer registration screen shall contain drop-down lists Country and State/Province. State/Province shall be populated based on the country selected: for the U.S. it shall contain all the states, for Canada all the provinces, and for other countries it shall be dimmed.

This requirement creates three significantly different options:

- U.S.
- Canada
- Any other country
- It is an input to a business rule.

Example: If the order is placed after 6 p.m., and the user selects Overnight Shipment, a message shall inform the user that the book will arrive after tomorrow.

This business rule triggers two separate options:

- Overnight Shipment, order placed before 6 p.m.
- Overnight Shipment, order placed after 6 p.m.
- It is a border condition.

Example: Password should have at least six characters.

In this case we should test the following:

- Password with five characters
- Password with six characters
- Something needs to be changed versus using the default.

Example: On the credit card payment screen, the cardholder's name shall be populated with the name of the person placing the order. The user shall be able to keep this default value or insert another one.

This creates two separate options:

- Keep the default cardholder's name
- Change the cardholder's name to a different one
- The entry format is not clearly defined or enforced, and it may be interpreted differently by various users.

Example: The phone entry field shall accept free-form text.

Phone numbers are written differently by different people:

- Using parentheses: (973) 123-4567
- Using dashes: 973-123-4567
- Plain number with spaces: 973 123 4567
- No spaces: 9731234567

All reasonable formats shall be tested.

- Regular cases differ in different countries.

Credit card expiration date format may be different in the U.S. and in Europe.

- If  you  are  testing  numbers,  you  may  consider  the  following  significantly  different options:
- Regular number, reasonable from the application's point of view
- Zero
- Negative number
- A number with two decimals
- The biggest number that can be entered (for instance, 99999999999999-as many nines as can fit in the entry field)

Many options are application-specific. For example, different options for selecting a flight might include the following:

- Select a direct flight
- Select a flight with one stopover
- Select a flight with two stopovers
- Select a flight that arrives the next day
- Select a flight that arrives two days after the departure date

If you wonder how the last option is possible, check any evening flight from the U.S. to Australia.

Quite often significantly different options include combinations of more than one value. On the screen where we enter outbound and return flight dates, we have the following combinations:

- Return date later than the departure date (regular case)
- Return date equal to the departure date (border condition-valid depending on the flight times)
- Return date before the departure date (error)
- Any of the dates are not specified (error)

Depending on the specific rules imposed by the Airline Reservation System, we may have additional options, such as 'Return date over one year later than the outbound date.'

Let's find some options worth testing for all variables in a basic flow of the Book a flight use case:

- B3. User enters flight information.
- Departure airport

Valid airport code

Valid town and state

Valid town and foreign country

Invalid airport code

Nonexisting airport code

Blank

- Departure date

Valid date in the future set manually

Valid date in the future set from a calendar

Date in the past

Today's date

February 30 or 31

Not set

- Arrival airport

Valid airport code

Valid town and state

Valid town and foreign country

Invalid airport code

Nonexisting airport code

Blank

- Return date

Reasonable date, one week after departure date

Reasonable date set from calendar Date equal to the departure date Future date before the departure date Date in the past February 30 or 31

- Number of traveling adults

0

1

2

Maximum allowed

- Number of traveling children

0 (with number of adults = 0)

0 (with number of adults &gt; 0)

1 (with number of adults = 0)

2 (with number of adults &gt; 0)

Maximum allowed

- B5. User selects a flight.
- Outbound flight

Any direct flight

Flight with one stopover

Flight with maximum number of stopovers

Cheapest flight

Flight arriving the next day (if there are any)

Flight arriving in two days (if there are any)

- B7. User selects a return flight.
- Return flight

Same as for the outbound flight

- B10. User provides user ID and password to proceed buying a ticket.
- User ID

Valid user ID

User ID containing invalid characters

Nonexisting user ID

Blank

- Password

Correct password (with correct user ID)

Incorrect password (with correct user ID)

Valid password (with incorrect user ID)

Password containing invalid characters

Blank

- B11. User provides passenger information.
- First name

Valid first name

Long name (maximum number of characters allowed)

One character longer than allowed

One character

Blank

Two names with a space in between (such as Anna Maria)

- Last name

Regular last name

Long name (maximum number of characters allowed)

Name containing an apostrophe (such as D'Artagnan)

One character longer than allowed

One character

Blank

Two words with a space in between

- Sex

M

F

- Date of birth

Valid date

Future date

Recent date for an adult

Remote date for a child

Invalid date

- B13. User selects seats.
- Seats

Accept default allocation

Window seat

Middle seat

Aisle seat

Two seats next to each other

Two seats separate from each other

Select only one seat when two passengers are traveling

- B14. User provides credit card information and billing address.
- Credit card type

One option for each available card

- Credit card number

Valid number for a given type

Invalid number for a given type

Invalid number for any card

String containing letters

String containing special characters

Blank

- Expiration date

Valid future date

Date in the past

Wrong date for a valid card

Invalid date

- Name on the card

Accept the default (passenger's name)

Overwrite the default

Valid name, but not an owner of this card

Blank

Maximum number of letters allowed

- Address

Valid address

Maximum string allowed

Blank

Valid address, but not a billing address for this card

- City

Valid city

Maximum string allowed

Blank

- State

Correct state

No state selected

- Zip code

Valid zip code

String containing invalid characters

Four-digit number

Six-digit number

Blank

- Country

U.S.

Valid country, but not U.S.

Nonexisting country, maximum string allowed

Blank

## Step 3: Combine Options to Be Tested into Test Cases

The preceding section identified all significantly different options worth testing. Now we need to combine them in the sequence of test case steps. One way to do so is to create a Test Case Allocation Matrix. The rows of this matrix contain all the variables for all the steps that require

the user's input. The first column contains the step number, the second column contains the name of the variable, and the remaining columns contain tests cases. You can label them T1, T2, and so on. You need to estimate how many test cases will cover this scenario. A rough estimate may be the biggest number of significantly different options identified for a variable. If you estimate incorrectly, it's no problem because you can add or remove a column while filling the matrix. Usually from five to seven test cases cover typical scenarios. However, some application-specific cases require more test cases. We need to create one matrix per scenario selected for testing. Table 9.1 shows the Test Case Allocation Matrix for the basic flow of the Book a flight use case.

Table 9.1 Test Case Allocation Matrix with All the Variables for the Use Case Book a Flight

| Step   | Variable                              | T1   | T2   | T3   | T4   | T5   | T6   |
|--------|---------------------------------------|------|------|------|------|------|------|
| B3     | Departure airport                     |      |      |      |      |      |      |
| B3     | Departure date                        |      |      |      |      |      |      |
| B3     | Arrival airport                       |      |      |      |      |      |      |
| B3     | Return date                           |      |      |      |      |      |      |
| B3     | Number of traveling adults            |      |      |      |      |      |      |
| B3     | Number of traveling children          |      |      |      |      |      |      |
| B5     | Outbound flight                       |      |      |      |      |      |      |
| B7     | Return flight                         |      |      |      |      |      |      |
| B10    | User ID                               |      |      |      |      |      |      |
| B10    | Password                              |      |      |      |      |      |      |
| B11    | First name                            |      |      |      |      |      |      |
| B11    | Last name                             |      |      |      |      |      |      |
| B11    | Sex                                   |      |      |      |      |      |      |
| B11    | Date of birth                         |      |      |      |      |      |      |
| B11    | First name of the second passenger    |      |      |      |      |      |      |
| B11    | Last name of the second passenger     |      |      |      |      |      |      |
| B11    | Sex of the second passenger           |      |      |      |      |      |      |
| B11    | Date of birth of the second passenger |      |      |      |      |      |      |
| B11    | First name of the third passenger     |      |      |      |      |      |      |
| B11    | Last name of the third passenger      |      |      |      |      |      |      |

(continues)

Table 9.1 Test Case Allocation Matrix with All the Variables for the Use Case Book a Flight (continued)

| Step   | Variable                             | T1   | T2   | T3   | T4   | T5   | T6   |
|--------|--------------------------------------|------|------|------|------|------|------|
| B11    | Sex of the third passenger           |      |      |      |      |      |      |
| B11    | Date of birth of the third passenger |      |      |      |      |      |      |
| B13    | Outbound seats for the first leg     |      |      |      |      |      |      |
| B13    | Outbound seats for the second leg    |      |      |      |      |      |      |
| B13    | Outbound seats for the third leg     |      |      |      |      |      |      |
| B13    | Return seats for the first leg       |      |      |      |      |      |      |
| B13    | Return seats for the second leg      |      |      |      |      |      |      |
| B13    | Return seats for the third leg       |      |      |      |      |      |      |
| B14    | Credit card type                     |      |      |      |      |      |      |
| B14    | Credit card number                   |      |      |      |      |      |      |
| B14    | Expiration date                      |      |      |      |      |      |      |
| B14    | Name on the card                     |      |      |      |      |      |      |
| B14    | Address                              |      |      |      |      |      |      |
| B14    | City                                 |      |      |      |      |      |      |
| B14    | State                                |      |      |      |      |      |      |
| B14    | Zip code                             |      |      |      |      |      |      |
| B14    | Country                              |      |      |      |      |      |      |

For each row, enter all the options that need to be tested for this variable. In the first row is the variable Departure airport . In each column we enter a different option to be tested, as shown in Table 9.2.

Table 9.2 Entering Selected Options into the Test Case Allocation Matrix

| Step   | Variable          | T1                 | T2                   | T3                             | T4      | T5          | T6    |
|--------|-------------------|--------------------|----------------------|--------------------------------|---------|-------------|-------|
| B3     | Departure airport | Valid airport code | Valid town and state | Valid town and foreign country | Invalid | Nonexisting | Blank |

Some of the options are invalid because we are performing 'negative testing' to see if the system displays the correct error message (or prevents the user from entering incorrect data). So

as not to break the test case, we add additional blank rows-where we enter some valid options for all entries in the previous row where we expect the system to reject the entered value. For second-choice options, use a reasonable combination of all valid options from the previous row, and the most popular options. For example, the variable Departure airport has three valid options: a valid airport code, a valid town/state, and a valid town/country. We can use all three of them in the line with second choices. However, because a foreign country is used as a departure location much less often than a domestic airport, and we already tested this option in T3, for a secondchoice option in T6 again, we have selected a valid airport code (see Table 9.3). However, for Arrival airport , we have selected the second time Valid town and foreign country because often we do not know a foreign airport code, so we specify the town and country instead (see Table 9.4). When we have the same option a few times, for each of them we can later select different values (see the section 'Step 4: Assign Values to Variables'). For example, Valid airport code may be EWR in test case T1, LAX in T4, and JFK in T6.

Table 9.3 Entering Second Choices for Invalid Options

| Step   | Variable          | T1                 | T2                   | T3                             | T4      | T5          | T6    |
|--------|-------------------|--------------------|----------------------|--------------------------------|---------|-------------|-------|
| B3     | Departure airport | Valid airport code | Valid town and state | Valid town and foreign country | Invalid | Nonexisting | Blank |

Table 9.4 Options for Arrival Airport (Previous Rows Are Not Shown)

| Step   | Variable          | T1                 | T2                   | T3                             | T4                 | T5                   | T6                             |
|--------|-------------------|--------------------|----------------------|--------------------------------|--------------------|----------------------|--------------------------------|
| B3     | Departure airport | Valid airport code | Valid town and state | Valid town and foreign country | Invalid            | Nonexisting          | Blank                          |
|        |                   |                    |                      |                                | Valid airport code | Valid town and state | Valid town and foreign country |

We continue filling the matrix. For each row, when adding an option to be tested, be sure that it does not contradict any of the values that were entered previously in the given column. As fillers, you can use any valid options or some unusual combinations that have not been tested so far. For example, Valid date a week from now and Valid date over one year from now are not significantly different, because they should trigger the same behavior. But because we have an available cell in the Test Case Allocation Matrix, we can use it to add some unusual variations to be sure that system performs correctly in these cases, as shown in Table 9.5.

Table 9.5 Filling Subsequent Rows in the Test Case Allocation Matrix

| Step   | Variable          | T1                 | T2                   | T3                             | T4                 | T5                   | T6                             |
|--------|-------------------|--------------------|----------------------|--------------------------------|--------------------|----------------------|--------------------------------|
| B3     | Departure airport | Valid airport code | Valid town and state | Valid town and foreign country | Invalid            | Nonexisting          | Blank                          |
|        |                   |                    |                      |                                | Valid airport code | Valid town and state | Valid town and foreign country |
| B3     | Departure date    | Valid set manually | Valid, from calendar | Past                           | Today              | Invalid              | Not set                        |
|        |                   |                    |                      | Valid, over one year from now  |                    | Valid, set manually  | Valid, from calendar           |

Often we need to check the options that were set a few steps ago. For example, while setting the return date, we need to be sure that these options are in sync with the departure dates that were  previously  set  (see  Table  9.6). Also,  while  setting  the  number  of  travelers,  we  need  to account for different combinations of adults and kids, as shown in Table 9.7. The option 0/0 is not allowed, so as a second choice we added 1/max to add a case with the maximum allowed number of children. The case 0/1 probably will trigger a message explaining under what conditions a child is allowed to travel without an accompanying adult.

Table 9.6 Options for a Return Date

| Step   | Variable       | T1                 | T2                   | T3                             | T4                   | T5                  | T6                   |
|--------|----------------|--------------------|----------------------|--------------------------------|----------------------|---------------------|----------------------|
| B3     | Departure date | Valid set manually | Valid, from calendar | Past                           | Today                | Invalid             | Not set              |
|        |                |                    |                      | Valid, over one year from now  |                      | Valid, set manually | Valid, from calendar |
|        |                |                    |                      | Valid one week after departure | Valid, from calendar |                     | Valid, set manually  |

Table 9.7 Options for Number of Adults and Kids

| Step   | Variable                     |   T1 |   T2 | T3              |   T4 |   T5 | T6              |
|--------|------------------------------|------|------|-----------------|------|------|-----------------|
| B3     | Number of traveling adults   |    1 |    2 | 0               |    1 |    0 | Maximum allowed |
|        |                              |      |      | 1               |      |      |                 |
| B3     | Number of traveling children |    0 |    1 | 0               |    2 |    1 | 1               |
|        |                              |      |      | Maximum allowed |      |      |                 |

Sometimes the number of options to be tested is smaller than the number of columns, as shown in Table 9.8. Fill the remaining cells either with the most popular options or with some slightly different but valid options.

Table 9.8 Options for User ID and Password

| Step   | Variable   | T1      | T2        | T3          | T4      | T5                                     | T6   |
|--------|------------|---------|-----------|-------------|---------|----------------------------------------|------|
| B10    | User Id    | Valid   | Invalid   | Nonexisting | Blank   | Valid, using maximum number of letters |      |
|        |            |         | Valid     | Valid       | Valid   |                                        |      |
| B10    | Password   | Correct | Incorrect | Invalid     | Blank   | Incorrect                              |      |
|        |            |         | Correct   | Correct     | Correct | Correct                                |      |

Sometimes  there  are  more  options  than  the  number  of  columns  we  initially  allocated. Before adding a new column, analyze whether some of the options can be moved to the next row. Because some of the options will result in an error message, we can move some valid options to a 'second-chance row.' In Table 9.9 the option 'Two words' does not fit in the same row with the other six options, but because 'Longer than allowed' is one of the invalid options, in this test case we can retry the last name containing two words.

Table 9.9 Seven Options for Last Name (the Seventh Option Is Moved to a 'Second-Chance Row')

| Step   | Variable   | T1      | T2             | T3                 | T4                  | T5            | T6      |
|--------|------------|---------|----------------|--------------------|---------------------|---------------|---------|
| B11    | Last name  | Regular | Maximum length | With an apostrophe | Longer than allowed | One character | Blank   |
|        |            |         |                |                    | Two words           |               | Regular |

Some rows are not filled  for  every  column.  In  our  example  the  rows  with  information related to the second passenger apply only to the test cases in which the number of passengers is greater than one, the rows with the information related to the third passenger apply only to the test cases in which the number of passengers is greater than two, and so forth (see Table 9.10). For test cases in which we have many passengers, we do not need to test all negative cases for each passenger. If some unusual option worked correctly for the first three passengers, it probably will work for the remaining three.

Some cells may not be filled when a test case is created. In the test case in which we test 'Next day arrival,' we do not know up front how many stopovers the flight will have, so rows related to selecting seats for the second or third legs may be filled at the time of testing if the selected flight has more than one leg (see Table 9.11).

Table 9.10 Filling in the Passenger's Information Depends on How Many Passengers Are Being Used in the Specific Test Case

| Step   | Variable                     | T1      | T2             | T3                  | T4            | T5      | T6         |
|--------|------------------------------|---------|----------------|---------------------|---------------|---------|------------|
| B3     | Number of traveling adults   | 1       | 2              | 0                   | 1             | 0       | Maximum    |
|        |                              |         |                | 1                   |               |         |            |
| B3     | Number of traveling children | 0       | 1              | 0                   | 2             | 1       | 1          |
|        |                              |         |                | Maximum             |               |         |            |
|        |                              |         | Correct        | Correct             | Correct       | Correct |            |
| B11    | First name                   | Regular | Maximum length | Longer than allowed | One character | Blank   | With space |
|        |                              |         |                | Regular             |               | Regular |            |

| Step   | Variable                              | T1      | T2             | T3                 | T4                  | T5                | T6         |
|--------|---------------------------------------|---------|----------------|--------------------|---------------------|-------------------|------------|
| B11    | Last name                             | Regular | Maximum length | With an apostrophe | Longer than Allowed | One Character     | Blank      |
|        |                                       |         |                |                    | Two words           |                   | Regular    |
| B11    | Sex                                   | M       | F              | Not set            | M                   | F                 | Not set    |
|        |                                       |         |                | M                  |                     |                   | F          |
| B11    | Date of birth                         | Valid   | Future         | Invalid            | Last year           | Over 20 years ago | Valid      |
|        |                                       |         | Valid          | Valid              | Valid               | Valid             |            |
| B11    | First name of the second passenger    |         | Regular        | Maximum length     | Longer than allowed |                   | Blank      |
|        |                                       |         |                |                    | One character       |                   | With space |
| B11    | Last name of the second passenger     |         | Maximum length | With an apostrophe | Longer than allowed |                   | Blank      |
|        |                                       |         |                |                    | One character       |                   | Two words  |
| B11    | Sex of the second passenger           |         | M              | F                  | Not set             |                   | M          |
|        |                                       |         |                |                    | F                   |                   |            |
| B11    | Date of birth of the second passenger |         | Future         | Invalid            | Last year           |                   | Valid      |
|        |                                       |         | Valid          | Valid              | Valid               |                   |            |
| B11    | First name of the third passenger     |         | Maximum length | With space         | Regular             |                   | Regular    |

(continues)

Table 9.10 Filling in the Passenger's Information Depends on How Many Passengers Are Being Used in the Specific Test Case (continued)

| Step   | Variable                              | T1   | T2             | T3                 | T4        | T5   | T6      |
|--------|---------------------------------------|------|----------------|--------------------|-----------|------|---------|
| B11    | Last name of the third passenger      |      | Maximum length | With an apostrophe | Two words |      | Regular |
| B11    | Sex of the third passenger            |      | M              | F                  | M         |      | F       |
| B11    | Date of birth of the third passenger  |      | Valid          | Valid              | Valid     |      | Valid   |
| B11    | First name of the fourth passenger    |      |                | Valid              |           |      | Valid   |
| B11    | Last name of the fourth passenger     |      |                | Valid              |           |      | Valid   |
| B11    | Sex of the fourth passenger           |      |                | F                  |           |      | M       |
| B11    | Date of birth of the fourth passenger |      |                | Valid              |           |      | Valid   |
| B11    | First name of the fifth passenger     |      |                | Valid              |           |      | Valid   |
| B11    | Last name of the fifth passenger      |      |                | Valid              |           |      | Valid   |
| B11    | Sex of the fifth passenger            |      |                | M                  |           |      | F       |
| B11    | Date of birth of the fifth passenger  |      |                | Valid              |           |      | Valid   |

| Step   | Variable                             | T1   | T2   | T3    | T4   | T5   | T6    |
|--------|--------------------------------------|------|------|-------|------|------|-------|
| B11    | First name of the sixth passenger    |      |      | Valid |      |      | Valid |
| B11    | Last name of the sixth passenger     |      |      | Valid |      |      | Valid |
| B11    | Sex of the sixth passenger           |      |      | F     |      |      | M     |
| B11    | Date of birth of the sixth passenger |      |      | Valid |      |      | Valid |

Table 9.11 Filling in the Seat Selection Depends on How Many Passengers Are Being Used in the Specific Test Case and How Many Stopovers the Selected Flight Has

| Step   | Variable                          | T1     | T2                         | T3                                           | T4                                   | T5               | T6                                      |
|--------|-----------------------------------|--------|----------------------------|----------------------------------------------|--------------------------------------|------------------|-----------------------------------------|
| B3     | Number of traveling adults        | 1      | 2                          | 0                                            | 1                                    | 0                | Maximum                                 |
|        |                                   |        |                            | 1                                            |                                      |                  |                                         |
| B3     | Number of traveling children      | 0      | 1                          | 0                                            | 2                                    | 1                | 1                                       |
|        |                                   |        |                            | Maximum                                      |                                      |                  |                                         |
| B5     | Outbound flight                   | Direct | 1 stopover                 | Maximum stopovers                            | The cheapest                         | Next-day arrival | Arrival in 2 days                       |
| B7     | Return flight                     | Direct | 1 stopover                 | Maximum stopovers                            | The cheapest                         | Next-day arrival | Arrival in 2 days                       |
| B13    | Outbound seats for the first leg  | Window | 3 seats next to each other | Accept the default                           | 2 seats together, 3rd in another row | Aisle            | 2 seats selected, the rest not selected |
| B13    | Outbound seats for the second leg |        | Only one seat selected     | All seats next to the window, different rows |                                      |                  |                                         |
| B13    | Outbound seats for the third leg  |        |                            | Accept the default                           |                                      |                  |                                         |

## Step 4: Assign Values to Variables

In this step, you replace placeholders such as 'a very long last name' or 'a long phone number with extension' with actual values, such as 'Georgiamistopolis' and '011-48 (242) 425-3456 ext. 1234,' respectively.

In this step we also split all the test cases from the Test Case Allocation Matrix, creating a separate table for each test case.

For Test Case 1 of Book a flight , the test case is represented by the matrix shown in Table 9.12. In addition to the rows from Test Case Allocation Matrix, we have added some rows representing actions. For example, B3 Search flights means that we are selecting an action that initiates searching for flights. Usually this involves clicking a button with a name representing the action. However, at this stage we try to avoid decisions about whether it is clicking a button, clicking a link, or selecting a menu option. The user interface designer will decide which control represents the selection later in the process.

For the rows representing input variables, the expected result is usually either accepted or rejected. For the rows representing actions, the expected result is often the appearance of a new screen or dialog box.

Table 9.12 Test Case

| Step   | Variable                     | T1                   | Expected Result       | Actual Result   | Pass/ Fail   | Com- ments   |
|--------|------------------------------|----------------------|-----------------------|-----------------|--------------|--------------|
| B3     | Departure airport            | EWR                  | Accept                |                 |              |              |
| B3     | Departure date               | 39166                | Accept                |                 |              |              |
| B3     | Arrival airport              | LAX                  | Accept                |                 |              |              |
| B3     | Return date                  | 39179                | Accept                |                 |              |              |
| B3     | Number of traveling adults   | 1                    | Accept                |                 |              |              |
| B3     | Number of traveling children | 0                    | Accept                |                 |              |              |
| B3     | Search flights               | Search flights       | List of flights       |                 |              |              |
| B5     | Outbound flight              | Select direct flight | List of flights       |                 |              |              |
| B7     | Return flight                | Select direct flight | Login screen          |                 |              |              |
| B10    | User ID                      | User1                | Accept                |                 |              |              |
| B10    | Password                     | Password             | Accept                |                 |              |              |
| B10    | Login                        | Login                | Passenger data screen |                 |              |              |

| Step   | Variable           | T1               | Expected Result       | Actual Result   | Pass/ Fail   | Com- ments   |
|--------|--------------------|------------------|-----------------------|-----------------|--------------|--------------|
| B11    | First name         | John             | Accept                |                 |              |              |
| B11    | Last name          | Smith            | Accept                |                 |              |              |
| B11    | Sex                | M                | Accept                |                 |              |              |
| B11    | Date of birth      | Valid            | Accept                |                 |              |              |
| B11    | Submit             | Submit           | Seat selection screen |                 |              |              |
| B13    | Outbound seats     | Window           | Accept                |                 |              |              |
| B13    | Submit             | Submit           | Seat selection screen |                 |              |              |
| B13    | Return seats       | Window           | Accept                |                 |              |              |
| B13    | Submit             | Submit           | Seat selection screen |                 |              |              |
| B14    | Credit card type   | Visa             | Accept                |                 |              |              |
| B14    | Credit card number | 4123456789012340 | Accept                |                 |              |              |
| B14    | Expiration date    | 01/01/2009       | Accept                |                 |              |              |
| B14    | Name on the card   | John Smith       | Accept                |                 |              |              |
| B14    | Address            | 1 Main St.       | Accept                |                 |              |              |
| B14    | City               | NewYork          | Accept                |                 |              |              |
| B14    | State              | NY               | Accept                |                 |              |              |
| B14    | Zip code           | 10001            | Accept                |                 |              |              |
| B14    | Country            | USA              | Accept                |                 |              |              |
| B14    | Submit             | Submit           | Confirmation number   |                 |              |              |

This document will be given to a tester. The tester will follow the directions from columns 2 and 3 and record the results in columns 5, 6, and 7.

While creating scenarios and test cases, you can give feedback to the use case designers and refine the requirements. This can help you find any gaps in requirements early in the process.

## 9.2 Business Rules

The preceding section often referred to the field's required length or the allowable values for some parameter. How do you know the minimum and maximum allowable length of a field? This requirement can come from different sources. Sometimes it comes from the business analyst or a customer. For example, if we enter a Dun &amp; Bradstreet number that identifies a company, that number should always be nine digits long. It is a business requirement.

Quite often, however, the requirement does not come from the customer or the user. If you ask the customer how big the last name field should be, he might say he does not care and ask you to make it whatever is reasonable. In this case it is a design step rather than a requirement step to decide how long the variable should be.

We call this type of requirement business rules. Distinguishing them from other requirements provides additional flexibility because business rules may change over time. For example, an Account Number may have eight digits when a system is developed but change to nine digits a year later.

There is a question about where business rules should be documented. One place to add this kind of requirement is in a section called Special Requirements in the use case. This is appropriate  if  these  rules  are  specific  to  this  use  case. Another  place  where  you  can  put  this  kind  of requirement is in the glossary or data dictionary.

Another good option is to specify a separate Business Rules (BR) document. You can then define BR as a distinct requirement type. Then, the step in the use case could be worded in this fashion: 'System validates the Account Information according to BR nnn ,' where nnn is a business rule number. This puts the business rules in a context, which is very useful for the developer. Using the OOAD (Object Oriented Analysis and Design) approach, they know in which method for a particular class the validation needs to occur.

## 9.6 Summary

This chapter presented a method of deriving functional test cases from use cases. Here are some benefits of this approach:

- Test cases are derived in a more automatic way
- Duplicate testing is avoided
- Better test coverage is achieved
- Easier monitoring of testing progress
- Easier workload balancing between testers
- Easier regression testing
- Contribution to early discovery of missing requirements

The test cases that you create can be used for manual testing, as well as for automated testing using tools, such as IBM Rational Robot and IBM Rational Functional Tester.

This approach applies to functional requirements. The next chapter discusses how to test nonfunctional requirements.

## CHAPTER 10

## Creating Test Cases from Supplementary Requirements

The preceding chapter introduced a method that can be applied to any use case to derive test cases. This chapter discusses deriving a test case from supplementary requirements (see Figure 10.1). With supplementary requirements, however, there is no unified approach, because various requirements are different in nature, and testing them requires quite different methods. This chapter presents the following methods of creating test cases:

- Executing selected test cases in different environments
- Adding an additional check to all use cases
- Checking and modifying specific use cases
- Performing the exercise
- Checklist
- Analysis
- White-box testing
- Automated testing

This chapter also covers using IBM Rational Robot and IBM Rational Test Manager for automated testing. The most recent tool from IBM, replacing previous versions of Test Manager, is called ClearQuest Test Manager. These tools can also be used for functional testing, not only for the performance testing described in this chapter.

Figure 10.1 Deriving test cases from supplementary requirements.

## 10.1 Executing Selected Test Cases in Different Environments

Some requirements request that the application shall work in different environments:

The web-based interface shall run in Internet Explorer (version 6.0 and newer) and Netscape (version 6 and newer).

The best approach to addressing this type of requirement is to select some big test case (in our case it may be one of the test cases related to a basic flow of the Book a flight use case) and execute it in different environments. This means that one full test case will be executed using the Internet Explorer (IE) browser and then using the Netscape browser.

Quite often a requirement is related to operating systems on which the application should run:

The system shall run on Windows XP, Windows Vista, and Solaris 10 operating systems.

In case of Internet applications, however, the operating system is not that important, as it is in the case of desktop and client/server applications.

A variation of this case is if we need to test the application in the same environment, but with a different setup:

Dates shall be displayed according to the format stored in the web browser settings.

In this case the testing involves the following steps:

1. Check the web browser settings.
2. Run the full test script for these settings.

3. Change the web browser settings (for example, to the French way of displaying the date).
4. Run the full test script for the new settings.

Figure 10.2 shows this approach. The selected scenario is tested in different environments, so we have one test case per environment.

Figure 10.2 A selected scenario is executed in different environments.

## 10.2 Adding an Additional Check to All Use Cases

Many requirements describe appearance or behavior of some controls in the user interface. Here are some examples:

On each page a Next button shall suggest a default flow.

On data entry screens the system shall indicate which fields are mandatory by placing a star next to the field.

The system shall display a pop-up calendar when any date is entered, as in flight date, hotel stay date, or car rental date.

Multiple entry fields on one page shall be vertically aligned.

When a dialog box is opened, the focus shall be on the first entry field in the dialog box.

For every invalid input from the user, the system shall display a meaningful error message, explaining what format is expected for the input.

Currency amounts shall be calculated and stored with accuracy of two decimal places. Each feature of the system should be described in online help, available from the menu on every page.

On  the  pages  that  gather  the  user's  personal  data,  there  shall  be  a  link  to  a  page describing the privacy policy.

The best way to incorporate testing of these features is to add a check to all test cases that are already created for various use cases. Because test cases derived from use cases cover every possible screen used in the application, we can just add appropriate checks while visiting each specific screen for the first time. This way, we can be sure that the feature was checked in all places where it is applicable. Figure 10.3 shows that all test cases are updated with the specific supplementary requirement.

Figure 10.3 Additional checks are added to all test cases.

Every time a new screen or dialog box is displayed, we need to insert a checklist into the test case.

Some requirements need to be checked once per page, and others require testing all the controls of a specific type. Here are some examples:

- One check per page:
- Is there a Next button suggesting a default navigation?
- If the page contains multiple entry fields, are they vertically aligned?
- Is help available from the menu?

- Checking specific controls:
- Do all mandatory fields have a star next to them?
- Is a pop-up calendar available for every date field?
- Do all currency fields accept and display two decimal places?

## 10.3 Checking and Modifying Specific Use Cases

Even though some requirements are described in the Supplementary Specification, they are associated with some specific use cases. This may happen when this piece of functionality is not really related to the main use case but plays a supportive or administrative role. As an example, we can look at requirements related to security and password-protected access to some parts of the application:

A password shall be required to access administrator screens.

To submit the offers, hotel providers, car providers, and airline representatives shall log in to the system using their IDs and passwords.

Users shall pick IDs and passwords while buying an airline ticket.

In each of these requirements we can add a few steps to the appropriate use case. If the login procedure is complicated, we may consider extracting it as a separate use case that will be included in other use cases.

Figure 10.4 shows that an update is made to the use case and then propagated through scenarios and test cases.

Figure 10.4 Some supplementary requirements affect use cases and all scenarios and test cases derived from them.

## 10.4 Performing the Exercise

Quite often we need to perform the action described in the requirement. In many cases the task does not require creating formal scenarios and test cases.

An error log containing information about all critical errors shall be accessible to the system administrator over the Internet, so it can be checked remotely at any time.

To test this feature, someone will log in to the system over the Internet and check if he or she can access an error log.

Some requirements are related to the average time required to perform a task:

A service provider shall be able to learn to use a system in one hour.

The average time of booking a hotel room shall be no longer than ten minutes.

In these cases it may be beneficial to perform the task by three independent testers and compare the timings.

Some other tests may be performed by the same person but repeated a few times to check if the timings are consistent:

In  case  of  a  system  failure,  a  redundant  system  shall  resume  operations  within  30 seconds.

The average repair time shall be less than one hour.

The system shall be operational within one minute of starting up.

It is okay to do some tests only once that require a long time to complete, unless we suspect some problems:

Deployment time on a new version of WebSphere Application Server shall be no longer than one day.

If a test deployment on a new version of WAS took 15 hours, there is no need to check it more. However, if the first test took 40 hours, we need to analyze the cause and retest after fixing the problems.

Here  is  another  example  of  a  requirement  that  can  be  checked  just  by  performing  an exercise:

The user interface shall not contain any components that would prevent automated testing using IBM Rational Robot and IBM Rational Functional Tester.

Some requirements may require a mini use case, such as counting how many clicks are required to access specific functionality:

Booking airplane ticket functionality shall be available from the home page.

Renting a car functionality shall be available after no more than one click from the home page.

## 10.5 Checklist

Some requirements do not need any complicated testing, so you can just check to see if they are fulfilled. For example:

The system shall use an Oracle database.

Either Oracle is used, or it is not-just mark the checklist.

Some  other  examples  of  this  kind  of  testing  simply  by  checking  might  include  the following:

All system errors shall be recorded and made available to the administrator.

All  transactions  (ticket  purchase,  making  a  reservation,  updating  a  reservation,  and canceling a reservation) shall be recorded and made available to the administrator.

The system shall use J2EE architecture.

If the architecture requires an application server, IBM WebSphere shall be used.

The Administrator's Guide shall be available as a PDF document.

Separate tabs shall be available for the main functionality (booking the flight, reserving a hotel room, reserving a car, attractions information).

## 10.6 Analysis

Some requirements do not require big testing but require some analysis. Often a mental exercise is enough, without performing physical testing.

No technical skills (except for using the browser) shall be required to use the system.

The system shall be available 24 hours a day, seven days a week.

During analysis of the last requirement, we can ask the following questions:

- Is anything preventing the application from running continuously?
- Is there any scheduled maintenance that can make the application unavailable for some period of time?

Many features of this type require analyzing the architecture. It is worth involving a system architect in this analysis:

No installation on the client's workstation shall be required. All system upgrades and new releases should be done on the server.

The system shall automatically book a ticket with the Airline Reservation System without the necessity of human intervention.

Adding a user interface in a different language shall not require rewriting the application logic.

Some architectural analysis may be supported by a simple demo:

The  system's  main  functionality  (booking  the  flight,  purchasing  an  airplane  ticket, reserving a hotel room, reserving a car) shall be encapsulated in components that can be reused in a client/server (non-Internet) application.

A very simple test client application can be created that proves that components can be reused in other systems.

## 10.7 White-Box Testing

Some testing should be done with knowledge of the application code or some other application internals. This is called white-box testing.

When returning a list of flights, the system cannot miss any direct flight or any flight with only one stopover.

To check this requirement, we need to access the flight database directly, not through our application, and compare the results with a list obtained through our system.

Quite often testing requires checking if a specific algorithm was applied correctly:

The  list  of  flights  returned  from  the  search  shall  include  the  flight  calculated  from Dijkstra's Shortest Path algorithm.

## 10.8 Automated Testing

Automated testing is very helpful in checking performance and reliability requirements such as these:

Average system response time shall be less than two seconds.

The system shall accommodate 1,000 booked flights per minute.

The system shall accommodate 5,000 concurrent users.

The average time between failures shall exceed 20 hours.

The system may be unavailable no more than one minute per 24 hours.

For performance and reliability testing, we do not need to automate all test cases. We can select from one to three test cases. It is worth selecting a test case representing the most popular scenario. It is also worth selecting a test case containing the longest operations. In our example, basic flow of the Book a flight use case is the most popular, and at the same time it contains the longest processing (searching flights). Because making car and hotel reservations are also often used and contain completely different flows, it is also worth using them in automated testing.

We can run the same script many times with different parameters. Two of the most important parameters are number of users and number of iterations. Iterations are performed sequentially. Number of users specifies how many threads are executed concurrently.

To analyze the impact of number of concurrent users, the same script shall be executed for a different number of users-for example, for 1, 10, 100, and 1,000. Actual numbers may vary depending on the application and the required ultimate number of users.

To test mean time between failures and other reliability benchmarks, we shall have at least one run that is very long-at least 48 hours.

Here are some questions that may be answered using automated testing:

- What is the response time during normal conditions?
- How many users can the system support before the performance becomes unacceptable?
- How does the system behave with the maximum expected number of users?
- If the number of users increases beyond the maximum, does the system gracefully lose performance, or does it crash?
- How do the system's performance and reliability depend on the system resources (available memory, disk space)?
- How does performance depend on time of day (evenings versus mornings, weekends versus weekdays)?

Automated testing is also useful for functional regression testing. In this case it is worth creating scripts for many scenarios.

The  main  testing  tools  provided  by  IBM  are  Rational  Robot,  Rational  Test  Manager, Rational ClearQuest Test Manager, Rational Functional Tester, and Rational Performance Tester. As an example, the next section shows how to create and execute scripts using Rational Robot and Rational Test Manager.

## 10.9 Using Robot and Test Manager for Automated Testing

IBM Rational Robot  can be used to develop two kinds of scripts:

- GUI scripts for functional testing
- Virtual users (VU) sessions for performance testing

IBM Rational Test Manager  is a framework that can be used to plan, design, implement, execute, and evaluate tests. We can create a suite that executes scripts for many virtual users. Recently a newer tool was released-IBM Rational ClearQuest Test Manager.

A usual approach to performance testing is to record scripts with Robot and then use Test Manager (or ClearQuest Test Manager) to schedule and play back these scripts.

## Recording a VU Script

Recording a virtual users (VU) script with Rational Robot is fairly straightforward. Follow these steps:

1. Start Rational Robot by selecting All Programs &gt; Rational Software &gt; Rational Robot.
2. Provide your username and password, as shown in Figure 10.5. The password for the administrator was established when the Rational project was set up (refer to Chapter 4, 'Setting Up the Project,' Figure 4.12).
3. Select the project from the list box.
4. Click OK.
5. Click the circle labeled VU, as shown in Figure 10.6.
6. Name the session, as shown in Figure 10.7. You can use the name of a use case, a scenario, or a test case.

Figure 10.5 Rational Test Login dialog box.

Figure 10.6 Rational Robot initial screen.

Figure 10.7 Selecting a name for a session.

7. Select the path to IE in the Executable field, and leave the other fields blank (see Figure 10.8). Usually, the path should be C:\Program Files\Internet Explorer\IEXPLORE.EXE.
8. Start recording all the steps from the test case. The Session Record toolbar appears. It contains four icons, as shown in Figure 10.9:
- Stop recording
- Open Robot window
- Split session into scripts
- Open Session Insert toolbar

Figure 10.8 Selecting an application. In the case of Internet applications, the browser executable is selected.

## Figure 10.9 Session Record toolbar.

Clicking the Open Session Insert toolbar icon opens the toolbar shown in Figure 10.10. It contains the following icons:

- Run
- Start timer
- Stop timer
- Comment
- Synchronization point
- Start block
- Stop block

## Figure 10.10 Session Insert toolbar.

9. If you want to capture the amount of time spent on a specific operation, start the timer by clicking the green-light icon (second icon from the right) on the Session Insert toolbar. Name the timer, as shown in Figure 10.11. Stop the timer by clicking the red-light icon (third icon from the right) when the operation is complete. When you stop the timer, you need to select the timer from a list, as shown in Figure 10.12 because many timers can run at the same time.

Figure 10.11 Assigning a name to a timer.

Figure 10.12 Selecting the timer that should be stopped.

10. When you are done recording the script, click the dark blue square on the Session Record toolbar (first icon from the left in Figure 10.9).
11. Name the script, as shown in Figure 10.13. It is okay to use the same name you used in the session in step 6.
12. Click  OK  in  the  Stop  Recording  dialog  box.  A  window  with  VU  language  code appears, as shown in Figure 10.14.

Figure 10.13 Naming the just-recorded script.

## How to Run a Suite in Rational Test Manager

Test Manager  can  emulate  many  concurrent  users  performing  various  tasks  reflected  in  test scripts. A test script can be the following:

- A session recorded using Robot
- A script imported from Quality Architect
- Written from scratch in Java or Visual Basic following required conventions
- Written in any scripting language (in this case an adapter also needs to be written)

Figure 10.14 The code of the recorded script.

This chapter uses a session recorded in Robot. To create and run the test suite, follow these steps:

1. Start  Test  Manager  by  selecting All  Programs  &gt;  Rational  Software  &gt;  Rational  Test Manager, as shown in Figure 10.15.

Figure 10.15 Main Test Manager window.

2. If the login dialog box appears, enter your information in the User Name and Password fields.
3. From the main Test Manager window, select File &gt; Open Suite.
4. Select the Performance Testing Wizard option in the New Suite dialog box, shown in Figure 10.16, and click OK.
5. Select Local computer, as shown in Figure 10.17.

Figure 10.16 New Suite dialog box.

Figure 10.17 Performance Testing Wizard - Computers.

6. Click the Add to List button.
7. Click the Next button.
8. Select scripts. You see the dialog box shown in Figure 10.18.
9. Click the Add to List button.
10. Click the Finish button.
11. Right-click VU User Group 1, as shown in Figure 10.19, and select Run Properties.
12. In the Run Properties of User Group dialog box, shown in Figure 10.20, set the maximum number of users. In other words, set the number of virtual users you want to simulate concurrently. Click OK.
13. Right-click the icon representing a script (in Figure 10.19 it is named 'Book a flight'), and select Run Properties.

Figure 10.18 Selecting test scripts.

Figure 10.19 A tree representation of a suite.

Figure 10.20 Run Properties of User Group dialog box, in which you set the maximum number of users.

14. In the Run Properties of Test Script dialog box, shown in Figure 10.21, set the number of iterations-how many times you want to repeat the script for the same user. Click OK.
15. Save the suite by selecting File &gt; Save As, as shown in Figure 10.22.
16. Run a suite by selecting File &gt; Run Suite.

Figure 10.21 Run Properties of Test Script dialog box (set the number of iterations).

Figure 10.22 Saving a suite.

17. You can adjust the number of users for the current run, as shown in Figure 10.23.

Figure 10.23 Run Suite dialog box (set parameters for the test run).

## Analyzing the Results

When the test run ends, the result on the screen (see Figure 10.24) contains the status of executed commands. On this screen, you see bars that are green and red. Green represents 'pass,' and red represents 'fail.'

Figure 10.24 Status report for commands executed during a successful test run.

To see the performance results, click the Perf button near the top of the screen. Figure 10.25 shows sample results from one iteration run for one user, and Figure 10.26 shows results from running five iterations of another test script. The columns contain the following:

- Command number
- Command ID
- Number of times the command was executed
- Mean (average) time from all the users (all times are expressed in seconds)
- Standard deviation (average distance of the times from the mean time)
- Minimum time
- Five columns with percentiles: 50th, 70th, 80th, 90th, and 95th
- Maximum time

Figure 10.25 Performance results (one iteration).

The second column is the command ID. It is generated by taking the first seven characters from the script name and adding a tilde (~) and a three-digit sequential number. That's why the command IDs for the Book a flight script are named 'Book a ~001,' 'Book a ~002,' and so on.

We expect the number in the third column to be equal to the number of virtual users multiplied by the number of iterations. However, if the whole suite does not execute correctly, some scripts would not reach this command, and the number of executions of this command would be smaller.

The results shown in Figure 10.25 are from one iteration run for one user, so all the times are equal (mean, minimum, and maximum). However, during the run, the results of which are shown in Figure 10.26, each command was executed five times, so we can see the difference between  the  minimum  and  maximum  times.  These  spreadsheets  contain  timings  from  all

responses. This information is useless because we do not know to which operations they correspond. The most useful are times captured for specific operations between starting and stopping the timer because we were able to assign meaningful names to them.

Figure 10.26 Performance results (five iterations).

|    | CmdID     | NUM   |   MEAN |   STD DEV |    MIN |   50th |   70th |   80th |   90th |   95th | MAX   |
|----|-----------|-------|--------|-----------|--------|--------|--------|--------|--------|--------|-------|
|  1 | Booka~001 |       |   0.04 |      0.07 |   0    |   0    |   0    |   0.04 |   0.11 |   0.15 | 0.19  |
|  2 | Booka~002 |       |   0.35 |      0.16 |   0.19 |   0.31 |   0.33 |   0.39 |   0.53 |   0.59 | 990   |
|  3 | Booka~003 |       |   1.08 |      0.63 |   0.28 |   1.08 |   1.34 |   1.54 |   1.8  |   1.93 | 2.06  |
|  4 | Booka~004 |       |   0.02 |      0.03 |   0    |   0    |   0    |   0.02 |   0.05 |   0.06 | 80:0  |
|  5 | Booka~005 |       |   0.02 |      0.04 |   0    |   0    |   0    |   0.02 | 900    | 800    | 0.09  |
|    | Booka~006 |       |   0.2  |      0.01 |   0.19 |   0.2  |   0.2  |   0.2  |   0.2  |   0.2  | 0.20  |
| 67 | Booka~007 |       |        |      0.01 |   0.19 |   0.2  |   0.22 |   0.22 |   0.22 |   0.22 | 0.22  |
|  8 | Booka~008 |       |   0.2  |      0.01 |   0.19 |   0.2  |   0.22 |   0.22 |   0.22 |   0.22 | 0.22  |
|  9 | Booka~009 |       |   0.2  |      0.01 |   0.19 |   0.2  |   0.2  |   0.2  |   0.2  |   0.2  | 0.20  |
| 10 | Booka~010 |       |   0.03 |      0.05 |   0    |   0    |   0    |   0.03 |   0.08 |   0.1  | 0.13  |
| 11 | Booka~011 |       |   0    |      0    |   0    |   0    |   0    |   0    |   0    |   0    | 000   |
| 12 | Booka~012 |       |   0.19 |      0.03 |   0.16 |   0.17 |   0.22 |   0.24 |   0.24 |   0.24 | 0.24  |
| 13 | Booka~013 |       |   0.19 |      0.03 |   0.16 |   0.17 |   0.22 |   0.24 |   0.24 |   0.24 | 0.24  |
| 14 | Booka~014 |       |   0.02 |      0.03 |   0    |   0    |   0    |   0.02 |   0.05 | 900    | 80:0  |
| 15 | Booka~015 |       |   0.13 |      0.04 |   0.09 |   0.11 |   0.13 |   0.15 |   0.17 |   0.18 | 0.19  |
| 16 | Booka~016 |       |   0.13 |      0.04 | 600    |   0.11 |   0.13 |   0.15 |   0.17 |   0.18 | 0.19  |
| 17 | Booka~017 |       |   0.01 |      0.02 |   0    |   0    |   0    |   0.01 |   0    |   0.04 | 0.05  |
| 18 | Booka~018 |       |   0.73 |      1.22 |   0.09 |   0.1  |   0.16 |   0.77 |   1.97 |   2.57 | 3.17  |
| 19 | Booka~019 |       |   0.73 |      1.22 | 600    |   0.1  |   0.16 |   0.77 |   1.97 |   2.57 | 3.17  |
| 20 | Booka~020 |       |   0.28 |      0.07 |   0.23 |   0.25 |   0.26 |   0.3  |   0.36 |   0.39 | 0.42  |

We can cut and paste information from the performance results table to Microsoft Excel and do some cleanup by removing unnecessary rows.

Table 10.1 presents an example of a cleaned-up spreadsheet for a five-user run. The first column contains the name of the timed operation, and the rest of the columns are the same as the columns in Figure 10.25. Analyzing this data shows whether the time taken to perform specific operations is satisfactory.

Table 10.1 Scenarios Selected for Testing in the Book a Flight Use Case

| Operation              |   Number |   Mean |   Deviation |   Minimum |   50th |   70th |   80th |   90th |   95th |   Maxi- mum |
|------------------------|----------|--------|-------------|-----------|--------|--------|--------|--------|--------|-------------|
| Search flights         |        5 |   5.88 |        0.69 |      5.11 |   5.92 |   6.09 |   6.31 |   6.66 |   6.84 |        7.02 |
| Select outbound flight |        5 |   3.06 |        0.28 |      2.72 |   2.91 |   3.26 |   3.36 |   3.4  |   3.42 |        3.44 |
| Select return flight   |        5 |   3.61 |        1.97 |      1.92 |   2.16 |   4.68 |   5.57 |   6.1  |   6.37 |        6.63 |
| Select seats           |        5 |   3.45 |        0.38 |      2.74 |   3.69 |   3.7  |   3.71 |   3.72 |   3.73 |        3.74 |
| Purchase ticket        |        5 |   4.57 |        0.55 |      4.05 |   4.23 |   5.03 |   5.23 |   5.25 |   5.25 |        5.26 |

## 10.10 Summary

This chapter presented eight methods of deriving test cases from supplementary requirements. In most cases we dealt with nonfunctional requirements. Supplementary requirements vary significantly as far as type. That's why no unified method exists to test them, so we need to select an appropriate approach for every requirement.

Using  an  automated  testing  tool  is  very  helpful  for  testing  performance  and  reliability requirements.  The  example  presented  in  section  10.9  is  a  simple  case  of  recording  an  IBM Rational Robot session and running it for the required number of virtual users. More advanced usage or Robot includes setting up the type of recording depending on the system architecture, adjusting  script-generation  options,  using  data  pools,  and  manual  update  of  recorded  scripts. Automated testing tools are also useful in executing functional test cases, as described in the preceding chapter. However, although functional testing may be conducted manually, it is almost impossible to do performance testing without these tools.

The test cases should be prepared quite early in the project because creating them may raise some questions that will help refine the requirements. However, actual testing begins only after some part of the system is designed and developed. The next chapter discusses the design discipline.