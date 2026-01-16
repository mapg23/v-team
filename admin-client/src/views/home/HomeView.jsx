import { useEffect, useState } from "react";
import CityService from "services/cities";
import userService from "services/users";
import CityDropDown from "../../components/input/CityDropDown";
import { useNavigate } from "react-router-dom";
import bikeService from "../../services/bikes";
import parkingService from "../../services/parkings";
import stationService from "../../services/stations";

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
      const users = await userService.getAllUsers({ limit: 0 }); // get all users
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
            <h2>Välkommen till admin verktyget för Rull</h2>
            <p>
              Här finns verktyg för att hantera städer, cyklar och användare.
            </p>
            <p>
              Du hittar verktygen genom navigera via den vänstra kolumnen eller{" "}
              <br />
              genom att välja ett verktyg nedan.
            </p>
            <p>
              Vill du gå till en specifik stad kan du välja i dropdown listan
              nedan
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
              <div className="imageDiv">
                <a href="/cities">
                  <img src="./src/assets/city.png" alt="city" />
                </a>
              </div>
              <div className="systemText">
                <h3>Vi finns i {cities} städer!</h3>
                <p>Hantera städer</p>
              </div>
            </div>

            {/* BIKES */}
            <div className="systemCard">
              <div className="imageDiv">
                <a href="/bikes">
                  <img src="./src/assets/bikes.png" alt="city" />
                </a>
              </div>
              <div className="systemText">
                <h3>Vi hanterar hela {bikes} cyklar!</h3>
                <p>Hantera Cyklar</p>
              </div>
            </div>
            {/* USERS */}

            <div className="systemCard">
              <div className="imageDiv">
                <a href="/users">
                  <img src="./src/assets/user.png" alt="city" />
                </a>
              </div>
              <div className="systemText">
                <h3>{users} användare älskar oss!</h3>
                <p>Hantera Användare</p>
              </div>
            </div>

            {/* PZONES */}
            <div className="systemCard">
              <div className="imageDiv">
                <a href="/parkings">
                  <img src="./src/assets/pzone.png" alt="city" />
                </a>
              </div>
              <div className="systemText">
                <h3>Våra {pZones} parkeringar!</h3>
                <p>Hantera Parkeringar</p>
              </div>
            </div>

            {/* CZONES */}
            <div className="systemCard">
              <div className="imageDiv">
                <a href="/stations">
                  <img src="./src/assets/czone.png" alt="city" />
                </a>
              </div>
              <div className="systemText">
                <h3>Våra {cZones} laddstationer!</h3>
                <p>Hantera Laddstationer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeView;
