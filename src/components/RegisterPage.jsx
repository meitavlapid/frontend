import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { registerUser } from "../services/userServices";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function RegisterPage() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: {
        first: "",
        middle: "",
        last: "",
      },
      phone: "",
      email: "",
      password: "",
      image: null,
      address: {
        state: "",
        country: "",
        city: "",
        street: "",
        houseNumber: "",
        zip: "",
      },
      isBusiness: false,
      role: "Regular",
    },
    validationSchema: yup.object({
      name: yup.object({
        first: yup.string().required("First name is required"),
        middle: yup.string(),
        last: yup.string().required("Last name is required"),
      }),
      phone: yup
        .string()
        .matches(/^\d{10}$/, "Phone must be 10 digits")
        .required("Phone is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(
          /[@$!%*?&]/,
          "Password must contain at least one special character"
        )
        .required("Password is required"),
      address: yup.object({
        state: yup.string().required("State is required"),
        country: yup.string().required("Country is required"),
        city: yup.string().required("City is required"),
        street: yup.string().required("Street is required"),
        houseNumber: yup
          .number()
          .typeError("House number must be a number")
          .required("House number is required"),
        zip: yup
          .number()
          .typeError("Zip code must be a number")
          .required("Zip code is required"),
      }),
      isBusiness: yup.boolean().required("Business status is required"),
    }),
    onSubmit: async (values) => {
      try {
        const userData = {
          name: {
            first: values.name.first,
            middle: values.name.middle || "",
            last: values.name.last,
          },
          phone: values.phone,
          email: values.email,
          password: values.password,
          image: {
            url: values.image?.url || "https://via.placeholder.com/150",
            alt: values.image?.alt || "User profile image",
          },
          address: {
            state: values.address.state,
            country: values.address.country,
            city: values.address.city,
            street: values.address.street,
            houseNumber: parseInt(values.address.houseNumber, 10),
            zip: parseInt(values.address.zip, 10),
          },
          isBusiness: values.isBusiness,
          role: "Regular",
        };
        console.log(
          "Data being sent to server:",
          JSON.stringify(values, null, 2)
        );

        console.log("📤 Sending user data:", values);

        const response = await registerUser(values); // ✅ תקבל את ה-response
        console.log("🚀 Server Response:", response);

        if (response?.message === "User created successfully") {
          toast.success("✅ Registration successful!", { toastId: "uniqueId" });
          navigate("/home");
        } else {
          console.warn("⚠️ Unexpected response format:", response);
          toast.error("Unexpected response format. Please contact support.");
        }
      } catch (error) {
        console.error("❌ Error during registration:", error);
        toast.error(
          error.response?.data?.message || "Registration failed. Try again."
        );
      }
    },
  });

  return (
    <>
      <h4 className="display-4">Register</h4>
      <form className="mt-3" onSubmit={formik.handleSubmit}>
        <div className="form-group mb-3 row">
          <div className="col">
            <label htmlFor="name.first" className="form-label">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="name.first"
              className="form-control form-control-lg"
              placeholder="First name"
              {...formik.getFieldProps("name.first")}
            />
            {formik.touched.name?.first && formik.errors.name?.first && (
              <div className="error text-danger">
                {formik.errors.name.first}
              </div>
            )}
          </div>
          <div className="col">
            <label htmlFor="name.middel" className="form-label">
              Middle Name
            </label>
            <input
              type="text"
              id="middlename"
              name="name.middel"
              className="form-control form-control-lg"
              placeholder="Middle name"
              {...formik.getFieldProps("name.middel")}
            />
          </div>
          <div className="col">
            <label htmlFor="name.last" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="name.last"
              className="form-control form-control-lg"
              placeholder="Last name"
              {...formik.getFieldProps("name.last")}
            />
            {formik.touched.name?.last && formik.errors.name?.last && (
              <div className="error text-danger">{formik.errors.name.last}</div>
            )}
          </div>
        </div>

        <div className="form-group mb-3 row">
          <div className="col">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="form-control form-control-lg"
              placeholder="Phone number"
              {...formik.getFieldProps("phone")}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="error text-danger">{formik.errors.phone}</div>
            )}
          </div>
          <div className="col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control form-control-lg"
              placeholder="name@example.com"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error text-danger">{formik.errors.email}</div>
            )}
          </div>
          <div className="col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control form-control-lg"
              placeholder="Enter password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="error text-danger">{formik.errors.password}</div>
            )}
          </div>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="image">Image URL</label>
          <input
            type="url"
            id="image"
            name="image.url"
            className="form-control form-control-lg"
            alt="User Image"
            {...formik.getFieldProps("image.url")}
          />
          {formik.touched.image && formik.errors.image && (
            <div className="error text-danger">{formik.errors.image}</div>
          )}
        </div>

        <div className="form-group mb-3 row">
          <h4>Address</h4>
          <div className="col">
            <label htmlFor="address.state">State</label>
            <input
              type="text"
              id="state"
              name="address.state"
              className="form-control form-control-lg"
              placeholder="Enter state"
              {...formik.getFieldProps("address.state")}
            />
            {formik.touched.address?.state && formik.errors.address?.state && (
              <div className="error text-danger">
                {formik.errors.address.state}
              </div>
            )}
          </div>
          <div className="col">
            <label htmlFor="address.country">Country</label>
            <input
              type="text"
              id="country"
              name="address.country"
              className="form-control form-control-lg"
              placeholder="Enter country"
              {...formik.getFieldProps("address.country")}
            />
            {formik.touched.address?.country &&
              formik.errors.address?.country && (
                <div className="error text-danger">
                  {formik.errors.address.country}
                </div>
              )}
          </div>
          <div className="col">
            <label htmlFor="address.city">City</label>
            <input
              type="text"
              id="city"
              name="address.city"
              className="form-control form-control-lg"
              placeholder="Enter city"
              {...formik.getFieldProps("address.city")}
            />
            {formik.touched.address?.city && formik.errors.address?.city && (
              <div className="error text-danger">
                {formik.errors.address.city}
              </div>
            )}
          </div>
        </div>

        <div className="form-group mb-3 row">
          <div className="col">
            <label htmlFor="address.street">Street</label>
            <input
              type="text"
              id="street"
              name="address.street"
              className="form-control form-control-lg"
              placeholder="Enter street"
              {...formik.getFieldProps("address.street")}
            />
            {formik.touched.address?.street &&
              formik.errors.address?.street && (
                <div className="error text-danger">
                  {formik.errors.address.street}
                </div>
              )}
          </div>
          <div className="col">
            <label htmlFor="address.houseNumber">House Number</label>
            <input
              type="text"
              id="houseNumber"
              name="address.houseNumber"
              className="form-control form-control-lg"
              placeholder="Enter house number"
              {...formik.getFieldProps("address.houseNumber")}
            />
            {formik.touched.address?.houseNumber &&
              formik.errors.address?.houseNumber && (
                <div className="error text-danger">
                  {formik.errors.address.houseNumber}
                </div>
              )}
          </div>
          <div className="col">
            <label htmlFor="zip">Zip</label>
            <input
              type="text"
              id="zip"
              name="address.zip"
              className="form-control form-control-lg"
              placeholder="Enter zip"
              {...formik.getFieldProps("address.zip")}
            />
            {formik.touched.zip && formik.errors.zip && (
              <div className="error text-danger">
                {formik.errors.address.zip}
              </div>
            )}
          </div>
        </div>

        <label htmlFor="isBusiness">Are you a business user?</label>
        <select
          id="isBusiness"
          name="isBusiness"
          className="form-control form-control-lg"
          {...formik.getFieldProps("isBusiness")}
          onChange={(event) => {
            const value = event.target.value === "true";
            formik.setFieldValue("isBusiness", value);
          }}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <button
          className="btn btn-primary mt-4 btn-block  w-100"
          type="submit"
          disabled={!formik.isValid || !formik.dirty}
        >
          Register
        </button>
        <Link to="/login">Alredy have an account? Login</Link>
      </form>
    </>
  );
}

export default RegisterPage;
