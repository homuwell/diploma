import React from 'react';

type RequireElemProps = {
    value: string,
    check: Function
    message: string
}
const SuccessStyle = {
    color : 'green'
}
const ErrorStyle = {
    color : 'red'
}
const RequireElem : React.FC<RequireElemProps> = ({value,check, message}) => {

    return (
        <>
            {check(value) ? <p style={SuccessStyle}>{message}</p> : <p style={ErrorStyle}>{message}</p>}
        </>
    );
}

export default RequireElem;