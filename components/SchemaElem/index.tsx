import React, {useEffect, useState} from 'react';
import classes from './SchemaElem.module.css'
import {useMutation} from "@apollo/client";
import button from "../Button";
function SchemaElem({elem, elemFields, changeCallback, saveCallback, deleteCallback, elemIndex, newElem, addCallback, counterCallback, counter, undo}:any) {

    const [newElemFlag, setNewElemFlag] = useState(newElem);
    const [disabledFlag, setDisabledFlag] = useState(true);
    useEffect(()=> {
        if(newElemFlag === true) {
            setDisabledFlag(false);
        }
    },[])
    /*
    const updateInput = ({target: {name, value} } :any) => {
        setElem({
            ...elem,
            [name]: +value
        });
    }

     */
    /*
    const addElem = () => {
        console.log('before elem is:' + elem);
        add({
            variables: {
                schemaId: schemaId,
                data: elem
            }
        }).then((res) => {
            const operationName = addCallback.definitions[0].name.value;
            console.log('operation name is: ' + operationName);
            setNewElemFlag(false);
            setDisabledFlag(true);
            console.log('id is: ');
            console.log(res.data[operationName].id);changeCallback
            addId(res.data[operationName].id, index);
            setElem({
                ...elem,
                id: res.data[operationName].id
            });
            console.log('elem is' + elem);
        }).catch(err => {
            console.log('err: ' + err.message);

        })
    }

     */

    const saveElemToSchema = (index:number) => {
        saveCallback(index).then((res:any) => {
            //console.log('elem changed');
            setDisabledFlag(true);
        }).catch((err:any) => {
           // console.log('err: ' + err.message);
        })
    }
    const saveAddedToSchema = async (index: number)=> {
        let isError = false;
        await addCallback(index).catch((err:any)=> {
            console.log('flag in error: ' + isError);
            isError = true;
            console.log('flag after set is: ' + isError);
            console.log('err: ' + err.message);
        });
        console.log('flag is:' + isError);
        if (!isError) {
            counterCallback(counter + 1);
            setNewElemFlag(false);
            setDisabledFlag(true);
        }
    }

    const undoSaving = (index: number) => {
        undo(index);
        setNewElemFlag(false);
        setDisabledFlag(true);
    }



    const changeELem = () => {
        setDisabledFlag(false);
    }

    return (
        <>
            {Object.entries(elem).map(([key,value], index) => {
                if (key === 'id') return false;
                return (
                <div className={classes.elemContainer} key={index}>
                    <label>{elemFields[key]}</label >
                    <input
                        value={elem[key]}
                        name={`${key}`}
                        disabled = {disabledFlag}
                        onChange={event => changeCallback(event,elemIndex)}
                    />
                </div>
                )
            })}
            {newElemFlag && (
                <button className={`${classes.button} button`}
                        onClick={() => saveAddedToSchema(elemIndex)}

                >
                    Добавить в схему
                </button>
            ) }
            {newElemFlag && (
                <button className={`${classes.button} button`}
                     onClick={() => undoSaving(elemIndex)}

                >
                    Отменить
                </button>
            ) }
            {(disabledFlag && !newElemFlag) &&  (
                <button className={`${classes.button} button`}
                        onClick={() => changeELem()}

                >Изменить</button>
            ) }
            {(!disabledFlag && !newElemFlag) &&
            (
                <button className={classes.button}
                        onClick={() => saveElemToSchema(elemIndex)}

                >Сохранить</button>
            )    }
            <button className={classes.moveRight}
                    onClick={() => deleteCallback(elemIndex)}

            >Удалить</button>
        </>
    );
}

export default SchemaElem;