import { useEffect } from "react";
import { useMap } from "react-leaflet";

/**
 * Zoom to city center
 * @param {Object} center CityObject container latitude, longitude properties 
 * @returns 
 */
function MapController({ center }) {
  // Get map instance
  const map = useMap();

  useEffect(() => {
    if (!center) {
      console.log("Saknar coordinater för kartan");
      return;
    }

    map.setView([center.latitude, center.longitude], 14, {
      animate: true,
    });
  }, [center, map]);

  return null;
}

export default MapController;
