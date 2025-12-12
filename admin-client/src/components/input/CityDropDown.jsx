
import { useEffect, useState } from "react";
import CityService from "services/cities";
import { useNavigate } from "react-router-dom";

/**
 * Component that renders a dropdown based on data
 * when selection changes, redirects to city/:id
 */
export default function CityDropDown() {
  const [loading, setLoading] = useState(true);

  const [cityNames, setCityNames] = useState([]);

  const [allCities, setAllCities] = useState([]);

  const navigate = useNavigate();

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
   * Redirect to city/:id
   */
  async function handleSelect(value) {
    const city = allCities.find((city) => city.name === value);
    console.log(`city/${city.id}`);
    navigate(`/city/${city.id}`);
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
