import React from 'react';
import {initializeApollo} from "../../../lib/ApolloClient";
import {useRouter} from "next/router";
import {createFormFieldConfig} from "../../../lib/formConfig";
import {isEmptyRule, maxLengthRule, maxNumRule, minLengthRule, minNumRule} from "../../../lib/ValidationRules";
import MyForm from "../../../components/MyForm";
import {gql} from "@apollo/client";
import serverAuth from "../../../components/serverAuth";
import {GetServerSidePropsContext} from "next";
const getInductorsForm = (num: any) => {
    let form :any = {};
    for(let i = 0; i<num; i++) {
        form[`induction${i}`] = {
            ...createFormFieldConfig(`Индуктивность Индуктора №${i}, кОм`, `induction${i}`,'number'),
            validationRules: [
                isEmptyRule(`induction${i}`),
                minNumRule(`induction${i}`, 0),
                maxNumRule(`induction${i}`, 100)
            ]
        }
        form[`pNode${i}`] = {
            ...createFormFieldConfig(`положительный узел Индуктора №${i}`, `pNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`pNode${i}`),
                minNumRule(`pNode${i}`, 0),
                maxNumRule(`pNode${i}`, 100)
            ]
        }
        form[`mNode${i}`] = {
            ...createFormFieldConfig(`Отрицательный узел Индуктора${i}, кОм`, `mNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`mNode${i}`),
                minNumRule(`mNode${i}`, 0),
                maxNumRule(`mNode${i}`, 100)
            ]
        }
    }
    return form;
}

const getGraphQLData = (form: any, num:any) => {
    console.log(form);
    let inductors = [];
    for(let i = 0; i< num;i++) {
        inductors.push({
            induction: +form[`induction${i}`].value,
            pNode: +form[`pNode${i}`].value,
            mNode: +form[`mNode${i}`].value
        })
    }
    return {inductors};
}
const CREATE_INDUCTORS_MUTATION = gql`
    mutation createInductors(
        $schemaId: Int!
        $inductors: [InputInductorsType!]!
    ) {
        createInductors(
            schemaId: $schemaId
            inductors: $inductors
        ) {
            id
        }
    }
`

const Inductors = () => {
    const router = useRouter();
    return (
        <>
            <MyForm router={router} elemName={'inductors'} name='Индукторы схемы' elemForm={getInductorsForm(Number(router.query.inductors))} mutation={CREATE_INDUCTORS_MUTATION} getData={getGraphQLData} />
        </>
    );
};

//auth user
export const  getServerSideProps = serverAuth (async (ctx: GetServerSidePropsContext) => {
    return {
        props: {}
    }
})

export default Inductors;