import { useEffect, useRef, useMemo } from "react";
import styles from "./Map-component.module.css";
import { FaChargingStation, FaParking } from "react-icons/fa";
import { MdElectricScooter } from "react-icons/md";
import { renderToStaticMarkup } from "react-dom/server";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapComponent({
  coords,
  bikes,
  parkingZones,
  chargingZones,
}) {
  console.log("MapComponent rendered");
  const containerRef = useRef(null); // DOM NODE
  const mapRef = useRef(null); // Leaflet map instance
  const markersRef = useRef([]);
  const parkingLayerRef = useRef(null);
  const chargingLayerRef = useRef(null);

  // BIKE ICON
  // Color depends on usage
  const scooterIcon = renderToStaticMarkup(<MdElectricScooter />);

  // PARKING ICON
  // Save in cache
  const cutomParkingIcon = useMemo(() => {
    const parkingIcon = renderToStaticMarkup(<FaParking />);
    return L.divIcon({
      html: parkingIcon,
      className: styles["parking-station"],
    });
  }, []);

  // CHARGINGSTATION ICON
  // Save in cache
  const chargingStationIcon = useMemo(() => {
    const chargingIcon = renderToStaticMarkup(<FaChargingStation />);
    return L.divIcon({
      html: chargingIcon,
      className: styles["charging-station"],
    });
  }, []);

  /**
   * Renders the map if new city coordinates
   */
  useEffect(() => {
    if (
      coords?.latitude == null ||
      coords?.longitude == null
    ) {
      console.log("missing coordinates for map", coords);
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

    if (!containerRef.current) return;
    // Annars skapa ny karta
    const map = L.map(containerRef.current).setView(
      [Number(coords.latitude), Number(coords.longitude)],
      13
    );

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 0);

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
      const customScooterIcon = L.divIcon({
        html: scooterIcon,
        className:
          bike.occupied === 10 ? styles["bike-free"] : styles["bike-used"],
      });

      // Markers must be in Latitude, Longitude - else wont show!!
      const marker = L.marker([bike.cords.y, bike.cords.x], {
        icon: customScooterIcon,
      })
        .bindPopup(
          `
          <table>
          <tr>
            <th>Bike Id:</th>
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
  }, [bikes, scooterIcon]);

  /**
   * Render parkingZones
   */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Skapa lagret en gång
    if (!parkingLayerRef.current) {
      parkingLayerRef.current = L.layerGroup().addTo(map);
    }

    const layer = parkingLayerRef.current;

    // Töm lager för att undvika att rektanglar ritas om och om igen
    layer.clearLayers();

    // Lägg till nya parking rectangles
    parkingZones.forEach((parking) => {
      const polygonCoords = [
        [parking.max_lat, parking.min_long], // nordväst (max_lat, min_long)
        [parking.max_lat, parking.max_long], // nordost (max_lat, max_long)
        [parking.min_lat, parking.max_long], // sydost (min_lat, max_long)
        [parking.min_lat, parking.min_long], // sydväst (min_lat, min_long)
      ];
      L.marker([parking.max_lat, parking.min_long], { icon: cutomParkingIcon })
        .bindPopup(
          `
          <table>
          <tr>
            <th>Parking ID:</th>
            <td><a href="/parking/${parking.id}">${parking.id}</td>
          </tr>
          <tr>
            <th>City id:</th>
            <td>${parking.city_id}</td>
          </tr>
          <tr>
            <th>Max_lat :</th>
            <td>${parking.max_lat}</td>
          </tr>
          <tr>
            <th>Max_long:</th>
            <td>${parking.max_long}</td>
          </tr>
          <tr>
            <th>Min_lat</th>
            <td>${parking.min_lat}</td>
          </tr>
          <tr>
            <th>Min_long:</th>
            <td>${parking.min_long}</td>
          </tr>
          </table>
          `
        )
        .openPopup()
        .addTo(layer); // lägg till lagret

      // Rita rektangel
      L.polygon(polygonCoords, { color: "red" }).addTo(layer); // lägg till lagret
    });
  }, [parkingZones, cutomParkingIcon]);

  /**
   * Render charginZones
   */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Skapa lagret en gång
    if (!chargingLayerRef.current) {
      chargingLayerRef.current = L.layerGroup().addTo(map);
    }

    const layer = chargingLayerRef.current;

    // Töm lager för att undvika att rektanglar ritas om och om igen
    layer.clearLayers();

    // Lägg till nya markers
    chargingZones.forEach((zone) => {
      // Markers must be in Latitude, Longitude - else wont show!!
      L.marker([zone.latitude, zone.longitude], {
        icon: chargingStationIcon,
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
        .addTo(layer);
    });
  }, [chargingZones, chargingStationIcon]);

  return <div ref={containerRef} className={styles.map}></div>;
}
