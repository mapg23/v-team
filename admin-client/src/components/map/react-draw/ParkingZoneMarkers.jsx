import { Rectangle, Popup } from "react-leaflet";

/**
 * This component is rendering parkingZones
 */
export default function ParkingZoneMarkers({ zones }) {
  if (!zones) return <p>No parking zones</p>;

  return (
    <>
      {zones.map((zone) => (
        <Rectangle key={zone.id}
          bounds={[
            [zone.min_lat, zone.min_long], // south-west
            [zone.max_lat, zone.max_long], // north-east
          ]}
        >
          <Popup>
            {zone.id}
          </Popup>
        </Rectangle>
      ))}
    </>
  );
}
