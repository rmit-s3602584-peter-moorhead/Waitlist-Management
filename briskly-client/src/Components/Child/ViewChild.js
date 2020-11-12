import React, {Component} from "react"
import AuthenticationSevice from "../../AuthenticationService"
import "./ViewChild.css"

class ViewChild extends Component{


    /*
     * 
     * This component is used to SHOW the children that the parent added in the path /my-children
     * It will connect with the database and get all the children and their nursery status
     * 
     */


    constructor(props){
        super(props)
        //storing some values in the state of the component
        this.state = {
            data: []
        }
    }

    async componentWillMount(){
        //formData which will be sent to the backend
        var formData = {}
        //the authentication token
        const token = AuthenticationSevice.getToken()
        //appending the authentication token to the formData dictionary
        //for backend authentication
        formData["token"] = token["user"]

        //sending the data to the backend
        const result = await fetch("http://localhost:9000/getChildren",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData)

        })
        //converting the response to JSON format
        const data = await result.json()
        
        //if we received a message with "success" then we have all the children of the logged in parent
        if(data["message"] == "success"){
            // NOW ADD THE DATA TO THE STATE data ARRAY
            this.state.data = data["data"]
            //update the component
            this.forceUpdate()

        }

    }


    render(){
        return(


            <div>
                    {
                        //If there are children returned then we show this message at the top of the page
                        this.state.data.length > 0 && <div id="nTitleDiv"><label id="nTitle">My Children Status</label></div>
                    }

                    {
                        //If there are NO children returned then the message below is shown with a link
                        //to add children to the parent's account
                        this.state.data.length == 0 && <div id="nTitleDiv"><label id="nTitle">You don't have any child added to your account.
                                                                            <a href="/add-child">Click here to add a child!</a>
                                                                        </label></div>
                    }
                
                  <div id="resultTitleDiv" >

                {/* BELOW are the titles of the grid that will be shown */}

                  {this.state.data.length > 0 && <div class="childrenResult">Child name</div>}
                  {this.state.data.length > 0 && <div class="childrenResult">In Nursery</div>}
                  {this.state.data.length > 0 && <div class="childrenResult">Status</div>}
                  
                    
                  </div>
                     
                    


                    


                {
                    //looping through all the children's data to be shown and displating it
                    
                    Object.keys(this.state.data).map((key, index) =>(
                        
                        // <a href=""  key={this.state.data[key]["nurseryNumber"]} onClick={this.clicked} class="resultLink" name="link">
                        <div class="resultsDiv" >
                            
                            <div class="childrenItem">
                                {this.state.data[key][1]}
                            </div>
                            <div class="childrenItem">
                                {this.state.data[key][2]}
                            </div>
                            <div class="childrenItem">
                                {this.state.data[key][3]}
                            </div>

                            
                        </div>
                        // </a>
                        
                        

                    ))
                }


            </div>

        )
    }



}
export default ViewChild