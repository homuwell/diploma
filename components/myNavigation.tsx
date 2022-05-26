import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "../lib/userContext";
import Link from 'next/link'
import classes from './myNavigation.module.css'
import {gql, useMutation} from "@apollo/client";
import {initializeApollo} from "../lib/ApolloClient";
import {setCookies} from "cookies-next";
import NavButton from "./NavButton";
import {AUTH_USER_MUTATION} from '../graphql/mutations'
const LOGOUT_USER_MUTATION = gql`
    mutation logoutUser
          {
         logoutUser {
         login
         }
      }
`



function MyNavigation({ children }:any) {

    const [user,setUser] = useContext(UserContext);
    const [logoutUser] = useMutation(LOGOUT_USER_MUTATION);
    const [verifyUser] = useMutation(AUTH_USER_MUTATION);
        useEffect(()=> {
            async function authUser() {
               await verifyUser().then((res) =>{
                    setUser(res.data.authUser.login);

                }).catch((err) => {

                })
            }
            authUser();
        },[]);

    const logout = (e: any) => {
        e.preventDefault();
        logoutUser({
            mutation: LOGOUT_USER_MUTATION,
        }).then((msg) => {
            setUser('');
        }).catch((err)=> {
            console.log(err);
        })
    }

    return (

        <>
            <nav>
                <ul className={classes.navContainer}>
                    {user  ?
                        <NavButton link={'/profile'} label={user}/>
                        :
                        <NavButton link={'/register'} label={'Зарегистрироваться'} />
                    }
                    {user ?
                        <NavButton link={'/'} label={'Выйти'} callBack={logout}/>
                        :
                        <NavButton link={'/login'} label={'Войти'} />
                    }
                    {user && <NavButton link='/schemes' label='Список схем'/>}
                    <NavButton link={'/'} label={'На главную'} className={classes.navRight}/>
                </ul>
            </nav>
            {children}
        </>

    );
};

export default React.memo(MyNavigation);