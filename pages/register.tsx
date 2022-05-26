import React, {useCallback, useState, useEffect} from 'react';
import MyInput from '../components/MyInput'
import FormContainer from "../components/FormContainer";
import RequireElem from "../components/RequireElem";
import Button from "../components/Button";
import ResponseBox from "../components/responseBox";
import {gql, useMutation} from '@apollo/client';
import useForm from "../hooks/useForm";
import {registerForm} from "../lib/registerForm";
import {createUser, createUserVariables} from "../generated/apollo/createUser";
const CREATE_USER_MUTATION = gql`
    mutation createUser(
    $login: String!
     $name: String!
      $surname: String!
       $email: String!
        $phoneNumber: String!
         $password: String!
         ) {
         createUser(
         login: $login
         name: $name
         surname: $surname
         email: $email
         phoneNumber: $phoneNumber
         password: $password
         ) {
         refreshToken
         accessToken
         }
      }
`
function Register() {
    const [registerUser] = useMutation<createUser, createUserVariables>(CREATE_USER_MUTATION);
    const [response, setResponse] = React.useState({type: '', message: ''})
    const [form,renderFormInputs, isFormValid] = useForm(registerForm);



    const  submitRegistration = (e: any) => {
        e.preventDefault();

            registerUser({
                variables: {
                    login: form.login.value,
                    name: form.name.value,
                    surname: form.surname.value,
                    phoneNumber: form.phoneNumber.value,
                    email: form.email.value,
                    password: form.password.value
                }
            }).then((msg) => {
                setResponse({type: 'success', message: 'Вы успешно зарегистрировались'});
            }).catch((err)=> {
                setResponse({type: 'error', message: err.message});
            })

    }


    return (
        <FormContainer name ='Регистрация'>
        <form>
            {response && <p>{response.message}</p>}
            {renderFormInputs()}
            <Button disabled = {!isFormValid()} type='submit' callback={submitRegistration}>Зарегистрироваться</Button>
        </form>
        </FormContainer>
    );
}

export default Register;

