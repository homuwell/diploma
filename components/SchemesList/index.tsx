import React, {useState} from 'react';
import SchemesElem from "../SchemesElem";
import classes from './SchemesList.module.css'
type Schema = {
    id: number
    name: string
}
type SchemesListProps = {
    initialValues: Schema[]
}

const SchemesList: React.FC<SchemesListProps> = ({initialValues}) => {
    const [schemes, setSchemes] = useState(initialValues);
    return (
    <ul className={classes.container}>
        {schemes.map((schema,index)=> {
            return (
                <SchemesElem
                    name={schema.name}
                    id={schema.id}
                    key={index}
                />

            )
        })}
    </ul>
    );
}

export default SchemesList;