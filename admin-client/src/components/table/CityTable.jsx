export default function CityTable({cityDetails}) {
    return (
      <table>
        <tr>
          {Object.keys(cityDetails).map((key) => (
            <th>{key.toUpperCase()}</th>
          ))}
        </tr>
        <tr>
          {Object.values(cityDetails).map((value) => (
            <td>{value}</td>
          ))}
        </tr>
      </table>
    );
}