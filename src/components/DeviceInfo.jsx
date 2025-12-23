import React from "react";
import { motion } from "framer-motion";
import { Cpu, MapPin, Clock, Signal } from "lucide-react";

export default function DeviceInfo({ sensorData }) {
  const getAlertBadgeColor = (alertLevel) => {
    switch (alertLevel) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "danger":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const infoItems = [
    {
      icon: Cpu,
      label: "Device ID",
      value: sensorData?.deviceId || "-",
      color: "text-blue-600",
    },
    {
      icon: Signal,
      label: "Device Name",
      value: sensorData?.name || "-",
      color: "text-purple-600",
    },
    {
      icon: MapPin,
      label: "Location",
      value:
        sensorData?.gps_lat && sensorData?.gps_lon
          ? `${sensorData.gps_lat.toFixed(4)}, ${sensorData.gps_lon.toFixed(4)}`
          : "-",
      color: "text-green-600",
    },
    {
      icon: Clock,
      label: "Last Update",
      value: sensorData?.timestamp
        ? new Date(sensorData.timestamp).toLocaleString()
        : "-",
      color: "text-gray-600",
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Device Information
        </h3>
        <motion.div
          className={`px-4 py-2 rounded-full border font-semibold text-sm ${getAlertBadgeColor(
            sensorData?.alertLevel || "normal"
          )}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {sensorData?.alertLevel?.toUpperCase() || "NO DATA"}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {infoItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Icon className={`${item.color} w-5 h-5 mt-0.5 flex-shrink-0`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {item.label}
                </p>
                <p className="text-sm text-gray-900 break-words">
                  {item.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Health indicator */}
      <motion.div
        className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800 mb-1">Device Health</h4>
            <p className="text-sm text-gray-600">All systems operational</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-3 h-3 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-green-600">Online</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
