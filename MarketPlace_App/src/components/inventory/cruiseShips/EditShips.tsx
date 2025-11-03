import React from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type {
  Ship,
  CruiseLineD,
} from "../../Services/cruiseShips/CruiseShipsService";

interface ShipFormModalProps {
  show: boolean;
  onHide: () => void;
  shipData: Ship;
  cruiseLines: CruiseLineD[];
  onSave: (data: Ship) => void;
}

// Validation schema
const ShipSchema = Yup.object().shape({
  name: Yup.string()
    .max(50, "Max 50 characters")
    .required("Ship Name is required"),
  code: Yup.string()
    .max(20, "Max 20 characters")
    .min(2, "Min 2 characters")
    .required("Ship Code is required"),
  cruiseLineId: Yup.string().required("Cruise Line is required"),
});

const EditShips: React.FC<ShipFormModalProps> = ({
  show,
  onHide,
  shipData,
  cruiseLines,
  onSave,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{shipData.id ? "Edit Ship" : "Add Ship"}</Modal.Title>
      </Modal.Header>
      <Formik
        enableReinitialize
        initialValues={shipData}
        validationSchema={ShipSchema}
        onSubmit={(values) => {
          onSave(values);
        }}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <FormikForm>
            <Modal.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label>Ship Name</Form.Label>
                  <Field
                    as={Form.Control}
                    type="text"
                    name="name"
                    value={values.name || ""}
                    onChange={(e: any) => {
                      const regex = /^[a-zA-Z]*$/;
                      if (regex.test(e.target.value) || e.target.value === "") {
                        handleChange(e);
                      }
                    }}
                    onBlur={(e: any) => {
                      const trimmedValue = e.target.value.trim();
                      handleChange({
                        target: {
                          name: e.target.name,
                          value: trimmedValue,
                        },
                      });
                      handleBlur(e);
                    }}
                    isInvalid={!!errors.name && touched.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    <ErrorMessage name="name" />
                  </Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>Ship Code</Form.Label>
                  <Field
                    as={Form.Control}
                    type="text"
                    name="code"
                    value={values.code || ""}
                    onChange={(e: any) => {
                      const inputValue = e.target.value.toUpperCase();
                      const regex = /^[A-Z0-9]*$/;
                      
                      if (regex.test(inputValue) || inputValue === "")
                        handleChange({
                          target: {
                            name: "code",
                            value: inputValue,
                          },
                        });
                    }}
                    onBlur={handleBlur}
                    isInvalid={!!errors.code && touched.code}
                  />
                  <Form.Control.Feedback type="invalid">
                    <ErrorMessage name="code" />
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Row className="g-3 mt-3">
                <Col md={6}>
                  <Form.Label>Cruise Line</Form.Label>
                  <Field
                    as={Form.Select}
                    name="cruiseLineId"
                    value={values.cruiseLineId || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.cruiseLineId && touched.cruiseLineId}
                  >
                    <option value="">-- Select Cruise Line --</option>
                    {cruiseLines.map((line) => (
                      <option key={line.id} value={line.id}>
                        {line.name}
                      </option>
                    ))}
                  </Field>
                  <Form.Control.Feedback type="invalid">
                    <ErrorMessage name="cruiseLineId" />
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
               {shipData?.id ? "Update" : "Save"}
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
};

export default EditShips;
