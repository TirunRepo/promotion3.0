import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Col, Row, Card } from "react-bootstrap";
import type {
  ICruiseInventory,
  ICruisePricing,
} from "../Services/CruiseService";
import type { ICruisePromotionPricing } from "../Services/CruisePromotionPricingService";
import CruisePromotionPricingService from "../Services/CruisePromotionPricingService";
import CruiseService from "../Services/CruiseService";

interface AgentPromotionProps {
  show: boolean;
  onHide: () => void;
  inventory?: ICruiseInventory | null;
}

const AgentPromotions: React.FC<AgentPromotionProps> = ({
  show,
  onHide,
  inventory,
}) => {
  const [cruisePricing, setCruisePricing] = useState<ICruisePricing[]>([]);

  const [cruisePromotionPricing, setCruisePromotionPricing] = useState<
    ICruisePromotionPricing[]
  >([]);

  useEffect(() => {
    if (!inventory?.id) return;

    CruisePromotionPricingService.getByCruiseInventory(inventory.id)
      .then(setCruisePromotionPricing)
      .catch(console.error);

    CruiseService.getByCruiseInventoryId(inventory.id)
      .then((res) => setCruisePricing(res.data.data))
      .catch(console.error);
  }, [inventory]);

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{"Cruise Pricing  Promotion"}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-4 py-3">
          <Row className="mb-3" style={{ gap: "10px" }}>
            <Col xs="auto">
              <Button variant="primary" onClick={() => {}}>
                Add Promotion
              </Button>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Card className="p-4 shadow-sm">
                <Table
                  hover
                  responsive
                  striped
                  bordered
                  className="align-middle text-center"
                >
                  <thead className="table-light">
                    <tr>
                      <th>Promo ID</th>
                      <th>Cruisise Inventory ID</th>
                      <th>Single Price</th>
                      <th>Double Price</th>
                      <th>Triple Price</th>
                      <th>Total Price</th>
                      <th style={{ minWidth: "140px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cruisePromotionPricing.length ? (
                      cruisePromotionPricing.map((item) => (
                        <tr key={item.id ?? JSON.stringify(item)}>
                          <td>{item.promotionId}</td>
                          <td>{item.cruiseInventoryId}</td>
                          <td>{item.singlePrice}</td>
                          <td>{item.doublePrice}</td>
                          <td>{item.triplePrice}</td>
                          <td>{item.totalPrice}</td>
                          <td className="d-flex justify-content-center gap-2">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => {}}
                            >
                              Edit
                            </Button>
                            <>
                              <Button size="sm" variant="outline-danger">
                                Delete
                              </Button>
                            </>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={12}
                          className="text-center text-muted py-4"
                        >
                          No promotions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AgentPromotions;
