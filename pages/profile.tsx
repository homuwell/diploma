import React, {useState} from 'react';

import {ApolloClient, ApolloError, gql, NormalizedCache, NormalizedCacheObject, useMutation} from "@apollo/client";
import {GetServerSidePropsContext} from "next";

import serverAuth from '../components/serverAuth';
import {getUserData} from "../generated/apollo/getUserData";


const UPLOAD_USER_PICTURE = gql`
    mutation uploadUserPicture (
        $picture: Upload!
    ) {
        uploadUserPicture(picture: $picture) {
            login
        }
    }


`

const GET_USER_DATA_QUERY = gql`
    query getUserData {
        getUserData{
                        login
                        name
                        surname
                        phoneNumber
                        email
                        role
                        }
      }
    
    
`
function Profile(props: any) {
    const [file,setFile] = useState<any>(null);
    const [uploadUserPicture] = useMutation(UPLOAD_USER_PICTURE);
    const addPicture = (e:any) => {
        e.preventDefault();
        console.log(file);
        uploadUserPicture({
            variables: {
                picture: file
            }
        }).then(()=>{
            console.log('success');
        }).catch(err => {
            console.log('err: ' +err.message);
        })
    }
    return (

        <>
            <h1>Привет мир!</h1>
            {props?.error && <p>{props.error}</p>}
            {props?.data &&
                <ul>
                    {Object.keys(props.data).map((visit, index) => <li key={index}>{visit} : {props.data[visit]}</li>)}
                </ul>
          }
            <form>
                <input type="file"
                onChange={ ({target: {files}}) => {
                    console.log(files![0]);
                    setFile(files![0]);
                }}
                />
                <button
                    onClick={addPicture}

                >

                </button>
            </form>
        </>
    );
};

export const  getServerSideProps = serverAuth (async (ctx: GetServerSidePropsContext, apolloClient :ApolloClient<typeof ctx>) => {
    let obj;
    await apolloClient.query<getUserData>({
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