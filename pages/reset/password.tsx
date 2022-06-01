import React, {useContext, useEffect} from 'react';

import {gql, useMutation} from "@apollo/client";
import useForm from "../../hooks/useForm";
import {resetPasswordLinkForm} from "../../lib/resetPasswordLinkForm";
import FormContainer from "../../components/FormContainer";
import Button from "../../components/Button";
import {resetPasswordLink, resetPasswordLinkVariables} from "../../generated/apollo/resetPasswordLink";
const RESET_PASSWORD_LINK_MUTATION = gql`
    mutation resetPasswordLink(
    $email: String!
         ) {
         resetPasswordLink(
         email: $email
         ) {
         email
         }
      }
`
function Password(props:any) {
    const [resetPasswordLink] = useMutation<resetPasswordLink, resetPasswordLinkVariables>(RESET_PASSWORD_LINK_MUTATION);
    const [response, setResponse] = React.useState({type: '', message: ''});
    const [form,renderFormInputs, isFormValid] = useForm(resetPasswordLinkForm);
    const sendLink = (e: any) => {
        e.preventDefault();
        resetPasswordLink({
            variables: {
                email: form.email.value,
            }
        }).then((msg) => {
            setResponse({type: 'success', message: `на ваш email: ${msg!.data!.resetPasswordLink!.email} отправлена ссылка для изменения пароля`});

        }).catch((err)=> {
            setResponse({type: 'error', message: err.message});
        })
    }
    return (
        <>
            <FormContainer name ='Восстановить пароль'>
                <form>
                    {response && <p>{response.message}</p>}
                    {renderFormInputs()}
                    <Button disabled = {!isFormValid()} type='submit' callback={sendLink}>Отправить письмо</Button>
                </form>
            </FormContainer>

        </>
    );
}

export default Password;