/* eslint-disable react-hooks/rules-of-hooks */
import { Marker, Popup } from "react-leaflet";
import { useBikeIcon } from "../../icons/react-icons";
import { useNavigate } from "react-router-dom";

/**
 * This component is responsible for rendering bike markers
 */
export default function BikeMarkers({ bikes }) {
  const navigate = useNavigate();
  const bikeIcons = useBikeIcon();

  /**
   * Redirect to bike/:id
   * @param {number} id
   */
  function redirectToBike(id) {
    if (id) navigate(`/bikes/${id}`);
  }

  return (
    <>
      {bikes.map((bike) => (
        <Marker
          key={bike.id}
          position={[bike.cords.y, bike.cords.x]}
          icon={bike.occupied ? bikeIcons.used : bikeIcons.free}
        >
          <Popup>
            <table>
              <tbody>
                <tr>
                  <th>Bike Id:</th>
                  <td>{bike.id}</td>
                </tr>
                <tr>
                  <th>Status:</th>
                  <td>{bike.status}</td>
                </tr>
                <tr>
                  <th>Cords:</th>
                  <td>
                    Lat: {bike.cords.y} Lng: {bike.cords.x}
                  </td>
                </tr>
                <tr>
                  <th>Occupied:</th>
                  <td>{bike.occupied}</td>
                </tr>
                <tr>
                  <th>City_Id:</th>
                  <td>{bike.city_id}</td>
                </tr>
                <tr>
                  <th>Zone id:</th>
                  <td>{bike.current_zone_id}</td>
                </tr>
                <tr>
                  <th>Zone type:</th>
                  <td>{bike.current_zone_type}</td>
                </tr>
                <tr>
                  <th>Speed:</th>
                  <td>{bike.speed}</td>
                </tr>
              </tbody>
            </table>
            <button onClick={() => redirectToBike(bike.id)}>
              Inspect Bike
            </button>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
