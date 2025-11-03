import React, { createContext, useContext, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

export type ToastType = "success" | "error" | "info";

interface IToast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = new Date().getTime();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Map our toast type to Bootstrap-compatible colors
  const getBgColor = (type: ToastType) => {
    switch (type) {
      case "error":
        return "danger";
      case "success":
        return "success";
      case "info":
      default:
        return "info";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            bg={getBgColor(t.type)}
            onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            show={true}
            delay={3000}
            autohide
            animation // Enables fade animation
          >
            <Toast.Body className="text-white fw-semibold">{t.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};
