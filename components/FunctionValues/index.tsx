import React, {useState} from 'react';
import classes from "../SchemaElem/SchemaElem.module.css";
import {gql, useMutation} from "@apollo/client";

const CHANGE_FUNCTION_MUTATION = gql`
    mutation changeFunction(
        $schemaId: Int!
        $first: Float!
        $second: Float!
        $third: Float!
        $type: FunctionType!
    ) {
    changeFunction(
        schemaId: $schemaId
        first: $first
        second: $second
        third: $third
        type: $type
        )
    }

`





function FunctionValues({type, elems, initialValues, disableCallback, enableCallback, disabledFlag, schema} :any) {
    const [functionValues, setFunctionValues] = useState(initialValues);
    const [changeFunction] = useMutation(CHANGE_FUNCTION_MUTATION)
    const [disabled, setDisabled] = useState(disabledFlag);
    const enabled = () => {
        enableCallback();
        setDisabled(false);
    }

    const save = () => {
        changeFunction({
            variables: {
                schemaId: schema,
                type,
                first: functionValues.first,
                second: functionValues.second,
                third: functionValues.third
            }
        }).then((res) => {
            disableCallback();
            setDisabled(true);
        }).catch((err) => {
            console.log('err: ' + err);
        })
    }

    const change = ({target: {name, value}} :any)  => {

            let updatedValues = {...functionValues};
        updatedValues[name] = +value;

        setFunctionValues(updatedValues);
        }
    return (
        <>
            {Object.entries(elems).map(([key,value], index) => {
                return (
                    <div className={classes.elemContainer} key={index}>
                        <label>{elems[`${key}`]}</label >
                        <input
                            value={functionValues[`${key}`]}
                            name={`${key}`}
                            disabled = {disabled}
                            onChange={event => change(event)}
                        />
                    </div>
                )
            })
            }
            {disabled && (
                <button onClick={event => enabled()}>
                    Изменить
                </button>
            )}
            {!disabled && (
                <button onClick={event => save()}
                >Сохранить</button>
            )}
        </>
    );
}

export default FunctionValues;