import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useUser } from "../hooks/UserContext";
import { updateUser } from "../services/userServices";
import { toast } from "react-toastify";
import "../css/myinfo.css";

function UserProfile() {
  const { user, setUser } = useUser();
  const id = user?._id;
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: {
        first: user?.name?.first || "",
        middle: user?.name?.middle || "",
        last: user?.name?.last || "",
      },
      phone: user?.phone || "",
      image: {
        url: user?.image?.url || "",
        alt: user?.image?.alt || "",
      },
      address: {
        state: user?.address?.state || "",
        country: user?.address?.country || "",
        city: user?.address?.city || "",
        street: user?.address?.street || "",
        houseNumber: user?.address?.houseNumber || "",
        zip: user?.address?.zip || "",
      },
    },
    validationSchema: yup.object({
      name: yup.object({
        first: yup.string().required("First name is required"),
        middle: yup.string().optional(),
        last: yup.string().required("Last name is required"),
      }),
      phone: yup.string().matches(/^\d{10}$/, "Phone must be 10 digits"),

      image: yup.object({
        url: yup.string().url("Invalid URL").required("Image URL is required"),
        alt: yup.string().optional(),
      }),
      address: yup.object({
        state: yup.string().required("State is required"),
        country: yup.string().required("Country is required"),
        city: yup.string().required("City is required"),
        street: yup.string().required("Street is required"),
        houseNumber: yup
          .number()
          .positive("House number must be positive")
          .required("House number is required"),
        zip: yup
          .number()
          .positive("Zip must be positive")
          .required("Zip is required"),
      }),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        console.log("User ID being sent to server:", user.id);
        console.log("Updated Data:", values);
        let userData = {
          name: {
            first: values.name.first,
            middle: values.name.middle || "",
            last: values.name.last,
          },
          phone: values.phone,
          image: {
            url: values.image?.url || "",
            alt: values.image ? values.image.alt : "",
          },
          address: {
            state: values.address.state,
            country: values.address.country,
            city: values.address.city,
            street: values.address.street,
            houseNumber: values.address.houseNumber,
            zip: values.address.zip,
          },
        };

        console.log("Data being sent to server:", userData);
        await updateUser(id, userData);
        setUser((prevUser) => ({
          ...prevUser,
          ...userData,
        }));
        toast.success("Profile updated successfully!", { toastId: "uniqueId" });
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.", {
          toastId: "uniqueId",
        });
      }
      resetForm();
    },
  });

  return (
    <div className="containerinfo mt-4">
      <h1>My Profile</h1>
      {!isEditing ? (
        <div>
          <div>
            <img
              src={user?.image?.url}
              alt={user?.image?.alt || "Profile Picture"}
            />
          </div>
          <p>
            <strong>Full Name:</strong>{" "}
            {`${user?.name?.first} ${user?.name?.middle || ""} ${
              user?.name?.last
            }`}
          </p>
          <p>
            <strong>Phone:</strong> {user?.phone}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {`${user?.address?.street}, ${user?.address?.city}, ${
              user?.address?.state || ""
            }, ${user?.address?.country || ""}, ${
              user?.address?.houseNumber || ""
            }, ${user?.address?.zip || ""}`}
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <h4>Personal Information</h4>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="namefirst"
              className="form-control"
              {...formik.getFieldProps("name.first")}
            />
            {formik.touched.name?.first && formik.errors.name?.first && (
              <p className="text-danger">{formik.errors.name.first}</p>
            )}
          </div>
          <div className="form-group">
            <label>Middle Name</label>
            <input
              type="text"
              name="namemiddle"
              className="form-control"
              {...formik.getFieldProps("name.middle")}
            />
            {formik.touched.name?.middle && formik.errors.name?.middle && (
              <p className="text-danger">{formik.errors.name.middle}</p>
            )}
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="namelast"
              className="form-control"
              {...formik.getFieldProps("name.last")}
            />
            {formik.touched.name?.last && formik.errors.name?.last && (
              <p className="text-danger">{formik.errors.name.last}</p>
            )}
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              {...formik.getFieldProps("phone")}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-danger">{formik.errors.phone}</p>
            )}
          </div>

          <h4>Address Information</h4>
          <div className="form-group">
            <label>Street</label>
            <input
              type="text"
              name="addressstreet"
              className="form-control"
              {...formik.getFieldProps("address.street")}
            />
            {formik.touched.address?.street &&
              formik.errors.address?.street && (
                <p className="text-danger">{formik.errors.address.street}</p>
              )}
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="addresscity"
              className="form-control"
              {...formik.getFieldProps("address.city")}
            />
            {formik.touched.address?.city && formik.errors.address?.city && (
              <p className="text-danger">{formik.errors.address.city}</p>
            )}
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="addressstate"
              className="form-control"
              {...formik.getFieldProps("address.state")}
            />
            {formik.touched.address?.state && formik.errors.address?.state && (
              <p className="text-danger">{formik.errors.address.state}</p>
            )}
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="addresscountry"
              className="form-control"
              {...formik.getFieldProps("address.country")}
            />
            {formik.touched.address?.country &&
              formik.errors.address?.country && (
                <p className="text-danger">{formik.errors.address.country}</p>
              )}
          </div>
          <div className="form-group">
            <label>House Number</label>
            <input
              type="text"
              name="addresshousenumber"
              className="form-control"
              {...formik.getFieldProps("address.houseNumber")}
            />
            {formik.touched.address?.houseNumber &&
              formik.errors.address?.houseNumber && (
                <p className="text-danger">
                  {formik.errors.address.houseNumber}
                </p>
              )}
          </div>
          <div className="form-group">
            <label>Zip</label>
            <input
              type="text"
              name="addresszip"
              className="form-control"
              {...formik.getFieldProps("address.zip")}
            />
            {formik.touched.address?.zip && formik.errors.address?.zip && (
              <p className="text-danger">{formik.errors.address.zip}</p>
            )}
          </div>

          <h4>Image Information</h4>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="image.url"
              className="form-control"
              {...formik.getFieldProps("image.url")}
            />
            {formik.touched.image && formik.errors.image && (
              <p className="text-danger">{formik.errors.image}</p>
            )}
            <label>Image Description </label>
            <input
              type="text"
              name="image.alt"
              className="form-control"
              {...formik.getFieldProps("image.alt")}
            />
          </div>

          <button type="submit" className="btn btn-success mt-3">
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-secondary mt-3 ml-2"
            onClick={() =>
              setIsEditing(false) || setEdit(false) || formik.resetForm()
            }
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default UserProfile;
