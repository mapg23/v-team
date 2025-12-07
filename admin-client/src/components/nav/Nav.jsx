import navstyles from "./Nav.module.css";

/**
 * 
 * @returns UL as Navigation
 */
function Navigation() {
    return (
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
      </ul>
    );
}

export default Navigation;