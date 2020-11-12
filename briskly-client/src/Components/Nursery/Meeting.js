import React, {Component} from "react"
import "./ChildRequests.css"
import AuthenticationService from "../../AuthenticationService.js"

class Meeting extends Component{

    /**
     *
     * This component is responsible for allowing the
     * nurseries to schedule a meeting with the parents
     * and AS SOON AS the meeting is scheduled a confirmation
     * email will be sent to the parents about that
     *
     */


    //used to set-up the state data that will be used
    constructor(props){
        super(props)
        //the component's state data
        this.state = {
            id: "",
            name: "",
            failed: false
        }
    }

    componentWillMount(){
        //We use the session storage so that when the page is refreshed the data is not lost
        if(sessionStorage.getItem("meeting-id") != undefined && sessionStorage.getItem("meeting-id") != null){
            this.state.id = sessionStorage.getItem("meeting-id")
            this.state.name = sessionStorage.getItem("meeting-name")
        }else{
            sessionStorage.setItem("meeting-id", this.props.location.results.id)
            sessionStorage.setItem("meeting-name", this.props.location.results.name)

            this.state.id = this.props.location.results.id
            this.state.name = this.props.location.results.name
        }
        //update the component on the screen
        this.forceUpdate()
    }

    componentWillUnmount(){
        sessionStorage.removeItem("meeting-id")
        sessionStorage.removeItem("meeting-name")
    }
    
    submit = (e) => {
        e.preventDefault()

        //processing the data

        //getting the nursery token
        const token = AuthenticationService.getToken()
        //setting the dictionary that will be sent to the backend
        var formData = {}
        formData["token"] = token["user"]
        formData["childId"] = this.state.id
        //Storing the event target for easy access
        let target = e.target;
        //now we get the new dates from the input
        for(var i = 0; i < target.length-1; i++){
            if(target.elements[i].getAttribute("name") != null){
                formData[target.elements[i].getAttribute("name")] = target[i].value;
            }
        }

        //validate that everything is selected (Date and Time)
        var check = this.validate(formData)
        
        //if both date and time are selected
        if(check == true){
            //scheduling the meeting.
            this.scheduleMeeting(formData)
        }else{
            //show an error message when they are not selected
            this.state.failed = true
            this.forceUpdate()
        }

        console.log(formData)

    }
    validate(formData){
        var allGood = true

        for(var key in formData){
            if(formData[key] == ""){
                allGood = false
                break
            }
        }


        return allGood
    }
    async scheduleMeeting(formData){
        
        //sending the data to schedule a meeting
        const response = await fetch("http://localhost:9000/scheduleMeeting",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData)
        })
        //getting the response data as a JSON
        const data = await response.json()

        //setting up the email that will be sent to the parent
        //for the confirmation
        const email = data["email"]
        const name = data["name"]
        const message = "A meeting has been scheduled with " + name + " on this date and time: "+
        data["date"];

        //send notification to the parent.
        //by email.

        //send the email
        await this.sendEmails(data["nurseryEmail"], email, name, message, "Appointment Scheduled")


        //send the user back to the requests page after doing the update.
        window.location.href = "/view-requests"
    }


    async sendEmails(from, to, name, message, title){
        
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
                "emailTo": to, //change this to your email to see that it works! (otherwise keep it as 'to')
                "title":title,
                "nurseryEmail": from,
                "nurseryName": name
        
            }
        }
        //sending the email
        await fetch("https://api.emailjs.com/api/v1.0/email/send",{
            method: 'POST',
            body: JSON.stringify(email),
            headers: {
                "Content-Type": "application/json"
                }
        })

    }

    cancel = (e) => {
        //sending the nursery back to the View Requests page
        window.location.href = "/view-requests"
    }

    render(){
        return(

            <div id="meet">
                <form method="POST" id="meetingForm" onSubmit={this.submit}>

                <h1 id="meetingTitle">Scheduling a meeting with {this.state.name}</h1>
                
                {//when the date and time are not selected and the Schedule button is presses
                  this.state.failed && <div style={{textAlign: "center"}}><h3 id="meetingTitle" style={{color: "red"}}>Please make sure you select a date and time {this.state.name}</h3></div>
                }
                
                <div class="meetingDivs">
                    <div class="divsInside">
                        <label class="meetingLabels">Select a date:</label>
                        <div><input name="date" type="date" /></div>
                    </div>
                    <div class="divsInside">
                        <label class="meetingLabels">Select Meeting time:</label>
                        <div><input name="time" type="time" /></div>
                    </div>


                </div>
                <div id="btnMeetingDiv">
                    <button id="cancel" onClick={this.cancel} type="button">Cancel</button>
                    <button id="scheduleMeeting" type="submit">Schedule</button>
                    </div>
                    
                </form>


            </div>


        )
    }

}

export default Meeting