import React, {Component} from 'react'
import "../../ComponentStyles.css"
import AuthenticationService from "../../AuthenticationService"

class NurseryApplication extends Component{

    /**
     * 
     * This component is used to view the nurseries applications
     * by the admin and either approve them or deny/decline them
     * 
     */

    constructor(props){
       super(props)

       //storing relevant data that will be used
       //when rendering this component
        this.state = {
            data: [],
            finished: false,
            country:"",
            state:"",
            city:"",
            specialReq: "",
            nurseryName: "",
            id: -1,
            token: {},
            status: -1
        }
    }

    componentWillUnmount(){
        //when the component is about to be destroyed we remove the session key "applicationId"
        //with its data
        if(sessionStorage.getItem("applicationId") != null
        && sessionStorage.getItem("applicationId") != undefined){
            sessionStorage.removeItem("applicationId")
        }
    }

    async componentDidMount(){
        try{
        //setup the page with the necessary components
        // document.getElementById('formCheck-32').checked = true
        const formData = {}
        if(sessionStorage.getItem("applicationId") != null
        && sessionStorage.getItem("applicationId") != undefined){
            //then we just refreshed the page
            formData["id"] = sessionStorage.getItem("applicationId")
            this.state.id = formData["id"]


        }else{
            //set it here
            sessionStorage.setItem("applicationId", this.props.location.id)
            formData["id"] = this.props.location.id
            this.state.id = this.props.location.id
        }

        //getting the token
        this.state.token = AuthenticationService.getToken()
        formData["token"] = this.state.token["user"]
       
        const response = await fetch("http://localhost:9000/singleNurseryAdmin",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData)
        })
        

        const data = await response.json()
        var firstData = data[0][0]
        
        //setting up the status to know which buttons to show:
        this.state.status = firstData["status"]

        var secondData = data[1][0]
        //Will loop through the ones below
        var thirdData = data[2]
        var fourthData = data[3]
        var programs = data[5]

        //Nursery's country, state and city:
        this.state.country = data[7]["country"]
        this.state.state = firstData["State"]
        this.state.city = firstData["City"]

        //setting the special requirements
        if(firstData["special_requirements"] == null || firstData["special_requirements"] == undefined ||
        firstData["special_requirements"] == ""){
            this.state.specialReq = "No special requirements!"
            
        }else{
            this.state.specialReq = firstData["special_requirements"]
        }
        

        //checking the checkboxes for the "opening hours"
        //part of the application that the nursery checked
        for(var x = 0; x<thirdData.length; x++){

            if(thirdData[x]["opening_hours"] == "Weekdays"){
                document.getElementById("HouseOfOperation-1").checked = true
            }else if(thirdData[x]["opening_hours"] == "Weekends"){
                document.getElementById("HouseOfOperation-2").checked = true
            }else if(thirdData[x]["opening_hours"] == "Statutory Holidays"){
                document.getElementById("HouseOfOperation-3").checked = true
            }else if(thirdData[x]["opening_hours"] == "Overnight"){
                document.getElementById("HouseOfOperation-4").checked = true
            }else if(thirdData[x]["opening_hours"] == "Weekdays Before 6am"){
                document.getElementById("HouseOfOperation-5").checked = true
            }else if(thirdData[x]["opening_hours"] == "Weekdays After 7pm"){
                document.getElementById("HouseOfOperation-6").checked = true
            } 
        }

        for(var x = 0; x<fourthData.length; x++){
            //Checking the checkboxes for the languages that the nursery supports
            if(fourthData[x]["Language"] != undefined){
                document.getElementById(fourthData[x]["Language"]).checked = true
            }
        }

        for(var x = 0; x<programs.length-1; x++){
            //Checking the checkboxes for the programs that the nursery supports
            if(programs[x]["program"] != undefined){
                document.getElementById(programs[x]["program"]).checked = true
            }
        }
        //used below in a loop to quickly add
        //the details of the nursery.
        var details = {
            name: firstData["NurseryName"],
            email: firstData["Email"],
            crn: firstData["CommercialRegistrationNumber"],
            phoneNumber: firstData["PhoneNumber"]
        }

        //getting the name of the nursery to display it at the top of the application
        this.state.nurseryName = details["name"]

        //Used in a loop to quickly check the necessary
        //checkboxes
        var selectables = {
            sd: firstData["SiblingDiscount"],
            ecec: firstData["EarlyChildhoodEducationCertification"],
            elfc: firstData["EarlyLearningFrameworkCertification"],
            cr: firstData["ChildcareReduction"]
        }
        //Used below to quickly check the necessary
        //radio buttons
        var radios = {
            ap: firstData["AboriginalProgram"],
            sn: firstData["SpecialNeeds"],
            pu: secondData["description"],
            lf: firstData["LicensedFamily"],
            lg: firstData["LicensedGroup"]
            
        }
    

        //setting up the texts inputs values like (nursery name, email, phone number...etc)
        for(var x in details){
            //if it is null in case of some error from the backend then we just
            //use an empty string
            if(details[x] == null){
                details[x] = ""
            }
            document.getElementById(x).value = details[x]
        }
        //checking the checkboxes that are in the selectables dictionary
        for(var x in selectables){
            if(document.getElementById(x) != null && document.getElementById(x) != undefined){
                if(selectables[x] == "1"){
                    document.getElementById(x).checked = true
                }
            }
        }
        
        
        //1 = Yes, 0 = No
        //checking the RADIO buttons
        if(radios["ap"] == "1"){
            document.getElementById("formCheck-5").checked = true
        }else{
            document.getElementById("formCheck-6").checked = true
        }

        if(radios["sn"] == "1"){
            document.getElementById("formCheck-7").checked = true
        }else{
            document.getElementById("formCheck-8").checked = true
        }
        if(radios["pu"] != undefined){
            if(radios["pu"].toLowerCase() == "extra fee"){
                document.getElementById("formCheck-24").checked = true
            }else if(radios["pu"].toLowerCase() == "included in fee"){
                document.getElementById("formCheck-25").checked = true
            }else if(radios["pu"].toLowerCase() == "not offered"){
                document.getElementById("formCheck-26").checked = true
            }
        }

        if(radios["lf"] != undefined && radios["lg"] != undefined){
            if(radios["lf"] == 0){
                document.getElementById("formCheck-9").checked = true //liscensed family
            }else{
                document.getElementById("formCheck-10").checked = true  //liscensed group
            }
        }


        this.forceUpdate()
    }catch(error){}
    
    }

    cancel = (e) =>{
        //this method is used to let the user cancel everything
        //in here and go back to the nursery results page
        sessionStorage.removeItem("applicationId")
        window.location.href = "/ansr"

    }

    changeStatus = (e) =>{
        //this method is used to change the nursery's
        //status to declined by sending a request to the
        //backend with the new status number (3)

        //getting the token
        
        const formData = {
            token: this.state.token["user"],
            nurseryNumber: this.state.id
        }
        //setting up the url to send the data to the backend
        var url = ""
        if(e.target.id == "declineNursery"){
            url = "adminDeclineNursery"
        }else if(e.target.id == "approveNursery"){
            url = "adminApproveNursery"
        }

        //calling the ASYNC function to do the status update.
        this.changeStatusOfNursery(formData, url)

    }

    async changeStatusOfNursery(formData, url){
        //this method changes the status of the nursery when the user clicks on either
        //accept or decline by sending a POST request to the backend to update it in
        //the database
        const response = await fetch("http://localhost:9000/" + url,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData)
        })
        
        //converting the response to json formate
        const data = await response.json()
        //if we successfully updated the nursery's application then we 
        //remove the 'applicationId' key from the session AND
        //we send the user to the nursery search page.
        sessionStorage.removeItem("applicationId")
        window.location.href = "/ans"
    }

    render(){

        return(

                <div class="register-photo" data-test="NurseryRegistration">
                    <div class="form-container">
                        <form id="nurseryForm" method="post" onSubmit={this.submit}>
                            <h2 class="text-center">{this.state.nurseryName}'s Application</h2>
                            <div class="form-group"><label>Nursery Name:</label><input id="name" class="form-control" name="nurseryName" type="text" placeholder="Nursery name"/></div>
                            <div class="form-group" ><label style={{width: "15%"}}>Country:</label><label>{this.state.country}</label></div>
                            <div class="form-group"><label style={{width: "15%"}}>State:</label><label>{this.state.state}</label></div>
                            <div class="form-group"><label style={{width: "15%"}}>City:</label><label>{this.state.city}</label></div>
                            

                    <div class="form-group"><label>Nursery's special requirements:</label>
                        <textarea value={this.state.specialReq} class="form-control" name="specialRequirements" rows="10" cols="50" style={{height: '100%'}} placeholder="e.g. The nursery does not allow any refund after the first 2 weeks">{this.state.specialReq}</textarea>
                        </div>
                    <div class="form-group"><label>Nursery commercial registration number:</label><input id="crn" class="form-control" name="registrationNumber" type="text" placeholder="e.g. 2907402035"/></div>
                    
                    
                    
              
              
                    <div class="form-group"><label>Nursery's phone number:</label>


                        
                    <input class="form-control" id="phoneNumber" name="phoneNumber" type="text" placeholder="XXXXXXXXX" style={{width: '40%'}}/></div>
              
              
              
              
              
              
              
              
              
                <div class="form-group"><label>Nursery's email address:</label><input id="email" class="form-control" name="email" type="text" placeholder="e.g. nursery@gmail.com"/></div>
               
                
                <div style={{marginTop: '12px',fontWeight: 'bold'}}><label class="title">The following will help parents find your nursery faster:</label></div>
                <div><label>Select any of the following if it applies to you:</label></div>
                <div class="form-group">
                    <div class="form-check"><input class="form-check-input" type="checkbox" name="ChildCareFeedReduction" value="yes" id="cr"/><label class="form-check-label" for="cr">Your center is a member of the Child Care Fee Reduction Initiative</label></div>
                </div>
                <div class="form-group">
                    <div class="form-check"><input class="form-check-input" type="checkbox" name="ECE" value="yes" id="ecec"/><label class="form-check-label" for="ecec">ECE (Early Childhood Education) Certification</label></div>
                </div>
                <div class="form-group">
                    <div class="form-check"><input class="form-check-input" type="checkbox" name="ELF" value="yes" id="elfc"/><label class="form-check-label" for="elfc">ELF (Early Learning Framework) Programming</label></div>
                </div>
                <div class="form-group">
                    <div><label>Facility type:</label>
                        <div class="form-check"><input name="FacilityType" class="form-check-input" name="faciltyType" type="radio" value="Licensed Family" id="formCheck-9"/><label class="form-check-label" for="formCheck-9">Licensed Family</label></div>
                        <div class="form-check"><input name="FacilityType" class="form-check-input" name="faciltyType" type="radio" value="Licensed Group" id="formCheck-10"/><label class="form-check-label" for="formCheck-10">Licensed Group</label></div>
                    </div>
                </div>
                <div class="form-group"><label>Program(s):</label>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="Under 36 Months" name="programs-1" value="Under 36 Months"/><label class="form-check-label" for="formCheck-11">Under 36 Months</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="3 years to Kindergarten" name="programs-2" value="3 years to Kindergarten"/><label class="form-check-label" for="formCheck-14">3 years to Kindergarten</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="Licensed Preschool" name="programs-3" value="Licensed Preschool"/><label class="form-check-label" for="formCheck-13">Licensed Preschool</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="School Age: Grade 1 to Age 12" name="programs-4" value="School Age: Grade 1 to Age 12"/><label class="form-check-label" for="formCheck-12">School Age: Grade 1 to Age 12</label></div>
                </div>
                <div class="form-group"><label>House of Operation:</label>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="HouseOfOperation-1" name="HouseOfOperation-1" value="Weekdays"/><label class="form-check-label" for="formCheck-15">Weekdays</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="HouseOfOperation-2" name="HouseOfOperation-2" value="Weekends"/><label class="form-check-label" for="formCheck-15">Weekends</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="HouseOfOperation-3" name="HouseOfOperation-3" value="Statutory Holidays"/><label class="form-check-label" for="formCheck-15">Statutory Holidays</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="HouseOfOperation-4" name="HouseOfOperation-4" value="Overnight"/><label class="form-check-label" for="formCheck-15">Overnight</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="HouseOfOperation-5" name="HouseOfOperation-5" value="Weekdays Before 6am"/><label class="form-check-label" for="formCheck-15">Weekdays Before 6am</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="HouseOfOperation-6" name="HouseOfOperation-6" value="Weekdays After 7pm"/><label class="form-check-label" for="formCheck-15">Weekdays After 7pm</label></div>
                </div><label class="title">Services Offered:</label>
                <div class="form-group"><label>1- Meal Services:</label>
                    <div class="form-check"><input class="form-check-input" value="Extra Fee" name="MealServices" type="radio" id="formCheck-21"/><label class="form-check-label" for="formCheck-21">Extra Fee</label></div>
                    <div class="form-check"><input class="form-check-input" value="Included in fee" name="MealServices" type="radio" id="formCheck-23"/><label class="form-check-label" for="formCheck-21">Included in fee</label></div>
                    <div class="form-check"><input class="form-check-input" value="Not offered" name="MealServices" type="radio" id="formCheck-22"/><label class="form-check-label" for="formCheck-21">Not offered</label></div>
                </div>
                <div class="form-group"><label>2- Pick-up Service:</label>
                    <div class="form-check"><input class="form-check-input" value="Extra Fee" name="pickup" type="radio" id="formCheck-24"/><label class="form-check-label" for="formCheck-21">Extra Fee</label></div>
                    <div class="form-check"><input class="form-check-input" value="Included in fee" name="pickup" type="radio" id="formCheck-25"/><label class="form-check-label" for="formCheck-21">Included in fee</label></div>
                    <div class="form-check"><input class="form-check-input" value="Not offered" name="pickup" type="radio" id="formCheck-26"/><label class="form-check-label" for="formCheck-21">Not offered</label></div>
                </div>
                <div class="form-group"><label>3- Language:</label>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="English" name="Language-6" value="English"/><label class="form-check-label" for="English">English</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="Cantonese" name="Language-1" value="Cantonese" /><label class="form-check-label" for="Cantonese">Cantonese</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="French" name="Language-2" value="French"/><label class="form-check-label" for="French">French</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="Mandarin" name="Language-3" value="Mandarin"/><label class="form-check-label" for="Mandarin">Mandarin</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="Punjabi" name="Language-4" value="Punjabi"/><label class="form-check-label" for="Punjabi">Punjabi</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="Spanish" name="Language-5" value="Spanish"/><label class="form-check-label" for="Spanish">Spanish</label></div>
                    
                </div>
                <div class="form-group"><label>Aboriginal Programming:</label>
                    <div class="form-check"><input class="form-check-input" value="yes" name="Aboriginal" type="radio" id="formCheck-5"/><label class="form-check-label" for="formCheck-5">Yes</label></div>
                    <div class="form-check"><input class="form-check-input" value="no" name="Aboriginal" type="radio" id="formCheck-6"/><label class="form-check-label" for="formCheck-5">No</label></div>
                </div>
                <div class="form-group"><label>Special Needs</label>
                    <div class="form-check"><input class="form-check-input" value="yes" name="specialNeeds" type="radio" id="formCheck-7"/><label class="form-check-label" for="formCheck-5">Yes</label></div>
                    <div class="form-check"><input class="form-check-input" value="no" name="specialNeeds" type="radio" id="formCheck-8"/><label class="form-check-label" for="formCheck-5">No</label></div>
                </div>
                <div class="form-group">
                    <div class="form-check"><input class="form-check-input" type="checkbox" name="MoreChanceWithSiblings" value="Yes" id="sd"/><label class="form-check-label" for="formCheck-1">Check if your offer more chance of enrolment for siblings</label></div>
                </div>


                <div style={{marginTop: '5%'}}>

                    { /*
                        Below shows the 3 buttons when the status of the nursery is = 0 (Just registered in the system)
                    */
                        this.state.status == 0 && <button class="btn btn-primary nurseryApplicationButtons" onClick={this.cancel} type="button" style={{backgroundColor: 'rgb(211,3,46)',width: '20%',marginLeft: '10%', marginRight: "5%"}}>Cancel</button>
                    }
                    {
                        this.state.status == 0 && <button class="btn btn-primary" id="declineNursery" type="button" onClick={this.changeStatus} style={{width: '20%',marginRight: '5%', marginLeft: "5%" ,backgroundColor: 'rgb(157,0,0)'}}>Decline</button>
                    }
                    {
                        this.state.status == 0 && <button class="btn btn-primary" id="approveNursery" type="button" onClick={this.changeStatus} style={{marginLeft: "5%", marginRight: "10%",width: '20%',backgroundColor: 'rgb(1,106,1)'}}>Approve</button>
                    }

                    
                    { /*
                        Below shows the 2 buttons when the status of the nursery is = 1 (Approved)
                    */
                        this.state.status == 1 && <button class="btn btn-primary nurseryApplicationButtons" onClick={this.cancel} type="button" style={{backgroundColor: 'rgb(211,3,46)',width: '20%',marginLeft: '20%', marginRight: "10%"}}>Cancel</button>
                    }
                    {
                        this.state.status == 1 && <button class="btn btn-primary" id="declineNursery" type="button" onClick={this.changeStatus} style={{width: '20%',marginRight: '20%', marginLeft: "10%" ,backgroundColor: 'rgb(157,0,0)'}}>Stop</button>
                    }



                    { /*
                        Below shows the 2 buttons when the status of the nursery is = 3 (Stopped/declined)
                    */
                        this.state.status == 3 && <button class="btn btn-primary nurseryApplicationButtons" onClick={this.cancel} type="button" style={{backgroundColor: 'rgb(211,3,46)',width: '20%',marginLeft: '20%', marginRight: "10%"}}>Cancel</button>
                    }
                    {
                        this.state.status == 3 && <button class="btn btn-primary" id="approveNursery" type="button" onClick={this.changeStatus} style={{marginLeft: "5%", marginRight: "10%",width: '20%',backgroundColor: 'rgb(1,106,1)'}}>Approve</button>
                    }

                    
            </div>


                </form>
                </div>
                </div>




        )
    }

}

export default NurseryApplication