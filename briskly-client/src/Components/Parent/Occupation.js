import React, {Component} from 'react'

class Occupation extends Component{

    /**
     * 
     * This component is responsible for showing the Occupation part of the form in the 
     * ParentRegistration component.
     * 
     */

     
    //using the constructor because we are passing some props to this component
    constructor(props){
        super(props)
    }

    render(){
        return(

            <div>

<label class="title">Occupational Information</label>
        <div class="form-group">
            <div style={{display: 'flex',flexDirection: 'row'}}>
                <div style={{width: '20%',alignSelf: 'center'}}><label style={{margin: '0px'}}>Occupation/Position:</label></div>
                <div style={{width: '70%'}}><input class="form-control" type="text" name={this.props.names[0]} placeholder="e.g. jon@gmail.com" style={{width: '70%',padding: '0px',marginLeft: '1%'}}/></div>
            </div>
        </div>
        <div class="form-group">
            <div style={{display: 'flex',flexDirection: 'row'}}>
                <div style={{width: '20%',alignSelf: 'center'}}><label style={{margin: '0px'}}>Company:</label></div>
                <div style={{width: '70%'}}><input class="form-control" type="text" name={this.props.names[1]} placeholder="Company Name" style={{width: '70%',padding: '0px',marginLeft: '1%'}}/></div>
            </div>
        </div>
        <div class="form-group">
            <div style={{display: 'flex',flexDirection: 'row'}}>
                <div style={{width: '20%',alignSelf: 'center'}}><label style={{margin: '0px'}}>Nature of business:</label></div>
                <div style={{width: '70%'}}><input class="form-control" type="text" name={this.props.names[2]} placeholder="IT/Marketing/Retail/Service" style={{width: '70%',padding: '0px',marginLeft: '1%'}}/></div>
            </div>
        </div>
        <div class="form-group">
            <div style={{display: 'flex',flexDirection: 'row'}}>
                <div style={{width: '20%',alignSelf: 'center'}}><label style={{margin: '0px'}}>Years with company:</label></div>
                <div style={{width: '70%'}}><input class="form-control" type="text" name={this.props.names[3]} placeholder="e.g. 10" style={{width: '20%',padding: '0px',marginLeft: '1%'}}/></div>
            </div>
        </div>


            </div>



        )
    }


}

export default Occupation;