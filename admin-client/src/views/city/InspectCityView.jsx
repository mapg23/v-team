import Map from "@/components/map/Map-component";
import { useEffect, useState } from "react";
import CityService from "services/cities";
import parkingService from "../../services/parkings";
import stationService from "../../services/stations";
import CityTable from "components/table/CityTable";
import PieChart from "components/chart/PieChart";
import { useParams } from "react-router";
import CityDropDown from "../../components/input/CityDropDown";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";

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

  // Sync parkings from database
  const [parkingZones, setParkingZones] = useState([]);

  // Sync charging zones from database
  const [chargingZones, setChargingZones] = useState([]);

  // Get bikes in all parking zones
  const [parkingZonesWithBikes, setParkingZonesWithBikes] = useState([])
  
  // Get bikes in all charging zones
  const [chargingZonesWithBikes, setChargingZonesWithBikes] = useState([])

  // Map different bike status
  const [bikeStatusMap, setBikeStatusMap] = useState({
    available: null,
    used: null,
  });

  // -----------------------------
  // Update bikes from socket
  // -----------------------------
  useEffect(() => {
    function bikeEvent(bikeData) {
      setBikes(bikeData);
    }

    socket.on("bikes", bikeEvent);

    return () => {
      socket.off("bikes", bikeEvent);
    };
  }, [cityId]);

  // -----------------------------
  // Update Chart with bike status in City
  // -----------------------------
  useEffect(() => {
    const bikeObjectsInCity = bikes.filter(
      (bike) => bike.city_id === Number(cityId)
    );
    const bikesAvailableCount = bikeObjectsInCity.filter(
      (bike) => bike.status === 10
    ).length;
    const bikesUsedCount = bikeObjectsInCity.length - bikesAvailableCount;

    // Prev är befintliga värdet, om inget ändras, returna samma
    setBikeStatusMap((prev) => {
      if (
        prev.available === bikesAvailableCount &&
        prev.used === bikesUsedCount
      ) {
        return prev;
      }

      // Annars ersätt
      return {
        available: bikesAvailableCount,
        used: bikesUsedCount,
      };
    });
  }, [bikes, cityId]);

  // -----------------------------
  // Fetch initial data
  // -----------------------------
  useEffect(() => {
    async function fetchData() {
      // get city details based on params
      setcityDetails(await CityService.getCityDetailsById(cityId));

      // Get parking zones
      setParkingZones(await CityService.getParkingZonesInCity(cityId));

      // Get charging zones
      setChargingZones(await CityService.getChargingStationsInCity(cityId));

      // Loading is done when all data is fetched
      setLoading(false);
    }
    fetchData();
  }, [cityId]);

  // -----------------------------
  // Get number of bikes in parking zone
  // -----------------------------
  useEffect(() => {
    async function getBikesInParkingZone() {
      const parkingZonesWithBikes = parkingZones.map(
        async (parkingZone) => {
          const bikesInZone = await parkingService.getAllBikesInParkingZone(
            parkingZone.id
          );
          const newZone = {...parkingZone, bikes: bikesInZone.bikeCount}
          return newZone
        }
      );
      const updatedZones = await Promise.all(parkingZonesWithBikes);
      setParkingZonesWithBikes(updatedZones);
    }
    getBikesInParkingZone();
  }, [parkingZones]);

  // -----------------------------
  // Get number of bikes in charging zone
  // -----------------------------
  useEffect(() => {
    async function getBikesInChargingZone() {
      const chargingZonesWithBikes = chargingZones.map(
        async (chargingZone) => {
          const bikesInZone = await stationService.getBikesInChargingStation(
            chargingZone.id
          );
          const newZone = { ...chargingZone, bikes: bikesInZone.bikeCount };
          return newZone
        }
      );
      const updatedZones = await Promise.all(chargingZonesWithBikes);
      setChargingZonesWithBikes(updatedZones);
    }
    getBikesInChargingZone();
  }, [chargingZones]);

  /**
   * Method for handling the selectionChange
   * @param {id} cityId redirect to city/:id
   */
  function redirectToCity(cityId) {
    navigate(`/city/${cityId}`);
  }

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <CityDropDown action={redirectToCity} />
      <h1>{cityDetails.name}</h1>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <CityTable data={cityDetails} vertical={true} />
        <PieChart bikeStatusMap={bikeStatusMap} />
      </div>
      <Map
        coords={cityDetails}
        bikes={bikes}
        parkingZones={parkingZonesWithBikes}
        chargingZones={chargingZonesWithBikes}
      />
    </>
  );
}
