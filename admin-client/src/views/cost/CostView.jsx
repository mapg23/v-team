import { useEffect, useState } from "react";
import BikeService from "../../services/bikes";
import CostForm from "../../components/forms/CostForm";

export default function CostView() {
  const [initialCost, setInitialCost] = useState(0);
  const [variableCost, setVariableCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState("");

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
  }, []);


  /**
   * Update cost for renting a bike
   * @param {Object} Object containing initialCost and variableCost 
   */
  async function updateCost({ initialCost, variableCost }) {
    console.log(initialCost, variableCost);
    const updateInitialCost = await BikeService.setInitialCost(initialCost);
    const updateVariableCost = await BikeService.setVariableCost(variableCost);

    if (!updateInitialCost && !updateVariableCost) {
        setMessage("Cost could not be updated");
        setMessageStyle("error");
    }
     setMessage("Cost updated!");
     setMessageStyle("sucess");

  }

  if (loading) return <p>laddar..</p>;
  return (
    <>
      <h1>CostView</h1>
      <div className="container">
        <div className="card-one">
          <h3>Kostnad för att hyra en cykel:</h3>
          <div className={message ? messageStyle : ""}>
            <p>{message}</p>
          </div>
          <p>Startkostnad {initialCost} kr</p>
          <p>Rörlig kostnad {variableCost} kr/minut</p>
          <CostForm onFormSubmit={updateCost}></CostForm>
        </div>
      </div>
    </>
  );
}
