import { useEffect, useState } from "react";
import CityService from "services/cities";
import CityTable from "components/table/CityTable";
import UserTable from "components/table/UserTable";
import userService from "services/users";
import CityDropDown from "../../components/input/CityDropDown";
import { useNavigate } from "react-router-dom";

/**
 * Home view for admin
 *
 * Display Nav and dashboard(?)
 */
function HomeView() {
  // Only render elements when loading is false
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Array containing City Objects with details
  // [ { id: null,
  //   name: null,
  //   stations: null,
  //   bikes: null }]
  const [allCityDetails, setAllCityDetails] = useState([
    {
      id: null,
      name: null,
      latitude: null,
      longitude: null,
      bike_count: null,
    },
  ]);

  // Active users
  const [activeUsers, setActiveUsers] = useState([]);

  // -----------------------------
  // Fetch initial data
  // -----------------------------
  useEffect(() => {
    async function fetchData() {
      const cities = await CityService.getAllCities();
      getAllCityDetails(cities);
      // get all users
      setActiveUsers(await userService.getAllUsers());

      // Loading is done when all data is fetched
      setLoading(false);
    }
    fetchData();
  }, []);

  /**
   * Get all city details based from cities
   * @param {Array} arrayOfCities array of city objects
   */
  async function getAllCityDetails(arrayOfCities) {
    const promises = arrayOfCities.map((city) =>
      CityService.getCityDetailsById(city.id)
    );
    // Vänta tills ALLA är klara
    const allCityDetails = await Promise.all(promises);
    setAllCityDetails(allCityDetails);
  }

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
      <CityDropDown action={redirectToCity}></CityDropDown>
      <h1>Överblick</h1>
      <CityTable data={allCityDetails} />
      <h2>Users</h2>
      <UserTable data={activeUsers} />
    </>
  );
}

export default HomeView;
