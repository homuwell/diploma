import React, {useState} from 'react';
import button from "../Button";
import classes from "../SchemaElem/SchemaElem.module.css";
import {useMutation} from "@apollo/client";

type Node = {
    plus: number
    minus: number
}

function NodeElem({plus,minus,name, changeCallback, schema}:any) {
    const [change] = useMutation(changeCallback);
    const [nodes, setNodes] = useState<Node>({plus,minus});
    const [disabled, setDisabled] = useState(true);
    const setEnabled = () => {
        setDisabled(false);
    }
    const changeElem = ({target: {name, value}} :any) => {
        setNodes({...nodes, [name]:+value});
    }
    const saveNodes = () => {
        change({
            variables: {
                schemaId: schema,
                plus: nodes.plus,
                minus: nodes.minus
            }
        }).then(res => {
            setDisabled(true);
        }).catch((err) => {
            console.log('err: ' + err);
        })

    }

    return (
        <>
            <h3>{name}</h3>
            <label>{'Узел +'}</label >
            <input
                value={nodes.plus }
                name={'plus'}
                disabled = {disabled}
                onChange={event => changeElem(event)}
            />
            <label>{'Узел -'}</label >
            <input
                value={nodes.minus}
                name={'minus'}
                disabled = {disabled}
                onChange={event => changeElem(event)}
            />
            {disabled ?   (
                <button className={`${classes.button} button`}
                        onClick={() => setEnabled()}

                >Изменить</button>
            ) : (
                <button className={`${classes.button} button`}
                        onClick={() => saveNodes()}

                >Сохранить</button>
            ) }
        </>
    );
}

export default NodeElem;