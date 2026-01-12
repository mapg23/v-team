import { Marker, Popup } from "react-leaflet";
import { ChargingIcon } from "../../icons/react-icons";
/**
 * This component is rendering chargingZones
 */
export default function ChargingZoneMarkers({ zones }) {
  if (!zones) return <p>No charging zones</p>;
  const chargingIcon = ChargingIcon();
  return (
    <>
      {zones.map((zone) => (
        <Marker
          key={zone.id}
          icon={chargingIcon}
          position={[zone.latitude, zone.longitude]}
        >
          <Popup>
            <table>
              <tbody>
                <tr key={zone.id}>
                  <th>Stations Id:</th>
                  <td>{zone.id}</td>
                </tr>
                <tr key="cityid">
                  <th>Stads id:</th>
                  <td>{zone.city_id}</td>
                </tr>
                <tr key="station">
                  <th>Stations namn:</th>
                  <td>{zone.name}</td>
                </tr>
                <tr key="lat">
                  <th>Latitude:</th>
                  <td>{zone.latitude}</td>
                </tr>
                <tr key="long">
                  <th>Longitude</th>
                  <td>{zone.longitude}</td>
                </tr>
                <tr key="bikes">
                  <th>Cyklar i zon</th>
                  <td>{zone.bikes}</td>
                </tr>
                <tr key="cap">
                  <th>Kapacitet</th>
                  <td>{zone.capacity}</td>
                </tr>
              </tbody>
            </table>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
