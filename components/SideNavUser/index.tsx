import Image from 'next/image'
import classes from './SideNavUser.module.css'
import React from "react";
import Link from "next/link";
import {gql, useMutation} from "@apollo/client";
import {useRouter} from "next/router";
import {Role} from "../../generated/apollo/globalTypes";

type SideNavUserProps = {
    login: string,
    picture: string
    id: number
    role: Role
}

const LOGOUT_USER = gql`
    mutation logoutUser {
        logoutUser {
            id
        }
    }
`



const SideNavUser = ({login,picture,role, id}: SideNavUserProps) => {
    const router = useRouter()
    const [logoutUser] = useMutation<any>(LOGOUT_USER);
    const dropDownControl = (e:any) => {
        const isDropdownButton = e.target.matches("[data-dropdown-button]");
        if (!isDropdownButton && e.target.closest("[data-dropdown]") !==null) {
            return
        }
        let currentDropdown:any;
        if (isDropdownButton) {
            currentDropdown = e.target.closest("[data-dropdown]");
            currentDropdown.classList.toggle(classes.active);

        }
        document.querySelectorAll(`[data-dropdown].${classes.active}`).forEach(dropdown => {
            if (dropdown === currentDropdown) return;
            dropdown.classList.remove(classes.active);
        });
        return () => {
            window.removeEventListener('click',()=> {

            })
        }
    }
    const logout = (e:any) => {
        logoutUser({

        }).then(()=> {
            router.reload();

        }).catch((err) => {

        })

    }


    return (
        <>
                <div className={classes.dropdown}  data-dropdown>
                    <a
                        className={classes.container}
                        data-dropdown-button
                        onClick={dropDownControl}
                    >
                    <Image
                        width = {40}
                        height = {40}
                        src = {picture}
                        key = {Date.now()}
                    >
                    </Image>
                    <p>{login}</p>
                    <svg>
                        <polygon fill={'white'}  points="0,0 14,0 7,7"/>
                    </svg>
                    </a>
                    <ul className={classes.dropdownMenu}>
                        {role === Role.ADMIN && (
                            <li>
                                <Link href = '/admin'>
                                    <a>Панель</a>
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link href = '/profile'>
                                <a>Профиль</a>
                            </Link>
                        </li>
                        <li>
                            <Link href={'/'} replace>
                                <a onClick={logout}>
                                    Выход
                                </a>
                            </Link>

                        </li>
                    </ul>
            </div>
        </>

    )
}
export default SideNavUser;