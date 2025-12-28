import { useEffect, useState } from "react";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
import DualListBox from "./DualListBox";
import allCategories from "../../../utils/admin/allcategories";
import allProducts from "../../../utils/admin/allProducts";

// ---- Dummy Categories & Products ----
// const categories = [
//   { id: 1, name: "Rice Products" },
//   { id: 2, name: "Sweeteners" },
// ];

// const products = [
//   { id: 1, name: "Onions", sku: "VEG-1" },
//   { id: 2, name: "Premium Rice", sku: "RICE-2" },
//   { id: 3, name: "Chicken Breast", sku: "MEAT-3" },
// ];
const categories = [...allCategories];
const products = [...allProducts];

const wrapperData = {
  title: "Create Promotion / Coupon",
  description: "Create product, category, cart or shipping promotions",
  breadcrumb: [
    { label: "Dashboard", to: "/admin" },
    { label: "Promotions", to: "/admin/promotions" },
    { label: "Create", to: "/admin/promotions/new" },
  ],
};

export default function CreateNewPromotion() {
  const [form, setForm] = useState({
    name: "",
    promotion_type: "",
    discount_type: "",
    discount_value: "",
    minimum_order_value: "",
    start_date: "",
    end_date: "",
    product_ids: [],
    category_ids: [],
  });

  const [errors, setErrors] = useState({});

  // ---------------- Handlers ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const err = {};

    if (!form.name.trim()) err.name = "Promotion name is required";
    if (!form.promotion_type) err.promotion_type = "Promotion type is required";
    if (!form.discount_type) err.discount_type = "Discount type is required";
    if (!form.discount_value) err.discount_value = "Discount value is required";
    if (!form.start_date) err.start_date = "Start date is required";
    if (!form.end_date) err.end_date = "End date is required";

    if (form.promotion_type === "PRODUCT" && form.product_ids.length === 0) {
      err.product_ids = "Select at least one product";
    }

    if (form.promotion_type === "CATEGORY" && form.category_ids.length === 0) {
      err.category_ids = "Select at least one category";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      ...form,
      discount_value: Number(form.discount_value),
    };

    console.log("CREATE PROMOTION PAYLOAD 👉", payload);
    alert("Promotion created successfully! (check console)");
  };

  const handleReset = () => {
    setErrors({});
    setForm((prev) => ({
      name: "",
      promotion_type: "",
      discount_type: "",
      discount_value: "",
      minimum_order_value: "",
      start_date: "",
      end_date: "",
      product_ids: [],
      category_ids: [],
    }));
    console.log(" The Rest Button got clicked");
  };
  useEffect(() => {
    console.log("form :", form);
  }, [form]);
  // ---------------- Render ----------------
  return (
    <>
      <AdminHeaderWrapper {...wrapperData} />

      <div className="bg-white p-6 rounded-2xl shadow space-y-6">
        {/* Promotion Name */}
        <div>
          <label className="font-medium">Promotion Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border-2 p-3 rounded-xl"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Promotion Type */}
        <div>
          <label className="font-medium">Promotion Type *</label>
          <select
            name="promotion_type"
            value={form.promotion_type}
            onChange={handleChange}
            className="w-full border-2 p-3 rounded-xl"
          >
            <option value="">Select Type</option>
            <option value="PRODUCT">Product</option>
            <option value="CATEGORY">Category</option>
            <option value="CART">Cart</option>
            <option value="SHIPPING">Shipping</option>
          </select>
          {errors.promotion_type && (
            <p className="text-red-500 text-sm">{errors.promotion_type}</p>
          )}
        </div>

        {/* Discount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Discount Type *</label>
            <select
              name="discount_type"
              value={form.discount_type}
              onChange={handleChange}
              className="w-full border-2 p-3 rounded-xl"
            >
              <option value="">Select</option>
              <option value="PERCENTAGE">Percentage</option>
              <option value="FLAT">Flat</option>
            </select>
            {errors.discount_type && (
              <p className="text-red-500 text-sm">{errors.discount_type}</p>
            )}
          </div>

          <div>
            <label className="font-medium">Discount Value *</label>
            <input
              type="number"
              name="discount_value"
              value={form.discount_value}
              onChange={handleChange}
              className="w-full border-2 p-3 rounded-xl"
            />
            {errors.discount_value && (
              <p className="text-red-500 text-sm">{errors.discount_value}</p>
            )}
          </div>
        </div>
        <div>
          <label className="font-medium">Minimum Order Value</label>
          <input
            type="number"
            name="minimum_order_value"
            value={form.minimum_order_value}
            onChange={handleChange}
            className="w-full border-2 p-3 rounded-xl"
          />
        </div>
        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Start Date *</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="w-full border-2 p-3 rounded-xl"
            />
            {errors.start_date && (
              <p className="text-red-500 text-sm">{errors.start_date}</p>
            )}
          </div>

          <div>
            <label className="font-medium">End Date *</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="w-full border-2 p-3 rounded-xl"
            />
            {errors.end_date && (
              <p className="text-red-500 text-sm">{errors.end_date}</p>
            )}
          </div>
        </div>

        {/* PRODUCT Promotion */}
        {form.promotion_type === "PRODUCT" && (
          <div>
            <p className="font-medium mb-2">Select Products *</p>

            <DualListBox
              availableItems={products}
              selectedItems={products.filter((p) =>
                form.product_ids.includes(p.id)
              )}
              setSelectedItems={(items) =>
                setForm((prev) => ({
                  ...prev,
                  product_ids: items.map((i) => i.id),
                }))
              }
              idKey="id"
              nameKey="name"
              height="320px"
            />

            {errors.product_ids && (
              <p className="text-red-500 text-sm">{errors.product_ids}</p>
            )}
          </div>
        )}

        {/* CATEGORY Promotion */}
        {form.promotion_type === "CATEGORY" && (
          <div>
            <p className="font-medium mb-2">Select Categories *</p>

            <DualListBox
              availableItems={categories}
              selectedItems={categories.filter((c) =>
                form.category_ids.includes(c.id)
              )}
              setSelectedItems={(items) =>
                setForm((prev) => ({
                  ...prev,
                  category_ids: items.map((i) => i.id),
                }))
              }
              idKey="id"
              nameKey="name"
              height="320px"
            />

            {errors.category_ids && (
              <p className="text-red-500 text-sm">{errors.category_ids}</p>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-dark"
          >
            Create Promotion
          </button>
          <button
            type="reset"
            onClick={handleReset}
            className="bg-secondary text-white ms-3 px-8 py-3 rounded-xl hover:bg-secondary-dark"
          >
            Reset Promotion
          </button>
        </div>
      </div>
    </>
  );
}
