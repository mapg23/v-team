import btnStyles from "../button/Button.module.css";
import navStyles from "../nav/Nav.module.css";
import { useLocation } from "react-router-dom";

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
          <a
            href="/home"
            className={pathname === "/home" ? navStyles["active"] : ""}
          >
            Hem
          </a>
        </li>
        <li>
          <a
            href="/cities"
            className={pathname === "/cities" ? navStyles["active"] : ""}
          >
            Städer
          </a>
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
