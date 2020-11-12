import React, {Component} from 'react'
import CountryStateCity from "../CountryStateCity.js"


class AddressContact extends Component{
    /**
     * 
     * This component is used to display the Address and Contact details of a parent
     * 
     */

    constructor(props){
        //used to receive props and apply them to the appripriate location
        super(props)
    }

    render(){
        return(
        <div key={this.props.keyToUse}>
            <label class="title">{this.props.title}</label>
        <div class="form-group"><label>Street Address:</label><input class="form-control" name={this.props.names[0]} type="text" placeholder="Street Address"/></div>


        <CountryStateCity keyToUse={this.props.keyToUse} country={this.props.country} state={this.props.state} city={this.props.city}/>

        
        <div class="form-group">
            <div style={{display: 'flex',flexDirection: 'row'}}>
                <div style={{width: '20%',alignSelf: 'center'}}><label style={{margin: '0px'}}>Postal/Zip code:</label></div>
                <div style={{width: '70%'}}><input class="form-control" name={this.props.names[1]} type="text" placeholder="Post/Zip code" style={{width: '40%'}}/></div>
            </div>
        </div>
        
         <div class="form-group">
             <div style={{display: 'flex',flexDirection: 'row'}}>
                 <div style={{width: '20%',alignSelf: 'center'}}><label style={{margin: '0px'}}>Phone Number:</label></div>


                             <div class="dropdown dropDownMenu" style={{marginRight: '2%', width: '20%'}}>
                                
                                <select name={this.props.names[2]} class="form-control countryStateCityDropdown" style={{width: '100%', height: '100%', fontSize: '100%'}}>
                                 <option >Country Code</option>

                                 {
                                     this.props.shortCode.map((item, i) => <option name={this.props.names[2]} key={i} onClick={this.test} value={this.props.shortCode[i]} >{this.props.shortCode[i]}</option>)
                                 }

                                     </select>
                         </div><input class="form-control" type="text" name={this.props.names[3]} placeholder="XXXXXXXXX" style={{width: '25%'}}/></div>
                 </div>
        
            

        <div class="form-group">
            <div style={{display: 'flex',flexDirection: 'row'}}>
                <div style={{width: '20%',alignSelf: 'center'}}><label style={{margin: '0px'}}>Email Address:</label></div>
                <div style={{width: '70%'}}><input class="form-control" type="text" name={this.props.names[4]} placeholder="e.g. jon@gmail.com" style={{width: '60%'}}/></div>
            </div>
        </div>
        </div>
            


        )
    }


}

export default AddressContact