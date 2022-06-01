import React from 'react';
import {initializeApollo} from "../../../lib/ApolloClient";
import {useRouter} from "next/router";
import {createFormFieldConfig} from "../../../lib/formConfig";
import {isEmptyRule, maxLengthRule, maxNumRule, minLengthRule, minNumRule} from "../../../lib/ValidationRules";
import MyForm from "../../../components/MyForm";
import {gql} from "@apollo/client";
import serverAuth from "../../../components/serverAuth";
import {GetServerSidePropsContext} from "next";
const getResistorForm = (num: any) => {
    let form :any = {};
    for(let i = 0; i<num; i++) {
        form[`mFirstNode${i}`] = {
            ...createFormFieldConfig(`Первый отрицательный узел операционного усилителя №${i}`, `mFirstNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`mFirstNode${i}`),
                minNumRule(`mFirstNode${i}`, 0),
                maxNumRule(`mFirstNode${i}`, 100)
            ]
        }
        form[`pFirstNode${i}`] = {
            ...createFormFieldConfig(`Первый положительный узел операционного усилителя${i}, кОм`, `pFirstNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`pFirstNode${i}`),
                minNumRule(`pFirstNode${i}`, 0),
                maxNumRule(`pFirstNode${i}`, 100)
            ]
        }
        form[`mSecondNode${i}`] = {
            ...createFormFieldConfig(`Второй отрицательный узел операционного усилителя№${i}`, `mSecondNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`mSecondNode${i}`),
                minNumRule(`mSecondNode${i}`, 0),
                maxNumRule(`mSecondNode${i}`, 100)
            ]
        }
        form[`pSecondNode${i}`] = {
            ...createFormFieldConfig(`Второй положительный узел операционного усилителя${i}, кОм`, `pSecondNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`pSecondNode${i}`),
                minNumRule(`pSecondNode${i}`, 0),
                maxNumRule(`pSecondNode${i}`, 100)
            ]
        }
        form[`rIn${i}`] = {
            ...createFormFieldConfig(`rIn операционного усилителя${i}`, `rIn${i}`,'number'),
            validationRules: [
                isEmptyRule(`rIn${i}`),
                minNumRule(`rIn${i}`, 0),
                maxNumRule(`rIn${i}`, 100)
            ]
        }
        form[`rOut${i}`] = {
            ...createFormFieldConfig(`rOut операционного усилителя${i}, кОм`, `rOut${i}`,'number'),
            validationRules: [
                isEmptyRule(`rOut${i}`),
                minNumRule(`rOut${i}`, 0),
                maxNumRule(`rOut${i}`, 100)
            ]
        }
        form[`u${i}`] = {
            ...createFormFieldConfig(`u операционного усилителя${i}`, `u${i}`,'number'),
            validationRules: [
                isEmptyRule(`u${i}`),
                minNumRule(`u${i}`, 0),
                maxNumRule(`u${i}`, 100)
            ]
        }
        form[`fT${i}`] = {
            ...createFormFieldConfig(`fT операционного усилителя${i}, кОм`, `fT${i}`,'number'),
            validationRules: [
                isEmptyRule(`fT${i}`),
                minNumRule(`fT${i}`, 0),
                maxNumRule(`fT${i}`, 100)
            ]
        }
    }
    return form;
}

const getGraphQLData = (form: any, num:any) => {
    let operationAmplifiers = [];
    for(let i = 0; i< num;i++) {
        operationAmplifiers.push({
            mFirstNode: +form[`mFirstNode${i}`].value,
            pFirstNode: +form[`pFirstNode${i}`].value,
            mSecondNode: +form[`mSecondNode${i}`].value,
            pSecondNode: +form[`pSecondNode${i}`].value,
            rIn: +form[`rIn${i}`].value,
            rOut: +form[`rOut${i}`].value,
            u: +form[`u${i}`].value,
            fT: +form[`fT${i}`].value
        })
    }
    return {operationAmplifiers};
}
const CREATE_OPERATION_AMPLIFIERS_MUTATION = gql`
    mutation createOperationAmplifiers(
        $schemaId: Int!
        $operationAmplifiers: [InputOperationAmplifiersType!]!
    ) {
        createOperationAmplifiers(
            schemaId: $schemaId
            operationAmplifiers: $operationAmplifiers
        ) {
            id
        }
    }
`
const OperationAmplifiers = () => {
    const router = useRouter();
    return (
        <>
            <MyForm router={router} elemName={'operationAmplifiers'} name='Операционные усилители схемы' elemForm={getResistorForm(Number(router.query.operationAmplifiers))} mutation={CREATE_OPERATION_AMPLIFIERS_MUTATION} getData={getGraphQLData} />
        </>
    );
};

//auth user
export const  getServerSideProps = serverAuth (async (ctx: GetServerSidePropsContext) => {
    return {
        props: {}
    }
})

export default OperationAmplifiers;