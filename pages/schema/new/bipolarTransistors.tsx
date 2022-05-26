import {useRouter} from "next/router";
import {createFormFieldConfig} from "../../../lib/formConfig";
import {isEmptyRule, maxLengthRule, maxNumRule, minLengthRule, minNumRule} from "../../../lib/ValidationRules";
import MyForm from "../../../components/MyForm";
import {gql} from "@apollo/client";
import serverAuth from "../../../components/serverAuth";
import {GetServerSidePropsContext} from "next";
const getBipolarTransistors = (num: any) => {
    let form :any = {};
    for(let i = 0; i<num; i++) {
        form[`ne${i}`] = {
            ...createFormFieldConfig(`Узел эмиттера биполярного транзистора №${i}`, `ne${i}`,'number'),
            validationRules: [
                isEmptyRule(`ne${i}`),
                minNumRule(`ne${i}`, 0),
                maxNumRule(`ne${i}`, 100)
            ]
        }
        form[`nc${i}`] = {
            ...createFormFieldConfig(`Узел коллектора биполярного транзистора №${i},`, `nc${i}`,'number'),
            validationRules: [
                isEmptyRule(`nc${i}`),
                minNumRule(`nc${i}`, 0),
                maxNumRule(`nc${i}`, 100)
            ]
        }
        form[`nb${i}`] = {
            ...createFormFieldConfig(`Узел базы биполярного транзистора №${i}`, `nb${i}`,'number'),
            validationRules: [
                isEmptyRule(`nb${i}`),
                minNumRule(`nb${i}`, 0),
                maxNumRule(`nb${i}`, 100)
            ]
        }
        form[`Rb${i}`] = {
            ...createFormFieldConfig(`Сопротивление базы биполярного транзистора №${i}`, `Rb${i}`,'number'),
            validationRules: [
                isEmptyRule(`Rb${i}`),
                minNumRule(`Rb${i}`, 0),
                maxNumRule(`Rb${i}`, 100)
            ]
        }
        form[`Re${i}`] = {
            ...createFormFieldConfig(`Сопротивление эмиттера биполярного транзистора №${i}`, `Re${i}`,'number'),
            validationRules: [
                isEmptyRule(`Re${i}`),
                minNumRule(`Re${i}`, 0),
                maxNumRule(`Re${i}`, 100)
            ]
        }
        form[`Rc${i}`] = {
            ...createFormFieldConfig(`Сопротивление коллектора биполярного транзистора №${i}`, `Rc${i}`,'number'),
            validationRules: [
                isEmptyRule(`Rc${i}`),
                minNumRule(`Rc${i}`, 0),
                maxNumRule(`Rc${i}`, 100)
            ]
        }
        form[`b${i}`] = {
            ...createFormFieldConfig(`коэффициент пропорциональности биполярного транзистора №${i}`, `b${i}`,'number'),
            validationRules: [
                isEmptyRule(`b${i}`),
                minNumRule(`b${i}`, 0),
                maxNumRule(`b${i}`, 100)
            ]
        }
        form[`Ce${i}`] = {
            ...createFormFieldConfig(`Ёмкость эмиттера биполярного транзистора №${i}`, `Ce${i}`,'number'),
            validationRules: [
                isEmptyRule(`Ce${i}`),
                minNumRule(`Ce${i}`, 0),
                maxNumRule(`Ce${i}`, 100)
            ]
        }
        form[`Cc${i}`] = {
            ...createFormFieldConfig(`Ёмкость коллектора биполярного транзистора №${i}`, `Cc${i}`,'number'),
            validationRules: [
                isEmptyRule(`Cc${i}`),
                minNumRule(`Cc${i}`, 0),
                maxNumRule(`Cc${i}`, 100)
            ]
        }
    }
    return form;
}

const getGraphQLData = (form: any, num:any) => {
    let bipolarTransistors = [];
    for(let i = 0; i< num;i++) {
        bipolarTransistors.push({
            ne: +form[`ne${i}`].value,
            nc: +form[`nc${i}`].value,
            nb: +form[`nb${i}`].value,
            Rb: +form[`Rb${i}`].value,
            Re: +form[`Re${i}`].value,
            Rc: +form[`Rc${i}`].value,
            Ce: +form[`Ce${i}`].value,
            Cc: +form[`Cc${i}`].value,
            b: +form[`b${i}`].value,
        })
    }
    return {bipolarTransistors};
}
const CREATE_BIPOLAR_TRANSISTORS_MUTATION = gql`
    mutation createBipolarTransistors(
        $schemaId: Int!
        $bipolarTransistors: [InputBipolarTransistors!]!
    ) {
        createBipolarTransistors(
            schemaId: $schemaId
            bipolarTransistors: $bipolarTransistors
        ) {
            Rb
        }
    }
`
const bipolarTransistors = () => {
    const router = useRouter();
    return (
        <>
            <MyForm router={router} elemName={'bipolarTransistors'} name='Биполярные транзисторы схемы' elemForm={getBipolarTransistors(Number(router.query.bipolarTransistors))} mutation={CREATE_BIPOLAR_TRANSISTORS_MUTATION} getData={getGraphQLData} />
        </>
    );
};

export default bipolarTransistors;