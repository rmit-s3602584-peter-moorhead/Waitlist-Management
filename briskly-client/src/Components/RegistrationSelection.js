import React, {Component} from 'react'
import "../ComponentStyles.css"

class RegistrationSelection extends Component{

    /**
     * 
     * This component is used to let the user select which type of
     * user they want to register as
     * 
     */

    nurseryRegistration = () =>{
        //redirect the user to nursery register page
        window.location.href="/nr"
    }
    parentRegistration = () =>{
        //redirect the user to parent registration page
        window.location.href="/pr"
    }

    render() {
        return(
            <div>
                
            <h1 style={{textAlign: 'center', color: 'rgb(6,84,113)'}}>Registration</h1>
            <h1 style={{textAlign: 'center',color: 'rgb(6,84,113)',fontSize: '3vw',marginTop: '3%'}}>Select the type of account that your would like to create</h1>
            <div style={{display: 'flex',flexDirection: 'column'}}>
                <button id="topBtn" type="button" onClick={this.nurseryRegistration}>
                <h1 style={{textAlign: 'center',fontSize: '2.5vw'}}>Register as Nursery</h1>
                </button>
                <button id="bottomBtn" type="button" onClick={this.parentRegistration}>
                <h1 style={{textAlign: 'center',fontSize: '2.5vw'}}>Register as Parent</h1>
                </button>
            </div>
            </div>




        )
    }



}



export default RegistrationSelection