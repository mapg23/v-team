/**
 * Create a Table based on a array of objects
 * 
 * @param {Array} data array of objects
 * @returns 
 */
export default function CityTable({ data }) {
  const _data = Array.isArray(data) ? data : [data];

  const headers = Object.keys(_data[0]);

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
        {_data.map((obj) => (
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
