import React from 'react';
import classes from './NavButton.module.css'
import Link from 'next/link'
type NavButtonProps = {
    link: string,
    label: string,
    callBack?:  React.MouseEventHandler<HTMLAnchorElement>
    className?: string
}
const NavButton: React.FC<NavButtonProps> =({label,link, callBack,className}) => {
    return (
        <li className={className}>
            <Link href={link}>
                <a onClick={callBack} className={classes.btn}>
                    {label}
                </a>
            </Link>
        </li>
    );
}

export default NavButton;