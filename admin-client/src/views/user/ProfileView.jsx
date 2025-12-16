import { useState, useEffect } from "react";
import UserService from "../../services/users";
import { useParams, Navigate, useNavigate } from "react-router";
import Profile from "../../components/user/Profile";
import Balance from "../../components/user/Balance";
import History from "../../components/user/History";
import styles from "../../components/button/Button.module.css";

/**
 * View for viewing a profile
 */
export default function UserView() {
  const navigate = useNavigate();

  // Get params
  const params = useParams();
  const userId = params.id;

  // Render data when set
  const [loading, setLoading] = useState(true);

  /**
   * User Details
   */
  const [userDetails, setUserDetails] = useState({
    id: null,
    name: null,
    email: null,
  });

  /**
   * User saldo
   */
  const [balance, setBalance] = useState(0);

  /**
   * User rental history
   */
  const [history, setHistory] = useState([
    {
      id: null,
    },
  ]);

  if (!params.id) {
    return <p>no userid provided...</p>;
  }

  /**
   * Fetch all data and set loading = false when done
   *
   */
  useEffect(() => {
    async function fetchData() {
      const userDetails = await UserService.getUserDetails(userId);
      const balance = await UserService.getUserBalanceDetails(userId);
      const history = await UserService.getUserRentalDetails(userId);
      setUserDetails(userDetails);
      setBalance(balance);
      setHistory(history);
      // data is fetched, render
      setLoading(false);
    }
    fetchData();
  }, []);

  /**
   * Delete user
   */
  async function handleSubmit(event) {
    event.preventDefault();
    const success = await UserService.deleteUser(userId);
    if (success) navigate("/welcome");
  }

  if (!loading) {
    return (
      <>
        <h2>Profilepage</h2>
        <Profile userDetails={userDetails} />
        <Balance balance={balance} />
        <History history={history} />
        <form onSubmit={handleSubmit}>
          <button
            className={`${styles.buttuon} ${styles.delete}`}
            type="submit"
          >
            Delete user
          </button>
        </form>
      </>
    );
  }
  return (
    <>
      <p>hämtar data..</p>
    </>
  );
}
