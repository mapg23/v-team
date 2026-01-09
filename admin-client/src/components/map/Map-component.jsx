/* global L */
import { useEffect, useRef, useMemo } from "react";
import styles from "./Map-component.module.css";
import { FaChargingStation, FaParking } from "react-icons/fa";
import { MdElectricScooter } from "react-icons/md";
import { renderToStaticMarkup } from "react-dom/server";

export default function MapComponent({
  coords,
  bikes,
  parkingZones,
  chargingZones,
}) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const parkingLayerRef = useRef(null);
  const circleLayerRef = useRef(null);
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
   * Initiates a new map instance based on coordinates
   * If map already exists, only update the view
   */
  useEffect(() => {
    if (!coords.latitude || !coords.longitude) {
      console.log("missing coordinates for map");
      return;
    }

    // Om kartan redan finns -> flytta den istället för att initiera ny
    if (mapRef.current) {
      mapRef.current.setView(
        [Number(coords.latitude), Number(coords.longitude)],
        14
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
   * Draw circles when coordinates are changing (another city is selected)
   * A circle represents the bounds of where a bike is alaod to run
   */
  useEffect(() => {
     // Skapa Cirkel lager en gång
    if (!circleLayerRef.current) {
      circleLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }

    const layer = circleLayerRef.current;

    // Töm lager för att undvika att cirklar ritas om och om igen
    layer.clearLayers();

    L.circle([Number(coords.latitude), Number(coords.longitude)], {radius: 3000})
    .bindPopup("Cirkeln representerar zonen som en cykel får köras i").openPopup()
    .addTo(layer);
  }, [coords])

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
    // Om en cykel har status 10 - cykel är redo för användning
    // Annars är cykeln hyrd alt på service, dvs inte tillgänglig
    bikes.forEach((bike) => {
      const customScooterIcon = L.divIcon({
        html: scooterIcon,
        className:
          bike.occupied ? styles["bike-used"] : styles["bike-free"],
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
            <td>Lat: ${bike.cords.y} Lng: ${bike.cords.x}</td>
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
            <th>Zone id:</th>
            <td>${bike.current_zone_id}</td>
          </tr>
          <tr>
            <th>Zone type:</th>
            <td>${bike.current_zone_type}</td>
          </tr>
          <tr>
            <th>Speed:</th>
            <td>${bike.speed}</td>
          </tr>
          </table>
          <button><a className="noStyling" href="/bikes/${bike.id}">Inspect Bike</button>
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
            <th>Bikes in zone :</th>
            <td>${parking.bikes}</td>
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
            <th>Capacity:</th>
            <td>${zone.capacity}</td>
          </tr>
          <tr>
            <th>Bikes in Zone:</th>
            <td>${zone.bikes}</td>
          </tr>
          </table>
          `
        )
        .openPopup()
        .addTo(layer);
    });
  }, [chargingZones, chargingStationIcon]);

  return <div id="map" className={styles.map}></div>;
}
