import React from 'react';
import {useRouter} from "next/router";
import {createFormFieldConfig} from "../../../lib/formConfig";
import {isEmptyRule, maxLengthRule, maxNumRule, minLengthRule, minNumRule} from "../../../lib/ValidationRules";
import MyForm from "../../../components/MyForm";
import {gql} from "@apollo/client";
import serverAuth from "../../../components/serverAuth";
import {GetServerSidePropsContext} from "next";
const getResistorForm = (normal: number, freq: number) => {
    let form :any = {};
    for(let j = 0; j < normal; j++) {
        form[`mFirstNode${j}`] = {
            ...createFormFieldConfig(`Первый отрицательный узел ИНУТ №${j}`, `mFirstNode${j}`,'number'),
            validationRules: [
                isEmptyRule(`mFirstNode${j}`),
                minNumRule(`mFirstNode${j}`, 0),
                maxNumRule(`mFirstNode${j}`, 100)
            ]
        }
        form[`pFirstNode${j}`] = {
            ...createFormFieldConfig(`Первый положительный узел ИНУТ${j}, кОм`, `pFirstNode${j}`,'number'),
            validationRules: [
                isEmptyRule(`pFirstNode${j}`),
                minNumRule(`pFirstNode${j}`, 0),
                maxNumRule(`pFirstNode${j}`, 100)
            ]
        }
        form[`mSecondNode${j}`] = {
            ...createFormFieldConfig(`Второй отрицательный узел ИНУТ №${j}`, `mSecondNode${j}`,'number'),
            validationRules: [
                isEmptyRule(`mSecondNode${j}`),
                minNumRule(`mSecondNode${j}`, 0),
                maxNumRule(`mSecondNode${j}`, 100)
            ]
        }
        form[`pSecondNode${j}`] = {
            ...createFormFieldConfig(`Второй положительный узел ИНУТ${j}, кОм`, `pSecondNode${j}`,'number'),
            validationRules: [
                isEmptyRule(`pSecondNode${j}`),
                minNumRule(`pSecondNode${j}`, 0),
                maxNumRule(`pSecondNode${j}`, 100)
            ]
        }
        form[`transmission${j}`] = {
            ...createFormFieldConfig(`Проводимость передачи ИНУТ${j}, кОм`, `transmission${j}`,'number'),
            validationRules: [
                isEmptyRule(`transmission${j}`),
                minNumRule(`transmission${j}`, 0),
                maxNumRule(`transmission${j}`, 100)
            ]
        }
    }

    for(let i = normal; i < normal + freq; i++) {
        form[`mFirstNode${i}`] = {
            ...createFormFieldConfig(`Первый отрицательный узел ИНУТ №${i}`, `mFirstNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`mFirstNode${i}`),
                minNumRule(`mFirstNode${i}`, 0),
                maxNumRule(`mFirstNode${i}`, 100)
            ]
        }
        form[`pFirstNode${i}`] = {
            ...createFormFieldConfig(`Первый положительный узел ИНУТ${i}, кОм`, `pFirstNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`pFirstNode${i}`),
                minNumRule(`pFirstNode${i}`, 0),
                maxNumRule(`pFirstNode${i}`, 100)
            ]
        }
        form[`mSecondNode${i}`] = {
            ...createFormFieldConfig(`Второй отрицательный узел ИНУТ №${i}`, `mSecondNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`mSecondNode${i}`),
                minNumRule(`mSecondNode${i}`, 0),
                maxNumRule(`mSecondNode${i}`, 100)
            ]
        }
        form[`pSecondNode${i}`] = {
            ...createFormFieldConfig(`Второй положительный узел ИНУТ${i}, кОм`, `pSecondNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`pSecondNode${i}`),
                minNumRule(`pSecondNode${i}`, 0),
                maxNumRule(`pSecondNode${i}`, 100)
            ]
        }
        form[`T1${i}`] = {
            ...createFormFieldConfig(`Постоянная времени T1 ИНУТ №${i}`, `T1${i}`,'number'),
            validationRules: [
                isEmptyRule(`T1${i}`),
                minNumRule(`T1${i}`, 0),
                maxNumRule(`T1${i}`, 100)
            ]
        }
        form[`T2${i}`] = {
            ...createFormFieldConfig(`Постоянная времени T2 ИНУТ${i}, кОм`, `T2${i}`,'number'),
            validationRules: [
                isEmptyRule(`T2${i}`),
                minNumRule(`T2${i}`, 0),
                maxNumRule(`T2${i}`, 100)
            ]
        }
        form[`transmission${i}`] = {
            ...createFormFieldConfig(`Проводимость передачи ИНУТ${i}, кОм`, `transmission${i}`,'number'),
            validationRules: [
                isEmptyRule(`transmission${i}`),
                minNumRule(`transmission${i}`, 0),
                maxNumRule(`transmission${i}`, 100)
            ]
        }
    }
    return form;
}

const getGraphQLData = (form: any, normal: number, freq: number) => {
    let CCVSs = [];
    for(let i = 0; i< normal + freq;i++) {
        if (i < normal) {
            CCVSs.push({
                mFirstNode: +form[`mFirstNode${i}`].value,
                pFirstNode: +form[`pFirstNode${i}`].value,
                mSecondNode: +form[`mSecondNode${i}`].value,
                pSecondNode: +form[`pSecondNode${i}`].value,
                T1: null,
                T2: null,
                transmission: +form[`transmission${i}`].value
            })
        } else {
            CCVSs.push({
                mFirstNode: +form[`mFirstNode${i}`].value,
                pFirstNode: +form[`pFirstNode${i}`].value,
                mSecondNode: +form[`mSecondNode${i}`].value,
                pSecondNode: +form[`pSecondNode${i}`].value,
                T1: +form[`T1${i}`].value,
                T2: +form[`T2${i}`].value,
                transmission: +form[`transmission${i}`].value
            })
        }
    }
    return {CCVSs};
}
const CREATE_CCVSS_MUTATION = gql`
    mutation createCCVSs(
        $schemaId: Int!
        $CCVSs: [InputControlledSource!]!
    ) {
        createCCVSs(
            schemaId: $schemaId
            CCVSs: $CCVSs
        ) {
            id
        }
    }
`
const CCVSs = () => {
    const router = useRouter();
    let str = router.query.CCVSs;
    const CCVSs = (str! as string).split('+').map(elem => +elem);
    return (
        <>
            <MyForm router={router} elemName={'CCVSs'} name='ИНУТ схемы' elemForm={getResistorForm(CCVSs[0],CCVSs[1])} mutation={CREATE_CCVSS_MUTATION} getData={getGraphQLData} />
        </>
    );
};

//auth user
export const  getServerSideProps = serverAuth (async (ctx: GetServerSidePropsContext) => {
    return {
        props: {}
    }
})

export default CCVSs;