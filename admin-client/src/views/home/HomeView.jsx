import styles from "./HomeView.module.css"

/**
 * Home view for admin
 * 
 * Display Nav and dashboard(?)
 */
function HomeView() {
    return (
      <>
        <div className="dataContent">
          <h2>City name</h2>
          <div className={styles.table}></div>
          <div className={styles.map}></div>
        </div>
      </>
    );
}

export default HomeView;