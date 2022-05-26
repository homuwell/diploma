import {gql} from "@apollo/client";


export const AUTH_USER_MUTATION =  gql`
    mutation authUser {
        authUser {
            login
            role
        }
    }
    
`