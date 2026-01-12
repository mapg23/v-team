import { Component, useMemo } from "react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaChargingStation, FaParking } from "react-icons/fa";
import { MdElectricScooter } from "react-icons/md";
import styles from "./iconStyles.module.css";
import { CgProfile } from "react-icons/cg";

/**
 * Module containing all icons to allow consistent
 * icon updates such as color, size etc
 */

/**
 * Custom parking zone icon
 * @returns {Component}
 */
export function ParkingIcon() {
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
 * @returns {Component}
 */
export function ChargingIcon() {
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
 * @returns {Component}
 */
export function BikeIcon() {
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
 * * @returns {Component}
 */
export function CgProfileIcon() {
  return <CgProfile size={24}></CgProfile>;
}
