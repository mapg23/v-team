import Map from "@/components/map/Map-component";
import { useEffect, useState } from "react";
import CityService from "services/cities";
import BikeService from "../../services/bikes";
// import CityService from "../../services/cities";
import { useNavigate, useParams } from "react-router";
import CityDropDown from "../../components/input/CityDropDown";
import TableWithActions from "../../components/table/TableWithActions";
import DynamicTable from "../../components/table/DynamicTable";
import styles from "./styles.module.css";
import RadioForm from "components/forms/RadioForm";
import Button from "@mui/material/Button";



/**
 * View a specific bike
 */
export default function InspectBikeView() {
  const [loading, setLoading] = useState(true);
  const param = useParams();
  const bikeId = param.id;
  const [bikeInfo, setBikeInfo] = useState(null);
  const [chargingStations, setChargingStations] = useState([]);
  const [cityId, setCityId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      if (!bikeId) return;
      const bikeData = await BikeService.getSingleBike(bikeId);
      if (bikeData) {
        setBikeInfo(bikeData);
        setCityId(bikeData.city_id);
        const stationData = await CityService.getChargingStationsInCity(
          bikeData.city_id
        );
        if (stationData) {
          setChargingStations(stationData);
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
    const bikeObj = await BikeService.moveBikeToChargingZone(bikeId, station.id)
    if (bikeObj.id) {
        setBikeInfo(bikeObj);
    }
  }

  /**
   * show bike on map => navigate city/id
   */
  async function viewOnmap(){
    navigate(`/city/${cityId}`)
  }

  // Visa stad cykel befinner sig i - check

  // Ge möjlighet att flytta till parkering

  if (loading) return <p>Hämtar cykeldata..</p>;

  return (
    <>
      <h1>Inspecting bike with id {bikeId}</h1>
      <div className={styles["info-container"]}>
        <div className="bike">
          <DynamicTable data={bikeInfo} vertical={true} />
        </div>
        <div className="charging">
          <h2>Tillgängliga laddstationer</h2>
          <DynamicTable data={chargingStations} />
          <RadioForm
            title={"Laddstationer"}
            data={chargingStations}
            action={moveToChargingStation}
          />
        </div>
        <div className="redirect">
          <Button variant="contained" onClick={viewOnmap}>
            Visa på karta
          </Button>
        </div>
      </div>
    </>
  );
}
