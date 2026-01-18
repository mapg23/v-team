import { GoHistory } from "react-icons/go";
import styles from "./Styles.module.css";
import tableStyle from "../table/Table.module.css"

/**
 * Creates a table for trips
 * @param {} param0
 * @returns
 */
export default function History({ tripHistory }) {

  /**
   * Convert string to datetime and calculate time in minutes
   * @param {string} startTime 
   * @param {string} endTime 
   * @returns 
   */
  function calculateTime(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return (end - start) / 1000 / 60 + " min"; // timeElapsedInMinutes
  }

  return (
    <div className={styles.historyContainer}>
      <div className={styles.avatar}>
        <GoHistory size={50} />
      </div>
      {/* <div className={styles.info}>
       */}
      <div>
        <table className={tableStyle.table}>
          <thead>
            <tr>
              <th>Travel Id</th>
              <th>Start position</th>
              <th>End position</th>
              <th>End Zone Type</th>
              <th>Travel time</th>
              <th>Total cost</th>
            </tr>
          </thead>
          <tbody>
            {tripHistory.map((story) => {
              return (
                <tr key={story.id}>
                  <td>{story.id}</td>
                  <td>
                    {story.startAdress
                      ? story.startAdress
                      : story.start_latitude}
                  </td>
                  <td>
                    {story.endAdress ? story.endAdress : story.end_latitude}
                  </td>
                  <td>{story.end_zone_type ? story.end_zone_type : ""}</td>
                  <td>
                    {calculateTime(story.start_time, story.end_time)}
                  </td>
                  <td>{story.cost} kr</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
