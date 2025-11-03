import React, { useEffect, useState, useCallback } from "react";
import { Card, Table, Button, Col, Row } from "react-bootstrap";
import CruiseDestinationService, {
  type Destination,
} from "../../Services/cruiseDestination/CruiseDestinationService";
import EditCruiseDestination from "./EditCruiseDestination";
import CustomPagination from "../../../common/CustomPagination";
import LoadingOverlay from "../../../common/LoadingOverlay";
import { useToast } from "../../../common/Toaster";
import ConfirmationModal from "../../../common/ConfirmationModal";

const DEFAULT_PAGE_SIZE = 5;

const CruiseDestinationManager: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination>({
    code: "",
    name: "",
  });

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [destinationToDelete, setDestinationToDelete] = useState<number | null>(null);

  const { showToast } = useToast();

  // Fetch destinations
  const fetchDestinations = useCallback(async (page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      const response = await CruiseDestinationService.getAll(page, size);
      const data = response.data;
      setDestinations(data.data.items || []);
      setCurrentPage(data.data.currentPage || 1);
      setTotalPages(data.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch destinations:", error);
      showToast("Failed to fetch destinations", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchDestinations(currentPage, pageSize);
  }, [currentPage, pageSize, fetchDestinations]);

  // Add/Edit handler
  const handleAdd = () => {
    setSelectedDestination({ code: "", name: "" });
    setModalVisible(true);
  };

  const handleEdit = (destination: Destination) => {
    setSelectedDestination(destination);
    setModalVisible(true);
  };

  // Delete handler
  const handleDelete = (id: number) => {
    setDestinationToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!destinationToDelete) return;
    setLoading(true);
    try {
      await CruiseDestinationService.delete(destinationToDelete);
      showToast("Destination deleted successfully", "success");
      fetchDestinations(1, pageSize);
    } catch (error) {
      console.error("Failed to delete destination:", error);
      showToast("Failed to delete destination", "error");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setDestinationToDelete(null);
    }
  };

  // Save handler
  const handleSave = async (destination: Destination) => {
    setLoading(true);
    try {
      if (destination.id) {
        await CruiseDestinationService.update(destination.id, destination);
        showToast("Destination updated successfully", "success");
      } else {
        await CruiseDestinationService.add(destination);
        showToast("Destination added successfully", "success");
      }
      setModalVisible(false);
      fetchDestinations(1, pageSize);
    } catch (error) {
      console.error("Failed to save destination:", error);
      showToast("Failed to save destination", "error");
    } finally {
      setLoading(false);
    }
  };

  // Refresh handler
  const handleRefresh = () => {
    fetchDestinations(currentPage, pageSize);
  };

  return (
    <div className="mt-4">
      <LoadingOverlay show={loading} />

      {/* Top Controls */}
      <Row className="mb-3 align-items-center">
        <Col xs={12} md={3} className="mb-2 mb-md-0">
          <Button variant="primary" onClick={handleAdd} className="w-100">
            Add Destination
          </Button>
        </Col>
      </Row>

      {/* Destination Table */}
      <Row>
        <Col xs={12}>
          <Card className="p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-4 text-center">Cruise Destinations</h4>
              <Button variant="outline-secondary" size="sm" onClick={handleRefresh}>
                Refresh
              </Button>
            </div>
            <Table hover responsive striped bordered className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Destination Name</th>
                  <th>Destination Code</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.length > 0 ? (
                  destinations.map((d) => (
                    <tr key={d.id}>
                      <td>{d.name}</td>
                      <td>{d.code}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button size="sm" variant="outline-primary" onClick={() => handleEdit(d)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="outline-danger" onClick={() => handleDelete(d.id!)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-muted">
                      No destinations found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Pagination */}
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

      {/* Modals */}
      <EditCruiseDestination
        show={modalVisible}
        onHide={() => setModalVisible(false)}
        onSave={handleSave}
        destination={selectedDestination}
      />

      <ConfirmationModal
        show={deleteModalVisible}
        title="Delete Destination"
        message="Are you sure you want to delete this destination?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </div>
  );
};

export default CruiseDestinationManager;
