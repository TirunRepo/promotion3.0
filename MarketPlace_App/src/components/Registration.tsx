import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import AuthService from "./Services/AuthService";
import { useToast } from "../common/Toaster";
import { useNavigate } from "react-router-dom";

const roles = ["Agent", "Admin"] as const;

interface RegistrationValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  companyName: string;
  country: string;
  state: string;
  city: string;
}

const validationSchema = Yup.object()
  .shape({
    fullName: Yup.string()
      .min(2, "Full name must be at least 2 characters")
      .required("Full name is required"),
    password: Yup.string()
      .min(6, "Password should be at least 6 characters")
      .required("Password is required"),
    role: Yup.string().required("Role is required"),
    phoneNumber: Yup.string(),
    email: Yup.string().email("Invalid email address"),
    companyName: Yup.string().required("Company name is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
  })
  .test(
    "emailOrPhone",
    "Either Phone Number or Email is required",
    (values) => !!(values?.email || values?.phoneNumber)
  );

const Registration: React.FC = () => {
  const { showToast } = useToast(); // Use your custom toast
  const navigate = useNavigate();
  const initialValues: RegistrationValues = {
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    companyName: "",
    country: "",
    state: "",
    city: "",
  };

  const handleSubmit = async (
    values: RegistrationValues,
    { setSubmitting, resetForm }: FormikHelpers<RegistrationValues>
  ) => {
    try {
      const response = await AuthService.register(values);
      if (response?.message) {
        resetForm();
        navigate("/login");
        showToast(response?.message, "success");
      } else {
        showToast(response?.message || "Registration failed", "error");
      }
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "1rem",
      }}
    >
      <Card
        className="shadow-sm rounded-4 p-4 border-0"
        style={{ maxWidth: "900px", width: "100%" }}
      >
        <div className="text-center mb-4">
          {/* <img
            src="https://market.int2cruises.com/images/Int2cruises_logo_up.svg"
            alt="Logo"
            className="img-fluid mb-2"
            style={{ width: 120 }}
          /> */}
          <h3
            className="fw-bold"
            style={{ color: "#2A6ED9", fontSize: "1.4rem" }}
          >
            Register
          </h3>
          <p className="text-muted fs-7 mt-1 mb-0">Create your new account</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
            isSubmitting,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              {/* Full Name & Email */}
              <Row className="g-2">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">
                      Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="Your full name"
                      value={values.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.fullName && !!errors.fullName}
                      size="sm"
                      className="rounded-3"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.fullName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.email && !!errors.email}
                      size="sm"
                      className="rounded-3"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Phone & Password */}
              <Row className="g-2 mt-2">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">
                      Phone Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      placeholder="Your phone number"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.phoneNumber && !!errors.phoneNumber}
                      size="sm"
                      className="rounded-3"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phoneNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.password && !!errors.password}
                      size="sm"
                      className="rounded-3"
                      autoComplete="new-password"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Role & Company */}
              <Row className="g-2 mt-2">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={values.role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.role && !!errors.role}
                      size="sm"
                      className="rounded-3"
                    >
                      <option value="" disabled>
                        Select role
                      </option>
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.role}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">
                      Company Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="companyName"
                      placeholder="Your company name"
                      value={values.companyName}
                      // onChange={handleChange}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Capitalize first letter only
                        const formattedValue =
                          inputValue.charAt(0).toUpperCase() +
                          inputValue.slice(1);
                        handleChange({
                          target: {
                            name: e.target.name,
                            value: formattedValue,
                          },
                        });
                      }}
                      onBlur={handleBlur}
                      isInvalid={touched.companyName && !!errors.companyName}
                      size="sm"
                      className="rounded-3"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.companyName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Country, State, City */}
              <Row className="g-2 mt-2">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">
                      Country
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="country"
                      placeholder="Your country"
                      value={values.country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.country && !!errors.country}
                      size="sm"
                      className="rounded-3"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.country}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">State</Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      placeholder="Your state"
                      value={values.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.state && !!errors.state}
                      size="sm"
                      className="rounded-3"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.state}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="Your city"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.city && !!errors.city}
                      size="sm"
                      className="rounded-3"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Button
                type="submit"
                disabled={isSubmitting}
                size="sm"
                className="w-100 rounded-3 mt-3"
                style={{
                  backgroundColor: "#2A6ED9",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </Container>
  );
};

export default Registration;
