import { CgProfile } from "react-icons/cg";
import styles from "./Styles.module.css";
/**
 * Profile component
 *
 * Displaying details about a user
 */
export default function Profile({ userDetails }) {

  const userObject = Array.isArray(userDetails) ? userDetails[0] : userDetails

  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <CgProfile size={50} />
      </div>
      <div className={styles.info}>
        <p>
          <strong>Användar-ID:</strong> {userObject.id}
        </p>
        <p>
          <strong>Namn:</strong> {userObject.username}
        </p>
        <p>
          <strong>E-post:</strong> {userObject.email}
        </p>
      </div>
    </div>
  );
}
