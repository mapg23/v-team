import { Marker, Popup } from "react-leaflet";

/**
 * This component is rendering chargingZones
 */
export default function ChargingZoneMarkers({ zones }) {
  if (!zones) return <p>No charging zones</p>;
  return (
    <>
      {zones.map((zone) => (
        <Marker
          key={zone.id}
          position={[zone.latitude, zone.longitude]}
        >
          <Popup>Laddstation: {zone.name}</Popup>
        </Marker>
      ))}
    </>
  );
}
