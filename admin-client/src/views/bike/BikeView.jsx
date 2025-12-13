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

  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState("error");

  useEffect(() => {
    async function fetchData() {
      setBikes(await BikeService.getAllBikes());
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
    if (response.message) {
      setResult(response.message);
      setResultType("success");
      return;
    }
    setResult(response.error);
    setResultType("error");
  }

  /**
   * Delete bike with id
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
      return;
    }
    setResult(response.error);
    setResultType("error");
  }

  if (loading) return <p>loading..</p>;

  return (
    <>
      <h1>BikeView</h1>
      <h2>Chose a city and create a new bike</h2>
      <CreateBikeForm action={createNewBike}></CreateBikeForm>
      {/* </div> */}
      <p className={resultType === "error" ? style.error : style.success}>
        {result}
      </p>
      <>
      {/* {filter bikes on city} */}

      </>
      {/* Display all bikes */}
      <div className="hideOverFlow">
        <TableWithActions
          data={bikes}
          action={deleteBike}
          inspect={inspectBike}
        />
      </div>
    </>
  );
}
