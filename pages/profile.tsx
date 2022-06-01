import {useState, FC} from 'react';

import {ApolloClient, ApolloError, gql, NormalizedCache, NormalizedCacheObject, useMutation} from "@apollo/client";
import {GetServerSidePropsContext} from "next";

type ProfileData = {
    login: string,
    name: string,
    surname: string
    picture: string
    role: Role
    email: string
    phoneNumber: string
}

type ProfileProps = {
    data: getUserDataProfile_getUserData
    error: string
}




import serverAuth from '../components/serverAuth';
import {getUserData, getUserData_getUserData} from "../generated/apollo/getUserData";
import Container from "../components/Container";
import {Role} from "../generated/apollo/globalTypes";
import ImageCard from "../components/ImageCard";
import ProfileCard from "../components/ProfileCard";
import {getUserDataProfile, getUserDataProfile_getUserData} from "../generated/apollo/getUserDataProfile";
import ProfileInfo from "../components/ProfileInfo";



const GET_USER_DATA_QUERY = gql`
    query getUserDataProfile {
        getUserData {
                        login
                        name
                        surname
                        phoneNumber
                        email
                        role
                        picture
         }
      }
    
    
`
const Profile: FC<ProfileProps> = ({data,error}) => {
    return (
        <Container>
            {error && <p>{error}</p>}
            <h1 style={{textAlign: "center"}}>Профиль</h1>
            <ProfileInfo data={data}/>
        </Container>
    );
};

export const  getServerSideProps = serverAuth (async (ctx: GetServerSidePropsContext, apolloClient :ApolloClient<typeof ctx>) => {
    let obj;
    await apolloClient.query<getUserDataProfile>({
        query: GET_USER_DATA_QUERY
    }).then((res) => {
        obj = {
            data: res.data.getUserData
        }
    }).catch((err: ApolloError) => {
        obj = {
            error: err.message
        }
    })
    return {
        props: obj, // will be passed to the page component as props
    }
})


export default Profile;