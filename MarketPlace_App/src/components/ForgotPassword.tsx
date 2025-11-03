import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Formik } from "formik";
import logicShip from "../assets/login.png";
import AuthService from "./Services/AuthService";
import { useToast } from "../common/Toaster";

const ForgotPassword: React.FC = () => {
  const { showToast } = useToast();

  const handleLogin = async (
    values: { email: string },
    { setSubmitting, resetForm }: any
  ) => {
    try {
      setSubmitting(true);
      const response = await AuthService.forgotPassword(values.email);

      if (response.success) {
        showToast(response.message || "Password reset link sent!", "success");
        resetForm();
      } else {
        showToast(response.message || "Email not found.", "error");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      alert("An error occurred while sending reset link.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid className="p-0 min-vh-100">
      <Row className="g-0 min-vh-100">
        <Col
          md={6}
          className="d-none d-md-flex align-items-center justify-content-center"
          style={{
            background: "linear-gradient(135deg, #1576f2 0%, #57c6fd 100%)",
          }}
        >
          <img
            src={logicShip}
            alt="Cruise Ship"
            className="img-fluid"
            style={{
              maxWidth: 480,
              borderRadius: "1.5rem",
              background: "#fff",
              padding: "1rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          />
        </Col>
        <Col
          xs={12}
          md={6}
          className="d-flex align-items-center justify-content-center bg-white"
        >
          <Card
            className="border-0 shadow-lg w-100 mx-3"
            style={{ maxWidth: 420, borderRadius: "18px" }}
          >
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary fs-2 mb-1">
                  Reset Your Password
                </h2>
                <p className="text-primary fs-6">
                  Enter your registered email and we'll send you a password
                  reset link.
                </p>
              </div>

              <Formik
                initialValues={{ email: "" }}
                validate={(values) => {
                  const errors: any = {};
                  if (!values.email) {
                    errors.email = "Email is required";
                  } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                      values.email
                    )
                  ) {
                    errors.email = "Invalid email address";
                  }
                  return errors;
                }}
                onSubmit={handleLogin}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(errors.email && touched.email)}
                        disabled={isSubmitting}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 mb-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "SEND RESET LINK"}
                    </Button>

                    <div className="text-center mt-2">
                      <a
                        href="/login"
                        className="text-decoration-none fw-bold text-primary"
                      >
                        Back to Login
                      </a>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
