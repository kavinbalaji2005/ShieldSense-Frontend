import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Satellite, Map, ExternalLink } from 'lucide-react';

export default function InteractiveMap({ lat, lng, sensorData, className = "" }) {
  const [viewMode, setViewMode] = useState('roadmap');
  
  if (!lat || !lng) {
    return (
      <div className={`h-96 w-full rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <MapPin size={48} className="mx-auto mb-2 opacity-50" />
          <p>Location data not available</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (alertLevel) => {
    switch (alertLevel) {
      case 'critical': return '#ef4444';
      case 'danger': return '#f97316';
      case 'warning': return '#eab308';
      default: return '#10b981';
    }
  };

  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Map controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setViewMode('roadmap')}
          className={`p-2 rounded-lg shadow-md transition-colors ${
            viewMode === 'roadmap' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          title="Road view"
        >
          <Map size={16} />
        </button>
        <button
          onClick={() => setViewMode('satellite')}
          className={`p-2 rounded-lg shadow-md transition-colors ${
            viewMode === 'satellite' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          title="Satellite view"
        >
          <Satellite size={16} />
        </button>
      </div>

      {/* Map container */}
      <div className="h-96 w-full bg-gray-200 relative">
        {/* Simulated map background */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100"
          style={{
            backgroundImage: viewMode === 'satellite' 
              ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              : `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.3'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        {/* Sensor marker */}
        <motion.div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: '50%',
            top: '50%',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ 
              backgroundColor: getStatusColor(sensorData?.alertLevel),
              opacity: 0.3 
            }}
            animate={{ scale: [1, 2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Marker */}
          <div
            className="w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center relative z-10"
            style={{ backgroundColor: getStatusColor(sensorData?.alertLevel) }}
          >
            <MapPin size={16} className="text-white" />
          </div>
        </motion.div>

        {/* Info popup */}
        <motion.div
          className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800">
                {sensorData?.name || 'Sensor Location'}
              </h4>
              <p className="text-sm text-gray-600">
                {lat.toFixed(6)}, {lng.toFixed(6)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getStatusColor(sensorData?.alertLevel) }}
                />
                <span className="text-sm font-medium capitalize">
                  {sensorData?.alertLevel || 'Unknown'}
                </span>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps?q=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <ExternalLink size={14} />
              Open
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}