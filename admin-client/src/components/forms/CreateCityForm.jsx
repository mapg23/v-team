/**
 * Create new city component
 */
export default function ({action}) {
  /**
   * Handle submit by calling provided method
   */
  function handleAction(e) {
    e.target.valu
    action();
  }
  return (
    <form className={style.form} onSubmit={(e) => {handleAction}}>
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
  );
}
