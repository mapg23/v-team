/* global L */
import { useEffect, useRef } from "react";
import styles from "./Map-component.module.css";
import bikeIconUrl from "../../assets/bike.png";

export default function MapComponent({ coords, bikes }) {
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
      const bikeClass = bike.occupied === 10 ? styles["bike-free"] : styles["bike-used"];
      const icon = L.icon({
        iconUrl: bikeIconUrl,
        iconSize: [24, 24],
        iconAnchor: [24, 24],
        popupAnchor: [0, 0],
        className: `${bikeClass}`,
      });

      const marker = L.marker([bike.cords.x, bike.cords.y], { icon })
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

  return <div id="map" className={styles.map}></div>;
}
