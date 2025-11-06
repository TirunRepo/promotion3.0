import React, { useState } from "react";
import { Modal, Form, Card, Row, Col, Button } from "react-bootstrap";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import type { ICruisePromotionPricing } from "../Services/CruisePromotionPricingService";
import type { IPromotionResponse } from "../Services/Promotions/PromotionService";
import type { ICruisePricing } from "../Services/CruiseService";
import CruisePromotionPricingService from "../Services/CruisePromotionPricingService";
import { useToast } from "../../common/Toaster";
import LoadingOverlay from "../../common/LoadingOverlay";
import { PromotionUtility } from "../../utility/PromotionUtility";

interface AddAgentPromotionProps {
  show: boolean;
  onHide: () => void;
  mode: "add" | "edit";
  promotionsGet?: IPromotionResponse[];
  cruisePricing: ICruisePricing;
  setCruisePromotionPricing: React.Dispatch<
    React.SetStateAction<ICruisePromotionPricing[]>
  >;
  selectedCruisePromotionPricing: ICruisePromotionPricing;
}

const AddAgentPromotion: React.FC<AddAgentPromotionProps> = ({
  show,
  onHide,
  mode,
  promotionsGet,
  cruisePricing,
  setCruisePromotionPricing,
  selectedCruisePromotionPricing,
}) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  // Default / Initial values

  const getInitialValues = (): ICruisePromotionPricing => {
    let initialValue: ICruisePromotionPricing = {} as ICruisePromotionPricing;
    if (mode == "add") {
      initialValue = {
        id: 0,
        promotionId: 0,
        cruiseInventoryId: cruisePricing.cruiseInventoryId ?? 0,
        pricingType: cruisePricing.pricingType ?? "",
        commisionRate: cruisePricing.commisionRate ?? 0,
        basePrice: PromotionUtility.calculateBasePrice(cruisePricing),
        currencyType: cruisePricing.currencyType ?? "",
        cabinOccupancy: cruisePricing.cabinOccupancy ?? "",
        tax: cruisePricing.tax ?? 0,
        grats: cruisePricing.grats ?? 0,
        nccf: cruisePricing.nccf ?? 0,
        commisionSingleRate: cruisePricing.singlePrice ?? 0,
        commisionDoubleRate: cruisePricing.doublePrice ?? 0,
        commisionTripleRate: cruisePricing.triplePrice ?? 0,
        totalPrice: cruisePricing.totalPrice ?? 0,
      };
    } else if (mode == "edit") {
      initialValue = {
        id: selectedCruisePromotionPricing.id,
        promotionId: selectedCruisePromotionPricing.promotionId,
        cruiseInventoryId: selectedCruisePromotionPricing.cruiseInventoryId,
        pricingType: selectedCruisePromotionPricing.pricingType,
        commisionRate: selectedCruisePromotionPricing.commisionRate,
        basePrice: selectedCruisePromotionPricing.basePrice,
        currencyType: selectedCruisePromotionPricing.currencyType,
        cabinOccupancy: selectedCruisePromotionPricing.cabinOccupancy,
        tax: selectedCruisePromotionPricing.tax,
        grats: selectedCruisePromotionPricing.grats,
        nccf: selectedCruisePromotionPricing.nccf,
        commisionSingleRate: selectedCruisePromotionPricing.commisionSingleRate,
        commisionDoubleRate: selectedCruisePromotionPricing.commisionDoubleRate,
        commisionTripleRate: selectedCruisePromotionPricing.commisionTripleRate,
        totalPrice: selectedCruisePromotionPricing.totalPrice,
      };
    }
    return initialValue;
  };

  const fetchPromotions = async (id: number) => {
    setLoading(true);
    try {
      const res = await CruisePromotionPricingService.getByCruiseInventory(id);
      setCruisePromotionPricing(res);
    } catch (err) {
      console.error("Error fetching promotions:", err);
      showToast("Failed to fetch promotions", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: ICruisePromotionPricing) => {
    setLoading(true);
    try {
      if (mode === "edit") {
        await CruisePromotionPricingService.update(values);
        showToast("Promotion updated successfully", "success");
        if (values.cruiseInventoryId) {
          await fetchPromotions(values.cruiseInventoryId);
        }
        setTimeout(() => {
          onHide();
        }, 800);
      } else {
        await CruisePromotionPricingService.insert(values);
        showToast("Promotion added successfully", "success");
        if (values.cruiseInventoryId) {
          await fetchPromotions(values.cruiseInventoryId);
        }
        setTimeout(() => {
          onHide();
        }, 800);
      }
      onHide();
    } catch (error) {
      setLoading(false);
      console.error("Insert failed:", error);
      showToast("Failed to add promotion", "error");
    }
  };

  const handlePromoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const selectedPromoId = Number(e.target.value);
    if (!selectedPromoId) return;

    // 1️⃣ Get the full promotion object from the list
    const selectedPromo = promotionsGet?.find((p) => p.id === selectedPromoId);
    if (!selectedPromo) return;

    // 2️⃣ Calculate new pricing using the utility
    const calculatedPricing = PromotionUtility.calculatePricing(
      selectedPromo,
      cruisePricing
    );

    // 3️⃣ Update Formik values
    setFieldValue("promotionId", selectedPromoId);
    for (const [key, val] of Object.entries(calculatedPricing)) {
      setFieldValue(key, val);
    }
  };

  const getCalculatedOn = (promotionId: number) => {
    return promotionsGet?.find((promo) => promo.id === promotionId)
      ?.calculatedOn;
  };

  return (
    <div className="mt-4">
      <LoadingOverlay show={loading} />
      <Modal show={show} onHide={onHide} size="xl" centered scrollable>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            {mode === "edit" ? "Edit Promotion" : "Add Promotion"}
          </Modal.Title>
        </Modal.Header>

        <Formik
          initialValues={getInitialValues()}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            handleSubmit,
            setFieldValue,
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
                            onChange={(e) =>
                              handlePromoChange(e, setFieldValue)
                            }
                            onBlur={handleBlur}
                            isInvalid={
                              !!touched.promotionId && !!errors.promotionId
                            }
                          >
                            <option value="">-- Select Promotion --</option>

                            {promotionsGet?.map((promo) => (
                              <option
                                key={promo.id as any}
                                value={promo.id as any}
                              >
                                {promo.promotionName}
                              </option>
                            ))}
                          </Form.Select>
                          {touched.promotionId && errors.promotionId && (
                            <div className="text-danger mt-1"></div>
                          )}
                        </Form.Group>
                      </Col>

                      <Col lg={4} md={6} xs={12}>
                        <Form.Group controlId="calculatedOn">
                          <Form.Label>Calculated On</Form.Label>
                          <Form.Control
                            type="text"
                            name="calculatedOn"
                            value={getCalculatedOn(values.promotionId)}
                            onBlur={handleBlur}
                            disabled
                          />
                        </Form.Group>
                      </Col>

                      {/* --- Commission Rate --- */}
                      {/* <Col lg={4} md={6} xs={12}>
                        <Form.Group controlId="commisionRate">
                          <Form.Label>commission Rate (%)</Form.Label>
                          <Form.Control
                            type="number"
                            name="commisionRate"
                            value={values.commisionRate ?? 0}
                            disabled
                            onBlur={handleBlur}
                            isInvalid={
                              !!touched.commisionRate && !!errors.commisionRate
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            <ErrorMessage name="commisionRate" />
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col> */}

                      {/* --- All Numeric Fields --- */}
                      {["basePrice", "tax", "grats", "nccf", "totalPrice"].map(
                        (field) => (
                          <Col lg={4} md={6} xs={12} key={field}>
                            <Form.Group controlId={field}>
                              <Form.Label>
                                {field.replace(/([A-Z])/g, " $1")}
                              </Form.Label>
                              <Form.Control
                                type="number"
                                name={field}
                                value={(values as any)[field]}
                                onBlur={handleBlur}
                                disabled
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
                        )
                      )}

                      {/* --- Currency --- */}
                      <Col lg={4} md={6} xs={12}>
                        <Form.Group controlId="currencyType">
                          <Form.Label>Currency</Form.Label>
                          <Form.Control
                            type="text"
                            name="currencyType"
                            value={values.currencyType}
                            disabled
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
                            disabled
                            onBlur={handleBlur}
                            isInvalid={
                              !!touched.cabinOccupancy &&
                              !!errors.cabinOccupancy
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
    </div>
  );
};

export default AddAgentPromotion;
