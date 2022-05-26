import React from 'react';
import classes from './ResponseBox.module.css'
type ResponseBoxProps = {
    type: string,
    message: string
}

const ResponseBox : React.FC<ResponseBoxProps> = ({type, message}) => {
    const checkType = (type: string) => {
       return  `${classes.Box} ${type === 'success' ? classes.successBox : classes.errorBox}`
    }
    return (
        <div className={checkType(type)}>
            {message}
        </div>
    );
}

export default ResponseBox;