import classes from './MainNavigation.module.css'
import Link from 'next/link'
const MainNavigation = () => {
    return (
        <ul className={classes.MainNav}>
            <li>
                <Link href = '/'>
                    <a>На главную</a>
                </Link>
            </li>
            <li>
                <Link href = '/schemes'>
                    <a>Список схем</a>
                </Link>
            </li>
        </ul>
    )

}

export default MainNavigation