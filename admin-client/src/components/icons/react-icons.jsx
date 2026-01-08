import { useMemo } from "react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaParking } from "react-icons/fa";
import styles from "./iconStyles.module.css";

/**
 * Module containing icons as React Hooks
 * A Hook is a function which start with "use"
 */

/**
 * Custom parking zone icon
 * @returns {hook}
 */
function useParkingIcon() {
  return useMemo(() => {
    return L.divIcon({
      html: renderToStaticMarkup(<FaParking size={24} />),
      className: styles["parking-station"],
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    });
  }, []);
}

/**
 * Custom charging zone icon
 * @returns {hook}
 */
function useChargingIcon() {
  return useMemo(() => {
    return L.divIcon({
      html: renderToStaticMarkup(<FaParking size={24} />),
      className: styles["charging-station"],
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    });
  }, []);
}

export {useParkingIcon};
export {useChargingIcon};