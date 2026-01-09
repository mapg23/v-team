import UserService from "../../services/users";
import { useNavigate } from "react-router";
import { CgProfile } from "react-icons/cg";
import styles from "./Styles.module.css";

/**
 * Profile component
 *
 * Displaying details about a user
 */
export default function Profile({ userDetails }) {
  const navigate = useNavigate();
  const userObject = Array.isArray(userDetails) ? userDetails[0] : userDetails;

  /**
   * Delete user
   */
  async function handleSubmit(event) {
    event.preventDefault();
    const success = await UserService.deleteUser(userObject.id);
    if (success) navigate("/users");
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.avatar}>
        <CgProfile size={50} />
      </div>
      <div className={styles.profileInfo}>
        <p>
          <strong>Användar-ID:</strong> {userObject.id}
        </p>
        <p>
          <strong>Namn:</strong> {userObject.username}
        </p>
        <p>
          <strong>E-post:</strong> {userObject.email}
        </p>
        <div className="userForm">
          <form onSubmit={handleSubmit}>
            <button
              className={`${styles.button} ${styles.delete}`}
              type="submit"
            >
              Delete user
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
