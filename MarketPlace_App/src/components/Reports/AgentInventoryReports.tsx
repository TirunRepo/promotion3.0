import React, { useEffect, useState } from "react";
import { Table, Card, Row, Col, Form, Button } from "react-bootstrap";
import CustomPagination from "../../common/CustomPagination";
import LoadingOverlay from "../../common/LoadingOverlay";
import { useToast } from "../../common/Toaster";
import AuthService, { type IGetRegisterUser } from "../Services/AuthService"; // to get agents
import CruiseService, {
  type IAgentInventoryReport,
} from "../Services/CruiseService";
import dayjs from "dayjs";

const DEFAULT_PAGE_SIZE = 5;

const AgentInventoryReportPage: React.FC = () => {
  const [agents, setAgents] = useState<IGetRegisterUser[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [reportData, setReportData] = useState<IAgentInventoryReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  // Initial load (get agents)
  useEffect(() => {
    fetchAgents();
  }, []);

  //  Re-fetch report when page changes
  useEffect(() => {
    if (selectedAgentId) {
      fetchAgentReport();
    }
  }, [currentPage, pageSize, selectedAgentId]);

  // Fetch all users (to populate the dropdown)
  const fetchAgents = async () => {
    try {
      const res = await AuthService.getUserRegister(1, 100, "Agent"); // fetch agents only
      setAgents(res.data.data.items || []);
    } catch (err) {
      console.error("Error fetching agents", err);
      showToast("Failed to fetch agents", "error");
    }
  };

  //  Fetch inventory report for selected agent
  const fetchAgentReport = async () => {
    if (!selectedAgentId) return;
    setLoading(true);

    try {
      const res = await CruiseService.getAgentInventoryReport(
        selectedAgentId,
        currentPage,
        pageSize
      );

      const responseData = res?.data;

      if (responseData && responseData.data) {
        setReportData(responseData.data?.items || []);
        setTotalPages(responseData.data?.totalPages || 1);
      } else {
        showToast(responseData?.message || "No inventory found", "error");
        setReportData([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error("Error fetching agent report:", err);
      showToast(
        err?.response?.data?.message ||
          "Failed to load inventory report. Please try again.",
        "error"
      );
      setReportData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <LoadingOverlay show={loading} />
      <Card className="p-4 shadow-sm">
        <Row className="align-items-center mb-4">
          <Col lg={3} md={4} xs={12}>
            <h4>Agent Inventory Reports</h4>
          </Col>
          <Col lg={5} md={6} xs={12}>
            <Form.Select
              value={selectedAgentId ?? ""}
              onChange={(e) => {
                console.log(e.target.value);
                setSelectedAgentId(Number(e.target.value) || null);
                setCurrentPage(1);
              }}
            >
              <option value="">Select Agent</option>
              {agents.map((agent) => (
                <option key={agent?.id as any} value={agent?.id as any}>
                  {agent?.companyName}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col lg={4} md={2} xs={12} className="text-end">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={fetchAgentReport}
              disabled={!selectedAgentId}
            >
              Refresh
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Table hover responsive striped bordered className="align-middle">
          <thead className="table-light">
            <tr>
              <th>Sail Date</th>
              <th>ShipCode</th>
              <th>Group ID</th>
              <th>Category ID</th>
              <th>Total</th>
              <th>Hold</th>
              <th>Available</th>
              <th>Base Price</th>
               <th>Markup Mode</th>
                <th>Markup Value</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((item) => (
                <tr key={item.id}>
                  <td>{dayjs(item.sailDate).format("DD/MM/YYYY")}</td>
                  <td>{item.shipCode}</td>
                  <td>{item.groupId}</td>
                  <td>{item.categoryId}</td>
                  <td>{item.totalCabins}</td>
                  <td>{item.holdCabins}</td>
                  <td>{item.availableCabins}</td>
                  <td>{item.baseFare}</td>
                  <td>{item.markupMode}</td>
                   <td>
                        {item.markupMode === "Percentage"
                          ? `${item.markUpPercentage}%`
                          : item.markUpFlatAmount}
                      </td>
                  {/* <td>{item.markupPrice}</td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center text-muted">
                  {selectedAgentId
                    ? "No inventory found for this agent."
                    : "Please select an agent to view report."}
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {reportData.length > 0 && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default AgentInventoryReportPage;
