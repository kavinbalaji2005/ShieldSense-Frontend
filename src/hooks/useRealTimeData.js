import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export function useRealTimeData() {
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
        "https://0q89pgcw5f.execute-api.ap-south-1.amazonaws.com/dev/sensors"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      let newSensorData = null;
      if (responseData["ESP32-01"]) {
        newSensorData = responseData["ESP32-01"];
      } else if (responseData["ESP32-02"]) {
        newSensorData = responseData["ESP32-02"];
      } else if (responseData.data && Array.isArray(responseData.data)) {
        const esp32Device = responseData.data.find(
          (device) => device.deviceId === "ESP32-01"
        );
        newSensorData = esp32Device || responseData.data[0];
      }

      if (newSensorData) {
        // Check for alert level changes
        if (sensorData && sensorData.alertLevel !== newSensorData.alertLevel) {
          const alertMessages = {
            critical: '🚨 Critical Alert!',
            danger: '⚠️ Danger Level Alert!',
            warning: '⚡ Warning Alert!',
            normal: '✅ System Normal'
          };
          
          toast(alertMessages[newSensorData.alertLevel], {
            icon: newSensorData.alertLevel === 'critical' ? '🚨' : 
                  newSensorData.alertLevel === 'danger' ? '⚠️' : 
                  newSensorData.alertLevel === 'warning' ? '⚡' : '✅',
            duration: 5000,
            style: {
              background: newSensorData.alertLevel === 'critical' ? '#fee2e2' : 
                         newSensorData.alertLevel === 'danger' ? '#fef3c7' : 
                         newSensorData.alertLevel === 'warning' ? '#fef3c7' : '#d1fae5',
              color: newSensorData.alertLevel === 'critical' ? '#dc2626' : 
                     newSensorData.alertLevel === 'danger' ? '#d97706' : 
                     newSensorData.alertLevel === 'warning' ? '#d97706' : '#059669',
            }
          });
        }

        setSensorData(newSensorData);
        setLastUpdate(new Date());
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching sensor data:", err);
      setError(err.message);
      setIsConnected(false);
      toast.error('Connection lost. Retrying...', {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [sensorData]);

  const fetchAdditionalData = useCallback(async () => {
    try {
      const [alertsResponse, statsResponse] = await Promise.all([
        fetch("https://0q89pgcw5f.execute-api.ap-south-1.amazonaws.com/dev/alerts"),
        fetch("https://0q89pgcw5f.execute-api.ap-south-1.amazonaws.com/dev/stats/overview"),
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
    alerts,
    stats,
    loading,
    error,
    lastUpdate,
    isConnected,
    refetch: () => {
      fetchSensorData();
      fetchAdditionalData();
    }
  };
}