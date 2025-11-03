import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { IMarkupRequest } from "../Services/Markup/MarkupService";
import MarkupService from "../Services/Markup/MarkupService";
import dayjs from "dayjs";
import ConfirmationModal from "../../common/ConfirmationModal";

interface EditMarkupProps {
  show: boolean;
  onHide: () => void;
  selectedMarkup: IMarkupRequest | null;
  onSave: (data: IMarkupRequest) => void;
}

const EditMarkup: React.FC<EditMarkupProps> = ({
  show,
  onHide,
  selectedMarkup,
  onSave,
}) => {
  const [sailDates, setSailDates] = useState<
    { id: number; name: string; value: string }[]
  >([]);
  const [groupIds, setGroupIds] = useState<{ id: number; name: string }[]>([]);
  const [categoryIds, setCategoryIds] = useState<
    { id: number; name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<boolean>(false);

  const calculateBaseFare = (
    occupancy: string,
    single: number,
    double: number,
    triple: number
  ) => {
    switch (occupancy?.toLowerCase()) {
      case "single":
        return single || 0;
      case "double":
        return (single || 0) + (double || 0);
      case "triple":
        return (single || 0) + (double || 0) + (triple || 0);
      default:
        return 0;
    }
  };

  const calculateFare = (
    basefare: number,
    markupMode: string,
    markupPercentage: number,
    markupFlatAmount: number
  ) => {
    const b = Number(basefare) || 0;
    const p = Number(markupPercentage) || 0;
    const f = Number(markupFlatAmount) || 0;

    if (markupMode === "Percentage") {
      return b + (b * p) / 100;
    }
    // treat anything else (including "Flat") as flat amount mode
    return b + f;
  };

  const formik = useFormik<IMarkupRequest>({
    initialValues: {
      id: undefined,
      inventoryId: 0,
      agentName: "",
      sailDate: "",
      groupId: "",
      categoryId: "",
      cabinOccupancy: "",
      singleRate: 0,
      doubleRate: 0,
      tripleRate: 0,
      baseFare: 0,
      nccf: 0,
      tax: 0,
      grats: 0,
      markupMode: "Percentage",
      markUpPercentage: 0,
      markUpFlatAmount: 0,
      calculatedFare: 0,
      isActive: true,
      shipName: "",
      cruiseLine: "",
      destination: "",
      promotionName: "",
    },
    validationSchema: Yup.object({
      sailDate: Yup.string().required("Sail Date is required"),
      groupId: Yup.string().required("Group is required"),
      categoryId: Yup.string().required("Category is required"),
      cabinOccupancy: Yup.string().required("Occupancy is required"),
      markupMode: Yup.string()
        .oneOf(["Percentage", "Flat"])
        .required("Markup Mode is required"),
      markUpPercentage: Yup.number().when("markupMode", {
        is: "Percentage",
        then: (schema) =>
          schema
            .typeError("Enter a valid number")
            .min(1, "Min 1%")
            .max(100, "Max 100%")
            .required("Percentage is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      markUpFlatAmount: Yup.number().when("markupMode", {
        is: "Flat",
        then: (schema) =>
          schema
            .typeError("Enter a valid number")
            .min(1, "Min 1")
            .required("Flat amount is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
     onSubmit: async (values, { setSubmitting }) => {
      try {
        // compute final fare
        const finalFare = calculateFare(
          values.baseFare,
          values.markupMode,
          values.markUpPercentage,
          values.markUpFlatAmount
        );

        // call parent onSave (which should call your API)
        await onSave({ ...values, calculatedFare: finalFare });

        // optionally close the modal (assumes parent will close via props)
        // onHide(); // uncomment if you want to close here
      } catch (err) {
        console.error("Save failed", err);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });


   const handleShowConfirmation = () => {
    // validate before showing confirmation (optional)
    formik.validateForm().then((errs) => {
      // if there are validation errors, mark touched so errors show and don't open confirm
      if (Object.keys(errs).length > 0) {
        formik.setTouched(
          Object.keys(errs).reduce((acc: any, key) => {
            acc[key] = true;
            return acc;
          }, {})
        );
        return;
      }
      setConfirmation(true);
    });
  };

  // Handle Cancel: Reset form and hide modal
  const handleCancel = () => {
    formik.resetForm(); // Resets to initialValues, clearing all fields and errors
    onHide();
  };

  // Update Calculated Fare whenever base fare or markup changes
  useEffect(() => {
    const base = formik.values.baseFare;
    const calc = calculateFare(
      base,
      formik.values.markupMode,
      formik.values.markUpPercentage,
      formik.values.markUpFlatAmount
    );
    formik.setFieldValue("calculatedFare", calc, false);
  }, [
    formik.values.baseFare,
    formik.values.markupMode,
    formik.values.markUpPercentage,
    formik.values.markUpFlatAmount,
  ]);

  // Fetch Sail Dates
  useEffect(() => {
    const fetchSailDates = async () => {
      try {
        const dates = await MarkupService.getSailDates();
        setSailDates(dates);
      } catch (error) {
        console.error("Error fetching sail dates", error);
      }
    };
    fetchSailDates();
  }, []);

  // Fetch Groups based on Sail Date
  useEffect(() => {
    if (!formik.values.sailDate) return;

    const fetchGroups = async () => {
      try {
        const groups = await MarkupService.getGroupId(formik.values.sailDate);
        setGroupIds(groups);
        formik.setFieldValue("groupId", "");
        formik.setFieldValue("categoryId", "");
      } catch (error) {
        console.error("Error fetching group IDs", error);
      }
    };
    fetchGroups();
  }, [formik.values.sailDate]);

  // Fetch Categories based on Sail Date + Group
  useEffect(() => {
    if (!formik.values.sailDate || !formik.values.groupId) return;

    const fetchCategories = async () => {
      try {
        const categories = await MarkupService.getCategoryIds(
          formik.values.sailDate,
          formik.values.groupId
        );
        setCategoryIds(categories);
        formik.setFieldValue("categoryId", "");
      } catch (error) {
        console.error("Error fetching category IDs", error);
      }
    };
    fetchCategories();
  }, [formik.values.sailDate, formik.values.groupId]);

  // Fetch Cabin Occupancy & Rates based on Category
  useEffect(() => {
    if (!formik.values.categoryId) return;

    const fetchOccupancy = async () => {
      setLoading(true);
      try {
        const intId = sailDates.find(
          (x) => x.value === formik.values.sailDate
        )?.id;
        const data = await MarkupService.getOccupanciesWithRates(intId);
        // console.log(data, ">>>occupancyData");
        const shipResponse = await MarkupService.getShipDetails(intId!);
        // console.log(shipResponse, "shipDetails");
        const shipDetail = shipResponse.data;
        const basefare = calculateBaseFare(
          data.cabinOccupancy,
          data.singleRate,
          data.doubleRate,
          data.tripleRate
        );

        const calcFare = calculateFare(
          basefare,
          formik.values.markupMode,
          formik.values.markUpPercentage,
          formik.values.markUpFlatAmount
        );

        formik.setValues({
          ...formik.values,
          ...data, // dynamic fields from occupancy API
          shipName: shipDetail.ship?.name || "",
          cruiseLine: shipDetail.cruiseLine?.name || "",
          destination: shipDetail.destination?.name || "",
          calculatedFare: calcFare,
        });
        // formik.setFieldValue("cabinOccupancy", data?.cabinOccupancy);
      } catch (error) {
        console.error("Error fetching cabin occupancy", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchOccupancy();
  }, [formik.values.categoryId]);

  // Initialize form when editing
  useEffect(() => {
    if (selectedMarkup) formik.setValues(selectedMarkup);
  }, [selectedMarkup]);

  // Auto calculate Base Fare based on Occupancy
  useEffect(() => {
    const { cabinOccupancy, singleRate, doubleRate, tripleRate } =
      formik.values;

    let baseFare = 0;

    switch (cabinOccupancy?.toLowerCase()) {
      case "single":
        baseFare = singleRate;
        break;
      case "double":
        baseFare = singleRate + doubleRate;
        break;
      case "triple":
        baseFare = singleRate + doubleRate + tripleRate;
        break;
      case "quad":
        baseFare = singleRate + doubleRate + tripleRate; // or add quadrupleRate if you have one
        break;
      default:
        baseFare = 0;
    }

    formik.setFieldValue("baseFare", baseFare);
  }, [
    formik.values.cabinOccupancy,
    formik.values.singleRate,
    formik.values.doubleRate,
    formik.values.tripleRate,
  ]);

  return (
    <>
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedMarkup ? "Edit Markup" : "Add Markup"}
        </Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Modal.Body>
          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px",
              }}
            >
              <Spinner animation="border" />
            </div>
          )}

          {/* Sail Date / Group / Category */}
          <Row className="mb-3">
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Sail Date</Form.Label>
                <Form.Select
                  {...formik.getFieldProps("sailDate")}
                  isInvalid={
                    !!formik.errors.sailDate && formik.touched.sailDate
                  }
                >
                  <option value="">Select Sail Date</option>
                  {sailDates.map((s) => (
                    <option key={s.id} value={s.value}>
                      {dayjs(s.value).format("DD/MM/YYYY")}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.sailDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Group ID</Form.Label>
                <Form.Select
                  {...formik.getFieldProps("groupId")}
                  isInvalid={!!formik.errors.groupId && formik.touched.groupId}
                >
                  <option value="">Select Group</option>
                  {groupIds.map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.groupId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Category ID</Form.Label>
                <Form.Select
                  {...formik.getFieldProps("categoryId")}
                  isInvalid={
                    !!formik.errors.categoryId && formik.touched.categoryId
                  }
                >
                  <option value="">Select Category</option>
                  {categoryIds.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.categoryId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Ship Info */}
          <Row className="mb-3">
            {["shipName", "cruiseLine", "destination", "promotionName"].map(
              (field) => (
                <Col xs={12} sm={6} md={3} key={field} className="mb-2">
                  <Form.Group>
                    <Form.Label>{field.replace(/([A-Z])/g, " $1")}</Form.Label>
                    <Form.Control
                      type="text"
                      value={(formik.values as any)[field]}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              )
            )}
          </Row>

          {/* Rates */}
          <Row className="mb-3">
            <Col xs={12} sm={6} md={2}>
              <Form.Group>
                <Form.Label>Occupancy</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("cabinOccupancy")}
                  readOnly
                  isInvalid={!!formik.errors.cabinOccupancy}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.cabinOccupancy}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Group>
                <Form.Label>Single Rate</Form.Label>
                <Form.Control
                  type="number"
                  {...formik.getFieldProps("singleRate")}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Group>
                <Form.Label>Double Rate</Form.Label>
                <Form.Control
                  type="number"
                  {...formik.getFieldProps("doubleRate")}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Group>
                <Form.Label>Triple/Quad Rate</Form.Label>
                <Form.Control
                  type="number"
                  {...formik.getFieldProps("tripleRate")}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Group>
                <Form.Label>NCCF</Form.Label>
                <Form.Control
                  type="number"
                  {...formik.getFieldProps("nccf")}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Group>
                <Form.Label>Tax</Form.Label>
                <Form.Control
                  type="number"
                  {...formik.getFieldProps("tax")}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Group>
                <Form.Label>Grats</Form.Label>
                <Form.Control
                  type="number"
                  {...formik.getFieldProps("grats")}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Base / Calculated / Markup */}
          <Row className="mb-3">
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Base Fare</Form.Label>
                <Form.Control
                  type="number"
                  {...formik.getFieldProps("baseFare")}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Calculated Fare</Form.Label>
                <Form.Control
                  type="number"
                  value={formik.values.calculatedFare}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Markup Mode</Form.Label>
                <Form.Select {...formik.getFieldProps("markupMode")}>
                  <option value="Percentage">Percentage</option>
                  <option value="Flat">Flat</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {formik.values.markupMode === "Percentage" && (
            <Row className="mb-3">
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>Markup %</Form.Label>
                  <Form.Control
                    type="number"
                    {...formik.getFieldProps("markUpPercentage")}
                    isInvalid={
                      !!formik.errors.markUpPercentage &&
                      formik.touched.markUpPercentage
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.markUpPercentage}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          )}

          {formik.values.markupMode === "Flat" && (
            <Row className="mb-3">
              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label>Flat Amount</Form.Label>
                  <Form.Control
                    type="number"
                    {...formik.getFieldProps("markUpFlatAmount")}
                    isInvalid={
                      !!formik.errors.markUpFlatAmount &&
                      formik.touched.markUpFlatAmount
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.markUpFlatAmount}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          {/* IMPORTANT: type="button" so it does NOT submit the form */}
            <Button
              type="button"
              variant="primary"
              onClick={handleShowConfirmation}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" /> Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
        </Modal.Footer>
        
      </Form>
    </Modal>
    {/* Confirmation modal must be outside the main modal (sibling) */}
      <ConfirmationModal
        show={confirmation}
        title={selectedMarkup ? "Confirm Update" : "Confirm Save"}
        message={
          selectedMarkup
            ? "Are you sure you want to update this markup?"
            : "Are you sure you want to save this new markup?"
        }
        onConfirm={() => {
          setConfirmation(false);
          formik.handleSubmit();
        }}
        onCancel={() => setConfirmation(false)}
      />
    </>
    
  );
};

export default EditMarkup;
