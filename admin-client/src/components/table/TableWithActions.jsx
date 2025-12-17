import styles from "./Table.module.css";
/**
 * Create a Table based on a array of objects
 *
 * @param {Array} data array of objects
 * @returns
 */
export default function TableWithActions({ data, action, inspect }) {
  const _data = Array.isArray(data) ? data : [data];
  if (_data.length === 0) return <p>Finns inga städer..</p>

  const headers = Object.keys(_data[0]);

  /**
   * Call action on object with id <id>
   * @param {Int} objectId 
   */
  function handleAction(objectId) {
    action(objectId)
  }

  /**
   * Call action on object with id <id>
   * @param {Int} objectId 
   */
  function handleInspect(objectId) {
    inspect(objectId);
  }

  return (
    <table>
      <thead>
        <tr>
          {headers.map((key) => (
            <th key={key}>{key.toUpperCase()}</th>
          ))}
          <th key="action">ACTION</th>
        </tr>
      </thead>

      <tbody>
        {_data.map((obj) => (
          <tr key={obj.id}>
            {headers.map((key) => (
              <td key={obj.id + "-" + key}>{obj[key]}</td>
            ))}
            <td key={obj.id}>
                <button onClick={() => handleAction(obj.id)}>delete</button>
                <button onClick={() => handleInspect(obj.id)}>Inspect</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
