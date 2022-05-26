import React, {useState} from 'react';
import {FunctionType} from "../../generated/apollo/globalTypes";
import FunctionValues from "../FunctionValues";

function FunctionELem({initialType, initialValues, schema}: any) {
    const [functionType,setFunctionType] = useState(initialType);
    const [disabled, setDisabled] = useState(true);
    const enable = () => {
        setDisabled(false);
    }
    const disable = () => {
        setDisabled(true);
    }
    function setType(event: any) {
        setFunctionType(event.target.value);
    }
    return (
        <>
        <div >
            <input
                type='radio'
                name="hey"
                value='SINGLE'
                onChange={setType}
                disabled = {disabled}
                checked={functionType === FunctionType.SINGLE }
                id='singeRadio'
            />
            <label htmlFor="singeRadio">Единственная частотная точка</label>
        </div>
    <div>
        <input
            type='radio'
            value='LINEAR'
            onChange={setType}
            disabled = {disabled}
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
            disabled = {disabled}
            checked={functionType === FunctionType.LOGARITHMIC }
            id='logarithmicRadio'
        />
        <label htmlFor="logarithmicRadio">Логарифмический закон</label>
    </div>
            {functionType === 'SINGLE' && (
                <FunctionValues
                    type = {functionType}
                    elems = {{first: 'Единственная частотная точка'}}
                    initialValues = {initialValues}
                    disableCallback = {disable}
                    enableCallback = {enable}
                    disabledFlag = {disabled}
                    schema = {schema}
                />
            )}
            {functionType === 'LINEAR' && (
                <FunctionValues
                    type = {functionType}
                    elems = {{first: 'Начальное значение', second: 'Конечное значение', third: 'Шаг'}}
                    initialValues = {initialValues}
                    disableCallback = {disable}
                    enableCallback = {enable}
                    disabledFlag = {disabled}
                    schema = {schema}
                />
            )}
            {functionType === 'LOGARITHMIC' && (
                <FunctionValues
                    type = {functionType}
                    elems = {{first: 'Начальное значение', second: 'Конечное значение', third: 'Отношение'}}
                    initialValues = {initialValues}
                    disableCallback = {disable}
                    enableCallback = {enable}
                    disabledFlag = {disabled}
                    schema = {schema}
                />
            )}
            </>
    );
}

export default FunctionELem;