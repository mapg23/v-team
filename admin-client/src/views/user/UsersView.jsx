import { useEffect, useState } from "react";
import UserTable from "components/table/UserTable";
import userService from "services/users";

/**
 * Home view for admin
 *
 * Display Nav and dashboard(?)
 */
function HomeView() {
  // Only render elements when loading is false
  const [loading, setLoading] = useState(true);

  // Active users
  const [activeUsers, setActiveUsers] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [max, setMax] = useState(false);

  /**
   * Update all data
   */
  async function getData() {
    const users = await userService.getAllUsers({ page });
    if (users.users.length > 0) {
      setActiveUsers(users.users);
      setMax(false);
    } else {
      setMax(true);
    }
  }

  // -----------------------------
  // Fetch initial data
  // -----------------------------
  /**
   * Fetch data when page is changed
   */
  useEffect(() => {
    async function fetchData() {
      await getData();
      setLoading(false);
    }
    fetchData();
  }, [page]);

  /**
   * Increment page by 1 if max is false
   */
  function increasePage() {
    if (!max) {
      setPage((page) => page + 1);
    }
  }

  /**
   * Reduce current page by 1
   * Only reduce if page is > 1
   */
  function reducePage() {
    if (page === 1) return;
    setPage((page) => page - 1);
  }

  // Visa en översikt endast om användare inte valt stad
  // och data har hämtats
  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="wrapper">
      <div className="card">
        <h1>Användare</h1>
        <p>I följande vy kan du inspektera användare.</p>
        <p>
          För att visa en användares tidigare rutter och kostnader trycker du
          profile symbolen
        </p>
      </div>
      <div className="card">
        <p>Current page {page}</p>
        <button onClick={reducePage}>
          Prev page: {page !== 1 ? page - 1 : page}
        </button>
        <button onClick={increasePage}>Next page: {page + 1}</button>
        <UserTable data={activeUsers} />
      </div>
    </div>
  );
}

export default HomeView;
