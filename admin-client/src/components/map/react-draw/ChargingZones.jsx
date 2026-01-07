import { useEffect } from "react";
import { Marker, useMap, Popup, Rectangle } from "react-leaflet";
import { MdElectricScooter } from "react-icons/md";
import { divIcon } from "leaflet";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import styling from "./Map-component.module.css";

/**
 * This component is rendering parkingZones
 */
export default function ChargingZones({ zones }) {
  const iconMarkup = renderToStaticMarkup(<MdElectricScooter />);

  if (!zones) return <p>No charging zones</p>;
  return (
    <>
      {zones.map((zone) => (
        <Marker
          key={zone.id}
          position={[zone.latitude, zone.longitude]}
        ></Marker>
      ))}
    </>
  );
}
