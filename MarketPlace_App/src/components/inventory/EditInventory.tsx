import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Card, Table } from "react-bootstrap";
import CruiseService, {
  type ICruiseInventory,
  type ICabinDetails,
} from "../Services/CruiseService";
import type {
  IIdNameModel,
  IIdNameValueModel,
} from "../../common/IIdNameModel";

interface EditInventoryProps {
  show: boolean;
  onHide: () => void;
  inventory?: ICruiseInventory | null;
  onSave: (data: ICruiseInventory) => void;
  role?: string;
  setSelectedInventory?: (data: ICruiseInventory) => void;
  setModalShowDelete?: (show: boolean) => void; // ✅ add this
}

const emptyCabin = (isRemoveCabin: boolean): ICabinDetails => ({
  cabinNo: "",
  cabinType: "GTY",
  cabinOccupancy: "Available",
  isRemoveCabin: isRemoveCabin,
});

const emptyInventory = (): ICruiseInventory => ({
  id: undefined,
  sailDate: "",
  groupId: "",
  nights: "",
  package: "",
  destinationId: "",
  departurePortId: "",
  cruiseLineId: 0,
  cruiseShipId: 0,
  shipCode: "",
  categoryId: "",
  stateroom: "",
  cabinOccupancy: "",
  deck: "",
  currencyType: "",
  pricingType: "",
  commisionRate: null,
  singlePrice: null,
  doublePrice: null,
  triplePrice: null,
  nccf: null,
  tax: null,
  grats: null,
  cabinDetails: [],
  enableAdmin: false,
  enableAgent: false,  
});

const normalizeInventory = (inv: ICruiseInventory): ICruiseInventory => {
  return {
    ...inv,
    sailDate: inv.sailDate ? inv.sailDate.split("T")[0] : "",
    nights: inv.nights ?? "",
    deck: inv.deck ?? "",
    shipCode: inv.shipCode ?? "",
    commisionRate: inv.commisionRate ?? 0.0,
    singlePrice: inv.singlePrice ?? null,
    doublePrice: inv.doublePrice ?? 0.0,
    triplePrice: inv.triplePrice ?? 0.0,
    nccf: inv.nccf ?? 0.0,
    tax: inv.tax ?? 0.0,
    grats: inv.grats ?? 0.0,
    currencyType: inv.currencyType ?? "",
    pricingType: inv.pricingType ?? "",
    destinationId: inv.destinationId ?? "",
    departurePortId: inv.departurePortId ?? "",
    cruiseLineId: inv.cruiseLineId ?? 0,
    cruiseShipId: inv.cruiseShipId ?? 0,
    cabinDetails: inv.cabinDetails ?? [],
    enableAdmin: inv.enableAdmin,
  };
};

const EditInventory: React.FC<EditInventoryProps> = ({
  show,
  onHide,
  inventory,
  onSave,
  role,
  setSelectedInventory,
  setModalShowDelete,
}) => {
  const [form, setForm] = useState<ICruiseInventory>(emptyInventory());
  const [destinations, setDestinations] = useState<IIdNameModel<Number>[]>([]);
  const [departurePorts, setDeparturePorts] = useState<IIdNameModel<Number>[]>(
    []
  );
  const [cruiseLines, setCruiseLines] = useState<IIdNameModel<Number>[]>([]);
  const [ships, setShips] = useState<IIdNameValueModel<any>[]>([]);
  const isAdmin = role === "Admin";
  const isAgent = role === "Agent";
  useEffect(() => {
    if (inventory) {
      setForm(normalizeInventory(inventory));
      departurePorts;
    } else {
      setForm(emptyInventory());
    }
  }, [inventory, show]);

  useEffect(() => {
    CruiseService.getDestinations()
      .then((res) => res.data.data && setDestinations(res.data.data))
      .catch((err) => console.error("Error loading destinations:", err));

    CruiseService.getCruiseLines()
      .then((res) => res.data.data && setCruiseLines(res.data.data))
      .catch((err) => console.error("Error loading cruise lines:", err));
  }, []);

  useEffect(() => {
    if (form.destinationId !== undefined && form.destinationId !== "") {
      CruiseService.getPorts(form.destinationId)
        .then((res) => res.data.data && setDeparturePorts(res.data.data))
        .catch((err) => {
          console.error("Error loading departure ports:", err);
          setDeparturePorts([]);
        });
    } else {
      setDeparturePorts([]);
    }
  }, [form.destinationId]);

  useEffect(() => {
    if (form.cruiseLineId) {
      CruiseService.getShips(form.cruiseLineId)
        .then((res) => res.data.data && setShips(res.data.data))
        .catch((err) => {
          console.error("Error loading ships:", err);
          setShips([]);
        });
    } else {
      setShips([]);
    }
  }, [form.cruiseLineId]);
  useEffect(() => {
    if (form.cruiseShipId) {
      const shipCode =
        ships.find((c) => c.id === Number(form.cruiseShipId))?.value ?? "";
      setForm((prev) => ({ ...prev, shipCode }));
    } else {
      setForm((prev) => ({ ...prev, shipCode: "" }));
    }
  }, [form.cruiseShipId, ships]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : [
              "cruiseLineId",
              "shipId",
              "commissionPercentage",
              "singleRate",
              "doubleRate",
              "tripleRate",
              "nccf",
              "tax",
              "grats",
            ].includes(name)
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };
  const addCabin = () => {
    setForm((prev) => ({
      ...prev,
      cabinDetails: [...prev.cabinDetails, emptyCabin(false)],
    }));
  };

  const removeCabin = (index: number) => {
    setForm((prev) => ({
      ...prev,
      cabinDetails: prev.cabinDetails.map((cabin, i) =>
        i === index ? { ...cabin, isRemoveCabin: true } : cabin
      ),
    }));
  };

  // Add bulk remove (marks all as to-be-removed)
  // const removeCabins = () => {
  //   setForm((prev) => ({
  //     ...prev,
  //     cabinDetails: prev.cabinDetails.map((cabin) => ({ ...cabin, isRemoveCabin: true })),
  //   }));
  // };

  const handleCabinChange = (
    index: number,
    field: keyof ICabinDetails,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      cabinDetails: prev.cabinDetails.map((cabin, i) =>
        i === index ? { ...cabin, [field]: value } : cabin
      ),
    }));
  };

  const onSaveClick = () => {
    const updatedForm = { ...form };
    const newCabins: ICabinDetails[] = [];

    updatedForm.cabinDetails.forEach((cabin) => {
      if (cabin.cabinType === "Manual" && cabin.cabinNo.includes(",")) {
        // Split by comma, trim, and remove empty values
        const numbers = cabin.cabinNo
          .split(",")
          .map((num) => num.trim())
          .filter((num) => num !== "");

        // Create a new cabin object for each number
        numbers.forEach((num) => {
          newCabins.push({
            ...cabin,
            cabinNo: num,
          });
        });
      } else if (cabin.cabinNo.trim() !== "") {
        // Keep cabins that are not empty and not manual-multiple
        newCabins.push({ ...cabin });
      }
    });

    // Update form with cleaned cabins
    updatedForm.cabinDetails = newCabins;

    // Call save and update UI
    onSave(updatedForm);
    setForm(updatedForm);
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>
          {form.id ? "Edit Cruise Inventory" : "Add Cruise Inventory"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Basic Info */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Basic Information</h5>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group controlId="sailDate">
                    <Form.Label>Sail Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="sailDate"
                      value={form.sailDate}
                      disabled={isAdmin}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="groupId">
                    <Form.Label>Group ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="groupId"
                      disabled={isAdmin}
                      value={form.groupId}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="nights">
                    <Form.Label>Nights</Form.Label>
                    <Form.Select
                      name="nights"
                      value={form.nights}
                      disabled={isAdmin}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Night --</option>
                      <option value="1">1 Night</option>
                      <option value="2">2 Nights</option>
                      <option value="3">3 Nights</option>
                      <option value="4">4 Nights</option>
                      <option value="5">5 Nights</option>
                      <option value="6">6 Nights</option>
                      <option value="7">7 Nights</option>
                      <option value="8">8 Nights</option>
                      <option value="9">9 Nights</option>
                      <option value="10">10 Nights</option>
                      <option value="11">11 Nights</option>
                      <option value="12">12 Nights</option>
                      <option value="13">13 Nights</option>
                      <option value="14">14 Nights</option>
                      <option value="15">15 Nights</option>
                      <option value="16">16 Nights</option>
                      <option value="17">17 Nights</option>
                      <option value="18">18 Nights</option>
                      <option value="19">19 Nights</option>
                      <option value="20">20 Nights</option>
                      <option value="21">21 Nights</option>
                      <option value="22">22 Nights</option>
                      <option value="23">23 Nights</option>
                      <option value="24">24 Nights</option>
                      <option value="25">25 Nights</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mt-3" controlId="package">
                <Form.Label>Package Name</Form.Label>
                <Form.Control
                  type="text"
                  name="package"
                  disabled={isAdmin}
                  value={form.package}
                  onChange={handleChange}
                />
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Cruise Details */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Cruise Details</h5>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="destinationId">
                    <Form.Label>Destination</Form.Label>
                    <Form.Select
                      name="destinationId"
                      value={form.destinationId as any}
                      onChange={handleChange}
                      disabled={isAdmin}
                    >
                      <option value="">-- Select Destination --</option>
                      {destinations.map((d) => (
                        <option key={d.id as any} value={d.id as any}>
                          {d.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="departurePortId">
                    <Form.Label>Departure Port</Form.Label>
                    <Form.Select
                      name="departurePortId"
                      value={form.departurePortId as any}
                      onChange={handleChange}
                      disabled={!departurePorts.length || isAdmin}
                    >
                      <option value="">-- Select Departure Port --</option>
                      {departurePorts.map((p) => (
                        <option key={p.id as any} value={p.id as any}>
                          {p.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mt-1">
                <Col md={6}>
                  <Form.Group controlId="cruiseLineId">
                    <Form.Label>Cruise Line</Form.Label>
                    <Form.Select
                      name="cruiseLineId"
                      disabled={isAdmin}
                      value={form.cruiseLineId}
                      onChange={handleChange}
                    >
                      <option value={0}>-- Select Cruise Line --</option>
                      {cruiseLines.map((cl) => (
                        <option key={cl.id as any} value={cl.id as any}>
                          {cl.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="cruiseShipId">
                    <Form.Label>Ship</Form.Label>
                    <Form.Select
                      name="cruiseShipId"
                      value={form.cruiseShipId}
                      onChange={handleChange}
                      disabled={!ships.length || isAdmin}
                    >
                      <option value={0}>-- Select Ship --</option>
                      {ships.map((s) => (
                        <option key={s.id as any} value={s.id as any}>
                          {s.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-3 g-3">
                <Col md={4}>
                  <Form.Group controlId="shipCode">
                    <Form.Label>Ship Code</Form.Label>
                    <Form.Control
                      type="text"
                      disabled
                      name="shipCode"
                      value={form.shipCode}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="categoryId">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      name="categoryId"
                      value={form.categoryId}
                      onChange={handleChange}
                      disabled={isAdmin}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="stateroom">
                    <Form.Label>Stateroom Type</Form.Label>
                    <Form.Select
                      name="stateroom"
                      value={form.stateroom}
                      onChange={handleChange}
                      disabled={isAdmin}
                    >
                      <option value="">-- Select --</option>
                      <option value="Interior">Inside</option>
                      <option value="Outside">Outside</option>
                      <option value="Balcony">Balcony</option>
                      <option value="Suite">Suite</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-3 g-3">
                <Col md={4}>
                  <Form.Group controlId="cabinOccupancy">
                    <Form.Label>Cabin Occupancy</Form.Label>
                    <Form.Select
                      name="cabinOccupancy"
                      value={form.cabinOccupancy}
                      onChange={handleChange}
                      disabled={isAdmin}
                    >
                      <option value="">-- Select --</option>
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Triple">Triple</option>
                      <option value="Quad">Quad</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="deck">
                    <Form.Label>Deck</Form.Label>
                    <Form.Select
                      name="deck"
                      value={form.deck}
                      disabled={isAdmin}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Deck --</option>
                      <option value="1">1 Deck</option>
                      <option value="2">2 Deck</option>
                      <option value="3">3 Deck</option>
                      <option value="4">4 Deck</option>
                      <option value="5">5 Deck</option>
                      <option value="6">6 Deck</option>
                      <option value="7">7 Deck</option>
                      <option value="8">8 Deck</option>
                      <option value="9">9 Deck</option>
                      <option value="10">10 Deck</option>
                      <option value="11">11 Deck</option>
                      <option value="12">12 Deck</option>
                      <option value="13">13 Deck</option>
                      <option value="14">14 Deck</option>
                      <option value="15">15 Deck</option>
                      <option value="16">16 Deck</option>
                      <option value="17">17 Deck</option>
                      <option value="18">18 Deck</option>
                      <option value="19">19 Deck</option>
                      <option value="20">20 Deck</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Pricing & Cabins */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Pricing & Cabins</h5>

              <Form.Group className="mb-3" controlId="currencyType">
                <Form.Label>Currency</Form.Label>
                <Form.Select
                  name="currencyType"
                  value={form.currencyType}
                  onChange={handleChange}
                  disabled={isAdmin}
                >
                  <option value="">-- Select Currency --</option>
                  <option value="USD">USD</option>
                  {/* <option value="EUR">EUR</option> */}
                  <option value="INR">INR</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="pricingType">
                <Form.Label>Pricing Type</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    name="pricingType"
                    disabled={isAdmin}
                    value="Net"
                    checked={form.pricingType === "Net"}
                    onChange={handleChange}
                    label="Net"
                  />
                  <Form.Check
                    inline
                    type="radio"
                    disabled={isAdmin}
                    name="pricingType"
                    value="Commissionable"
                    checked={form.pricingType === "Commissionable"}
                    onChange={handleChange}
                    label="Commissionable"
                  />
                </div>
              </Form.Group>

              {form.pricingType === "Commissionable" && (
                <Form.Group className="mb-3" controlId="commisionRate">
                  <Form.Label>Commission Percentage</Form.Label>
                  <Form.Control
                    type="text"
                    name="commisionRate"
                    min={0}
                    disabled={isAdmin}
                    max={100}
                    value={form.commisionRate ?? ""}
                    // onChange={handleChange}
                    onChange={(e) => {
                      const regex = /^[0-9]*\.?[0-9]*$/;
                      if (regex.test(e.target.value) || e.target.value === "") {
                        handleChange(e);
                      }
                    }}
                  />
                </Form.Group>
              )}

              <Row className="g-3">
                {form.cabinOccupancy === "Single" && (
                  <Col md={4}>
                    <Form.Group controlId="singlePrice">
                      <Form.Label>Single Rate</Form.Label>
                      <Form.Control
                        type="text"
                        disabled={isAdmin}
                        name="singlePrice"
                        value={form.singlePrice ?? ""}
                        // onChange={handleChange}
                        onChange={(e) => {
                          const regex = /^[0-9]*\.?[0-9]*$/;
                          if (
                            regex.test(e.target.value) ||
                            e.target.value === ""
                          ) {
                            handleChange(e);
                          }
                        }}
                      />
                    </Form.Group>
                  </Col>
                )}
                {form.cabinOccupancy === "Double" && (
                  <>
                    <Col md={4}>
                      <Form.Group controlId="singlePrice">
                        <Form.Label>Single Rate</Form.Label>
                        <Form.Control
                          type="text"
                          disabled={isAdmin}
                          name="singlePrice"
                          value={form.singlePrice ?? ""}
                          // onChange={handleChange}
                          onChange={(e) => {
                            const regex = /^[0-9]*\.?[0-9]*$/;
                            if (
                              regex.test(e.target.value) ||
                              e.target.value === ""
                            ) {
                              handleChange(e);
                            }
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group controlId="doublePrice">
                        <Form.Label>Double Rate</Form.Label>
                        <Form.Control
                          type="text"
                          disabled={isAdmin}
                          name="doublePrice"
                          value={form.doublePrice ?? ""}
                          // onChange={handleChange}
                          onChange={(e) => {
                            const regex = /^[0-9]*\.?[0-9]*$/;
                            if (
                              regex.test(e.target.value) ||
                              e.target.value === ""
                            ) {
                              handleChange(e);
                            }
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </>
                )}

                {(form.cabinOccupancy === "Triple" ||
                  form.cabinOccupancy === "Quad") && (
                  <>
                    <Col md={4}>
                      <Form.Group controlId="singlePrice">
                        <Form.Label>Single Rate</Form.Label>
                        <Form.Control
                          type="text"
                          disabled={isAdmin}
                          name="singlePrice"
                          value={form.singlePrice ?? ""}
                          // onChange={handleChange}
                          onChange={(e) => {
                            const regex = /^[0-9]*\.?[0-9]*$/;
                            if (
                              regex.test(e.target.value) ||
                              e.target.value === ""
                            ) {
                              handleChange(e);
                            }
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="doublePrice">
                        <Form.Label>Double Rate</Form.Label>
                        <Form.Control
                          type="text"
                          disabled={isAdmin}
                          name="doublePrice"
                          value={form.doublePrice ?? ""}
                          // onChange={handleChange}
                          onChange={(e) => {
                            const regex = /^[0-9]*\.?[0-9]*$/;
                            if (
                              regex.test(e.target.value) ||
                              e.target.value === ""
                            ) {
                              handleChange(e);
                            }
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="triplePrice">
                        <Form.Label>Triple Rate</Form.Label>
                        <Form.Control
                          type="text"
                          disabled={isAdmin}
                          name="triplePrice"
                          value={form.triplePrice ?? ""}
                          // onChange={handleChange}
                          onChange={(e) => {
                            const regex = /^[0-9]*\.?[0-9]*$/;
                            if (
                              regex.test(e.target.value) ||
                              e.target.value === ""
                            ) {
                              handleChange(e);
                            }
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </>
                )}
              </Row>

              <Row className="mt-3 g-3">
                <Col md={4}>
                  <Form.Group controlId="nccf">
                    <Form.Label>NCCF</Form.Label>
                    <Form.Control
                      type="text"
                      disabled={isAdmin}
                      name="nccf"
                      value={form.nccf ?? ""}
                      // onChange={handleChange}
                      onChange={(e) => {
                        const regex = /^[0-9]*\.?[0-9]*$/;
                        if (
                          regex.test(e.target.value) ||
                          e.target.value === ""
                        ) {
                          handleChange(e);
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="tax">
                    <Form.Label>Tax</Form.Label>
                    <Form.Control
                      type="text"
                      disabled={isAdmin}
                      name="tax"
                      value={form.tax ?? ""}
                      // onChange={handleChange}
                      onChange={(e) => {
                        const regex = /^[0-9]*\.?[0-9]*$/;
                        if (
                          regex.test(e.target.value) ||
                          e.target.value === ""
                        ) {
                          handleChange(e);
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="grats">
                    <Form.Label>Grats</Form.Label>
                    <Form.Control
                      type="text"
                      disabled={isAdmin}
                      name="grats"
                      value={form.grats ?? ""}
                      // onChange={handleChange}
                      onChange={(e) => {
                        const regex = /^[0-9]*\.?[0-9]*$/;
                        if (
                          regex.test(e.target.value) ||
                          e.target.value === ""
                        ) {
                          handleChange(e);
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Cabins */}
              <h6 className="fw-semibold mt-4">Cabin Details</h6>
              <Table bordered hover size="sm" responsive>
                <thead className="table-light">
                  <tr>
                    <th>Type</th>
                    <th>Cabin No</th>
                    <th>Status</th>
                    {role !== "Admin" && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {form.cabinDetails.map(
                    (cabin, index) =>
                      !cabin.isRemoveCabin ? (
                        <tr key={index}>
                          <td>
                            <Form.Select
                              disabled={isAdmin}
                              value={cabin.cabinType}
                              onChange={(e) =>
                                handleCabinChange(
                                  index,
                                  "cabinType",
                                  e.target.value
                                )
                              }
                            >
                              <option value="GTY">GTY</option>
                              <option value="Manual">Manual</option>
                            </Form.Select>
                          </td>
                          <td>
                            <Form.Control
                              disabled={isAdmin}
                              type="text"
                              value={cabin.cabinNo}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Choose regex based on cabinType
                                const regex =
                                  cabin.cabinType === "GTY"
                                    ? /^[0-9]*$/
                                    : /^[a-zA-Z0-9, ]*$/;
                                // Allow only valid input or empty
                                if (regex.test(value) || value === "") {
                                  handleCabinChange(index, "cabinNo", value);
                                }
                              }}
                              onKeyPress={(e) => {
                                if (cabin.cabinType === "GTY") {
                                  // Only digits
                                  if (!/[0-9]/.test(e.key)) e.preventDefault();
                                } else {
                                  // Allow letters and digits
                                  if (!/^[a-zA-Z0-9, ]*$/.test(e.key))
                                    e.preventDefault();
                                }
                              }}
                              onPaste={(e) => {
                                const pasted = e.clipboardData.getData("text");
                                if (cabin.cabinType === "GTY") {
                                  if (!/^[0-9]+$/.test(pasted))
                                    e.preventDefault();
                                } else {
                                  if (!/^[a-zA-Z0-9]+$/.test(pasted))
                                    e.preventDefault();
                                }
                              }}
                            />
                          </td>
                          <td>
                            <Form.Select
                              disabled={isAdmin}
                              value={cabin.cabinOccupancy}
                              onChange={(e) =>
                                handleCabinChange(
                                  index,
                                  "cabinOccupancy",
                                  e.target.value
                                )
                              }
                            >
                              <option value="Available">Available</option>
                              {/* <option value="Occupied">Occupied</option> */}
                            </Form.Select>
                          </td>
                          {role !== "Admin" && (
                            <td className="text-center">
                              <Button
                                disabled={isAdmin}
                                size="sm"
                                variant="outline-danger"
                                onClick={() => removeCabin(index)}
                              >
                                Delete
                              </Button>
                            </td>
                          )}
                        </tr>
                      ) : null // Hide removed cabins
                  )}
                </tbody>
              </Table>
              {isAgent && (
                <React.Fragment>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={addCabin}
                    disabled={isAdmin}
                  >
                    + Add Cabin
                  </Button>
                  <Button
                    size="sm"
                    className="m-2"
                    variant="outline-danger"
                    disabled={isAdmin}
                    onClick={() => {
                      if (setSelectedInventory) {
                        setSelectedInventory({
                          ...form,
                          nights: form.nights ?? "",
                          destinationId: form.destinationId ?? "",
                          departurePortId: form.departurePortId ?? "",
                        });
                      }
                      if (setModalShowDelete) {
                        setModalShowDelete(true);
                      }
                    }}
                  >
                    Delete Bulk Cabin
                  </Button>
                </React.Fragment>
              )}
            </Card.Body>
          </Card>

          {/* === ROLE SETTINGS === */}
          {/* <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold mb-3">Role Settings</h5>
              {role === "Admin" && (
                <Form.Check
                  type="switch"
                  label="Enable for Agent"
                  name="enableAgent"
                  checked={form.enableAgent}
                  onChange={handleChange}
                />
              )}
              {role === "Agent" && (
                <Form.Check
                  type="switch"
                  label="Enable for Admin"
                  name="enableAdmin"
                  checked={form.enableAdmin}
                  onChange={handleChange}
                />
              )}
            </Card.Body>
          </Card> */}
        </Form>
      </Modal.Body>
      {isAgent && (
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSaveClick}>
            {form.id ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default EditInventory;
