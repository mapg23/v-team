import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { BikeIcon } from "../../icons/react-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * This component is responsible for rendering bike markers
 */
export default function BikeMarkers({ bikes }) {
  const navigate = useNavigate();
  const bikeIcons = BikeIcon();
  const map = useMap();
  

  useEffect(() => {
    // console.log(mapBounds.contains([bikes[0].cords.y, bikes[0].cords.x]))
    console.log(bikes)
  },[bikes])

  /**
   * Redirect to bike/:id
   * @param {number} id
   */
  function redirectToBike(id) {
    if (id) navigate(`/bikes/${id}`);
  }

  /**
   * Return a bikeIcon based on the status of the bike
   * @param {Object} bike 
   * @returns Icon
   */
  function getBikeIcon(bike) {
    if (bike.current_zone_type === "charging") {
      return bikeIcons.repair;
    }
    return bike.occupied ? bikeIcons.used : bikeIcons.free;
  }

  const [bounds, setBounds] = useState(map.getBounds());

  /**
   * Update mapBounds when zooming
   * 
   * useful for only rendering bikes inside bounds
   */
  useMapEvents({
    moveend: () => {
      setBounds(map.getBounds());
    },
    zoomend: () => {
      setBounds(map.getBounds());
    },
  });

  return (
    <>
      {bikes.filter((bike) => bounds.contains([bike.cords.y, bike.cords.x])).
      map((bike) => ( 
        <Marker
          key={bike.id}
          position={[bike.cords.y, bike.cords.x]}
          // icon={bike.occupied ? bikeIcons.used : bikeIcons.free}
          icon={getBikeIcon(bike)}
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
