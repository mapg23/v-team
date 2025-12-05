/**
 * Create a Table based on a array of objects
 * @param {Array} cityDetails array of objects
 * @returns 
 */
export default function CityTable({ cityDetails }) {
  if (!Array.isArray(cityDetails) || cityDetails.length === 0) return null;

  const headers = Object.keys(cityDetails[0]);

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
        {cityDetails.map((city) => (
          <tr key={city.id}>
            {headers.map((key) => (
              <td key={city.id + "-" + key}>{city[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
