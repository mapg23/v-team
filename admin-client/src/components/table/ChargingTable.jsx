import styles from "./Table.module.css";

/**
 * Table displaying charging zones
 *
 * @param {Array} data array of objects
 * @returns
 */
export default function ChargingTable({ data, action }) {
  if (!data) return;
  const _data = Array.isArray(data) ? data : [data];

  const headers = [
    "id",
    "City id",
    "Stations namn",
    "Latitude",
    "Longitude",
    "Kapacitet",
    "Action",
  ];

  /**
   * Call action on object with id <id>
   * @param {Int} objectId
   */
  function handleAction(objectId) {
    action(objectId);
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {_data.map((obj) => (
          <tr key={obj?.id}>
            <td>{obj?.id}</td>
            <td>{obj?.city_id}</td>
            <td>{obj?.name}</td>
            <td>{obj?.latitude}</td>
            <td>{obj?.longitude}</td>
            <td>{obj?.capacity}</td>
            <td key={obj?.id}>
              <button onClick={() => handleAction(obj?.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
