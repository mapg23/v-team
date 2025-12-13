import CityDropDown from "../input/CityDropDown";
import { useState, useEffect } from "react";
import style from "./Form.module.css";
import getCoordinates from "../../services/nominatim";
import cityService from "../../services/cities";
/**
 * UI Component for creating a bike in a city
 */
export default function CreateBikeForm({ action }) {
  const [loading, setLoading] = useState(true);

  const [cityId, setCityid] = useState(null);

  /**
   * render when done
   */
  useEffect(() => {
    setLoading(false);
  }, []);

  /**
   * Set city id for the bike to be created in
   *
   * @param {int} cityId
   */
  function handleSelection(cityId) {
    console.log(cityId);
    setCityid(cityId);
  }

  /**
   * Call provided action on submit
   */
  async function handleSubmit() {
    const city = await cityService.getCityDetailsById(cityId);
    const response = await getCoordinates(city.name);

    const cityObj = {
      city_id: cityId,
      location: [response[0].lat, response[0].lon].join(),
      lat: response[0].lat,
      long: response[0].lon,
    };

    // call provided method
    action(cityObj);
  }

  if (loading) return <p>loading form..</p>;
  return (
    <>
      <CityDropDown action={handleSelection}></CityDropDown>
      <form className={style.form}>
        <button type="button" onClick={handleSubmit}>
          Create bike!
        </button>
      </form>
    </>
  );
}
