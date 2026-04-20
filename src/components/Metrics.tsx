"use client";

type Gate = {
  id: string;
  density: number;
  waitTime: number;
};

export function Metrics({ gates }: { gates: Gate[] }) {
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
