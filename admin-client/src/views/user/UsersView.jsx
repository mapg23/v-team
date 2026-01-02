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

  // -----------------------------
  // Fetch initial data
  // -----------------------------
  useEffect(() => {
    async function fetchData() {
      // get all users
      setActiveUsers(await userService.getAllUsers());

      // Loading is done when all data is fetched
      setLoading(false);
    }
    fetchData();
  }, []);


  // Visa en översikt endast om användare inte valt stad
  // och data har hämtats
  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="wrapper">
      <div className="card">
        <h2>Users</h2>
        <UserTable data={activeUsers} />
      </div>
    </div>
  );
}

export default HomeView;
