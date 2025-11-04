import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Col, Row, Card } from "react-bootstrap";
import type { ICruiseInventory } from "../Services/CruiseService";
import type { ICruisePromotionPricing } from "../Services/CruisePromotionPricingService";
import CruisePromotionPricingService from "../Services/CruisePromotionPricingService";

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
  const [cruisePromotionPricing, setCruisePromotionPricing] = useState<
    ICruisePromotionPricing[]
  >([]);

  console.log("Agent Promotions inventory:", inventory);

  console.log("Agent Promotions inventory id:", inventory?.id);

  useEffect(() => {
    CruisePromotionPricingService.getByCruiseInventory(inventory?.id ?? 0)
      .then(setCruisePromotionPricing)
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
          <Modal.Title>{"Cruise Pricing Promotion"}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-4 py-3">
          {/* <Table
            hover
            responsive
            striped
            bordered
            className="align-middle text-center"
          >
            <thead className="table-light">
              <tr>
                <th>Departure Port</th>
                <th>Destination</th>
                <th>Sail Date</th>
                <th>Ship Code</th>
                <th>Cruise Line</th>
                <th>Commission Rate</th>
                <th>Single Price</th>
                <th>Double Price</th>
                <th>Triple Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {getDeparturePortName(inventory?.departurePortId ?? "")}
                </td>
                <td>{getDestinationName(inventory?.destinationId ?? "")}</td>
                <td>{dayjs(inventory?.sailDate).format("DD-MM-YYYY")}</td>
                <td>{inventory?.shipCode || "-"}</td>
                <td>{getCruiseLineName(inventory?.cruiseLineId ?? "")}</td>
                <td>{inventory?.commisionRate || "-"}</td>
                <td>{inventory?.singlePrice || "-"}</td>
                <td>{inventory?.doublePrice || "-"}</td>
                <td>{inventory?.triplePrice || "-"}</td>
                <td>{inventory?.triplePrice || "-"}</td>
              </tr>
            </tbody>
          </Table> */}

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

        {/* <Modal.Footer className="d-flex justify-content-end gap-2 px-4 py-3">
          <Button variant="outline-secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default AgentPromotions;
