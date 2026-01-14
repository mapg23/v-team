import btnStyles from "../button/Button.module.css";
import navStyles from "../nav/Nav.module.css";
import {
    PiGlobe,
    PiCity,
    PiHandCoins,
    PiChargingStation,
    PiSquareSplitHorizontal,
    PiUser,
    PiScooter
} from "react-icons/pi";

/**
 *
 * @returns UL as Navigation
 */
function Navigation({ logout }) {
    function handleLogout() {
        logout();
    }
    return (
        <>
            <div className="image-wrapper">
                <img className="logo logo-small" src="/images/rull.png" />
            </div>
            <ul className={navStyles.navList}>
                <li>
                    <a href="/welcome"><PiGlobe /> Översikt</a>
                </li>
                <li>
                    <a href="/cities"><PiCity /> Städer</a>
                </li>
                <li>
                    <a href="/cost"><PiHandCoins /> Prissättning</a>
                </li>
                <li>
                    <a href="/stations"><PiChargingStation /> Laddstationer</a>
                </li>
                <li>
                    <a href="/parkings"><PiSquareSplitHorizontal /> Parkeringar</a>
                </li>
                <li>
                    <a href="/users"> <PiUser /> Användare</a>
                </li>
                <li>
                    <a href="/bikes"><PiScooter /> Elsparkcyklar</a>
                </li>
                <li>
                    <button className={`${btnStyles.delete}`} onClick={handleLogout}>
                        Logout
                    </button>
                </li>
            </ul>

        </>
    );
}

export default Navigation;
