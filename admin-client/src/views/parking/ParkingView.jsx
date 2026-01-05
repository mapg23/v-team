import MapDrawComponent from "../../components/map/react-draw/MapDrawComponent";
import CityDropDown from "../../components/input/CityDropDown";
import CityService from "../../services/cities";
import { useEffect, useState } from "react";
import ParkingService from "../../services/parkings";

export default function ParkingView() {
  // render map based on city coordinates
  const [cityCoordinates, setCityCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  // available parkingZones in city <id>
  const [parkingZones, setParkingZones] = useState(null);
  const [cityId, setCityId] = useState(1);

  // render parking zone form
  const [renderForm, setRenderForm] = useState(false);

  // New parking zone
  const [parkingZoneCoords, setParkingZoneCoords] = useState(null);
  const [zoneName, setZoneName] = useState("");

  /**
   * Fetch data on useEffect, triggered by CityId
   * cityId is set from selecting a city via CityDropDown component
   */
  useEffect(() => {
    async function fetchData() {
      if (!cityId) return;

      // get city details based on params
      const city = await CityService.getCityDetailsById(cityId);
      if (city.id) {
        const coords = {
          latitude: city.latitude,
          longitude: city.longitude,
        };
        setCityCoordinates(coords);
        // Get parking zones
        const pZones = await CityService.getParkingZonesInCity(cityId);
        if (Array.isArray(pZones) && pZones.length > 0) {
          setParkingZones(pZones);
        }
      }
    }
    fetchData();
  }, [cityId]);

  /**
   * Get selection city option from CityDropDown Component
   * Set cityId state to trigger useEffect
   * @param {number} cityId
   */
  async function initCityid(cityId) {
    if (cityId) setCityId(Number(cityId));
  }

  /**
   * Set coordinates for the new parking zone
   * @param {Array} coordinates array of coordinates for the parking zone
   */
  async function initNewParkingZone(parkingZoneCoords) {
    if (Array.isArray(parkingZoneCoords) && parkingZoneCoords.length > 0) {
      setParkingZoneCoords(parkingZoneCoords[0]);
      setRenderForm(true);
    } else {
      console.log("invalid parkingZoneCoords", parkingZoneCoords);
    }
  }

  /**
   * Create parkingzone in database
   * @param {event} e
   */
  async function handleSubmit(e) {
    // const { cityId, maxLat, maxLong, minLat, minLong } = req.body;
    e.preventDefault();
    const cords = parkingZoneCoords.slice();

    const lats = cords.map((c) => c.lat);
    const lngs = cords.map((c) => c.lng);

    console.log(lats, lngs);
    const zoneObj = {
      cityId: cityId,
      maxLat: Math.max(...lats),
      maxLong: Math.max(...lngs),
      minLat: Math.min(...lats),
      minLong: Math.min(...lngs),
    };

    const newParking = await ParkingService.addNewParkingZone(zoneObj);

    console.log(newParking);
  }

  return (
    <div className="wrapper">
      <div className="card">
        <CityDropDown action={initCityid} />
        <p>{renderForm ? "ja" : "nej"}</p>
        {renderForm ? (
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="input">
                <label htmlFor="zoneName">
                  Välj ett namn för parkeringen:{" "}
                </label>
                <input
                  type="text"
                  id="zoneName"
                  onChange={(e) => setZoneName(e.target.value)}
                />
              </div>
              <button type="submit">Spara parkering!</button>
            </form>
          </div>
        ) : (
          ""
        )}
        {cityCoordinates.latitude && cityCoordinates.longitude ? (
          <MapDrawComponent
            coords={cityCoordinates}
            action={initNewParkingZone}
            parkingZones={parkingZones}
          />
        ) : (
          <p>
            Staden saknar koordinater {cityCoordinates.latitude}{" "}
            {cityCoordinates.longitude}
          </p>
        )}
      </div>
    </div>
  );
}
