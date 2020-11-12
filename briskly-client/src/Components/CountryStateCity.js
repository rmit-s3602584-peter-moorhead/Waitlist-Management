import React, {Component} from 'react'
import "../ComponentStyles.css"

class CountryStateCity extends Component{
// Token for country, state, city: FVHOUbR_JQ7NtLn0hgiGN7WbLCSASKet7fv3jxZVhDnife3SW-OQ1gr1nkL7TLs62Fg
//API used for country, state and city: https://www.universal-tutorial.com/rest-apis/free-rest-api-for-country-state-city

    /**
     * 
     * This component is used to show the country, state and city dropdowns.
     * it is heavily used in a lot of components like NurseryRegistration,
     * ParentRegistration, SendNotifications and more.
     * 
     */

     //used to initialize the the component's state variables and bind
     //some of the methods
    constructor(props){
        super(props)

        //storing values in the current component state
        this.state = {
            countries: [],
            states: [],
            cities: [],
            phoneCode: [],
            countryShort: [],
            shortCode: [],
            authToken: ""
        }
        //binding those functions
        this.showStates = this.showStates.bind(this)
        this.showCities = this.showCities.bind(this)
    }



    //sending country codes to the registration components
    sendCodes(){
        this.props.phoneCodes(this.state.shortCode)
    }

    async componentWillMount(){
        
        //getting the countries from the APIs

        //getting the access token.
        const response = await fetch('https://www.universal-tutorial.com/api/getaccesstoken',{
                headers:{
                    'Accept': 'application/json',
                    'api-token': 'FVHOUbR_JQ7NtLn0hgiGN7WbLCSASKet7fv3jxZVhDnife3SW-OQ1gr1nkL7TLs62Fg',
                    'user-email':'BrisklyTest@gmail.com',
                    'Content-Type': 'application/json'
                }
            })
        //converting the received data into JSON format
        const data = await response.json()
        //setting the authentication token in the state
        this.setState({
            authToken: data['auth_token']
        })
        
        //getting the countries by providing the access token to it.
        const countriesResponse = await fetch('https://www.universal-tutorial.com/api/countries/',{
                headers:{
                    'Authorization':"Bearer " + this.state.authToken,
                    'Accept': 'application/json'
                   
                }
            })
        
        //Getting the countries as a json from the data in the response
        const countries = await countriesResponse.json()
        
        //arrays to temporarly store data and filter them
        //those arrays will hold the following:

        //all the countries around the world
        var allCountries = []
        //country codes fo all the countries
        var allPhoneCodes = []
        //short name of each country  i.e Australia => Au OR United Stated Of America => USA
        var allCountryShort = []

        //looping through all the countries and setting the arrays above
        for(var x in countries){
            var obj = countries[x]
            allCountries.push(obj['country_name'])
            allPhoneCodes.push(obj['country_phone_code'])
            allCountryShort.push(obj['country_short_name'])
            
        }
        
        //setting the state with the temporary arrays above
        this.setState({
            countries: allCountries,
            phoneCode: allPhoneCodes,
            countryShort: allCountryShort

        })
        
        //now Will combine the country short with the phone codes to get something like this => Au (+61) when we select the country code drop-down
        var combineCodeAndShort = []
        for(var x = 0; x < this.state.phoneCode.length; x++){
            //combining the data
            var combined = this.state.countries[x] + " (+" + this.state.phoneCode[x] + ")"
            combineCodeAndShort.push(combined)
        }
        //setting the state with the country codes + country shorts
        this.setState({
            shortCode: combineCodeAndShort
        })
    }

    //getting the states of the country selected in the drop-down
    async getStates(country){
        //using the API will provide us with the states of the country chosen
        const url = "https://www.universal-tutorial.com/api/states/" + country 
        const response = await fetch(url, {
            headers:{
                'Authorization':"Bearer " + this.state.authToken,
                'Accept': 'application/json'
            }
        })
        //storing the received response data in a JSON format
        const data = await response.json()

        //Temporary array to store all of the states
        var states = []
        //storing all the states from the received data
        for(var x in data){
            var obj = data[x]
            states.push(obj['state_name'])
        }
        //storing the states in the state of the component
        this.setState({
            states: states
        })

    }
    
    showStates = (e) =>{
        //now we get the states

        //when a country is selected call getStates()
        this.getStates(e.target.value)
    }

    //getting the cities after selecting a state
    async getCitites(state){
        //getting the cities from the API
        const url = "https://www.universal-tutorial.com/api/cities/" + state 
        const response = await fetch(url, {
            headers:{
                'Authorization':"Bearer " + this.state.authToken,
                'Accept': 'application/json'
            }
        })

        //storing the received data as a JSON
        const data = await response.json()

        //now we store all the cities in a temporary array
        var cities = []
        for(var x in data){
            var obj = data[x]
            cities.push(obj['city_name'])
        }
        //set the state with the cities that we received
        this.setState({
            cities: cities
        })
    
    }

    showCities = (e) =>{
        //when a state is selected we immediatly call the getCities function
        this.getCitites(e.target.value)
    }

    render(){
        return(


            <div key={this.props.keyToUse}>
                <div class="form-group">
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <div class="countryStateCityLabel"><label style={{fontSize: 'calc(0.5em + 1vmin)'}}>Country:</label></div>
                                  
                                  
                                  
                                    <div style={{width: '50%'}}>
                                        <select id="country" onChange={this.showStates} class="form-control countryStateCityDropdown" name={this.props.country}>
                                            <option  style={{backgroundColor: 'rgb(219,222,225)',color: 'rgb(0,0,0)',margin: 0}} data-toggle="dropdown" aria-expanded="false">Select Country</option>
                                            
                                                    {
                                                      //showing all of the countries stored inside the state of the component in the drop-down
                                                      this.state.countries.map((item,i) => <option name={this.props.country} value={this.state.countries[i]} key={i}>{this.state.countries[i]}</option>)

                                                      
                                                    }
                                                    
                                              
                                    </select>
                                
                                
                                
                                
                                
                                </div>
                            </div>
                    </div>

                        <div class="form-group">
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <div class="countryStateCityLabel" ><label style={{fontSize: 'calc(0.5em + 1vmin)'}}>State/Province:</label></div>
                                  
                                  
                                  
                                    <div style={{width: '50%'}}>
                                        <select onChange={this.showCities} class="form-control countryStateCityDropdown" name={this.props.state}>
                                            <option  style={{backgroundColor: 'rgb(219,222,225)',color: 'rgb(0,0,0)',margin: 0}} data-toggle="dropdown" aria-expanded="false">Select State/Province</option>
                                            
                                                    {
                                                      //showing all the states that are stored in state of the component in the drop-down
                                                      this.state.states.map((item, i) => <option name={this.props.state} value={this.state.states[i]} key={i}>{this.state.states[i]}</option>)

                                                      
                                                    }
                                                    
                                              
                                    </select>
                                
                                
                                
                                
                                
                                </div>
                            </div>
                    </div>





                    <div class="form-group">
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <div class="countryStateCityLabel"><label style={{margin: '0px', fontSize: 'calc(0.5em + 1vmin)'}}>City:</label></div>
                                  
                                  
                                  
                                    <div style={{width: '50%'}}>
                                        <select class="form-control countryStateCityDropdown" name={this.props.city}>
                                            <option  style={{backgroundColor: 'rgb(219,222,225)',color: 'rgb(0,0,0)',margin: 0}} data-toggle="dropdown" aria-expanded="false">Select City</option>
                                            
                                                    {
                                                      //showing all the cities that are stored in the state of the component in the drop-down
                                                      this.state.cities.map((item, i) => <option name={this.props.city} value={this.state.cities[i]} key={i}>{this.state.cities[i]}</option>)

                                                      
                                                    }
                                                    
                                              
                                    </select>
                                
                                
                                
                                
                                
                                </div>
                            </div>
                    </div> 

            </div>




        )
    }


}

export default CountryStateCity