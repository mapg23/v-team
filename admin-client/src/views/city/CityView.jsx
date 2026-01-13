import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CityService from "../../services/cities";
import style from "../../components/forms/Form.module.css";
import CitiesTable from "../../components/table/CitiesTable";

/**
 * View for showing all city's and it's details
 * Admin can also add or delete an already existing city
 */
export default function CityView() {
  const navigate = useNavigate();
  const [newCity, setNewCity] = useState("");
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState("error");
  const [loading, setLoading] = useState(true);

  const [allCityDetails, setAllCityDetails] = useState([
    {
      id: null,
      name: null,
      latitude: null,
      longitude: null,
      bike_count: null,
    },
  ]);

  /**
   * Get all city details based from cities
   * @param {Array} arrayOfCities array of city objects
   */
  async function getAllCityDetails(arrayOfCities) {
    const promises = arrayOfCities.map((city) =>
      CityService.getCityDetailsById(city.id)
    );
    // Vänta tills ALLA är klara
    const allCityDetails = await Promise.all(promises);
    setAllCityDetails(allCityDetails);
    setLoading(false);
  }

  /**
   * fetchData
   */
   async function fetchData() {
     const cities = await CityService.getAllCities();
     getAllCityDetails(cities);
   }

  /**
   * Call fetchData
   */
  useEffect(() => {
    // Avoid Eslint complaint
    async function getData() {
      fetchData()
    }
    getData();
  }, []);

  /**
   * Create a new City
   *
   * @param {event} event
   * @returns
   */
  async function createCity(event) {
    event.preventDefault();
    // Create new city
    const result = await CityService.addNewCity(newCity);
    if (result.error) {
      setResult(result.error);
      setResultType("error");
    } else {
      setResult(result[0].name + " skapat!");
      setResultType("success");
      setNewCity("");
    }
    // update data
    await fetchData();
    return;
  }

  /**
   * Delete a city with <id>
   * @param {int} id
   */
  async function deleteCity(id) {
    const result = await CityService.deleteCity(id);
    if (result.error) {
      setResult(result.error);
      setResultType("error");
    }
    // update data
    await fetchData();
    return;
  }

  /**
   * Delete a city with <id>
   * @param {int} id
   */
  async function inspectCity(id) {
    navigate(`/city/${id}`);
  }

  if (loading) return <h1>loading..</h1>;

  return (
    <>
      <div className="wrapper">
        <h1>CityView</h1>
        <div className="card">
          <CitiesTable
            data={allCityDetails}
            action={deleteCity}
            inspect={inspectCity}
          />
        </div>
        <div className="card">
          <h2>Create new city</h2>
          <p className={resultType === "error" ? style.error : style.success}>
            {result}
          </p>
          <form className={style.form} onSubmit={createCity}>
            <label htmlFor="city">CityName</label>
            <input
              style={{ height: "2rem" }}
              placeholder="Enter city name"
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            />
            <button type="submit">Create city</button>
          </form>
        </div>
      </div>
    </>
  );
}
