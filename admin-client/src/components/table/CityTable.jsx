/**
 * Create a Table based on a array of objects
 * 
 * @param {Array} data array of objects
 * @returns 
 */
export default function CityTable({ data }) {
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
