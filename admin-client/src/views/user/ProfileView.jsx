import { useState, useEffect } from "react";
import UserService from "../../services/users";
import { useParams } from "react-router";
import Profile from "../../components/user/Profile";
import Balance from "../../components/user/Balance";
import History from "../../components/user/History";

/**
 * View for viewing a profile
 */
export default function UserView() {
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

  // Fetch all data for overview
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

  if (!loading) {
    return (
      <>
      <h2>Profilepage</h2>
        <Profile userDetails={userDetails} />
        <Balance balance={balance} />
        <History history={history} />
      </>
    );
  }
  return (
    <>
      <p>hämtar data..</p>
    </>
  );
}
