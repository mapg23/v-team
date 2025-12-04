import styles from "./HomeView.module.css";
import Map from "../../components/map/Map-component"
import { useEffect, useState } from "react";
import SelectCity from "../../components/input/SelectCity";
import getCoordinates from "../../services/nominatim";
import CityService from "../../services/cities";
import CityTable from "../../components/table/cityTable";

/**
 * Home view for admin
 *
 * Display Nav and dashboard(?)
 */
function HomeView() {
  // City options for SelectCity component
  const [citys, setCitys] = useState([]);

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

  // Fetch all available cities.
  useEffect(() => {
    async function fetchData() {
      const cities = await CityService.getAllCities();
      setCitys(cities.map((city) => city.name));
    }
    fetchData();
  }, []);

  /**
   * Set data by city
   * @param {string} city name
   */
  async function setMap(city) {
    const [place, boundary] = await getCoordinates(city);
    setCityCoordinates({ lat: place.lat, long: place.lon });
    getCityData();
  }

  /**
   * Get all city details
   * { "id": 1, "name": "Stockholm", "stations": 5, "bikes": 240 }
   */
  async function getCityData() {
    const cityDetails = await CityService.getCityDetails();
    setCityDetails(cityDetails);
  }

  return (
    <>
      <h2>{cityDetails.name}</h2>

      <div className={styles.table}>
        <SelectCity setMap={setMap} cityData={citys} />
      </div>
      <CityTable cityDetails={cityDetails} />
      <Map coords={cityCoordinates} bikes={cityDetails} />
    </>
  );
}

export default HomeView;
