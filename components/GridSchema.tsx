import React from 'react';
import Link from 'next/link'
import classes from './GridSchema.module.css'
function GridSchema({id, name = ''}:any) {
    return (
        <Link href={"/schema/[id]"} as={`/schema/${id}`}>
            <button className={classes.elem}>
                {id}
            </button>
        </Link>
    );
}

export default GridSchema;