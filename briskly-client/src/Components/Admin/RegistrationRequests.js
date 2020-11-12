import React, {Component} from 'react'
import './RegistrationRequests.css'

class RegistrationRequests extends Component{

    constructor(props){
        super(props)
        //setting the state variable
        this.state = {
            data: []
         }

        try{
            //if this is NOT a new search (the user is clicking the back button)
            if(this.props.location.results == undefined || this.props.location.results == null){
                //then use the data stored in the session (the previous results) and set the state to it
                this.state.data = JSON.parse(sessionStorage.getItem("adminSearch"))
            }else{
                //otherwise, there is new data coming and store that in the session.
                this.state.data = this.props.location.results
                sessionStorage.setItem("adminSearch", JSON.stringify(this.state.data))
            }
        }catch(error){}

    }

    clicked = (e) => {
        e.preventDefault()
        //once a nursery is clicked then take the user to the nursery application page
        //and pass the data id of the clicked nursery.
        this.props.history.push({
            pathname: '/ana',
            id: e.target.id
        })
        

        
    }

    render(){

        


        return(

           

            <div>
                  {this.state.data.length > 0 && <div id="nTitleDiv"><label id="nTitle">Results</label></div>}
                  {this.state.data.length == 0 && <div id="nTitleDiv"><label id="nTitle">No Results Found!</label></div>}
                
                  <div id="resultTitleDiv" >
                
                  {this.state.data.length > 0 && <div class="resultTitle"> Nursery Name </div>}
                  {this.state.data.length > 0 && <div class="resultTitle">CRN</div>}
                  {this.state.data.length > 0 && <div class="resultTitle">City</div>}
                  {this.state.data.length > 0 && <div class="resultTitle">Status</div>}
                  
                    
                  </div>
                    
                    


                    


                {
                    Object.keys(this.state.data).map((key, index) =>(
                        
                        <a href="" id={this.state.data[key]["nurseryNumber"]} key={this.state.data[key]["nurseryNumber"]} onClick={this.clicked} class="resultLink" name="link">
                        
                        <div id={this.state.data[key]["nurseryNumber"]} class="resultsDiv" >
                            <div id={this.state.data[key]["nurseryNumber"]} class="resultItem">
                                {this.state.data[key]["nurseryName"]}
                            </div>
                            <div id={this.state.data[key]["nurseryNumber"]} class="resultItem">
                                {this.state.data[key]["CommercialRegistrationNumber"]}
                            </div>
                            <div id={this.state.data[key]["nurseryNumber"]} class="resultItem">
                                {this.state.data[key]["city"]}
                            </div>
                            <div id={this.state.data[key]["nurseryNumber"]} class="resultItem">
                                {this.state.data[key]["status"]}
                            </div>
                            
                        </div>
                        </a>
                        
                        

                    ))
                }


            </div>
        )
    }

}

export default RegistrationRequests
