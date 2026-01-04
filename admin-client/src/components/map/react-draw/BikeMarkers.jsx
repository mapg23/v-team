import { useEffect } from "react";
import { Marker, useMap, Popup } from "react-leaflet";
import { MdElectricScooter } from "react-icons/md";
import { divIcon } from "leaflet";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import styling from "./Map-component.module.css";

/**
 * This component is responsible for rendering Markers
 */
export default function BikeMarkers({ bikes }) {
  const iconMarkup = renderToStaticMarkup(
    <MdElectricScooter />
  );
  const scooterIcon = divIcon({
    html: iconMarkup,
    className: styling["bike-used"],
    iconSize: 25
  });

  return (
    <>
      {bikes.map((bike) => (
        <Marker
          key={bike.id}
          position={[bike.cords.y, bike.cords.x]}
          icon={scooterIcon}
        >
          <Popup>Bike #{bike.id}</Popup>
        </Marker>
      ))}
    </>
  );
}
