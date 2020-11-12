import React, {Component} from "react"

class ChildrenSelection extends Component{
    /**
     * 
     * This component is used to show the dropdown menu and the apply button
     * which allows the parent to register a child of theirs in a nursery.
     * 
     */
    

     //used to receive props
    constructor(props){
        super(props)
    }


    render(){
        return(
            <select name="child">
            {    
                 this.props.children.map((item, i) => 
                    <option name="child" value={this.props.children[i][0][1]}>{this.props.children[i][0][0]}</option>
                 )
            }
        </select>
            

        )
    }
}

export default ChildrenSelection