"use client";

import { useRouter } from "next/navigation";
import { Metrics } from "@/components/Metrics";
import { AiAssistant } from "@/components/AiAssistant";

export default function Dashboard() {
  const router = useRouter();

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
        <Metrics />
      </div>

      <div className="dashboard-sidebar">
        <h2>AI Recommendations</h2>
        <AiAssistant />
      </div>
    </div>
  );
}
