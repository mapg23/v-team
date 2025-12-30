import { useEffect, useState } from "react";
import CostForm from "../../components/forms/CostForm";
import cityService from "../../services/cities";
cityService;
import CityDropDown from "../../components/input/CityDropDown";

export default function CostView() {
  const [initialCost, setInitialCost] = useState(0);
  const [variableCost, setVariableCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState("");
  const [cityId, setCityId] = useState(0);
  const [priceDetails, setPriceDetails] = useState();

  /**
   * Price depends on current city
   * Therefor fetche current price details when cityId changes
   */
  useEffect(() => {
    async function fetchCityData() {
      if (cityId) {
        const priceData = await cityService.getPriceDetailsByCityId(cityId);
        console.log(priceData);
        setPriceDetails(priceData);
      }
    }
    fetchCityData();
  }, [cityId]);

  /**
   * Set current CityId
   */
  async function updateCityId(cityId) {
    setCityId(cityId);
  }

  /**
   * Update cost for renting a bike
   * @param {Object} Object containing initialCost and variableCost
   */
  async function updateCost(newPriceDetails) {
    const costResult = await cityService.updatePriceDetailsInCity(
      cityId,
      newPriceDetails
    );
    console.log(costResult);

    // if (!updateInitialCost && !updateVariableCost) {
    //     setMessage("Cost could not be updated");
    //     setMessageStyle("error");
    // }
    //  setMessage("Cost updated!");
    //  setMessageStyle("sucess");
  }

  if (loading) return <p>laddar..</p>;
  return (
    <>
      <h1>CostView</h1>
      <CityDropDown action={updateCityId} />
      <div className="container">
        <div className="card-one">
          <h3>Kostnad för att hyra en cykel i :</h3>
          <div className={message ? messageStyle : ""}>
            <p>{message}</p>
          </div>
          <p>Startkostnad {initialCost} kr</p>
          <p>Rörlig kostnad {variableCost} kr/minut</p>
          {priceDetails ? <CostForm onFormSubmit={updateCost} priceDetails={priceDetails}></CostForm> : ""}
        </div>
      </div>
    </>
  );
}
