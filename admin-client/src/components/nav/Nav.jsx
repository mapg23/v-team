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
          <div
            className={`${navStyles.navDiv} ${
              pathname === "/home" ? navStyles.active : ""
            }`}
          >
            <HomeIcon />
            <a href="/home">Hem</a>
          </div>
        </li>
        <li>
          <div
            className={`${navStyles.navDiv} ${
              pathname === "/cities" ? navStyles.active : ""
            }`}
          >
            <CityIcon></CityIcon>
            <a href="/cities">Städer</a>
          </div>
        </li>

        <li>
          <div
            className={`${navStyles.navDiv} ${
              pathname === "/cost" ? navStyles.active : ""
            }`}
          >
            <CityIcon></CityIcon>
            <a
              href="/cost"
            >
              Prissättning
            </a>
          </div>
        </li>
        <li>
          <div
            className={`${navStyles.navDiv} ${
              pathname === "/stations" ? navStyles.active : ""
            }`}
          >
            <CityIcon></CityIcon>
            <a
              href="/stations"
            >
              Laddstationer
            </a>
          </div>
        </li>
        <li>
          <div
            className={`${navStyles.navDiv} ${
              pathname === "/parkings" ? navStyles.active : ""
            }`}
          >
            <CityIcon></CityIcon>
            <a
              href="/parkings"
            >
              Parkeringar
            </a>
          </div>
        </li>
        <li>
          <div
            className={`${navStyles.navDiv} ${
              pathname === "/users" ? navStyles.active : ""
            }`}
          >
            <CityIcon></CityIcon>
            <a
              href="/users"
            >
              Användare
            </a>
          </div>
        </li>
        <li>
          <div
            className={`${navStyles.navDiv} ${
              pathname === "/bikes" ? navStyles.active : ""
            }`}
          >
            <CityIcon></CityIcon>
            <a
              href="/bikes"
            >
              Elsparkcyklar
            </a>
          </div>
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
