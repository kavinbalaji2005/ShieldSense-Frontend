import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

export function useRealTimeData() {
  const [allDevices, setAllDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  const fetchSensorData = useCallback(async () => {
    try {
      setIsConnected(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_SENSORS_ENDPOINT}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      // Store all devices
      if (responseData.data && Array.isArray(responseData.data)) {
        setAllDevices(responseData.data);
        
        // If no device is selected, select the first one
        const currentSelectedId = selectedDeviceId || responseData.data[0]?.deviceId;
        if (!selectedDeviceId && responseData.data.length > 0) {
          setSelectedDeviceId(currentSelectedId);
        }
        
        // Find the selected device or fall back to first device
        const newSensorData = responseData.data.find(
          (device) => device.deviceId === currentSelectedId
        ) || responseData.data[0];

        if (newSensorData) {
        // Check for alert level changes
        if (sensorData && sensorData.alertLevel !== newSensorData.alertLevel) {
          const alertMessages = {
            critical: "🚨 Critical Alert!",
            danger: "⚠️ Danger Level Alert!",
            warning: "⚡ Warning Alert!",
            normal: "✅ System Normal",
          };

          toast(alertMessages[newSensorData.alertLevel], {
            icon:
              newSensorData.alertLevel === "critical"
                ? "🚨"
                : newSensorData.alertLevel === "danger"
                ? "⚠️"
                : newSensorData.alertLevel === "warning"
                ? "⚡"
                : "✅",
            duration: 5000,
            style: {
              background:
                newSensorData.alertLevel === "critical"
                  ? "#fee2e2"
                  : newSensorData.alertLevel === "danger"
                  ? "#fef3c7"
                  : newSensorData.alertLevel === "warning"
                  ? "#fef3c7"
                  : "#d1fae5",
              color:
                newSensorData.alertLevel === "critical"
                  ? "#dc2626"
                  : newSensorData.alertLevel === "danger"
                  ? "#d97706"
                  : newSensorData.alertLevel === "warning"
                  ? "#d97706"
                  : "#059669",
            },
          });
        }

          setSensorData(newSensorData);
          setLastUpdate(new Date());
          setError(null);
        }
      }
    } catch (err) {
      console.error("Error fetching sensor data:", err);
      setError(err.message);
      setIsConnected(false);
      toast.error("Connection lost. Retrying...", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [sensorData, selectedDeviceId]);

  const fetchAdditionalData = useCallback(async () => {
    try {
      const [alertsResponse, statsResponse] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_ALERTS_ENDPOINT}`
        ),
        fetch(
          `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_STATS_ENDPOINT}`
        ),
      ]);

      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        setAlerts(alertsData);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data || statsData);
      }
    } catch (err) {
      console.log("Additional data fetch failed:", err);
    }
  }, []);

  useEffect(() => {
    fetchSensorData();
    fetchAdditionalData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchSensorData();
      fetchAdditionalData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchSensorData, fetchAdditionalData]);

  return {
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
    refetch: () => {
      fetchSensorData();
      fetchAdditionalData();
    },
  };
}
