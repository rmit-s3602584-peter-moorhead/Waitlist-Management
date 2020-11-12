import React, {Component} from "react"
import Axios from "axios"
import AuthenticationService from "../../AuthenticationService"
import CountryStateCity from "../CountryStateCity"

class NurseryNotification extends Component{

    /**
     * 
     * This component allows the nursery to send a notification
     * to ALL the PARENTS in the system or ALL the parents in a
     * specified location (Country, Country AND State or Country AND State AND City)
     * 
     */

     //The constructor initializes the component's state variable
    constructor(props){
        super(props)

        //setting the state of the component
        this.state = {
            message: false,
            failed: false
        }

    }


    submit = (e) => {
        //preventing the default behavior of the form submission
        //because we want to do custom processing here first before
        //sending the data to the backend
        e.preventDefault()
        
        //no message sent
        this.state.message = false

        //storing the event target for easy accessablitiy
        let target = e.target;
        //the dictionary that will be sent to the backend
        let formData = {};
        
        //setting up the data that will be sent to the backend
        for(var i = 0; i < target.length-1; i++){

            //append the value and the key is the name
            //of the html attribute
            formData[target.elements[i].getAttribute("name")] = target[i].value;
                
        }

        //filtering the data
        if(formData["country"] == "Select Country"){
            formData["country"] = undefined
        }
        if(formData["state"] == "Select State/Province"){
            formData["state"] = undefined
        }
        if(formData["city"] == "Select City"){
            formData["city"] = undefined
        }
        
        
        //Sending the authentication token along with the formData
        //in order to know that the user is logged in and of the correct type
        const token = AuthenticationService.getToken()
        formData["token"] = token["user"]

        //validating that the email title and message properties are not EMPTY
        var check = this.validate(formData)

        if(check == true){
            //resetting the variable to remove the error message
            this.state.failed = false
            this.state.message = false
            this.forceUpdate()
            // A post request to the backend to get the emails that needs the data
            Axios.post("http://localhost:9000/sendNurseryNotification", {...formData})
            .then(res =>{
                
                //if we do get a response
                if(res.status == 200){
                    //successful
                    
                    //set the emails
                    const emails = res.data.emails
                    const userEmail = res.data.userEmail
                    const name = res.data.name

                    //send emails from the sendEmails function
                   this.sendEmails(emails, userEmail, name, formData["message"], formData["emailTitle"])
                


                }
            })
        }else{
            this.state.failed = true
            this.forceUpdate()
        }

    }
    //checking if the message and email title fields are empty or not
    validate(formData){
        var allGood = true

        if(formData["emailTitle"] == "" || formData["message"] == ""){
            allGood = false
        }

        return allGood
    }

    async sendEmails(emails, userEmail, name, message, title, e){
        
        /**
         * PLEASE NOTE:::::::::
         * The email service works but it requires payment by the client
         * Once the payment/subscription is done then no code change required
         * it will automatically send the email with the nursery's email address
         * that they registered with. At the moment it will only send emails by using
         * BrisklyTest@gmail.com email (details of this email is inside SendNotification.js)
         * inside of the Admin folder.
         * 
         */

        //set the email data required by EmailJS
        var email = {
            "service_id": "BrisklyTest",
            "template_id": "template_0z9aw8l",
            "user_id": "user_RF5lWpuSW8KW4qUyQi9XA",
            "template_params": {
                "message": message,
                "emailTo":emails[0],//add your email here is you want to see that it works!
                "title":title,
                "nurseryEmail": userEmail,
                "nurseryName": name
        
            }
        }
        
        //loop through all the email addresses and send the data
        for(var i = 0; i < emails.length; i++){
            
            if( i > 0){
                //updaing the email to send the message to.
                email["template_params"]["emailTo"] = emails[i]
            }
            
            await fetch("https://api.emailjs.com/api/v1.0/email/send",{
                method: 'POST',
                body: JSON.stringify(email),
                headers: {
                    "Content-Type": "application/json"
                  }
            })
            
            // finished sending the data
            //now show the message that the email have been sent
            //and update the component.
            this.state.message = true
            this.state.failed = false
            this.forceUpdate()
            
        }

    }

    render(){
            var sent
            if(this.state.message != false){
                sent = <div id="notificationSentDiv"><label id="notificationSent">Notification Sent</label></div>
            }

        return(

            <div>
                
                <div id="nTitleDiv"><label id="nTitle">Send notification</label></div>
                {sent}
                {
                    this.state.failed && <div style={{textAlign: "center"}}> <label style={{color: "red", fontWeight: "bold"}}>Please make sure that you type in the Email Title field and the Message To Send field.</label> </div>
                }
                
                <form id="notification"  onSubmit={this.submit}>
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div><label class="notificationTitle">Send notification to all parents in:</label></div>
                        <div>                        
                            <CountryStateCity keyToUse={0} country="country" state="state" city="city"/>

                        </div>
                    </div>
                </div>
                
                <div class="row">
                <div class="col-md-12">
                <div style={{display: "flex", flexDirection:"row", marginBottom:'2%', marginTop:'2%'}}>
                    <div style={{width: '20%'}}><label style={{marginTop:'5%'}} class="notificationTitle">Email title:</label></div>
                    <div style={{width: '27.5%'}}><input class="form-control" type="text" name="emailTitle" placeholder="Email title"></input></div>
                    </div>
                </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <div><label class="notificationTitle">Message To Send:</label></div>
                        <div><textarea class="form-control" name="message" form="notification" rows="10" cols="50"></textarea></div>
                    </div>
                </div>


                <div class="row">
                    <div class="col-md-12">
                        <div id="attachment">
                            <div id="attachmentLabelDiv"><label class="notificationTitle">Add Any Attachment:</label></div>
                            <div class="distance"><input type="file" name="file"/></div>
                        </div>
                    </div>
                </div>
            </div>
        <input type="hidden" value="hi" name="emailTo"></input>
        <div id="sendDiv">
            <button id="sendBtn" type="submit">Send</button>
        </div>

        </form>
        </div>

    

        )
    }


}

export default NurseryNotification