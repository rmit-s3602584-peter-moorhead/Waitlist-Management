import React, {Component} from 'react'
import AuthenticationService from "../../AuthenticationService"

class AddChildDetails extends Component{

    /*

    This component is used as a form for the PARENTS WHO ARE LOGGED IN **ONLY**
    so that they can add their children to their accounts.


    */



    constructor(props){
        super(props)

        //storing some useful variables in the state of the component.
        this.state = {
            // +1 => save and add another child btn pressed
            // +2 => add child btn pressed
            buttonClicked: -1,
            failed: false


        }
    }


    saveAndAddBtn = (e) => {
        //if 'Save and add another child' button is clicked
        //change this buttonClicked to 1
        this.state.buttonClicked = 1
    }

    addBtn = (e) => {
        //if 'Add Child' button is clicked
        //change this buttonClicked to 2
        this.state.buttonClicked = 2
    }
    submit = (e) =>{

        //removing the error message in case of submitting again.
        this.state.failed = false
        this.forceUpdate()

        //preventing the default behavior of the form submission
        //because we want to do custom processing here first before
        //sending the data to the backend
        e.preventDefault();
        
        //storing the event target as a variable for easy access
        let target = e.target;
        //the dictionary that will be sent to the backend
        let formData = {};

        //getting all the form data added in the page when the buttons were clicked
        for(var i = 0; i < target.length-1; i++){

            if(target.elements[i].getAttribute("name") != null){
                
                if(target.elements[i].type == "radio"){
                    if(target[i].checked == true){
                        formData[target.elements[i].getAttribute("name")] = target[i].value;
                    }
                }else{
                    formData[target.elements[i].getAttribute("name")] = target[i].value;
                }    
            }
            
        }

        //Adding the user id for use in the backend
        formData["user_id"] = AuthenticationService.getUserId()

        //checking the form data for user input validation before adding
        //a child to the system
        var check = this.validate(formData)
        
        //just to ensure no one else sends the data (NO ONE WHO IS NOT LOGGED IN)
        //Also, making sure that the data that the user provided is correct and not
        //missing anything
        if(AuthenticationService.isUserLoggedIn() == true && check == true){
            //if the user is logged in then send the data
            this.sendData(formData)
        }else{
            //otherwise, we show an error message
            this.state.failed = true
            this.forceUpdate()
        }
        
    }

    validate(formData){
        var allGood = true


        //checking for the radio buttons.
        if(formData["level"] == undefined || formData["behaviors"] == undefined ||
            formData["program"] == undefined || formData["specialNeedsHandling"] == undefined){
                allGood = false
            }


        //checking for empty fields
        for(var key in formData){
            if(formData[key] == "" && key != "specialNeedsHandlingDescription" && key != "behaviorsDetails"){
                allGood = false
                break
            }
        }

        //now we check the <textarea> input fields that are related to the radio buttons
        if(formData["behaviors"] != undefined && formData["behaviors"] == 1 && formData["behaviorsDetails"] == ""){
            allGood = false
        }

        if(formData["specialNeedsHandling"] != undefined && formData["specialNeedsHandling"] == 1 && formData["specialNeedsHandlingDescription"] == ""){
            allGood = false
        }


        return allGood
        
    }

    async sendData(formData){

        //for authentication, we get the session token and add it to the
        //formData for authentication in the backend
        const token = AuthenticationService.getToken()
        //adding the token to the formData dictionary which will be sent to the backend
        formData["token"] = token["user"]
        //sending the data to the backend
        const data = await fetch("http://localhost:9000/addChildtoParent",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData)
            
        })
        //converting the response to JSON
        const response = await data.json()

        //If the response message is success then we redirect the user
        //to the appropriat pages
        if(response["message"] == "success"){

            //redirect the user based on the button that was pressed.
            if(this.state.buttonClicked == 2){
                //to Home page if the user clicked "Add Child" button
                window.location.href = "/"
            } else if(this.state.buttonClicked == 1){
                //to the same page to add another child if the user
                //clicked "Save and add another child"
                window.location.href = "/add-child"
            }
        }else{
            //do nothing...
        }

    }

    cancel = (e) => {
        //send to the home page.
        window.location.href = "/"
    }

    render(){
        return(

            <div class="register-photo">
            <div class="form-container">
                
                
                <form method="post" id="addChild" onSubmit={this.submit}>
                
                
                    <h2 class="text-center">Add Child</h2><label style={{fontSize: '3vw',fontWeight: 'bold'}}>Personal Information</label>
                    <div class="form-group">
                        <div style={{display: 'flex',flexDirection: 'row'}}>
                            <div style={{width: '19%',alignSelf: 'center'}}><label style={{margin: '0px'}}>First Name:</label></div>
                            <div style={{width: '70%'}}><input name="fName" class="form-control" type="text" placeholder="First Name" style={{width: '70%',padding: '0px',marginLeft: '1%'}}/></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div style={{display: 'flex',flexDirection: 'row'}}>
                            <div style={{width: '19%',alignSelf: 'center'}}><label style={{margin: '0px'}}>Last Name:</label></div>
                            <div style={{width: '70%'}}><input name="sName" class="form-control" type="text" placeholder="Last Name" style={{width: '70%',padding: '0px',marginLeft: '1%'}}/></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div style={{display: 'flex',flexDirection: 'row'}}>
                            <div style={{width: '19%',aligSelf: 'center'}}><label style={{marginTop: "5%"}}>Preferred Name:</label></div>
                            <div style={{width: '70%'}}><input name="preferedName" class="form-control" type="text" placeholder="Preferred Name" style={{width: '70%',padding: '0px',marginLeft: '1%'}}/></div>
                        </div>
                    </div>



                    <div style={{display: 'flex', flexDirection: "row", marginBottom: "2%"}}>
                        <div style={{width: '19.5%'}}>
                            <label style={{marginTop: "5%"}}>Gender:</label>
                        </div>
                        <select style={{width: "25%"}} class="form-control" id="gender" name="gender">
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>

                        </select>

                        </div>





            <div class="form-group">
                <div style={{display: 'flex',flexDirection: 'row'}}>
                    <div style={{width: "19.5%"}}><label style={{marginTop: '5%'}}>Date of birth:</label></div>
                    <div><input name="birthday1" class="form-control" type="date"/></div>
                </div>
            </div>
            
            
            <div style={{display: 'flex', flexDirection: "row", marginBottom: "2%"}}>
                        <div style={{width: '19.5%'}}>
                            <label style={{marginTop: "5%"}}>Language:</label>
                        </div>
                        <select style={{width: "25%"}} class="form-control" id="language" name="language">
                            <option value="">Select Language</option>
                            <option value="English">English</option>
                            <option value="Cantonese">Cantonese</option>
                            <option value="French">French</option>
                            <option value="Mandarin">Mandarin</option>
                            <option value="Punjabi">Punjabi</option>
                            <option value="Spanish">Spanish</option>

                        </select>

                        </div>


            <label style={{fontSize: '3vw',fontWeight: 'bold'}}>Applying for</label>
            <div class="form-group"><label style={{fontSize: '2.5vw'}}>Level:</label>
                <div class="form-check"><input class="form-check-input" name="level" value="Infant Toddler Age 0-3 Years" type="radio" id="formCheck-21"/><label class="form-check-label" for="formCheck-21">Infant Toddler Age 0-3 Years</label></div>
                <div class="form-check"><input class="form-check-input" name="level" value="Full Day Care Age 3-School Age(5)" type="radio" id="formCheck-23"/><label class="form-check-label" for="formCheck-23">Full Day Care Age 3-School Age(5)</label></div>
                <div class="form-check"><input class="form-check-input" name="level" value="Before After School Care Age 5-11" type="radio" id="formCheck-22"/><label class="form-check-label" for="formCheck-22">Before After School Care Age 5-11</label></div>
                <div class="form-check"><input class="form-check-input" name="level" value="JR.Kindergarten Age 3-School Age(5)" type="radio" id="formCheck-1"/><label class="form-check-label" for="formCheck-1">JR.Kindergarten Age 3-School Age(5)</label></div>
            </div>






            <div class="form-group"><label style={{fontSize: '2.5vw'}}>Program:</label>
                <div class="form-check"><input class="form-check-input" name="program" value="Full Time Mon-Fri" type="radio" id="formCheck-2"/><label class="form-check-label" for="formCheck-2">Full Time Mon-Fri</label></div>
                <div class="form-check"><input class="form-check-input" name="program" value="Part Time - Mon/Wed/Fri" type="radio" id="formCheck-3"/><label class="form-check-label" for="formCheck-3">Part Time - Mon/Wed/Fri</label></div>
                <div class="form-check"><input class="form-check-input" name="program" value="Part Time - Tues/Thurs" type="radio" id="formCheck-4"/><label class="form-check-label" for="formCheck-4">Part Time - Tues/Thurs</label></div>
            </div>

            <div class="form-group">
                <div style={{display: 'flex',flexDirection: 'row'}}>
                    <div style={{width: "19.5%"}}><label style={{marginTop: '5%'}}>Desired Start Date:</label></div>
                    <div><input class="form-control" name="startDate" type="date"/></div>
                </div>
            </div>


            <div><label style={{fontSize: '3vw',fontWeight: 'bold'}}>Additional Information</label></div>
            
            <div class="form-group"><label>Extra curricular activities / Interests</label>
                <textarea class="form-control" name="hobbies" form="addChild" rows="5" cols="20" style={{height: '100%'}} placeholder="e.g. He likes playing football and reading books"></textarea>
                </div>


            <div class="form-group"><label>Has your child had any development concerns?</label><label style={{fontSize: '12px',marginLeft: '0.5%'}}>i.e. Vision, hearing, speach</label>
                <div class="form-check"><input class="form-check-input" name="specialNeedsHandling" value="1" type="radio" id="formCheck-5"/><label class="form-check-label" for="formCheck-5">Yes</label></div>
                <div class="form-check"><input class="form-check-input" name="specialNeedsHandling" value="0" type="radio" id="formCheck-6"/><label class="form-check-label" for="formCheck-6">No</label></div>
                    <textarea class="form-control" name="specialNeedsHandlingDescription" form="addChild" rows="5" cols="20" style={{height: '30%'}} placeholder="If yes please describe"></textarea></div>
            <div
                class="form-group"><label>Have you noticed in your child any behaviours that may be concern in a classroom setting?</label><label style={{fontSize: '12px',marginLeft: '0.5%'}}>i.e. Aggression</label>
                <div class="form-check"><input class="form-check-input" name="behaviors" value="1" type="radio" id="formCheck-7"/><label class="form-check-label" for="formCheck-7">Yes</label></div>
                <div class="form-check"><input class="form-check-input" name="behaviors" value="0" type="radio" id="formCheck-8"/><label class="form-check-label" for="formCheck-8">No</label></div>
                    <textarea class="form-control" name="behaviorsDetails" form="addChild" rows="5" cols="20" style={{height: '30%'}} placeholder="If yes please describe"></textarea></div>
        <div style={{marginTop: '5%'}}>

                {
                    //showing the error message
                    this.state.failed && <div style={{textAlign: "center"}}><label style={{color: "red", fontWeight: "bold"}}>Please make sure you enter all the details before clicking on any of the add buttons</label></div>

                }

                <button class="btn btn-primary" onClick={this.cancel} type="button" style={{marginLeft: "10%",width: '20%',marginRight: '10%',backgroundColor: 'rgb(157,0,0)',fontSize: '1.1vw'}}>Cancel</button>
                <button class="btn btn-primary nurseryApplicationButtons" id="saveAndAdd"  onClick={this.saveAndAddBtn} type="submit" style={{backgroundColor: 'rgb(1,106,1)',width: '20%',marginRight: '10%',fontSize: '1.1vw'}}>Save and add another child</button>
                <button class="btn btn-primary" id="add" type="submit" onClick={this.addBtn} style={{width: '20%',marginRight: '10%',backgroundColor: 'rgb(1,106,1)',fontSize: '1.1vw'}}>Add Child</button>
                
            
            </div>
                </form>
                </div>
                </div>
        



        )
    }


}

export default AddChildDetails