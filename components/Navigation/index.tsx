import Logo from "../Logo";
import classes from '../Navigation.module.css'
import NavContainer from "../NavContainer";
import MainNavigation from "../MainNavigation/MainNavigation";
import SideNavigation from "../SideNavigation";
const Navigation = ({children}:any) => {
    return (
        <>
        <nav className={classes.nav}>
            <NavContainer>
                <Logo/>
                <MainNavigation/>
                <SideNavigation/>
            </NavContainer>
        </nav>
            <main>
                {children}
            </main>
        </>
        )



}

export default Navigation