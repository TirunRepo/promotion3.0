import React from "react";
import { Spinner } from "react-bootstrap";

interface LoadingOverlayProps {
  show: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255,255,255,0.7)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spinner animation="border" variant="primary" role="status" />
      <span className="ms-2">Loading...</span>
    </div>
  );
};

export default LoadingOverlay;
