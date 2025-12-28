import { useState } from "react";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";

const wrapperData = {
  title: "New Category",
  description: "Add a new product category by filling the form below.",
  breadcrumb: [
    { label: "Dashboard", to: "/admin" },
    { label: "Categories", to: "/admin/categories" },
    { label: "New Category", to: "/admin/categories/new" },
  ],
};
export default function AddNewCategory() {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Category name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    console.log("Submitting:", form);
  };

  const handleReset = () => {
    setForm({ name: "", description: "" });
    setErrors({});
  };

  return (
    <>
      <AdminHeaderWrapper
        title={wrapperData.title}
        description={wrapperData.description}
        breadcrumb={wrapperData.breadcrumb}
      />
      <div className="w-full mx-auto bg-white shadow p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="category_new_name"
              className="block font-medium mb-1"
            >
              Category Name *
            </label>
            <input
              id="category_new_name"
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Enter category name"
              name="name"
              className={`p-2 w-full rounded-lg focus:ring-2 focus:outline-none focus:outline-none border-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-400"
                  : "border-[var(--color-border-color)] focus:ring-primary-light"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          {/* Description */}
          <div>
            <label
              htmlFor="category_new_description"
              className="block font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="category_new_description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Enter description"
              name="description"
              rows="4"
              className={`p-2 w-full rounded-lg focus:ring-2 focus:ring-primary-light focus:outline-none border-2 border-[var(--color-border-color)]`}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
            >
              Add Category
            </button>

            <button
              type="reset"
              onClick={handleReset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg w-full md:w-auto transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
