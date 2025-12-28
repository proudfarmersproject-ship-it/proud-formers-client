import { useState, useEffect } from "react";
import { Upload, X, Plus, Trash2 } from "lucide-react";
import StatusModal from "../../../components/admin/StatusModal";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
import { useAdminProductStore } from "../../../store/admin/AdminProductStore";
const wrapperData = {
  title: "New Product",
  description: "Add a new product by filling the form below.",
  breadcrumb: [
    { label: "Dashboard", to: "/admin" },
    { label: "Products", to: "/admin/products" },
    { label: "New Product", to: "/admin/products/new" },
  ],
};
export default function AddProductForm() {
  const initialFormData = {
    name: "",
    category_id: "",
    description: "",
    is_active: true,
    stock_quantity: "",
    stock_unit: "kg",
    variants: [
      {
        variant_name: "",
        regular_price: "",
        stock_quantity: "",
        unit: "",
      },
    ],
    images: [],
  };
  const [form, setForm] = useState(initialFormData);

  const [errors, setErrors] = useState({});
  const {
    fetchCategories,
    categoriesData,
    addProduct,
    loading,
    error,
    successMessage,
    clearStatus,
  } = useAdminProductStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  /* -------------------- Helpers -------------------- */
  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const updateVariant = (index, field, value) => {
    const updated = [...form.variants];
    let newValue = value;
    if (
      field === "regular_price" ||
      field === "stock_quantity" ||
      field === "discounted_price"
    ) {
      if (value.trim() === "") {
        newValue = null;
      } else {
        newValue = +newValue;
        if (isNaN(newValue)) {
          newValue = null;
        }
      }
    }
    updated[index][field] = newValue;
    setForm({ ...form, variants: updated });
  };
  const addVariant = () => {
    setForm({
      ...form,
      variants: [
        ...form.variants,
        {
          variant_name: "",
          regular_price: "",
          stock_quantity: "",
          unit: "",
        },
      ],
    });
  };

  const removeVariant = (index) => {
    setForm({
      ...form,
      variants: form.variants.filter((_, i) => i !== index),
    });
  };
  const handleReset = () => {
    console.log("Reset Button Got clicked");
    setForm(initialFormData);
    setErrors({});
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isPrimary: false,
    }));

    setForm((prev) => {
      const combined = [...prev.images, ...newImages];

      // If no primary exists, set first image as primary
      if (!combined.some((img) => img.isPrimary)) {
        combined[0].isPrimary = true;
      }

      return {
        ...prev,
        images: combined,
      };
    });
  };

  const setPrimaryImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);

      // If primary was removed, assign first image as primary
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }

      return {
        ...prev,
        images: updated,
      };
    });
  };

  // ------------------ Validation ------------------
  const validate = () => {
    const e = {};
    const variantErrors = []; // Array to hold validation errors for each variant

    // 1. Validate top-level fields
    if (!form.name.trim()) e.name = "Product name required";
    if (!form.category_id) e.category_id = "Category required";
    if (
      form.stock_quantity === undefined ||
      form.stock_quantity === null ||
      form.stock_quantity < 0 ||
      !form.stock_quantity
    )
      e.stock_quantity = "Stock required (must be 0 or greater)";
    if (form.images.length === 0) e.images = "At least one image required";

    // 2. Validate Variants Array presence
    if (!form.variants || form.variants.length === 0) {
      e.variants = "At least one variant required";
      // CRITICAL: Exit here if the array itself is missing/empty,
      // as the map loop below would crash otherwise.
      setErrors({ ...e });
      return false;
    } else {
      // 3. Validate individual variants and populate variantErrors array
      console.log("formm :", form);
      form.variants.forEach((v, i) => {
        const err = {};

        if (!v.variant_name || !v.variant_name.trim())
          err.variant_name = "Variant name required";
        if (
          v.regular_price === undefined ||
          v.regular_price === null ||
          v.regular_price < 0 ||
          !v.regular_price
        )
          err.regular_price = "Regular price required (must be 0 or greater)";
        if (
          v.stock_quantity === undefined ||
          v.stock_quantity === null ||
          v.stock_quantity < 0 ||
          !v.stock_quantity
        )
          err.stock_quantity = "Stock required (must be 0 or greater)";
        if (!v.unit || !v.unit.trim()) err.unit = "Unit required";
        // if (!v.sku || !v.sku.trim()) err.sku = "SKU required";
        // if (!v.status) err.status = "Status required";
        // Always push the error object (even if empty) to maintain index alignment
        variantErrors.push(err);
      });

      // 4. Check if any variant had actual errors
      const hasVariantErrors = variantErrors.some(
        (err) => Object.keys(err).length > 0
      );

      // 5. If there are variant errors, attach them and a general message
      if (hasVariantErrors) {
        e.variants = "Fix errors in variants";
        e.variantErrors = variantErrors; // Store the array only if needed
      }
    }

    setErrors({ ...e });
    console.log("errors :", e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const convertApiImages = form.images.map((img, index) => ({
      id: `PIM-${Date.now()}-${index}`, // Adding index ensures uniqueness
      image_path: img.url, // for json-server (file upload ignored)
      alt_text: img.altText || "",
      is_primary: img.isPrimary,
    }));
    const convertApiVariants = form.variants.map((v, index) => ({
      id: `PV-${Date.now()}-${index}`, // Adding index ensures uniqueness
      variant_name: v.variant_name,
      variant_price: Number(v.regular_price),
      variant_quantity: Number(v.stock_quantity),
      quantity_unit: v.unit,
    }));

    const selectedCategory = categoriesData.find(
      (c) => c.id === form.category_id
    );
    const convertApiCategorie = {
      id: selectedCategory.id,
      name: selectedCategory.name,
      description: selectedCategory.description,
    };

    const payload = {
      id: "P00" + Date.now(),
      name: form.name,
      description: form.description,
      stock_quantity: Number(form.stock_quantity),
      stock_unit: form.stock_unit,
      created_at: "2023-12-01T12:00:00Z",
      updated_at: "2023-12-01T12:00:00Z",
      is_active: form.is_active,
      category_id: selectedCategory.id,
      product_variants: convertApiVariants,
      product_images: convertApiImages,
      categorie_details: convertApiCategorie,
    };
    try {
      await addProduct(payload); // Added await
      console.log("Payload added ");
      setTimeout(() => {
        clearStatus();
        handleReset();
      }, 2000);
      // Optional: Reset form only on success
      // handleReset();
    } catch (err) {
      console.error("Submission failed", err);
    }
  };

  console.log("Success Message :", successMessage);
  return (
    <>
      {/* Optimized Status Modal */}
      {(successMessage || error) && (
        <StatusModal
          key={successMessage ? `success-${Date.now()}` : `error-${Date.now()}`}
          message={successMessage || error}
          type={successMessage ? "success" : "error"}
          onClose={clearStatus}
        />
      )}
      <AdminHeaderWrapper
        title={wrapperData.title}
        description={wrapperData.description}
        breadcrumb={wrapperData.breadcrumb}
      />
      <div className="w-full mx-auto bg-white shadow p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-10">
          <h2 className="text-xl font-semibold">Add New Product</h2>

          {/* ---------------- Product Info ---------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="new_product_name"
                className="block font-medium mb-1"
              >
                Product Name *
              </label>
              <input
                id="new_product_name"
                type="text"
                name="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={`w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary-light border-2 ${
                  errors.name ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="new_product_category"
                className="block font-medium mb-1"
              >
                Category *
              </label>
              <select
                id="new_product_category"
                name="category_id"
                value={form.category_id}
                onChange={(e) => updateField("category_id", e.target.value)}
                className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-primary-light focus:outline-none border-2  ${
                  errors.category_id
                    ? "border-red-500"
                    : "border-[var(--color-border-color)]"
                }`}
              >
                <option value="">Please select the categoriy</option>
                {categoriesData.map((itm, i) => (
                  <option key={i} value={itm.id}>
                    {itm.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category_id}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="new_product_description"
                className="block font-medium mb-1"
              >
                Description
              </label>
              <textarea
                id="new_product_description"
                rows="4"
                name="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full p-3 rounded-xl focus:ring-2 focus:ring-primary-light focus:ring-primary focus:outline-none border-2 border-[var(--color-border-color)]"
              />
            </div>
            <div>
              <label
                htmlFor="new_product_quantity"
                className="block font-medium mb-1"
              >
                Stock Unit *
              </label>
              <input
                id="new_product_quantity"
                type="number"
                name="stock_quantity"
                placeholder="Stock Quantity"
                value={form.stock_quantity ?? ""}
                onChange={(e) => updateField("stock_quantity", e.target.value)}
                className={`p-2 rounded-lg focus:ring-2 focus:ring-primary-light focus:outline-none border-2  ${
                  errors.stock_quantity
                    ? "border-red-500"
                    : "border-[var(--color-border-color)]"
                }`}
              />
              {errors.stock_quantity && (
                <p className="text-red-500 text-xs">{errors.stock_quantity}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="new_product_unit"
                className="block font-medium mb-1"
              >
                Stock Unit *
              </label>
              <select
                id="new_product_unit"
                value={form.stock_unit}
                name="stock_unit"
                onChange={(e) => updateField("stock_unit", e.target.value)}
                className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-primary-light focus:outline-none border-2  ${
                  errors.is_active
                    ? "border-red-500"
                    : "border-[var(--color-border-color)]"
                }`}
              >
                <option value="kg">Kg</option>
                <option value="gm">gm</option>
                <option value="lt">Lt</option>
                <option value="ml">ml</option>
                <option value="other">others</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="new_product_status"
                className="block font-medium mb-1"
              >
                Status *
              </label>
              <select
                id="new_product_status"
                value={form.is_active}
                name="is_active"
                onChange={(e) =>
                  updateField("is_active", e.target.value === "true")
                }
                className={`w-full p-3 rounded-xl focus:ring-2 focus:ring-primary-light focus:outline-none border-2  ${
                  errors.is_active
                    ? "border-red-500"
                    : "border-[var(--color-border-color)]"
                }`}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* ---------------- Variants ---------------- */}
          <div className="bg-gray-50 p-5 rounded-2xl space-y-5">
            <h3 className="font-semibold">Product Variants *</h3>

            {errors.variants && (
              <p className="text-red-500 text-sm">{errors.variants}</p>
            )}

            {form.variants.map((variant, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
              >
                <div>
                  <input
                    type="text"
                    placeholder="Variant Name"
                    name="variant_name"
                    value={variant.variant_name}
                    onChange={(e) =>
                      updateVariant(index, "variant_name", e.target.value)
                    }
                    className={`p-2 rounded-lg focus:ring-2 focus:ring-primary-light focus:outline-none border-2  ${
                      errors.variantErrors?.[index]?.variant_name
                        ? "border-red-500"
                        : "border-[var(--color-border-color)]"
                    }`}
                  />
                  {errors.variantErrors?.[index]?.variant_name && (
                    <p className="text-red-500 text-xs">
                      {errors.variantErrors[index].variant_name}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Regular Price"
                    name="regular_price"
                    value={variant.regular_price ?? ""}
                    onChange={(e) =>
                      updateVariant(index, "regular_price", e.target.value)
                    }
                    className={`p-2 rounded-lg focus:ring-2 focus:ring-primary-light focus:outline-none border-2  ${
                      errors.variantErrors?.[index]?.regular_price
                        ? "border-red-500"
                        : "border-[var(--color-border-color)]"
                    }`}
                  />
                  {errors.variantErrors?.[index]?.regular_price && (
                    <p className="text-red-500 text-xs">
                      {errors.variantErrors[index].regular_price}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    name="stock_quantity"
                    placeholder="Stock Quantity"
                    value={variant.stock_quantity ?? ""}
                    onChange={(e) =>
                      updateVariant(index, "stock_quantity", e.target.value)
                    }
                    className={`p-2 rounded-lg focus:ring-2 focus:ring-primary-light focus:outline-none border-2  ${
                      errors.variantErrors?.[index]?.stock_quantity
                        ? "border-red-500"
                        : "border-[var(--color-border-color)]"
                    }`}
                  />
                  {errors.variantErrors?.[index]?.stock_quantity && (
                    <p className="text-red-500 text-xs">
                      {errors.variantErrors[index].stock_quantity}
                    </p>
                  )}
                </div>
                <div>
                  <select
                    placeholder="Unit (kg, g, l, other)"
                    name="unit"
                    onChange={(e) =>
                      updateVariant(index, "unit", e.target.value)
                    }
                    className={`p-2 rounded-lg focus:ring-2 focus:ring-primary-light focus:outline-none border-2  ${
                      errors.variantErrors?.[index]?.unit
                        ? "border-red-500"
                        : "border-[var(--color-border-color)]"
                    }`}
                  >
                    <option value="">Please select the Unit</option>
                    <option value="kg">Kg</option>
                    <option value="gm">gm</option>
                    <option value="lt">Lt</option>
                    <option value="ml">ml</option>
                    <option value="other">others</option>
                  </select>

                  {errors.variantErrors?.[index]?.unit && (
                    <p className="text-red-500 text-xs">
                      {errors.variantErrors[index].unit}
                    </p>
                  )}
                </div>
                {/* <div>
                  <select
                    name="status"
                    value={variant.status}
                    onChange={(e) =>
                      updateVariant(index, "status", e.target.value)
                    }
                    className="p-2 rounded-lg focus:ring-2 focus:ring-primary-light focus:outline-none border-2 border-[var(--color-border-color)]"
                  >
                    <option value="available">Available</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div> */}
                {/* <div>
                  <input
                    type="text"
                    placeholder="SKU"
                    name="sku"
                    value={variant.sku}
                    onChange={(e) =>
                      updateVariant(index, "sku", e.target.value)
                    }
                    className={`p-2 rounded-lg focus:ring-2 focus:ring-primary-light focus:outline-none border-2 ${
                      errors.variantErrors?.[index]?.sku
                        ? "border-red-500"
                        : "border-[var(--color-border-color)]"
                    }`}
                  />
                  {errors.variantErrors?.[index]?.sku && (
                    <p className="text-red-500 text-xs">
                      {errors.variantErrors[index].sku}
                    </p>
                  )}
                </div> */}
                {form.variants.length > 1 && (
                  <div>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="flex space-between p-3 text-red-500 hover:bg-red-100 p-1 rounded-full"
                    >
                      <Trash2 size={16} className="mt-1 mx-2" />{" "}
                      <span>Remove Variant</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-2 text-primary"
            >
              <Plus size={16} /> Add Variant
            </button>
          </div>

          {/* ---------------- Images ---------------- */}
          <div className="bg-gray-50 p-5 rounded-2xl space-y-4">
            <h3 className="font-semibold">Product Images *</h3>

            {errors.images && (
              <p className="text-red-500 text-sm">{errors.images}</p>
            )}

            <label
              htmlFor="new_product_img"
              className={`flex flex-col items-center justify-center h-32 border-2 border-dashed hover:bg-gray-100 rounded-xl cursor-pointer ${
                errors.images ? "border-red-500" : "border-secondary-light"
              }`}
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm">Click to upload images</span>
              <input
                id="new_product_img"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            {form.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {form.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img.url} alt="preview" className="rounded-xl" />

                    {/* Primary Badge */}
                    {img.isPrimary && (
                      <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                        Primary
                      </span>
                    )}

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>

                    {/* Set Primary */}
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-xs py-1 rounded opacity-0 group-hover:opacity-100 transition"
                      >
                        Set as Primary
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200
    ${
      loading
        ? "bg-primary/50 text-white/90 animate-pulse cursor-wait"
        : "bg-primary hover:bg-primary-dark text-white active:scale-95"
    }`}
          >
            {loading ? "Adding Product..." : "Save Product"}
          </button>
          <button
            type="reset"
            onClick={handleReset}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 ml-2 px-6 py-3 rounded-xl transition-colors"
          >
            Reset
          </button>
        </form>
      </div>
    </>
  );
}
