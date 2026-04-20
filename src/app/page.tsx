"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Metrics } from "@/components/Metrics";
import { AiAssistant } from "@/components/AiAssistant";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";

const mockGates = [
  { id: "A", density: 85, waitTime: 15 },
  { id: "B", density: 40, waitTime: 5 },
  { id: "C", density: 92, waitTime: 22 },
  { id: "D", density: 20, waitTime: 2 },
];

export default function Dashboard() {
  const router = useRouter();
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

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="dashboard-container">
      <div className="header-row">
        <div>
          <h1>SmartCrowd AI Dashboard</h1>
          <p className="subtitle">Real-time stadium intelligence & recommendations</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-main">
        <h2>Live Gate Metrics</h2>
        <Metrics gates={gates} />
      </div>

      <div className="dashboard-sidebar">
        <h2>🤖 AI Recommendations</h2>
        <RecommendationsPanel gates={gates} />
        
        <h2 style={{ marginTop: '2rem' }}>AI Assistant</h2>
        <AiAssistant />
      </div>
    </div>
  );
}
