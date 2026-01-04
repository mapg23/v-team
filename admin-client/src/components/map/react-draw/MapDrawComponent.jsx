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
import { useState } from "react";
import { FaBeer } from "react-icons/fa";

/**
 * This is the main component for leaftlet-map
 * @param {Object} coords Contains info about current city
 * @param {Array}  bikes Array of bikeobjects
 * @returns
 */
export default function MapDrawComponent({ coords, bikes }) {
  // Only render elements when loading is false
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(bikes);
    setLoading(false);
  }, []);

  /**
   * Circlar: e.layer => _mRadius, lat, lng
   * Polygon: e.layer => [_latlngs]
   * @param {layer} e
   */
  function onCreate(e) {
    var layer = e.layer;
    console.log(e.layer);
    console.log(layer.toGeoJSON());
  }

  if (loading) return <p>laddar karta..</p>;



  return (
    // ------ MÅSTE FINNAS
    <MapContainer
      id="map"
      center={[coords.latitude, coords.longitude]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Marker position={[57.863142, 14.127853]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}

      ;{/* CHILD Components */}
      
      <MapController center={coords} />
      <BikeMarkers bikes={bikes} />
        
      {/* SKAPA GEOMETRI */}
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={onCreate}
          draw={{
            rectangle: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
}
