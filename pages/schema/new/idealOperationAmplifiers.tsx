
import {useRouter} from "next/router";
import {createFormFieldConfig} from "../../../lib/formConfig";
import {isEmptyRule, maxLengthRule, maxNumRule, minLengthRule, minNumRule} from "../../../lib/ValidationRules";
import MyForm from "../../../components/MyForm";
import {gql} from "@apollo/client";
const getIdealOperationAmplifiersForm = (num: any) => {
    let form :any = {};
    for(let i = 0; i<num; i++) {
        form[`mFirstNode${i}`] = {
            ...createFormFieldConfig(`Первый отрицательный узел идеального операционного усилителя №${i}`, `mFirstNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`mFirstNode${i}`),
                minNumRule(`mFirstNode${i}`, 0),
                maxNumRule(`mFirstNode${i}`, 100)
            ]
        }
        form[`pFirstNode${i}`] = {
            ...createFormFieldConfig(`Первый положительный узел идеального операционного усилителя №${i},`, `pFirstNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`pFirstNode${i}`),
                minNumRule(`pFirstNode${i}`, 0),
                maxNumRule(`pFirstNode${i}`, 100)
            ]
        }
        form[`mSecondNode${i}`] = {
            ...createFormFieldConfig(`Второй отрицательный узел идеального операционного усилителя №${i}`, `mSecondNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`mSecondNode${i}`),
                minNumRule(`mSecondNode${i}`, 0),
                maxNumRule(`mSecondNode${i}`, 100)
            ]
        }
        form[`pSecondNode${i}`] = {
            ...createFormFieldConfig(`Второй положительный узел идеального операционного усилителя №${i}`, `pSecondNode${i}`,'number'),
            validationRules: [
                isEmptyRule(`pSecondNode${i}`),
                minNumRule(`pSecondNode${i}`, 0),
                maxNumRule(`pSecondNode${i}`, 100)
            ]
        }
    }
    return form;
}

const getGraphQLData = (form: any, num:any) => {
    let idealOperationAmplifiers = [];
    for(let i = 0; i< num; i++) {
        idealOperationAmplifiers.push({
            mFirstNode: +form[`mFirstNode${i}`].value,
            pFirstNode: +form[`pFirstNode${i}`].value,
            mSecondNode: +form[`mSecondNode${i}`].value,
            pSecondNode: +form[`pSecondNode${i}`].value
        })
    }
    return {idealOperationAmplifiers};
}
const CREATE_IDEAL_OPERATION_AMPLIFIERS_MUTATION = gql`
    mutation createIdealOperationAmplifiers(
        $schemaId: Int!
        $idealOperationAmplifiers: [InputIdealOperationAmplifiersType!]!
    ) {
        createIdealOperationAmplifiers(
            schemaId: $schemaId
            idealOperationAmplifiers: $idealOperationAmplifiers
        ) {
            id
        }
    }
`
const idealOperationAmplifiers = () => {
    const router = useRouter();
    return (
        <>
            <MyForm router={router} elemName={'idealOperationAmplifiers'} name='Идеальные операционные усилители схемы' elemForm={getIdealOperationAmplifiersForm(Number(router.query.idealOperationAmplifiers))} mutation={CREATE_IDEAL_OPERATION_AMPLIFIERS_MUTATION} getData={getGraphQLData} />
        </>
    );
};

export default idealOperationAmplifiers;