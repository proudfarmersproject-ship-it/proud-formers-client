import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Save, X, Trash2 } from "lucide-react";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
import DualListBox from "./DualListBox";
import Pagination from "../../../components/admin/Pagination";

// ------------------ Dummy Data ------------------
import allProducts from "../../../utils/admin/allProducts";
import allCategories from "../../../utils/admin/allcategories";
import promotionsData from "../../../utils/admin/promotionsData";

export default function PromotionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const promotion = promotionsData.find((p) => p.id === Number(id));

  if (!promotion)
    return <div className="p-4 text-red-600">Promotion not found</div>;

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    ...promotion,
    product_ids: [],
    category_ids: [],
  });
  const [errors, setErrors] = useState({});
  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const availableProducts = useMemo(() => {
    return allProducts.filter(
      (p) =>
        (!form.product_ids.includes(p.id) &&
          p.name.toLowerCase().includes(productSearch.toLowerCase())) ||
        p.id.toString().includes(productSearch)
    );
  }, [form.product_ids, productSearch]);

  const availableCategories = useMemo(() => {
    return allCategories.filter(
      (c) =>
        (!form.category_ids.includes(c.id) &&
          c.name.toLowerCase().includes(categorySearch.toLowerCase())) ||
        c.id.toString().includes(categorySearch)
    );
  }, [form.category_ids, categorySearch]);

  const selectProduct = (product) => {
    setForm((prev) => ({
      ...prev,
      product_ids: [...prev.product_ids, product.id],
    }));
  };

  const removeProduct = (productId) => {
    setForm((prev) => ({
      ...prev,
      product_ids: prev.product_ids.filter((id) => id !== productId),
    }));
  };

  const selectCategory = (category) => {
    setForm((prev) => ({
      ...prev,
      category_ids: [...prev.category_ids, category.id],
    }));
  };

  const removeCategory = (categoryId) => {
    setForm((prev) => ({
      ...prev,
      category_ids: prev.category_ids.filter((id) => id !== categoryId),
    }));
  };

  const handleFieldChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Promotion name required";
    if (!form.discount_value) e.discount_value = "Discount required";
    if (!form.start_date || !form.end_date)
      e.date = "Start and End dates required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    console.log("Updated Promotion:", form);
    setEditMode(false);
  };

  const handleReset = () => {
    setForm({ ...promotion, product_ids: [], category_ids: [] });
    setErrors({});
  };

  const handleDelete = () => {
    if (!confirm("Delete this promotion?")) return;
    console.log("Deleted Promotion", id);
    navigate("/admin/promotions");
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <AdminHeaderWrapper
        title={`Promotion #${promotion.id}`}
        description="View / Edit promotion details"
        breadcrumb={[
          { label: "Promotions", to: "/admin/promotions" },
          { label: promotion.id },
        ]}
      />

      {/* Header Actions */}
      <div className="flex justify-between items-center">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="border border-primary text-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-light hover:text-white"
          >
            <Pencil size={18} /> Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
          >
            <Save size={18} /> Save
          </button>
        )}
        <button
          onClick={handleDelete}
          className="border border-red-500 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Trash2 size={18} /> Delete
        </button>
      </div>

      <form
        className="bg-white p-6 rounded-2xl shadow space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Promotion Name *</label>
            <input
              type="text"
              disabled={!editMode}
              value={form.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className={`w-full p-3 rounded-xl border-2 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="font-medium">Discount Value *</label>
            <input
              type="number"
              disabled={!editMode}
              value={form.discount_value}
              onChange={(e) =>
                handleFieldChange("discount_value", e.target.value)
              }
              className={`w-full p-3 rounded-xl border-2 ${
                errors.discount_value ? "border-red-500" : "border-gray-300"
              }`}
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
            onChange={(e) =>
              handleFieldChange("minimum_order_value", e.target.value)
            }
            className="w-full p-3 rounded-xl border-2 border-gray-300"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Start Date *</label>
            <input
              type="date"
              disabled={!editMode}
              value={form.start_date}
              onChange={(e) => handleFieldChange("start_date", e.target.value)}
              className={`w-full p-3 rounded-xl border-2 ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          <div>
            <label className="font-medium">End Date *</label>
            <input
              type="date"
              disabled={!editMode}
              value={form.end_date}
              onChange={(e) => handleFieldChange("end_date", e.target.value)}
              className={`w-full p-3 rounded-xl border-2 ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>
        </div>
        {(form.promotion_type === "PRODUCT" ||
          form.promotion_type === "CATEGORY") && (
          <div className="space-y-6">
            <h3 className="font-semibold mb-2">
              Select{" "}
              {form.promotion_type === "PRODUCT" ? "Products" : "Categories"}
            </h3>
            <DualListBox
              availableItems={
                form.promotion_type === "PRODUCT" ? allProducts : allCategories
              }
              selectedItems={
                form.promotion_type === "PRODUCT"
                  ? allProducts.filter((p) => form.product_ids.includes(p.id))
                  : allCategories.filter((c) =>
                      form.category_ids.includes(c.id)
                    )
              }
              setSelectedItems={(items) => {
                if (form.promotion_type === "PRODUCT") {
                  setForm((prev) => ({
                    ...prev,
                    product_ids: items.map((i) => i.id),
                  }));
                } else {
                  setForm((prev) => ({
                    ...prev,
                    category_ids: items.map((i) => i.id),
                  }));
                }
              }}
              idKey="id"
              nameKey="name"
              imageKey="images"
              //   skuKey="variants?.[0]?.sku"
              height="400px"
              disabled={!editMode}
            />
          </div>
        )}

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            disabled={!editMode}
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-dark"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={!editMode}
            className="bg-gray-200 px-6 py-3 rounded-xl hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
