import React, {Component} from 'react'
import "./Search.css"
import AuthenticationService from "../../AuthenticationService"

class SingleNursery extends Component{

    /**
     * 
     * This component is responsible for showing ALL of the information
     * regarding a specific nursery that we received its nursery id from
     * the SearchNurseryResults component
     * 
     */


    //The constructor receive props and initializes the 
    //component's state variables
    constructor(props){
        super(props)

        this.state = {
            nursery: {},
            details: [],
            services: [],
            openingHours: [],
            languages: [],
            country: "",
            image: "assets/img/bg-masthead.jpg",
            id: -1
        }
    }

    componentWillMount(){

        //now that we have all the setup needed to get the nursery, we call the backend
        //and get all the necessary information for a specific nursery.
        var formData = {}
        //first we check if there exists a nursery id
        if(sessionStorage.getItem("n-Id") != undefined && sessionStorage.getItem("n-Id") != null){
            formData["id"] = sessionStorage.getItem("n-Id")
            this.state.id = sessionStorage.getItem("n-Id")
        }else{
            //setup a new session storage key to store the id
            sessionStorage.setItem("n-Id", this.props.location.id)
            formData["id"] = this.props.location.id
            this.state.id = this.props.location.id
        }
        //getting the nursery's information
        this.getNursery(formData)
    }

    async getNursery(formData){
        //this method sends a POST request to the backend
        //to receive all the information related to a specific
        //nursery

        const response = await fetch("http://localhost:9000/singleNurserySearch",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData)
        })
        //converting the response to a JSON format
        const data = await response.json()

        //temporary variables to filter out the data received
        const details = data[0][0]
        var services = data[1]
        var openingHours = data[2]
        var languages = data[3]
        const country = data[7]["country"]

        //nursery status:
        /*
        0 => available
        1 => currently not available
        */

        //ensuring the correct status name appears
        if(details["status"] == 1){
            details["status"] = "Available"
        }else{
            details["status"] = "Currently Not Available"
        }

        //ensuring there are no undefined attributes

        /*
            Below I go through the temporary arrays and then i check for any undefined
            I push it to a temporary array and then I assign the arrays above the new
            values that are stored inside the temp array
        */
        var temp = []
        for(var i = 0; i < services.length; i++){
            if(services[i]["name"] != undefined){
                temp.push(services[i])
            }
        }
        services = temp

        temp = []   //resetting the temp array

        for(var i = 0; i < openingHours.length; i++){
            if(openingHours[i]["opening_hours"] != undefined && openingHours[i]["opening_hours"] != ""){
                temp.push(openingHours[i])
            }
        }
        openingHours = temp

        temp = [] //resetting the temp array
        for(var i = 0; i < languages.length; i++){
            if(languages[i]["Language"] != undefined && languages[i]["Language"] != ""){
                temp.push(languages[i])
            }
        }
        languages = temp

        //setting the state variables with the new values
        this.setState({
            details: details,
            services: services,
            openingHours: openingHours,
            languages: languages,
            country: country
        })

    }

    changeImage = (e) =>{
        //changing the image on click
        this.state.image = e.target.getAttribute("src")
        this.forceUpdate()
    }

    apply = (e) =>{
        e.preventDefault();
        
        //sending the user information to the apply page when the apply button is clicked
        this.props.history.push({
            pathname: '/apply',
            id: this.state.id,
            nurseryName: this.state.details["NurseryName"],
            nurseryId: this.state.details["nurseryNumber"]
        })
    }

    parentCheck(){
        //checking if the user is logged in and if the logged in user is a parent or not.
        if(AuthenticationService.isUserLoggedIn() && AuthenticationService.getRole() == "parent"){
            return true
        }else{
            return false
        }
    }

    render(){
        return(
            <div>
        <div class="container" style={{marginBottom: '5vh'}}>
        <div style={{textAlign: 'center'}}><label style={{fontSize: 'calc(1em + 1vmin)', marginBottom: '5vh', marginTop: '2vh', fontWeight: "bold"}}>{this.state.details['NurseryName']}</label></div>
            <div class="row">
                <div class="col-md-6">
                    <div>
                        <div><img src={this.state.image} style={{width: '100%', height: 'auto'}}/></div>
                        <div>
                            <img onClick={this.changeImage} style={{width: '15%', marginTop: '1%'}} src="assets/img/bg-masthead.jpg"/>
                            <img onClick={this.changeImage} style={{width: '15%', marginTop: '1%', marginLeft: '2%'}} src="assets/img/bg-showcase-1.jpg"/>
                            <img onClick={this.changeImage} style={{width: '15%', marginTop: '1%', marginLeft: '2%'}} src="assets/img/bg-showcase-2.jpg"/>
                            <img onClick={this.changeImage} style={{width: '15%', marginTop: '1%', marginLeft: '2%'}} src="assets/img/bg-showcase-3.jpg"/>
                            <img onClick={this.changeImage} style={{width: '15%', marginTop: '1%', marginLeft: '2%'}} src="assets/img/building.jpg"/>
                            <img onClick={this.changeImage} style={{width: '15%', marginTop: '1%', marginLeft: '2%'}} src="assets/img/bg-showcase-1.jpg"/>

                            </div>
                    </div>
                </div>
                <div class="col-md-6" >

                    {
                        //the 1 line of code below is to show the "Map View" with its icon click. The functionality for it is not implemented yet
                        //however, if the new developer wishes to use it, then it is the 1 line below :)

                        /* <div style={{float: 'right'}}><a href="#" style={{fontSize: 'calc(0.5em + 1vmin)'}}>Map view<i class="fas fa-map-marker-alt" style={{marginLeft: '4px'}}></i></a></div> */
                    }
                   
                    <div><label class="titles">Status</label>
                        <div style={{marginLeft: '5%'}}><label style={{fontSize: 'calc(0.5em + 1vmin)'}}>{this.state.details["status"]}</label></div>
                    </div>

                    <div>
                    {
                        this.state.services.length > 0 && <label class="titles">Services Offered</label>
                        
                    }
                    {
                         Object.keys(this.state.services).map((key, index) =>(
                            <div style={{marginLeft: '5%'}}>
                                <label style={{fontSize: 'calc(0.5em + 1vmin)', width: "40%"}}>{this.state.services[key]["name"] + ":"}</label>
                                <label style={{fontSize: 'calc(0.5em + 1vmin)'}}>{this.state.services[key]["description"]}</label>
                            </div>
                         
                            ))
                    } 
                    </div>


                    <div>
                    {
                        this.state.openingHours.length > 0 && <label class="titles">Opening Hours</label>
                        
                    }
                    {
                         Object.keys(this.state.openingHours).map((key, index) =>(
                            <div style={{marginLeft: '5%'}}>
                                
                                <label style={{fontSize: 'calc(0.5em + 1vmin)'}}>{this.state.openingHours[key]["opening_hours"]}</label>
                            </div>
                         
                            ))
                    } 
                    </div>


                    <div>
                    {
                        this.state.languages.length > 0 && <label class="titles">languages Supported</label>
                        
                    }
                    {
                         Object.keys(this.state.languages).map((key, index) =>(
                            <div style={{marginLeft: '5%'}}>
                                
                                <label style={{fontSize: 'calc(0.5em + 1vmin)'}}>{this.state.languages[key]["Language"]}</label>
                            </div>
                         
                            ))
                    } 
                    </div>

                    <div>
                    {
                        this.state.details.length != 0 && <label class="titles">Contact</label>
                        
                    }
                    <div style={{marginLeft: '5%'}}>
                            <label style={{fontSize: 'calc(0.5em + 1vmin)', width: "40%"}}>Phone Number:</label>
                            <label style={{fontSize: 'calc(0.5em + 1vmin)'}}>{this.state.details["PhoneNumber"]}</label>
                            <br/>
                            <label style={{fontSize: 'calc(0.5em + 1vmin)', width: "40%"}}>Email:</label>
                            <label style={{fontSize: 'calc(0.5em + 1vmin)'}}>{this.state.details["Email"]}</label>
                        </div>
                    </div>
                    
                    

                </div>
                
            </div>
            
        </div>
        <div id="applyBtnDiv">
        {
          this.parentCheck() && <button type="submit" onClick={this.apply} id="apply">Apply</button>
        }
        </div>
    </div>
        )
    }

}

export default SingleNursery