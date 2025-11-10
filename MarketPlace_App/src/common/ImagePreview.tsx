import React, { useEffect, useCallback } from "react";
import { X } from "react-bootstrap-icons";

interface ImageLightboxProps {
  show: boolean;
  imageSrc: string | null;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ show, imageSrc, onClose }) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (show) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [show, handleKeyDown]);

  if (!show || !imageSrc) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)", // Dark backdrop
        zIndex: 9999, // High z-index to overlay everything
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.3s ease-in-out", // Optional fade-in
      }}
      onClick={(e) => {
        // Close on backdrop click (not image)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "none",
          border: "none",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 10000,
        }}
        onClick={onClose}
        aria-label="Close preview"
      >
        <X size={32} />
      </button>
      <img
        src={imageSrc}
        alt="Full Preview"
        style={{
          maxWidth: "95%",
          maxHeight: "95%",
          objectFit: "contain",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", // Subtle shadow
        }}
      />
    </div>
  );
};

export default ImageLightbox;