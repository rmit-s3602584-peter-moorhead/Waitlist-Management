#!/usr/bin/env python3

import pymysql

#Variables to define the database to be accessed.
#These variables will need to be changed if the database to be accessed is 
#Remote.
hostname = 'localhost'
username = 'root'
password = 'Talal1998'
database = 'Waitlist'

#This function removes all of the tables in the database.
#The function takes the database connection as a parameter.
def delete_tables(conn):
	cur = conn.cursor()

	cur.execute("SET FOREIGN_KEY_CHECKS = 0")

	try:
		cur.execute("DROP TABLE city")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE language")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE allergy")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE user")
	except pymysql.Error as e:
		print("Error: {}".format(e))		

	try:
		cur.execute("DROP TABLE parent")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE parent_language")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE child")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE child_language")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE child_allergy")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE nursery")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE nursery_language")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE services")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE nursery_services")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE opening_hours")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE nursery_hours")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE meals")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE nursery_meals")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE programs")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE nursery_programs")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE nursery_employee")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE employee_hours")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE apply")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE inquiry")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE parent_inquiry")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE notification")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE notification_reciept")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE payment")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE fees")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE images")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE special_programs")
	except pymysql.Error as e:
		print("Error: {}".format(e))

	try:
		cur.execute("DROP TABLE nursery_special_programs")
	except pymysql.Error as e:
		print("Error: {}".format(e))				

#This function creates the tables for the database.
#The function takes the database connection as a parameter
def create_tables(conn):

	cur = conn.cursor()

	#The basic tables that are called upon by the main users.
	try:
		cur.execute("CREATE TABLE city(City VARCHAR(60), State VARCHAR(60), Postcode VARCHAR(20), Country VARCHAR(60), \
			PRIMARY KEY (City, State, Postcode))")
	except pymysql.Error as e:
		print("Error 01: {}".format(e))

	try:
		cur.execute("CREATE TABLE language(Language VARCHAR(20), PRIMARY KEY (Language))")
	except pymysql.Error as e:
		print("Error 02: {}".format(e))

	try:
		cur.execute("CREATE TABLE allergy(allergyNo int(11) NOT NULL AUTO_INCREMENT, Allergy VARCHAR(20), \
			PRIMARY KEY (allergyNo))")
	except pymysql.Error as e:
		print("Error 03: {}".format(e))

	#The base user table. From this table the nursery/nursery employee/parent/admin are formed
	try:
		cur.execute("CREATE TABLE user (userId int(11) NOT NULL AUTO_INCREMENT, PhoneNumber VARCHAR(20), \
			AlternatePhone VARCHAR(20), Email VARCHAR(320), password VARCHAR(192), lastLogin DATE, \
			StreetAddress VARCHAR(100), City VARCHAR(20), State VARCHAR(20),\
			active BOOLEAN, role VARCHAR (10), PRIMARY KEY (userId))")
	except pymysql.Error as e:
		print("Error 04: {}".format(e))

	#The tables that pertain to the parent, including the children
	try:
		cur.execute("CREATE TABLE parent (parentId int(11) NOT NULL AUTO_INCREMENT, userId int(11), \
			FirstName VARCHAR(100), Surname VARCHAR(100), PreferredName VARCHAR(320), DoB DATE,\
			Gender VARCHAR(1), registrationDate DATE, status int(2), \
			PRIMARY KEY (parentId), FOREIGN KEY (userId) REFERENCES user(userId))")
	except pymysql.Error as e:
		print("Error 05: {}".format(e))

	try:
		cur.execute("CREATE TABLE parent_language(Language VARCHAR(20), parentId int(11), \
			PRIMARY KEY (Language, parentId), FOREIGN KEY(Language) REFERENCES language(Language),\
			FOREIGN KEY (parentId) REFERENCES parent(parentId))")
	except pymysql.Error as e:
		print("Error 06: {}".format(e))

	try:
		cur.execute("CREATE TABLE child (childID int(11) NOT NULL AUTO_INCREMENT, parentId int(11), \
			FirstName VARCHAR(100), Surname VARCHAR(100), DoB DATE, Gender VARCHAR(1), \
			specialNeedsHandling BOOLEAN, hasSibling BOOLEAN, PRIMARY KEY (childID), \
			FOREIGN KEY (parentId) REFERENCES parent(parentId))")
	except pymysql.Error as e:
		print("Error 07: {}".format(e))

	try:
		cur.execute("CREATE TABLE child_language(Language VARCHAR(20), childID int(11), \
			PRIMARY KEY (Language, childID), FOREIGN KEY(Language) REFERENCES language(Language),\
			FOREIGN KEY (childID) REFERENCES child(childID))")
	except pymysql.Error as e:
		print("Error 08: {}".format(e))

	try:
		cur.execute("CREATE TABLE child_allergy(allergyNo int(5), childID int(11), \
			PRIMARY KEY (allergyNo, childID), FOREIGN KEY(allergyNo) REFERENCES allergy(allergyNo),\
			FOREIGN KEY (childID) REFERENCES child(childID))")
	except pymysql.Error as e:
		print("Error 09: {}".format(e))

	#The tables that pertain to the nursery
	try:
		cur.execute("CREATE TABLE nursery(nurseryNumber int(11) NOT NULL AUTO_INCREMENT, \
			userId int(11), NurseryName VARCHAR(100), SiblingDiscount BOOLEAN, CommercialRegistrationNumber VARCHAR(20),\
			EarlyChildhoodEducationCertification BOOLEAN, EarlyLearningFrameworkCertification BOOLEAN,\
			AboriginalProgram BOOLEAN, ChildcareReduction BOOLEAN, SpecialNeeds BOOLEAN, registrationDate DATE, status int(10),\
			special_requirements VARCHAR(255), LicensedFamily BOOLEAN, LicensedGroup BOOLEAN, \
			PRIMARY KEY (nurseryNumber), FOREIGN KEY (userId) REFERENCES user(userId))")
	except pymysql.Error as e:
		print("Error 10: {}".format(e))

	try:
		cur.execute("CREATE TABLE nursery_language(Language VARCHAR(20), nurseryNumber int(11), \
			PRIMARY KEY (Language, nurseryNumber), FOREIGN KEY(Language) REFERENCES language(Language),\
			FOREIGN KEY (nurseryNumber) REFERENCES nursery(nurseryNumber))")
	except pymysql.Error as e:
		print("Error 11: {}".format(e))

	try:
		cur.execute("CREATE TABLE services(serviceId int(11) NOT NULL AUTO_INCREMENT, name VARCHAR(20), \
			description VARCHAR(100), details VARCHAR(100), PRIMARY KEY (serviceId))")
	except pymysql.Error as e:
		print("Error 12: {}".format(e))

	try:
		cur.execute("CREATE TABLE nursery_services(serviceId int(11), nurseryNumber int(11), startDate DATE,\
			endDate DATE, price INT(3), PRIMARY KEY (serviceId, nurseryNumber), FOREIGN KEY(serviceId) \
			REFERENCES services(serviceId), FOREIGN KEY (nurseryNumber) REFERENCES nursery(nurseryNumber))")
	except pymysql.Error as e:
		print("Error 13: {}".format(e))

	try:
		cur.execute("CREATE TABLE opening_hours(opening_hours VARCHAR(20), PRIMARY KEY (opening_hours))")
	except pymysql.Error as e:
		print("Error 14: {}".format(e))

	try:
		cur.execute("CREATE TABLE nursery_hours(opening_hours VARCHAR(20), nurseryNumber int(11), \
			PRIMARY KEY (opening_hours, nurseryNumber), FOREIGN KEY(opening_hours) \
			REFERENCES opening_hours(opening_hours), FOREIGN KEY (nurseryNumber) REFERENCES nursery(nurseryNumber))")
	except pymysql.Error as e:
		print("Error 15: {}".format(e))

	try:
		cur.execute("CREATE TABLE meals(mealID int(5) NOT NULL AUTO_INCREMENT, description VARCHAR(20), details VARCHAR(100), \
			PRIMARY KEY (mealID))")
	except pymysql.Error as e:
		print("Error 16: {}".format(e))

	try:
		cur.execute("CREATE TABLE nursery_meals(mealID int(5), nurseryNumber int(11), startDate DATE, \
			endDate DATE, fees int(3), PRIMARY KEY (mealID, nurseryNumber), FOREIGN KEY(mealID) \
			REFERENCES meals(mealID), FOREIGN KEY (nurseryNumber) REFERENCES nursery(nurseryNumber))")
	except pymysql.Error as e:
		print("Error 17: {}".format(e))

	try:
		cur.execute("CREATE TABLE programs(program VARCHAR(40), PRIMARY KEY (program))")
	except pymysql.Error as e:
		print("Error 18: {}".format(e))

	try:
		cur.execute("CREATE TABLE nursery_programs(program VARCHAR(40), nurseryNumber int(11), \
			PRIMARY KEY (program, nurseryNumber), FOREIGN KEY(program) \
			REFERENCES programs(program), FOREIGN KEY (nurseryNumber) REFERENCES nursery(nurseryNumber))")
	except pymysql.Error as e:
		print("Error 19: {}".format(e))

	try:
		cur.execute("CREATE TABLE special_programs(programId int(10) NOT NULL AUTO_INCREMENT, program_name VARCHAR(255),\
			PRIMARY KEY (programId))")
	except pymysql.Error as e:
		print("Error 29b: {}".format(e))

	try:
		cur.execute("CREATE TABLE nursery_special_programs(nurseryNumber int(11), programId int(10), \
			max_student_enrollement int(10), current_student_enrollement int(10),\
			PRIMARY KEY (nurseryNumber, programId), FOREIGN KEY (nurseryNumber) REFERENCES nursery(nurseryNumber),\
			FOREIGN KEY (programId) REFERENCES special_programs(programId), FOREIGN KEY (programId) \
			REFERENCES special_programs(programId))")
	except pymysql.Error as e:
		print("Error 19a: {}".format(e))

	try:
		cur.execute("CREATE TABLE nursery_employee(nurseryNumber int(11), userId int(11), status int(2), \
			validFrom DATE, validTo DATE, type VARCHAR(20),PRIMARY KEY (nurseryNumber, userId), \
			FOREIGN KEY (nurseryNumber) REFERENCES nursery(nurseryNumber), FOREIGN KEY (userId) REFERENCES user(userId))")
	except pymysql.Error as e:
		print("Error 20: {}".format(e))

	try:
		cur.execute("CREATE TABLE employee_hours(nurseryNumber int(11), userId int(11), start TIME, \
			finish TIME, validFrom DATE, validTo DATE, type VARCHAR(20), active BOOLEAN, PRIMARY KEY (nurseryNumber, userId), \
			FOREIGN KEY (nurseryNumber) REFERENCES nursery(nurseryNumber), FOREIGN KEY (userId) REFERENCES nursery_employee(userId))")
	except pymysql.Error as e:
		print("Error 21: {}".format(e))	

	#The tables that pertain to the interaction between the parents and the nursery
	try:
		cur.execute("CREATE TABLE apply(nurseryNumber int(11), childID int(11), \
			priority int(2), applicationDate DATE, appointmentDate DATETIME,  status int(2), \
			PRIMARY KEY (nurseryNumber, childID), FOREIGN KEY (nurseryNumber) REFERENCES nursery(nurseryNumber),\
			FOREIGN KEY (childID) REFERENCES child(childID))")
	except pymysql.Error as e:
		print("Error 22: {}".format(e))

	try:
		cur.execute("CREATE TABLE inquiry(inquiryId int(11) NOT NULL AUTO_INCREMENT,\
			sentDate DATE, responseDate DATE,  status int(2), PRIMARY KEY (inquiryId))")
	except pymysql.Error as e:
		print("Error 23: {}".format(e))

	try:
		cur.execute("CREATE TABLE parent_inquiry(inquiryId int(11), parentId int(11),\
			status int(4), inquiry VARCHAR(200), response VARCHAR(200),  PRIMARY KEY (inquiryId, parentId), \
			FOREIGN KEY (inquiryId) REFERENCES inquiry(inquiryId), FOREIGN KEY (parentId) REFERENCES parent(parentId))")
	except pymysql.Error as e:
		print("Error 24: {}".format(e))

	try:
		cur.execute("CREATE TABLE notification(notificationId int(11) NOT NULL AUTO_INCREMENT,\
			notifiedDate DATE, description VARCHAR(20), audience VARCHAR(20),  status int(2), \
			PRIMARY KEY (notificationId))")
	except pymysql.Error as e:
		print("Error 25: {}".format(e))

	try:
		cur.execute("CREATE TABLE notification_reciept(notificationId int(11), nurseryNumber int(11),\
		 inquiryId int(11),status int(2), PRIMARY KEY (notificationId, nurseryNumber, inquiryId),\
		 FOREIGN KEY (notificationId) REFERENCES notification(notificationId), FOREIGN KEY(nurseryNumber) \
		 REFERENCES nursery(nurseryNumber), FOREIGN KEY (inquiryId) REFERENCES inquiry(inquiryId))")
	except pymysql.Error as e:
		print("Error 26: {}".format(e))

	#The tables that relate to payments
	try:
		cur.execute("CREATE TABLE payment(paymentId int(11) NOT NULL AUTO_INCREMENT, customerType VARCHAR(20),\
		 customerId int(11),paymentMethod VARCHAR(10), amount DOUBLE(10,2), status int(5),\
		 FeesId int(11), settlementData DATE, recieveSilentCallDate DATE, paymentDate DATE, \
		 PRIMARY KEY (paymentId), FOREIGN KEY (feesId) REFERENCES fees(feesId))")
	except pymysql.Error as e:
		print("Error 26: {}".format(e))

	try:
		cur.execute("CREATE TABLE fees(feesId int(11) NOT NULL AUTO_INCREMENT, validFrom DATE,\
		 validTo DATE, amount DOUBLE(10,2), feeType VARCHAR(11), PRIMARY KEY (feesId))")
	except pymysql.Error as e:
		print("Error 26: {}".format(e))

	try:
		cur.execute("CREATE TABLE images(imageId int(11) NOT NULL AUTO_INCREMENT, imageName VARCHAR(20),\
		 nurseryNumber int(11), PRIMARY KEY (imageId), FOREIGN KEY (nurseryNumber) REFERENCES nursery(nurseryNumber))")
	except pymysql.Error as e:
		print("Error 26: {}".format(e))

#This function populates the tables with data. The initial database calls are used
#For data that will be used with the application. The second part is dummy data used for testing
def populate(conn):

	cur = conn.cursor()

	#The city table is populated with details relating to Australia
	#This is stored in a separate file.
	file1 = open('australian-postcodes.txt','r')
	lines = file1.readlines()

	for i in lines:
		postcodes = i.split(',')
		postcode = postcodes[0][2:].strip("'")
		town = postcodes[1][1:].strip("'")
		state = postcodes[2][1:].strip("'")

		try:
			cur.execute("INSERT INTO city(City, State, Postcode, Country) VALUES ('{}','{}','{}','Australia')".format(town, state, postcode))
		except pymysql.Error as e:
			print("Error 01: {}".format(e))

	try:
		cur.execute("INSERT INTO language(Language) VALUES ('No Preference')")
		cur.execute("INSERT INTO language(Language) VALUES ('Cantonese')")
		cur.execute("INSERT INTO language(Language) VALUES ('French')")
		cur.execute("INSERT INTO language(Language) VALUES ('Mandarin')")
		cur.execute("INSERT INTO language(Language) VALUES ('Punjabi')")
		cur.execute("INSERT INTO language(Language) VALUES ('Spanish')")
		cur.execute("INSERT INTO language(Language) VALUES ('English')")		
	except pymysql.Error as e:
		print("Error 02: {}".format(e))

	try:
		cur.execute("INSERT INTO programs(program) VALUES ('Under 36 Months')")
		cur.execute("INSERT INTO programs(program) VALUES ('3 Years to Kindergarten')")
		cur.execute("INSERT INTO programs(program) VALUES ('Licensed Preschool')")
		cur.execute("INSERT INTO programs(program) VALUES ('School Age: Grade 1 to Age 12')")
	except pymysql.Error as e:
		print("Error 03: {}".format(e))

	try:
		cur.execute("INSERT INTO opening_hours(opening_hours) VALUES ('Weekdays')")
		cur.execute("INSERT INTO opening_hours(opening_hours) VALUES ('Weekends')")
		cur.execute("INSERT INTO opening_hours(opening_hours) VALUES ('Statutory Holidays')")
		cur.execute("INSERT INTO opening_hours(opening_hours) VALUES ('Overnight')")
		cur.execute("INSERT INTO opening_hours(opening_hours) VALUES ('Weekdays Before 6am')")
		cur.execute("INSERT INTO opening_hours(opening_hours) VALUES ('Weekdays After 7pm')")							
	except pymysql.Error as e:
		print("Error 04: {}".format(e))

	try:
		cur.execute("INSERT INTO meals(description) VALUES ('Extra-Fee')")
		cur.execute("INSERT INTO meals(description) VALUES ('Included in Feee')")
		cur.execute("INSERT INTO meals(description) VALUES ('Not Offered')")																						
	except pymysql.Error as e:
		print("Error 05: {}".format(e))

	try:
		cur.execute("INSERT INTO services(name, description) VALUES ('Pickup','Included in Fee')")
		cur.execute("INSERT INTO services(name, description) VALUES ('Pickup','Extra-Fee')")
		cur.execute("INSERT INTO services(name, description) VALUES ('Pickup','Not Offered')")
		cur.execute("INSERT INTO services(name, description) VALUES ('Drop Off','Included in Fee')")
		cur.execute("INSERT INTO services(name, description) VALUES ('Drop Off','Extra-Fee')")
		cur.execute("INSERT INTO services(name, description) VALUES ('Drop Off','Not Offered')")							
	except pymysql.Error as e:
		print("Error 06: {}".format(e))

	#The data from this point on is dummy data used for testing
	try:
		cur.execute("INSERT INTO city(City, State, Postcode, Country) VALUES ('Green Bay','Wisconsin','54303','United States')")
		cur.execute("INSERT INTO city(City, State, Postcode, Country) VALUES ('Eau Claire','Wisconsin','54701','United States')")
		cur.execute("INSERT INTO city(City, State, Postcode, Country) VALUES ('Des Moines','Iowa','50309','United States')")
		cur.execute("INSERT INTO city(City, State, Postcode, Country) VALUES ('Cedar Rapids','Iowa','52401','United States')")
		cur.execute("INSERT INTO city(City, State, Postcode, Country) VALUES ('Frankfurt Am Main','Hesse','60311','Germany')")
		cur.execute("INSERT INTO city(City, State, Postcode, Country) VALUES ('Munich','Bavaria','80538','Germany')")

		cur.execute("INSERT INTO user(PhoneNumber, AlternatePhone, Email, password, StreetAddress, city, state, role) \
			VALUES ('045677777','22133361','Fredrick@gmail.com','Schnitzel', '21 Beem Strasse','Frankfurt Am Main','Hesse','parent')")
		cur.execute("INSERT INTO parent(userId, Gender, registrationDate, status, FirstName, Surname, PreferredName, DoB) VALUES \
			('1','M','2020-9-1','1','Fredrick','Bornhoeffer','Fred','1912-3-1')")
		cur.execute("INSERT INTO user(PhoneNumber, AlternatePhone, Email, password, StreetAddress, city, state, role) \
			VALUES ('045888777','22443361','Klaus@gmail.com','Schnitzel','21 Turig Gasse','Frankfurt Am Main','Hesse','parent')")
		cur.execute("INSERT INTO parent(userId, Gender, registrationDate, status, FirstName, Surname, PreferredName, DoB) VALUES \
			('2','M','2020-9-1','1', 'Klaus','Klaus','Klaus','1952-3-1')")
		cur.execute("INSERT INTO user(PhoneNumber, AlternatePhone, Email, password, StreetAddress, city, state, role) \
			VALUES ('045222777','22455361','Werner@gmail.com','Schnitzel','21 Schloss Strasse','Munich','Bavaria','parent')")
		cur.execute("INSERT INTO parent(userId, Gender, registrationDate, status, FirstName, Surname, PreferredName, DoB) VALUES \
			('3','M','2020-9-1','1','Werner','Gurt','Monet','1952-3-1')")
		cur.execute("INSERT INTO user(PhoneNumber, AlternatePhone, Email, password, StreetAddress, city, state, role) \
			VALUES ('045211777','22995361','Frank.Brown@gmail.com','Schnitzel','21 Main Street','Green Bay','Wisconsin','parent')")
		cur.execute("INSERT INTO parent(userId, Gender, registrationDate, status, FirstName, Surname, PreferredName, DoB) VALUES \
			('4','M','2020-9-1','1','Frank','Brown','Monet','1952-3-1')")
		cur.execute("INSERT INTO user(PhoneNumber, AlternatePhone, Email, password, StreetAddress, city, state, role) \
			VALUES ('045211777','22995361','Frank.Black@gmail.com','Schnitzel','21 Main Street','Green Bay','Wisconsin','parent')")
		cur.execute("INSERT INTO parent(userId, Gender, registrationDate, status, FirstName, Surname, PreferredName, DoB) VALUES \
			('5','M','2020-9-1','1', 'Frank','Black','Monet','1952-3-1')")
		cur.execute("INSERT INTO user(PhoneNumber, AlternatePhone, Email, password, StreetAddress, city, state, role) \
			VALUES ('045211777','22995361','Frank.Thompson@gmail.com','Schnitzel','21 Main Street','Green Bay','Wisconsin','parent')")
		cur.execute("INSERT INTO parent(userId, Gender, registrationDate, status, FirstName, Surname, PreferredName, DoB) VALUES \
			('6','M','2020-9-1','1', 'Frank','Thompson','Monet','1952-3-1')")
		cur.execute("INSERT INTO user(PhoneNumber, AlternatePhone, Email, password, StreetAddress, city, state, role) \
			VALUES ('045211777','22995361','Peter.Thompson@gmail.com','Schnitzel','21 Main Street','Eau Claire','Wisconsin','parent')")
		cur.execute("INSERT INTO parent(userId, Gender, registrationDate, status, FirstName, Surname, PreferredName, DoB) VALUES \
			('7','M','2020-9-1','1', 'Peter','Thompson','Monet','1952-3-1')")	
		cur.execute("INSERT INTO user(PhoneNumber, AlternatePhone, Email, password, StreetAddress, city, state, role) \
			VALUES ('045211777','22995361','Peter.Black@gmail.com','Schnitzel','21 Main Street','Eau Claire','Wisconsin','parent')")
		cur.execute("INSERT INTO parent(userId, Gender, registrationDate, status, FirstName, Surname, PreferredName, DoB) VALUES \
			('8','M','2020-9-1','1','Peter','Black','Monet','1952-3-1')")				
		cur.execute("INSERT INTO user(PhoneNumber, AlternatePhone, Email, password, StreetAddress, city, state, role) \
			VALUES ('045211777','22995361','Jeremy.Black@gmail.com','Schnitzel','21 Main Street','Des Moines','Iowa','parent')")
		cur.execute("INSERT INTO parent(userId, Gender, registrationDate, status, FirstName, Surname, PreferredName, DoB) VALUES \
			('9','M','2020-9-1','1','Jeremy','Black','Monet','1952-3-1')")
		cur.execute("INSERT INTO user(PhoneNumber, AlternatePhone, Email, password, StreetAddress, city, state, role) \
			VALUES ('0355674251','0443552668','TwoSheds@gmail.com','Python','1 Spring Street','Melbourne','Victoria','parent')")
		cur.execute("INSERT INTO parent(userId, Gender, registrationDate, status, FirstName, Surname, PreferredName, DoB) VALUES \
			('10','M','2020-9-1','1', 'Arthur','Jackson','Two Sheds','1971-8-20')")																				
	except pymysql.Error as e:
		print("Error 07: {}".format(e))

	try:
		cur.execute("INSERT INTO user(PhoneNumber, AlternatePhone, Email, password, StreetAddress, city, state, role) \
			VALUES ('0384811100','0394015426','ecms@ecms.org.au','TwoSheds','34 George St','Melbourne','Victoria','nursery')")
		cur.execute("INSERT INTO nursery(userId, NurseryName, SiblingDiscount, CommercialRegistrationNumber, EarlyChildhoodEducationCertification,\
			EarlyLearningFrameworkCertification, AboriginalProgram, ChildcareReduction, SpecialNeeds, registrationDate, status) VALUES \
			('11','Kookaburra Kindergarten','0','13013989761', '0','1','0','1','1','2020-9-1','0')")
		cur.execute("INSERT INTO nursery_language (language, nurseryNumber) VALUES ('English','1')")	
		cur.execute("INSERT INTO nursery_language (language, nurseryNumber) VALUES ('Spanish','1')")
		cur.execute("INSERT INTO nursery_language (language, nurseryNumber) VALUES ('French','1')")
		cur.execute("INSERT INTO nursery_services (nurseryNumber, serviceId) VALUES ('1','3')")
		cur.execute("INSERT INTO nursery_services (nurseryNumber, serviceId) VALUES ('1','6')")
		cur.execute("INSERT INTO nursery_hours (nurseryNumber, opening_hours) VALUES ('1','Weekdays')")
		cur.execute("INSERT INTO nursery_hours (nurseryNumber, opening_hours) VALUES ('1','Statutory Holidays')")			
		cur.execute("INSERT INTO nursery_hours (nurseryNumber, opening_hours) VALUES ('1','Weekdays After 7pm')")
	except pymysql.Error as e:
		print("Error 08: {}".format(e))

	try:
		cur.execute("INSERT INTO user(PhoneNumber, AlternatePhone, Email, password, StreetAddress, city, state, role) \
			VALUES ('05882211','05882244','kinderhause@frankfurt.org.au','Germnay','Battonstrasse 4-5','Frankfurt am Main','Hesse','nursery')")
		cur.execute("INSERT INTO nursery(userId, NurseryName, SiblingDiscount, CommercialRegistrationNumber, EarlyChildhoodEducationCertification,\
			EarlyLearningFrameworkCertification, AboriginalProgram, ChildcareReduction, SpecialNeeds, registrationDate, status) VALUES \
			('12','Kinderhause','0','13012589761', '0','1','0','1','1','2020-9-1','0')")
		cur.execute("INSERT INTO nursery_language (language, nurseryNumber) VALUES ('English','2')")	
		cur.execute("INSERT INTO nursery_language (language, nurseryNumber) VALUES ('Spanish','2')")
		cur.execute("INSERT INTO nursery_language (language, nurseryNumber) VALUES ('French','2')")
		cur.execute("INSERT INTO nursery_services (nurseryNumber, serviceId) VALUES ('2','3')")
		cur.execute("INSERT INTO nursery_services (nurseryNumber, serviceId) VALUES ('2','6')")
		cur.execute("INSERT INTO nursery_hours (nurseryNumber, opening_hours) VALUES ('2','Weekdays')")
		cur.execute("INSERT INTO nursery_hours (nurseryNumber, opening_hours) VALUES ('2','Statutory Holidays')")			
		cur.execute("INSERT INTO nursery_hours (nurseryNumber, opening_hours) VALUES ('2','Weekdays After 7pm')")
	except pymysql.Error as e:
		print("Error 09: {}".format(e))

	try:
		cur.execute("INSERT INTO user(PhoneNumber, AlternatePhone, Email, password, StreetAddress, city, state, role) \
			VALUES ('05882211','05882244','kidsallround@munich.org.au','Germnay','Tomas-Wimmer-Ring 28','Munich','Bavaria','nursery')")
		cur.execute("INSERT INTO nursery(userId, NurseryName, SiblingDiscount, CommercialRegistrationNumber, EarlyChildhoodEducationCertification,\
			EarlyLearningFrameworkCertification, AboriginalProgram, ChildcareReduction, SpecialNeeds, registrationDate, status) VALUES \
			('13','Kids All Round','0','13012989761', '0','1','0','1','1','2020-9-1','0')")
		cur.execute("INSERT INTO nursery_language (language, nurseryNumber) VALUES ('English','3')")	
		cur.execute("INSERT INTO nursery_language (language, nurseryNumber) VALUES ('Spanish','3')")
		cur.execute("INSERT INTO nursery_language (language, nurseryNumber) VALUES ('French','3')")
		cur.execute("INSERT INTO nursery_services (nurseryNumber, serviceId) VALUES ('3','3')")
		cur.execute("INSERT INTO nursery_services (nurseryNumber, serviceId) VALUES ('3','6')")
		cur.execute("INSERT INTO nursery_hours (nurseryNumber, opening_hours) VALUES ('3','Weekdays')")
		cur.execute("INSERT INTO nursery_hours (nurseryNumber, opening_hours) VALUES ('3','Statutory Holidays')")			
		cur.execute("INSERT INTO nursery_hours (nurseryNumber, opening_hours) VALUES ('3','Weekdays After 7pm')")
	except pymysql.Error as e:
		print("Error 10: {}".format(e))			

	try:
		cur.execute("INSERT INTO user(PhoneNumber, AlternatePhone, Email, password, role) \
			VALUES ('045588776','031112223','arthur.puety@email.com','peuty','admin')")
	except pymysql.Error as e:
		print("Error 11: {}".format(e))

	try:
		cur.execute("INSERT INTO fees(validFrom, validTo, amount, feeType) VALUES ('2020-1-1','2021-1-1','45.00','user')")
		cur.execute("INSERT INTO fees(validFrom, validTo, amount, feeType) VALUES ('2020-1-1','2021-1-1','30.00','nursery')")
		cur.execute("INSERT INTO fees(validFrom, validTo, amount, feeType) VALUES ('2020-1-1','2021-1-1','15.00','additional')")
	except pymysql.Error as e:
		print("Error 12: {}".format(e))		

	try:
		cur.execute("INSERT INTO special_programs(program_name) VALUES ('Art & Craft')")
		cur.execute("INSERT INTO special_programs(program_name) VALUES ('Cooking')")
		cur.execute("INSERT INTO special_programs(program_name) VALUES ('Language')")
		cur.execute("INSERT INTO special_programs(program_name) VALUES ('Reading')")
		cur.execute("INSERT INTO special_programs(program_name) VALUES ('Arithmetic')")
	except pymysql.Error as e:
		print("Error 12: {}".format(e))

	conn.commit()

#This function is used for experimenting with SQL queries.
def test_database(conn):

	cur.execute("SELECT * FROM special_programs")

	for x in cur.fetchall():
		print(x)

#The main executable function
if __name__ == "__main__":

	#This creates the database. It only needs to be executed once. The try/catch statement will
	#allow the program to continue despite the database existing
	try:
		myConnection = pymysql.connect(host=hostname, user = username, passwd = password, charset='utf8')
		cur = myConnection.cursor()
		sqlstatement = "CREATE DATABASE "+database
		cur.execute(sqlstatement)
	except pymysql.Error as e:
		print(e)

	#This creates a connection to the database. Until a database has been created, it will not execute.
	#The try/except statement allows the program to run despite there being no database.
	try:
		myConnection = pymysql.connect(host=hostname, user = username, passwd = password, db=database, charset='utf8')
		cur = myConnection.cursor()
		print("Connected")
	except pymysql.Error as e:
		print(e)


	# delete_tables(myConnection)
	# create_tables(myConnection)
	# populate(myConnection)
	# test_database(myConnection)


