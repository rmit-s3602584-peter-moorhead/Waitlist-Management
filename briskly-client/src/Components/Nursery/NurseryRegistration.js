import React, {Component} from 'react'
import "../../ComponentStyles.css"
import AddProgram from "./AddProgram"
import Axios from 'axios'
import CountryStateCity from "../CountryStateCity.js"



// Token for country, state, city: FVHOUbR_JQ7NtLn0hgiGN7WbLCSASKet7fv3jxZVhDnife3SW-OQ1gr1nkL7TLs62Fg
//API used for country, state and city: https://www.universal-tutorial.com/rest-apis/free-rest-api-for-country-state-city

class NuresryRegistration extends Component{

    /**
     * 
     * This component is used for a nursery to register itself
     * in the Briskly system
     * 
     */

     //setting up the component's state variable and other variables
    constructor(props){
        super(props)
        this.programCount = 0;
        this.programList = []
        this.allPrograms = {0: <AddProgram deleteProgram={this.deleteProgram.bind(this)} keyToUse={0}/>}

        //used to add a program when the "Add Program" is clicked
        this.addProgram = this.addProgram.bind(this)

        this.state = {
            countries: [],
            phoneCode: [],
            shortCode: [],
            authToken: "",
            failed: false
        }
    }

    async componentWillMount(){
        
        //getting the countries from the APIs


        //getting the access token.
        const response = await fetch('https://www.universal-tutorial.com/api/getaccesstoken',{
                headers:{
                    'Accept': 'application/json',
                    'api-token': 'FVHOUbR_JQ7NtLn0hgiGN7WbLCSASKet7fv3jxZVhDnife3SW-OQ1gr1nkL7TLs62Fg',
                    'user-email':'BrisklyTest@gmail.com',
                    'Content-Type': 'application/json'
                }
            })
        
        //getting the response as a JSON
        const data = await response.json()
        
        //setting the authentication token in the state variable
        this.setState({
            authToken: data['auth_token']
        })
        
        //getting the countries by providing the access token to it.
        const countriesResponse = await fetch('https://www.universal-tutorial.com/api/countries/',{
                headers:{
                    'Authorization':"Bearer " + this.state.authToken,
                    'Accept': 'application/json'
                   
                }
            })
        //getting all the countries as a JSON
        const countries = await countriesResponse.json()
        
        //temporary arrays to store the countries and phone codes
        var allCountries = []
        var allPhoneCodes = []

        //looping through the response and storing the data in separate arrays
        for(var x in countries){
            var obj = countries[x]

            allCountries.push(obj['country_name'])
            allPhoneCodes.push(obj['country_phone_code'])
            
        }
        //setting the state values with the temporary arrays used above
        this.setState({
            countries: allCountries,
            phoneCode: allPhoneCodes
        })

        //this is used to get the country codes String that will be used
        //when the user selects the country code for their phone number
        // i.e. Australia (+61)
        var combineCodeAndShort = []
        for(var x = 0; x < this.state.phoneCode.length; x++){
            //looping through them and creating the string that will be used/shown
            var combined = this.state.countries[x] + " (+" + this.state.phoneCode[x] + ")"
            combineCodeAndShort.push(combined)
        }
        //setting the state with that array of combinations of the country codes and the names
        this.setState({
            shortCode: combineCodeAndShort
        })

    }

    //this event is responsible for allowing the nursery to add a new program
    //to their application
    addProgram = () => {
        //used to count the number of programs we have so far
        this.programCount += 1;
        //Storing the AddProgram component in the dictoinary below
        //it is stored a dictionary to know its key which represents the id of it
        //and the id is caluclated by using 'this.programCount' above
        this.allPrograms[this.programCount] = <AddProgram deleteProgram={this.deleteProgram.bind(this)} keyToUse={this.programCount}/>
        
        //once the button is clicked we start adding the new program and we loop
        //through it to assign it the correct components and not lose any of them
        var NewObj = {}, keysArr = Object.keys(this.allPrograms);
        for (var i = keysArr.length-1; i >= 0; i--) {
            NewObj[keysArr[i]] = this.allPrograms[keysArr[i]];
        }      
        //re-assigning the allPrograms dictionary
        this.allPrograms = NewObj

        //updating the page with the new components
        this.forceUpdate()
       
    }

    //used to delete the program from the allPrograms dictionary
    deleteProgram (programToDeleteKey){

        //creates a new dictionary in order to assign it 
        //with all the components without the deleted one
        //and then assign allPrograms with it
        var newDictionary = {}
        
        //finding the deleted component and NOT adding it to newDictonary
        for(var key in this.allPrograms){
        
            if(parseInt(key) != parseInt(programToDeleteKey)){
    
                newDictionary[key] = this.allPrograms[key]
            }
        }
        
        //assigning newDictionary with the new components/remaining components
        this.allPrograms = newDictionary

        //updaing the current component with the new number of programs
        this.forceUpdate()
    }


    submit = (e) => {
        //used to submit/send the data to the backend to add the user to the database
        e.preventDefault();
        
        //first we do a setup of what is expected to be used in the backend and all of the
        //inputs that have been used
        //everything will be stored inside the dictionary formData which will be sent to the
        //backend.
        let target   = e.target;
        let formData = {};
        formData['programs'] = []
        formData['agesAccepted'] = []
        formData['HouseOfOperation'] = []
        formData['Languages'] = []
        formData['programList'] = []
        //looping through all of the form inputs and adding them to formData
        for (var i = 0; i < target.length; i++) {

            //if we are currently looking at a checkbox or a radio button
            if(target.elements[i].type == "checkbox" || target.elements[i].type == "radio"){
                //if that checkbox or radio button IS CHECKED
                if(target[i].checked == true){

                    //for easy access we get the element
                    var element = target.elements[i].getAttribute("name")

                    //get the actual value of it.
                    //here the names provided to the HTML tag is used to check what type
                    //of HTML tag it is.

                    //if we are looking at the programs then we append to formData["programs"]
                    if(element.substring(0, element.indexOf('-')) == "programs"){
                        var programs = formData['programs']
                        programs.push(target[i].value)
                        formData['programs'] = programs

                    //if we are looking at the agesAccepted then we append to formData["agesAccepted"]
                    }else if(element.substring(0, element.indexOf('-')) == "agesAccepted"){
                        var ages = formData['agesAccepted']
                        ages.push(target[i].value)
                        formData['agesAccepted'] = ages
                    
                    //if we are looking at the HouseOfOperation then we append to formData["HouseOfOperation"]
                    }else if(element.substring(0, element.indexOf('-')) == "HouseOfOperation"){
                        var operation = formData['HouseOfOperation']
                        operation.push(target[i].value)
                        formData['HouseOfOperation'] = operation
                    //if we are looking at the Languages that the nuersery uses then we append to formData["Language"]
                    }else if(element.substring(0, element.indexOf('-')) == "Language"){
                        var languages = formData['Languages']
                        languages.push(target[i].value)
                        formData['Languages'] = languages
                    }

                    else{
                        //if it is none of them then we just append it to the formData by getting its name and assigning it to the value
                        console.log("check")
                        console.log(target.elements[i].getAttribute("name"))
                        formData[target.elements[i].getAttribute("name")] = target[i].value;
                    }
                }

            }else{
                //IF it is not a checkbox or a radio button,
                
                //for easy access we get the element
                var element = target.elements[i].getAttribute("name")
                
                //if the element is NOT null and it is either a programId or a studentIn (Which are the names given to the <AddProgram/>
                //component for the name of and number of students that the program holds)
                if(element != null && (element.substring(0, element.indexOf('-')) == "programId" || element.substring(0, element.indexOf('-')) == "studentsIn")){
                    
                    //assigning the values to formData["programList"]

                    var programList = formData['programList']
                    //programName, studentsInProgram, programName2, studentsInprogram2.....
                    programList.push(target[i].value)
                    formData['programList'] = programList

                }
                //adding the data to the formData
                if(element != null && ((element.substring(0, 7) != "program") && element.substring(0, 8) != "students")){
                    formData[target.elements[i].getAttribute("name")] = target[i].value;
                }
                
            }
        }


        //cleaning up the data
        if(formData["country"] == "Select Country"){
            formData["country"] = ""
        }
        if(formData["state"] == "Select State/Province"){
            formData["state"] = ""
        }
        if(formData["city"] == "Select City"){
            formData["city"] = ""
        }
        if(formData["code"] == "Country Code"){
            formData["code"] = ""
        }
        
        //checking to see if everything is filled or not.
        var check = this.validation(formData)

        //now that the data is offically finished processing then we send it to the backend
        //once that is done then we take the user to the /login which is the login page
        //it only happens when all the data has been validated
        if(check == true){
            Axios.post('http://localhost:9000/nurseryRegister', {...formData}).then(res=>{
                window.location.href = "/login"
            })
        }else{
            //when not everything is filled out we show an error message
            //above the button to tell the user about it
            this.state.failed = true
            this.forceUpdate()
        }
        
    }

    validation(formData){

        var allGood = true

        //checking the radio buttons
        if(formData["Aboriginal"] == undefined || formData["facilityType"] == undefined || 
            formData["specialNeeds"] == undefined || formData["MealServices"] == undefined ||
            formData["pickup"] == undefined){
            allGood = false
        }
        //checking the multiple selection fields
        if(formData["HouseOfOperation"].length == 0 || formData["Languages"].length == 0 || 
            formData["programs"].length == 0){
                allGood = false
            }

        //checking the programs
        for(var i = 0; i < formData["programList"].length; i++){
            if(formData["programList"][i] == ""){
                allGood = false
                break
            }
        }

        //checking text inputs
        for(var key in formData){
            if(typeof formData[key] !== 'object'){
                if(key == "" || formData[key] == ""){
                    allGood = false
                    break
                }
            }
        }
        return allGood

    }

    render(){

        return(



                <div class="register-photo" data-test="NurseryRegistration">
                    <div class="form-container">
                        <form id="nurseryForm" method="post" onSubmit={this.submit}>
                            <h2 class="text-center">Nursery Registration</h2>
                            <div class="form-group"><label>Nursery Name:</label><input class="form-control" name="nurseryName" type="text" placeholder="Nursery name"/></div>
                            
                            <CountryStateCity keyToUse={0} country="country" state="state" city="city"/>

                    <div class="form-group">
                        <div style={{display: 'flex',flexDirection: 'column'}}><label>Please list all your programs:</label></div>
                        
                        
                        
                        <div>
                            <button onClick={this.addProgram} id="addProgram" class="btn btn-outline-primary text-truncate float-none float-sm-none add-another-btn" data-bs-hover-animate="pulse" type="button" style={{fontSize: '1.3vw',width: '25%',color: 'rgb(80,94,108)',borderColor: 'rgb(6,84,113)'}}>
                                Add Program<i class="fas fa-plus-circle edit-icon" style={{color: 'rgb(6,84,113)', borderColor: 'rgb(6,84,113)'}}></i>
                                </button>
                                </div>
                    </div>


                    {
                       Object.entries(this.allPrograms).map((item, i) => {
                        //    return item[1] which is the <AddProgram.../>
                        return item[1]
                       })
                    }

                    
                    <div class="form-group"><label>Nursery photo catalog:&nbsp;&nbsp;</label><input name="catalog" type="file"/></div>
                    <div class="form-group"><label>Nursery's special requirements:</label><textarea class="form-control" name="specialRequirements" form="nurseryForm" rows="10" cols="50" style={{height: '100%'}} placeholder="e.g. The nursery does not allow any refund after the first 2 weeks"></textarea></div>
                    <div class="form-group"><label>Nursery commercial registration number:</label><input class="form-control" name="crn" type="text" placeholder="e.g. 2907402035"/></div>
                    
                    
                    
              
              
                    <div class="form-group"><label>Nursery's phone number:</label>




                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <div class="dropdown dropDownMenu" style={{marginRight: '2%', width: '20%'}}>
                                
                                <select name="code" class="form-control countryStateCityDropdown" style={{width: '100%', height: '100%', fontSize: '100%'}}>
                                <option >Country Code</option>

                                {
                                    this.state.shortCode.map((item, i) => <option name="code" key={i} onClick={this.test} value={this.state.shortCode[i]} >{this.state.shortCode[i]}</option>)
                                }

                                    </select>
                        </div><input class="form-control" name="phoneNumber" type="text" placeholder="XXXXXXXXX" style={{width: '40%'}}/></div>
                </div>
              
              
              
              
              
              
              
              
                <div class="form-group"><label>Nursery's email address:</label><input class="form-control" name="email" type="text" placeholder="e.g. nursery@gmail.com"/></div>
                <div class="form-group"><label>Main username:</label><input class="form-control" type="text" name="username" placeholder="e.g. Nursery1Main"/></div>
                <div class="form-group"><label>Password:</label><input class="form-control" type="password" name="password" placeholder="Password"/></div>
                <div class="form-group"><input class="form-control" name="confirmPassword" type="password" placeholder="Confirm password"/></div>
                
                <div style={{marginTop: '12px',fontWeight: 'bold'}}><label class="title">The following will help parents find your nursery faster:</label></div>
                <div><label>Select any of the following if it applies to you:</label></div>
                <div class="form-group">
                    <div class="form-check"><input class="form-check-input" type="checkbox" name="ChildCareFeedReduction" value="yes" id="formCheck-2"/><label class="form-check-label" for="formCheck-2">Your center is a member of the Child Care Fee Reduction Initiative</label></div>
                </div>
                <div class="form-group">
                    <div class="form-check"><input class="form-check-input" type="checkbox" name="ECE" value="yes" id="formCheck-3"/><label class="form-check-label" for="formCheck-3">ECE (Early Childhood Education) Certification</label></div>
                </div>
                <div class="form-group">
                    <div class="form-check"><input class="form-check-input" type="checkbox" name="ELF" value="yes" id="formCheck-4"/><label class="form-check-label" for="formCheck-4">ELF (Early Learning Framework) Programming</label></div>
                </div>
                <div class="form-group">
                    <div><label>Facility type:</label>
                        <div class="form-check"><input name="FacilityType" class="form-check-input" name="facilityType" type="radio" value="Licensed Family" id="formCheck-9"/><label class="form-check-label" for="formCheck-9">Licensed Family</label></div>
                        <div class="form-check"><input name="FacilityType" class="form-check-input" name="facilityType" type="radio" value="Licensed Group" id="formCheck-10"/><label class="form-check-label" for="formCheck-10">Licensed Group</label></div>
                    </div>
                </div>
                <div class="form-group"><label>Program(s):</label>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-11" name="programs-1" value="Under 36 Months"/><label class="form-check-label" for="formCheck-11">Under 36 Months</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-14" name="programs-2" value="3 years to Kindergarten"/><label class="form-check-label" for="formCheck-14">3 years to Kindergarten</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-13" name="programs-3" value="Licensed Preschool"/><label class="form-check-label" for="formCheck-13">Licensed Preschool</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-12" name="programs-4" value="School Age: Grade 1 to Age 12"/><label class="form-check-label" for="formCheck-12">School Age: Grade 1 to Age 12</label></div>
                </div>
                <div class="form-group"><label>House of Operation:</label>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-15" name="HouseOfOperation-1" value="Weekdays"/><label class="form-check-label" for="formCheck-15">Weekdays</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-20" name="HouseOfOperation-2" value="Weekends"/><label class="form-check-label" for="formCheck-20">Weekends</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-19" name="HouseOfOperation-3" value="Statutory Holidays"/><label class="form-check-label" for="formCheck-19">Statutory Holidays</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-18" name="HouseOfOperation-4" value="Overnight"/><label class="form-check-label" for="formCheck-18">Overnight</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-17" name="HouseOfOperation-5" value="Weekdays Before 6am"/><label class="form-check-label" for="formCheck-17">Weekdays Before 6am</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-16" name="HouseOfOperation-6" value="Weekdays After 7pm"/><label class="form-check-label" for="formCheck-16">Weekdays After 7pm</label></div>
                </div><label class="title">Services Offered:</label>
                <div class="form-group"><label>1- Meal Services:</label>
                    <div class="form-check"><input class="form-check-input" value="Extra Fee" name="MealServices" type="radio" id="formCheck-21"/><label class="form-check-label" for="formCheck-21">Extra Fee</label></div>
                    <div class="form-check"><input class="form-check-input" value="Included in fee" name="MealServices" type="radio" id="formCheck-23"/><label class="form-check-label" for="formCheck-23">Included in fee</label></div>
                    <div class="form-check"><input class="form-check-input" value="Not offered" name="MealServices" type="radio" id="formCheck-22"/><label class="form-check-label" for="formCheck-22">Not offered</label></div>
                </div>
                <div class="form-group"><label>2- Pick-up Service:</label>
                    <div class="form-check"><input class="form-check-input" value="Extra Fee" name="pickup" type="radio" id="formCheck-24"/><label class="form-check-label" for="formCheck-24">Extra Fee</label></div>
                    <div class="form-check"><input class="form-check-input" value="Included in fee" name="pickup" type="radio" id="formCheck-26"/><label class="form-check-label" for="formCheck-26">Included in fee</label></div>
                    <div class="form-check"><input class="form-check-input" value="Not offered" name="pickup" type="radio" id="formCheck-25"/><label class="form-check-label" for="formCheck-25">Not offered</label></div>
                </div>
                <div class="form-group"><label>3- Language:</label>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-50" name="Language-6" value="English"/><label class="form-check-label" for="formCheck-50">English</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-27" name="Language-1" value="Cantonese" /><label class="form-check-label" for="formCheck-27">Cantonese</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-31" name="Language-2" value="French"/><label class="form-check-label" for="formCheck-31">French</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-30" name="Language-3" value="Mandarin"/><label class="form-check-label" for="formCheck-30">Mandarin</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-29" name="Language-4" value="Punjabi"/><label class="form-check-label" for="formCheck-29">Punjabi</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-28" name="Language-5" value="Spanish"/><label class="form-check-label" for="formCheck-28">Spanish</label></div>
                </div>
                <div class="form-group"><label>Aboriginal Programming:</label>
                    <div class="form-check"><input class="form-check-input" value="yes" name="Aboriginal" type="radio" id="formCheck-5"/><label class="form-check-label" for="formCheck-5">Yes</label></div>
                    <div class="form-check"><input class="form-check-input" value="no" name="Aboriginal" type="radio" id="formCheck-6"/><label class="form-check-label" for="formCheck-6">No</label></div>
                </div>
                <div class="form-group"><label>Special Needs</label>
                    <div class="form-check"><input class="form-check-input" value="yes" name="specialNeeds" type="radio" id="formCheck-7"/><label class="form-check-label" for="formCheck-7">Yes</label></div>
                    <div class="form-check"><input class="form-check-input" value="no" name="specialNeeds" type="radio" id="formCheck-8"/><label class="form-check-label" for="formCheck-8">No</label></div>
                </div>
                <div class="form-group">
                    <div class="form-check"><input class="form-check-input" type="checkbox" name="MoreChanceWithSiblings" value="yes" id="formCheck-1"/><label class="form-check-label" for="formCheck-1">Check if your offer more chance of enrolment for siblings</label></div>
                </div>
                {//showing an error message when the user does not fill out all of the information required.
                
                   this.state.failed && <div class="form-group" style={{textAlign: "center"}}><lable style={{color: "red", fontWeight: "bold"}}>Please make sure that you fill everything in this page before clicking on the Register button.</lable></div>
                
                }
                <div class="form-group">
                    <button class="btn btn-primary btn-block" type="submit" style={{backgroundColor: 'rgb(6,84,113)'}}>Proceed to payment</button>
                    </div>
                    <a class="already" href="/login">You already have an account? Login here.</a>
                </form>
                </div>
                </div>




        )
    }

}

export default NuresryRegistration