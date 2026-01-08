import styles from "./Table.module.css";
/**
 * Table displaying parking areas
 *
 * @param {Array} data array of objects
 * @returns
 */
export default function ParkingTable({ data, action }) {
  if (!data) return;
  const _data = Array.isArray(data) ? data : [data];

  const headers = [
    "id",
    "City id",
    "Latidude 1",
    "Latidude 2",
    "Longitude 1",
    "Longitude 2",
    "Antal cyklar"
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
            <td>{obj?.max_lat}</td>
            <td>{obj?.max_long}</td>
            <td>{obj?.min_lat}</td>
            <td>{obj?.min_long}</td>
            <td key={obj?.id}>
              <button onClick={() => handleAction(obj?.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
