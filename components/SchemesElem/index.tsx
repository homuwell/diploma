import React from 'react';
import Link from "next/link";
import classes from "./SchemesElem.module.css"
type SchemesElemProps = {
    name: string
    id: number
}


const SchemesElem: React.FC<SchemesElemProps> = ({name,id}) => {
    return (
        <li className={classes.elem}>
            <Link href={`/schema/${id}`}>
                <a>{name}</a>
            </Link>
        </li>
    );
}

export default SchemesElem;