// menuConfig.tsx
import { type ReactNode, lazy } from "react";
import {
  HouseDoorFill,
  BoxSeam,
  ClipboardCheck,
  BarChart,
  // PeopleFill,
  GearFill,
  // KeyFill,
  GeoAlt,
  JournalCheck,
  Building,
  Shop,
} from "react-bootstrap-icons";
import ManageMarkup from "./components/markup/ManageMarkup";
import Registration from "./components/Reports/Registration";
import { FaBeer } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import AgentInventoryReports from "./components/Reports/AgentInventoryReports";

// Lazy load components
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const PromotionManager = lazy(() => import("./components/promotions/PromotionManager"));
const CruiseLineManager = lazy(() => import("./components/inventory/cruiseLines/CruiseLineManager"));
const CruiseShipsManager = lazy(() => import("./components/inventory/cruiseShips/CruiseShipsManger"));
const CruiseDeparturePortManager = lazy(
  () => import("./components/inventory/cruiseDeparturesPort/CruiseDeparturePortManager")
);
const CruiseDestinationManager = lazy(
  () => import("./components/inventory/cruiseDestination/CruiseDestinatioManager")
);
const CruiseInventoryManager = lazy(
  () => import("./components/inventory/CruiseInventoryManager")
);

// Define roles
export type UserRole = "Admin" | "Agent";

// MenuItem interface
export interface MenuItem {
  to: string;
  icon: ReactNode;
  label: string;
  roles: UserRole[];
  element: ReactNode;
  children?: MenuItem[];
}

// Map labels to icons for children
const childIcons: Record<string, ReactNode> = {
  "Cruise Inventory": <JournalCheck />,
  "Manage Lines": <Building />,
  "Manage Ships": <Shop />,
  "Manage Destination": <GeoAlt />,
  "Manage Departure Port": <GeoAlt />,
  "Reports Registration" : <FaBeer />,
  "Agent Reports" : <TbReportSearch size={18} />

};

// Menu items array
export const menuItems: MenuItem[] = [
  {
    to: "/dashboard",
    icon: <HouseDoorFill />,
    label: "Home",
    roles: ["Admin", "Agent"],
    element: <Dashboard />,
  },
  {
    to: "/inventory",
    icon: <BoxSeam />,
    label: "Inventory",
    roles: ["Admin","Agent"], // parent access can remain broad
    element: <CruiseInventoryManager />,
    children: [
      {
        to: "/inventory/manage-inventory",
        icon: childIcons["Cruise Inventory"],
        label: "Cruise Inventory",
        roles: ["Admin","Agent"], // child-specific role
        element: <CruiseInventoryManager />,
      },
      {
        to: "/inventory/manage-lines",
        icon: childIcons["Manage Lines"],
        label: "Manage Lines",
        roles: ["Admin"],
        element: <CruiseLineManager />,
      },
      {
        to: "/inventory/manage-ships",
        icon: childIcons["Manage Ships"],
        label: "Manage Ships",
        roles: ["Admin"],
        element: <CruiseShipsManager />,
      },
      {
        to: "/inventory/manage-destination",
        icon: childIcons["Manage Destination"],
        label: "Manage Destination",
        roles: ["Admin"],
        element: <CruiseDestinationManager />,
      },
      {
        to: "/inventory/manage-departure-port",
        icon: childIcons["Manage Departure Port"],
        label: "Manage Departure Port",
        roles: ["Admin"],
        element: <CruiseDeparturePortManager />,
      },
    ],
  },
  {
    to: "/promotions",
    icon: <ClipboardCheck />,
    label: "Promotions",
    roles: ["Admin","Agent"],
    element: <PromotionManager />,
  },
  {
    to: "/markup",
    icon: <GearFill />,
    label: "Mark Up",
    roles: ["Admin"],
    element: <ManageMarkup />,
  },
  {
    to: "/reports",
    icon: <BarChart />,
    label: "Reports",
    roles: ["Admin"],
    element: <div>Reports Page</div>,
    children:[
      {
        to: "/reports/registration",
        icon: childIcons["Reports Registration"],
        label: "Registration Report",
        roles: ["Admin"],
        element: <Registration />,
      },
     {
        to: "/reports/agent",
        icon: childIcons["Agent Reports"],
        label: "Agent Inventory",
        roles: ["Admin"],
        element: <AgentInventoryReports />,
      }
    ]
  },
  // {
  //   to: "/admin",
  //   icon: <PeopleFill />,
  //   label: "Manage Users",
  //   roles: ["Admin"],
  //   element: <div>Admin Page</div>,
  // },
  // {
  //   to: "/role-management",
  //   icon: <KeyFill />,
  //   label: "Role Mgmt",
  //   roles: ["Admin"],
  //   element: <div>Role Mgmt</div>,
  // },
];
