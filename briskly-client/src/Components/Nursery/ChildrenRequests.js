import React, {Component} from "react"
import AuthenticationSevice from "../../AuthenticationService"
import "./ChildRequests.css"

class ChildrenRequests extends Component{
    /*
     * 
     * This component is used to SHOW the children requests to enrol in a nursery
     * It will connect with the database and get all the requests and return them to the frontend
     * 
     */

    constructor(props){
        //setting up the data that we will use in the state to display
        //the children admission requests.
        super(props)
        this.state = {
            data: []
        }

    }

    async componentWillMount(){
        //in case of the children that was pressed "meeting" on
        //we delete the session data for that
        sessionStorage.removeItem("meeting-id")
        sessionStorage.removeItem("meeting-name")

        //formData which will be sent to the backend
        var formData = {}
        //the authentication token
        const token = AuthenticationSevice.getToken()
        //appending the authentication token to the formData dictionary
        //for backend authentication
        formData["token"] = token["user"]
        
        //sending the data to the backend
        const result = await fetch("http://localhost:9000/getAllApplicants",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData)

        })
        // //converting the response to JSON format
        const data = await result.json()
        
        //if we received a message with "success" then we have all the children of the logged in parent
        if(data["message"] == "success"){
            // NOW WE START PROCESSING THE DATA
            
            const datatToUse = data["data"]
            //index 2 => siblings (0=no, 1=yes)
            //index 3 => special needs (0=no, 1=yes)
            for(var i = 0; i < datatToUse.length; i++){
               this.state.data.push(datatToUse[i])
            }
            //update the component
            this.forceUpdate()

        }



    }

    //the event below processes the action based on the 
    //button that was clicked.
    processAction = (e) =>{

        var formData = {}
        //getting the child id
        formData["childId"] = e.target.getAttribute("tag")
        //getting the type of button pressed:
        const btn = e.target.id
        //the authentication token
        const token = AuthenticationSevice.getToken()
        //appending the authentication token to the formData dictionary
        //for backend authentication
        formData["token"] = token["user"]

        //getting to know which button was pressed
        if(btn == "decline"){
            //if the decline button was pressed
            //then we use the /declineChild
            this.acceptOrDecline(formData, "declineChild")
        }else if(btn == "accept"){
            //if the accept button was pressed then we
            //use the /acceptChild path
            this.acceptOrDecline(formData, "acceptChild")
        }else if(btn == "meeting"){
            //if the meeting button is pressed then
            //we send the user to the /set-meeting page
            //of the website to set-up a meeting
            //we also send the id and the name
            //of the child as well to that page
            this.props.history.push({
                pathname:"/set-meeting",
                results: {
                    id: e.target.getAttribute("tag"),
                    name: e.target.getAttribute("name")
                }
            })
        }

    }

    //this method is called to send the POST request to the backend
    async acceptOrDecline(formData, url){
        
        //first we send the data to the backend by using the path
        //provided inside the event method above
        
        const response = await fetch("http://localhost:9000/"+url,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData)

        })
        //now we change the result into JSON format
        const res = await response.json()

        //if we get a success message then we take
        //the user to the /view-requests path of the website
        //to be able to view all the requests
        //which is basically REFRESHING the page
        //to display the new data
        if(res["message"] == "success"){
            window.location.href = "/view-requests"
        }

    }


    render(){
        return(


            <div>
                    {
                        //If there are requestst returned then we show this message at the top of the page
                        this.state.data.length > 0 && <div id="nTitleDiv"><label id="nTitle">Children Applications</label></div>
                    }

                    {
                        //If there are NO children requests returned then the message below is shown on the screen
                        this.state.data.length == 0 && <div id="nTitleDiv"><label id="nTitle">No Results Found!</label></div>
                    }
                
                  <div id="resultTitleDiv" >

                {/* BELOW are the titles of the grid that will be shown */}

                  {this.state.data.length > 0 && <div class="requestResults">Child name</div>}
                  {this.state.data.length > 0 && <div class="requestResults">Has Siblings</div>}
                  {this.state.data.length > 0 && <div class="requestResults">Special Needs</div>}
                  {this.state.data.length > 0 && <div class="requestResults">Meeting Scheduled</div>}
         
                  </div>
                     

                {
                    //looping through all the children's requests to enrol in the nursery
                    Object.keys(this.state.data).map((key, index) =>(
                       
                        <div class="resultsDiv" >
                            
                            <div tag={this.state.data[key][0]+"-"+this.state.data[key][1]} class="requestsItem">
                                {this.state.data[key][1]}
                            </div>
                            <div class="requestsItem">
                                {this.state.data[key][2]}
                            </div>
                            <div class="requestsItem">
                                {this.state.data[key][3]}
                            </div>
                            <div class="requestsItem">
                                {this.state.data[key][4]}
                            </div>

                            <button tag={this.state.data[key][0]} onClick={this.processAction} type="button" id="decline">Decline</button>
                            <button tag={this.state.data[key][0]} name={this.state.data[key][1]} onClick={this.processAction} type="button" id="meeting">Meet?</button>
                            <button tag={this.state.data[key][0]} onClick={this.processAction} type="button" id="accept">Accept</button>
                            

                             
                        </div>                        

                    ))
                }


            </div>

        )
    }




}

export default ChildrenRequests