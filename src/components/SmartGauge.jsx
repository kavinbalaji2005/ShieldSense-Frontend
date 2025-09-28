import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function SmartGauge({
  label,
  value,
  max,
  unit = "",
  previousValue = null,
  thresholds = { low: 30, high: 70 },
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [trend, setTrend] = useState("stable");

  const numValue = Number(value) || 0;
  const percentage = Math.min(Math.max(numValue / max, 0), 1);

  // Determine color based on thresholds
  const getColor = (percent) => {
    const percentValue = percent * 100;
    if (percentValue < thresholds.low)
      return { primary: "#10b981", secondary: "#d1fae5" };
    if (percentValue < thresholds.high)
      return { primary: "#f59e0b", secondary: "#fef3c7" };
    return { primary: "#ef4444", secondary: "#fee2e2" };
  };

  const colors = getColor(percentage);

  // Calculate trend
  useEffect(() => {
    if (previousValue !== null) {
      const diff = numValue - previousValue;
      if (Math.abs(diff) < 0.1) setTrend("stable");
      else if (diff > 0) setTrend("up");
      else setTrend("down");
    }
  }, [numValue, previousValue]);

  // Animate number counting
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepValue = numValue / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setDisplayValue(stepValue * currentStep);

      if (currentStep >= steps) {
        setDisplayValue(numValue);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numValue]);

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - percentage * circumference;

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <motion.div
      className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      style={{
        background: `linear-gradient(135deg, ${colors.secondary}20 0%, white 100%)`,
      }}
    >
      <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
        {label}
      </h3>

      <div className="relative mb-4">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />

          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={colors.primary}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              filter: `drop-shadow(0 0 6px ${colors.primary}40)`,
            }}
          />

          {/* Glow effect */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={colors.primary}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            opacity="0.3"
            style={{
              filter: `blur(4px)`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold"
            style={{ color: colors.primary }}
            key={displayValue}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {displayValue.toFixed(1)}
          </motion.span>
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>

      {/* Value and trend */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-gray-600">
          {numValue.toFixed(1)} / {max} {unit}
        </span>
        <AnimatePresence>
          {previousValue !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`flex items-center gap-1 ${
                trend === "up"
                  ? "text-red-500"
                  : trend === "down"
                  ? "text-green-500"
                  : "text-gray-400"
              }`}
            >
              <TrendIcon size={12} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Percentage indicator */}
      <div className="mt-2 text-xs text-gray-500">
        {(percentage * 100).toFixed(0)}%
      </div>
    </motion.div>
  );
}
