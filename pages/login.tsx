import React, {useContext, useEffect} from 'react';
import FormContainer from "../components/FormContainer";
import ResponseBox from "../components/responseBox";
import MyInput from "../components/MyInput";
import RequireElem from "../components/RequireElem";
import Button from "../components/Button";
import Link from 'next/link'
import {gql, useMutation} from '@apollo/client';
import {loginForm} from '../lib/loginForm'
import useForm from "../hooks/useForm";
import {UserContext} from "../lib/userContext";
import { useRouter } from 'next/router'
import {loginUser, loginUserVariables} from "../generated/apollo/loginUser";
const LOGIN_USER_MUTATION = gql`
    mutation loginUser(
    $login: String!
    $password: String!
         ) {
         loginUser(
         login: $login
         password: $password
         ) {
         refreshToken
         accessToken
         }
      }
`
function Login(props : any) {
    const router = useRouter();
    const [user,setUser] = useContext(UserContext);
    const [response, setResponse] = React.useState({type: '', message: ''});
    useEffect(() => {
        if (router.query?.err === 'unauthorised') {
            setResponse({message: 'Для просмотра этой страницы необходмо войти в аккаунт', type: 'error'});
        }
    },[router.query])
    const [loginUser] = useMutation<loginUser, loginUserVariables>(LOGIN_USER_MUTATION);
    const [form,renderFormInputs, isFormValid] = useForm(loginForm);
    const logUser = (e: any) => {
        e.preventDefault();
        loginUser({
            variables: {
                login: form.login.value,
                password: form.password.value
            }
        }).then((msg) => {
            setResponse({type: 'success', message: 'Вы успешно вошли в аккаунт'});

            console.log(form.login.value);
            setUser(form.login.value);
        }).catch((err )=> {
            setResponse({type: 'error', message: err.message});
        })
    }
    return (
        <>
            <FormContainer name ='Вход в Аккаунт'>
                <form>
                    {response && <p>{response.message}</p>}
                    {renderFormInputs()}
                    <Link href='reset/password'>
                        <a>Забыли пароль?</a>
                    </Link>
                    <Button disabled = {!isFormValid()} type='submit' callback={logUser}>Войти</Button>
                </form>
            </FormContainer>

        </>
    );
}

export default Login;