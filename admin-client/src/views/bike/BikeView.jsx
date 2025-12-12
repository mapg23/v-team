import Map from "@/components/map/Map-component";
import { useEffect, useState } from "react";
import CityService from "services/cities";
import PieChart from "components/chart/PieChart";
import BikeSocket from "components/socket/BikeSocket";
import BikeService from "../../services/bikes";
import { useNavigate, useParams } from "react-router";
import CityDropDown from "../../components/input/CityDropDown";
import TableWithActions from "../../components/table/TableWithActions";
import style from "../../components/forms/Form.module.css";

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
  }, [bikes]);

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
    console.log(bikeId)
    navigate(`/bikes/${bikeId}`);
  }

  if (loading) return <p>loading..</p>;

  return (
    <>
      <h1>BikeView</h1>
      {/* {create a new bike} */}
      <p className={resultType === "error" ? style.error : style.success}>
        {result}
      </p>
      {/* {add new bike form} */}
      <div className="hideOverFlow">
        <TableWithActions data={bikes} action={deleteBike} inspect={inspectBike} />
      </div>
    </>
  );
}
