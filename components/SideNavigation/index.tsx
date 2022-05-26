import  {useEffect, useState} from 'react';
import {gql, useLazyQuery, useMutation, useQuery} from "@apollo/client";
import SideNavGuest from "../SideNavGuest";
import SideNavUser from "../SideNavUser";

const GET_USER_DATA = gql`
    query getUserData {
        getUserData {
            id
            login
            picture
        }
    }
    
`

function SideNavigation() {

    const [flag,setFlag] = useState(false);
    let [getUser,{data,loading,error}] = useLazyQuery(GET_USER_DATA);
    useEffect(()=> {
        getUser().then(()=> {
            setFlag(true);
        }).catch(()=> {
            setFlag(false);
        })
    },[])
    return (
        <>
            {flag ? <SideNavUser
                id={data!.getUserData.id}
                login={data!.getUserData.login}
                picture={data!.getUserData.picture}
            /> : <SideNavGuest/>}
        </>
    );
}

export default SideNavigation;