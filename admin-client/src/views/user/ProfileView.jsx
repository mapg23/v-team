import { useState, useEffect } from "react";
import UserService from "../../services/users";
import TripService from "../../services/trips";
import { useParams } from "react-router";
import Profile from "../../components/user/Profile";
import Balance from "../../components/user/Balance";
import History from "../../components/user/History";
import styles from "../../components/user/Styles.module.css";

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
  const [tripHistory, setTripHistory] = useState([]);

  /**
   * Fetch all data and set loading = false when done
   *
   */
  useEffect(() => {
    async function fetchData() {
      const userDetails = await UserService.getUserDetails(userId);
      console.log(userDetails)
      setUserDetails(userDetails);
      // const balance = await UserService.getUserBalanceDetails(userId);
      // console.log(balance)
      const userTrips = await TripService.getTripsByUserId(userId);
      setTripHistory(userTrips);

      // render component asap
      // dont wait for addreses, slow api
      setLoading(false);

      // Try get adresses 
      fetchAdress(userTrips);
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

  if (!params.id) {
    return <p>no userid provided...</p>;
  }

  if (!loading) {
    return (
      <>
        <div className={styles.profileWrapper}>
          {/* {USER PROFILE} */}
          <h2>{userDetails[0].username ? userDetails[0].username + " profile" : "Profilepage"}</h2>
          <Profile userDetails={userDetails} />
          {/* {USER BALANCE} */}
          <Balance balance={balance} />

          {/* {USER TRIPS} */}
          <History tripHistory={tripHistory} />
        </div>
      </>
    );
  }
  return (
    <>
      <p>hämtar data..</p>
    </>
  );
}
