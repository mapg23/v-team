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
  const [bikeFilter, setBikeFilter] = useState([]);
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState("error");
  // Pagination
  const [page, setPage] = useState(1);
  const [max, setMax] = useState(false);

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
    if (bikes.bikes.length > 0) {
      setBikes(bikes.bikes);
      setBikeFilter(bikes.bikes);
      setMax(false)
    } else {
      setMax(true);
    }
  }

  /**
   * Get data whenever pages is updated
   */
  useEffect(() => {
    async function fetchData() {
      await getData();
      setLoading(false);
    }
    fetchData();
  }, [page]);

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
      await getData();
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
      // update bikes
      await getData();
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

  /**
   * Increment page by 1 if max is false
   */
  function increasePage() {
    if (!max) {
      setPage((page) => page + 1);
    }
  }

  /**
   * Reduce current page by 1
   * Only reduce if page is > 1
   */
  function reducePage() {
    if (page === 1) return;
    setPage(page => page -1)
  }

  if (loading) return <p>loading..</p>;

  return (
    <>
      <div className="wrapper">
        <div className="card">
          <h1>BikeView</h1>
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
          <p>Current page {page}</p>
          <button onClick={reducePage}>
            Prev page: {page !== 1 ? page - 1 : page}
          </button>
          <button onClick={increasePage}>Next page: {page + 1}</button>
          <BikesTable
            data={bikeFilter}
            action={deleteBike}
            inspect={inspectBike}
          />
        </div>
      </div>
    </>
  );
}
