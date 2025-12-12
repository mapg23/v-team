import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";


export default function UsersTable({ data }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <table>
      <thead>
        <tr>
          {headers.map((key) => (
            <th key={key}>{key.toUpperCase()}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((obj) => (
          <tr key={obj.id}>
            {headers.map((key) => (
              <td key={obj.id + "-" + key}>{obj[key]}</td>
            ))}
            <td>
              <Link
                to={`/user/${obj.id}`}>
                  <CgProfile />
                </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
