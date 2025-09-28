import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function SensorInfo({ lat, lng, sensorData }) {
  if (!lat || !lng) {
    return null;
  }

  return (
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <a
        href={`https://www.google.com/maps?q=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
      >
        <ExternalLink size={16} />
        Open in Maps
      </a>
    </motion.div>
  );
}
