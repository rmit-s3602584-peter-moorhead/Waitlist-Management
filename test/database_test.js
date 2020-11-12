var expect = require("chai").expect;
var assert = require('chai').assert;
var db = require("../briskly-server/database_utils.js")
var data = require('./data');

//Add test case for add-Nursery
//Update details returned for add-user since it doesn't fully show what has been added
//Build test cases for nursery search.


describe ("Briskley Server Database Utilities", function() {

    
    
	describe("Retrieve Password from the Database", function() {
		it("Returns the password associated with the email address", function() {

            db.get_password({"email":"TwoSheds@gmail.com"}, function(err, details) {
	            if (err) {
		            console.log(err);
	            }

	            expect(details[0].password).to.deep.equal("Python")
	            expect(details[0].userId).to.deep.equal(10)
	            expect(details[0].role).to.deep.equal("parent")
            });

		});
	});
    
    /*
	describe("Change Password", function() {
		it("Changes user password", function() {

			db.update_password({"userId":1,"password":"King"}, function(err, details) {
				if (err) {
					console.log(err);
				}

				expect(details.affectedRows).to.deep.equal(1);
				expect(details.changedRows).to.deep.equal(1);
				expect(details.message).to.deep.equal('(Rows matched: 1  Changed: 1  Warnings: 0');

				db.get_password({"email":"Fredrick@gmail.com"}, function(err, details) {
					if (err) {
						console.log(err);
					}

					expect(details[0].password).to.deep.equal("King");
				})
			})

		});
	});
    
    describe("Update Last Login", function() {
    	it("Updates the last login for the user", function() {

    		db.update_login({"userId":1,"lastLogin":"2020-5-20"}, function(err, details) {
    			if (err) {
    				console.log(err);
    			}
				expect(details.affectedRows).to.deep.equal(1);
				expect(details.changedRows).to.deep.equal(1);
    		})
    	})
    })
    
    
    
    describe("Add Users to Database", function() {
    	it("Adds a new Parent to the database", function() {
    		db.add_parent(data.parent_data_01, function(err, details) {
    			if (err) {
    				console.log(err);
    			}

				expect(details[0].affectedRows).to.deep.equal(1);
				expect(details[1].affectedRows).to.deep.equal(1);
				expect(details[2].affectedRows).to.deep.equal(1);
    		})
    	})
    })
     
    describe("Add Child to Database", function() {
    	it("Adds a child to the database", function() {
    		db.add_child(data.child_data, function(err, details) {
    			if (err) {
    				console.log(err);
    			}
    			
    			expect(details[0].affectedRows).to.deep.equal(1);
    		})
    	})
    })
    
    
    
    describe("Add Nursery", function() {
    	it("Adds a nursery to the database", function() {
    		db.add_nursery(data.nursery_data, function(err, details) {
    			if (err) {
    				console.log(err);
    			}

    			expect(details[0].affectedRows).to.deep.equal(1);
    		})
    	})
    })
    
    describe("Return Child", function() {
        it("Returns the details of the child based on the Parent data sent through", function() {

            db.get_child({"parentId":1}, function(err, details) {
                if (err) {
                    console.log(err);
                }
                //console.log(details);
                var date = details[0].DoB.toString();
                console.log(typeof date);
                expect(details[0].FirstName).to.deep.equal("Ronald");
                expect(details[0].Surname).to.deep.equal("Jackson");
                expect(date.substring(0,15)).to.deep.equal("Thu Apr 21 2016");
            })
        })
    })

    describe("Return User", function() {

        it("Returns the details of the parent based upon the user reference sent through", function() {

            db.get_parent({"userId":10}, function(err, details) {
                if (err) {
                    console.log(err);
                }
                
                expect(details[0].FirstName).to.deep.equal("Arthur");
                expect(details[0].Surname).to.deep.equal("Jackson");
                expect(details[0].StreetAddress).to.deep.equal("1 Spring Street");
            })
        })
        
        it("Returns details of the admin if an admin is requested", function(done) {

            db.get_admin({"userId":17}, function(err,details) {
                if (err) {
                    console.log(err);
                }

                expect(details[0].PhoneNumber).to.deep.equal("0384811100");
                expect(details[0].AlternatePhone).to.deep.equal("0394015426");

                done();
            })
        })
                
    })
    
    describe("Get Emails", function() {

        it("Returns all emails for parents based on a city", function(done) {

            db.get_emails({"city":"Green Bay","state":"Wisconsin","type":"parent"}, function(err, emails){
                if (err) {
                    console.log(err);
                }
                expect(emails.length).to.deep.equal(3)
                expect(emails[0].email).to.deep.equal("Frank.Brown@gmail.com")
                done();
            })
        })

        it("Returns all emails for parents based on a state", function(done) {

            db.get_emails({"state":"Wisconsin","type":"parent"}, function(err, emails){
                if (err) {
                    console.log(err);
                }

                expect(emails.length).to.deep.equal(5)
                expect(emails[4].email).to.deep.equal("Peter.Black@gmail.com")
                done()
            })
        })

        it("Returns all emails for parents based on a country", function(done) {

            db.get_emails({"country":"Germany","type":"parent"}, function(err, emails){
                if (err) {
                    console.log(err);
                }

                expect(emails.length).to.deep.equal(3)
                expect(emails[0].email).to.deep.equal("Fredrick@gmail.com")
                done()
            })
        })

        it("Returns all emails for Nurseries in a state", function(done) {

            db.get_emails({"state":"Bavaria","type":"nursery"}, function(err, emails){
                if (err) {
                    console.log(err);
                }

                expect(emails.length).to.deep.equal(1)
                expect(emails[0].email).to.deep.equal("kidsallround@munich.org.au")
                done();
            })
        })


        it("Returns all emails for Nurseries in a country", function(done) {
            db.get_emails({"country":"Germany","type":"nursery"}, function(err, emails){
                if (err) {
                    console.log(err);
                }

                expect(emails.length).to.deep.equal(2)
                expect(emails[0].email).to.deep.equal("kinderhause@frankfurt.org.au")
                done();
            })            
        })
    })

    describe("Get Fees", function(){
        it("Returns the fee schedule", function(done){
            db.get_fees(function(err, fees){
                if (err) {
                    console.log(err);
                }

                expect(fees.length).to.deep.equal(3)
                expect(fees[0].feeType).to.deep.equal("user")
                expect(fees[1].feeType).to.deep.equal("nursery")
                done()
            })
        })
    })
    */
    describe("Get Nursery by Number", function(){
        it("Returns all the details of the nursery when the number is passed through", function(done){
            db.get_nursery({"number":1}, function(err, nursery){
                if (err) {
                    console.log(err);
                }
                
                expect(nursery[0][0].NurseryName).to.deep.equal("Kookaburra Kindergarten")
                expect(nursery[0][0].Email).to.deep.equal("ecms@ecms.org.au")
                expect(nursery[1][0].name).to.deep.equal("Pickup")
                expect(nursery[2][0].opening_hours).to.deep.equal("Statutory Holidays")
                expect(nursery[2][1].opening_hours).to.deep.equal("Weekdays")
                expect(nursery[3][1].Language).to.deep.equal("French")
                
                done();
            })
        })
    }) 
    /*
    
    
    describe("Get Nursery by Details", function(){
        it("Returns the nursery based on date", function(done){
            db.search_nursery({"name":"Kookaburra Kindergarten"}, function(err, nursery){
                if (err) {
                    console.log(err);
                }
                
                expect(nursery[0].CommercialRegistrationNumber).to.deep.equal("13013989761")
                done();
            })
        })
        
        it("Returns the nursery based on the CRN", function(done){
            db.search_nursery({"CRN":"13012989761"}, function(err, nursery){
                if (err) {
                    console.log(err);
                }
                expect(nursery[0].nurseryName).to.deep.equal("Kids All Round")
                done();
            })
        })

        it("Returns the nursery based on city and state", function(done){
            db.search_nursery({"city":"Melbourne","state":"Victoria"}, function(err, nursery){
                if(err) {
                    console.log(err);
                }
                expect(nursery[0].CommercialRegistrationNumber).to.deep.equal("13013989761");
                expect(nursery[0].nurseryName).to.deep.equal("Kookaburra Kindergarten");

                done()
            })
        })

        it("Returns the nursery based on state", function(done){
            db.search_nursery({"state":"Victoria"}, function(err, nursery){
                if(err) {
                    console.log(err);
                }
                expect(nursery[0].CommercialRegistrationNumber).to.deep.equal("13013989761");
                expect(nursery[0].nurseryName).to.deep.equal("Kookaburra Kindergarten");
                done()
            })
        })

        it("Returns the nursery based on country", function(done){
            db.search_nursery({"country":"Australia"}, function(err, nursery){
                if(err) {
                    console.log(err);
                }
                expect(nursery[0].CommercialRegistrationNumber).to.deep.equal("13013989761");
                expect(nursery[0].nurseryName).to.deep.equal("Kookaburra Kindergarten");
                done()
            })
        })

        it("Returns the nursery based on registration status", function(done){
            db.search_nursery({"registrationStatus":0,"state":"Victoria"}, function(err, nursery){
                if(err) {
                    console.log(err);
                }
                expect(nursery[0].CommercialRegistrationNumber).to.deep.equal("13013989761");
                expect(nursery[0].nurseryName).to.deep.equal("Kookaburra Kindergarten");
                done()
            })
        })

        it("Returns all nurseries when nothing is passed through", function(done){
            db.search_nursery({},function(err, nursery){
                if(err) {
                    console.log(err);
                }
                expect(nursery[0].nurseryName).to.deep.equal("Kookaburra Kindergarten");
                expect(nursery[1].nurseryName).to.deep.equal("Kinderhause");
                expect(nursery[2].nurseryName).to.deep.equal("Kids All Round");
                done()
            })
        })
                                        

    })
    /*
    /*
    describe("Add Admin User", function() {
        it("Adds a Briskley Admin profile to the database", function() {

            //db.add_admin()

        })
    })

    describe("Add Nursery Admin", function() {
        it("Adds an admin account for a nursery to the database", function() {

        })
    })
    */

});

setTimeout(db.close_db,1000);
