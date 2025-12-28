import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount_percentage: "",
    product_id: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  useEffect(() => {
    // fetchPromotions();
    // fetchProducts();
  }, []);

  async function fetchPromotions() {
    // try {
    //   const { data, error } = await supabase
    //     .from("promotions")
    //     .select("*, products(name, image_url, price)")
    //     .order("created_at", { ascending: false });
    //   if (error) throw error;
    //   setPromotions(data || []);
    // } catch (error) {
    //   console.error("Error fetching promotions:", error);
    // } finally {
    //   setLoading(false);
    // }
  }

  async function fetchProducts() {
    // try {
    //   const { data, error } = await supabase
    //     .from("products")
    //     .select("id, name, price")
    //     .order("name");
    //   if (error) throw error;
    //   setProducts(data || []);
    // } catch (error) {
    //   console.error("Error fetching products:", error);
    // }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // try {
    //   if (editingPromotion) {
    //     const { error } = await supabase
    //       .from("promotions")
    //       .update(formData)
    //       .eq("id", editingPromotion.id);

    //     if (error) throw error;
    //   } else {
    //     const { error } = await supabase.from("promotions").insert([formData]);

    //     if (error) throw error;
    //   }

    //   setShowModal(false);
    //   setEditingPromotion(null);
    //   setFormData({
    //     name: "",
    //     description: "",
    //     discount_percentage: "",
    //     product_id: "",
    //     start_date: "",
    //     end_date: "",
    //     is_active: true,
    //   });
    //   fetchPromotions();
    // } catch (error) {
    //   console.error("Error saving promotion:", error);
    //   alert("Error saving promotion. Please try again.");
    // }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this promotion?")) return;

    // try {
    //   const { error } = await supabase.from("promotions").delete().eq("id", id);

    //   if (error) throw error;
    //   fetchPromotions();
    // } catch (error) {
    //   console.error("Error deleting promotion:", error);
    //   alert("Error deleting promotion. Please try again.");
    // }
  }

  async function toggleActive(id, currentStatus) {
    // try {
    //   const { error } = await supabase
    //     .from("promotions")
    //     .update({ is_active: !currentStatus })
    //     .eq("id", id);
    //   if (error) throw error;
    //   fetchPromotions();
    // } catch (error) {
    //   console.error("Error toggling promotion status:", error);
    //   alert("Error updating promotion status. Please try again.");
    // }
  }

  function openEditModal(promotion) {
    setEditingPromotion(promotion);
    setFormData({
      name: promotion.name,
      description: promotion.description || "",
      discount_percentage: promotion.discount_percentage,
      product_id: promotion.product_id,
      start_date: new Date(promotion.start_date).toISOString().slice(0, 16),
      end_date: new Date(promotion.end_date).toISOString().slice(0, 16),
      is_active: promotion.is_active,
    });
    setShowModal(true);
  }

  const isPromotionActive = (promotion) => {
    if (!promotion.is_active) return false;
    const now = new Date();
    const start = new Date(promotion.start_date);
    const end = new Date(promotion.end_date);
    return now >= start && now <= end;
  };

  const filteredPromotions = promotions.filter(
    (promotion) =>
      promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.products?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          Promotions
        </h1>
        <p className="text-text-muted">
          Manage product discounts and special offers
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
              placeholder="Search promotions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              setEditingPromotion(null);
              setFormData({
                name: "",
                description: "",
                discount_percentage: "",
                product_id: "",
                start_date: "",
                end_date: "",
                is_active: true,
              });
              setShowModal(true);
            }}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
          >
            <Plus size={20} />
            Add Promotion
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Promotion Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Product
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Discount
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Period
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPromotions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-text-muted">
                    No promotions found
                  </td>
                </tr>
              ) : (
                filteredPromotions.map((promotion) => {
                  const active = isPromotionActive(promotion);
                  return (
                    <tr
                      key={promotion.id}
                      className="border-b border-gray-100 hover:bg-muted-bg transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-text-heading">
                        {promotion.name}
                      </td>
                      <td className="py-3 px-4 text-text-body">
                        {promotion.products?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-primary">
                          {promotion.discount_percentage}% OFF
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text-muted text-sm">
                        <div>
                          {new Date(promotion.start_date).toLocaleDateString()}
                        </div>
                        <div>
                          to {new Date(promotion.end_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            toggleActive(promotion.id, promotion.is_active)
                          }
                          className="flex items-center gap-2"
                        >
                          {promotion.is_active ? (
                            <ToggleRight className="text-green-600" size={24} />
                          ) : (
                            <ToggleLeft className="text-gray-400" size={24} />
                          )}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {active ? "Active" : "Inactive"}
                          </span>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(promotion)}
                            className="p-2 text-primary hover:bg-primary-light hover:text-white rounded transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(promotion.id)}
                            className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.45)] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-text-heading">
                {editingPromotion ? "Edit Promotion" : "Add New Promotion"}
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
                    Promotion Name *
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-heading mb-2">
                      Product *
                    </label>
                    <select
                      required
                      value={formData.product_id}
                      onChange={(e) =>
                        setFormData({ ...formData, product_id: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ($
                          {parseFloat(product.price).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-heading mb-2">
                      Discount Percentage *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      required
                      value={formData.discount_percentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_percentage: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-heading mb-2">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-heading mb-2">
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-medium text-text-heading"
                  >
                    Active
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition-colors font-semibold"
                >
                  {editingPromotion ? "Update Promotion" : "Add Promotion"}
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
