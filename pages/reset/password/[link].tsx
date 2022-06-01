import React, {useState} from 'react';

import {initializeApollo} from "../../../lib/ApolloClient";
import {gql, useMutation} from "@apollo/client";
import FormContainer from "../../../components/FormContainer";
import Button from "../../../components/Button";
import useForm from "../../../hooks/useForm";
import {resetPasswordForm} from "../../../lib/resetPasswordForm";
import {resetPassword, resetPasswordVariables} from "../../../generated/apollo/resetPassword";



const RESET_PASSWORD_AUTH =gql`
    mutation resetPasswordAuth (
    $token: String!
    ) {
         resetPasswordAuth (
                    token: $token
         ) {
         id
         }
      }
`;

const RESET_PASSWORD =gql`
    mutation resetPassword (
    $id: Int!
    $password: String!
    ) {
         resetPassword (
                    id: $id
                    password: $password
         ) {
         login
         }
      }
`;

function ResetPassword(props:any) {
    const [resetPassword] = useMutation<resetPassword, resetPasswordVariables>(RESET_PASSWORD);
    const [form,renderFormInputs, isFormValid] = useForm(resetPasswordForm);
    const [response, setResponse] = useState({type: '', message: ''});

    if (props.error) {
        return <>{props.error}</>
    }
    const sendLink = (e: any) => {
        e.preventDefault();
        resetPassword({
            variables: {
                password: form.password.value,
                id: props.data
            }
        }).then((msg) => {
            setResponse({type: 'success', message: `Пароль аккаунта ${msg.data?.resetPassword?.login} изменён`});

        }).catch((err)=> {
            setResponse({type: 'error', message: err.message});
        })
    }
    return(
        <FormContainer name ='Изменить пароль'>
            <form>
                {response && <p>{response.message}</p>}
                {renderFormInputs()}
                <Button disabled = {!isFormValid()} type='submit' callback={sendLink}>Изменить пароль</Button>
            </form>
        </FormContainer>
    )
;
}

export async function getServerSideProps(context :any) {
    let obj;
    const apolloClient = initializeApollo();

    await apolloClient.mutate({
        mutation: RESET_PASSWORD_AUTH,
        variables: {
            token: context.params.link
        }
    }).then((res: any) => {
        obj= {
            data: res.data.resetPasswordAuth.id
        }

    }).catch( (err :any) => {
        obj =  {
            error: err.message
        }

    })
    console.log(obj);
    return {
        props: obj
    }
}


export default ResetPassword;

