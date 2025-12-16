/* global L */
import { useEffect, useRef } from "react";
import styles from "./Map-component.module.css";
import bikeIconUrl from "../../assets/bike.png";
import { FaChargingStation } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon, DivIcon } from "leaflet";

export default function MapComponent({
  coords,
  bikes,
  parkingZones,
  chargingZones,
}) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  /**
   * Renders the map if new city coordinates
   */
  useEffect(() => {
    if (!coords.latitude || !coords.longitude) {
      console.log("missing coordinates for map");
      return;
    }

    // Om kartan redan finns → flytta den istället för att initiera ny
    if (mapRef.current) {
      mapRef.current.setView(
        [Number(coords.latitude), Number(coords.longitude)],
        13
      );
      return;
    }

    // Annars skapa ny karta
    const map = L.map("map").setView(
      [Number(coords.latitude), Number(coords.longitude)],
      13
    );

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;
  }, [coords]);

  /**
   * Rerender markers on new bike events
   */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Ta bort gamla markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Lägg till nya markers
    bikes.forEach((bike) => {
      const bikeClass =
        bike.occupied === 10 ? styles["bike-free"] : styles["bike-used"];
      const icon = L.icon({
        iconUrl: bikeIconUrl,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, 0],
        className: `${bikeClass}`,
      });

      // Markers must be in Latitude, Longitude - else wont show!!
      const marker = L.marker([bike.cords.y, bike.cords.x], { icon })
        .bindPopup(
          `
          <table>
          <tr>
            <th>ID:</th>
            <td><a href="/bikes/${bike.id}">${bike.id}</td>
          </tr>
          <tr>
            <th>Status:</th>
            <td>${bike.status}</td>
          </tr>
          <tr>
            <th>Cords:</th>
            <td>${bike.cords.x} ${bike.cords.y}</td>
          </tr>
          <tr>
            <th>Occupied:</th>
            <td>${bike.occupied}</td>
          </tr>
          <tr>
            <th>City_Id:</th>
            <td>${bike.city_id}</td>
          </tr>
          <tr>
            <th>Speed:</th>
            <td>${bike.speed}</td>
          </tr>
          </table>
          `
        )
        .openPopup()
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [bikes]);

  /**
   * Render parkingZones
   */
  // useEffect(() => {
  //   const map = mapRef.current;
  //   if (!map) return;

  //   // Ta bort gamla markers
  //   // markersRef.current.forEach((marker) => marker.remove());
  //   // markersRef.current = [];

  //   // Lägg till nya markers
  //   bikes.forEach((bike) => {
  //     const bikeClass =
  //       bike.occupied === 10 ? styles["bike-free"] : styles["bike-used"];
  //     const icon = L.icon({
  //       iconUrl: bikeIconUrl,
  //       iconSize: [24, 24],
  //       iconAnchor: [12, 12],
  //       popupAnchor: [0, 0],
  //       className: `${bikeClass}`,
  //     });

  //     // Markers must be in Latitude, Longitude - else wont show!!
  //     const marker = L.marker([bike.cords.y, bike.cords.x], { icon })
  //       .bindPopup(
  //         `
  //         parking
  //         `
  //       )
  //       .openPopup()
  //       .addTo(map);
  //     // markersRef.current.push(marker);
  //   });
  // }, [parkingZones]);

  /**
   * Render charginZones
   */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const chargingStationIcon = renderToStaticMarkup(<FaChargingStation />);

    const customIcon = divIcon({
      html: chargingStationIcon,
      className: styles["charging-station"],
    });

    // Lägg till nya markers
    chargingZones.forEach((zone) => {
      // Markers must be in Latitude, Longitude - else wont show!!
      L.marker([zone.latitude, zone.longitude], {
        icon: customIcon,
      })
        .bindPopup(
          `
          <table>
          <tr>
            <th>Station id:</th>
            <td><a href="/station:${zone.id}">${zone.id}</td>
          </tr>
          <tr>
            <th>City id:</th>
            <td>${zone.city_id}</td>
          </tr>
          <tr>
            <th>Name:</th>
            <td>${zone.name}</td>
          </tr>
          <tr>
            <th>Latitude:</th>
            <td>${zone.latitude}</td>
          </tr>
          <tr>
            <th>Longitude:</th>
            <td>${zone.longitude}</td>
          </tr>
          <tr>
            <th>Capacity:</th>
            <td>${zone.capacity}</td>
          </tr>
          </table>
          `
        )
        .openPopup()
        .addTo(map);
    });
  }, [parkingZones]);

  return <div id="map" className={styles.map}></div>;
}
