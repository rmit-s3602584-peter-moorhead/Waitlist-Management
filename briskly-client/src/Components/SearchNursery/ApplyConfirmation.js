import React, {Component} from "react"

class ApplyConfirmation extends Component{

    /**
     * 
     * This component is used to show the Confirmation message to the user
     * that the child has been applied to a nursery and an email has been sent
     * 
     */

     //used to receive props.
    constructor(props){
        super(props)

    }
    
    //This event takes the user to the home page when the Home button is clicked
    home = (e) =>{
        window.location.href = "/"
    }

    render(){
        return(
            <div id="meet">
            
            <div class="meetingDivs">
                <div class="divsInside">
                   <h2>Thank you for applying to {this.props.location.nurseryName}</h2>
                   <br/>
                   <h2>You will shortly receive a confirmation email!</h2>
                   <br/>
                   <h2>Excited to have you become part of our nursery :)</h2>


                </div>
               


            </div>
            <div id="btnMeetingDiv">
                <button style={{backgroundColor: "rgb(6,84,113)", color:"white", borderRadius: "5px" ,border: "2px solid rgb(6,84,113)"}} onClick={this.home}>
                    Home</button>
                </div>



        </div>

        )
    }
}

export default ApplyConfirmation