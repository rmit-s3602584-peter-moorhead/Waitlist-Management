import React, {Component} from 'react'
import brisklyLogo from "../../TestImages/Briskly-logo.png"
import AuthenticationService from "../../AuthenticationService"
import Axios from 'axios'

class Login extends Component{
    /**
     * 
     * This component is responsible for showing the login page to the user
     * and sending the login information to the backend to do the authentication
     * for the user. Once the user is authenticated then, the user will be logged in
     * and the token will be registered in the session.
     * 
     */

     //constructor used to set the failed state variable
     //to know if a login failed or not to show a message.
     constructor(props){
         super(props)
         this.state = {
             failed: false
         }
     }

     
    submit = (e) => {
        //preventing the default behavior of the form submission
        //because we want to do custom processing here first before
        //sending the data to the backend
        e.preventDefault()

        //resetting the variable that shows the error message
        this.state.failed = false
        this.forceUpdate()

        let target = e.target;
        let formData = {};

        for(var i = 0; i < target.length-1; i++){
            //getting the email and password fields values and adding them to the
            //formData dictionary
            formData[target.elements[i].getAttribute("name")] = target[i].value;
        }
        
        //logging in, sending the formData to the backend for processing
        //and authenticating
        Axios.post("http://localhost:9000/login", {...formData})
            .then(res =>{
                
               
                //successful login
                
                let userId = res.data.user.user_id
                let role = res.data.user.role

                //create session storage data
                AuthenticationService.registerSuccessfulLoginForJwt(userId, role, res.data)
                
                //once the user is logged in redirect to the Home page
                window.location.href = "/"

            }).catch((error) => {
                //when the request fails, we show an error message
                this.state.failed = true
                this.forceUpdate()

            })
        

    }
   

    render(){
        return(

            
        <div class="login-clean">
        <form method="post" onSubmit={this.submit}>

        <h2 class="sr-only">Login Form</h2>
        <div class="illustration"><img style={{maxWidth: '100%',maxHeight: '100%'}} src={brisklyLogo}/></div>
        {
            //When a login fails.
           this.state.failed && <div class="form-group"><label style={{color:"red", fontWeight:"bold"}}>Failed To Login. Your email or password is incorret</label></div>
        }
        <div class="form-group"><input class="form-control" type="email" name="email" placeholder="Email"/></div>
        <div class="form-group"><input class="form-control" type="password" name="password" placeholder="Password"/></div>
        <div class="form-group"><button class="btn btn-primary btn-block" type="submit" style={{backgroundColor: 'rgb(6,84,113)'}}>Log In</button>
        
        </div><a class="forgot" href="#">Forgot your password?</a>
        
        </form>
        </div>



        )
    }




}


export default Login