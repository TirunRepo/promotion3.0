import React from "react";
import { Modal, Form, Card, Row, Col, Button } from "react-bootstrap";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import type { ICruisePromotionPricing } from "../Services/CruisePromotionPricingService";
import type { IPromotionResponse } from "../Services/Promotions/PromotionService";

interface AddAgentPromotionProps {
  show: boolean;
  onHide: () => void;
  mode: "add" | "edit";
  promotion?: any; // or your ICruisePromotionPricing interface
  promotionsGet?: IPromotionResponse[] | null;
}

// Yup Validation Schema
const PromotionSchema = Yup.object().shape({
  promotionId: Yup.number().required("Promotion ID is required"),
  cruiseInventoryId: Yup.number().required("Cruise Inventory ID is required"),
  pricingType: Yup.string().required("Pricing Type is required"),
  commisionRate: Yup.number().required("Commission Rate is required"),
  singlePrice: Yup.number().required("Single Price is required"),
  doublePrice: Yup.number().required("Double Price is required"),
  triplePrice: Yup.number().required("Triple Price is required"),
  currencyType: Yup.string().required("Currency Type is required"),
  cabinOccupancy: Yup.string().required("Cabin Occupancy is required"),
  tax: Yup.number().required("Tax is required"),
  grats: Yup.number().required("Grats is required"),
  nccf: Yup.number().required("NCCF is required"),
  commisionSingleRate: Yup.number().required(
    "Commission Single Rate is required"
  ),
  commisionDoubleRate: Yup.number().required(
    "Commission Double Rate is required"
  ),
  commisionTripleRate: Yup.number().required(
    "Commission Triple Rate is required"
  ),
  totalPrice: Yup.number().required("Total Price is required"),
});

const AddAgentPromotion: React.FC<AddAgentPromotionProps> = ({
  show,
  onHide,
  mode,
  promotion,
  promotionsGet
}) => {
  // Default / Initial values
  const initialValues: ICruisePromotionPricing = {
    id: promotion?.id ?? 0,
    promotionId: promotion?.promotionId ?? 0,
    cruiseInventoryId: promotion?.cruiseInventoryId ?? 0,
    pricingType: promotion?.pricingType ?? "",
    commisionRate: promotion?.commisionRate ?? 0,
    singlePrice: promotion?.singlePrice ?? 0,
    doublePrice: promotion?.doublePrice ?? 0,
    triplePrice: promotion?.triplePrice ?? 0,
    currencyType: promotion?.currencyType ?? "",
    cabinOccupancy: promotion?.cabinOccupancy ?? "",
    tax: promotion?.tax ?? 0,
    grats: promotion?.grats ?? 0,
    nccf: promotion?.nccf ?? 0,
    commisionSingleRate: promotion?.commisionSingleRate ?? 0,
    commisionDoubleRate: promotion?.commisionDoubleRate ?? 0,
    commisionTripleRate: promotion?.commisionTripleRate ?? 0,
    totalPrice: promotion?.totalPrice ?? 0,
  };

  const handleSubmit = async (values: any) => {
    console.log("Form submitted:", values);
    if (mode === "edit") {
      console.log("Updating promotion...");
      // await CruisePromotionPricingService.update(values);
    } else {
      console.log("Creating new promotion...");
      // await CruisePromotionPricingService.create(values);
    }
    onHide();
  };
    console.log("promotionsGet", promotionsGet);
  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>
          {mode === "edit" ? "Edit Promotion" : "Add Promotion"}
        </Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={initialValues}
        validationSchema={PromotionSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          handleSubmit,
          handleChange,
          values,
          errors,
          touched,
          handleBlur,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Body
              style={{
                maxHeight: "75vh", // adjust as needed (70–80vh is best)
                overflowY: "auto",
                paddingRight: "1rem",
              }}
            >
              <Card className="mb-3 shadow-sm">
                <Card.Body>
                  <Row className="g-3">
                    {/* --- Promotion Dropdown --- */}
                    <Col lg={4} md={6} xs={12}>
                      <Form.Group controlId="promotionId">
                        <Form.Label>promotion</Form.Label>
                        <Form.Select
                          name="promotionId"
                          value={values.promotionId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={
                            !!touched.promotionId && !!errors.promotionId
                          }
                        >
                          <option value="">-- Select Promotion --</option>
                          <option value={1}>5% Off Cruise Fare</option>
                          <option value={2}>BOGO Free</option>
                          <option value={3}>Kids Cruise Free</option>
                        </Form.Select>
                        {touched.promotionId && errors.promotionId && (
                          <div className="text-danger mt-1"></div>
                        )}
                      </Form.Group>
                    </Col>

                    {/* --- Cruise Inventory ID --- */}
                    <Col lg={4} md={6} xs={12}>
                      <Form.Group controlId="cruiseInventoryId">
                        <Form.Label>cruise Inventory ID</Form.Label>
                        <Form.Control
                          type="number"
                          name="cruiseInventoryId"
                          value={values.cruiseInventoryId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={
                            !!touched.cruiseInventoryId &&
                            !!errors.cruiseInventoryId
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          <ErrorMessage name="cruiseInventoryId" />
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* --- Pricing Type --- */}
                    <Col lg={4} md={6} xs={12}>
                      <Form.Group controlId="pricingType">
                        <Form.Label>pricing Type</Form.Label>
                        <Form.Control
                          type="text"
                          name="pricingType"
                          value={values.pricingType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={
                            !!touched.pricingType && !!errors.pricingType
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          <ErrorMessage name="pricingType" />
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* --- Commission Rate --- */}
                    <Col lg={4} md={6} xs={12}>
                      <Form.Group controlId="commisionRate">
                        <Form.Label>commission Rate (%)</Form.Label>
                        <Form.Control
                          type="number"
                          name="commisionRate"
                          value={values.commisionRate ?? 0}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={
                            !!touched.commisionRate && !!errors.commisionRate
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          <ErrorMessage name="commisionRate" />
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* --- All Numeric Fields --- */}
                    {[
                      "singlePrice",
                      "doublePrice",
                      "triplePrice",
                      "tax",
                      "grats",
                      "nccf",
                      "commisionSingleRate",
                      "commisionDoubleRate",
                      "commisionTripleRate",
                      "totalPrice",
                    ].map((field) => (
                      <Col lg={4} md={6} xs={12} key={field}>
                        <Form.Group controlId={field}>
                          <Form.Label>
                            {field.replace(/([A-Z])/g, " $1")}
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name={field}
                            value={(values as any)[field]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              !!touched[field as keyof typeof touched] &&
                              !!errors[field as keyof typeof errors]
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            <ErrorMessage name={field} />
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    ))}

                    {/* --- Currency --- */}
                    <Col lg={4} md={6} xs={12}>
                      <Form.Group controlId="currencyType">
                        <Form.Label>Currency</Form.Label>
                        <Form.Control
                          type="text"
                          name="currencyType"
                          value={values.currencyType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={
                            !!touched.currencyType && !!errors.currencyType
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          <ErrorMessage name="currencyType" />
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* --- Cabin Occupancy --- */}
                    <Col lg={4} md={6} xs={12}>
                      <Form.Group controlId="cabinOccupancy">
                        <Form.Label>cabin Occupancy</Form.Label>
                        <Form.Control
                          type="text"
                          name="cabinOccupancy"
                          value={values.cabinOccupancy}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={
                            !!touched.cabinOccupancy && !!errors.cabinOccupancy
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          <ErrorMessage name="cabinOccupancy" />
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Modal.Body>
            <Modal.Footer
              className="bg-light"
              style={{
                position: "sticky",
                bottom: 0,
                zIndex: 10,
                background: "#fff",
                borderTop: "1px solid #dee2e6",
              }}
            >
              <Button variant="secondary" onClick={onHide} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {mode === "edit" ? "Update Promotion" : "Add Promotion"}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddAgentPromotion;
