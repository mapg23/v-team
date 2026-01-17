import { useEffect, useState } from "react";
import BikeService from "../../services/bikes";
import { useNavigate } from "react-router";
import CityDropDown from "../../components/input/CityDropDown";
import BikesTable from "../../components/table/BikesTable";
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
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState("error");
  // Pagination
  const [page, setPage] = useState(1);
  const [max, setMax] = useState(false);
  // Filter
  const [filterIsActive, setFilterIsActive] = useState(false);
  const [cityId, setCityId] = useState(null);

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
  async function getData() {
    const bikes = await BikeService.getAllBikes({ page });
    console.log(bikes);
    if (bikes.bikes) {
      setBikes(bikes.bikes);
    }
    if (bikes.bikes.length > 0) {
      setMax(false);
    } else {
      setMax(true);
    }
  }

  /**
   * Get data by city
   */
  async function getDataByCity(cityId) {
    const result = await cityService.getAllBikesInCity({ cityId, page });
    const cityObject = await cityService.getCityDetailsById(cityId);
    if (result.bikes && result.bikes.length > 0) {
      setBikes(result.bikes);
      setMax(false);
    } else {
      setBikes(result.bikes);
      setMax(true);
    }
    setResult(`Filter by: ${cityObject.name}`);
  }

  /**
   * Activate filter settings
   * Always restart on page 1
   */
  async function setFilter(cityId) {
    setFilterIsActive(true);
    setCityId(cityId);
    setPage(1);
    getDataByCity(cityId);
  }

  /**
   * Get data on mount based on current Filter status
   */
  useEffect(() => {
    async function fetchData() {
      await callMethodByFilterStatus();
      setLoading(false);
    }
    fetchData();
  }, [page]);


  /**
   * Call by filter
   */
  async function callMethodByFilterStatus() {
    if (filterIsActive) {
      await getDataByCity(cityId);
    } else {
      await getData();
    }
  }
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
      await callMethodByFilterStatus();
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
    if (response.id) {
      setResult("Successfully created a new bike!");
      setResultType("success");
      await callMethodByFilterStatus();
      return;
    }
    setResult(response.error);
    setResultType("error");
    return;
  }

  /**
   * Reset filter
   */
  async function clearFilter() {
    setPage(1);
    setFilterIsActive(false);
    setResult(`Filter cleared`);
    await getData();
  }

  /**
   * Increment page by 1 if max is false
   */
  function increasePage() {
    setResult("");
    if (!max) {
      setPage((page) => page + 1);
    }
  }

  /**
   * Reduce current page by 1
   * Only reduce if page is > 1
   */
  function reducePage() {
    setResult("");
    if (page === 1) return;
    setPage((page) => page - 1);
  }

  if (loading) return <p>loading..</p>;

  return (
    <>
      <div className="wrapper">
        <div className="card">
          <h1>Elsparkcyklar</h1>
          <p>I följande vy kan du hantera elscyklar.</p>
          <p>Du kan skapa och ta bort cyklar, samt filtrera cyklar per stad.</p>
          <p>
            Vill du visa cykeln på en karta trycker du på cykelns{" "}
            <strong>ID</strong>
          </p>
        </div>

        <div className="cardWrapper">
          {/* {CREATE BIKES} */}
          <div className="card">
            <h2>Chose a city and create a new bike</h2>
            <CreateBikeForm action={createNewBike}></CreateBikeForm>
          </div>

          {/* {FILTER BIKES BY CITY} */}
          <div className="card">
            <h2>Filter by city</h2>
            <CityDropDown action={setFilter} />
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
          <p>Current page {page}</p>
          <button onClick={reducePage}>
            Prev page: {page !== 1 ? page - 1 : page}
          </button>
          <button onClick={increasePage}>Next page: {page + 1}</button>
          <BikesTable data={bikes} action={deleteBike} inspect={inspectBike} />
        </div>
      </div>
    </>
  );
}
