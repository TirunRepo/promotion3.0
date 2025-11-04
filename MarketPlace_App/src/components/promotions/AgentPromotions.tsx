import React, { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import type { ICruiseInventory } from "../Services/CruiseService";
import dayjs from "dayjs";
import type { IIdNameModel } from "../../common/IIdNameModel";
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
  const [destinations, setDestinations] = useState<IIdNameModel<number>[]>([]);
  const [departurePorts, setDeparturePorts] = useState<IIdNameModel<number>[]>(
    []
  );
  const [cruiseLines, setCruiseLines] = useState<IIdNameModel<number>[]>([]);

  console.log("Agent Promotions inventory:", inventory);

  useEffect(() => {
    CruiseService.getDestinations()
      .then((res) => res.data.data && setDestinations(res.data.data))
      .catch(console.error);

    CruiseService.getCruiseLines()
      .then((res) => res.data.data && setCruiseLines(res.data.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (destinations.length) {
      const fetchAllPorts = async () => {
        const portsArray: IIdNameModel<number>[] = [];
        for (const dest of destinations) {
          try {
            const res = await CruiseService.getPorts(dest.id);
            if (res.data.data) portsArray.push(...res.data.data);
          } catch {
            // ignore
          }
        }
        setDeparturePorts(portsArray);
      };
      fetchAllPorts();
    }
  }, [destinations]);

  // Helper to get names by ID
  const getDestinationName = (id: number | string) =>
    destinations.find((d) => d.id === Number(id))?.name || "-";
  const getDeparturePortName = (id: number | string) =>
    departurePorts.find((p) => p.id === Number(id))?.name || "-";
  const getCruiseLineName = (id: number | string) =>
    cruiseLines.find((c) => c.id === Number(id))?.name || "-";

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
          <Table
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
              </tr>
            </tbody>
          </Table>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-end gap-2 px-4 py-3">
          <Button variant="outline-secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AgentPromotions;
