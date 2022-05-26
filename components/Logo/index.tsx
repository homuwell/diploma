import Image from "next/image";
import logo from '../../public/logo.png'
import classes from './Logo.module.css'
const Logo = () => {
    return (
    <>
        <div className={classes.logoContainer}>
            <Image
            src = {logo}
            width={60}
            height={60}>

            </Image>
            <p className={classes.logoText}>Rubick<br/>CAD</p>
        </div>
    </>
    )
}

export default Logo;