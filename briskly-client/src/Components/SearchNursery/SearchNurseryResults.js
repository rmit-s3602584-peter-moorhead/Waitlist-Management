import React, {Component} from 'react'
import desk from "../../TestImages/desk.jpg"
import building from "../../TestImages/building.jpg"
import loft from "../../TestImages/loft.jpg"
import minibus from "../../TestImages/minibus.jpeg"

class SearchNurseryResults extends Component{

    /**
     * 
     * This component is used to display all of the nursery results
     * that are sent from the NurserySearch component
     * 
     */

    constructor(props){
        super(props)

        //storing some variables in the state of the component
        this.state = {
            nurseries: [],
            images:[desk, building, loft, minibus]
        }
        //getting the results from the "NurserySearch" component
       //The results are passed from there

        //but before that we do some checks.

        //if the user refreshes the page we don't lose the data so we store it in the session
        
        //now we check if there are data in the session to be used
        if(sessionStorage.getItem("nurserySearchResults") != undefined && sessionStorage.getItem("nurserySearchResults") != null){
            //get the searched items
            const data = sessionStorage.getItem("nurserySearchResults")
            this.state.nurseries = JSON.parse(data)

        }else{
            sessionStorage.setItem("nurserySearchResults", JSON.stringify(this.props.location.result))
            this.state.nurseries = this.props.location.result
        }

        //delete any id that was used in the single nursery page (just to be sure)
        sessionStorage.removeItem("n-Id")
    }

    nurseryClicked = (e) => {
        
        //When a nursery is clicked
        const index = e.target.getAttribute("value")

        //get the value of the id of the nursery and pass it
        //to the single nursery page.
        this.props.history.push({
            pathname:"/single",
            id: index
        })
        
    }

    render(){
        return(
            
            <div class="container">
                <div class="cust_bloglistintro" style={{marginBottom: "4vh"}}>
                    {
                        //if there are nurseries returned then show the heading below
                      this.state.nurseries.length > 0 &&  <h2 class="text-center">Nursery Search Results</h2>
                    }
                    {
                        //if there are NO nurseries returned then show the heading below
                      this.state.nurseries.length == 0 &&  <h2 class="text-center">No results Found!</h2>
                    }
                </div>
                <div class="row">
                    
                {
                    //below we print I the nurseries from the array in the state that we received
                    //from the previous component
                        this.state.nurseries.map((item, i) => 
                
                    
                         <div  value={this.state.nurseries[i]["nurseryNumber"]} class="col-md-4 cust_blogteaser" style={{marginBottom: "4vh" }}>
                        
                        {
                            //Was going to be used to view the map. For the future, if you wanna have the same design
                            //and have a "view map link", then just uncomment the code below.

                            /* <a href="#" style={{width: "100%", margin: "0 auto"}}>View On map</a> */
                        }
                        
                        <a href="#"><img class="img-fluid" value={this.state.nurseries[i]["nurseryNumber"]} onClick={this.nurseryClicked} src={this.state.images[0]}/></a>
                        <h3>{this.state.nurseries[i]['nurseryName']}</h3>
                        <p class="text-secondary">Located in the state of {this.state.nurseries[i]['state']} in the city of {this.state.nurseries[i]["city"]} </p>
                            <a class="h4" ><i class="fa fa-arrow-circle-right" value={this.state.nurseries[i]["nurseryNumber"]} onClick={this.nurseryClicked}></i></a>
                            
                        </div>
                                    )
                    
                }    

        </div>
        </div> 



        )
    }


}

export default SearchNurseryResults