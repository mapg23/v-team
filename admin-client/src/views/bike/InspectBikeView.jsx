import { useEffect, useState } from "react";
import CityService from "services/cities";
import BikeService from "../../services/bikes";
import { useNavigate, useParams } from "react-router";
import DynamicTable from "../../components/table/DynamicTable";
import RadioForm from "components/forms/RadioForm";

/**
 * View a specific bike
 */
export default function InspectBikeView() {
  const [loading, setLoading] = useState(true);
  const param = useParams();
  const bikeId = param.id;
  const [bikeInfo, setBikeInfo] = useState(null);
  const [chargingStations, setChargingStations] = useState([]);
  const [parkingStations, setParkingStations] = useState([]);
  const [city, setCity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      if (!bikeId) return;
      const bikeData = await BikeService.getSingleBike(bikeId);
      if (bikeData) {
        const cityData = await CityService.getCityDetailsById(bikeData.city_id);
        const stationData = await CityService.getChargingStationsInCity(
          bikeData.city_id
        );
        const parkingData = await CityService.getParkingZonesInCity(
          bikeData.city_id
        );
        if (cityData) {
          setCity(cityData);
          bikeData.city_name = cityData.name;
          setBikeInfo(bikeData);
        }
        if (stationData) {
          setChargingStations(stationData);
        }
        if (parkingData) {
          setParkingStations(parkingData);
        }
      }
      setLoading(false);
    }
    getData();
  }, [bikeId]);

  /**
   * Move bike to selected charging station
   *
   */
  async function moveToChargingStation(data) {
    const station = chargingStations.find((station) => station.name === data);
    const bikeObj = await BikeService.moveBikeToChargingZone(
      bikeId,
      station.id
    );
    if (bikeObj.id) {
      setBikeInfo(bikeObj);
    }
  }

  /**
   * Move bike to selected parking station
   *
   */
  async function moveToParkingStation(data) {
    const parking = parkingStations.find(
      (parking) => parking.id === Number(data)
    );
    const bikeObj = await BikeService.moveBikeToParkingZone(bikeId, parking.id);
    if (bikeObj.id) {
      setBikeInfo(bikeObj);
    }
  }

  /**
   * show bike on map => navigate city/id
   */
  async function viewOnmap() {
    navigate(`/city/${city.id}`);
  }

  /**
   * Stop a bike from running - useful if user is stealing bike
   */
  async function stopBike() {
    const tripId = "";
    console.log("stopping bike:", bikeId);
  }

  if (loading) return <p>Hämtar cykeldata..</p>;

  return (
    <div className="wrapper">
      <h1>Bike #{bikeId}</h1>

      {/* VÄNSTER KOLUMN */}
      <div className="card">
        <section>
          <h2>Bike information</h2>
          <DynamicTable data={bikeInfo} vertical />
          <br />

          <button onClick={stopBike}>Stoppa cykel {bikeId}</button>
        </section>
      </div>

      {/* CHARGING KOLUMN */}
      <div className="cardWrapper">
        <div className="card">
          <section>
            <h2>Charging stations in {city.name}</h2>

            <DynamicTable data={chargingStations} />
            <h2>Flytta cykel till laddstation</h2>
            <RadioForm
              title="Välj laddstation"
              data={chargingStations}
              action={moveToChargingStation}
              type="Laddstation"
            />
            <div>
              <button onClick={viewOnmap}>Visa på karta</button>
            </div>
          </section>
        </div>

        {/* PARKERINGS KOLUMN */}
        <div className="card">
          <section>
            <h2>Parking stations in {city.name}</h2>

            <DynamicTable data={parkingStations} />
            <h2>Flytta cykel till parkering</h2>
            <RadioForm
              title="Välj Parkering"
              data={parkingStations}
              action={moveToParkingStation}
              type="parkering"
            />
            <button onClick={viewOnmap}>Visa på karta</button>
          </section>
        </div>
      </div>
    </div>
  );
}
