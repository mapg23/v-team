import { CgProfile } from "react-icons/cg";
import styles from "./Styles.module.css";
/**
 * Profile component
 *
 * Displaying details about a user
 */
export default function Profile({ userDetails }) {
  return (
      <div className={styles.container}>
        <div className={styles.avatar}>
          <CgProfile size={50}/>
        </div>
        <div className={styles.info}>
          <p>
            <strong>Användar-ID:</strong> {userDetails.id}
          </p>
          <p>
            <strong>Namn:</strong> {userDetails.name}
          </p>
          <p>
            <strong>E-post:</strong> {userDetails.email}
          </p>
        </div>
      </div>
  );
}
