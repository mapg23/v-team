import { randomUUID } from "crypto";
async function forwardToMain(data) {
  try {
    await fetch('http://localhost:9091/telemetry', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bikes: data }),
    });
  } catch (err) {
    console.error("Failed to start telemetry");
  }
}

export { forwardToMain };