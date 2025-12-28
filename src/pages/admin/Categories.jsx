import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";

const wrapperData = {
  title: "List Category",
  description: "These are the list of categories.",
  breadcrumb: [
    { label: "Dashboard", to: "/admin" },
    { label: "View All Categories", to: "/admin/categories" },
  ],
};
export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    // fetchCategories();
  }, []);

  async function fetchCategories() {
    // try {
    //   const { data, error } = await supabase
    //     .from("categories")
    //     .select("*")
    //     .order("created_at", { ascending: false });
    //   if (error) throw error;
    //   setCategories(data || []);
    // } catch (error) {
    //   console.error("Error fetching categories:", error);
    // } finally {
    //   setLoading(false);
    // }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // try {
    //   if (editingCategory) {
    //     const { error } = await supabase
    //       .from("categories")
    //       .update(formData)
    //       .eq("id", editingCategory.id);

    //     if (error) throw error;
    //   } else {
    //     const { error } = await supabase.from("categories").insert([formData]);

    //     if (error) throw error;
    //   }

    //   setShowModal(false);
    //   setEditingCategory(null);
    //   setFormData({ name: "", description: "", image_url: "" });
    //   fetchCategories();
    // } catch (error) {
    //   console.error("Error saving category:", error);
    //   alert("Error saving category. Please try again.");
    // }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    // try {
    //   const { error } = await supabase.from("categories").delete().eq("id", id);

    //   if (error) throw error;
    //   fetchCategories();
    // } catch (error) {
    //   console.error("Error deleting category:", error);
    //   alert("Error deleting category. Please try again.");
    // }
  }

  function openEditModal(category) {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
    });
    setShowModal(true);
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //   if (loading) {
  //     return (
  //       <div className="flex items-center justify-center h-64">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  //       </div>
  //     );
  //   }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-heading mb-2">
          Categories
        </h1>
        <p className="text-text-muted">
          Organize your products into categories
        </p>
      </div>

      <div className="bg-surface rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
              size={20}
            />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: "", description: "", image_url: "" });
              setShowModal(true);
            }}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full text-center py-8 text-text-muted">
              No categories found
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-text-muted">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-text-heading mb-2">
                    {category.name}
                  </h3>
                  <p className="text-text-muted text-sm mb-4 line-clamp-2">
                    {category.description || "No description"}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.45)] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-text-heading">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-muted hover:text-text-body"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-heading mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-heading mb-2">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-heading mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition-colors font-semibold"
                >
                  {editingCategory ? "Update Category" : "Add Category"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-text-body py-2 px-4 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
