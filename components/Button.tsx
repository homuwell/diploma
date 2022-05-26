import React from 'react';
import classes from './Button.module.css'
type ButtonProps = {
    children: any
    callback: any
    disabled: boolean|undefined
    type: "button"|"submit"
}
const Button: React.FC<ButtonProps> =({children,callback, disabled, type}) => {
    return (
        <button disabled={disabled} type={type} className={classes.button27} onClick={callback} >{children}</button>
    );
}

export default Button;