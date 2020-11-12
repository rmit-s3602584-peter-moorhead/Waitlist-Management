module.exports = {
    post: jest.fn((url) => {

        if(url === `http://localhost:9000/prices`){
            return Promise.resolve({
                data:{
                    validFrom: '16-9-2022',
                    validTo: '16-9-2020',
                    user: '80',
                    nursery: '150',
                    add: '200'
                }

            })
        }

        if(url === `http://localhost:9000/updatePrices`){
            return Promise.resolve({
                data:{
                    message: "success"
                }

            })
        }
        if(url === `http://localhost:9000/sendNotification`){
            return Promise.resolve({
                data:{
                    emails: ["talalmeshari@gmail.com"] //add your email for testing.
                }

            })
        }
        if(url === `http://localhost:9000/getAdminNurseries`){
            return Promise.resolve({
                data:[
                    {
                        "nurseryNumber": 1,
                        "nurseryName": "Cool Nursery",
                        "CommercialRegistrationNumber": "1038917364",
                        "city": "New York",
                        "status": "Pending Payment"
                    },
                    {
                        "nurseryNumber": 2,
                        "nurseryName": "Melbourne Nursery",
                        "CommercialRegistrationNumber": "109837",
                        "city": "Melbourne",
                        "status": "Approved"
                    },
                    {
                        "nurseryNumber": 3,
                        "nurseryName": "London Nursery",
                        "CommercialRegistrationNumber": "1234532222",
                        "city": "London",
                        "status": "Rejected"
                    }
                ]

            })
        }
        if(url === `http://localhost:9000/singleNurseryAdmin`){
            return Promise.resolve({
                data:[
                    [{
                        "AboriginalProgram": 0,
                        "AlternatePhone": "0394015426",
                        "ChildcareReduction": 1,
                        "City": "Melbourne",
                        "CommercialRegistrationNumber": "13013989761",
                        "EarlyChildhoodEducationCertification": 0,
                        "EarlyLearningFrameworkCertification": 1,
                        "Email": "ecms@ecms.org.au",
                        "LicensedFamily": 0,
                        "LicensedGroup": 1,
                        "NurseryName": "Kookaburra Kindergarten",
                        "PhoneNumber": "0384811100",
                        "SiblingDiscount": 0,
                        "SpecialNeeds": 0,
                        "State": "Victoria",
                        "StreetAddress": "34 George St",
                        "active": null,
                        'lastLogin': null,
                        "nurseryNumber": 1,
                        "password": "TwoSheds",
                        "registrationDate": "2020-08-31T14:00:00.000Z",
                        "role": "nursery",
                        "special_requirements": "Cash payment",
                        "status": 0,
                        "userId": 11,
                    }],
                    [
                        {
                            "description": "Not Offered",
                            "details": null,
                            "endDate": null,
                            "name": "Pickup",
                            "nurseryNumber": 1,
                            "price": null,
                            "serviceId": 3,
                            "startDate": null,
                        },
                        {
                            "description": "Not Offered",
                            'details': null,
                            "endDate": null,
                            "name": "Drop Off",
                            "nurseryNumber": 1,
                            "price": null,
                            "serviceId": 6,
                            "startDate": null,
                        },
                        {
                            "Name": "Nursery Services"
                        }
                    ],
                    [
                        {"opening_hours": "Statutory Holidays", "nurseryNumber": 1},
                        {"opening_hours": "Weekdays", "nurseryNumber": 1},
                        {"opening_hours": "Weekdays After 7pm", "nurseryNumber": 1},
                        {"Name": "Nursery Hours"}
                    ],
                    [
                        {"Language": "English", "nurseryNumber": 1},
                        {"Language": "French", "nurseryNumber": 1},
                        {"Language": "Spanish", "nurseryNumber": 1},
                        {"Name": "Nursery Languages"}],
                    [
                        {"Name": "Nursery meals"}
                    ],
                    [
                        {"Name": "Nursery Programs"}
                    ],
                    [
                        {"Name": "Special Programs"}
                    ],
                    {
                        "country":"Australia"
                    }
                ]

            })
        }
    })
}