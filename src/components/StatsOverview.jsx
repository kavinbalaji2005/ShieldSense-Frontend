import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';

export default function StatsOverview({ stats, isConnected, lastUpdate }) {
  const statCards = [
    {
      title: 'Total Devices',
      value: stats?.totalDevices || 0,
      icon: Activity,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Active Devices',
      value: stats?.activeDevices || 0,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      iconColor: 'text-green-500'
    },
    {
      title: 'Alerts Today',
      value: stats?.alertsToday || 0,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      iconColor: 'text-red-500'
    },
    {
      title: 'Connection',
      value: isConnected ? 'Online' : 'Offline',
      icon: Wifi,
      color: isConnected ? 'green' : 'red',
      bgColor: isConnected ? 'bg-green-50' : 'bg-red-50',
      textColor: isConnected ? 'text-green-600' : 'text-red-600',
      iconColor: isConnected ? 'text-green-500' : 'text-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.title}
            className={`${stat.bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className={`${stat.iconColor} w-8 h-8`} />
              {stat.title === 'Connection' && (
                <motion.div
                  className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
                  animate={isConnected ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            
            <div>
              <motion.p
                className={`text-2xl font-bold ${stat.textColor} mb-1`}
                key={stat.value}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </motion.div>
        );
      })}
      
      {/* Last update indicator */}
      {lastUpdate && (
        <motion.div
          className="col-span-2 md:col-span-4 text-center text-sm text-gray-500 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Last updated: {lastUpdate.toLocaleTimeString()}
        </motion.div>
      )}
    </div>
  );
}