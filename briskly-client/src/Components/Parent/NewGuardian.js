import React, {Component} from 'react'
import AddressContact from "./AddressContact.js"
import Occupation from "./Occupation.js"

class NewGuardian extends Component{

    /**
     * 
     * This component is used to add a new part for the form which allows
     * the parent to add a second guardian
     */

    //the constructor is used to initialize imoprtant variabes here
    constructor(props){
        super(props)
        //to know if to show the file input or not
        this.showFileInputOptionClicked = false
        //all possible relationship status for the parent/guardian
        this.relationshipStatus = ['Single', 'Married', 'Divorced', 'Widowed']

    }
    //this event is called when the "Remove second parent/guardian" button is clicked
    delete = (e) => {
        //it removes this component from the parent component.
        this.props.delete()
    }
    //this event is called when the user answers YES for the custody question (Last question)
    showFileInput = () => {
        //the file input will appear
        this.showFileInputOptionClicked = true
        this.forceUpdate()
    }
    //this event is called when the user answers NO for the custody question (Last question)
    hideFileInput = () =>{
        //the file input WILL GO AWAY/DISAPPEAR
        this.showFileInputOptionClicked = false
        this.forceUpdate()
    }

    fileInput(){
        //this method is responsibe for returning the HTML tags that are responsible for showing
        //the file input when the user answeres YES
        if(this.showFileInputOptionClicked){
            return <div style={{marginTop: '3%', display: 'flex', flexDirection: 'row'}}>
            <div style={{width: '30%'}}><label style={{marginRight: '%}'}}>Provide a copy of the agreement</label></div><div><input name="agreementFile" type="file"/></div>
            </div>
        }else{
            //returns null otherwise
            return null
        }
    }

    render(){
        return(

<div id="newGuardian">
<button id="removeGuardian" class="btn btn-primary" type="button" style={{backgroundColor: 'rgb(184, 5, 5)'}} onClick={this.delete.bind(this)}>Remove second parent/guardian</button>
    <div><label class="title" style={{marginTop: '2%'}}>Second Parent/Guardian</label></div>
    
            <div class="form-group">
            <div style={{display: 'flex',flexDirection: 'row'}}>
                <div style={{width: '13.5%',alignSelf: 'center'}}><label style={{margin: '0px'}}>First Name:</label></div>
                <div style={{width: '70%'}}><input class="form-control" type="text" name="firstName2" placeholder="First Name" style={{width: '70%',padding: '0px',marginLeft: '1%'}}/></div>
            </div>
        </div>
        <div class="form-group">
            <div style={{display: 'flex',flexDirection: 'row'}}>
                <div style={{width: '13.5%',alignSelf: 'center'}}><label style={{margin: '0px'}}>Last Name:</label></div>
                <div style={{width: '70%'}}><input class="form-control" type="text" name="lastName2" placeholder="Last Name" style={{width: '70%',padding: '0px',marginLeft: '1%'}}/></div>
            </div>
        </div>
        <div class="form-group">
            <div style={{display: 'flex',flexDirection: 'row'}}>
                <div style={{width: '13.5%',alignSelf: 'center'}}><label style={{margin: '0px'}}>Username:</label></div>
                <div style={{width: '70%'}}><input class="form-control" type="text" name="username2" placeholder="Username" style={{width: '70%',padding: '0px',marginLeft: '1%'}}/></div>
            </div>
        </div>
        <div class="form-group">
                    <div style={{display: 'flex',flexDirection: 'row'}}>
                        <div style={{width:'14%', marginTop: '1%'}}><label style={{margin: '0px'}}>Relationship:</label></div>
                        <div style={{width: "25%"}}>
                            <select name="relationship2" class="form-control" >
                                <option>Select Relationship</option>
                                {
                                    //displaying the relationships from the array in the constructor
                                    this.relationshipStatus.map((item, i) => <option name="relationship2" value={this.relationshipStatus[i]}>{this.relationshipStatus[i]}</option>)
                                }

                        </select>
                    </div>
                </div>
        </div>
<div class="form-group">
    <div style={{display: 'flex',flexDirection: 'row'}}>
        <div style={{width: '14%'}}><label style={{margin: '0px',marginTop: '5%'}}>Date of birth:</label></div>
        <div ><input class="form-control" name="birthday2" type="date" /></div>
    </div>
</div>

<AddressContact keyToUse={0} country="country2" state="state2" city="city2" title={"Address and Contact information"} 
    names={["homeAddress2", "homeZipCode2", "countryCode2", "phoneNumber2", "personalEmail2"]} shortCode={this.props.shortCode}/>


        
        
        
        
       <Occupation names={["occupation2", "company2", "natureOfBusiness2", "yearsWithCompany2"]}/>
        

<AddressContact keyToUse={1} country="businessCountry2" state="businessState2" city="businessCity2" title={"Business Address"}
names={["businessAddress2", "businessZipCode2", "businessCountryCode2", "businessPhoneNumber2", "businessEmail2"]} shortCode={this.props.shortCode}/>





            <div><label class="title" style={{marginTop: '3%'}}>Parental Situation</label>
        <div style={{display: 'flex',flexDirection: 'row'}}>
            <div style={{width: '30%'}}><label>Child lives with</label></div>
            <div>
                <div class="form-check"><input class="form-check-input" name="Child-Lives-With" value="Both" type="radio" id="formCheck-1"/><label class="form-check-label" for="formCheck-1">Both parents/guardians</label></div>
                <div class="form-check"><input class="form-check-input" name="Child-Lives-With" value="One" type="radio" id="formCheck-2"/><label class="form-check-label" for="formCheck-2">One parent/guardian</label></div>
            </div>
        </div>
    </div>
    <div style={{marginTop: '3%'}}>
        <div style={{display: 'flex',flexDirection: 'row'}}>
            <div style={{width: '30%'}}><label>Is there a custody agreement?</label></div>
            <div style={{width: '20%'}}>
                <div class="form-check"><input class="form-check-input" name="Custody-Agreement" onClick={this.showFileInput} value="1" type="radio" id="formCheck-3"/><label class="form-check-label" for="formCheck-3">Yes</label></div>
                <div class="form-check"><input class="form-check-input" name="Custody-Agreement" onClick={this.hideFileInput} value="0" type="radio" id="formCheck-4"/><label class="form-check-label" for="formCheck-4">No</label></div>
            </div>
        </div>
        {
            //once the showFileInputOptionClicked changes to true then the below function will return
            //the HTML tags for showing the file input.
            this.fileInput()
        }
    </div>
</div>

        )
    }



}

export default NewGuardian