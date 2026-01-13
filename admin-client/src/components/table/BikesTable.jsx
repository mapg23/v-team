import styles from "./Table.module.css";
/**
 * Create a more intuitive table for bikes Data
 *
 * @param {Array} data array of objects
 * @returns
 */
export default function BikesTable({ data, action, inspect }) {
  const _data = Array.isArray(data) ? data : [data];
  if (_data.length === 0) return <p>Finns inga städer..</p>;

  const headers = [
    "id",
    "status",
    "battery",
    "is rented",
    "city id",
    "current zone",
    "action",
  ];

  /**
   * Call action on object with id <id>
   * @param {Int} objectId
   */
  function handleAction(objectId) {
    action(objectId);
  }

  /**
   * Call action on object with id <id>
   * @param {Int} objectId
   */
  function handleInspect(objectId) {
    inspect(objectId);
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
          <tr key={obj.id}>
            <td
              className={styles.redirect}
              onClick={() => handleInspect(obj.id)}
            >
              {obj.id}
            </td>
            <td>{obj.status}</td>
            <td>{obj.battery}</td>
            <td>{obj.occupied ? "yes" : "no"}</td>
            <td>{obj.city_id}</td>
            <td>{obj.current_zone_type ? obj.current_zone_type : "none"}</td>
            <td key={obj.id}>
              <button onClick={() => handleAction(obj.id)}>Delete Bike</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
