import btnStyles from "../button/Button.module.css";
import navStyles from "../nav/Nav.module.css";
import { useLocation } from "react-router-dom";
import {
  HomeIcon,
  CityIcon,
  CostIcon,
  StaticChargeIcon,
  StaticParkIcon,
  CgProfileIcon,
  StaticBikeIcon,
} from "../icons/react-icons";

/**
 *
 * @returns UL as Navigation
 */
function Navigation({ logout }) {
  const location = useLocation();
  const pathname = location.pathname;
  function handleLogout() {
    logout();
  }
  return (
    <>
      <div className="logo-wrapper">
        <img src="/images/rull.png" alt="RULL" aria-description="logo" className="logo-small" />
      </div>
      <ul className={navStyles.navList}>
        <li>
          <div
            className={`${navStyles.navDiv} ${pathname === "/home" ? navStyles.active : ""
              }`}
          >

            <a href="/home"><HomeIcon /> Hem</a>
          </div>
        </li>
        <li>
          <div
            className={`${navStyles.navDiv} ${pathname.includes("cities") || pathname.includes("city") ? navStyles.active : ""
              }`}
          >
            <a href="/cities"><CityIcon /> Städer</a>
          </div>
        </li>

        <li>
          <div
            className={`${navStyles.navDiv} ${pathname === "/cost" ? navStyles.active : ""
              }`}
          >
            <a href="/cost"><CostIcon /> Prissättning</a>
          </div>
        </li>
        <li>
          <div
            className={`${navStyles.navDiv} ${pathname === "/stations" ? navStyles.active : ""
              }`}
          >
            <a href="/stations"><StaticChargeIcon /> Laddstationer</a>
          </div>
        </li>
        <li>
          <div
            className={`${navStyles.navDiv} ${pathname === "/parkings" ? navStyles.active : ""
              }`}
          >
            <a href="/parkings"><StaticParkIcon /> Parkeringar</a>
          </div>
        </li>
        <li>
          <div
            className={`${navStyles.navDiv} ${pathname.includes("/user") ? navStyles.active : ""
              }`}
          >
            <a href="/users"><CgProfileIcon /> Användare</a>
          </div>
        </li>
        <li>
          <div
            className={`${navStyles.navDiv} ${pathname.includes("/bikes") ? navStyles.active : ""
              }`}
          >
            <a href="/bikes"><StaticBikeIcon /> Elsparkcyklar</a>
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
