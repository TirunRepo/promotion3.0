import React, { useState } from "react";
import { Container, Navbar, Dropdown, Image } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Sidebar from "./common/Sidebar";
import Breadcrumbs from "./common/Breakcrumbs";
import { useAuth } from "./context/AuthContext";

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Header */}
        <Navbar
          bg="primary"
          variant="dark"
          expand="lg"
          style={{ padding: "0.25rem 1rem", minHeight: "38px" }}
          className="shadow-sm"
        >
          <button
            className="btn btn-outline-light me-3 d-lg-none"
            onClick={() => setCollapsed(!collapsed)}
            style={{ padding: "2px 7px", fontSize: "1.2rem" }}
          >
            ☰
          </button>
          <Navbar.Brand
            className="fw-bold"
            style={{ fontSize: "1rem", padding: "0" }}
          >
            {user?.role?.trim().toLowerCase() === "admin"
              ? "Cruise Marketplace Admin (Int2Cruise)"
              : user?.companyName}
          </Navbar.Brand>

          {/* Persona Dropdown */}
          <div className="ms-auto">
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-user"
                className="d-flex align-items-center border-0 bg-white rounded-pill px-2"
                style={{ minHeight: "32px", padding: "2px 10px" }}
              >
                <Image
                  src={`https://ui-avatars.com/api/?name=${
                    user?.fullname ?? "User"
                  }`}
                  roundedCircle
                  width="32"
                  height="32"
                  className="me-2"
                />
                <span
                  className="fw-semibold text-dark d-none d-md-inline"
                  style={{ fontSize: "0.95rem" }}
                >
                  {user?.fullname}
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-lg rounded-3 p-2">
                <Dropdown.Header>
                  <div className="d-flex align-items-center">
                    <Image
                      src={`https://ui-avatars.com/api/?name=${
                        user?.fullname ?? "User"
                      }&size=64`}
                      roundedCircle
                      width="40"
                      height="40"
                      className="me-2"
                    />
                    <div>
                      <strong style={{ fontSize: "0.95rem" }}>
                        {user?.fullname}
                      </strong>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.85rem", lineHeight: 1.2 }}
                      >
                        {user?.email}
                      </div>
                    </div>
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => alert("Account Page TODO")}>
                  My Account
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar>

        {/* Breadcrumb */}
        <Container fluid className="mt-2">
          <Breadcrumbs />
        </Container>

        {/* Page Content */}
        <Container fluid className="mt-2">
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default Layout;
