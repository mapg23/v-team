import { GoHistory } from "react-icons/go";
import styles from "./Styles.module.css";

/**
 * Display payment method and current balance
 *
 * @param {Object} balance object
 */
export default function History({ history }) {
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <GoHistory size={50} />
      </div>
      <div className={styles.info}>
        <p>
          <strong>Historik:</strong> {history.history || "historik"}
        </p>
      </div>
    </div>
  );
}