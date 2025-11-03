import React, { useEffect, useState } from "react";
import type {
  ICabinDetails,
  IManualCabinDetails,
} from "../Services/CruiseService";
import { Modal, Button, Form, Card, Col, Row } from "react-bootstrap";
import CruiseService from "../Services/CruiseService";

interface DeleteCabinProps {
  show: boolean;
  onHide: () => void;
  inventoryId: number;
  onSave: (data: ICabinDetails, id: number) => void;
  role?: string;
}

const DeleteCabin: React.FC<DeleteCabinProps> = ({
  show,
  onHide,
  inventoryId,
  onSave,
}) => {
  const [cabinType, setCabinType] = useState<string>("GTY");
  const [cabinNo, setCabinNo] = useState<string>("");
  const [manualCabins, setManualCabins] = useState<IManualCabinDetails[]>([]);

  const onSaveClick = () => {
    var cabin: ICabinDetails = {
      cabinType: cabinType,
      cabinNo: cabinNo,
      cabinOccupancy: "",
      isRemoveCabin: true,
    };
    onSave(cabin, inventoryId);
  };

  useEffect(() => {
    if (cabinType === "Manual" && inventoryId) {
      CruiseService.getManualInventory(inventoryId)
        .then((res) => {
          // For Axios-style responses
          if (res.data.data) {
            setManualCabins(res.data.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [cabinType, inventoryId]);

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>Delete Cabin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Cabin</h5>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group controlId="cabinType">
                    <Form.Label>Cabin Type</Form.Label>
                    <Form.Select
                      value={cabinType}
                      onChange={(e) => setCabinType(e.target.value)}
                    >
                      <option value="GTY">GTY</option>
                      <option value="Manual">Manual</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="cabinNo">
                    <Form.Label>Cabin Number</Form.Label>
                    {cabinType === "Manual" ? (
                      <>
                        <Form.Select
                          value={cabinNo}
                          onChange={(e) => setCabinNo(e.target.value)}
                        >
                          <option value="">-- Select Cabin --</option>
                          {manualCabins.map((cabin) => (
                            <option key={cabin.id} value={cabin.value}>
                              {cabin.name}
                            </option>
                          ))}
                        </Form.Select>
                      </>
                    ) : (
                      <>
                        <Form.Control
                          type="text"
                          value={cabinNo}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only numbers (0–9)
                            if (/^\d*$/.test(value)) {
                              setCabinNo(value);
                            }
                          }}
                        />
                      </>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSaveClick}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCabin;
