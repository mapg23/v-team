import { Rectangle, Popup, Marker } from "react-leaflet";
import { useParkingIcon } from "../../icons/react-icons";

/**
 * This component is rendering parkingZones
 */
export default function ParkingZoneMarkers({ zones }) {
  if (!zones) return <p>No parking zones</p>;

  // PARKING ICON
  const icon = useParkingIcon();

  return (
    <>
      {zones.map((zone) => (
        <Rectangle
          key={zone.id}
          bounds={[
            [zone.min_lat, zone.min_long], // south-west
            [zone.max_lat, zone.max_long], // north-east
          ]}
        >
          <Marker icon={icon} position={[zone.max_lat, zone.min_long]}>
            <Popup>
              <table>
                <tbody>
                  <tr key={zone.id}>
                    <th>Parkerings Id:</th>
                    <td>{zone.id}</td>
                  </tr>
                  <tr key="cityid">
                    <th>Stads id:</th>
                    <td>{zone.city_id}</td>
                  </tr>
                </tbody>
              </table>
            </Popup>
          </Marker>
        </Rectangle>
      ))}
    </>
  );
}
