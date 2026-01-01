import { useState, useEffect } from "react";
import UserService from "../../services/users";
import TripService from "../../services/trips";
import { useParams, useNavigate } from "react-router";
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
  const [tripHistory, setTripHistory] = useState([]);

  /**
   * Fetch all data and set loading = false when done
   *
   */
  useEffect(() => {
    async function fetchData() {
      // const userDetails = await UserService.getUserDetails(userId);
      // const balance = await UserService.getUserBalanceDetails(userId);
      const userTrips = await TripService.getTripsByUserId(userId);
      setTripHistory(userTrips);
      setLoading(false);
      fetchAdress(userTrips);
      // setUserDetails(userDetails);
      // setBalance(balance);
      // data is fetched, render
      // setLoading(false);
    }
    fetchData();
  }, [userId]);

  /**
   * Fetch all adresses from lat long
   * @param {Json} trips Array of trip Objects 
   */
  async function fetchAdress(trips) {
    let result = [];
    for (const trip of trips) {
      const urlStart = `https://nominatim.openstreetmap.org/reverse?lat=${trip.start_latitude}&lon=${trip.start_longitude}&format=json`;
      const responseStart = await fetch(urlStart);
      const dataStart = await responseStart.json();
      const urlEnd = `https://nominatim.openstreetmap.org/reverse?lat=${trip.end_latitude}&lon=${trip.end_longitude}&format=json`;
      const responseEnd = await fetch(urlEnd);
      const dataEnd = await responseEnd.json();

      // sett adress, if any
      const startAdress = dataStart?.address?.road;
      if (startAdress) {
        trip.startAdress = startAdress;
      }
      const endAdress = dataEnd?.address?.road;
      if (endAdress) {
        trip.endAdress = endAdress;
      }
      result.push(trip);
    }
    setTripHistory(result);
  }

  /**
   * Delete user
   */
  async function handleSubmit(event) {
    event.preventDefault();
    const success = await UserService.deleteUser(userId);
    if (success) navigate("/welcome");
  }

  if (!params.id) {
    return <p>no userid provided...</p>;
  }

  if (!loading) {
    return (
      <>
        <h2>Profilepage</h2>
        <Profile userDetails={userDetails} />
        <Balance balance={balance} />
        <History tripHistory={tripHistory} />
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
