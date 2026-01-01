import { GoHistory } from "react-icons/go";
import styles from "./Styles.module.css";

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
        <table className={styles.alignedTable}>
          <thead>
            <tr>
              <th>Travel Id</th>
              <th>Start position</th>
              <th>End position</th>
              <th>Travel time</th>
              <th>Total cost</th>
            </tr>
          </thead>
          <tbody>
            {tripHistory.map((story) => {
              return (
                <tr key={story.id}>
                  <td className={styles.center}>{story.id}</td>
                  <td className={styles.left}>
                    {story.startAdress
                      ? story.startAdress
                      : story.start_latitude}
                  </td>
                  <td className={styles.left}>
                    {story.endAdress ? story.endAdress : story.end_latitude}
                  </td>
                  <td className={styles.right}>
                    {calculateTime(story.start_time, story.end_time)}
                  </td>
                  <td className={styles.right}>{story.cost} kr</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
