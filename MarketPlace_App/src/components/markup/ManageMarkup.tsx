import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Card, Col, Row } from "react-bootstrap";
import EditMarkup from "./EditMarkup";
import ConfirmationModal from "../../common/ConfirmationModal";
import CustomPagination from "../../common/CustomPagination";
import LoadingOverlay from "../../common/LoadingOverlay";
import { useToast } from "../../common/Toaster";
import MarkupService, {
  type IMarkupRequest,
} from "../Services/Markup/MarkupService";
import dayjs from "dayjs";

const DEFAULT_PAGE_SIZE = 5;

const ManageMarkup: React.FC = () => {
  const [markups, setMarkups] = useState<IMarkupRequest[]>([]);
  const [selectedMarkup, setSelectedMarkup] = useState<IMarkupRequest | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [markupToDelete, setMarkupToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  // Fetch markups
  const fetchMarkups = useCallback(
    async (page = currentPage, size = pageSize) => {
      setLoading(true);
      try {
        const response = await MarkupService.getAll(page, size);
        const data = response.data.data;
        setMarkups(data.items || []);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
        showToast("Failed to fetch markups.", "error");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize]
  );

  useEffect(() => {
    fetchMarkups();
  }, [fetchMarkups]);

  const handleAdd = () => {
    setSelectedMarkup(null);
    setModalVisible(true);
  };

  const handleEdit = (markup: IMarkupRequest) => {
    // console.log("edit markup", markup);
    setModalVisible(true);
    setSelectedMarkup(markup);
    setTimeout(() => setModalVisible(true), 0);
  };

  const handleDelete = (id: number) => {
    setMarkupToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!markupToDelete) return;
    setLoading(true);
    try {
      await MarkupService.delete(markupToDelete);
      showToast("Markup deleted successfully.", "success");
      fetchMarkups(1, pageSize);
    } catch (error) {
      console.error(error);
      showToast("Failed to delete markup.", "error");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setMarkupToDelete(null);
    }
  };

  // Save or Update Markup
  const handleSave = async (data: IMarkupRequest) => {
    setLoading(true);
    try {
      if (data.id) {
        // Update existing markup
        await MarkupService.update(data.id, data);
        showToast("Markup updated successfully.", "success");
      } else {
        // Create new markup
        await MarkupService.create(data);
        showToast("Markup added successfully.", "success");
      }
      setModalVisible(false);
      fetchMarkups(1, pageSize);
    } catch (error: any) {
      console.error(error);
      // Extract backend error message
      const errorMessage =
        error?.response?.data?.message || // Custom message from backend (APIResponse)
        error?.response?.data?.Message || // Some APIs use capital M
        error?.message || // Generic error message
        "Failed to save markup."; // Fallback message
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };
  // console.log("markups", markups);
  // console.log("selectedMarkup", selectedMarkup);

  return (
    <div>
      <LoadingOverlay show={loading} />

      <Row className="mb-3">
        <Col xs={12} md={3} className="d-flex gap-2">
          <Button variant="primary" onClick={handleAdd}>
            Add Markup
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => fetchMarkups(1, pageSize)}
          >
            Refresh
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Card className="p-4 shadow-sm">
            <Table hover responsive striped className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Inventory Id</th>
                  <th>Agent Name</th>
                  <th>Sail Date</th>
                  <th>Group ID</th>
                  <th>Category</th>
                  <th>Occupancy</th>
                  <th>Base Fare</th>
                  <th>Markup Mode</th>
                  <th>Markup Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {markups.length > 0 ? (
                  markups.map((m) => (
                    <tr key={m.id}>
                      <td>{m.inventoryId}</td>
                      <td> {m.agentName}</td>
                      <td> {dayjs(m.sailDate).format("DD/MM/YYYY")}</td>
                      <td>{m.groupId}</td>
                      <td>{m.categoryId}</td>
                      <td>{m.cabinOccupancy}</td>
                      <td>{m.baseFare}</td>
                      <td>{m.markupMode}</td>
                      <td>
                        {m.markupMode === "Percentage"
                          ? `${m.markUpPercentage}%`
                          : m.markUpFlatAmount}
                      </td>
                      <td className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEdit(m)}
                        >
                          Edit
                        </Button>
                        {m.id && (
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(m.id!)}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center text-muted">
                      No markups found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

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
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <EditMarkup
        show={modalVisible}
        onHide={() => {
          setModalVisible(false);
          setSelectedMarkup(null); // reset after close
        }}
        selectedMarkup={selectedMarkup}
        onSave={handleSave} // <-- This is the onSave prop
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        show={deleteModalVisible}
        title="Delete Markup"
        message="Are you sure you want to delete this markup?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </div>
  );
};

export default ManageMarkup;
