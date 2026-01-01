import { MdOutlinePayment } from "react-icons/md";
import styles from "./Styles.module.css"

/**
 * Display payment method and current balance
 *
 * @param {Object} balance object
 */
export default function Balance({ balance }) {
  return (
    <div className={styles.balanceContainer}>
      <div className={styles.avatar}>
        <MdOutlinePayment size={50} />
      </div>
      <div className={styles.info}>
        <p>
          <strong>Betalmetod:</strong> {balance.method || "card"}
        </p>
        <p>
          <strong>Balans:</strong> {balance.balance || "0kr"}
        </p>
      </div>
    </div>
  );
}
