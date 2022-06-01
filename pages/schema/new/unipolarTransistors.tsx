import {useRouter} from "next/router";
import {createFormFieldConfig} from "../../../lib/formConfig";
import {isEmptyRule, maxLengthRule, maxNumRule, minLengthRule, minNumRule} from "../../../lib/ValidationRules";
import MyForm from "../../../components/MyForm";
import {gql} from "@apollo/client";
import serverAuth from "../../../components/serverAuth";
import {GetServerSidePropsContext} from "next";
const getUnipolarTransistors = (num: any) => {
    let form :any = {};
    for(let i = 0; i<num; i++) {
        form[`nz${i}`] = {
            ...createFormFieldConfig(`Узел эатвора униполярного транзистора №${i}`, `nz${i}`,'number'),
            validationRules: [
                isEmptyRule(`nz${i}`),
                minNumRule(`nz${i}`, 0),
                maxNumRule(`nz${i}`, 100)
            ]
        }
        form[`ns${i}`] = {
            ...createFormFieldConfig(`Узел стока униполярного транзистора №${i},`, `ns${i}`,'number'),
            validationRules: [
                isEmptyRule(`ns${i}`),
                minNumRule(`ns${i}`, 0),
                maxNumRule(`ns${i}`, 100)
            ]
        }
        form[`ni${i}`] = {
            ...createFormFieldConfig(`Узел истока униполярного транзистора №${i}`, `ni${i}`,'number'),
            validationRules: [
                isEmptyRule(`ni${i}`),
                minNumRule(`ni${i}`, 0),
                maxNumRule(`ni${i}`, 100)
            ]
        }
        form[`Rc${i}`] = {
            ...createFormFieldConfig(`Сопротивление коллектора униполярного транзистора №${i}`, `Rc${i}`,'number'),
            validationRules: [
                isEmptyRule(`Rc${i}`),
                minNumRule(`Rc${i}`, 0),
                maxNumRule(`Rc${i}`, 100)
            ]
        }
        form[`Czi${i}`] = {
            ...createFormFieldConfig(`Ёмкость затвора-истока униполярного транзистора №${i}`, `Czi${i}`,'number'),
            validationRules: [
                isEmptyRule(`Czi${i}`),
                minNumRule(`Czi${i}`, 0),
                maxNumRule(`Czi${i}`, 100)
            ]
        }
        form[`Czs${i}`] = {
            ...createFormFieldConfig(`Ёмкость затвора-стока униполярного транзистора №${i}`, `Czs${i}`,'number'),
            validationRules: [
                isEmptyRule(`Czs${i}`),
                minNumRule(`Czs${i}`, 0),
                maxNumRule(`Czs${i}`, 100)
            ]
        }
        form[`Csi${i}`] = {
            ...createFormFieldConfig(`Ёмкость затвора-истока униполярного транзистора транзистора №${i}`, `Csi${i}`,'number'),
            validationRules: [
                isEmptyRule(`Csi${i}`),
                minNumRule(`Csi${i}`, 0),
                maxNumRule(`Csi${i}`, 100)
            ]
        }
        form[`S${i}`] = {
            ...createFormFieldConfig(`S униполярного транзистора №${i}`, `S${i}`,'number'),
            validationRules: [
                isEmptyRule(`S${i}`),
                minNumRule(`S${i}`, 0),
                maxNumRule(`S${i}`, 100)
            ]
        }
    }
    return form;
}

const getGraphQLData = (form: any, num:any) => {
    let unipolarTransistors = [];
    for(let i = 0; i< num;i++) {
        unipolarTransistors.push({
            nz: +form[`nz${i}`].value,
            ns: +form[`ns${i}`].value,
            ni: +form[`ni${i}`].value,
            Rc: +form[`Rc${i}`].value,
            Czi: +form[`Czi${i}`].value,
            Czs: +form[`Czs${i}`].value,
            Csi: +form[`Csi${i}`].value,
            S: +form[`S${i}`].value
        })
    }
    return {unipolarTransistors};
}
const CREATE_UNIPOLAR_TRANSISTORS_MUTATION = gql`
    mutation createUnipolarTransistors(
        $schemaId: Int!
        $unipolarTransistors: [InputUnipolarTransistors!]!
    ) {
        createUnipolarTransistors(
            schemaId: $schemaId
            unipolarTransistors: $unipolarTransistors
        ) {
            id
        }
    }
`
const UnipolarTransistors = () => {
    const router = useRouter();
    return (
        <>
            <MyForm router={router} elemName={'unipolarTransistors'} name='Униполярные транзисторы схемы' elemForm={getUnipolarTransistors(Number(router.query.unipolarTransistors))} mutation={CREATE_UNIPOLAR_TRANSISTORS_MUTATION} getData={getGraphQLData} />
        </>
    );
};

export default UnipolarTransistors;