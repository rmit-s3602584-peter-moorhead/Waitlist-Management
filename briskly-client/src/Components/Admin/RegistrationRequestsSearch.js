import React, {Component} from 'react'
import "./RegistrationRequests.css"
import CountryStateCity from '../CountryStateCity.js'
import AuthenticationService from "../../AuthenticationService"


class RegistrationRequestsSearch extends Component{

    submit = e =>{
        e.preventDefault()
        
        //clear the session storage for new search results
        sessionStorage.removeItem("adminSearch")

        //setting up the data that will be sent to the backend to get the
        //correct nurseries
        let target = e.target;
        let formData = {};
        //getting all of the form inputs and storing them inside the formData.
        //the key = the GIVEN name of the HTML tag and the value is its value
        for(var i = 0; i < target.length-1; i++){
            formData[target.elements[i].getAttribute("name")] = target[i].value;
        }
        
        //Doing some validation here to ensure that all of the drop-down menus
        //are not invalid data. If they are then, they will be undefined.
        if(formData["country"] == "" || formData["country"] == "Select Country"){
            formData["country"] = undefined
        }
        if(formData["state"] == "" || formData["state"] == "Select State/Province"){
            formData["state"] = undefined
        }
        if(formData["city"] == "" || formData["city"] == "Select City"){
            formData["city"] = undefined
        }
        if(formData["status"] == "" || formData["status"] == "Select Status"){
            formData["status"] = undefined
        }
        if(formData["status"] == "" || formData["status"] == "Select Status"){
            formData["status"] = undefined
        }
        
        for(var x in formData){
            //ensuring that ALL the data is not empty string.
            //if they are then they will be equal to undefined
            if(formData[x] == ""){
                formData[x] = undefined
            }
        }

        //sending the data to the backend by passing the formData
        this.sendData(formData)

       
    }

    async sendData(formData){
        //getting the token and appending it to the formData to be sent
        //to the backend for user authentication
        const token = AuthenticationService.getToken()
        formData["token"] = token["user"]
        //sending the data to the backend to get the search results
        const result = await fetch("http://localhost:9000/getAdminNurseries",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData)

        })
        //converting the received data to a JSON formate
        const data = await result.json()

        
        //updationg the status text before sending them to the results page
        //based on the below status codes

        //0 => registred
        //1 => approved
        //2 => pending payment
        //3 => declined
        
        for(var i = 0; i < data.nurseries.length; i++){
            if(data.nurseries[i]["status"] == 0){
                data.nurseries[i]["status"] = "Registered"
            }else if(data.nurseries[i]["status"] == 1){
                data.nurseries[i]["status"] = "Approved"
            }else if(data.nurseries[i]["status"] == 2){
                data.nurseries[i]["status"] = "Pending Payment"
            }else if(data.nurseries[i]["status"] == 3){
                data.nurseries[i]["status"] = "Declined"
            }
        }

        //sending the user to the results page and passing with it the results of the search.
        this.props.history.push({
            pathname:"/ansr",
            results: data.nurseries
        })
        

    }

    render(){
        return(

            <div>
                <div id="nTitleDiv"><label id="nTitle">Search Nursery Requests</label></div>
                <form id="notification" method="post" onSubmit={this.submit}>
            
            
            <div class="container" style={{marginTop: '2%'}}>
                
                
                <div class="row">
                    <div class="col-md-12">
                        <div class="flexDivs">
                        <div class="flexLabelDivs"><label >Name:</label></div>
                        <div class="inputDiv"><input placeholder="Nursery name" class="textInput" type="text" name="name"/></div>
                        
                        </div> 
                    </div> 
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <div class="flexDivs">
                        <div class="flexLabelDivs"><label>CRN:</label></div>
                        <div class="inputDiv"><input placeholder="Commercial Registration Number" class="textInput" type="text" name="CRN"/></div>
                        
                        </div> 
                    </div> 
                </div>


                <CountryStateCity keyToUse={0} country="country" state="state" city="city"/>

                <div class="row">
                    <div class="col-md-12">
                        <div class="flexDivs">
                        <div class="flexLabelDivs"><label>From date:</label></div>
                        <div class="inputDiv">
                            
                            <input class="textInput" type="date" name="from"/>
                            
                            </div>
                        
                        </div> 
                    </div> 
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <div class="flexDivs">
                        <div class="flexLabelDivs"><label>To Date:</label></div>
                        <div class="inputDiv">
                            
                            <input class="textInput" type="date" name="to"/>
                            
                            </div>
                        
                        </div> 
                    </div> 
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <div class="flexDivs">
                        <div class="flexLabelDivs"><label>Registration Status:</label></div>
                        <div class="inputDiv">
                            
                            <select name="status">
                            <option>Select Status</option>
                                <option name="status" value="0">Registered</option>
                                <option name="status" value="1">Approved</option>
                                <option name="status" value="2">Payment Pending</option>
                                <option name="status" value="3">Stopped/Declined</option>

                            </select>
                            
                            </div>
                        
                        </div> 
                    </div> 
                </div>      
            </div>
        
        <div id="sendDiv">
            <button id="sendBtn" type="submit">Search</button>
        </div>

        </form>
        </div>



        )
    }

}

export default RegistrationRequestsSearch