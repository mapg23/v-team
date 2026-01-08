import { Marker, Popup } from "react-leaflet";
import { useChargingIcon } from "../../icons/react-icons";
/**
 * This component is rendering chargingZones
 */
export default function ChargingZoneMarkers({ zones }) {
  if (!zones) return <p>No charging zones</p>;
  const chargingIcon = useChargingIcon();
  return (
    <>
      {zones.map((zone) => (
        <Marker icon={chargingIcon} position={[zone.latitude, zone.longitude]}>
          <Popup>Laddstation: {zone.name}</Popup>
        </Marker>
      ))}
    </>
  );
}
