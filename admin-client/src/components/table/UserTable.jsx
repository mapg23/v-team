import styles from "./Table.module.css";
import { Link } from "react-router-dom";
import {CgProfileIcon} from "../icons/react-icons"


export default function UsersTable({ data }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((key) => (
            <th key={key}>{key.toUpperCase()}</th>
          ))}
          <th>PROFILE</th>
        </tr>
      </thead>

      <tbody>
        {data.map((obj) => (
          <tr key={obj.id}>
            {headers.map((key) => (
              <td key={obj.id + "-" + key}>{obj[key]}</td>
            ))}
            <td>
              <Link to={`/user/${obj.id}`}>
                <CgProfileIcon />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
