import React, {Component} from 'react'


import CountryStateCity from "../CountryStateCity.js"
import Axios from 'axios'
import AdvancedSearch from "./AdvancedSearch.js"
import "../../ComponentStyles.css"


class NurserySearch extends Component{
    
    /*

    This component is used to hold the nursery search page that will be used
    to fill in some data and then the user will hit search and then will be taken
    to another component to show the results.

    */
    
    constructor(props){
        super(props)

        //Storing some variables in the component state
        this.state = {
            siblings: "",
            showAdvancedSearch: false,
            advancedButtonTitle: "Advanced Search",
            result: [],
            finishedSearch: false
        }

        //in case there is a previos search, remove it
        sessionStorage.removeItem("nurserySearchResults")
    }


    submit = (e) => {
        //preventing the default submission behavior
        //because we wanna do data processing first
        e.preventDefault();

        //storing the event target
        let target = e.target;
        //what will be sent to the backend
        let formData = {};
        /**
         * 
         * Note::::
         * 
         * I'm using here the name property of HTML components to retreive their values
         * 
         * */

        for (var i = 0; i < target.length; i++) {
            
            //if the current target element is a checkbox or a radio button
            if(target.elements[i].type == "checkbox" || target.elements[i].type == "radio"){
            
                //if the radio or checkbox is selected    
                if(target[i].checked == true){
                    //add the element to the formData dictionary
                    formData[target.elements[i].getAttribute("name")] = target[i].value;
                }

            }else{
                //if it is not a checkbox or radio then just simply add it to
                //the formData
                formData[target.elements[i].getAttribute("name")] = target[i].value;
            }
        }

        //filtering out the data for the backend in case the user does
        //not select a country/city/state
        if(formData["country"] == "Select Country"){
            formData["country"] = undefined
        }
        if(formData["state"] == "Select State/Province"){
            formData["state"] = undefined
        }
        if(formData["city"] == "Select City"){
            formData["city"] = undefined
        }
        if(formData["facilityType"] == "Licensed Family"){
            formData["LicensedFamily"] = 1
        }
        if(formData["facilityType"] == "Licensed Group"){
            formData["LicensedGroup"] = 1
        }
        if(formData["ChildCareFeedReduction"] != undefined){
            if(formData["ChildCareFeedReduction"] == "yes"){
                formData["ChildCareFeedReduction"] = 1
            }else{
                formData["ChildCareFeedReduction"] = 0
            }
        }
        if(formData["ECE"] != undefined){
            if(formData["ECE"] == "yes"){
                formData["ECE"] = 1
            }else{
                formData["ECE"] = 0
            }
        }
        
        if(formData["ELF"] != undefined){
            if(formData["ELF"] == "yes"){
                formData["ELF"] = 1
            }else{
                formData["ELF"] = 0
            }
        }

        if(formData["specialNeeds"] != undefined){
            if(formData["specialNeeds"] == "yes"){
                formData["specialNeeds"] = 1
            }else{
                formData["specialNeeds"] = 0
            }
        }
        
        //After the form is filled now we send the data to the backend using the method below.
        //it is done in a seperate method to use the 'async' feature to be able to wait for a response
        //more effeciently
        this.getNurseries(formData);
        
    }

    async getNurseries(formData){

        //storing all the nurseries
        var nurseries = []
        //sending a post request with the formData
        const response = await Axios.post('http://localhost:9000/searchNursery', {...formData})
        
        
        //storing the nurseries in the nurseries array
        for(var x in response['data']){
            nurseries.push(response['data'][x])
        }

        //setting the state with the nurseries array
        this.setState({
            result:nurseries
        })

        //setting the 'finishedSearch' variable to true
        this.setState({
            finishedSearch: true
        })

        // if search is finished then we proceed to /nsr page
        //which will show us the results of our search
        if(this.state.finishedSearch){
            this.props.history.push({
                pathname:"/nsr",
                result: this.state.result
            })
        }


    }

    siblingsCheck = (e) => {
        //adding the sibling value to the siblings state variable
        this.setState({
            siblings: e.target.value
        })
    }

    advancedSearch = (e) =>{
        
        //when advance search button is clicked
        //change the showAdvancedSearch value
        this.state.showAdvancedSearch = !this.state.showAdvancedSearch
        //it is done so that is the advanced search is shown
        //then hide it and vice versa

        //here i'm setting the title of the button
        if(this.state.showAdvancedSearch == true){
            this.state.advancedButtonTitle = "Hide Advanced Search"
        }else{
            this.state.advancedButtonTitle = "Advanced Search"
        }

        //updating the component on the screen
        this.forceUpdate()
    }



    render(){

        /**
         * 
         * The commented code below will be useful for whoever will takeover the project
         * 
         * The client asked if they could have the parent find a specific nursery for the child in case
         * a sibling is already enrolled in that nursery. But we haven't been able to implement that because
         * of time constraints. So this for the person taking charge of this part. It is already done for the
         * front-end you just need to uncomment it here and in the HTML below and send it to the backend and 
         * populate the drop-down (populating is what you need to write), the rest is completed
         * 
         */

        // let selectNurseryForSibling
        // if(this.state.siblings == "yes"){
        //     //get all the nurseries in the city that the user selected.
            
        //     selectNurseryForSibling = (
        //         <div style={{display: 'flex', flexDirection: 'row'}}>
        //         <div class="countryStateCityLabel" ><label style={{fontSize: 'calc(0.5em + 1vmin)'}}>Select sibling nursery:</label></div>
              
        //         <div style={{width: '50%'}}>
        //             <select class="form-control countryStateCityDropdown" name="siblingNursery">
        //                 <option  style={{backgroundColor: 'rgb(219,222,225)',color: 'rgb(0,0,0)',margin: 0}} data-toggle="dropdown" aria-expanded="false">Select Nursery&nbsp;</option>
        //                         {
        //                         //   this.state.states.map((item, i) => <option name="siblingNursery" value={this.state.states[i]} key={i}>{this.state.states[i]}</option>) 
        //                         }                          
        //         </select>

        //     </div>
        // </div>
        //     )

        // }

        let advancedSearch

        if(this.state.showAdvancedSearch == true){
            advancedSearch = (
               //showing the AdvancedSearch component if the state variable (showAdvancedSearch) is true
                <AdvancedSearch/>
               
            )
        }else{
            advancedSearch = null
        }

        
        return(
            
           

            <div class="container">
                <form method='post' onSubmit={this.submit} >
                    <div style={{textAlign: "center", marginBottom: '3vh', marginTop: '3vh'}}>
                        <h2> This form will help you reach the nursery that you are looking for</h2>
                    </div>
                <label class="title">Geographical Area</label>
                 <div ><CountryStateCity keyToUse={0} country="country" state="state" city="city"/></div>
        
                 {/* <div class="form-group"><label>Does the child have a sibling in any other daycare in the same city?</label>
                    <div class="form-check"><input class="form-check-input" value="yes" name="siblings" onClick={this.siblingsCheck} type="radio" id="formCheck-7"/><label class="form-check-label" for="formCheck-5">Yes</label></div>
                    <div class="form-check"><input class="form-check-input" value="no" name="siblings" onClick={this.siblingsCheck} type="radio" id="formCheck-8"/><label class="form-check-label" for="formCheck-5">No</label></div>
                    {
                        selectNurseryForSibling
                    }

                </div> */}



                    <button type="button" id="advancedSearchButton" onClick={this.advancedSearch}>{this.state.advancedButtonTitle}</button>

                    {
                        //the variable that will either hold the advanced search component to render it
                        //or not hold anything and not show it
                        advancedSearch
                    }

                    <div class="form-group" style={{width: '100%' ,textAlign: "center"}}>
                              
                        <button class="btn search" type="submit">Search</button>
                    </div> 
                    

                 </form>



        </div>
    



        )
    }


}

export default NurserySearch