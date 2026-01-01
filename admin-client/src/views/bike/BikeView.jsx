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

  /**
   * Styles for response
   */
  const resultClassMap = {
    success: style.success,
    error: style.error,
    warning: style.warning,
    info: style.info,
  };

  // Get current response
  const resultClass = resultClassMap[resultType] || "";

  /**
   * Update all data
   */
  async function updateData() {
    setBikes(await BikeService.getAllBikes());
    setBikeFilter(await BikeService.getAllBikes());
  }

  /**
   * Run on mount
   */
  useEffect(() => {
    async function fetchData() {
      setBikes(await BikeService.getAllBikes());
      setBikeFilter(await BikeService.getAllBikes());
      setLoading(false);
    }
    fetchData();
  }, []);

  /**
   * Delete bike with id
   *
   * @param {int} bikeId
   */
  async function deleteBike(bikeId) {
    const response = await BikeService.deleteBike(bikeId);
    if (response.ok) {
      setResult(`Deleted bike with id: ${bikeId}`);
      setResultType("success");

      // update bikes
      await updateData();
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
    // status, battery, latitude, longitude, occupied, cityId;
    bikeObj.battery = 100;
    bikeObj.occupied = 0;
    bikeObj.status = 10;
    const response = await BikeService.createNewBike(bikeObj);
    console.log(response);
    if (response.id) {
      setResult("Successfully created a new bike!");
      setResultType("success");
      // update bikes
      await updateData();
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
    setBikeFilter(bikes);
    setResult(`Filter cleared`);
    setResultType("info");
  }

  if (loading) return <p>loading..</p>;

  return (
    <>
      <div className="wrapper">
        <h1>BikeView</h1>
        <div className="cardWrapper">
          {/* {CREATE BIKES} */}
          <div className="card">
            <h2>Chose a city and create a new bike</h2>
            <CreateBikeForm action={createNewBike}></CreateBikeForm>
          </div>

          {/* {FILTER BIKES BY CITY} */}
          <div className="card">
            <h2>Filter by city</h2>
            <CityDropDown action={filterBikes} />
            <button type="button" onClick={clearFilter}>
              Clear filter
            </button>
          </div>
        </div>

        {/* </div> */}
        {/* <p className={resultType === "error" ? style.error : style.success}> */}
        <div className="card">
          <p className={resultClass}>{result}</p>
          {/* Display bikes based on filter */}
          <div className="hideOverFlow">
            <p>Total bikes: {bikes.length}</p>
            <TableWithActions
              data={bikeFilter}
              action={deleteBike}
              inspect={inspectBike}
            />
          </div>
        </div>
      </div>
    </>
  );
}
