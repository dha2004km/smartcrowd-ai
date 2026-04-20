"use client";

type Gate = {
  id: string;
  density: number;
  waitTime: number;
};

export function RecommendationsPanel({ gates }: { gates: Gate[] }) {
  const getRecommendations = () => {
    const recs = [];
    
    // Sort gates by density
    const sortedByDensity = [...gates].sort((a, b) => a.density - b.density);
    const lowestDensityGate = sortedByDensity[0];
    const highestDensityGate = sortedByDensity[sortedByDensity.length - 1];

    // Check for overcrowding
    if (highestDensityGate.density > 80) {
      recs.push({
        id: `overcrowded-${highestDensityGate.id}`,
        type: 'critical',
        icon: '⚠️',
        message: `Gate ${highestDensityGate.id} is overcrowded (${highestDensityGate.density.toFixed(0)}%). Redirect users to Gate ${lowestDensityGate.id}.`
      });
    } else if (highestDensityGate.density > 60) {
       recs.push({
        id: `warning-${highestDensityGate.id}`,
        type: 'warning',
        icon: '⚠️',
        message: `Gate ${highestDensityGate.id} congestion is increasing. Consider opening an additional entry lane.`
      });
    }

    // Sort by wait time
    const sortedByWaitTime = [...gates].sort((a, b) => a.waitTime - b.waitTime);
    const lowestWaitTimeGate = sortedByWaitTime[0];

    recs.push({
      id: `lowest-wait-${lowestWaitTimeGate.id}`,
      type: 'good',
      icon: '✅',
      message: `Gate ${lowestWaitTimeGate.id} has the lowest wait time (${lowestWaitTimeGate.waitTime.toFixed(0)} min). Recommend users to go there.`
    });

    return recs;
  };

  const recommendations = getRecommendations();

  return (
    <div className="glass-card recommendations-panel">
      <ul className="recommendations-list">
        {recommendations.map((rec) => (
          <li key={rec.id} className={`recommendation-item rec-${rec.type}`}>
            <span className="rec-icon">{rec.icon}</span>
            <span className="rec-text">{rec.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
