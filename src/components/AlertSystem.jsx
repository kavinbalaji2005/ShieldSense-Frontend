import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, AlertCircle, Info, CheckCircle, Filter, Download } from 'lucide-react';
import { clsx } from 'clsx';

const alertIcons = {
  critical: AlertTriangle,
  danger: AlertCircle,
  warning: Info,
  normal: CheckCircle
};

const alertColors = {
  critical: 'bg-red-50 border-red-200 text-red-800',
  danger: 'bg-orange-50 border-orange-200 text-orange-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  normal: 'bg-green-50 border-green-200 text-green-800'
};

export default function AlertSystem({ alerts = [], className = "" }) {
  const [visibleAlerts, setVisibleAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    // Auto-dismiss normal alerts after 5 seconds
    const timers = visibleAlerts
      .filter(alert => alert.alertLevel === 'normal')
      .map(alert => 
        setTimeout(() => {
          dismissAlert(alert.id);
        }, 5000)
      );

    return () => timers.forEach(clearTimeout);
  }, [visibleAlerts]);

  useEffect(() => {
    // Add new alerts with auto-generated IDs
    const alertsWithIds = alerts.map((alert, index) => ({
      ...alert,
      id: alert.id || `${alert.deviceId}-${alert.timestamp}-${index}`
    }));
    
    setVisibleAlerts(alertsWithIds.slice(0, 10)); // Show max 10 alerts
  }, [alerts]);

  const dismissAlert = (alertId) => {
    setVisibleAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = visibleAlerts.filter(alert => 
    filter === 'all' || alert.alertLevel === filter
  );

  const exportAlerts = () => {
    const dataStr = JSON.stringify(alerts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alerts-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (filteredAlerts.length === 0) return null;

  return (
    <div className={clsx("space-y-4", className)}>
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Active Alerts ({filteredAlerts.length})
        </h3>
        
        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              soundEnabled ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
            )}
            title={soundEnabled ? "Disable sound" : "Enable sound"}
          >
            🔊
          </button>

          {/* Filter dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Alerts</option>
            <option value="critical">Critical</option>
            <option value="danger">Danger</option>
            <option value="warning">Warning</option>
            <option value="normal">Normal</option>
          </select>

          {/* Export button */}
          <button
            onClick={exportAlerts}
            className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Alerts list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredAlerts.map((alert) => {
            const Icon = alertIcons[alert.alertLevel] || Info;
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                className={clsx(
                  "p-4 rounded-lg border-l-4 shadow-sm relative group",
                  alertColors[alert.alertLevel]
                )}
                whileHover={{ scale: 1.01 }}
              >
                {/* Pulse animation for critical alerts */}
                {alert.alertLevel === 'critical' && (
                  <motion.div
                    className="absolute inset-0 bg-red-200 rounded-lg opacity-30"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}

                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-start gap-3">
                    <Icon size={20} className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{alert.deviceId}</span>
                        <span className={clsx(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          alert.alertLevel === 'critical' ? 'bg-red-200 text-red-800' :
                          alert.alertLevel === 'danger' ? 'bg-orange-200 text-orange-800' :
                          alert.alertLevel === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        )}>
                          {alert.alertLevel.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{alert.message || alert.cause || 'Alert triggered'}</p>
                      <p className="text-xs opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black hover:bg-opacity-10 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}