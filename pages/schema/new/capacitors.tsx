import React from 'react';
import {initializeApollo} from "../../../lib/ApolloClient";
import {useRouter} from "next/router";
import {createFormFieldConfig} from "../../../lib/formConfig";
import {isEmptyRule, maxLengthRule, maxNumRule, minLengthRule, minNumRule} from "../../../lib/ValidationRules";
import MyForm from "../../../components/MyForm";
import {gql} from "@apollo/client";
import serverAuth from "../../../components/serverAuth";
import {GetServerSidePropsContext} from "next";
const getCapacitorsForm = (num: any) => {
    let form :any = {};
    for(let i = 0; i<num; i++) {
        form[`capacity${i}`] = {
            ...createFormFieldConfig(`Ёмкость Конденсатора №${i}, кОм`, `capacity${i}`,'number'),
            validationRules: [
                isEmptyRule(`capacity${i}`),
                minNumRule(`capacity${i}`, 0),
                maxNumRule(`capacity${i}`, 100)
            ]
        }
        form[`pNode${i}`] = {
            ...createFormFieldConfig(`положительный узел Конденсатора №${i}`, `pNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`pNode${i}`),
                minNumRule(`pNode${i}`, 0),
                maxNumRule(`pNode${i}`, 100)
            ]
        }
        form[`mNode${i}`] = {
            ...createFormFieldConfig(`Отрицательный узел Конденсатора${i}, кОм`, `mNode${i}`,'number'),
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
    let capacitors = [];
    for(let i = 0; i< num;i++) {
        capacitors.push({
            capacity: +form[`capacity${i}`].value,
            pNode: +form[`pNode${i}`].value,
            mNode: +form[`mNode${i}`].value
        })
    }
    return {capacitors: capacitors};
}
const CREATE_CAPACITORS_MUTATION = gql`
    mutation createCapacitors(
        $schemaId: Int!
        $capacitors: [InputCapacitorsType!]!
    ) {
        createCapacitors(
            schemaId: $schemaId
            capacitors: $capacitors
        ) {
            id
        }
    }
`
const Capacitors = () => {
    const router = useRouter();
    return (
        <>
            <MyForm router={router} elemName={'capacitors'} name='Конденсаторы схемы схемы' elemForm={getCapacitorsForm(Number(router.query.capacitors))} mutation={CREATE_CAPACITORS_MUTATION} getData={getGraphQLData} />
        </>
    );
};

//auth user
export const  getServerSideProps = serverAuth (async (ctx: GetServerSidePropsContext) => {
    return {
        props: {}
    }
})
export default Capacitors;