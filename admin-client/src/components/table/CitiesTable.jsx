import styles from "./Table.module.css";
/**
 * Create a Table based on a array of objects
 *
 * @param {Array} data array of objects
 * @returns
 */
export default function CitiesTable({ data, action, inspect }) {
  const _data = Array.isArray(data) ? data : [data];
  if (_data.length === 0) return <p>Finns inga städer..</p>;

    const headers = [
      "City id",
      "City name",
      "Bikes in city",
      "Parking zones",
      "Charging zones",
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
      <table className={styles.bikeTable}>
        <thead>
          <tr>
            {headers.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
  
        <tbody>
          {_data.map((obj) => (
            <tr onClick={() => handleInspect(obj.id)} key={obj.id}>
              <td>{obj.id}</td>
              <td>{obj.name}</td>
              <td>{obj.bikeCount}</td>
              <td>{obj.parkingCount}</td>
              <td>{obj.stationCount}</td>
              {action ?  <td key={obj.id}>
                <button onClick={() => handleAction(obj.id)}>Delete Bike</button>
              </td> : ""}
             
            </tr>
          ))}
        </tbody>
      </table>
    );
}
