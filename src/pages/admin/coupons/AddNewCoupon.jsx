import { useState } from "react";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";

const wrapperData = {
  title: "New Coupon",
  description: "Create a new promo code for discounts.",
  breadcrumb: [
    { label: "Dashboard", to: "/admin" },
    { label: "Coupons", to: "/admin/coupons" },
    { label: "New Coupon", to: "/admin/coupons/new" },
  ],
};

export default function AddNewCoupon() {
  const initialFormData = {
    code: "",
    description: "",
    discount_type: "PERCENTAGE",
    discount_value: "",
    min_order_value: "",
    max_discount: "",
    usage_limit: "",
    per_user_limit: 1,
    start_date: "",
    end_date: "",
    is_active: true,
  };

  const [form, setForm] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  /* ---------------- Helpers ---------------- */
  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  /* ---------------- Validation ---------------- */
  const validate = () => {
    const e = {};

    if (!form.code.trim()) e.code = "Coupon code is required";
    if (!form.discount_value || form.discount_value <= 0)
      e.discount_value = "Discount value must be greater than 0";

    if (!form.start_date) e.start_date = "Start date required";
    if (!form.end_date) e.end_date = "End date required";

    if (
      form.start_date &&
      form.end_date &&
      new Date(form.start_date) >= new Date(form.end_date)
    ) {
      e.end_date = "End date must be after start date";
    }

    if (form.discount_type === "PERCENTAGE" && form.discount_value > 100) {
      e.discount_value = "Percentage cannot exceed 100";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Final Coupon Payload:", {
      ...form,
      discount_value: Number(form.discount_value),
      min_order_value: form.min_order_value
        ? Number(form.min_order_value)
        : null,
      max_discount: form.max_discount ? Number(form.max_discount) : null,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
      per_user_limit: Number(form.per_user_limit),
    });
  };

  const handleReset = () => {
    setForm(initialFormData);
    setErrors({});
  };

  return (
    <>
      <AdminHeaderWrapper {...wrapperData} />

      <div className="w-full mx-auto bg-white shadow p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-10">
          <h2 className="text-xl font-semibold">Add New Coupon</h2>

          {/* ---------------- Coupon Info ---------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Coupon Code *</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) =>
                  updateField("code", e.target.value.toUpperCase())
                }
                className={`w-full p-3 rounded-xl border-2 ${
                  errors.code ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.code && (
                <p className="text-red-500 text-sm">{errors.code}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Status *</label>
              <select
                value={form.is_active}
                onChange={(e) =>
                  updateField("is_active", e.target.value === "true")
                }
                className="w-full p-3 rounded-xl border-2 border-gray-300"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Description</label>
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-gray-300"
              />
            </div>
          </div>

          {/* ---------------- Discount ---------------- */}
          <div className="bg-gray-50 p-5 rounded-2xl space-y-4">
            <h3 className="font-semibold">Discount Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1">
                  Discount Type *
                </label>
                <select
                  value={form.discount_type}
                  onChange={(e) => updateField("discount_type", e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-gray-300"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FLAT">Flat Amount</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Discount Value *
                </label>
                <input
                  type="number"
                  value={form.discount_value}
                  onChange={(e) =>
                    updateField("discount_value", e.target.value)
                  }
                  className={`w-full p-3 rounded-xl border-2 ${
                    errors.discount_value ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.discount_value && (
                  <p className="text-red-500 text-sm">
                    {errors.discount_value}
                  </p>
                )}
              </div>

              {form.discount_type === "PERCENTAGE" && (
                <div>
                  <label className="block font-medium mb-1">Max Discount</label>
                  <input
                    type="number"
                    value={form.max_discount}
                    onChange={(e) =>
                      updateField("max_discount", e.target.value)
                    }
                    className="w-full p-3 rounded-xl border-2 border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ---------------- Conditions ---------------- */}
          <div className="bg-gray-50 p-5 rounded-2xl space-y-4">
            <h3 className="font-semibold">Usage Conditions</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1">
                  Min Order Value
                </label>
                <input
                  type="number"
                  value={form.min_order_value}
                  onChange={(e) =>
                    updateField("min_order_value", e.target.value)
                  }
                  className="w-full p-3 rounded-xl border-2 border-gray-300"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Usage Limit</label>
                <input
                  type="number"
                  value={form.usage_limit}
                  onChange={(e) => updateField("usage_limit", e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-gray-300"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Per User Limit</label>
                <input
                  type="number"
                  value={form.per_user_limit}
                  onChange={(e) =>
                    updateField("per_user_limit", e.target.value)
                  }
                  className="w-full p-3 rounded-xl border-2 border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* ---------------- Validity ---------------- */}
          <div className="bg-gray-50 p-5 rounded-2xl space-y-4">
            <h3 className="font-semibold">Validity Period</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Start Date *</label>
                <input
                  type="datetime-local"
                  value={form.start_date}
                  onChange={(e) => updateField("start_date", e.target.value)}
                  className={`w-full p-3 rounded-xl border-2 ${
                    errors.start_date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.start_date && (
                  <p className="text-red-500 text-sm">{errors.start_date}</p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">End Date *</label>
                <input
                  type="datetime-local"
                  value={form.end_date}
                  onChange={(e) => updateField("end_date", e.target.value)}
                  className={`w-full p-3 rounded-xl border-2 ${
                    errors.end_date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.end_date && (
                  <p className="text-red-500 text-sm">{errors.end_date}</p>
                )}
              </div>
            </div>
          </div>

          {/* ---------------- Actions ---------------- */}
          <div>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-xl"
            >
              Save Coupon
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="ml-2 bg-gray-200 px-6 py-3 rounded-xl"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
