import MapDrawComponent from "../../components/map/react-draw/MapDrawComponent";
import CityDropDown from "../../components/input/CityDropDown";
import CityService from "../../services/cities";
import { useEffect, useState } from "react";
import stationService from "../../services/stations";
import CreateChargingZoneForm from "../../components/forms/CreateChargingZoneForm";
import ChargingTable from "../../components/table/ChargingTable";
import style from "../../components/forms/Form.module.css";

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

  // layer - remove when new zone is created
  const [layer, setLayer] = useState(null);

  // Results from create / delete
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState("error");

  /**
   * Styles for create / delete result
   */
  const resultClassMap = {
    success: style.success,
    error: style.error,
    warning: style.warning,
    info: style.info,
  };

  // Get current result
  const resultClass = resultClassMap[resultType] || "";

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
      if (Array.isArray(cZones)) {
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
    // reset result
    async function getData() {
      await fetchData();
      setResult(null);
    }
    getData();
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
    if (chargingZoneCoords.lat && chargingZoneCoords.lng) {
      setChargingZoneCoords(chargingZoneCoords);
      setRenderChargingZoneForm(true);
      setLayer(layer);
    }
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
    if (created.id) {
      fetchData();
      setRenderChargingZoneForm(false);
      // clear layer
      layer.remove();
      setLayer(false);
      // show result
      setResult(`Ny laddstation: ${cZone.name}`);
      setResultType("success");
    }
  }

  /**
   * Delete zone and re-fetch data
   * @param {Number} zoneId delete zone with <id>
   */
  async function deleteZone(zoneId) {
    if (zoneId) {
      const response = await stationService.deleteChargingZone(zoneId);
      if (response.ok) {
        setResult(`Laddstation raderad`);
        setResultType("success");
        fetchData();
      }
    }
  }

  /**
   * Options to include as EditableContent
   */
  const editOptions = {
    marker: true,
    rectangle: false,
    circle: false,
    circlemarker: false,
    polyline: false,
    polygon: false,
  };

  return (
    <div className="wrapper">
      <div className="card">
        <h1>Laddstationer</h1>
        <p>
          I följande vy kan du inspektera samt ta bort befintliga stationer.
        </p>
        <p>Vill du skapa en ny station använder verktyget i kartan.</p>
      </div>
      <div className="card">
        <div className="card">
          <CityDropDown action={initCityid} />
          <p className={resultClass}>{result}</p>
          {cityCoordinates.latitude && cityCoordinates.longitude ? (
            <ChargingTable data={chargingZones} action={deleteZone} />
          ) : (
            ""
          )}
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
