// src/pages/admin/customers/CustomerDetails.jsx
import { useParams, useNavigate, data } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { Pencil, Save, Trash2 } from "lucide-react";
import OrderCartSection from "./OrderCartSection";
import allCustomers from "../../../utils/admin/allCustomers";
import { cartItems, productVariants } from "../../../utils/admin/customerCarts";
import Pagination from "../../../components/admin/Pagination";
import StatusModal from "../../../components/admin/StatusModal";
import { useAdminCustomerStore } from "../../../store/admin/AdminCustomerStore";
import AdminHeaderWrapper from "../../../components/admin/AdminHeaderWrapper";
// import {
//   fetchCustomerById,
//   fetchCartItemsByUserId,
// } from "../../../utils/admin/customers";
/* ---------------- MOCK ORDERS ---------------- */
const orders = [
  {
    id: "ORD-1001",
    date: "2025-02-10",
    amount: 1299,
    status: "delivered",
    payment: "UPI",
  },
  {
    id: "ORD-1002",
    date: "2025-02-14",
    amount: 599,
    status: "pending",
    payment: "COD",
  },
  {
    id: "ORD-1003",
    date: "2025-02-18",
    amount: 2499,
    status: "cancelled",
    payment: "Card",
  },
  {
    id: "ORD-1004",
    date: "2025-03-01",
    amount: 899,
    status: "delivered",
    payment: "UPI",
  },
  {
    id: "ORD-1005",
    date: "2025-03-05",
    amount: 1599,
    status: "pending",
    payment: "Card",
  },
  {
    id: "ORD-1006",
    date: "2025-03-10",
    amount: 2999,
    status: "delivered",
    payment: "UPI",
  },
];
export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ---------------- BASIC STATE ---------------- */
  const {
    selectedCustomer,
    error,
    successMessage,
    loading,
    fetchCustomerById,
  } = useAdminCustomerStore();
  const [cartItems, setCartItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    created_at: "",
    addresses: [],
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  /* ---------------- FILTER & SORT ---------------- */
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  /* ---------------- PAGINATION ---------------- */
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const loadData = async () => {
    try {
      await fetchCustomerById(id);
    } catch (err) {
      console.log("Error while fetching :", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    if (selectedCustomer) {
      // Map addresses safely
      const convertApiAddress =
        selectedCustomer.addresses?.map((itm) => ({
          id: itm.id,
          full_name: itm.full_name,
          phone: itm.phone,
          email: itm.email,
          address_line1: itm.address_line1,
          address_line2: itm.address_line2,
          city: itm.city,
          pincode: itm.pincode,
          is_default: itm.is_default,
        })) || [];

      // Set the form with the new data
      setForm({
        id: selectedCustomer.id || "",
        first_name: selectedCustomer.first_name || "",
        last_name: selectedCustomer.last_name || "",
        email: selectedCustomer.email || "",
        phone: selectedCustomer.phone || "",
        role: selectedCustomer.role || "",
        created_at: selectedCustomer.created_at || "",
        addresses: convertApiAddress,
      });
    }
  }, [selectedCustomer]);

  const filteredOrders = useMemo(() => {
    let data = [...orders];

    if (statusFilter !== "all") {
      data = data.filter((o) => o.status === statusFilter);
    }

    data.sort((a, b) => {
      if (sortBy === "date_desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date_asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amount_desc") return b.amount - a.amount;
      if (sortBy === "amount_asc") return a.amount - b.amount;
      return 0;
    });

    return data;
  }, [orders, statusFilter, sortBy]);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  /* ---------------- ACTIONS ---------------- */
  const handleSave = () => {
    console.log("Updated customer:", form);
    setEditMode(false);
  };

  const handleDelete = () => {
    if (!confirm("Delete this customer?")) return;
    console.log("Deleted customer:", id);
    navigate("/admin/customers");
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleOrderView = () => {
    console.log("Order View Button Clicked");
    //  navigate(`/admin/orders/${o.id}`)
  };
  ///////////////// Loading /////////////
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-500">Fetching customer dossier...</p>
      </div>
    );
  }
  ///////////////// Error /////////////
  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-50 rounded-xl">
        Error: {error}
      </div>
    );
  }
  ///////////////// No Customer Found /////////////
  if (!selectedCustomer && !loading) {
    return (
      <div className="p-6 text-gray-500">No customer found with ID: {id}</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <AdminHeaderWrapper
          title={`Customer #${id}`}
          description="Complete customer information"
          breadcrumb={[
            { label: "Customers", to: "/admin/customers" },
            { label: id },
          ]}
        />
        {/* <div>
          <h1 className="text-2xl font-bold">Customer Details</h1>
          <p className="text-gray-500">View / Edit customer</p>
        </div> */}
        {/* <div className="flex gap-3">
          {!editMode ? (
            <button
                onClick={() => setEditMode(true)}
              className="border px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Pencil size={16} /> Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
          )}
          <button
            onClick={handleDelete}
            className="border border-red-500 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div> */}
      </div>

      {/* BASIC INFO */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {["first_name", "last_name", "email", "phone"].map((field) => (
            <div key={field}>
              <label className="text-sm text-gray-500 capitalize">
                {field.replace("_", " ")}
              </label>
              {editMode ? (
                <input
                  value={form[field]}
                  onChange={(e) => update(field, e.target.value)}
                  className="mt-1 w-full p-3 border-2 rounded-xl"
                />
              ) : (
                <p className="mt-2 font-medium">{form[field]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ADDRESSES */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Addresses</h2>
        {form.addresses?.length === 0 ? (
          <p className="text-gray-500">No addresses available</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {form.addresses.map((addr) => (
              <div
                key={addr.id}
                className="border-3 rounded-xl p-4 border-[var(--color-border-color)]"
              >
                <p className="font-medium">{addr.full_name}</p>
                <p className="text-sm">
                  {addr.phone} - {addr.email}
                </p>
                <p className="text-sm text-gray-600">
                  {addr.address_line1}, {addr.address_line2}
                </p>
                <p className="text-sm text-gray-600">
                  {addr.city} - {addr.pincode}
                </p>
                {addr.is_default && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ORDER HISTORY */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Order History</h2>

        {/* Filters */}
        {/* <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="p-2 border-2 rounded-xl focus:ring-2 focus:ring-primary-light bg-white focus:outline-none border-[var(--color-border-color)]"
          >
            <option value="all">All Status</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={sortBy}
            onChange={handleSortChange}
            className="p-2 border-2 rounded-xl focus:ring-2 focus:ring-primary-light bg-white focus:outline-none border-[var(--color-border-color)]"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Amount High → Low</option>
            <option value="amount_asc">Amount Low → High</option>
          </select>
        </div> */}

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-3">{o.id}</td>
                  <td className="p-3">{o.date}</td>
                  <td className="p-3">₹{o.amount}</td>
                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs
                          ${
                            o.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : o.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3">{o.payment}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleOrderView(o)}
                      className="text-primary underline text-sm cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <Pagination
          totalItems={filteredOrders.length}
          currentPage={currentPage}
          perPage={perPage}
          onPageChange={setCurrentPage} // Pass the setter function
          onPerPageChange={setPerPage} // pass the setter function
        />
      </div>
      {/* CART ORDER HISTORY */}
      <OrderCartSection
        cartData={cartItems}
        onViewVariant={(id) => navigate(`/admin/products/variants/${id}`)}
      />
    </div>
  );
}
