import React from 'react';
import PageContainer from "../components/PageContainer";
import navButton from "../components/NavButton";
import NavButton from "../components/NavButton";
import {GetServerSidePropsContext} from "next";
import {initializeApollo} from "../lib/ApolloClient";
import {ApolloClient, gql} from "@apollo/client";
import GridSchema from "../components/GridSchema";
import serverAuth from '../components/serverAuth';
import {getUserSchemes} from "../generated/apollo/getUserSchemes";
import SchemesList from "../components/SchemesList";
import Container from "../components/Container";
const GET_USER_SCHEMES =  gql`
    query getUserSchemes {
        getUserSchemes {
            id
            name
        }
    }

`
function Schemes({data} :any) {
    console.log(data);
    return (
            <Container>
                <h1>Список схем</h1>
                <SchemesList
                    initialValues={data}
                />
            </Container>


    );
}

export default Schemes;

export const getServerSideProps = serverAuth(async (ctx: GetServerSidePropsContext, apolloClient :ApolloClient<typeof ctx>) => {

    let result = {data: [], err: ''};
    await apolloClient.query<getUserSchemes>({
        query: GET_USER_SCHEMES,
    }).then((res: any) => {
        result.data = res.data.getUserSchemes;
    }).catch((err: any) => {
        result.err = err.message;
    })
    return {
        props: result
    }
})