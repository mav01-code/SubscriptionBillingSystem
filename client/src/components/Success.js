import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Success = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      fetch("http://localhost:3001/store-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setStatus("Subscription recorded successfully! 🎉");
        })
        .catch((err) => {
          console.error("Error saving plan:", err);
          setStatus("Failed to save subscription. Please contact support.");
        });
    } else {
      setStatus("Session ID not found. Redirecting...");
    }
  }, [searchParams]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{status}</h1>
    </div>
  );
};

export default Success;
