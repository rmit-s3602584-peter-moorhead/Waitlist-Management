import React, {Component} from 'react'
import AuthenticationService from "../../AuthenticationService"
import AddChildDetails from "./AddChildDetails"

class AddChild extends Component{
    /**
     * 
     * This component is used to either display a message to the user
     * that they need to be a parent user in order to view this page
     * 
     * OR
     * 
     * If the logged in user is a parent it displays the Add Child page
     * so that the parent can add a child to the system
     * 
     */

    isParentLoggedIn(){
        //checking if the user is logged in and is a parent
        if(AuthenticationService.isUserLoggedIn() && AuthenticationService.getRole() == "parent"){
            return true
        }else{
            return false
        }
    }

    render(){
        return(
            
            <div>

            {
                //If the parent is logged in then show the AddChildDetails component
                this.isParentLoggedIn() == true && <AddChildDetails/>
            }

            {
                //If the parent is NOT logged in then we show nothing except a message to tell the user/parent to login
                this.isParentLoggedIn() == false && <div style={{textAlign: "center", marginTop:"20%", marginBottom: "20%"}}><h1>Make sure you are logged in as a Parent user</h1></div>
            }

            </div>    
            

        )
    }

}

export default AddChild