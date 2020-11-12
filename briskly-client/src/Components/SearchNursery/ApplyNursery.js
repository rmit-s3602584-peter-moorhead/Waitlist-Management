import React, {Component} from 'react'
import AuthenticationService from "../../AuthenticationService"
import ChildrenSelection from "./ChildrenSelection"

class ApplyNursery extends Component{

    /**
     * 
     * This component is used for the parent to select the child that they wanna apply
     * to the nursery that they have selected to apply to.
     * 
     */


     //Used to setup the component's state variable
    constructor(props){
        super(props)

        this.state = {
            children: [],
            nurseryName: "",
            id: -1
        }

    }

    //when the user leaves the page we remove the session keys
    //because the user won't be needing to go back to that page
    //and there is no point of storing all of that there.
    componentWillUnmount(){
        sessionStorage.removeItem("nursery-name")
        sessionStorage.removeItem("nursery-id")
    }

    async componentWillMount(){
        //call the backend and get all the children associated with the current
        //parent logged in and their children status (if they are applied to another
        //nursery or not)
        
        

        //first we do the session values
        if(sessionStorage.getItem("nursery-name") != null && sessionStorage.getItem("nursery-name") != undefined){
            //if we do then we just set them to the state variable
            this.state.nurseryName = sessionStorage.getItem("nursery-name")
            this.state.id = sessionStorage.getItem("nursery-id")
        }else{
            // if we don't then we obviously just clicked on the apply button for this
            //nursery and did not click the refresh button in the browser.
            this.state.nurseryName = this.props.location.nurseryName
            this.state.id = this.props.location.nurseryId
            //setting the session with the appropriate keys
            sessionStorage.setItem("nursery-name", this.props.location.nurseryName)
            sessionStorage.setItem("nursery-id", this.props.location.nurseryId)
        }

        //get the token
        const token = AuthenticationService.getToken()
        var formData = {}
        formData["token"] = token["user"]
        //sending the formData to the backend which contains the session token
        //to authenticate the user
        const response = await fetch("http://localhost:9000/getChildrenToApply", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData)
        })

        //converting the response to JSON fromat
        const data = await response.json()
        
        //the data constant holds all the children that CAN be enrolled to this nursery.

        for(var i = 0; i < data.children.length; i++){
            //adding the children to the state array
            var toAdd = []
            var name = data.children[i]["FirstName"] + " " + data.children[i]["Surname"]
            var id = data.children[i]["childID"]
            toAdd.push([name, id])
            this.state.children.push(toAdd)
            
            //reset toAdd
            toAdd = []
        }

        //update the screen with the new information
        this.forceUpdate()


    }

    submit = (e) =>{
        e.preventDefault()

        //send the child id to the backend and update the information
        //after the parent clicks on Apply

        //we get all of the form data which is just a drop-down selection
        let target = e.target;
        var formData = {};
        //it is used in a loop just in case in the future something else is added
        //then you won't need any coding modifications
        for(var i = 0; i < target.length-1; i++){
            formData[target.elements[i].getAttribute("name")] = target[i].value;
        }
        //storing the session token in the formData dictoinary
        const token = AuthenticationService.getToken()
        formData["token"] = token["user"]
        formData["nursery"] = this.state.id

        //sending the data to the backend
        this.sendData(formData)

    }

    async sendData(formData){
        //sending the data to the backend
        const response = await fetch("http://localhost:9000/applyToNursery", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData)
        })
        //if we get an OK, that the child has been enrolled in that nursery
        //then we get the email of the parent and the email of the nursery
        if(response.ok){

            //now that the child has applied, we send an email to the parent

            //get emails:
            formData["name"] = this.state.nurseryName

            const emailsReponse = await fetch("http://localhost:9000/getParentAndNurseryEmails", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify(formData)
            })

            const emails = await emailsReponse.json()
            //storing all the emails and message to send
            const to = emails[0]
            const from = emails[1]
            const message = "Thank you for applying to " + this.state.nurseryName + " we will process your child's application "+
                            "and get back to you as soon as possible."
            //send an email
           
            //set the email requirements by EmailJS
            var email = {
                "service_id": "BrisklyTest",
                "template_id": "template_0z9aw8l",
                "user_id": "user_RF5lWpuSW8KW4qUyQi9XA",
                "template_params": {
                    "message": message,
                    "emailTo": to, //change this to your email to see that it works! (otherwise keep it as 'to')
                    "title": "Application Confirmation",
                    "nurseryEmail": from,
                    "nurseryName": this.state.nurseryName
            
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

            // redirect the user

            this.props.history.push({
                pathname: "/confirmation",
                nurseryName: this.state.nurseryName
            })

        }
    }

    render(){
        return(
            <div id="meet">
                <form method="POST" id="meetingForm" onSubmit={this.submit}>
                
                <h1 id="meetingTitle">Applying To {this.state.nurseryName}</h1>
                
                <div class="meetingDivs">
                    <div class="divsInside">
                        {
                            this.state.children.length > 0 && <label id="selectChild">Select a Child:</label>
                        }

                    {
                       this.state.children.length > 0 && <ChildrenSelection children={this.state.children} />
                    }
                    </div>
                </div>
                <div id="btnMeetingDiv">
                    <button id="apply" type="submit">Apply</button>
                    </div>
                </form>


            </div>


        )
    }


}

export default ApplyNursery