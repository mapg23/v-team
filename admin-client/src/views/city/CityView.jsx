import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CityService from "../../services/cities";
import style from "../../components/forms/Form.module.css";
import TableWithActions from "../../components/table/TableWithActions"

/**
 * CRUD view for City's
 */
export default function CityView() {
  const navigate = useNavigate();
  const [newCity, setNewCity] = useState("");
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState("error");

  const [loading, setLoading] = useState(true);

  const [cities, setCities] = useState([
    {
      id: null,
      name: null,
      latitude: null,
      longitude: null,
    },
  ]);

  /**
   * Delete a city with <id>
   * @param {int} id 
   */
  async function deleteCity(id) {
    const result = await CityService.deleteCity(id)
  }

  /**
   * Delete a city with <id>
   * @param {int} id 
   */
  async function inspectCity(id) {
    
    navigate(`/city/${id}`)
  }

  /**
   * Create a new City
   * 
   * @param {event} event 
   * @returns 
   */
  async function createCity(event) {
    event.preventDefault();
    // Create new city
    const result = await CityService.addNewCity(newCity)
    if (result.error) {
      setResult(result.error)
      setResultType("error")
      return
    }
    setResult(result[0].name + " skapat!")
    setResultType("success")
    setNewCity("");
  }

  /**
   * Get alla cities
   */
  useEffect(() => {
    async function fetchData() {
      const cities = await CityService.getAllCities();
      // console.log(cities)
      setCities(cities);
      setLoading(false);
    }
    fetchData();
  }, [cities]);

  if (loading) return <h1>loading..</h1>;

  return (
    <>
      <h1>CityView</h1>
      <TableWithActions data={cities} action={deleteCity} inspect={inspectCity} />
      <div style={{ margin: "0 auto" }}>
        <h2>Create new city</h2>
        <p className={resultType === "error" ? style.error : style.success }>{result}</p>
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
    </>
  );
}
