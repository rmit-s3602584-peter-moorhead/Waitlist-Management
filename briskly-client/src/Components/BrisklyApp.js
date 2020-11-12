import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import NavigationComponent from "../Components/NavigationComponent"
import NurseryRegistration from "../Components/Nursery/NurseryRegistration.js"
import ParentRegistration from '../Components/Parent/ParentRegistration.js'
import RegistrationSelection from "../Components/RegistrationSelection.js"
import NurserySearch from "./SearchNursery/NurserySearch.js"
import SearchNurseryResults from "./SearchNursery/SearchNurseryResults.js"
import SingleNursery from "./SearchNursery/SingleNurseryPage.js"
import Login from './Login/Login'
import PaymentSetup from './Admin/PaymentSetup'
import Prices from './Admin/Prices'
import SendNotification from './Admin/SendNotification'
import RegistrationRequestsSearch from './Admin/RegistrationRequestsSearch'
import RegistrationRequests from './Admin/RegistrationRequests'
import NurseryApplication from './Admin/NurseryApplication'
import AddChild from './Child/AddChild'
import ViewChild from './Child/ViewChild'
import NurseryNotification from './Nursery/NurseryNotification'
import ChildrenRequests from './Nursery/ChildrenRequests'
import Meeting from './Nursery/Meeting'
import ApplyNursery from './SearchNursery/ApplyNursery'
import ApplyConfirmation from "./SearchNursery/ApplyConfirmation"

class Briskly extends Component{

    /**'
     * 
     * This class is used for ALL the routes that will be used in the website
     * Just adding a <Route..../> like the ones below with the appropriate component
     * imported at the top will make the provided path accessible with the given component
     * 
     */

    render() {

        return (

            <div>
                <Router>

                <>
                
                
                <NavigationComponent/>

             {/* Adding the URL paths for each component */}

                <Switch>
                <Route path="/" exact component={RegistrationSelection}/>
                <Route path="/signup" exact component={RegistrationSelection}/>
                <Route path="/nr" exact component={NurseryRegistration}/>
                <Route path="/pr" exact component={ParentRegistration}/>
                <Route path="/ns" exact component={NurserySearch}/>
                <Route path="/nsr" exact component={SearchNurseryResults}/>
                <Route path="/single" exact component={SingleNursery}/>
                <Route path="/login" exact component={Login}/>
                <Route path="/ps" exact component={PaymentSetup}/>
                <Route path="/p" exact component={Prices}/>
                <Route path="/sn" exact component={SendNotification}/>
                <Route path="/ans" exact component={RegistrationRequestsSearch}/>
                <Route path="/ansr" exact component={RegistrationRequests}/>
                <Route path="/ana" exact component={NurseryApplication}/>
                <Route path="/add-child" exact component={AddChild}/>
                <Route path="/my-children" exact component={ViewChild}/>
                <Route path="/nursery-send" exact component={NurseryNotification}/>
                <Route path="/view-requests" exact component={ChildrenRequests}/>
                <Route path="/set-meeting" exact component={Meeting}/>
                <Route path="/apply" exact component={ApplyNursery}/>
                <Route path="/confirmation" exact component={ApplyConfirmation}/>

                {/* <Route component={Error}/>  WILL BE USED FOR ERROR PATHS*/}

                </Switch>

                </>

                </Router>

            </div>

        )

    }
}

export default Briskly