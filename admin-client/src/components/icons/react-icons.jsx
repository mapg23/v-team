import { Component, useMemo } from "react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
// import { FaChargingStation, FaParking } from "react-icons/fa";
// import { MdElectricScooter, MdOutlineLocationCity } from "react-icons/md";
// import { AiOutlineHome } from "react-icons/ai";
// import { HiOutlineCurrencyDollar } from "react-icons/hi2";
// import { CgProfile } from "react-icons/cg";
import styles from "./iconStyles.module.css";

import {
  PiChargingStation,
  PiScooter,
  PiHouse,
  PiCity,
  PiHandCoins,
  PiUserCircle,
  PiLetterCircleP,
  PiArrowCircleRight
} from "react-icons/pi";

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
      html: renderToStaticMarkup(<PiLetterCircleP size={24} />),
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
      html: renderToStaticMarkup(<PiChargingStation size={24} />),
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
        html: renderToStaticMarkup(<PiScooter size={24} />),
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
 * @returns {Component}
 */
export function CgProfileIcon() {
  return <PiUserCircle size={24} />;
}

/**
 * Home icon
 * @returns {Component}
 */
export function HomeIcon() {
  return <PiHouse size={24} />;
}

/**
 * City icon
 * @returns {Component}
 */
export function CityIcon() {
  return <PiCity size={24} />;
}

/**
 * Cost icon
 * @returns {Component}
 */
export function CostIcon() {
  return <PiHandCoins size={24} />;
}

/**
 * Static Charge icon
 * @returns {Component}
 */
export function StaticChargeIcon() {
  return <PiChargingStation size={24} />;
}

/**
 * Static Parking icon
 * @returns {Component}
 */
export function StaticParkIcon() {
  return <PiLetterCircleP size={24} />;
}

/**
 * Static Bike icon
 * @returns {Component}
 */
export function StaticBikeIcon() {
  return <PiScooter size={24} />;
}

/**
 * Go arrow, link circled arrow
 */

export function ArrowIcon({ className }) {
  return <PiArrowCircleRight size={24} className={className} />
}

// /**
//  * Custom parking zone icon
//  * @returns {Component}
//  */
// export function ParkingIcon() {
//   return useMemo(() => {
//     return L.divIcon({
//       html: renderToStaticMarkup(<FaParking size={24} />),
//       className: styles["parking-station"],
//       iconSize: [24, 24],
//       iconAnchor: [12, 24],
//     });
//   }, []);
// }

// /**
//  * Custom charging zone icon
//  * @returns {Component}
//  */
// export function ChargingIcon() {
//   return useMemo(() => {
//     return L.divIcon({
//       html: renderToStaticMarkup(<FaChargingStation size={24} />),
//       className: styles["charging-station"],
//       iconSize: [24, 24],
//       iconAnchor: [12, 24],
//     });
//   }, []);
// }

// /**
//  * Custom bike icon
//  * @returns {Component}
//  */
// export function BikeIcon() {
//   return useMemo(() => {
//     const createIcon = (className) =>
//       L.divIcon({
//         html: renderToStaticMarkup(<MdElectricScooter size={24} />),
//         className,
//         iconSize: [24, 24],
//         iconAnchor: [12, 24],
//       });

//     return {
//       used: createIcon(`${styles["bike-used"]}`),
//       free: createIcon(`${styles["bike-free"]}`),
//     };
//   }, []);
// }

// /**
//  * User profile
//  * * @returns {Component}
//  */
// export function CgProfileIcon() {
//   return <CgProfile size={24}></CgProfile>;
// }

// /**
//  * Home icon
//  * * @returns {Component}
//  */
// export function HomeIcon() {
//   return <AiOutlineHome size={24}></AiOutlineHome>;
// }

// /**
//  * City icon
//  * * @returns {<Component />}
//  */
// export function CityIcon() {
//   return (
//     <MdOutlineLocationCity
//       size={24}
//     ></MdOutlineLocationCity>
//   );
// }

// /**
//  * Cost icon
//  * * @returns {Component}
//  */
// export function CostIcon() {
//   return <HiOutlineCurrencyDollar size={24}></HiOutlineCurrencyDollar>;
// }

// /**
//  * Static Charge icon
//  * * @returns {Component}
//  */
// export function StaticChargeIcon() {
//   return <FaChargingStation size={24}></FaChargingStation>;
// }

// /**
//  * Static Parking icon
//  * * @returns {Component}
//  */
// export function StaticParkIcon() {
//   return <FaParking size={24}></FaParking>;
// }

// /**
//  * Static Bike icon
//  * * @returns {Component}
//  */
// export function StaticBikeIcon() {
//   return <MdElectricScooter size={24}></MdElectricScooter>;
// }