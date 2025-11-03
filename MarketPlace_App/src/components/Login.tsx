import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import logicShip from "../assets/login.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik } from "formik";
import * as Yup from "yup";
import { useToast } from "../common/Toaster";

const LoginSchema = Yup.object().shape({
  userName: Yup.string()
    .email("Invalid UserName")
    .required("User name is required"),
  password: Yup.string()
    .min(6, "Too short! Minimum 6 characters.")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (
    values: { userName: string; password: string },
    { setSubmitting }: any
  ) => {
    try {
      await login(values.userName, values.password);
      if (!user) return;
      if (user.role === "Admin" || user.role === "Agent")
        navigate("/dashboard");
    } catch (err) {
      showToast("Invalid username or password", "error");
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
                {/* <img
                  src="https://market.int2cruises.com/images/Int2cruises_logo_up.svg"
                  alt="Logo"
                  className="img-fluid mb-3"
                  style={{ width: 150 }}
                /> */}
                <h2 className="fw-bold text-primary fs-1 mb-1">Welcome</h2>
                <p className="text-primary fs-6">Login with Email</p>
              </div>

              <Formik
                initialValues={{ userName: "", password: "" }}
                validationSchema={LoginSchema}
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
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="userName"
                        name="userName"
                        value={values.userName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(errors.userName && touched.userName)}
                        disabled={isSubmitting}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.userName}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="password">
                      <Form.Label>Password</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!(errors.password && touched.password)}
                          disabled={isSubmitting}
                          required
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: "0.75rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#555",
                          }}
                        >
                          {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>

                    {/* Forgot Password */}
                    <div className="text-end mb-3">
                      <a
                        href="/forgot-password"
                        className="text-decoration-none text-primary fw-semibold"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Forgot Password?
                      </a>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 mb-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "LOGIN"}
                    </Button>

                    {/* Register Section */}
                    <div className="text-center mt-2">
                      <span className="me-1">Don't have an account?</span>
                      <a
                        href="/registration"
                        className="text-decoration-none fw-bold text-primary"
                      >
                        Register
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

export default Login;
