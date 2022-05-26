import React, {useEffect, useState} from 'react';
import {FunctionType} from "../../generated/apollo/globalTypes";

function Index({type, first,second,third}:any) {
    let renderElem = {};
    useEffect(() => {
        switch (type) {
            case FunctionType.SINGLE:
                renderElem = {first: 'Значение частотной точки'}
                break;
            case FunctionType.LINEAR:
                renderElem = {first: 'минимальное значение', second: 'максимальное значение', third: 'шаг'};
                break;
            case FunctionType.LOGARITHMIC:
                renderElem = {first: 'мин частоты', second: 'макс частоты', third: 'отношение'};
                break;

        }
    })
    const [functionValues, setFunctionValues] = useState({first,second,third});

    return (
        <>
        </>

    );
}

export default Index;