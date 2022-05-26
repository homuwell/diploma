import React from 'react';
import styles from './MyInput.module.css'

type MyInputProps = {
    label:string,
    type?: string
    placeholder: string
    value: string|number
    setValue: any
    check : Function
}
const errorStyle = {
    color: 'red',
    fontSize: '12px',
    margin: '-5px 0 0'
}

const MyInput: React.FC<any> = (props: any) => {
    return (
        <>
            <label>{props.label}</label>
        <input className={styles.inpt}
               type={props.type}
               placeholder={props.placeholder}
               name={props.name}
               value={props.value}
               disabled = {props.disabled}
               onChange={props.handleChange}/>
            {props.errorMessage && !props.isValid && (
                <p style={errorStyle}>{props.errorMessage}</p>
            )}
        </>
    );
};

export default React.memo(MyInput);