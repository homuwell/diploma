import {
    ApolloClient, ApolloLink,
    concat, FetchResult, from, gql,
    InMemoryCache,
    NormalizedCacheObject, Observable, split,
} from '@apollo/client'
import { onError} from '@apollo/link-error'
import { createUploadLink} from 'apollo-upload-client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import type { AppProps } from 'next/app'
import { useMemo } from 'react'
import cookie from "cookie";
import {setCookies} from "cookies-next";
import {GetServerSidePropsContext} from "next";
import {getMainDefinition} from "@apollo/client/utilities";
const REFRESH_ACCESS_TOKEN = gql`
mutation refreshAccessToken($token: String) {
  refreshAccessToken(token: $token) {
    accessToken
  }
}
`

const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

const  getNewToken = async (refreshToken: string):Promise<any>  => {

    return apolloClient?.mutate({
        mutation: REFRESH_ACCESS_TOKEN,
        variables: {
            token: refreshToken
        }
    })

}




const createApolloClient = (context: any = null) => {

    const errorLink = onError(({graphQLErrors, networkError, operation, forward}) => {
        if (graphQLErrors) {
            for (let err of graphQLErrors) {
                switch (err.extensions.code) {
                    case 'UNAUTHENTICATED':
                        return new Observable(observer => {
                            let token : string | null = '';
                            if (context) { // if using ssr you get refresh token from server
                                token = cookie.parse(operation.getContext().headers?.cookie).refreshToken;
                            }  else {  // if using on client you get token in mutation
                                token = null;
                            }
                            client.mutate({ // get token from graphql server
                                mutation: REFRESH_ACCESS_TOKEN,
                                variables: {
                                    token
                                }
                            }).then(({data}) => {
                                if (context) { // create new context with access token for resolver
                                    console.log(data);
                                    const token = data.refreshAccessToken?.accessToken;
                                    let newCookie = cookie.parse(operation.getContext().headers?.cookie);
                                    if (newCookie?.acceesToken) { // if access token existed but was wrong
                                        newCookie.acceesToken = token;
                                    } else { // if access token didn't exist
                                        newCookie = {
                                            ...newCookie,
                                            accessToken: token
                                        }
                                    }
                                    const strCookie = `refreshToken=${newCookie.refreshToken}; accessToken=${newCookie.accessToken}`

                                    operation.setContext(({headers = {}}) => ({
                                            headers: {
                                                // Re-add old headers
                                                ...headers,
                                                cookie: strCookie,
                                            }

                                        })
                                    );
                                    context.req.cookies.accessToken = token;
                                    context.req.authorization = `bearer ${token}`;
                                    setCookies('accessToken', token,{req: context.req, res: context.res, path: '/', httpOnly: true, domain: 'localhost', maxAge: 30 * 60});
                                }
                                const subscriber = {
                                    next: observer.next.bind(observer),
                                    error: observer.error.bind(observer),
                                    complete: observer.complete.bind(observer)
                                };

                                // Retry last failed request
                                forward(operation).subscribe(subscriber);
                            }).catch((error) => {

                                observer.error(error);
                            })

                        })

                }
            }
            graphQLErrors.forEach(({ message, locations, path }) =>
                console.log(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                )
            )
            if (networkError) {
                console.log(`[Network error]: ${networkError}`);
            }
        }
    })

    const wsLink = typeof window !== 'undefined' ? new GraphQLWsLink(createClient({
        url: 'ws://localhost:4000/api/graphql',
    })): null;





    const authLink = new ApolloLink((operation, forward) => {
        if(context) {
            let accessToken = '';
            if (context.req.cookies?.accessToken) {
                accessToken = context.req.cookies?.accessToken
            }
            operation.setContext(({headers = {}}) => ({
                headers: {
                    ...headers,
                    cookie: context.req.headers?.cookie,
                    authorization: `Bearer ${accessToken}`,
                }
            }));
        } else {
            operation.setContext(({headers = {}}) => ({
                headers: {
                    ...headers
                }
            }));
        }
        return forward(operation);
    })


    const httpLink =   createUploadLink({
            uri: 'http://localhost:3000/api/graphql',
            // Make sure that CORS and cookies work

        fetchOptions: {
                mode: 'cors',

        }


        });

    const splitLink =  typeof window !== 'undefined' ? split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            );
        },
        wsLink!,
        httpLink,
    ): httpLink;



    const client = new ApolloClient({
        // SSR only for Node.js
        connectToDevTools: true,
        credentials: 'same-origin',
        ssrMode: typeof window === 'undefined',
        // @ts-ignore
        link:  from([authLink, errorLink, splitLink]),
        cache: new InMemoryCache({
            addTypename: false
        }),
    })

    return client;
}

type InitialState = NormalizedCacheObject | undefined

interface IInitializeApollo {
    context?: GetServerSidePropsContext | null,
    initialState?: InitialState | null
}

export const initializeApollo = (
    { context, initialState }: IInitializeApollo = {
        context: null,
        initialState: null,
    }
) => {
    const _apolloClient = apolloClient ?? createApolloClient(context)

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // get hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract()

        // Merge the existing cache into data passed from getStaticProps/getServerSideProps
        const data = merge(initialState, existingCache, {
            // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray, sourceArray) => [
                ...sourceArray,
                ...destinationArray.filter((d) =>
                    sourceArray.every((s) => !isEqual(d, s))
                ),
            ],
        })

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data)
    }

    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}

export const addApolloState = (
    client: ApolloClient<NormalizedCacheObject>,
    pageProps: AppProps['pageProps']
) => {
    if (pageProps?.props) {
        pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
    }

    return pageProps
}

export function useApollo(pageProps: AppProps['pageProps']) {
    const state = pageProps[APOLLO_STATE_PROP_NAME]
    const store = useMemo(() => initializeApollo({ initialState: state }), [
        state,
    ])
    return store
}