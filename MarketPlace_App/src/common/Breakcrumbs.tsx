import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const css = {
  breadcrumbBar: {
    background: "#fff",
    padding: "2px",
    borderBottom: "1px solid #dee2e6",
    display: "flex",
    alignItems: "center",
    margin: "0 auto", // Center in container
  },
  breadcrumbSmall: {
    fontSize: "0.8rem",
    marginBottom: 0,
  },
} as const;

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const {user} = useAuth();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div style={css.breadcrumbBar}>
      <Breadcrumb style={css.breadcrumbSmall}>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>
          Home
        </Breadcrumb.Item>
         <Breadcrumb.Item active>
          {user?.role === "Admin" ? "Int2Cruise" : user?.companyName}
        </Breadcrumb.Item>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <Breadcrumb.Item active key={to}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item linkAs={Link} linkProps={{ to }} key={to}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
