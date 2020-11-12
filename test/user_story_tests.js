var expect = require("chai").expect;
var assert = require('chai').assert;
var db = require("../briskly-server/database_utils.js")
var data = require('./data');
var backend = require("../briskly-server/routes/parentRoute.js")

describe ("Briskley Server User Story Unit Tests", function() {

    describe("User Story 1 - Create Parent Account", function() {
    	it("Adds a new Parent to the database", function() {
    		db.add_parent(data.parent_data_01, function(err, details) {
    			if (err) {
    				console.log(err);
    			}

    			id = details[0].insertId;
    			
				expect(details[0].affectedRows).to.deep.equal(1);
				expect(details[1].affectedRows).to.deep.equal(1);
				expect(details[2].affectedRows).to.deep.equal(1);

		        db.get_parent({"userId":id}, function(err, details) {
            	    if (err) {
                	    console.log(err);
                	}

                	expect(details[0].FirstName).to.deep.equal("Scott");
		            expect(details[0].Surname).to.deep.equal("Morrison");
		            expect(details[0].StreetAddress).to.deep.equal("1 Mianga Ave");
        		}) 
    		})
    	})  	
    })

    describe("User Story 3 - Add Child to Database", function() {
    	it("Adds a child to the database", function() {
    		db.add_child(data.child_data, function(err, details) {
    			if (err) {
    				console.log(err);
    			}
   			
    			expect(details[0].affectedRows).to.deep.equal(1);

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

    })

    describe("User Story 4 - Search for Nursery", function() {
    	it("Returns the nursery based on city and state", function(done){
            db.search_nursery_user({"city":"Melbourne","state":"Victoria"}, function(err, nursery){
                if(err) {
                    console.log(err);
                }

                console.log(nursery)

                expect(nursery[0].CommercialRegistrationNumber).to.deep.equal("13013989761");
                expect(nursery[0].nurseryName).to.deep.equal("Kookaburra Kindergarten");

                done()
            })
        })
    })

    describe("User Story 5 - Return Details of Nursery", function(){
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
})     

