import React, {useState} from 'react';
import PageContainer from "../../../components/PageContainer";
import useForm from "../../../hooks/useForm";
import {inOutNodesForm} from "../../../lib/InOutNodesForm";
import {singeNodeForm} from "../../../lib/SingeNode";
import {linearTypeForm} from "../../../lib/linearTypeForm";
import {logarithmicTypeForm} from "../../../lib/logarithmicTypeForm";

import Button from "../../../components/Button";
import {gql, useMutation} from "@apollo/client";
import {useRouter} from "next/router";
import serverAuth from "../../../components/serverAuth";
import {GetServerSidePropsContext} from "next";
import {
    createCalculationDirectives,
    createCalculationDirectivesVariables
} from "../../../generated/apollo/createCalculationDirectives";
import {FunctionType} from '../../../generated/apollo/globalTypes';
import Container from "../../../components/Container";

const CREATE_CALCULATION_DIRECTIVES_MUTATION = gql`
    mutation createCalculationDirectives(
        $schemaId: Int!
        $inM: Int!
        $inP: Int!
        $outP: Int!
        $outM: Int!
        $functionType: FunctionType!
        $firstFuncElem: Float!
        $secondFuncElem: Float!
        $thirdFuncElem: Float!
    ) {
        createCalculationDirectives(
            schemaId: $schemaId
            inM: $inM
            inP: $inP
            outP: $outP
            outM: $outM
            functionType: $functionType
            firstFuncElem: $firstFuncElem
            secondFuncElem: $secondFuncElem
            thirdFuncElem: $thirdFuncElem
        ) {
            id
        }
    }
`

const CALCULATE_SCHEMA_MUTATION = gql`
    mutation calculateSchema(
        $id: Int!
    ) {
        calculateSchema(id: $id)
    }

`


function CalculationsDirectives(props:any) {
    const router = useRouter();
    const [calculationDirectivesMutation] = useMutation<createCalculationDirectives,createCalculationDirectivesVariables>(CREATE_CALCULATION_DIRECTIVES_MUTATION);
    const [calculateSchema] = useMutation(CALCULATE_SCHEMA_MUTATION);
    const [singleForm,singleRenderFormInputs, isSingleFormValid] = useForm(singeNodeForm);
    const [linearForm,linearRenderFormInputs, isLinearFormValid] = useForm(linearTypeForm);
    const [logarithmicForm,logarithmicRenderFormInputs, isLogarithmicFormValid] = useForm(logarithmicTypeForm);
    const [inOutForm, inOutRenderFormInputs, isInOutNodesFormValid] = useForm(inOutNodesForm);
    const [functionType,setFunctionType] = useState<FunctionType>(FunctionType.SINGLE);
    const [response, setResponse] = React.useState({type: '', message: ''});

    function validation() {
        switch(functionType) {
            case FunctionType.SINGLE:
                return isSingleFormValid();
            case FunctionType.LINEAR:
                return isLinearFormValid();
            case FunctionType.LOGARITHMIC:
                return isLogarithmicFormValid();

        }
    }
    const setDirectives = (e:any) => {
        e.preventDefault();
        const funcElems = {first: 0, second: 0, third: 0};
        switch(functionType) {
            case  FunctionType.SINGLE:
                funcElems.first = +singleForm.frequency.value;
                break;
            case FunctionType.LINEAR:
                funcElems.first = +linearForm.minFrequency.value;
                funcElems.second = +linearForm.maxFrequency.value;
                funcElems.third = +linearForm.step.value;
                break;
            case FunctionType.LOGARITHMIC:
                funcElems.first = +logarithmicForm.minFrequency.value;
                funcElems.second = +logarithmicForm.maxFrequency.value;
                funcElems.third = +linearForm.ratio.value;

        }
        const id  = router?.query?.schemaId || 'invalid';
        calculationDirectivesMutation({
            variables: {
                schemaId: +id,
                inP: +inOutForm.inNodeP.value,
                inM: +inOutForm.inNodeM.value,
                outP: +inOutForm.outNodeP.value,
                outM: +inOutForm.outNodeM.value,
                functionType,
                firstFuncElem: funcElems.first,
                secondFuncElem: funcElems.second,
                thirdFuncElem: funcElems.third
            }
        }).then((res) => {
            calculateSchema({
                variables: {
                    id: +id
                }
            }).then(()=> {
                setResponse({type: 'success', message: 'Вы успешно '});
                router.push({
                    pathname: `/schemes`,
                })
            }).catch((err) => {
                setResponse({type: 'error', message: err.message});
            })
        }).catch((err)=> {
            setResponse({type: 'error', message: err.message});
        })
    }
    function setType(event: any) {
        setFunctionType(event.target.value);
        console.log('hello');
        console.log(functionType);
    }
    return (
        <Container>
        <h1>Параметры расчётов</h1>
            <h1>Тип функции</h1>
            <div >
                <input
                    type='radio'
                    name="hey"
                    value='SINGLE'
                    onChange={setType}
                    checked={functionType ===FunctionType.SINGLE }
                    id='singeRadio'
                />
                <label htmlFor="singeRadio">Единственная частотная точка</label>
            </div>
            <div>
                <input
                    type='radio'
                    value='LINEAR'
                    onChange={setType}
                    checked={functionType === FunctionType.LINEAR }
                    id='linearRadio'
                />
                <label htmlFor="linearRadio">Линейный закон изменения</label>
            </div>
            <div>
                <input
                    type='radio'
                    value='LOGARITHMIC'
                    onChange={setType}
                    checked={functionType ===FunctionType.LOGARITHMIC }
                    id='logarithmicRadio'
                />
                <label htmlFor="logarithmicRadio">Логарифмический закон</label>
            </div>
            <form>
                {response && <p>{response.message}</p>}
                {functionType == FunctionType.SINGLE && singleRenderFormInputs()}
                {functionType == FunctionType.LINEAR && linearRenderFormInputs()}
                {functionType == FunctionType.LOGARITHMIC && logarithmicRenderFormInputs()}
                <h1>Входные и выходные узлы</h1>
                {inOutRenderFormInputs()}

                <Button disabled = {!isInOutNodesFormValid() || !validation()} type='submit' callback={setDirectives}>Войти</Button>
            </form>
            </Container>

    );
}
//auth user
export const  getServerSideProps = serverAuth (async (ctx: GetServerSidePropsContext) => {
    return {
        props: {}
    }
})


export default CalculationsDirectives;