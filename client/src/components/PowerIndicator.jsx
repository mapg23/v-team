// import { useState } from "react";
import "../assets/PowerIndicator.css";

export default function PowerIndicator({ powerLevel = 70 }) {
  // Set color
  const getPowerColor = (level) => {
    if (level > 50) return "var(--col-green)";
    if (level > 25) return "var(--col-yellow)";
    return "var(--col-red)";
  };

  // Estimated range
  const estimatedRange = Math.floor(powerLevel * 0.7);

  return (
    <fieldset className="battery-card info">
      <legend className="battery-legend">Batterinivå</legend>
      <div className="power-indicator info">
        <div className="power-bar pill">
          <div
            className="indicator pill"
            style={{
              width: `${powerLevel}%`,
              backgroundColor: getPowerColor(powerLevel)
            }}
          />
        </div>
      </div>
      <h4>Räckvidd: <span>c:a {estimatedRange}</span>km</h4>
    </fieldset>
  );
}