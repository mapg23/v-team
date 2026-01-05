import { useEffect } from "react";
import { Marker, useMap, Popup, Rectangle } from "react-leaflet";
import { MdElectricScooter } from "react-icons/md";
import { divIcon } from "leaflet";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import styling from "./Map-component.module.css";

/**
 * This component is rendering parkingZones
 */
export default function ParkingZones({ zones }) {
  const iconMarkup = renderToStaticMarkup(<MdElectricScooter />);
  const scooterIcon = divIcon({
    html: iconMarkup,
    className: styling["bike-used"],
    iconSize: 25,
  });

  if (!zones) return <p>No parking zones</p>;
  return (
    <>
      {zones.map((zone) => (
        <Rectangle key={zone.id}
          bounds={[
            [zone.min_lat, zone.min_long], // south-west
            [zone.max_lat, zone.max_long], // north-east
          ]}
        ></Rectangle>
      ))}
    </>
  );
}
