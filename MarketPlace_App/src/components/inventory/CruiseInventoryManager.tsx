import React, { useEffect, useState } from "react";
import { Row, Col, Button, Card, Table, Form } from "react-bootstrap";
import EditInventory from "./EditInventory";
import CruiseService, {
  type ICruiseInventory,
  type ICabinDetails,
  type ICruisePricing,
} from "../Services/CruiseService";
import CustomPagination from "../../common/CustomPagination";
import LoadingOverlay from "../../common/LoadingOverlay";
import { useToast } from "../../common/Toaster";
import ConfirmationModal from "../../common/ConfirmationModal";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import type { IIdNameModel } from "../../common/IIdNameModel";
import DeleteCabin from "./DeleteCabin";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import AgentPromotions from "../promotions/AgentPromotions";
import type { IPromotionResponse } from "../Services/Promotions/PromotionService";
import PromotionService from "../Services/Promotions/PromotionService";
import CruiseShipsService, {
  type ICruiseShip,
} from "../Services/cruiseShips/CruiseShipsService";

const CruiseInventoryManager: React.FC = () => {
  const [inventories, setInventories] = useState<ICruiseInventory[]>([]);
  const [selectedInventory, setSelectedInventory] =
    useState<ICruiseInventory | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalShowDelete, setModalShowDelete] = useState(false);
  const [agentModelVisible, setAgentModalVisible] = useState(false);
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState<number | null>(
    null
  );

  const { showToast } = useToast();

  // New states for names
  const [destinations, setDestinations] = useState<IIdNameModel<number>[]>([]);

  const [departurePorts, setDeparturePorts] = useState<IIdNameModel<number>[]>(
    []
  );

  const [cruiseLines, setCruiseLines] = useState<IIdNameModel<number>[]>([]);
  const [promotions, setPromotions] = useState<IPromotionResponse[]>([]);
  const [cruiseShips, setCruiseShips] = useState<ICruiseShip[]>([]);
  // Fetch inventories
  const fetchInventories = async (page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      const res = await CruiseService.getInventory(page, size);
      // console.log(res.data, "responceData");
      const paged = res.data;
      setInventories(paged.items || []);
      setCurrentPage(paged.currentPage || 1);
      setTotalPages(paged.totalPages || 1);
    } catch (err) {
      console.error("Error fetching inventories:", err);
      showToast("Failed to fetch inventories", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch destinations, cruise lines
  useEffect(() => {
    CruiseService.getDestinations()
      .then((res) => res.data.data && setDestinations(res.data.data))
      .catch(console.error);

    CruiseService.getCruiseLines()
      .then((res) => res.data.data && setCruiseLines(res.data.data))
      .catch(console.error);

    PromotionService.getAllPromotions()
      .then((res) => res.data.data && setPromotions(res.data.data))
      .catch(console.error);

    CruiseShipsService.getAllShips()
      .then((res) => res.data.data && setCruiseShips(res.data.data))
      .catch(console.error);
  }, []);

  // console.log("promotions", promotions);

  // Fetch inventories on page change
  useEffect(() => {
    fetchInventories(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // ✅ Handle save (Inventory -> Pricing -> Cabins sequentially)
  const handleSave = async (inventory: ICruiseInventory) => {
    setLoading(true);
    try {
      let savedInventory: ICruiseInventory | null = null;

      // 1️⃣ Inventory
      if (inventory.id) {
        const invRes = await CruiseService.updateCruiseInventory(
          inventory.id,
          inventory
        );
        savedInventory = invRes.data;
      } else {
        const invRes = await CruiseService.saveCruiseInventory(inventory);
        savedInventory = invRes.data;
      }

      if (!savedInventory?.id)
        throw new Error("Failed to save Cruise Inventory");

      // 2️⃣ Pricing
      const pricingPayload: ICruisePricing = {
        cruiseInventoryId: savedInventory.id,
        commisionRate: inventory.commisionRate,
        singlePrice: inventory.singlePrice,
        doublePrice: inventory.doublePrice,
        triplePrice: inventory.triplePrice,
        nccf: inventory.nccf,
        tax: inventory.tax,
        grats: inventory.grats,
        currencyType: inventory.currencyType,
        pricingType: inventory.pricingType,
        cabinOccupancy: inventory.cabinOccupancy,
        totalPrice: inventory.totalPrice,
      };

      if (pricingPayload.pricingType) {
        if (inventory.id) {
          await CruiseService.updateCruisePricing(
            savedInventory.id,
            pricingPayload
          );
        } else {
          await CruiseService.saveCruisePricing(pricingPayload);
        }
      }

      // 3️⃣ Cabins
      if (inventory.cabinDetails?.length) {
        const cabinsPayload = inventory.cabinDetails.map(
          (c: ICabinDetails) => ({
            ...c,
            cruiseInventoryId: savedInventory.id,
          })
        );

        if (inventory.id) {
          await CruiseService.updateCruiseCabins(
            savedInventory.id,
            cabinsPayload
          );
        } else {
          await CruiseService.saveCruiseCabins(cabinsPayload);
        }
      }

      // ✅ Success
      if (inventory.id) {
        showToast(
          "Cruise inventory, pricing & cabins saved successfully",
          "success"
        );
      } else {
        showToast(
          "Cruise inventory, pricing & cabins udpate successfully",
          "success"
        );
      }
      fetchInventories(currentPage, pageSize);
      setModalShow(false);
    } catch (err) {
      console.error("Error saving inventory:", err);
      showToast("Error saving inventory", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCabin = async (data: ICabinDetails, id: number) => {
    setLoading(true);
    try {
      await CruiseService.deleteCabin(data, id);
      showToast("Cabins deleted successfully", "success");
      setModalShowDelete(false);
      // Refetch only the current inventory
      const res = await CruiseService.getInventory(currentPage, pageSize);
      // console.log(res.data, "responceDatass");
      setSelectedInventory(res.data.items?.find((i) => i.id === id) || null);
      // setModalShow(false);
      // fetchInventories(currentPage, pageSize);
    } catch (err) {
      console.error("Error deleting Cabins:", err);
      showToast("Error deleting Cabins", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    if (!inventoryToDelete) return;
    setLoading(true);
    try {
      await CruiseService.deleteInventory(inventoryToDelete);
      showToast("Inventory deleted successfully", "success");
      fetchInventories(currentPage, pageSize);
    } catch (err) {
      console.error("Error deleting inventory:", err);
      showToast("Error deleting inventory", "error");
    } finally {
      setLoading(false);
      setDeleteModal(false);
      setInventoryToDelete(null);
    }
  };

  const handleDelete = (id: number) => {
    setInventoryToDelete(id);
    setDeleteModal(true);
  };

  const emptyInventory = (): ICruiseInventory => ({
    sailDate: "",
    groupId: "",
    nights: "",
    package: "",
    destinationId: "",
    departurePortId: "",
    cruiseLineId: 0,
    cruiseShipId: 0,
    shipCode: "",
    categoryId: "",
    stateroom: "",
    cabinOccupancy: "",
    deck: "",
    currencyType: "",
    pricingType: "",
    commisionRate: null,
    singlePrice: null,
    doublePrice: null,
    triplePrice: null,
    nccf: null,
    tax: null,
    grats: null,
    cabinDetails: [],
    enableAgent: false,
    enableAdmin: false,
    commisionSingleRate: null,
    commisionDoubleRate: null,
    commisionTripleRate: null,
    totalPrice: null,
  });

  // Helper to get names by ID
  const getDestinationName = (id: number | string) =>
    destinations.find((d) => d.id === Number(id))?.name || "-";
  const getDeparturePortName = (id: number | string) =>
    departurePorts.find((p) => p.id === Number(id))?.name || "-";
  const getCruiseLineName = (id: number | string) =>
    cruiseLines.find((c) => c.id === Number(id))?.name || "-";
  const getCruiseShipName = (id: number) =>
    cruiseShips.find((c) => c.id === Number(id))?.name || "-";

  // Fetch departure ports for all destinations
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

  return (
    <div className="mt-4">
      <LoadingOverlay show={loading} />

      {user?.role !== "Admin" && (
        <Row className="mb-3" style={{ gap: "10px" }}>
          <Col xs="auto">
            <Button
              variant="primary"
              onClick={() => {
                setSelectedInventory(emptyInventory());
                setModalShow(true);
              }}
            >
              Add Inventory
            </Button>
          </Col>
        </Row>
      )}

      <Row>
        <Col xs={12}>
          <Card className="p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-4 text-center">Cruise Inventory List</h4>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => fetchInventories()}
              >
                Refresh
              </Button>
            </div>
            <Table
              hover
              responsive
              striped
              bordered
              className="align-middle text-center"
            >
              <thead className="table-light">
                <tr>
                  <th>Destination</th>
                  <th>Departure Port</th>

                  <th>Sail Date</th>

                  <th>Cruise Line</th>
                  <th>Ship Name</th>
                  {/* <th>Commission Rate</th> */}
                  <th>Single Price</th>
                  <th>Double Price</th>
                  <th>Triple Price</th>
                  <th>Total Price</th>
                  <th>Promotions Applied</th>
                  <th style={{ minWidth: "140px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventories.length ? (
                  inventories.map((inv) => (
                    <tr key={inv.id ?? JSON.stringify(inv)}>
                      <td>{getDestinationName(inv.destinationId)}</td>
                      <td>{getDeparturePortName(inv.departurePortId)}</td>
                      <td>
                        {inv.sailDate
                          ? dayjs(inv.sailDate).format("DD/MM/YYYY")
                          : "-"}
                      </td>

                      <td>{getCruiseLineName(inv.cruiseLineId)}</td>
                      <td>{getCruiseShipName(inv.cruiseShipId)}</td>
                      {/* <td>{`${inv.currencyType || "-"} ${
                        inv.commisionRate ?? "-"
                      }`}</td> */}
                      <td>{`${inv.currencyType || "-"} ${
                        inv.singlePrice ?? "-"
                      }`}</td>
                      <td>{`${inv.currencyType || "-"} ${
                        inv.doublePrice ?? "-"
                      }`}</td>
                      <td>{`${inv.currencyType || "-"} ${
                        inv.triplePrice ?? "-"
                      }`}</td>
                      <td>{`${inv.currencyType || "-"} ${
                        inv.totalPrice ?? "-"
                      }`}</td>
                      <td>{`${inv.appliedPromotionCount || "0"}`}</td>
                      <td className="d-flex justify-content-center gap-2">
                        {user?.role === "Agent" && (
                          <>
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="tooltip-enable-agent">
                                  {"Promotions Applied"}
                                </Tooltip>
                              }
                            >
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => {
                                  setAgentModalVisible(true);
                                  setSelectedInventory(inv);
                                }}
                              >
                                Promotion
                              </Button>
                            </OverlayTrigger>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => {
                            setSelectedInventory({
                              ...inv,
                              nights: inv.nights?.toString() ?? "",
                              deck: inv.deck?.toString() ?? "",
                              destinationId:
                                inv.destinationId?.toString() ?? "",
                              departurePortId:
                                inv.departurePortId?.toString() ?? "",
                            });
                            setModalShow(true);
                          }}
                        >
                          {user?.role === "Admin" ? "View" : "Edit"}
                        </Button>
                        {user?.role !== "Admin" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => inv.id && handleDelete(inv.id)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                        {user?.role === "Admin" && (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-enable-agent">
                                {inv?.enableAgent ? "Disable" : "Enable"}
                              </Tooltip>
                            }
                          >
                            <Form.Check
                              type="switch"
                              name="enableAgent"
                              checked={inv.enableAgent || false}
                              onChange={async (e) => {
                                const value = e.target.checked;
                                if (inv?.id) {
                                  try {
                                    await CruiseService.updateInventory({
                                      id: inv.id,
                                      userRole: "agent",
                                      enableAdmin: false,
                                      enableAgent: value,
                                    });
                                    showToast(
                                      "Status updated successfully",
                                      "success"
                                    );
                                    fetchInventories();
                                  } catch (err) {
                                    console.error("Failed to update role", err);
                                  }
                                }
                              }}
                            />
                          </OverlayTrigger>
                        )}
                        {user?.role === "Agent" && (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-enable-agent">
                                {inv?.enableAdmin
                                  ? "Disable for Admin"
                                  : "Enable for Admin"}
                              </Tooltip>
                            }
                          >
                            <Form.Check
                              type="switch"
                              name="enableAdmin"
                              checked={inv.enableAdmin || false}
                              onChange={async (e) => {
                                const value = e.target.checked;

                                if (inv?.id) {
                                  try {
                                    await CruiseService.updateInventory({
                                      id: inv.id,
                                      userRole: "admin",
                                      enableAdmin: value,
                                      enableAgent: false,
                                    });
                                    showToast(
                                      "Status updated successfully",
                                      "success"
                                    );
                                    fetchInventories();
                                  } catch (err) {
                                    console.error("Failed to update role", err);
                                  }
                                }
                              }}
                            />
                          </OverlayTrigger>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="text-center text-muted py-4">
                      No inventory found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </Card>
        </Col>
      </Row>

      {agentModelVisible && selectedInventory && (
        <AgentPromotions
          show={agentModelVisible}
          onHide={() => setAgentModalVisible(false)}
          inventory={selectedInventory}
          allPromotions={promotions}
        />
      )}

      {/* Edit / Add Modal */}
      {modalShow && selectedInventory && (
        <EditInventory
          role={user?.role}
          inventory={selectedInventory}
          show={modalShow}
          onHide={() => setModalShow(false)}
          onSave={handleSave}
          setSelectedInventory={setSelectedInventory}
          setModalShowDelete={setModalShowDelete}
        />
      )}

      {modalShowDelete && selectedInventory && (
        <DeleteCabin
          role={user?.role}
          inventoryId={selectedInventory.id ?? 0}
          show={modalShowDelete}
          onHide={() => {
            setModalShowDelete(false);
            // setModalShow(false);
          }}
          onSave={handleDeleteCabin}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        show={deleteModal}
        onCancel={() => setDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this inventory?"
      />
    </div>
  );
};

export default CruiseInventoryManager;
