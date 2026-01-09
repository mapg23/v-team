import styles from "./Table.module.css";

/**
 * Create a Table based on a array of objects
 *
 * @param {Array} data array of objects
 * @returns
 */
export default function DynamicTable({ data, vertical }) {
  const _data = Array.isArray(data) ? data : [data];
  if (_data.length === 0) return <p>Saknar data...</p>;
  
  const headers = Object.keys(_data[0]);
  if (vertical) {
    return (
      <table className={styles.verticalTable}>
        <tbody>
          {Object.keys(_data[0]).map((key) => (
            <tr key={key}>
              <th>{key}</th>
              <td>{_data[0][key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return (
    <table className={styles["table"]}>
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
