import React, { useState } from "react";
import { Form, Button, Row, Col, Card, Table, Spinner } from "react-bootstrap";
import PromotionService from "../Services/Promotions/PromotionService";

interface Passenger {
  age: string;
  gender: string;
  baseFare: string;
  roomType: string;
}

interface Result {
  promotionName: string;
  promotionDescription: string;
  promoCode: string;
  includesAirfare: boolean;
  includesHotel: boolean;
  includesWiFi: boolean;
  includesShoreExcursion: boolean;
  isStackable: boolean;
  onboardCreditAmount: number;
  totalBaseFare: number;
  totalDiscount: number;
  totalFare: number;
}

interface PassengerFormProps {
  index: number;
  passenger: Passenger;
  onChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const PassengerForm: React.FC<PassengerFormProps> = ({ index, passenger, onChange, onRemove, canRemove }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Passenger #{index + 1}</Card.Title>
        <Row className="mb-2">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={passenger.age}
                onChange={(e: any) => onChange(index, e)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={passenger.gender}
                onChange={(e) => onChange(index, e)}
                required
              >
                <option value="">--Select--</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Base Fare</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="baseFare"
                value={passenger.baseFare}
                onChange={(e: any) => onChange(index, e)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Room Type</Form.Label>
              <Form.Control
                type="text"
                name="roomType"
                value={passenger.roomType}
                onChange={(e: any) => onChange(index, e)}
              />
            </Form.Group>
          </Col>
        </Row>
        {canRemove && (
          <Button variant="outline-danger" size="sm" onClick={() => onRemove(index)}>
            Remove Passenger
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

const DiscountCalculationPage: React.FC = () => {
  const [form, setForm] = useState({
    bookingDate: "",
    isFirstTimeCustomer: false,
    cabinCount: "",
    sailingId: "",
    supplierId: "",
    loyaltyLevel: "",
    isAdultTicketDiscount: false,
    isChildTicketDiscount: false,
    minPassengerAge: "",
    maxPassengerAge: "",
    passengerType: "",
    affiliateName: "",
    onboardCreditAmount: "",
    freeNthPassenger: "",
    isStackable:false
  });

  const [passengers, setPassengers] = useState<Passenger[]>([
    { age: "", gender: "", baseFare: "", roomType: "" },
  ]);

  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handlePassengerChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPassengers((prev) => prev.map((p, i) => (i === idx ? { ...p, [name]: value } : p)));
  };

  const addPassenger = () =>
    setPassengers((prev) => [...prev, { age: "", gender: "", baseFare: "", roomType: "" }]);

  const removePassenger = (idx: number) => setPassengers((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bookingDate) return alert("BookingDate is required");
    if (passengers.length === 0) return alert("At least one passenger is required");
    for (const p of passengers) {
      if (!p.age || !p.gender || !p.baseFare) return alert("All passenger fields are required");
    }

    setLoading(true);
    setResults(null);

    const baseFare = passengers.reduce((sum, x) => sum + parseFloat(x.baseFare || "0"), 0);

    const payload = {
      ...form,
      cabinCount: form.cabinCount ? parseInt(form.cabinCount) : undefined,
      sailingId: form.sailingId ? parseInt(form.sailingId) : undefined,
      supplierId: form.supplierId ? parseInt(form.supplierId) : undefined,
      minPassengerAge: form.minPassengerAge ? parseInt(form.minPassengerAge) : undefined,
      maxPassengerAge: form.maxPassengerAge ? parseInt(form.maxPassengerAge) : undefined,
      onboardCreditAmount: form.onboardCreditAmount ? parseFloat(form.onboardCreditAmount) : undefined,
      freeNthPassenger: form.freeNthPassenger ? parseInt(form.freeNthPassenger) : undefined,
      passengers: passengers.map((p) => ({
        age: parseInt(p.age),
        gender: p.gender,
        baseFare: parseFloat(p.baseFare),
        roomType: p.roomType,
      })),
      baseFare,
    };

    try {
      const res: any = await PromotionService.calculatePromotion(payload);
      setResults(res.data || []);
    } catch (err: any) {
      alert(err.message || "Failed to calculate discounts");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setForm({
      bookingDate: "",
      isFirstTimeCustomer: false,
      cabinCount: "",
      sailingId: "",
      supplierId: "",
      loyaltyLevel: "",
      isAdultTicketDiscount: false,
      isChildTicketDiscount: false,
      minPassengerAge: "",
      maxPassengerAge: "",
      passengerType: "",
      affiliateName: "",
      onboardCreditAmount: "",
      freeNthPassenger: "",
      isStackable:false
    });
    setPassengers([{ age: "", gender: "", baseFare: "", roomType: "" }]);
    setResults(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Discount Calculations</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Booking Date</Form.Label>
              <Form.Control type="date" name="bookingDate" value={form.bookingDate} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Form.Check
              type="checkbox"
              name="isFirstTimeCustomer"
              checked={form.isFirstTimeCustomer}
              onChange={handleChange}
              label="First Time Customer"
            />
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Loyalty Level</Form.Label>
              <Form.Control type="text" name="loyaltyLevel" value={form.loyaltyLevel} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Cabin Count</Form.Label>
              <Form.Control type="number" name="cabinCount" value={form.cabinCount} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Sailing ID</Form.Label>
              <Form.Control type="number" name="sailingId" value={form.sailingId} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Supplier ID</Form.Label>
              <Form.Control type="number" name="supplierId" value={form.supplierId} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Affiliate Name</Form.Label>
              <Form.Control type="text" name="affiliateName" value={form.affiliateName} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3}>
            <Form.Check type="checkbox" label="Adult Ticket Discount" name="isAdultTicketDiscount" checked={form.isAdultTicketDiscount} onChange={handleChange} />
          </Col>
          <Col md={3}>
            <Form.Check type="checkbox" label="Child Ticket Discount" name="isChildTicketDiscount" checked={form.isChildTicketDiscount} onChange={handleChange} />
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Min Passenger Age</Form.Label>
              <Form.Control type="number" name="minPassengerAge" value={form.minPassengerAge} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Max Passenger Age</Form.Label>
              <Form.Control type="number" name="maxPassengerAge" value={form.maxPassengerAge} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Passenger Type</Form.Label>
              <Form.Control type="text" name="passengerType" value={form.passengerType} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Onboard Credit Amount</Form.Label>
              <Form.Control type="number" step="0.01" name="onboardCreditAmount" value={form.onboardCreditAmount} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Free Nth Passenger</Form.Label>
              <Form.Control type="number" name="freeNthPassenger" value={form.freeNthPassenger} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Check type="checkbox" label="Stackable" name="isStackable" checked={form.isStackable} onChange={handleChange} />
          </Col>
        </Row>

        <h4>Passengers</h4>
        {passengers.map((p, i) => (
          <PassengerForm key={i} index={i} passenger={p} onChange={handlePassengerChange} onRemove={removePassenger} canRemove={passengers.length > 1} />
        ))}
        <Button variant="secondary" onClick={addPassenger} className="mb-3">
          Add Passenger
        </Button>

        <div className="mb-4">
          <Button type="submit" variant="primary" disabled={loading} className="me-2">
            {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
          </Button>
          <Button type="button" variant="outline-secondary" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </Form>

      {results && (
        <div className="mt-4">
          <h4>Results</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Promotion Name</th>
                <th>Description</th>
                <th>Promo Code</th>
                <th>Airfare</th>
                <th>Hotel</th>
                <th>WiFi</th>
                <th>Shore Excursion</th>
                <th>Stackable</th>
                <th>Onboard Credit</th>
                <th>Total Base Fare</th>
                <th>Total Discount</th>
                <th>Total Fare</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center">
                    No promotions applied.
                  </td>
                </tr>
              ) : (
                results.map((r, idx) => (
                  <tr key={idx}>
                    <td>{r.promotionName}</td>
                    <td>{r.promotionDescription}</td>
                    <td>{r.promoCode}</td>
                    <td>{r.includesAirfare ? "Yes" : "No"}</td>
                    <td>{r.includesHotel ? "Yes" : "No"}</td>
                    <td>{r.includesWiFi ? "Yes" : "No"}</td>
                    <td>{r.includesShoreExcursion ? "Yes" : "No"}</td>
                    <td>{r.isStackable ? "Yes" : "No"}</td>
                    <td>{r.onboardCreditAmount}</td>
                    <td>{r.totalBaseFare}</td>
                    <td>{r.totalDiscount}</td>
                    <td>{r.totalFare}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DiscountCalculationPage;
