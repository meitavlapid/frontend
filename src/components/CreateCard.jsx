import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { addCard } from "../services/cardsService";
import { toast } from "react-toastify";
import { useUser } from "../hooks/UserContext";
import { useState } from "react";
import { useEffect } from "react";

function CreateCard() {
  const navigate = useNavigate();
  const { user } = useUser(); // קבלת נתוני המשתמש
  const [businessNumber, setBusinessNumber] = useState("");

  // הגדרה קבועה של useEffect מחוץ לתנאים
  useEffect(() => {
    if (user?.bizNumber) {
      setBusinessNumber(user.bizNumber);
    }
  }, [user]);
  const formik = useFormik({
    initialValues: {
      title: "",
      subtitle: "",
      description: "",
      phone: "",
      email: "",
      web: "",
      image: {
        url: "",
        alt: "",
      },
      address: {
        state: "",
        country: "",
        city: "",
        street: "",
        houseNumber: "",
        zip: "",
      },
      bizNumber: businessNumber,
      likes: [],
      userid: "",
      createdAt: "",
      isBusiness: true,
    },
    validationSchema: yup.object({
      title: yup.string().min(2).max(256).required("Title is required"),
      subtitle: yup.string().min(2).max(256).required("Subtitle is required"),
      description: yup
        .string()
        .min(2)
        .max(1024)
        .required("Description is required"),
      phone: yup
        .string()
        .min(9)
        .max(11)
        .matches(/^[0-9]+$/, "Phone number must contain only digits")
        // .test("phone", "Phone number must start with 0", (value) =>
        //   value.startsWith("0")

        .required("Phone number is required"),
      email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
      web: yup.string().url("Invalid URL").required("Web URL is required"),
      image: yup
        .object({
          url: yup
            .string()
            .url("Invalid Image URL")
            .required("Image URL is required"),
          alt: yup
            .string()
            .max(256, "Alt text must be less than 256 characters"),
        })
        .default(() => ({ url: "", alt: "" })),
      address: yup.object({
        state: yup.string().optional(),
        country: yup.string().min(2).required("Country is required"),
        city: yup.string().min(2).required("City is required"),
        street: yup.string().min(2).required("Street is required"),
        houseNumber: yup
          .number()
          .positive("House number must be positive")
          .required("House number is required"),
        zip: yup
          .number()
          .positive("Zip must be positive")
          .required("Zip code is required"),
      }),
    }),
    onSubmit: async (values) => {
      try {
        const cardData = {
          title: values.title,
          subtitle: values.subtitle,
          description: values.description,
          phone: values.phone,
          email: values.email,
          web: values.web,
          image: {
            alt: values.image?.alt,
            url: values.image?.url,
          },
          address: {
            state: values.address?.state,
            country: values.address?.country,
            city: values.address?.city,
            street: values.address?.street,
            houseNumber: values.address?.houseNumber,
            zip: values.address?.zip,
          },
          bizNumber: businessNumber,
        };

        console.log("Data being sent to server:", cardData);
        await addCard(cardData);
        toast.success("Card created successfully!", { toastId: "uniqueId" });
        navigate("/mycards");
      } catch (error) {
        console.error("Error creating card:", error.message || error);
        alert(
          error.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    },
  });

  return (
    <>
      <h4 className="display-4">Create Card</h4>
      <form className="mt-3" onSubmit={formik.handleSubmit}>
        <div className="form-group mb-3 row">
          <div className="col">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control form-control-lg"
              placeholder="title"
              {...formik.getFieldProps("title")}
            />
            {formik.touched.title && formik.errors.title && (
              <div className="error text-danger">{formik.errors.title}</div>
            )}
          </div>
          <div className="col">
            <label htmlFor="subtitle" className="form-label">
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              className="form-control form-control-lg"
              placeholder="subtitle"
              {...formik.getFieldProps("subtitle")}
            />
            {formik.touched.subtitle && formik.errors.subtitle && (
              <div className="error text-danger">{formik.errors.subtitle}</div>
            )}
          </div>
          <div className="col">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              className="form-control form-control-lg"
              placeholder="description"
              {...formik.getFieldProps("description")}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="error text-danger">
                {formik.errors.description}
              </div>
            )}
          </div>
        </div>

        <div className="form-group mb-3 row">
          <div className="col">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="tel"
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
            <label htmlFor="web">Web</label>
            <input
              type="url"
              id="web"
              name="web"
              className="form-control form-control-lg"
              placeholder="https://example.com"
              {...formik.getFieldProps("web")}
            />
            {formik.touched.web && formik.errors.web && (
              <div className="error text-danger">{formik.errors.web}</div>
            )}
          </div>
        </div>

        <div className="form-group mb-3 row">
          <div className="col">
            <label htmlFor="image.url">Image URL</label>
            <input
              type="url"
              id="image.url"
              name="image.url"
              className="form-control form-control-lg"
              placeholder="https://example.com/image.jpg"
              {...formik.getFieldProps("image.url")}
            />
            {formik.touched.image?.url && formik.errors.image?.url && (
              <div className="error text-danger">{formik.errors.image.url}</div>
            )}
          </div>
          <div className="col">
            <label htmlFor="image.alt">Image Description</label>
            <input
              type="text"
              id="image.alt"
              name="image.alt"
              className="form-control form-control-lg"
              placeholder="Image description"
              {...formik.getFieldProps("image.alt")}
            />
            {formik.touched.image?.alt && formik.errors.image?.alt && (
              <div className="error text-danger">{formik.errors.image.alt}</div>
            )}
          </div>
        </div>
        <div className="form-group mb-3 row">
          <h4>Address</h4>
          <div className="col">
            <label htmlFor="address.state">State</label>
            <input
              type="text"
              id="address.state"
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
              id="address.country"
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
              id="address.city"
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
              id="address.street"
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
              type="number"
              id="address.houseNumber"
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
              type="number"
              id="address.zip"
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
        <div className="form-group mb-3">
          <label htmlFor="bizNumber" className="form-label">
            Business Number
          </label>
          <input
            type="text"
            id="bizNumber"
            name="bizNumber"
            className="form-control"
            value={businessNumber}
            readOnly
          />
        </div>

        <button
          className="btn btn-primary mt-4 btn-block w-100"
          type="submit"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          {formik.isSubmitting ? "Submitting..." : "Add Card"}
        </button>
      </form>
    </>
  );
}

export default CreateCard;
