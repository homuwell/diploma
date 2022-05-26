import React from 'react';
import PageContainer from "../../../components/PageContainer";
import useForm from "../../../hooks/useForm";
import {schemaGeneralForm} from "../../../lib/schemaGeneralForm";
import { useRouter } from 'next/router'
import Button from "../../../components/Button";
import {gql, useMutation} from "@apollo/client";
import serverAuth from "../../../components/serverAuth";
import {GetServerSidePropsContext} from "next";
import {createSchema,createSchemaVariables} from "../../../generated/apollo/createSchema";
import idealOperationAmplifiers from "./idealOperationAmplifiers";
const CREATE_SCHEMA_MUTATION = gql`
    mutation createSchema (
        $name: String!
        $nodes: Int!
        $resistors: Int!
        $capacitors: Int!
        $inductors: Int!
        $VCCSs: Int!
        $VCVSs: Int!
        $CCCSs: Int!
        $CCVSs: Int!
        $transformers: Int!
        $idealTransformers: Int!
        $operationAmplifiers: Int!
        $idealOperationAmplifiers: Int!
        $bipolarTransistors: Int!
        $unipolarTransistors: Int!
    ) {
         createSchema (
             nodes: $nodes
             name: $name
             resistors: $resistors
             capacitors: $capacitors
             inductors: $inductors
             VCCSs: $VCCSs
             VCVSs: $VCVSs
             CCCSs: $CCCSs
             CCVSs: $CCVSs
             transformers: $transformers
             idealTransformers: $idealTransformers
             operationAmplifiers: $operationAmplifiers
             idealOperationAmplifiers: $idealOperationAmplifiers
             bipolarTransistors: $bipolarTransistors
             unipolarTransistors: $unipolarTransistors
         ) {
            id
         }
      }
`


function General() {
    const router = useRouter();
    const [response, setResponse] = React.useState({type: '', message: ''});
    const [crtSchema] = useMutation<createSchema,createSchemaVariables>(CREATE_SCHEMA_MUTATION)
    const [form,renderFormInputs, isFormValid] = useForm(schemaGeneralForm);
    console.log(form);
    const createSchema =(e: any) => {
        e.preventDefault();
        const queryElems = {
            nodes: +form.nodesNum.value,
            resistors: +form.resistorsNum.value,
            capacitors: +form.CapacitorNum.value,
            inductors: +form.InductorNum.value,
            VCCSs: `${+form.VCCSNum.value}+${+form.VCCSFreqDependentNum.value}`,
            VCVSs: `${+form.VCVSNum.value}+${+form.VCVSFreqDependentNum.value}`,
            CCCSs: `${+form.CCCSNum.value}+${+form.CCCSFreqDependentNum.value}`,
            CCVSs: `${+form.CCVSNum.value}+${+form.CCVSFreqDependentNum.value}`,
            transformers: +form.TransformersNum.value,
            idealTransformers: +form.IdealTransformersNum.value,
            operationAmplifiers: +form.OperationAmplifiersNum.value,
            idealOperationAmplifiers: +form.IdealOperationAmplifiersNum.value,
            bipolarTransistors: +form.BipolarTransistorsNum.value,
            unipolarTransistors: +form.UnipolarTransistorsNum.value
        }
        crtSchema({
            variables: {
                nodes: queryElems.nodes,
                name: form.name.value,
                resistors: queryElems.resistors,
                capacitors: queryElems.capacitors,
                inductors: queryElems.inductors,
                VCCSs: +form.VCCSNum.value + +form.VCCSFreqDependentNum.value,
                VCVSs: +form.VCVSNum.value + +form.VCVSFreqDependentNum.value,
                CCCSs: +form.CCCSNum.value + +form.CCCSFreqDependentNum.value,
                CCVSs: +form.CCVSNum.value + +form.VCVSFreqDependentNum.value,
                transformers: queryElems.transformers,
                idealTransformers: queryElems.idealTransformers,
                operationAmplifiers: queryElems.operationAmplifiers,
                idealOperationAmplifiers: queryElems.idealOperationAmplifiers,
                bipolarTransistors: queryElems.bipolarTransistors,
                unipolarTransistors: queryElems.unipolarTransistors
            }
        }).then((res) => {
            console.log(res);
            const nonNullElems = Object.fromEntries(Object.entries(queryElems).filter(elem => (elem[1] !==0 && elem[1] !=='0+0')));
            delete nonNullElems.nodes;
            delete nonNullElems.name;
            if (Object.keys(nonNullElems).length == 0  ) {
                router.push({
                    pathname: `/schema/new/calculationsDirectives`,
                    query: {
                        schemaId: res.data?.createSchema?.id,
                    }
                })
            }
             else {
                router.push({
                    pathname: `/schema/new/${Object.keys(nonNullElems)[0]}`,
                    query: {
                        schemaId: res.data?.createSchema?.id,
                        ...nonNullElems
                    }
                })
            }


            setResponse({type: 'success', message: 'Вы успешно создали схему'});

        }).catch((err)=> {
            setResponse({type: 'error', message: err.message});
        })
    }
    return (
        <PageContainer>
            <h1>Основные параметры схемы</h1>
            {response && <p>{response.message}</p>}
            {renderFormInputs()}
            <Button disabled = {!isFormValid()} type='submit' callback={createSchema}>Войти</Button>
        </PageContainer>
    );
}

//auth user
export const  getServerSideProps = serverAuth (async (ctx: GetServerSidePropsContext) => {
    return {
        props: {}
    }
})

export default General;