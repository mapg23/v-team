import { useEffect, useState } from "react";
import CityService from "../../services/cities";
import BikeService from "../../services/bikes";
import { useNavigate } from "react-router";
import DynamicTable from "../../components/table/DynamicTable";
import BikeParking from "./BikeParking";
import BikeCharging from "./BikeCharging";
import { MdElectricScooter } from "react-icons/md";
import { BsFillSignStopFill } from "react-icons/bs";

/**
 * Component for viewing information about a abike
 * and giving the possibility to stop a running bike
 * which is running mayhem.
 */
export default function BikeInfo({ bikeId }) {
  const [loading, setLoading] = useState(true);
  const [bikeInfo, setBikeInfo] = useState(null);
  const navigate = useNavigate();

  /**
   * Get data based on bikeId passed from parent
   */
  useEffect(() => {
    async function getData() {
      if (!bikeId) return;
      const bikeData = await BikeService.getSingleBike(bikeId);
      if (bikeData.id) {
        const bikeInCity = await CityService.getCityDetailsById(bikeId);
        if (bikeInCity.name) {
          bikeData.city_name = bikeInCity.name;
        }
        setBikeInfo(bikeData);
      }
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
    const tripId = "";
    console.log("stopping bike:", bikeId);
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
        <button onClick={viewOnmap}>
          <BsFillSignStopFill size={50} color="red" />
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
