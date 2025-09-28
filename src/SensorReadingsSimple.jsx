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

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log("Fetching sensor data...");
        const response = await fetch(
          "https://0q89pgcw5f.execute-api.ap-south-1.amazonaws.com/dev/sensors"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const response_data = await response.json();
        console.log("Full API response:", response_data);

        // Handle new API format with data array
        if (response_data.data && Array.isArray(response_data.data)) {
          // Find ESP32-01 device in the data array
          const esp32Device = response_data.data.find(
            (device) => device.deviceId === "ESP32-01"
          );
          if (esp32Device) {
            console.log("ESP32-01 data:", esp32Device);
            setSensorData(esp32Device);
          } else {
            // If ESP32-01 not found, use the first available device
            console.log(
              "ESP32-01 not found, using first device:",
              response_data.data[0]
            );
            setSensorData(response_data.data[0]);
          }
        } else if (response_data["ESP32-01"]) {
          // Handle old API format (fallback)
          console.log("ESP32-01 data (old format):", response_data["ESP32-01"]);
          setSensorData(response_data["ESP32-01"]);
        } else {
          throw new Error("No sensor data found in response");
        }
      } catch (err) {
        console.error("Error fetching sensor data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
      <h1 className="text-3xl font-bold text-center">Sensor Dashboard</h1>

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
