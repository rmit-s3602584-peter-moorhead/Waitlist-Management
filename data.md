# Database Management Information

The database used MySql, and was set up using the following version:

**mysql  Ver 14.14 Distrib 5.7.31, for Linux (x86_64) using  EditLine wrapper**

The latest versions of MySql (form version 8) does has changed the authentication methods from native passwords
to hashed passwords using sha2. Unfortunately **nodejs** still uses native passwords so MySql will need to be
configured to take native passwords. As such you may get the following error:

```Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client at Handshake.Sequence._packetToError```

If you do get the above error, the instructions on how to do this can be found [in the answer to this question on Stackoverflow]
(https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server).

## Database Setup
The connection to the database is located in the **database_setup.py** file in the **DatabaseSetup** folder and in the **database_utils.js** file in the
**briskly-server** folder.

To setup the database, go into the **DatabaseSetup** folder and type:

```./database_setup.py```

To configure access to the database on your local machine, you will need to alter the following:

```
hostname = 'localhost'
username = 'root'
password = 'root'
database = 'Waitlist'
```

which is located in the abovenamed files.

## Database Schema

The database schema is detailed in the development guide, but is replicated below:

**city**: *City* varchar(60), *State* varchar(60), Postcode varchar(20), country varchar(60)

**language**: *Language* varchar(20)

**allergy**: *allergyNo* int(11), Allergy varchar(20)

**user**: *userId* int(11), PhoneNumber varchar(20), AlternatePhone varchar(20), Email varchar(320), password varchar(192), lastLogin date, City varchar(20), State varchar(20), active boolean, role varchar(10)

**parent**: *parentId* int(11), <ins>userId</ins> int(11), FirstName varchar(100), Surname varchar(100), PreferredName varchar(320), DoB date, Gender varchar(1), registrationDate date, status int(2),

**parent_language**: *<ins>Language<\ins>* varchar(20), *<ins>parentId</ins>* int(11)

**child**: *childID* int(11), <ins>parentId</ins> int(11), FirstName varchar(100), Surname varchar(100), DoB date, Gender varchar(1), specialNeedsHandling boolean, hasSibling boolean

**child_language**: *<ins>Language</ins>* varchar(20), *<ins>childID</ins>* int(11)

**child_allergy**: *<ins>allergyNo</ins>* int(5), *<ins>childID<ins>* int(11)

**nursery**: *nurseryNumber* int(11), <ins>userId</ins> int(11), NurseryName varchar(100), SiblingDiscount boolean, CommercialRegistrationNumber varchar(20), EarlyChildhoodEductionCertification boolean, EarlyLearningFramworkCertification boolean, AboriginalProgram boolean, ChildcareReduction boolean, SpecialNeeds boolean, registrationDate date, status int(10), special_requirements varchar(255), LicensedFamily boolean, LicensedGroup boolean

**nursery_language**: *<ins>Language</ins>* varchar(20), *<ins>nurseryNumber</ins>* int(11)

**services**: *serviceId* int(11), name varchar(20), description varchar(100), details varchar(100)

**nursery_services**: *<ins>serviceId</ins>* int(11), *<ins>nurseryNumber</ins>* int(11), startDate date, endDate date, price int(3)

**opening_hours**: *opening_hours* varchar(20)

**nursery_hours**: *<ins>opening_hours</ins>* varchar(20), *<ins>nurseryNumber</ins>* int(11)

**meals**: *mealID* int(5), description varchar(20), details varchar(100)

**nursery_meals**: *<ins>mealID</ins>* int(5), *<ins>nurseryNumber</ins>* int(11), startDate date, endDate date, fees int(3)

**programs**: *program* varchar(40)

**nursery_programs**: *<ins>program</ins>* varchar(40), *<ins>nurseryNumber</ins>* int(11)

**special_programs**: *programId* int(10), program_name varchar(255) 

**nursery_special_programs**: *<ins>nurseryNumber</ins>* int(11), *<ins>programId</ins>* int(10), max_student_enrollement int(10), current_student_enrollement int(10)

**nursery_employee**: *<ins>nurseryNumber</ins>* int(11), userId int(11), status int(2), validFrom date, validTo date, type varchar(20)

**employee_hours**: *<ins>nurseryNumber</ins>* int(11), *<ins>userId</ins>* int(11), start time, finish time, validFrom date, validTo date, type varchar(20), active boolean

**apply**: *<ins>nurseryNumber</ins>* int(11), childID int(11), priority int(2), applicationDate date, appointmentDate datetime, status int(2)

**inquiry**: *inquiryId* int(11), sentDate date, responseDate data, status int(2)

**parent_inquiry**: *<ins>inquiryId</ins>* int(11), parentId int(11), status int(4), inquiry varchar(200), response varchar(200)

**notification**: *notificationId* int(11), notifiedDate date, description varchar(20), audience varchar(20), status int(2)

**notification_reciept**: *<ins>notificationId</ins>* int(11), nurseryNumber int(11), inquiryId int(11), status int(2)

**payment**: *paymentId* int(11), customerType varchar(20), customerId int(11), paymentMethod varchar(10), amount double(10,2), status int(5), FeesId int(11), settlementData date, recieveSilentCallDate date, paymentDate date, 

**fees**: *feesId* int(11), validFrom date, validTo date, amount double(10,2), feeType varchar(11)

**images**: *imageId* int(11), imageName varchar(20), *<ins>nurseryNumber</ins>* int(11)
