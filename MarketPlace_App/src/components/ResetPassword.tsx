import React, { useState } from "react";
import { Container, Card, Form, Button, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import AuthService from "./Services/AuthService";
import { useToast } from "../common/Toaster";
import { Formik } from "formik";
import * as Yup from "yup";

// Validation schema
const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const { token: paramToken } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const token = searchParams.get("token") || paramToken;

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (!token) {
      showToast("Invalid or expired reset token.", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await AuthService.resetPassword(token, values.password);

      if (response?.data?.status) {
        showToast("Password reset successfully! Please log in again.", "success");
        navigate("/login");
      } else {
        showToast(response?.message || "Failed to reset password.", "error");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      showToast("Something went wrong. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  // console.log("Reset token:", token);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #3B82F6, #2563EB)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container className="d-flex justify-content-center">
        <Card
          style={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: "15px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Card.Body className="text-center p-4">
            <h3 className="text-primary mb-2">Reset Password</h3>
            <p className="text-muted mb-4">Enter your new password below.</p>

            <Formik
              initialValues={{ password: "", confirmPassword: "" }}
              validationSchema={ResetPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => (
                <Form onSubmit={handleSubmit}>
                  {/* New Password */}
                  <Form.Group className="mb-3" controlId="newPassword">
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(errors.password && touched.password)}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="mb-4" controlId="confirmPassword">
                    <InputGroup>
                      <Form.Control
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(errors.confirmPassword && touched.confirmPassword)}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowConfirm(!showConfirm)}
                        type="button"
                      >
                        {showConfirm ? <FaEye /> : <FaEyeSlash />}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    style={{ padding: "10px", fontWeight: "500" }}
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "RESET PASSWORD"}
                  </Button>

                  <a href="/login" className="text-decoration-none text-primary">
                    Back to Login
                  </a>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ResetPassword;
