import {useRouter} from "next/router";
import {createFormFieldConfig} from "../../../lib/formConfig";
import {isEmptyRule, maxLengthRule, maxNumRule, minLengthRule, minNumRule} from "../../../lib/ValidationRules";
import MyForm from "../../../components/MyForm";
import {gql} from "@apollo/client";
import serverAuth from "../../../components/serverAuth";
import {GetServerSidePropsContext} from "next";
const getTransformers = (num: any) => {
    let form :any = {};
    for(let i = 0; i<num; i++) {
        form[`pFirstNode${i}`] = {
            ...createFormFieldConfig(`Первый положительный узел трансформатора №${i}`, `pFirstNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`pFirstNode${i}`),
                minNumRule(`pFirstNode${i}`, 0),
                maxNumRule(`pFirstNode${i}`, 100)
            ]
        }
        form[`mFirstNode${i}`] = {
            ...createFormFieldConfig(`Первый отрицательный узел трансформатора №${i}`, `mFirstNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`mFirstNode${i}`),
                minNumRule(`mFirstNode${i}`, 0),
                maxNumRule(`mFirstNode${i}`, 100)
            ]
        }
        form[`pSecondNode${i}`] = {
            ...createFormFieldConfig(`Второй положительный узел трансформатора №${i}`, `pSecondNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`pSecondNode${i}`),
                minNumRule(`pSecondNode${i}`, 0),
                maxNumRule(`pSecondNode${i}`, 100)
            ]
        }
        form[`mSecondNode${i}`] = {
            ...createFormFieldConfig(`Второй отрицательный узел трансформатора №${i}`, `mSecondNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`mSecondNode${i}`),
                minNumRule(`mSecondNode${i}`, 0),
                maxNumRule(`mSecondNode${i}`, 100)
            ]
        }
        form[`R1${i}`] = {
            ...createFormFieldConfig(`Активное сопротивление первичной обмотки трансформатора №${i}`, `R1${i}`,'number'),
            validationRules: [
                isEmptyRule(`R1${i}`),
                minNumRule(`R1${i}`, 0),
                maxNumRule(`R1${i}`, 100)
            ]
        }
        form[`L1${i}`] = {
            ...createFormFieldConfig(`Индуктивность первичной обмотки трансформатора №${i}`, `L1${i}`,'number'),
            validationRules: [
                isEmptyRule(`L1${i}`),
                minNumRule(`L1${i}`, 0),
                maxNumRule(`L1${i}`, 100)
            ]
        }
        form[`R2${i}`] = {
            ...createFormFieldConfig(`Активное сопротивление вторичной обмотки трансформатора №${i}`, `R2${i}`,'number'),
            validationRules: [
                isEmptyRule(`R2${i}`),
                minNumRule(`R2${i}`, 0),
                maxNumRule(`R2${i}`, 100)
            ]
        }
        form[`L2${i}`] = {
            ...createFormFieldConfig(`Индуктивность вторичной обмотки трансформатора №${i}`, `L2${i}`,'number'),
            validationRules: [
                isEmptyRule(`L2${i}`),
                minNumRule(`L2${i}`, 0),
                maxNumRule(`L2${i}`, 100)
            ]
        }
        form[`M${i}`] = {
            ...createFormFieldConfig(`Коэффициент трансформации трансформатора №${i}`, `M${i}`,'number'),
            validationRules: [
                isEmptyRule(`M${i}`),
                minNumRule(`M${i}`, 0),
                maxNumRule(`M${i}`, 100)
            ]
        }
    }
    return form;
}

const getGraphQLData = (form: any, num:any) => {
    let transformers = [];
    for(let i = 0; i< num;i++) {
        transformers.push({
            pFirstNode: +form[`pFirstNode${i}`].value,
            mFirstNode: +form[`mFirstNode${i}`].value,
            pSecondNode: +form[`pSecondNode${i}`].value,
            mSecondNode: +form[`mSecondNode${i}`].value,
            R1: +form[`R1${i}`].value,
            L1: +form[`L1${i}`].value,
            R2: +form[`R2${i}`].value,
            L2: +form[`L2${i}`].value,
            M: +form[`M${i}`].value
        })
    }
    return {transformers};
}
const CREATE_TRANSFORMERS_MUTATION = gql`
    mutation createTransformers(
        $schemaId: Int!
        $transformers: [InputTransformers!]!
    ) {
        createTransformers(
            schemaId: $schemaId
            transformers: $transformers
        ) {
            id
        }
    }
`
const unipolarTransistors = () => {
    const router = useRouter();
    return (
        <>
            <MyForm router={router} elemName={'transformers'} name='Трансформаторы схемы' elemForm={getTransformers(Number(router.query.operationAmplifiers))} mutation={CREATE_TRANSFORMERS_MUTATION} getData={getGraphQLData} />
        </>
    );
};

export default unipolarTransistors;