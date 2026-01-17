import CityDropDown from "../input/CityDropDown";
import { useState } from "react";
import style from "./Form.module.css";
import getCoordinates from "../../services/nominatim";
import cityService from "../../services/cities";
/**
 * UI Component for creating a bike in a city
 */
export default function CreateBikeForm({ action }) {

  const [cityId, setCityid] = useState(null);

  /**
   * Set city id for the bike to be created in
   *
   * @param {int} cityId
   */
  function handleSelection(cityId) {
    setCityid(cityId);
  }

  /**
   * Call provided action on submit
   */
  async function handleSubmit() {
    if (!cityId) return;
    const city = await cityService.getCityDetailsById(cityId);
    const response = await getCoordinates(city.name);

    const cityObj = {
      cityId: cityId,
      // location: [response[0].lat, response[0].lon].join(),
      latitude: response[0].lat,
      longitude: response[0].lon,
    };

    // call provided method
    action(cityObj);
  }

  return (
    <>
      <CityDropDown action={handleSelection}></CityDropDown>
      <form className={style.form}>
        <button type="button" onClick={handleSubmit}>
          Lägg till cykel
        </button>
      </form>
    </>
  );
}
