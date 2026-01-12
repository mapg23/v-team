import btnStyles from "../button/Button.module.css";
import navStyles from "../nav/Nav.module.css";

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
      <ul className={navStyles.navList}>
        <li>
          <a href="/home">Hem</a>
        </li>
        <li>
          <a href="/cities">Städer</a>
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
          <button className={`${btnStyles.delete}`} onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </>
  );
}

export default Navigation;
