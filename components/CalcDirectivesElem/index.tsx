import React, {useState} from 'react';
import NodeElem from "../NodeElem";
import {gql} from "@apollo/client";
import FunctionElem from "../FunctionElem";


const CHANGE_IN_NODE_MUTATION = gql`
    mutation changeInNode(
        $schemaId: Int!
        $plus: Int!
        $minus: Int!
    ) {
        changeInNode(
            schemaId: $schemaId
            plus: $plus
            minus: $minus

        ) {
            id
        }
    }
`

const CHANGE_OUT_NODE_MUTATION = gql`
    mutation changeOutNode(
        $schemaId: Int!
        $plus: Int!
        $minus: Int!
    ) {
        changeOutNode(
            schemaId: $schemaId
            plus: $plus
            minus: $minus

        ) {
            id
        }
    }
`






function CalcDirectivesElem({inP, outP, inM, outM, type, initialValues, schema}:any) {

    return (
        <>
            <h2>Параметры расчёта</h2>
            <FunctionElem
                initialType = {type}
                initialValues = {initialValues}
                schema = {schema}
            />
            <NodeElem
                plus = {inP}
                minus = {inM}
                name = {'Входные узлы'}
                changeCallback = {CHANGE_IN_NODE_MUTATION}
                schema = {schema}
            />
            <NodeElem
                plus = {outP}
                minus = {outM}
                name = {'Выходные узлы'}
                changeCallback = {CHANGE_OUT_NODE_MUTATION}
                schema = {schema}
            />
        </>

    );
}

export default CalcDirectivesElem;