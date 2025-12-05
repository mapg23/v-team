
/**
 * DropDrown UI component
 * @param {{function, cityData}} setMap, cityData function to call when a value is updated 
 * @returns 
 */
export default function DropDown({ setMap, cityOptions }) {
  // Eventlistener
  // Update the map coordinates based on selection
  function handleChange(e) {
    setMap(e.target.value);
  }

  return (
    <select onChange={handleChange}>
      <option key="choose">Välj en stad</option>
      {cityOptions.map((city) => (
        <option key={city}>{city}</option>
      ))}
    </select>
  );
}
