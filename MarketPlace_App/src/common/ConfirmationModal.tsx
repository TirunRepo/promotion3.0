import React from "react";
import { Modal, Button } from "react-bootstrap";

interface ConfirmationModalProps {
  show: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  title = "Confirm",
  message = "Are you sure?",
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
