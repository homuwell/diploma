import classes from "./SideNavGuest.module.css";
import Link from "next/link";
import React from "react";


const SideNavGuest = () => {
    return (
        <ul className={classes.SideNav}>
            <li>
                <Link href = '/login'>
                    <a>Логин</a>
                </Link>
            </li>
            <li>
                <Link href = '/register'>
                    <a>Зарегистрироваться</a>
                </Link>
            </li>
        </ul>
    );
}

export default SideNavGuest