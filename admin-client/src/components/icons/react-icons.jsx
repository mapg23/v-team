import { useMemo } from "react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaChargingStation, FaParking } from "react-icons/fa";
import { MdElectricScooter } from "react-icons/md";
import styles from "./iconStyles.module.css";
import { CgProfile } from "react-icons/cg";

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
      html: renderToStaticMarkup(<FaChargingStation size={24} />),
      className: styles["charging-station"],
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    });
  }, []);
}

/**
 * Custom bike icon
 * @returns {hook}
 */
function useBikeIcon() {
  return useMemo(() => {
    const createIcon = (className) =>
      L.divIcon({
        html: renderToStaticMarkup(<MdElectricScooter size={24} />),
        className,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

    return {
      used: createIcon(`${styles["bike-used"]}`),
      free: createIcon(`${styles["bike-free"]}`),
    };
  }, []);
}

/**
 * User profile
 * Not rendered in leaflet
 */
const CgProfileIcon = (() => {
  return <CgProfile size={24}></CgProfile>;
})

// ----------
// EXPORTS
// ----------
export { CgProfileIcon };
export { useParkingIcon };
export { useChargingIcon };
export { useBikeIcon };
