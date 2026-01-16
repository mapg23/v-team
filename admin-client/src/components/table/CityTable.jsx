import styles from "./Table.module.css";
/**
 * Create a Table based on a array of objects
 *
 * @param {Object} CityObject
 * @returns
 */
export default function CityTable({ data }) {
  2;

  const headers = [
    "City id",
    "City name",
    "Bikes in city",
    "Parking zones",
    "Charging zones",
    "Latitude",
    "Longitude"
  ];

  return (
    <table className={styles.verticalTable}>
      <tbody>
        <tr>
          <th>{headers[0]}</th>
          <td>{data.id || null}</td>
        </tr>
        <tr>
          <th>{headers[1]}</th>
          <td>{data.name || null}</td>
        </tr>
        <tr>
          <th>{headers[2]}</th>
          <td>{data.bikeCount || null}</td>
        </tr>
        <tr>
          <th>{headers[3]}</th>
          <td>{data.parkingCount || null}</td>
        </tr>
        <tr>
          <th>{headers[4]}</th>
          <td>{data.stationCount || null}</td>
        </tr>
        <tr>
          <th>{headers[5]}</th>
          <td>{data.latitude || null}</td>
        </tr>
        <tr>
          <th>{headers[6]}</th>
          <td>{data.longitude || null}</td>
        </tr>
      </tbody>
    </table>
  );
}
