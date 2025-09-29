import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { RefreshCw } from "lucide-react";

import { useRealTimeData } from "./hooks/useRealTimeData";
import SmartGauge from "./components/SmartGauge";
import AlertSystem from "./components/AlertSystem";
import InteractiveMap from "./components/InteractiveMap";
import SensorInfo from "./components/SensorInfo";
import StatsOverview from "./components/StatsOverview";
import DeviceInfo from "./components/DeviceInfo";
import DeviceSelector from "./components/DeviceSelector";
import { GaugeSkeleton, CardSkeleton } from "./components/LoadingSkeleton";

export default function SensorReadingsSimple() {
  const {
    sensorData,
    allDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    alerts,
    stats,
    loading,
    error,
    lastUpdate,
    isConnected,
    refetch,
  } = useRealTimeData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>

          {/* Gauges skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <GaugeSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Connection Error
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            onClick={refetch}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={16} />
            Retry Connection
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!sensorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600">Waiting for sensor data...</p>
        </div>
      </div>
    );
  }

  const sensorGauges = [
    {
      label: "Carbon Monoxide",
      value: sensorData.carbonMonoxide,
      max: 100,
      unit: "ppm",
    },
    { label: "Smoke", value: sensorData.smoke, max: 100, unit: "%" },
    { label: "Methane", value: sensorData.methane, max: 500, unit: "ppm" },
    {
      label: "Temperature",
      value: sensorData.temperature,
      max: 100,
      unit: "°C",
    },
    { label: "Humidity", value: sensorData.humidity, max: 100, unit: "%" },
    { label: "Pressure", value: sensorData.pressure, max: 1100, unit: "hPa" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#374151",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        }}
      />

      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShieldSense Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time environmental monitoring system
            </p>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <StatsOverview
          stats={stats}
          deviceCount={allDevices?.length || 0}
          isConnected={isConnected}
          lastUpdate={lastUpdate}
        />

        {/* Device Selector */}
        <DeviceSelector
          allDevices={allDevices}
          selectedDeviceId={selectedDeviceId}
          onDeviceChange={setSelectedDeviceId}
        />

        {/* Device Information */}
        <DeviceInfo sensorData={sensorData} />

        {/* Alerts System */}
        <AnimatePresence>
          {alerts && alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <AlertSystem alerts={alerts} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Smart Gauges Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {sensorGauges.map((gauge, index) => (
            <motion.div
              key={gauge.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <SmartGauge
                label={gauge.label}
                value={gauge.value}
                max={gauge.max}
                unit={gauge.unit}
                thresholds={{ low: 30, high: 70 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Map */}
        <InteractiveMap
          lat={sensorData?.gps_lat}
          lng={sensorData?.gps_lon}
          sensorData={sensorData}
        />

        {/* Sensor Location Info */}
        <SensorInfo
          lat={sensorData?.gps_lat}
          lng={sensorData?.gps_lon}
          sensorData={sensorData}
        />
      </div>
    </div>
  );
}
