import { useEffect, useState } from "react";
import CityService from "services/cities";
import userService from "services/users";
import CityDropDown from "../../components/input/CityDropDown";
import { useNavigate } from "react-router-dom";
import bikeService from "../../services/bikes";
import parkingService from "../../services/parkings";
import stationService from "../../services/stations";
import { ArrowIcon } from "../../components/icons/react-icons";

/**
 * Home view for admin
 *
 * Display Nav and dashboard(?)
 */
function HomeView() {
  // Only render elements when loading is false
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Number of cities
  const [cities, setCities] = useState(0);

  // Number of pZones
  const [pZones, setPZones] = useState(0);

  // Number of cZones
  const [cZones, setCZones] = useState(0);

  // Number of bikes
  const [bikes, setBikes] = useState(0);

  // Number of users
  const [users, setUsers] = useState(0);

  // -----------------------------
  // Fetch initial data
  // -----------------------------
  useEffect(() => {
    async function fetchData() {
      const cities = await CityService.getAllCities();
      setCities(cities.length);
      const userCount = await userService.countAllUsers();
      const users = await userService.getAllUsers({ limit: userCount.total }); // get all users
      setUsers(users.users.length);
      const bikes = await bikeService.countAllBikes(); // get all bikes
      setBikes(bikes.total);
      const pZOnes = await parkingService.getAllParkingZones();
      setPZones(pZOnes.length);
      const cZones = await stationService.getAllStations();
      setCZones(cZones.length);

      // Loading is done when all data is fetched
      setLoading(false);
    }
    fetchData();
  }, []);

  /**
   * Method for handling the selectionChange
   * @param {id} cityId redirect to city/:id
   */
  function redirectToCity(cityId) {
    navigate(`/city/${cityId}`);
  }

  // Visa en översikt endast om användare inte valt stad
  // och data har hämtats
  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <div className="wrapper">
        <div className="card">
          <section>
            <h1>Administration</h1>
            <h2>Välkommen till adminverktyget för Rull</h2>
            <p>
              Här finns verktyg för att hantera städer, cyklar och användare.<br />
              Du hittar verktygen genom navigera via den vänstra kolumnen eller{" "}
              <br />
              genom att välja ett verktyg nedan.</p>
            <p>
              Vill du gå till en specifik stad kan du välja i dropdown listan
              nedan<br />
            </p>
          </section>
          <h2>Inspektera en stad</h2>
          <CityDropDown action={redirectToCity}></CityDropDown>
        </div>
        <div className="card">
          <div className="systemHeader">
            <h2>Verktyg</h2>
          </div>
          <div className="systems">
            {/* CITIES */}
            <div className="systemCard">
              <a href="/cities">
                <div className="imageDiv">
                  <img src="./src/assets/city.png" alt="city" />
                </div>
                <div className="systemText">
                  <h3><span className="system-text">Vi finns i {cities} städer</span></h3>
                  <p>Hantera städer <ArrowIcon className="arrow-icon" /></p>
                </div>
              </a>
            </div>

            {/* BIKES */}
            <div className="systemCard">
              <a href="/bikes">
                <div className="imageDiv">

                  <img src="./src/assets/bikes.png" alt="city" />

                </div>
                <div className="systemText">
                  <h3>Vi hanterar hela {bikes} cyklar!</h3>
                  <p>Hantera Cyklar <ArrowIcon className="arrow-icon" /></p>
                </div>
              </a>
            </div>
            {/* USERS */}

            <div className="systemCard">
              <a href="/users">
                <div className="imageDiv">
                  <img src="./src/assets/user.png" alt="city" />
                </div>
                <div className="systemText">
                  <h3>{users} användare älskar oss!</h3>
                  <p>Hantera Användare <ArrowIcon className="arrow-icon" /></p>
                </div>
              </a>
            </div>

            {/* PZONES */}
            <div className="systemCard">
              <a href="/parkings">
                <div className="imageDiv">
                  <img src="./src/assets/pzone.png" alt="city" />
                </div>
                <div className="systemText">
                  <h3>Våra {pZones} parkeringar!</h3>
                  <p>Hantera Parkeringar <ArrowIcon className="arrow-icon" /></p>
                </div>
              </a>
            </div>

            {/* CZONES */}
            <div className="systemCard">
              <a href="/stations">
                <div className="imageDiv">
                  <img src="./src/assets/czone.png" alt="city" />
                </div>
                <div className="systemText">
                  <h3>Våra {cZones} laddstationer!</h3>
                  <p>Hantera Laddstationer <ArrowIcon className="arrow-icon" /></p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeView;
