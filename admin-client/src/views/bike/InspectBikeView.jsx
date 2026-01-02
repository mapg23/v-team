import { useEffect, useState } from "react";
import { useParams } from "react-router";
import BikeInfo from "../../components/bike/BikeInfo";

/**
 * View a specific bike
 */
export default function InspectBikeView() {
  const [loading, setLoading] = useState(true);
  const param = useParams();
  const bikeId = param.id;

  useEffect(() => {
    async function getData() {
      setLoading(false);
    }
    getData();
  }, [bikeId]);

  if (loading) return <p>Hämtar cykeldata..</p>;

  return (
    <div className="wrapper">
      <h1>Bike #{bikeId}</h1>
      <BikeInfo bikeId={bikeId}></BikeInfo>
    </div>
  );
}
