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
  Copy,
  Check,
} from "lucide-react";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_percentage: "",
    discount_amount: "",
    max_uses: "",
    valid_from: "",
    valid_until: "",
    is_active: true,
  });

  useEffect(() => {
    //   fetchCoupons();
  }, []);

  async function fetchCoupons() {
    // try {
    //   const { data, error } = await supabase
    //     .from("coupons")
    //     .select("*")
    //     .order("created_at", { ascending: false });
    //   if (error) throw error;
    //   setCoupons(data || []);
    // } catch (error) {
    //   console.error("Error fetching coupons:", error);
    // } finally {
    //   setLoading(false);
    // }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const submitData = {
      ...formData,
      discount_percentage: formData.discount_percentage
        ? parseFloat(formData.discount_percentage)
        : null,
      discount_amount: formData.discount_amount
        ? parseFloat(formData.discount_amount)
        : null,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : 0,
    };

    // try {
    //   if (editingCoupon) {
    //     const { error } = await supabase
    //       .from("coupons")
    //       .update(submitData)
    //       .eq("id", editingCoupon.id);

    //     if (error) throw error;
    //   } else {
    //     const { error } = await supabase.from("coupons").insert([submitData]);

    //     if (error) throw error;
    //   }

    //   setShowModal(false);
    //   setEditingCoupon(null);
    //   setFormData({
    //     code: "",
    //     description: "",
    //     discount_percentage: "",
    //     discount_amount: "",
    //     max_uses: "",
    //     valid_from: "",
    //     valid_until: "",
    //     is_active: true,
    //   });
    //   fetchCoupons();
    // } catch (error) {
    //   console.error("Error saving coupon:", error);
    //   alert("Error saving coupon. Please try again.");
    // }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    // try {
    //   const { error } = await supabase.from("coupons").delete().eq("id", id);

    //   if (error) throw error;
    //   fetchCoupons();
    // } catch (error) {
    //   console.error("Error deleting coupon:", error);
    //   alert("Error deleting coupon. Please try again.");
    // }
  }

  async function toggleActive(id, currentStatus) {
    // try {
    //   const { error } = await supabase
    //     .from("coupons")
    //     .update({ is_active: !currentStatus })
    //     .eq("id", id);
    //   if (error) throw error;
    //   fetchCoupons();
    // } catch (error) {
    //   console.error("Error toggling coupon status:", error);
    //   alert("Error updating coupon status. Please try again.");
    // }
  }

  function openEditModal(coupon) {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discount_percentage: coupon.discount_percentage || "",
      discount_amount: coupon.discount_amount || "",
      max_uses: coupon.max_uses || "",
      valid_from: new Date(coupon.valid_from).toISOString().slice(0, 16),
      valid_until: new Date(coupon.valid_until).toISOString().slice(0, 16),
      is_active: coupon.is_active,
    });
    setShowModal(true);
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  const isCouponValid = (coupon) => {
    if (!coupon.is_active) return false;
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = new Date(coupon.valid_until);
    const hasUsesLeft =
      coupon.max_uses === 0 || coupon.used_count < coupon.max_uses;
    return now >= validFrom && now <= validUntil && hasUsesLeft;
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-3xl font-bold text-text-heading mb-2">Coupons</h1>
        <p className="text-text-muted">
          Manage discount coupons and promo codes
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
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setFormData({
                code: "",
                description: "",
                discount_percentage: "",
                discount_amount: "",
                max_uses: "",
                valid_from: "",
                valid_until: "",
                is_active: true,
              });
              setShowModal(true);
            }}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
          >
            <Plus size={20} />
            Add Coupon
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCoupons.length === 0 ? (
            <div className="col-span-full text-center py-8 text-text-muted">
              No coupons found
            </div>
          ) : (
            filteredCoupons.map((coupon) => {
              const valid = isCouponValid(coupon);
              const usagePercentage =
                coupon.max_uses > 0
                  ? (coupon.used_count / coupon.max_uses) * 100
                  : 0;

              return (
                <div
                  key={coupon.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-xl font-bold text-primary bg-primary-light bg-opacity-10 px-3 py-1 rounded">
                          {coupon.code}
                        </code>
                        <button
                          onClick={() => copyCode(coupon.code)}
                          className="p-1 text-text-muted hover:text-primary transition-colors"
                          title="Copy code"
                        >
                          {copiedCode === coupon.code ? (
                            <Check size={18} className="text-green-600" />
                          ) : (
                            <Copy size={18} />
                          )}
                        </button>
                      </div>
                      <p className="text-text-muted text-sm mb-2">
                        {coupon.description || "No description"}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleActive(coupon.id, coupon.is_active)}
                      className="flex items-center"
                    >
                      {coupon.is_active ? (
                        <ToggleRight className="text-green-600" size={28} />
                      ) : (
                        <ToggleLeft className="text-gray-400" size={28} />
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted text-sm">Discount:</span>
                      <span className="font-semibold text-primary">
                        {coupon.discount_percentage
                          ? `${coupon.discount_percentage}%`
                          : `$${parseFloat(coupon.discount_amount || 0).toFixed(
                              2
                            )}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted text-sm">
                        Valid Period:
                      </span>
                      <span className="text-text-body text-sm">
                        {new Date(coupon.valid_from).toLocaleDateString()} -{" "}
                        {new Date(coupon.valid_until).toLocaleDateString()}
                      </span>
                    </div>
                    {coupon.max_uses > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-text-muted text-sm">
                            Usage:
                          </span>
                          <span className="text-text-body text-sm">
                            {coupon.used_count} / {coupon.max_uses}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              usagePercentage >= 100
                                ? "bg-red-600"
                                : usagePercentage >= 75
                                ? "bg-yellow-600"
                                : "bg-green-600"
                            }`}
                            style={{
                              width: `${Math.min(usagePercentage, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        valid
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {valid ? "Valid" : "Invalid"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="p-2 text-primary hover:bg-primary-light hover:text-white rounded transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.45)] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-text-heading">
                {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
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
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
                    placeholder="e.g., SAVE20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-heading mb-2">
                    Description
                  </label>
                  <textarea
                    rows="2"
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
                      Discount Percentage
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discount_percentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_percentage: e.target.value,
                          discount_amount: "",
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-heading mb-2">
                      Discount Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.discount_amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_amount: e.target.value,
                          discount_percentage: "",
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 10.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-heading mb-2">
                    Maximum Uses (0 = unlimited)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.max_uses}
                    onChange={(e) =>
                      setFormData({ ...formData, max_uses: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-heading mb-2">
                      Valid From *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.valid_from}
                      onChange={(e) =>
                        setFormData({ ...formData, valid_from: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-heading mb-2">
                      Valid Until *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.valid_until}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          valid_until: e.target.value,
                        })
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
                  {editingCoupon ? "Update Coupon" : "Add Coupon"}
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
