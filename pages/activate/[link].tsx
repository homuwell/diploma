import React from 'react';
import {initializeApollo} from "../../lib/ApolloClient";
import {GetServerSideProps} from "next";
import {activateAccount, activateAccountVariables} from "../../generated/apollo/activateAccount";
import {ApolloError, gql} from "@apollo/client";

const sha256 = require('js-sha256');

 const ACTIVATE_ACCOUNT_MUTATION =gql`
    mutation activateAccount (
    $token: String!
    ) {
         activateAccount (
                    token: $token
         ) {
         login
         }
      }
`;
function Activate(props:any) {
    return(
    <>
        {props?.error && <p>{props.error}</p>}
        {props?.data && <p>{`Аккаунт ${props.data} успешно активирован`}</p>}
    </>
    );
}

export const  getServerSideProps: GetServerSideProps = async (context ) => {
    let obj = {};
    const apolloClient = initializeApollo();
    await apolloClient.mutate<activateAccount, activateAccountVariables>({
        mutation: ACTIVATE_ACCOUNT_MUTATION,
        variables: {
            token: context.params!.link as string,
        }
    }).then((res) => {
            obj= {
                data: res.data?.activateAccount?.login
            }
    }).catch( (err: ApolloError) => {                    
            obj =  {
                error: err.message
            }

    })
    return {
        props: obj
    }
}


export default Activate;

