import Map from "@/components/map/Map-component";
import { useEffect, useState } from "react";
import CityService from "services/cities";
import CityTable from "components/table/CityTable";
import PieChart from "components/chart/PieChart";
import BikeSocket from "components/socket/BikeSocket";
import bikeService from "../../services/bikes";
import { useParams } from "react-router";
import CityDropDown from "../../components/input/CityDropDown";
import { useNavigate } from "react-router-dom";

/**
 * View for showing a city based on url
 */
export default function InspectCityView() {
  const navigate = useNavigate();

  // Get params
  const params = useParams();
  const cityId = params.id;

  // Only render elements when loading is false
  const [loading, setLoading] = useState(true);

  // Details for city (params.cityId)
  const [cityDetails, setcityDetails] = useState({
    id: null,
    name: null,
    latitute: null,
    longitude: null,
    bike_count: null,
  });

  // Sync bikes from database
  const [bikes, setBikes] = useState([]);

  // -----------------------------
  // Update bikes from socket
  // -----------------------------
  function updateBikes(bikeData) {
    setBikes(bikeData);
  }

  // -----------------------------
  // Fetch initial data
  // -----------------------------
  useEffect(() => {
    async function fetchData() {
      // get city details based on params
      const cityResponse = await CityService.getCityDetailsById(cityId);
      setcityDetails(cityResponse);

      // Start Bike Sync
      const answer = await bikeService.startBikeSync();
      console.log(answer);

      // Loading is done when all data is fetched
      setLoading(false);
    }
    fetchData();
  }, [cityId]);

  /**
   * Method for handling the selectionChange
   * @param {id} cityId redirect to city/:id
   */
  function redirectToCity(cityId) {
    navigate(`/city/${cityId}`);
  }

  // Visa en översikt endast om användare inte valt stad
  // och data har hämtats
  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <BikeSocket onUpdate={updateBikes} />
      <CityDropDown action={redirectToCity}/>
      <h1>{cityDetails.name}</h1>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <CityTable data={cityDetails} vertical={true} />
        <PieChart total={500} used={100} />
      </div>
      <Map coords={cityDetails} bikes={bikes} />
    </>
  );
}
