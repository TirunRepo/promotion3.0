import React, { useEffect, useState } from "react";
import { Table, Button, Card, Row, Col } from "react-bootstrap";
import CustomPagination from "../../common/CustomPagination";
import type { IGetRegisterUser } from "../Services/AuthService";
import AuthService from "../Services/AuthService";
import { useToast } from "../../common/Toaster";
import { FaCloudDownloadAlt } from "react-icons/fa";
import LoadingOverlay from "../../common/LoadingOverlay";

const DEFAULT_PAGE_SIZE = 5;

const Registration: React.FC = () => {
  const [registerUser, setRegisterUser] = useState<IGetRegisterUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [role] = useState(null);
  const { showToast } = useToast();

  const fetchRegisterUser = async () => {
    setLoading(true);
    try {
      const res = await AuthService.getUserRegister(currentPage, pageSize , role || "");
      setRegisterUser(res.data.data.items || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching register User", error);
      showToast("Failed to fetch register User", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cruise lines on page change or page size change
  useEffect(() => {
    fetchRegisterUser();
  }, [currentPage, pageSize]);

  return (
    <div className="mt-4">
      <LoadingOverlay show={loading} />
      <Row>
        <Col xs={12}>
          <Card className="p-4 shadow-sm">
            <Row className=" align-items-center mb-4">
              <Col lg={2} md={2} xs={12}>
                <h4>Register User</h4>
              </Col>
              <Col lg={6} md={6} xs={12}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    try {
                      await AuthService.downloadRegisterUser();
                    } catch (error) {
                      console.error("Error downloading users:", error);
                      alert("Failed to download users.");
                    }
                  }}
                >
                  Download
                  <FaCloudDownloadAlt
                    size={20}
                    style={{ marginLeft: "10px" }}
                  />
                </Button>
              </Col>
              <Col lg={4} md={4} xs={12} style={{ textAlign: "end" }}>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={fetchRegisterUser}
                >
                  Refresh
                </Button>
              </Col>
            </Row>

            <Table hover responsive striped bordered className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Country</th>
                  <th>State</th>
                  <th>City</th>
                  {/* <th className="text-center">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {registerUser.length > 0 ? (
                  registerUser.map((el) => (
                    <tr key={el?.id}>
                      <td>{el?.fullName}</td>
                      <td>{el?.email}</td>
                      <td>{el?.companyName}</td>
                      <td>{el?.country}</td>
                      <td>{el?.state}</td>
                      <td>{el?.city}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-muted">
                      No RegisterUser found
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
    </div>
  );
};

export default Registration;
