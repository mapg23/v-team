import navstyles from "./Nav.module.css";
import styles from "../button/Button.module.css"

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
      <ul>
        <li>
          <a href="/welcome">Översikt</a>
        </li>
        <li>
          <a href="/city">Städer</a>
        </li>
        <li>
          <a href="/cost">Prissättning</a>
        </li>
        <li>
          <a href="/stations">Laddstationer</a>
        </li>
        <li>
          <a href="/parkings">Parkeringar</a>
        </li>
        <li>
          <a href="/users">Användare</a>
        </li>
        <li>
          <a href="/bikes">Elsparkcyklar</a>
        </li>
        <li>
          <button className={`${styles.delete}`} onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </>
  );
}

export default Navigation;
