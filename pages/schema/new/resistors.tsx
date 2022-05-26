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
        form[`resistance${i}`] = {
            ...createFormFieldConfig(`Ёмкость Резистора №${i}, кОм`, `resistance${i}`,'number'),
            validationRules: [
                isEmptyRule(`resistance${i}`),
                minNumRule(`resistance${i}`, 0),
                maxNumRule(`resistance${i}`, 100)
            ]
        }
        form[`pNode${i}`] = {
            ...createFormFieldConfig(`положительный узел Резистора №${i}`, `pNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`pNode${i}`),
                minNumRule(`pNode${i}`, 0),
                maxNumRule(`pNode${i}`, 100)
            ]
        }
        form[`mNode${i}`] = {
            ...createFormFieldConfig(`Отрицательный узел Резистора${i}, кОм`, `mNode${i}`,'number'),
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
    let resistors = [];
    for(let i = 0; i< num;i++) {
        resistors.push({
            resistance: +form[`resistance${i}`].value,
            pNode: +form[`pNode${i}`].value,
            mNode: +form[`mNode${i}`].value
        })
    }
    return {resistors};
}
const CREATE_RESISTORS_MUTATION = gql`
    mutation createResistors(
    $schemaId: Int!
    $resistors: [InputResistorsType!]!    
         ) {
            createResistors(
            schemaId: $schemaId
            resistors: $resistors 
         ) {
            id
         }
      }
`
const Resistors = () => {
    const router = useRouter();
    return (
        <>
        <MyForm router={router} elemName={'resistors'} name='Резисторы схемы' elemForm={getResistorForm(Number(router.query.resistors))} mutation={CREATE_RESISTORS_MUTATION} getData={getGraphQLData} />
        </>
    );
};


//auth user
export const  getServerSideProps = serverAuth (async (ctx: GetServerSidePropsContext) => {
    return {
        props: {}
    }
})



export default Resistors;

