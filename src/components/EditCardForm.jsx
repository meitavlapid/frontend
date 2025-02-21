import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { getCardId, updateCard } from "../services/cardsService";
import { toast } from "react-toastify";

function EditCardForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const card = await getCardId(id);
        setInitialValues({
          title: card.title || "",
          subtitle: card.subtitle || "",
          description: card.description || "",
          phone: card.phone || "",
          email: card.email || "",
          web: card.web || "",
          image: {
            url: card.image?.url || "",
            alt: card.image?.alt || "",
          },
          address: {
            state: card.address?.state || "",
            country: card.address?.country || "",
            city: card.address?.city || "",
            street: card.address?.street || "",
            houseNumber: card.address?.houseNumber || "",
            zip: card.address?.zip || "",
          },
        });
      } catch (error) {
        console.error("Error fetching card:", error);
        alert("Failed to load card details.");
      }
    };

    fetchCard();
  }, [id]);

  const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    subtitle: yup.string().required("Subtitle is required"),
    description: yup.string().required("Description is required"),
    phone: yup.number().required("Phone is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    web: yup.string().url("Invalid URL").required("Web is required"),
    image: yup.object({
      url: yup
        .string()
        .url("Invalid Image URL")
        .required("Image URL is required"),
      alt: yup.string().optional(),
    }),

    address: yup.object({
      state: yup.string().required("State is required"),
      country: yup.string().required("Country is required"),
      city: yup.string().required("City is required"),
      street: yup.string().required("Street is required"),
      houseNumber: yup.number().required("House Number is required"),
      zip: yup.number().required("ZIP is required"),
    }),
  });

  const formik = useFormik({
    initialValues: initialValues || {
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
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        let cardData = {
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
        };

        console.log("Request Data:", cardData, id);
        await updateCard(id, cardData);
        toast.success("Card edited successfully!", { toastId: "uniqueId" });
        navigate("/mycards");
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        console.log("Request Data:", cardData);
        console.error("Error updating card:", error);
        toast.error("Failed to edit card. Please try again later.", {
          toastId: "uniqueId",
        });
      }
    },
  });

  if (!initialValues) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <h2 className="mb-4">Edit Card</h2>
      <form onSubmit={formik.handleSubmit} className="form-control">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-control"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="invalid-feedback">{formik.errors.title}</div>
          )}
          <label htmlFor="subtitle">Subtitle:</label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            value={formik.values.subtitle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-control"
          />
          {formik.touched.subtitle && formik.errors.subtitle && (
            <div className="invalid-feedback">{formik.errors.subtitle}</div>
          )}
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-control"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="invalid-feedback">{formik.errors.description}</div>
          )}
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-control"
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="invalid-feedback">{formik.errors.phone}</div>
          )}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-control"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="invalid-feedback">{formik.errors.email}</div>
          )}
          <label htmlFor="web">Web:</label>
          <input
            type="text"
            id="web"
            name="web"
            value={formik.values.web}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-control"
          />
          {formik.touched.web && formik.errors.web && (
            <div className="invalid-feedback">{formik.errors.web}</div>
          )}
          <label htmlFor="image.url">Image URL:</label>
          <input
            type="text"
            id="image.url"
            name="image.url"
            value={formik.values.image?.url || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`form-control ${
              formik.touched.image?.url && formik.errors.image?.url
                ? "is-invalid"
                : ""
            }`}
          />
          {formik.touched.image?.url && formik.errors.image?.url && (
            <div className="invalid-feedback">{formik.errors.image?.url}</div>
          )}
          {["state", "country", "city", "street", "houseNumber", "zip"].map(
            (field) => (
              <div key={field} className="mb-3">
                <label htmlFor={`address.${field}`} className="form-label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={`address.${field}`}
                  name={`address.${field}`}
                  type={
                    field === "houseNumber" || field === "zip"
                      ? "number"
                      : "text"
                  }
                  className="form-control"
                  value={formik.values.address[field] || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.address?.[field] &&
                  formik.errors.address?.[field] && (
                    <p className="text-danger">
                      {formik.errors.address[field]}
                    </p>
                  )}
              </div>
            )
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCardForm;
