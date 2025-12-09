import styles from "./HomeView.module.css";
import Map from "@/components/map/Map-component";
import { useEffect, useState } from "react";
import SelectCity from "components/input/SelectCity";
// import getCoordinates from "services/nominatim";
import CityService from "services/cities";
import CityTable from "components/table/CityTable";
import UserTable from "components/table/UserTable";
import PieChart from "components/chart/PieChart";
import bikeService from "services/bikes";
import cityService from "services/cities";
import userService from "services/users";

/**
 * Home view for admin
 *
 * Display Nav and dashboard(?)
 */
function HomeView() {
  // Only render elements when loading is false
  const [loading, setLoading] = useState(true);

  // User selected a city and wants city details
  const [userSelected, setUserSelected] = useState(false);

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

  // Active users
  const [activeUsers, setActiveUsers] = useState([]);

  // Fetch all data for overview
  useEffect(() => {
    async function fetchData() {
      const cities = await CityService.getAllCities();
      setCityOptions(cities.map((city) => city.name));
      // Get details for all cities
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
    // When specifics is true, render map Component
    setUserSelected(true);
  }

  // Visa en översikt endast om användare inte valt stad
  // och data har hämtats
  if (!loading) {
    if (!userSelected) {
      return (
        <>
          <h1>Överblick</h1>
          {/* {JSON.stringify(allCityDetails)} */}
          <CityTable data={allCityDetails} />
          <h2>Users</h2>
          <UserTable data={activeUsers} />
          <h2>Välj en stad för att visa stadspecifika detaljer</h2>
          <SelectCity setMap={setMap} cityOptions={cityOptions} />
        </>
      );
    }
    // User selected a city
    return (
      <>
        <SelectCity setMap={setMap} cityOptions={cityOptions} />
        <h2>{chosenCityDetails.name}</h2>
        <div style={{ display: "flex", justifyContent: "space-around"}}>
          <CityTable data={chosenCityDetails} vertical={true} />
          {/* {JSON.stringify(chosenCityDetails)} */}
          <PieChart total={500} used={100} />
        </div>
        <Map coords={chosenCityDetails} bikes={0} />
      </>
    );
  }
  // data is loading
  return (
    <>
      <h1>Loading..</h1>
    </>
  );
}

export default HomeView;
