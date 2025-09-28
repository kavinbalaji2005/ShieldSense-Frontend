import React from 'react';
import { motion } from 'framer-motion';

export function GaugeSkeleton() {
  return (
    <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl">
      <motion.div
        className="h-4 bg-gray-200 rounded w-24 mb-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="h-32 w-32 bg-gray-200 rounded-full mb-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="h-3 bg-gray-200 rounded w-16"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
}

export function CardSkeleton({ className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <motion.div
        className="h-6 bg-gray-200 rounded w-32 mb-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="space-y-3"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      >
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </motion.div>
    </div>
  );
}