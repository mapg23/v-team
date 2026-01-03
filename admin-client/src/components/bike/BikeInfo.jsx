import { useEffect, useState } from "react";
import CityService from "../../services/cities";
import BikeService from "../../services/bikes";
import TripService from "../../services/trips";
import { useNavigate } from "react-router";
import DynamicTable from "../../components/table/DynamicTable";
import BikeParking from "./BikeParking";
import BikeCharging from "./BikeCharging";
import { BsFillSignStopFill } from "react-icons/bs";
import BikeStyle from "./BikeStyle.module.css";

/**
 * Component for viewing information about a abike
 * and giving the possibility to stop a running bike
 * which is running mayhem.
 */
export default function BikeInfo({ bikeId }) {
  const [loading, setLoading] = useState(true);
  const [bikeInfo, setBikeInfo] = useState(null);
  // const [bikeTrip, setBikeTrip] = useState(null);
  const navigate = useNavigate();

  /**
   * Get data based on bikeId passed from parent
   */
  useEffect(() => {
    async function getData() {
      if (!bikeId) return;
      const bikeData = await BikeService.getSingleBike(bikeId);
      if (bikeData.id) {
        const bikeInCity = await CityService.getCityDetailsById(bikeData.city_id);
        if (bikeInCity.name) {
          bikeData.city_name = bikeInCity.name;
        }
        setBikeInfo(bikeData);
      }
      // if (bikeData.occupied) {
      //   const allBikesInUse = await BikeService.getAllBikesInUse();
      //   const currentBikeTrip = allBikesInUse.find((bike) => bike.id === bikeData.id);
      //   setBikeTrip(currentBikeTrip)
      // }
      setLoading(false);
    }
    getData();
  }, [bikeId]);

  /**
   * show bike on map => navigate city/id
   */
  async function viewOnmap() {
    navigate(`/city/${bikeInfo.city_id}`);
  }

  /**
   * Stop a bike from running - useful if user is stealing bike
   */
  async function stopBike() {
    const stopBike = await TripService.stopCurrentTrip(bikeInfo.id)
    console.log(stopBike)
  }

  /**
   * Update a bike state
   * State is passed to children
   */
  async function updateBikeState(bikeData) {
    setBikeInfo(bikeData);
  }

  if (loading) return <p>loading data..</p>;
  return (
    <div className="cardWrapper">
      <div className="card">
        <h2>Information</h2>
        <DynamicTable data={bikeInfo} vertical={true} />
        <button onClick={viewOnmap}>Visa på karta</button>
        {/* {Boolean(bikeInfo.occupied) ? (
          <MdElectricScooter size={50} color="red"></MdElectricScooter>
        ) : (
          <MdElectricScooter size={50} color="red"></MdElectricScooter>
        )} */}
        <button className={bikeInfo.occupied ? BikeStyle["show"] : BikeStyle["hidden"]}onClick={stopBike}>
          <BsFillSignStopFill size={35} color="red" title="Stop bike from getting stolen!"/>
          Stoppa cykel
        </button>
      </div>
      <div className="card">
        <BikeParking bikeData={bikeInfo} updateState={updateBikeState} />
        <BikeCharging bikeData={bikeInfo} updateState={updateBikeState} />
      </div>
    </div>
  );
}
