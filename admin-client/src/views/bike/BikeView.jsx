import { useEffect, useState } from "react";
import BikeService from "../../services/bikes";
import { useNavigate } from "react-router";
import CityDropDown from "../../components/input/CityDropDown";
import TableWithActions from "../../components/table/TableWithActions";
import style from "../../components/forms/Form.module.css";
import CreateBikeForm from "../../components/forms/CreateBikeForm";
import cityService from "../../services/cities";

/**
 * Bike view
 */
export default function BikeView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [bikes, setBikes] = useState([]);
  const [bikeFilter, setBikeFilter] = useState([]);

  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState("error");

  const resultClassMap = {
    success: style.success,
    error: style.error,
    warning: style.warning,
    info: style.info,
  };

  const resultClass = resultClassMap[resultType] || "";

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Fetch all data
   */
  async function fetchData() {
    setBikes(await BikeService.getAllBikes());
    setBikeFilter(await BikeService.getAllBikes());
    setLoading(false);
  }

  /**
   * Delete bike with id
   *
   * @param {int} bikeId
   */
  async function deleteBike(bikeId) {
    const response = await BikeService.deleteBike(bikeId);
    if (response.message) {
      setResult(response.message);
      setResultType("success");

      // update bikes
      fetchData();
      return;
    }
    setResult(response.error);
    setResultType("error");
    return;
  }

  /**
   * Inspect bike with id
   *
   * @param {int} bikeId
   */
  function inspectBike(bikeId) {
    navigate(`/bikes/${bikeId}`);
  }

  /**
   * Create a new bike
   * @param {Object} bikeId {cityId, [Long, lat]}
   */
  async function createNewBike(bikeObj) {
    // Bike requiers battery, occupied, status
    bikeObj.battery = 100;
    bikeObj.occupied = 0;
    bikeObj.status = 10;
    const response = await BikeService.createNewBike(bikeObj);
    if (response.message) {
      setResult(response.message);
      setResultType("success");
      // update bikes
      fetchData();
      return;
    }
    setResult(response.error);
    setResultType("error");
    return;
  }

  /**
   * Filter bikes in table based on chosen City
   */
  async function filterBikes(value) {
    console.log("filtered bikes", value);
    const previousFilter = bikeFilter;
    const filteredBikes = bikes.filter((bike) => bike.city_id === value);
    const cityObject = await cityService.getCityDetailsById(value);
    if (filteredBikes.length > 0) {
      setBikeFilter(filteredBikes);
      setResult(`Filter by: ${cityObject.name}`);
      setResultType("success");
    } else {
      setBikeFilter(previousFilter);
      setResult(`No bikes in: ${cityObject.name}`);
      setResultType("error");
    }
  }

  /**
   * Reset filter
   */
  function clearFilter() {
    setBikeFilter(bikes)
    setResult(`Filter cleared`);
    setResultType("info");
  }

  if (loading) return <p>loading..</p>;

  return (
    <>
      <h1>BikeView</h1>
      <h2>Chose a city and create a new bike</h2>
      <CreateBikeForm action={createNewBike}></CreateBikeForm>
      {/* {Filter by city} */}
      <h2>Filter by city</h2>
      <CityDropDown action={filterBikes} />
      <button type="button" onClick={clearFilter}>
        Clear filter
      </button>
      {/* </div> */}
      {/* <p className={resultType === "error" ? style.error : style.success}> */}
      <p className={resultClass}>
        {result}
      </p>
      {/* Display bikes based on filter */}
      <div className="hideOverFlow">
        <p>Total bikes: {bikes.length}</p>
        <TableWithActions
          data={bikeFilter}
          action={deleteBike}
          inspect={inspectBike}
        />
      </div>
    </>
  );
}
