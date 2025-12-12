import Map from "@/components/map/Map-component";
import { useEffect, useState } from "react";
import SelectCity from "components/input/SelectCity";
import CityService from "services/cities";
import CityTable from "components/table/CityTable";
import PieChart from "components/chart/PieChart";
import userService from "services/users";
import BikeSocket from "components/socket/BikeSocket";
import bikeService from "../../services/bikes";
import { useParams, Navigate, useNavigate } from "react-router";

/**
 * View for showing a city based on url
 */
export default function InspectCityView() {
  // Get params
  const params = useParams();
  const cityId = params.id;

  // Only render elements when loading is false
  const [loading, setLoading] = useState(true);

  // Select options for choosing a city
  // Available cities are fetched in useEffect
  const [cityOptions, setCityOptions] = useState([]);

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

  // City chosen from select button
  const [chosenCityDetails, setChosenCityDetails] = useState({
    id: null,
    name: null,
    latitute: null,
    longitude: null,
    bike_count: null,
  });

  // Sync bikes from database
  const [bikes, setBikes] = useState([]);

  // Active users
  const [activeUsers, setActiveUsers] = useState([]);

  // -----------------------------
  // Update bikes from socket
  // -----------------------------
  function updateBikes(bikeData) {
    setBikes(bikeData);
  }

  // -----------------------------
  // Fetch initial data
  // -----------------------------
  useEffect(() => {
    async function fetchData() {
      const cities = await CityService.getAllCities();
      setCityOptions(cities.map((city) => city.name));
      // Get details for all cities
      getAllCityDetails(cities);
      // get all users
      setActiveUsers(await userService.getAllUsers());
      // Start Bike Sync
      const answer = await bikeService.startBikeSync();
      console.log(answer);

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
      CityService.getCityDetails(city.id)
    );
    // Vänta tills ALLA är klara
    const allCityDetails = await Promise.all(promises);
    setAllCityDetails(allCityDetails);
  }

  /**
   * Show city in map component
   * City is chosen from select element
   * @param {string} city name
   */
  async function setMap(city) {
    // Get cityObject based on city name from Select option
    const chosenCity = allCityDetails.find((cityObj) => cityObj.name === city);

    // Update chosen city's details
    setChosenCityDetails(chosenCity);
  }

  // Visa en översikt endast om användare inte valt stad
  // och data har hämtats
  if (loading) return <h1>Loading...</h1>;

  return (
    <>
    <h1>CityView {cityId}</h1>
      <SelectCity setMap={setMap} cityOptions={cityOptions} />
      <h2>{chosenCityDetails.name}</h2>

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <CityTable data={chosenCityDetails} vertical={true} />
        <PieChart total={500} used={100} />
      </div>

      <Map coords={chosenCityDetails} bikes={bikes} />
    </>
  );
}
