import axios from 'axios'

//The keys that are used for the SESSION STORAGE
export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
export const USER_TYPE = 'userType'
export const TOKEN = 'token'
class AuthenticationService {

    /**
     * 
     * This class is used to provide easy access to
     * all of the authentication services or features
     * or data that we need to use in the project for
     * the frontend
     * 
     */

    //this method is used to check if the user is logged in or not
    //by using the SESSION STORAGE and returns true if the user is
    //logged in otherwise it returns false
   isUserLoggedIn() {
        let user = sessionStorage.getItem(TOKEN)
        
        if (user === null) return false
        return true
    }

    //this method is used to get the role of the logged in user
    //using the SESSION STORAGE. If the role was found it returns
    //the role otherwise it returns null
    getRole(){
        let role = sessionStorage.getItem(USER_TYPE)
        if(role == null) return null
        
        return role
    }

    //This method is used to get the id of the logged in user
    //from the SESSION STORAGE. if it finds it then it returns
    //the id. Otherwise, it return null
    getUserId(){
        let id = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if(id == null) return null
        
        return id
    }

    //This method is used to get the session token of the logged in user
    //from the SESSION STORAGE if the the token is not found then
    //it returns null. Otherwise, it returns the session token
    getToken(){
        let token = JSON.parse(sessionStorage.getItem(TOKEN))
        if(token == null) return null

        return token
    }
    //this method is used to log the user out. It removes all of the session
    //variables/keys from the SESSION STORAGE.
    logout() {
        sessionStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
        sessionStorage.removeItem(USER_TYPE)
        sessionStorage.removeItem(TOKEN)
    }

    //Set up state variables and axios interceptors if a login succeeds
    registerSuccessfulLoginForJwt(userId, role, token) {
        sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, userId)
        sessionStorage.setItem(USER_TYPE, role)
        sessionStorage.setItem(TOKEN, JSON.stringify(token))
        // sessionStorage.setItem(TOKEN, this.createJWTToken(token))
        // this.setupAxiosInterceptors(this.createJWTToken(token))
    }

    //Set axios request headers to correct JWT token so user's requests are
    //authenticated
    setupAxiosInterceptors(token) {
        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = token
                }
                return config
            }
        )
    }


    //Append JWT token string appropriately for backend use
    createJWTToken(token) {
        return 'Bearer ' + token
    }

}

export default new AuthenticationService()