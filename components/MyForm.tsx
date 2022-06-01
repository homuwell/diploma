import React from 'react';
import useForm from '../hooks/useForm'
import {loginForm} from "../lib/loginForm";
import PageContainer from "./PageContainer";
import Button from "./Button";
import {useMutation} from "@apollo/client";
import Container from "./Container";
function MyForm({router, elemName, name,elemForm, mutation, getData} :any) {
    const [submitMutation] = useMutation(mutation);
    console.log(router.query);
    const [response, setResponse] = React.useState({type: '', message: ''});
    const submitForm = (e: any) => {
        e.preventDefault();
        let arr;
        if((router.query[elemName] as string).includes('+')) {
            arr = (router.query[elemName] as string).split('+').map(elem => +elem);
        } else {
            arr = [+router.query[elemName]];
        }
        submitMutation({
            variables: {
                schemaId: +router.query.schemaId,
               ...getData(form,...arr)
            }
        }).then((res) => {
            setResponse({type: 'success', message: 'Вы успешно ' + elemName});
            delete router.query[elemName];
            const id = router.query.schemaId;
            delete router.query.schemaId;
            if (Object.keys(router.query).length === 0 ) {
                router.push({
                    pathname: `/schema/new/calculationsDirectives`,
                    query: {
                        schemaId: id
                    }
                })
            } else {
                router.push({
                    pathname: `/schema/new/${Object.keys(router.query)[0]}`,
                    query: {
                        schemaId: id,
                        ...router.query
                    }
                })
            }
        }).catch((err)=> {

            setResponse({type: 'error', message: err.message});
        })
    }
    const [form,renderFormInputs, isFormValid] = useForm(elemForm);
    return (
        <Container>
            {response && <p>{response.message}</p>}
            <h1>{name}</h1>
            {renderFormInputs()}
            <Button disabled = {!isFormValid()} type='submit' callback={submitForm}>Войти</Button>
        </Container>
    );
}

export default MyForm;