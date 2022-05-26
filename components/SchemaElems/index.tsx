import SchemaElem from "../SchemaElem";
import classes from './SchemaElems.module.css'
import {useEffect, useState} from "react";
import {useMutation} from "@apollo/client";

function    SchemaElems({initialValues, elemFields,  name, changeCallback, addCallback, deleteCallback, schemaId, counter} :any) {
    const [elemsCounter, setElemsCounter] = useState(counter);
    const [elemList, setElemList] = useState(initialValues);
    const [changeElement] = useMutation(changeCallback);

    const [addElement] = useMutation(addCallback);
    const [deleteElement] = useMutation(deleteCallback);

    const changeElem = ({target: {name, value}} :any, index: number) => {

        let updatedElems = [...elemList];
        updatedElems[index][name] = +value;

        setElemList(updatedElems);
    }

    const saveChangedElem = (index: number) => {
        const updatedElem = {...elemList[index]};
        const updatedElemId:number = updatedElem.id;
        delete updatedElem.id;
        const updatedElemData = updatedElem;
        return changeElement({
            variables: {
                elemId: updatedElemId,
                data: updatedElemData
            }
        });

    }



    const getIdAfterAdd = (elemId: number, index:number) => {
        let newElems = [...elemList];
        newElems[index].id = elemId;
        setElemList(newElems);
    }

    const deleteElem = (index:number) => {
        console.log('index: ' + index);
        deleteElement({
            variables: {
                elemId: elemList[index].id
            }
        }).then(res => {
            setElemList((elems:any) => elems.filter((_:any,idx:any) =>  idx !== index ));
            setElemsCounter(elemsCounter - 1);
        }).catch(err => {
            console.log(err);
        })
    }

    const addElem = () => {
        let newElem:any = {};
        Object.keys(elemFields).map( (elem)=> {
            newElem[elem] = 0;
        });
        newElem.id = 0;
        setElemList((oldList:any) => [...oldList, newElem]);

    }
    const saveAddedElem = (index: number) => {
        const operationName = addCallback.definitions[0].name.value;
        let addedElem = {...elemList[index]};
        delete addedElem.id;
        return addElement({
            variables: {
                schemaId: schemaId,
                data: addedElem
            }
        }).then(res => {
            let addedElems = [...elemList];
            addedElems[index].id = res.data[operationName].id;
            setElemList(addedElems);
        })
    }

    const undo = (index: number) => {
        setElemList((elems:any) => elems.filter((_:any,idx:any) =>  idx !== index ));
    }

    return (
        <>
            <div className={classes.header}>
                <h3>{name}</h3>
                <h3 className={classes.moveRight}>{`Число элементов: ${elemsCounter}`}</h3>
            </div>
            {elemList.length === 0 && <text>Упс! В схеме нет элементов этого типа</text>}
            {elemList.map((elem:any,index:any) => {
                return (
                    <div className={classes.container}  key = {index}>
                        <SchemaElem
                            counterCallback = {setElemsCounter}
                            counter = {elemsCounter}
                            elem = {elemList[index]}
                            elemFields = {elemFields}
                            changeCallback = {changeElem}
                            saveCallback = {saveChangedElem}
                            elemIndex = {index}
                            deleteCallback = {deleteElem}
                            newElem = {elem.id === 0}
                            addCallback = {saveAddedElem}
                            schemaId = {schemaId}
                            addId = {getIdAfterAdd}
                            undo = {undo}
                        />
                    </div>
                )
            })}
            <button
                className={`${classes.button} button`}
                onClick={() => addElem()}
            >
                Добавить</button>
        </>
    );
}

export default SchemaElems;