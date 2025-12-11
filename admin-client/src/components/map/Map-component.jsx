/* global L */
import { useEffect } from "react";
import styles from "./Map-component.module.css";
import bikeIconUrl from "../../assets/bike.png";

export default function MapComponent({ coords, bikes }) {
  useEffect(() => {
    console.log(coords);
    // Hämta elementet som React nu har renderat
    if (!coords.lat || !coords.long) return;

    const map = L.map("map").setView([coords.lat, coords.long], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // add all bikes to map
    const bikes = [
      {
        id: 1,
        lat: coords.lat,
        long: coords.long,
      },
    ];

    for (const bike of bikes) {
      renderMarkers(bike);
    }

    function renderMarkers(bike) {
      const locationMarker = L.icon({
        iconUrl: bikeIconUrl,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, 0],
      });

      L.marker([bike.lat, bike.long], { icon: locationMarker })
        .bindPopup(
          `
          message: Jag hyr
          `
        )
        .openPopup()
        .addTo(map);
    }

    // Cleanup när komponenten avmountas
    return () => {
      map.remove();
    };
  }, [coords]);
  return <div id="map" className={styles.map}></div>;

  // const bikeObjects = JSON.parse(bikes);
  //         trainObjct.values().forEach(element => {
  //             renderMarkers(element);
  //         });;
  //     }

  // // Train markers
  // async function renderMarkers(train) {
  //     let points = train.CurrentLocation.Geometry.WGS84
  //     // Replace POINT () chars with empty string
  //     // Split into array on space and slice from first index (a space)
  //     let [long, lat] = this.getCoordinates(points);
  //     // const pointsArray = points.replaceAll(/[POINT\(\)]/gi, "").split(" ").slice(1);
  //     // let [long, lat] = pointsArray;
  //     const locationMarker = L.icon({
  //         iconUrl: "./style/assets/train.png",
  //         iconSize: [24, 24],
  //         iconAnchor: [12, 12],
  //         popupAnchor: [0, 0],
  //     });

  //     // Train route and delay
  //     const info = {
  //         "start": train.FromLocation.AdvertisedLocationName,
  //         "current": train.CurrentLocation.AdvertisedLocationName,
  //         "end": train.ToLocation.AdvertisedLocationName,
  //         "delay": this.calculateDelay(train)
  //     };

  //     L.marker([
  //         parseFloat(lat),
  //         parseFloat(long)],
  //         {icon: locationMarker,
  //         })
  //         .addTo(this.map)
  //         .bindPopup(`
  //             Startstation: ${info.start}
  //             Nuvarande station: ${info.current}
  //             Slutstation: ${info.end}
  //             Försening hh:mm:ss: ${info.delay}
  //             `).openPopup();
}

// export default class MapComp extends HTMLElement {
//     constructor() {
//         super();

//         this.map = null;
//         this.trains = null;
//         this.trainObject = {};
//     }

//     attributeChangedCallback(property, oldValue, newValue) {
//         if (oldValue !== newValue) {
//             this[property] = newValue;
//         }
//         return this[property];
//     }

//     // component attributes
//     static get observedAttributes() {
//         return ["trains"];
//     }

//     async connectedCallback() {
//         this.innerHTML = `<div id="map" class="map"></div>`;
//         this.renderMap();
//     }

//     renderMap() {
//         this.map = L.map('map').setView([59.334591, 18.063240], 7);

//         L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             maxZoom: 19,
//             attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//         }).addTo(this.map);

//         const trainObjct = JSON.parse(this.trains);
//         trainObjct.values().forEach(element => {
//             this.renderMarkers(element);
//         });;

//         this.renderLocation();
//     }

//     // Train markers
//     async renderMarkers(train) {
//         let points = train.CurrentLocation.Geometry.WGS84
//         // Replace POINT () chars with empty string
//         // Split into array on space and slice from first index (a space)
//         let [long, lat] = this.getCoordinates(points);
//         // const pointsArray = points.replaceAll(/[POINT\(\)]/gi, "").split(" ").slice(1);
//         // let [long, lat] = pointsArray;
//         const locationMarker = L.icon({
//             iconUrl: "./style/assets/train.png",
//             iconSize: [24, 24],
//             iconAnchor: [12, 12],
//             popupAnchor: [0, 0],
//         });

//         // Train route and delay
//         const info = {
//             "start": train.FromLocation.AdvertisedLocationName,
//             "current": train.CurrentLocation.AdvertisedLocationName,
//             "end": train.ToLocation.AdvertisedLocationName,
//             "delay": this.calculateDelay(train)
//         };

//         L.marker([
//             parseFloat(lat),
//             parseFloat(long)],
//             {icon: locationMarker,
//             })
//             .addTo(this.map)
//             .bindPopup(`
//                 Startstation: ${info.start}
//                 Nuvarande station: ${info.current}
//                 Slutstation: ${info.end}
//                 Försening hh:mm:ss: ${info.delay}
//                 `).openPopup();

//         /**
//          * Add station icon */
//         if (train.markStation) {
//             let points = train.markStation.Geometry.WGS84;
//             let [long, lat] = this.getCoordinates(points);
//             // Skapa olika ikoner
//             const startIcon = L.icon({
//                 iconUrl: "./style/assets/station.png",
//                 iconSize: [24, 24],
//                 iconAnchor: [12, 12],
//                 popupAnchor: [0, 0],
//             });

//             L.circle([
//                 parseFloat(lat),
//                 parseFloat(long)], { radius: 50 * parseInt(`${info.delay}`.split(":")[1]) }).addTo(this.map);

//             L.marker([
//                 parseFloat(lat),
//                 parseFloat(long)],
//                 {
//                     icon: startIcon,
//                 })
//                 .addTo(this.map)
//                 .bindPopup(`
//                     Försenad favorit.
//                     Startstation: ${info.start}
//                     Försening hh:mm:ss: ${info.delay}
//                     `).openPopup();
//         }

//     }

//     /**
//      * Get coordinates from point
//      */
//     getCoordinates(pointsString)
//     {
//         return pointsString.replaceAll(/[POINT()]/gi, "").split(" ").slice(1);
//     }

//     // Beräkna tidsförsening
//     /**
//      * Since all trains are delayed we dont
//      * need to take into a account if a train is early
//      * @param {train} train object
//      * @returns string time as hh-mm-ss
//      */
//     calculateDelay(train)
//     {
//         const advTime = new Date(train.AdvertisedTimeAtLocation);
//         const estTime = new Date(train.EstimatedTimeAtLocation);
//         const diff = new Date(estTime.getTime() - advTime.getTime());
//         const hours = diff.getUTCHours();
//         const minutes = diff.getUTCMinutes();
//         const seconds = diff.getUTCSeconds();
//         const timeString = hours.toString().padStart(2, '0') + ':' +
//             minutes.toString().padStart(2, '0') + ':' +
//             seconds.toString().padStart(2, '0');

//         return timeString;
//     }

//     // Användarens plats
//     renderLocation() {
//         if ("geolocation" in navigator) {
//             navigator.geolocation.getCurrentPosition((position) => {
//                 L.marker(
//                     [position.coords.latitude, position.coords.longitude],
//                 ).addTo(this.map);
//             });
//         }
//     }
// }
