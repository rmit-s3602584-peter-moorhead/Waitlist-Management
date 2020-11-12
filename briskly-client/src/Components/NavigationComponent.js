import React, {Component} from 'react'
import "../ComponentStyles.css"
import AuthenticationService from "../AuthenticationService.js"

class Navigation extends Component{

    /**
     * 
     * This component is used to show the navigation bar at the top
     * of the pages.
     * 
     */


     //setting up the 
    constructor(props){
        super(props)

        this.state = {
            loginBtn: <a class="login" href="/login">Log In</a>,
            signUpBtn: <a class="btn btn-light action-button" id="signUp" role="button" href="/signup">Sign Up</a>
        }
    }

    componentWillMount(){
        //checking if the user is logged in or not
        if(AuthenticationService.isUserLoggedIn()){
            //if the user is logged in change the Login to Log out
            this.state.loginBtn = <a class="btn btn-light action-button" id="signUp" href="/" onClick={AuthenticationService.logout}>Log out</a>
            //hide the sign up button
            this.state.signUpBtn = null
        }else{
            //else keep them the same way they were
            this.state.loginBtn = <a class="login" href="/login">Log In</a>
            this.state.signUpBtn = <a class="btn btn-light action-button" id="signUp" role="button" href="/signup">Sign Up</a>
        }
        this.forceUpdate()
    }

    isParent() {
        //if a parent is logged in then return true
        if(AuthenticationService.isUserLoggedIn()){
            if(AuthenticationService.getRole() == "parent"){
                return true
            }else{
                return false
            }
        }else{
            return false
        }

    }

    isAdmin(){
        //if an admin is logged in return true
        if(AuthenticationService.isUserLoggedIn()){
            if(AuthenticationService.getRole() == "admin"){
                return true
            }else{
                return false
            }
        }else{
            return false
        }
    }

    isNursery(){
        //if a nursery is logged in return true
        if(AuthenticationService.isUserLoggedIn()){
            if(AuthenticationService.getRole() == "nursery"){
                return true
            }else{
                return false
            }
        }else{
            return false
        }
    }
    
    render() {

        return (


            <nav class="navbar navbar-light navbar-expand-md navigation-clean-button">
                    <div class="container"><a class="navbar-brand" href="#">Briskly</a><button data-toggle="collapse" class="navbar-toggler" data-target="#navcol-1"><span class="sr-only">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
                        <div class="collapse navbar-collapse"
                            id="navcol-1">
                            <ul class="nav navbar-nav mr-auto">
                            <li class="nav-item" role="presentation"><a class="nav-link" href="/">Home</a></li>
                            <li class="nav-item" role="presentation"><a class="nav-link" href="/ns">Nurseries</a></li>
                            
                                {
                                    //if parent is logged in then show Add Child functionality
                                    this.isParent() && <li class="nav-item" role="presentation"><a class="nav-link" href="/add-child">Add Child</a></li>
                                }
                                {
                                    //if parent is logged in then show My Children functionality
                                    this.isParent() && <li class="nav-item" role="presentation"><a class="nav-link" href="/my-children">My Children</a></li>
                                }
                                



                                {
                                    //if admin is logged in then show Nursery Requests functionality
                                    this.isAdmin() && <li class="nav-item" role="presentation"><a class="nav-link" href="/ans">Nursery Requests</a></li>
                                }
                                {
                                    //if admin is logged in then show Send Notification functionality
                                    this.isAdmin() && <li class="nav-item" role="presentation"><a class="nav-link" href="/sn">Send Notifications</a></li>
                                }
                                {
                                    //if admin is logged in then show Prices functionality
                                    this.isAdmin() && <li class="nav-item" role="presentation"><a class="nav-link" href="/p">Prices</a></li>
                                }



                                {
                                    //if nursery is logged in then show the send notification functionalitty (For nursery)
                                    this.isNursery() && <li class="nav-item" role="presentation"><a class="nav-link" href="/nursery-send">Send Notifications</a></li>
                                }
                                
                                
                                {
                                    //if nursery is logged in then show the view requests functionalitty (For nursery)
                                    this.isNursery() && <li class="nav-item" role="presentation"><a class="nav-link" href="/view-requests">View Requests</a></li>
                                }





                            </ul>
                                <span class="navbar-text actions" style={{width: '30%'}}>

                                    {
                                        //showing the loginBtn (if logged in it will be log out)
                                        this.state.loginBtn
                                    }
                                    
                                    {
                                        //showing the sign up button (if logged in it will disappear)
                                        this.state.signUpBtn
                                    }
                                    </span>
                            </div>
                    </div>
                </nav>

        )
    }


}


export default Navigation