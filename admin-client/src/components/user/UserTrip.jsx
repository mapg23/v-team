import { GoHistory } from "react-icons/go";
import styles from "./Styles.module.css";

/**
 * Display payment method and current balance
 *
 * @param {Object} balance object
 */
export default function UserTrip({ trip }) {
    console.log(trip)
  return (
    <div className="listContainer">
      <table>
        <tr>
          <th>Scooter Id</th>
          <th>Start position</th>
          <th>Slut position</th>
          <th>Travel time</th>
          <th>Total cost</th>
        </tr>
        <tr>
          <td>{trip.scooter_id}</td>
          <td>{trip.start_latitude}</td>
          <td>{trip.end_latitude}</td>
          <td>5 minuter</td>
          <td>{trip.cost}</td>
        </tr>
      </table>
    </div>
  );
}2