import styles from "./HomeView.module.css";
import Map from "../../components/map/Map-component"
import { useEffect, useState } from "react";
import SelectCity from "../../components/input/SelectCity";
import getCoordinates from "../../services/nominatim"

/**
 * Home view for admin
 *
 * Display Nav and dashboard(?)
 */
function HomeView() {
  const [citys, setCitys] = useState([]);
  const [cityCoordinates, setCityCoordinates] = useState({
    lat: null, 
    long: null,
  });

  // fetch call to get all available citys
  // Göteborg, Uppsala etc
  useEffect(() => {
    setCitys(["Uppsala", "Göteborg", "Jönköping"]);
  },[]);

  /**
   * Set data by city
   * @param {string} city name
   */
  async function setMap(city) {
    const [place, boundary] = await getCoordinates(city);
    setCityCoordinates({"lat": place.lat, "long": place.lon})
  }

  return (
    <>
      <h2>City name</h2>
      <div className={styles.table}>
        <SelectCity setMap={setMap} cityData={citys} />
      </div>
      <Map coords={cityCoordinates} bikes={"bikes"} />
    </>
  );
}

export default HomeView;
