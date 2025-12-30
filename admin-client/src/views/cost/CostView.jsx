import { useEffect, useState } from "react";
import BikeService from "../../services/bikes";

export default function CostView() {
  const [initialCost, setInitialCost] = useState(0);
  const [variableCost, setVariableCost] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * Run on mount
   */
  useEffect(() => {
    async function fetchData() {
      const initialCostResponse = await BikeService.getInitialCost();
      setInitialCost(initialCostResponse.initialCost);
      const variableCostResponse = await BikeService.getVariableCost();
      setVariableCost(variableCostResponse.variableCost);
      setLoading(false);
    }
    fetchData();
  }, [initialCost, variableCost]);

  if (loading) return <p>laddar..</p>
  return (
    <>
    <h1>CostView</h1>
      <div className="container">
        <div className="card-one">
          <h3>Kostnad för att hyra en cykel:</h3>
          <p>Startkostnad {initialCost} kr</p>
          <p>Rörlig kostnad {variableCost} kr/minut</p>
        </div>
        <div className="card-two"></div>
      </div>
    </>
  );
}
