import React, {Component} from 'react'
import './PaymentSetup.css'
import AuthenticationService from "../../AuthenticationService"

class PaymentSetup extends Component{
    /**
     * 
     * This class is used to setup new payment prices
     * for the webiste services and update them in the database
     * 
     */

    constructor(props){
        super(props)
        this.state = {
            dataReceived: [],
            failed: false
        }
    }

    cancel = (e) => {
        this.props.history.push('/p')
    }
    submit = (e) =>{
        e.preventDefault()

        //setting up the form data that will be sent to the backend
        let target = e.target;
        var formData = {};
        //getting all of the input values and storing them inside the formData dictionary
        for(var i = 0; i < target.length-1; i++){
            if(target.elements[i].getAttribute("name") != null){
                formData[target.elements[i].getAttribute("name")] = target[i].value;
            }
            
        }
        
        //checking to see that input fields are ALL NOT empty
        var check = this.validate(formData)

        //when all the fields are NOT empty then we can proceed and send the
        //data to the backend
        if(check == true){
            //sending the formData dictionary to the sendData method to send everything to the backend
            this.sendData(formData)
        }else{
            //shwing the error message
            this.state.failed = true
            this.forceUpdate()
        }
        
    }

    validate(formData){
        var allGood = true

        //checking for empty fields.
        for(var key in formData){
            if(formData[key] == ""){
                allGood = false
                break
            }
        }

        return allGood
    }

    async sendData(formData){
        //this sends the newly updated data to the backend

        //get the authentication token and add it to the formData
        const token = AuthenticationService.getToken()
        formData["token"] = token["user"]
        
        //sending the request to the backend
        await fetch('http://localhost:9000/updatePrices', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(formData)
        })
        .then(res =>{
            //when we get a good response then we take the user to the /p path of the website
            //which shows the current payment setup (updated setup)
            if(res.status == 200){
                window.location.href = "/p"
            }
        })
    }

    render(){

        return(

            <div>
                <form method="post" onSubmit={this.submit}>
            <div class="container">
                <div class="row">
                    <div class="col-md-12" style={{textAlign: 'center'}}><label class="col-form-label" id="current">New Fees</label></div>
                </div>

                {
                    this.state.failed && <div style={{textAlign: "center"}}><label style={{color: "red", fontWeight: "bold"}}>Please make sure that all field are not empty!</label></div>
                }

            <div id="centerPayment">

                        <div class="container1 flex-direction1">
  
                            <div class='div1'><span><label>Activation Date</label></span></div>
                            <div class='div2'><span><input id="activationDate" name="activationDate" type="date"/></span></div>
                        </div>

                        <div class="container1 flex-direction1">
  
                            <div class='div1'><span><label>Deactivation Date</label></span></div>
                            <div class='div2'><span><input id="deactivationDate" name="deactivationDate" type="date"/></span></div>
                        </div>

                        <div class="container1 flex-direction1">
  
                            <div class='div1'><span><label>User Registration Fees</label></span></div>
                            <div class='div2'><span><input id="userFees" value={this.state.dataReceived[2]} name="userFees" type="number" placeholder="100"/></span></div>
                        </div>


                        <div class="container1 flex-direction1">
  
                            <div class='div1'><span><label>Nursery Registration Fees</label></span></div>
                            <div class='div2'><span><input id="nurseryFees" value={this.state.dataReceived[3]} name="nurseryFees" type="number" placeholder="100"/></span></div>
                        </div>

                        <div class="container1 flex-direction1">
  
                            <div class='div1'><span><label>Add Account Fees</label></span></div>
                            <div class='div2'><span><input id="accountFees" value={this.state.dataReceived[4]} name="accountFees" type="number" placeholder="100"/></span></div>
                        </div>

            </div> 

            </div>

            <div id="newFeesDiv">
            <button id="newFeesCancelBtn" type="button" onClick={this.cancel}>Cancel</button>
            <button id="newFeesSaveBtn" type="submit">Save</button>
        </div>
        </form>
        </div>

       


        )
    }



}

export default PaymentSetup