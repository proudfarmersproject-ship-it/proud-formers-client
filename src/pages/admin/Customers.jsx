import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";
import { Plus, Edit2, Trash2, Search, X, MapPin } from "lucide-react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
  });
  const [addressFormData, setAddressFormData] = useState({
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "USA",
    is_default: false,
  });

  useEffect(() => {
    // fetchCustomers();
  }, []);

  async function fetchCustomers() {
    // try {
    //   const { data, error } = await supabase
    //     .from("customers")
    //     .select("*, addresses(count)")
    //     .order("created_at", { ascending: false });
    //   if (error) throw error;
    //   setCustomers(data || []);
    // } catch (error) {
    //   console.error("Error fetching customers:", error);
    // } finally {
    //   setLoading(false);
    // }
  }

  async function fetchAddresses(customerId) {
    // try {
    //   const { data, error } = await supabase
    //     .from("addresses")
    //     .select("*")
    //     .eq("customer_id", customerId)
    //     .order("is_default", { ascending: false });
    //   if (error) throw error;
    //   setAddresses(data || []);
    // } catch (error) {
    //   console.error("Error fetching addresses:", error);
    // }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // try {
    //   if (editingCustomer) {
    //     const { error } = await supabase
    //       .from("customers")
    //       .update(formData)
    //       .eq("id", editingCustomer.id);

    //     if (error) throw error;
    //   } else {
    //     const { error } = await supabase.from("customers").insert([formData]);

    //     if (error) throw error;
    //   }

    //   setShowModal(false);
    //   setEditingCustomer(null);
    //   setFormData({ email: "", full_name: "", phone: "" });
    //   fetchCustomers();
    // } catch (error) {
    //   console.error("Error saving customer:", error);
    //   alert("Error saving customer. Please try again.");
    // }
  }

  async function handleAddressSubmit(e) {
    e.preventDefault();

    // try {
    //   const { error } = await supabase
    //     .from("addresses")
    //     .insert([{ ...addressFormData, customer_id: selectedCustomer.id }]);

    //   if (error) throw error;

    //   setShowAddressModal(false);
    //   setAddressFormData({
    //     street: "",
    //     city: "",
    //     state: "",
    //     postal_code: "",
    //     country: "USA",
    //     is_default: false,
    //   });
    //   fetchAddresses(selectedCustomer.id);
    // } catch (error) {
    //   console.error("Error saving address:", error);
    //   alert("Error saving address. Please try again.");
    // }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    // try {
    //   const { error } = await supabase.from("customers").delete().eq("id", id);

    //   if (error) throw error;
    //   fetchCustomers();
    // } catch (error) {
    //   console.error("Error deleting customer:", error);
    //   alert("Error deleting customer. Please try again.");
    // }
  }

  async function handleDeleteAddress(id) {
    if (!confirm("Are you sure you want to delete this address?")) return;

    // try {
    //   const { error } = await supabase.from("addresses").delete().eq("id", id);

    //   if (error) throw error;
    //   fetchAddresses(selectedCustomer.id);
    // } catch (error) {
    //   console.error("Error deleting address:", error);
    //   alert("Error deleting address. Please try again.");
    // }
  }

  function openEditModal(customer) {
    setEditingCustomer(customer);
    setFormData({
      email: customer.email,
      full_name: customer.full_name,
      phone: customer.phone || "",
    });
    setShowModal(true);
  }

  async function openAddressesModal(customer) {
    setSelectedCustomer(customer);
    await fetchAddresses(customer.id);
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-3xl font-bold text-text-heading mb-2">Customers</h1>
        <p className="text-text-muted">Manage your customer database</p>
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
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              setEditingCustomer(null);
              setFormData({ email: "", full_name: "", phone: "" });
              setShowModal(true);
            }}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
          >
            <Plus size={20} />
            Add Customer
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Phone
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Addresses
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Joined
                </th>
                <th className="text-left py-3 px-4 font-semibold text-text-heading">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-text-muted">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-100 hover:bg-muted-bg transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-text-heading">
                      {customer.full_name}
                    </td>
                    <td className="py-3 px-4 text-text-body">
                      {customer.email}
                    </td>
                    <td className="py-3 px-4 text-text-body">
                      {customer.phone || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => openAddressesModal(customer)}
                        className="text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                      >
                        <MapPin size={16} />
                        View ({customer.addresses?.[0]?.count || 0})
                      </button>
                    </td>
                    <td className="py-3 px-4 text-text-muted">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(customer)}
                          className="p-2 text-primary hover:bg-primary-light hover:text-white rounded transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.45)] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-text-heading">
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
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
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-heading mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-heading mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition-colors font-semibold"
                >
                  {editingCustomer ? "Update Customer" : "Add Customer"}
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

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-text-heading">
                Addresses for {selectedCustomer.full_name}
              </h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-text-muted hover:text-text-body"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <button
                onClick={() => setShowAddressModal(true)}
                className="mb-4 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Add Address
              </button>

              {addresses.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  No addresses found
                </div>
              ) : (
                <div className="grid gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          {address.is_default && (
                            <span className="inline-block mb-2 px-2 py-1 bg-primary text-white text-xs rounded">
                              Default
                            </span>
                          )}
                          <p className="font-medium text-text-heading">
                            {address.street}
                          </p>
                          <p className="text-text-body">
                            {address.city}, {address.state}{" "}
                            {address.postal_code}
                          </p>
                          <p className="text-text-muted">{address.country}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-text-heading">
                Add New Address
              </h2>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-text-muted hover:text-text-body"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-heading mb-2">
                    Street *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.street}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        street: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-heading mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressFormData.city}
                      onChange={(e) =>
                        setAddressFormData({
                          ...addressFormData,
                          city: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-heading mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressFormData.state}
                      onChange={(e) =>
                        setAddressFormData({
                          ...addressFormData,
                          state: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-heading mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressFormData.postal_code}
                      onChange={(e) =>
                        setAddressFormData({
                          ...addressFormData,
                          postal_code: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-heading mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressFormData.country}
                      onChange={(e) =>
                        setAddressFormData({
                          ...addressFormData,
                          country: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={addressFormData.is_default}
                    onChange={(e) =>
                      setAddressFormData({
                        ...addressFormData,
                        is_default: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_default"
                    className="text-sm font-medium text-text-heading"
                  >
                    Set as default address
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition-colors font-semibold"
                >
                  Add Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
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
