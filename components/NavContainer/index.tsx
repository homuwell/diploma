import classes from './NavContainer.module.css'
import React from "react";
type Props = {
    children: React.ReactNode;
}
const NavContainer: React.FC<Props> = ({children}) => {
    return (
        <div className={classes.container}>
            {children}
        </div>
    )
}
export default NavContainer