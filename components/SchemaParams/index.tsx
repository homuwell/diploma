import React, {useState} from 'react';
import {gql, useMutation} from "@apollo/client";


const SCHEMA_CHANGE_NODES_MUTATION = gql`
    mutation changeNodes(
        $schemaId: Int!
        $nodes: Int!
    ) {
        changeNodes (
            nodes: $nodes
            schemaId: $schemaId
        ) 
            
        
    }
`;



function SchemaParams({initialNodes, schemaId}:any) {
    const [nodes,setNodes] = useState(initialNodes);
    const [changeNodes] = useMutation(SCHEMA_CHANGE_NODES_MUTATION);
    const [disabled, setDisabled] = useState(true);
    const change = ({target}:any) => {
        setNodes(+target.value);
    }
    const enabled = () => {
        setDisabled(false);
    }
    const save = () => {
        changeNodes({
            variables: {
                nodes,
                schemaId
            }
        }).then((res) => {
            setDisabled(true);
        }).catch((err) => {
            console.log('err' + err);
        })
    }
    return (
        <>
            <label>{'Узел +'}</label >
            <input
                value={nodes}
                disabled = {disabled}
                onChange={event => change(event)}
            />
            {disabled && (
                <button onClick={event => enabled()}>
                Изменить
            </button>
                )
            }
            {!disabled && (
                <button onClick={event => save()}>
                    Сохранить
                </button>
            )
            }
        </>
    );
}

export default SchemaParams;