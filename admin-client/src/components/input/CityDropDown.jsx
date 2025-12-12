import { useEffect, useState } from "react";
import CityService from "services/cities";

/**
 * Component that renders a dropdown based on data
 * when selection changes, calls action method
 */
export default function CityDropDown({action}) {
  const [loading, setLoading] = useState(true);

  const [cityNames, setCityNames] = useState([]);

  const [allCities, setAllCities] = useState([]);

  /**
   * Set cityNames
   */
  useEffect(() => {
    async function fetchData() {
      const cities = await CityService.getAllCities();
      setAllCities(cities);
      setCityNames(cities.map((city) => city.name));
      setLoading(false);
    }
    fetchData()
    
  }, []);

  /**
   * Calls provided action with cityId
   */
  async function handleSelect(value) {
    const city = allCities.find((city) => city.name === value);
    // calls parent method
    action(city.id)
  }

  if (loading) return <p>laddar..</p>;

  return (
    <>
      <select
        onChange={(e) => {
          handleSelect(e.target.value);
        }}
      >
        <option key="choose">Välj en stad</option>
        {cityNames.map((city) => {
          return <option key={city}>{city}</option>;
        })}
      </select>
    </>
  );
}
