import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Save } from "lucide-react";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
import { fetchCategoryDetailsById } from "../../../utils/admin/categories";
import { useAdminProductStore } from "../../../store/admin/AdminProductStore";
export default function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categoryDetail, setCategoryDetail] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const { fetchCategoryById, selectedCategory, loading, error } =
    useAdminProductStore();

  // ✅ FETCH CATEGORY
  useEffect(() => {
    fetchCategoryById(id);
  }, [id]);

  useEffect(() => {
    if (selectedCategory) {
      setCategoryDetail(selectedCategory);
      setForm({
        name: selectedCategory.name || "",
        description: selectedCategory.description || "",
      });
    }
  }, [selectedCategory]);
  console.log(" setCategory details data :", categoryDetail);
  // ✅ LOADING STATE
  if (loading || !categoryDetail) {
    return <div className="p-6">Loading category...</div>;
  }

  // ✅ NOT FOUND STATE
  if (!categoryDetail || error) {
    return <div className="p-6 text-red-600">Category not found</div>;
  }

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Category name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // ------------------------------------
  // Handlers
  // ------------------------------------

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    console.log("Updated Category:", form);

    // TODO: API PUT request here
    setEditMode(false);
  };

  const handleReset = () => {
    setForm({ name: "", description: "" });
    setErrors({});
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    console.log("Deleted Category ID:", id);

    // TODO: API DELETE request here

    navigate("/admin/categories");
  };

  return (
    <div className="categorie-details p-2 md:p-4 mx-auto">
      {/* Header & Actions */}
      {/* HEADER */}
      <div className="md:flex justify-between items-center">
        <AdminHeaderWrapper
          title={`Category #${categoryDetail.id}`}
          description="View / Edit Category details"
          breadcrumb={[
            { label: "Dashboard", to: "/admin" },
            { label: "Categories", to: "/admin/categories" },
            { label: categoryDetail.id },
          ]}
        />

        <div className="flex gap-3 justify-end mb-3 mb:mb-0">
          {!editMode ? (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="border bg-primary-light cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Pencil size={16} /> Edit
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            className="border border-red-500 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
      <div className="w-full mx-auto bg-white shadow p-6 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="category_name" className="block font-medium mb-1">
              Category Name *
            </label>
            <input
              id="category_name"
              type="text"
              disabled={!editMode}
              value={form.name}
              name="name"
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Enter category name"
              className={`w-full p-3 border-2 border-secondary-light rounded-xl focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-primary"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="categorie_description"
              className="block font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="categorie_description"
              value={form.description}
              disabled={!editMode}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Enter description"
              name="description"
              rows="4"
              className="w-full p-3 border-2 border-secondary-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              disabled={!editMode}
              type="submit"
              className="bg-primary cursor-pointer hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
            >
              Save Changes
            </button>

            <button
              type="button"
              disabled={!editMode}
              onClick={handleReset}
              className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg w-full md:w-auto transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
