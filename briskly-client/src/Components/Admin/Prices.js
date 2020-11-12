import React, {Component} from 'react'
import './PaymentSetup.css'
import AuthenticationService from "../../AuthenticationService"

class Prices extends Component{

    /**
     * 
     * This component is used to display the current prices setup of the website
     * services. It displays the following data:
     *  1) Start Date
     *  2) End Date
     *  3) Nursery Price
     *  4) Parent Price
     *  5) Add Sub-account price
     * 
     */

    //used to prepare the state variable to be used and initialized
    //inside componentWillMount()
    constructor(props){
        super(props)
        this.state = {}

    }

    async componentWillMount(){
        //This method calls the backend to get the current price setup
        
        //represents the data that will be sent to the backend
        var formData = {}
        //the session token in order to authenticate the user in the backend
        const token = AuthenticationService.getToken()
        formData["token"] = token["user"]

        //calling the backend
        const data = await fetch("http://localhost:9000/prices",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData)
        })
        //converting the data into a json formate
        const values = await data.json()

        //those variables are used to filter-out the dates because it is returned as
        //a a database type DATE.
        var newFrom = ""
        var newTo = ""
        var count = 0

        //updating the strings with the new formated dates.
        for(var x in values){
            //the current variable/key that we are looking at
            var lookingAt = values[x]
            //the index of that variable
            var index = -1
            
            for(var i = 0; i < lookingAt.length; i++){
                //now we loop through ALL of its letters since it is returned
                //as a String type

                //AS SOON AS WE FIND THE LETTER 'T'
                //we get its index and break
                if(lookingAt[i] === "T"){
                    index = i
                    break
                }
            }
            //now we have the index of the 'T'
            //we update the variables with the new formatted date strings
            if(count == 0){
                newFrom = lookingAt.substring(0, index)
            }else{
                newTo = lookingAt.substring(0, index)
            }
            //increase the count to know which date we have just edited
            count++;
            //if we finished the 2 dates then we break from the loop
            //the dates are the first 2 member in the returned data therefore,
            //we only look at the first 2 elements
            if(count == 2){
                break;
            }

        }
        //updating the dictionary with the new date values
        values["validFrom"] = newFrom
        values["validTo"] = newTo
        //setting the returned data from the backend in the STATE variable
        this.setState(values)

    }

    newFees = (e) => {
        //this event is called when the user clicks on the newFees button
        //so that the user is taken to the page that edits those prices.
        this.props.history.push({
            pathname: '/ps'
        })
    }
    


    render(){

        return(

            <div>
                <form method="post" onSubmit={this.submit}>
            <div class="container">
                <div class="row">
                    <div class="col-md-12" style={{textAlign: 'center'}}><label class="col-form-label" id="current">Current payment setup</label></div>
                </div>

            <div id="centerPayment">

                        <div class="container1 flex-direction1">
  
                            <div class='div1'><span><label>Activation Date</label></span></div>
                            <div class='div2'><span><label>{this.state.validFrom}</label></span></div>
                        </div>

                        <div class="container1 flex-direction1">
  
                            <div class='div1'><span><label>Deactivation Date</label></span></div>
                            <div class='div2'><span><label>{this.state.validTo}</label></span></div>
                        </div>

                        <div class="container1 flex-direction1">
  
                            <div class='div1'><span><label>User Registration Fees</label></span></div>
                            <div class='div2'><span><label>${this.state.user}</label></span></div>
                        </div>


                        <div class="container1 flex-direction1">
  
                            <div class='div1'><span><label>Nursery Registration Fees</label></span></div>
                            <div class='div2'><span><label>${this.state.nursery}</label></span></div>
                        </div>

                        <div class="container1 flex-direction1">
  
                            <div class='div1'><span><label>Add Account Fees</label></span></div>
                            <div class='div2'><span><label>${this.state.add}</label></span></div>
                        </div>

            </div> 

            </div>

            <div id="newFeesDiv">
            <button id="newFeesBtn" onClick={this.newFees} type="button">New Fees</button>
        </div>
        </form>
        </div>

       


        )
    }

}

export default Prices