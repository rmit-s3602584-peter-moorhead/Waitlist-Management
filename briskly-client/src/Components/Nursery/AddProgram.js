import React, {Component} from 'react'
import "../../ComponentStyles.css"

class AddProgram extends Component{
    /**
     * 
     * 
     * This component is used to add more programs for a nursery
     * It is used inside the NurseryRegistration component
     * and many of it is created when needed. (When the 'Add Program' button is clicked)
     * 
     */

    //This method is used when the "Remove" button is clicked
    //to remove this component from the LIST of programs
    delete = (e) => {
        //this method calls the deleteProgram method that
        //was sent from the NurseryRegistration component
        //and it passes the key of this component to know
        //which index in the LIST of programs to remove
        this.props.deleteProgram(this.props.keyToUse)
    }

    render(){

        const pId = "programId-" + this.props.keyToUse
        const numberInId = "studentsIn-" + this.props.keyToUse 
        return(

            <div class="form-group" key={this.props.keyToUse}>
                
            <div style={{display: 'flex', flexDirection: 'column', borderRadius: '12px',border: '2px solid rgb(6,84,113)'}}>
                <div style={{padding: '8px'}}>
                    <div><label>Program name:</label><input data-key={this.props.keyToUse} class="form-control" name={pId} type="text" placeholder="Program Name" /></div>
                    <div style={{width: '20%'}}><label>Number of children :</label><input data-key={this.props.keyToUse} class="form-control" name={numberInId} type="number" placeholder="e.g. 10"  /></div>
                    <div style={{width: '20%', marginTop: '2%'}}>  <button id="removeBtn" type="button" onClick={this.delete.bind(this)}>Remove</button>  </div>
                </div>
            </div>
        </div>


        )
    }



}

export default AddProgram

