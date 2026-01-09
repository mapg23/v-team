import { useEffect } from "react";
import { MapContainer, TileLayer, FeatureGroup, Circle } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import MapController from "./MapController";
import BikeMarkers from "./BikeMarkers";
import ParkingZones from "./ParkingZoneMarkers";
import ChargingZones from "./ChargingZoneMarkers";
import { useState } from "react";

/**
 * This is the main component for leaftlet-map
 * @param {Object} coords Renders map based on lat long coordinates
 * @param {action} method provided from parent, call when draw:create event is triggered
 * @param {Array<Object>} parkingZones Array of parkingZone Objects
 * @param {Array<Object>} chargingZones Array of parkingZone Objects
 * @param {Array<Object>} bikes Array of bike objects
 * @param {Object} editOptions Object width edit options
 * @returns
 */
export default function MapDrawComponent({
  coords,
  action,
  parkingZones,
  chargingZones,
  bikes,
  editOptions,
}) {
  // Only render elements when loading is false
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  /**
   * Call provided action method with event
   * @param {e} e event of draw:created
   */
  function onCreate(e) {
    action(e.layer);
  }

  if (loading) return <p>laddar karta..</p>;

  return (
    // ------ MÅSTE FINNAS
    <MapContainer
      id="map"
      center={[coords.latitude, coords.longitude]}
      zoom={14}
      scrollWheelZoom={true}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={[coords.latitude, coords.longitude]}
        radius={3000} // radius in meter
      ></Circle>
      ;{/* CHILD Components */}
      <MapController center={coords} />
      {/* {ParkingZones} */}
      {parkingZones ? <ParkingZones zones={parkingZones} /> : ""}
      {/* {chargingZones} */}
      {chargingZones ? <ChargingZones zones={chargingZones} /> : ""}
      {/* {BIKES} */}
      {bikes ? <BikeMarkers bikes={bikes} /> : ""}
      {/* SKAPA GEOMETRI */}
      {editOptions ? (
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={onCreate}
            draw={{
              rectangle: editOptions.rectangle,
              circle: editOptions.circle,
              circlemarker: editOptions.circlemarker,
              polyline: editOptions.polyline,
              polygon: editOptions.polygon,
              marker: editOptions.marker,
            }}
          />
        </FeatureGroup>
      ) : (
        ""
      )}
    </MapContainer>
  );
}
