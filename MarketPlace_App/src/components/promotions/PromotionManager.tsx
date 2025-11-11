import React, { useState, useEffect } from "react";
import { Table, Button, Card, Row, Col } from "react-bootstrap";
import ConfirmationModal from "../../common/ConfirmationModal";
import CustomPagination from "../../common/CustomPagination";
import LoadingOverlay from "../../common/LoadingOverlay";
import { useToast } from "../../common/Toaster";
import PromotionService, { type IPromotionResponse } from "../Services/Promotions/PromotionService";
import EditPromotionModal from "./EditPromotionModal";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_PAGE_SIZE = 5;

const PromotionManager: React.FC = () => {
  const [promotions, setPromotions] = useState<IPromotionResponse[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<IPromotionResponse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<number | null>(null);
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();


  // Fetch promotions
  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await PromotionService.getAllPromotions();
      const items = res.data.data || [];
      setPromotions(items);
      setTotalPages(Math.ceil(items.length / pageSize));
    } catch (error) {
      console.error("Error fetching promotions", error);
      showToast("Failed to fetch promotions", "error");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPromotions();
  }, [currentPage, pageSize]);

  // Add
  const handleAdd = () => {
    setSelectedPromotion(null);
    setModalVisible(true);
  };


  const handleDeleteConfirm = async () => {
    if (!promotionToDelete) return;
    setLoading(true);
    try {
      await PromotionService.deletePromotion(promotionToDelete);
      showToast("Promotion deleted successfully", "success");
      setCurrentPage(1);
      fetchPromotions();
    } catch (error) {
      console.error("Error deleting promotion", error);
      showToast("Failed to delete promotion", "error");
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setPromotionToDelete(null);
    }
  };

  // Save
  const handleSave = async (promotionData: IPromotionResponse) => {
    setLoading(true);
    try {
      if (promotionData.id) {
        await PromotionService.updatePromotion(promotionData);
        showToast("Promotion updated successfully", "success");
      } else {
        await PromotionService.createPromotion(promotionData);
        showToast("Promotion added successfully", "success");
      }
      setModalVisible(false);
      setCurrentPage(1);
      fetchPromotions();
    } catch (error) {
      console.error("Error saving promotion", error);
      showToast("Failed to save promotion", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <LoadingOverlay show={loading} />
      {user?.role === "Admin" && (
        <Row className="mb-3 g-2">
          <Col xs={12} md={3}>
            <Button variant="primary" onClick={handleAdd} className="w-100">
              + Add Promotion
            </Button>
          </Col>
        </Row>
      )}

      {/* Switch view */}
      <>
        <Row>
          <Col xs={12}>
            <Card className="p-4 shadow-sm border-0">
              <div className="d-flex justify-content-between align-items-center mb-4">
                 {user?.role === "Agent" ? (
                  <h4>Promotions</h4>
                 ) : (
                  <h4>List of Available Promotions</h4>
                 )}
                <Button variant="outline-secondary" size="sm" onClick={fetchPromotions}>
                  Refresh
                </Button>
              </div>

              <Table hover responsive bordered className="align-middle mb-3">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Discount %</th>
                    {/* <th>Active</th>
                    <th className="text-center">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {promotions.length > 0 ? (
                    promotions
                      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                      .map((promotion) => (
                        <tr key={promotion.id}>
                          <td>{promotion.promotionName}</td>
                          <td>{promotion.promotionDescription}</td>
                          <td>{promotion.discountPer || "-"}</td>
                          {/* <td>{promotion.isActive ? "Yes" : "No"}</td>
                          <td className="text-center d-flex justify-content-center gap-2">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleEdit(promotion)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(promotion.id!)}
                            >
                              Delete
                            </Button>
                          </td> */}
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">
                        No promotions found
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
                onPageSizeChange={(size: number) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Modals */}
        <EditPromotionModal
          show={modalVisible}
          onHide={() => setModalVisible(false)}
          promotionData={selectedPromotion}
          onSave={handleSave}
        />

        <ConfirmationModal
          show={deleteModalVisible}
          title="Delete Promotion"
          message="Are you sure you want to delete this promotion?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModalVisible(false)}
        />
      </>
    </div>
  );
};

export default PromotionManager;
