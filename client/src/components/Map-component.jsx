import { useEffect, useRef, useMemo } from "react";
import { FaChargingStation, FaParking } from "react-icons/fa";
import { MdElectricScooter } from "react-icons/md";
import { renderToStaticMarkup } from "react-dom/server";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../assets/Map-component.module.css";

import "leaflet.markercluster";

export default function MapComponent({
  coords,
  bikes,
  parkingZones,
  chargingZones,
  bikeRentCallback
}) {
  const containerRef = useRef(null); // DOM NODE
  const mapRef = useRef(null); // Leaflet map instance
  // const markersRef = useRef([]);

  // Reduces lag
  const bikeClusterRef = useRef(null);
  const bikeMarkersRef = useRef(new Map());

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
    if (coords?.latitude == null || coords?.longitude == null) {
      console.log("missing coordinates for map", coords);
      return;
    }
    if (!containerRef.current) return;

    // Om kartan redan finns → flytta den istället för att initiera ny
    if (mapRef.current) {
      mapRef.current.setView(
        [Number(coords.latitude), Number(coords.longitude)],
        13
      );
      return;
    }

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

    bikeClusterRef.current = L.markerClusterGroup({
      chunkedLoading: true,
      chunkDelay: 50,
      maxClusterRadius: 60
    });

    map.addLayer(bikeClusterRef.current);
    mapRef.current = map;


    setTimeout(() => {
      map.invalidateSize();
    }, 0);

  }, [coords]);

  /**
   * Rerender markers on new bike events
   */
  useEffect(() => {
    // const map = mapRef.current;

    const cluster = bikeClusterRef.current;
    if (!cluster) return;

    const nextIds = new Set(bikes.map((b) => b.id));

    bikeMarkersRef.current.forEach((marker, id) => {
      if (!nextIds.has(id)) {
        cluster.removeLayer(marker);
        bikeMarkersRef.current.delete(id);
      }
    });

    // Lägg till nya markers
    bikes.forEach((bike) => {
      if (bikeMarkersRef.current.has(bike.id)) return;

      if (bike.occupied === 1 || bike.current_zone_type === 'charging') {
        return;
      }

      const customScooterIcon = L.divIcon({
        html: scooterIcon,
        className:
          bike.occupied === 10 ? styles["bike-free"] : styles["bike-used"],
      });

      // Markers must be in Latitude, Longitude - else wont show!!
      const marker = L.marker([bike.cords.y, bike.cords.x], {
        icon: customScooterIcon,
      })
        .bindPopup(`
          <table class="bike-table">
            <tr><th>Bike Id:</th><td>${bike.id}</td></tr>
            <tr><th>Status:</th><td>${bike.status}</td></tr>
            <tr><th>Occupied:</th><td>${bike.occupied}</td></tr>
            <tr>
              <td colspan="2">
                <button class="rent-bike-btn" data-bike-id="${bike.id}">
                  Hyr cykel
                </button>
              </td>
            </tr>
          </table>
        `);

      marker.on("popupopen", () => {
        const btn = document.querySelector(
          `.rent-bike-btn[data-bike-id="${bike.id}"]`
        );

        if (btn) {
          btn.onclick = () => bikeRentCallback(bike.id);
        }
      });
      cluster.addLayer(marker);
      bikeMarkersRef.current.set(bike.id, marker);
    });
  }, [bikes, scooterIcon, bikeRentCallback]);

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
        .bindPopup(`<strong>Parking ID:</strong> ${parking.id}`)
        .addTo(layer);

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
    chargingZones.forEach((z) => {
      L.marker([z.latitude, z.longitude], { icon: chargingStationIcon })
        .bindPopup(`<strong>${z.name}</strong><br/>Capacity: ${z.capacity}`)
        .addTo(layer);
    });
  }, [chargingZones, chargingStationIcon]);

  return <div ref={containerRef} className={styles.map}></div>;
}
