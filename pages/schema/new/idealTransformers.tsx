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
            ...createFormFieldConfig(`Первый отрицательный узел идеального трансформатора №${i}`, `mFirstNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`mFirstNode${i}`),
                minNumRule(`mFirstNode${i}`, 0),
                maxNumRule(`mFirstNode${i}`, 100)
            ]
        }
        form[`pFirstNode${i}`] = {
            ...createFormFieldConfig(`Первый положительный узел идеального трансформатора${i}, кОм`, `pFirstNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`pFirstNode${i}`),
                minNumRule(`pFirstNode${i}`, 0),
                maxNumRule(`pFirstNode${i}`, 100)
            ]
        }
        form[`mSecondNode${i}`] = {
            ...createFormFieldConfig(`Второй отрицательный узел идеального трансформатора №${i}`, `mSecondNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`mSecondNode${i}`),
                minNumRule(`mSecondNode${i}`, 0),
                maxNumRule(`mSecondNode${i}`, 100)
            ]
        }
        form[`pSecondNode${i}`] = {
            ...createFormFieldConfig(`Второй положительный узел идеального трансформатора${i}, кОм`, `pSecondNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`pSecondNode${i}`),
                minNumRule(`pSecondNode${i}`, 0),
                maxNumRule(`pSecondNode${i}`, 100)
            ]
        }
        form[`gain${i}`] = {
            ...createFormFieldConfig(`Коэффициент усиления ИНУН${i}, кОм`, `gain${i}`,'number'),
            validationRules: [
                isEmptyRule(`gain${i}`),
                minNumRule(`gain${i}`, 0),
                maxNumRule(`gain${i}`, 100)
            ]
        }
    }
    return form;
}

const getGraphQLData = (form: any, num:any) => {
    let idealTransformers = [];
    for(let i = 0; i< num;i++) {
        idealTransformers.push({
            mFirstNode: +form[`mFirstNode${i}`].value,
            pFirstNode: +form[`pFirstNode${i}`].value,
            mSecondNode: +form[`mSecondNode${i}`].value,
            pSecondNode: +form[`pSecondNode${i}`].value,
            gain: +form[`gain${i}`].value
        })
    }
    return {idealTransformers};
}
const CREATE_IDEAL_TRANSFORMERS_MUTATION = gql`
    mutation createIdealTransformers(
        $schemaId: Int!
        $idealTransformers: [InputIdealTransformersType!]!
    ) {
        createIdealTransformers(
            schemaId: $schemaId
            idealTransformers: $idealTransformers
        ) {
            id
        }
    }
`
const IdealTransformers = () => {
    const router = useRouter();
    return (
        <>
            <MyForm router={router} elemName={'idealTransformers'} name='Идеальные трансформаторы схемы' elemForm={getResistorForm(Number(router.query.idealTransformers))} mutation={CREATE_IDEAL_TRANSFORMERS_MUTATION} getData={getGraphQLData} />
        </>
    );
};

//auth user
export const  getServerSideProps = serverAuth (async (ctx: GetServerSidePropsContext) => {
    return {
        props: {}
    }
})

export default IdealTransformers;