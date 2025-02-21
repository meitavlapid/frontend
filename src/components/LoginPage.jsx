import { useFormik } from "formik";
import * as yup from "yup";
import { React } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/userServices";
import { toast } from "react-toastify";
import { useUser } from "../hooks/UserContext";

function LoginPage() {
  const { fetchUser } = useUser();

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email().required(),
      password: yup.string().required().min(8),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("🔹 Sending login data:", values); // בדיקה לראות מה נשלח
        const tokenResponse = await loginUser(values); // שליחת הערכים ישירות
        if (tokenResponse) {
          console.log("Login successful:", tokenResponse);
          toast.success("Logged in successfully!", { toastId: "unique-id" });

          await fetchUser();
          navigate("/home");
        } else {
          alert("Login failed: Token not found.");
        }
      } catch (error) {
        console.error("Login error:", error.message || error);
        toast.error("Login failed. Please check your credentials.", {
          toastId: "uniqueId",
        });

        alert(
          error.response?.data?.message ||
            "Login failed: An error occurred. Please check your credentials and try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <>
      <h4 className="display-4 text-center mb-4">Login</h4>

      <form onSubmit={formik.handleSubmit}>
        <div className="form-group mb-4">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="form-control"
            name="email"
            placeholder="Email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-danger">{formik.errors.email}</p>
          )}
        </div>

        <div className="form-group mb-4">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="form-control"
            placeholder="Password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            onBlur={formik.handleBlur}
          />

          {formik.touched.password && formik.errors.password && (
            <p className="text-danger">{formik.errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary mb-4 w-100"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          LOGIN
        </button>
        <br />
        <br />
        <button
          type="button"
          className="btn btn-warning mb-4 w-100 "
          onClick={() => navigate("/Register")}
        >
          REGISTER
        </button>
      </form>
    </>
  );
}

export default LoginPage;
