import { useEffect, useState } from "react";
import CityService from "../../services/cities";
import BikeService from "../../services/bikes";
import DynamicTable from "../table/DynamicTable";
import RadioForm from "../forms/RadioForm";

/**
 * Component for viewing information about where
 * a bike is charging.
 * Also offers utility to move to a certaing charging station
 */
export default function BikeCharging({ bikeData, updateState }) {
  const [loading, setLoading] = useState(true);
  const [chargingData, setChargingData] = useState([]);

  /**
   * Move bike to selected parking station
   *
   */
  async function moveToChargingStation(data) {
    const charging = chargingData.find((station) => station.name === data);
    const bikeObj = await BikeService.moveBikeToChargingZone(
      bikeData.id,
      charging.id
    );
    // Call provided method to update state
    if (bikeObj.id) {
      bikeObj.city_name = bikeData.city_name; // city_name is not included in response
      updateState(bikeObj);
    }
  }

  /**
   * Get data based on bikeData object
   */
  useEffect(() => {
    async function getData() {
      if (!bikeData.id) return;
      const chargingData = await CityService.getChargingStationsInCity(
        bikeData.city_id
      );
      if (Array.isArray(chargingData)) setChargingData(chargingData);
      setLoading(false);
    }
    getData();
  }, [bikeData]);

  if (loading) return <p>loading data..</p>;
  return (
    <div className="card">
      <h2>Tillgängliga laddstationer</h2>
      <DynamicTable data={chargingData} />
      <p>Välj en laddstation för att flytta en cykel</p>
      <RadioForm
        title="Välj laddstation"
        data={chargingData}
        action={moveToChargingStation}
        type="Laddstation"
      />
    </div>
  );
}
