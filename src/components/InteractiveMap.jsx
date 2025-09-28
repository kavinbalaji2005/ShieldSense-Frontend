import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";

export default function InteractiveMap({
  lat,
  lng,
  sensorData,
  className = "",
}) {
  const handleMarkerClick = useCallback(
    (event) => {
      console.log("Sensor marker clicked:", sensorData?.name);
    },
    [sensorData]
  );

  if (!lat || !lng) {
    return (
      <div
        className={`h-96 w-full rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center ${className}`}
      >
        <div className="text-center text-gray-500">
          <MapPin size={48} className="mx-auto mb-2 opacity-50" />
          <p>Location data not available</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (alertLevel) => {
    switch (alertLevel) {
      case "critical":
        return "#ef4444";
      case "danger":
        return "#f97316";
      case "warning":
        return "#eab308";
      default:
        return "#10b981";
    }
  };

  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <APIProvider apiKey="AIzaSyA8MCQGD1wTn57ODwsUvvauel_rHKpTHc4">
        <div className="h-96 w-full relative">
          {/* Google Map */}
          <GoogleMap
            defaultCenter={{ lat: lat, lng: lng }}
            defaultZoom={15}
            mapId="DEMO_MAP_ID"
            gestureHandling="cooperative"
            disableDefaultUI={false}
            style={{ width: "100%", height: "100%" }}
          >
            {/* Sensor marker */}
            <AdvancedMarker
              position={{ lat: lat, lng: lng }}
              onClick={handleMarkerClick}
            >
              <div className="relative">
                {/* Pulse effect */}
                <motion.div
                  className="absolute inset-0 rounded-full w-12 h-12 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    backgroundColor: getStatusColor(sensorData?.alertLevel),
                    opacity: 0.3,
                    left: "50%",
                    top: "50%",
                  }}
                  animate={{ scale: [1, 2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Custom Pin */}
                <Pin
                  background={getStatusColor(sensorData?.alertLevel)}
                  borderColor="#ffffff"
                  glyphColor="#ffffff"
                />
              </div>
            </AdvancedMarker>
          </GoogleMap>
        </div>
      </APIProvider>
    </motion.div>
  );
}
