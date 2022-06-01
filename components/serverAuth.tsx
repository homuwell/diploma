import React from 'react';
import {initializeApollo} from "../lib/ApolloClient";
import {gql} from "@apollo/client";
import {authUser} from "../generated/apollo/authUser";
import {AUTH_USER_MUTATION} from "../graphql/mutations";

export default function ServerAuth(gssp: Function) {
         return  async (ctx: any, apolloClient = initializeApollo({context: ctx})) => {
            let isVerify = false;
            if (ctx.req) {
                 await apolloClient.mutate<authUser>({
                    mutation: AUTH_USER_MUTATION,
                }).then((res) => {
                    isVerify = true;
                }).catch((err :any) => {
                    isVerify = false;
                    console.log(err);
                })
            }
            if(!isVerify) {

                ctx.res.writeHead(302, {
                    Location: 'https://localhost:4000/login?err=unauthorised'
                });
                ctx.res.end();
            }
             return await gssp(ctx, apolloClient)
        }
}


