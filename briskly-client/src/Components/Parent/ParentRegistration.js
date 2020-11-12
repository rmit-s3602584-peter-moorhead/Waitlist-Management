import React, {Component} from 'react'
import NewGuardian from './NewGuardian.js'
import "../../ComponentStyles.css"
import Axios from 'axios';
import AddressContact from "./AddressContact.js"
import Occupation from "./Occupation.js"

class ParentRegistration extends Component{
    /**
     * 
     * This component is used to allow the parent to register to the Briskly website/system
     * 
     */


    //The constructor here is used to initialize important data
    constructor(props){
        super(props)

        //used to know when to show or hide the new guradian button
        this.hideAddGuardianButton = {0: false}

        this.state = {
            countries: [],
            phoneCode: [],
            shortCode: [],
            authToken: "",
            freeStyle: {
                borderStyle: 'solid',
                borderColor: 'rgb(6,84,113)',
                borderRadius: '2%',
                width: '40%',
                marginRight: '2.5%',
                marginLeft: '7.5%',
                backgroundColor: 'white'
            },
            premiumStyle: {
                borderStyle: 'solid',
                borderColor: 'rgb(6,84,113)',
                borderRadius: '2%',
                width: '40%',
                marginRight: '7.5%',
                marginLeft: '2.5%',
                backgroundColor: 'white'
            },
            profileType: "none",
            failed: false
        }
        this.relationshipStatus = ['Single', 'Married', 'Divorced', 'Widowed']
        
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

    addGuardian = () =>{
        //This function is used to add the NewGuardian component to the form
        this.hideAddGuardianButton[0] = true
        //updating the component
        this.forceUpdate()
    }

    //This method is used to either show the NewGuardian component or show a button that you
    //press to show that component. 
    //All based on the hideAddGuardianButton[0] variable
    showButton(){
        if(this.hideAddGuardianButton[0] == false){
            return <div><button id="addGuardian" class="btn btn-primary" type="button" style={{backgroundColor: 'rgb(6,84,113)'}} onClick={this.addGuardian}>Add Another Parent/Guardian</button></div>
        }else{
            return <NewGuardian shortCode={this.state.shortCode} delete={this.removeSecondGuardian.bind(this)}/>
        }
    }

    //this method is used to remove the NewGuradian component when the "Remove second parent/guardian" button is clicked
    removeSecondGuardian(){
        this.hideAddGuardianButton[0] = false
        this.forceUpdate()
    }


    //this event is used to CHANGE the styles on the Free and Premuim buttons when
    //the FREE button is clicked
    clickedFree = () =>{
        //changing only the state variables that holds the styles of the Free and Premuim buttons
        this.setState({
            freeStyle: {
                borderStyle: 'solid',
                borderColor: 'rgb(6,84,113)',
                borderRadius: '2%',
                width: '40%',
                marginRight: '2.5%',
                marginLeft: '7.5%',
                backgroundColor: 'rgb(26, 101, 126)',
                color: "white"

            },
            premiumStyle: {
                borderStyle: 'solid',
                borderColor: 'rgb(6,84,113)',
                borderRadius: '2%',
                width: '40%',
                marginRight: '7.5%',
                marginLeft: '2.5%',
                backgroundColor: 'white'

            },
            profileType: "free"
        })
    }
    //this event is used to CHANGE the styles on the Free and Premuim buttons when
    //the PREMUIM button is clicked
    clickedPremium = () => {
        //changing only the state variables that holds the styles of the Free and Premuim buttons
        this.setState({
            freeStyle: {
                borderStyle: 'solid',
                borderColor: 'rgb(6,84,113)',
                borderRadius: '2%',
                width: '40%',
                marginRight: '2.5%',
                marginLeft: '7.5%',
                backgroundColor: 'white'

            },
            premiumStyle: {
                borderStyle: 'solid',
                borderColor: 'rgb(6,84,113)',
                borderRadius: '2%',
                width: '40%',
                marginRight: '7.5%',
                marginLeft: '2.5%',
                backgroundColor: 'rgb(26, 101, 126)',
                color: "white"

            },
            profileType: "premium"
        })
        
    }
    //this event is used to CHANGE the styles on the Free and Premuim buttons when
    //the FREE button is HOVERED
    hoverFree = () =>{
        if(this.state.profileType == "none" || this.state.profileType == "premium"){
            //then you can change the color.
            this.setState({
                freeStyle: {
                    borderStyle: 'solid',
                    borderColor: 'rgb(6,84,113)',
                    borderRadius: '2%',
                    width: '40%',
                    marginRight: '2.5%',
                    marginLeft: '7.5%',
                    backgroundColor: 'rgb(247, 249, 252)',
                    color: 'black'
                },
                
            })
        }
    }
    //this event is used to CHANGE the styles on the Free and Premuim buttons ((AFTER))
    //the FREE button is HOVERED
    awayFree = () =>{
        if(this.state.profileType == "none" || this.state.profileType == "premium"){
            //then you can change the color.
            this.setState({
                freeStyle: {
                    borderStyle: 'solid',
                    borderColor: 'rgb(6,84,113)',
                    borderRadius: '2%',
                    width: '40%',
                    marginRight: '2.5%',
                    marginLeft: '7.5%',
                    backgroundColor: 'white',
                    color: 'black'
                }
            })
        }
    }
     //this event is used to CHANGE the styles on the Free and Premuim buttons when
    //the PREMIUM button is HOVERED
    hoverPremium = () =>{
       if(this.state.profileType == "none" || this.state.profileType == "free"){
            //then you can change the color.
            this.setState({
                premiumStyle: {
                    borderStyle: 'solid',
                    borderColor: 'rgb(6,84,113)',
                    borderRadius: '2%',
                    width: '40%',
                    marginRight: '7.5%',
                    marginLeft: '2.5%',
                    backgroundColor: 'rgb(247, 249, 252)',
                    color: 'black'
    
                },
            })
            
        }
    }
    //this event is used to CHANGE the styles on the Free and Premuim buttons ((AFTER))
    //the PREMIUM button is HOVERED
    awayPremium = () =>{
        if(this.state.profileType == "none" || this.state.profileType == "free"){
            //then you can change the color.
            this.setState({
                premiumStyle: {
                    borderStyle: 'solid',
                    borderColor: 'rgb(6,84,113)',
                    borderRadius: '2%',
                    width: '40%',
                    marginRight: '7.5%',
                    marginLeft: '2.5%',
                    backgroundColor: 'white',
                    color: 'black'
                }
            })
        }
    }

    //this method is used to submit data to the database (registering a new parent to the system)
    //called when the Register button is pressed
    submit = (e) => {
        //preventing the default form behavior
        e.preventDefault();

        //resetting the variable that allows the error message to appear
        this.state.failed = false
        this.forceUpdate()

        //Storing all the data that will be sent in a dictionary called formData
        let target   = e.target;
        let formData = {};
        //looping through all of the form inputs and getting their results and storing them
        for (var i = 0; i < target.length; i++) {
            //if we are currently looking at the a checkbox or a radio button
            if(target.elements[i].type == "checkbox" || target.elements[i].type == "radio"){
                //AND those buttons are CHECKED
                if(target[i].checked == true){
                    //then we add that button with the name it is provided in the HTML tag and its
                    //value is assigned to the formData with the key being its name
                    formData[target.elements[i].getAttribute("name")] = target[i].value;
                }

            }else{
                //otherwise, just add the data to the form with the key being its HTML tag name
                //and the value being the value provided by the user.
                if(target.elements[i].getAttribute("name") != null){
                    formData[target.elements[i].getAttribute("name")] = target[i].value;
                }
            }
        }
        //ensuring that everything is filled out.
        var check = this.validate(formData)
        //if everything is filled then send the information to the backend.
        if(check == true){
            //sending the data to the register method to send the data to the backend
            this.register(formData)
        }else{
            //otherwise show the error message
            this.state.failed = true
            this.forceUpdate()
        }
        
        
    }

    validate(formData){

        var allGood = true

        //assigning the default values to "" an empty string
        if(formData["businessCity1"] == "Select City"){
            formData["businessCity1"] = ""
        }
        if(formData["businessCity2"] == "Select City"){
            formData["businessCity2"] = ""
        }
        if(formData["businessCountry1"] == "Select Country"){
            formData["businessCountry1"] = ""
        }
        if(formData["businessCountry2"] == "Select Country"){
            formData["businessCountry2"] = ""
        }
        if(formData["businessCountryCode1"] == "Country Code"){
            formData["businessCountryCode1"] = ""
        }
        if(formData["businessCountryCode2"] == "Country Code"){
            formData["businessCountryCode2"] = ""
        }
        if(formData["businessState1"] == "Select State/Province"){
            formData["businessState1"] = ""
        }
        if(formData["businessState2"] == "Select State/Province"){
            formData["businessState2"] = ""
        }
        if(formData["city1"] == "Select City"){
            formData["city1"] = ""
        }
        if(formData["city2"] == "Select City"){
            formData["city2"] = ""
        }
        if(formData["country1"] == "Select Country"){
            formData["country1"] = ""
        }
        if(formData["country2"] == "Select Country"){
            formData["country2"] = ""
        }
        if(formData["countryCode1"] == "Country Code"){
            formData["countryCode1"] = ""
        }
        if(formData["countryCode2"] == "Country Code"){
            formData["countryCode2"] = ""
        }
        if(formData["relationship1"] == "Select Relationship"){
            formData["relationship1"] = ""
        }
        if(formData["relationship2"] == "Select Relationship"){
            formData["relationship2"] = ""
        }
        if(formData["state1"] == "Select State/Province"){
            formData["state1"] = ""
        }
        if(formData["state2"] == "Select State/Province"){
            formData["state2"] = ""
        }
        if(formData["profileType"] == "none"){
            formData["profileType"] = ""
        }

        //checking the data to see if they are == "" or not
        for(var key in formData){
            if(formData[key] == ""){
                allGood = false              
                break
            }
        }

        //checking the radio buttons if they are there..

        //first we check if the new guardian appears or not by
        //checking in the dictionary.
        //this variable is to know if we show "Add Another Parent/Guardian"
        //button or not.
        if(this.hideAddGuardianButton[0] == true){
            if(formData["Child-Lives-With"] == undefined){
                allGood = false
            }
            if(formData["Custody-Agreement"] == undefined){
                allGood = false
            }
        }
        

        return allGood

    }

    register(formData){
        //sending the formData to the backend to register the parent to the system
        Axios.post('http://localhost:9000/parentRegister', {...formData})
        //taking the user to the login page after registering.
        window.location.href = "/login"
    }

    render() {



        return(


            <div class="register-photo">
        <div class="form-container">
            <form method="post" onSubmit={this.submit}>
                <h2 class="text-center">Complete Profile</h2><label class="title">Personal Information</label>
                <div class="form-group">
                    <div style={{display: 'flex',flexDirection: 'row'}}>
                        <div style={{width: '13.5%',alignSelf: 'center'}}><label style={{margin: '0px'}}>First Name:</label></div>
                        <div style={{width: '70%'}}><input class="form-control" name="firstName1" type="text" placeholder="First Name" style={{width: '70%',padding: '0px',marginLeft: '1%'}}/></div>
                    </div>
                </div>
                <div class="form-group">
                    <div style={{display: 'flex',flexDirection: 'row'}}>
                        <div style={{width: '13.5%',alignSelf: 'center'}}><label style={{margin: '0px'}}>Last Name:</label></div>
                        <div style={{width: '70%'}}><input class="form-control" type="text" name="lastName1" placeholder="Last Name" style={{width: '70%',padding: '0px',marginLeft: '1%'}}/></div>
                    </div>
                </div>
                <div class="form-group">
                    <div style={{display: 'flex',flexDirection: 'row'}}>
                        <div style={{width: '13.5%',alignSelf: 'center'}}><label style={{margin: '0px'}}>Password:</label></div>
                        <div style={{width: '70%'}}><input class="form-control" type="password" name="userName1" placeholder="Password" style={{width: '70%',padding: '0px',marginLeft: '1%'}}/></div>
                    </div>
                </div>
                <div class="form-group">
                    <div style={{display: 'flex',flexDirection: 'row'}}>
                        <div style={{width: '13.5%',alignSelf: 'center'}}><label style={{margin: '0px'}}>Resenter Password:</label></div>
                        <div style={{width: '70%'}}><input class="form-control" type="password" name="password" placeholder="Password" style={{width: '70%',padding: '0px',marginLeft: '1%'}}/></div>
                    </div>
                </div>
                <div class="form-group">
                    <div style={{display: 'flex',flexDirection: 'row'}}>
                        <div style={{width: '13.5%',alignSelf: 'center'}}><label style={{margin: '0px'}}>Username:</label></div>
                        <div style={{width: '70%'}}><input class="form-control" type="text" name="passwordRepeat" placeholder="Username" style={{width: '70%',padding: '0px',marginLeft: '1%'}}/></div>
                    </div>
                </div>                                
                <div class="form-group">
                    <div style={{display: 'flex',flexDirection: 'row'}}>
                        <div style={{width:'14%', marginTop: '1%'}}><label style={{margin: '0px'}}>Relationship:</label></div>
                        <div style={{width: "25%"}}>
                            <select name="relationship1" class="form-control">
                                <option>Select Relationship</option>
                                {
                                    this.relationshipStatus.map((item, i) => <option name="relationship1" value={this.relationshipStatus[i]}>{this.relationshipStatus[i]}</option>)
                                }

                        </select>
                    </div>
                </div>
        </div>
        <div class="form-group">
            <div style={{display: 'flex',flexDirection: 'row'}}>
                <div style={{width:'14%'}}><label style={{margin: '0px',marginTop: '5%'}}>Date of birth:</label></div>
                <div ><input class="form-control" name="birthday1" type="date" /></div>
            </div>
        </div>
        
        


        <AddressContact keyToUse={0} country="country1" state="state1" city="city1" title={"Address and Contact information"} names={["homeAddress1", "homeZipCode1", "countryCode1", "phoneNumber1", "personalEmail1"]} shortCode={this.state.shortCode}/>

        <Occupation names={["occupation1", "company1", "natureOfBusiness1", "yearsWithCompany1"]}/>
        

        <AddressContact keyToUse={1} country="businessCountry1" state="businessState1" city="businessCity1" title={"Business Address"} names={["businessAddress1", "businessZipCode1", "businessCountryCode1", "businessPhoneNumber1", "businessEmail1"]} shortCode={this.state.shortCode}/>
        


        {this.showButton()}

            
 
 
 
        <div><label class="title" style={{marginTop: '3%'}}>Select profile type</label>
            <div class="form-row justify-content-center features">
                
                
                <button id="free" class="col-sm-6 col-md-5 col-lg-4 item ProfileType" type="button" onMouseLeave={this.awayFree} onMouseOver={this.hoverFree} style={this.state.freeStyle} onClick={this.clickedFree}>
    
                    <span class="box" style={{paddingBottom: "50%"}}>
                        <h3 class="name">Free</h3>
                        <span class="box">
                            <span><label>- Feature 1</label></span>
                            <span><label>- Feature 2</label></span>
                            <span><label>- Feature 3</label></span>
                        </span>
                    </span>
                </button>


                <button id="premium" class="col-sm-6 col-md-5 col-lg-4 item ProfileType" type="button" onMouseLeave={this.awayPremium} onMouseOver={this.hoverPremium} style={this.state.premiumStyle} onClick={this.clickedPremium}>
                    
                    <span class="box" style={{paddingBottom: "10%"}}>
                        <h3 class="name">Premium</h3>
                        <span><label>- Feature 1</label></span>
                        <span><label>- Feature 2</label></span>
                        <span><label>- Feature 3</label></span>
                        <span><label>- Feature 4</label></span>
                        <span><label>- Feature 5</label></span>
                        <span><label>- Feature 6</label></span>
                    </span>
                </button>


            </div>

            
            <input type='hidden' name='profileType' value={this.state.profileType} />


            
        </div>
        {//showing an error message when the user does not fill out all of the information required.
                
            this.state.failed && <div class="form-group" style={{textAlign: "center", marginTop: "5%"}}><lable style={{color: "red", fontWeight: "bold"}}>Please make sure that you fill everything in this page before clicking on the Register button.</lable></div>
                
        }
        <div class="form-group" style={{marginTop: '8%'}}>
            <button class="btn btn-primary nurseryApplicationButtons" type="button" style={{backgroundColor: 'rgb(157,0,0)',margin: 0,width: '40%',marginRight: '2.5%',marginLeft: '7.5%'}}>Cancel</button>
            <button class="btn btn-primary" type="submit" style={{margin: 0,width: '40%',marginLeft: '2.5%',backgroundColor: 'rgb(1,106,1)',marginRight: '7.5%'}}>Register</button></div>
        </form>
    </div>
    </div>








        )
    }



}

export default ParentRegistration