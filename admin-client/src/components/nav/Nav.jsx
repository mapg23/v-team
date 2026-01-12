import btnStyles from "../button/Button.module.css";
import navStyles from "../nav/Nav.module.css";
import { useLocation } from "react-router-dom";
import { HomeIcon, CityIcon } from "../icons/react-icons";

/**
 *
 * @returns UL as Navigation
 */
function Navigation({ logout }) {
  const location = useLocation();
  const { hash, pathname, search } = location;
  function handleLogout() {
    logout();
  }
  return (
    <>
      <ul className={navStyles.navList}>
        <li>
          <div className={navStyles.navDiv}>
            <HomeIcon
              className={pathname === "/home" ? navStyles["active"] : ""}
            ></HomeIcon>
            <a href="/home">Hem</a>
          </div>
        </li>
        <li>
          <div className={navStyles.navDiv}>
            {pathname === "/cities" ? CityIcon(true) : CityIcon("")}
            <a
              href="/cities"
              // className={pathname === "/cities" ? () => CityIcon("green") : ""}
            >
              Städer
            </a>
          </div>
        </li>

        <li>
          <a
            href="/cost"
            className={pathname === "/cost" ? navStyles["active"] : ""}
          >
            Prissättning
          </a>
        </li>
        <li>
          <a
            href="/stations"
            className={pathname === "/stations" ? navStyles["active"] : ""}
          >
            Laddstationer
          </a>
        </li>
        <li>
          <a
            href="/parkings"
            className={pathname === "/parkings" ? navStyles["active"] : ""}
          >
            Parkeringar
          </a>
        </li>
        <li>
          <a
            href="/users"
            className={pathname === "/users" ? navStyles["active"] : ""}
          >
            Användare
          </a>
        </li>
        <li>
          <a
            href="/bikes"
            className={pathname === "/bikes" ? navStyles["active"] : ""}
          >
            Elsparkcyklar
          </a>
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
