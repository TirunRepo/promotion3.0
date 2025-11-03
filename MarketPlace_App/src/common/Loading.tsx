// src/common/LoadingPage.tsx
import React from "react";
import { Spinner } from "react-bootstrap";

interface LoadingPageProps {
  message?: string;
  fullscreen?: boolean;
}

const Loading: React.FC<LoadingPageProps> = ({
  message = "Loading your cruise experience...",
  fullscreen = true,
}) => {
  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center ${
        fullscreen ? "vh-100" : "py-5"
      }`}
      style={{
        background: "linear-gradient(135deg, #0066cc, #003366)",
        color: "white",
      }}
    >
      {/* Spinner */}
      <Spinner animation="border" role="status" variant="light" style={{ width: "4rem", height: "4rem" }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>

      {/* Message */}
      <h4 className="mt-3">{message}</h4>

      {/* Small hint for cruise theme */}
      <p style={{ fontStyle: "italic", opacity: 0.8 }}>
        Please wait while we prepare your dream cruise...
      </p>
    </div>
  );
};

export default Loading;
