import MapDrawComponent from "../../components/map/react-draw/MapDrawComponent";
import CityDropDown from "../../components/input/CityDropDown";
import CityService from "../../services/cities";
import { useEffect, useState } from "react";
import stationService from "../../services/stations";
import CreateChargingZoneForm from "../../components/forms/CreateChargingZoneForm";
import ChargingTable from "../../components/table/ChargingTable";
import { polygon } from "leaflet";

export default function ChargingView() {
  // render map based on city coordinates
  const [cityCoordinates, setCityCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  // Current charging Zones
  const [chargingZones, setChargingZones] = useState([]);
  const [cityId, setCityId] = useState(1);

  // New charging zone
  const [chargingZoneCoords, setChargingZoneCoords] = useState(null);
  const [renderChargingZoneForm, setRenderChargingZoneForm] = useState(false);

  /**
   * fetchData manually
   * @returns
   */
  async function fetchData() {
    // get city details based on params
    const city = await CityService.getCityDetailsById(cityId);
    if (city.id) {
      const coords = {
        latitude: city.latitude,
        longitude: city.longitude,
      };
      setCityCoordinates(coords);
      // Get parking zones
      const cZones = await CityService.getChargingStationsInCity(cityId);
      if (Array.isArray(cZones) && cZones.length > 0) {
        setChargingZones(cZones);
      }
    }
  }

  /**
   * Fetch data on useEffect, triggered by CityId
   * cityId is set from selecting a city via CityDropDown component
   */
  useEffect(() => {
    if (!cityId) return;
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
   * Call method based on draw:created layerType
   * @param {Event} event draw:created
   */
  async function initChargingZoneCreation(layer) {
    const chargingZoneCoords = layer.getLatLng();
    if (chargingZoneCoords.lat && chargingZoneCoords.lng)
      setChargingZoneCoords(chargingZoneCoords);
  }

  /**
   * Create the actual Charging Zone
   * @param {Event} event draw:created
   */
  async function createChargingZone(zoneName) {
    const cZone = {
      cityId: `${cityId}`,
      name: `${zoneName}`,
      latitude: chargingZoneCoords.lat,
      longitude: chargingZoneCoords.lng,
      capacity: 50,
    };

    const created = await stationService.createNewChargingStation(cZone);
    if (created.id) fetchData();
  }

  /**
   * Show form for creating a charing zone
   * Only renders if coordinates for a charging zone are set
   */
  useEffect(() => {
    if (chargingZoneCoords) {
      setRenderChargingZoneForm(true);
    }
  }, [chargingZoneCoords]);

  /**
   * Options to include as EditableContent 
   */
  const editOptions = {
    editable: true,
    marker: true,
    rectangle: false, 
    circle: false,
    circlemarker: false,
    polyline: false,
    polygon: false
  };

  return (
    <div className="wrapper">
      <h1>Charging View</h1>
      <div className="card">
        <div className="card">
          <CityDropDown action={initCityid} />
          {cityCoordinates.latitude && cityCoordinates.longitude ? <ChargingTable data={chargingZones}/> : ""}
        </div>
        {renderChargingZoneForm ? (
          <div className="card">
            <CreateChargingZoneForm onFormSubmit={createChargingZone} />
          </div>
        ) : (
          ""
        )}
        {cityCoordinates.latitude && cityCoordinates.longitude ? (
          <MapDrawComponent
            coords={cityCoordinates}
            action={initChargingZoneCreation}
            chargingZones={chargingZones}
            editOptions={editOptions}
            // chargingZones={chargingZones}
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
