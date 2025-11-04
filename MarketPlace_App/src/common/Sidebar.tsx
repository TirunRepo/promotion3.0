// Sidebar.tsx
import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import { List, ChevronDown, ChevronRight } from "react-bootstrap-icons";
import { menuItems, type MenuItem } from "../menuConfig";
import { useAuth } from "../context/AuthContext";

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const currentRole:any = user?.role;
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();

  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};

    const expandParents = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (!currentRole || !item.roles.includes(currentRole)) return;

        if (item.children) {
          const matchChild = item.children.some(
            (child) => currentRole && child.roles.includes(currentRole) && location.pathname.startsWith(child.to)
          );
          if (location.pathname.startsWith(item.to) || matchChild) {
            newOpenMenus[item.to] = true;
          }
          expandParents(item.children);
        }
      });
    };

    expandParents(menuItems);
    setOpenMenus(newOpenMenus);
  }, [location.pathname, currentRole]);

  const toggleSubmenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderMenuItem = (item: MenuItem, level = 0): React.ReactNode => {
    if (!currentRole || !item.roles.includes(currentRole)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.to] || false;
    const isActive = location.pathname.startsWith(item.to);

    if (hasChildren) {
      return (
        <div key={item.to}>
          <div
            className={`d-flex align-items-center sidebar-link px-3 py-2 ${isActive ? "active" : ""}`}
            style={{ cursor: "pointer", height: "42px" }}
            onClick={() => toggleSubmenu(item.to)}
          >
            {item.icon}
            <span className={`sidebar-label ${collapsed ? "collapsed" : ""}`}>{item.label}</span>
            {!collapsed && <span className="ms-auto">{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>}
          </div>

          <div
            className="submenu-wrapper"
            style={{
              maxHeight: isOpen && !collapsed ? "500px" : "0",
              overflow: "hidden",
              transition: "max-height 0.3s ease",
            }}
          >
            <Nav className="flex-column ms-3">
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </Nav>
          </div>
        </div>
      );
    }

    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) => `nav-link d-flex align-items-center sidebar-link ${isActive ? "active" : ""}`}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {item.icon}
        <span className={`sidebar-label ${collapsed ? "collapsed" : ""}`}>{item.label}</span>
      </NavLink>
    );
  };

  return (
  <div
  className="sidebar-container d-flex flex-column shadow-sm border-end bg-white"
  style={{
    width: collapsed ? "50px" : "250px",
    // minWidth: collapsed ? "50px" : "250px",
    // maxWidth: collapsed ? "50px" : "250px",
    transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
    minHeight: "100vh",
    zIndex: 2,
    overflow: "hidden",
  }}
>
  <div
    className="d-flex align-items-center my-2 px-3 py-2 sidebar-link"
    style={{ cursor: "pointer", height: "42px" }}
    onClick={() => setCollapsed(!collapsed)}
  >
    <List size={20} />
  </div>

  <Nav className="flex-column mt-2">{menuItems.map((item) => renderMenuItem(item))}</Nav>

  <style>
    {`
      .sidebar-link { color: #495057; font-size: 14px; transition: background 0.24s, color 0.18s; white-space: nowrap; }
      .sidebar-link:hover { background-color: #f1f3f5; color: #0d6efd !important; }
      .sidebar-link.active { background-color: #e7f1ff; color: #0d6efd !important; font-weight: 600; border-left: 4px solid #0d6efd; padding-left: 0.75rem; }
      .sidebar-label { display: inline-block; transition: opacity 0.22s, width 0.22s, margin 0.22s; opacity: 1; margin-left: 13px; }
      .sidebar-label.collapsed { opacity: 0; width: 0 !important; margin: 0 !important; pointer-events: none; }
      .sidebar-container { box-sizing: border-box; overflow-x: hidden; }
      .submenu-wrapper { position: relative; transition: max-height 0.3s ease; }
    `}
  </style>
</div>

  );
};

export default Sidebar;
