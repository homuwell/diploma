
import classes from './ResultElems.module.css'
import React, {useCallback, useEffect, useState} from 'react';
import ResultElem from "../ResultElem";
import {gql, useSubscription} from "@apollo/client";
const SCHEMA_CHANGED_SUBSCRIPTION = gql`
    subscription SchemaSubscription {
        schemaSubscription {
            f
            kum
            kua
            rim
            ria
            rom
            roa
        }
    }
`;
function ResultElems({elems}:any) {
    const [resultElems, setResultElems] = useState(elems);
    const {data, loading, error} = useSubscription(SCHEMA_CHANGED_SUBSCRIPTION, {
        onSubscriptionData: (data) => {
            console.log('data in func is');
            console.log(data);
            const newResults = data.subscriptionData.data.schemaSubscription;
            setResultElems(newResults);
        }
    });

    return (
        <>
            <h2>Результаты моделирования</h2>
        <div className={classes.container}>
                {resultElems.map( (elem:any, index:any)=> {
                    return (
                            <ResultElem
                                elem = {elem}
                                key = {index}
                            >

                            </ResultElem>

                    )
                })}
        </div>
        </>
    );
}

export default ResultElems;