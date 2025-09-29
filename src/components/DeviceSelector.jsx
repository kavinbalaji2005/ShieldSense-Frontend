import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, Wifi, WifiOff } from "lucide-react";

export default function DeviceSelector({
  allDevices,
  selectedDeviceId,
  onDeviceChange,
  className = "",
}) {
  const selectedDevice = allDevices.find(
    (device) => device.deviceId === selectedDeviceId
  );

  const getStatusColor = (alertLevel) => {
    switch (alertLevel) {
      case "critical":
        return "bg-red-500";
      case "danger":
        return "bg-orange-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  const getStatusIcon = (device) => {
    return device.timestamp ? (
      <Wifi size={14} className="text-green-500" />
    ) : (
      <WifiOff size={14} className="text-red-500" />
    );
  };

  if (!allDevices || allDevices.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-lg p-4 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Device Selection
        </h3>
        <div className="text-sm text-gray-500">
          {allDevices.length} device{allDevices.length > 1 ? "s" : ""} available
        </div>
      </div>

      <div className="relative">
        <select
          value={selectedDeviceId || ""}
          onChange={(e) => onDeviceChange(e.target.value)}
          className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {allDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.deviceId} - {device.name} ({device.alertLevel})
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      {selectedDevice && (
        <motion.div
          className="mt-3 p-3 bg-gray-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(selectedDevice)}
              <span className="font-medium text-gray-800">
                {selectedDevice.deviceId}
              </span>
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(
                  selectedDevice.alertLevel
                )}`}
              />
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500">Last Update</div>
              <div className="text-sm font-medium">
                {selectedDevice.timestamp
                  ? new Date(selectedDevice.timestamp).toLocaleTimeString()
                  : "No data"}
              </div>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Location:</span>
              <div className="font-medium">
                {selectedDevice.gps_lat?.toFixed(4)},{" "}
                {selectedDevice.gps_lon?.toFixed(4)}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <div
                className={`font-medium capitalize ${
                  selectedDevice.alertLevel === "critical"
                    ? "text-red-600"
                    : selectedDevice.alertLevel === "danger"
                    ? "text-orange-600"
                    : selectedDevice.alertLevel === "warning"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {selectedDevice.alertLevel}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
