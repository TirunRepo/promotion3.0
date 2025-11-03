import React, { useState, useEffect } from "react";
import { Table, Button, Card, Row, Col } from "react-bootstrap";
import EditLineModal from "./EditLine";
import CruiseLineService, { type CruiseLine } from "../../Services/cruiseLines/CruiseLinesServices";
import CustomPagination from "../../../common/CustomPagination";
import LoadingOverlay from "../../../common/LoadingOverlay";
import { useToast } from "../../../common/Toaster";
import ConfirmationModal from "../../../common/ConfirmationModal";

const DEFAULT_PAGE_SIZE = 5;

const CruiseLineManager: React.FC = () => {
  const [lines, setLines] = useState<CruiseLine[]>([]);
  const [selectedLine, setSelectedLine] = useState<CruiseLine>({
    id: null,
    code: "",
    name: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [lineToDelete, setLineToDelete] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // ✅ Fetch cruise lines function
  const fetchLines = async () => {
    setLoading(true);
    try {
      const res = await CruiseLineService.getCruiseLines(currentPage, pageSize);
      setLines(res.data.data.items || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching cruise lines", error);
      showToast("Failed to fetch cruise lines", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cruise lines on page change or page size change
  useEffect(() => {
    fetchLines();
  }, [currentPage, pageSize]);

  // Add
  const handleAdd = () => {
    setSelectedLine({ id: null, code: "", name: "" });
    setModalVisible(true);
  };

  // Edit
  const handleEdit = (line: CruiseLine) => {
    setSelectedLine(line);
    setModalVisible(true);
  };

  // Delete
  const handleDelete = (id: number) => {
    setLineToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!lineToDelete) return;
    setLoading(true);
    try {
      await CruiseLineService.deleteCruiseLine(lineToDelete);
      showToast("Cruise line deleted successfully", "success");
      setCurrentPage(1); // reset to first page after delete
      fetchLines(); // Re-fetch lines after deletion
    } catch (error) {
      console.error("Error deleting cruise line", error);
      showToast("Failed to delete cruise line", "error");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setLineToDelete(null);
    }
  };

  // Save
  const handleSave = async (lineData: CruiseLine) => {
    setLoading(true);
    try {
      if (lineData.id) {
        await CruiseLineService.updateCruiseLine(lineData.id,lineData);
        showToast("Cruise line updated successfully", "success");
      } else {
        await CruiseLineService.addCruiseLine(lineData);
        showToast("Cruise line added successfully", "success");
      }
      // After save, refresh the lines and close modal
      setModalVisible(false);
      setCurrentPage(1); // reset to first page after save
      fetchLines(); // Re-fetch lines after save
    } catch (error) {
      console.error("Error saving cruise line", error);
      showToast("Failed to save cruise line", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <LoadingOverlay show={loading} />

      {/* Add Button */}
      <Row className="mb-3">
        <Col xs={12} md={3}>
          <Button variant="primary" onClick={handleAdd} className="w-100">
            Add Cruise Line
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <Row>
        <Col xs={12}>
          <Card className="p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>Cruise Lines</h4>
              <Button variant="outline-secondary" size="sm" onClick={fetchLines}>
                Refresh
              </Button>
            </div>

            <Table hover responsive striped bordered className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lines.length > 0 ? (
                  lines.map((line) => (
                    <tr key={line.id}>
                      <td>{line.code}</td>
                      <td>{line.name}</td>
                      <td className="text-center d-flex justify-content-center gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEdit(line)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(line.id!)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-muted">
                      No cruise lines found
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

      {/* Modals */}
      <EditLineModal
        show={modalVisible}
        onHide={() => setModalVisible(false)}
        lineData={selectedLine}
        onSave={handleSave}
      />

      <ConfirmationModal
        show={deleteModalVisible}
        title="Delete Cruise Line"
        message="Are you sure you want to delete this cruise line?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </div>
  );
};

export default CruiseLineManager;
