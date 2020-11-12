# Briskley Waitlist Management Application

This application is an application for nurseries to be able to manage their waitlist.
It also doubles as a means for parents to be able to located nurseries that meet their needs and for the nurseries and their customers to communicate.

The code is located in github in the following repository:

[https://github.com/s3664099/Waitlist_management.git](https://github.com/s3664099/Waitlist_management.git)

The code has yet to be deployed in the cloud and thus will need to be pulled to the local machine using the following:

```git clone https://github.com/s3664099/Waitlist_management.git```

Details on the database is located in the data.txt file. However, assuming the database management system (DBMS) has been configured, to set up the database
you need to go to the **DatabaseSetup folder**. In the **database_setup.py** file is the following details at the top:

```
hostname = 'localhost'
username = 'root'
password = 'root'
database = 'Waitlist'
```

The password may need to be changed depending on the password you are using to access your DBMS. This also needs to be changed in the **database_utils.js**
file in the **briskly-server** folder.

To setup the database go into the **DatabaseSetup folder** and type **./database_setup.py**

If there are problems with the accessing the DBMS, you [may find the answer here](https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server).

To install the dependencies, you will need to go into the ***briskly-server** and ***briskly-client*** folders and type the following:

```npm install```

You will need to have ***nodejs** and ***react*** installed to be able to run the program.

To start the front end you will need to type the following in the ***briskly-client*** folder:

```npm start```

The browser should automatically open a window to the page, however if it doesn't you need to open your browser and enter the following into the address bar:

```localhost:3000```

To start the backend server you need to go into the ***briskly-server*** folder and type in the following:

```npm start```

The server will automatically start:

## Release v0.5 

Currently the application has not been deployed, and as such it cannot be described as being a full release.

In this release, the following functionalities currently work:

* Registering a Parent and a Nursery
* adding a child to a parent. Enrolling a child. Viewing all of the children and their status
* Nurseries accepts and declines children and schedules meetings
* notifications for both admin and nursery
* searching through nurseries by any user and anonymously and viewing their page although we don't store images so that is missing
* login system

## Testing

The unit tests are located in the **tests** folder. To execute the tests type the following:

```npm test```

Further details of the application can be found in the Development Guide.
