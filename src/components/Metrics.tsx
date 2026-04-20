"use client";

import { useState, useEffect } from "react";

const mockGates = [
  { id: "A", density: 85, waitTime: 15 },
  { id: "B", density: 40, waitTime: 5 },
  { id: "C", density: 92, waitTime: 22 },
  { id: "D", density: 20, waitTime: 2 },
];

export function Metrics() {
  const [gates, setGates] = useState(mockGates);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGates(prev => 
        prev.map(gate => ({
          ...gate,
          density: Math.min(100, Math.max(0, gate.density + (Math.random() * 10 - 5))),
          waitTime: Math.max(0, gate.waitTime + (Math.random() * 4 - 2))
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (density: number) => {
    if (density > 80) return "status-critical";
    if (density > 50) return "status-warning";
    return "status-good";
  };

  return (
    <div className="metrics-grid">
      {gates.map((gate) => (
        <div key={gate.id} className="glass-card metric-card">
          <div className="metric-header">
            <h3>Gate {gate.id}</h3>
            <span className={`status-indicator ${getStatusColor(gate.density)}`}></span>
          </div>
          <div className="metric-body">
            <div className="metric-stat">
              <span className="label">Density</span>
              <span className="value">{gate.density.toFixed(0)}%</span>
            </div>
            <div className="metric-stat">
              <span className="label">Wait Time</span>
              <span className="value">{gate.waitTime.toFixed(0)} min</span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div 
              className={`progress-bar ${getStatusColor(gate.density)}`}
              style={{ width: `${Math.min(100, Math.max(0, gate.density))}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
