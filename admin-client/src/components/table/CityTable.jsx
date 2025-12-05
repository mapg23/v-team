export default function CityTable({ cityDetails }) {

  // Låt cityDetails alltid vara en array av objekt
  const data = Array.isArray(cityDetails) ? cityDetails : [cityDetails];

  if (data.length === 0) return null;

  return (
    <table>
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th>{key.toUpperCase()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((city, index) => (
          <tr key={index}>
            {Object.values(city).map((value, i) => (
              <td key={i}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
