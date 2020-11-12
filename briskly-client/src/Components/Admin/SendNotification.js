import React, {Component} from 'react'
import "./SendNotification.css"
import CountryStateCity from "../CountryStateCity.js"
import Axios from 'axios'
import AuthenticationService from "../../AuthenticationService"

/**
 * 
 * This component is used to display the form that the Admin will use to
 * send emails to the users (Parent or/and Nurseries) based on:
 *  1) specific country
 *  2) specific country and state
 *  3) specific country and state and city
 *  4) ALL THE USERS if nothing is selected
 * 
 * Email service used: EmailJS
 *
 * login details for EmailJS and G-mail:
 *    email: BrisklyTest@gmail.com
 *    password: Briskly123
 * 
 */




class SendNotification extends Component{

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
        //sending the data 'to'
        formData['to'] = []
        
        //setting up the data that will be sent to the backend
        for(var i = 0; i < target.length-1; i++){
            //if it is a checkbox
            if(target.elements[i].type == "checkbox"){
                
                //if the checkbox is clicked
                if(target[i].checked == true){
                    //get the elements name and added it to the 'to' key
                    //the 'to' key is an array so we will just append to that array
                    var element = target.elements[i].getAttribute("name")
                    if(element.substring(0, element.indexOf('-')) == "to"){
                        var to = formData['to']
                        to.push(target[i].value)
                        formData['to'] = to
                    }
                }
            }else{
                //if it is not a checkbox then just append the value and the key is the name
                //of the html attribute
                formData[target.elements[i].getAttribute("name")] = target[i].value;
                
            }
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

        //checking to see if there are user types selected (Parent, Nurseries)
        //also checking to see if the email title and/or the message input fields
        //are empty or not.
        var check = this.validate(formData)
        
        if(check == true){
            //resetting the variable to remove the error message when sending the request
            //again, in case the error message was shown before.

            this.state.failed = false
            this.state.message = false
            this.forceUpdate()

            //A post request to the backend to get the emails that needs the data
            Axios.post("http://localhost:9000/sendNotification", {...formData})
            .then(res =>{
                
                //if we do get a response
                if(res.status == 200){
                    //successful
                    
                    //set the emails
                    const emails = res.data.emails

                    //send emails from the sendEmails function
                   this.sendEmails(emails, formData["message"], formData["emailTitle"])
                
                }
            })
        }else{
            //showing the error message
            this.state.failed = true
            this.forceUpdate()
        }

    }

    validate(formData){
        var allGood = true

        //checking the 'to' array to see if there are types selected.

        if(formData["to"].length == 0){
            allGood = false
        }

        //checking to see if the email title and message are empty or not
        if(formData["message"] == "" || formData["emailTitle"] == ""){
            allGood = false
        }

        return allGood
    }

    async sendEmails(emails, message, title){
        
        //set the email data required by EmailJS
        var email = {
            "service_id": "BrisklyTest",
            "template_id": "template_gep92ne",
            "user_id": "user_RF5lWpuSW8KW4qUyQi9XA",
            "template_params": {
                "message": message,
                "emailTo":"", //change this to your email to test OR leave it empty => ""
                "emailTitle":title
        
            }
        }
        
        //loop through all the email addresses and send the data
        for(var i = 0; i < emails.length; i++){

            //updating the NEXT email to send the message to.
            email["template_params"]["emailTo"] = emails[i]

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
                //the message that we will show once the emails have been sent.
                sent = <div id="notificationSentDiv"><label id="notificationSent">Notification Sent</label></div>
            }

        return(

            <div>
                
                <div id="nTitleDiv"><label id="nTitle">Send notification</label></div>
                {sent}
                {
                    this.state.failed && <div style={{textAlign: "center"}}><label style={{color: "red", fontWeight: "bold"}}>Please make sure that you select a user type and fill both the title and message fields.</label></div>
                }
                
                <form id="notification"  onSubmit={this.submit}>
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div><label class="notificationTitle">Send To:</label></div>
                        <div>
                            <div class="form-check"><input class="form-check-input" name="to-parent" value="parent" type="checkbox" id="formCheck-1"/><label class="form-check-label" for="formCheck-1">Parents</label></div>
                            
                            <div class="form-check"><input class="form-check-input" name="to-nursery" value="nursery" type="checkbox" id="formCheck-2"/><label class="form-check-label" for="formCheck-2">Nurseries</label></div>
                        
                            <CountryStateCity keyToUse={0} country="country" state="state" city="city"/>

                        </div>
                    </div>
                </div>
                
                <div class="row">
                <div class="col-md-12">
                <div style={{display: "flex", flexDirection:"row", marginBottom:'2%', marginTop:'2%'}}>
                    <div style={{width: '20%'}}><label style={{marginTop:'5%'}} class="notificationTitle">Email title:</label></div>
                    <div style={{width: '27.5%'}}><input id="emailTitle" class="form-control" type="text" name="emailTitle" placeholder="Email title"></input></div>
                    </div>
                </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <div><label class="notificationTitle">Message To Send:</label></div>
                        <div><textarea class="form-control" id="message" name="message" form="notification" rows="10" cols="50"></textarea></div>
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

export default SendNotification