import { useEffect, useState } from "react";
import CityService from "../../services/cities";
import BikeService from "../../services/bikes";
import DynamicTable from "../../components/table/DynamicTable";
import RadioForm from "../forms/RadioForm";

/**
 * Component for viewing information about where
 * a bike is parked.
 * Also offers utility to move to a certaing parking station
 */
export default function BikeParking({ bikeData, updateState }) {
  const [loading, setLoading] = useState(true);
  const [parkingData, setParkingData] = useState([]);

  /**
   * Get data based on bikeData Object
   */
  useEffect(() => {
    console.log(bikeData);
    async function getData() {
      if (!bikeData.id) return;
      const parkingData = await CityService.getParkingZonesInCity(
        bikeData.city_id
      );
      if (Array.isArray(parkingData)) setParkingData(parkingData);
      console.log(parkingData);
      setLoading(false);
    }
    getData();
  }, [bikeData]);

  /**
   * Move bike to selected parking station
   * @param {string} data id of the selected radio element object
   */
  async function moveToParkingStation(data) {
    const parking = parkingData.find((parking) => parking.id === Number(data));
    const bikeObj = await BikeService.moveBikeToParkingZone(
      bikeData.id,
      parking.id
    );
    // Call provided method to update state
    if (bikeObj.id) {
      bikeObj.city_name = bikeData.city_name; // city_name is not included in response
      updateState(bikeObj);
    }
  }

  if (loading) return <p>loading data..</p>;
  return (
    <div className="card">
      <h2>Tillgängliga parkeringar</h2>
      <DynamicTable data={parkingData} />
      <p>Välj en parkering för att flytta en cykel</p>
      <RadioForm
        title="Välj parkering"
        data={parkingData}
        action={moveToParkingStation}
        type="Parkering"
      />
    </div>
  );
}
