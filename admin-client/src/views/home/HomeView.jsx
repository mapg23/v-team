import styles from "./HomeView.module.css";
import Map from "@/components/map/Map-component";
import { useEffect, useState } from "react";
import SelectCity from "components/input/SelectCity";
import getCoordinates from "services/nominatim";
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

  // Current selected city
  const [selectedCity, setselectedCity] = useState({
    id: null,
    name: null,
    stations: null,
    bikes: null,
  });

  // Array containing City Objects with details
  // [ id: null,
  //   name: null,
  //   stations: null,
  //   bikes: null ]
  const [allCityDetails, setAllCityDetails] = useState([]);

  // when admin chose a city - the map componentent updates accordingly
  const [cityCoordinates, setCityCoordinates] = useState({
    lat: null,
    long: null,
  });

  // City details, including, id, name, stations and bikes
  const [cityDetails, setCityDetails] = useState({
    id: null,
    name: null,
    stations: null,
    bikes: null,
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
    }
    fetchData();
  }, []);

  /**
   * Get all city details based from cities
   * @param {Array} arrayOfCities array of city objects
   */
  async function getAllCityDetails(arrayOfCities) {
    // const promises = arrayOfCities.map((city) =>
    //   CityService.getCityDetails(city.id)
    // );
    // // Vänta tills ALLA är klara
    // const allCityDetails = await Promise.all(promises);
    // console.log(allCityDetails);
    const allCityDetails = await cityService.getCityDetails();
    setAllCityDetails(allCityDetails);
    setLoading(false);
  }

  /**
   * Get city details
   * { "id": 1, "name": "Stockholm", "stations": 5, "bikes": 240 }
   * @param {Int} id the id of a city
   * @returns {None}
   */
  async function getCityDetails(id) {
    const cityDetails = await CityService.getCityDetails(id);
    setCityDetails(cityDetails);
  }

  /**
   * Show city in map component
   * City is chosen from select element
   * @param {string} city name
   */
  async function setMap(city) {
    // When specifics is true, render map Component
    setUserSelected(true);
    const [place, boundary] = await getCoordinates(city);
    setCityCoordinates({ lat: place.lat, long: place.lon });

    // Get cityObject based on city name from Select option
    const chosenCity = allCityDetails.find((cityObj) => cityObj.name === city);
    // Update current city details
    getCityDetails(chosenCity.id);
    setselectedCity(chosenCity);
  }

  // Visa en översikt endast om användare inte valt stad
  // och data har hämtats
  if (!userSelected) {
    if (!loading) {
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
      return (
        <>
          <h1>Loading..</h1>
        </>
      );
  }

  if (userSelected)
    return (
      <>
        <SelectCity setMap={setMap} cityOptions={cityOptions} />
        <h2>{selectedCity.name}</h2>
        <CityTable data={cityDetails} />
        {/* {JSON.stringify(cityDetails)} */}
        <PieChart total={500} used={100} />
        <Map coords={cityCoordinates} bikes={cityDetails} />
      </>
    );
}

export default HomeView;
