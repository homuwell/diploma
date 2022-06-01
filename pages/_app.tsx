import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider} from '@apollo/client';
import {initializeApollo, useApollo} from '../lib/ApolloClient'
import UserContextProvider from '../lib/userContext'
import Head from 'next/head'
import React, {useEffect} from 'react';
import {authUser} from "../generated/apollo/authUser";
import {AUTH_USER_MUTATION} from "../graphql/mutations";
import Navigation from "../components/Navigation";
export function reportWebVitals(metric :any) {
    console.log(metric)
}




function MyApp({ Component, pageProps}:any) {
  const apolloClient = useApollo(pageProps);
  return (
  <ApolloProvider client={apolloClient}>
      <UserContextProvider>
          <Head>

          </Head>
          <Navigation>
              <Component {...pageProps} />
          </Navigation>
     </UserContextProvider>
</ApolloProvider>


  )
}

export default MyApp
