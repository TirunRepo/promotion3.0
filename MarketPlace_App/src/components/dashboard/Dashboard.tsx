// src/components/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaShip, FaTags, FaUsers } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../context/AuthContext";
import LoadingOverlay from "../../common/LoadingOverlay";
import CruiseService from "../Services/CruiseService";
import PromotionService from "../Services/Promotions/PromotionService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  // Dummy data inside the component
  const { user } = useAuth();
  // const inventoryCount = 120;
  // const promotionsCount = 8;


  // const chartData = {
  //   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  //   datasets: [
  //     {
  //       label: "Bookings",
  //       data: bookingsData,
  //       backgroundColor: "#007bff",
  //     },
  //   ],
  // };

  const [loading, setLoading] = useState(false);
  const [totalInventory, setTotalInventory] = useState(0);
  const [totalpromotions, setTotalPromotions] = useState(0);

  const fetchTotalInventory = async () => {
    setLoading(true);
    try {
      const res = await CruiseService.getInventory(1, 1000); // can pass big pageSize if needed
      const data = res.data;
      setTotalInventory(data?.totalCount || data?.items?.length || 0);
    } catch (error) {
      console.error("Error fetching total inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalPromotions = async () => {
    setLoading(true);
    try {
      const res = await PromotionService.getAllPromotions(); // can pass big pageSize if needed
      const data = res.data?.data?.length || 0;
      setTotalPromotions(data);
    }
    catch(error){
    }
    finally {
      setLoading(false); 
    }
  };
  
  useEffect(() => {
    fetchTotalInventory();
    fetchTotalPromotions();
  }, []);

  // console.log("Total Inventory:", totalInventory);

  return (
    <>
      <LoadingOverlay show={loading} />
      <Container fluid className="mt-4">
        <h2 className="mb-4 text-center">
          {user?.role === "Admin" ? "Int2Cruise" : user?.companyName} Dashboard
        </h2>

        {/* Top Stats */}
        <Row className="g-4">
          <Col md={3}>
            <Card className="text-white bg-primary h-100">
              <Card.Body className="d-flex align-items-center">
                <FaShip size={40} className="me-3" />
                <div>
                  <Card.Title>Inventory</Card.Title>
                  <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {totalInventory}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-success h-100">
              <Card.Body className="d-flex align-items-center">
                <FaTags size={40} className="me-3" />
                <div>
                  <Card.Title>Promotions</Card.Title>
                  <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {totalpromotions}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-warning h-100">
              <Card.Body className="d-flex align-items-center">
                <GiConfirmed size={40} className="me-3" />
                <div>
                  <Card.Title>Total Paid Bookings</Card.Title>
                  <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {0}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-white bg-info h-100">
              <Card.Body className="d-flex align-items-center">
                <FaUsers size={40} className="me-3" />
                <div>
                  <Card.Title>Total Bookings</Card.Title>
                  <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {/* {bookingsData.reduce((a, b) => a + b, 0)} */}
                    {0}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts and Lists */}
        <Row className="mt-4 g-4">
          {/* <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title>Monthly Bookings</Card.Title>
                <Bar data={chartData} />
              </Card.Body>
            </Card>
          </Col> */}
          {/* <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Upcoming Cruises</Card.Title>
                <ul className="list-unstyled">
                  {upcomingCruises.map((cruise, idx) => (
                    <li key={idx} className="mb-2">
                      <strong>{cruise.name}</strong> - {cruise.date} (
                      {cruise.status})
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Card.Title>Recent Promotions</Card.Title>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPromotions.map((promo, idx) => (
                      <tr key={idx}>
                        <td>{promo.title}</td>
                        <td>{promo.discount}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col> */}
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
