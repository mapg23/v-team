import { useEffect, useState } from "react";
import CostForm from "../../components/forms/CostForm";
import styles from "../../components/forms/Form.module.css";
import cityService from "../../services/cities";
cityService;
import CityDropDown from "../../components/input/CityDropDown";

export default function CostView() {
//   const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageStyle, setMessageStyle] = useState("");
  const [cityId, setCityId] = useState(0);
  const [priceDetails, setPriceDetails] = useState(null);

  /**
   * Price depends on current city
   * Therefor fetche current price details when cityId changes
   */
  useEffect(() => {
    async function fetchCityData() {
      if (cityId) {
        // reset to force rerender on form
        setPriceDetails(null);
        setMessage(null);
        const priceData = await cityService.getPriceDetailsByCityId(cityId);
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

    if (!costResult.ok) {
        setMessage("Price could not be updated");
        setMessageStyle("errorDiv");
    }
     setMessage("Price updated successfully!");
     setMessageStyle("successDiv");
  }

  return (
    <>
      <div className="wrapper">
        <div className="card">
          <h1>Kostnader</h1>
          <p>I följande vy kan du hantera kostnader för att hyra en cykel.</p>
          <p>Priserna varierar beroende på vilken stad cykeln är registrerad i.</p>
          <p>Välj därför en stad i dropdown-listan och hantera sedan kostnaderna.</p>
        </div>
        <div className="card">
          <h2>Välj en stad för att hantera kostnader</h2>
          <CityDropDown action={updateCityId} />
          <div className="container">
            <div className="card-one">
              <div className={message ? styles[messageStyle] : ""}>
                <p>{message}</p>
              </div>
              {priceDetails ? (
                <>
                  <h2>Kostnader för uthyrning</h2>
                  <CostForm
                    onFormSubmit={updateCost}
                    priceDetails={priceDetails}
                  />
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
