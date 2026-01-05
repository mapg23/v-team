import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Marker,
  Popup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import MapController from "./MapController";
import BikeMarkers from "./BikeMarkers";
import ParkingZones from "./ParkingZones";
import { useState } from "react";
import { FaBeer } from "react-icons/fa";

/**
 * This is the main component for leaftlet-map
 * @param {Object} coords Renders map based on lat long coordinates
 * @param {Array}  bikes Array of bikeobjects
 * @returns
 */
export default function MapDrawComponent({
  coords,
  action,
  parkingZones,
  bikes,
}) {
  // Only render elements when loading is false
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  /**
   * Call provided action method with the coordinates from Rectangle
   * Circlar: e.layer => _mRadius, lat, lng
   * Polygon: e.layer => [_latlngs]
   * @param {layer} e layer of the draw object
   */
  function onCreate(e) {
    var layer = e.layer;
    action(e.layer.getLatLngs());
  }

  if (loading) return <p>laddar karta..</p>;

  return (
    // ------ MÅSTE FINNAS
    <MapContainer
      id="map"
      center={[coords.latitude, coords.longitude]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "800px", width: "1000px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      ;{/* CHILD Components */}
      <MapController center={coords} />
      {/* {ParkingZones} */}
      <ParkingZones zones={parkingZones} />
      {/* SKAPA GEOMETRI */}
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={onCreate}
          draw={{
            rectangle: false, // bug with undeclared variable type
            circle: false,
            circlemarker: false,
            polyline: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
}
