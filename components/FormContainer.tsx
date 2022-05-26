import React from 'react';
import classes from './FormContainer.module.css'
type FormContainerProps = {
    name : string
    children: any
}

const FormContainer : React.FC<FormContainerProps> = ({children,name}) => {
    return (
       <div className={classes.container}>
           <h1>{name} </h1>
           {children}
       </div>
    );
}

export default FormContainer;