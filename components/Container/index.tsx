import classes from './Container.module.css'
import React from "react";
type Props = {
    children: React.ReactNode;
}
const Container: React.FC<Props> = ({children}) => {
    return (
        <div className={classes.container}>
            {children}
        </div>
    )
}
export default Container