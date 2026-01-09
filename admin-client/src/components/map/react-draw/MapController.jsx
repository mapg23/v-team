import { useEffect } from "react";
import { useMap } from "react-leaflet";

/**
 * This component is responsible for updating the view and zoom
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
