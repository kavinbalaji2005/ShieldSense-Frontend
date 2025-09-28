import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";

// Simple Maps component to test without Google Maps
function SimpleMap({ lat, lng }) {
  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Sensor Location</h3>
        <p className="text-gray-600">Latitude: {lat}</p>
        <p className="text-gray-600">Longitude: {lng}</p>
        <p className="text-sm text-blue-600 mt-2">
          <a
            href={`https://www.google.com/maps?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on Google Maps
          </a>
        </p>
      </div>
    </div>
  );
}

export default function SensorReadingsSimple() {
  const [sensorData, setSensorData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log("Fetching sensor data...");

        // First, try to get all sensors data using the correct API format
        const response = await fetch(
          "https://0q89pgcw5f.execute-api.ap-south-1.amazonaws.com/dev/sensors"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const response_data = await response.json();
        console.log("Full API response:", response_data);

        // According to API docs, /sensors should return format: { "ESP32-01": {...}, "ESP32-02": {...} }
        if (response_data["ESP32-01"]) {
          console.log("ESP32-01 data:", response_data["ESP32-01"]);
          setSensorData(response_data["ESP32-01"]);
        } else if (response_data["ESP32-02"]) {
          // Fallback to ESP32-02 if ESP32-01 is not available
          console.log(
            "ESP32-01 not found, using ESP32-02:",
            response_data["ESP32-02"]
          );
          setSensorData(response_data["ESP32-02"]);
        } else {
          // Handle array format or other variations
          console.log("Checking for data array format...");
          if (response_data.data && Array.isArray(response_data.data)) {
            const esp32Device = response_data.data.find(
              (device) => device.deviceId === "ESP32-01"
            );
            if (esp32Device) {
              setSensorData(esp32Device);
            } else if (response_data.data.length > 0) {
              setSensorData(response_data.data[0]);
            } else {
              throw new Error("No devices found in data array");
            }
          } else {
            throw new Error("No sensor data found in expected format");
          }
        }
      } catch (err) {
        console.error("Error fetching sensor data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    // Fetch alerts and stats in parallel
    async function fetchAdditionalData() {
      try {
        const [alertsResponse, statsResponse] = await Promise.all([
          fetch(
            "https://0q89pgcw5f.execute-api.ap-south-1.amazonaws.com/dev/alerts"
          ),
          fetch(
            "https://0q89pgcw5f.execute-api.ap-south-1.amazonaws.com/dev/stats/overview"
          ),
        ]);

        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json();
          setAlerts(alertsData);
          console.log("Alerts data:", alertsData);
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          // Handle the actual API response format: { status: "success", data: {...} }
          setStats(statsData.data || statsData);
          console.log("Stats data:", statsData);
        }
      } catch (err) {
        console.log("Additional data fetch failed:", err);
        // Don't set error state as this is optional data
      }
    }

    fetchData();
    fetchAdditionalData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading sensor data...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!sensorData) {
    return <div className="p-6 text-center">No sensor data available</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sensor Dashboard</h1>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Device Info */}
      {sensorData && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">Device Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Device ID:</span>{" "}
              {sensorData.deviceId}
            </div>
            <div>
              <span className="font-medium">Name:</span> {sensorData.name}
            </div>
            <div>
              <span className="font-medium">Alert Level:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                  sensorData.alertLevel === "critical"
                    ? "bg-red-100 text-red-800"
                    : sensorData.alertLevel === "danger"
                    ? "bg-red-200 text-red-900"
                    : sensorData.alertLevel === "warning"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {sensorData.alertLevel}
              </span>
            </div>
            <div>
              <span className="font-medium">Last Update:</span>{" "}
              {new Date(sensorData.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* System Overview Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h3 className="text-sm font-semibold text-gray-600">
              Total Devices
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalDevices || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h3 className="text-sm font-semibold text-gray-600">
              Active Devices
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {stats.activeDevices || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h3 className="text-sm font-semibold text-gray-600">
              Alerts Today
            </h3>
            <p className="text-2xl font-bold text-red-600">
              {stats.alertsToday || 0}
            </p>
          </div>
        </div>
      )}

      {/* Alerts Section */}
      {alerts && alerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Recent Alerts ({alerts.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alerts.slice(0, 10).map((alert, index) => (
              <div key={index} className="bg-white rounded p-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-red-700">
                    {alert.deviceId}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      alert.alertLevel === "critical"
                        ? "bg-red-100 text-red-800"
                        : alert.alertLevel === "danger"
                        ? "bg-red-200 text-red-900"
                        : alert.alertLevel === "warning"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {alert.alertLevel}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
            {alerts.length > 10 && (
              <div className="text-center text-sm text-gray-500 mt-2">
                ... and {alerts.length - 10} more alerts
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <pre className="text-xs bg-white p-2 rounded overflow-auto">
          {JSON.stringify(sensorData, null, 2)}
        </pre>
      </div>

      {/* Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SensorGauge
          label="Carbon Monoxide"
          value={sensorData.carbonMonoxide}
          max={100}
        />
        <SensorGauge label="Smoke" value={sensorData.smoke} max={100} />
        <SensorGauge label="Methane" value={sensorData.methane} max={500} />
        <SensorGauge
          label="Temperature (°C)"
          value={sensorData.temperature}
          max={100}
        />
        <SensorGauge
          label="Humidity (%)"
          value={sensorData.humidity}
          max={100}
        />
        <SensorGauge
          label="Pressure (hPa)"
          value={sensorData.pressure}
          max={1100}
        />
      </div>

      {/* Simple Map */}
      <SimpleMap lat={sensorData.gps_lat} lng={sensorData.gps_lon} />
    </div>
  );
}

// Reusable Gauge Component
function SensorGauge({ label, value, max }) {
  const numValue = Number(value) || 0;
  const percentage = Math.min(Math.max(numValue / max, 0), 1);

  return (
    <div className="flex flex-col items-center p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-semibold mb-2">{label}</h2>
      {value !== undefined && value !== null ? (
        <GaugeChart
          id={`gauge-${label.replace(/\s+/g, "-")}`}
          nrOfLevels={20}
          percent={percentage}
          colors={["#FF5F6D", "#FFC371", "#00C49F"]}
          arcWidth={0.3}
          textColor="#000"
          needleColor="#000"
        />
      ) : (
        <div className="h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-gray-500">No data</span>
        </div>
      )}
      <p className="mt-2 text-gray-700">
        {value !== undefined && value !== null ? `${numValue} / ${max}` : "N/A"}
      </p>
    </div>
  );
}
